import type { BridgeNetwork, AdminCredentials } from '../../core/types';
/**
 * Create a new standalone Solana address.
 *
 * @remarks
 * A **sensitive** mutation (`'wallet-create'` gate).
 */
export declare function useCreateSolanaAddress(): import("@tanstack/react-query").UseMutationResult<import("../../core/types").ToroRawResult, Error, AdminCredentials | undefined, unknown>;
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
export declare function useCreateToronetSolanaAddress(): import("@tanstack/react-query").UseMutationResult<import("../../core/types").ToroRawResult, Error, string, unknown>;
/**
 * Variables for {@link useTransferSolana}.
 */
export interface TransferSolanaVariables {
    from: string;
    to: string;
    amount: string;
    admin?: AdminCredentials;
}
/**
 * Transfer native SOL between addresses.
 *
 * @remarks
 * A **sensitive** mutation (`'solana-transfer'` gate). On success, the sender's
 * SOL balance and transaction queries are invalidated.
 */
export declare function useTransferSolana(): import("@tanstack/react-query").UseMutationResult<import("../../core/types").ToroRawResult, Error, TransferSolanaVariables, unknown>;
/**
 * Variables for {@link useTransferSolToken}.
 */
export interface TransferSolTokenVariables {
    from: string;
    to: string;
    amount: string;
    contractAddress: string;
    tokenName: string;
    useTokenAsFees?: string;
    admin?: AdminCredentials;
}
/**
 * Transfer an SPL token on Solana.
 *
 * @remarks
 * A **sensitive** mutation (`'solana-transfer'` gate). On success, the sender's
 * token balance query is invalidated.
 */
export declare function useTransferSolToken(): import("@tanstack/react-query").UseMutationResult<import("../../core/types").ToroRawResult, Error, TransferSolTokenVariables, unknown>;
/**
 * Options for {@link useSolBalance}.
 */
export interface UseSolBalanceOptions {
    address: string;
    network?: BridgeNetwork | string;
    enabled?: boolean;
}
/**
 * Fetch the native SOL balance for an address.
 *
 * @remarks
 * Read-only query (`'solana-read'` gate).
 */
export declare function useSolBalance({ address, network, enabled }: UseSolBalanceOptions): import("@tanstack/react-query").UseQueryResult<import("../../core/types").ToroRawResult, Error>;
/**
 * Options for {@link useSolTokenBalance}.
 */
export interface UseSolTokenBalanceOptions {
    address: string;
    contractAddress: string;
    tokenName?: string;
    network?: BridgeNetwork | string;
    enabled?: boolean;
}
/**
 * Fetch an SPL token balance for an address.
 *
 * @remarks
 * Read-only query (`'solana-read'` gate).
 */
export declare function useSolTokenBalance({ address, contractAddress, tokenName, network, enabled, }: UseSolTokenBalanceOptions): import("@tanstack/react-query").UseQueryResult<import("../../core/types").ToroRawResult, Error>;
/**
 * Options for {@link useSolTransactions}.
 */
export interface UseSolTransactionsOptions {
    address: string;
    network?: BridgeNetwork | string;
    enabled?: boolean;
}
/**
 * Fetch native SOL transaction history for an address.
 *
 * @remarks
 * Read-only query (`'solana-read'` gate).
 */
export declare function useSolTransactions({ address, network, enabled }: UseSolTransactionsOptions): import("@tanstack/react-query").UseQueryResult<import("../../core/types").ToroRawResult, Error>;
/**
 * Options for {@link useSolTokenTransactions}.
 */
export interface UseSolTokenTransactionsOptions {
    address: string;
    contractAddress: string;
    tokenName?: string;
    network?: BridgeNetwork | string;
    enabled?: boolean;
}
/**
 * Fetch SPL token transaction history for an address.
 *
 * @remarks
 * Read-only query (`'solana-read'` gate).
 */
export declare function useSolTokenTransactions({ address, contractAddress, tokenName, network, enabled, }: UseSolTokenTransactionsOptions): import("@tanstack/react-query").UseQueryResult<import("../../core/types").ToroRawResult, Error>;
//# sourceMappingURL=useSolana.d.ts.map