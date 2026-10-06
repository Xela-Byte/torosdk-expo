import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Currency } from '../../core/types';
import { makeTransfer } from '../../core/sdk';
import { queryKeys } from '../query-keys';

/**
 * Variables required to initiate a transfer.
 *
 * @property senderAddress - The sending wallet address.
 * @property receiverAddress - The receiving wallet address.
 * @property amount - Transfer amount as a decimal string (e.g. `"100.50"`).
 * @property currency - The currency to transfer.
 */
export interface TransferVariables {
  senderAddress: string;
  receiverAddress: string;
  amount: string;
  currency: Currency;
}

/**
 * Execute an inter-wallet transfer.
 *
 * @remarks
 * On success, the sender's balance queries are automatically invalidated
 * so the UI reflects the new balance immediately.
 *
 * @example
 * ```tsx
 * const transfer = useTransfer();
 *
 * const handleSend = async () => {
 *   await transfer.mutateAsync({
 *     senderAddress: '0xSender',
 *     receiverAddress: '0xReceiver',
 *     amount: '100',
 *     currency: Currency.Naira,
 *   });
 * };
 * ```
 */
export function useTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ senderAddress, receiverAddress, amount, currency }: TransferVariables) =>
      makeTransfer(senderAddress, receiverAddress, amount, currency),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.balances(variables.senderAddress),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.balance(variables.senderAddress, variables.currency),
      });
    },
  });
}
