import {
  depositFunds as sdkDepositFunds,
  confirmDeposit as sdkConfirmDeposit,
  performKYCForCustomer as sdkPerformKYC,
  isAddressKYCVerified as sdkIsKYCVerified,
  getBankListUSD as sdkGetBankListUSD,
  getBankListNGN as sdkGetBankListNGN,
  recordFiatWithdrawal as sdkRecordFiatWithdrawal,
  verifyBankAccountNameNGN as sdkVerifyBankAccountNGN,
  getFiatTransactionsAddressRange as sdkGetFiatTxRange,
  getFiatWithdrawalsAddressRange as sdkGetFiatWithdrawalsRange,
  paymentInitializeCrypto as sdkPaymentInitializeCrypto,
  recordCryptoPayment as sdkRecordCryptoPayment,
} from 'torosdk';
import { normalizeError } from './errors';

// ── Types ──────────────────────────────────────────────────────────────────

export interface DepositInput {
  userAddress: string;
  username: string;
  amount: string;
  currency: string;
  /** Admin credentials — route through your backend proxy in production */
  admin: string;
  adminpwd: string;
  extras?: {
    payeraddress?: string;
    payercity?: string;
    payerstate?: string;
    payercountry?: string;
    payerzipcode?: string;
    payerphone?: string;
    description?: string;
    success_url?: string;
    cancel_url?: string;
    paymenttype?: string;
    feetype?: string;
    exchange?: string;
    reusewallet?: string;
  };
}

export interface KYCInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  bvn: string;
  currency: string;
  phoneNumber: string;
  dob: string;
  address: string;
  admin: string;
  adminpwd: string;
}

export interface FiatWithdrawalInput {
  address: string;
  password: string;
  currency: string;
  token: string;
  payername: string;
  payeremail: string;
  description: string;
  amount: string;
  accounttype: string;
  bankname: string;
  routingno: string;
  accountno: string;
  accountname: string;
  admin: string;
  adminpwd: string;
}

export interface FiatTxRangeInput {
  address: string;
  startDate: string;
  endDate: string;
  currency: string;
  admin: string;
  adminpwd: string;
}

export interface CryptoPaymentInput {
  address: string;
  pwd: string;
  currency: string;
  token: string;
  amount: string;
  paymenttype?: string;
  admin: string;
  adminpwd: string;
}

// ── Fiat Deposits ─────────────────────────────────────────────────────────

export const initiateDeposit = async (input: DepositInput): Promise<any> => {
  try {
    return await sdkDepositFunds(
      {
        userAddress: input.userAddress,
        username: input.username,
        amount: input.amount,
        currency: input.currency as any,
        admin: input.admin,
        adminpwd: input.adminpwd,
      },
      input.extras
    );
  } catch (error) {
    throw normalizeError(error, 'initiateDeposit');
  }
};

export const confirmFiatDeposit = async (currency: string, transactionId: string): Promise<boolean> => {
  try {
    return await sdkConfirmDeposit({ currency, transactionId });
  } catch (error) {
    throw normalizeError(error, 'confirmFiatDeposit');
  }
};

// ── KYC ───────────────────────────────────────────────────────────────────

export const performKYC = async (input: KYCInput): Promise<boolean> => {
  try {
    return await sdkPerformKYC(input as any);
  } catch (error) {
    throw normalizeError(error, 'performKYC');
  }
};

export const checkKYCStatus = async (address: string): Promise<boolean> => {
  try {
    const result = await sdkIsKYCVerified({ address }) as any;
    return Boolean(result?.verified ?? result);
  } catch (error) {
    throw normalizeError(error, 'checkKYCStatus');
  }
};

// ── Bank Lists ────────────────────────────────────────────────────────────

export const getBankListUSD = async (admin: string, adminpwd: string): Promise<any[]> => {
  try {
    return await sdkGetBankListUSD({ admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, 'getBankListUSD');
  }
};

export const getBankListNGN = async (admin: string, adminpwd: string): Promise<any[]> => {
  try {
    return await sdkGetBankListNGN({ admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, 'getBankListNGN');
  }
};

// ── Fiat Withdrawals ──────────────────────────────────────────────────────

export const recordWithdrawal = async (input: FiatWithdrawalInput): Promise<any> => {
  try {
    return await sdkRecordFiatWithdrawal(input);
  } catch (error) {
    throw normalizeError(error, 'recordWithdrawal');
  }
};

export const verifyBankAccountNGN = async (
  destinationInstitutionCode: string,
  accountNumber: string,
  admin: string,
  adminpwd: string
): Promise<any> => {
  try {
    return await sdkVerifyBankAccountNGN({ destinationInstitutionCode, accountNumber, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, 'verifyBankAccountNGN');
  }
};

// ── Date-Range Transaction Queries ─────────────────────────────────────────

export const getFiatTransactions = async (input: FiatTxRangeInput): Promise<any[]> => {
  try {
    return await sdkGetFiatTxRange(input);
  } catch (error) {
    throw normalizeError(error, 'getFiatTransactions');
  }
};

export const getFiatWithdrawals = async (input: FiatTxRangeInput): Promise<any[]> => {
  try {
    return await sdkGetFiatWithdrawalsRange(input);
  } catch (error) {
    throw normalizeError(error, 'getFiatWithdrawals');
  }
};

// ── Crypto Payments ───────────────────────────────────────────────────────

export const initializeCryptoPayment = async (input: CryptoPaymentInput): Promise<any> => {
  try {
    const { admin, adminpwd, ...params } = input;
    return await sdkPaymentInitializeCrypto(params, admin, adminpwd);
  } catch (error) {
    throw normalizeError(error, 'initializeCryptoPayment');
  }
};

export const recordCryptoPayment = async (
  currency: string,
  txid: string,
  admin: string,
  adminpwd: string
): Promise<any> => {
  try {
    return await sdkRecordCryptoPayment({ currency, txid }, admin, adminpwd);
  } catch (error) {
    throw normalizeError(error, 'recordCryptoPayment');
  }
};
