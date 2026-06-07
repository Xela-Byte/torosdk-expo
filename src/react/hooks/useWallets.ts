import { useState, useEffect, useCallback } from 'react';
import {
  getWalletList,
  getActiveWallet,
  setActiveWallet,
  addWalletToList as addWalletToStorage,
  removeWalletFromList as removeWalletFromStorage,
} from '../../core/storage';

export interface WalletsState {
  all: string[];
  active: string | null;
  switchWallet: (address: string) => Promise<void>;
  addWallet: (address: string) => Promise<void>;
  removeWallet: (address: string) => Promise<void>;
  refresh: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useWallets(): WalletsState {
  const [all, setAll] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const [list, activeWallet] = await Promise.all([
        getWalletList(),
        getActiveWallet(),
      ]);
      setAll(list);
      setActive(activeWallet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const switchWallet = useCallback(async (address: string) => {
    setError(null);
    try {
      await setActiveWallet(address);
      setActive(address.toLowerCase());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch wallet');
      throw err;
    }
  }, []);

  const addWallet = useCallback(async (address: string) => {
    setError(null);
    await addWalletToStorage(address);
    await refresh();
  }, [refresh]);

  const removeWallet = useCallback(async (address: string) => {
    setError(null);
    await removeWalletFromStorage(address);
    await refresh();
  }, [refresh]);

  return {
    all,
    active,
    switchWallet,
    addWallet,
    removeWallet,
    refresh,
    isLoading,
    error,
  };
}
