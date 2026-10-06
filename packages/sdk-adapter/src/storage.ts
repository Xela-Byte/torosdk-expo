import {
  isStorageOn as sdkIsStorageOn,
  isContractRegistered as sdkIsContractRegistered,
  getStorageVersion as sdkGetStorageVersion,
  isOwner as sdkIsOwner,
  getOwner as sdkGetOwner,
  setStorageOn as sdkSetStorageOn,
  setStorageOff as sdkSetStorageOff,
  registerContract as sdkRegisterContract,
  unregisterContract as sdkUnregisterContract,
  increaseStorageVersion as sdkIncreaseStorageVersion,
  decreaseStorageVersion as sdkDecreaseStorageVersion,
  setStorageVersion as sdkSetStorageVersion,
  transferOwnership as sdkTransferOwnership,
} from 'torosdk';
import { normalizeError } from './errors';

// ── Query Operations ───────────────────────────────────────────────────────

export const isStorageOn = async (): Promise<any> => {
  try {
    return await sdkIsStorageOn();
  } catch (error) {
    throw normalizeError(error, 'isStorageOn');
  }
};

export const isContractRegistered = async (contract: string): Promise<any> => {
  try {
    return await sdkIsContractRegistered({ contract });
  } catch (error) {
    throw normalizeError(error, 'isContractRegistered');
  }
};

export const getStorageVersion = async (): Promise<any> => {
  try {
    return await sdkGetStorageVersion();
  } catch (error) {
    throw normalizeError(error, 'getStorageVersion');
  }
};

export const isStorageOwner = async (address: string): Promise<any> => {
  try {
    return await sdkIsOwner({ address });
  } catch (error) {
    throw normalizeError(error, 'isStorageOwner');
  }
};

export const getStorageOwner = async (): Promise<any> => {
  try {
    return await sdkGetOwner();
  } catch (error) {
    throw normalizeError(error, 'getStorageOwner');
  }
};

// ── Owner Mutations ────────────────────────────────────────────────────────

export const setStorageOn = async (address: string, password: string): Promise<any> => {
  try {
    return await sdkSetStorageOn({ address, password });
  } catch (error) {
    throw normalizeError(error, 'setStorageOn');
  }
};

export const setStorageOff = async (address: string, password: string): Promise<any> => {
  try {
    return await sdkSetStorageOff({ address, password });
  } catch (error) {
    throw normalizeError(error, 'setStorageOff');
  }
};

export const registerStorageContract = async (address: string, password: string, contract: string): Promise<any> => {
  try {
    return await sdkRegisterContract({ address, password, contract });
  } catch (error) {
    throw normalizeError(error, 'registerStorageContract');
  }
};

export const unregisterStorageContract = async (address: string, password: string, contract: string): Promise<any> => {
  try {
    return await sdkUnregisterContract({ address, password, contract });
  } catch (error) {
    throw normalizeError(error, 'unregisterStorageContract');
  }
};

export const increaseStorageVersion = async (address: string, password: string): Promise<any> => {
  try {
    return await sdkIncreaseStorageVersion({ address, password });
  } catch (error) {
    throw normalizeError(error, 'increaseStorageVersion');
  }
};

export const decreaseStorageVersion = async (address: string, password: string): Promise<any> => {
  try {
    return await sdkDecreaseStorageVersion({ address, password });
  } catch (error) {
    throw normalizeError(error, 'decreaseStorageVersion');
  }
};

export const setStorageVersion = async (address: string, password: string, version: string | number): Promise<any> => {
  try {
    return await sdkSetStorageVersion({ address, password, version });
  } catch (error) {
    throw normalizeError(error, 'setStorageVersion');
  }
};

export const transferStorageOwnership = async (address: string, password: string, newOwner: string): Promise<any> => {
  try {
    return await sdkTransferOwnership({ address, password, newOwner });
  } catch (error) {
    throw normalizeError(error, 'transferStorageOwnership');
  }
};
