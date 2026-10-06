"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBalance = useBalance;
exports.useBalances = useBalances;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
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
function useBalance({ address, currency, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.balance(address, currency),
        queryFn: () => (0, sdk_1.getBalanceForCurrency)(address, currency),
        staleTime: 30000,
        enabled: enabled && !!address,
    });
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
function useBalances({ address, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.balances(address),
        queryFn: () => (0, sdk_1.getBalances)(address),
        staleTime: 30000,
        enabled: enabled && !!address,
    });
}
//# sourceMappingURL=useBalance.js.map