import { useState, useCallback } from 'react';
import {
  initiateDeposit,
  confirmFiatDeposit,
  getBankListUSD,
  getBankListNGN,
  DepositInput,
} from '@reactforge/sdk-adapter';

// ── useToroPayment ─────────────────────────────────────────────────────────

export interface UseToroPaymentResult {
  loading: boolean;
  error: Error | null;
  /** Initiate a fiat deposit (admin proxied) */
  deposit: (input: DepositInput) => Promise<any>;
  /** Confirm a fiat deposit using txid */
  confirmDeposit: (currency: string, txid: string) => Promise<boolean>;
  /** Fetch the list of supported USD banks */
  getUSDBanks: (admin: string, adminpwd: string) => Promise<any[]>;
  /** Fetch the list of supported NGN banks */
  getNGNBanks: (admin: string, adminpwd: string) => Promise<any[]>;
}

/** Provides payment initialization, confirmation, and bank list queries. */
export const useToroPayment = (): UseToroPaymentResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deposit = useCallback(async (input: DepositInput): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      return await initiateDeposit(input);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmDeposit = useCallback(async (currency: string, txid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await confirmFiatDeposit(currency, txid);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUSDBanks = useCallback(async (admin: string, adminpwd: string): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      return await getBankListUSD(admin, adminpwd);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getNGNBanks = useCallback(async (admin: string, adminpwd: string): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      return await getBankListNGN(admin, adminpwd);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, deposit, confirmDeposit, getUSDBanks, getNGNBanks };
};
