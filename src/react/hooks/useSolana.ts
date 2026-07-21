import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BridgeNetwork, AdminCredentials } from '../../core/types';
import {
  createSolanaAddress,
  createToronetSolanaAddress,
  transferSolana,
  transferSolToken,
  getSolBalance,
  getSolTokenBalance,
  getSolTransactions,
  getSolTokenTransactions,
} from '../../core/sdk';
import { queryKeys } from '../query-keys';

/**
 * Create a new standalone Solana address.
 *
 * @remarks
 * A **sensitive** mutation (`'wallet-create'` gate).
 */
export function useCreateSolanaAddress() {
  return useMutation({
    mutationFn: (admin?: AdminCredentials) => createSolanaAddress(admin),
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
export function useCreateToronetSolanaAddress() {
  return useMutation({
    mutationFn: (address: string) => createToronetSolanaAddress(address),
  });
}

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
export function useTransferSolana() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TransferSolanaVariables) => transferSolana(variables),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.solBalance(variables.from) });
      queryClient.invalidateQueries({ queryKey: queryKeys.solTransactions(variables.from) });
    },
  });
}

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
export function useTransferSolToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TransferSolTokenVariables) => transferSolToken(variables),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.solTokenBalance(variables.from, variables.contractAddress),
      });
    },
  });
}

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
export function useSolBalance({ address, network, enabled = true }: UseSolBalanceOptions) {
  return useQuery({
    queryKey: queryKeys.solBalance(address),
    queryFn: () => getSolBalance({ address, network }),
    staleTime: 30_000,
    enabled: enabled && !!address,
  });
}

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
export function useSolTokenBalance({
  address,
  contractAddress,
  tokenName,
  network,
  enabled = true,
}: UseSolTokenBalanceOptions) {
  return useQuery({
    queryKey: queryKeys.solTokenBalance(address, contractAddress),
    queryFn: () => getSolTokenBalance({ address, contractAddress, tokenName, network }),
    staleTime: 30_000,
    enabled: enabled && !!address && !!contractAddress,
  });
}

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
export function useSolTransactions({ address, network, enabled = true }: UseSolTransactionsOptions) {
  return useQuery({
    queryKey: queryKeys.solTransactions(address),
    queryFn: () => getSolTransactions({ address, network }),
    staleTime: 30_000,
    enabled: enabled && !!address,
  });
}

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
export function useSolTokenTransactions({
  address,
  contractAddress,
  tokenName,
  network,
  enabled = true,
}: UseSolTokenTransactionsOptions) {
  return useQuery({
    queryKey: queryKeys.solTokenTransactions(address, contractAddress),
    queryFn: () => getSolTokenTransactions({ address, contractAddress, tokenName, network }),
    staleTime: 30_000,
    enabled: enabled && !!address && !!contractAddress,
  });
}
