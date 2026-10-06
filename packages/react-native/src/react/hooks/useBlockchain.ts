import { useQuery } from '@tanstack/react-query';
import { getBlockchainInfo } from '../../core/sdk';
import { queryKeys } from '../query-keys';

/**
 * Fetch general Toronet blockchain information (block number, status, etc.).
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useBlockchainInfo();
 * ```
 */
export function useBlockchainInfo() {
  return useQuery({
    queryKey: queryKeys.blockchainInfo(),
    queryFn: () => getBlockchainInfo(),
    staleTime: 60_000,
  });
}
