import type { Currency, BridgeNetwork } from '../core/types';

/**
 * Structured query keys for `@tanstack/react-query` cache management.
 *
 * @remarks
 * Each key is a readonly tuple rooted at `['torosdk']`. Mutations
 * invalidate the relevant keys on success so cached data stays fresh.
 *
 * @example
 * ```ts
 * queryClient.invalidateQueries({ queryKey: queryKeys.all });
 * ```
 */
export const queryKeys = {
  /** Root key — invalidating this refetches **all** torosdk queries. */
  all: ['torosdk'] as const,

  /**
   * Key for a single-currency balance query.
   * @param address - Wallet address.
   * @param currency - The currency to query.
   */
  balance: (address: string, currency: Currency) =>
    [...queryKeys.all, 'balance', address.toLowerCase(), currency] as const,

  /**
   * Key for the all-currencies balance query.
   * @param address - Wallet address.
   */
  balances: (address: string) =>
    [...queryKeys.all, 'balances', address.toLowerCase()] as const,

  /** Key for transfer mutation status. */
  transfer: () =>
    [...queryKeys.all, 'transfer'] as const,

  /**
   * Key for a TNS name resolution query.
   * @param name - The TNS name to resolve.
   */
  resolveTNS: (name: string) =>
    [...queryKeys.all, 'tns', 'resolve', name] as const,

  /**
   * Key for a reverse TNS lookup query.
   * @param address - Wallet address.
   */
  lookupTNS: (address: string) =>
    [...queryKeys.all, 'tns', 'lookup', address.toLowerCase()] as const,

  /**
   * Key for a KYC status query.
   * @param address - Wallet address.
   */
  kycStatus: (address: string) =>
    [...queryKeys.all, 'kyc', address.toLowerCase()] as const,

  /** Key for exchange rates query. */
  exchangeRates: () =>
    [...queryKeys.all, 'exchange-rates'] as const,

  // --- Bridge ---

  /**
   * Key for a bridged-chain native balance query.
   * @param address - Wallet address.
   * @param network - Target bridge network.
   */
  bridgeBalance: (address: string, network: BridgeNetwork | string) =>
    [...queryKeys.all, 'bridge', 'balance', address.toLowerCase(), network] as const,

  /**
   * Key for a bridged-chain token balance query.
   * @param address - Wallet address.
   * @param network - Target bridge network.
   * @param contractAddress - Token contract address.
   */
  bridgeTokenBalance: (
    address: string,
    network: BridgeNetwork | string,
    contractAddress: string
  ) =>
    [
      ...queryKeys.all,
      'bridge',
      'token-balance',
      address.toLowerCase(),
      network,
      contractAddress.toLowerCase(),
    ] as const,

  /**
   * Key for a bridged-chain native transactions query.
   * @param address - Wallet address.
   * @param network - Target bridge network.
   */
  bridgeTransactions: (address: string, network: BridgeNetwork | string) =>
    [...queryKeys.all, 'bridge', 'transactions', address.toLowerCase(), network] as const,

  /**
   * Key for a bridged-chain token transactions query.
   * @param address - Wallet address.
   * @param network - Target bridge network.
   * @param contractAddress - Token contract address.
   */
  bridgeTokenTransactions: (
    address: string,
    network: BridgeNetwork | string,
    contractAddress: string
  ) =>
    [
      ...queryKeys.all,
      'bridge',
      'token-transactions',
      address.toLowerCase(),
      network,
      contractAddress.toLowerCase(),
    ] as const,

  /**
   * Key for a bridge fee estimate query.
   * @param network - Target bridge network.
   * @param contractAddress - Token contract address.
   * @param amount - Amount to bridge.
   */
  bridgeTokenFee: (network: BridgeNetwork | string, contractAddress: string, amount: string) =>
    [...queryKeys.all, 'bridge', 'fee', network, contractAddress.toLowerCase(), amount] as const,

  /** Key for bridge mutation status. */
  bridge: () => [...queryKeys.all, 'bridge'] as const,

  // --- Solana ---

  /**
   * Key for a Solana native balance query.
   * @param address - Solana address.
   */
  solBalance: (address: string) =>
    [...queryKeys.all, 'solana', 'balance', address] as const,

  /**
   * Key for a Solana token balance query.
   * @param address - Solana address.
   * @param contractAddress - Token contract address.
   */
  solTokenBalance: (address: string, contractAddress: string) =>
    [...queryKeys.all, 'solana', 'token-balance', address, contractAddress] as const,

  /**
   * Key for a Solana native transactions query.
   * @param address - Solana address.
   */
  solTransactions: (address: string) =>
    [...queryKeys.all, 'solana', 'transactions', address] as const,

  /**
   * Key for a Solana token transactions query.
   * @param address - Solana address.
   * @param contractAddress - Token contract address.
   */
  solTokenTransactions: (address: string, contractAddress: string) =>
    [...queryKeys.all, 'solana', 'token-transactions', address, contractAddress] as const,

  // --- Swap ---

  /**
   * Key for a swap quote query.
   * @param fromCurrency - Source currency.
   * @param toCurrency - Destination currency.
   * @param amount - Amount to swap.
   */
  swapQuote: (fromCurrency: string, toCurrency: string, amount: number) =>
    [...queryKeys.all, 'swap', 'quote', fromCurrency, toCurrency, amount] as const,

  /** Key for swap mutation status. */
  swap: () => [...queryKeys.all, 'swap'] as const,
};
