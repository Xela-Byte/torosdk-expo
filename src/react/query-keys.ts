import type { Currency } from '../core/types';

/**
 * Structured query keys for `@tanstack/react-query` cache management.
 *
 * @remarks
 * Each key is a readonly tuple rooted at `['torosdk']`. Mutations
 * invalidate the relevant keys on success so cached data stays fresh.
 *
 * @example
 * ```ts
 * queryClient.invalidateQueries({ queryKey: queryKeys.all });
 * ```
 */
export const queryKeys = {
  /** Root key — invalidating this refetches **all** torosdk queries. */
  all: ['torosdk'] as const,

  /**
   * Key for a single-currency balance query.
   * @param address - Wallet address.
   * @param currency - The currency to query.
   */
  balance: (address: string, currency: Currency) =>
    [...queryKeys.all, 'balance', address.toLowerCase(), currency] as const,

  /**
   * Key for the all-currencies balance query.
   * @param address - Wallet address.
   */
  balances: (address: string) =>
    [...queryKeys.all, 'balances', address.toLowerCase()] as const,

  /** Key for transfer mutation status. */
  transfer: () =>
    [...queryKeys.all, 'transfer'] as const,

  /**
   * Key for a TNS name resolution query.
   * @param name - The TNS name to resolve.
   */
  resolveTNS: (name: string) =>
    [...queryKeys.all, 'tns', 'resolve', name] as const,

  /**
   * Key for a reverse TNS lookup query.
   * @param address - Wallet address.
   */
  lookupTNS: (address: string) =>
    [...queryKeys.all, 'tns', 'lookup', address.toLowerCase()] as const,

  /**
   * Key for a KYC status query.
   * @param address - Wallet address.
   */
  kycStatus: (address: string) =>
    [...queryKeys.all, 'kyc', address.toLowerCase()] as const,

  /** Key for exchange rates query. */
  exchangeRates: () =>
    [...queryKeys.all, 'exchange-rates'] as const,
};
