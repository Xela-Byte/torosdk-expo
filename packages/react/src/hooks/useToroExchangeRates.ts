import { useState, useEffect, useCallback } from 'react';
import { getExchangeRates, ExchangeRate, ToroError } from '@reactforge/sdk-adapter';

export interface UseToroExchangeRatesResult {
  data: ExchangeRate[];
  loading: boolean;
  error: ToroError | Error | null;
  refetch: () => Promise<void>;
}

/** Fetch all supported asset exchange rates from Toronet. */
export const useToroExchangeRates = (): UseToroExchangeRatesResult => {
  const [data, setData] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ToroError | Error | null>(null);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};
