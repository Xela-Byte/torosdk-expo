import {
  createWallet as sdkCreateWallet,
  isTNSAvailable as sdkIsTNSAvailable,
  verifyWalletPassword as sdkVerifyWalletPassword,
  importWalletFromPrivateKeyAndPassword as sdkImportWallet,
} from 'torosdk';
import { normalizeError } from './errors';

export const createWallet = async (username: string, password: string): Promise<string> => {
  try {
    return await sdkCreateWallet({ username, password });
  } catch (error) {
    throw normalizeError(error, 'createWallet');
  }
};

export const isTNSAvailable = async (username: string): Promise<boolean> => {
  try {
    return await sdkIsTNSAvailable({ username });
  } catch (error) {
    throw normalizeError(error, 'isTNSAvailable');
  }
};

export const verifyWalletPassword = async (address: string, password: string): Promise<boolean> => {
  try {
    const result = await sdkVerifyWalletPassword({ address, password });
    return Boolean(result?.valueOf());
  } catch (error) {
    throw normalizeError(error, 'verifyWalletPassword');
  }
};

export const importWalletFromPrivateKeyAndPassword = async (pvKey: string, password: string): Promise<string> => {
  try {
    const result = await sdkImportWallet({ pvKey, password });
    return typeof result === 'string' ? result : String(result);
  } catch (error) {
    throw normalizeError(error, 'importWalletFromPrivateKeyAndPassword');
  }
};

