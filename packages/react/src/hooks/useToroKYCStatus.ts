import { useState, useEffect, useCallback } from 'react';
import { checkKYCStatus, performKYC, KYCInput, ToroError } from '@reactforge/sdk-adapter';

// ── useToroKYCStatus ───────────────────────────────────────────────────────

export interface UseToroKYCStatusResult {
  isVerified: boolean | null;
  loading: boolean;
  error: ToroError | Error | null;
  refetch: () => Promise<void>;
}

/** Query whether a wallet address is KYC-verified. */
export const useToroKYCStatus = (address?: string | null): UseToroKYCStatusResult => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(!!address);
  const [error, setError] = useState<ToroError | Error | null>(null);

  const fetch = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const result = await checkKYCStatus(address);
      setIsVerified(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => { fetch(); }, [fetch]);

  return { isVerified, loading, error, refetch: fetch };
};

// ── useToroPerformKYC ──────────────────────────────────────────────────────

export interface UseToroPerformKYCResult {
  success: boolean;
  loading: boolean;
  error: Error | null;
  submitKYC: (input: KYCInput) => Promise<boolean>;
}

/** Mutation hook to submit KYC data for a customer (requires admin credentials). */
export const useToroPerformKYC = (): UseToroPerformKYCResult => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitKYC = useCallback(async (input: KYCInput): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await performKYC(input);
      setSuccess(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { success, loading, error, submitKYC };
};
