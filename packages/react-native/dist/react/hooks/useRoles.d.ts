export interface UseIsAdminOptions {
    address: string;
    enabled?: boolean;
}
/**
 * Check whether an address holds admin role on the Toronet network.
 *
 * @example
 * ```tsx
 * const { data: isAdmin } = useIsAdmin({ address: '0x...' });
 * ```
 */
export declare function useIsAdmin({ address, enabled }: UseIsAdminOptions): import("@tanstack/react-query").UseQueryResult<boolean, Error>;
export interface UseIsSuperAdminOptions {
    address: string;
    enabled?: boolean;
}
/**
 * Check whether an address holds super-admin role.
 *
 * @example
 * ```tsx
 * const { data: isSuperAdmin } = useIsSuperAdmin({ address: '0x...' });
 * ```
 */
export declare function useIsSuperAdmin({ address, enabled }: UseIsSuperAdminOptions): import("@tanstack/react-query").UseQueryResult<boolean, Error>;
export interface AddAdminVariables {
    superAdminAddress: string;
    superAdminPassword: string;
    adminAddress: string;
}
/**
 * Mutation to add a new admin address (requires super-admin credentials).
 *
 * @remarks
 * Invalidates both `isAdmin` and `isSuperAdmin` query keys on success.
 */
export declare function useAddAdmin(): import("@tanstack/react-query").UseMutationResult<import("../../core").ToroRawResult, Error, AddAdminVariables, unknown>;
export type RemoveAdminVariables = AddAdminVariables;
/**
 * Mutation to remove an admin address (requires super-admin credentials).
 *
 * @remarks
 * Invalidates the `isAdmin` query key for the removed address on success.
 */
export declare function useRemoveAdmin(): import("@tanstack/react-query").UseMutationResult<import("../../core").ToroRawResult, Error, AddAdminVariables, unknown>;
//# sourceMappingURL=useRoles.d.ts.map