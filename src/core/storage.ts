import * as SecureStore from 'expo-secure-store';
import { StorageError } from './errors';

const WALLET_LIST_KEY = 'torosdk_wallets';
const ACTIVE_WALLET_KEY = 'torosdk_active_wallet';
const PASSWORD_KEY_PREFIX = 'wallet_pwd_';

/** Constructs the SecureStore key for a wallet's password. */
function passwordKey(address: string): string {
  return `${PASSWORD_KEY_PREFIX}${address.toLowerCase()}`;
}

// --- Password storage ---

/**
 * Retrieve the stored password for a wallet address.
 *
 * @param address - The wallet address (case-insensitive).
 * @returns The password string, or `null` if no password is stored.
 * @throws {@link StorageError} if the underlying SecureStore read fails.
 */
export async function getPassword(address: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(passwordKey(address));
  } catch (err) {
    throw new StorageError(`Failed to read password for ${address}`, err);
  }
}

/**
 * Persist a wallet password to SecureStore.
 *
 * @param address - The wallet address (case-insensitive).
 * @param password - The plain-text password to store.
 * @throws {@link StorageError} if the underlying SecureStore write fails.
 */
export async function setPassword(address: string, password: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(passwordKey(address), password);
  } catch (err) {
    throw new StorageError(`Failed to store password for ${address}`, err);
  }
}

/**
 * Delete the stored password for a wallet address.
 *
 * @param address - The wallet address (case-insensitive).
 * @throws {@link StorageError} if the underlying SecureStore delete fails.
 */
export async function deletePassword(address: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(passwordKey(address));
  } catch (err) {
    throw new StorageError(`Failed to delete password for ${address}`, err);
  }
}

// --- Wallet list storage ---

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
export async function getWalletList(): Promise<string[]> {
  try {
    const raw = await SecureStore.getItemAsync(WALLET_LIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch (err) {
    throw new StorageError('Failed to read wallet list', err);
  }
}

/**
 * Append a wallet address to the stored list (idempotent — no duplicates).
 *
 * @param address - The wallet address to add (case-insensitive).
 * @throws {@link StorageError} if the read or write fails.
 */
export async function addWalletToList(address: string): Promise<void> {
  const list = await getWalletList();
  const normalized = address.toLowerCase();
  if (!list.includes(normalized)) {
    list.push(normalized);
    await SecureStore.setItemAsync(WALLET_LIST_KEY, JSON.stringify(list));
  }
}

/**
 * Remove a wallet address from the stored list.
 *
 * @param address - The wallet address to remove (case-insensitive).
 * @throws {@link StorageError} if the read or write fails.
 */
export async function removeWalletFromList(address: string): Promise<void> {
  const list = await getWalletList();
  const normalized = address.toLowerCase();
  const filtered = list.filter((a) => a !== normalized);
  if (filtered.length !== list.length) {
    await SecureStore.setItemAsync(WALLET_LIST_KEY, JSON.stringify(filtered));
  }
}

// --- Active wallet ---

/**
 * Retrieve the currently active wallet address from SecureStore.
 *
 * @returns The active wallet address, or `null` if none is set.
 * @throws {@link StorageError} if the underlying SecureStore read fails.
 */
export async function getActiveWallet(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACTIVE_WALLET_KEY);
  } catch (err) {
    throw new StorageError('Failed to read active wallet', err);
  }
}

/**
 * Persist the active wallet address to SecureStore.
 *
 * @param address - The wallet address to mark as active (case-insensitive).
 * @throws {@link StorageError} if the underlying SecureStore write fails.
 */
export async function setActiveWallet(address: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(ACTIVE_WALLET_KEY, address.toLowerCase());
  } catch (err) {
    throw new StorageError('Failed to set active wallet', err);
  }
}
