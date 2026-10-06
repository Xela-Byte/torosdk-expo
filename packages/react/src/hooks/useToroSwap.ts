import { useState, useEffect, useCallback } from 'react';
import {
  getSwapQuote,
  swapCurrency,
  type SwapRateOutput,
  type SwapQuoteParams,
  type SwapExecuteParams,
} from '@reactforge/sdk-adapter';

// ── useToroSwapQuote ──────────────────────────────────────────────────────

export interface UseToroSwapQuoteResult {
  data: SwapRateOutput | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch a swap quote for a given currency pair and amount.
 *
 * @param params - `fromCurrency`, `toCurrency`, and `amount`.
 * @param enabled - Set to `false` to disable the auto-fetch (default: `true`).
 *
 * @example
 * ```tsx
 * const { data, loading } = useToroSwapQuote({ fromCurrency: 'NGN', toCurrency: 'USD', amount: 1000 });
 * ```
 */
export const useToroSwapQuote = (
  params: SwapQuoteParams | null,
  enabled = true
): UseToroSwapQuoteResult => {
  const [data, setData] = useState<SwapRateOutput | null>(null);
  const [loading, setLoading] = useState(!!params && enabled);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
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
  }, [params?.fromCurrency, params?.toCurrency, params?.amount, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

// ── useToroSwap ──────────────────────────────────────────────────────────

export interface UseToroSwapResult {
  loading: boolean;
  error: Error | null;
  success: boolean;
  result: any;
  swap: (params: SwapExecuteParams) => Promise<any>;
}

/**
 * Execute a currency swap on the Toronet network.
 *
 * @example
 * ```tsx
 * const { swap, loading, error } = useToroSwap();
 * await swap({ fromCurrency: 'NGN', toCurrency: 'USD', amount: 1000, client: address, clientPassword: password });
 * ```
 */
export const useToroSwap = (): UseToroSwapResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<any>(null);

  const swap = useCallback(async (params: SwapExecuteParams): Promise<any> => {
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
