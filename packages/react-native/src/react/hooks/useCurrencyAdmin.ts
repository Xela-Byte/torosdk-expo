import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  freezeCurrencyAddress,
  unfreezeCurrencyAddress,
  mintCurrencyFunds,
  getExchangeRates,
} from '../../core/sdk';
import { queryKeys } from '../query-keys';

export interface UseCurrencyInfoOptions {
  currency: string;
  enabled?: boolean;
}

/**
 * Fetch rate or status information for a given currency.
 */
export function useCurrencyInfo({ currency, enabled = true }: UseCurrencyInfoOptions) {
  return useQuery({
    queryKey: queryKeys.currencyInfo(currency),
    queryFn: async () => {
      const rates = await getExchangeRates();
      return (rates as any)?.[currency] || rates;
    },
    enabled: enabled && Boolean(currency),
  });
}

export interface FreezeCurrencyVariables {
  currency: string;
  address: string;
  admin: string;
  adminpwd: string;
  targetAddress: string;
}

/**
 * Freeze an address for a specific currency (Admin operation).
 */
export function useFreezeCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: FreezeCurrencyVariables) => {
      return await freezeCurrencyAddress(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export interface UnfreezeCurrencyVariables {
  currency: string;
  address: string;
  admin: string;
  adminpwd: string;
  targetAddress: string;
}

/**
 * Unfreeze an address for a specific currency (Admin operation).
 */
export function useUnfreezeCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: UnfreezeCurrencyVariables) => {
      return await unfreezeCurrencyAddress(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export interface MintCurrencyVariables {
  currency: string;
  address: string;
  admin: string;
  adminpwd: string;
  targetAddress: string;
  amount: string;
}

/**
 * Mint funds for a specific currency (Admin operation).
 */
export function useMintCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: MintCurrencyVariables) => {
      return await mintCurrencyFunds(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}
