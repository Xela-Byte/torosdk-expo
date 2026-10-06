import * as torosdk from '@reactforge/sdk-adapter';
import { Currency, BridgeNetwork } from '@reactforge/sdk-adapter';
import type { SwapRateOutput } from '@reactforge/sdk-adapter';
import { getPassword, setPassword } from './storage';
import { getAuthStrategy } from './auth';
import type { OperationCategory, ToroRawResult, AdminCredentials } from './types';
import { NetworkError, APIError } from './errors';

// --- Internal helpers ---

/**
 * Run the auth gate for a given operation.
 *
 * @throws {@link AuthBlockedError} if the registered {@link AuthStrategy} denies the operation.
 */
async function authorizeOperation(operation: OperationCategory): Promise<void> {
  const auth = getAuthStrategy();
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
async function resolvePassword(
  address: string,
  operation: OperationCategory
): Promise<string> {
  await authorizeOperation(operation);
  const pwd = await getPassword(address);
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
function wrapError(err: unknown): never {
  if (err instanceof Error) {
    const msg = err.message;

    // Transport-level failures
    if (
      msg.includes('Network') ||
      msg.includes('fetch') ||
      msg.includes('timeout') ||
      msg.includes('AbortError')
    ) {
      throw new NetworkError(msg, err);
    }

    // Check for status/statusCode properties
    const withStatus = err as {
      status?: number;
      statusCode?: number;
      data?: unknown;
      details?: any;
    };
    const status =
      withStatus.status ??
      withStatus.statusCode ??
      withStatus.details?.status ??
      withStatus.details?.statusCode ??
      withStatus.details?.response?.status;
    if (typeof status === 'number' && status >= 400) {
      throw new APIError(msg, status, withStatus.data ?? withStatus.details ?? err);
    }

    // Try to extract an HTTP status from the message
    const statusMatch = msg.match(/\b(4\d\d|5\d\d)\b/);
    if (statusMatch) {
      throw new APIError(msg, parseInt(statusMatch[1], 10), err);
    }

    throw new NetworkError(msg, err);
  }
  throw new NetworkError(String(err), err);
}

// --- Wallet operations ---

/**
 * Create a new wallet on the Toronet network.
 */
export async function createWallet(
  username: string,
  password: string
): Promise<string> {
  try {
    const address = await torosdk.createWallet(username, password);
    await setPassword(address, password);
    return address;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Import an existing wallet using a private key and password.
 */
export async function importWallet(
  privateKey: string,
  password: string
): Promise<string> {
  try {
    const address = await torosdk.importWalletFromPrivateKeyAndPassword(privateKey, password);
    await setPassword(address, password);
    return address;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Verify that a password matches the stored credential for a wallet.
 */
export async function verifyWalletPassword(
  address: string,
  password: string
): Promise<boolean> {
  try {
    const result = await torosdk.verifyWalletPassword(address, password);
    return Boolean(result);
  } catch (err) {
    wrapError(err);
  }
}

// --- Balance ---

/**
 * Fetch the balance of a single currency for a wallet address.
 */
export async function getBalanceForCurrency(
  address: string,
  currency: Currency
): Promise<{ balance: string; currency: Currency }> {
  try {
    await authorizeOperation('balance');
    const raw = await torosdk.getCurrencyBalance(currency as any, address);
    const balance =
      raw && typeof raw === 'object' && 'balance' in raw
        ? String((raw as { balance: unknown }).balance ?? '0')
        : String(raw ?? '0');
    return { balance, currency };
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch all six supported currency balances in parallel.
 */
export async function getBalances(
  address: string
): Promise<Array<{ balance: string; currency: Currency }>> {
  try {
    await authorizeOperation('balance');
    const currencies: Currency[] = [
      Currency.Naira,
      Currency.Dollar,
      Currency.Kenyan_Shilling,
      Currency.South_African_Rand,
      Currency.Pound,
      Currency.Euro,
    ];
    const results = await Promise.all(
      currencies.map(async (currency) => {
        try {
          const raw = await torosdk.getCurrencyBalance(currency as any, address);
          const balance =
            raw && typeof raw === 'object' && 'balance' in raw
              ? String((raw as { balance: unknown }).balance ?? '0')
              : String(raw ?? '0');
          return { balance, currency };
        } catch {
          return { balance: '0', currency };
        }
      })
    );
    return results;
  } catch (err) {
    wrapError(err);
  }
}

// --- Transfers ---

/**
 * Execute an inter-wallet transfer on the Toronet network.
 */
export async function makeTransfer(
  senderAddress: string,
  receiverAddress: string,
  amount: string,
  currency: Currency
): Promise<{ transactionHash?: string; reference?: string }> {
  try {
    const pwd = await resolvePassword(senderAddress, 'transfer');
    const result = await torosdk.transferCurrencyFunds(
      currency as any,
      senderAddress,
      pwd,
      receiverAddress,
      amount
    );
    return result as { transactionHash?: string; reference?: string };
  } catch (err) {
    wrapError(err);
  }
}

// --- TNS ---

/**
 * Resolve a Toronet Name Service (TNS) name to a wallet address.
 */
export async function resolveTNS(name: string): Promise<string> {
  try {
    const res = await torosdk.resolveTNS(name);
    return res ?? '';
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Reverse-lookup a wallet address to its registered TNS name.
 */
export async function lookupTNS(address: string): Promise<string | null> {
  try {
    const result = await torosdk.lookupTNS(address);
    return result ?? null;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Register or update a TNS name for a wallet address.
 */
export async function setTNS(
  address: string,
  name: string
): Promise<void> {
  try {
    const pwd = await resolvePassword(address, 'tns-write');
    await torosdk.registerTNS(address, pwd, name);
  } catch (err) {
    wrapError(err);
  }
}

// --- KYC ---

/**
 * Check the KYC verification status for a wallet address.
 */
export async function getKYCStatus(
  address: string
): Promise<{ verified: boolean; details?: unknown }> {
  try {
    const verified = await torosdk.checkKYCStatus(address);
    return { verified: Boolean(verified) };
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Submit KYC data for a wallet address.
 */
export async function submitKYC(
  address: string,
  customerData: Record<string, unknown>
): Promise<unknown> {
  try {
    const pwd = await resolvePassword(address, 'kyc');
    const result = await torosdk.performKYC({ address, password: pwd, ...customerData } as any);
    return result;
  } catch (err) {
    wrapError(err);
  }
}

// --- Exchange rates ---

/**
 * Fetch current exchange rates for all supported asset pairs.
 */
export async function getExchangeRates(): Promise<
  Array<{ pair: string; rate: number }>
> {
  try {
    await authorizeOperation('exchange-rates');
    const rates: any = await torosdk.getExchangeRates();
    if (Array.isArray(rates)) {
      return rates.map((r: any) => ({
        pair: r.pair ?? (r.from && r.to ? `${r.from}/${r.to}` : 'UNKNOWN'),
        rate: Number(r.rate ?? 0),
      }));
    }
    if (rates && typeof rates === 'object') {
      return Object.entries(rates as Record<string, number>).map(([pair, rate]) => ({
        pair,
        rate: Number(rate),
      }));
    }
    return [];
  } catch (err) {
    wrapError(err);
  }
}

// --- Bridge (cross-chain) ---

export interface BridgeTokenParams {
  from: string;
  network: BridgeNetwork | string;
  contractAddress: string;
  tokenName: string;
  amount: string;
  admin?: AdminCredentials;
}

export async function bridgeToken(params: BridgeTokenParams): Promise<ToroRawResult> {
  try {
    const pwd = await resolvePassword(params.from, 'bridge');
    return await torosdk.bridgeToken(
      params.network as BridgeNetwork,
      {
        from: params.from,
        pwd,
        network: params.network as BridgeNetwork,
        contractaddress: params.contractAddress,
        tokenname: params.tokenName,
        amount: params.amount,
      },
      params.admin?.address,
      params.admin?.password
    );
  } catch (err) {
    wrapError(err);
  }
}

export async function getBridgeTokenFee(params: {
  network: BridgeNetwork | string;
  contractAddress: string;
  amount: string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('bridge-read');
    return await torosdk.getBridgeFeeEstimate(params.network as BridgeNetwork, {
      network: params.network as BridgeNetwork,
      contractaddress: params.contractAddress,
      amount: params.amount,
    });
  } catch (err) {
    wrapError(err);
  }
}

export async function getBridgeBalance(params: {
  address: string;
  network: BridgeNetwork | string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('bridge-read');
    return await torosdk.getBridgeChainBalance(params.network as BridgeNetwork, {
      address: params.address,
    });
  } catch (err) {
    wrapError(err);
  }
}

export async function getBridgeTokenBalance(params: {
  address: string;
  network: BridgeNetwork | string;
  contractAddress: string;
  tokenName?: string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('bridge-read');
    return await torosdk.getBridgeChainTokenBalance(params.network as BridgeNetwork, {
      address: params.address,
      contractaddress: params.contractAddress,
      tokenname: params.tokenName,
    });
  } catch (err) {
    wrapError(err);
  }
}

export async function getBridgeTransactions(params: {
  address: string;
  network: BridgeNetwork | string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('bridge-read');
    const txs = await torosdk.getBridgeChainTransactions(params.network as BridgeNetwork, {
      address: params.address,
    });
    return { transactions: txs };
  } catch (err) {
    wrapError(err);
  }
}

export async function getBridgeTokenTransactions(params: {
  address: string;
  network: BridgeNetwork | string;
  contractAddress: string;
  tokenName?: string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('bridge-read');
    const txs = await torosdk.getBridgeChainTokenTransactions(params.network as BridgeNetwork, {
      address: params.address,
      contractaddress: params.contractAddress,
    });
    return { transactions: txs };
  } catch (err) {
    wrapError(err);
  }
}

// --- Solana ---

export async function createSolanaAddress(admin?: AdminCredentials): Promise<ToroRawResult> {
  try {
    await authorizeOperation('wallet-create');
    const addr = await torosdk.createSolanaAddress(admin?.address, admin?.password);
    if (typeof addr === 'object' && addr !== null) {
      return addr as ToroRawResult;
    }
    return { address: addr, result: true };
  } catch (err) {
    wrapError(err);
  }
}

export async function createToronetSolanaAddress(address: string): Promise<ToroRawResult> {
  try {
    const pwd = await resolvePassword(address, 'wallet-create');
    const solAddr = await torosdk.createToronetSolanaAddress(address, pwd);
    if (typeof solAddr === 'object' && solAddr !== null) {
      return solAddr as ToroRawResult;
    }
    return { address: solAddr, result: true };
  } catch (err) {
    wrapError(err);
  }
}

export async function isValidSolanaAddress(address: string): Promise<ToroRawResult> {
  try {
    const valid = await torosdk.isValidSolanaAddress(address);
    return { result: valid, valid };
  } catch (err) {
    wrapError(err);
  }
}

export async function transferSolana(params: {
  from: string;
  to: string;
  amount: string;
  admin?: AdminCredentials;
}): Promise<ToroRawResult> {
  try {
    const pwd = await resolvePassword(params.from, 'solana-transfer');
    return await torosdk.transferSolana(
      {
        from: params.from,
        to: params.to,
        amount: params.amount,
        pwd,
      },
      params.admin?.address,
      params.admin?.password
    );
  } catch (err) {
    wrapError(err);
  }
}

export async function transferSolToken(params: {
  from: string;
  to: string;
  amount: string;
  contractAddress: string;
  tokenName: string;
  useTokenAsFees?: string;
  admin?: AdminCredentials;
}): Promise<ToroRawResult> {
  try {
    const pwd = await resolvePassword(params.from, 'solana-transfer');
    return await torosdk.transferSolToken(
      {
        from: params.from,
        to: params.to,
        amount: params.amount,
        pwd,
        contractaddress: params.contractAddress,
        tokenname: params.tokenName,
        usetokenasfees: params.useTokenAsFees,
      },
      params.admin?.address,
      params.admin?.password
    );
  } catch (err) {
    wrapError(err);
  }
}


export async function getSolBalance(params: {
  address: string;
  network?: BridgeNetwork | string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('solana-read');
    const balance = await torosdk.getSolBalance(params.address);
    return typeof balance === 'object' && balance !== null ? balance : { balance: String(balance) };
  } catch (err) {
    wrapError(err);
  }
}

export async function getSolTokenBalance(params: {
  address: string;
  contractAddress: string;
  tokenName?: string;
  network?: BridgeNetwork | string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('solana-read');
    const balance = await torosdk.getSolTokenBalance(params.address, params.contractAddress);
    return typeof balance === 'object' && balance !== null ? balance : { balance: String(balance) };
  } catch (err) {
    wrapError(err);
  }
}

export async function getSolTransactions(params: {
  address: string;
  network?: BridgeNetwork | string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('solana-read');
    const txs = await torosdk.getSolTransactions(params.address);
    return { transactions: txs };
  } catch (err) {
    wrapError(err);
  }
}

export async function getSolTokenTransactions(params: {
  address: string;
  contractAddress: string;
  tokenName?: string;
  network?: BridgeNetwork | string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('solana-read');
    const txs = await torosdk.getSolTokenTransactions(params.address, params.contractAddress);
    return { transactions: txs };
  } catch (err) {
    wrapError(err);
  }
}

// --- Swap ---

export async function getSwapQuote(params: {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}): Promise<SwapRateOutput> {
  try {
    await authorizeOperation('swap-read');
    return await torosdk.getSwapQuote(params);
  } catch (err) {
    wrapError(err);
  }
}

export async function executeSwap(params: {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  client: string;
}): Promise<ToroRawResult> {
  try {
    const pwd = await resolvePassword(params.client, 'swap');
    return await torosdk.swapCurrency({
      fromCurrency: params.fromCurrency,
      toCurrency: params.toCurrency,
      amount: params.amount,
      client: params.client,
      clientPassword: pwd,
    });
  } catch (err) {
    wrapError(err);
  }
}

// --- Verify wallet password ---

/**
 * Verify that a given password matches the stored credential for a wallet.
 */
export async function verifyWalletPasswordOp(
  address: string,
  password: string
): Promise<boolean> {
  try {
    await authorizeOperation('wallet-verify');
    const result = await torosdk.verifyWalletPassword(address, password);
    return Boolean(result);
  } catch (err) {
    wrapError(err);
  }
}

// --- Transactions ---

/**
 * Fetch the transaction history for a wallet address on the Toronet chain.
 */
export async function getTransactions(address: string): Promise<ToroRawResult> {
  try {
    await authorizeOperation('read');
    const txs = await torosdk.getTransactions(address);
    return { transactions: txs };
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch a single transaction by its hash on the Toronet chain.
 */
export async function getTransactionByHash(hash: string): Promise<ToroRawResult> {
  try {
    await authorizeOperation('read');
    const tx = await torosdk.getTransactionByHash(hash);
    return tx as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

// --- Blockchain info ---

/**
 * Fetch general Toronet blockchain information (block count, etc.).
 */
export async function getBlockchainInfo(): Promise<ToroRawResult> {
  try {
    await authorizeOperation('read');
    const info = await torosdk.getBlockchainInfo();
    return info as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

// --- Roles ---

/**
 * Check whether an address is an admin on the Toronet network.
 */
export async function checkIsAdmin(address: string): Promise<boolean> {
  try {
    await authorizeOperation('read');
    return await torosdk.isAdmin(address);
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Check whether an address is a super-admin.
 */
export async function checkIsSuperAdmin(address: string): Promise<boolean> {
  try {
    await authorizeOperation('read');
    return await torosdk.isSuperAdmin(address);
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Add an admin address (requires super-admin credentials).
 */
export async function addAdmin(
  superAdminAddress: string,
  superAdminPassword: string,
  adminAddress: string
): Promise<ToroRawResult> {
  try {
    await authorizeOperation('admin');
    const result = await torosdk.addAdmin(superAdminAddress, superAdminPassword, adminAddress);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Remove an admin address (requires super-admin credentials).
 */
export async function removeAdmin(
  superAdminAddress: string,
  superAdminPassword: string,
  adminAddress: string
): Promise<ToroRawResult> {
  try {
    await authorizeOperation('admin');
    const result = await torosdk.removeAdmin(superAdminAddress, superAdminPassword, adminAddress);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

// --- Products ---

/**
 * Fetch the project details (all products) for an admin address.
 */
export async function getProject(admin: string, getbalances = true): Promise<ToroRawResult> {
  try {
    await authorizeOperation('read');
    const result = await torosdk.getProject(admin, getbalances);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch a single product by ID.
 */
export async function getProduct(
  productId: string,
  admin: string,
  adminpwd: string
): Promise<ToroRawResult> {
  try {
    await authorizeOperation('read');
    const result = await torosdk.getProduct(productId, admin, adminpwd);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Create a new product record.
 */
export async function createProduct(input: {
  productId: string;
  productName: string;
  description: string;
  productImage: string;
  admin: string;
  adminpwd: string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('admin');
    const result = await torosdk.createProduct(input);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

// --- Storage (chain-level) ---

/**
 * Check whether chain storage is currently enabled.
 */
export async function isStorageOn(): Promise<ToroRawResult> {
  try {
    await authorizeOperation('read');
    const result = await torosdk.isStorageOn();
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Enable chain storage (owner operation).
 */
export async function setStorageOn(address: string, password: string): Promise<ToroRawResult> {
  try {
    await authorizeOperation('admin');
    const result = await torosdk.setStorageOn(address, password);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Disable chain storage (owner operation).
 */
export async function setStorageOff(address: string, password: string): Promise<ToroRawResult> {
  try {
    await authorizeOperation('admin');
    const result = await torosdk.setStorageOff(address, password);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Get the chain storage version.
 */
export async function getStorageVersion(): Promise<ToroRawResult> {
  try {
    await authorizeOperation('read');
    const result = await torosdk.getStorageVersion();
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

// --- Virtual Wallet ---

/**
 * Create a new virtual wallet linked to a Toronet address.
 */
export async function createVirtualWallet(input: {
  address: string;
  payername: string;
  currency: string;
  admin: string;
  adminpwd: string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('wallet-create');
    const result = await torosdk.createVirtualWallet(input);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch a virtual wallet by its virtual wallet ID.
 */
export async function fetchVirtualWallet(
  virtualwallet: string,
  admin: string,
  adminpwd: string
): Promise<ToroRawResult> {
  try {
    await authorizeOperation('read');
    const result = await torosdk.fetchVirtualWallet(virtualwallet, admin, adminpwd);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch a virtual wallet by the underlying Toronet address.
 */
export async function fetchVirtualWalletByAddress(
  address: string,
  admin: string,
  adminpwd: string
): Promise<ToroRawResult> {
  try {
    await authorizeOperation('read');
    const result = await torosdk.fetchVirtualWalletByAddress(address, admin, adminpwd);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

// --- Keystore ---

/**
 * Retrieve the wallet key data for a given address.
 */
export async function getWalletKey(address: string): Promise<ToroRawResult> {
  try {
    await authorizeOperation('read');
    const result = await torosdk.getWalletKey(address);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

// --- Deployer ---

/**
 * Deploy a smart contract to the Toronet network.
 */
export async function deployContract(input: {
  abi: any[];
  bytecode: string;
  constructorArgs?: any[];
  owner?: string;
  token?: string;
  network?: 'testnet' | 'mainnet';
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('admin');
    const result = await torosdk.deployContract(input);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

// --- Token (ERC-20 / Toronet token) ---

/**
 * Fetch the native Toronet token balance for a wallet address.
 */
export async function getTokenBalance(address: string): Promise<string> {
  try {
    await authorizeOperation('balance');
    return await torosdk.getTokenBalance(address);
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch extended token metadata (name, symbol, decimals, allowance, fees, etc.).
 */
export async function getTokenMetadata(): Promise<{ name: string; symbol: string; decimals: number }> {
  try {
    await authorizeOperation('read');
    return await torosdk.getTokenMetadata();
  } catch (err) {
    wrapError(err);
  }
}

// --- Currency Admin ---

/**
 * Freeze a currency address (currency admin operation).
 */
export async function freezeCurrencyAddress(params: {
  currency: string;
  address: string;
  admin: string;
  adminpwd: string;
  targetAddress: string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('admin');
    const result = await torosdk.freezeCurrencyAddress(params as any);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Unfreeze a currency address (currency admin operation).
 */
export async function unfreezeCurrencyAddress(params: {
  currency: string;
  address: string;
  admin: string;
  adminpwd: string;
  targetAddress: string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('admin');
    const result = await torosdk.unfreezeCurrencyAddress(params as any);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Mint currency tokens (currency admin operation).
 */
export async function mintCurrencyFunds(params: {
  currency: string;
  address: string;
  admin: string;
  adminpwd: string;
  targetAddress: string;
  amount: string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('admin');
    const result = await torosdk.mintCurrencyFunds(params as any);
    return result as ToroRawResult;
  } catch (err) {
    wrapError(err);
  }
}

