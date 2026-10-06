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
exports.getPassword = getPassword;
exports.setPassword = setPassword;
exports.deletePassword = deletePassword;
exports.getWalletList = getWalletList;
exports.addWalletToList = addWalletToList;
exports.removeWalletFromList = removeWalletFromList;
exports.getActiveWallet = getActiveWallet;
exports.setActiveWallet = setActiveWallet;
const SecureStore = __importStar(require("expo-secure-store"));
const errors_1 = require("./errors");
const WALLET_LIST_KEY = 'torosdk_wallets';
const ACTIVE_WALLET_KEY = 'torosdk_active_wallet';
const PASSWORD_KEY_PREFIX = 'wallet_pwd_';
/** Constructs the SecureStore key for a wallet's password. */
function passwordKey(address) {
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
async function getPassword(address) {
    try {
        return await SecureStore.getItemAsync(passwordKey(address));
    }
    catch (err) {
        throw new errors_1.StorageError(`Failed to read password for ${address}`, err);
    }
}
/**
 * Persist a wallet password to SecureStore.
 *
 * @param address - The wallet address (case-insensitive).
 * @param password - The plain-text password to store.
 * @throws {@link StorageError} if the underlying SecureStore write fails.
 */
async function setPassword(address, password) {
    if (!password || password.trim().length === 0) {
        throw new errors_1.StorageError(`Cannot store an empty password for ${address}. Passwords must be non-empty strings.`);
    }
    try {
        await SecureStore.setItemAsync(passwordKey(address), password);
    }
    catch (err) {
        throw new errors_1.StorageError(`Failed to store password for ${address}`, err);
    }
}
/**
 * Delete the stored password for a wallet address.
 *
 * @param address - The wallet address (case-insensitive).
 * @throws {@link StorageError} if the underlying SecureStore delete fails.
 */
async function deletePassword(address) {
    try {
        await SecureStore.deleteItemAsync(passwordKey(address));
    }
    catch (err) {
        throw new errors_1.StorageError(`Failed to delete password for ${address}`, err);
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
async function getWalletList() {
    try {
        const raw = await SecureStore.getItemAsync(WALLET_LIST_KEY);
        if (!raw)
            return [];
        return JSON.parse(raw);
    }
    catch (err) {
        throw new errors_1.StorageError('Failed to read wallet list', err);
    }
}
/**
 * Append a wallet address to the stored list (idempotent — no duplicates).
 *
 * @param address - The wallet address to add (case-insensitive).
 * @throws {@link StorageError} if the read or write fails.
 */
async function addWalletToList(address) {
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
async function removeWalletFromList(address) {
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
async function getActiveWallet() {
    try {
        return await SecureStore.getItemAsync(ACTIVE_WALLET_KEY);
    }
    catch (err) {
        throw new errors_1.StorageError('Failed to read active wallet', err);
    }
}
/**
 * Persist the active wallet address to SecureStore.
 *
 * @param address - The wallet address to mark as active (case-insensitive).
 * @throws {@link StorageError} if the underlying SecureStore write fails.
 */
async function setActiveWallet(address) {
    try {
        await SecureStore.setItemAsync(ACTIVE_WALLET_KEY, address.toLowerCase());
    }
    catch (err) {
        throw new errors_1.StorageError('Failed to set active wallet', err);
    }
}
//# sourceMappingURL=storage.js.map