"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTransfer = useTransfer;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
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
function useTransfer() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: ({ senderAddress, receiverAddress, amount, currency }) => (0, sdk_1.makeTransfer)(senderAddress, receiverAddress, amount, currency),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: query_keys_1.queryKeys.balances(variables.senderAddress),
            });
            queryClient.invalidateQueries({
                queryKey: query_keys_1.queryKeys.balance(variables.senderAddress, variables.currency),
            });
        },
    });
}
//# sourceMappingURL=useTransfer.js.map