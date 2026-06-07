import * as torosdk from 'torosdk';
import { Currency } from 'torosdk';
import { getPassword, setPassword } from './storage';
import { getAuthStrategy } from './auth';
import type { OperationCategory } from './types';
import { NetworkError, APIError } from './errors';

// --- Internal helpers ---

/** Run the auth gate for a given operation (throws if unauthorized). */
async function authorizeOperation(operation: OperationCategory): Promise<void> {
  const auth = getAuthStrategy();
  await auth.authorize(operation);
}

/** Authorize, then retrieve the stored wallet password. Throws if not found. */
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

function wrapError(err: unknown): never {
  if (err instanceof Error) {
    const msg = err.message;
    if (msg.includes('Network Error') || msg.includes('timeout')) {
      throw new NetworkError(msg, err);
    }
    // axios errors often have a response property
    const axiosErr = err as { response?: { status?: number; data?: unknown } };
    if (axiosErr.response) {
      throw new APIError(
        msg,
        axiosErr.response.status,
        axiosErr.response.data
      );
    }
    throw new NetworkError(msg, err);
  }
  throw new NetworkError(String(err), err);
}

// --- Wallet operations ---

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

export async function resolveTNS(name: string): Promise<string> {
  try {
    const result = await torosdk.getAddr({ name });
    return result;
  } catch (err) {
    wrapError(err);
  }
}

export async function lookupTNS(address: string): Promise<string | null> {
  try {
    const result = await torosdk.getName({ address });
    return result ?? null;
  } catch (err) {
    wrapError(err);
  }
}

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

export async function submitKYC(
  address: string,
  customerData: Record<string, unknown>
): Promise<unknown> {
  try {
    const pwd = await resolvePassword(address, 'kyc');
    const result = await torosdk.performKYCForCustomer({ address, ...customerData, password: pwd } as any);
    return result;
  } catch (err) {
    wrapError(err);
  }
}

// --- Exchange rates ---

export async function getExchangeRates(): Promise<
  Array<{ pair: string; rate: number }>
> {
  try {
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
