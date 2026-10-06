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
export declare const queryKeys: {
    /** Root key — invalidating this refetches **all** torosdk queries. */
    all: readonly ["torosdk"];
    /**
     * Key for a single-currency balance query.
     * @param address - Wallet address.
     * @param currency - The currency to query.
     */
    balance: (address: string, currency: Currency) => readonly ["torosdk", "balance", string, Currency];
    /**
     * Key for the all-currencies balance query.
     * @param address - Wallet address.
     */
    balances: (address: string) => readonly ["torosdk", "balances", string];
    /** Key for transfer mutation status. */
    transfer: () => readonly ["torosdk", "transfer"];
    /**
     * Key for a TNS name resolution query.
     * @param name - The TNS name to resolve.
     */
    resolveTNS: (name: string) => readonly ["torosdk", "tns", "resolve", string];
    /**
     * Key for a reverse TNS lookup query.
     * @param address - Wallet address.
     */
    lookupTNS: (address: string) => readonly ["torosdk", "tns", "lookup", string];
    /**
     * Key for a KYC status query.
     * @param address - Wallet address.
     */
    kycStatus: (address: string) => readonly ["torosdk", "kyc", string];
    /** Key for exchange rates query. */
    exchangeRates: () => readonly ["torosdk", "exchange-rates"];
    /**
     * Key for a bridged-chain native balance query.
     * @param address - Wallet address.
     * @param network - Target bridge network.
     */
    bridgeBalance: (address: string, network: BridgeNetwork | string) => readonly ["torosdk", "bridge", "balance", string, string];
    /**
     * Key for a bridged-chain token balance query.
     * @param address - Wallet address.
     * @param network - Target bridge network.
     * @param contractAddress - Token contract address.
     */
    bridgeTokenBalance: (address: string, network: BridgeNetwork | string, contractAddress: string) => readonly ["torosdk", "bridge", "token-balance", string, string, string];
    /**
     * Key for a bridged-chain native transactions query.
     * @param address - Wallet address.
     * @param network - Target bridge network.
     */
    bridgeTransactions: (address: string, network: BridgeNetwork | string) => readonly ["torosdk", "bridge", "transactions", string, string];
    /**
     * Key for a bridged-chain token transactions query.
     * @param address - Wallet address.
     * @param network - Target bridge network.
     * @param contractAddress - Token contract address.
     */
    bridgeTokenTransactions: (address: string, network: BridgeNetwork | string, contractAddress: string) => readonly ["torosdk", "bridge", "token-transactions", string, string, string];
    /**
     * Key for a bridge fee estimate query.
     * @param network - Target bridge network.
     * @param contractAddress - Token contract address.
     * @param amount - Amount to bridge.
     */
    bridgeTokenFee: (network: BridgeNetwork | string, contractAddress: string, amount: string) => readonly ["torosdk", "bridge", "fee", string, string, string];
    /** Key for bridge mutation status. */
    bridge: () => readonly ["torosdk", "bridge"];
    /**
     * Key for a Solana native balance query.
     * @param address - Solana address.
     */
    solBalance: (address: string) => readonly ["torosdk", "solana", "balance", string];
    /**
     * Key for a Solana token balance query.
     * @param address - Solana address.
     * @param contractAddress - Token contract address.
     */
    solTokenBalance: (address: string, contractAddress: string) => readonly ["torosdk", "solana", "token-balance", string, string];
    /**
     * Key for a Solana native transactions query.
     * @param address - Solana address.
     */
    solTransactions: (address: string) => readonly ["torosdk", "solana", "transactions", string];
    /**
     * Key for a Solana token transactions query.
     * @param address - Solana address.
     * @param contractAddress - Token contract address.
     */
    solTokenTransactions: (address: string, contractAddress: string) => readonly ["torosdk", "solana", "token-transactions", string, string];
    /**
     * Key for a swap quote query.
     * @param fromCurrency - Source currency.
     * @param toCurrency - Destination currency.
     * @param amount - Amount to swap.
     */
    swapQuote: (fromCurrency: string, toCurrency: string, amount: number) => readonly ["torosdk", "swap", "quote", string, string, number];
    /** Key for swap mutation status. */
    swap: () => readonly ["torosdk", "swap"];
    transactions: (address: string) => readonly ["torosdk", "transactions", string];
    transactionByHash: (hash: string) => readonly ["torosdk", "transaction", string];
    blockchainInfo: () => readonly ["torosdk", "blockchain"];
    addressRole: (address: string) => readonly ["torosdk", "role", string];
    isAdmin: (address: string) => readonly ["torosdk", "role", "is-admin", string];
    isSuperAdmin: (address: string) => readonly ["torosdk", "role", "is-super-admin", string];
    products: () => readonly ["torosdk", "products"];
    project: (admin: string) => readonly ["torosdk", "products", "project", string];
    product: (id: string) => readonly ["torosdk", "product", string];
    storageValue: (key: string) => readonly ["torosdk", "storage", string];
    storageStatus: () => readonly ["torosdk", "storage", "status"];
    storageVersion: () => readonly ["torosdk", "storage", "version"];
    virtualWallet: (address: string) => readonly ["torosdk", "virtual-wallet", string];
    virtualWalletByAddress: (address: string) => readonly ["torosdk", "virtual-wallet", "by-address", string];
    keystoreEntry: (address: string) => readonly ["torosdk", "keystore", string];
    tokenExtended: (address: string, contract?: string) => readonly ["torosdk", "token-extended", string, string];
    tokenBalance: (address: string, contract?: string) => readonly ["torosdk", "token-balance", string, string];
    currencyInfo: (currency: string) => readonly ["torosdk", "currency", string];
};
//# sourceMappingURL=query-keys.d.ts.map