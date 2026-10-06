import { useState, useEffect, useCallback } from 'react';
import { getAddressRoleAdapter, isValidAddress, ToroError } from '@reactforge/sdk-adapter';

// ── useToroAddressRole ─────────────────────────────────────────────────────

export interface UseToroAddressRoleResult {
  role: string | null;
  isValid: boolean | null;
  loading: boolean;
  error: ToroError | Error | null;
  refetch: () => Promise<void>;
}

/** Fetch the on-chain role of any address + validate address format. */
export const useToroAddressRole = (address?: string | null): UseToroAddressRoleResult => {
  const [role, setRole] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(!!address);
  const [error, setError] = useState<ToroError | Error | null>(null);

  const fetch = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const [roleResult, validResult] = await Promise.allSettled([
        getAddressRoleAdapter(address),
        isValidAddress(address),
      ]);
      if (roleResult.status === 'fulfilled') setRole(roleResult.value);
      if (validResult.status === 'fulfilled') setIsValid(validResult.value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => { fetch(); }, [fetch]);

  return { role, isValid, loading, error, refetch: fetch };
};
