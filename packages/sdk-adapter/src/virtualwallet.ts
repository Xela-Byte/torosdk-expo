import {
  createVirtualWallet as sdkCreateVirtualWallet,
  fetchVirtualWallet as sdkFetchVirtualWallet,
  fetchVirtualWalletByAddress as sdkFetchVirtualWalletByAddress,
  updateVirtualWalletTxs as sdkUpdateVirtualWalletTxs,
} from 'torosdk';
import { normalizeError } from './errors';

// ── Types ──────────────────────────────────────────────────────────────────

export interface VirtualWallet {
  virtualwallet?: string;
  address?: string;
  payername?: string;
  currency?: string;
  [key: string]: any;
}

export interface CreateVirtualWalletInput {
  address: string;
  payername: string;
  currency: string;
  /** Admin credentials — route through your backend proxy in production */
  admin: string;
  adminpwd: string;
}

// ── Virtual Wallet Operations ──────────────────────────────────────────────

export const createVirtualWallet = async (input: CreateVirtualWalletInput): Promise<VirtualWallet> => {
  try {
    return await sdkCreateVirtualWallet(input);
  } catch (error) {
    throw normalizeError(error, 'createVirtualWallet');
  }
};

export const fetchVirtualWallet = async (
  virtualwallet: string,
  admin: string,
  adminpwd: string
): Promise<VirtualWallet> => {
  try {
    return await sdkFetchVirtualWallet({ virtualwallet, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, 'fetchVirtualWallet');
  }
};

export const fetchVirtualWalletByAddress = async (
  address: string,
  admin: string,
  adminpwd: string
): Promise<VirtualWallet> => {
  try {
    return await sdkFetchVirtualWalletByAddress({ address, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, 'fetchVirtualWalletByAddress');
  }
};

export const updateVirtualWalletTransactions = async (
  walletaddress: string,
  admin: string,
  adminpwd: string
): Promise<any> => {
  try {
    return await sdkUpdateVirtualWalletTxs({ walletaddress, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, 'updateVirtualWalletTransactions');
  }
};
