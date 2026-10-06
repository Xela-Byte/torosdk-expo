import type { BridgeNetwork } from '../../core/types';
import { type BridgeTokenParams } from '../../core/sdk';
/**
 * Variables for the {@link useBridgeToken} mutation.
 *
 * @remarks
 * Identical to {@link BridgeTokenParams}: `from`, `network`, `contractAddress`,
 * `tokenName`, and `amount`.
 */
export type BridgeTokenVariables = BridgeTokenParams;
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
export declare function useBridgeToken(): import("@tanstack/react-query").UseMutationResult<import("../../core/types").ToroRawResult, Error, BridgeTokenParams, unknown>;
/**
 * Options for {@link useBridgeTokenFee}.
 */
export interface UseBridgeTokenFeeOptions {
    network: BridgeNetwork | string;
    contractAddress: string;
    amount: string;
    enabled?: boolean;
}
/**
 * Estimate the fee for bridging a token to a chain.
 *
 * @remarks
 * Read-only query (`'bridge-read'` gate). Disabled automatically until
 * `contractAddress` and `amount` are provided.
 */
export declare function useBridgeTokenFee({ network, contractAddress, amount, enabled, }: UseBridgeTokenFeeOptions): import("@tanstack/react-query").UseQueryResult<import("../../core/types").ToroRawResult, Error>;
/**
 * Options for {@link useBridgeBalance}.
 */
export interface UseBridgeBalanceOptions {
    address: string;
    network: BridgeNetwork | string;
    enabled?: boolean;
}
/**
 * Fetch the native-asset balance of an address on a bridged chain.
 *
 * @remarks
 * Read-only query (`'bridge-read'` gate).
 */
export declare function useBridgeBalance({ address, network, enabled }: UseBridgeBalanceOptions): import("@tanstack/react-query").UseQueryResult<import("../../core/types").ToroRawResult, Error>;
/**
 * Options for {@link useBridgeTokenBalance}.
 */
export interface UseBridgeTokenBalanceOptions {
    address: string;
    network: BridgeNetwork | string;
    contractAddress: string;
    tokenName?: string;
    enabled?: boolean;
}
/**
 * Fetch a token balance for an address on a bridged chain.
 *
 * @remarks
 * Read-only query (`'bridge-read'` gate).
 */
export declare function useBridgeTokenBalance({ address, network, contractAddress, tokenName, enabled, }: UseBridgeTokenBalanceOptions): import("@tanstack/react-query").UseQueryResult<import("../../core/types").ToroRawResult, Error>;
/**
 * Options for {@link useBridgeTransactions}.
 */
export interface UseBridgeTransactionsOptions {
    address: string;
    network: BridgeNetwork | string;
    enabled?: boolean;
}
/**
 * Fetch native-asset transaction history for an address on a bridged chain.
 *
 * @remarks
 * Read-only query (`'bridge-read'` gate).
 */
export declare function useBridgeTransactions({ address, network, enabled, }: UseBridgeTransactionsOptions): import("@tanstack/react-query").UseQueryResult<import("../../core/types").ToroRawResult, Error>;
/**
 * Options for {@link useBridgeTokenTransactions}.
 */
export interface UseBridgeTokenTransactionsOptions {
    address: string;
    network: BridgeNetwork | string;
    contractAddress: string;
    tokenName?: string;
    enabled?: boolean;
}
/**
 * Fetch token transaction history for an address on a bridged chain.
 *
 * @remarks
 * Read-only query (`'bridge-read'` gate).
 */
export declare function useBridgeTokenTransactions({ address, network, contractAddress, tokenName, enabled, }: UseBridgeTokenTransactionsOptions): import("@tanstack/react-query").UseQueryResult<import("../../core/types").ToroRawResult, Error>;
//# sourceMappingURL=useBridge.d.ts.map