import type { Currency } from '../../core/types';
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
export declare function useTransfer(): import("@tanstack/react-query").UseMutationResult<{
    transactionHash?: string;
    reference?: string;
}, Error, TransferVariables, unknown>;
//# sourceMappingURL=useTransfer.d.ts.map