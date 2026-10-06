"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeployContract = useDeployContract;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
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
function useDeployContract() {
    return (0, react_query_1.useMutation)({
        mutationFn: (variables) => (0, sdk_1.deployContract)(variables),
    });
}
//# sourceMappingURL=useDeployer.js.map