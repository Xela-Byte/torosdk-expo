import { useState, useCallback } from 'react';
import { deployContract, DeployContractInput, DeployContractOutput } from '@reactforge/sdk-adapter';

// ── useToroDeployContract ──────────────────────────────────────────────────

export interface UseToroDeployContractResult {
  data: DeployContractOutput | null;
  loading: boolean;
  error: Error | null;
  deploy: (input: DeployContractInput) => Promise<DeployContractOutput | null>;
}

/** Provides functionality to deploy a smart contract via Toronet Deployer service. */
export const useToroDeployContract = (): UseToroDeployContractResult => {
  const [data, setData] = useState<DeployContractOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deploy = useCallback(async (input: DeployContractInput): Promise<DeployContractOutput | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await deployContract(input);
      setData(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, deploy };
};
