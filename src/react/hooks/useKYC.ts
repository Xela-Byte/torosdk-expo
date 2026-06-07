import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getKYCStatus, submitKYC } from '../../core/sdk';
import { queryKeys } from '../query-keys';

/**
 * Options for {@link useKYCStatus}.
 *
 * @property address - Wallet address whose KYC status to check.
 * @property enabled - Set to `false` to defer the query (default `true`).
 */
export interface UseKYCStatusOptions {
  address: string;
  enabled?: boolean;
}

/**
 * Poll the KYC status for a wallet address.
 *
 * @remarks
 * Uses `@tanstack/react-query` with `staleTime: 5min`. Status values
 * include `"pending"`, `"approved"`, and `"rejected"`.
 *
 * @example
 * ```tsx
 * const { data: kyc, isLoading } = useKYCStatus({ address: '0xABC...' });
 * if (kyc?.status === 'approved') return <VerifiedBadge />;
 * ```
 */
export function useKYCStatus({ address, enabled = true }: UseKYCStatusOptions) {
  return useQuery({
    queryKey: queryKeys.kycStatus(address),
    queryFn: () => getKYCStatus(address),
    staleTime: 5 * 60_000,
    enabled: enabled && !!address,
  });
}

/**
 * Submit KYC customer data for verification.
 *
 * @remarks
 * On success, the wallet's KYC status query is invalidated so the UI
 * reflects the updated status immediately.
 *
 * @example
 * ```tsx
 * const submit = useSubmitKYC();
 * await submit.mutateAsync({
 *   address: '0xABC...',
 *   customerData: { name: 'Alice', country: 'NG' },
 * });
 * ```
 */
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
