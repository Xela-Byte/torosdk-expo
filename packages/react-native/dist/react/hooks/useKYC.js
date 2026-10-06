"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKYCStatus = useKYCStatus;
exports.useSubmitKYC = useSubmitKYC;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
/**
 * Poll the KYC status for a wallet address.
 *
 * @remarks
 * Uses `@tanstack/react-query` with `staleTime: 5min`. Status values
 * include `"pending"`, `"approved"`, and `"rejected"`.
 *
 * @example
 * ```tsx
 * const { data: kyc, isLoading } = useKYCStatus({ address: '0xABC...' });
 * if (kyc?.status === 'approved') return <VerifiedBadge />;
 * ```
 */
function useKYCStatus({ address, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.kycStatus(address),
        queryFn: () => (0, sdk_1.getKYCStatus)(address),
        staleTime: 5 * 60000,
        enabled: enabled && !!address,
    });
}
/**
 * Submit KYC customer data for verification.
 *
 * @remarks
 * On success, the wallet's KYC status query is invalidated so the UI
 * reflects the updated status immediately.
 *
 * @example
 * ```tsx
 * const submit = useSubmitKYC();
 * await submit.mutateAsync({
 *   address: '0xABC...',
 *   customerData: { name: 'Alice', country: 'NG' },
 * });
 * ```
 */
function useSubmitKYC() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: ({ address, customerData, }) => (0, sdk_1.submitKYC)(address, customerData),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: query_keys_1.queryKeys.kycStatus(variables.address),
            });
        },
    });
}
//# sourceMappingURL=useKYC.js.map