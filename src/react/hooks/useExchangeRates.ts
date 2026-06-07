import { useQuery } from '@tanstack/react-query';
import { getExchangeRates } from '../../core/sdk';
import { queryKeys } from '../query-keys';

/**
 * Fetch current exchange rates for all supported currencies.
 *
 * @remarks
 * Uses `@tanstack/react-query` with `staleTime: 60s`. Returns an array
 * of `{ currency, rate }` objects keyed against a base currency (typically
 * Naira).
 *
 * @example
 * ```tsx
 * const { data: rates, isLoading } = useExchangeRates();
 * // rates = [{ currency: Currency.Dollar, rate: "0.0012" }, ...]
 * ```
 */
export function useExchangeRates() {
  return useQuery({
    queryKey: queryKeys.exchangeRates(),
    queryFn: getExchangeRates,
    staleTime: 60_000,
  });
}
