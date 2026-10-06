export interface DeployContractVariables {
    abi: any[];
    bytecode: string;
    constructorArgs?: any[];
    owner?: string;
    token?: string;
    network?: 'testnet' | 'mainnet';
}
/**
 * Mutation to deploy a smart contract on the Toronet network.
 *
 * @remarks
 * This is an admin-gated operation. Ensure the registered `AuthStrategy`
 * allows the `'admin'` category before calling this mutation.
 *
 * @example
 * ```tsx
 * const deploy = useDeployContract();
 * const result = await deploy.mutateAsync({ abi, bytecode });
 * console.log('Contract deployed at:', result.address);
 * ```
 */
export declare function useDeployContract(): import("@tanstack/react-query").UseMutationResult<import("../../core").ToroRawResult, Error, DeployContractVariables, unknown>;
//# sourceMappingURL=useDeployer.d.ts.map