"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTransactions = useTransactions;
exports.useTransactionByHash = useTransactionByHash;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
/**
 * Fetch Toronet-native transaction history for a wallet address.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useTransactions({ address: '0x...' });
 * ```
 */
function useTransactions({ address, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.transactions(address),
        queryFn: () => (0, sdk_1.getTransactions)(address),
        staleTime: 30000,
        enabled: enabled && !!address,
    });
}
/**
 * Fetch a single Toronet transaction by its hash.
 *
 * @example
 * ```tsx
 * const { data } = useTransactionByHash({ hash: '0xabc...' });
 * ```
 */
function useTransactionByHash({ hash, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.transactionByHash(hash),
        queryFn: () => (0, sdk_1.getTransactionByHash)(hash),
        staleTime: 60000,
        enabled: enabled && !!hash,
    });
}
//# sourceMappingURL=useTransactions.js.map