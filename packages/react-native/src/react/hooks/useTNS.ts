import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveTNS, lookupTNS, setTNS } from '../../core/sdk';
import { queryKeys } from '../query-keys';

/**
 * Resolve a TNS name to a wallet address.
 *
 * @remarks
 * Uses `@tanstack/react-query` with `staleTime: 5min`. Automatically
 * disabled when `name` is empty.
 *
 * @param name - The TNS name to resolve (e.g. `"alice.toro"`).
 * @param enabled - Set to `false` to defer the query (default `true`).
 *
 * @example
 * ```tsx
 * const { data: address, isLoading } = useResolveTNS('alice.toro');
 * ```
 */
export function useResolveTNS(name: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.resolveTNS(name),
    queryFn: () => resolveTNS(name),
    staleTime: 5 * 60_000,
    enabled: enabled && !!name,
  });
}

/**
 * Reverse-lookup a wallet address to its registered TNS name.
 *
 * @remarks
 * Uses `@tanstack/react-query` with `staleTime: 5min`. Returns `null`
 * if no TNS name is configured for the address.
 *
 * @param address - The wallet address to look up.
 * @param enabled - Set to `false` to defer the query (default `true`).
 *
 * @example
 * ```tsx
 * const { data: tnsName } = useLookupTNS('0xABC...');
 * // tnsName = "alice.toro" or null
 * ```
 */
export function useLookupTNS(address: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.lookupTNS(address),
    queryFn: () => lookupTNS(address),
    staleTime: 5 * 60_000,
    enabled: enabled && !!address,
  });
}

/**
 * Variables for the {@link useSetTNS} mutation.
 *
 * @property address - The wallet address to associate with the name.
 * @property name - The desired TNS name.
 */
export interface SetTNSVariables {
  address: string;
  name: string;
}

/**
 * Register or update a TNS name for a wallet.
 *
 * @remarks
 * On success, both the forward (resolve) and reverse (lookup) TNS queries
 * are invalidated so the UI reflects the new name immediately.
 *
 * @example
 * ```tsx
 * const setName = useSetTNS();
 * await setName.mutateAsync({ address: '0xABC...', name: 'mywallet' });
 * ```
 */
export function useSetTNS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ address, name }: SetTNSVariables) => setTNS(address, name),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resolveTNS(variables.name),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lookupTNS(variables.address),
      });
    },
  });
}
