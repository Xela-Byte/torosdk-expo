import * as torosdk from 'torosdk';
import { Currency, BridgeNetwork } from 'torosdk';
import type { SwapRateOutput } from 'torosdk';
import { getPassword, setPassword } from './storage';
import { getAuthStrategy } from './auth';
import type { OperationCategory, ToroRawResult } from './types';
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
    throw new Error(`[torosdk-expo] No stored password for ${address}. Import or create a wallet first.`);
  }
  return pwd;
}

// --- Error wrapper ---

/**
 * Normalize an unknown error into a {@link ToroError} subclass.
 *
 * @remarks
 * torosdk uses native `fetch` under the hood. This wrapper first checks for
 * transport-level failures (network down, timeout, DNS failure), then looks for
 * application-level HTTP errors (4xx/5xx) by inspecting `status`/`statusCode`
 * properties and falling back to pattern-matching the error message. Anything
 * that cannot be classified is wrapped as a {@link NetworkError}.
 *
 * @param err - The original caught error.
 * @throws {@link NetworkError} | {@link APIError} — always throws, never returns.
 */
function wrapError(err: unknown): never {
  if (err instanceof Error) {
    const msg = err.message;

    // Transport-level failures (fetch throws TypeError for these)
    if (
      msg.includes('Network') ||
      msg.includes('fetch') ||
      msg.includes('timeout') ||
      msg.includes('AbortError')
    ) {
      throw new NetworkError(msg, err);
    }

    // Check for status/statusCode properties (common in fetch wrappers)
    const withStatus = err as { status?: number; statusCode?: number; data?: unknown };
    const status = withStatus.status ?? withStatus.statusCode;
    if (typeof status === 'number' && status >= 400) {
      throw new APIError(msg, status, withStatus.data ?? err);
    }

    // Try to extract an HTTP status from the message (e.g. "HTTP 400", "status 503")
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
 *
 * @remarks
 * The returned address is automatically persisted to SecureStore
 * (along with the password). Call {@link addWalletToList} separately if you
 * want the address to appear in the wallet list.
 *
 * @param username - Human-readable username associated with the wallet.
 * @param password - Wallet encryption password.
 * @returns The new wallet's on-chain address.
 * @throws {@link NetworkError} | {@link APIError} on failure.
 */
export async function createWallet(
  username: string,
  password: string
): Promise<string> {
  try {
    const address = await torosdk.createWallet({ username, password });
    // Persist the password so subsequent operations (transfer, TNS, KYC) work.
    await setPassword(address, password);
    return address;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Import an existing wallet using a private key and password.
 *
 * @remarks
 * The returned address is automatically persisted to SecureStore
 * (along with the password). The private key is **not** persisted locally —
 * only the password is stored for future auth.
 *
 * @param privateKey - The wallet's private key (hex string).
 * @param password - Wallet decryption password.
 * @returns The imported wallet's on-chain address.
 * @throws {@link NetworkError} | {@link APIError} on failure.
 */
export async function importWallet(
  privateKey: string,
  password: string
): Promise<string> {
  try {
    const result: unknown = await torosdk.importWalletFromPrivateKeyAndPassword({ pvKey: privateKey, password });
    const address = typeof result === 'string' ? result : String(result);
    // Persist the password so subsequent operations (transfer, TNS, KYC) work.
    await setPassword(address, password);
    return address;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Verify that a password matches the stored credential for a wallet.
 *
 * @param address - The wallet address to check.
 * @param password - The password to verify.
 * @returns `true` if the password is correct.
 * @throws {@link NetworkError} | {@link APIError} on network failure.
 */
export async function verifyWalletPassword(
  address: string,
  password: string
): Promise<boolean> {
  try {
    const result = await torosdk.verifyWalletPassword({ address, password });
    return Boolean(result);
  } catch (err) {
    wrapError(err);
  }
}

// --- Balance ---

/**
 * Fetch the balance of a single currency for a wallet address.
 *
 * @remarks
 * This operation passes through the `'balance'` auth gate.
 *
 * @param address - The wallet address to query.
 * @param currency - The {@link Currency} to fetch (e.g. `Currency.Naira`).
 * @returns An object with `balance` (string) and `currency`.
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 */
export async function getBalanceForCurrency(
  address: string,
  currency: Currency
): Promise<{ balance: string; currency: Currency }> {
  try {
    await authorizeOperation('balance');
    const raw = await torosdk.getCurrencyBalance({ currency, address });
    // API returns { result, balance, error } — extract the balance field
    const balance =
      raw && typeof raw === 'object' && 'balance' in raw
        ? String((raw as { balance: unknown }).balance ?? '0')
        : String(raw);
    return { balance, currency };
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch all six supported currency balances in parallel.
 *
 * @remarks
 * Uses `Promise.all` to fetch Naira, Dollar, Kenyan Shilling, South African Rand,
 * Pound, and Euro simultaneously. Individual fetch failures fall back to `"0"`.
 *
 * @param address - The wallet address to query.
 * @returns Array of `{ balance, currency }` objects (one per supported currency).
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
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
          const raw = await torosdk.getCurrencyBalance({ currency, address });
          // API returns { result, balance, error } — extract the balance field
          const balance =
            raw && typeof raw === 'object' && 'balance' in raw
              ? String((raw as { balance: unknown }).balance ?? '0')
              : String(raw);
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
 *
 * @remarks
 * This is a **sensitive operation** — it requires auth gating (`'transfer'`)
 * AND a stored wallet password. Both are resolved via {@link resolvePassword}.
 *
 * @param senderAddress - The sending wallet address.
 * @param receiverAddress - The receiving wallet address.
 * @param amount - Transfer amount as a decimal string (e.g. `"100.50"`).
 * @param currency - The currency to transfer.
 * @returns Object with `transactionHash` and/or `reference`.
 * @throws {@link AuthBlockedError} if auth is denied or no password is stored.
 * @throws {@link NetworkError} | {@link APIError} on network failure.
 */
export async function makeTransfer(
  senderAddress: string,
  receiverAddress: string,
  amount: string,
  currency: Currency
): Promise<{ transactionHash?: string; reference?: string }> {
  try {
    const pwd = await resolvePassword(senderAddress, 'transfer');
    const result = await torosdk.makeInterWalletTransfer(
      senderAddress,
      pwd,
      receiverAddress,
      amount,
      currency
    );
    return result as { transactionHash?: string; reference?: string };
  } catch (err) {
    wrapError(err);
  }
}

// --- TNS ---

/**
 * Resolve a Toronet Name Service (TNS) name to a wallet address.
 *
 * @param name - The TNS name to resolve (e.g. `"alice.toro"`).
 * @returns The corresponding wallet address.
 * @throws {@link NetworkError} | {@link APIError} on failure.
 */
export async function resolveTNS(name: string): Promise<string> {
  try {
    const result = await torosdk.getAddr({ name });
    return result;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Reverse-lookup a wallet address to its registered TNS name.
 *
 * @param address - The wallet address to look up.
 * @returns The registered TNS name, or `null` if none is configured.
 * @throws {@link NetworkError} | {@link APIError} on failure.
 */
export async function lookupTNS(address: string): Promise<string | null> {
  try {
    const result = await torosdk.getName({ address });
    return result ?? null;
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Register or update a TNS name for a wallet address.
 *
 * @remarks
 * This is a **sensitive operation** — it requires auth gating (`'tns-write'`)
 * AND a stored wallet password.
 *
 * @param address - The wallet address to associate with the name.
 * @param name - The desired TNS name.
 * @throws {@link AuthBlockedError} if auth is denied or no password is stored.
 * @throws {@link NetworkError} | {@link APIError} on network failure.
 */
export async function setTNS(
  address: string,
  name: string
): Promise<void> {
  try {
    const pwd = await resolvePassword(address, 'tns-write');
    await torosdk.configureTNS({ address, password: pwd, username: name });
  } catch (err) {
    wrapError(err);
  }
}

// --- KYC ---

/**
 * Check the KYC verification status for a wallet address.
 *
 * @param address - The wallet address to check.
 * @returns Object with `verified` boolean and optional `details`.
 * @throws {@link NetworkError} | {@link APIError} on failure.
 */
export async function getKYCStatus(
  address: string
): Promise<{ verified: boolean; details?: unknown }> {
  try {
    const result = await torosdk.isAddressKYCVerified({ address });
    return { verified: Boolean(result?.verified ?? result) };
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Submit KYC data for a wallet address.
 *
 * @remarks
 * This is a **sensitive operation** — it requires auth gating (`'kyc'`)
 * AND a stored wallet password.
 *
 * @param address - The wallet address to verify.
 * @param customerData - KYC fields (name, DOB, nationality, etc.).
 * @returns The KYC submission result from the API.
 * @throws {@link AuthBlockedError} if auth is denied or no password is stored.
 * @throws {@link NetworkError} | {@link APIError} on network failure.
 */
export async function submitKYC(
  address: string,
  customerData: Record<string, unknown>
): Promise<unknown> {
  try {
    const pwd = await resolvePassword(address, 'kyc');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- torosdk parameter type is opaque; Record<string, unknown> cannot satisfy it without a cast
    const result = await torosdk.performKYCForCustomer({ address, ...customerData, password: pwd } as any);
    return result;
  } catch (err) {
    wrapError(err);
  }
}

// --- Exchange rates ---

/**
 * Fetch current exchange rates for all supported asset pairs.
 *
 * @remarks
 * The API may return an array of pair/rate objects or a record keyed by pair.
 * This function normalizes both shapes into a uniform array.
 *
 * @returns Array of `{ pair, rate }` objects.
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 */
export async function getExchangeRates(): Promise<
  Array<{ pair: string; rate: number }>
> {
  try {
    await authorizeOperation('exchange-rates');
    const result = await torosdk.getSupportedAssetsExchangeRates();
    if (Array.isArray(result)) return result as Array<{ pair: string; rate: number }>;
    // Result might be a record — normalize to array
    if (result && typeof result === 'object') {
      return Object.entries(result as Record<string, number>).map(([pair, rate]) => ({
        pair,
        rate,
      }));
    }
    return [];
  } catch (err) {
    wrapError(err);
  }
}

// --- Bridge (cross-chain) ---

/**
 * Parameters for a cross-chain token bridge operation.
 *
 * @property from - The Toronet wallet address initiating the bridge.
 * @property network - Destination chain ({@link BridgeNetwork} or its string code).
 * @property contractAddress - The token contract address on the target chain.
 * @property tokenName - The token symbol/name being bridged.
 * @property amount - Amount to bridge, as a decimal string.
 */
export interface BridgeTokenParams {
  from: string;
  network: BridgeNetwork | string;
  contractAddress: string;
  tokenName: string;
  amount: string;
}

/**
 * Bridge tokens from Toronet to another chain (Solana, Base, Polygon, BSC,
 * Arbitrum, Ethereum).
 *
 * @remarks
 * This is a **sensitive operation** — it requires auth gating (`'bridge'`)
 * AND the sender's stored wallet password, both resolved via
 * {@link resolvePassword}. The destination chain is selected with
 * {@link BridgeNetwork}.
 *
 * @param params - The {@link BridgeTokenParams} describing the bridge.
 * @returns The raw bridge result from the Toronet API.
 * @throws {@link AuthBlockedError} if auth is denied or no password is stored.
 * @throws {@link NetworkError} | {@link APIError} on network failure.
 *
 * @example
 * ```ts
 * await bridgeToken({
 *   from: '0xSender',
 *   network: BridgeNetwork.Base,
 *   contractAddress: '0xToken',
 *   tokenName: 'USDC',
 *   amount: '25',
 * });
 * ```
 */
export async function bridgeToken(params: BridgeTokenParams): Promise<ToroRawResult> {
  try {
    const pwd = await resolvePassword(params.from, 'bridge');
    return await torosdk.bridgeTokenFromChain(params.network, {
      from: params.from,
      pwd,
      network: params.network,
      contractaddress: params.contractAddress,
      tokenname: params.tokenName,
      amount: params.amount,
    });
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Estimate the fee for bridging a token to a given chain.
 *
 * @remarks
 * Read-only — passes through the `'bridge-read'` auth gate.
 *
 * @param params - Target `network`, token `contractAddress`, and `amount`.
 * @returns The raw fee-estimate result from the Toronet API.
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 */
export async function getBridgeTokenFee(params: {
  network: BridgeNetwork | string;
  contractAddress: string;
  amount: string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('bridge-read');
    return await torosdk.getBridgeTokenFeeEstimate(params.network, {
      network: params.network,
      contractaddress: params.contractAddress,
      amount: params.amount,
    });
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch the native-asset balance of an address on a bridged chain.
 *
 * @remarks
 * Read-only — passes through the `'bridge-read'` auth gate.
 *
 * @param params - The `address` to query and target `network`.
 * @returns The raw balance result from the Toronet API.
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 */
export async function getBridgeBalance(params: {
  address: string;
  network: BridgeNetwork | string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('bridge-read');
    return await torosdk.getBridgeBalance(params.network, {
      address: params.address,
      network: params.network,
    });
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch a token balance for an address on a bridged chain.
 *
 * @remarks
 * Read-only — passes through the `'bridge-read'` auth gate.
 *
 * @param params - `address`, target `network`, token `contractAddress`, and
 *   optional `tokenName`.
 * @returns The raw token-balance result from the Toronet API.
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 */
export async function getBridgeTokenBalance(params: {
  address: string;
  network: BridgeNetwork | string;
  contractAddress: string;
  tokenName?: string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('bridge-read');
    return await torosdk.getBridgeTokenBalance(params.network, {
      address: params.address,
      network: params.network,
      contractaddress: params.contractAddress,
      tokenname: params.tokenName,
    });
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch the native-asset transaction history for an address on a bridged chain.
 *
 * @remarks
 * Read-only — passes through the `'bridge-read'` auth gate.
 *
 * @param params - The `address` to query and target `network`.
 * @returns The raw transactions result from the Toronet API.
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 */
export async function getBridgeTransactions(params: {
  address: string;
  network: BridgeNetwork | string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('bridge-read');
    return await torosdk.getBridgeTransactions(params.network, {
      address: params.address,
      network: params.network,
    });
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch token transaction history for an address on a bridged chain.
 *
 * @remarks
 * Read-only — passes through the `'bridge-read'` auth gate.
 *
 * @param params - `address`, target `network`, token `contractAddress`, and
 *   optional `tokenName`.
 * @returns The raw token-transactions result from the Toronet API.
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 */
export async function getBridgeTokenTransactions(params: {
  address: string;
  network: BridgeNetwork | string;
  contractAddress: string;
  tokenName?: string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('bridge-read');
    return await torosdk.getBridgeTokenTransactions(params.network, {
      address: params.address,
      network: params.network,
      contractaddress: params.contractAddress,
      tokenname: params.tokenName,
    });
  } catch (err) {
    wrapError(err);
  }
}

// --- Solana ---

/**
 * Create a new standalone Solana address.
 *
 * @remarks
 * Passes through the `'wallet-create'` auth gate.
 *
 * @returns The raw creation result from the Toronet API (includes the new address).
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 */
export async function createSolanaAddress(): Promise<ToroRawResult> {
  try {
    await authorizeOperation('wallet-create');
    return await torosdk.createSolanaAddress();
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Create a Toronet-managed Solana address bound to an existing wallet.
 *
 * @remarks
 * **Sensitive** — requires auth gating (`'wallet-create'`) AND the wallet's
 * stored password, resolved via {@link resolvePassword}.
 *
 * @param address - The Toronet wallet address to bind the Solana address to.
 * @returns The raw creation result from the Toronet API.
 * @throws {@link AuthBlockedError} if auth is denied or no password is stored.
 * @throws {@link NetworkError} | {@link APIError} on network failure.
 */
export async function createToronetSolanaAddress(address: string): Promise<ToroRawResult> {
  try {
    const pwd = await resolvePassword(address, 'wallet-create');
    return await torosdk.createToronetSolanaAddress({ addr: address, pwd });
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Check whether a string is a valid Solana address.
 *
 * @param address - The address to validate.
 * @returns The raw validation result from the Toronet API.
 * @throws {@link NetworkError} | {@link APIError} on network failure.
 */
export async function isValidSolanaAddress(address: string): Promise<ToroRawResult> {
  try {
    return await torosdk.isValidSolanaAddress(address);
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Transfer native SOL between addresses.
 *
 * @remarks
 * **Sensitive** — requires auth gating (`'solana-transfer'`) AND the sender's
 * stored wallet password, resolved via {@link resolvePassword}.
 *
 * @param params - `from`, `to`, and `amount` (decimal string).
 * @returns The raw transfer result from the Toronet API.
 * @throws {@link AuthBlockedError} if auth is denied or no password is stored.
 * @throws {@link NetworkError} | {@link APIError} on network failure.
 */
export async function transferSolana(params: {
  from: string;
  to: string;
  amount: string;
}): Promise<ToroRawResult> {
  try {
    const pwd = await resolvePassword(params.from, 'solana-transfer');
    return await torosdk.transferSolana({
      from: params.from,
      to: params.to,
      amount: params.amount,
      pwd,
    });
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Transfer an SPL token on Solana.
 *
 * @remarks
 * **Sensitive** — requires auth gating (`'solana-transfer'`) AND the sender's
 * stored wallet password, resolved via {@link resolvePassword}.
 *
 * @param params - `from`, `to`, `amount`, token `contractAddress`, `tokenName`,
 *   and optional `useTokenAsFees` flag.
 * @returns The raw transfer result from the Toronet API.
 * @throws {@link AuthBlockedError} if auth is denied or no password is stored.
 * @throws {@link NetworkError} | {@link APIError} on network failure.
 */
export async function transferSolToken(params: {
  from: string;
  to: string;
  amount: string;
  contractAddress: string;
  tokenName: string;
  useTokenAsFees?: string;
}): Promise<ToroRawResult> {
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
    });
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch the native SOL balance for an address.
 *
 * @remarks
 * Read-only — passes through the `'solana-read'` auth gate.
 *
 * @param params - The `address` to query and optional `network`.
 * @returns The raw balance result from the Toronet API.
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 */
export async function getSolBalance(params: {
  address: string;
  network?: BridgeNetwork | string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('solana-read');
    return await torosdk.getSolBalance({ address: params.address, network: params.network });
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch an SPL token balance for an address.
 *
 * @remarks
 * Read-only — passes through the `'solana-read'` auth gate.
 *
 * @param params - `address`, token `contractAddress`, optional `tokenName` and `network`.
 * @returns The raw token-balance result from the Toronet API.
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 */
export async function getSolTokenBalance(params: {
  address: string;
  contractAddress: string;
  tokenName?: string;
  network?: BridgeNetwork | string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('solana-read');
    return await torosdk.getSolTokenBalance({
      address: params.address,
      contractaddress: params.contractAddress,
      tokenname: params.tokenName,
      network: params.network,
    });
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch native SOL transaction history for an address.
 *
 * @remarks
 * Read-only — passes through the `'solana-read'` auth gate.
 *
 * @param params - The `address` to query and optional `network`.
 * @returns The raw transactions result from the Toronet API.
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 */
export async function getSolTransactions(params: {
  address: string;
  network?: BridgeNetwork | string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('solana-read');
    return await torosdk.getSolTransactions({ address: params.address, network: params.network });
  } catch (err) {
    wrapError(err);
  }
}

/**
 * Fetch SPL token transaction history for an address.
 *
 * @remarks
 * Read-only — passes through the `'solana-read'` auth gate.
 *
 * @param params - `address`, token `contractAddress`, optional `tokenName` and `network`.
 * @returns The raw token-transactions result from the Toronet API.
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 */
export async function getSolTokenTransactions(params: {
  address: string;
  contractAddress: string;
  tokenName?: string;
  network?: BridgeNetwork | string;
}): Promise<ToroRawResult> {
  try {
    await authorizeOperation('solana-read');
    return await torosdk.getSolTokenTransactions({
      address: params.address,
      contractaddress: params.contractAddress,
      tokenname: params.tokenName,
      network: params.network,
    });
  } catch (err) {
    wrapError(err);
  }
}

// --- Swap ---

/**
 * Preview a currency swap — how much you'll receive and at what rate — before
 * executing.
 *
 * @remarks
 * Read-only — passes through the `'swap-read'` auth gate.
 *
 * @param params - `fromCurrency`, `toCurrency`, and `amount` (number).
 * @returns A typed {@link SwapRateOutput} with the converted amount and rate.
 * @throws {@link AuthBlockedError} | {@link NetworkError} | {@link APIError}
 *
 * @example
 * ```ts
 * const quote = await getSwapQuote({ fromCurrency: 'naira', toCurrency: 'dollar', amount: 1000 });
 * console.log(quote.convertedAmount, quote.rate);
 * ```
 */
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

/**
 * Execute a currency swap for a wallet.
 *
 * @remarks
 * **Sensitive** — requires auth gating (`'swap'`) AND the client wallet's
 * stored password, resolved via {@link resolvePassword}.
 *
 * @param params - `fromCurrency`, `toCurrency`, `amount` (number), and the
 *   `client` wallet address whose stored password authorizes the swap.
 * @returns The raw swap result from the Toronet API.
 * @throws {@link AuthBlockedError} if auth is denied or no password is stored.
 * @throws {@link NetworkError} | {@link APIError} on network failure.
 */
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
