"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTokenExtended = useTokenExtended;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
/**
 * Fetch extended token metadata (name, symbol, decimals, etc.) from the Toronet chain.
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useTokenExtended();
 * ```
 */
function useTokenExtended({ address = '', contractAddress, enabled = true, } = {}) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.tokenExtended(address, contractAddress),
        queryFn: async () => {
            return await (0, sdk_1.getTokenMetadata)();
        },
        enabled,
    });
}
//# sourceMappingURL=useTokenExtended.js.map