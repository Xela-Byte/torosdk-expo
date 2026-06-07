# torosdk-expo

[![npm version](https://img.shields.io/npm/v/torosdk-expo.svg)](https://www.npmjs.com/package/torosdk-expo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-52+-brightgreen.svg)](https://expo.dev/)

torosdk-expo wraps [torosdk](https://www.npmjs.com/package/torosdk) (the Toronet blockchain SDK) for Expo and React Native. It manages wallet passwords in the OS keystore, checks biometrics before sensitive operations, and gives you [TanStack Query v5](https://tanstack.com/query/v5) hooks for every Toronet API endpoint. There's also a CLI that scaffolds your project in one command.

---

## Quick start

```bash
npx torosdk-expo init
```

The CLI detects your Expo project, installs dependencies (`torosdk`, `@tanstack/react-query`, `expo-secure-store`, `expo-local-authentication`), and scaffolds `src/torosdk/` with config, an auth strategy, and a provider component. You pick an auth strategy and start using hooks.

---

## What you get

- **No polyfills.** torosdk uses standard `fetch`. Works natively in Hermes and JSC — no 200 KB+ polyfill overhead.
- **Wallet passwords in the OS keystore.** Passwords sit encrypted in iOS Keychain or Android Keystore via `expo-secure-store`. They're never in React state and never serialized to JSON.
- **Biometric gates on sensitive operations.** Fingerprint or Face ID via `expo-local-authentication` before transfers, wallet deletion, KYC submissions — whichever operations you configure.
- **Typed errors you can switch on.** `ToroError` base class with `NetworkError`, `APIError`, `AuthBlockedError`, and `StorageError` subclasses. Every error has a `code`, a `detail` string, and the original `cause`.
- **TanStack Query v5 hooks.** `useBalance`, `useBalances`, `useTransfer`, `useWallets`, `useCreateWallet`, `useImportWallet`, `useDeleteWallet`, `useResolveTNS`, `useLookupTNS`, `useSetTNS`, `useKYCStatus`, `useSubmitKYC`, `useExchangeRates`. Mutations invalidate related queries automatically.
- **Auth strategies you plug in.** Password (silent SecureStore fill), biometric (OS-level fingerprint / Face ID), or write your own with `createCustomStrategy`.
- **Tree-shakeable subpath exports.** `torosdk-expo` for React hooks, `torosdk-expo/core` for zero-React environments, `torosdk-expo/cli` for the Node.js scaffold script. The CLI never ships to your app bundle.
- **Full TypeScript.** Strict mode, declarations, declaration maps, source maps. No `any` escapes.

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

### Design decisions

| Decision | Why |
|----------|-----|
| TanStack Query v5 for data fetching | Caching, retry, stale-while-revalidate, and mutation-driven invalidation come built in. No hand-rolled async state. |
| Passwords in SecureStore, not React state | Passwords live in the OS keystore encrypted at rest. React state never touches plaintext. |
| Auth strategy pattern | Swapping password for biometric (or custom auth) doesn't touch SDK code. One interface, three implementations shipped. |
| Core separated from React | Scripts, CI jobs, and non-React tooling import from `torosdk-expo/core` without pulling in React or TanStack Query. |
| Per-category operation gating | You choose which operations require biometric: `transfer` yes, `balance` no. Each hook declares its category. |
| Typed error hierarchy | `instanceof` checks beat string matching. `if (err instanceof AuthBlockedError)` reads clearer than checking error codes. |
| CLI as its own entry point | The scaffold script is Node-only. It's invoked via `npx` and never bundled into React Native apps. |
| No polyfills | torosdk uses `fetch`. Hermes supports `fetch` natively. No Buffer, no crypto, no 200 KB of polyfill overhead. |

---

## Prerequisites

- Expo SDK 52+ or bare React Native with `expo` modules
- Node.js 18+ for the CLI
- React 18+ and TanStack Query v5 as peer dependencies
- torosdk v0.2.0+

---

## Installation

```bash
# Recommended: let the CLI set everything up
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

`ToronetProvider` takes an optional `queryClient` prop if you need to customize TanStack Query defaults (retry count, stale time, etc.).

---

## Hooks reference

All hooks need `<ToronetProvider>` (or at minimum `<QueryClientProvider>`) in the component tree.

### Wallet management

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

Returns `WalletsState`:

| Field | Type | Description |
|-------|------|-------------|
| `all` | `string[]` | All stored wallet addresses (lowercase) |
| `active` | `string \| null` | Currently active wallet |
| `switchWallet` | `(address: string) => Promise<void>` | Sets active wallet |
| `addWallet` | `(address: string) => Promise<void>` | Adds wallet to list, refreshes |
| `removeWallet` | `(address: string) => Promise<void>` | Removes wallet from list, refreshes |
| `refresh` | `() => Promise<void>` | Re-reads wallets from SecureStore |
| `isLoading` | `boolean` | True during initial load |
| `error` | `string \| null` | Error message if something failed |

#### `useCreateWallet(username, password)` — Mutation

Creates a new on-chain wallet, stores the password in SecureStore, and adds it to the wallet list.

```tsx
import { useCreateWallet } from 'torosdk-expo';

const mutation = useCreateWallet();
const address = await mutation.mutateAsync({ username: 'alice', password: 's3cret!' });
```

The mutation runs the `wallet-create` auth gate, calls `torosdk.createWallet()`, persists the password, and updates the wallet list atomically.

#### `useImportWallet(privateKey, password)` — Mutation

Imports an existing wallet from a private key.

```tsx
import { useImportWallet } from 'torosdk-expo';

const mutation = useImportWallet();
const address = await mutation.mutateAsync({ privateKey: '0x...', password: 's3cret!' });
```

#### `useDeleteWallet()` — Mutation

Removes a wallet's password from SecureStore and drops the address from the wallet list. Runs the `wallet-delete` auth gate.

```tsx
import { useDeleteWallet } from 'torosdk-expo';

const mutation = useDeleteWallet();
await mutation.mutateAsync('0xaddress');
```

---

### Balance

#### `useBalance({ address, currency, enabled? })`

Fetches the balance for a single currency.

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

Returns a TanStack Query result with `{ balance: string; currency: Currency }`.

#### `useBalances({ address, enabled? })`

Fetches all 6 currencies (NGN, USD, KSH, ZAR, GBP, EUR) in parallel.

```tsx
import { useBalances } from 'torosdk-expo';

function AllBalances() {
  const { data, isLoading } = useBalances({ address: '0x...' });
  // data: Array<{ balance: string; currency: Currency }>
}
```

Returns a TanStack Query result with `Array<{ balance: string; currency: Currency }>`.

---

### Transfers

#### `useTransfer()` — Mutation

Sends funds from one wallet to another. The biometric gate fires automatically if you configured it for `transfer`.

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
      // err may be AuthBlockedError (user canceled biometric), NetworkError, or APIError
    }
  };

  return <Button onPress={send} disabled={isPending} title={isPending ? 'Sending...' : 'Send'} />;
}
```

On success, the sender's balance queries are invalidated automatically through TanStack Query.

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

5-minute stale time. Disabled when `name` is empty.

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

On success, invalidates resolve and lookup queries for the affected name / address.

---

### KYC

#### `useKYCStatus({ address, enabled? })` — Query

Checks KYC verification status for an address.

```tsx
import { useKYCStatus } from 'torosdk-expo';

const { data, isLoading } = useKYCStatus({ address: '0x...' });
// data: { verified: boolean; details?: unknown }
```

5-minute stale time.

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

On success, invalidates the KYC status query for the address.

---

### Exchange rates

#### `useExchangeRates()` — Query

Fetches live exchange rates for all supported currency pairs.

```tsx
import { useExchangeRates } from 'torosdk-expo';

const { data, isLoading } = useExchangeRates();
// data: Array<{ pair: string; rate: number }>
// Example: [{ pair: 'USD/NGN', rate: 1575.50 }, ...]
```

60-second stale time — TanStack Query refetches automatically when data goes stale.

---

## Package structure

| Entry point | Contains | How you import |
|-------------|----------|----------------|
| `torosdk-expo` | React hooks + ToronetProvider + queryKeys | `import { useBalance } from 'torosdk-expo'` |
| `torosdk-expo/core` | Zero React: types, auth strategies, storage, config, error classes, typed SDK wrappers | `import { createBiometricStrategy } from 'torosdk-expo/core'` |
| `torosdk-expo/cli` | `npx torosdk-expo init` scaffold script (Node.js only) | Invoked via CLI, not imported in app code |

Because hooks, core, and CLI are separate entry points, bundlers (Metro, Webpack) only include what your app actually imports. The CLI entry (~5 KB) never ships to React Native bundles.

---

## Error handling

Every error thrown by this package extends `ToroError` (exported from `torosdk-expo/core`):

```ts
import {
  ToroError,
  NetworkError,
  APIError,
  AuthBlockedError,
  StorageError,
} from 'torosdk-expo/core';
```

| Error class | `code` | When it's thrown |
|-------------|--------|------------------|
| `NetworkError` | `'NETWORK'` | Network timeouts, DNS failures, `fetch` errors |
| `APIError` | `'API'` | Toronet API returns non-2xx status; includes `status` field |
| `AuthBlockedError` | `'AUTH_BLOCKED'` | User canceled biometric or custom strategy denied; includes `operation` field |
| `StorageError` | `'STORAGE'` | SecureStore read / write failures |

All errors have `code` (a `ToroErrorCode`), `detail` (a human-readable string), and optionally `cause` (the underlying error).

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

## Auth strategies

| Strategy | Factory | What it does |
|----------|---------|--------------|
| Password | `createPasswordStrategy()` | Reads stored password from OS keystore silently. Falls back to a prompt callback if none is cached. |
| Biometric | `createBiometricStrategy({ requireFor, skipFor })` | Triggers fingerprint / Face ID before sensitive operations. Falls back to device passcode or password prompt depending on config. |
| Custom | `createCustomStrategy(fn)` | Calls your async function. Wire up social auth, hardware keys, server-side gating — whatever you need. |

### Operation categories

Each hook falls into one category, so you can configure auth gates per operation type:

| Category | Hooks / operations |
|----------|-------------------|
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

What happens:

1. Detects your Expo project root (`app.json` / `app.config.js` / `app.config.ts`)
2. Figures out your package manager (`npm`, `yarn`, or `pnpm`)
3. Installs `torosdk`, `@tanstack/react-query`, `expo-secure-store`, and `expo-local-authentication`
4. Scaffolds `src/torosdk/` with three files:
   - `config.ts` — network config (reads `TOROSDK_NETWORK` from env)
   - `auth.ts` — pre-configured auth strategies (uncomment the one you want)
   - `provider.tsx` — `ToroWrapper` combining config + auth
5. Appends `TOROSDK_NETWORK=testnet` to `.env.example`
6. Prints what to do next

The scaffolded code works immediately — change one line in `auth.ts` to switch from password to biometric.

---

## Example app

The `example/` directory has a complete Expo SDK 52 app that exercises every hook:

| Screen | Hooks used |
|--------|------------|
| `HomeScreen` | `useWallets`, `useCreateWallet`, `useImportWallet`, `useDeleteWallet` |
| `TransferScreen` | `useTransfer`, `useBalance` |
| `TNSScreen` | `useResolveTNS`, `useLookupTNS`, `useSetTNS` |
| `KYCScreen` | `useKYCStatus`, `useSubmitKYC` |
| `ExchangeRatesScreen` | `useExchangeRates` |

It uses expo-router-compatible screen patterns, env-driven config, and shows error handling for each hook.

---

## Testing

```bash
npm test              # 55 tests across 8 suites
npm run test:watch    # Watch mode
npm run typecheck     # Strict TypeScript check, zero errors
npm run build         # Compile to dist/
```

What's covered:

- `__tests__/core/auth.test.ts` — password, biometric, and custom strategies
- `__tests__/core/sdk.test.ts` — all 12 SDK wrappers with error normalization
- `__tests__/core/storage.test.ts` — SecureStore CRUD operations
- `__tests__/react/provider.test.tsx` — context provision and error boundary
- `__tests__/react/useBalance.test.tsx` — single and multi-currency queries
- `__tests__/react/useTransfer.test.tsx` — transfer lifecycle, pending / success / error states
- `__tests__/react/useWallets.test.tsx` — wallet CRUD, empty state, storage failure
- `__tests__/cli/init.test.ts` — CLI detection logic and template generation

---

## Extending

### Add a custom auth strategy

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

Follow the existing pattern (query key → useQuery + SDK call):

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

## API reference

### Core SDK functions (`torosdk-expo/core`)

Every function handles password injection, auth gate checks, and error normalization for you:

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

### Storage functions (`torosdk-expo/core`)

| Function | Description |
|----------|-------------|
| `getPassword(address)` | Retrieve stored password from SecureStore |
| `setPassword(address, password)` | Store password in SecureStore |
| `deletePassword(address)` | Remove password from SecureStore |
| `getWalletList()` | Get all stored wallet addresses |
| `addWalletToList(address)` | Add address (no-op if already present) |
| `removeWalletFromList(address)` | Remove address (no-op if not present) |
| `getActiveWallet()` | Get currently active wallet |
| `setActiveWallet(address)` | Set active wallet |

### Config functions (`torosdk-expo/core`)

| Function | Description |
|----------|-------------|
| `createConfig(config)` | Initialize SDK config (network + API URL) |
| `getConfig()` | Get current config (throws if not initialized) |
| `getApiBaseUrl()` | Get API base URL (with default for network) |

---

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TOROSDK_NETWORK` | Network to connect to (`testnet` or `mainnet`) | `testnet` |

Passwords are stored in the OS keystore, not in env vars, AsyncStorage, or app code. Don't commit secrets to version control.

---

## State of the package

All 12 hooks are implemented (8 queries + 4 mutations), along with 12 core SDK wrappers, the CLI init tool, and a structured error hierarchy. The test suite covers 8 suites with 55 passing tests and zero TypeScript errors. Subpath exports work for tree-shaking. There's a complete example Expo SDK 52 app in `example/`.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Make sure `npm test` and `npm run typecheck` pass
5. Open a pull request

---

## License

MIT © ToroForge Collective

---

Built for the Toronet ecosystem. Questions? Find us on [Toronet Discord](https://discord.gg/toronet) or open an issue on GitHub.
