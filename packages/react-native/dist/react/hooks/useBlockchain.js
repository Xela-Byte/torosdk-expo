"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBlockchainInfo = useBlockchainInfo;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
/**
 * Fetch general Toronet blockchain information (block number, status, etc.).
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useBlockchainInfo();
 * ```
 */
function useBlockchainInfo() {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.blockchainInfo(),
        queryFn: () => (0, sdk_1.getBlockchainInfo)(),
        staleTime: 60000,
    });
}
//# sourceMappingURL=useBlockchain.js.map