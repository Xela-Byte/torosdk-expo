import { useState, useEffect, useCallback } from 'react';
import { getTokenBalance, getTokenMetadata } from '@reactforge/sdk-adapter';
import { useToroContext } from '../provider';

export interface TokenBalance {
  balance: string;
  name: string;
  symbol: string;
  decimals: number;
}

export const useToroTokenBalance = (address?: string | null) => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;

  const [data, setData] = useState<TokenBalance | null>(null);
  const [loading, setLoading] = useState(!!targetAddress);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};
