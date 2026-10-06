"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProject = useProject;
exports.useProduct = useProduct;
exports.useCreateProduct = useCreateProduct;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
/**
 * Fetch the project/product list for an admin address.
 *
 * @example
 * ```tsx
 * const { data } = useProject({ admin: adminAddress });
 * ```
 */
function useProject({ admin, getbalances = true, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.project(admin),
        queryFn: () => (0, sdk_1.getProject)(admin, getbalances),
        staleTime: 30000,
        enabled: enabled && !!admin,
    });
}
/**
 * Fetch a single product by ID.
 *
 * @example
 * ```tsx
 * const { data } = useProduct({ productId: 'prod-1', admin: addr, adminpwd: pwd });
 * ```
 */
function useProduct({ productId, admin, adminpwd, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.product(productId),
        queryFn: () => (0, sdk_1.getProduct)(productId, admin, adminpwd),
        staleTime: 30000,
        enabled: enabled && !!productId && !!admin,
    });
}
/**
 * Mutation to create a new product record.
 *
 * @remarks
 * Invalidates the `project` query key for the admin on success.
 */
function useCreateProduct() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: (variables) => (0, sdk_1.createProduct)(variables),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.project(variables.admin) });
        },
    });
}
//# sourceMappingURL=useProducts.js.map