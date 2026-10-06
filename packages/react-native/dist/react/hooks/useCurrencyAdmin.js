"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrencyInfo = useCurrencyInfo;
exports.useFreezeCurrency = useFreezeCurrency;
exports.useUnfreezeCurrency = useUnfreezeCurrency;
exports.useMintCurrency = useMintCurrency;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
/**
 * Fetch rate or status information for a given currency.
 */
function useCurrencyInfo({ currency, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.currencyInfo(currency),
        queryFn: async () => {
            const rates = await (0, sdk_1.getExchangeRates)();
            return rates?.[currency] || rates;
        },
        enabled: enabled && Boolean(currency),
    });
}
/**
 * Freeze an address for a specific currency (Admin operation).
 */
function useFreezeCurrency() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (variables) => {
            return await (0, sdk_1.freezeCurrencyAddress)(variables);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.all });
        },
    });
}
/**
 * Unfreeze an address for a specific currency (Admin operation).
 */
function useUnfreezeCurrency() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (variables) => {
            return await (0, sdk_1.unfreezeCurrencyAddress)(variables);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.all });
        },
    });
}
/**
 * Mint funds for a specific currency (Admin operation).
 */
function useMintCurrency() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (variables) => {
            return await (0, sdk_1.mintCurrencyFunds)(variables);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.all });
        },
    });
}
//# sourceMappingURL=useCurrencyAdmin.js.map