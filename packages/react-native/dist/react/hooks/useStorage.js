"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStorageStatus = useStorageStatus;
exports.useStorageVersion = useStorageVersion;
exports.useSetStorageOn = useSetStorageOn;
exports.useSetStorageOff = useSetStorageOff;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
// ── useStorageStatus ──────────────────────────────────────────────────────
/**
 * Check whether chain-level storage is currently enabled.
 *
 * @example
 * ```tsx
 * const { data } = useStorageStatus();
 * ```
 */
function useStorageStatus() {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.storageStatus(),
        queryFn: () => (0, sdk_1.isStorageOn)(),
        staleTime: 60000,
    });
}
// ── useStorageVersion ─────────────────────────────────────────────────────
/**
 * Fetch the current chain-level storage version.
 *
 * @example
 * ```tsx
 * const { data } = useStorageVersion();
 * ```
 */
function useStorageVersion() {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.storageVersion(),
        queryFn: () => (0, sdk_1.getStorageVersion)(),
        staleTime: 60000,
    });
}
/**
 * Mutation to enable chain-level storage (owner operation).
 *
 * @remarks
 * Invalidates `storageStatus` query key on success.
 */
function useSetStorageOn() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: ({ address, password }) => (0, sdk_1.setStorageOn)(address, password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.storageStatus() });
        },
    });
}
// ── useSetStorageOff ──────────────────────────────────────────────────────
/**
 * Mutation to disable chain-level storage (owner operation).
 *
 * @remarks
 * Invalidates `storageStatus` query key on success.
 */
function useSetStorageOff() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: ({ address, password }) => (0, sdk_1.setStorageOff)(address, password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: query_keys_1.queryKeys.storageStatus() });
        },
    });
}
//# sourceMappingURL=useStorage.js.map