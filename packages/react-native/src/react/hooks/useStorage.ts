import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  isStorageOn,
  setStorageOn,
  setStorageOff,
  getStorageVersion,
} from '../../core/sdk';
import { queryKeys } from '../query-keys';

// ── useStorageStatus ──────────────────────────────────────────────────────

/**
 * Check whether chain-level storage is currently enabled.
 *
 * @example
 * ```tsx
 * const { data } = useStorageStatus();
 * ```
 */
export function useStorageStatus() {
  return useQuery({
    queryKey: queryKeys.storageStatus(),
    queryFn: () => isStorageOn(),
    staleTime: 60_000,
  });
}

// ── useStorageVersion ─────────────────────────────────────────────────────

/**
 * Fetch the current chain-level storage version.
 *
 * @example
 * ```tsx
 * const { data } = useStorageVersion();
 * ```
 */
export function useStorageVersion() {
  return useQuery({
    queryKey: queryKeys.storageVersion(),
    queryFn: () => getStorageVersion(),
    staleTime: 60_000,
  });
}

// ── useSetStorageOn ───────────────────────────────────────────────────────

export interface SetStorageVariables {
  address: string;
  password: string;
}

/**
 * Mutation to enable chain-level storage (owner operation).
 *
 * @remarks
 * Invalidates `storageStatus` query key on success.
 */
export function useSetStorageOn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ address, password }: SetStorageVariables) => setStorageOn(address, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.storageStatus() });
    },
  });
}

// ── useSetStorageOff ──────────────────────────────────────────────────────

/**
 * Mutation to disable chain-level storage (owner operation).
 *
 * @remarks
 * Invalidates `storageStatus` query key on success.
 */
export function useSetStorageOff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ address, password }: SetStorageVariables) => setStorageOff(address, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.storageStatus() });
    },
  });
}
