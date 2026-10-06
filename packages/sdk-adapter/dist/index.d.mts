import { BridgeNetwork } from 'torosdk';
export { BridgeNetwork, Currency } from 'torosdk';

type NetworkType = 'mainnet' | 'testnet';
interface ToroforgeConfig {
    network: NetworkType;
    baseURL?: string;
    connectWURL?: string;
}
declare const initToroforge: (config: ToroforgeConfig) => void;
declare const getConfig: () => any;

declare class ToroError extends Error {
    code: string;
    operation: string;
    details: any;
    constructor(message: string, code: string, operation: string, details?: any);
}
declare const normalizeError: (error: any, operation: string) => ToroError;

/**
 * Format a raw ToroG token amount (removing decimals, applying precision)
 */
declare const formatToroAmount: (rawAmount: string | number, decimals?: number, displayDecimals?: number) => string;
/**
 * Format a currency balance with symbol
 */
declare const formatToroCurrency: (amount: string | number, currency: string, displayDecimals?: number) => string;
/**
 * Validate whether a string is a plausible Toronet address (0x-prefixed hex, 42 chars)
 */
declare const validateToroAddress: (address: string) => boolean;
/**
 * Shorten a Toronet address for display: 0x1234...5678
 */
declare const shortenAddress: (address: string, start?: number, end?: number) => string;
/**
 * Format a transaction object for display — normalises common field names
 */
declare const formatToroTransaction: (tx: any) => {
    hash: string;
    from: string;
    to: string;
    amount: string;
    currency: string;
    status: string;
    timestamp: string;
};
/**
 * Parse a ToroError or raw error into a user-friendly message
 */
declare const parseToroError: (error: any) => string;
/**
 * Convert a wei-style big number string to a human-readable value
 */
declare const fromWei: (value: string | number, decimals?: number) => string;
/**
 * Convert a human-readable value to wei-style big number string
 */
declare const toWei: (value: string | number, decimals?: number) => string;

declare const createWallet: (username: string, password: string) => Promise<string>;
declare const isTNSAvailable: (username: string) => Promise<boolean>;
declare const verifyWalletPassword: (address: string, password: string) => Promise<boolean>;
declare const importWalletFromPrivateKeyAndPassword: (pvKey: string, password: string) => Promise<string>;

interface Balances {
    ngnBalance: string;
    usdBalance: string;
    toroGBalance: string;
    kshBalance: string;
}
declare const getBalance: (address: string) => Promise<Balances>;

declare const resolveTNSName: (name: string) => Promise<string | null>;
declare const lookupTNSAddress: (address: string) => Promise<string | null>;
declare const updateTNSName: (address: string, password: string, username: string) => Promise<any>;
declare const deleteTNSName: (address: string, password: string) => Promise<any>;
declare const resolveTNS: (name: string) => Promise<string | null>;
declare const lookupTNS: (address: string) => Promise<string | null>;
declare const setTNS: (address: string, password: string, username: string) => Promise<any>;
declare const registerTNS: (address: string, password: string, username: string) => Promise<any>;

declare const getTokenBalance: (address: string) => Promise<string>;
declare const getTokenMetadata: () => Promise<{
    name: string;
    symbol: string;
    decimals: number;
}>;
declare const getTokenAllowance: (owner: string, spender: string) => Promise<string>;
declare const getMinimumTokenAllowance: (address: string) => Promise<string>;
declare const getMaximumTokenAllowance: (address: string) => Promise<string>;
declare const getTokenTransactionFee: (amount: string | number) => Promise<string>;
declare const isTokenEnrolled: (address: string) => Promise<boolean>;
declare const isTokenFrozen: (address: string) => Promise<boolean>;
declare const getTokenTotalCap: () => Promise<string>;

declare const sendTransaction: (currency: string, senderAddr: string, senderPwd: string, receiverAddr: string, amount: string) => Promise<any>;
declare const getTransactions: (address: string, count?: number) => Promise<any>;

interface BlockchainStatus {
    status: string;
    [key: string]: any;
}
interface Block {
    number: number | string;
    hash: string;
    timestamp: number | string;
    transactions?: any[];
    [key: string]: any;
}
interface Transaction {
    hash: string;
    from?: string;
    to?: string;
    value?: string;
    currency?: string;
    blockNumber?: number | string;
    status?: string;
    [key: string]: any;
}
interface ExchangeRate {
    currency: string;
    rate: string | number;
    [key: string]: any;
}
interface AddressTransactionsRangeParams {
    address: string;
    startDate: string;
    endDate: string;
    token?: string;
    count?: number;
    start?: number;
}
declare const getChainStatus: () => Promise<any>;
declare const getBlockchainInfo: () => Promise<any>;
declare const getLatestBlock: () => Promise<Block>;
declare const getBlocks: (count?: number) => Promise<Block[]>;
declare const getChainTransactions: (count?: number) => Promise<Transaction[]>;
declare const getBlockByIdAdapter: (id: string) => Promise<Block>;
declare const getTransactionByHashAdapter: (hash: string) => Promise<Transaction>;
declare const getTransactionByHash: (hash: string) => Promise<Transaction>;
declare const getTransactionReceipt: (hash: string) => Promise<any>;
declare const getEventByIdAdapter: (id: string) => Promise<any>;
declare const getAddressRoleAdapter: (address: string) => Promise<string>;
declare const getAddressBalanceAdapter: (address: string) => Promise<any>;
declare const getAddressTransactionsAdapter: (address: string, count?: number) => Promise<Transaction[]>;
declare const getAddressTransactionsRange: (params: AddressTransactionsRangeParams) => Promise<Transaction[]>;
declare const getToroTransactions: (count?: number) => Promise<Transaction[]>;
declare const getAddressToroTransactions: (address: string, count?: number) => Promise<Transaction[]>;
declare const getDollarTransactions: (count?: number) => Promise<Transaction[]>;
declare const getAddressDollarTransactions: (address: string, count?: number) => Promise<Transaction[]>;
declare const getNairaTransactions: (count?: number) => Promise<Transaction[]>;
declare const getAddressNairaTransactions: (address: string, count?: number) => Promise<Transaction[]>;
declare const getEuroTransactions: (count?: number) => Promise<Transaction[]>;
declare const getAddressEuroTransactions: (address: string, count?: number) => Promise<Transaction[]>;
declare const getPoundTransactions: (count?: number) => Promise<Transaction[]>;
declare const getAddressPoundTransactions: (address: string, count?: number) => Promise<Transaction[]>;
declare const getKSHTransactions: (count?: number) => Promise<Transaction[]>;
declare const getAddressKSHTransactions: (address: string, count?: number) => Promise<Transaction[]>;
declare const getZARTransactions: (count?: number) => Promise<Transaction[]>;
declare const getAddressZARTransactions: (address: string, count?: number) => Promise<Transaction[]>;
declare const getTransactionsByRange: (start?: number, end?: number) => Promise<Transaction[]>;
declare const getExchangeRates: () => Promise<ExchangeRate[]>;
declare const isValidAddress: (address: string) => Promise<boolean>;

interface DepositInput {
    userAddress: string;
    username: string;
    amount: string;
    currency: string;
    /** Admin credentials — route through your backend proxy in production */
    admin: string;
    adminpwd: string;
    extras?: {
        payeraddress?: string;
        payercity?: string;
        payerstate?: string;
        payercountry?: string;
        payerzipcode?: string;
        payerphone?: string;
        description?: string;
        success_url?: string;
        cancel_url?: string;
        paymenttype?: string;
        feetype?: string;
        exchange?: string;
        reusewallet?: string;
    };
}
interface KYCInput {
    firstName: string;
    middleName?: string;
    lastName: string;
    bvn: string;
    currency: string;
    phoneNumber: string;
    dob: string;
    address: string;
    admin: string;
    adminpwd: string;
}
interface FiatWithdrawalInput {
    address: string;
    password: string;
    currency: string;
    token: string;
    payername: string;
    payeremail: string;
    description: string;
    amount: string;
    accounttype: string;
    bankname: string;
    routingno: string;
    accountno: string;
    accountname: string;
    admin: string;
    adminpwd: string;
}
interface FiatTxRangeInput {
    address: string;
    startDate: string;
    endDate: string;
    currency: string;
    admin: string;
    adminpwd: string;
}
interface CryptoPaymentInput {
    address: string;
    pwd: string;
    currency: string;
    token: string;
    amount: string;
    paymenttype?: string;
    admin: string;
    adminpwd: string;
}
declare const initiateDeposit: (input: DepositInput) => Promise<any>;
declare const confirmFiatDeposit: (currency: string, transactionId: string) => Promise<boolean>;
declare const performKYC: (input: KYCInput) => Promise<boolean>;
declare const checkKYCStatus: (address: string) => Promise<boolean>;
declare const getBankListUSD: (admin: string, adminpwd: string) => Promise<any[]>;
declare const getBankListNGN: (admin: string, adminpwd: string) => Promise<any[]>;
declare const recordWithdrawal: (input: FiatWithdrawalInput) => Promise<any>;
declare const verifyBankAccountNGN: (destinationInstitutionCode: string, accountNumber: string, admin: string, adminpwd: string) => Promise<any>;
declare const getFiatTransactions: (input: FiatTxRangeInput) => Promise<any[]>;
declare const getFiatWithdrawals: (input: FiatTxRangeInput) => Promise<any[]>;
declare const initializeCryptoPayment: (input: CryptoPaymentInput) => Promise<any>;
declare const recordCryptoPayment: (currency: string, txid: string, admin: string, adminpwd: string) => Promise<any>;

interface VirtualWallet {
    virtualwallet?: string;
    address?: string;
    payername?: string;
    currency?: string;
    [key: string]: any;
}
interface CreateVirtualWalletInput {
    address: string;
    payername: string;
    currency: string;
    /** Admin credentials — route through your backend proxy in production */
    admin: string;
    adminpwd: string;
}
declare const createVirtualWallet: (input: CreateVirtualWalletInput) => Promise<VirtualWallet>;
declare const fetchVirtualWallet: (virtualwallet: string, admin: string, adminpwd: string) => Promise<VirtualWallet>;
declare const fetchVirtualWalletByAddress: (address: string, admin: string, adminpwd: string) => Promise<VirtualWallet>;
declare const updateVirtualWalletTransactions: (walletaddress: string, admin: string, adminpwd: string) => Promise<any>;

interface BridgeBalanceParams {
    address: string;
}
interface BridgeTokenBalanceParams {
    address: string;
    contractaddress: string;
    tokenname?: string;
}
interface BridgeTransactionParams {
    address: string;
}
interface BridgeTokenTransactionParams {
    address: string;
    contractaddress: string;
}
interface BridgeTransferParams {
    from: string;
    pwd: string;
    network: BridgeNetwork;
    contractaddress: string;
    tokenname: string;
    amount: string;
}
interface BridgeFeeParams {
    network: BridgeNetwork;
    contractaddress: string;
    amount: string;
}
interface SolTransferParams {
    from: string;
    to: string;
    amount: string;
    pwd: string;
}
interface SolTokenTransferParams {
    from: string;
    to: string;
    amount: string;
    pwd: string;
    contractaddress: string;
    tokenname: string;
    usetokenasfees?: string;
}
declare const getBridgeChainBalance: (network: BridgeNetwork, params: BridgeBalanceParams, admin?: string, adminpwd?: string) => Promise<any>;
declare const getBridgeChainTokenBalance: (network: BridgeNetwork, params: BridgeTokenBalanceParams, admin?: string, adminpwd?: string) => Promise<any>;
declare const getBridgeChainTransactions: (network: BridgeNetwork, params: BridgeTransactionParams, admin?: string, adminpwd?: string) => Promise<any[]>;
declare const getBridgeChainTokenTransactions: (network: BridgeNetwork, params: BridgeTokenTransactionParams, admin?: string, adminpwd?: string) => Promise<any[]>;
declare const bridgeToken: (network: BridgeNetwork, params: BridgeTransferParams, admin?: string, adminpwd?: string) => Promise<any>;
declare const getBridgeFeeEstimate: (network: BridgeNetwork, params: BridgeFeeParams, admin?: string, adminpwd?: string) => Promise<any>;
declare const createSolanaAddress: (admin?: string, adminpwd?: string) => Promise<string>;
declare const isValidSolanaAddress: (address: string) => Promise<boolean>;
declare const createToronetSolanaAddress: (addr: string, pwd: string) => Promise<string>;
declare const getSolLatestBlock: () => Promise<any>;
declare const getSolBalance: (address: string) => Promise<any>;
declare const getSolTokenBalance: (address: string, contractaddress: string) => Promise<any>;
declare const getSolTransactions: (address: string) => Promise<any[]>;
declare const getSolTokenTransactions: (address: string, contractaddress: string) => Promise<any[]>;
declare const transferSolana: (params: SolTransferParams, admin?: string, adminpwd?: string) => Promise<any>;
declare const transferSolToken: (params: SolTokenTransferParams, admin?: string, adminpwd?: string) => Promise<any>;
declare const bridgeSolToken: (params: BridgeTransferParams) => Promise<any>;
declare const getSolBridgeFee: (contractaddress: string, amount: string) => Promise<any>;
declare const getBridgeBalance: (network: BridgeNetwork, params: BridgeBalanceParams, admin?: string, adminpwd?: string) => Promise<any>;
declare const getBridgeTokenBalance: (network: BridgeNetwork, params: BridgeTokenBalanceParams, admin?: string, adminpwd?: string) => Promise<any>;
declare const getBridgeTransactions: (network: BridgeNetwork, params: BridgeTransactionParams, admin?: string, adminpwd?: string) => Promise<any[]>;
declare const getBridgeTokenTransactions: (network: BridgeNetwork, params: BridgeTokenTransactionParams, admin?: string, adminpwd?: string) => Promise<any[]>;
declare const getBridgeTokenFeeEstimate: (network: BridgeNetwork, params: BridgeFeeParams, admin?: string, adminpwd?: string) => Promise<any>;
declare const bridgeTokenFromChain: (network: BridgeNetwork, params: BridgeTransferParams, admin?: string, adminpwd?: string) => Promise<any>;

declare const importWalletFromPrivateKey: (pvKey: string, password: string) => Promise<string>;
declare const getWalletKey: (address: string) => Promise<any>;
declare const updateWalletPassword: (address: string, oldPassword: string, newPassword: string) => Promise<any>;
declare const deleteWallet: (address: string, password: string) => Promise<any>;

declare const isAdmin: (address: string) => Promise<boolean>;
declare const isSuperAdmin: (address: string) => Promise<boolean>;
declare const isDebugger: (address: string) => Promise<boolean>;
declare const getAdminIndex: (address: string) => Promise<number>;
declare const getNumberOfAdmins: () => Promise<number>;
declare const getAdminByIndex: (index: number) => Promise<string>;
declare const addAdmin: (superAdminAddress: string, superAdminPassword: string, adminAddress: string) => Promise<any>;
declare const removeAdmin: (superAdminAddress: string, superAdminPassword: string, adminAddress: string) => Promise<any>;
declare const addSuperAdmin: (superAdminAddress: string, superAdminPassword: string, newSuperAdminAddress: string) => Promise<any>;

interface ProductInput {
    productId: string;
    productName: string;
    description: string;
    productImage: string;
    admin: string;
    adminpwd: string;
}
declare const getProject: (admin: string, getbalances?: boolean) => Promise<any>;
declare const getProduct: (productId: string, admin: string, adminpwd: string) => Promise<any>;
declare const createProduct: (input: ProductInput) => Promise<any>;
declare const updateProduct: (input: ProductInput) => Promise<any>;

interface DeployContractInput {
    abi: any[];
    bytecode: string;
    constructorArgs?: any[];
    owner?: string;
    /** Required for mainnet deployments — obtain from Toronet team */
    token?: string;
    /** Overrides network from SDK config */
    network?: 'testnet' | 'mainnet';
}
interface DeployContractOutput {
    address: string;
    abi: any[];
    [key: string]: any;
}
declare const deployContract: (input: DeployContractInput) => Promise<DeployContractOutput>;

type SupportedCurrency = 'NGN' | 'USD' | 'EUR' | 'GBP' | 'KSH' | 'ZAR';
interface CurrencyAdminParams {
    currency: SupportedCurrency;
    address: string;
    admin: string;
    adminpwd: string;
    targetAddress: string;
}
interface CurrencyMintParams extends CurrencyAdminParams {
    amount: string;
}
declare const getCurrencyBalance: (currency: SupportedCurrency, address: string) => Promise<string>;
declare const transferCurrencyFunds: (currency: SupportedCurrency, senderAddr: string, senderPwd: string, receiverAddr: string, amount: string) => Promise<any>;
declare const allowCurrencyTransfer: (currency: SupportedCurrency, address: string, password: string) => Promise<any>;
declare const disableCurrencyTransfer: (currency: SupportedCurrency, address: string, password: string) => Promise<any>;
declare const freezeCurrencyAddress: (params: CurrencyAdminParams) => Promise<any>;
declare const unfreezeCurrencyAddress: (params: CurrencyAdminParams) => Promise<any>;
declare const enrollCurrencyAddress: (params: CurrencyAdminParams) => Promise<any>;
declare const mintCurrencyFunds: (params: CurrencyMintParams) => Promise<any>;
declare const burnCurrencyFunds: (params: CurrencyMintParams) => Promise<any>;

declare const isStorageOn: () => Promise<any>;
declare const isContractRegistered: (contract: string) => Promise<any>;
declare const getStorageVersion: () => Promise<any>;
declare const isStorageOwner: (address: string) => Promise<any>;
declare const getStorageOwner: () => Promise<any>;
declare const setStorageOn: (address: string, password: string) => Promise<any>;
declare const setStorageOff: (address: string, password: string) => Promise<any>;
declare const registerStorageContract: (address: string, password: string, contract: string) => Promise<any>;
declare const unregisterStorageContract: (address: string, password: string, contract: string) => Promise<any>;
declare const increaseStorageVersion: (address: string, password: string) => Promise<any>;
declare const decreaseStorageVersion: (address: string, password: string) => Promise<any>;
declare const setStorageVersion: (address: string, password: string, version: string | number) => Promise<any>;
declare const transferStorageOwnership: (address: string, password: string, newOwner: string) => Promise<any>;

interface SwapQuoteParams {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
}
interface SwapRateOutput {
    fromCurrency?: string;
    toCurrency?: string;
    amount?: number;
    rate?: number;
    convertedAmount?: number;
    [key: string]: unknown;
}
interface SwapExecuteParams {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    client: string;
    clientPassword?: string;
}
declare const getSwapQuote: (params: SwapQuoteParams) => Promise<SwapRateOutput>;
declare const swapCurrency: (params: SwapExecuteParams) => Promise<any>;

export { type AddressTransactionsRangeParams, type Balances, type Block, type BlockchainStatus, type BridgeBalanceParams, type BridgeFeeParams, type BridgeTokenBalanceParams, type BridgeTokenTransactionParams, type BridgeTransactionParams, type BridgeTransferParams, type CreateVirtualWalletInput, type CryptoPaymentInput, type CurrencyAdminParams, type CurrencyMintParams, type DeployContractInput, type DeployContractOutput, type DepositInput, type ExchangeRate, type FiatTxRangeInput, type FiatWithdrawalInput, type KYCInput, type NetworkType, type ProductInput, type SolTokenTransferParams, type SolTransferParams, type SupportedCurrency, type SwapExecuteParams, type SwapQuoteParams, type SwapRateOutput, ToroError, type ToroforgeConfig, type Transaction, type VirtualWallet, addAdmin, addSuperAdmin, allowCurrencyTransfer, bridgeSolToken, bridgeToken, bridgeTokenFromChain, burnCurrencyFunds, checkKYCStatus, confirmFiatDeposit, createProduct, createSolanaAddress, createToronetSolanaAddress, createVirtualWallet, createWallet, decreaseStorageVersion, deleteTNSName, deleteWallet, deployContract, disableCurrencyTransfer, enrollCurrencyAddress, fetchVirtualWallet, fetchVirtualWalletByAddress, formatToroAmount, formatToroCurrency, formatToroTransaction, freezeCurrencyAddress, fromWei, getAddressBalanceAdapter, getAddressDollarTransactions, getAddressEuroTransactions, getAddressKSHTransactions, getAddressNairaTransactions, getAddressPoundTransactions, getAddressRoleAdapter, getAddressToroTransactions, getAddressTransactionsAdapter, getAddressTransactionsRange, getAddressZARTransactions, getAdminByIndex, getAdminIndex, getBalance, getBankListNGN, getBankListUSD, getBlockByIdAdapter, getBlockchainInfo, getBlocks, getBridgeBalance, getBridgeChainBalance, getBridgeChainTokenBalance, getBridgeChainTokenTransactions, getBridgeChainTransactions, getBridgeFeeEstimate, getBridgeTokenBalance, getBridgeTokenFeeEstimate, getBridgeTokenTransactions, getBridgeTransactions, getChainStatus, getChainTransactions, getConfig, getCurrencyBalance, getDollarTransactions, getEuroTransactions, getEventByIdAdapter, getExchangeRates, getFiatTransactions, getFiatWithdrawals, getKSHTransactions, getLatestBlock, getMaximumTokenAllowance, getMinimumTokenAllowance, getNairaTransactions, getNumberOfAdmins, getPoundTransactions, getProduct, getProject, getSolBalance, getSolBridgeFee, getSolLatestBlock, getSolTokenBalance, getSolTokenTransactions, getSolTransactions, getStorageOwner, getStorageVersion, getSwapQuote, getTokenAllowance, getTokenBalance, getTokenMetadata, getTokenTotalCap, getTokenTransactionFee, getToroTransactions, getTransactionByHash, getTransactionByHashAdapter, getTransactionReceipt, getTransactions, getTransactionsByRange, getWalletKey, getZARTransactions, importWalletFromPrivateKey, importWalletFromPrivateKeyAndPassword, increaseStorageVersion, initToroforge, initializeCryptoPayment, initiateDeposit, isAdmin, isContractRegistered, isDebugger, isStorageOn, isStorageOwner, isSuperAdmin, isTNSAvailable, isTokenEnrolled, isTokenFrozen, isValidAddress, isValidSolanaAddress, lookupTNS, lookupTNSAddress, mintCurrencyFunds, normalizeError, parseToroError, performKYC, recordCryptoPayment, recordWithdrawal, registerStorageContract, registerTNS, removeAdmin, resolveTNS, resolveTNSName, sendTransaction, setStorageOff, setStorageOn, setStorageVersion, setTNS, shortenAddress, swapCurrency, toWei, transferCurrencyFunds, transferSolToken, transferSolana, transferStorageOwnership, unfreezeCurrencyAddress, unregisterStorageContract, updateProduct, updateTNSName, updateVirtualWalletTransactions, updateWalletPassword, validateToroAddress, verifyBankAccountNGN, verifyWalletPassword };
