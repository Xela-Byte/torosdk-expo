import { useState, useCallback } from 'react';
import { 
  allowCurrencyTransfer, disableCurrencyTransfer, freezeCurrencyAddress, unfreezeCurrencyAddress, 
  enrollCurrencyAddress, mintCurrencyFunds, burnCurrencyFunds 
} from '@reactforge/sdk-adapter';

export const useToroCurrencyAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async <T>(actionFn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await actionFn();
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    allowCurrencyTransfer: (currency: string, address: string, password: string) => execute(() => allowCurrencyTransfer(currency as any, address, password)),
    disableCurrencyTransfer: (currency: string, address: string, password: string) => execute(() => disableCurrencyTransfer(currency as any, address, password)),
    freezeCurrencyAddress: (params: any) => execute(() => freezeCurrencyAddress(params)),
    unfreezeCurrencyAddress: (params: any) => execute(() => unfreezeCurrencyAddress(params)),
    enrollCurrencyAddress: (params: any) => execute(() => enrollCurrencyAddress(params)),
    mintCurrencyFunds: (params: any) => execute(() => mintCurrencyFunds(params)),
    burnCurrencyFunds: (params: any) => execute(() => burnCurrencyFunds(params)),
  };
};
