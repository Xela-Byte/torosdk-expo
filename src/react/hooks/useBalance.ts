import { useQuery } from '@tanstack/react-query';
import type { Currency } from '../../core/types';
import { getBalanceForCurrency, getBalances } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export interface UseBalanceOptions {
  address: string;
  currency: Currency;
  enabled?: boolean;
}

export function useBalance({ address, currency, enabled = true }: UseBalanceOptions) {
  return useQuery({
    queryKey: queryKeys.balance(address, currency),
    queryFn: () => getBalanceForCurrency(address, currency),
    staleTime: 30_000,
    enabled: enabled && !!address,
  });
}

export interface UseBalancesOptions {
  address: string;
  enabled?: boolean;
}

export function useBalances({ address, enabled = true }: UseBalancesOptions) {
  return useQuery({
    queryKey: queryKeys.balances(address),
    queryFn: () => getBalances(address),
    staleTime: 30_000,
    enabled: enabled && !!address,
  });
}
