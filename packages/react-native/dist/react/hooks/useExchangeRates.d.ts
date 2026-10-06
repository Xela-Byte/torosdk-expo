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
export declare function useExchangeRates(): import("@tanstack/react-query").UseQueryResult<{
    pair: string;
    rate: number;
}[], Error>;
//# sourceMappingURL=useExchangeRates.d.ts.map