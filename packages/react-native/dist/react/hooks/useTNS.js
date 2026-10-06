"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResolveTNS = useResolveTNS;
exports.useLookupTNS = useLookupTNS;
exports.useSetTNS = useSetTNS;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
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
function useResolveTNS(name, enabled = true) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.resolveTNS(name),
        queryFn: () => (0, sdk_1.resolveTNS)(name),
        staleTime: 5 * 60000,
        enabled: enabled && !!name,
    });
}
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
function useLookupTNS(address, enabled = true) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.lookupTNS(address),
        queryFn: () => (0, sdk_1.lookupTNS)(address),
        staleTime: 5 * 60000,
        enabled: enabled && !!address,
    });
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
function useSetTNS() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: ({ address, name }) => (0, sdk_1.setTNS)(address, name),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: query_keys_1.queryKeys.resolveTNS(variables.name),
            });
            queryClient.invalidateQueries({
                queryKey: query_keys_1.queryKeys.lookupTNS(variables.address),
            });
        },
    });
}
//# sourceMappingURL=useTNS.js.map