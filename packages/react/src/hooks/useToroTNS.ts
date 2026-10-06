import { useState, useEffect, useCallback } from 'react';
import { resolveTNSName, lookupTNSAddress } from '@reactforge/sdk-adapter';

export const useToroTNSResolve = (name?: string) => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!name);
  const [error, setError] = useState<Error | null>(null);

  const resolve = useCallback(async () => {
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

  useEffect(() => { resolve(); }, [resolve]);

  return { data, loading, error, refetch: resolve };
};

export const useToroTNSLookup = (address?: string) => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!address);
  const [error, setError] = useState<Error | null>(null);

  const lookup = useCallback(async () => {
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

  useEffect(() => { lookup(); }, [lookup]);

  return { data, loading, error, refetch: lookup };
};
