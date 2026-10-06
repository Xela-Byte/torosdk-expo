export interface UseTokenBalanceOptions {
    address: string;
    contractAddress?: string;
    enabled?: boolean;
}
/**
 * Fetch the Toronet token balance for a wallet address.
 *
 * @example
 * ```tsx
 * const { data: tokenBal, isLoading } = useTokenBalance({
 *   address: '0x1234...',
 * });
 * ```
 */
export declare function useTokenBalance({ address, contractAddress, enabled, }: UseTokenBalanceOptions): import("@tanstack/react-query").UseQueryResult<string, Error>;
//# sourceMappingURL=useTokenBalance.d.ts.map