import * as torosdk from 'torosdk';
import { Currency } from 'torosdk';
import { getPassword, setPassword } from './storage';
import { getAuthStrategy } from './auth';
import type { OperationCategory } from './types';
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
    const balance = await torosdk.getCurrencyBalance({ currency, address });
    return { balance: String(balance), currency };
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
          const balance = await torosdk.getCurrencyBalance({ currency, address });
          return { balance: String(balance), currency };
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
