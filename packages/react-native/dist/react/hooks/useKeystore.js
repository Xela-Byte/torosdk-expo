"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeystoreEntry = useKeystoreEntry;
const react_query_1 = require("@tanstack/react-query");
const sdk_1 = require("../../core/sdk");
const query_keys_1 = require("../query-keys");
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
function useKeystoreEntry({ address, enabled = true }) {
    return (0, react_query_1.useQuery)({
        queryKey: query_keys_1.queryKeys.keystoreEntry(address),
        queryFn: () => (0, sdk_1.getWalletKey)(address),
        staleTime: 60000,
        enabled: enabled && !!address,
    });
}
//# sourceMappingURL=useKeystore.js.map