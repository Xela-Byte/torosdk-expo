"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWallet = createWallet;
exports.importWallet = importWallet;
exports.verifyWalletPassword = verifyWalletPassword;
exports.getBalanceForCurrency = getBalanceForCurrency;
exports.getBalances = getBalances;
exports.makeTransfer = makeTransfer;
exports.resolveTNS = resolveTNS;
exports.lookupTNS = lookupTNS;
exports.setTNS = setTNS;
exports.getKYCStatus = getKYCStatus;
exports.submitKYC = submitKYC;
exports.getExchangeRates = getExchangeRates;
exports.bridgeToken = bridgeToken;
exports.getBridgeTokenFee = getBridgeTokenFee;
exports.getBridgeBalance = getBridgeBalance;
exports.getBridgeTokenBalance = getBridgeTokenBalance;
exports.getBridgeTransactions = getBridgeTransactions;
exports.getBridgeTokenTransactions = getBridgeTokenTransactions;
exports.createSolanaAddress = createSolanaAddress;
exports.createToronetSolanaAddress = createToronetSolanaAddress;
exports.isValidSolanaAddress = isValidSolanaAddress;
exports.transferSolana = transferSolana;
exports.transferSolToken = transferSolToken;
exports.getSolBalance = getSolBalance;
exports.getSolTokenBalance = getSolTokenBalance;
exports.getSolTransactions = getSolTransactions;
exports.getSolTokenTransactions = getSolTokenTransactions;
exports.getSwapQuote = getSwapQuote;
exports.executeSwap = executeSwap;
exports.verifyWalletPasswordOp = verifyWalletPasswordOp;
exports.getTransactions = getTransactions;
exports.getTransactionByHash = getTransactionByHash;
exports.getBlockchainInfo = getBlockchainInfo;
exports.checkIsAdmin = checkIsAdmin;
exports.checkIsSuperAdmin = checkIsSuperAdmin;
exports.addAdmin = addAdmin;
exports.removeAdmin = removeAdmin;
exports.getProject = getProject;
exports.getProduct = getProduct;
exports.createProduct = createProduct;
exports.isStorageOn = isStorageOn;
exports.setStorageOn = setStorageOn;
exports.setStorageOff = setStorageOff;
exports.getStorageVersion = getStorageVersion;
exports.createVirtualWallet = createVirtualWallet;
exports.fetchVirtualWallet = fetchVirtualWallet;
exports.fetchVirtualWalletByAddress = fetchVirtualWalletByAddress;
exports.getWalletKey = getWalletKey;
exports.deployContract = deployContract;
exports.getTokenBalance = getTokenBalance;
exports.getTokenMetadata = getTokenMetadata;
exports.freezeCurrencyAddress = freezeCurrencyAddress;
exports.unfreezeCurrencyAddress = unfreezeCurrencyAddress;
exports.mintCurrencyFunds = mintCurrencyFunds;
const torosdk = __importStar(require("@reactforge/sdk-adapter"));
const sdk_adapter_1 = require("@reactforge/sdk-adapter");
const storage_1 = require("./storage");
const auth_1 = require("./auth");
const errors_1 = require("./errors");
// --- Internal helpers ---
/**
 * Run the auth gate for a given operation.
 *
 * @throws {@link AuthBlockedError} if the registered {@link AuthStrategy} denies the operation.
 */
async function authorizeOperation(operation) {
    const auth = (0, auth_1.getAuthStrategy)();
    await auth.authorize(operation);
}
/**
 * Authorize the operation and resolve the stored wallet password.
 *
 * @remarks
 * This is the primary auth + password retrieval path for sensitive operations
 * (transfer, KYC, TNS writes). It verifies the auth gate AND that a password
 * is stored before any value leaves the device.
 *
 * @param address - The wallet address requiring a stored password.
 * @param operation - The operation being authorized.
 * @throws If the auth gate blocks, or no password is stored for the address.
 */
async function resolvePassword(address, operation) {
    await authorizeOperation(operation);
    const pwd = await (0, storage_1.getPassword)(address);
    if (!pwd) {
        throw new Error(`[@reactforge/react-native] No stored password for ${address}. Import or create a wallet first.`);
    }
    return pwd;
}
// --- Error wrapper ---
/**
 * Normalize an unknown error into a {@link ToroError} subclass.
 *
 * @param err - The original caught error.
 * @throws {@link NetworkError} | {@link APIError} — always throws, never returns.
 */
function wrapError(err) {
    if (err instanceof Error) {
        const msg = err.message;
        // Transport-level failures
        if (msg.includes('Network') ||
            msg.includes('fetch') ||
            msg.includes('timeout') ||
            msg.includes('AbortError')) {
            throw new errors_1.NetworkError(msg, err);
        }
        // Check for status/statusCode properties
        const withStatus = err;
        const status = withStatus.status ??
            withStatus.statusCode ??
            withStatus.details?.status ??
            withStatus.details?.statusCode ??
            withStatus.details?.response?.status;
        if (typeof status === 'number' && status >= 400) {
            throw new errors_1.APIError(msg, status, withStatus.data ?? withStatus.details ?? err);
        }
        // Try to extract an HTTP status from the message
        const statusMatch = msg.match(/\b(4\d\d|5\d\d)\b/);
        if (statusMatch) {
            throw new errors_1.APIError(msg, parseInt(statusMatch[1], 10), err);
        }
        throw new errors_1.NetworkError(msg, err);
    }
    throw new errors_1.NetworkError(String(err), err);
}
// --- Wallet operations ---
/**
 * Create a new wallet on the Toronet network.
 */
async function createWallet(username, password) {
    try {
        const address = await torosdk.createWallet(username, password);
        await (0, storage_1.setPassword)(address, password);
        return address;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Import an existing wallet using a private key and password.
 */
async function importWallet(privateKey, password) {
    try {
        const address = await torosdk.importWalletFromPrivateKeyAndPassword(privateKey, password);
        await (0, storage_1.setPassword)(address, password);
        return address;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Verify that a password matches the stored credential for a wallet.
 */
async function verifyWalletPassword(address, password) {
    try {
        const result = await torosdk.verifyWalletPassword(address, password);
        return Boolean(result);
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Balance ---
/**
 * Fetch the balance of a single currency for a wallet address.
 */
async function getBalanceForCurrency(address, currency) {
    try {
        await authorizeOperation('balance');
        const raw = await torosdk.getCurrencyBalance(currency, address);
        const balance = raw && typeof raw === 'object' && 'balance' in raw
            ? String(raw.balance ?? '0')
            : String(raw ?? '0');
        return { balance, currency };
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Fetch all six supported currency balances in parallel.
 */
async function getBalances(address) {
    try {
        await authorizeOperation('balance');
        const currencies = [
            sdk_adapter_1.Currency.Naira,
            sdk_adapter_1.Currency.Dollar,
            sdk_adapter_1.Currency.Kenyan_Shilling,
            sdk_adapter_1.Currency.South_African_Rand,
            sdk_adapter_1.Currency.Pound,
            sdk_adapter_1.Currency.Euro,
        ];
        const results = await Promise.all(currencies.map(async (currency) => {
            try {
                const raw = await torosdk.getCurrencyBalance(currency, address);
                const balance = raw && typeof raw === 'object' && 'balance' in raw
                    ? String(raw.balance ?? '0')
                    : String(raw ?? '0');
                return { balance, currency };
            }
            catch {
                return { balance: '0', currency };
            }
        }));
        return results;
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Transfers ---
/**
 * Execute an inter-wallet transfer on the Toronet network.
 */
async function makeTransfer(senderAddress, receiverAddress, amount, currency) {
    try {
        const pwd = await resolvePassword(senderAddress, 'transfer');
        const result = await torosdk.transferCurrencyFunds(currency, senderAddress, pwd, receiverAddress, amount);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
// --- TNS ---
/**
 * Resolve a Toronet Name Service (TNS) name to a wallet address.
 */
async function resolveTNS(name) {
    try {
        const res = await torosdk.resolveTNS(name);
        return res ?? '';
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Reverse-lookup a wallet address to its registered TNS name.
 */
async function lookupTNS(address) {
    try {
        const result = await torosdk.lookupTNS(address);
        return result ?? null;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Register or update a TNS name for a wallet address.
 */
async function setTNS(address, name) {
    try {
        const pwd = await resolvePassword(address, 'tns-write');
        await torosdk.registerTNS(address, pwd, name);
    }
    catch (err) {
        wrapError(err);
    }
}
// --- KYC ---
/**
 * Check the KYC verification status for a wallet address.
 */
async function getKYCStatus(address) {
    try {
        const verified = await torosdk.checkKYCStatus(address);
        return { verified: Boolean(verified) };
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Submit KYC data for a wallet address.
 */
async function submitKYC(address, customerData) {
    try {
        const pwd = await resolvePassword(address, 'kyc');
        const result = await torosdk.performKYC({ address, password: pwd, ...customerData });
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Exchange rates ---
/**
 * Fetch current exchange rates for all supported asset pairs.
 */
async function getExchangeRates() {
    try {
        await authorizeOperation('exchange-rates');
        const rates = await torosdk.getExchangeRates();
        if (Array.isArray(rates)) {
            return rates.map((r) => ({
                pair: r.pair ?? (r.from && r.to ? `${r.from}/${r.to}` : 'UNKNOWN'),
                rate: Number(r.rate ?? 0),
            }));
        }
        if (rates && typeof rates === 'object') {
            return Object.entries(rates).map(([pair, rate]) => ({
                pair,
                rate: Number(rate),
            }));
        }
        return [];
    }
    catch (err) {
        wrapError(err);
    }
}
async function bridgeToken(params) {
    try {
        const pwd = await resolvePassword(params.from, 'bridge');
        return await torosdk.bridgeToken(params.network, {
            from: params.from,
            pwd,
            network: params.network,
            contractaddress: params.contractAddress,
            tokenname: params.tokenName,
            amount: params.amount,
        }, params.admin?.address, params.admin?.password);
    }
    catch (err) {
        wrapError(err);
    }
}
async function getBridgeTokenFee(params) {
    try {
        await authorizeOperation('bridge-read');
        return await torosdk.getBridgeFeeEstimate(params.network, {
            network: params.network,
            contractaddress: params.contractAddress,
            amount: params.amount,
        });
    }
    catch (err) {
        wrapError(err);
    }
}
async function getBridgeBalance(params) {
    try {
        await authorizeOperation('bridge-read');
        return await torosdk.getBridgeChainBalance(params.network, {
            address: params.address,
        });
    }
    catch (err) {
        wrapError(err);
    }
}
async function getBridgeTokenBalance(params) {
    try {
        await authorizeOperation('bridge-read');
        return await torosdk.getBridgeChainTokenBalance(params.network, {
            address: params.address,
            contractaddress: params.contractAddress,
            tokenname: params.tokenName,
        });
    }
    catch (err) {
        wrapError(err);
    }
}
async function getBridgeTransactions(params) {
    try {
        await authorizeOperation('bridge-read');
        const txs = await torosdk.getBridgeChainTransactions(params.network, {
            address: params.address,
        });
        return { transactions: txs };
    }
    catch (err) {
        wrapError(err);
    }
}
async function getBridgeTokenTransactions(params) {
    try {
        await authorizeOperation('bridge-read');
        const txs = await torosdk.getBridgeChainTokenTransactions(params.network, {
            address: params.address,
            contractaddress: params.contractAddress,
        });
        return { transactions: txs };
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Solana ---
async function createSolanaAddress(admin) {
    try {
        await authorizeOperation('wallet-create');
        const addr = await torosdk.createSolanaAddress(admin?.address, admin?.password);
        if (typeof addr === 'object' && addr !== null) {
            return addr;
        }
        return { address: addr, result: true };
    }
    catch (err) {
        wrapError(err);
    }
}
async function createToronetSolanaAddress(address) {
    try {
        const pwd = await resolvePassword(address, 'wallet-create');
        const solAddr = await torosdk.createToronetSolanaAddress(address, pwd);
        if (typeof solAddr === 'object' && solAddr !== null) {
            return solAddr;
        }
        return { address: solAddr, result: true };
    }
    catch (err) {
        wrapError(err);
    }
}
async function isValidSolanaAddress(address) {
    try {
        const valid = await torosdk.isValidSolanaAddress(address);
        return { result: valid, valid };
    }
    catch (err) {
        wrapError(err);
    }
}
async function transferSolana(params) {
    try {
        const pwd = await resolvePassword(params.from, 'solana-transfer');
        return await torosdk.transferSolana({
            from: params.from,
            to: params.to,
            amount: params.amount,
            pwd,
        }, params.admin?.address, params.admin?.password);
    }
    catch (err) {
        wrapError(err);
    }
}
async function transferSolToken(params) {
    try {
        const pwd = await resolvePassword(params.from, 'solana-transfer');
        return await torosdk.transferSolToken({
            from: params.from,
            to: params.to,
            amount: params.amount,
            pwd,
            contractaddress: params.contractAddress,
            tokenname: params.tokenName,
            usetokenasfees: params.useTokenAsFees,
        }, params.admin?.address, params.admin?.password);
    }
    catch (err) {
        wrapError(err);
    }
}
async function getSolBalance(params) {
    try {
        await authorizeOperation('solana-read');
        const balance = await torosdk.getSolBalance(params.address);
        return typeof balance === 'object' && balance !== null ? balance : { balance: String(balance) };
    }
    catch (err) {
        wrapError(err);
    }
}
async function getSolTokenBalance(params) {
    try {
        await authorizeOperation('solana-read');
        const balance = await torosdk.getSolTokenBalance(params.address, params.contractAddress);
        return typeof balance === 'object' && balance !== null ? balance : { balance: String(balance) };
    }
    catch (err) {
        wrapError(err);
    }
}
async function getSolTransactions(params) {
    try {
        await authorizeOperation('solana-read');
        const txs = await torosdk.getSolTransactions(params.address);
        return { transactions: txs };
    }
    catch (err) {
        wrapError(err);
    }
}
async function getSolTokenTransactions(params) {
    try {
        await authorizeOperation('solana-read');
        const txs = await torosdk.getSolTokenTransactions(params.address, params.contractAddress);
        return { transactions: txs };
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Swap ---
async function getSwapQuote(params) {
    try {
        await authorizeOperation('swap-read');
        return await torosdk.getSwapQuote(params);
    }
    catch (err) {
        wrapError(err);
    }
}
async function executeSwap(params) {
    try {
        const pwd = await resolvePassword(params.client, 'swap');
        return await torosdk.swapCurrency({
            fromCurrency: params.fromCurrency,
            toCurrency: params.toCurrency,
            amount: params.amount,
            client: params.client,
            clientPassword: pwd,
        });
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Verify wallet password ---
/**
 * Verify that a given password matches the stored credential for a wallet.
 */
async function verifyWalletPasswordOp(address, password) {
    try {
        await authorizeOperation('wallet-verify');
        const result = await torosdk.verifyWalletPassword(address, password);
        return Boolean(result);
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Transactions ---
/**
 * Fetch the transaction history for a wallet address on the Toronet chain.
 */
async function getTransactions(address) {
    try {
        await authorizeOperation('read');
        const txs = await torosdk.getTransactions(address);
        return { transactions: txs };
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Fetch a single transaction by its hash on the Toronet chain.
 */
async function getTransactionByHash(hash) {
    try {
        await authorizeOperation('read');
        const tx = await torosdk.getTransactionByHash(hash);
        return tx;
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Blockchain info ---
/**
 * Fetch general Toronet blockchain information (block count, etc.).
 */
async function getBlockchainInfo() {
    try {
        await authorizeOperation('read');
        const info = await torosdk.getBlockchainInfo();
        return info;
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Roles ---
/**
 * Check whether an address is an admin on the Toronet network.
 */
async function checkIsAdmin(address) {
    try {
        await authorizeOperation('read');
        return await torosdk.isAdmin(address);
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Check whether an address is a super-admin.
 */
async function checkIsSuperAdmin(address) {
    try {
        await authorizeOperation('read');
        return await torosdk.isSuperAdmin(address);
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Add an admin address (requires super-admin credentials).
 */
async function addAdmin(superAdminAddress, superAdminPassword, adminAddress) {
    try {
        await authorizeOperation('admin');
        const result = await torosdk.addAdmin(superAdminAddress, superAdminPassword, adminAddress);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Remove an admin address (requires super-admin credentials).
 */
async function removeAdmin(superAdminAddress, superAdminPassword, adminAddress) {
    try {
        await authorizeOperation('admin');
        const result = await torosdk.removeAdmin(superAdminAddress, superAdminPassword, adminAddress);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Products ---
/**
 * Fetch the project details (all products) for an admin address.
 */
async function getProject(admin, getbalances = true) {
    try {
        await authorizeOperation('read');
        const result = await torosdk.getProject(admin, getbalances);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Fetch a single product by ID.
 */
async function getProduct(productId, admin, adminpwd) {
    try {
        await authorizeOperation('read');
        const result = await torosdk.getProduct(productId, admin, adminpwd);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Create a new product record.
 */
async function createProduct(input) {
    try {
        await authorizeOperation('admin');
        const result = await torosdk.createProduct(input);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Storage (chain-level) ---
/**
 * Check whether chain storage is currently enabled.
 */
async function isStorageOn() {
    try {
        await authorizeOperation('read');
        const result = await torosdk.isStorageOn();
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Enable chain storage (owner operation).
 */
async function setStorageOn(address, password) {
    try {
        await authorizeOperation('admin');
        const result = await torosdk.setStorageOn(address, password);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Disable chain storage (owner operation).
 */
async function setStorageOff(address, password) {
    try {
        await authorizeOperation('admin');
        const result = await torosdk.setStorageOff(address, password);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Get the chain storage version.
 */
async function getStorageVersion() {
    try {
        await authorizeOperation('read');
        const result = await torosdk.getStorageVersion();
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Virtual Wallet ---
/**
 * Create a new virtual wallet linked to a Toronet address.
 */
async function createVirtualWallet(input) {
    try {
        await authorizeOperation('wallet-create');
        const result = await torosdk.createVirtualWallet(input);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Fetch a virtual wallet by its virtual wallet ID.
 */
async function fetchVirtualWallet(virtualwallet, admin, adminpwd) {
    try {
        await authorizeOperation('read');
        const result = await torosdk.fetchVirtualWallet(virtualwallet, admin, adminpwd);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Fetch a virtual wallet by the underlying Toronet address.
 */
async function fetchVirtualWalletByAddress(address, admin, adminpwd) {
    try {
        await authorizeOperation('read');
        const result = await torosdk.fetchVirtualWalletByAddress(address, admin, adminpwd);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Keystore ---
/**
 * Retrieve the wallet key data for a given address.
 */
async function getWalletKey(address) {
    try {
        await authorizeOperation('read');
        const result = await torosdk.getWalletKey(address);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Deployer ---
/**
 * Deploy a smart contract to the Toronet network.
 */
async function deployContract(input) {
    try {
        await authorizeOperation('admin');
        const result = await torosdk.deployContract(input);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Token (ERC-20 / Toronet token) ---
/**
 * Fetch the native Toronet token balance for a wallet address.
 */
async function getTokenBalance(address) {
    try {
        await authorizeOperation('balance');
        return await torosdk.getTokenBalance(address);
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Fetch extended token metadata (name, symbol, decimals, allowance, fees, etc.).
 */
async function getTokenMetadata() {
    try {
        await authorizeOperation('read');
        return await torosdk.getTokenMetadata();
    }
    catch (err) {
        wrapError(err);
    }
}
// --- Currency Admin ---
/**
 * Freeze a currency address (currency admin operation).
 */
async function freezeCurrencyAddress(params) {
    try {
        await authorizeOperation('admin');
        const result = await torosdk.freezeCurrencyAddress(params);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Unfreeze a currency address (currency admin operation).
 */
async function unfreezeCurrencyAddress(params) {
    try {
        await authorizeOperation('admin');
        const result = await torosdk.unfreezeCurrencyAddress(params);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
/**
 * Mint currency tokens (currency admin operation).
 */
async function mintCurrencyFunds(params) {
    try {
        await authorizeOperation('admin');
        const result = await torosdk.mintCurrencyFunds(params);
        return result;
    }
    catch (err) {
        wrapError(err);
    }
}
//# sourceMappingURL=sdk.js.map