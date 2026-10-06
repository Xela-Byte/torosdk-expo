import { getBalance as sdkGetBalance } from 'torosdk';
import { normalizeError } from './errors';

export interface Balances {
  ngnBalance: string;
  usdBalance: string;
  toroGBalance: string;
  kshBalance: string;
}

export const getBalance = async (address: string): Promise<Balances> => {
  try {
    const rawBalance = await sdkGetBalance({ address }) as any;
    return {
      ngnBalance: rawBalance.ngnBalance?.toString() || "0",
      usdBalance: rawBalance.usdBalance?.toString() || "0",
      toroGBalance: rawBalance.toroGBalance?.toString() || "0",
      kshBalance: rawBalance.kshBalance?.toString() || "0",
    };
  } catch (error) {
    throw normalizeError(error, 'getBalance');
  }
};
