"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsAdmin = useIsAdmin;
exports.useIsSuperAdmin = useIsSuperAdmin;
exports.useAddAdmin = useAddAdmin;
exports.useRemoveAdmin = useRemoveAdmin;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
/**
 * Check whether an address holds admin role on the Toronet network.
 *
 * @example
 * ```tsx
 * const { data: isAdmin } = useIsAdmin({ address: '0x...' });
 * ```
 */
function useIsAdmin({ address, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.isAdmin(address),
        queryFn: () => (0, sdk_1.checkIsAdmin)(address),
        staleTime: 60000,
        enabled: enabled && !!address,
    });
}
/**
 * Check whether an address holds super-admin role.
 *
 * @example
 * ```tsx
 * const { data: isSuperAdmin } = useIsSuperAdmin({ address: '0x...' });
 * ```
 */
function useIsSuperAdmin({ address, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.isSuperAdmin(address),
        queryFn: () => (0, sdk_1.checkIsSuperAdmin)(address),
        staleTime: 60000,
        enabled: enabled && !!address,
    });
}
/**
 * Mutation to add a new admin address (requires super-admin credentials).
 *
 * @remarks
 * Invalidates both `isAdmin` and `isSuperAdmin` query keys on success.
 */
function useAddAdmin() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: ({ superAdminAddress, superAdminPassword, adminAddress }) => (0, sdk_1.addAdmin)(superAdminAddress, superAdminPassword, adminAddress),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.isAdmin(variables.adminAddress) });
        },
    });
}
/**
 * Mutation to remove an admin address (requires super-admin credentials).
 *
 * @remarks
 * Invalidates the `isAdmin` query key for the removed address on success.
 */
function useRemoveAdmin() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: ({ superAdminAddress, superAdminPassword, adminAddress }) => (0, sdk_1.removeAdmin)(superAdminAddress, superAdminPassword, adminAddress),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.isAdmin(variables.adminAddress) });
        },
    });
}
//# sourceMappingURL=useRoles.js.map