import { useState, useEffect, useCallback } from 'react';
import { getBalance, Balances, ToroError } from '@reactforge/sdk-adapter';
import { useToroContext } from '../provider';

export interface UseToroBalanceResult {
  data: Balances | null;
  loading: boolean;
  error: ToroError | Error | null;
  refetch: () => Promise<void>;
}

export const useToroBalance = (address?: string | null): UseToroBalanceResult => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;
  
  const [data, setData] = useState<Balances | null>(null);
  const [loading, setLoading] = useState<boolean>(!!targetAddress);
  const [error, setError] = useState<ToroError | Error | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getBalance(targetAddress);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { data, loading, error, refetch: fetchBalance };
};
