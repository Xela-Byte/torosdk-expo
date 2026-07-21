/**
 * React integration layer for torosdk-expo.
 *
 * @remarks
 * This module provides:
 * - **Provider** — React context wrapper ({@link ToronetProvider}) that
 *   initialises the SDK config and wraps children.
 * - **Query keys** — Structured cache keys ({@link queryKeys}) for
 *   `@tanstack/react-query`.
 * - **Hooks** — Typed React hooks for wallets, balances, transfers, TNS,
 *   KYC, and exchange rates.
 *
 * @example
 * ```tsx
 * import { ToronetProvider } from 'torosdk-expo/react';
 * // or, if your bundler resolves subpath exports:
 * import { ToronetProvider } from 'torosdk-expo';
 * ```
 *
 * @packageDocumentation
 */

// Provider
export { ToronetProvider, useToronetContext } from './provider';
export type { ToronetProviderProps } from './provider';

// Query keys
export { queryKeys } from './query-keys';

// Hooks
export { useWallets } from './hooks/useWallets';
export type { WalletsState } from './hooks/useWallets';

export { useCreateWallet, useImportWallet, useDeleteWallet } from './hooks/useWalletMutations';
export type { CreateWalletVariables, ImportWalletVariables } from './hooks/useWalletMutations';

export { useBalance, useBalances } from './hooks/useBalance';
export type { UseBalanceOptions, UseBalancesOptions } from './hooks/useBalance';

export { useTransfer } from './hooks/useTransfer';
export type { TransferVariables } from './hooks/useTransfer';

export { useResolveTNS, useLookupTNS, useSetTNS } from './hooks/useTNS';
export type { SetTNSVariables } from './hooks/useTNS';

export { useKYCStatus, useSubmitKYC } from './hooks/useKYC';
export type { UseKYCStatusOptions } from './hooks/useKYC';

export { useExchangeRates } from './hooks/useExchangeRates';

// Bridge (cross-chain)
export {
  useBridgeToken,
  useBridgeTokenFee,
  useBridgeBalance,
  useBridgeTokenBalance,
  useBridgeTransactions,
  useBridgeTokenTransactions,
} from './hooks/useBridge';
export type {
  BridgeTokenVariables,
  UseBridgeTokenFeeOptions,
  UseBridgeBalanceOptions,
  UseBridgeTokenBalanceOptions,
  UseBridgeTransactionsOptions,
  UseBridgeTokenTransactionsOptions,
} from './hooks/useBridge';

// Solana
export {
  useCreateSolanaAddress,
  useCreateToronetSolanaAddress,
  useTransferSolana,
  useTransferSolToken,
  useSolBalance,
  useSolTokenBalance,
  useSolTransactions,
  useSolTokenTransactions,
} from './hooks/useSolana';
export type {
  TransferSolanaVariables,
  TransferSolTokenVariables,
  UseSolBalanceOptions,
  UseSolTokenBalanceOptions,
  UseSolTransactionsOptions,
  UseSolTokenTransactionsOptions,
} from './hooks/useSolana';

// Swap
export { useSwapQuote, useSwap } from './hooks/useSwap';
export type { UseSwapQuoteOptions, SwapVariables } from './hooks/useSwap';
