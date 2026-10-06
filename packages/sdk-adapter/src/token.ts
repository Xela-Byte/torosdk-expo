import {
  getTokenBalance as sdkGetTokenBalance,
  getTokenName as sdkGetTokenName,
  getTokenSymbol as sdkGetTokenSymbol,
  getTokenDecimal as sdkGetTokenDecimal,
  getAllowance as sdkGetAllowance,
  getMinimumAllowance as sdkGetMinimumAllowance,
  getMaximumAllowance as sdkGetMaximumAllowance,
  getTransactionFee as sdkGetTransactionFee,
  isEnrolled as sdkIsEnrolled,
  isFrozen as sdkIsFrozen,
  getTotalCap as sdkGetTotalCap,
} from 'torosdk';
import { normalizeError } from './errors';

// ── Basic Token Queries ────────────────────────────────────────────────────

export const getTokenBalance = async (address: string): Promise<string> => {
  try {
    const rawBal = await sdkGetTokenBalance({ address });
    return rawBal?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, 'getTokenBalance');
  }
};

export const getTokenMetadata = async (): Promise<{ name: string; symbol: string; decimals: number }> => {
  try {
    const [name, symbol, decimals] = await Promise.all([
      sdkGetTokenName(),
      sdkGetTokenSymbol(),
      sdkGetTokenDecimal()
    ]);
    return { name, symbol, decimals: Number(decimals) };
  } catch (error) {
    throw normalizeError(error, 'getTokenMetadata');
  }
};

// ── Allowance Queries ─────────────────────────────────────────────────────

export const getTokenAllowance = async (owner: string, spender: string): Promise<string> => {
  try {
    const result = await sdkGetAllowance({ owner, spender });
    return result?.toString() || '0';
  } catch (error) {
    throw normalizeError(error, 'getTokenAllowance');
  }
};

export const getMinimumTokenAllowance = async (address: string): Promise<string> => {
  try {
    const result = await sdkGetMinimumAllowance({ address });
    return result?.toString() || '0';
  } catch (error) {
    throw normalizeError(error, 'getMinimumTokenAllowance');
  }
};

export const getMaximumTokenAllowance = async (address: string): Promise<string> => {
  try {
    const result = await sdkGetMaximumAllowance({ address });
    return result?.toString() || '0';
  } catch (error) {
    throw normalizeError(error, 'getMaximumTokenAllowance');
  }
};

// ── Fee Queries ───────────────────────────────────────────────────────────

export const getTokenTransactionFee = async (amount: string | number): Promise<string> => {
  try {
    const result = await sdkGetTransactionFee({ amount: String(amount) });
    return result?.toString() || '0';
  } catch (error) {
    throw normalizeError(error, 'getTokenTransactionFee');
  }
};

// ── Status Queries ────────────────────────────────────────────────────────

export const isTokenEnrolled = async (address: string): Promise<boolean> => {
  try {
    const result = await sdkIsEnrolled({ address });
    return Boolean(result?.isenrolled ?? result);
  } catch (error) {
    throw normalizeError(error, 'isTokenEnrolled');
  }
};

export const isTokenFrozen = async (address: string): Promise<boolean> => {
  try {
    const result = await sdkIsFrozen({ address });
    return Boolean(result?.isfrozen ?? result);
  } catch (error) {
    throw normalizeError(error, 'isTokenFrozen');
  }
};

// ── Supply Queries ────────────────────────────────────────────────────────

export const getTokenTotalCap = async (): Promise<string> => {
  try {
    const result = await sdkGetTotalCap();
    return result?.toString() || '0';
  } catch (error) {
    throw normalizeError(error, 'getTokenTotalCap');
  }
};
