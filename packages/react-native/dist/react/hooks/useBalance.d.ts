import type { Currency } from '../../core/types';
/**
 * Options for {@link useBalance} (single-currency query).
 *
 * @property address - Wallet address to query.
 * @property currency - Which currency to fetch.
 * @property enabled - Set to `false` to defer the query (default `true`).
 */
export interface UseBalanceOptions {
    address: string;
    currency: Currency;
    enabled?: boolean;
}
/**
 * Fetch the balance of a single currency for a wallet address.
 *
 * @remarks
 * Uses `@tanstack/react-query` with `staleTime: 30s`. The query is
 * automatically disabled when `address` is empty and can be manually
 * disabled via `enabled: false`.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useBalance({
 *   address: '0xABC...',
 *   currency: Currency.Naira,
 * });
 * if (isLoading) return <Spinner />;
 * console.log(data?.balance); // "1500.00"
 * ```
 */
export declare function useBalance({ address, currency, enabled }: UseBalanceOptions): import("@tanstack/react-query").UseQueryResult<{
    balance: string;
    currency: Currency;
}, Error>;
/**
 * Options for {@link useBalances} (all-currencies query).
 *
 * @property address - Wallet address to query.
 * @property enabled - Set to `false` to defer the query (default `true`).
 */
export interface UseBalancesOptions {
    address: string;
    enabled?: boolean;
}
/**
 * Fetch all six supported currency balances in parallel.
 *
 * @remarks
 * Uses `@tanstack/react-query` with `staleTime: 30s`. Returns an array
 * of `{ balance, currency }` objects.
 *
 * @example
 * ```tsx
 * const { data: balances, isLoading } = useBalances({ address: '0xABC...' });
 * // balances = [{ balance: "1500", currency: Currency.Naira }, ...]
 * ```
 */
export declare function useBalances({ address, enabled }: UseBalancesOptions): import("@tanstack/react-query").UseQueryResult<{
    balance: string;
    currency: Currency;
}[], Error>;
//# sourceMappingURL=useBalance.d.ts.map