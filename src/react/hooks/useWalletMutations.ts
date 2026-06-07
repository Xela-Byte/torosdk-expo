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

export interface CreateWalletVariables {
  username: string;
  password: string;
}

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

export interface ImportWalletVariables {
  privateKey: string;
  password: string;
}

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
