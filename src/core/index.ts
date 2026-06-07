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

// Types
export type { ToronetConfig, ToronetNetwork, OperationCategory } from './types';
export { Currency } from './types';

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

// Axios adapter (called automatically by createConfig; exported for direct use if needed)
export { setupAxiosAdapter } from './axios-adapter';

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
