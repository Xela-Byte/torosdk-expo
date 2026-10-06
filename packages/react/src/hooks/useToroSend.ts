import { useState } from 'react';
import { sendTransaction as sdkSendTransaction, ToroError } from '@reactforge/sdk-adapter';
import { useToroContext } from '../provider';

export interface SendParams {
  receiverAddr: string;
  amount: string;
  currency: string;
  senderPwd: string;
}

export const useToroSend = () => {
  const { activeAddress } = useToroContext();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ToroError | Error | null>(null);

  const sendTransaction = async (params: SendParams) => {
    if (!activeAddress) {
      throw new Error("No active wallet address available. Ensure user is logged in.");
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await sdkSendTransaction(
        params.currency,
        activeAddress,
        params.senderPwd,
        params.receiverAddr,
        params.amount
      );
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error');
      setError(errorObj);
      setLoading(false);
      throw errorObj;
    }
  };

  return { data, sendTransaction, loading, error };
};


// ======