# torosdk-expo

[![npm version](https://img.shields.io/npm/v/torosdk-expo.svg)](https://www.npmjs.com/package/torosdk-expo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-52+-brightgreen.svg)](https://expo.dev/)
[![Tests](https://img.shields.io/badge/tests-55%20passing-success.svg)](./__tests__)

**Production-grade Expo / React Native wrapper around [torosdk](https://www.npmjs.com/package/torosdk)** — the official Toronet blockchain SDK. Secure password management via OS-native keystores, biometric-gated transactions, [TanStack Query v5](https://tanstack.com/query/v5) hooks with automatic cache invalidation, structured error handling, and a one-command CLI project scaffold.

---

## Quick Start

```bash
npx torosdk-expo init
```

This detects your Expo project, installs dependencies (`torosdk`, `@tanstack/react-query`, `expo-secure-store`, `expo-local-authentication`), and scaffolds `src/torosdk/` with config, auth strategy, and a provider wrapper ready to use.

---

## Features

- **Zero polyfills** — torosdk uses standard `fetch`; works natively in Hermes and JSC — no 200KB+ polyfill tax
- **Secure password storage** — wallet passwords encrypted at rest via iOS Keychain / Android Keystore through `expo-secure-store`
- **Biometric gates** — fingerprint / Face ID verification before transfers and sensitive operations via `expo-local-authentication`
- **Structured error hierarchy** — `ToroError` base class with typed subclasses (`NetworkError`, `APIError`, `AuthBlockedError`, `StorageError`) for granular error handling
- **TanStack Query v5 hooks** — `useBalance`, `useBalances`, `useTransfer`, `useWallets`, `useCreateWallet`, `useImportWallet`, `useDeleteWallet`, `useResolveTNS`, `useLookupTNS`, `useSetTNS`, `useKYCStatus`, `useSubmitKYC`, `useExchangeRates`
- **Configurable auth strategies** — password (silent SecureStore fill), biometric (OS-level fingerprint / Face ID), or bring-your-own custom strategy
- **Automatic cache invalidation** — mutations (transfer, TNS set, wallet create / delete) invalidate related queries seamlessly
- **CLI init** — one command scaffolds config, auth, and provider; auto-detects `npm` / `yarn` / `pnpm`
- **Full TypeScript support** — strict mode, declarations, source maps, `noUnusedLocals`, `noUnusedParameters`
- **Subpath exports** — tree-shakeable: `torosdk-expo` (React), `torosdk-expo/core` (zero React), `torosdk-expo/cli` (Node)

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Your Expo App                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           torosdk-expo (React hooks)                    │  │
│  │  useBalance / useBalances   useTransfer   useWallets   │  │
│  │  useTNS (resolve/lookup/set)   useKYCStatus/submitKYC  │  │
│  │  useExchangeRates   useCreateWallet/Import/Delete      │  │
│  │                                                        │  │
│  │  ToronetProvider                                        │  │
│  │  ├─ ToronetContext (config + auth strategy)            │  │
│  │  └─ QueryClientProvider (TanStack Query v5)            │  │
│  └──────────────┬─────────────────────────────────────────┘  │
│                 │                                              │
│  ┌──────────────▼─────────────────────────────────────────┐  │
│  │           torosdk-expo/core (zero React)                │  │
│  │                                                         │  │
│  │  Auth Strategies           Storage Layer                │  │
│  │  ├─ createPassword         ├─ SecureStore CRUD          │  │
│  │  ├─ createBiometric        │  (wallet_pwd_<addr>)       │  │
│  │  └─ createCustom           │  (torosdk_wallets list)    │  │
│  │                             │  (torosdk_active_wallet)   │  │
│  │  SDK Wrappers              │                            │  │
│  │  ├─ createWallet           ├─ Config                   │  │
│  │  ├─ importWallet           │  (network + apiBaseUrl)    │  │
│  │  ├─ makeTransfer           │                            │  │
│  │  ├─ getBalance(s)          ├─ Errors                   │  │
│  │  ├─ resolve/lookup/setTNS  │  ToroError hierarchy      │  │
│  │  ├─ getKYCStatus/submit    │  NETWORK | API | AUTH_     │  │
│  │  └─ getExchangeRates       │  BLOCKED | STORAGE        │  │
│  └──────┬──────────────┬──────────────────────────────────┘  │
│         │              │                                      │
│  ┌──────▼──────┐ ┌─────▼──────────┐                          │
│  │   torosdk   │ │expo-secure-store│                          │
│  │  (HTTP/REST)│ │  (Keychain/     │                          │
│  │             │ │   Keystore)     │                          │
│  └──────┬──────┘ └────────────────┘                          │
│         │                                                     │
│  ┌──────▼──────┐ ┌───────────────┐                           │
│  │ Toronet API │ │ expo-local-   │                           │
│  │  (testnet /  │ │ authentication│                           │
│  │   mainnet)   │ │ (biometric)   │                           │
│  └─────────────┘ └───────────────┘                           │
└──────────────────────────────────────────────────────────────┘
```

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| **TanStack Query v5** | Industry-standard async state management; built-in caching, retry, stale-while-revalidate, and mutation invalidation |
| **Password in SecureStore, not in-memory** | Passwords are encrypted at rest via OS-native mechanisms; React state never holds plaintext passwords |
| **Auth strategy pattern** | Decouples authentication from SDK calls; developers choose password / biometric / custom without SDK code changes |
| **Separate core from React** | Tree-shakeable; non-React environments (Node scripts, CI) can use `torosdk-expo/core` directly |
| **Operation categories** | Fine-grained control over which operations require biometric verification (`transfer`, `kyc`, `tns-write`, etc.) |
| **Structured error hierarchy** | `instanceof` checks for precise error handling: `if (err instanceof AuthBlockedError)` for UX, `if (err instanceof APIError)` for status codes |
| **CLI as separate entry point** | The scaffold script never ships to React Native bundles; it's Node-only and invoked via `npx` |
| **No polyfills** | torosdk uses standard `fetch` — works in Hermes natively; avoids the 200KB+ polyfill tax |

---

## Prerequisites

- **Expo SDK 52+** or bare React Native with `expo` modules
- **Node.js 18+** for the CLI init script
- **React 18+** and **TanStack Query v5** as peer dependencies
- **torosdk v0.2.0+** — the underlying Toronet blockchain SDK

---

## Installation

```bash
# Auto-install with the CLI (recommended):
npx torosdk-expo init

# Or install manually:
npm install torosdk-expo torosdk @tanstack/react-query expo-secure-store

# Optional: biometric support
npm install expo-local-authentication
```

---

## Setup

### 1. Create config

```ts
// src/torosdk/config.ts
import type { ToronetConfig } from 'torosdk-expo/core';

export const config: ToronetConfig = {
  network: 'testnet', // or 'mainnet'
  // apiBaseUrl: 'https://custom.toronet.org', // optional override
};
```

### 2. Choose an auth strategy

```ts
// src/torosdk/auth.ts
import {
  createPasswordStrategy,
  createBiometricStrategy,
  createCustomStrategy,
  type AuthStrategy,
} from 'torosdk-expo/core';

// Option A: Password — silent fill from SecureStore (simplest)
export const authStrategy: AuthStrategy = createPasswordStrategy();

// Option B: Biometric — fingerprint / Face ID for sensitive operations
// export const authStrategy: AuthStrategy = createBiometricStrategy({
//   requireFor: ['transfer', 'kyc', 'tns-write', 'wallet-delete'],
//   skipFor: ['balance', 'tns-read', 'exchange-rates', 'wallet-create', 'wallet-import'],
// });

// Option C: Custom — wire your own auth (social, PIN, server-side)
// export const authStrategy: AuthStrategy = createCustomStrategy(async (operation) => {
//   const userApproved = await myCustomAuthFlow(operation);
//   return userApproved;
// });
```

### 3. Wrap with ToronetProvider

```tsx
// App.tsx
import { ToronetProvider } from 'torosdk-expo';
import { config } from './src/torosdk/config';
import { authStrategy } from './src/torosdk/auth';

export default function App() {
  return (
    <ToronetProvider config={config} authStrategy={authStrategy}>
      <RootNavigator />
    </ToronetProvider>
  );
}
```

`ToronetProvider` accepts an optional `queryClient` prop if you need to customize TanStack Query defaults (retry count, stale time, etc.).

---

## Hooks Reference

All hooks require `<ToronetProvider>` (or at minimum `<QueryClientProvider>`) in the component tree.

### Wallet Management

#### `useWallets()`

Manages stored wallet addresses and active wallet selection.

```tsx
import { useWallets } from 'torosdk-expo';

function WalletPicker() {
  const { all, active, switchWallet, addWallet, removeWallet, refresh, isLoading, error } = useWallets();

  if (isLoading) return <ActivityIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <View>
      {all.map(addr => (
        <TouchableOpacity key={addr} onPress={() => switchWallet(addr)}>
          <Text style={addr === active ? styles.active : styles.inactive}>{addr}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

**Returns:** `WalletsState`

| Field | Type | Description |
|-------|------|-------------|
| `all` | `string[]` | All stored wallet addresses (lowercase) |
| `active` | `string \| null` | Currently active wallet address |
| `switchWallet` | `(address: string) => Promise<void>` | Sets active wallet (throws on error) |
| `addWallet` | `(address: string) => Promise<void>` | Adds wallet to list and refreshes |
| `removeWallet` | `(address: string) => Promise<void>` | Removes wallet from list and refreshes |
| `refresh` | `() => Promise<void>` | Re-reads wallets from SecureStore |
| `isLoading` | `boolean` | `true` during initial load |
| `error` | `string \| null` | Error message if load/operation failed |

#### `useCreateWallet(username, password)` — Mutation

Creates a new on-chain wallet, stores password in SecureStore, and adds to wallet list.

```tsx
import { useCreateWallet } from 'torosdk-expo';

const mutation = useCreateWallet();
const address = await mutation.mutateAsync({ username: 'alice', password: 's3cret!' });
```

The mutation runs the `wallet-create` auth gate, calls `torosdk.createWallet()`, then persists the password and updates the wallet list atomically.

#### `useImportWallet(privateKey, password)` — Mutation

Imports an existing wallet from private key.

```tsx
import { useImportWallet } from 'torosdk-expo';

const mutation = useImportWallet();
const address = await mutation.mutateAsync({ privateKey: '0x...', password: 's3cret!' });
```

#### `useDeleteWallet()` — Mutation

Removes wallet password from SecureStore and removes address from wallet list. Runs the `wallet-delete` auth gate.

```tsx
import { useDeleteWallet } from 'torosdk-expo';

const mutation = useDeleteWallet();
await mutation.mutateAsync('0xaddress');
```

---

### Balance

#### `useBalance({ address, currency, enabled? })`

Fetches balance for a single currency.

```tsx
import { useBalance } from 'torosdk-expo';
import { Currency } from 'torosdk';

function NairaBalance() {
  const { data, isLoading, error } = useBalance({
    address: '0x...',
    currency: Currency.Naira,
  });

  if (isLoading) return <Skeleton />;
  return <Text>₦{data?.balance}</Text>;
}
```

**Returns:** TanStack Query result with `{ balance: string; currency: Currency }`.

#### `useBalances({ address, enabled? })`

Fetches all 6 currencies (NGN, USD, KSH, ZAR, GBP, EUR) in parallel.

```tsx
import { useBalances } from 'torosdk-expo';

function AllBalances() {
  const { data, isLoading } = useBalances({ address: '0x...' });
  // data: Array<{ balance: string; currency: Currency }>
}
```

**Returns:** TanStack Query result with `Array<{ balance: string; currency: Currency }>`.

---

### Transfers

#### `useTransfer()` — Mutation

Sends funds from one wallet to another. Biometric gate fires automatically if configured.

```tsx
import { useTransfer } from 'torosdk-expo';
import { Currency } from 'torosdk';

function SendForm() {
  const { mutateAsync, isPending, isSuccess, isError, error } = useTransfer();

  const send = async () => {
    try {
      const result = await mutateAsync({
        senderAddress: '0xsender',
        receiverAddress: '0xreceiver',
        amount: '100',
        currency: Currency.Naira,
      });
      console.log('TX hash:', result.transactionHash);
    } catch (err) {
      // err may be AuthBlockedError (user canceled biometric) or NetworkError / APIError
    }
  };

  return <Button onPress={send} disabled={isPending} title={isPending ? 'Sending...' : 'Send'} />;
}
```

**On success:** Invalidates balance queries for the sender automatically via TanStack Query cache invalidation.

---

### TNS (Toronet Name Service)

#### `useResolveTNS(name)` — Query

Resolves a TNS name to a wallet address.

```tsx
import { useResolveTNS } from 'torosdk-expo';

function LookupName({ name }: { name: string }) {
  const { data: address, isLoading } = useResolveTNS(name);
  // address: string (wallet address)
}
```

**Cache:** 5-minute stale time. Disabled when `name` is empty.

#### `useLookupTNS(address)` — Query

Reverse lookup: finds the TNS name registered to an address.

```tsx
import { useLookupTNS } from 'torosdk-expo';

// data: string | null (null if no TNS name registered)
const { data: tnsName } = useLookupTNS('0xaddress');
```

#### `useSetTNS()` — Mutation

Registers a TNS name for an address. Runs the `tns-write` auth gate.

```tsx
import { useSetTNS } from 'torosdk-expo';

const mutation = useSetTNS();
await mutation.mutateAsync({ address: '0x...', name: 'alice' });
```

**On success:** Invalidates both resolve and lookup queries for the affected name / address.

---

### KYC

#### `useKYCStatus({ address, enabled? })` — Query

Checks KYC verification status for an address.

```tsx
import { useKYCStatus } from 'torosdk-expo';

const { data, isLoading } = useKYCStatus({ address: '0x...' });
// data: { verified: boolean; details?: unknown }
```

**Cache:** 5-minute stale time.

#### `useSubmitKYC()` — Mutation

Submits KYC data for an address. Runs the `kyc` auth gate.

```tsx
import { useSubmitKYC } from 'torosdk-expo';

const mutation = useSubmitKYC();
await mutation.mutateAsync({
  address: '0x...',
  customerData: { name: 'Alice', country: 'NG' },
});
```

**On success:** Invalidates KYC status query for the address.

---

### Exchange Rates

#### `useExchangeRates()` — Query

Fetches live exchange rates for all supported currency pairs.

```tsx
import { useExchangeRates } from 'torosdk-expo';

const { data, isLoading } = useExchangeRates();
// data: Array<{ pair: string; rate: number }>
// Example: [{ pair: 'USD/NGN', rate: 1575.50 }, ...]
```

**Auto-refresh:** Stale time is 60 seconds — TanStack Query re-fetches automatically when the component mounts and data is stale.

---

## Package Structure

| Entry point | Contains | Import style |
|-------------|----------|-------------|
| `torosdk-expo` | React hooks + `ToronetProvider` + `queryKeys` | `import { useBalance } from 'torosdk-expo'` |
| `torosdk-expo/core` | Zero React: types, auth strategies, storage, config, error classes, typed SDK wrappers | `import { createBiometricStrategy } from 'torosdk-expo/core'` |
| `torosdk-expo/cli` | `npx torosdk-expo init` scaffold script (Node.js only) | Invoked via CLI, not imported in app code |

### Tree-shaking

Because hooks, core, and CLI are separate entry points, bundlers (Metro, Webpack) only include what your app imports. The CLI entry (~5 KB) is never bundled into React Native apps.

---

## Error Handling

All errors thrown by this package extend `ToroError` (exported from `torosdk-expo/core`):

```ts
import {
  ToroError,
  NetworkError,
  APIError,
  AuthBlockedError,
  StorageError,
} from 'torosdk-expo/core';
```

| Error class | `code` | When thrown |
|-------------|--------|-------------|
| `NetworkError` | `'NETWORK'` | Network timeouts, DNS failures, `fetch` errors |
| `APIError` | `'API'` | Toronet API returns non-2xx; includes `status` field |
| `AuthBlockedError` | `'AUTH_BLOCKED'` | User canceled biometric, or custom strategy denied; includes `operation` field |
| `StorageError` | `'STORAGE'` | SecureStore read / write failures |

**All errors have:**
- `code: ToroErrorCode` — machine-readable (`'NETWORK' | 'API' | 'AUTH_BLOCKED' | 'STORAGE'`)
- `detail: string` — human-readable description
- `cause?: unknown` — the original underlying error

**Recommended patterns:**

```ts
try {
  await transfer({ ... });
} catch (err) {
  if (err instanceof AuthBlockedError) {
    showToast('Please authenticate to send funds');
  } else if (err instanceof APIError && err.status === 400) {
    showToast('Invalid transfer request');
  } else if (err instanceof NetworkError) {
    showToast('Connection error — check your internet');
  } else {
    showToast('Unexpected error');
  }
}
```

---

## Auth Strategies

| Strategy | Factory | Security level | Use case |
|----------|---------|---------------|----------|
| Password | `createPasswordStrategy()` | 🔒 Password stored in OS keystore | Development, trusted environments |
| Biometric | `createBiometricStrategy({ requireFor, skipFor })` | 🔒🔒 OS biometric + keystore | Production, untrusted environments |
| Custom | `createCustomStrategy(fn)` | 🔒🔒🔒 You control it | Social auth, hardware keys, server-side gating |

### Operation Categories

Each operation falls into one of these categories for fine-grained auth control:

| Category | Operations |
|----------|-----------|
| `balance` | `useBalance`, `useBalances` |
| `transfer` | `useTransfer` |
| `kyc` | `useKYCStatus`, `useSubmitKYC` |
| `tns-read` | `useResolveTNS`, `useLookupTNS` |
| `tns-write` | `useSetTNS` |
| `exchange-rates` | `useExchangeRates` |
| `wallet-create` | `useCreateWallet` |
| `wallet-import` | `useImportWallet` |
| `wallet-delete` | `useDeleteWallet` |

---

## CLI

```bash
npx torosdk-expo init
```

**What it does:**

1. **Detects** Expo project root (`app.json` / `app.config.js` / `app.config.ts`)
2. **Identifies** package manager (`npm`, `yarn`, or `pnpm`)
3. **Installs** dependencies: `torosdk`, `@tanstack/react-query`, `expo-secure-store`, `expo-local-authentication`
4. **Scaffolds** `src/torosdk/` with three files:
   - `config.ts` — network config (reads `TOROSDK_NETWORK` from env)
   - `auth.ts` — pre-configured auth strategies (uncomment your choice)
   - `provider.tsx` — `ToroWrapper` component combining config + auth
5. **Appends** `TOROSDK_NETWORK=testnet` to `.env.example`
6. **Prints** next-step instructions

The scaffolded code is designed to work immediately — change one line in `auth.ts` to switch from password to biometric.

---

## Example App

See the `example/` directory for a complete Expo SDK 52 application exercising every hook:

| Screen | Hooks demonstrated |
|--------|--------------------|
| `HomeScreen` | `useWallets`, `useCreateWallet`, `useImportWallet`, `useDeleteWallet` |
| `TransferScreen` | `useTransfer`, `useBalance` |
| `TNSScreen` | `useResolveTNS`, `useLookupTNS`, `useSetTNS` |
| `KYCScreen` | `useKYCStatus`, `useSubmitKYC` |
| `ExchangeRatesScreen` | `useExchangeRates` |

The example app uses `expo-router`-compatible screen patterns, environment variable-driven config, and demonstrates error handling for each hook.

---

## Testing

```bash
npm test              # Run all 55 tests across 8 suites
npm run test:watch    # Watch mode
npm run typecheck     # TypeScript strict mode zero-error check
npm run build         # Compile to dist/
```

**Test coverage:**
- `__tests__/core/auth.test.ts` — 3 auth strategies (password, biometric, custom)
- `__tests__/core/sdk.test.ts` — All 12 SDK wrappers with error normalization
- `__tests__/core/storage.test.ts` — SecureStore CRUD operations
- `__tests__/react/provider.test.tsx` — Context provision and error boundary
- `__tests__/react/useBalance.test.tsx` — Single and multi-currency queries
- `__tests__/react/useTransfer.test.tsx` — Transfer lifecycle, pending / success / error states
- `__tests__/react/useWallets.test.tsx` — Wallet CRUD, empty state, storage failure
- `__tests__/cli/init.test.ts` — CLI detection logic and template generation

---

## How to Extend

### Add a new auth strategy

```ts
import { createCustomStrategy } from 'torosdk-expo/core';

export const serverAuthStrategy = createCustomStrategy(async (operation) => {
  const token = await getAuthToken(); // your auth system
  const { allowed } = await api.post('/verify-operation', { operation, token });
  return allowed;
});
```

### Add a custom Toronet API method

Wrap it in `src/core/sdk.ts` following the existing pattern (authorize → call torosdk → wrap errors):

```ts
export async function getTransactionHistory(address: string): Promise<Transaction[]> {
  try {
    await authorizeOperation('balance');
    const result = await torosdk.getTransactionHistory({ address });
    return result as Transaction[];
  } catch (err) {
    wrapError(err);
  }
}
```

### Add a custom hook

Following the existing pattern (query key → useQuery + SDK call):

```ts
import { useQuery } from '@tanstack/react-query';
import { getTransactionHistory } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export function useTransactionHistory(address: string) {
  return useQuery({
    queryKey: queryKeys.transactionHistory(address),
    queryFn: () => getTransactionHistory(address),
    staleTime: 30_000,
    enabled: !!address,
  });
}
```

---

## API Reference

### Core SDK Functions (`torosdk-expo/core`)

All core functions handle password injection, auth gate checks, and structured error normalization automatically:

| Function | Signature | Auth gate |
|----------|-----------|-----------|
| `createWallet` | `(username: string, password: string) => Promise<string>` | `wallet-create` |
| `importWallet` | `(privateKey: string, password: string) => Promise<string>` | `wallet-import` |
| `verifyWalletPassword` | `(address: string, password: string) => Promise<boolean>` | none |
| `getBalanceForCurrency` | `(address: string, currency: Currency) => Promise<{ balance, currency }>` | `balance` |
| `getBalances` | `(address: string) => Promise<Array<{ balance, currency }>>` | `balance` |
| `makeTransfer` | `(sender, receiver, amount, currency) => Promise<{ transactionHash?, reference? }>` | `transfer` |
| `resolveTNS` | `(name: string) => Promise<string>` | `tns-read` |
| `lookupTNS` | `(address: string) => Promise<string \| null>` | `tns-read` |
| `setTNS` | `(address: string, name: string) => Promise<void>` | `tns-write` |
| `getKYCStatus` | `(address: string) => Promise<{ verified, details? }>` | `kyc` |
| `submitKYC` | `(address: string, customerData: Record<string, unknown>) => Promise<unknown>` | `kyc` |
| `getExchangeRates` | `() => Promise<Array<{ pair, rate }>>` | `exchange-rates` |

### Storage Functions (`torosdk-expo/core`)

| Function | Description |
|----------|-------------|
| `getPassword(address)` | Retrieve stored password from SecureStore |
| `setPassword(address, password)` | Store password in SecureStore |
| `deletePassword(address)` | Remove password from SecureStore |
| `getWalletList()` | Get all stored wallet addresses |
| `addWalletToList(address)` | Add address (no-op if exists) |
| `removeWalletFromList(address)` | Remove address (no-op if absent) |
| `getActiveWallet()` | Get currently active wallet |
| `setActiveWallet(address)` | Set active wallet |

### Config Functions (`torosdk-expo/core`)

| Function | Description |
|----------|-------------|
| `createConfig(config)` | Initialize SDK config (network + API URL) |
| `getConfig()` | Get current config (throws if not initialized) |
| `getApiBaseUrl()` | Get API base URL (with default for network) |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TOROSDK_NETWORK` | Network to connect to (`testnet` or `mainnet`) | `testnet` |

**Security note:** Never commit secrets to version control. Wallet passwords are stored in the OS keystore (iOS Keychain / Android Keystore) — not in env vars, not in AsyncStorage, not in app code.

---

## Project Status

- ✅ Complete React hooks (8 queries + 4 mutations)
- ✅ Complete core SDK wrappers (12 functions)
- ✅ CLI init with template scaffold
- ✅ 55 tests passing, zero TypeScript errors
- ✅ Example Expo SDK 52 app
- ✅ Structured error hierarchy
- ✅ Subpath exports for tree-shaking

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for any new functionality
4. Ensure `npm test` and `npm run typecheck` pass
5. Submit a pull request

---

## License

MIT © ToroForge Collective

---

**Built for the Toronet ecosystem.** For questions, find us on [Toronet Discord](https://discord.gg/toronet) or open an issue on GitHub.
