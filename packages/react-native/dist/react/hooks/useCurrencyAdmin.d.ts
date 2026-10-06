export interface UseCurrencyInfoOptions {
    currency: string;
    enabled?: boolean;
}
/**
 * Fetch rate or status information for a given currency.
 */
export declare function useCurrencyInfo({ currency, enabled }: UseCurrencyInfoOptions): import("@tanstack/react-query").UseQueryResult<any, Error>;
export interface FreezeCurrencyVariables {
    currency: string;
    address: string;
    admin: string;
    adminpwd: string;
    targetAddress: string;
}
/**
 * Freeze an address for a specific currency (Admin operation).
 */
export declare function useFreezeCurrency(): import("@tanstack/react-query").UseMutationResult<import("../../core").ToroRawResult, Error, FreezeCurrencyVariables, unknown>;
export interface UnfreezeCurrencyVariables {
    currency: string;
    address: string;
    admin: string;
    adminpwd: string;
    targetAddress: string;
}
/**
 * Unfreeze an address for a specific currency (Admin operation).
 */
export declare function useUnfreezeCurrency(): import("@tanstack/react-query").UseMutationResult<import("../../core").ToroRawResult, Error, UnfreezeCurrencyVariables, unknown>;
export interface MintCurrencyVariables {
    currency: string;
    address: string;
    admin: string;
    adminpwd: string;
    targetAddress: string;
    amount: string;
}
/**
 * Mint funds for a specific currency (Admin operation).
 */
export declare function useMintCurrency(): import("@tanstack/react-query").UseMutationResult<import("../../core").ToroRawResult, Error, MintCurrencyVariables, unknown>;
//# sourceMappingURL=useCurrencyAdmin.d.ts.map