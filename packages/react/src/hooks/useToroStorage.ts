import { useState, useCallback, useEffect } from 'react';
import {
  isStorageOn,
  getStorageVersion,
  isContractRegistered,
  getStorageOwner,
  isStorageOwner,
  setStorageOn,
  setStorageOff,
  registerStorageContract,
  unregisterStorageContract,
  increaseStorageVersion,
  decreaseStorageVersion,
  setStorageVersion,
  transferStorageOwnership
} from '@reactforge/sdk-adapter';
import { useToroContext } from '../provider';

// ── useToroStorageQuery ────────────────────────────────────────────────────

export interface UseToroStorageQueryResult {
  isOn: any | null;
  version: any | null;
  owner: any | null;
  loading: boolean;
  error: Error | null;
  checkContract: (contract: string) => Promise<any>;
  checkIfOwner: (address: string) => Promise<any>;
  refetch: () => Promise<void>;
}

export const useToroStorageQuery = (): UseToroStorageQueryResult => {
  const [isOn, setIsOn] = useState<any | null>(null);
  const [version, setVersion] = useState<any | null>(null);
  const [owner, setOwner] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [onRes, verRes, ownerRes] = await Promise.allSettled([
        isStorageOn(),
        getStorageVersion(),
        getStorageOwner()
      ]);
      if (onRes.status === 'fulfilled') setIsOn(onRes.value);
      if (verRes.status === 'fulfilled') setVersion(verRes.value);
      if (ownerRes.status === 'fulfilled') setOwner(ownerRes.value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const checkContract = useCallback(async (contract: string) => {
    return await isContractRegistered(contract);
  }, []);

  const checkIfOwner = useCallback(async (address: string) => {
    return await isStorageOwner(address);
  }, []);

  return { isOn, version, owner, loading, error, checkContract, checkIfOwner, refetch: fetch };
};

// ── useToroStorageMutation ─────────────────────────────────────────────────

export const useToroStorageMutation = () => {
  const { activeAddress } = useToroContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const wrapMutation = useCallback(<T extends (...args: any[]) => Promise<any>>(mutation: T) => {
    return async (...args: Parameters<T>): Promise<any> => {
      setLoading(true);
      setError(null);
      try {
        return await mutation(...args);
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    };
  }, []);

  return {
    loading,
    error,
    turnOn: wrapMutation(async (pwd: string) => setStorageOn(activeAddress!, pwd)),
    turnOff: wrapMutation(async (pwd: string) => setStorageOff(activeAddress!, pwd)),
    registerContract: wrapMutation(async (pwd: string, contract: string) => registerStorageContract(activeAddress!, pwd, contract)),
    unregisterContract: wrapMutation(async (pwd: string, contract: string) => unregisterStorageContract(activeAddress!, pwd, contract)),
    increaseVersion: wrapMutation(async (pwd: string) => increaseStorageVersion(activeAddress!, pwd)),
    decreaseVersion: wrapMutation(async (pwd: string) => decreaseStorageVersion(activeAddress!, pwd)),
    setVersion: wrapMutation(async (pwd: string, version: string | number) => setStorageVersion(activeAddress!, pwd, version)),
    transferOwnership: wrapMutation(async (pwd: string, newOwner: string) => transferStorageOwnership(activeAddress!, pwd, newOwner))
  };
};
