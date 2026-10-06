import { useState, useEffect, useCallback } from 'react';
import { getTransactions, ToroError, Transaction } from '@reactforge/sdk-adapter';
import { useToroContext } from '../provider';

export interface UseToroTransactionsResult {
  data: Transaction[];
  loading: boolean;
  error: ToroError | Error | null;
  refetch: () => Promise<void>;
}

export const useToroTransactions = (address?: string | null, count: number = 20): UseToroTransactionsResult => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;

  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(!!targetAddress);
  const [error, setError] = useState<ToroError | Error | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getTransactions(targetAddress, count);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [targetAddress, count]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { data, loading, error, refetch: fetchTransactions };
};
