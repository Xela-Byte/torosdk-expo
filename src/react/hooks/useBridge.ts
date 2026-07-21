import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BridgeNetwork } from '../../core/types';
import {
  bridgeToken,
  getBridgeTokenFee,
  getBridgeBalance,
  getBridgeTokenBalance,
  getBridgeTransactions,
  getBridgeTokenTransactions,
  type BridgeTokenParams,
} from '../../core/sdk';
import { queryKeys } from '../query-keys';

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
export function useBridgeToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: BridgeTokenVariables) => bridgeToken(variables),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bridgeBalance(variables.from, variables.network),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bridgeTokenBalance(
          variables.from,
          variables.network,
          variables.contractAddress
        ),
      });
    },
  });
}

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
export function useBridgeTokenFee({
  network,
  contractAddress,
  amount,
  enabled = true,
}: UseBridgeTokenFeeOptions) {
  return useQuery({
    queryKey: queryKeys.bridgeTokenFee(network, contractAddress, amount),
    queryFn: () => getBridgeTokenFee({ network, contractAddress, amount }),
    staleTime: 30_000,
    enabled: enabled && !!contractAddress && !!amount,
  });
}

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
export function useBridgeBalance({ address, network, enabled = true }: UseBridgeBalanceOptions) {
  return useQuery({
    queryKey: queryKeys.bridgeBalance(address, network),
    queryFn: () => getBridgeBalance({ address, network }),
    staleTime: 30_000,
    enabled: enabled && !!address,
  });
}

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
export function useBridgeTokenBalance({
  address,
  network,
  contractAddress,
  tokenName,
  enabled = true,
}: UseBridgeTokenBalanceOptions) {
  return useQuery({
    queryKey: queryKeys.bridgeTokenBalance(address, network, contractAddress),
    queryFn: () => getBridgeTokenBalance({ address, network, contractAddress, tokenName }),
    staleTime: 30_000,
    enabled: enabled && !!address && !!contractAddress,
  });
}

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
export function useBridgeTransactions({
  address,
  network,
  enabled = true,
}: UseBridgeTransactionsOptions) {
  return useQuery({
    queryKey: queryKeys.bridgeTransactions(address, network),
    queryFn: () => getBridgeTransactions({ address, network }),
    staleTime: 30_000,
    enabled: enabled && !!address,
  });
}

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
export function useBridgeTokenTransactions({
  address,
  network,
  contractAddress,
  tokenName,
  enabled = true,
}: UseBridgeTokenTransactionsOptions) {
  return useQuery({
    queryKey: queryKeys.bridgeTokenTransactions(address, network, contractAddress),
    queryFn: () => getBridgeTokenTransactions({ address, network, contractAddress, tokenName }),
    staleTime: 30_000,
    enabled: enabled && !!address && !!contractAddress,
  });
}
