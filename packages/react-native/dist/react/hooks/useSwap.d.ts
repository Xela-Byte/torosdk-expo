/**
 * Options for {@link useSwapQuote}.
 *
 * @property fromCurrency - Source currency code.
 * @property toCurrency - Destination currency code.
 * @property amount - Amount to swap.
 * @property enabled - Set to `false` to defer the query (default `true`).
 */
export interface UseSwapQuoteOptions {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    enabled?: boolean;
}
/**
 * Preview a currency swap before executing it.
 *
 * @remarks
 * Read-only query (`'swap-read'` gate). Returns a typed `SwapRateOutput` with
 * the converted amount and rate. Disabled until a positive `amount` is set.
 *
 * @example
 * ```tsx
 * const { data } = useSwapQuote({ fromCurrency: 'naira', toCurrency: 'dollar', amount: 1000 });
 * // data?.convertedAmount, data?.rate
 * ```
 */
export declare function useSwapQuote({ fromCurrency, toCurrency, amount, enabled }: UseSwapQuoteOptions): import("@tanstack/react-query").UseQueryResult<import("@reactforge/sdk-adapter").SwapRateOutput, Error>;
/**
 * Variables for the {@link useSwap} mutation.
 *
 * @property fromCurrency - Source currency code.
 * @property toCurrency - Destination currency code.
 * @property amount - Amount to swap.
 * @property client - Wallet address whose stored password authorizes the swap.
 */
export interface SwapVariables {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    client: string;
}
/**
 * Execute a currency swap for a wallet.
 *
 * @remarks
 * A **sensitive** mutation — resolves the client wallet's stored password and
 * passes the `'swap'` auth gate. On success, the client's balance queries are
 * invalidated.
 *
 * @example
 * ```tsx
 * const swap = useSwap();
 * await swap.mutateAsync({
 *   fromCurrency: 'naira',
 *   toCurrency: 'dollar',
 *   amount: 1000,
 *   client: '0xWallet',
 * });
 * ```
 */
export declare function useSwap(): import("@tanstack/react-query").UseMutationResult<import("../../core").ToroRawResult, Error, SwapVariables, unknown>;
//# sourceMappingURL=useSwap.d.ts.map