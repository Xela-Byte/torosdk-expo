/**
 * Options for {@link useKYCStatus}.
 *
 * @property address - Wallet address whose KYC status to check.
 * @property enabled - Set to `false` to defer the query (default `true`).
 */
export interface UseKYCStatusOptions {
    address: string;
    enabled?: boolean;
}
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
export declare function useKYCStatus({ address, enabled }: UseKYCStatusOptions): import("@tanstack/react-query").UseQueryResult<{
    verified: boolean;
    details?: unknown;
}, Error>;
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
export declare function useSubmitKYC(): import("@tanstack/react-query").UseMutationResult<unknown, Error, {
    address: string;
    customerData: Record<string, unknown>;
}, unknown>;
//# sourceMappingURL=useKYC.d.ts.map