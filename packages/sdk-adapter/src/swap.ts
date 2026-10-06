import * as sdk from 'torosdk';
import { normalizeError } from './errors';

export interface SwapQuoteParams {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export interface SwapRateOutput {
  fromCurrency?: string;
  toCurrency?: string;
  amount?: number;
  rate?: number;
  convertedAmount?: number;
  [key: string]: unknown;
}

export interface SwapExecuteParams {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  client: string;
  clientPassword?: string;
}

export const getSwapQuote = async (params: SwapQuoteParams): Promise<SwapRateOutput> => {
  try {
    if (typeof (sdk as any).getSwapQuote === 'function') {
      return await (sdk as any).getSwapQuote(params);
    }
    throw new Error('getSwapQuote is not supported in this environment');
  } catch (error) {
    throw normalizeError(error, 'getSwapQuote');
  }
};

export const swapCurrency = async (params: SwapExecuteParams): Promise<any> => {
  try {
    if (typeof (sdk as any).swapCurrency === 'function') {
      return await (sdk as any).swapCurrency(params);
    }
    throw new Error('swapCurrency is not supported in this environment');
  } catch (error) {
    throw normalizeError(error, 'swapCurrency');
  }
};
