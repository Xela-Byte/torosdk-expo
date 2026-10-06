/**
 * Core SDK wrappers and utilities for torosdk-expo.
 *
 * @remarks
 * This module provides low-level, non-React bindings around `torosdk`:
 * - **Types** — {@link ToronetConfig}, {@link ToronetNetwork},
 *   {@link OperationCategory}, and the {@link Currency} enum.
 * - **Errors** — A typed error hierarchy ({@link ToroError},
 *   {@link NetworkError}, {@link APIError}, {@link AuthBlockedError},
 *   {@link StorageError}).
 * - **Config** — {@link createConfig} / {@link getConfig} for
 *   initialising and reading SDK configuration.
 * - **Storage** — SecureStore-backed helpers for passwords, wallet
 *   lists, and active wallet selection.
 * - **Auth** — Strategy-pattern authentication ({@link AuthStrategy})
 *   with password, biometric, and custom implementations.
 * - **SDK** — Wrapped `torosdk` functions with auth gating, error
 *   normalisation, and automatic configuration.
 *
 * @example
 * ```ts
 * import { createConfig, createPasswordStrategy } from 'torosdk-expo/core';
 * createConfig({
 *   network: 'testnet',
 *   auth: createPasswordStrategy(),
 * });
 * ```
 *
 * @packageDocumentation
 */
export type { ToronetConfig, ToronetNetwork, OperationCategory, ToroRawResult, AdminCredentials } from './types';
export { Currency, BridgeNetwork } from './types';
export { ToroError, NetworkError, APIError, AuthBlockedError, StorageError, } from './errors';
export type { ToroErrorCode } from './errors';
export { createConfig, getConfig, getApiBaseUrl } from './config';
export { setupAxiosAdapter } from './axios-adapter';
export { getPassword, setPassword, deletePassword, getWalletList, addWalletToList, removeWalletFromList, getActiveWallet, setActiveWallet, } from './storage';
export { createPasswordStrategy, createBiometricStrategy, createCustomStrategy, setAuthStrategy, getAuthStrategy, } from './auth';
export type { AuthStrategy, BiometricStrategyOptions } from './auth';
export { createWallet, importWallet, verifyWalletPassword, getBalanceForCurrency, getBalances, makeTransfer, resolveTNS, lookupTNS, setTNS, getKYCStatus, submitKYC, getExchangeRates, bridgeToken, getBridgeTokenFee, getBridgeBalance, getBridgeTokenBalance, getBridgeTransactions, getBridgeTokenTransactions, createSolanaAddress, createToronetSolanaAddress, isValidSolanaAddress, transferSolana, transferSolToken, getSolBalance, getSolTokenBalance, getSolTransactions, getSolTokenTransactions, getSwapQuote, executeSwap, verifyWalletPasswordOp, getTransactions, getTransactionByHash, getBlockchainInfo, checkIsAdmin, checkIsSuperAdmin, addAdmin, removeAdmin, getProject, getProduct, createProduct, isStorageOn, setStorageOn, setStorageOff, getStorageVersion, createVirtualWallet, fetchVirtualWallet, fetchVirtualWalletByAddress, getWalletKey, deployContract, getTokenBalance, getTokenMetadata, freezeCurrencyAddress, unfreezeCurrencyAddress, mintCurrencyFunds, } from './sdk';
export type { BridgeTokenParams } from './sdk';
//# sourceMappingURL=index.d.ts.map