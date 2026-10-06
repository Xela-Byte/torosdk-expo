import { useState, useCallback } from 'react';
import { createWallet as sdkCreateWallet } from '@reactforge/sdk-adapter';

export interface CreateWalletResult {
  address: string | null;
  loading: boolean;
  error: Error | null;
  createWallet: (username: string, password: string) => Promise<string | null>;
}

export const useToroCreateWallet = (): CreateWalletResult => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createWallet = useCallback(async (username: string, password: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {

      const result = await sdkCreateWallet(username, password);
      setAddress(result);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { address, loading, error, createWallet };
};
