import { useState, useCallback } from 'react';
import { updateTNSName, deleteTNSName, normalizeError } from '@reactforge/sdk-adapter';
import { useToroContext } from '../provider';

// ── useToroUpdateTNS ───────────────────────────────────────────────────────

export interface UseToroUpdateTNSResult {
  loading: boolean;
  error: Error | null;
  success: boolean;
  updateTNS: (newUsername: string, password: string) => Promise<boolean>;
}

/** Mutation hook to update the TNS name for the active wallet. */
export const useToroUpdateTNS = (): UseToroUpdateTNSResult => {
  const { activeAddress } = useToroContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const updateTNS = useCallback(async (newUsername: string, password: string): Promise<boolean> => {
    if (!activeAddress) throw new Error('No active wallet address in context.');
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await updateTNSName(activeAddress, password, newUsername);
      setSuccess(true);
      return true;
    } catch (err) {
      const normalized = normalizeError(err, 'updateTNS');
      setError(normalized);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeAddress]);

  return { loading, error, success, updateTNS };
};

// ── useToroDeleteTNS ───────────────────────────────────────────────────────

export interface UseToroDeleteTNSResult {
  loading: boolean;
  error: Error | null;
  success: boolean;
  deleteTNS: (password: string) => Promise<boolean>;
}

/** Mutation hook to delete the TNS name from the active wallet. */
export const useToroDeleteTNS = (): UseToroDeleteTNSResult => {
  const { activeAddress } = useToroContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteTNS = useCallback(async (password: string): Promise<boolean> => {
    if (!activeAddress) throw new Error('No active wallet address in context.');
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await deleteTNSName(activeAddress, password);
      setSuccess(true);
      return true;
    } catch (err) {
      const normalized = normalizeError(err, 'deleteTNS');
      setError(normalized);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeAddress]);

  return { loading, error, success, deleteTNS };
};
