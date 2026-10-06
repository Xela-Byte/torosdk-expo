/**
 * Check whether chain-level storage is currently enabled.
 *
 * @example
 * ```tsx
 * const { data } = useStorageStatus();
 * ```
 */
export declare function useStorageStatus(): import("@tanstack/react-query").UseQueryResult<import("../../core").ToroRawResult, Error>;
/**
 * Fetch the current chain-level storage version.
 *
 * @example
 * ```tsx
 * const { data } = useStorageVersion();
 * ```
 */
export declare function useStorageVersion(): import("@tanstack/react-query").UseQueryResult<import("../../core").ToroRawResult, Error>;
export interface SetStorageVariables {
    address: string;
    password: string;
}
/**
 * Mutation to enable chain-level storage (owner operation).
 *
 * @remarks
 * Invalidates `storageStatus` query key on success.
 */
export declare function useSetStorageOn(): import("@tanstack/react-query").UseMutationResult<import("../../core").ToroRawResult, Error, SetStorageVariables, unknown>;
/**
 * Mutation to disable chain-level storage (owner operation).
 *
 * @remarks
 * Invalidates `storageStatus` query key on success.
 */
export declare function useSetStorageOff(): import("@tanstack/react-query").UseMutationResult<import("../../core").ToroRawResult, Error, SetStorageVariables, unknown>;
//# sourceMappingURL=useStorage.d.ts.map