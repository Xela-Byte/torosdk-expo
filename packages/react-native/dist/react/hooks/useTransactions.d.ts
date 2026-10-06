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
export declare function useTransactions({ address, enabled }: UseTransactionsOptions): import("@tanstack/react-query").UseQueryResult<import("../../core").ToroRawResult, Error>;
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
export declare function useTransactionByHash({ hash, enabled }: UseTransactionByHashOptions): import("@tanstack/react-query").UseQueryResult<import("../../core").ToroRawResult, Error>;
//# sourceMappingURL=useTransactions.d.ts.map