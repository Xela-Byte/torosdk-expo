import { getName as sdkGetName, getAddr as sdkGetAddr, updateName as sdkUpdateName, deleteName as sdkDeleteName } from 'torosdk';
import { normalizeError } from './errors';

export const resolveTNSName = async (name: string): Promise<string | null> => {
  try {
    const address = await sdkGetAddr({ name });
    return address || null;
  } catch (error) {
    throw normalizeError(error, 'resolveTNSName');
  }
};

export const lookupTNSAddress = async (address: string): Promise<string | null> => {
  try {
    const name = await sdkGetName({ address });
    return name || null;
  } catch (error) {
    throw normalizeError(error, 'lookupTNSAddress');
  }
};

export const updateTNSName = async (address: string, password: string, username: string): Promise<any> => {
  try {
    return await sdkUpdateName({ address, password, username });
  } catch (error) {
    throw normalizeError(error, 'updateTNSName');
  }
};

export const deleteTNSName = async (address: string, password: string): Promise<any> => {
  try {
    return await sdkDeleteName({ address, password });
  } catch (error) {
    throw normalizeError(error, 'deleteTNSName');
  }
};

export const resolveTNS = resolveTNSName;
export const lookupTNS = lookupTNSAddress;
export const setTNS = updateTNSName;
export const registerTNS = updateTNSName;

