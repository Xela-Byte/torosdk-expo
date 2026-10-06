import {
  Currency,
  getCurrencyBalance as sdkGetCurrencyBalance,
  transferCurrency as sdkTransferCurrency,
  allowTransfer as sdkAllowTransfer,
  disallowTransfer as sdkDisableTransfer,
  freezeAddress as sdkFreezeAddress,
  unfreezeAddress as sdkUnfreezeAddress,
  enrollAddress as sdkEnrollAddress,
  mintCurrency as sdkMintCurrency,
  burnCurrency as sdkBurnCurrency,
} from 'torosdk';
import { normalizeError } from './errors';

export { Currency };

// ── Types ──────────────────────────────────────────────────────────────────

export type SupportedCurrency = 'NGN' | 'USD' | 'EUR' | 'GBP' | 'KSH' | 'ZAR';

export interface CurrencyAdminParams {
  currency: SupportedCurrency;
  address: string;
  admin: string;
  adminpwd: string;
  targetAddress: string;
}

export interface CurrencyMintParams extends CurrencyAdminParams {
  amount: string;
}

// ── Currency Queries ──────────────────────────────────────────────────────

export const getCurrencyBalance = async (currency: SupportedCurrency, address: string): Promise<string> => {
  try {
    const result = await sdkGetCurrencyBalance({ currency, address });
    return result?.toString() || '0';
  } catch (error) {
    throw normalizeError(error, 'getCurrencyBalance');
  }
};

// ── Client Operations ─────────────────────────────────────────────────────

export const transferCurrencyFunds = async (
  currency: SupportedCurrency,
  senderAddr: string,
  senderPwd: string,
  receiverAddr: string,
  amount: string
): Promise<any> => {
  try {
    return await sdkTransferCurrency({ currency, senderAddr, senderPwd, receiverAddr, amount });
  } catch (error) {
    throw normalizeError(error, 'transferCurrencyFunds');
  }
};

// ── Owner Operations ──────────────────────────────────────────────────────

export const allowCurrencyTransfer = async (currency: SupportedCurrency, address: string, password: string): Promise<any> => {
  try {
    return await sdkAllowTransfer({ currency, address, password });
  } catch (error) {
    throw normalizeError(error, 'allowCurrencyTransfer');
  }
};

export const disableCurrencyTransfer = async (currency: SupportedCurrency, address: string, password: string): Promise<any> => {
  try {
    return await sdkDisableTransfer({ currency, address, password });
  } catch (error) {
    throw normalizeError(error, 'disableCurrencyTransfer');
  }
};

// ── Admin Operations ──────────────────────────────────────────────────────

export const freezeCurrencyAddress = async (params: CurrencyAdminParams): Promise<any> => {
  try {
    return await sdkFreezeAddress(params);
  } catch (error) {
    throw normalizeError(error, 'freezeCurrencyAddress');
  }
};

export const unfreezeCurrencyAddress = async (params: CurrencyAdminParams): Promise<any> => {
  try {
    return await sdkUnfreezeAddress(params);
  } catch (error) {
    throw normalizeError(error, 'unfreezeCurrencyAddress');
  }
};

export const enrollCurrencyAddress = async (params: CurrencyAdminParams): Promise<any> => {
  try {
    return await sdkEnrollAddress(params);
  } catch (error) {
    throw normalizeError(error, 'enrollCurrencyAddress');
  }
};

export const mintCurrencyFunds = async (params: CurrencyMintParams): Promise<any> => {
  try {
    return await sdkMintCurrency(params);
  } catch (error) {
    throw normalizeError(error, 'mintCurrencyFunds');
  }
};

export const burnCurrencyFunds = async (params: CurrencyMintParams): Promise<any> => {
  try {
    return await sdkBurnCurrency(params);
  } catch (error) {
    throw normalizeError(error, 'burnCurrencyFunds');
  }
};
