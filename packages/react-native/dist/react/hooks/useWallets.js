"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWallets = useWallets;
const react_1 = require("react");
const storage_1 = require("../../core/storage");
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
function useWallets() {
    // DESIGN NOTE: This hook manages state manually (useState + useCallback)
    // rather than via TanStack Query. Wallet identity is local SecureStore
    // state read once on mount and mutated imperatively — it is NOT
    // server-fetched data. TanStack Query's caching, stale-while-revalidate,
    // and retry semantics add no value for local keystore reads. The manual
    // approach keeps the dependency footprint smaller and the bundle lighter.
    const [all, setAll] = (0, react_1.useState)([]);
    const [active, setActive] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const refresh = (0, react_1.useCallback)(async () => {
        try {
            setError(null);
            const [list, activeWallet] = await Promise.all([
                (0, storage_1.getWalletList)(),
                (0, storage_1.getActiveWallet)(),
            ]);
            setAll(list);
            setActive(activeWallet);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load wallets');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        void refresh();
    }, [refresh]);
    const switchWallet = (0, react_1.useCallback)(async (address) => {
        setError(null);
        try {
            await (0, storage_1.setActiveWallet)(address);
            setActive(address.toLowerCase());
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to switch wallet');
            throw err;
        }
    }, []);
    const addWallet = (0, react_1.useCallback)(async (address) => {
        setError(null);
        await (0, storage_1.addWalletToList)(address);
        await refresh();
    }, [refresh]);
    const removeWallet = (0, react_1.useCallback)(async (address) => {
        setError(null);
        await (0, storage_1.removeWalletFromList)(address);
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
//# sourceMappingURL=useWallets.js.map