"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateWallet = useCreateWallet;
exports.useImportWallet = useImportWallet;
exports.useDeleteWallet = useDeleteWallet;
exports.useVerifyPassword = useVerifyPassword;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const storage_1 = require("../../core/storage");
const auth_1 = require("../../core/auth");
const query_keys_1 = require("../query-keys");
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
function useCreateWallet() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ username, password }) => {
            await (0, auth_1.getAuthStrategy)().authorize('wallet-create');
            // createWalletCore already persists the password via setPassword() —
            // we only need to add the address to the wallet list and mark it active.
            const address = await (0, sdk_1.createWallet)(username, password);
            await (0, storage_1.addWalletToList)(address);
            await (0, storage_1.setActiveWallet)(address);
            return address;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.all });
        },
    });
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
function useImportWallet() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ privateKey, password }) => {
            await (0, auth_1.getAuthStrategy)().authorize('wallet-import');
            // importWalletCore already persists the password via setPassword() —
            // we only need to add the address to the wallet list and mark it active.
            const address = await (0, sdk_1.importWallet)(privateKey, password);
            await (0, storage_1.addWalletToList)(address);
            await (0, storage_1.setActiveWallet)(address);
            return address;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.all });
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
function useDeleteWallet() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (address) => {
            await (0, auth_1.getAuthStrategy)().authorize('wallet-delete');
            await (0, storage_1.deletePassword)(address);
            await (0, storage_1.removeWalletFromList)(address);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.all });
        },
    });
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
function useVerifyPassword() {
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ address, password }) => {
            const { verifyWalletPasswordOp } = await Promise.resolve().then(() => __importStar(require('../../core/sdk')));
            return await verifyWalletPasswordOp(address, password);
        },
    });
}
//# sourceMappingURL=useWalletMutations.js.map