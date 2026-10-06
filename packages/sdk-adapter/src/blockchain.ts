import {
  getBlockchainStatus,
  getLatestBlockData,
  getBlocksData,
  getBlockchainTransactions,
  getAddressRole,
  getAddressBalance,
  getBlockById,
  getTransactionByHash as getTransactionByHashSDK,
  getTransactionReceiptById,
  getEventById,
  getAddressTransactions,
  getSupportedAssetsExchangeRates,
  getAddressTransactions as getAddrTransactionsRange,
  getTransactionsToroWrapper,
  getAddressTransactionsToro,
  getTransactionsDollarWrapper,
  getAddressTransactionsDollar,
  getTransactionsNairaWrapper,
  getAddressTransactionsNaira,
  getTransactionsEuroWrapper,
  getAddressTransactionsEuro,
  getTransactionsPoundWrapper,
  getAddressTransactionsPound,
  getTransactionsKSHWrapper,
  getAddressTransactionsKSH,
  getTransactionsZARWrapper,
  getAddressTransactionsZAR,
  getTransactionsRangeWrapper,
  isAddressUtil,
} from 'torosdk';
import { normalizeError } from './errors';

// ── Types ──────────────────────────────────────────────────────────────────

export interface BlockchainStatus {
  status: string;
  [key: string]: any;
}

export interface Block {
  number: number | string;
  hash: string;
  timestamp: number | string;
  transactions?: any[];
  [key: string]: any;
}

export interface Transaction {
  hash: string;
  from?: string;
  to?: string;
  value?: string;
  currency?: string;
  blockNumber?: number | string;
  status?: string;
  [key: string]: any;
}

export interface ExchangeRate {
  currency: string;
  rate: string | number;
  [key: string]: any;
}

export interface AddressTransactionsRangeParams {
  address: string;
  startDate: string;
  endDate: string;
  token?: string;
  count?: number;
  start?: number;
}

// ── Blockchain Status & Blocks ─────────────────────────────────────────────

export const getChainStatus = async (): Promise<any> => {
  try {
    return await getBlockchainStatus();
  } catch (error) {
    throw normalizeError(error, 'getChainStatus');
  }
};

export const getBlockchainInfo = getChainStatus;

export const getLatestBlock = async (): Promise<Block> => {
  try {
    return await getLatestBlockData();
  } catch (error) {
    throw normalizeError(error, 'getLatestBlock');
  }
};

export const getBlocks = async (count: number = 10): Promise<Block[]> => {
  try {
    return await getBlocksData(count);
  } catch (error) {
    throw normalizeError(error, 'getBlocks');
  }
};

export const getChainTransactions = async (count: number = 20): Promise<Transaction[]> => {
  try {
    return await getBlockchainTransactions(count);
  } catch (error) {
    throw normalizeError(error, 'getChainTransactions');
  }
};

export const getBlockByIdAdapter = async (id: string): Promise<Block> => {
  try {
    return await getBlockById(id);
  } catch (error) {
    throw normalizeError(error, 'getBlockById');
  }
};

// ── Transaction Queries ────────────────────────────────────────────────────

export const getTransactionByHashAdapter = async (hash: string): Promise<Transaction> => {
  try {
    return await getTransactionByHashSDK(hash);
  } catch (error) {
    throw normalizeError(error, 'getTransactionByHash');
  }
};

export const getTransactionByHash = getTransactionByHashAdapter;


export const getTransactionReceipt = async (hash: string): Promise<any> => {
  try {
    return await getTransactionReceiptById(hash);
  } catch (error) {
    throw normalizeError(error, 'getTransactionReceipt');
  }
};

export const getEventByIdAdapter = async (id: string): Promise<any> => {
  try {
    return await getEventById(id);
  } catch (error) {
    throw normalizeError(error, 'getEventById');
  }
};

// ── Address Queries ────────────────────────────────────────────────────────

export const getAddressRoleAdapter = async (address: string): Promise<string> => {
  try {
    return await getAddressRole(address);
  } catch (error) {
    throw normalizeError(error, 'getAddressRole');
  }
};

export const getAddressBalanceAdapter = async (address: string): Promise<any> => {
  try {
    return await getAddressBalance({ address } as any);
  } catch (error) {
    throw normalizeError(error, 'getAddressBalance');
  }
};

export const getAddressTransactionsAdapter = async (address: string, count: number = 20): Promise<Transaction[]> => {
  try {
    return await getAddressTransactions(address, count);
  } catch (error) {
    throw normalizeError(error, 'getAddressTransactions');
  }
};

export const getAddressTransactionsRange = async (params: AddressTransactionsRangeParams): Promise<Transaction[]> => {
  try {
    return await getAddrTransactionsRange(params.address, params.count ?? 20);
  } catch (error) {
    throw normalizeError(error, 'getAddressTransactionsRange');
  }
};

// ── Currency-Filtered Transaction Queries ─────────────────────────────────

export const getToroTransactions = async (count: number = 20): Promise<Transaction[]> => {
  try {
    return await getTransactionsToroWrapper(count);
  } catch (error) {
    throw normalizeError(error, 'getToroTransactions');
  }
};

export const getAddressToroTransactions = async (address: string, count: number = 20): Promise<Transaction[]> => {
  try {
    return await getAddressTransactionsToro(address, count);
  } catch (error) {
    throw normalizeError(error, 'getAddressToroTransactions');
  }
};

export const getDollarTransactions = async (count: number = 20): Promise<Transaction[]> => {
  try {
    return await getTransactionsDollarWrapper(count);
  } catch (error) {
    throw normalizeError(error, 'getDollarTransactions');
  }
};

export const getAddressDollarTransactions = async (address: string, count: number = 20): Promise<Transaction[]> => {
  try {
    return await getAddressTransactionsDollar(address, count);
  } catch (error) {
    throw normalizeError(error, 'getAddressDollarTransactions');
  }
};

export const getNairaTransactions = async (count: number = 20): Promise<Transaction[]> => {
  try {
    return await getTransactionsNairaWrapper(count);
  } catch (error) {
    throw normalizeError(error, 'getNairaTransactions');
  }
};

export const getAddressNairaTransactions = async (address: string, count: number = 20): Promise<Transaction[]> => {
  try {
    return await getAddressTransactionsNaira(address, count);
  } catch (error) {
    throw normalizeError(error, 'getAddressNairaTransactions');
  }
};

export const getEuroTransactions = async (count: number = 20): Promise<Transaction[]> => {
  try {
    return await getTransactionsEuroWrapper(count);
  } catch (error) {
    throw normalizeError(error, 'getEuroTransactions');
  }
};

export const getAddressEuroTransactions = async (address: string, count: number = 20): Promise<Transaction[]> => {
  try {
    return await getAddressTransactionsEuro(address, count);
  } catch (error) {
    throw normalizeError(error, 'getAddressEuroTransactions');
  }
};

export const getPoundTransactions = async (count: number = 20): Promise<Transaction[]> => {
  try {
    return await getTransactionsPoundWrapper(count);
  } catch (error) {
    throw normalizeError(error, 'getPoundTransactions');
  }
};

export const getAddressPoundTransactions = async (address: string, count: number = 20): Promise<Transaction[]> => {
  try {
    return await getAddressTransactionsPound(address, count);
  } catch (error) {
    throw normalizeError(error, 'getAddressPoundTransactions');
  }
};

export const getKSHTransactions = async (count: number = 20): Promise<Transaction[]> => {
  try {
    return await getTransactionsKSHWrapper(count);
  } catch (error) {
    throw normalizeError(error, 'getKSHTransactions');
  }
};

export const getAddressKSHTransactions = async (address: string, count: number = 20): Promise<Transaction[]> => {
  try {
    return await getAddressTransactionsKSH(address, count);
  } catch (error) {
    throw normalizeError(error, 'getAddressKSHTransactions');
  }
};

export const getZARTransactions = async (count: number = 20): Promise<Transaction[]> => {
  try {
    return await getTransactionsZARWrapper(count);
  } catch (error) {
    throw normalizeError(error, 'getZARTransactions');
  }
};

export const getAddressZARTransactions = async (address: string, count: number = 20): Promise<Transaction[]> => {
  try {
    return await getAddressTransactionsZAR(address, count);
  } catch (error) {
    throw normalizeError(error, 'getAddressZARTransactions');
  }
};

export const getTransactionsByRange = async (start: number = 0, end: number = 20): Promise<Transaction[]> => {
  try {
    return await getTransactionsRangeWrapper(start, end);
  } catch (error) {
    throw normalizeError(error, 'getTransactionsByRange');
  }
};

// ── Exchange Rates ────────────────────────────────────────────────────────

export const getExchangeRates = async (): Promise<ExchangeRate[]> => {
  try {
    return await getSupportedAssetsExchangeRates();
  } catch (error) {
    throw normalizeError(error, 'getExchangeRates');
  }
};

// ── Address Utility ───────────────────────────────────────────────────────

export const isValidAddress = async (address: string): Promise<boolean> => {
  try {
    return await isAddressUtil(address);
  } catch (error) {
    throw normalizeError(error, 'isValidAddress');
  }
};
