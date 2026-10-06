import { useState, useCallback } from 'react';
import {
  createVirtualWallet,
  fetchVirtualWallet,
  fetchVirtualWalletByAddress,
  updateVirtualWalletTransactions,
  CreateVirtualWalletInput,
  VirtualWallet,
} from '@reactforge/sdk-adapter';

// ── useToroVirtualWallet ───────────────────────────────────────────────────

export interface UseToroVirtualWalletResult {
  data: VirtualWallet | null;
  loading: boolean;
  error: Error | null;
  create: (input: CreateVirtualWalletInput) => Promise<VirtualWallet | null>;
  fetchByWalletId: (walletId: string, admin: string, adminpwd: string) => Promise<VirtualWallet | null>;
  fetchByAddress: (address: string, admin: string, adminpwd: string) => Promise<VirtualWallet | null>;
  updateTransactions: (address: string, admin: string, adminpwd: string) => Promise<boolean>;
}

/** Provides methods for interacting with virtual wallets via the admin proxy. */
export const useToroVirtualWallet = (): UseToroVirtualWalletResult => {
  const [data, setData] = useState<VirtualWallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (input: CreateVirtualWalletInput): Promise<VirtualWallet | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await createVirtualWallet(input);
      setData(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByWalletId = useCallback(async (walletId: string, admin: string, adminpwd: string): Promise<VirtualWallet | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchVirtualWallet(walletId, admin, adminpwd);
      setData(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByAddress = useCallback(async (address: string, admin: string, adminpwd: string): Promise<VirtualWallet | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchVirtualWalletByAddress(address, admin, adminpwd);
      setData(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransactions = useCallback(async (address: string, admin: string, adminpwd: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await updateVirtualWalletTransactions(address, admin, adminpwd);
      return true;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, create, fetchByWalletId, fetchByAddress, updateTransactions };
};
