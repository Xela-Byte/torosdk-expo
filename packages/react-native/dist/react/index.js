"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateVirtualWallet = exports.useVirtualWalletByAddress = exports.useVirtualWallet = exports.useSetStorageOff = exports.useSetStorageOn = exports.useStorageVersion = exports.useStorageStatus = exports.useCreateProduct = exports.useProduct = exports.useProject = exports.useRemoveAdmin = exports.useAddAdmin = exports.useIsSuperAdmin = exports.useIsAdmin = exports.useBlockchainInfo = exports.useTransactionByHash = exports.useTransactions = exports.useSwap = exports.useSwapQuote = exports.useSolTokenTransactions = exports.useSolTransactions = exports.useSolTokenBalance = exports.useSolBalance = exports.useTransferSolToken = exports.useTransferSolana = exports.useCreateToronetSolanaAddress = exports.useCreateSolanaAddress = exports.useBridgeTokenTransactions = exports.useBridgeTransactions = exports.useBridgeTokenBalance = exports.useBridgeBalance = exports.useBridgeTokenFee = exports.useBridgeToken = exports.useExchangeRates = exports.useSubmitKYC = exports.useKYCStatus = exports.useSetTNS = exports.useLookupTNS = exports.useResolveTNS = exports.useTransfer = exports.useBalances = exports.useBalance = exports.useVerifyPassword = exports.useDeleteWallet = exports.useImportWallet = exports.useCreateWallet = exports.useWallets = exports.queryKeys = exports.useToronetContext = exports.ToronetProvider = void 0;
exports.useMintCurrency = exports.useUnfreezeCurrency = exports.useFreezeCurrency = exports.useCurrencyInfo = exports.useTokenExtended = exports.useTokenBalance = exports.useDeployContract = exports.useKeystoreEntry = void 0;
// Provider
var provider_1 = require("./provider");
Object.defineProperty(exports, "ToronetProvider", { enumerable: true, get: function () { return provider_1.ToronetProvider; } });
Object.defineProperty(exports, "useToronetContext", { enumerable: true, get: function () { return provider_1.useToronetContext; } });
// Query keys
var query_keys_1 = require("./query-keys");
Object.defineProperty(exports, "queryKeys", { enumerable: true, get: function () { return query_keys_1.queryKeys; } });
// Hooks
var useWallets_1 = require("./hooks/useWallets");
Object.defineProperty(exports, "useWallets", { enumerable: true, get: function () { return useWallets_1.useWallets; } });
var useWalletMutations_1 = require("./hooks/useWalletMutations");
Object.defineProperty(exports, "useCreateWallet", { enumerable: true, get: function () { return useWalletMutations_1.useCreateWallet; } });
Object.defineProperty(exports, "useImportWallet", { enumerable: true, get: function () { return useWalletMutations_1.useImportWallet; } });
Object.defineProperty(exports, "useDeleteWallet", { enumerable: true, get: function () { return useWalletMutations_1.useDeleteWallet; } });
Object.defineProperty(exports, "useVerifyPassword", { enumerable: true, get: function () { return useWalletMutations_1.useVerifyPassword; } });
var useBalance_1 = require("./hooks/useBalance");
Object.defineProperty(exports, "useBalance", { enumerable: true, get: function () { return useBalance_1.useBalance; } });
Object.defineProperty(exports, "useBalances", { enumerable: true, get: function () { return useBalance_1.useBalances; } });
var useTransfer_1 = require("./hooks/useTransfer");
Object.defineProperty(exports, "useTransfer", { enumerable: true, get: function () { return useTransfer_1.useTransfer; } });
var useTNS_1 = require("./hooks/useTNS");
Object.defineProperty(exports, "useResolveTNS", { enumerable: true, get: function () { return useTNS_1.useResolveTNS; } });
Object.defineProperty(exports, "useLookupTNS", { enumerable: true, get: function () { return useTNS_1.useLookupTNS; } });
Object.defineProperty(exports, "useSetTNS", { enumerable: true, get: function () { return useTNS_1.useSetTNS; } });
var useKYC_1 = require("./hooks/useKYC");
Object.defineProperty(exports, "useKYCStatus", { enumerable: true, get: function () { return useKYC_1.useKYCStatus; } });
Object.defineProperty(exports, "useSubmitKYC", { enumerable: true, get: function () { return useKYC_1.useSubmitKYC; } });
var useExchangeRates_1 = require("./hooks/useExchangeRates");
Object.defineProperty(exports, "useExchangeRates", { enumerable: true, get: function () { return useExchangeRates_1.useExchangeRates; } });
// Bridge (cross-chain)
var useBridge_1 = require("./hooks/useBridge");
Object.defineProperty(exports, "useBridgeToken", { enumerable: true, get: function () { return useBridge_1.useBridgeToken; } });
Object.defineProperty(exports, "useBridgeTokenFee", { enumerable: true, get: function () { return useBridge_1.useBridgeTokenFee; } });
Object.defineProperty(exports, "useBridgeBalance", { enumerable: true, get: function () { return useBridge_1.useBridgeBalance; } });
Object.defineProperty(exports, "useBridgeTokenBalance", { enumerable: true, get: function () { return useBridge_1.useBridgeTokenBalance; } });
Object.defineProperty(exports, "useBridgeTransactions", { enumerable: true, get: function () { return useBridge_1.useBridgeTransactions; } });
Object.defineProperty(exports, "useBridgeTokenTransactions", { enumerable: true, get: function () { return useBridge_1.useBridgeTokenTransactions; } });
// Solana
var useSolana_1 = require("./hooks/useSolana");
Object.defineProperty(exports, "useCreateSolanaAddress", { enumerable: true, get: function () { return useSolana_1.useCreateSolanaAddress; } });
Object.defineProperty(exports, "useCreateToronetSolanaAddress", { enumerable: true, get: function () { return useSolana_1.useCreateToronetSolanaAddress; } });
Object.defineProperty(exports, "useTransferSolana", { enumerable: true, get: function () { return useSolana_1.useTransferSolana; } });
Object.defineProperty(exports, "useTransferSolToken", { enumerable: true, get: function () { return useSolana_1.useTransferSolToken; } });
Object.defineProperty(exports, "useSolBalance", { enumerable: true, get: function () { return useSolana_1.useSolBalance; } });
Object.defineProperty(exports, "useSolTokenBalance", { enumerable: true, get: function () { return useSolana_1.useSolTokenBalance; } });
Object.defineProperty(exports, "useSolTransactions", { enumerable: true, get: function () { return useSolana_1.useSolTransactions; } });
Object.defineProperty(exports, "useSolTokenTransactions", { enumerable: true, get: function () { return useSolana_1.useSolTokenTransactions; } });
// Swap
var useSwap_1 = require("./hooks/useSwap");
Object.defineProperty(exports, "useSwapQuote", { enumerable: true, get: function () { return useSwap_1.useSwapQuote; } });
Object.defineProperty(exports, "useSwap", { enumerable: true, get: function () { return useSwap_1.useSwap; } });
// Transactions
var useTransactions_1 = require("./hooks/useTransactions");
Object.defineProperty(exports, "useTransactions", { enumerable: true, get: function () { return useTransactions_1.useTransactions; } });
Object.defineProperty(exports, "useTransactionByHash", { enumerable: true, get: function () { return useTransactions_1.useTransactionByHash; } });
// Blockchain
var useBlockchain_1 = require("./hooks/useBlockchain");
Object.defineProperty(exports, "useBlockchainInfo", { enumerable: true, get: function () { return useBlockchain_1.useBlockchainInfo; } });
// Roles
var useRoles_1 = require("./hooks/useRoles");
Object.defineProperty(exports, "useIsAdmin", { enumerable: true, get: function () { return useRoles_1.useIsAdmin; } });
Object.defineProperty(exports, "useIsSuperAdmin", { enumerable: true, get: function () { return useRoles_1.useIsSuperAdmin; } });
Object.defineProperty(exports, "useAddAdmin", { enumerable: true, get: function () { return useRoles_1.useAddAdmin; } });
Object.defineProperty(exports, "useRemoveAdmin", { enumerable: true, get: function () { return useRoles_1.useRemoveAdmin; } });
// Products
var useProducts_1 = require("./hooks/useProducts");
Object.defineProperty(exports, "useProject", { enumerable: true, get: function () { return useProducts_1.useProject; } });
Object.defineProperty(exports, "useProduct", { enumerable: true, get: function () { return useProducts_1.useProduct; } });
Object.defineProperty(exports, "useCreateProduct", { enumerable: true, get: function () { return useProducts_1.useCreateProduct; } });
// Storage
var useStorage_1 = require("./hooks/useStorage");
Object.defineProperty(exports, "useStorageStatus", { enumerable: true, get: function () { return useStorage_1.useStorageStatus; } });
Object.defineProperty(exports, "useStorageVersion", { enumerable: true, get: function () { return useStorage_1.useStorageVersion; } });
Object.defineProperty(exports, "useSetStorageOn", { enumerable: true, get: function () { return useStorage_1.useSetStorageOn; } });
Object.defineProperty(exports, "useSetStorageOff", { enumerable: true, get: function () { return useStorage_1.useSetStorageOff; } });
// Virtual Wallet
var useVirtualWallet_1 = require("./hooks/useVirtualWallet");
Object.defineProperty(exports, "useVirtualWallet", { enumerable: true, get: function () { return useVirtualWallet_1.useVirtualWallet; } });
Object.defineProperty(exports, "useVirtualWalletByAddress", { enumerable: true, get: function () { return useVirtualWallet_1.useVirtualWalletByAddress; } });
Object.defineProperty(exports, "useCreateVirtualWallet", { enumerable: true, get: function () { return useVirtualWallet_1.useCreateVirtualWallet; } });
// Keystore
var useKeystore_1 = require("./hooks/useKeystore");
Object.defineProperty(exports, "useKeystoreEntry", { enumerable: true, get: function () { return useKeystore_1.useKeystoreEntry; } });
// Deployer
var useDeployer_1 = require("./hooks/useDeployer");
Object.defineProperty(exports, "useDeployContract", { enumerable: true, get: function () { return useDeployer_1.useDeployContract; } });
// Token
var useTokenBalance_1 = require("./hooks/useTokenBalance");
Object.defineProperty(exports, "useTokenBalance", { enumerable: true, get: function () { return useTokenBalance_1.useTokenBalance; } });
var useTokenExtended_1 = require("./hooks/useTokenExtended");
Object.defineProperty(exports, "useTokenExtended", { enumerable: true, get: function () { return useTokenExtended_1.useTokenExtended; } });
// Currency Admin
var useCurrencyAdmin_1 = require("./hooks/useCurrencyAdmin");
Object.defineProperty(exports, "useCurrencyInfo", { enumerable: true, get: function () { return useCurrencyAdmin_1.useCurrencyInfo; } });
Object.defineProperty(exports, "useFreezeCurrency", { enumerable: true, get: function () { return useCurrencyAdmin_1.useFreezeCurrency; } });
Object.defineProperty(exports, "useUnfreezeCurrency", { enumerable: true, get: function () { return useCurrencyAdmin_1.useUnfreezeCurrency; } });
Object.defineProperty(exports, "useMintCurrency", { enumerable: true, get: function () { return useCurrencyAdmin_1.useMintCurrency; } });
//# sourceMappingURL=index.js.map