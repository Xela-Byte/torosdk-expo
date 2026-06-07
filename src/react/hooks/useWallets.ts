import { useState, useEffect, useCallback } from 'react';
import {
  getWalletList,
  getActiveWallet,
  setActiveWallet,
  addWalletToList as addWalletToStorage,
  removeWalletFromList as removeWalletFromStorage,
} from '../../core/storage';

/**
 * State and actions returned by {@link useWallets}.
 *
 * @property all - Array of all stored wallet addresses (lowercased).
 * @property active - Currently active wallet address, or `null`.
 * @property switchWallet - Persist a new active wallet to storage.
 * @property addWallet - Append a wallet address to the stored list.
 * @property removeWallet - Remove a wallet address from the stored list.
 * @property refresh - Re-read wallets from SecureStore.
 * @property isLoading - `true` while the initial load is in progress.
 * @property error - Last error message, or `null`.
 */
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

/**
 * Manage the list of stored wallets and the active wallet.
 *
 * @remarks
 * Loads the wallet list and active wallet from SecureStore on mount.
 * Provides `switchWallet`, `addWallet`, `removeWallet`, and `refresh`
 * actions that persist changes and update local state.
 *
 * @example
 * ```tsx
 * const { all, active, switchWallet, isLoading } = useWallets();
 * if (isLoading) return <ActivityIndicator />;
 * return (
 *   <FlatList
 *     data={all}
 *     renderItem={({ item }) => (
 *       <WalletCard
 *         address={item}
 *         isActive={item === active}
 *         onPress={() => switchWallet(item)}
 *       />
 *     )}
 *   />
 * );
 * ```
 */
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
