"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryKeys = void 0;
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
exports.queryKeys = {
    /** Root key — invalidating this refetches **all** torosdk queries. */
    all: ['torosdk'],
    /**
     * Key for a single-currency balance query.
     * @param address - Wallet address.
     * @param currency - The currency to query.
     */
    balance: (address, currency) => [...exports.queryKeys.all, 'balance', address.toLowerCase(), currency],
    /**
     * Key for the all-currencies balance query.
     * @param address - Wallet address.
     */
    balances: (address) => [...exports.queryKeys.all, 'balances', address.toLowerCase()],
    /** Key for transfer mutation status. */
    transfer: () => [...exports.queryKeys.all, 'transfer'],
    /**
     * Key for a TNS name resolution query.
     * @param name - The TNS name to resolve.
     */
    resolveTNS: (name) => [...exports.queryKeys.all, 'tns', 'resolve', name],
    /**
     * Key for a reverse TNS lookup query.
     * @param address - Wallet address.
     */
    lookupTNS: (address) => [...exports.queryKeys.all, 'tns', 'lookup', address.toLowerCase()],
    /**
     * Key for a KYC status query.
     * @param address - Wallet address.
     */
    kycStatus: (address) => [...exports.queryKeys.all, 'kyc', address.toLowerCase()],
    /** Key for exchange rates query. */
    exchangeRates: () => [...exports.queryKeys.all, 'exchange-rates'],
    // --- Bridge ---
    /**
     * Key for a bridged-chain native balance query.
     * @param address - Wallet address.
     * @param network - Target bridge network.
     */
    bridgeBalance: (address, network) => [...exports.queryKeys.all, 'bridge', 'balance', address.toLowerCase(), network],
    /**
     * Key for a bridged-chain token balance query.
     * @param address - Wallet address.
     * @param network - Target bridge network.
     * @param contractAddress - Token contract address.
     */
    bridgeTokenBalance: (address, network, contractAddress) => [
        ...exports.queryKeys.all,
        'bridge',
        'token-balance',
        address.toLowerCase(),
        network,
        contractAddress.toLowerCase(),
    ],
    /**
     * Key for a bridged-chain native transactions query.
     * @param address - Wallet address.
     * @param network - Target bridge network.
     */
    bridgeTransactions: (address, network) => [...exports.queryKeys.all, 'bridge', 'transactions', address.toLowerCase(), network],
    /**
     * Key for a bridged-chain token transactions query.
     * @param address - Wallet address.
     * @param network - Target bridge network.
     * @param contractAddress - Token contract address.
     */
    bridgeTokenTransactions: (address, network, contractAddress) => [
        ...exports.queryKeys.all,
        'bridge',
        'token-transactions',
        address.toLowerCase(),
        network,
        contractAddress.toLowerCase(),
    ],
    /**
     * Key for a bridge fee estimate query.
     * @param network - Target bridge network.
     * @param contractAddress - Token contract address.
     * @param amount - Amount to bridge.
     */
    bridgeTokenFee: (network, contractAddress, amount) => [...exports.queryKeys.all, 'bridge', 'fee', network, contractAddress.toLowerCase(), amount],
    /** Key for bridge mutation status. */
    bridge: () => [...exports.queryKeys.all, 'bridge'],
    // --- Solana ---
    /**
     * Key for a Solana native balance query.
     * @param address - Solana address.
     */
    solBalance: (address) => [...exports.queryKeys.all, 'solana', 'balance', address],
    /**
     * Key for a Solana token balance query.
     * @param address - Solana address.
     * @param contractAddress - Token contract address.
     */
    solTokenBalance: (address, contractAddress) => [...exports.queryKeys.all, 'solana', 'token-balance', address, contractAddress],
    /**
     * Key for a Solana native transactions query.
     * @param address - Solana address.
     */
    solTransactions: (address) => [...exports.queryKeys.all, 'solana', 'transactions', address],
    /**
     * Key for a Solana token transactions query.
     * @param address - Solana address.
     * @param contractAddress - Token contract address.
     */
    solTokenTransactions: (address, contractAddress) => [...exports.queryKeys.all, 'solana', 'token-transactions', address, contractAddress],
    // --- Swap ---
    /**
     * Key for a swap quote query.
     * @param fromCurrency - Source currency.
     * @param toCurrency - Destination currency.
     * @param amount - Amount to swap.
     */
    swapQuote: (fromCurrency, toCurrency, amount) => [...exports.queryKeys.all, 'swap', 'quote', fromCurrency, toCurrency, amount],
    /** Key for swap mutation status. */
    swap: () => [...exports.queryKeys.all, 'swap'],
    // --- Transactions ---
    transactions: (address) => [...exports.queryKeys.all, 'transactions', address.toLowerCase()],
    transactionByHash: (hash) => [...exports.queryKeys.all, 'transaction', hash],
    // --- Blockchain ---
    blockchainInfo: () => [...exports.queryKeys.all, 'blockchain'],
    // --- Roles ---
    addressRole: (address) => [...exports.queryKeys.all, 'role', address.toLowerCase()],
    isAdmin: (address) => [...exports.queryKeys.all, 'role', 'is-admin', address.toLowerCase()],
    isSuperAdmin: (address) => [...exports.queryKeys.all, 'role', 'is-super-admin', address.toLowerCase()],
    // --- Products ---
    products: () => [...exports.queryKeys.all, 'products'],
    project: (admin) => [...exports.queryKeys.all, 'products', 'project', admin.toLowerCase()],
    product: (id) => [...exports.queryKeys.all, 'product', id],
    // --- Storage ---
    storageValue: (key) => [...exports.queryKeys.all, 'storage', key],
    storageStatus: () => [...exports.queryKeys.all, 'storage', 'status'],
    storageVersion: () => [...exports.queryKeys.all, 'storage', 'version'],
    // --- Virtual wallet ---
    virtualWallet: (address) => [...exports.queryKeys.all, 'virtual-wallet', address.toLowerCase()],
    virtualWalletByAddress: (address) => [...exports.queryKeys.all, 'virtual-wallet', 'by-address', address.toLowerCase()],
    // --- Keystore ---
    keystoreEntry: (address) => [...exports.queryKeys.all, 'keystore', address.toLowerCase()],
    // --- Token Extended ---
    tokenExtended: (address, contract) => [...exports.queryKeys.all, 'token-extended', address.toLowerCase(), contract || ''],
    // --- Token Balance ---
    tokenBalance: (address, contract) => [...exports.queryKeys.all, 'token-balance', address.toLowerCase(), contract || ''],
    // --- Currency Admin / Info ---
    currencyInfo: (currency) => [...exports.queryKeys.all, 'currency', currency],
};
//# sourceMappingURL=query-keys.js.map