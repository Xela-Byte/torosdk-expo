import { transferCurrency, getAddressTransactions } from 'torosdk';
import { normalizeError } from './errors';

export const sendTransaction = async (currency: string, senderAddr: string, senderPwd: string, receiverAddr: string, amount: string): Promise<any> => {
  try {
    return await transferCurrency({ currency, senderAddr, senderPwd, receiverAddr, amount });
  } catch (error) {
    throw normalizeError(error, 'sendTransaction');
  }
};

export const getTransactions = async (address: string, count: number = 20): Promise<any> => {
  try {
    return await getAddressTransactions(address, count);
  } catch (error) {
    throw normalizeError(error, 'getTransactions');
  }
};
