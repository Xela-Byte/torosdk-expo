import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Currency } from '../../core/types';
import { makeTransfer } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export interface TransferVariables {
  senderAddress: string;
  receiverAddress: string;
  amount: string;
  currency: Currency;
}

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
