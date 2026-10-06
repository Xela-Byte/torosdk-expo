/**
 * Retrieve the stored password for a wallet address.
 *
 * @param address - The wallet address (case-insensitive).
 * @returns The password string, or `null` if no password is stored.
 * @throws {@link StorageError} if the underlying SecureStore read fails.
 */
export declare function getPassword(address: string): Promise<string | null>;
/**
 * Persist a wallet password to SecureStore.
 *
 * @param address - The wallet address (case-insensitive).
 * @param password - The plain-text password to store.
 * @throws {@link StorageError} if the underlying SecureStore write fails.
 */
export declare function setPassword(address: string, password: string): Promise<void>;
/**
 * Delete the stored password for a wallet address.
 *
 * @param address - The wallet address (case-insensitive).
 * @throws {@link StorageError} if the underlying SecureStore delete fails.
 */
export declare function deletePassword(address: string): Promise<void>;
/**
 * Load the full wallet address list from SecureStore.
 *
 * @remarks
 * Returns an empty array if no wallets have been saved yet (rather than
 * throwing — this is intentional so that first-time reads work cleanly).
 *
 * @returns Array of lowercased wallet addresses.
 * @throws {@link StorageError} if the underlying SecureStore read or JSON parse fails.
 */
export declare function getWalletList(): Promise<string[]>;
/**
 * Append a wallet address to the stored list (idempotent — no duplicates).
 *
 * @param address - The wallet address to add (case-insensitive).
 * @throws {@link StorageError} if the read or write fails.
 */
export declare function addWalletToList(address: string): Promise<void>;
/**
 * Remove a wallet address from the stored list.
 *
 * @param address - The wallet address to remove (case-insensitive).
 * @throws {@link StorageError} if the read or write fails.
 */
export declare function removeWalletFromList(address: string): Promise<void>;
/**
 * Retrieve the currently active wallet address from SecureStore.
 *
 * @returns The active wallet address, or `null` if none is set.
 * @throws {@link StorageError} if the underlying SecureStore read fails.
 */
export declare function getActiveWallet(): Promise<string | null>;
/**
 * Persist the active wallet address to SecureStore.
 *
 * @param address - The wallet address to mark as active (case-insensitive).
 * @throws {@link StorageError} if the underlying SecureStore write fails.
 */
export declare function setActiveWallet(address: string): Promise<void>;
//# sourceMappingURL=storage.d.ts.map