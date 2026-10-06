import { useState, useCallback, useEffect } from 'react';
import {
  BridgeNetwork,
  getBridgeChainBalance,
  getBridgeChainTokenBalance,
  getBridgeChainTransactions,
  getBridgeChainTokenTransactions,
  bridgeToken,
  getBridgeFeeEstimate,
  BridgeBalanceParams,
  BridgeTokenBalanceParams,
  BridgeTransactionParams,
  BridgeTransferParams,
  BridgeFeeParams,
} from '@reactforge/sdk-adapter';
import { useToroContext } from '../provider';

// ── useToroBridgeBalance ───────────────────────────────────────────────────

export interface UseToroBridgeBalanceResult {
  balance: any | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useToroBridgeBalance = (
  network: BridgeNetwork,
  address?: string,
  admin?: string,
  adminpwd?: string
): UseToroBridgeBalanceResult => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;

  const [balance, setBalance] = useState<any | null>(null);
  const [loading, setLoading] = useState(!!targetAddress);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  return { balance, loading, error, refetch: fetch };
};

// ── useToroBridge ──────────────────────────────────────────────────────────

export interface UseToroBridgeResult {
  loading: boolean;
  error: Error | null;
  /** Bridge tokens from the specified chain */
  transfer: (params: BridgeTransferParams, admin?: string, adminpwd?: string) => Promise<any>;
  /** Get an estimate for the bridge fee */
  getFeeEstimate: (params: BridgeFeeParams, admin?: string, adminpwd?: string) => Promise<any>;
}

export const useToroBridge = (): UseToroBridgeResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const transfer = useCallback(async (params: BridgeTransferParams, admin?: string, adminpwd?: string): Promise<any> => {
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

  const getFeeEstimate = useCallback(async (params: BridgeFeeParams, admin?: string, adminpwd?: string): Promise<any> => {
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

// ── useToroBridgeTransactions ──────────────────────────────────────────────

export interface UseToroBridgeTransactionsResult {
  data: any[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useToroBridgeTransactions = (
  network: BridgeNetwork,
  address?: string,
  admin?: string,
  adminpwd?: string
): UseToroBridgeTransactionsResult => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(!!targetAddress);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

// ── useToroBridgeTokenBalance ──────────────────────────────────────────────

export interface UseToroBridgeTokenBalanceResult {
  data: any | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/** Fetch a token balance for an address on a bridged chain. */
export const useToroBridgeTokenBalance = (
  network: BridgeNetwork,
  contractAddress: string,
  address?: string,
  tokenName?: string,
  admin?: string,
  adminpwd?: string
): UseToroBridgeTokenBalanceResult => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(!!(targetAddress && contractAddress));
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

// ── useToroBridgeTokenTransactions ────────────────────────────────────────

export interface UseToroBridgeTokenTransactionsResult {
  data: any[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/** Fetch token transaction history for an address on a bridged chain. */
export const useToroBridgeTokenTransactions = (
  network: BridgeNetwork,
  contractAddress: string,
  address?: string,
  admin?: string,
  adminpwd?: string
): UseToroBridgeTokenTransactionsResult => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(!!(targetAddress && contractAddress));
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

// ── useToroBridgeTokenFee ─────────────────────────────────────────────────

export interface UseToroBridgeTokenFeeResult {
  data: any | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/** Estimate the bridging fee for a token on a given network. */
export const useToroBridgeTokenFee = (
  network: BridgeNetwork,
  contractAddress: string,
  amount: string,
  admin?: string,
  adminpwd?: string
): UseToroBridgeTokenFeeResult => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(!!(contractAddress && amount));
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};
