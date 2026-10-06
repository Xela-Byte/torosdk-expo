import { useQuery } from '@tanstack/react-query';
import {
  getTransactions,
  getTransactionByHash,
} from '../../core/sdk';
import { queryKeys } from '../query-keys';

// ── useTransactions ───────────────────────────────────────────────────────

export interface UseTransactionsOptions {
  address: string;
  enabled?: boolean;
}

/**
 * Fetch Toronet-native transaction history for a wallet address.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useTransactions({ address: '0x...' });
 * ```
 */
export function useTransactions({ address, enabled = true }: UseTransactionsOptions) {
  return useQuery({
    queryKey: queryKeys.transactions(address),
    queryFn: () => getTransactions(address),
    staleTime: 30_000,
    enabled: enabled && !!address,
  });
}

// ── useTransactionByHash ──────────────────────────────────────────────────

export interface UseTransactionByHashOptions {
  hash: string;
  enabled?: boolean;
}

/**
 * Fetch a single Toronet transaction by its hash.
 *
 * @example
 * ```tsx
 * const { data } = useTransactionByHash({ hash: '0xabc...' });
 * ```
 */
export function useTransactionByHash({ hash, enabled = true }: UseTransactionByHashOptions) {
  return useQuery({
    queryKey: queryKeys.transactionByHash(hash),
    queryFn: () => getTransactionByHash(hash),
    staleTime: 60_000,
    enabled: enabled && !!hash,
  });
}
