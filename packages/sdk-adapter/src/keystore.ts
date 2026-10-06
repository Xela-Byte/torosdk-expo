import {
  importWalletFromPrivateKeyAndPassword as sdkImportWallet,
  getWalletKey as sdkGetWalletKey,
  updatePassword as sdkUpdatePassword,
  deleteWallet as sdkDeleteWallet,
} from 'torosdk';
import { normalizeError } from './errors';

// ── Keystore Operations ────────────────────────────────────────────────────

export const importWalletFromPrivateKey = async (pvKey: string, password: string): Promise<string> => {
  try {
    return await sdkImportWallet({ pvKey, password });
  } catch (error) {
    throw normalizeError(error, 'importWalletFromPrivateKey');
  }
};

export const getWalletKey = async (address: string): Promise<any> => {
  try {
    return await sdkGetWalletKey({ address });
  } catch (error) {
    throw normalizeError(error, 'getWalletKey');
  }
};

export const updateWalletPassword = async (
  address: string,
  oldPassword: string,
  newPassword: string
): Promise<any> => {
  try {
    return await sdkUpdatePassword({ address, oldPassword, newPassword });
  } catch (error) {
    throw normalizeError(error, 'updateWalletPassword');
  }
};

export const deleteWallet = async (address: string, password: string): Promise<any> => {
  try {
    return await sdkDeleteWallet({ address, password });
  } catch (error) {
    throw normalizeError(error, 'deleteWallet');
  }
};
