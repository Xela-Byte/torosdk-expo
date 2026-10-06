import { useState, useEffect, useCallback } from 'react';
import {
  getTokenAllowance,
  getMinimumTokenAllowance,
  getMaximumTokenAllowance,
  getTokenTransactionFee,
  isTokenEnrolled,
  isTokenFrozen,
  getTokenTotalCap,
} from '@reactforge/sdk-adapter';
import { useToroContext } from '../provider';

// ── useToroTokenAllowance ──────────────────────────────────────────────────

export interface UseToroTokenAllowanceResult {
  allowance: string;
  minAllowance: string;
  maxAllowance: string;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useToroTokenAllowance = (owner?: string, spender?: string): UseToroTokenAllowanceResult => {
  const { activeAddress } = useToroContext();
  const targetOwner = owner || activeAddress;

  const [allowance, setAllowance] = useState('0');
  const [minAllowance, setMinAllowance] = useState('0');
  const [maxAllowance, setMaxAllowance] = useState('0');
  const [loading, setLoading] = useState(!!targetOwner);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!targetOwner) return;
    setLoading(true);
    setError(null);
    try {
      const [allw, min, max] = await Promise.allSettled([
        spender ? getTokenAllowance(targetOwner, spender) : Promise.resolve('0'),
        getMinimumTokenAllowance(targetOwner),
        getMaximumTokenAllowance(targetOwner),
      ]);
      if (allw.status === 'fulfilled') setAllowance(allw.value);
      if (min.status === 'fulfilled') setMinAllowance(min.value);
      if (max.status === 'fulfilled') setMaxAllowance(max.value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetOwner, spender]);

  useEffect(() => { fetch(); }, [fetch]);

  return { allowance, minAllowance, maxAllowance, loading, error, refetch: fetch };
};

// ── useToroTokenFee ────────────────────────────────────────────────────────

export interface UseToroTokenFeeResult {
  fee: string;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useToroTokenFee = (amount: string | number): UseToroTokenFeeResult => {
  const [fee, setFee] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  return { fee, loading, error, refetch: fetch };
};

// ── useToroTokenStatus ─────────────────────────────────────────────────────

export interface UseToroTokenStatusResult {
  isEnrolled: boolean | null;
  isFrozen: boolean | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useToroTokenStatus = (address?: string): UseToroTokenStatusResult => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;

  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [isFrozen, setIsFrozen] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(!!targetAddress);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const [enrolled, frozen] = await Promise.allSettled([
        isTokenEnrolled(targetAddress),
        isTokenFrozen(targetAddress),
      ]);
      if (enrolled.status === 'fulfilled') setIsEnrolled(enrolled.value);
      if (frozen.status === 'fulfilled') setIsFrozen(frozen.value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);

  useEffect(() => { fetch(); }, [fetch]);

  return { isEnrolled, isFrozen, loading, error, refetch: fetch };
};

// ── useToroTokenSupply ─────────────────────────────────────────────────────

export interface UseToroTokenSupplyResult {
  totalCap: string;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useToroTokenSupply = (): UseToroTokenSupplyResult => {
  const [totalCap, setTotalCap] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  return { totalCap, loading, error, refetch: fetch };
};
