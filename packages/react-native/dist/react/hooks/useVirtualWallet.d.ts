export interface UseVirtualWalletOptions {
    virtualwallet: string;
    admin: string;
    adminpwd: string;
    enabled?: boolean;
}
/**
 * Fetch a virtual wallet by its ID.
 *
 * @example
 * ```tsx
 * const { data } = useVirtualWallet({ virtualwallet: 'vw-xxx', admin: addr, adminpwd: pwd });
 * ```
 */
export declare function useVirtualWallet({ virtualwallet, admin, adminpwd, enabled, }: UseVirtualWalletOptions): import("@tanstack/react-query").UseQueryResult<import("../../core").ToroRawResult, Error>;
export interface UseVirtualWalletByAddressOptions {
    address: string;
    admin: string;
    adminpwd: string;
    enabled?: boolean;
}
/**
 * Fetch a virtual wallet by the underlying Toronet address.
 *
 * @example
 * ```tsx
 * const { data } = useVirtualWalletByAddress({ address: '0x...', admin: addr, adminpwd: pwd });
 * ```
 */
export declare function useVirtualWalletByAddress({ address, admin, adminpwd, enabled, }: UseVirtualWalletByAddressOptions): import("@tanstack/react-query").UseQueryResult<import("../../core").ToroRawResult, Error>;
export interface CreateVirtualWalletVariables {
    address: string;
    payername: string;
    currency: string;
    admin: string;
    adminpwd: string;
}
/**
 * Mutation to create a new virtual wallet.
 *
 * @remarks
 * Invalidates `virtualWalletByAddress` query key for the created address on success.
 */
export declare function useCreateVirtualWallet(): import("@tanstack/react-query").UseMutationResult<import("../../core").ToroRawResult, Error, CreateVirtualWalletVariables, unknown>;
//# sourceMappingURL=useVirtualWallet.d.ts.map