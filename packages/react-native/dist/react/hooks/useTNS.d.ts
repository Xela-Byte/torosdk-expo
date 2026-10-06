/**
 * Resolve a TNS name to a wallet address.
 *
 * @remarks
 * Uses `@tanstack/react-query` with `staleTime: 5min`. Automatically
 * disabled when `name` is empty.
 *
 * @param name - The TNS name to resolve (e.g. `"alice.toro"`).
 * @param enabled - Set to `false` to defer the query (default `true`).
 *
 * @example
 * ```tsx
 * const { data: address, isLoading } = useResolveTNS('alice.toro');
 * ```
 */
export declare function useResolveTNS(name: string, enabled?: boolean): import("@tanstack/react-query").UseQueryResult<string, Error>;
/**
 * Reverse-lookup a wallet address to its registered TNS name.
 *
 * @remarks
 * Uses `@tanstack/react-query` with `staleTime: 5min`. Returns `null`
 * if no TNS name is configured for the address.
 *
 * @param address - The wallet address to look up.
 * @param enabled - Set to `false` to defer the query (default `true`).
 *
 * @example
 * ```tsx
 * const { data: tnsName } = useLookupTNS('0xABC...');
 * // tnsName = "alice.toro" or null
 * ```
 */
export declare function useLookupTNS(address: string, enabled?: boolean): import("@tanstack/react-query").UseQueryResult<string | null, Error>;
/**
 * Variables for the {@link useSetTNS} mutation.
 *
 * @property address - The wallet address to associate with the name.
 * @property name - The desired TNS name.
 */
export interface SetTNSVariables {
    address: string;
    name: string;
}
/**
 * Register or update a TNS name for a wallet.
 *
 * @remarks
 * On success, both the forward (resolve) and reverse (lookup) TNS queries
 * are invalidated so the UI reflects the new name immediately.
 *
 * @example
 * ```tsx
 * const setName = useSetTNS();
 * await setName.mutateAsync({ address: '0xABC...', name: 'mywallet' });
 * ```
 */
export declare function useSetTNS(): import("@tanstack/react-query").UseMutationResult<void, Error, SetTNSVariables, unknown>;
//# sourceMappingURL=useTNS.d.ts.map