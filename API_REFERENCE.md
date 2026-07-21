# torosdk-expo API Reference

Single-page reference for all public API surfaces in torosdk-expo v0.1.4+.

## Table of Contents

- [Quick Start](#quick-start)
- [Core SDK Wrappers](#core-sdk-wrappers) — `torosdk-expo/core`
- [React Hooks](#react-hooks) — `torosdk-expo`
- [Auth Strategies](#auth-strategies) — `torosdk-expo/core`
- [Storage Utilities](#storage-utilities) — `torosdk-expo/core`
- [Config Utilities](#config-utilities) — `torosdk-expo/core`
- [Error Classes](#error-classes) — `torosdk-expo/core`
- [Types & Interfaces](#types--interfaces) — `torosdk-expo/core`
- [React Context](#react-context) — `torosdk-expo`
- [Query Keys](#query-keys) — `torosdk-expo`

---

## Quick Start

```ts
// 1. Bootstrap your Expo project (CLI, never bundled in apps)
npx torosdk-expo init

// 2. Wrap your app
import { ToronetProvider } from 'torosdk-expo';
import { createPasswordStrategy } from 'torosdk-expo/core';

<ToronetProvider config={{ network: 'testnet' }} authStrategy={createPasswordStrategy()}>
  <App />
</ToronetProvider>

// 3. Use hooks
import { useBalance, useTransfer } from 'torosdk-expo';
```

---

## Core SDK Wrappers

> Import from `torosdk-expo/core`. Zero React dependencies. Safe for Node.js scripts, tests, and non-React environments.

All functions call `authorizeOperation(category)` before executing and normalize errors into the `ToroError` hierarchy via `wrapError()`.

---

### `createWallet(params)`

Creates a new wallet on the Toronet blockchain.

```ts
function createWallet(params: {
  username: string;
  password: string;
  currency?: Currency;       // default: Currency.Naira
  initialBalance?: string;   // default: "0"
}): Promise<{ address: string }>;
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | `string` | yes | Human-readable wallet identifier |
| `password` | `string` | yes | Encryption password for the wallet (stored in SecureStore via hooks) |
| `currency` | `Currency` | no | Default currency for the wallet (default: `Currency.Naira`) |
| `initialBalance` | `string` | no | Initial balance to seed (default: `"0"`) |

**Returns:** `Promise<{ address: string }>` — the new wallet's hex address.

**Auth gate:** `wallet-create`

**Throws:** `NetworkError` on connection failure, `APIError` on server rejection, `AuthBlockedError` if auth denies the operation.

---

### `importWallet(params)`

Imports an existing wallet from a private key.

```ts
function importWallet(params: {
  privateKey: string;
  password: string;
}): Promise<{ address: string }>;
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `privateKey` | `string` | yes | Hex-encoded private key (with or without `0x` prefix) |
| `password` | `string` | yes | Encryption password to store in SecureStore |

**Returns:** `Promise<{ address: string }>` — the imported wallet's address.

**Auth gate:** `wallet-import`

**Throws:** `NetworkError`, `APIError` (e.g. invalid private key), `AuthBlockedError`.

---

### `verifyWalletPassword(params)`

Verifies that a stored password is correct for a given wallet.

```ts
function verifyWalletPassword(params: {
  address: string;
  password: string;
}): Promise<boolean>;
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | yes | Wallet address to verify against |
| `password` | `string` | yes | Password to check |

**Returns:** `Promise<boolean>` — `true` if the password matches, `false` otherwise.

**Auth gate:** `balance` (read-level)

**Throws:** `NetworkError`, `APIError`.

---

### `getBalanceForCurrency(params)`

Fetches the balance of a single currency for a wallet.

```ts
function getBalanceForCurrency(params: {
  address: string;
  currency: Currency;
}): Promise<{ currency: Currency; balance: string }>;
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | yes | Wallet address |
| `currency` | `Currency` | yes | Which currency to query (e.g. `Currency.Naira`) |

**Returns:** `Promise<{ currency: Currency; balance: string }>` — the currency and its balance as a decimal string.

**Auth gate:** `balance`

**Throws:** `NetworkError`, `APIError`.

**Remarks:** Extracts the `balance` field from the API response shape `{ result, balance, error }`. If the API returns an unexpected shape, throws an `APIError`.

---

### `getBalances(params)`

Fetches balances for all supported currencies.

```ts
function getBalances(params: {
  address: string;
}): Promise<Array<{ currency: Currency; balance: string }>>;
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | yes | Wallet address |

**Returns:** `Promise<Array<{ currency: Currency; balance: string }>>` — one entry per supported currency (NGN, USD, KSH, ZAR, GBP, EUR).

**Auth gate:** `balance`

**Throws:** `NetworkError`, `APIError`.

---

### `makeTransfer(params)`

Sends a transfer from one wallet to another.

```ts
function makeTransfer(params: {
  senderAddress: string;
  receiverAddress: string;
  amount: string;
  currency: Currency;
}): Promise<{ transactionHash: string }>;
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `senderAddress` | `string` | yes | Source wallet address |
| `receiverAddress` | `string` | yes | Destination wallet address |
| `amount` | `string` | yes | Amount to send (decimal string, e.g. `"100"`) |
| `currency` | `Currency` | yes | Currency to transfer |

**Returns:** `Promise<{ transactionHash: string }>` — the on-chain transaction hash.

**Auth gate:** `transfer`

**Throws:** `NetworkError`, `APIError` (e.g. insufficient balance, invalid address), `AuthBlockedError`, `StorageError` (if password cannot be retrieved).

**Remarks:** Internally calls `resolvePassword()` to fetch the stored password from SecureStore, then signs the transaction. This is the only SDK function that requires a stored password — all others operate without it.

---

### `resolveTNS(params)`

Resolves a Toronet Name Service name to a wallet address.

```ts
function resolveTNS(params: {
  name: string;
}): Promise<string>;
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | yes | TNS name to resolve (e.g. `"alice"`) |

**Returns:** `Promise<string>` — the wallet address that the name resolves to.

**Auth gate:** `tns-read`

**Throws:** `NetworkError`, `APIError` (e.g. name not registered).

---

### `lookupTNS(params)`

Reverse lookup — finds the TNS name registered to a wallet address.

```ts
function lookupTNS(params: {
  address: string;
}): Promise<string | null>;
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | yes | Wallet address to look up |

**Returns:** `Promise<string | null>` — the registered TNS name, or `null` if none.

**Auth gate:** `tns-read`

**Throws:** `NetworkError`, `APIError`.

---

### `setTNS(params)`

Registers a TNS name for a wallet address.

```ts
function setTNS(params: {
  address: string;
  name: string;
}): Promise<void>;
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | yes | Wallet address to register the name for |
| `name` | `string` | yes | Desired TNS name |

**Returns:** `Promise<void>` — resolves on success.

**Auth gate:** `tns-write`

**Throws:** `NetworkError`, `APIError` (e.g. name already taken), `AuthBlockedError`.

---

### `getKYCStatus(params)`

Queries the Know Your Customer verification status for a wallet.

```ts
function getKYCStatus(params: {
  address: string;
}): Promise<{ status: string; data?: Record<string, unknown> }>;
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | yes | Wallet address to check |

**Returns:** `Promise<{ status: string; data?: Record<string, unknown> }>` — the KYC status string (e.g. `"verified"`, `"pending"`, `"unverified"`) and optional supplementary data.

**Auth gate:** `kyc`

**Throws:** `NetworkError`, `APIError`.

---

### `submitKYC(params)`

Submits KYC (Know Your Customer) data for a wallet.

```ts
function submitKYC(params: {
  address: string;
  data: Record<string, unknown>;
}): Promise<void>;
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | yes | Wallet address to submit KYC for |
| `data` | `Record<string, unknown>` | yes | KYC data fields (name, document numbers, etc.) |

**Returns:** `Promise<void>` — resolves on successful submission.

**Auth gate:** `kyc`

**Throws:** `NetworkError`, `APIError` (e.g. invalid data, already submitted), `AuthBlockedError`.

---

### `getExchangeRates()`

Fetches current exchange rates for all supported currency pairs.

```ts
function getExchangeRates(): Promise<Array<{ pair: string; rate: string }>>;
```

**Returns:** `Promise<Array<{ pair: string; rate: string }>>` — e.g. `[{ pair: "NGN/USD", rate: "0.00065" }, ...]`.

**Auth gate:** `exchange-rates`

**Throws:** `NetworkError`, `APIError`.

**Remarks:** Normalizes both array-shaped and record-shaped API responses into a consistent array format. If the API returns `{ "NGN/USD": "...", ... }`, it is converted to `[{ pair: "NGN/USD", rate: "..." }, ...]`.

---

### Bridge wrappers (cross-chain)

Move value between Toronet and external chains via `BridgeNetwork` (`Solana`, `Base`, `Polygon`, `BSC`, `Arbitrum`, `Ethereum`). All return `ToroRawResult` (the raw Toronet response envelope; narrow via its index signature).

```ts
interface BridgeTokenParams {
  from: string;
  network: BridgeNetwork | string;
  contractAddress: string;
  tokenName: string;
  amount: string;
}

// Sensitive — resolves the sender's stored password. Auth gate: `bridge`.
function bridgeToken(params: BridgeTokenParams): Promise<ToroRawResult>;

// Reads. Auth gate: `bridge-read`.
function getBridgeTokenFee(params: { network: BridgeNetwork | string; contractAddress: string; amount: string }): Promise<ToroRawResult>;
function getBridgeBalance(params: { address: string; network: BridgeNetwork | string }): Promise<ToroRawResult>;
function getBridgeTokenBalance(params: { address: string; network: BridgeNetwork | string; contractAddress: string; tokenName?: string }): Promise<ToroRawResult>;
function getBridgeTransactions(params: { address: string; network: BridgeNetwork | string }): Promise<ToroRawResult>;
function getBridgeTokenTransactions(params: { address: string; network: BridgeNetwork | string; contractAddress: string; tokenName?: string }): Promise<ToroRawResult>;
```

**Throws:** `AuthBlockedError`, `NetworkError`, `APIError`.

---

### Solana wrappers

```ts
// Auth gate: `wallet-create`.
function createSolanaAddress(): Promise<ToroRawResult>;
// Sensitive — resolves the wallet's stored password. Auth gate: `wallet-create`.
function createToronetSolanaAddress(address: string): Promise<ToroRawResult>;
function isValidSolanaAddress(address: string): Promise<ToroRawResult>;

// Sensitive — resolve the sender's stored password. Auth gate: `solana-transfer`.
function transferSolana(params: { from: string; to: string; amount: string }): Promise<ToroRawResult>;
function transferSolToken(params: { from: string; to: string; amount: string; contractAddress: string; tokenName: string; useTokenAsFees?: string }): Promise<ToroRawResult>;

// Reads. Auth gate: `solana-read`.
function getSolBalance(params: { address: string; network?: BridgeNetwork | string }): Promise<ToroRawResult>;
function getSolTokenBalance(params: { address: string; contractAddress: string; tokenName?: string; network?: BridgeNetwork | string }): Promise<ToroRawResult>;
function getSolTransactions(params: { address: string; network?: BridgeNetwork | string }): Promise<ToroRawResult>;
function getSolTokenTransactions(params: { address: string; contractAddress: string; tokenName?: string; network?: BridgeNetwork | string }): Promise<ToroRawResult>;
```

**Throws:** `AuthBlockedError`, `NetworkError`, `APIError`.

---

### Swap wrappers

```ts
// Read. Auth gate: `swap-read`. Returns a typed SwapRateOutput (from torosdk).
function getSwapQuote(params: { fromCurrency: string; toCurrency: string; amount: number }): Promise<SwapRateOutput>;

// Sensitive — resolves the `client` wallet's stored password. Auth gate: `swap`.
function executeSwap(params: { fromCurrency: string; toCurrency: string; amount: number; client: string }): Promise<ToroRawResult>;
```

**Throws:** `AuthBlockedError`, `NetworkError`, `APIError`.

---

## React Hooks

> Import from `torosdk-expo`. All hooks require a `<ToronetProvider>` ancestor. Built on `@tanstack/react-query` v5.

---

### `useBalance(options)`

Fetches the balance of a single currency.

```ts
function useBalance(options: {
  address: string;
  currency: Currency;
  enabled?: boolean;
}): UseQueryResult<{ currency: Currency; balance: string }>;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `address` | `string` | — | Wallet address |
| `currency` | `Currency` | — | Currency to query |
| `enabled` | `boolean` | `true` | Set to `false` to prevent the query from running (e.g. while address is empty) |

**Stale time:** 30 seconds

**Exposed states:** `isLoading`, `isError`, `error`, `data`, `isSuccess`

---

### `useBalances(options)`

Fetches balances for all 6 currencies.

```ts
function useBalances(options: {
  address: string;
  enabled?: boolean;
}): UseQueryResult<Array<{ currency: Currency; balance: string }>>;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `address` | `string` | — | Wallet address |
| `enabled` | `boolean` | `true` | Set to `false` to prevent the query from running |

**Stale time:** 30 seconds

**Exposed states:** `isLoading`, `isError`, `error`, `data`, `isSuccess`

---

### `useTransfer()`

Mutation hook for sending transfers.

```ts
function useTransfer(): UseMutationResult<
  { transactionHash: string },
  ToroError,
  {
    senderAddress: string;
    receiverAddress: string;
    amount: string;
    currency: Currency;
  }
>;
```

**Returns:** A TanStack Query mutation object with `mutateAsync`, `isPending`, `isError`, `error`, `isSuccess`.

**Side effect:** On success, invalidates `useBalance` and `useBalances` queries for the sender's address so the UI refreshes automatically.

**Auth gate:** `transfer`

---

### `useWallets()`

Manages the local wallet list (stored in `expo-secure-store`). This is manual state, not TanStack Query — wallet data never goes stale because it's local.

```ts
function useWallets(): {
  all: string[];
  active: string | null;
  isLoading: boolean;
  error: string | null;
  switchWallet: (address: string) => void;
  refetch: () => void;
};
```

| Property | Type | Description |
|----------|------|-------------|
| `all` | `string[]` | All stored wallet addresses |
| `active` | `string \| null` | Currently active wallet address |
| `isLoading` | `boolean` | `true` while reading from SecureStore |
| `error` | `string \| null` | Error message if SecureStore read failed |
| `switchWallet(address)` | `(address: string) => void` | Sets the active wallet and refetches |
| `refetch()` | `() => void` | Re-reads the wallet list from SecureStore |

---

### `useCreateWallet()`

Mutation hook for creating a new wallet.

```ts
function useCreateWallet(): UseMutationResult<
  { address: string },
  ToroError,
  { username: string; password: string }
>;
```

**Side effects on success:**
1. Stores password in `expo-secure-store`
2. Adds address to wallet list
3. Sets the new wallet as active
4. Invalidates all cached queries

**Auth gate:** `wallet-create`

---

### `useImportWallet()`

Mutation hook for importing a wallet from a private key.

```ts
function useImportWallet(): UseMutationResult<
  { address: string },
  ToroError,
  { privateKey: string; password: string }
>;
```

**Side effects on success:**
1. Stores password in `expo-secure-store`
2. Adds address to wallet list
3. Sets the imported wallet as active
4. Invalidates all cached queries

**Auth gate:** `wallet-import`

---

### `useDeleteWallet()`

Mutation hook for removing a wallet.

```ts
function useDeleteWallet(): UseMutationResult<
  void,
  ToroError,
  string  // address to delete
>;
```

**Side effects on success:**
1. Removes password from `expo-secure-store`
2. Removes address from wallet list
3. If the active wallet was deleted, clears the active wallet and invalidates all queries

**Auth gate:** `wallet-delete`

---

### `useResolveTNS(name, enabled?)`

Fetches the wallet address for a TNS name.

```ts
function useResolveTNS(
  name: string,
  enabled?: boolean
): UseQueryResult<string>;
```

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | — | TNS name to resolve |
| `enabled` | `boolean` | `true` | Set to `false` while the name is empty |

**Stale time:** 5 minutes

---

### `useLookupTNS(address, enabled?)`

Reverse lookup — finds the TNS name for a wallet address.

```ts
function useLookupTNS(
  address: string,
  enabled?: boolean
): UseQueryResult<string | null>;
```

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `address` | `string` | — | Wallet address |
| `enabled` | `boolean` | `true` | Set to `false` while address is empty |

**Stale time:** 5 minutes

---

### `useSetTNS()`

Mutation hook for registering a TNS name.

```ts
function useSetTNS(): UseMutationResult<
  void,
  ToroError,
  { address: string; name: string }
>;
```

**Side effect:** On success, invalidates `useResolveTNS` and `useLookupTNS` queries.

**Auth gate:** `tns-write`

---

### `useKYCStatus(options)`

Fetches KYC verification status for a wallet.

```ts
function useKYCStatus(options: {
  address: string;
  enabled?: boolean;
}): UseQueryResult<{ status: string; data?: Record<string, unknown> }>;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `address` | `string` | — | Wallet address |
| `enabled` | `boolean` | `true` | Set to `false` while address is empty |

**Stale time:** 5 minutes

---

### `useSubmitKYC()`

Mutation hook for submitting KYC data.

```ts
function useSubmitKYC(): UseMutationResult<
  void,
  ToroError,
  { address: string; data: Record<string, unknown> }
>;
```

**Side effect:** On success, invalidates `useKYCStatus` query.

**Auth gate:** `kyc`

---

### `useExchangeRates()`

Fetches current exchange rates for all currency pairs.

```ts
function useExchangeRates(): UseQueryResult<Array<{ pair: string; rate: string }>>;
```

**Stale time:** 60 seconds

---

### Bridge hooks

Each wraps the corresponding core wrapper. Mutations invalidate the sender's bridge balance queries on success; queries share the 30-second stale time.

```ts
// Mutation — bridge tokens cross-chain.
function useBridgeToken(): UseMutationResult<ToroRawResult, unknown, BridgeTokenVariables>;

// Queries.
function useBridgeTokenFee(options: UseBridgeTokenFeeOptions): UseQueryResult<ToroRawResult>;
function useBridgeBalance(options: UseBridgeBalanceOptions): UseQueryResult<ToroRawResult>;
function useBridgeTokenBalance(options: UseBridgeTokenBalanceOptions): UseQueryResult<ToroRawResult>;
function useBridgeTransactions(options: UseBridgeTransactionsOptions): UseQueryResult<ToroRawResult>;
function useBridgeTokenTransactions(options: UseBridgeTokenTransactionsOptions): UseQueryResult<ToroRawResult>;
```

---

### Solana hooks

```ts
// Mutations.
function useCreateSolanaAddress(): UseMutationResult<ToroRawResult, unknown, void>;
function useCreateToronetSolanaAddress(): UseMutationResult<ToroRawResult, unknown, string>;
function useTransferSolana(): UseMutationResult<ToroRawResult, unknown, TransferSolanaVariables>;
function useTransferSolToken(): UseMutationResult<ToroRawResult, unknown, TransferSolTokenVariables>;

// Queries (30-second stale time).
function useSolBalance(options: UseSolBalanceOptions): UseQueryResult<ToroRawResult>;
function useSolTokenBalance(options: UseSolTokenBalanceOptions): UseQueryResult<ToroRawResult>;
function useSolTransactions(options: UseSolTransactionsOptions): UseQueryResult<ToroRawResult>;
function useSolTokenTransactions(options: UseSolTokenTransactionsOptions): UseQueryResult<ToroRawResult>;
```

`useTransferSolana` invalidates the sender's SOL balance and transactions on success; `useTransferSolToken` invalidates the sender's token balance.

---

### Swap hooks

```ts
function useSwapQuote(options: UseSwapQuoteOptions): UseQueryResult<SwapRateOutput>; // 15-second stale time
function useSwap(): UseMutationResult<ToroRawResult, unknown, SwapVariables>;        // invalidates client balances
```

---

## Auth Strategies

> Import from `torosdk-expo/core`.

### `AuthStrategy` (interface)

```ts
interface AuthStrategy {
  authorize(operation: OperationCategory): Promise<boolean>;
}
```

The single-method interface that all strategies implement. Returns `true` to allow the operation, `false` to block it (which throws `AuthBlockedError`).

---

### `createPasswordStrategy()`

Silent passthrough — always returns `true`. Use when you want stored-password authentication with no additional user prompt.

```ts
function createPasswordStrategy(): AuthStrategy;
```

**When to use:** Simple apps, development, or when you handle auth at a different layer (e.g. PIN lock screen).

**Example:**
```ts
import { createPasswordStrategy } from 'torosdk-expo/core';

const auth = createPasswordStrategy();
// All operations proceed without additional prompts
```

---

### `createBiometricStrategy(options)`

Gates operations by category using `expo-local-authentication` (Face ID / Touch ID / fingerprint).

```ts
function createBiometricStrategy(options: {
  requireFor?: OperationCategory[];
  skipFor?: OperationCategory[];
}): AuthStrategy;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `requireFor` | `OperationCategory[]` | `[]` | Operations that MUST pass biometric before proceeding |
| `skipFor` | `OperationCategory[]` | `[]` | Operations that skip biometric (even if in `requireFor`) |

**Resolution order:**
1. If the operation is in `skipFor` → allow immediately
2. If the operation is in `requireFor` → require biometric
3. Otherwise → allow (default-allow)

**Example:**
```ts
import { createBiometricStrategy } from 'torosdk-expo/core';

const auth = createBiometricStrategy({
  requireFor: ['transfer', 'kyc', 'tns-write', 'wallet-delete'],
  skipFor: ['balance', 'tns-read', 'exchange-rates'],
});
// Reading balances: no prompt
// Sending a transfer: Face ID required
// Creating a wallet: allowed (not in requireFor, not in skipFor)
```

---

### `createCustomStrategy(fn)`

Escape hatch for custom authentication flows — social login, server-side approval, hardware keys, etc.

```ts
function createCustomStrategy(
  fn: (operation: OperationCategory) => Promise<boolean>
): AuthStrategy;
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `fn` | `(operation: OperationCategory) => Promise<boolean>` | Your async auth function. Return `true` to allow, `false` to block. |

**Example:**
```ts
import { createCustomStrategy } from 'torosdk-expo/core';

const auth = createCustomStrategy(async (operation) => {
  if (operation === 'transfer') {
    // Prompt user with a custom confirmation modal
    return await myCustomConfirmDialog(`Allow transfer?`);
  }
  return true; // allow everything else
});
```

---

### `setAuthStrategy(strategy)`

Sets the global auth strategy singleton. Called automatically by `ToronetProvider`, but available for non-React usage.

```ts
function setAuthStrategy(strategy: AuthStrategy): void;
```

### `getAuthStrategy()`

Returns the current global auth strategy. Throws if not set.

```ts
function getAuthStrategy(): AuthStrategy;
```

---

## Storage Utilities

> Import from `torosdk-expo/core`. All storage is backed by `expo-secure-store` (iOS Keychain / Android Keystore).

---

### `getPassword(address)`

Retrieves the stored password for a wallet.

```ts
function getPassword(address: string): Promise<string | null>;
```

**Returns:** The stored password string, or `null` if none is stored.

**Throws:** `StorageError` if SecureStore read fails for a reason other than "not found."

---

### `setPassword(address, password)`

Stores a wallet password securely.

```ts
function setPassword(address: string, password: string): Promise<void>;
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | `string` | Wallet address (used as part of the storage key) |
| `password` | `string` | Password to store (must be non-empty after trim) |

**Throws:** `StorageError` if the password is empty or whitespace-only, or if SecureStore write fails.

**Remarks:** Storage key format: `wallet_pwd_<address>`.

---

### `deletePassword(address)`

Removes a stored wallet password.

```ts
function deletePassword(address: string): Promise<void>;
```

**Throws:** `StorageError` if SecureStore delete fails.

---

### `getWalletList()`

Returns all stored wallet addresses.

```ts
function getWalletList(): Promise<string[]>;
```

**Returns:** Array of wallet address strings. Empty array if none stored.

**Throws:** `StorageError` on SecureStore read failure.

**Remarks:** Stored as a JSON array under key `torosdk_wallets`.

---

### `addWalletToList(address)`

Adds a wallet address to the stored list (idempotent — duplicates are ignored).

```ts
function addWalletToList(address: string): Promise<void>;
```

**Throws:** `StorageError` on SecureStore write failure.

---

### `removeWalletFromList(address)`

Removes a wallet address from the stored list.

```ts
function removeWalletFromList(address: string): Promise<void>;
```

**Throws:** `StorageError` on SecureStore write failure.

---

### `getActiveWallet()`

Returns the currently active wallet address.

```ts
function getActiveWallet(): Promise<string | null>;
```

**Returns:** The active wallet address, or `null` if none set.

**Remarks:** Stored under key `torosdk_active_wallet`.

---

### `setActiveWallet(address)`

Sets the currently active wallet address.

```ts
function setActiveWallet(address: string | null): Promise<void>;
```

Pass `null` to clear.

---

## Config Utilities

> Import from `torosdk-expo/core`.

---

### `createConfig(config)`

Initializes torosdk with the given configuration. Must be called once before any SDK operations.

```ts
function createConfig(config: ToronetConfig): void;
```

| Config field | Type | Default | Description |
|-------------|------|---------|-------------|
| `network` | `'testnet' \| 'mainnet'` | — | Which Toronet network to connect to |
| `apiBaseUrl` | `string` | auto | Override the API endpoint URL |
| `debug` | `boolean` | `false` | Enable debug logging |

**Default API URLs:**
- testnet → `http://testnet.toronet.org/api`
- mainnet → `https://api.toronet.org`

**Side effects:**
1. Configures the axios adapter chain (NWConnection → XHR → original)
2. Initializes the underlying `torosdk` with the resolved API URL

---

### `getConfig()`

Returns the current configuration. Throws if `createConfig` has not been called.

```ts
function getConfig(): ToronetConfig;
```

**Throws:** `Error` with message `[torosdk-expo] Config not initialized. Call createConfig() first.`

---

### `getApiBaseUrl()`

Resolves the API base URL from config, falling back to network defaults.

```ts
function getApiBaseUrl(): string;
```

---

## Error Classes

> Import from `torosdk-expo/core`. All SDK errors are instances of `ToroError`.

---

### Class Hierarchy

```
ToroError (base)
├── NetworkError
├── APIError
├── AuthBlockedError
└── StorageError
```

---

### `ToroError`

Base error class for all torosdk-expo errors.

```ts
class ToroError extends Error {
  readonly code: ToroErrorCode;     // 'NETWORK' | 'API' | 'AUTH_BLOCKED' | 'STORAGE'
  readonly detail: string;          // Human-readable description
  readonly cause?: Error;           // Original error that triggered this one
}
```

**`ToroErrorCode` union:**
```ts
type ToroErrorCode = 'NETWORK' | 'API' | 'AUTH_BLOCKED' | 'STORAGE';
```

---

### `NetworkError`

Thrown when a network request fails at the transport level — DNS resolution failures, TCP connection timeouts, socket drops, or fetch errors.

```ts
class NetworkError extends ToroError {
  readonly code: 'NETWORK';
}
```

**When you'll see it:** No internet, Toronet API is down, DNS resolution failure, TLS handshake failure.

---

### `APIError`

Thrown when the Toronet API returns a non-2xx HTTP response.

```ts
class APIError extends ToroError {
  readonly code: 'API';
  readonly status: number;  // HTTP status code (e.g. 400, 404, 500)
}
```

**When you'll see it:** Invalid parameters (400), wallet not found (404), server error (500), insufficient balance for transfer.

---

### `AuthBlockedError`

Thrown when the auth strategy denies an operation — user canceled biometric, custom strategy returned `false`, etc.

```ts
class AuthBlockedError extends ToroError {
  readonly code: 'AUTH_BLOCKED';
  readonly operation: string;  // The OperationCategory that was blocked (e.g. 'transfer')
}
```

**When you'll see it:** User cancels Face ID prompt, custom auth function returns `false`.

---

### `StorageError`

Thrown when `expo-secure-store` operations fail (Keychain/Keystore errors).

```ts
class StorageError extends ToroError {
  readonly code: 'STORAGE';
}
```

**When you'll see it:** Keychain access denied, SecureStore unavailable (simulator without SecureStore), disk full.

---

### Usage Pattern

```ts
import {
  ToroError, NetworkError, APIError,
  AuthBlockedError, StorageError,
} from 'torosdk-expo/core';

try {
  await transfer.mutateAsync({ ... });
} catch (err) {
  if (err instanceof AuthBlockedError) {
    showToast('Biometric confirmation required');
  } else if (err instanceof APIError && err.status === 400) {
    showToast('Invalid transfer details');
  } else if (err instanceof NetworkError) {
    showToast('Connection error — check your internet');
  } else if (err instanceof StorageError) {
    showToast('Failed to access secure storage');
  } else if (err instanceof ToroError) {
    console.error('ToroError:', err.code, err.detail);
  }
}
```

---

## Types & Interfaces

> Import from `torosdk-expo/core`.

---

### `ToronetNetwork`

```ts
type ToronetNetwork = 'testnet' | 'mainnet';
```

---

### `ToronetConfig`

```ts
interface ToronetConfig {
  network: ToronetNetwork;
  apiBaseUrl?: string;   // override the default API endpoint
  debug?: boolean;        // enable debug logging (default: false)
}
```

---

### `OperationCategory`

The 15 categories used by auth gating. Each hook and SDK function declares its category.

```ts
type OperationCategory =
  | 'balance'
  | 'transfer'
  | 'kyc'
  | 'tns-read'
  | 'tns-write'
  | 'exchange-rates'
  | 'wallet-create'
  | 'wallet-import'
  | 'wallet-delete'
  | 'bridge'
  | 'bridge-read'
  | 'swap'
  | 'swap-read'
  | 'solana-transfer'
  | 'solana-read';
```

**Mapping to hooks/functions:**

| Category | Hooks / Functions |
|----------|------------------|
| `balance` | `useBalance`, `useBalances`, `getBalanceForCurrency`, `getBalances` |
| `transfer` | `useTransfer`, `makeTransfer` |
| `kyc` | `useKYCStatus`, `useSubmitKYC`, `getKYCStatus`, `submitKYC` |
| `tns-read` | `useResolveTNS`, `useLookupTNS`, `resolveTNS`, `lookupTNS` |
| `tns-write` | `useSetTNS`, `setTNS` |
| `exchange-rates` | `useExchangeRates`, `getExchangeRates` |
| `wallet-create` | `useCreateWallet`, `createWallet`, `createSolanaAddress`, `createToronetSolanaAddress` |
| `wallet-import` | `useImportWallet`, `importWallet` |
| `wallet-delete` | `useDeleteWallet` |
| `bridge` | `useBridgeToken`, `bridgeToken` |
| `bridge-read` | `useBridgeTokenFee`, `useBridgeBalance`, `useBridgeTokenBalance`, `useBridgeTransactions`, `useBridgeTokenTransactions` (and core equivalents) |
| `swap` | `useSwap`, `executeSwap` |
| `swap-read` | `useSwapQuote`, `getSwapQuote` |
| `solana-transfer` | `useTransferSolana`, `useTransferSolToken`, `transferSolana`, `transferSolToken` |
| `solana-read` | `useSolBalance`, `useSolTokenBalance`, `useSolTransactions`, `useSolTokenTransactions` (and core equivalents) |

---

### `Currency` (re-exported from `torosdk`)

```ts
// Re-exported from the torosdk package
enum Currency {
  Naira = 'NGN',
  Dollar = 'USD',
  Shilling = 'KSH',
  Rand = 'ZAR',
  Pound = 'GBP',
  Euro = 'EUR',
}
```

---

## React Context

> Import from `torosdk-expo`.

---

### `<ToronetProvider>`

Root provider component. Initializes SDK config, registers auth strategy, and wraps children in `@tanstack/react-query` `QueryClientProvider`.

```tsx
import { ToronetProvider } from 'torosdk-expo';
import { createPasswordStrategy } from 'torosdk-expo/core';
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `ToronetConfig` | yes | Network selection and optional API base URL |
| `authStrategy` | `AuthStrategy` | yes | Which auth strategy to use for all operations |
| `queryClient` | `QueryClient` | no | Custom TanStack Query client. Default: `new QueryClient({ defaultOptions: { queries: { retry: 2, staleTime: 30_000, refetchOnWindowFocus: true } } })` |
| `children` | `ReactNode` | yes | Your app's React tree |

**Example:**
```tsx
import { ToronetProvider } from 'torosdk-expo';
import { createPasswordStrategy } from 'torosdk-expo/core';

export default function App() {
  return (
    <ToronetProvider
      config={{ network: 'testnet' }}
      authStrategy={createPasswordStrategy()}
    >
      <MainScreen />
    </ToronetProvider>
  );
}
```

---

### `useToronetContext()`

Access the current Toronet config and auth strategy from any descendant component.

```ts
function useToronetContext(): { config: ToronetConfig; authStrategy: AuthStrategy };
```

**Throws:** `Error` if called outside a `<ToronetProvider>`.

**Remarks:** Most apps won't need this directly — prefer the higher-level hooks which access context internally.

---

## Query Keys

> Import from `torosdk-expo`. Structured query keys for manual cache invalidation.

```ts
import { queryKeys } from 'torosdk-expo';
```

| Key | Signature | Description |
|-----|-----------|-------------|
| `queryKeys.all` | `['torosdk']` | Root key — invalidating this refetches ALL torosdk queries |
| `queryKeys.balance(address, currency)` | `['torosdk', 'balance', address, currency]` | Single-currency balance |
| `queryKeys.balances(address)` | `['torosdk', 'balances', address]` | All-currencies balance |
| `queryKeys.transfer()` | `['torosdk', 'transfer']` | Transfer mutation status |
| `queryKeys.resolveTNS(name)` | `['torosdk', 'tns', 'resolve', name]` | TNS name resolution |
| `queryKeys.lookupTNS(address)` | `['torosdk', 'tns', 'lookup', address]` | Reverse TNS lookup |
| `queryKeys.kycStatus(address)` | `['torosdk', 'kyc', address]` | KYC verification status |
| `queryKeys.exchangeRates()` | `['torosdk', 'exchange-rates']` | Exchange rates |

**Example — manual invalidation:**
```ts
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from 'torosdk-expo';

function MyComponent() {
  const queryClient = useQueryClient();

  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.all });
  };

  const refetchBalances = (address: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.balances(address) });
  };
}
```

---

## Entry Points (Package Exports)

| Entry point | Contains | Ideal for |
|-------------|----------|-----------|
| `torosdk-expo` | React hooks, `ToronetProvider`, `useToronetContext`, `queryKeys` | Expo / React Native apps |
| `torosdk-expo/core` | Types, auth strategies, storage, config, all 12 SDK wrappers, error classes | Node.js scripts, tests, non-React code |
| `torosdk-expo/cli` | `npx torosdk-expo init` bootstrap | CLI usage only — never bundled |

---

## Related Resources

- **README.md** — Architecture overview, design decisions, quick-start guide
- **ARCHITECTURE.md** — Deep dive into all 6 design decisions
- **BLOG_POST.md** — "Building Expo dApps on Toronet: From Zero to Transfer in 15 Minutes"
- **example/** — Full 6-screen demo app with PIN auth, biometric unlock, wallet switching
- **[torosdk-expo on GitHub](https://github.com/toroforge/torosdk-expo)**
