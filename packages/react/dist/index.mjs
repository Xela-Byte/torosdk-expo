// src/provider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { initToroforge } from "@reactforge/sdk-adapter";
import { jsx } from "react/jsx-runtime";
var ToroContext = createContext(void 0);
var ToroProvider = ({ children, network = "mainnet", baseURL }) => {
  const [activeAddress, setActiveAddressState] = useState(() => {
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
  useEffect(() => {
    initToroforge({ network, baseURL });
  }, [network, baseURL]);
  return /* @__PURE__ */ jsx(ToroContext.Provider, { value: { network, activeAddress, setActiveAddress }, children });
};
var useToroContext = () => {
  const context = useContext(ToroContext);
  if (!context) {
    throw new Error("useToroContext must be used within a ToroProvider");
  }
  return context;
};

// src/hooks/useToroBalance.ts
import { useState as useState2, useEffect as useEffect2, useCallback } from "react";
import { getBalance } from "@reactforge/sdk-adapter";
var useToroBalance = (address) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = useState2(null);
  const [loading, setLoading] = useState2(!!targetAddress);
  const [error, setError] = useState2(null);
  const fetchBalance = useCallback(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getBalance(targetAddress);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);
  useEffect2(() => {
    fetchBalance();
  }, [fetchBalance]);
  return { data, loading, error, refetch: fetchBalance };
};

// src/hooks/useToroCreateWallet.ts
import { useState as useState3, useCallback as useCallback2 } from "react";
import { createWallet as sdkCreateWallet } from "@reactforge/sdk-adapter";
var useToroCreateWallet = () => {
  const [address, setAddress] = useState3(null);
  const [loading, setLoading] = useState3(false);
  const [error, setError] = useState3(null);
  const createWallet = useCallback2(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await sdkCreateWallet(username, password);
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
import { useState as useState4 } from "react";
import { sendTransaction as sdkSendTransaction } from "@reactforge/sdk-adapter";
var useToroSend = () => {
  const { activeAddress } = useToroContext();
  const [data, setData] = useState4(null);
  const [loading, setLoading] = useState4(false);
  const [error, setError] = useState4(null);
  const sendTransaction = async (params) => {
    if (!activeAddress) {
      throw new Error("No active wallet address available. Ensure user is logged in.");
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await sdkSendTransaction(
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
import { useState as useState5, useEffect as useEffect3, useCallback as useCallback3 } from "react";
import { resolveTNSName, lookupTNSAddress } from "@reactforge/sdk-adapter";
var useToroTNSResolve = (name) => {
  const [data, setData] = useState5(null);
  const [loading, setLoading] = useState5(!!name);
  const [error, setError] = useState5(null);
  const resolve = useCallback3(async () => {
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      const result = await resolveTNSName(name);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [name]);
  useEffect3(() => {
    resolve();
  }, [resolve]);
  return { data, loading, error, refetch: resolve };
};
var useToroTNSLookup = (address) => {
  const [data, setData] = useState5(null);
  const [loading, setLoading] = useState5(!!address);
  const [error, setError] = useState5(null);
  const lookup = useCallback3(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const result = await lookupTNSAddress(address);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [address]);
  useEffect3(() => {
    lookup();
  }, [lookup]);
  return { data, loading, error, refetch: lookup };
};

// src/hooks/useToroUpdateTNS.ts
import { useState as useState6, useCallback as useCallback4 } from "react";
import { updateTNSName, deleteTNSName, normalizeError } from "@reactforge/sdk-adapter";
var useToroUpdateTNS = () => {
  const { activeAddress } = useToroContext();
  const [loading, setLoading] = useState6(false);
  const [error, setError] = useState6(null);
  const [success, setSuccess] = useState6(false);
  const updateTNS = useCallback4(async (newUsername, password) => {
    if (!activeAddress) throw new Error("No active wallet address in context.");
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await updateTNSName(activeAddress, password, newUsername);
      setSuccess(true);
      return true;
    } catch (err) {
      const normalized = normalizeError(err, "updateTNS");
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
  const [loading, setLoading] = useState6(false);
  const [error, setError] = useState6(null);
  const [success, setSuccess] = useState6(false);
  const deleteTNS = useCallback4(async (password) => {
    if (!activeAddress) throw new Error("No active wallet address in context.");
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await deleteTNSName(activeAddress, password);
      setSuccess(true);
      return true;
    } catch (err) {
      const normalized = normalizeError(err, "deleteTNS");
      setError(normalized);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeAddress]);
  return { loading, error, success, deleteTNS };
};

// src/hooks/useToroTokenBalance.ts
import { useState as useState7, useEffect as useEffect4, useCallback as useCallback5 } from "react";
import { getTokenBalance, getTokenMetadata } from "@reactforge/sdk-adapter";
var useToroTokenBalance = (address) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = useState7(null);
  const [loading, setLoading] = useState7(!!targetAddress);
  const [error, setError] = useState7(null);
  const fetch = useCallback5(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const [balance, metadata] = await Promise.all([
        getTokenBalance(targetAddress),
        getTokenMetadata()
      ]);
      setData({ balance, ...metadata });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);
  useEffect4(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};

// src/hooks/useToroTokenExtended.ts
import { useState as useState8, useEffect as useEffect5, useCallback as useCallback6 } from "react";
import {
  getTokenAllowance,
  getMinimumTokenAllowance,
  getMaximumTokenAllowance,
  getTokenTransactionFee,
  isTokenEnrolled,
  isTokenFrozen,
  getTokenTotalCap
} from "@reactforge/sdk-adapter";
var useToroTokenAllowance = (owner, spender) => {
  const { activeAddress } = useToroContext();
  const targetOwner = owner || activeAddress;
  const [allowance, setAllowance] = useState8("0");
  const [minAllowance, setMinAllowance] = useState8("0");
  const [maxAllowance, setMaxAllowance] = useState8("0");
  const [loading, setLoading] = useState8(!!targetOwner);
  const [error, setError] = useState8(null);
  const fetch = useCallback6(async () => {
    if (!targetOwner) return;
    setLoading(true);
    setError(null);
    try {
      const [allw, min, max] = await Promise.allSettled([
        spender ? getTokenAllowance(targetOwner, spender) : Promise.resolve("0"),
        getMinimumTokenAllowance(targetOwner),
        getMaximumTokenAllowance(targetOwner)
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
  useEffect5(() => {
    fetch();
  }, [fetch]);
  return { allowance, minAllowance, maxAllowance, loading, error, refetch: fetch };
};
var useToroTokenFee = (amount) => {
  const [fee, setFee] = useState8("0");
  const [loading, setLoading] = useState8(true);
  const [error, setError] = useState8(null);
  const fetch = useCallback6(async () => {
    if (!amount) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getTokenTransactionFee(amount);
      setFee(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [amount]);
  useEffect5(() => {
    fetch();
  }, [fetch]);
  return { fee, loading, error, refetch: fetch };
};
var useToroTokenStatus = (address) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [isEnrolled, setIsEnrolled] = useState8(null);
  const [isFrozen, setIsFrozen] = useState8(null);
  const [loading, setLoading] = useState8(!!targetAddress);
  const [error, setError] = useState8(null);
  const fetch = useCallback6(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const [enrolled, frozen] = await Promise.allSettled([
        isTokenEnrolled(targetAddress),
        isTokenFrozen(targetAddress)
      ]);
      if (enrolled.status === "fulfilled") setIsEnrolled(enrolled.value);
      if (frozen.status === "fulfilled") setIsFrozen(frozen.value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);
  useEffect5(() => {
    fetch();
  }, [fetch]);
  return { isEnrolled, isFrozen, loading, error, refetch: fetch };
};
var useToroTokenSupply = () => {
  const [totalCap, setTotalCap] = useState8("0");
  const [loading, setLoading] = useState8(true);
  const [error, setError] = useState8(null);
  const fetch = useCallback6(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTokenTotalCap();
      setTotalCap(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect5(() => {
    fetch();
  }, [fetch]);
  return { totalCap, loading, error, refetch: fetch };
};

// src/hooks/useToroTransactions.ts
import { useState as useState9, useEffect as useEffect6, useCallback as useCallback7 } from "react";
import { getTransactions } from "@reactforge/sdk-adapter";
var useToroTransactions = (address, count = 20) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = useState9([]);
  const [loading, setLoading] = useState9(!!targetAddress);
  const [error, setError] = useState9(null);
  const fetchTransactions = useCallback7(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getTransactions(targetAddress, count);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [targetAddress, count]);
  useEffect6(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  return { data, loading, error, refetch: fetchTransactions };
};

// src/hooks/useToroTransactionByHash.ts
import { useState as useState10, useEffect as useEffect7, useCallback as useCallback8 } from "react";
import {
  getTransactionByHashAdapter,
  getTransactionReceipt
} from "@reactforge/sdk-adapter";
var useToroTransactionByHash = (hash) => {
  const [data, setData] = useState10(null);
  const [receipt, setReceipt] = useState10(null);
  const [loading, setLoading] = useState10(!!hash);
  const [error, setError] = useState10(null);
  const fetch = useCallback8(async () => {
    if (!hash) return;
    setLoading(true);
    setError(null);
    try {
      const [tx, rcpt] = await Promise.allSettled([
        getTransactionByHashAdapter(hash),
        getTransactionReceipt(hash)
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
  useEffect7(() => {
    fetch();
  }, [fetch]);
  return { data, receipt, loading, error, refetch: fetch };
};
var useToroTransactionStatus = (hash) => {
  const [status, setStatus] = useState10("unknown");
  const [loading, setLoading] = useState10(!!hash);
  const [error, setError] = useState10(null);
  const fetch = useCallback8(async () => {
    if (!hash) return;
    setLoading(true);
    setError(null);
    try {
      const tx = await getTransactionByHashAdapter(hash);
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
  useEffect7(() => {
    fetch();
  }, [fetch]);
  return { status, loading, error, refetch: fetch };
};

// src/hooks/useToroBlockchain.ts
import { useState as useState11, useEffect as useEffect8, useCallback as useCallback9 } from "react";
import {
  getChainStatus,
  getLatestBlock,
  getBlocks,
  getChainTransactions
} from "@reactforge/sdk-adapter";
var useToroBlockchain = (blockCount = 10) => {
  const [data, setData] = useState11({ status: null, latestBlock: null, blocks: [] });
  const [loading, setLoading] = useState11(true);
  const [error, setError] = useState11(null);
  const fetch = useCallback9(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusResult, latestBlockResult, blocksResult] = await Promise.allSettled([
        getChainStatus(),
        getLatestBlock(),
        getBlocks(blockCount)
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
  useEffect8(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroChainTransactions = (count = 20) => {
  const [data, setData] = useState11([]);
  const [loading, setLoading] = useState11(true);
  const [error, setError] = useState11(null);
  const fetch = useCallback9(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getChainTransactions(count);
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [count]);
  useEffect8(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};

// src/hooks/useToroAddressRole.ts
import { useState as useState12, useEffect as useEffect9, useCallback as useCallback10 } from "react";
import { getAddressRoleAdapter, isValidAddress } from "@reactforge/sdk-adapter";
var useToroAddressRole = (address) => {
  const [role, setRole] = useState12(null);
  const [isValid, setIsValid] = useState12(null);
  const [loading, setLoading] = useState12(!!address);
  const [error, setError] = useState12(null);
  const fetch = useCallback10(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const [roleResult, validResult] = await Promise.allSettled([
        getAddressRoleAdapter(address),
        isValidAddress(address)
      ]);
      if (roleResult.status === "fulfilled") setRole(roleResult.value);
      if (validResult.status === "fulfilled") setIsValid(validResult.value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [address]);
  useEffect9(() => {
    fetch();
  }, [fetch]);
  return { role, isValid, loading, error, refetch: fetch };
};

// src/hooks/useToroExchangeRates.ts
import { useState as useState13, useEffect as useEffect10, useCallback as useCallback11 } from "react";
import { getExchangeRates } from "@reactforge/sdk-adapter";
var useToroExchangeRates = () => {
  const [data, setData] = useState13([]);
  const [loading, setLoading] = useState13(true);
  const [error, setError] = useState13(null);
  const fetch = useCallback11(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getExchangeRates();
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect10(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};

// src/hooks/useToroKYCStatus.ts
import { useState as useState14, useEffect as useEffect11, useCallback as useCallback12 } from "react";
import { checkKYCStatus, performKYC } from "@reactforge/sdk-adapter";
var useToroKYCStatus = (address) => {
  const [isVerified, setIsVerified] = useState14(null);
  const [loading, setLoading] = useState14(!!address);
  const [error, setError] = useState14(null);
  const fetch = useCallback12(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const result = await checkKYCStatus(address);
      setIsVerified(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [address]);
  useEffect11(() => {
    fetch();
  }, [fetch]);
  return { isVerified, loading, error, refetch: fetch };
};
var useToroPerformKYC = () => {
  const [success, setSuccess] = useState14(false);
  const [loading, setLoading] = useState14(false);
  const [error, setError] = useState14(null);
  const submitKYC = useCallback12(async (input) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await performKYC(input);
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
import { useState as useState15, useCallback as useCallback13 } from "react";
import {
  initiateDeposit,
  confirmFiatDeposit,
  getBankListUSD,
  getBankListNGN
} from "@reactforge/sdk-adapter";
var useToroPayment = () => {
  const [loading, setLoading] = useState15(false);
  const [error, setError] = useState15(null);
  const deposit = useCallback13(async (input) => {
    setLoading(true);
    setError(null);
    try {
      return await initiateDeposit(input);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  const confirmDeposit = useCallback13(async (currency, txid) => {
    setLoading(true);
    setError(null);
    try {
      return await confirmFiatDeposit(currency, txid);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  const getUSDBanks = useCallback13(async (admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      return await getBankListUSD(admin, adminpwd);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  const getNGNBanks = useCallback13(async (admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      return await getBankListNGN(admin, adminpwd);
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
import { useState as useState16, useCallback as useCallback14 } from "react";
import {
  createVirtualWallet,
  fetchVirtualWallet,
  fetchVirtualWalletByAddress,
  updateVirtualWalletTransactions
} from "@reactforge/sdk-adapter";
var useToroVirtualWallet = () => {
  const [data, setData] = useState16(null);
  const [loading, setLoading] = useState16(false);
  const [error, setError] = useState16(null);
  const create = useCallback14(async (input) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createVirtualWallet(input);
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
  const fetchByWalletId = useCallback14(async (walletId, admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchVirtualWallet(walletId, admin, adminpwd);
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
  const fetchByAddress = useCallback14(async (address, admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchVirtualWalletByAddress(address, admin, adminpwd);
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
  const updateTransactions = useCallback14(async (address, admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      await updateVirtualWalletTransactions(address, admin, adminpwd);
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
import { useState as useState17, useCallback as useCallback15, useEffect as useEffect12 } from "react";
import {
  getBridgeChainBalance,
  getBridgeChainTokenBalance,
  getBridgeChainTransactions,
  getBridgeChainTokenTransactions,
  bridgeToken,
  getBridgeFeeEstimate
} from "@reactforge/sdk-adapter";
var useToroBridgeBalance = (network, address, admin, adminpwd) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [balance, setBalance] = useState17(null);
  const [loading, setLoading] = useState17(!!targetAddress);
  const [error, setError] = useState17(null);
  const fetch = useCallback15(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getBridgeChainBalance(network, { address: targetAddress }, admin, adminpwd);
      setBalance(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [network, targetAddress, admin, adminpwd]);
  useEffect12(() => {
    fetch();
  }, [fetch]);
  return { balance, loading, error, refetch: fetch };
};
var useToroBridge = () => {
  const [loading, setLoading] = useState17(false);
  const [error, setError] = useState17(null);
  const transfer = useCallback15(async (params, admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      return await bridgeToken(params.network, params, admin, adminpwd);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  const getFeeEstimate = useCallback15(async (params, admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      return await getBridgeFeeEstimate(params.network, params, admin, adminpwd);
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
  const [data, setData] = useState17([]);
  const [loading, setLoading] = useState17(!!targetAddress);
  const [error, setError] = useState17(null);
  const fetch = useCallback15(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getBridgeChainTransactions(network, { address: targetAddress }, admin, adminpwd);
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [network, targetAddress, admin, adminpwd]);
  useEffect12(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroBridgeTokenBalance = (network, contractAddress, address, tokenName, admin, adminpwd) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = useState17(null);
  const [loading, setLoading] = useState17(!!(targetAddress && contractAddress));
  const [error, setError] = useState17(null);
  const fetch = useCallback15(async () => {
    if (!targetAddress || !contractAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getBridgeChainTokenBalance(
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
  useEffect12(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroBridgeTokenTransactions = (network, contractAddress, address, admin, adminpwd) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = useState17([]);
  const [loading, setLoading] = useState17(!!(targetAddress && contractAddress));
  const [error, setError] = useState17(null);
  const fetch = useCallback15(async () => {
    if (!targetAddress || !contractAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getBridgeChainTokenTransactions(
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
  useEffect12(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroBridgeTokenFee = (network, contractAddress, amount, admin, adminpwd) => {
  const [data, setData] = useState17(null);
  const [loading, setLoading] = useState17(!!(contractAddress && amount));
  const [error, setError] = useState17(null);
  const fetch = useCallback15(async () => {
    if (!contractAddress || !amount) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getBridgeFeeEstimate(
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
  useEffect12(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};

// src/hooks/useToroDeployContract.ts
import { useState as useState18, useCallback as useCallback16 } from "react";
import { deployContract } from "@reactforge/sdk-adapter";
var useToroDeployContract = () => {
  const [data, setData] = useState18(null);
  const [loading, setLoading] = useState18(false);
  const [error, setError] = useState18(null);
  const deploy = useCallback16(async (input) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deployContract(input);
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
import { useState as useState19, useEffect as useEffect13, useCallback as useCallback17 } from "react";
import { getWalletKey, importWalletFromPrivateKey, updateWalletPassword, deleteWallet, verifyWalletPassword } from "@reactforge/sdk-adapter";
var useToroWallet = (address) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = useState19(null);
  const [loading, setLoading] = useState19(!!targetAddress);
  const [error, setError] = useState19(null);
  const fetchWallet = useCallback17(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const key = await getWalletKey(targetAddress);
      setData({ key, address: targetAddress });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);
  useEffect13(() => {
    fetchWallet();
  }, [fetchWallet]);
  return { data, loading, error, refetch: fetchWallet };
};
var useToroImportWallet = () => {
  const [address, setAddress] = useState19(null);
  const [loading, setLoading] = useState19(false);
  const [error, setError] = useState19(null);
  const importWallet = useCallback17(async (privateKey, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await importWalletFromPrivateKey(privateKey, password);
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
  const [loading, setLoading] = useState19(false);
  const [error, setError] = useState19(null);
  const [success, setSuccess] = useState19(false);
  const updatePassword = useCallback17(async (oldPassword, newPassword) => {
    if (!activeAddress) throw new Error("No active wallet address in context.");
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await updateWalletPassword(activeAddress, oldPassword, newPassword);
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
  const [loading, setLoading] = useState19(false);
  const [error, setError] = useState19(null);
  const [success, setSuccess] = useState19(false);
  const deleteWalletAccount = useCallback17(async (password) => {
    if (!activeAddress) throw new Error("No active wallet address in context.");
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await deleteWallet(activeAddress, password);
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
  const [loading, setLoading] = useState19(false);
  const [error, setError] = useState19(null);
  const [isValid, setIsValid] = useState19(null);
  const verify = useCallback17(async (address, password) => {
    setLoading(true);
    setError(null);
    setIsValid(null);
    try {
      const result = await verifyWalletPassword(address, password);
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
import { useState as useState20, useCallback as useCallback18, useEffect as useEffect14 } from "react";
import {
  isStorageOn,
  getStorageVersion,
  isContractRegistered,
  getStorageOwner,
  isStorageOwner,
  setStorageOn,
  setStorageOff,
  registerStorageContract,
  unregisterStorageContract,
  increaseStorageVersion,
  decreaseStorageVersion,
  setStorageVersion,
  transferStorageOwnership
} from "@reactforge/sdk-adapter";
var useToroStorageQuery = () => {
  const [isOn, setIsOn] = useState20(null);
  const [version, setVersion] = useState20(null);
  const [owner, setOwner] = useState20(null);
  const [loading, setLoading] = useState20(true);
  const [error, setError] = useState20(null);
  const fetch = useCallback18(async () => {
    setLoading(true);
    setError(null);
    try {
      const [onRes, verRes, ownerRes] = await Promise.allSettled([
        isStorageOn(),
        getStorageVersion(),
        getStorageOwner()
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
  useEffect14(() => {
    fetch();
  }, [fetch]);
  const checkContract = useCallback18(async (contract) => {
    return await isContractRegistered(contract);
  }, []);
  const checkIfOwner = useCallback18(async (address) => {
    return await isStorageOwner(address);
  }, []);
  return { isOn, version, owner, loading, error, checkContract, checkIfOwner, refetch: fetch };
};
var useToroStorageMutation = () => {
  const { activeAddress } = useToroContext();
  const [loading, setLoading] = useState20(false);
  const [error, setError] = useState20(null);
  const wrapMutation = useCallback18((mutation) => {
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
    turnOn: wrapMutation(async (pwd) => setStorageOn(activeAddress, pwd)),
    turnOff: wrapMutation(async (pwd) => setStorageOff(activeAddress, pwd)),
    registerContract: wrapMutation(async (pwd, contract) => registerStorageContract(activeAddress, pwd, contract)),
    unregisterContract: wrapMutation(async (pwd, contract) => unregisterStorageContract(activeAddress, pwd, contract)),
    increaseVersion: wrapMutation(async (pwd) => increaseStorageVersion(activeAddress, pwd)),
    decreaseVersion: wrapMutation(async (pwd) => decreaseStorageVersion(activeAddress, pwd)),
    setVersion: wrapMutation(async (pwd, version) => setStorageVersion(activeAddress, pwd, version)),
    transferOwnership: wrapMutation(async (pwd, newOwner) => transferStorageOwnership(activeAddress, pwd, newOwner))
  };
};

// src/hooks/useToroCurrencyAdmin.ts
import { useState as useState21, useCallback as useCallback19 } from "react";
import {
  allowCurrencyTransfer,
  disableCurrencyTransfer,
  freezeCurrencyAddress,
  unfreezeCurrencyAddress,
  enrollCurrencyAddress,
  mintCurrencyFunds,
  burnCurrencyFunds
} from "@reactforge/sdk-adapter";
var useToroCurrencyAdmin = () => {
  const [loading, setLoading] = useState21(false);
  const [error, setError] = useState21(null);
  const execute = useCallback19(async (actionFn) => {
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
    allowCurrencyTransfer: (currency, address, password) => execute(() => allowCurrencyTransfer(currency, address, password)),
    disableCurrencyTransfer: (currency, address, password) => execute(() => disableCurrencyTransfer(currency, address, password)),
    freezeCurrencyAddress: (params) => execute(() => freezeCurrencyAddress(params)),
    unfreezeCurrencyAddress: (params) => execute(() => unfreezeCurrencyAddress(params)),
    enrollCurrencyAddress: (params) => execute(() => enrollCurrencyAddress(params)),
    mintCurrencyFunds: (params) => execute(() => mintCurrencyFunds(params)),
    burnCurrencyFunds: (params) => execute(() => burnCurrencyFunds(params))
  };
};

// src/hooks/useToroKeystore.ts
import { useState as useState22, useCallback as useCallback20 } from "react";
import {
  importWalletFromPrivateKey as importWalletFromPrivateKey2,
  getWalletKey as getWalletKey2,
  updateWalletPassword as updateWalletPassword2,
  deleteWallet as deleteWallet2
} from "@reactforge/sdk-adapter";
var useToroKeystore = () => {
  const [loading, setLoading] = useState22(false);
  const [error, setError] = useState22(null);
  const execute = useCallback20(async (actionFn) => {
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
    importWalletFromPrivateKey: (pvKey, password) => execute(() => importWalletFromPrivateKey2(pvKey, password)),
    getWalletKey: (address) => execute(() => getWalletKey2(address)),
    updateWalletPassword: (address, oldPassword, newPassword) => execute(() => updateWalletPassword2(address, oldPassword, newPassword)),
    deleteWallet: (address, password) => execute(() => deleteWallet2(address, password))
  };
};

// src/hooks/useToroProducts.ts
import { useState as useState23, useCallback as useCallback21 } from "react";
import {
  getProject,
  getProduct,
  createProduct,
  updateProduct
} from "@reactforge/sdk-adapter";
var useToroProducts = () => {
  const [loading, setLoading] = useState23(false);
  const [error, setError] = useState23(null);
  const execute = useCallback21(async (actionFn) => {
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
    getProject: (admin, getbalances) => execute(() => getProject(admin, getbalances)),
    getProduct: (productId, admin, adminpwd) => execute(() => getProduct(productId, admin, adminpwd)),
    createProduct: (input) => execute(() => createProduct(input)),
    updateProduct: (input) => execute(() => updateProduct(input))
  };
};

// src/hooks/useToroRoleMutations.ts
import { useState as useState24, useCallback as useCallback22 } from "react";
import {
  addSuperAdmin,
  addAdmin,
  removeAdmin,
  getNumberOfAdmins,
  getAdminIndex,
  isAdmin,
  isSuperAdmin,
  isDebugger
} from "@reactforge/sdk-adapter";
var useToroRoleMutations = () => {
  const [loading, setLoading] = useState24(false);
  const [error, setError] = useState24(null);
  const executeMutation = useCallback22(async (mutationFn) => {
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
    addSuperAdmin: (adminStr, pwd, newAdmin) => executeMutation(() => addSuperAdmin(adminStr, pwd, newAdmin)),
    addAdmin: (adminStr, pwd, newAdmin) => executeMutation(() => addAdmin(adminStr, pwd, newAdmin)),
    removeAdmin: (adminStr, pwd, targetAdmin) => executeMutation(() => removeAdmin(adminStr, pwd, targetAdmin)),
    getNumberOfAdmins: () => executeMutation(() => getNumberOfAdmins()),
    getAdminIndex: (address) => executeMutation(() => getAdminIndex(address)),
    isAdmin: (address) => executeMutation(() => isAdmin(address)),
    isSuperAdmin: (address) => executeMutation(() => isSuperAdmin(address)),
    isDebugger: (address) => executeMutation(() => isDebugger(address))
  };
};

// src/hooks/useToroSwap.ts
import { useState as useState25, useEffect as useEffect15, useCallback as useCallback23 } from "react";
import {
  getSwapQuote,
  swapCurrency
} from "@reactforge/sdk-adapter";
var useToroSwapQuote = (params, enabled = true) => {
  const [data, setData] = useState25(null);
  const [loading, setLoading] = useState25(!!params && enabled);
  const [error, setError] = useState25(null);
  const fetch = useCallback23(async () => {
    if (!params || !enabled) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getSwapQuote(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [params?.fromCurrency, params?.toCurrency, params?.amount, enabled]);
  useEffect15(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroSwap = () => {
  const [loading, setLoading] = useState25(false);
  const [error, setError] = useState25(null);
  const [success, setSuccess] = useState25(false);
  const [result, setResult] = useState25(null);
  const swap = useCallback23(async (params) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResult(null);
    try {
      const res = await swapCurrency(params);
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
import { useState as useState26, useEffect as useEffect16, useCallback as useCallback24 } from "react";
import {
  createSolanaAddress,
  createToronetSolanaAddress,
  isValidSolanaAddress,
  transferSolana,
  transferSolToken,
  getSolBalance,
  getSolTokenBalance,
  getSolTransactions,
  getSolTokenTransactions,
  getSolLatestBlock
} from "@reactforge/sdk-adapter";
var useToroCreateSolanaAddress = () => {
  const [address, setAddress] = useState26(null);
  const [loading, setLoading] = useState26(false);
  const [error, setError] = useState26(null);
  const createAddress = useCallback24(async (admin, adminpwd) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createSolanaAddress(admin, adminpwd);
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
  const [solAddress, setSolAddress] = useState26(null);
  const [loading, setLoading] = useState26(false);
  const [error, setError] = useState26(null);
  const create = useCallback24(async (address, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createToronetSolanaAddress(address, password);
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
  const [isValid, setIsValid] = useState26(null);
  const [loading, setLoading] = useState26(false);
  const [error, setError] = useState26(null);
  const validate = useCallback24(async (address) => {
    setLoading(true);
    setError(null);
    try {
      const result = await isValidSolanaAddress(address);
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
  const [loading, setLoading] = useState26(false);
  const [error, setError] = useState26(null);
  const [success, setSuccess] = useState26(false);
  const transfer = useCallback24(async (params) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await transferSolana(params);
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
  const [loading, setLoading] = useState26(false);
  const [error, setError] = useState26(null);
  const [success, setSuccess] = useState26(false);
  const transfer = useCallback24(async (params) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await transferSolToken(params);
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
  const [data, setData] = useState26(null);
  const [loading, setLoading] = useState26(!!targetAddress);
  const [error, setError] = useState26(null);
  const fetch = useCallback24(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getSolBalance(targetAddress);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);
  useEffect16(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroSolTokenBalance = (address, contractAddress) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = useState26(null);
  const [loading, setLoading] = useState26(!!(targetAddress && contractAddress));
  const [error, setError] = useState26(null);
  const fetch = useCallback24(async () => {
    if (!targetAddress || !contractAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getSolTokenBalance(targetAddress, contractAddress);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress, contractAddress]);
  useEffect16(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroSolTransactions = (address) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = useState26([]);
  const [loading, setLoading] = useState26(!!targetAddress);
  const [error, setError] = useState26(null);
  const fetch = useCallback24(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getSolTransactions(targetAddress);
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);
  useEffect16(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroSolTokenTransactions = (address, contractAddress) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  const [data, setData] = useState26([]);
  const [loading, setLoading] = useState26(!!(targetAddress && contractAddress));
  const [error, setError] = useState26(null);
  const fetch = useCallback24(async () => {
    if (!targetAddress || !contractAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getSolTokenTransactions(targetAddress, contractAddress);
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress, contractAddress]);
  useEffect16(() => {
    fetch();
  }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
var useToroSolLatestBlock = () => {
  const [data, setData] = useState26(null);
  const [loading, setLoading] = useState26(true);
  const [error, setError] = useState26(null);
  const fetch = useCallback24(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSolLatestBlock();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect16(() => {
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
export {
  APIError,
  NetworkError,
  ToroError10 as ToroError,
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
};
