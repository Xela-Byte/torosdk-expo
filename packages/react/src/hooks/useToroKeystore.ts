import { useState, useCallback } from 'react';
import { 
  importWalletFromPrivateKey, getWalletKey, updateWalletPassword, deleteWallet 
} from '@reactforge/sdk-adapter';

export const useToroKeystore = () => {
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
    importWalletFromPrivateKey: (pvKey: string, password: string) => 
      execute(() => importWalletFromPrivateKey(pvKey, password)),
    getWalletKey: (address: string) => 
      execute(() => getWalletKey(address)),
    updateWalletPassword: (address: string, oldPassword: string, newPassword: string) => 
      execute(() => updateWalletPassword(address, oldPassword, newPassword)),
    deleteWallet: (address: string, password: string) => 
      execute(() => deleteWallet(address, password))
  };
};
