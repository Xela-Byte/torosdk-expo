"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBridgeToken = useBridgeToken;
exports.useBridgeTokenFee = useBridgeTokenFee;
exports.useBridgeBalance = useBridgeBalance;
exports.useBridgeTokenBalance = useBridgeTokenBalance;
exports.useBridgeTransactions = useBridgeTransactions;
exports.useBridgeTokenTransactions = useBridgeTokenTransactions;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
/**
 * Bridge tokens from Toronet to another chain (Solana, Base, Polygon, BSC,
 * Arbitrum, Ethereum).
 *
 * @remarks
 * A **sensitive** mutation — the sender's stored password and the `'bridge'`
 * auth gate are enforced by the core wrapper. On success, the sender's bridge
 * balance queries for that network are invalidated.
 *
 * @example
 * ```tsx
 * const bridge = useBridgeToken();
 * await bridge.mutateAsync({
 *   from: '0xSender',
 *   network: BridgeNetwork.Base,
 *   contractAddress: '0xToken',
 *   tokenName: 'USDC',
 *   amount: '25',
 * });
 * ```
 */
function useBridgeToken() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: (variables) => (0, sdk_1.bridgeToken)(variables),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: query_keys_1.queryKeys.bridgeBalance(variables.from, variables.network),
            });
            queryClient.invalidateQueries({
                queryKey: query_keys_1.queryKeys.bridgeTokenBalance(variables.from, variables.network, variables.contractAddress),
            });
        },
    });
}
/**
 * Estimate the fee for bridging a token to a chain.
 *
 * @remarks
 * Read-only query (`'bridge-read'` gate). Disabled automatically until
 * `contractAddress` and `amount` are provided.
 */
function useBridgeTokenFee({ network, contractAddress, amount, enabled = true, }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.bridgeTokenFee(network, contractAddress, amount),
        queryFn: () => (0, sdk_1.getBridgeTokenFee)({ network, contractAddress, amount }),
        staleTime: 30000,
        enabled: enabled && !!contractAddress && !!amount,
    });
}
/**
 * Fetch the native-asset balance of an address on a bridged chain.
 *
 * @remarks
 * Read-only query (`'bridge-read'` gate).
 */
function useBridgeBalance({ address, network, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.bridgeBalance(address, network),
        queryFn: () => (0, sdk_1.getBridgeBalance)({ address, network }),
        staleTime: 30000,
        enabled: enabled && !!address,
    });
}
/**
 * Fetch a token balance for an address on a bridged chain.
 *
 * @remarks
 * Read-only query (`'bridge-read'` gate).
 */
function useBridgeTokenBalance({ address, network, contractAddress, tokenName, enabled = true, }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.bridgeTokenBalance(address, network, contractAddress),
        queryFn: () => (0, sdk_1.getBridgeTokenBalance)({ address, network, contractAddress, tokenName }),
        staleTime: 30000,
        enabled: enabled && !!address && !!contractAddress,
    });
}
/**
 * Fetch native-asset transaction history for an address on a bridged chain.
 *
 * @remarks
 * Read-only query (`'bridge-read'` gate).
 */
function useBridgeTransactions({ address, network, enabled = true, }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.bridgeTransactions(address, network),
        queryFn: () => (0, sdk_1.getBridgeTransactions)({ address, network }),
        staleTime: 30000,
        enabled: enabled && !!address,
    });
}
/**
 * Fetch token transaction history for an address on a bridged chain.
 *
 * @remarks
 * Read-only query (`'bridge-read'` gate).
 */
function useBridgeTokenTransactions({ address, network, contractAddress, tokenName, enabled = true, }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.bridgeTokenTransactions(address, network, contractAddress),
        queryFn: () => (0, sdk_1.getBridgeTokenTransactions)({ address, network, contractAddress, tokenName }),
        staleTime: 30000,
        enabled: enabled && !!address && !!contractAddress,
    });
}
//# sourceMappingURL=useBridge.js.map