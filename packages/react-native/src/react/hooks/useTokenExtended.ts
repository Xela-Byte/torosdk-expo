import { useQuery } from '@tanstack/react-query';
import { getTokenMetadata } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export interface UseTokenExtendedOptions {
  address?: string;
  contractAddress?: string;
  enabled?: boolean;
}

/**
 * Fetch extended token metadata (name, symbol, decimals, etc.) from the Toronet chain.
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useTokenExtended();
 * ```
 */
export function useTokenExtended({
  address = '',
  contractAddress,
  enabled = true,
}: UseTokenExtendedOptions = {}) {
  return useQuery({
    queryKey: queryKeys.tokenExtended(address, contractAddress),
    queryFn: async () => {
      return await getTokenMetadata();
    },
    enabled,
  });
}
