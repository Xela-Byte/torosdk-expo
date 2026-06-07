// Types
export type { ToronetConfig, ToronetNetwork, OperationCategory, Currency } from './types';

// Errors
export {
  ToroError,
  NetworkError,
  APIError,
  AuthBlockedError,
  StorageError,
} from './errors';
export type { ToroErrorCode } from './errors';

// Config
export { createConfig, getConfig, getApiBaseUrl } from './config';

// Storage
export {
  getPassword,
  setPassword,
  deletePassword,
  getWalletList,
  addWalletToList,
  removeWalletFromList,
  getActiveWallet,
  setActiveWallet,
} from './storage';

// Auth
export {
  createPasswordStrategy,
  createBiometricStrategy,
  createCustomStrategy,
  setAuthStrategy,
  getAuthStrategy,
} from './auth';
export type { AuthStrategy, BiometricStrategyOptions } from './auth';

// SDK
export {
  createWallet,
  importWallet,
  verifyWalletPassword,
  getBalanceForCurrency,
  getBalances,
  makeTransfer,
  resolveTNS,
  lookupTNS,
  setTNS,
  getKYCStatus,
  submitKYC,
  getExchangeRates,
} from './sdk';
