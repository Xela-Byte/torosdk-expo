"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  APIError: () => APIError,
  NetworkError: () => NetworkError,
  ToroError: () => ToroError10,
  ToroProvider: () => ToroProvider,
  useToroAddressRole: () => useToroAddressRole,
  useToroBalance: () => useToroBalance,
  useToroBlockchain: () => useToroBlockchain,
  useToroBridge: () => useToroBridge,
  useToroBridgeBalance: () => useToroBridgeBalance,
  useToroBridgeTokenBalance: () => useToroBridgeTokenBalance,
  useToroBridgeTokenFee: () => useToroBridgeTokenFee,
  useToroBridgeTokenTransactions: () => useToroBridgeTokenTransactions,
  useToroBridgeTransactions: () => useToroBridgeTransactions,
  useToroChainTransactions: () => useToroChainTransactions,
  useToroContext: () => useToroContext,
  useToroCreateSolanaAddress: () => useToroCreateSolanaAddress,
  useToroCreateToronetSolanaAddress: () => useToroCreateToronetSolanaAddress,
  useToroCreateWallet: () => useToroCreateWallet,
  useToroCurrencyAdmin: () => useToroCurrencyAdmin,
  useToroDeleteTNS: () => useToroDeleteTNS,
  useToroDeleteWallet: () => useToroDeleteWallet,
  useToroDeployContract: () => useToroDeployContract,
  useToroExchangeRates: () => useToroExchangeRates,
  useToroImportWallet: () => useToroImportWallet,
  useToroIsValidSolanaAddress: () => useToroIsValidSolanaAddress,
  useToroKYCStatus: () => useToroKYCStatus,
  useToroKeystore: () => useToroKeystore,
  useToroPayment: () => useToroPayment,
  useToroPerformKYC: () => useToroPerformKYC,
  useToroProducts: () => useToroProducts,
  useToroRoleMutations: () => useToroRoleMutations,
  useToroSend: () => useToroSend,
  useToroSolBalance: () => useToroSolBalance,
  useToroSolLatestBlock: () => useToroSolLatestBlock,
  useToroSolTokenBalance: () => useToroSolTokenBalance,
  useToroSolTokenTransactions: () => useToroSolTokenTransactions,
  useToroSolTransactions: () => useToroSolTransactions,
  useToroStorageMutation: () => useToroStorageMutation,
  useToroStorageQuery: () => useToroStorageQuery,
  useToroSwap: () => useToroSwap,
  useToroSwapQuote: () => useToroSwapQuote,
  useToroTNSLookup: () => useToroTNSLookup,
  useToroTNSResolve: () => useToroTNSResolve,
  useToroTokenAllowance: () => useToroTokenAllowance,
  useToroTokenBalance: () => useToroTokenBalance,
  useToroTokenFee: () => useToroTokenFee,
  useToroTokenStatus: () => useToroTokenStatus,
  useToroTokenSupply: () => useToroTokenSupply,
  useToroTransactionByHash: () => useToroTransactionByHash,
  useToroTransactionStatus: () => useToroTransactionStatus,
  useToroTransactions: () => useToroTransactions,
  useToroTransferSolToken: () => useToroTransferSolToken,
  useToroTransferSolana: () => useToroTransferSolana,
  useToroUpdatePassword: () => useToroUpdatePassword,
  useToroUpdateTNS: () => useToroUpdateTNS,
  useToroVerifyPassword: () => useToroVerifyPassword,
  useToroVirtualWallet: () => useToroVirtualWallet,
  useToroWallet: () => useToroWallet,
  wrapError: () => wrapError
});
module.exports = __toCommonJS(index_exports);

// src/provider.tsx
var import_react = require("react");
var import_sdk_adapter = require("@reactforge/sdk-adapter");
var import_jsx_runtime = require("react/jsx-runtime");
var ToroContext = (0, import_react.createContext)(void 0);
var ToroProvider = ({ children, network = "mainnet", baseURL }) => {
  const [activeAddress, setActiveAddressState] = (0, import_react.useState)(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        return window.localStorage.getItem("toroforge_active_address");
      } catch {
        return null;
      }
    }
    return null;
  });
  const setActiveAddress = (address) => {
    setActiveAddressState(address);
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        if (address) {
          window.localStorage.setItem("toroforge_active_address", address);
        } else {
          window.localStorage.removeItem("toroforge_active_address");
        }
      } catch {
      }
    }
  };
  (0, import_react.useEffect)(() => {
    (0, import_sdk_adapter.initToroforge)({ network, baseURL });
  }, [network, baseURL]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToroContext.Provider, { value: { network, activeAddress, setActiveAddress }, children });
};
var useToroContext = () => {
  const context = (0, import_react.useContext)(ToroContext);
  if (!context) {
    throw new Error("useToroContext must be used within a ToroProvider");
  }
  return context;
};

// src/hooks/useToroBalance.ts
var import_react2 = require("react");
var import_sdk_adapter2 = require("@reactforge/sdk-adapter");
var useToroBalance = (address) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = (0, import_react2.useState)(null);
  const [loading, setLoading] = (0, import_react2.useState)(!!targetAddress);
  const [error, setError] = (0, import_react2.useState)(null);
  const fetchBalance = (0, import_react2.useCallback)(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter2.getBalance)(targetAddress);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);
  (0, import_react2.useEffect)(() => {
    fetchBalance();
  }, [fetchBalance]);
  return { data, loading, error, refetch: fetchBalance };
};

// src/hooks/useToroCreateWallet.ts
var import_react3 = require("react");
var import_sdk_adapter3 = require("@reactforge/sdk-adapter");
var useToroCreateWallet = () => {
  const [address, setAddress] = (0, import_react3.useState)(null);
  const [loading, setLoading] = (0, import_react3.useState)(false);
  const [error, setError] = (0, import_react3.useState)(null);
  const createWallet = (0, import_react3.useCallback)(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter3.createWallet)(username, password);
      setAddress(result);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  return { address, loading, error, createWallet };
};

// src/hooks/useToroSend.ts
var import_react4 = require("react");
var import_sdk_adapter4 = require("@reactforge/sdk-adapter");
var useToroSend = () => {
  const { activeAddress } = useToroContext();
  const [data, setData] = (0, import_react4.useState)(null);
  const [loading, setLoading] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)(null);
  const sendTransaction = async (params) => {
    if (!activeAddress) {
      throw new Error("No active wallet address available. Ensure user is logged in.");
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await (0, import_sdk_adapter4.sendTransaction)(
        params.currency,
        activeAddress,
        params.senderPwd,
        params.receiverAddr,
        params.amount
      );
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Unknown error");
      setError(errorObj);
      setLoading(false);
      throw errorObj;
    }
  };
  return { data, sendTransaction, loading, error };
};

// src/hooks/useToroTNS.ts
var import_react5 = require("react");
var import_sdk_adapter5 = require("@reactforge/sdk-adapter");
var useToroTNSResolve = (name) => {
  const [data, setData] = (0, import_react5.useState)(null);
  const [loading, setLoading] = (0, import_react5.useState)(!!name);
  const [error, setError] = (0, import_react5.useState)(null);
  const resolve = (0, import_react5.useCallback)(async () => {
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter5.resolveTNSName)(name);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [name]);
  (0, import_react5.useEffect)(() => {
    resolve();
  }, [resolve]);
  return { data, loading, error, refetch: resolve };
};
var useToroTNSLookup = (address) => {
  const [data, setData] = (0, import_react5.useState)(null);
  const [loading, setLoading] = (0, import_react5.useState)(!!address);
  const [error, setError] = (0, import_react5.useState)(null);
  const lookup = (0, import_react5.useCallback)(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter5.lookupTNSAddress)(address);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [address]);
  (0, import_react5.useEffect)(() => {
    lookup();
  }, [lookup]);
  return { data, loading, error, refetch: lookup };
};

// src/hooks/useToroUpdateTNS.ts
var import_react6 = require("react");
var import_sdk_adapter6 = require("@reactforge/sdk-adapter");
var useToroUpdateTNS = () => {
  const { activeAddress } = useToroContext();
  const [loading, setLoading] = (0, import_react6.useState)(false);
  const [error, setError] = (0, import_react6.useState)(null);
  const [success, setSuccess] = (0, import_react6.useState)(false);
  const updateTNS = (0, import_react6.useCallback)(async (newUsername, password) => {
    if (!activeAddress) throw new Error("No active wallet address in context.");
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await (0, import_sdk_adapter6.updateTNSName)(activeAddress, password, newUsername);
      setSuccess(true);
      return true;
    } catch (err) {
      const normalized = (0, import_sdk_adapter6.normalizeError)(err, "updateTNS");
      setError(normalized);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeAddress]);
  return { loading, error, success, updateTNS };
};
var useToroDeleteTNS = () => {
  const { activeAddress } = useToroContext();
  const [loading, setLoading] = (0, import_react6.useState)(false);
  const [error, setError] = (0, import_react6.useState)(null);
  const [success, setSuccess] = (0, import_react6.useState)(false);
  const deleteTNS = (0, import_react6.useCallback)(async (password) => {
    if (!activeAddress) throw new Error("No active wallet address in context.");
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await (0, import_sdk_adapter6.deleteTNSName)(activeAddress, password);
      setSuccess(true);
      return true;
    } catch (err) {
      const normalized = (0, import_sdk_adapter6.normalizeError)(err, "deleteTNS");
      setError(normalized);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeAddress]);
  return { loading, error, success, deleteTNS };
};

// src/hooks/useToroTokenBalance.ts
var import_react7 = require("react");
var import_sdk_adapter7 = require("@reactforge/sdk-adapter");
var useToroTokenBalance = (address) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = (0, import_react7.useState)(null);
  const [loading, setLoading] = (0, import_react7.useState)(!!targetAddress);
  const [error, setError] = (0, import_react7.useState)(null);
  const fetch = (0, import_react7.useCallback)(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const [balance, metadata] = await Promise.all([
        (0, import_sdk_adapter7.getTokenBalance)(targetAddress),
        (0, import_sdk_adapter7.getTokenMetadata)()
      ]);
      setData({ balance, ...metadata });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);
  (0, import_react7.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};

// src/hooks/useToroTokenExtended.ts
var import_react8 = require("react");
var import_sdk_adapter8 = require("@reactforge/sdk-adapter");
var useToroTokenAllowance = (owner, spender) => {
  const { activeAddress } = useToroContext();
  const targetOwner = owner || activeAddress;
  const [allowance, setAllowance] = (0, import_react8.useState)("0");
  const [minAllowance, setMinAllowance] = (0, import_react8.useState)("0");
  const [maxAllowance, setMaxAllowance] = (0, import_react8.useState)("0");
  const [loading, setLoading] = (0, import_react8.useState)(!!targetOwner);
  const [error, setError] = (0, import_react8.useState)(null);
  const fetch = (0, import_react8.useCallback)(async () => {
    if (!targetOwner) return;
    setLoading(true);
    setError(null);
    try {
      const [allw, min, max] = await Promise.allSettled([
        spender ? (0, import_sdk_adapter8.getTokenAllowance)(targetOwner, spender) : Promise.resolve("0"),
        (0, import_sdk_adapter8.getMinimumTokenAllowance)(targetOwner),
        (0, import_sdk_adapter8.getMaximumTokenAllowance)(targetOwner)
      ]);
      if (allw.status === "fulfilled") setAllowance(allw.value);
      if (min.status === "fulfilled") setMinAllowance(min.value);
      if (max.status === "fulfilled") setMaxAllowance(max.value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetOwner, spender]);
  (0, import_react8.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { allowance, minAllowance, maxAllowance, loading, error, refetch: fetch };
};
var useToroTokenFee = (amount) => {
  const [fee, setFee] = (0, import_react8.useState)("0");
  const [loading, setLoading] = (0, import_react8.useState)(true);
  const [error, setError] = (0, import_react8.useState)(null);
  const fetch = (0, import_react8.useCallback)(async () => {
    if (!amount) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter8.getTokenTransactionFee)(amount);
      setFee(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [amount]);
  (0, import_react8.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { fee, loading, error, refetch: fetch };
};
var useToroTokenStatus = (address) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [isEnrolled, setIsEnrolled] = (0, import_react8.useState)(null);
  const [isFrozen, setIsFrozen] = (0, import_react8.useState)(null);
  const [loading, setLoading] = (0, import_react8.useState)(!!targetAddress);
  const [error, setError] = (0, import_react8.useState)(null);
  const fetch = (0, import_react8.useCallback)(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const [enrolled, frozen] = await Promise.allSettled([
        (0, import_sdk_adapter8.isTokenEnrolled)(targetAddress),
        (0, import_sdk_adapter8.isTokenFrozen)(targetAddress)
      ]);
      if (enrolled.status === "fulfilled") setIsEnrolled(enrolled.value);
      if (frozen.status === "fulfilled") setIsFrozen(frozen.value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);
  (0, import_react8.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { isEnrolled, isFrozen, loading, error, refetch: fetch };
};
var useToroTokenSupply = () => {
  const [totalCap, setTotalCap] = (0, import_react8.useState)("0");
  const [loading, setLoading] = (0, import_react8.useState)(true);
  const [error, setError] = (0, import_react8.useState)(null);
  const fetch = (0, import_react8.useCallback)(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter8.getTokenTotalCap)();
      setTotalCap(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);
  (0, import_react8.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { totalCap, loading, error, refetch: fetch };
};

// src/hooks/useToroTransactions.ts
var import_react9 = require("react");
var import_sdk_adapter9 = require("@reactforge/sdk-adapter");
var useToroTransactions = (address, count = 20) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = (0, import_react9.useState)([]);
  const [loading, setLoading] = (0, import_react9.useState)(!!targetAddress);
  const [error, setError] = (0, import_react9.useState)(null);
  const fetchTransactions = (0, import_react9.useCallback)(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter9.getTransactions)(targetAddress, count);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [targetAddress, count]);
  (0, import_react9.useEffect)(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  return { data, loading, error, refetch: fetchTransactions };
};

// src/hooks/useToroTransactionByHash.ts
var import_react10 = require("react");
var import_sdk_adapter10 = require("@reactforge/sdk-adapter");
var useToroTransactionByHash = (hash) => {
  const [data, setData] = (0, import_react10.useState)(null);
  const [receipt, setReceipt] = (0, import_react10.useState)(null);
  const [loading, setLoading] = (0, import_react10.useState)(!!hash);
  const [error, setError] = (0, import_react10.useState)(null);
  const fetch = (0, import_react10.useCallback)(async () => {
    if (!hash) return;
    setLoading(true);
    setError(null);
    try {
      const [tx, rcpt] = await Promise.allSettled([
        (0, import_sdk_adapter10.getTransactionByHashAdapter)(hash),
        (0, import_sdk_adapter10.getTransactionReceipt)(hash)
      ]);
      if (tx.status === "fulfilled") setData(tx.value);
      if (rcpt.status === "fulfilled") setReceipt(rcpt.value);
      if (tx.status === "rejected") throw tx.reason;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [hash]);
  (0, import_react10.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, receipt, loading, error, refetch: fetch };
};
var useToroTransactionStatus = (hash) => {
  const [status, setStatus] = (0, import_react10.useState)("unknown");
  const [loading, setLoading] = (0, import_react10.useState)(!!hash);
  const [error, setError] = (0, import_react10.useState)(null);
  const fetch = (0, import_react10.useCallback)(async () => {
    if (!hash) return;
    setLoading(true);
    setError(null);
    try {
      const tx = await (0, import_sdk_adapter10.getTransactionByHashAdapter)(hash);
      if (!tx) {
        setStatus("pending");
      } else {
        const s = tx.status?.toString().toLowerCase();
        if (s === "1" || s === "success" || s === "true") setStatus("success");
        else if (s === "0" || s === "failed" || s === "false") setStatus("failed");
        else setStatus("unknown");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setStatus("unknown");
    } finally {
      setLoading(false);
    }
  }, [hash]);
  (0, import_react10.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { status, loading, error, refetch: fetch };
};

// src/hooks/useToroBlockchain.ts
var import_react11 = require("react");
var import_sdk_adapter11 = require("@reactforge/sdk-adapter");
var useToroBlockchain = (blockCount = 10) => {
  const [data, setData] = (0, import_react11.useState)({ status: null, latestBlock: null, blocks: [] });
  const [loading, setLoading] = (0, import_react11.useState)(true);
  const [error, setError] = (0, import_react11.useState)(null);
  const fetch = (0, import_react11.useCallback)(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusResult, latestBlockResult, blocksResult] = await Promise.allSettled([
        (0, import_sdk_adapter11.getChainStatus)(),
        (0, import_sdk_adapter11.getLatestBlock)(),
        (0, import_sdk_adapter11.getBlocks)(blockCount)
      ]);
      setData({
        status: statusResult.status === "fulfilled" ? statusResult.value : null,
        latestBlock: latestBlockResult.status === "fulfilled" ? latestBlockResult.value : null,
        blocks: blocksResult.status === "fulfilled" ? blocksResult.value ?? [] : []
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [blockCount]);
  (0, import_react11.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroChainTransactions = (count = 20) => {
  const [data, setData] = (0, import_react11.useState)([]);
  const [loading, setLoading] = (0, import_react11.useState)(true);
  const [error, setError] = (0, import_react11.useState)(null);
  const fetch = (0, import_react11.useCallback)(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter11.getChainTransactions)(count);
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [count]);
  (0, import_react11.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};

// src/hooks/useToroAddressRole.ts
var import_react12 = require("react");
var import_sdk_adapter12 = require("@reactforge/sdk-adapter");
var useToroAddressRole = (address) => {
  const [role, setRole] = (0, import_react12.useState)(null);
  const [isValid, setIsValid] = (0, import_react12.useState)(null);
  const [loading, setLoading] = (0, import_react12.useState)(!!address);
  const [error, setError] = (0, import_react12.useState)(null);
  const fetch = (0, import_react12.useCallback)(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const [roleResult, validResult] = await Promise.allSettled([
        (0, import_sdk_adapter12.getAddressRoleAdapter)(address),
        (0, import_sdk_adapter12.isValidAddress)(address)
      ]);
      if (roleResult.status === "fulfilled") setRole(roleResult.value);
      if (validResult.status === "fulfilled") setIsValid(validResult.value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [address]);
  (0, import_react12.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { role, isValid, loading, error, refetch: fetch };
};

// src/hooks/useToroExchangeRates.ts
var import_react13 = require("react");
var import_sdk_adapter13 = require("@reactforge/sdk-adapter");
var useToroExchangeRates = () => {
  const [data, setData] = (0, import_react13.useState)([]);
  const [loading, setLoading] = (0, import_react13.useState)(true);
  const [error, setError] = (0, import_react13.useState)(null);
  const fetch = (0, import_react13.useCallback)(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter13.getExchangeRates)();
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);
  (0, import_react13.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};

// src/hooks/useToroKYCStatus.ts
var import_react14 = require("react");
var import_sdk_adapter14 = require("@reactforge/sdk-adapter");
var useToroKYCStatus = (address) => {
  const [isVerified, setIsVerified] = (0, import_react14.useState)(null);
  const [loading, setLoading] = (0, import_react14.useState)(!!address);
  const [error, setError] = (0, import_react14.useState)(null);
  const fetch = (0, import_react14.useCallback)(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter14.checkKYCStatus)(address);
      setIsVerified(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [address]);
  (0, import_react14.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { isVerified, loading, error, refetch: fetch };
};
var useToroPerformKYC = () => {
  const [success, setSuccess] = (0, import_react14.useState)(false);
  const [loading, setLoading] = (0, import_react14.useState)(false);
  const [error, setError] = (0, import_react14.useState)(null);
  const submitKYC = (0, import_react14.useCallback)(async (input) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await (0, import_sdk_adapter14.performKYC)(input);
      setSuccess(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  return { success, loading, error, submitKYC };
};

// src/hooks/useToroPayment.ts
var import_react15 = require("react");
var import_sdk_adapter15 = require("@reactforge/sdk-adapter");
var useToroPayment = () => {
  const [loading, setLoading] = (0, import_react15.useState)(false);
  const [error, setError] = (0, import_react15.useState)(null);
  const deposit = (0, import_react15.useCallback)(async (input) => {
    setLoading(true);
    setError(null);
    try {
      return await (0, import_sdk_adapter15.initiateDeposit)(input);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  const confirmDeposit = (0, import_react15.useCallback)(async (currency, txid) => {
    setLoading(true);
    setError(null);
    try {
      return await (0, import_sdk_adapter15.confirmFiatDeposit)(currency, txid);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  const getUSDBanks = (0, import_react15.useCallback)(async (admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      return await (0, import_sdk_adapter15.getBankListUSD)(admin, adminpwd);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  const getNGNBanks = (0, import_react15.useCallback)(async (admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      return await (0, import_sdk_adapter15.getBankListNGN)(admin, adminpwd);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  return { loading, error, deposit, confirmDeposit, getUSDBanks, getNGNBanks };
};

// src/hooks/useToroVirtualWallet.ts
var import_react16 = require("react");
var import_sdk_adapter16 = require("@reactforge/sdk-adapter");
var useToroVirtualWallet = () => {
  const [data, setData] = (0, import_react16.useState)(null);
  const [loading, setLoading] = (0, import_react16.useState)(false);
  const [error, setError] = (0, import_react16.useState)(null);
  const create = (0, import_react16.useCallback)(async (input) => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter16.createVirtualWallet)(input);
      setData(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchByWalletId = (0, import_react16.useCallback)(async (walletId, admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter16.fetchVirtualWallet)(walletId, admin, adminpwd);
      setData(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchByAddress = (0, import_react16.useCallback)(async (address, admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter16.fetchVirtualWalletByAddress)(address, admin, adminpwd);
      setData(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  const updateTransactions = (0, import_react16.useCallback)(async (address, admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      await (0, import_sdk_adapter16.updateVirtualWalletTransactions)(address, admin, adminpwd);
      return true;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  return { data, loading, error, create, fetchByWalletId, fetchByAddress, updateTransactions };
};

// src/hooks/useToroBridge.ts
var import_react17 = require("react");
var import_sdk_adapter17 = require("@reactforge/sdk-adapter");
var useToroBridgeBalance = (network, address, admin, adminpwd) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [balance, setBalance] = (0, import_react17.useState)(null);
  const [loading, setLoading] = (0, import_react17.useState)(!!targetAddress);
  const [error, setError] = (0, import_react17.useState)(null);
  const fetch = (0, import_react17.useCallback)(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter17.getBridgeChainBalance)(network, { address: targetAddress }, admin, adminpwd);
      setBalance(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [network, targetAddress, admin, adminpwd]);
  (0, import_react17.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { balance, loading, error, refetch: fetch };
};
var useToroBridge = () => {
  const [loading, setLoading] = (0, import_react17.useState)(false);
  const [error, setError] = (0, import_react17.useState)(null);
  const transfer = (0, import_react17.useCallback)(async (params, admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      return await (0, import_sdk_adapter17.bridgeToken)(params.network, params, admin, adminpwd);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  const getFeeEstimate = (0, import_react17.useCallback)(async (params, admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      return await (0, import_sdk_adapter17.getBridgeFeeEstimate)(params.network, params, admin, adminpwd);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { loading, error, transfer, getFeeEstimate };
};
var useToroBridgeTransactions = (network, address, admin, adminpwd) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = (0, import_react17.useState)([]);
  const [loading, setLoading] = (0, import_react17.useState)(!!targetAddress);
  const [error, setError] = (0, import_react17.useState)(null);
  const fetch = (0, import_react17.useCallback)(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter17.getBridgeChainTransactions)(network, { address: targetAddress }, admin, adminpwd);
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [network, targetAddress, admin, adminpwd]);
  (0, import_react17.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroBridgeTokenBalance = (network, contractAddress, address, tokenName, admin, adminpwd) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = (0, import_react17.useState)(null);
  const [loading, setLoading] = (0, import_react17.useState)(!!(targetAddress && contractAddress));
  const [error, setError] = (0, import_react17.useState)(null);
  const fetch = (0, import_react17.useCallback)(async () => {
    if (!targetAddress || !contractAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter17.getBridgeChainTokenBalance)(
        network,
        { address: targetAddress, contractaddress: contractAddress, tokenname: tokenName },
        admin,
        adminpwd
      );
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [network, targetAddress, contractAddress, tokenName, admin, adminpwd]);
  (0, import_react17.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroBridgeTokenTransactions = (network, contractAddress, address, admin, adminpwd) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = (0, import_react17.useState)([]);
  const [loading, setLoading] = (0, import_react17.useState)(!!(targetAddress && contractAddress));
  const [error, setError] = (0, import_react17.useState)(null);
  const fetch = (0, import_react17.useCallback)(async () => {
    if (!targetAddress || !contractAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter17.getBridgeChainTokenTransactions)(
        network,
        { address: targetAddress, contractaddress: contractAddress },
        admin,
        adminpwd
      );
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [network, targetAddress, contractAddress, admin, adminpwd]);
  (0, import_react17.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroBridgeTokenFee = (network, contractAddress, amount, admin, adminpwd) => {
  const [data, setData] = (0, import_react17.useState)(null);
  const [loading, setLoading] = (0, import_react17.useState)(!!(contractAddress && amount));
  const [error, setError] = (0, import_react17.useState)(null);
  const fetch = (0, import_react17.useCallback)(async () => {
    if (!contractAddress || !amount) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter17.getBridgeFeeEstimate)(
        network,
        { network, contractaddress: contractAddress, amount },
        admin,
        adminpwd
      );
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [network, contractAddress, amount, admin, adminpwd]);
  (0, import_react17.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};

// src/hooks/useToroDeployContract.ts
var import_react18 = require("react");
var import_sdk_adapter18 = require("@reactforge/sdk-adapter");
var useToroDeployContract = () => {
  const [data, setData] = (0, import_react18.useState)(null);
  const [loading, setLoading] = (0, import_react18.useState)(false);
  const [error, setError] = (0, import_react18.useState)(null);
  const deploy = (0, import_react18.useCallback)(async (input) => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter18.deployContract)(input);
      setData(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  return { data, loading, error, deploy };
};

// src/hooks/useToroWallet.ts
var import_react19 = require("react");
var import_sdk_adapter19 = require("@reactforge/sdk-adapter");
var useToroWallet = (address) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = (0, import_react19.useState)(null);
  const [loading, setLoading] = (0, import_react19.useState)(!!targetAddress);
  const [error, setError] = (0, import_react19.useState)(null);
  const fetchWallet = (0, import_react19.useCallback)(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const key = await (0, import_sdk_adapter19.getWalletKey)(targetAddress);
      setData({ key, address: targetAddress });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);
  (0, import_react19.useEffect)(() => {
    fetchWallet();
  }, [fetchWallet]);
  return { data, loading, error, refetch: fetchWallet };
};
var useToroImportWallet = () => {
  const [address, setAddress] = (0, import_react19.useState)(null);
  const [loading, setLoading] = (0, import_react19.useState)(false);
  const [error, setError] = (0, import_react19.useState)(null);
  const importWallet = (0, import_react19.useCallback)(async (privateKey, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter19.importWalletFromPrivateKey)(privateKey, password);
      setAddress(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  return { address, loading, error, importWallet };
};
var useToroUpdatePassword = () => {
  const { activeAddress } = useToroContext();
  const [loading, setLoading] = (0, import_react19.useState)(false);
  const [error, setError] = (0, import_react19.useState)(null);
  const [success, setSuccess] = (0, import_react19.useState)(false);
  const updatePassword = (0, import_react19.useCallback)(async (oldPassword, newPassword) => {
    if (!activeAddress) throw new Error("No active wallet address in context.");
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await (0, import_sdk_adapter19.updateWalletPassword)(activeAddress, oldPassword, newPassword);
      setSuccess(true);
      return true;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeAddress]);
  return { loading, error, success, updatePassword };
};
var useToroDeleteWallet = () => {
  const { activeAddress } = useToroContext();
  const [loading, setLoading] = (0, import_react19.useState)(false);
  const [error, setError] = (0, import_react19.useState)(null);
  const [success, setSuccess] = (0, import_react19.useState)(false);
  const deleteWalletAccount = (0, import_react19.useCallback)(async (password) => {
    if (!activeAddress) throw new Error("No active wallet address in context.");
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await (0, import_sdk_adapter19.deleteWallet)(activeAddress, password);
      setSuccess(true);
      return true;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeAddress]);
  return { loading, error, success, deleteWalletAccount };
};
var useToroVerifyPassword = () => {
  const [loading, setLoading] = (0, import_react19.useState)(false);
  const [error, setError] = (0, import_react19.useState)(null);
  const [isValid, setIsValid] = (0, import_react19.useState)(null);
  const verify = (0, import_react19.useCallback)(async (address, password) => {
    setLoading(true);
    setError(null);
    setIsValid(null);
    try {
      const result = await (0, import_sdk_adapter19.verifyWalletPassword)(address, password);
      setIsValid(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  return { loading, error, isValid, verify };
};

// src/hooks/useToroStorage.ts
var import_react20 = require("react");
var import_sdk_adapter20 = require("@reactforge/sdk-adapter");
var useToroStorageQuery = () => {
  const [isOn, setIsOn] = (0, import_react20.useState)(null);
  const [version, setVersion] = (0, import_react20.useState)(null);
  const [owner, setOwner] = (0, import_react20.useState)(null);
  const [loading, setLoading] = (0, import_react20.useState)(true);
  const [error, setError] = (0, import_react20.useState)(null);
  const fetch = (0, import_react20.useCallback)(async () => {
    setLoading(true);
    setError(null);
    try {
      const [onRes, verRes, ownerRes] = await Promise.allSettled([
        (0, import_sdk_adapter20.isStorageOn)(),
        (0, import_sdk_adapter20.getStorageVersion)(),
        (0, import_sdk_adapter20.getStorageOwner)()
      ]);
      if (onRes.status === "fulfilled") setIsOn(onRes.value);
      if (verRes.status === "fulfilled") setVersion(verRes.value);
      if (ownerRes.status === "fulfilled") setOwner(ownerRes.value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);
  (0, import_react20.useEffect)(() => {
    fetch();
  }, [fetch]);
  const checkContract = (0, import_react20.useCallback)(async (contract) => {
    return await (0, import_sdk_adapter20.isContractRegistered)(contract);
  }, []);
  const checkIfOwner = (0, import_react20.useCallback)(async (address) => {
    return await (0, import_sdk_adapter20.isStorageOwner)(address);
  }, []);
  return { isOn, version, owner, loading, error, checkContract, checkIfOwner, refetch: fetch };
};
var useToroStorageMutation = () => {
  const { activeAddress } = useToroContext();
  const [loading, setLoading] = (0, import_react20.useState)(false);
  const [error, setError] = (0, import_react20.useState)(null);
  const wrapMutation = (0, import_react20.useCallback)((mutation) => {
    return async (...args) => {
      setLoading(true);
      setError(null);
      try {
        return await mutation(...args);
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    };
  }, []);
  return {
    loading,
    error,
    turnOn: wrapMutation(async (pwd) => (0, import_sdk_adapter20.setStorageOn)(activeAddress, pwd)),
    turnOff: wrapMutation(async (pwd) => (0, import_sdk_adapter20.setStorageOff)(activeAddress, pwd)),
    registerContract: wrapMutation(async (pwd, contract) => (0, import_sdk_adapter20.registerStorageContract)(activeAddress, pwd, contract)),
    unregisterContract: wrapMutation(async (pwd, contract) => (0, import_sdk_adapter20.unregisterStorageContract)(activeAddress, pwd, contract)),
    increaseVersion: wrapMutation(async (pwd) => (0, import_sdk_adapter20.increaseStorageVersion)(activeAddress, pwd)),
    decreaseVersion: wrapMutation(async (pwd) => (0, import_sdk_adapter20.decreaseStorageVersion)(activeAddress, pwd)),
    setVersion: wrapMutation(async (pwd, version) => (0, import_sdk_adapter20.setStorageVersion)(activeAddress, pwd, version)),
    transferOwnership: wrapMutation(async (pwd, newOwner) => (0, import_sdk_adapter20.transferStorageOwnership)(activeAddress, pwd, newOwner))
  };
};

// src/hooks/useToroCurrencyAdmin.ts
var import_react21 = require("react");
var import_sdk_adapter21 = require("@reactforge/sdk-adapter");
var useToroCurrencyAdmin = () => {
  const [loading, setLoading] = (0, import_react21.useState)(false);
  const [error, setError] = (0, import_react21.useState)(null);
  const execute = (0, import_react21.useCallback)(async (actionFn) => {
    setLoading(true);
    setError(null);
    try {
      return await actionFn();
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    error,
    allowCurrencyTransfer: (currency, address, password) => execute(() => (0, import_sdk_adapter21.allowCurrencyTransfer)(currency, address, password)),
    disableCurrencyTransfer: (currency, address, password) => execute(() => (0, import_sdk_adapter21.disableCurrencyTransfer)(currency, address, password)),
    freezeCurrencyAddress: (params) => execute(() => (0, import_sdk_adapter21.freezeCurrencyAddress)(params)),
    unfreezeCurrencyAddress: (params) => execute(() => (0, import_sdk_adapter21.unfreezeCurrencyAddress)(params)),
    enrollCurrencyAddress: (params) => execute(() => (0, import_sdk_adapter21.enrollCurrencyAddress)(params)),
    mintCurrencyFunds: (params) => execute(() => (0, import_sdk_adapter21.mintCurrencyFunds)(params)),
    burnCurrencyFunds: (params) => execute(() => (0, import_sdk_adapter21.burnCurrencyFunds)(params))
  };
};

// src/hooks/useToroKeystore.ts
var import_react22 = require("react");
var import_sdk_adapter22 = require("@reactforge/sdk-adapter");
var useToroKeystore = () => {
  const [loading, setLoading] = (0, import_react22.useState)(false);
  const [error, setError] = (0, import_react22.useState)(null);
  const execute = (0, import_react22.useCallback)(async (actionFn) => {
    setLoading(true);
    setError(null);
    try {
      return await actionFn();
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    error,
    importWalletFromPrivateKey: (pvKey, password) => execute(() => (0, import_sdk_adapter22.importWalletFromPrivateKey)(pvKey, password)),
    getWalletKey: (address) => execute(() => (0, import_sdk_adapter22.getWalletKey)(address)),
    updateWalletPassword: (address, oldPassword, newPassword) => execute(() => (0, import_sdk_adapter22.updateWalletPassword)(address, oldPassword, newPassword)),
    deleteWallet: (address, password) => execute(() => (0, import_sdk_adapter22.deleteWallet)(address, password))
  };
};

// src/hooks/useToroProducts.ts
var import_react23 = require("react");
var import_sdk_adapter23 = require("@reactforge/sdk-adapter");
var useToroProducts = () => {
  const [loading, setLoading] = (0, import_react23.useState)(false);
  const [error, setError] = (0, import_react23.useState)(null);
  const execute = (0, import_react23.useCallback)(async (actionFn) => {
    setLoading(true);
    setError(null);
    try {
      return await actionFn();
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    error,
    getProject: (admin, getbalances) => execute(() => (0, import_sdk_adapter23.getProject)(admin, getbalances)),
    getProduct: (productId, admin, adminpwd) => execute(() => (0, import_sdk_adapter23.getProduct)(productId, admin, adminpwd)),
    createProduct: (input) => execute(() => (0, import_sdk_adapter23.createProduct)(input)),
    updateProduct: (input) => execute(() => (0, import_sdk_adapter23.updateProduct)(input))
  };
};

// src/hooks/useToroRoleMutations.ts
var import_react24 = require("react");
var import_sdk_adapter24 = require("@reactforge/sdk-adapter");
var useToroRoleMutations = () => {
  const [loading, setLoading] = (0, import_react24.useState)(false);
  const [error, setError] = (0, import_react24.useState)(null);
  const executeMutation = (0, import_react24.useCallback)(async (mutationFn) => {
    setLoading(true);
    setError(null);
    try {
      return await mutationFn();
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    error,
    addSuperAdmin: (adminStr, pwd, newAdmin) => executeMutation(() => (0, import_sdk_adapter24.addSuperAdmin)(adminStr, pwd, newAdmin)),
    addAdmin: (adminStr, pwd, newAdmin) => executeMutation(() => (0, import_sdk_adapter24.addAdmin)(adminStr, pwd, newAdmin)),
    removeAdmin: (adminStr, pwd, targetAdmin) => executeMutation(() => (0, import_sdk_adapter24.removeAdmin)(adminStr, pwd, targetAdmin)),
    getNumberOfAdmins: () => executeMutation(() => (0, import_sdk_adapter24.getNumberOfAdmins)()),
    getAdminIndex: (address) => executeMutation(() => (0, import_sdk_adapter24.getAdminIndex)(address)),
    isAdmin: (address) => executeMutation(() => (0, import_sdk_adapter24.isAdmin)(address)),
    isSuperAdmin: (address) => executeMutation(() => (0, import_sdk_adapter24.isSuperAdmin)(address)),
    isDebugger: (address) => executeMutation(() => (0, import_sdk_adapter24.isDebugger)(address))
  };
};

// src/hooks/useToroSwap.ts
var import_react25 = require("react");
var import_sdk_adapter25 = require("@reactforge/sdk-adapter");
var useToroSwapQuote = (params, enabled = true) => {
  const [data, setData] = (0, import_react25.useState)(null);
  const [loading, setLoading] = (0, import_react25.useState)(!!params && enabled);
  const [error, setError] = (0, import_react25.useState)(null);
  const fetch = (0, import_react25.useCallback)(async () => {
    if (!params || !enabled) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter25.getSwapQuote)(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [params?.fromCurrency, params?.toCurrency, params?.amount, enabled]);
  (0, import_react25.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroSwap = () => {
  const [loading, setLoading] = (0, import_react25.useState)(false);
  const [error, setError] = (0, import_react25.useState)(null);
  const [success, setSuccess] = (0, import_react25.useState)(false);
  const [result, setResult] = (0, import_react25.useState)(null);
  const swap = (0, import_react25.useCallback)(async (params) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResult(null);
    try {
      const res = await (0, import_sdk_adapter25.swapCurrency)(params);
      setResult(res);
      setSuccess(true);
      return res;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { loading, error, success, result, swap };
};

// src/hooks/useToroSolana.ts
var import_react26 = require("react");
var import_sdk_adapter26 = require("@reactforge/sdk-adapter");
var useToroCreateSolanaAddress = () => {
  const [address, setAddress] = (0, import_react26.useState)(null);
  const [loading, setLoading] = (0, import_react26.useState)(false);
  const [error, setError] = (0, import_react26.useState)(null);
  const createAddress = (0, import_react26.useCallback)(async (admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter26.createSolanaAddress)(admin, adminpwd);
      setAddress(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  return { address, loading, error, createAddress };
};
var useToroCreateToronetSolanaAddress = () => {
  const [solAddress, setSolAddress] = (0, import_react26.useState)(null);
  const [loading, setLoading] = (0, import_react26.useState)(false);
  const [error, setError] = (0, import_react26.useState)(null);
  const create = (0, import_react26.useCallback)(async (address, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter26.createToronetSolanaAddress)(address, password);
      setSolAddress(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  return { solAddress, loading, error, create };
};
var useToroIsValidSolanaAddress = () => {
  const [isValid, setIsValid] = (0, import_react26.useState)(null);
  const [loading, setLoading] = (0, import_react26.useState)(false);
  const [error, setError] = (0, import_react26.useState)(null);
  const validate = (0, import_react26.useCallback)(async (address) => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter26.isValidSolanaAddress)(address);
      setIsValid(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  return { isValid, loading, error, validate };
};
var useToroTransferSolana = () => {
  const [loading, setLoading] = (0, import_react26.useState)(false);
  const [error, setError] = (0, import_react26.useState)(null);
  const [success, setSuccess] = (0, import_react26.useState)(false);
  const transfer = (0, import_react26.useCallback)(async (params) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await (0, import_sdk_adapter26.transferSolana)(params);
      setSuccess(true);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { loading, error, success, transfer };
};
var useToroTransferSolToken = () => {
  const [loading, setLoading] = (0, import_react26.useState)(false);
  const [error, setError] = (0, import_react26.useState)(null);
  const [success, setSuccess] = (0, import_react26.useState)(false);
  const transfer = (0, import_react26.useCallback)(async (params) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await (0, import_sdk_adapter26.transferSolToken)(params);
      setSuccess(true);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { loading, error, success, transfer };
};
var useToroSolBalance = (address) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = (0, import_react26.useState)(null);
  const [loading, setLoading] = (0, import_react26.useState)(!!targetAddress);
  const [error, setError] = (0, import_react26.useState)(null);
  const fetch = (0, import_react26.useCallback)(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter26.getSolBalance)(targetAddress);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);
  (0, import_react26.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroSolTokenBalance = (address, contractAddress) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = (0, import_react26.useState)(null);
  const [loading, setLoading] = (0, import_react26.useState)(!!(targetAddress && contractAddress));
  const [error, setError] = (0, import_react26.useState)(null);
  const fetch = (0, import_react26.useCallback)(async () => {
    if (!targetAddress || !contractAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter26.getSolTokenBalance)(targetAddress, contractAddress);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress, contractAddress]);
  (0, import_react26.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroSolTransactions = (address) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = (0, import_react26.useState)([]);
  const [loading, setLoading] = (0, import_react26.useState)(!!targetAddress);
  const [error, setError] = (0, import_react26.useState)(null);
  const fetch = (0, import_react26.useCallback)(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter26.getSolTransactions)(targetAddress);
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);
  (0, import_react26.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroSolTokenTransactions = (address, contractAddress) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = (0, import_react26.useState)([]);
  const [loading, setLoading] = (0, import_react26.useState)(!!(targetAddress && contractAddress));
  const [error, setError] = (0, import_react26.useState)(null);
  const fetch = (0, import_react26.useCallback)(async () => {
    if (!targetAddress || !contractAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter26.getSolTokenTransactions)(targetAddress, contractAddress);
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress, contractAddress]);
  (0, import_react26.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroSolLatestBlock = () => {
  const [data, setData] = (0, import_react26.useState)(null);
  const [loading, setLoading] = (0, import_react26.useState)(true);
  const [error, setError] = (0, import_react26.useState)(null);
  const fetch = (0, import_react26.useCallback)(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await (0, import_sdk_adapter26.getSolLatestBlock)();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);
  (0, import_react26.useEffect)(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};

// src/errors.ts
var ToroError10 = class extends Error {
  constructor(code, detail, cause) {
    super(`[@reactforge/react] ${detail}`);
    this.name = "ToroError";
    this.code = code;
    this.detail = detail;
    this.cause = cause;
  }
};
var NetworkError = class extends ToroError10 {
  constructor(detail, cause) {
    super("NETWORK", detail, cause);
    this.name = "NetworkError";
  }
};
var APIError = class extends ToroError10 {
  constructor(detail, status, cause) {
    super("API", detail, cause);
    this.name = "APIError";
    this.status = status;
  }
};
function wrapError(err) {
  if (err instanceof ToroError10) {
    throw err;
  }
  if (err instanceof Error) {
    if (err.message.includes("Network") || err.message.includes("fetch") || err.message.includes("timeout")) {
      throw new NetworkError(err.message, err);
    }
    throw new APIError(err.message, void 0, err);
  }
  throw new APIError(String(err));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  APIError,
  NetworkError,
  ToroError,
  ToroProvider,
  useToroAddressRole,
  useToroBalance,
  useToroBlockchain,
  useToroBridge,
  useToroBridgeBalance,
  useToroBridgeTokenBalance,
  useToroBridgeTokenFee,
  useToroBridgeTokenTransactions,
  useToroBridgeTransactions,
  useToroChainTransactions,
  useToroContext,
  useToroCreateSolanaAddress,
  useToroCreateToronetSolanaAddress,
  useToroCreateWallet,
  useToroCurrencyAdmin,
  useToroDeleteTNS,
  useToroDeleteWallet,
  useToroDeployContract,
  useToroExchangeRates,
  useToroImportWallet,
  useToroIsValidSolanaAddress,
  useToroKYCStatus,
  useToroKeystore,
  useToroPayment,
  useToroPerformKYC,
  useToroProducts,
  useToroRoleMutations,
  useToroSend,
  useToroSolBalance,
  useToroSolLatestBlock,
  useToroSolTokenBalance,
  useToroSolTokenTransactions,
  useToroSolTransactions,
  useToroStorageMutation,
  useToroStorageQuery,
  useToroSwap,
  useToroSwapQuote,
  useToroTNSLookup,
  useToroTNSResolve,
  useToroTokenAllowance,
  useToroTokenBalance,
  useToroTokenFee,
  useToroTokenStatus,
  useToroTokenSupply,
  useToroTransactionByHash,
  useToroTransactionStatus,
  useToroTransactions,
  useToroTransferSolToken,
  useToroTransferSolana,
  useToroUpdatePassword,
  useToroUpdateTNS,
  useToroVerifyPassword,
  useToroVirtualWallet,
  useToroWallet,
  wrapError
});
