"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateSolanaAddress = useCreateSolanaAddress;
exports.useCreateToronetSolanaAddress = useCreateToronetSolanaAddress;
exports.useTransferSolana = useTransferSolana;
exports.useTransferSolToken = useTransferSolToken;
exports.useSolBalance = useSolBalance;
exports.useSolTokenBalance = useSolTokenBalance;
exports.useSolTransactions = useSolTransactions;
exports.useSolTokenTransactions = useSolTokenTransactions;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
/**
 * Create a new standalone Solana address.
 *
 * @remarks
 * A **sensitive** mutation (`'wallet-create'` gate).
 */
function useCreateSolanaAddress() {
    return (0, react_query_1.useMutation)({
        mutationFn: (admin) => (0, sdk_1.createSolanaAddress)(admin),
    });
}
/**
 * Create a Toronet-managed Solana address bound to an existing wallet.
 *
 * @remarks
 * A **sensitive** mutation — resolves the wallet's stored password and passes
 * the `'wallet-create'` gate.
 *
 * @example
 * ```tsx
 * const create = useCreateToronetSolanaAddress();
 * await create.mutateAsync('0xWallet');
 * ```
 */
function useCreateToronetSolanaAddress() {
    return (0, react_query_1.useMutation)({
        mutationFn: (address) => (0, sdk_1.createToronetSolanaAddress)(address),
    });
}
/**
 * Transfer native SOL between addresses.
 *
 * @remarks
 * A **sensitive** mutation (`'solana-transfer'` gate). On success, the sender's
 * SOL balance and transaction queries are invalidated.
 */
function useTransferSolana() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: (variables) => (0, sdk_1.transferSolana)(variables),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.solBalance(variables.from) });
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.solTransactions(variables.from) });
        },
    });
}
/**
 * Transfer an SPL token on Solana.
 *
 * @remarks
 * A **sensitive** mutation (`'solana-transfer'` gate). On success, the sender's
 * token balance query is invalidated.
 */
function useTransferSolToken() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: (variables) => (0, sdk_1.transferSolToken)(variables),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: query_keys_1.queryKeys.solTokenBalance(variables.from, variables.contractAddress),
            });
        },
    });
}
/**
 * Fetch the native SOL balance for an address.
 *
 * @remarks
 * Read-only query (`'solana-read'` gate).
 */
function useSolBalance({ address, network, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.solBalance(address),
        queryFn: () => (0, sdk_1.getSolBalance)({ address, network }),
        staleTime: 30000,
        enabled: enabled && !!address,
    });
}
/**
 * Fetch an SPL token balance for an address.
 *
 * @remarks
 * Read-only query (`'solana-read'` gate).
 */
function useSolTokenBalance({ address, contractAddress, tokenName, network, enabled = true, }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.solTokenBalance(address, contractAddress),
        queryFn: () => (0, sdk_1.getSolTokenBalance)({ address, contractAddress, tokenName, network }),
        staleTime: 30000,
        enabled: enabled && !!address && !!contractAddress,
    });
}
/**
 * Fetch native SOL transaction history for an address.
 *
 * @remarks
 * Read-only query (`'solana-read'` gate).
 */
function useSolTransactions({ address, network, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.solTransactions(address),
        queryFn: () => (0, sdk_1.getSolTransactions)({ address, network }),
        staleTime: 30000,
        enabled: enabled && !!address,
    });
}
/**
 * Fetch SPL token transaction history for an address.
 *
 * @remarks
 * Read-only query (`'solana-read'` gate).
 */
function useSolTokenTransactions({ address, contractAddress, tokenName, network, enabled = true, }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.solTokenTransactions(address, contractAddress),
        queryFn: () => (0, sdk_1.getSolTokenTransactions)({ address, contractAddress, tokenName, network }),
        staleTime: 30000,
        enabled: enabled && !!address && !!contractAddress,
    });
}
//# sourceMappingURL=useSolana.js.map