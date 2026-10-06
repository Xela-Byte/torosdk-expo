"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolTransactions = exports.getSolTokenBalance = exports.getSolBalance = exports.transferSolToken = exports.transferSolana = exports.isValidSolanaAddress = exports.createToronetSolanaAddress = exports.createSolanaAddress = exports.getBridgeTokenTransactions = exports.getBridgeTransactions = exports.getBridgeTokenBalance = exports.getBridgeBalance = exports.getBridgeTokenFee = exports.bridgeToken = exports.getExchangeRates = exports.submitKYC = exports.getKYCStatus = exports.setTNS = exports.lookupTNS = exports.resolveTNS = exports.makeTransfer = exports.getBalances = exports.getBalanceForCurrency = exports.verifyWalletPassword = exports.importWallet = exports.createWallet = exports.getAuthStrategy = exports.setAuthStrategy = exports.createCustomStrategy = exports.createBiometricStrategy = exports.createPasswordStrategy = exports.setActiveWallet = exports.getActiveWallet = exports.removeWalletFromList = exports.addWalletToList = exports.getWalletList = exports.deletePassword = exports.setPassword = exports.getPassword = exports.setupAxiosAdapter = exports.getApiBaseUrl = exports.getConfig = exports.createConfig = exports.StorageError = exports.AuthBlockedError = exports.APIError = exports.NetworkError = exports.ToroError = exports.BridgeNetwork = exports.Currency = void 0;
exports.mintCurrencyFunds = exports.unfreezeCurrencyAddress = exports.freezeCurrencyAddress = exports.getTokenMetadata = exports.getTokenBalance = exports.deployContract = exports.getWalletKey = exports.fetchVirtualWalletByAddress = exports.fetchVirtualWallet = exports.createVirtualWallet = exports.getStorageVersion = exports.setStorageOff = exports.setStorageOn = exports.isStorageOn = exports.createProduct = exports.getProduct = exports.getProject = exports.removeAdmin = exports.addAdmin = exports.checkIsSuperAdmin = exports.checkIsAdmin = exports.getBlockchainInfo = exports.getTransactionByHash = exports.getTransactions = exports.verifyWalletPasswordOp = exports.executeSwap = exports.getSwapQuote = exports.getSolTokenTransactions = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "Currency", { enumerable: true, get: function () { return types_1.Currency; } });
Object.defineProperty(exports, "BridgeNetwork", { enumerable: true, get: function () { return types_1.BridgeNetwork; } });
// Errors
var errors_1 = require("./errors");
Object.defineProperty(exports, "ToroError", { enumerable: true, get: function () { return errors_1.ToroError; } });
Object.defineProperty(exports, "NetworkError", { enumerable: true, get: function () { return errors_1.NetworkError; } });
Object.defineProperty(exports, "APIError", { enumerable: true, get: function () { return errors_1.APIError; } });
Object.defineProperty(exports, "AuthBlockedError", { enumerable: true, get: function () { return errors_1.AuthBlockedError; } });
Object.defineProperty(exports, "StorageError", { enumerable: true, get: function () { return errors_1.StorageError; } });
// Config
var config_1 = require("./config");
Object.defineProperty(exports, "createConfig", { enumerable: true, get: function () { return config_1.createConfig; } });
Object.defineProperty(exports, "getConfig", { enumerable: true, get: function () { return config_1.getConfig; } });
Object.defineProperty(exports, "getApiBaseUrl", { enumerable: true, get: function () { return config_1.getApiBaseUrl; } });
// Axios adapter (called automatically by createConfig; exported for direct use if needed)
var axios_adapter_1 = require("./axios-adapter");
Object.defineProperty(exports, "setupAxiosAdapter", { enumerable: true, get: function () { return axios_adapter_1.setupAxiosAdapter; } });
// Storage
var storage_1 = require("./storage");
Object.defineProperty(exports, "getPassword", { enumerable: true, get: function () { return storage_1.getPassword; } });
Object.defineProperty(exports, "setPassword", { enumerable: true, get: function () { return storage_1.setPassword; } });
Object.defineProperty(exports, "deletePassword", { enumerable: true, get: function () { return storage_1.deletePassword; } });
Object.defineProperty(exports, "getWalletList", { enumerable: true, get: function () { return storage_1.getWalletList; } });
Object.defineProperty(exports, "addWalletToList", { enumerable: true, get: function () { return storage_1.addWalletToList; } });
Object.defineProperty(exports, "removeWalletFromList", { enumerable: true, get: function () { return storage_1.removeWalletFromList; } });
Object.defineProperty(exports, "getActiveWallet", { enumerable: true, get: function () { return storage_1.getActiveWallet; } });
Object.defineProperty(exports, "setActiveWallet", { enumerable: true, get: function () { return storage_1.setActiveWallet; } });
// Auth
var auth_1 = require("./auth");
Object.defineProperty(exports, "createPasswordStrategy", { enumerable: true, get: function () { return auth_1.createPasswordStrategy; } });
Object.defineProperty(exports, "createBiometricStrategy", { enumerable: true, get: function () { return auth_1.createBiometricStrategy; } });
Object.defineProperty(exports, "createCustomStrategy", { enumerable: true, get: function () { return auth_1.createCustomStrategy; } });
Object.defineProperty(exports, "setAuthStrategy", { enumerable: true, get: function () { return auth_1.setAuthStrategy; } });
Object.defineProperty(exports, "getAuthStrategy", { enumerable: true, get: function () { return auth_1.getAuthStrategy; } });
// SDK
var sdk_1 = require("./sdk");
Object.defineProperty(exports, "createWallet", { enumerable: true, get: function () { return sdk_1.createWallet; } });
Object.defineProperty(exports, "importWallet", { enumerable: true, get: function () { return sdk_1.importWallet; } });
Object.defineProperty(exports, "verifyWalletPassword", { enumerable: true, get: function () { return sdk_1.verifyWalletPassword; } });
Object.defineProperty(exports, "getBalanceForCurrency", { enumerable: true, get: function () { return sdk_1.getBalanceForCurrency; } });
Object.defineProperty(exports, "getBalances", { enumerable: true, get: function () { return sdk_1.getBalances; } });
Object.defineProperty(exports, "makeTransfer", { enumerable: true, get: function () { return sdk_1.makeTransfer; } });
Object.defineProperty(exports, "resolveTNS", { enumerable: true, get: function () { return sdk_1.resolveTNS; } });
Object.defineProperty(exports, "lookupTNS", { enumerable: true, get: function () { return sdk_1.lookupTNS; } });
Object.defineProperty(exports, "setTNS", { enumerable: true, get: function () { return sdk_1.setTNS; } });
Object.defineProperty(exports, "getKYCStatus", { enumerable: true, get: function () { return sdk_1.getKYCStatus; } });
Object.defineProperty(exports, "submitKYC", { enumerable: true, get: function () { return sdk_1.submitKYC; } });
Object.defineProperty(exports, "getExchangeRates", { enumerable: true, get: function () { return sdk_1.getExchangeRates; } });
// Bridge (cross-chain)
Object.defineProperty(exports, "bridgeToken", { enumerable: true, get: function () { return sdk_1.bridgeToken; } });
Object.defineProperty(exports, "getBridgeTokenFee", { enumerable: true, get: function () { return sdk_1.getBridgeTokenFee; } });
Object.defineProperty(exports, "getBridgeBalance", { enumerable: true, get: function () { return sdk_1.getBridgeBalance; } });
Object.defineProperty(exports, "getBridgeTokenBalance", { enumerable: true, get: function () { return sdk_1.getBridgeTokenBalance; } });
Object.defineProperty(exports, "getBridgeTransactions", { enumerable: true, get: function () { return sdk_1.getBridgeTransactions; } });
Object.defineProperty(exports, "getBridgeTokenTransactions", { enumerable: true, get: function () { return sdk_1.getBridgeTokenTransactions; } });
// Solana
Object.defineProperty(exports, "createSolanaAddress", { enumerable: true, get: function () { return sdk_1.createSolanaAddress; } });
Object.defineProperty(exports, "createToronetSolanaAddress", { enumerable: true, get: function () { return sdk_1.createToronetSolanaAddress; } });
Object.defineProperty(exports, "isValidSolanaAddress", { enumerable: true, get: function () { return sdk_1.isValidSolanaAddress; } });
Object.defineProperty(exports, "transferSolana", { enumerable: true, get: function () { return sdk_1.transferSolana; } });
Object.defineProperty(exports, "transferSolToken", { enumerable: true, get: function () { return sdk_1.transferSolToken; } });
Object.defineProperty(exports, "getSolBalance", { enumerable: true, get: function () { return sdk_1.getSolBalance; } });
Object.defineProperty(exports, "getSolTokenBalance", { enumerable: true, get: function () { return sdk_1.getSolTokenBalance; } });
Object.defineProperty(exports, "getSolTransactions", { enumerable: true, get: function () { return sdk_1.getSolTransactions; } });
Object.defineProperty(exports, "getSolTokenTransactions", { enumerable: true, get: function () { return sdk_1.getSolTokenTransactions; } });
// Swap
Object.defineProperty(exports, "getSwapQuote", { enumerable: true, get: function () { return sdk_1.getSwapQuote; } });
Object.defineProperty(exports, "executeSwap", { enumerable: true, get: function () { return sdk_1.executeSwap; } });
// Verify Password
Object.defineProperty(exports, "verifyWalletPasswordOp", { enumerable: true, get: function () { return sdk_1.verifyWalletPasswordOp; } });
// Transactions
Object.defineProperty(exports, "getTransactions", { enumerable: true, get: function () { return sdk_1.getTransactions; } });
Object.defineProperty(exports, "getTransactionByHash", { enumerable: true, get: function () { return sdk_1.getTransactionByHash; } });
// Blockchain
Object.defineProperty(exports, "getBlockchainInfo", { enumerable: true, get: function () { return sdk_1.getBlockchainInfo; } });
// Roles
Object.defineProperty(exports, "checkIsAdmin", { enumerable: true, get: function () { return sdk_1.checkIsAdmin; } });
Object.defineProperty(exports, "checkIsSuperAdmin", { enumerable: true, get: function () { return sdk_1.checkIsSuperAdmin; } });
Object.defineProperty(exports, "addAdmin", { enumerable: true, get: function () { return sdk_1.addAdmin; } });
Object.defineProperty(exports, "removeAdmin", { enumerable: true, get: function () { return sdk_1.removeAdmin; } });
// Products
Object.defineProperty(exports, "getProject", { enumerable: true, get: function () { return sdk_1.getProject; } });
Object.defineProperty(exports, "getProduct", { enumerable: true, get: function () { return sdk_1.getProduct; } });
Object.defineProperty(exports, "createProduct", { enumerable: true, get: function () { return sdk_1.createProduct; } });
// Storage
Object.defineProperty(exports, "isStorageOn", { enumerable: true, get: function () { return sdk_1.isStorageOn; } });
Object.defineProperty(exports, "setStorageOn", { enumerable: true, get: function () { return sdk_1.setStorageOn; } });
Object.defineProperty(exports, "setStorageOff", { enumerable: true, get: function () { return sdk_1.setStorageOff; } });
Object.defineProperty(exports, "getStorageVersion", { enumerable: true, get: function () { return sdk_1.getStorageVersion; } });
// Virtual Wallet
Object.defineProperty(exports, "createVirtualWallet", { enumerable: true, get: function () { return sdk_1.createVirtualWallet; } });
Object.defineProperty(exports, "fetchVirtualWallet", { enumerable: true, get: function () { return sdk_1.fetchVirtualWallet; } });
Object.defineProperty(exports, "fetchVirtualWalletByAddress", { enumerable: true, get: function () { return sdk_1.fetchVirtualWalletByAddress; } });
// Keystore
Object.defineProperty(exports, "getWalletKey", { enumerable: true, get: function () { return sdk_1.getWalletKey; } });
// Deployer
Object.defineProperty(exports, "deployContract", { enumerable: true, get: function () { return sdk_1.deployContract; } });
// Token
Object.defineProperty(exports, "getTokenBalance", { enumerable: true, get: function () { return sdk_1.getTokenBalance; } });
Object.defineProperty(exports, "getTokenMetadata", { enumerable: true, get: function () { return sdk_1.getTokenMetadata; } });
// Currency Admin
Object.defineProperty(exports, "freezeCurrencyAddress", { enumerable: true, get: function () { return sdk_1.freezeCurrencyAddress; } });
Object.defineProperty(exports, "unfreezeCurrencyAddress", { enumerable: true, get: function () { return sdk_1.unfreezeCurrencyAddress; } });
Object.defineProperty(exports, "mintCurrencyFunds", { enumerable: true, get: function () { return sdk_1.mintCurrencyFunds; } });
//# sourceMappingURL=index.js.map