"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTokenBalance = useTokenBalance;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
/**
 * Fetch the Toronet token balance for a wallet address.
 *
 * @example
 * ```tsx
 * const { data: tokenBal, isLoading } = useTokenBalance({
 *   address: '0x1234...',
 * });
 * ```
 */
function useTokenBalance({ address, contractAddress, enabled = true, }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.tokenBalance(address, contractAddress),
        queryFn: async () => {
            return await (0, sdk_1.getTokenBalance)(address);
        },
        enabled: enabled && Boolean(address),
    });
}
//# sourceMappingURL=useTokenBalance.js.map