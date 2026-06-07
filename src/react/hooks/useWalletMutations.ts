import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createWallet as createWalletCore,
  importWallet as importWalletCore,
} from '../../core/sdk';
import {
  setPassword,
  addWalletToList,
  setActiveWallet,
  deletePassword,
  removeWalletFromList,
} from '../../core/storage';
import { getAuthStrategy } from '../../core/auth';
import { queryKeys } from '../query-keys';

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
export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password }: CreateWalletVariables) => {
      await getAuthStrategy().authorize('wallet-create');
      const address = await createWalletCore(username, password);
      await setPassword(address, password);
      await addWalletToList(address);
      await setActiveWallet(address);
      return address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

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
export function useImportWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ privateKey, password }: ImportWalletVariables) => {
      await getAuthStrategy().authorize('wallet-import');
      const address = await importWalletCore(privateKey, password);
      await setPassword(address, password);
      await addWalletToList(address);
      await setActiveWallet(address);
      return address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

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
export function useDeleteWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: string) => {
      await getAuthStrategy().authorize('wallet-delete');
      await deletePassword(address);
      await removeWalletFromList(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}
