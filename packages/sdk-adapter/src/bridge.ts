import {
  getBridgeBalance as sdkGetBridgeBalance,
  getBridgeTokenBalance as sdkGetBridgeTokenBalance,
  getBridgeTransactions as sdkGetBridgeTransactions,
  getBridgeTokenTransactions as sdkGetBridgeTokenTransactions,
  bridgeTokenFromChain as sdkBridgeTokenFromChain,
  getBridgeTokenFeeEstimate as sdkGetBridgeTokenFeeEstimate,
  createSolanaAddress as sdkCreateSolanaAddress,
  isValidSolanaAddress as sdkIsValidSolanaAddress,
  createToronetSolanaAddress as sdkCreateToronetSolanaAddress,
  getSolLatestBlock as sdkGetSolLatestBlock,
  getSolBalance as sdkGetSolBalance,
  getSolTokenBalance as sdkGetSolTokenBalance,
  getSolTransactions as sdkGetSolTransactions,
  getSolTokenTransactions as sdkGetSolTokenTransactions,
  transferSolana as sdkTransferSolana,
  transferSolToken as sdkTransferSolToken,
  bridgeTokenSol as sdkBridgeTokenSol,
  getBridgeTokenFeeSol as sdkGetBridgeTokenFeeSol,
  BridgeNetwork,
} from 'torosdk';
import { normalizeError } from './errors';

export { BridgeNetwork };

// ── Types ──────────────────────────────────────────────────────────────────

export interface BridgeBalanceParams {
  address: string;
}

export interface BridgeTokenBalanceParams {
  address: string;
  contractaddress: string;
  tokenname?: string;
}

export interface BridgeTransactionParams {
  address: string;
}

export interface BridgeTokenTransactionParams {
  address: string;
  contractaddress: string;
}

export interface BridgeTransferParams {
  from: string;
  pwd: string;
  network: BridgeNetwork;
  contractaddress: string;
  tokenname: string;
  amount: string;
}

export interface BridgeFeeParams {
  network: BridgeNetwork;
  contractaddress: string;
  amount: string;
}

export interface SolTransferParams {
  from: string;
  to: string;
  amount: string;
  pwd: string;
}

export interface SolTokenTransferParams {
  from: string;
  to: string;
  amount: string;
  pwd: string;
  contractaddress: string;
  tokenname: string;
  usetokenasfees?: string;
}

// ── Generic Bridge Operations ─────────────────────────────────────────────

export const getBridgeChainBalance = async (
  network: BridgeNetwork,
  params: BridgeBalanceParams,
  admin?: string,
  adminpwd?: string
): Promise<any> => {
  try {
    return admin
      ? await sdkGetBridgeBalance(network, params, admin, adminpwd)
      : await sdkGetBridgeBalance(network, params);
  } catch (error) {
    throw normalizeError(error, 'getBridgeChainBalance');
  }
};

export const getBridgeChainTokenBalance = async (
  network: BridgeNetwork,
  params: BridgeTokenBalanceParams,
  admin?: string,
  adminpwd?: string
): Promise<any> => {
  try {
    return admin
      ? await sdkGetBridgeTokenBalance(network, params, admin, adminpwd)
      : await sdkGetBridgeTokenBalance(network, params);
  } catch (error) {
    throw normalizeError(error, 'getBridgeChainTokenBalance');
  }
};

export const getBridgeChainTransactions = async (
  network: BridgeNetwork,
  params: BridgeTransactionParams,
  admin?: string,
  adminpwd?: string
): Promise<any[]> => {
  try {
    return admin
      ? await sdkGetBridgeTransactions(network, params, admin, adminpwd)
      : await sdkGetBridgeTransactions(network, params);
  } catch (error) {
    throw normalizeError(error, 'getBridgeChainTransactions');
  }
};

export const getBridgeChainTokenTransactions = async (
  network: BridgeNetwork,
  params: BridgeTokenTransactionParams,
  admin?: string,
  adminpwd?: string
): Promise<any[]> => {
  try {
    return admin
      ? await sdkGetBridgeTokenTransactions(network, params, admin, adminpwd)
      : await sdkGetBridgeTokenTransactions(network, params);
  } catch (error) {
    throw normalizeError(error, 'getBridgeChainTokenTransactions');
  }
};

export const bridgeToken = async (
  network: BridgeNetwork,
  params: BridgeTransferParams,
  admin?: string,
  adminpwd?: string
): Promise<any> => {
  try {
    return admin
      ? await sdkBridgeTokenFromChain(network, params, admin, adminpwd)
      : await sdkBridgeTokenFromChain(network, params);
  } catch (error) {
    throw normalizeError(error, 'bridgeToken');
  }
};

export const getBridgeFeeEstimate = async (
  network: BridgeNetwork,
  params: BridgeFeeParams,
  admin?: string,
  adminpwd?: string
): Promise<any> => {
  try {
    return admin
      ? await sdkGetBridgeTokenFeeEstimate(network, params, admin, adminpwd)
      : await sdkGetBridgeTokenFeeEstimate(network, params);
  } catch (error) {
    throw normalizeError(error, 'getBridgeFeeEstimate');
  }
};


// ── Solana-Specific Operations ────────────────────────────────────────────

export const createSolanaAddress = async (admin?: string, adminpwd?: string): Promise<string> => {
  try {
    return await sdkCreateSolanaAddress({ admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, 'createSolanaAddress');
  }
};

export const isValidSolanaAddress = async (address: string): Promise<boolean> => {
  try {
    return await sdkIsValidSolanaAddress(address);
  } catch (error) {
    throw normalizeError(error, 'isValidSolanaAddress');
  }
};

export const createToronetSolanaAddress = async (addr: string, pwd: string): Promise<string> => {
  try {
    return await sdkCreateToronetSolanaAddress({ addr, pwd });
  } catch (error) {
    throw normalizeError(error, 'createToronetSolanaAddress');
  }
};

export const getSolLatestBlock = async (): Promise<any> => {
  try {
    return await sdkGetSolLatestBlock();
  } catch (error) {
    throw normalizeError(error, 'getSolLatestBlock');
  }
};

export const getSolBalance = async (address: string): Promise<any> => {
  try {
    return await sdkGetSolBalance({ address });
  } catch (error) {
    throw normalizeError(error, 'getSolBalance');
  }
};

export const getSolTokenBalance = async (address: string, contractaddress: string): Promise<any> => {
  try {
    return await sdkGetSolTokenBalance({ address, contractaddress });
  } catch (error) {
    throw normalizeError(error, 'getSolTokenBalance');
  }
};

export const getSolTransactions = async (address: string): Promise<any[]> => {
  try {
    return await sdkGetSolTransactions({ address });
  } catch (error) {
    throw normalizeError(error, 'getSolTransactions');
  }
};

export const getSolTokenTransactions = async (address: string, contractaddress: string): Promise<any[]> => {
  try {
    return await sdkGetSolTokenTransactions({ address, contractaddress });
  } catch (error) {
    throw normalizeError(error, 'getSolTokenTransactions');
  }
};

export const transferSolana = async (
  params: SolTransferParams,
  admin?: string,
  adminpwd?: string
): Promise<any> => {
  try {
    return await sdkTransferSolana(params, admin, adminpwd);
  } catch (error) {
    throw normalizeError(error, 'transferSolana');
  }
};

export const transferSolToken = async (
  params: SolTokenTransferParams,
  admin?: string,
  adminpwd?: string
): Promise<any> => {
  try {
    return await sdkTransferSolToken(params, admin, adminpwd);
  } catch (error) {
    throw normalizeError(error, 'transferSolToken');
  }
};

export const bridgeSolToken = async (params: BridgeTransferParams): Promise<any> => {
  try {
    return await sdkBridgeTokenSol(params);
  } catch (error) {
    throw normalizeError(error, 'bridgeSolToken');
  }
};

export const getSolBridgeFee = async (contractaddress: string, amount: string): Promise<any> => {
  try {
    return await sdkGetBridgeTokenFeeSol({ network: BridgeNetwork.Solana, contractaddress, amount });
  } catch (error) {
    throw normalizeError(error, 'getSolBridgeFee');
  }
};

export const getBridgeBalance = getBridgeChainBalance;
export const getBridgeTokenBalance = getBridgeChainTokenBalance;
export const getBridgeTransactions = getBridgeChainTransactions;
export const getBridgeTokenTransactions = getBridgeChainTokenTransactions;
export const getBridgeTokenFeeEstimate = getBridgeFeeEstimate;
export const bridgeTokenFromChain = bridgeToken;

