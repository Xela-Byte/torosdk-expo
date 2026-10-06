import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createVirtualWallet,
  fetchVirtualWallet,
  fetchVirtualWalletByAddress,
} from '../../core/sdk';
import { queryKeys } from '../query-keys';

// ── useVirtualWallet ──────────────────────────────────────────────────────

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
export function useVirtualWallet({
  virtualwallet,
  admin,
  adminpwd,
  enabled = true,
}: UseVirtualWalletOptions) {
  return useQuery({
    queryKey: queryKeys.virtualWallet(virtualwallet),
    queryFn: () => fetchVirtualWallet(virtualwallet, admin, adminpwd),
    staleTime: 30_000,
    enabled: enabled && !!virtualwallet && !!admin,
  });
}

// ── useVirtualWalletByAddress ─────────────────────────────────────────────

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
export function useVirtualWalletByAddress({
  address,
  admin,
  adminpwd,
  enabled = true,
}: UseVirtualWalletByAddressOptions) {
  return useQuery({
    queryKey: queryKeys.virtualWalletByAddress(address),
    queryFn: () => fetchVirtualWalletByAddress(address, admin, adminpwd),
    staleTime: 30_000,
    enabled: enabled && !!address && !!admin,
  });
}

// ── useCreateVirtualWallet ────────────────────────────────────────────────

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
export function useCreateVirtualWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateVirtualWalletVariables) => createVirtualWallet(variables),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.virtualWalletByAddress(variables.address),
      });
    },
  });
}
