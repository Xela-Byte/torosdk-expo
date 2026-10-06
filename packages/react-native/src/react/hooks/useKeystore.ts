import { useQuery } from '@tanstack/react-query';
import { getWalletKey } from '../../core/sdk';
import { queryKeys } from '../query-keys';

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
export function useKeystoreEntry({ address, enabled = true }: UseKeystoreEntryOptions) {
  return useQuery({
    queryKey: queryKeys.keystoreEntry(address),
    queryFn: () => getWalletKey(address),
    staleTime: 60_000,
    enabled: enabled && !!address,
  });
}
