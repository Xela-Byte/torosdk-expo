export interface UseTokenExtendedOptions {
    address?: string;
    contractAddress?: string;
    enabled?: boolean;
}
/**
 * Fetch extended token metadata (name, symbol, decimals, etc.) from the Toronet chain.
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useTokenExtended();
 * ```
 */
export declare function useTokenExtended({ address, contractAddress, enabled, }?: UseTokenExtendedOptions): import("@tanstack/react-query").UseQueryResult<{
    name: string;
    symbol: string;
    decimals: number;
}, Error>;
//# sourceMappingURL=useTokenExtended.d.ts.map