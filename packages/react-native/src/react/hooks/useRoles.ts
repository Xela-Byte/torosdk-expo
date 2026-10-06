import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  checkIsAdmin,
  checkIsSuperAdmin,
  addAdmin,
  removeAdmin,
} from '../../core/sdk';
import { queryKeys } from '../query-keys';

// ── useIsAdmin ────────────────────────────────────────────────────────────

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
export function useIsAdmin({ address, enabled = true }: UseIsAdminOptions) {
  return useQuery({
    queryKey: queryKeys.isAdmin(address),
    queryFn: () => checkIsAdmin(address),
    staleTime: 60_000,
    enabled: enabled && !!address,
  });
}

// ── useIsSuperAdmin ───────────────────────────────────────────────────────

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
export function useIsSuperAdmin({ address, enabled = true }: UseIsSuperAdminOptions) {
  return useQuery({
    queryKey: queryKeys.isSuperAdmin(address),
    queryFn: () => checkIsSuperAdmin(address),
    staleTime: 60_000,
    enabled: enabled && !!address,
  });
}

// ── useAddAdmin ───────────────────────────────────────────────────────────

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
export function useAddAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ superAdminAddress, superAdminPassword, adminAddress }: AddAdminVariables) =>
      addAdmin(superAdminAddress, superAdminPassword, adminAddress),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.isAdmin(variables.adminAddress) });
    },
  });
}

// ── useRemoveAdmin ────────────────────────────────────────────────────────

export type RemoveAdminVariables = AddAdminVariables;

/**
 * Mutation to remove an admin address (requires super-admin credentials).
 *
 * @remarks
 * Invalidates the `isAdmin` query key for the removed address on success.
 */
export function useRemoveAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ superAdminAddress, superAdminPassword, adminAddress }: RemoveAdminVariables) =>
      removeAdmin(superAdminAddress, superAdminPassword, adminAddress),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.isAdmin(variables.adminAddress) });
    },
  });
}
