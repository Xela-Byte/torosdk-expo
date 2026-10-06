import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProject,
  getProduct,
  createProduct,
} from '../../core/sdk';
import { queryKeys } from '../query-keys';

// ── useProject ────────────────────────────────────────────────────────────

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
export function useProject({ admin, getbalances = true, enabled = true }: UseProjectOptions) {
  return useQuery({
    queryKey: queryKeys.project(admin),
    queryFn: () => getProject(admin, getbalances),
    staleTime: 30_000,
    enabled: enabled && !!admin,
  });
}

// ── useProduct ────────────────────────────────────────────────────────────

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
export function useProduct({ productId, admin, adminpwd, enabled = true }: UseProductOptions) {
  return useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProduct(productId, admin, adminpwd),
    staleTime: 30_000,
    enabled: enabled && !!productId && !!admin,
  });
}

// ── useCreateProduct ──────────────────────────────────────────────────────

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
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateProductVariables) => createProduct(variables),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(variables.admin) });
    },
  });
}
