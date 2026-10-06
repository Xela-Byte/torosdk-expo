import { useState, useEffect, useCallback } from 'react';
import {
  getTransactionByHashAdapter,
  getTransactionReceipt,
  ToroError,
  Transaction,
} from '@reactforge/sdk-adapter';

// ── useToroTransactionByHash ───────────────────────────────────────────────

export interface UseToroTransactionByHashResult {
  data: Transaction | null;
  receipt: any | null;
  loading: boolean;
  error: ToroError | Error | null;
  refetch: () => Promise<void>;
}

/** Fetch a single transaction and its receipt by hash. */
export const useToroTransactionByHash = (hash?: string | null): UseToroTransactionByHashResult => {
  const [data, setData] = useState<Transaction | null>(null);
  const [receipt, setReceipt] = useState<any | null>(null);
  const [loading, setLoading] = useState(!!hash);
  const [error, setError] = useState<ToroError | Error | null>(null);

  const fetch = useCallback(async () => {
    if (!hash) return;
    setLoading(true);
    setError(null);
    try {
      const [tx, rcpt] = await Promise.allSettled([
        getTransactionByHashAdapter(hash),
        getTransactionReceipt(hash),
      ]);
      if (tx.status === 'fulfilled') setData(tx.value);
      if (rcpt.status === 'fulfilled') setReceipt(rcpt.value);
      if (tx.status === 'rejected') throw tx.reason;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [hash]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, receipt, loading, error, refetch: fetch };
};

// ── useToroTransactionStatus ───────────────────────────────────────────────

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'unknown';

export interface UseToroTransactionStatusResult {
  status: TransactionStatus;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/** Derives the success/failure status from a transaction hash. */
export const useToroTransactionStatus = (hash?: string | null): UseToroTransactionStatusResult => {
  const [status, setStatus] = useState<TransactionStatus>('unknown');
  const [loading, setLoading] = useState(!!hash);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!hash) return;
    setLoading(true);
    setError(null);
    try {
      const tx = await getTransactionByHashAdapter(hash);
      if (!tx) {
        setStatus('pending');
      } else {
        const s = tx.status?.toString().toLowerCase();
        if (s === '1' || s === 'success' || s === 'true') setStatus('success');
        else if (s === '0' || s === 'failed' || s === 'false') setStatus('failed');
        else setStatus('unknown');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setStatus('unknown');
    } finally {
      setLoading(false);
    }
  }, [hash]);

  useEffect(() => { fetch(); }, [fetch]);

  return { status, loading, error, refetch: fetch };
};
