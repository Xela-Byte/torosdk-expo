"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BridgeNetwork: () => import_torosdk10.BridgeNetwork,
  Currency: () => import_torosdk15.Currency,
  ToroError: () => ToroError,
  addAdmin: () => addAdmin,
  addSuperAdmin: () => addSuperAdmin,
  allowCurrencyTransfer: () => allowCurrencyTransfer,
  bridgeSolToken: () => bridgeSolToken,
  bridgeToken: () => bridgeToken,
  bridgeTokenFromChain: () => bridgeTokenFromChain,
  burnCurrencyFunds: () => burnCurrencyFunds,
  checkKYCStatus: () => checkKYCStatus,
  confirmFiatDeposit: () => confirmFiatDeposit,
  createProduct: () => createProduct,
  createSolanaAddress: () => createSolanaAddress,
  createToronetSolanaAddress: () => createToronetSolanaAddress,
  createVirtualWallet: () => createVirtualWallet,
  createWallet: () => createWallet,
  decreaseStorageVersion: () => decreaseStorageVersion,
  deleteTNSName: () => deleteTNSName,
  deleteWallet: () => deleteWallet,
  deployContract: () => deployContract,
  disableCurrencyTransfer: () => disableCurrencyTransfer,
  enrollCurrencyAddress: () => enrollCurrencyAddress,
  fetchVirtualWallet: () => fetchVirtualWallet,
  fetchVirtualWalletByAddress: () => fetchVirtualWalletByAddress,
  formatToroAmount: () => formatToroAmount,
  formatToroCurrency: () => formatToroCurrency,
  formatToroTransaction: () => formatToroTransaction,
  freezeCurrencyAddress: () => freezeCurrencyAddress,
  fromWei: () => fromWei,
  getAddressBalanceAdapter: () => getAddressBalanceAdapter,
  getAddressDollarTransactions: () => getAddressDollarTransactions,
  getAddressEuroTransactions: () => getAddressEuroTransactions,
  getAddressKSHTransactions: () => getAddressKSHTransactions,
  getAddressNairaTransactions: () => getAddressNairaTransactions,
  getAddressPoundTransactions: () => getAddressPoundTransactions,
  getAddressRoleAdapter: () => getAddressRoleAdapter,
  getAddressToroTransactions: () => getAddressToroTransactions,
  getAddressTransactionsAdapter: () => getAddressTransactionsAdapter,
  getAddressTransactionsRange: () => getAddressTransactionsRange,
  getAddressZARTransactions: () => getAddressZARTransactions,
  getAdminByIndex: () => getAdminByIndex,
  getAdminIndex: () => getAdminIndex,
  getBalance: () => getBalance,
  getBankListNGN: () => getBankListNGN,
  getBankListUSD: () => getBankListUSD,
  getBlockByIdAdapter: () => getBlockByIdAdapter,
  getBlockchainInfo: () => getBlockchainInfo,
  getBlocks: () => getBlocks,
  getBridgeBalance: () => getBridgeBalance,
  getBridgeChainBalance: () => getBridgeChainBalance,
  getBridgeChainTokenBalance: () => getBridgeChainTokenBalance,
  getBridgeChainTokenTransactions: () => getBridgeChainTokenTransactions,
  getBridgeChainTransactions: () => getBridgeChainTransactions,
  getBridgeFeeEstimate: () => getBridgeFeeEstimate,
  getBridgeTokenBalance: () => getBridgeTokenBalance,
  getBridgeTokenFeeEstimate: () => getBridgeTokenFeeEstimate,
  getBridgeTokenTransactions: () => getBridgeTokenTransactions,
  getBridgeTransactions: () => getBridgeTransactions,
  getChainStatus: () => getChainStatus,
  getChainTransactions: () => getChainTransactions,
  getConfig: () => getConfig,
  getCurrencyBalance: () => getCurrencyBalance,
  getDollarTransactions: () => getDollarTransactions,
  getEuroTransactions: () => getEuroTransactions,
  getEventByIdAdapter: () => getEventByIdAdapter,
  getExchangeRates: () => getExchangeRates,
  getFiatTransactions: () => getFiatTransactions,
  getFiatWithdrawals: () => getFiatWithdrawals,
  getKSHTransactions: () => getKSHTransactions,
  getLatestBlock: () => getLatestBlock,
  getMaximumTokenAllowance: () => getMaximumTokenAllowance,
  getMinimumTokenAllowance: () => getMinimumTokenAllowance,
  getNairaTransactions: () => getNairaTransactions,
  getNumberOfAdmins: () => getNumberOfAdmins,
  getPoundTransactions: () => getPoundTransactions,
  getProduct: () => getProduct,
  getProject: () => getProject,
  getSolBalance: () => getSolBalance,
  getSolBridgeFee: () => getSolBridgeFee,
  getSolLatestBlock: () => getSolLatestBlock,
  getSolTokenBalance: () => getSolTokenBalance,
  getSolTokenTransactions: () => getSolTokenTransactions,
  getSolTransactions: () => getSolTransactions,
  getStorageOwner: () => getStorageOwner,
  getStorageVersion: () => getStorageVersion,
  getSwapQuote: () => getSwapQuote2,
  getTokenAllowance: () => getTokenAllowance,
  getTokenBalance: () => getTokenBalance,
  getTokenMetadata: () => getTokenMetadata,
  getTokenTotalCap: () => getTokenTotalCap,
  getTokenTransactionFee: () => getTokenTransactionFee,
  getToroTransactions: () => getToroTransactions,
  getTransactionByHash: () => getTransactionByHash,
  getTransactionByHashAdapter: () => getTransactionByHashAdapter,
  getTransactionReceipt: () => getTransactionReceipt,
  getTransactions: () => getTransactions,
  getTransactionsByRange: () => getTransactionsByRange,
  getWalletKey: () => getWalletKey,
  getZARTransactions: () => getZARTransactions,
  importWalletFromPrivateKey: () => importWalletFromPrivateKey,
  importWalletFromPrivateKeyAndPassword: () => importWalletFromPrivateKeyAndPassword,
  increaseStorageVersion: () => increaseStorageVersion,
  initToroforge: () => initToroforge,
  initializeCryptoPayment: () => initializeCryptoPayment,
  initiateDeposit: () => initiateDeposit,
  isAdmin: () => isAdmin,
  isContractRegistered: () => isContractRegistered,
  isDebugger: () => isDebugger,
  isStorageOn: () => isStorageOn,
  isStorageOwner: () => isStorageOwner,
  isSuperAdmin: () => isSuperAdmin,
  isTNSAvailable: () => isTNSAvailable,
  isTokenEnrolled: () => isTokenEnrolled,
  isTokenFrozen: () => isTokenFrozen,
  isValidAddress: () => isValidAddress,
  isValidSolanaAddress: () => isValidSolanaAddress,
  lookupTNS: () => lookupTNS,
  lookupTNSAddress: () => lookupTNSAddress,
  mintCurrencyFunds: () => mintCurrencyFunds,
  normalizeError: () => normalizeError,
  parseToroError: () => parseToroError,
  performKYC: () => performKYC,
  recordCryptoPayment: () => recordCryptoPayment,
  recordWithdrawal: () => recordWithdrawal,
  registerStorageContract: () => registerStorageContract,
  registerTNS: () => registerTNS,
  removeAdmin: () => removeAdmin,
  resolveTNS: () => resolveTNS,
  resolveTNSName: () => resolveTNSName,
  sendTransaction: () => sendTransaction,
  setStorageOff: () => setStorageOff,
  setStorageOn: () => setStorageOn,
  setStorageVersion: () => setStorageVersion,
  setTNS: () => setTNS,
  shortenAddress: () => shortenAddress,
  swapCurrency: () => swapCurrency2,
  toWei: () => toWei,
  transferCurrencyFunds: () => transferCurrencyFunds,
  transferSolToken: () => transferSolToken,
  transferSolana: () => transferSolana,
  transferStorageOwnership: () => transferStorageOwnership,
  unfreezeCurrencyAddress: () => unfreezeCurrencyAddress,
  unregisterStorageContract: () => unregisterStorageContract,
  updateProduct: () => updateProduct,
  updateTNSName: () => updateTNSName,
  updateVirtualWalletTransactions: () => updateVirtualWalletTransactions,
  updateWalletPassword: () => updateWalletPassword,
  validateToroAddress: () => validateToroAddress,
  verifyBankAccountNGN: () => verifyBankAccountNGN,
  verifyWalletPassword: () => verifyWalletPassword
});
module.exports = __toCommonJS(index_exports);

// src/config.ts
var import_torosdk = require("torosdk");
var isInitialized = false;
var initToroforge = (config) => {
  (0, import_torosdk.initializeSDK)(config);
  isInitialized = true;
};
var getConfig = () => {
  if (!isInitialized) {
    throw new Error("Toroforge SDK adapter is not initialized. Call initToroforge first.");
  }
  return (0, import_torosdk.getSDKConfig)();
};

// src/errors.ts
var ToroError = class extends Error {
  constructor(message, code, operation, details) {
    super(message);
    this.name = "ToroError";
    this.code = code;
    this.operation = operation;
    this.details = details;
  }
};
var normalizeError = (error, operation) => {
  let message = "An unknown error occurred";
  let code = "UNKNOWN_ERROR";
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (error && error.response && error.response.data) {
    message = error.response.data.error || JSON.stringify(error.response.data);
  } else if (error && error.message) {
    message = error.message;
  }
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes("insufficient")) {
    code = "INSUFFICIENT_FUNDS";
  } else if (lowerMsg.includes("password") || lowerMsg.includes("credentials") || lowerMsg.includes("auth")) {
    code = "INVALID_PASSWORD";
  } else if (lowerMsg.includes("not found") || lowerMsg.includes("unavailable") || lowerMsg.includes("does not exist")) {
    code = "NOT_FOUND";
  } else if (lowerMsg.includes("taken") || lowerMsg.includes("already exists") || lowerMsg.includes("in use")) {
    code = "ALREADY_EXISTS";
  } else if (lowerMsg.includes("network") || lowerMsg.includes("timeout") || lowerMsg.includes("econnrefused")) {
    code = "NETWORK_ERROR";
  } else if (lowerMsg.includes("invalid") || lowerMsg.includes("format")) {
    code = "INVALID_INPUT";
  } else if (lowerMsg.includes("kyc") || lowerMsg.includes("verify")) {
    code = "KYC_ERROR";
  } else if (lowerMsg.includes("admin") || lowerMsg.includes("permission") || lowerMsg.includes("unauthorized")) {
    code = "UNAUTHORIZED";
  }
  return new ToroError(message, code, operation, error);
};

// src/utils.ts
var formatToroAmount = (rawAmount, decimals = 18, displayDecimals = 4) => {
  try {
    const raw = typeof rawAmount === "string" ? rawAmount : rawAmount.toString();
    if (!raw || raw === "0") return "0.0000";
    const value = parseFloat(raw) / Math.pow(10, decimals);
    return value.toFixed(displayDecimals);
  } catch {
    return "0.0000";
  }
};
var formatToroCurrency = (amount, currency, displayDecimals = 2) => {
  try {
    const value = parseFloat(String(amount));
    if (isNaN(value)) return `0.00 ${currency}`;
    return `${value.toFixed(displayDecimals)} ${currency}`;
  } catch {
    return `0.00 ${currency}`;
  }
};
var validateToroAddress = (address) => {
  if (!address || typeof address !== "string") return false;
  return /^0x[0-9a-fA-F]{40}$/.test(address.trim());
};
var shortenAddress = (address, start = 6, end = 4) => {
  if (!address || address.length < start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};
var formatToroTransaction = (tx) => {
  return {
    hash: tx?.hash || tx?.txhash || tx?.id || "",
    from: tx?.from || tx?.sender || tx?.senderAddr || "",
    to: tx?.to || tx?.receiver || tx?.receiverAddr || "",
    amount: tx?.value || tx?.amount || tx?.val || "0",
    currency: tx?.currency || tx?.token || "TORO",
    status: tx?.status || (tx?.result ? "success" : "pending"),
    timestamp: tx?.timestamp || tx?.time || ""
  };
};
var parseToroError = (error) => {
  if (!error) return "An unknown error occurred";
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data) return JSON.stringify(error.response.data);
  return "An unknown error occurred";
};
var fromWei = (value, decimals = 18) => {
  try {
    const num = parseFloat(String(value)) / Math.pow(10, decimals);
    return isNaN(num) ? "0" : num.toString();
  } catch {
    return "0";
  }
};
var toWei = (value, decimals = 18) => {
  try {
    const num = parseFloat(String(value)) * Math.pow(10, decimals);
    return isNaN(num) ? "0" : num.toFixed(0);
  } catch {
    return "0";
  }
};

// src/wallet.ts
var import_torosdk2 = require("torosdk");
var createWallet = async (username, password) => {
  try {
    return await (0, import_torosdk2.createWallet)({ username, password });
  } catch (error) {
    throw normalizeError(error, "createWallet");
  }
};
var isTNSAvailable = async (username) => {
  try {
    return await (0, import_torosdk2.isTNSAvailable)({ username });
  } catch (error) {
    throw normalizeError(error, "isTNSAvailable");
  }
};
var verifyWalletPassword = async (address, password) => {
  try {
    const result = await (0, import_torosdk2.verifyWalletPassword)({ address, password });
    return Boolean(result?.valueOf());
  } catch (error) {
    throw normalizeError(error, "verifyWalletPassword");
  }
};
var importWalletFromPrivateKeyAndPassword = async (pvKey, password) => {
  try {
    const result = await (0, import_torosdk2.importWalletFromPrivateKeyAndPassword)({ pvKey, password });
    return typeof result === "string" ? result : String(result);
  } catch (error) {
    throw normalizeError(error, "importWalletFromPrivateKeyAndPassword");
  }
};

// src/balance.ts
var import_torosdk3 = require("torosdk");
var getBalance = async (address) => {
  try {
    const rawBalance = await (0, import_torosdk3.getBalance)({ address });
    return {
      ngnBalance: rawBalance.ngnBalance?.toString() || "0",
      usdBalance: rawBalance.usdBalance?.toString() || "0",
      toroGBalance: rawBalance.toroGBalance?.toString() || "0",
      kshBalance: rawBalance.kshBalance?.toString() || "0"
    };
  } catch (error) {
    throw normalizeError(error, "getBalance");
  }
};

// src/tns.ts
var import_torosdk4 = require("torosdk");
var resolveTNSName = async (name) => {
  try {
    const address = await (0, import_torosdk4.getAddr)({ name });
    return address || null;
  } catch (error) {
    throw normalizeError(error, "resolveTNSName");
  }
};
var lookupTNSAddress = async (address) => {
  try {
    const name = await (0, import_torosdk4.getName)({ address });
    return name || null;
  } catch (error) {
    throw normalizeError(error, "lookupTNSAddress");
  }
};
var updateTNSName = async (address, password, username) => {
  try {
    return await (0, import_torosdk4.updateName)({ address, password, username });
  } catch (error) {
    throw normalizeError(error, "updateTNSName");
  }
};
var deleteTNSName = async (address, password) => {
  try {
    return await (0, import_torosdk4.deleteName)({ address, password });
  } catch (error) {
    throw normalizeError(error, "deleteTNSName");
  }
};
var resolveTNS = resolveTNSName;
var lookupTNS = lookupTNSAddress;
var setTNS = updateTNSName;
var registerTNS = updateTNSName;

// src/token.ts
var import_torosdk5 = require("torosdk");
var getTokenBalance = async (address) => {
  try {
    const rawBal = await (0, import_torosdk5.getTokenBalance)({ address });
    return rawBal?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getTokenBalance");
  }
};
var getTokenMetadata = async () => {
  try {
    const [name, symbol, decimals] = await Promise.all([
      (0, import_torosdk5.getTokenName)(),
      (0, import_torosdk5.getTokenSymbol)(),
      (0, import_torosdk5.getTokenDecimal)()
    ]);
    return { name, symbol, decimals: Number(decimals) };
  } catch (error) {
    throw normalizeError(error, "getTokenMetadata");
  }
};
var getTokenAllowance = async (owner, spender) => {
  try {
    const result = await (0, import_torosdk5.getAllowance)({ owner, spender });
    return result?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getTokenAllowance");
  }
};
var getMinimumTokenAllowance = async (address) => {
  try {
    const result = await (0, import_torosdk5.getMinimumAllowance)({ address });
    return result?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getMinimumTokenAllowance");
  }
};
var getMaximumTokenAllowance = async (address) => {
  try {
    const result = await (0, import_torosdk5.getMaximumAllowance)({ address });
    return result?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getMaximumTokenAllowance");
  }
};
var getTokenTransactionFee = async (amount) => {
  try {
    const result = await (0, import_torosdk5.getTransactionFee)({ amount: String(amount) });
    return result?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getTokenTransactionFee");
  }
};
var isTokenEnrolled = async (address) => {
  try {
    const result = await (0, import_torosdk5.isEnrolled)({ address });
    return Boolean(result?.isenrolled ?? result);
  } catch (error) {
    throw normalizeError(error, "isTokenEnrolled");
  }
};
var isTokenFrozen = async (address) => {
  try {
    const result = await (0, import_torosdk5.isFrozen)({ address });
    return Boolean(result?.isfrozen ?? result);
  } catch (error) {
    throw normalizeError(error, "isTokenFrozen");
  }
};
var getTokenTotalCap = async () => {
  try {
    const result = await (0, import_torosdk5.getTotalCap)();
    return result?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getTokenTotalCap");
  }
};

// src/transactions.ts
var import_torosdk6 = require("torosdk");
var sendTransaction = async (currency, senderAddr, senderPwd, receiverAddr, amount) => {
  try {
    return await (0, import_torosdk6.transferCurrency)({ currency, senderAddr, senderPwd, receiverAddr, amount });
  } catch (error) {
    throw normalizeError(error, "sendTransaction");
  }
};
var getTransactions = async (address, count = 20) => {
  try {
    return await (0, import_torosdk6.getAddressTransactions)(address, count);
  } catch (error) {
    throw normalizeError(error, "getTransactions");
  }
};

// src/blockchain.ts
var import_torosdk7 = require("torosdk");
var getChainStatus = async () => {
  try {
    return await (0, import_torosdk7.getBlockchainStatus)();
  } catch (error) {
    throw normalizeError(error, "getChainStatus");
  }
};
var getBlockchainInfo = getChainStatus;
var getLatestBlock = async () => {
  try {
    return await (0, import_torosdk7.getLatestBlockData)();
  } catch (error) {
    throw normalizeError(error, "getLatestBlock");
  }
};
var getBlocks = async (count = 10) => {
  try {
    return await (0, import_torosdk7.getBlocksData)(count);
  } catch (error) {
    throw normalizeError(error, "getBlocks");
  }
};
var getChainTransactions = async (count = 20) => {
  try {
    return await (0, import_torosdk7.getBlockchainTransactions)(count);
  } catch (error) {
    throw normalizeError(error, "getChainTransactions");
  }
};
var getBlockByIdAdapter = async (id) => {
  try {
    return await (0, import_torosdk7.getBlockById)(id);
  } catch (error) {
    throw normalizeError(error, "getBlockById");
  }
};
var getTransactionByHashAdapter = async (hash) => {
  try {
    return await (0, import_torosdk7.getTransactionByHash)(hash);
  } catch (error) {
    throw normalizeError(error, "getTransactionByHash");
  }
};
var getTransactionByHash = getTransactionByHashAdapter;
var getTransactionReceipt = async (hash) => {
  try {
    return await (0, import_torosdk7.getTransactionReceiptById)(hash);
  } catch (error) {
    throw normalizeError(error, "getTransactionReceipt");
  }
};
var getEventByIdAdapter = async (id) => {
  try {
    return await (0, import_torosdk7.getEventById)(id);
  } catch (error) {
    throw normalizeError(error, "getEventById");
  }
};
var getAddressRoleAdapter = async (address) => {
  try {
    return await (0, import_torosdk7.getAddressRole)(address);
  } catch (error) {
    throw normalizeError(error, "getAddressRole");
  }
};
var getAddressBalanceAdapter = async (address) => {
  try {
    return await (0, import_torosdk7.getAddressBalance)({ address });
  } catch (error) {
    throw normalizeError(error, "getAddressBalance");
  }
};
var getAddressTransactionsAdapter = async (address, count = 20) => {
  try {
    return await (0, import_torosdk7.getAddressTransactions)(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressTransactions");
  }
};
var getAddressTransactionsRange = async (params) => {
  try {
    return await (0, import_torosdk7.getAddressTransactions)(params.address, params.count ?? 20);
  } catch (error) {
    throw normalizeError(error, "getAddressTransactionsRange");
  }
};
var getToroTransactions = async (count = 20) => {
  try {
    return await (0, import_torosdk7.getTransactionsToroWrapper)(count);
  } catch (error) {
    throw normalizeError(error, "getToroTransactions");
  }
};
var getAddressToroTransactions = async (address, count = 20) => {
  try {
    return await (0, import_torosdk7.getAddressTransactionsToro)(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressToroTransactions");
  }
};
var getDollarTransactions = async (count = 20) => {
  try {
    return await (0, import_torosdk7.getTransactionsDollarWrapper)(count);
  } catch (error) {
    throw normalizeError(error, "getDollarTransactions");
  }
};
var getAddressDollarTransactions = async (address, count = 20) => {
  try {
    return await (0, import_torosdk7.getAddressTransactionsDollar)(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressDollarTransactions");
  }
};
var getNairaTransactions = async (count = 20) => {
  try {
    return await (0, import_torosdk7.getTransactionsNairaWrapper)(count);
  } catch (error) {
    throw normalizeError(error, "getNairaTransactions");
  }
};
var getAddressNairaTransactions = async (address, count = 20) => {
  try {
    return await (0, import_torosdk7.getAddressTransactionsNaira)(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressNairaTransactions");
  }
};
var getEuroTransactions = async (count = 20) => {
  try {
    return await (0, import_torosdk7.getTransactionsEuroWrapper)(count);
  } catch (error) {
    throw normalizeError(error, "getEuroTransactions");
  }
};
var getAddressEuroTransactions = async (address, count = 20) => {
  try {
    return await (0, import_torosdk7.getAddressTransactionsEuro)(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressEuroTransactions");
  }
};
var getPoundTransactions = async (count = 20) => {
  try {
    return await (0, import_torosdk7.getTransactionsPoundWrapper)(count);
  } catch (error) {
    throw normalizeError(error, "getPoundTransactions");
  }
};
var getAddressPoundTransactions = async (address, count = 20) => {
  try {
    return await (0, import_torosdk7.getAddressTransactionsPound)(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressPoundTransactions");
  }
};
var getKSHTransactions = async (count = 20) => {
  try {
    return await (0, import_torosdk7.getTransactionsKSHWrapper)(count);
  } catch (error) {
    throw normalizeError(error, "getKSHTransactions");
  }
};
var getAddressKSHTransactions = async (address, count = 20) => {
  try {
    return await (0, import_torosdk7.getAddressTransactionsKSH)(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressKSHTransactions");
  }
};
var getZARTransactions = async (count = 20) => {
  try {
    return await (0, import_torosdk7.getTransactionsZARWrapper)(count);
  } catch (error) {
    throw normalizeError(error, "getZARTransactions");
  }
};
var getAddressZARTransactions = async (address, count = 20) => {
  try {
    return await (0, import_torosdk7.getAddressTransactionsZAR)(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressZARTransactions");
  }
};
var getTransactionsByRange = async (start = 0, end = 20) => {
  try {
    return await (0, import_torosdk7.getTransactionsRangeWrapper)(start, end);
  } catch (error) {
    throw normalizeError(error, "getTransactionsByRange");
  }
};
var getExchangeRates = async () => {
  try {
    return await (0, import_torosdk7.getSupportedAssetsExchangeRates)();
  } catch (error) {
    throw normalizeError(error, "getExchangeRates");
  }
};
var isValidAddress = async (address) => {
  try {
    return await (0, import_torosdk7.isAddressUtil)(address);
  } catch (error) {
    throw normalizeError(error, "isValidAddress");
  }
};

// src/payments.ts
var import_torosdk8 = require("torosdk");
var initiateDeposit = async (input) => {
  try {
    return await (0, import_torosdk8.depositFunds)(
      {
        userAddress: input.userAddress,
        username: input.username,
        amount: input.amount,
        currency: input.currency,
        admin: input.admin,
        adminpwd: input.adminpwd
      },
      input.extras
    );
  } catch (error) {
    throw normalizeError(error, "initiateDeposit");
  }
};
var confirmFiatDeposit = async (currency, transactionId) => {
  try {
    return await (0, import_torosdk8.confirmDeposit)({ currency, transactionId });
  } catch (error) {
    throw normalizeError(error, "confirmFiatDeposit");
  }
};
var performKYC = async (input) => {
  try {
    return await (0, import_torosdk8.performKYCForCustomer)(input);
  } catch (error) {
    throw normalizeError(error, "performKYC");
  }
};
var checkKYCStatus = async (address) => {
  try {
    const result = await (0, import_torosdk8.isAddressKYCVerified)({ address });
    return Boolean(result?.verified ?? result);
  } catch (error) {
    throw normalizeError(error, "checkKYCStatus");
  }
};
var getBankListUSD = async (admin, adminpwd) => {
  try {
    return await (0, import_torosdk8.getBankListUSD)({ admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "getBankListUSD");
  }
};
var getBankListNGN = async (admin, adminpwd) => {
  try {
    return await (0, import_torosdk8.getBankListNGN)({ admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "getBankListNGN");
  }
};
var recordWithdrawal = async (input) => {
  try {
    return await (0, import_torosdk8.recordFiatWithdrawal)(input);
  } catch (error) {
    throw normalizeError(error, "recordWithdrawal");
  }
};
var verifyBankAccountNGN = async (destinationInstitutionCode, accountNumber, admin, adminpwd) => {
  try {
    return await (0, import_torosdk8.verifyBankAccountNameNGN)({ destinationInstitutionCode, accountNumber, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "verifyBankAccountNGN");
  }
};
var getFiatTransactions = async (input) => {
  try {
    return await (0, import_torosdk8.getFiatTransactionsAddressRange)(input);
  } catch (error) {
    throw normalizeError(error, "getFiatTransactions");
  }
};
var getFiatWithdrawals = async (input) => {
  try {
    return await (0, import_torosdk8.getFiatWithdrawalsAddressRange)(input);
  } catch (error) {
    throw normalizeError(error, "getFiatWithdrawals");
  }
};
var initializeCryptoPayment = async (input) => {
  try {
    const { admin, adminpwd, ...params } = input;
    return await (0, import_torosdk8.paymentInitializeCrypto)(params, admin, adminpwd);
  } catch (error) {
    throw normalizeError(error, "initializeCryptoPayment");
  }
};
var recordCryptoPayment = async (currency, txid, admin, adminpwd) => {
  try {
    return await (0, import_torosdk8.recordCryptoPayment)({ currency, txid }, admin, adminpwd);
  } catch (error) {
    throw normalizeError(error, "recordCryptoPayment");
  }
};

// src/virtualwallet.ts
var import_torosdk9 = require("torosdk");
var createVirtualWallet = async (input) => {
  try {
    return await (0, import_torosdk9.createVirtualWallet)(input);
  } catch (error) {
    throw normalizeError(error, "createVirtualWallet");
  }
};
var fetchVirtualWallet = async (virtualwallet, admin, adminpwd) => {
  try {
    return await (0, import_torosdk9.fetchVirtualWallet)({ virtualwallet, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "fetchVirtualWallet");
  }
};
var fetchVirtualWalletByAddress = async (address, admin, adminpwd) => {
  try {
    return await (0, import_torosdk9.fetchVirtualWalletByAddress)({ address, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "fetchVirtualWalletByAddress");
  }
};
var updateVirtualWalletTransactions = async (walletaddress, admin, adminpwd) => {
  try {
    return await (0, import_torosdk9.updateVirtualWalletTxs)({ walletaddress, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "updateVirtualWalletTransactions");
  }
};

// src/bridge.ts
var import_torosdk10 = require("torosdk");
var getBridgeChainBalance = async (network, params, admin, adminpwd) => {
  try {
    return admin ? await (0, import_torosdk10.getBridgeBalance)(network, params, admin, adminpwd) : await (0, import_torosdk10.getBridgeBalance)(network, params);
  } catch (error) {
    throw normalizeError(error, "getBridgeChainBalance");
  }
};
var getBridgeChainTokenBalance = async (network, params, admin, adminpwd) => {
  try {
    return admin ? await (0, import_torosdk10.getBridgeTokenBalance)(network, params, admin, adminpwd) : await (0, import_torosdk10.getBridgeTokenBalance)(network, params);
  } catch (error) {
    throw normalizeError(error, "getBridgeChainTokenBalance");
  }
};
var getBridgeChainTransactions = async (network, params, admin, adminpwd) => {
  try {
    return admin ? await (0, import_torosdk10.getBridgeTransactions)(network, params, admin, adminpwd) : await (0, import_torosdk10.getBridgeTransactions)(network, params);
  } catch (error) {
    throw normalizeError(error, "getBridgeChainTransactions");
  }
};
var getBridgeChainTokenTransactions = async (network, params, admin, adminpwd) => {
  try {
    return admin ? await (0, import_torosdk10.getBridgeTokenTransactions)(network, params, admin, adminpwd) : await (0, import_torosdk10.getBridgeTokenTransactions)(network, params);
  } catch (error) {
    throw normalizeError(error, "getBridgeChainTokenTransactions");
  }
};
var bridgeToken = async (network, params, admin, adminpwd) => {
  try {
    return admin ? await (0, import_torosdk10.bridgeTokenFromChain)(network, params, admin, adminpwd) : await (0, import_torosdk10.bridgeTokenFromChain)(network, params);
  } catch (error) {
    throw normalizeError(error, "bridgeToken");
  }
};
var getBridgeFeeEstimate = async (network, params, admin, adminpwd) => {
  try {
    return admin ? await (0, import_torosdk10.getBridgeTokenFeeEstimate)(network, params, admin, adminpwd) : await (0, import_torosdk10.getBridgeTokenFeeEstimate)(network, params);
  } catch (error) {
    throw normalizeError(error, "getBridgeFeeEstimate");
  }
};
var createSolanaAddress = async (admin, adminpwd) => {
  try {
    return await (0, import_torosdk10.createSolanaAddress)({ admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "createSolanaAddress");
  }
};
var isValidSolanaAddress = async (address) => {
  try {
    return await (0, import_torosdk10.isValidSolanaAddress)(address);
  } catch (error) {
    throw normalizeError(error, "isValidSolanaAddress");
  }
};
var createToronetSolanaAddress = async (addr, pwd) => {
  try {
    return await (0, import_torosdk10.createToronetSolanaAddress)({ addr, pwd });
  } catch (error) {
    throw normalizeError(error, "createToronetSolanaAddress");
  }
};
var getSolLatestBlock = async () => {
  try {
    return await (0, import_torosdk10.getSolLatestBlock)();
  } catch (error) {
    throw normalizeError(error, "getSolLatestBlock");
  }
};
var getSolBalance = async (address) => {
  try {
    return await (0, import_torosdk10.getSolBalance)({ address });
  } catch (error) {
    throw normalizeError(error, "getSolBalance");
  }
};
var getSolTokenBalance = async (address, contractaddress) => {
  try {
    return await (0, import_torosdk10.getSolTokenBalance)({ address, contractaddress });
  } catch (error) {
    throw normalizeError(error, "getSolTokenBalance");
  }
};
var getSolTransactions = async (address) => {
  try {
    return await (0, import_torosdk10.getSolTransactions)({ address });
  } catch (error) {
    throw normalizeError(error, "getSolTransactions");
  }
};
var getSolTokenTransactions = async (address, contractaddress) => {
  try {
    return await (0, import_torosdk10.getSolTokenTransactions)({ address, contractaddress });
  } catch (error) {
    throw normalizeError(error, "getSolTokenTransactions");
  }
};
var transferSolana = async (params, admin, adminpwd) => {
  try {
    return await (0, import_torosdk10.transferSolana)(params, admin, adminpwd);
  } catch (error) {
    throw normalizeError(error, "transferSolana");
  }
};
var transferSolToken = async (params, admin, adminpwd) => {
  try {
    return await (0, import_torosdk10.transferSolToken)(params, admin, adminpwd);
  } catch (error) {
    throw normalizeError(error, "transferSolToken");
  }
};
var bridgeSolToken = async (params) => {
  try {
    return await (0, import_torosdk10.bridgeTokenSol)(params);
  } catch (error) {
    throw normalizeError(error, "bridgeSolToken");
  }
};
var getSolBridgeFee = async (contractaddress, amount) => {
  try {
    return await (0, import_torosdk10.getBridgeTokenFeeSol)({ network: import_torosdk10.BridgeNetwork.Solana, contractaddress, amount });
  } catch (error) {
    throw normalizeError(error, "getSolBridgeFee");
  }
};
var getBridgeBalance = getBridgeChainBalance;
var getBridgeTokenBalance = getBridgeChainTokenBalance;
var getBridgeTransactions = getBridgeChainTransactions;
var getBridgeTokenTransactions = getBridgeChainTokenTransactions;
var getBridgeTokenFeeEstimate = getBridgeFeeEstimate;
var bridgeTokenFromChain = bridgeToken;

// src/keystore.ts
var import_torosdk11 = require("torosdk");
var importWalletFromPrivateKey = async (pvKey, password) => {
  try {
    return await (0, import_torosdk11.importWalletFromPrivateKeyAndPassword)({ pvKey, password });
  } catch (error) {
    throw normalizeError(error, "importWalletFromPrivateKey");
  }
};
var getWalletKey = async (address) => {
  try {
    return await (0, import_torosdk11.getWalletKey)({ address });
  } catch (error) {
    throw normalizeError(error, "getWalletKey");
  }
};
var updateWalletPassword = async (address, oldPassword, newPassword) => {
  try {
    return await (0, import_torosdk11.updatePassword)({ address, oldPassword, newPassword });
  } catch (error) {
    throw normalizeError(error, "updateWalletPassword");
  }
};
var deleteWallet = async (address, password) => {
  try {
    return await (0, import_torosdk11.deleteWallet)({ address, password });
  } catch (error) {
    throw normalizeError(error, "deleteWallet");
  }
};

// src/roles.ts
var import_torosdk12 = require("torosdk");
var isAdmin = async (address) => {
  try {
    const result = await (0, import_torosdk12.isAdmin)({ address });
    return Boolean(result?.isadmin ?? result);
  } catch (error) {
    throw normalizeError(error, "isAdmin");
  }
};
var isSuperAdmin = async (address) => {
  try {
    const result = await (0, import_torosdk12.isSuperAdmin)({ address });
    return Boolean(result?.issuperadmin ?? result);
  } catch (error) {
    throw normalizeError(error, "isSuperAdmin");
  }
};
var isDebugger = async (address) => {
  try {
    const result = await (0, import_torosdk12.isDebugger)({ address });
    return Boolean(result?.isdebugger ?? result);
  } catch (error) {
    throw normalizeError(error, "isDebugger");
  }
};
var getAdminIndex = async (address) => {
  try {
    return await (0, import_torosdk12.getAdminIndex)({ address });
  } catch (error) {
    throw normalizeError(error, "getAdminIndex");
  }
};
var getNumberOfAdmins = async () => {
  try {
    return await (0, import_torosdk12.getNumberOfAdmin)();
  } catch (error) {
    throw normalizeError(error, "getNumberOfAdmins");
  }
};
var getAdminByIndex = async (index) => {
  try {
    return await (0, import_torosdk12.getAdminByIndex)({ index });
  } catch (error) {
    throw normalizeError(error, "getAdminByIndex");
  }
};
var addAdmin = async (superAdminAddress, superAdminPassword, adminAddress) => {
  try {
    return await (0, import_torosdk12.addAdmin)({ address: superAdminAddress, password: superAdminPassword, adminAddress });
  } catch (error) {
    throw normalizeError(error, "addAdmin");
  }
};
var removeAdmin = async (superAdminAddress, superAdminPassword, adminAddress) => {
  try {
    return await (0, import_torosdk12.removeAdmin)({ address: superAdminAddress, password: superAdminPassword, adminAddress });
  } catch (error) {
    throw normalizeError(error, "removeAdmin");
  }
};
var addSuperAdmin = async (superAdminAddress, superAdminPassword, newSuperAdminAddress) => {
  try {
    return await (0, import_torosdk12.addSuperAdmin)({ address: superAdminAddress, password: superAdminPassword, superAdminAddress: newSuperAdminAddress });
  } catch (error) {
    throw normalizeError(error, "addSuperAdmin");
  }
};

// src/products.ts
var import_torosdk13 = require("torosdk");
var getProject = async (admin, getbalances = true) => {
  try {
    return await (0, import_torosdk13.getProject)({ admin, getbalances: getbalances ? "true" : "false" });
  } catch (error) {
    throw normalizeError(error, "getProject");
  }
};
var getProduct = async (productId, admin, adminpwd) => {
  try {
    return await (0, import_torosdk13.getProduct)({ productId, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "getProduct");
  }
};
var createProduct = async (input) => {
  try {
    return await (0, import_torosdk13.recordProduct)(input);
  } catch (error) {
    throw normalizeError(error, "createProduct");
  }
};
var updateProduct = async (input) => {
  try {
    return await (0, import_torosdk13.updateProduct)(input);
  } catch (error) {
    throw normalizeError(error, "updateProduct");
  }
};

// src/deployer.ts
var import_torosdk14 = require("torosdk");
var deployContract = async (input) => {
  try {
    return await (0, import_torosdk14.deploySmartContract)({
      abi: input.abi,
      bytecode: input.bytecode,
      constructorArgs: input.constructorArgs ?? [],
      owner: input.owner ?? "",
      token: input.token,
      network: input.network
    });
  } catch (error) {
    throw normalizeError(error, "deployContract");
  }
};

// src/currency.ts
var import_torosdk15 = require("torosdk");
var getCurrencyBalance = async (currency, address) => {
  try {
    const result = await (0, import_torosdk15.getCurrencyBalance)({ currency, address });
    return result?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getCurrencyBalance");
  }
};
var transferCurrencyFunds = async (currency, senderAddr, senderPwd, receiverAddr, amount) => {
  try {
    return await (0, import_torosdk15.transferCurrency)({ currency, senderAddr, senderPwd, receiverAddr, amount });
  } catch (error) {
    throw normalizeError(error, "transferCurrencyFunds");
  }
};
var allowCurrencyTransfer = async (currency, address, password) => {
  try {
    return await (0, import_torosdk15.allowTransfer)({ currency, address, password });
  } catch (error) {
    throw normalizeError(error, "allowCurrencyTransfer");
  }
};
var disableCurrencyTransfer = async (currency, address, password) => {
  try {
    return await (0, import_torosdk15.disallowTransfer)({ currency, address, password });
  } catch (error) {
    throw normalizeError(error, "disableCurrencyTransfer");
  }
};
var freezeCurrencyAddress = async (params) => {
  try {
    return await (0, import_torosdk15.freezeAddress)(params);
  } catch (error) {
    throw normalizeError(error, "freezeCurrencyAddress");
  }
};
var unfreezeCurrencyAddress = async (params) => {
  try {
    return await (0, import_torosdk15.unfreezeAddress)(params);
  } catch (error) {
    throw normalizeError(error, "unfreezeCurrencyAddress");
  }
};
var enrollCurrencyAddress = async (params) => {
  try {
    return await (0, import_torosdk15.enrollAddress)(params);
  } catch (error) {
    throw normalizeError(error, "enrollCurrencyAddress");
  }
};
var mintCurrencyFunds = async (params) => {
  try {
    return await (0, import_torosdk15.mintCurrency)(params);
  } catch (error) {
    throw normalizeError(error, "mintCurrencyFunds");
  }
};
var burnCurrencyFunds = async (params) => {
  try {
    return await (0, import_torosdk15.burnCurrency)(params);
  } catch (error) {
    throw normalizeError(error, "burnCurrencyFunds");
  }
};

// src/storage.ts
var import_torosdk16 = require("torosdk");
var isStorageOn = async () => {
  try {
    return await (0, import_torosdk16.isStorageOn)();
  } catch (error) {
    throw normalizeError(error, "isStorageOn");
  }
};
var isContractRegistered = async (contract) => {
  try {
    return await (0, import_torosdk16.isContractRegistered)({ contract });
  } catch (error) {
    throw normalizeError(error, "isContractRegistered");
  }
};
var getStorageVersion = async () => {
  try {
    return await (0, import_torosdk16.getStorageVersion)();
  } catch (error) {
    throw normalizeError(error, "getStorageVersion");
  }
};
var isStorageOwner = async (address) => {
  try {
    return await (0, import_torosdk16.isOwner)({ address });
  } catch (error) {
    throw normalizeError(error, "isStorageOwner");
  }
};
var getStorageOwner = async () => {
  try {
    return await (0, import_torosdk16.getOwner)();
  } catch (error) {
    throw normalizeError(error, "getStorageOwner");
  }
};
var setStorageOn = async (address, password) => {
  try {
    return await (0, import_torosdk16.setStorageOn)({ address, password });
  } catch (error) {
    throw normalizeError(error, "setStorageOn");
  }
};
var setStorageOff = async (address, password) => {
  try {
    return await (0, import_torosdk16.setStorageOff)({ address, password });
  } catch (error) {
    throw normalizeError(error, "setStorageOff");
  }
};
var registerStorageContract = async (address, password, contract) => {
  try {
    return await (0, import_torosdk16.registerContract)({ address, password, contract });
  } catch (error) {
    throw normalizeError(error, "registerStorageContract");
  }
};
var unregisterStorageContract = async (address, password, contract) => {
  try {
    return await (0, import_torosdk16.unregisterContract)({ address, password, contract });
  } catch (error) {
    throw normalizeError(error, "unregisterStorageContract");
  }
};
var increaseStorageVersion = async (address, password) => {
  try {
    return await (0, import_torosdk16.increaseStorageVersion)({ address, password });
  } catch (error) {
    throw normalizeError(error, "increaseStorageVersion");
  }
};
var decreaseStorageVersion = async (address, password) => {
  try {
    return await (0, import_torosdk16.decreaseStorageVersion)({ address, password });
  } catch (error) {
    throw normalizeError(error, "decreaseStorageVersion");
  }
};
var setStorageVersion = async (address, password, version) => {
  try {
    return await (0, import_torosdk16.setStorageVersion)({ address, password, version });
  } catch (error) {
    throw normalizeError(error, "setStorageVersion");
  }
};
var transferStorageOwnership = async (address, password, newOwner) => {
  try {
    return await (0, import_torosdk16.transferOwnership)({ address, password, newOwner });
  } catch (error) {
    throw normalizeError(error, "transferStorageOwnership");
  }
};

// src/swap.ts
var sdk = __toESM(require("torosdk"));
var getSwapQuote2 = async (params) => {
  try {
    if (typeof sdk.getSwapQuote === "function") {
      return await sdk.getSwapQuote(params);
    }
    throw new Error("getSwapQuote is not supported in this environment");
  } catch (error) {
    throw normalizeError(error, "getSwapQuote");
  }
};
var swapCurrency2 = async (params) => {
  try {
    if (typeof sdk.swapCurrency === "function") {
      return await sdk.swapCurrency(params);
    }
    throw new Error("swapCurrency is not supported in this environment");
  } catch (error) {
    throw normalizeError(error, "swapCurrency");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BridgeNetwork,
  Currency,
  ToroError,
  addAdmin,
  addSuperAdmin,
  allowCurrencyTransfer,
  bridgeSolToken,
  bridgeToken,
  bridgeTokenFromChain,
  burnCurrencyFunds,
  checkKYCStatus,
  confirmFiatDeposit,
  createProduct,
  createSolanaAddress,
  createToronetSolanaAddress,
  createVirtualWallet,
  createWallet,
  decreaseStorageVersion,
  deleteTNSName,
  deleteWallet,
  deployContract,
  disableCurrencyTransfer,
  enrollCurrencyAddress,
  fetchVirtualWallet,
  fetchVirtualWalletByAddress,
  formatToroAmount,
  formatToroCurrency,
  formatToroTransaction,
  freezeCurrencyAddress,
  fromWei,
  getAddressBalanceAdapter,
  getAddressDollarTransactions,
  getAddressEuroTransactions,
  getAddressKSHTransactions,
  getAddressNairaTransactions,
  getAddressPoundTransactions,
  getAddressRoleAdapter,
  getAddressToroTransactions,
  getAddressTransactionsAdapter,
  getAddressTransactionsRange,
  getAddressZARTransactions,
  getAdminByIndex,
  getAdminIndex,
  getBalance,
  getBankListNGN,
  getBankListUSD,
  getBlockByIdAdapter,
  getBlockchainInfo,
  getBlocks,
  getBridgeBalance,
  getBridgeChainBalance,
  getBridgeChainTokenBalance,
  getBridgeChainTokenTransactions,
  getBridgeChainTransactions,
  getBridgeFeeEstimate,
  getBridgeTokenBalance,
  getBridgeTokenFeeEstimate,
  getBridgeTokenTransactions,
  getBridgeTransactions,
  getChainStatus,
  getChainTransactions,
  getConfig,
  getCurrencyBalance,
  getDollarTransactions,
  getEuroTransactions,
  getEventByIdAdapter,
  getExchangeRates,
  getFiatTransactions,
  getFiatWithdrawals,
  getKSHTransactions,
  getLatestBlock,
  getMaximumTokenAllowance,
  getMinimumTokenAllowance,
  getNairaTransactions,
  getNumberOfAdmins,
  getPoundTransactions,
  getProduct,
  getProject,
  getSolBalance,
  getSolBridgeFee,
  getSolLatestBlock,
  getSolTokenBalance,
  getSolTokenTransactions,
  getSolTransactions,
  getStorageOwner,
  getStorageVersion,
  getSwapQuote,
  getTokenAllowance,
  getTokenBalance,
  getTokenMetadata,
  getTokenTotalCap,
  getTokenTransactionFee,
  getToroTransactions,
  getTransactionByHash,
  getTransactionByHashAdapter,
  getTransactionReceipt,
  getTransactions,
  getTransactionsByRange,
  getWalletKey,
  getZARTransactions,
  importWalletFromPrivateKey,
  importWalletFromPrivateKeyAndPassword,
  increaseStorageVersion,
  initToroforge,
  initializeCryptoPayment,
  initiateDeposit,
  isAdmin,
  isContractRegistered,
  isDebugger,
  isStorageOn,
  isStorageOwner,
  isSuperAdmin,
  isTNSAvailable,
  isTokenEnrolled,
  isTokenFrozen,
  isValidAddress,
  isValidSolanaAddress,
  lookupTNS,
  lookupTNSAddress,
  mintCurrencyFunds,
  normalizeError,
  parseToroError,
  performKYC,
  recordCryptoPayment,
  recordWithdrawal,
  registerStorageContract,
  registerTNS,
  removeAdmin,
  resolveTNS,
  resolveTNSName,
  sendTransaction,
  setStorageOff,
  setStorageOn,
  setStorageVersion,
  setTNS,
  shortenAddress,
  swapCurrency,
  toWei,
  transferCurrencyFunds,
  transferSolToken,
  transferSolana,
  transferStorageOwnership,
  unfreezeCurrencyAddress,
  unregisterStorageContract,
  updateProduct,
  updateTNSName,
  updateVirtualWalletTransactions,
  updateWalletPassword,
  validateToroAddress,
  verifyBankAccountNGN,
  verifyWalletPassword
});
