export interface UseProjectOptions {
    admin: string;
    getbalances?: boolean;
    enabled?: boolean;
}
/**
 * Fetch the project/product list for an admin address.
 *
 * @example
 * ```tsx
 * const { data } = useProject({ admin: adminAddress });
 * ```
 */
export declare function useProject({ admin, getbalances, enabled }: UseProjectOptions): import("@tanstack/react-query").UseQueryResult<import("../../core").ToroRawResult, Error>;
export interface UseProductOptions {
    productId: string;
    admin: string;
    adminpwd: string;
    enabled?: boolean;
}
/**
 * Fetch a single product by ID.
 *
 * @example
 * ```tsx
 * const { data } = useProduct({ productId: 'prod-1', admin: addr, adminpwd: pwd });
 * ```
 */
export declare function useProduct({ productId, admin, adminpwd, enabled }: UseProductOptions): import("@tanstack/react-query").UseQueryResult<import("../../core").ToroRawResult, Error>;
export interface CreateProductVariables {
    productId: string;
    productName: string;
    description: string;
    productImage: string;
    admin: string;
    adminpwd: string;
}
/**
 * Mutation to create a new product record.
 *
 * @remarks
 * Invalidates the `project` query key for the admin on success.
 */
export declare function useCreateProduct(): import("@tanstack/react-query").UseMutationResult<import("../../core").ToroRawResult, Error, CreateProductVariables, unknown>;
//# sourceMappingURL=useProducts.d.ts.map