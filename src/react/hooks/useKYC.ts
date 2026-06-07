import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getKYCStatus, submitKYC } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export interface UseKYCStatusOptions {
  address: string;
  enabled?: boolean;
}

export function useKYCStatus({ address, enabled = true }: UseKYCStatusOptions) {
  return useQuery({
    queryKey: queryKeys.kycStatus(address),
    queryFn: () => getKYCStatus(address),
    staleTime: 5 * 60_000,
    enabled: enabled && !!address,
  });
}

export function useSubmitKYC() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      address,
      customerData,
    }: {
      address: string;
      customerData: Record<string, unknown>;
    }) => submitKYC(address, customerData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.kycStatus(variables.address),
      });
    },
  });
}
