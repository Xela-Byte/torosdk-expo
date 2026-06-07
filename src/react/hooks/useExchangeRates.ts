import { useQuery } from '@tanstack/react-query';
import { getExchangeRates } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export function useExchangeRates() {
  return useQuery({
    queryKey: queryKeys.exchangeRates(),
    queryFn: getExchangeRates,
    staleTime: 60_000,
  });
}
