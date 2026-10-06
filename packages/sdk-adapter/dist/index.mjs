// src/config.ts
import { initializeSDK, getSDKConfig } from "torosdk";
var isInitialized = false;
var initToroforge = (config) => {
  initializeSDK(config);
  isInitialized = true;
};
var getConfig = () => {
  if (!isInitialized) {
    throw new Error("Toroforge SDK adapter is not initialized. Call initToroforge first.");
  }
  return getSDKConfig();
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
import {
  createWallet as sdkCreateWallet,
  isTNSAvailable as sdkIsTNSAvailable,
  verifyWalletPassword as sdkVerifyWalletPassword,
  importWalletFromPrivateKeyAndPassword as sdkImportWallet
} from "torosdk";
var createWallet = async (username, password) => {
  try {
    return await sdkCreateWallet({ username, password });
  } catch (error) {
    throw normalizeError(error, "createWallet");
  }
};
var isTNSAvailable = async (username) => {
  try {
    return await sdkIsTNSAvailable({ username });
  } catch (error) {
    throw normalizeError(error, "isTNSAvailable");
  }
};
var verifyWalletPassword = async (address, password) => {
  try {
    const result = await sdkVerifyWalletPassword({ address, password });
    return Boolean(result?.valueOf());
  } catch (error) {
    throw normalizeError(error, "verifyWalletPassword");
  }
};
var importWalletFromPrivateKeyAndPassword = async (pvKey, password) => {
  try {
    const result = await sdkImportWallet({ pvKey, password });
    return typeof result === "string" ? result : String(result);
  } catch (error) {
    throw normalizeError(error, "importWalletFromPrivateKeyAndPassword");
  }
};

// src/balance.ts
import { getBalance as sdkGetBalance } from "torosdk";
var getBalance = async (address) => {
  try {
    const rawBalance = await sdkGetBalance({ address });
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
import { getName as sdkGetName, getAddr as sdkGetAddr, updateName as sdkUpdateName, deleteName as sdkDeleteName } from "torosdk";
var resolveTNSName = async (name) => {
  try {
    const address = await sdkGetAddr({ name });
    return address || null;
  } catch (error) {
    throw normalizeError(error, "resolveTNSName");
  }
};
var lookupTNSAddress = async (address) => {
  try {
    const name = await sdkGetName({ address });
    return name || null;
  } catch (error) {
    throw normalizeError(error, "lookupTNSAddress");
  }
};
var updateTNSName = async (address, password, username) => {
  try {
    return await sdkUpdateName({ address, password, username });
  } catch (error) {
    throw normalizeError(error, "updateTNSName");
  }
};
var deleteTNSName = async (address, password) => {
  try {
    return await sdkDeleteName({ address, password });
  } catch (error) {
    throw normalizeError(error, "deleteTNSName");
  }
};
var resolveTNS = resolveTNSName;
var lookupTNS = lookupTNSAddress;
var setTNS = updateTNSName;
var registerTNS = updateTNSName;

// src/token.ts
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
  getTotalCap as sdkGetTotalCap
} from "torosdk";
var getTokenBalance = async (address) => {
  try {
    const rawBal = await sdkGetTokenBalance({ address });
    return rawBal?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getTokenBalance");
  }
};
var getTokenMetadata = async () => {
  try {
    const [name, symbol, decimals] = await Promise.all([
      sdkGetTokenName(),
      sdkGetTokenSymbol(),
      sdkGetTokenDecimal()
    ]);
    return { name, symbol, decimals: Number(decimals) };
  } catch (error) {
    throw normalizeError(error, "getTokenMetadata");
  }
};
var getTokenAllowance = async (owner, spender) => {
  try {
    const result = await sdkGetAllowance({ owner, spender });
    return result?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getTokenAllowance");
  }
};
var getMinimumTokenAllowance = async (address) => {
  try {
    const result = await sdkGetMinimumAllowance({ address });
    return result?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getMinimumTokenAllowance");
  }
};
var getMaximumTokenAllowance = async (address) => {
  try {
    const result = await sdkGetMaximumAllowance({ address });
    return result?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getMaximumTokenAllowance");
  }
};
var getTokenTransactionFee = async (amount) => {
  try {
    const result = await sdkGetTransactionFee({ amount: String(amount) });
    return result?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getTokenTransactionFee");
  }
};
var isTokenEnrolled = async (address) => {
  try {
    const result = await sdkIsEnrolled({ address });
    return Boolean(result?.isenrolled ?? result);
  } catch (error) {
    throw normalizeError(error, "isTokenEnrolled");
  }
};
var isTokenFrozen = async (address) => {
  try {
    const result = await sdkIsFrozen({ address });
    return Boolean(result?.isfrozen ?? result);
  } catch (error) {
    throw normalizeError(error, "isTokenFrozen");
  }
};
var getTokenTotalCap = async () => {
  try {
    const result = await sdkGetTotalCap();
    return result?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getTokenTotalCap");
  }
};

// src/transactions.ts
import { transferCurrency, getAddressTransactions } from "torosdk";
var sendTransaction = async (currency, senderAddr, senderPwd, receiverAddr, amount) => {
  try {
    return await transferCurrency({ currency, senderAddr, senderPwd, receiverAddr, amount });
  } catch (error) {
    throw normalizeError(error, "sendTransaction");
  }
};
var getTransactions = async (address, count = 20) => {
  try {
    return await getAddressTransactions(address, count);
  } catch (error) {
    throw normalizeError(error, "getTransactions");
  }
};

// src/blockchain.ts
import {
  getBlockchainStatus,
  getLatestBlockData,
  getBlocksData,
  getBlockchainTransactions,
  getAddressRole,
  getAddressBalance,
  getBlockById,
  getTransactionByHash as getTransactionByHashSDK,
  getTransactionReceiptById,
  getEventById,
  getAddressTransactions as getAddressTransactions2,
  getSupportedAssetsExchangeRates,
  getAddressTransactions as getAddrTransactionsRange,
  getTransactionsToroWrapper,
  getAddressTransactionsToro,
  getTransactionsDollarWrapper,
  getAddressTransactionsDollar,
  getTransactionsNairaWrapper,
  getAddressTransactionsNaira,
  getTransactionsEuroWrapper,
  getAddressTransactionsEuro,
  getTransactionsPoundWrapper,
  getAddressTransactionsPound,
  getTransactionsKSHWrapper,
  getAddressTransactionsKSH,
  getTransactionsZARWrapper,
  getAddressTransactionsZAR,
  getTransactionsRangeWrapper,
  isAddressUtil
} from "torosdk";
var getChainStatus = async () => {
  try {
    return await getBlockchainStatus();
  } catch (error) {
    throw normalizeError(error, "getChainStatus");
  }
};
var getBlockchainInfo = getChainStatus;
var getLatestBlock = async () => {
  try {
    return await getLatestBlockData();
  } catch (error) {
    throw normalizeError(error, "getLatestBlock");
  }
};
var getBlocks = async (count = 10) => {
  try {
    return await getBlocksData(count);
  } catch (error) {
    throw normalizeError(error, "getBlocks");
  }
};
var getChainTransactions = async (count = 20) => {
  try {
    return await getBlockchainTransactions(count);
  } catch (error) {
    throw normalizeError(error, "getChainTransactions");
  }
};
var getBlockByIdAdapter = async (id) => {
  try {
    return await getBlockById(id);
  } catch (error) {
    throw normalizeError(error, "getBlockById");
  }
};
var getTransactionByHashAdapter = async (hash) => {
  try {
    return await getTransactionByHashSDK(hash);
  } catch (error) {
    throw normalizeError(error, "getTransactionByHash");
  }
};
var getTransactionByHash = getTransactionByHashAdapter;
var getTransactionReceipt = async (hash) => {
  try {
    return await getTransactionReceiptById(hash);
  } catch (error) {
    throw normalizeError(error, "getTransactionReceipt");
  }
};
var getEventByIdAdapter = async (id) => {
  try {
    return await getEventById(id);
  } catch (error) {
    throw normalizeError(error, "getEventById");
  }
};
var getAddressRoleAdapter = async (address) => {
  try {
    return await getAddressRole(address);
  } catch (error) {
    throw normalizeError(error, "getAddressRole");
  }
};
var getAddressBalanceAdapter = async (address) => {
  try {
    return await getAddressBalance({ address });
  } catch (error) {
    throw normalizeError(error, "getAddressBalance");
  }
};
var getAddressTransactionsAdapter = async (address, count = 20) => {
  try {
    return await getAddressTransactions2(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressTransactions");
  }
};
var getAddressTransactionsRange = async (params) => {
  try {
    return await getAddrTransactionsRange(params.address, params.count ?? 20);
  } catch (error) {
    throw normalizeError(error, "getAddressTransactionsRange");
  }
};
var getToroTransactions = async (count = 20) => {
  try {
    return await getTransactionsToroWrapper(count);
  } catch (error) {
    throw normalizeError(error, "getToroTransactions");
  }
};
var getAddressToroTransactions = async (address, count = 20) => {
  try {
    return await getAddressTransactionsToro(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressToroTransactions");
  }
};
var getDollarTransactions = async (count = 20) => {
  try {
    return await getTransactionsDollarWrapper(count);
  } catch (error) {
    throw normalizeError(error, "getDollarTransactions");
  }
};
var getAddressDollarTransactions = async (address, count = 20) => {
  try {
    return await getAddressTransactionsDollar(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressDollarTransactions");
  }
};
var getNairaTransactions = async (count = 20) => {
  try {
    return await getTransactionsNairaWrapper(count);
  } catch (error) {
    throw normalizeError(error, "getNairaTransactions");
  }
};
var getAddressNairaTransactions = async (address, count = 20) => {
  try {
    return await getAddressTransactionsNaira(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressNairaTransactions");
  }
};
var getEuroTransactions = async (count = 20) => {
  try {
    return await getTransactionsEuroWrapper(count);
  } catch (error) {
    throw normalizeError(error, "getEuroTransactions");
  }
};
var getAddressEuroTransactions = async (address, count = 20) => {
  try {
    return await getAddressTransactionsEuro(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressEuroTransactions");
  }
};
var getPoundTransactions = async (count = 20) => {
  try {
    return await getTransactionsPoundWrapper(count);
  } catch (error) {
    throw normalizeError(error, "getPoundTransactions");
  }
};
var getAddressPoundTransactions = async (address, count = 20) => {
  try {
    return await getAddressTransactionsPound(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressPoundTransactions");
  }
};
var getKSHTransactions = async (count = 20) => {
  try {
    return await getTransactionsKSHWrapper(count);
  } catch (error) {
    throw normalizeError(error, "getKSHTransactions");
  }
};
var getAddressKSHTransactions = async (address, count = 20) => {
  try {
    return await getAddressTransactionsKSH(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressKSHTransactions");
  }
};
var getZARTransactions = async (count = 20) => {
  try {
    return await getTransactionsZARWrapper(count);
  } catch (error) {
    throw normalizeError(error, "getZARTransactions");
  }
};
var getAddressZARTransactions = async (address, count = 20) => {
  try {
    return await getAddressTransactionsZAR(address, count);
  } catch (error) {
    throw normalizeError(error, "getAddressZARTransactions");
  }
};
var getTransactionsByRange = async (start = 0, end = 20) => {
  try {
    return await getTransactionsRangeWrapper(start, end);
  } catch (error) {
    throw normalizeError(error, "getTransactionsByRange");
  }
};
var getExchangeRates = async () => {
  try {
    return await getSupportedAssetsExchangeRates();
  } catch (error) {
    throw normalizeError(error, "getExchangeRates");
  }
};
var isValidAddress = async (address) => {
  try {
    return await isAddressUtil(address);
  } catch (error) {
    throw normalizeError(error, "isValidAddress");
  }
};

// src/payments.ts
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
  recordCryptoPayment as sdkRecordCryptoPayment
} from "torosdk";
var initiateDeposit = async (input) => {
  try {
    return await sdkDepositFunds(
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
    return await sdkConfirmDeposit({ currency, transactionId });
  } catch (error) {
    throw normalizeError(error, "confirmFiatDeposit");
  }
};
var performKYC = async (input) => {
  try {
    return await sdkPerformKYC(input);
  } catch (error) {
    throw normalizeError(error, "performKYC");
  }
};
var checkKYCStatus = async (address) => {
  try {
    const result = await sdkIsKYCVerified({ address });
    return Boolean(result?.verified ?? result);
  } catch (error) {
    throw normalizeError(error, "checkKYCStatus");
  }
};
var getBankListUSD = async (admin, adminpwd) => {
  try {
    return await sdkGetBankListUSD({ admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "getBankListUSD");
  }
};
var getBankListNGN = async (admin, adminpwd) => {
  try {
    return await sdkGetBankListNGN({ admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "getBankListNGN");
  }
};
var recordWithdrawal = async (input) => {
  try {
    return await sdkRecordFiatWithdrawal(input);
  } catch (error) {
    throw normalizeError(error, "recordWithdrawal");
  }
};
var verifyBankAccountNGN = async (destinationInstitutionCode, accountNumber, admin, adminpwd) => {
  try {
    return await sdkVerifyBankAccountNGN({ destinationInstitutionCode, accountNumber, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "verifyBankAccountNGN");
  }
};
var getFiatTransactions = async (input) => {
  try {
    return await sdkGetFiatTxRange(input);
  } catch (error) {
    throw normalizeError(error, "getFiatTransactions");
  }
};
var getFiatWithdrawals = async (input) => {
  try {
    return await sdkGetFiatWithdrawalsRange(input);
  } catch (error) {
    throw normalizeError(error, "getFiatWithdrawals");
  }
};
var initializeCryptoPayment = async (input) => {
  try {
    const { admin, adminpwd, ...params } = input;
    return await sdkPaymentInitializeCrypto(params, admin, adminpwd);
  } catch (error) {
    throw normalizeError(error, "initializeCryptoPayment");
  }
};
var recordCryptoPayment = async (currency, txid, admin, adminpwd) => {
  try {
    return await sdkRecordCryptoPayment({ currency, txid }, admin, adminpwd);
  } catch (error) {
    throw normalizeError(error, "recordCryptoPayment");
  }
};

// src/virtualwallet.ts
import {
  createVirtualWallet as sdkCreateVirtualWallet,
  fetchVirtualWallet as sdkFetchVirtualWallet,
  fetchVirtualWalletByAddress as sdkFetchVirtualWalletByAddress,
  updateVirtualWalletTxs as sdkUpdateVirtualWalletTxs
} from "torosdk";
var createVirtualWallet = async (input) => {
  try {
    return await sdkCreateVirtualWallet(input);
  } catch (error) {
    throw normalizeError(error, "createVirtualWallet");
  }
};
var fetchVirtualWallet = async (virtualwallet, admin, adminpwd) => {
  try {
    return await sdkFetchVirtualWallet({ virtualwallet, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "fetchVirtualWallet");
  }
};
var fetchVirtualWalletByAddress = async (address, admin, adminpwd) => {
  try {
    return await sdkFetchVirtualWalletByAddress({ address, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "fetchVirtualWalletByAddress");
  }
};
var updateVirtualWalletTransactions = async (walletaddress, admin, adminpwd) => {
  try {
    return await sdkUpdateVirtualWalletTxs({ walletaddress, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "updateVirtualWalletTransactions");
  }
};

// src/bridge.ts
import {
  getBridgeBalance as sdkGetBridgeBalance,
  getBridgeTokenBalance as sdkGetBridgeTokenBalance,
  getBridgeTransactions as sdkGetBridgeTransactions,
  getBridgeTokenTransactions as sdkGetBridgeTokenTransactions,
  bridgeTokenFromChain as sdkBridgeTokenFromChain,
  getBridgeTokenFeeEstimate as sdkGetBridgeTokenFeeEstimate,
  createSolanaAddress as sdkCreateSolanaAddress,
  isValidSolanaAddress as sdkIsValidSolanaAddress,
  createToronetSolanaAddress as sdkCreateToronetSolanaAddress,
  getSolLatestBlock as sdkGetSolLatestBlock,
  getSolBalance as sdkGetSolBalance,
  getSolTokenBalance as sdkGetSolTokenBalance,
  getSolTransactions as sdkGetSolTransactions,
  getSolTokenTransactions as sdkGetSolTokenTransactions,
  transferSolana as sdkTransferSolana,
  transferSolToken as sdkTransferSolToken,
  bridgeTokenSol as sdkBridgeTokenSol,
  getBridgeTokenFeeSol as sdkGetBridgeTokenFeeSol,
  BridgeNetwork
} from "torosdk";
var getBridgeChainBalance = async (network, params, admin, adminpwd) => {
  try {
    return admin ? await sdkGetBridgeBalance(network, params, admin, adminpwd) : await sdkGetBridgeBalance(network, params);
  } catch (error) {
    throw normalizeError(error, "getBridgeChainBalance");
  }
};
var getBridgeChainTokenBalance = async (network, params, admin, adminpwd) => {
  try {
    return admin ? await sdkGetBridgeTokenBalance(network, params, admin, adminpwd) : await sdkGetBridgeTokenBalance(network, params);
  } catch (error) {
    throw normalizeError(error, "getBridgeChainTokenBalance");
  }
};
var getBridgeChainTransactions = async (network, params, admin, adminpwd) => {
  try {
    return admin ? await sdkGetBridgeTransactions(network, params, admin, adminpwd) : await sdkGetBridgeTransactions(network, params);
  } catch (error) {
    throw normalizeError(error, "getBridgeChainTransactions");
  }
};
var getBridgeChainTokenTransactions = async (network, params, admin, adminpwd) => {
  try {
    return admin ? await sdkGetBridgeTokenTransactions(network, params, admin, adminpwd) : await sdkGetBridgeTokenTransactions(network, params);
  } catch (error) {
    throw normalizeError(error, "getBridgeChainTokenTransactions");
  }
};
var bridgeToken = async (network, params, admin, adminpwd) => {
  try {
    return admin ? await sdkBridgeTokenFromChain(network, params, admin, adminpwd) : await sdkBridgeTokenFromChain(network, params);
  } catch (error) {
    throw normalizeError(error, "bridgeToken");
  }
};
var getBridgeFeeEstimate = async (network, params, admin, adminpwd) => {
  try {
    return admin ? await sdkGetBridgeTokenFeeEstimate(network, params, admin, adminpwd) : await sdkGetBridgeTokenFeeEstimate(network, params);
  } catch (error) {
    throw normalizeError(error, "getBridgeFeeEstimate");
  }
};
var createSolanaAddress = async (admin, adminpwd) => {
  try {
    return await sdkCreateSolanaAddress({ admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "createSolanaAddress");
  }
};
var isValidSolanaAddress = async (address) => {
  try {
    return await sdkIsValidSolanaAddress(address);
  } catch (error) {
    throw normalizeError(error, "isValidSolanaAddress");
  }
};
var createToronetSolanaAddress = async (addr, pwd) => {
  try {
    return await sdkCreateToronetSolanaAddress({ addr, pwd });
  } catch (error) {
    throw normalizeError(error, "createToronetSolanaAddress");
  }
};
var getSolLatestBlock = async () => {
  try {
    return await sdkGetSolLatestBlock();
  } catch (error) {
    throw normalizeError(error, "getSolLatestBlock");
  }
};
var getSolBalance = async (address) => {
  try {
    return await sdkGetSolBalance({ address });
  } catch (error) {
    throw normalizeError(error, "getSolBalance");
  }
};
var getSolTokenBalance = async (address, contractaddress) => {
  try {
    return await sdkGetSolTokenBalance({ address, contractaddress });
  } catch (error) {
    throw normalizeError(error, "getSolTokenBalance");
  }
};
var getSolTransactions = async (address) => {
  try {
    return await sdkGetSolTransactions({ address });
  } catch (error) {
    throw normalizeError(error, "getSolTransactions");
  }
};
var getSolTokenTransactions = async (address, contractaddress) => {
  try {
    return await sdkGetSolTokenTransactions({ address, contractaddress });
  } catch (error) {
    throw normalizeError(error, "getSolTokenTransactions");
  }
};
var transferSolana = async (params, admin, adminpwd) => {
  try {
    return await sdkTransferSolana(params, admin, adminpwd);
  } catch (error) {
    throw normalizeError(error, "transferSolana");
  }
};
var transferSolToken = async (params, admin, adminpwd) => {
  try {
    return await sdkTransferSolToken(params, admin, adminpwd);
  } catch (error) {
    throw normalizeError(error, "transferSolToken");
  }
};
var bridgeSolToken = async (params) => {
  try {
    return await sdkBridgeTokenSol(params);
  } catch (error) {
    throw normalizeError(error, "bridgeSolToken");
  }
};
var getSolBridgeFee = async (contractaddress, amount) => {
  try {
    return await sdkGetBridgeTokenFeeSol({ network: BridgeNetwork.Solana, contractaddress, amount });
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
import {
  importWalletFromPrivateKeyAndPassword as sdkImportWallet2,
  getWalletKey as sdkGetWalletKey,
  updatePassword as sdkUpdatePassword,
  deleteWallet as sdkDeleteWallet
} from "torosdk";
var importWalletFromPrivateKey = async (pvKey, password) => {
  try {
    return await sdkImportWallet2({ pvKey, password });
  } catch (error) {
    throw normalizeError(error, "importWalletFromPrivateKey");
  }
};
var getWalletKey = async (address) => {
  try {
    return await sdkGetWalletKey({ address });
  } catch (error) {
    throw normalizeError(error, "getWalletKey");
  }
};
var updateWalletPassword = async (address, oldPassword, newPassword) => {
  try {
    return await sdkUpdatePassword({ address, oldPassword, newPassword });
  } catch (error) {
    throw normalizeError(error, "updateWalletPassword");
  }
};
var deleteWallet = async (address, password) => {
  try {
    return await sdkDeleteWallet({ address, password });
  } catch (error) {
    throw normalizeError(error, "deleteWallet");
  }
};

// src/roles.ts
import {
  isAdmin as sdkIsAdmin,
  addAdmin as sdkAddAdmin,
  removeAdmin as sdkRemoveAdmin,
  isSuperAdmin as sdkIsSuperAdmin,
  addSuperAdmin as sdkAddSuperAdmin,
  isDebugger as sdkIsDebugger,
  getAdminIndex as sdkGetAdminIndex,
  getNumberOfAdmin as sdkGetNumberOfAdmin,
  getAdminByIndex as sdkGetAdminByIndex
} from "torosdk";
var isAdmin = async (address) => {
  try {
    const result = await sdkIsAdmin({ address });
    return Boolean(result?.isadmin ?? result);
  } catch (error) {
    throw normalizeError(error, "isAdmin");
  }
};
var isSuperAdmin = async (address) => {
  try {
    const result = await sdkIsSuperAdmin({ address });
    return Boolean(result?.issuperadmin ?? result);
  } catch (error) {
    throw normalizeError(error, "isSuperAdmin");
  }
};
var isDebugger = async (address) => {
  try {
    const result = await sdkIsDebugger({ address });
    return Boolean(result?.isdebugger ?? result);
  } catch (error) {
    throw normalizeError(error, "isDebugger");
  }
};
var getAdminIndex = async (address) => {
  try {
    return await sdkGetAdminIndex({ address });
  } catch (error) {
    throw normalizeError(error, "getAdminIndex");
  }
};
var getNumberOfAdmins = async () => {
  try {
    return await sdkGetNumberOfAdmin();
  } catch (error) {
    throw normalizeError(error, "getNumberOfAdmins");
  }
};
var getAdminByIndex = async (index) => {
  try {
    return await sdkGetAdminByIndex({ index });
  } catch (error) {
    throw normalizeError(error, "getAdminByIndex");
  }
};
var addAdmin = async (superAdminAddress, superAdminPassword, adminAddress) => {
  try {
    return await sdkAddAdmin({ address: superAdminAddress, password: superAdminPassword, adminAddress });
  } catch (error) {
    throw normalizeError(error, "addAdmin");
  }
};
var removeAdmin = async (superAdminAddress, superAdminPassword, adminAddress) => {
  try {
    return await sdkRemoveAdmin({ address: superAdminAddress, password: superAdminPassword, adminAddress });
  } catch (error) {
    throw normalizeError(error, "removeAdmin");
  }
};
var addSuperAdmin = async (superAdminAddress, superAdminPassword, newSuperAdminAddress) => {
  try {
    return await sdkAddSuperAdmin({ address: superAdminAddress, password: superAdminPassword, superAdminAddress: newSuperAdminAddress });
  } catch (error) {
    throw normalizeError(error, "addSuperAdmin");
  }
};

// src/products.ts
import {
  getProject as sdkGetProject,
  getProduct as sdkGetProduct,
  recordProduct as sdkRecordProduct,
  updateProduct as sdkUpdateProduct
} from "torosdk";
var getProject = async (admin, getbalances = true) => {
  try {
    return await sdkGetProject({ admin, getbalances: getbalances ? "true" : "false" });
  } catch (error) {
    throw normalizeError(error, "getProject");
  }
};
var getProduct = async (productId, admin, adminpwd) => {
  try {
    return await sdkGetProduct({ productId, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, "getProduct");
  }
};
var createProduct = async (input) => {
  try {
    return await sdkRecordProduct(input);
  } catch (error) {
    throw normalizeError(error, "createProduct");
  }
};
var updateProduct = async (input) => {
  try {
    return await sdkUpdateProduct(input);
  } catch (error) {
    throw normalizeError(error, "updateProduct");
  }
};

// src/deployer.ts
import { deploySmartContract as sdkDeploySmartContract } from "torosdk";
var deployContract = async (input) => {
  try {
    return await sdkDeploySmartContract({
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
  burnCurrency as sdkBurnCurrency
} from "torosdk";
var getCurrencyBalance = async (currency, address) => {
  try {
    const result = await sdkGetCurrencyBalance({ currency, address });
    return result?.toString() || "0";
  } catch (error) {
    throw normalizeError(error, "getCurrencyBalance");
  }
};
var transferCurrencyFunds = async (currency, senderAddr, senderPwd, receiverAddr, amount) => {
  try {
    return await sdkTransferCurrency({ currency, senderAddr, senderPwd, receiverAddr, amount });
  } catch (error) {
    throw normalizeError(error, "transferCurrencyFunds");
  }
};
var allowCurrencyTransfer = async (currency, address, password) => {
  try {
    return await sdkAllowTransfer({ currency, address, password });
  } catch (error) {
    throw normalizeError(error, "allowCurrencyTransfer");
  }
};
var disableCurrencyTransfer = async (currency, address, password) => {
  try {
    return await sdkDisableTransfer({ currency, address, password });
  } catch (error) {
    throw normalizeError(error, "disableCurrencyTransfer");
  }
};
var freezeCurrencyAddress = async (params) => {
  try {
    return await sdkFreezeAddress(params);
  } catch (error) {
    throw normalizeError(error, "freezeCurrencyAddress");
  }
};
var unfreezeCurrencyAddress = async (params) => {
  try {
    return await sdkUnfreezeAddress(params);
  } catch (error) {
    throw normalizeError(error, "unfreezeCurrencyAddress");
  }
};
var enrollCurrencyAddress = async (params) => {
  try {
    return await sdkEnrollAddress(params);
  } catch (error) {
    throw normalizeError(error, "enrollCurrencyAddress");
  }
};
var mintCurrencyFunds = async (params) => {
  try {
    return await sdkMintCurrency(params);
  } catch (error) {
    throw normalizeError(error, "mintCurrencyFunds");
  }
};
var burnCurrencyFunds = async (params) => {
  try {
    return await sdkBurnCurrency(params);
  } catch (error) {
    throw normalizeError(error, "burnCurrencyFunds");
  }
};

// src/storage.ts
import {
  isStorageOn as sdkIsStorageOn,
  isContractRegistered as sdkIsContractRegistered,
  getStorageVersion as sdkGetStorageVersion,
  isOwner as sdkIsOwner,
  getOwner as sdkGetOwner,
  setStorageOn as sdkSetStorageOn,
  setStorageOff as sdkSetStorageOff,
  registerContract as sdkRegisterContract,
  unregisterContract as sdkUnregisterContract,
  increaseStorageVersion as sdkIncreaseStorageVersion,
  decreaseStorageVersion as sdkDecreaseStorageVersion,
  setStorageVersion as sdkSetStorageVersion,
  transferOwnership as sdkTransferOwnership
} from "torosdk";
var isStorageOn = async () => {
  try {
    return await sdkIsStorageOn();
  } catch (error) {
    throw normalizeError(error, "isStorageOn");
  }
};
var isContractRegistered = async (contract) => {
  try {
    return await sdkIsContractRegistered({ contract });
  } catch (error) {
    throw normalizeError(error, "isContractRegistered");
  }
};
var getStorageVersion = async () => {
  try {
    return await sdkGetStorageVersion();
  } catch (error) {
    throw normalizeError(error, "getStorageVersion");
  }
};
var isStorageOwner = async (address) => {
  try {
    return await sdkIsOwner({ address });
  } catch (error) {
    throw normalizeError(error, "isStorageOwner");
  }
};
var getStorageOwner = async () => {
  try {
    return await sdkGetOwner();
  } catch (error) {
    throw normalizeError(error, "getStorageOwner");
  }
};
var setStorageOn = async (address, password) => {
  try {
    return await sdkSetStorageOn({ address, password });
  } catch (error) {
    throw normalizeError(error, "setStorageOn");
  }
};
var setStorageOff = async (address, password) => {
  try {
    return await sdkSetStorageOff({ address, password });
  } catch (error) {
    throw normalizeError(error, "setStorageOff");
  }
};
var registerStorageContract = async (address, password, contract) => {
  try {
    return await sdkRegisterContract({ address, password, contract });
  } catch (error) {
    throw normalizeError(error, "registerStorageContract");
  }
};
var unregisterStorageContract = async (address, password, contract) => {
  try {
    return await sdkUnregisterContract({ address, password, contract });
  } catch (error) {
    throw normalizeError(error, "unregisterStorageContract");
  }
};
var increaseStorageVersion = async (address, password) => {
  try {
    return await sdkIncreaseStorageVersion({ address, password });
  } catch (error) {
    throw normalizeError(error, "increaseStorageVersion");
  }
};
var decreaseStorageVersion = async (address, password) => {
  try {
    return await sdkDecreaseStorageVersion({ address, password });
  } catch (error) {
    throw normalizeError(error, "decreaseStorageVersion");
  }
};
var setStorageVersion = async (address, password, version) => {
  try {
    return await sdkSetStorageVersion({ address, password, version });
  } catch (error) {
    throw normalizeError(error, "setStorageVersion");
  }
};
var transferStorageOwnership = async (address, password, newOwner) => {
  try {
    return await sdkTransferOwnership({ address, password, newOwner });
  } catch (error) {
    throw normalizeError(error, "transferStorageOwnership");
  }
};

// src/swap.ts
import * as sdk from "torosdk";
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
export {
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
  getSwapQuote2 as getSwapQuote,
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
  swapCurrency2 as swapCurrency,
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
};
