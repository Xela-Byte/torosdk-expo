import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveTNS, lookupTNS, setTNS } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export function useResolveTNS(name: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.resolveTNS(name),
    queryFn: () => resolveTNS(name),
    staleTime: 5 * 60_000,
    enabled: enabled && !!name,
  });
}

export function useLookupTNS(address: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.lookupTNS(address),
    queryFn: () => lookupTNS(address),
    staleTime: 5 * 60_000,
    enabled: enabled && !!address,
  });
}

export interface SetTNSVariables {
  address: string;
  name: string;
}

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
