/**
 * Variables for {@link useCreateWallet}.
 *
 * @property username - Human-readable username for the new wallet.
 * @property password - Password used to encrypt the wallet's private key.
 */
export interface CreateWalletVariables {
    username: string;
    password: string;
}
/**
 * Create a new wallet and persist it to storage.
 *
 * @remarks
 * This mutation gates on the active {@link AuthStrategy} (`wallet-create`
 * category). On success it:
 *
 * 1. Stores the password in SecureStore.
 * 2. Adds the address to the wallet list.
 * 3. Sets it as the active wallet.
 * 4. Invalidates all Toronet queries so the UI refreshes.
 *
 * @example
 * ```tsx
 * const createWallet = useCreateWallet();
 * const address = await createWallet.mutateAsync({
 *   username: 'alice',
 *   password: 's3cret!',
 * });
 * ```
 */
export declare function useCreateWallet(): import("@tanstack/react-query").UseMutationResult<string, Error, CreateWalletVariables, unknown>;
/**
 * Variables for {@link useImportWallet}.
 *
 * @property privateKey - The wallet's private key (hex string).
 * @property password - Password to encrypt the imported key.
 */
export interface ImportWalletVariables {
    privateKey: string;
    password: string;
}
/**
 * Import an existing wallet via private key and persist it to storage.
 *
 * @remarks
 * This mutation gates on the active {@link AuthStrategy} (`wallet-import`
 * category). On success it stores the password, adds the address to the
 * wallet list, sets it as active, and invalidates all Toronet queries.
 *
 * @example
 * ```tsx
 * const importWallet = useImportWallet();
 * const address = await importWallet.mutateAsync({
 *   privateKey: '0xABC123...',
 *   password: 's3cret!',
 * });
 * ```
 */
export declare function useImportWallet(): import("@tanstack/react-query").UseMutationResult<string, Error, ImportWalletVariables, unknown>;
/**
 * Delete a wallet's stored password and remove it from the wallet list.
 *
 * @remarks
 * This mutation gates on the active {@link AuthStrategy} (`wallet-delete`
 * category). On success it wipes the password from SecureStore, removes
 * the address from the wallet list, and invalidates all Toronet queries.
 *
 * @example
 * ```tsx
 * const deleteWallet = useDeleteWallet();
 * await deleteWallet.mutateAsync('0xABC...');
 * ```
 */
export declare function useDeleteWallet(): import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
/**
 * Variables for {@link useVerifyPassword}.
 */
export interface VerifyPasswordVariables {
    address: string;
    password: string;
}
/**
 * Verify a wallet password against the network or key store.
 *
 * @example
 * ```tsx
 * const verifyPassword = useVerifyPassword();
 * const isValid = await verifyPassword.mutateAsync({
 *   address: '0xABC...',
 *   password: 'secret',
 * });
 * ```
 */
export declare function useVerifyPassword(): import("@tanstack/react-query").UseMutationResult<boolean, Error, VerifyPasswordVariables, unknown>;
//# sourceMappingURL=useWalletMutations.d.ts.map