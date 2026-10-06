"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSwapQuote = useSwapQuote;
exports.useSwap = useSwap;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
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
function useSwapQuote({ fromCurrency, toCurrency, amount, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.swapQuote(fromCurrency, toCurrency, amount),
        queryFn: () => (0, sdk_1.getSwapQuote)({ fromCurrency, toCurrency, amount }),
        staleTime: 15000,
        enabled: enabled && !!fromCurrency && !!toCurrency && amount > 0,
    });
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
function useSwap() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: (variables) => (0, sdk_1.executeSwap)(variables),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.balances(variables.client) });
        },
    });
}
//# sourceMappingURL=useSwap.js.map