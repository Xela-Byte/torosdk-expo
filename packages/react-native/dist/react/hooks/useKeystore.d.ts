export interface UseKeystoreEntryOptions {
    address: string;
    enabled?: boolean;
}
/**
 * Retrieve the wallet key data for a given address.
 *
 * @remarks
 * This reads the keystore entry from the Toronet network (not the device
 * secure store). For device password/key storage, use `useWallets` instead.
 *
 * @example
 * ```tsx
 * const { data } = useKeystoreEntry({ address: '0x...' });
 * ```
 */
export declare function useKeystoreEntry({ address, enabled }: UseKeystoreEntryOptions): import("@tanstack/react-query").UseQueryResult<import("../../core").ToroRawResult, Error>;
//# sourceMappingURL=useKeystore.d.ts.map