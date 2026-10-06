"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExchangeRates = useExchangeRates;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
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
function useExchangeRates() {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.exchangeRates(),
        queryFn: sdk_1.getExchangeRates,
        staleTime: 60000,
    });
}
//# sourceMappingURL=useExchangeRates.js.map