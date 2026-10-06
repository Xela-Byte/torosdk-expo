import { Currency, BridgeNetwork } from '@reactforge/sdk-adapter';
import type { SwapRateOutput } from '@reactforge/sdk-adapter';
import type { ToroRawResult, AdminCredentials } from './types';
/**
 * Create a new wallet on the Toronet network.
 */
export declare function createWallet(username: string, password: string): Promise<string>;
/**
 * Import an existing wallet using a private key and password.
 */
export declare function importWallet(privateKey: string, password: string): Promise<string>;
/**
 * Verify that a password matches the stored credential for a wallet.
 */
export declare function verifyWalletPassword(address: string, password: string): Promise<boolean>;
/**
 * Fetch the balance of a single currency for a wallet address.
 */
export declare function getBalanceForCurrency(address: string, currency: Currency): Promise<{
    balance: string;
    currency: Currency;
}>;
/**
 * Fetch all six supported currency balances in parallel.
 */
export declare function getBalances(address: string): Promise<Array<{
    balance: string;
    currency: Currency;
}>>;
/**
 * Execute an inter-wallet transfer on the Toronet network.
 */
export declare function makeTransfer(senderAddress: string, receiverAddress: string, amount: string, currency: Currency): Promise<{
    transactionHash?: string;
    reference?: string;
}>;
/**
 * Resolve a Toronet Name Service (TNS) name to a wallet address.
 */
export declare function resolveTNS(name: string): Promise<string>;
/**
 * Reverse-lookup a wallet address to its registered TNS name.
 */
export declare function lookupTNS(address: string): Promise<string | null>;
/**
 * Register or update a TNS name for a wallet address.
 */
export declare function setTNS(address: string, name: string): Promise<void>;
/**
 * Check the KYC verification status for a wallet address.
 */
export declare function getKYCStatus(address: string): Promise<{
    verified: boolean;
    details?: unknown;
}>;
/**
 * Submit KYC data for a wallet address.
 */
export declare function submitKYC(address: string, customerData: Record<string, unknown>): Promise<unknown>;
/**
 * Fetch current exchange rates for all supported asset pairs.
 */
export declare function getExchangeRates(): Promise<Array<{
    pair: string;
    rate: number;
}>>;
export interface BridgeTokenParams {
    from: string;
    network: BridgeNetwork | string;
    contractAddress: string;
    tokenName: string;
    amount: string;
    admin?: AdminCredentials;
}
export declare function bridgeToken(params: BridgeTokenParams): Promise<ToroRawResult>;
export declare function getBridgeTokenFee(params: {
    network: BridgeNetwork | string;
    contractAddress: string;
    amount: string;
}): Promise<ToroRawResult>;
export declare function getBridgeBalance(params: {
    address: string;
    network: BridgeNetwork | string;
}): Promise<ToroRawResult>;
export declare function getBridgeTokenBalance(params: {
    address: string;
    network: BridgeNetwork | string;
    contractAddress: string;
    tokenName?: string;
}): Promise<ToroRawResult>;
export declare function getBridgeTransactions(params: {
    address: string;
    network: BridgeNetwork | string;
}): Promise<ToroRawResult>;
export declare function getBridgeTokenTransactions(params: {
    address: string;
    network: BridgeNetwork | string;
    contractAddress: string;
    tokenName?: string;
}): Promise<ToroRawResult>;
export declare function createSolanaAddress(admin?: AdminCredentials): Promise<ToroRawResult>;
export declare function createToronetSolanaAddress(address: string): Promise<ToroRawResult>;
export declare function isValidSolanaAddress(address: string): Promise<ToroRawResult>;
export declare function transferSolana(params: {
    from: string;
    to: string;
    amount: string;
    admin?: AdminCredentials;
}): Promise<ToroRawResult>;
export declare function transferSolToken(params: {
    from: string;
    to: string;
    amount: string;
    contractAddress: string;
    tokenName: string;
    useTokenAsFees?: string;
    admin?: AdminCredentials;
}): Promise<ToroRawResult>;
export declare function getSolBalance(params: {
    address: string;
    network?: BridgeNetwork | string;
}): Promise<ToroRawResult>;
export declare function getSolTokenBalance(params: {
    address: string;
    contractAddress: string;
    tokenName?: string;
    network?: BridgeNetwork | string;
}): Promise<ToroRawResult>;
export declare function getSolTransactions(params: {
    address: string;
    network?: BridgeNetwork | string;
}): Promise<ToroRawResult>;
export declare function getSolTokenTransactions(params: {
    address: string;
    contractAddress: string;
    tokenName?: string;
    network?: BridgeNetwork | string;
}): Promise<ToroRawResult>;
export declare function getSwapQuote(params: {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
}): Promise<SwapRateOutput>;
export declare function executeSwap(params: {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    client: string;
}): Promise<ToroRawResult>;
/**
 * Verify that a given password matches the stored credential for a wallet.
 */
export declare function verifyWalletPasswordOp(address: string, password: string): Promise<boolean>;
/**
 * Fetch the transaction history for a wallet address on the Toronet chain.
 */
export declare function getTransactions(address: string): Promise<ToroRawResult>;
/**
 * Fetch a single transaction by its hash on the Toronet chain.
 */
export declare function getTransactionByHash(hash: string): Promise<ToroRawResult>;
/**
 * Fetch general Toronet blockchain information (block count, etc.).
 */
export declare function getBlockchainInfo(): Promise<ToroRawResult>;
/**
 * Check whether an address is an admin on the Toronet network.
 */
export declare function checkIsAdmin(address: string): Promise<boolean>;
/**
 * Check whether an address is a super-admin.
 */
export declare function checkIsSuperAdmin(address: string): Promise<boolean>;
/**
 * Add an admin address (requires super-admin credentials).
 */
export declare function addAdmin(superAdminAddress: string, superAdminPassword: string, adminAddress: string): Promise<ToroRawResult>;
/**
 * Remove an admin address (requires super-admin credentials).
 */
export declare function removeAdmin(superAdminAddress: string, superAdminPassword: string, adminAddress: string): Promise<ToroRawResult>;
/**
 * Fetch the project details (all products) for an admin address.
 */
export declare function getProject(admin: string, getbalances?: boolean): Promise<ToroRawResult>;
/**
 * Fetch a single product by ID.
 */
export declare function getProduct(productId: string, admin: string, adminpwd: string): Promise<ToroRawResult>;
/**
 * Create a new product record.
 */
export declare function createProduct(input: {
    productId: string;
    productName: string;
    description: string;
    productImage: string;
    admin: string;
    adminpwd: string;
}): Promise<ToroRawResult>;
/**
 * Check whether chain storage is currently enabled.
 */
export declare function isStorageOn(): Promise<ToroRawResult>;
/**
 * Enable chain storage (owner operation).
 */
export declare function setStorageOn(address: string, password: string): Promise<ToroRawResult>;
/**
 * Disable chain storage (owner operation).
 */
export declare function setStorageOff(address: string, password: string): Promise<ToroRawResult>;
/**
 * Get the chain storage version.
 */
export declare function getStorageVersion(): Promise<ToroRawResult>;
/**
 * Create a new virtual wallet linked to a Toronet address.
 */
export declare function createVirtualWallet(input: {
    address: string;
    payername: string;
    currency: string;
    admin: string;
    adminpwd: string;
}): Promise<ToroRawResult>;
/**
 * Fetch a virtual wallet by its virtual wallet ID.
 */
export declare function fetchVirtualWallet(virtualwallet: string, admin: string, adminpwd: string): Promise<ToroRawResult>;
/**
 * Fetch a virtual wallet by the underlying Toronet address.
 */
export declare function fetchVirtualWalletByAddress(address: string, admin: string, adminpwd: string): Promise<ToroRawResult>;
/**
 * Retrieve the wallet key data for a given address.
 */
export declare function getWalletKey(address: string): Promise<ToroRawResult>;
/**
 * Deploy a smart contract to the Toronet network.
 */
export declare function deployContract(input: {
    abi: any[];
    bytecode: string;
    constructorArgs?: any[];
    owner?: string;
    token?: string;
    network?: 'testnet' | 'mainnet';
}): Promise<ToroRawResult>;
/**
 * Fetch the native Toronet token balance for a wallet address.
 */
export declare function getTokenBalance(address: string): Promise<string>;
/**
 * Fetch extended token metadata (name, symbol, decimals, allowance, fees, etc.).
 */
export declare function getTokenMetadata(): Promise<{
    name: string;
    symbol: string;
    decimals: number;
}>;
/**
 * Freeze a currency address (currency admin operation).
 */
export declare function freezeCurrencyAddress(params: {
    currency: string;
    address: string;
    admin: string;
    adminpwd: string;
    targetAddress: string;
}): Promise<ToroRawResult>;
/**
 * Unfreeze a currency address (currency admin operation).
 */
export declare function unfreezeCurrencyAddress(params: {
    currency: string;
    address: string;
    admin: string;
    adminpwd: string;
    targetAddress: string;
}): Promise<ToroRawResult>;
/**
 * Mint currency tokens (currency admin operation).
 */
export declare function mintCurrencyFunds(params: {
    currency: string;
    address: string;
    admin: string;
    adminpwd: string;
    targetAddress: string;
    amount: string;
}): Promise<ToroRawResult>;
//# sourceMappingURL=sdk.d.ts.map