import { deploySmartContract as sdkDeploySmartContract } from 'torosdk';
import { normalizeError } from './errors';

// ── Types ──────────────────────────────────────────────────────────────────

export interface DeployContractInput {
  abi: any[];
  bytecode: string;
  constructorArgs?: any[];
  owner?: string;
  /** Required for mainnet deployments — obtain from Toronet team */
  token?: string;
  /** Overrides network from SDK config */
  network?: 'testnet' | 'mainnet';
}

export interface DeployContractOutput {
  address: string;
  abi: any[];
  [key: string]: any;
}

// ── Deployer ──────────────────────────────────────────────────────────────

export const deployContract = async (input: DeployContractInput): Promise<DeployContractOutput> => {
  try {
    return await sdkDeploySmartContract({
      abi: input.abi,
      bytecode: input.bytecode,
      constructorArgs: input.constructorArgs ?? [],
      owner: input.owner ?? '',
      token: input.token,
      network: input.network,
    });
  } catch (error) {
    throw normalizeError(error, 'deployContract');
  }
};
