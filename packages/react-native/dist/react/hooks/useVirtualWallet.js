"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVirtualWallet = useVirtualWallet;
exports.useVirtualWalletByAddress = useVirtualWalletByAddress;
exports.useCreateVirtualWallet = useCreateVirtualWallet;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
/**
 * Fetch a virtual wallet by its ID.
 *
 * @example
 * ```tsx
 * const { data } = useVirtualWallet({ virtualwallet: 'vw-xxx', admin: addr, adminpwd: pwd });
 * ```
 */
function useVirtualWallet({ virtualwallet, admin, adminpwd, enabled = true, }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.virtualWallet(virtualwallet),
        queryFn: () => (0, sdk_1.fetchVirtualWallet)(virtualwallet, admin, adminpwd),
        staleTime: 30000,
        enabled: enabled && !!virtualwallet && !!admin,
    });
}
/**
 * Fetch a virtual wallet by the underlying Toronet address.
 *
 * @example
 * ```tsx
 * const { data } = useVirtualWalletByAddress({ address: '0x...', admin: addr, adminpwd: pwd });
 * ```
 */
function useVirtualWalletByAddress({ address, admin, adminpwd, enabled = true, }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.virtualWalletByAddress(address),
        queryFn: () => (0, sdk_1.fetchVirtualWalletByAddress)(address, admin, adminpwd),
        staleTime: 30000,
        enabled: enabled && !!address && !!admin,
    });
}
/**
 * Mutation to create a new virtual wallet.
 *
 * @remarks
 * Invalidates `virtualWalletByAddress` query key for the created address on success.
 */
function useCreateVirtualWallet() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: (variables) => (0, sdk_1.createVirtualWallet)(variables),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: query_keys_1.queryKeys.virtualWalletByAddress(variables.address),
            });
        },
    });
}
//# sourceMappingURL=useVirtualWallet.js.map