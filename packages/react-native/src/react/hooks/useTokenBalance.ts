import { useQuery } from '@tanstack/react-query';
import { getTokenBalance } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export interface UseTokenBalanceOptions {
  address: string;
  contractAddress?: string;
  enabled?: boolean;
}

/**
 * Fetch the Toronet token balance for a wallet address.
 *
 * @example
 * ```tsx
 * const { data: tokenBal, isLoading } = useTokenBalance({
 *   address: '0x1234...',
 * });
 * ```
 */
export function useTokenBalance({
  address,
  contractAddress,
  enabled = true,
}: UseTokenBalanceOptions) {
  return useQuery({
    queryKey: queryKeys.tokenBalance(address, contractAddress),
    queryFn: async () => {
      return await getTokenBalance(address);
    },
    enabled: enabled && Boolean(address),
  });
}
