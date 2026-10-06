import { useState, useEffect, useCallback } from 'react';
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
  getSolLatestBlock,
} from '@reactforge/sdk-adapter';
import { useToroContext } from '../provider';

// ── useToroCreateSolanaAddress ─────────────────────────────────────────────

export interface UseToroCreateSolanaAddressResult {
  address: string | null;
  loading: boolean;
  error: Error | null;
  createAddress: (admin?: string, adminpwd?: string) => Promise<string | null>;
}

/** Create a new Solana address via the Toronet admin API. */
export const useToroCreateSolanaAddress = (): UseToroCreateSolanaAddressResult => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createAddress = useCallback(async (admin?: string, adminpwd?: string): Promise<string | null> => {
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

// ── useToroCreateToronetSolanaAddress ─────────────────────────────────────

export interface UseToroCreateToronetSolanaAddressResult {
  solAddress: string | null;
  loading: boolean;
  error: Error | null;
  create: (address: string, password: string) => Promise<string | null>;
}

/** Link a Toronet address to a new Solana address. */
export const useToroCreateToronetSolanaAddress = (): UseToroCreateToronetSolanaAddressResult => {
  const [solAddress, setSolAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (address: string, password: string): Promise<string | null> => {
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

// ── useToroIsValidSolanaAddress ────────────────────────────────────────────

export interface UseToroIsValidSolanaAddressResult {
  isValid: boolean | null;
  loading: boolean;
  error: Error | null;
  validate: (address: string) => Promise<boolean | null>;
}

/** Validate whether a string is a valid Solana address. */
export const useToroIsValidSolanaAddress = (): UseToroIsValidSolanaAddressResult => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const validate = useCallback(async (address: string): Promise<boolean | null> => {
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

// ── useToroTransferSolana ─────────────────────────────────────────────────

export interface UseToroTransferSolanaResult {
  loading: boolean;
  error: Error | null;
  success: boolean;
  transfer: (params: { from: string; to: string; amount: string; pwd: string }) => Promise<any>;
}

/** Transfer native SOL between addresses. */
export const useToroTransferSolana = (): UseToroTransferSolanaResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const transfer = useCallback(async (params: { from: string; to: string; amount: string; pwd: string }): Promise<any> => {
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

// ── useToroTransferSolToken ───────────────────────────────────────────────

export interface UseToroTransferSolTokenResult {
  loading: boolean;
  error: Error | null;
  success: boolean;
  transfer: (params: {
    from: string;
    to: string;
    amount: string;
    pwd: string;
    contractaddress: string;
    tokenname: string;
    usetokenasfees?: string;
  }) => Promise<any>;
}

/** Transfer an SPL token on Solana. */
export const useToroTransferSolToken = (): UseToroTransferSolTokenResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const transfer = useCallback(async (params: {
    from: string;
    to: string;
    amount: string;
    pwd: string;
    contractaddress: string;
    tokenname: string;
    usetokenasfees?: string;
  }): Promise<any> => {
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

// ── useToroSolBalance ─────────────────────────────────────────────────────

export interface UseToroSolBalanceResult {
  data: any | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/** Fetch the native SOL balance for a wallet address. */
export const useToroSolBalance = (address?: string | null): UseToroSolBalanceResult => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(!!targetAddress);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

// ── useToroSolTokenBalance ────────────────────────────────────────────────

export interface UseToroSolTokenBalanceResult {
  data: any | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/** Fetch the SPL token balance for an address and contract. */
export const useToroSolTokenBalance = (
  address?: string | null,
  contractAddress?: string | null
): UseToroSolTokenBalanceResult => {
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
      const result = await getSolTokenBalance(targetAddress, contractAddress);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress, contractAddress]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

// ── useToroSolTransactions ────────────────────────────────────────────────

export interface UseToroSolTransactionsResult {
  data: any[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/** Fetch native SOL transaction history for a wallet address. */
export const useToroSolTransactions = (address?: string | null): UseToroSolTransactionsResult => {
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
      const result = await getSolTransactions(targetAddress);
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

// ── useToroSolTokenTransactions ───────────────────────────────────────────

export interface UseToroSolTokenTransactionsResult {
  data: any[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/** Fetch SPL token transaction history for an address and contract. */
export const useToroSolTokenTransactions = (
  address?: string | null,
  contractAddress?: string | null
): UseToroSolTokenTransactionsResult => {
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
      const result = await getSolTokenTransactions(targetAddress, contractAddress);
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress, contractAddress]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

// ── useToroSolLatestBlock ─────────────────────────────────────────────────

export interface UseToroSolLatestBlockResult {
  data: any | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/** Fetch the latest Solana block info. */
export const useToroSolLatestBlock = (): UseToroSolLatestBlockResult => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};
