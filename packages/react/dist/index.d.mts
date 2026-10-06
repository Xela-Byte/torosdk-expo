import React from 'react';
import { NetworkType, Balances, ToroError as ToroError$1, Transaction, BlockchainStatus, Block, ExchangeRate, KYCInput, DepositInput, VirtualWallet, CreateVirtualWalletInput, BridgeTransferParams, BridgeFeeParams, BridgeNetwork, DeployContractOutput, DeployContractInput, ProductInput, SwapRateOutput, SwapExecuteParams, SwapQuoteParams } from '@reactforge/sdk-adapter';

interface ToroContextValue {
    network: NetworkType;
    activeAddress: string | null;
    setActiveAddress: (address: string | null) => void;
}
interface ToroProviderProps {
    children: React.ReactNode;
    network?: NetworkType;
    baseURL?: string;
}
declare const ToroProvider: React.FC<ToroProviderProps>;
declare const useToroContext: () => ToroContextValue;

interface UseToroBalanceResult {
    data: Balances | null;
    loading: boolean;
    error: ToroError$1 | Error | null;
    refetch: () => Promise<void>;
}
declare const useToroBalance: (address?: string | null) => UseToroBalanceResult;

interface CreateWalletResult {
    address: string | null;
    loading: boolean;
    error: Error | null;
    createWallet: (username: string, password: string) => Promise<string | null>;
}
declare const useToroCreateWallet: () => CreateWalletResult;

interface SendParams {
    receiverAddr: string;
    amount: string;
    currency: string;
    senderPwd: string;
}
declare const useToroSend: () => {
    data: any;
    sendTransaction: (params: SendParams) => Promise<any>;
    loading: boolean;
    error: Error | ToroError$1 | null;
};

declare const useToroTNSResolve: (name?: string) => {
    data: string | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
};
declare const useToroTNSLookup: (address?: string) => {
    data: string | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
};

interface UseToroUpdateTNSResult {
    loading: boolean;
    error: Error | null;
    success: boolean;
    updateTNS: (newUsername: string, password: string) => Promise<boolean>;
}
/** Mutation hook to update the TNS name for the active wallet. */
declare const useToroUpdateTNS: () => UseToroUpdateTNSResult;
interface UseToroDeleteTNSResult {
    loading: boolean;
    error: Error | null;
    success: boolean;
    deleteTNS: (password: string) => Promise<boolean>;
}
/** Mutation hook to delete the TNS name from the active wallet. */
declare const useToroDeleteTNS: () => UseToroDeleteTNSResult;

interface TokenBalance {
    balance: string;
    name: string;
    symbol: string;
    decimals: number;
}
declare const useToroTokenBalance: (address?: string | null) => {
    data: TokenBalance | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
};

interface UseToroTokenAllowanceResult {
    allowance: string;
    minAllowance: string;
    maxAllowance: string;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
declare const useToroTokenAllowance: (owner?: string, spender?: string) => UseToroTokenAllowanceResult;
interface UseToroTokenFeeResult {
    fee: string;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
declare const useToroTokenFee: (amount: string | number) => UseToroTokenFeeResult;
interface UseToroTokenStatusResult {
    isEnrolled: boolean | null;
    isFrozen: boolean | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
declare const useToroTokenStatus: (address?: string) => UseToroTokenStatusResult;
interface UseToroTokenSupplyResult {
    totalCap: string;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
declare const useToroTokenSupply: () => UseToroTokenSupplyResult;

interface UseToroTransactionsResult {
    data: Transaction[];
    loading: boolean;
    error: ToroError$1 | Error | null;
    refetch: () => Promise<void>;
}
declare const useToroTransactions: (address?: string | null, count?: number) => UseToroTransactionsResult;

interface UseToroTransactionByHashResult {
    data: Transaction | null;
    receipt: any | null;
    loading: boolean;
    error: ToroError$1 | Error | null;
    refetch: () => Promise<void>;
}
/** Fetch a single transaction and its receipt by hash. */
declare const useToroTransactionByHash: (hash?: string | null) => UseToroTransactionByHashResult;
type TransactionStatus = 'pending' | 'success' | 'failed' | 'unknown';
interface UseToroTransactionStatusResult {
    status: TransactionStatus;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
/** Derives the success/failure status from a transaction hash. */
declare const useToroTransactionStatus: (hash?: string | null) => UseToroTransactionStatusResult;

interface BlockchainData {
    status: BlockchainStatus | null;
    latestBlock: Block | null;
    blocks: Block[];
}
interface UseToroBlockchainResult {
    data: BlockchainData;
    loading: boolean;
    error: ToroError$1 | Error | null;
    refetch: () => Promise<void>;
}
/** Fetch blockchain status, latest block, and recent blocks. */
declare const useToroBlockchain: (blockCount?: number) => UseToroBlockchainResult;
interface UseToroChainTransactionsResult {
    data: Transaction[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
/** Fetch the latest N transactions on the chain. */
declare const useToroChainTransactions: (count?: number) => UseToroChainTransactionsResult;

interface UseToroAddressRoleResult {
    role: string | null;
    isValid: boolean | null;
    loading: boolean;
    error: ToroError$1 | Error | null;
    refetch: () => Promise<void>;
}
/** Fetch the on-chain role of any address + validate address format. */
declare const useToroAddressRole: (address?: string | null) => UseToroAddressRoleResult;

interface UseToroExchangeRatesResult {
    data: ExchangeRate[];
    loading: boolean;
    error: ToroError$1 | Error | null;
    refetch: () => Promise<void>;
}
/** Fetch all supported asset exchange rates from Toronet. */
declare const useToroExchangeRates: () => UseToroExchangeRatesResult;

interface UseToroKYCStatusResult {
    isVerified: boolean | null;
    loading: boolean;
    error: ToroError$1 | Error | null;
    refetch: () => Promise<void>;
}
/** Query whether a wallet address is KYC-verified. */
declare const useToroKYCStatus: (address?: string | null) => UseToroKYCStatusResult;
interface UseToroPerformKYCResult {
    success: boolean;
    loading: boolean;
    error: Error | null;
    submitKYC: (input: KYCInput) => Promise<boolean>;
}
/** Mutation hook to submit KYC data for a customer (requires admin credentials). */
declare const useToroPerformKYC: () => UseToroPerformKYCResult;

interface UseToroPaymentResult {
    loading: boolean;
    error: Error | null;
    /** Initiate a fiat deposit (admin proxied) */
    deposit: (input: DepositInput) => Promise<any>;
    /** Confirm a fiat deposit using txid */
    confirmDeposit: (currency: string, txid: string) => Promise<boolean>;
    /** Fetch the list of supported USD banks */
    getUSDBanks: (admin: string, adminpwd: string) => Promise<any[]>;
    /** Fetch the list of supported NGN banks */
    getNGNBanks: (admin: string, adminpwd: string) => Promise<any[]>;
}
/** Provides payment initialization, confirmation, and bank list queries. */
declare const useToroPayment: () => UseToroPaymentResult;

interface UseToroVirtualWalletResult {
    data: VirtualWallet | null;
    loading: boolean;
    error: Error | null;
    create: (input: CreateVirtualWalletInput) => Promise<VirtualWallet | null>;
    fetchByWalletId: (walletId: string, admin: string, adminpwd: string) => Promise<VirtualWallet | null>;
    fetchByAddress: (address: string, admin: string, adminpwd: string) => Promise<VirtualWallet | null>;
    updateTransactions: (address: string, admin: string, adminpwd: string) => Promise<boolean>;
}
/** Provides methods for interacting with virtual wallets via the admin proxy. */
declare const useToroVirtualWallet: () => UseToroVirtualWalletResult;

interface UseToroBridgeBalanceResult {
    balance: any | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
declare const useToroBridgeBalance: (network: BridgeNetwork, address?: string, admin?: string, adminpwd?: string) => UseToroBridgeBalanceResult;
interface UseToroBridgeResult {
    loading: boolean;
    error: Error | null;
    /** Bridge tokens from the specified chain */
    transfer: (params: BridgeTransferParams, admin?: string, adminpwd?: string) => Promise<any>;
    /** Get an estimate for the bridge fee */
    getFeeEstimate: (params: BridgeFeeParams, admin?: string, adminpwd?: string) => Promise<any>;
}
declare const useToroBridge: () => UseToroBridgeResult;
interface UseToroBridgeTransactionsResult {
    data: any[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
declare const useToroBridgeTransactions: (network: BridgeNetwork, address?: string, admin?: string, adminpwd?: string) => UseToroBridgeTransactionsResult;
interface UseToroBridgeTokenBalanceResult {
    data: any | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
/** Fetch a token balance for an address on a bridged chain. */
declare const useToroBridgeTokenBalance: (network: BridgeNetwork, contractAddress: string, address?: string, tokenName?: string, admin?: string, adminpwd?: string) => UseToroBridgeTokenBalanceResult;
interface UseToroBridgeTokenTransactionsResult {
    data: any[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
/** Fetch token transaction history for an address on a bridged chain. */
declare const useToroBridgeTokenTransactions: (network: BridgeNetwork, contractAddress: string, address?: string, admin?: string, adminpwd?: string) => UseToroBridgeTokenTransactionsResult;
interface UseToroBridgeTokenFeeResult {
    data: any | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
/** Estimate the bridging fee for a token on a given network. */
declare const useToroBridgeTokenFee: (network: BridgeNetwork, contractAddress: string, amount: string, admin?: string, adminpwd?: string) => UseToroBridgeTokenFeeResult;

interface UseToroDeployContractResult {
    data: DeployContractOutput | null;
    loading: boolean;
    error: Error | null;
    deploy: (input: DeployContractInput) => Promise<DeployContractOutput | null>;
}
/** Provides functionality to deploy a smart contract via Toronet Deployer service. */
declare const useToroDeployContract: () => UseToroDeployContractResult;

interface WalletKeyData {
    key: any;
    address: string;
}
interface UseToroWalletResult {
    data: WalletKeyData | null;
    loading: boolean;
    error: ToroError$1 | Error | null;
    refetch: () => Promise<void>;
}
/** Read the wallet key data for the active address (or a given address). */
declare const useToroWallet: (address?: string | null) => UseToroWalletResult;
interface UseToroImportWalletResult {
    address: string | null;
    loading: boolean;
    error: Error | null;
    importWallet: (privateKey: string, password: string) => Promise<string | null>;
}
declare const useToroImportWallet: () => UseToroImportWalletResult;
interface UseToroUpdatePasswordResult {
    loading: boolean;
    error: Error | null;
    success: boolean;
    updatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}
declare const useToroUpdatePassword: () => UseToroUpdatePasswordResult;
interface UseToroDeleteWalletResult {
    loading: boolean;
    error: Error | null;
    success: boolean;
    deleteWalletAccount: (password: string) => Promise<boolean>;
}
declare const useToroDeleteWallet: () => UseToroDeleteWalletResult;
interface UseToroVerifyPasswordResult {
    loading: boolean;
    error: Error | null;
    isValid: boolean | null;
    verify: (address: string, password: string) => Promise<boolean | null>;
}
/** Verify that a password matches the stored credential for a wallet address. */
declare const useToroVerifyPassword: () => UseToroVerifyPasswordResult;

interface UseToroStorageQueryResult {
    isOn: any | null;
    version: any | null;
    owner: any | null;
    loading: boolean;
    error: Error | null;
    checkContract: (contract: string) => Promise<any>;
    checkIfOwner: (address: string) => Promise<any>;
    refetch: () => Promise<void>;
}
declare const useToroStorageQuery: () => UseToroStorageQueryResult;
declare const useToroStorageMutation: () => {
    loading: boolean;
    error: Error | null;
    turnOn: (pwd: string) => Promise<any>;
    turnOff: (pwd: string) => Promise<any>;
    registerContract: (pwd: string, contract: string) => Promise<any>;
    unregisterContract: (pwd: string, contract: string) => Promise<any>;
    increaseVersion: (pwd: string) => Promise<any>;
    decreaseVersion: (pwd: string) => Promise<any>;
    setVersion: (pwd: string, version: string | number) => Promise<any>;
    transferOwnership: (pwd: string, newOwner: string) => Promise<any>;
};

declare const useToroCurrencyAdmin: () => {
    loading: boolean;
    error: Error | null;
    allowCurrencyTransfer: (currency: string, address: string, password: string) => Promise<any>;
    disableCurrencyTransfer: (currency: string, address: string, password: string) => Promise<any>;
    freezeCurrencyAddress: (params: any) => Promise<any>;
    unfreezeCurrencyAddress: (params: any) => Promise<any>;
    enrollCurrencyAddress: (params: any) => Promise<any>;
    mintCurrencyFunds: (params: any) => Promise<any>;
    burnCurrencyFunds: (params: any) => Promise<any>;
};

declare const useToroKeystore: () => {
    loading: boolean;
    error: Error | null;
    importWalletFromPrivateKey: (pvKey: string, password: string) => Promise<string>;
    getWalletKey: (address: string) => Promise<any>;
    updateWalletPassword: (address: string, oldPassword: string, newPassword: string) => Promise<any>;
    deleteWallet: (address: string, password: string) => Promise<any>;
};

declare const useToroProducts: () => {
    loading: boolean;
    error: Error | null;
    getProject: (admin: string, getbalances?: boolean) => Promise<any>;
    getProduct: (productId: string, admin: string, adminpwd: string) => Promise<any>;
    createProduct: (input: ProductInput) => Promise<any>;
    updateProduct: (input: ProductInput) => Promise<any>;
};

declare const useToroRoleMutations: () => {
    loading: boolean;
    error: Error | null;
    addSuperAdmin: (adminStr: string, pwd: string, newAdmin: string) => Promise<any>;
    addAdmin: (adminStr: string, pwd: string, newAdmin: string) => Promise<any>;
    removeAdmin: (adminStr: string, pwd: string, targetAdmin: string) => Promise<any>;
    getNumberOfAdmins: () => Promise<any>;
    getAdminIndex: (address: string) => Promise<any>;
    isAdmin: (address: string) => Promise<any>;
    isSuperAdmin: (address: string) => Promise<any>;
    isDebugger: (address: string) => Promise<any>;
};

interface UseToroSwapQuoteResult {
    data: SwapRateOutput | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
/**
 * Fetch a swap quote for a given currency pair and amount.
 *
 * @param params - `fromCurrency`, `toCurrency`, and `amount`.
 * @param enabled - Set to `false` to disable the auto-fetch (default: `true`).
 *
 * @example
 * ```tsx
 * const { data, loading } = useToroSwapQuote({ fromCurrency: 'NGN', toCurrency: 'USD', amount: 1000 });
 * ```
 */
declare const useToroSwapQuote: (params: SwapQuoteParams | null, enabled?: boolean) => UseToroSwapQuoteResult;
interface UseToroSwapResult {
    loading: boolean;
    error: Error | null;
    success: boolean;
    result: any;
    swap: (params: SwapExecuteParams) => Promise<any>;
}
/**
 * Execute a currency swap on the Toronet network.
 *
 * @example
 * ```tsx
 * const { swap, loading, error } = useToroSwap();
 * await swap({ fromCurrency: 'NGN', toCurrency: 'USD', amount: 1000, client: address, clientPassword: password });
 * ```
 */
declare const useToroSwap: () => UseToroSwapResult;

interface UseToroCreateSolanaAddressResult {
    address: string | null;
    loading: boolean;
    error: Error | null;
    createAddress: (admin?: string, adminpwd?: string) => Promise<string | null>;
}
/** Create a new Solana address via the Toronet admin API. */
declare const useToroCreateSolanaAddress: () => UseToroCreateSolanaAddressResult;
interface UseToroCreateToronetSolanaAddressResult {
    solAddress: string | null;
    loading: boolean;
    error: Error | null;
    create: (address: string, password: string) => Promise<string | null>;
}
/** Link a Toronet address to a new Solana address. */
declare const useToroCreateToronetSolanaAddress: () => UseToroCreateToronetSolanaAddressResult;
interface UseToroIsValidSolanaAddressResult {
    isValid: boolean | null;
    loading: boolean;
    error: Error | null;
    validate: (address: string) => Promise<boolean | null>;
}
/** Validate whether a string is a valid Solana address. */
declare const useToroIsValidSolanaAddress: () => UseToroIsValidSolanaAddressResult;
interface UseToroTransferSolanaResult {
    loading: boolean;
    error: Error | null;
    success: boolean;
    transfer: (params: {
        from: string;
        to: string;
        amount: string;
        pwd: string;
    }) => Promise<any>;
}
/** Transfer native SOL between addresses. */
declare const useToroTransferSolana: () => UseToroTransferSolanaResult;
interface UseToroTransferSolTokenResult {
    loading: boolean;
    error: Error | null;
    success: boolean;
    transfer: (params: {
        from: string;
        to: string;
        amount: string;
        pwd: string;
        contractaddress: string;
        tokenname: string;
        usetokenasfees?: string;
    }) => Promise<any>;
}
/** Transfer an SPL token on Solana. */
declare const useToroTransferSolToken: () => UseToroTransferSolTokenResult;
interface UseToroSolBalanceResult {
    data: any | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
/** Fetch the native SOL balance for a wallet address. */
declare const useToroSolBalance: (address?: string | null) => UseToroSolBalanceResult;
interface UseToroSolTokenBalanceResult {
    data: any | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
/** Fetch the SPL token balance for an address and contract. */
declare const useToroSolTokenBalance: (address?: string | null, contractAddress?: string | null) => UseToroSolTokenBalanceResult;
interface UseToroSolTransactionsResult {
    data: any[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
/** Fetch native SOL transaction history for a wallet address. */
declare const useToroSolTransactions: (address?: string | null) => UseToroSolTransactionsResult;
interface UseToroSolTokenTransactionsResult {
    data: any[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
/** Fetch SPL token transaction history for an address and contract. */
declare const useToroSolTokenTransactions: (address?: string | null, contractAddress?: string | null) => UseToroSolTokenTransactionsResult;
interface UseToroSolLatestBlockResult {
    data: any | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
/** Fetch the latest Solana block info. */
declare const useToroSolLatestBlock: () => UseToroSolLatestBlockResult;

/**
 * Machine-readable error codes for the {@link ToroError} hierarchy in @reactforge/react.
 */
type ToroErrorCode = 'NETWORK' | 'API' | 'AUTH' | 'VALIDATION';
/**
 * Base error class for all @reactforge/react errors.
 */
declare class ToroError extends Error {
    readonly code: ToroErrorCode;
    readonly detail: string;
    readonly cause?: unknown;
    constructor(code: ToroErrorCode, detail: string, cause?: unknown);
}
/**
 * Thrown when a network-level failure occurs (timeout, offline, connection refused).
 */
declare class NetworkError extends ToroError {
    constructor(detail: string, cause?: unknown);
}
/**
 * Thrown when the Toronet API returns an error response.
 */
declare class APIError extends ToroError {
    readonly status?: number;
    constructor(detail: string, status?: number, cause?: unknown);
}
/**
 * Normalizes an unknown error into a typed ToroError subclass.
 */
declare function wrapError(err: unknown): never;

export { APIError, type BlockchainData, type CreateWalletResult, NetworkError, type SendParams, type TokenBalance, ToroError, type ToroErrorCode, ToroProvider, type ToroProviderProps, type TransactionStatus, type UseToroAddressRoleResult, type UseToroBalanceResult, type UseToroBlockchainResult, type UseToroBridgeBalanceResult, type UseToroBridgeResult, type UseToroBridgeTokenBalanceResult, type UseToroBridgeTokenFeeResult, type UseToroBridgeTokenTransactionsResult, type UseToroBridgeTransactionsResult, type UseToroChainTransactionsResult, type UseToroCreateSolanaAddressResult, type UseToroCreateToronetSolanaAddressResult, type UseToroDeleteTNSResult, type UseToroDeleteWalletResult, type UseToroDeployContractResult, type UseToroExchangeRatesResult, type UseToroImportWalletResult, type UseToroIsValidSolanaAddressResult, type UseToroKYCStatusResult, type UseToroPaymentResult, type UseToroPerformKYCResult, type UseToroSolBalanceResult, type UseToroSolLatestBlockResult, type UseToroSolTokenBalanceResult, type UseToroSolTokenTransactionsResult, type UseToroSolTransactionsResult, type UseToroStorageQueryResult, type UseToroSwapQuoteResult, type UseToroSwapResult, type UseToroTokenAllowanceResult, type UseToroTokenFeeResult, type UseToroTokenStatusResult, type UseToroTokenSupplyResult, type UseToroTransactionByHashResult, type UseToroTransactionStatusResult, type UseToroTransactionsResult, type UseToroTransferSolTokenResult, type UseToroTransferSolanaResult, type UseToroUpdatePasswordResult, type UseToroUpdateTNSResult, type UseToroVerifyPasswordResult, type UseToroVirtualWalletResult, type UseToroWalletResult, type WalletKeyData, useToroAddressRole, useToroBalance, useToroBlockchain, useToroBridge, useToroBridgeBalance, useToroBridgeTokenBalance, useToroBridgeTokenFee, useToroBridgeTokenTransactions, useToroBridgeTransactions, useToroChainTransactions, useToroContext, useToroCreateSolanaAddress, useToroCreateToronetSolanaAddress, useToroCreateWallet, useToroCurrencyAdmin, useToroDeleteTNS, useToroDeleteWallet, useToroDeployContract, useToroExchangeRates, useToroImportWallet, useToroIsValidSolanaAddress, useToroKYCStatus, useToroKeystore, useToroPayment, useToroPerformKYC, useToroProducts, useToroRoleMutations, useToroSend, useToroSolBalance, useToroSolLatestBlock, useToroSolTokenBalance, useToroSolTokenTransactions, useToroSolTransactions, useToroStorageMutation, useToroStorageQuery, useToroSwap, useToroSwapQuote, useToroTNSLookup, useToroTNSResolve, useToroTokenAllowance, useToroTokenBalance, useToroTokenFee, useToroTokenStatus, useToroTokenSupply, useToroTransactionByHash, useToroTransactionStatus, useToroTransactions, useToroTransferSolToken, useToroTransferSolana, useToroUpdatePassword, useToroUpdateTNS, useToroVerifyPassword, useToroVirtualWallet, useToroWallet, wrapError };
