import * as SecureStore from 'expo-secure-store';
import { StorageError } from './errors';

const WALLET_LIST_KEY = 'torosdk_wallets';
const ACTIVE_WALLET_KEY = 'torosdk_active_wallet';
const PASSWORD_KEY_PREFIX = 'wallet_pwd_';

function passwordKey(address: string): string {
  return `${PASSWORD_KEY_PREFIX}${address.toLowerCase()}`;
}

// --- Password storage ---

export async function getPassword(address: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(passwordKey(address));
  } catch (err) {
    throw new StorageError(`Failed to read password for ${address}`, err);
  }
}

export async function setPassword(address: string, password: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(passwordKey(address), password);
  } catch (err) {
    throw new StorageError(`Failed to store password for ${address}`, err);
  }
}

export async function deletePassword(address: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(passwordKey(address));
  } catch (err) {
    throw new StorageError(`Failed to delete password for ${address}`, err);
  }
}

// --- Wallet list storage ---

export async function getWalletList(): Promise<string[]> {
  try {
    const raw = await SecureStore.getItemAsync(WALLET_LIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch (err) {
    throw new StorageError('Failed to read wallet list', err);
  }
}

export async function addWalletToList(address: string): Promise<void> {
  const list = await getWalletList();
  const normalized = address.toLowerCase();
  if (!list.includes(normalized)) {
    list.push(normalized);
    await SecureStore.setItemAsync(WALLET_LIST_KEY, JSON.stringify(list));
  }
}

export async function removeWalletFromList(address: string): Promise<void> {
  const list = await getWalletList();
  const normalized = address.toLowerCase();
  const filtered = list.filter((a) => a !== normalized);
  if (filtered.length !== list.length) {
    await SecureStore.setItemAsync(WALLET_LIST_KEY, JSON.stringify(filtered));
  }
}

// --- Active wallet ---

export async function getActiveWallet(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACTIVE_WALLET_KEY);
  } catch (err) {
    throw new StorageError('Failed to read active wallet', err);
  }
}

export async function setActiveWallet(address: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(ACTIVE_WALLET_KEY, address.toLowerCase());
  } catch (err) {
    throw new StorageError('Failed to set active wallet', err);
  }
}
