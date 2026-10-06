import { useState, useEffect, useCallback } from 'react';
import { getWalletKey, importWalletFromPrivateKey, updateWalletPassword, deleteWallet, verifyWalletPassword, ToroError } from '@reactforge/sdk-adapter';
import { useToroContext } from '../provider';

export interface WalletKeyData {
  key: any;
  address: string;
}

export interface UseToroWalletResult {
  data: WalletKeyData | null;
  loading: boolean;
  error: ToroError | Error | null;
  refetch: () => Promise<void>;
}

/** Read the wallet key data for the active address (or a given address). */
export const useToroWallet = (address?: string | null): UseToroWalletResult => {
  const { activeAddress } = useToroContext();
  const targetAddress = address || activeAddress;

  const [data, setData] = useState<WalletKeyData | null>(null);
  const [loading, setLoading] = useState(!!targetAddress);
  const [error, setError] = useState<ToroError | Error | null>(null);

  const fetchWallet = useCallback(async () => {
    if (!targetAddress) return;
    setLoading(true);
    setError(null);
    try {
      const key = await getWalletKey(targetAddress);
      setData({ key, address: targetAddress });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);

  useEffect(() => { fetchWallet(); }, [fetchWallet]);

  return { data, loading, error, refetch: fetchWallet };
};

// ── Import Wallet Mutation ─────────────────────────────────────────────────

export interface UseToroImportWalletResult {
  address: string | null;
  loading: boolean;
  error: Error | null;
  importWallet: (privateKey: string, password: string) => Promise<string | null>;
}

export const useToroImportWallet = (): UseToroImportWalletResult => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const importWallet = useCallback(async (privateKey: string, password: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await importWalletFromPrivateKey(privateKey, password);
      setAddress(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { address, loading, error, importWallet };
};

// ── Update Password Mutation ───────────────────────────────────────────────

export interface UseToroUpdatePasswordResult {
  loading: boolean;
  error: Error | null;
  success: boolean;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

export const useToroUpdatePassword = (): UseToroUpdatePasswordResult => {
  const { activeAddress } = useToroContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const updatePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!activeAddress) throw new Error('No active wallet address in context.');
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await updateWalletPassword(activeAddress, oldPassword, newPassword);
      setSuccess(true);
      return true;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeAddress]);

  return { loading, error, success, updatePassword };
};

// ── Delete Wallet Mutation ─────────────────────────────────────────────────

export interface UseToroDeleteWalletResult {
  loading: boolean;
  error: Error | null;
  success: boolean;
  deleteWalletAccount: (password: string) => Promise<boolean>;
}

export const useToroDeleteWallet = (): UseToroDeleteWalletResult => {
  const { activeAddress } = useToroContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteWalletAccount = useCallback(async (password: string): Promise<boolean> => {
    if (!activeAddress) throw new Error('No active wallet address in context.');
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await deleteWallet(activeAddress, password);
      setSuccess(true);
      return true;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeAddress]);

  return { loading, error, success, deleteWalletAccount };
};

// ── Verify Password Mutation ───────────────────────────────────────────────

export interface UseToroVerifyPasswordResult {
  loading: boolean;
  error: Error | null;
  isValid: boolean | null;
  verify: (address: string, password: string) => Promise<boolean | null>;
}

/** Verify that a password matches the stored credential for a wallet address. */
export const useToroVerifyPassword = (): UseToroVerifyPasswordResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const verify = useCallback(async (address: string, password: string): Promise<boolean | null> => {
    setLoading(true);
    setError(null);
    setIsValid(null);
    try {
      const result = await verifyWalletPassword(address, password);
      setIsValid(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, isValid, verify };
};
