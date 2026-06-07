# torosdk-expo: Design Specification

**Date:** 2026-06-07
**Status:** Draft
**Project:** React Native / Expo wrapper around torosdk npm package (v0.2.0)

---

## 1. Overview

`torosdk-expo` is a thin, typed React Native / Expo wrapper around the official [`torosdk`](https://www.npmjs.com/package/torosdk) npm package (v0.2.0, ToroForge Collective). It provides Expo-compatible wallet management, multi-currency balances, transfers, TNS name resolution, KYC checks, and exchange rates via TanStack Query hooks and `expo-secure-store` for password storage.

### Critical Discovery

After inspecting torosdk's compiled source (6,290 lines, CJS build), we confirmed that **torosdk is purely an HTTP REST client**. It contains zero local crypto operations — all 200+ exported functions are thin wrappers around `axios` calls to `api.toronet.org`. Key implications:

- **No crypto polyfills needed** — all key generation, signing, and verification happens server-side
- **No Buffer polyfill needed** — Buffer is never imported or used
- **`axios` is the only dependency** — works natively in React Native / Hermes
- **Hermes compatibility is straightforward** — no shims required

This discovery dramatically simplifies the wrapper's scope. The work shifts from "make crypto work in Hermes" to "provide secure password storage, typed SDK wrappers, and hook-based reactive state."

### Scope

The project has two deliverables:
1. **`torosdk-expo` npm package** — the runtime library with core + React hooks + CLI init
2. **`example/` Expo demo app** — a working Expo SDK 52 app exercising every integration point

Both live in the same repository, separate folders.

---

## 2. Package Architecture

```
torosdk-expo/
├── package.json
├── tsconfig.json
├── README.md
├── DEVELOPER_STORY.md
├── .env.example
├── src/
│   ├── core/           ← Zero React. Pure TS + torosdk + expo-secure-store.
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── config.ts
│   │   ├── storage.ts
│   │   ├── auth.ts
│   │   ├── sdk.ts
│   │   └── errors.ts
│   ├── react/          ← React bindings. Peer-depends on @tanstack/react-query.
│   │   ├── index.ts
│   │   ├── provider.tsx
│   │   ├── query-keys.ts
│   │   └── hooks/
│   │       ├── useWallets.ts
│   │       ├── useBalance.ts
│   │       ├── useTransfer.ts
│   │       ├── useTNS.ts
│   │       ├── useKYC.ts
│   │       └── useExchangeRates.ts
│   └── cli/            ← Init script (runs in Node, never bundled for mobile)
│       ├── init.ts
│       └── templates/
│           ├── config.ts.template
│           ├── auth.ts.template
│           └── provider.tsx.template
├── example/            ← Standalone Expo SDK 52 demo app
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── App.tsx
│   └── src/
│       ├── torosdk/
│       │   ├── config.ts
│       │   ├── auth.ts
│       │   └── provider.tsx
│       └── screens/
│           ├── HomeScreen.tsx
│           ├── CreateWalletScreen.tsx
│           ├── TransferScreen.tsx
│           ├── TNSScreen.tsx
│           ├── KYCScreen.tsx
│           └── ExchangeRatesScreen.tsx
└── __tests__/
    ├── core/
    │   ├── sdk.test.ts
    │   ├── storage.test.ts
    │   └── auth.test.ts
    ├── react/
    │   ├── useBalance.test.ts
    │   ├── useTransfer.test.ts
    │   ├── useWallets.test.ts
    │   └── provider.test.ts
    └── cli/
        └── init.test.ts
```

### Module Exports

`package.json` uses subpath exports for clean separation:

```json
{
  "name": "torosdk-expo",
  "exports": {
    ".": {
      "types": "./dist/react/index.d.ts",
      "default": "./dist/react/index.js"
    },
    "./core": {
      "types": "./dist/core/index.d.ts",
      "default": "./dist/core/index.js"
    },
    "./cli": "./dist/cli/init.js"
  },
  "peerDependencies": {
    "expo-secure-store": ">=12.0.0",
    "expo-local-authentication": ">=14.0.0",
    "@tanstack/react-query": ">=5.0.0"
  }
}
```

- **`torosdk-expo`** (`.`) — React hooks: `useBalance`, `useTransfer`, `useWallets`, etc.
- **`torosdk-expo/core`** — Zero React. Typed SDK wrappers, auth strategies, storage utilities.
- **`torosdk-expo/cli`** — The `init` command. CJS entry, runs in Node only.

### Layer Boundaries

- **`core/`** imports from `torosdk`, `expo-secure-store`, `expo-local-authentication`. Never imports React or TanStack Query. Available to devs who want typed SDK calls without hooks.
- **`react/`** imports from `core/` and `@tanstack/react-query`. Provides context-based provider and hooks.
- **`cli/`** is its own entry. Uses `fs`/`path` (Node). Reads the target project, writes scaffold files, prints next steps. Never imported at runtime in the mobile app.
- **`example/`** is a standalone project. Not published to npm. Serves as reference implementation and integration test.

### Dependencies

| Package | Type | Notes |
|---------|------|-------|
| `torosdk` | runtime dependency | v0.2.0, the wrapped SDK |
| `axios` | transitive via torosdk | Not a direct dependency |
| `expo-secure-store` | peer dependency | Must be in host Expo app |
| `expo-local-authentication` | peer dependency (optional) | Only if using biometric strategy |
| `@tanstack/react-query` | peer dependency (react entry only) | Not needed for core |

---

## 3. Auth Strategy

The `AuthStrategy` interface is the gate between the app and stored passwords. The wrapper never reads from SecureStore directly — it asks the auth strategy to authorize the read first.

### Interface

```ts
type OperationCategory = 
  | 'balance' | 'transfer' | 'kyc' 
  | 'tns-read' | 'tns-write' | 'exchange-rates'
  | 'wallet-create' | 'wallet-import' | 'wallet-delete';

interface AuthStrategy {
  /** Called before reading a password from SecureStore.
   *  Returns true = proceed, false = blocked. */
  authorize(operation: OperationCategory): Promise<boolean>;
}
```

### Built-in Strategies

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| `createPasswordStrategy()` | Silent — always returns true, password flows from SecureStore | Simple apps, dev trust |
| `createBiometricStrategy({ requireFor, skipFor })` | Prompts fingerprint/Face ID for listed `requireFor` ops, silent for `skipFor` | Banking, remittance |
| `createCustomStrategy(fn)` | Dev supplies their own `(op) => Promise<boolean>` | Social auth, PIN, custom logic |

### Hook Call Flow (Example: `useTransfer`)

```
1. transfer.mutateAsync({ receiver, amount, currency })
2. Hook reads active wallet address from context
3. Hook calls authStrategy.authorize('transfer')
   - Password strategy → returns true immediately
   - Biometric strategy → OS fingerprint/Face ID prompt
   - Custom strategy → dev's function runs
4. If false → throw AuthBlockedError, password never touched
5. If true → read password from SecureStore at key `wallet_pwd_${address}`
6. Call torosdk makeInterWalletTransfer(address, password, receiver, amount, currency)
7. Password string is garbage-collected — never in React state, never serialized, never logged
```

**Security property:** The password string lives only for the duration of the API call (step 6). It's never stored in React state, never serialized to JSON, never appears in logs. SecureStore holds it encrypted at rest via the OS keychain.

---

## 4. Secure Storage & Wallet Management

The storage layer hides all SecureStore interaction behind typed get/set/delete functions. No other module touches SecureStore directly.

### Storage Keys

```
torosdk_wallets          → JSON array of wallet addresses  ["0x7a9f...", "0x3bc2..."]
torosdk_active_wallet    → currently selected address      "0x7a9f..."
wallet_pwd_0x7a9f...     → encrypted password for wallet   "<password>"
```

### Storage API (`core/storage.ts`)

```ts
getPassword(address: string): Promise<string | null>
setPassword(address: string, password: string): Promise<void>
deletePassword(address: string): Promise<void>
getWalletList(): Promise<string[]>
addWalletToList(address: string): Promise<void>
removeWalletFromList(address: string): Promise<void>
getActiveWallet(): Promise<string | null>
setActiveWallet(address: string): Promise<void>
```

### Wallet Lifecycle

**Create:**
```
createWallet({ password })
  → torosdk API call succeeds, returns address
  → setPassword(address, password)         // API verified the password
  → addWalletToList(address)
  → setActiveWallet(address)
  → return address
```

**Import:**
```
importWallet({ privateKey, password })
  → torosdk API call succeeds, returns address  // API verified key+password
  → setPassword(address, password)
  → addWalletToList(address)
  → setActiveWallet(address)
  → return address
```

**Delete:**
```
deleteWallet(address)
  → authStrategy.authorize('wallet-delete')
  → deletePassword(address)
  → removeWalletFromList(address)
  → if activeWallet === address, setActiveWallet(next in list or null)
```

### `useWallets()` Hook

```ts
interface WalletsState {
  all: string[];                    // all stored address strings
  active: string | null;            // currently selected
  switch: (address: string) => void; // changes active, persists to SecureStore
  add: (address: string) => void;
  remove: (address: string) => void;
}
```

**Why separate storage for list vs passwords:** The wallet list can be read without triggering any auth gate. Only reading a specific password triggers the auth strategy. This lets the wallet picker UI render without biometric prompts.

---

## 5. Hooks & Query Layer

Each hook wraps a torosdk call in TanStack Query, injects the password via the auth strategy, and exposes a typed result.

### Query Key Convention

```ts
const queryKeys = {
  balance: (address: string, currency: string) => ['torosdk', 'balance', address, currency] as const,
  exchangeRates: () => ['torosdk', 'exchange-rates'] as const,
  kycStatus: (address: string) => ['torosdk', 'kyc', address] as const,
  resolveTNS: (name: string) => ['torosdk', 'tns', 'resolve', name] as const,
  lookupTNS: (address: string) => ['torosdk', 'tns', 'lookup', address] as const,
};
```

Keys are scoped by wallet address so switching wallets invalidates the right caches automatically.

### Hook Signatures

```ts
// Balance
useBalance({ address, currency }: { address: string; currency: Currency })
useBalances({ address }: { address: string })  // all 6 currencies in parallel

// Transfers
useTransfer()  // mutation, auth.authorize('transfer'), invalidates balances on success

// TNS
useResolveTNS(name: string)         // name → address, read-only
useLookupTNS(address: string)       // address → name, read-only
useSetTNS()                         // mutation, auth.authorize('tns-write')

// KYC
useKYCStatus({ address }: { address: string })
useSubmitKYC()                      // mutation, auth.authorize('kyc')

// Exchange Rates
useExchangeRates()                  // stale time 60s, refetch on focus

// Wallets
useWallets()                        // from context + SecureStore, not a TanStack query

// Wallet Operations
useCreateWallet()                   // mutation → stores password + adds to list
useImportWallet()                   // mutation, same flow
useDeleteWallet()                   // mutation, auth.authorize('wallet-delete')
```

### Provider

```tsx
<ToronetProvider
  config={{ network: 'testnet' }}  // or 'mainnet'
  authStrategy={myAuthStrategy}
>
  {children}
</ToronetProvider>
```

The provider holds config, auth strategy, and wraps TanStack's `QueryClientProvider`. Each hook reads from context.

### Stale Time Defaults

| Query | Stale Time | Reason |
|-------|-----------|--------|
| Balance | 30s | Reasonable freshness for balances |
| Exchange rates | 60s | API aggregates, not tick-level data |
| KYC status | 5 min | KYC status changes rarely |
| TNS read | 5 min | Name mappings are stable |

---

## 6. Error Handling

### Error Types (`core/errors.ts`)

```ts
class ToroError extends Error {
  code: 'NETWORK' | 'API' | 'AUTH_BLOCKED' | 'STORAGE';
  detail: string;
  cause?: unknown;
}

class NetworkError extends ToroError {
  code = 'NETWORK';  // axios no-connection, timeout, DNS failure
}

class APIError extends ToroError {
  code = 'API';      // torosdk returned 4xx/5xx
  status?: number;
}

class AuthBlockedError extends ToroError {
  code = 'AUTH_BLOCKED';  // authorize() returned false
  operation: OperationCategory;
}

class StorageError extends ToroError {
  code = 'STORAGE';  // SecureStore read/write failure (rare, OS-level)
}
```

### Error Propagation

- **Core layer** — catches axios errors and torosdk response errors, wraps them in typed `ToroError` subclasses
- **Hook layer** — errors propagate through TanStack Query's `error` state
- **Screen layer** — pattern-match on `error.code` to render appropriate UI:

```tsx
if (balance.isError && balance.error.code === 'NETWORK') {
  return <OfflineBanner />;
}
if (balance.isError && balance.error.code === 'AUTH_BLOCKED') {
  return <Text>Biometric verification required</Text>;
}
```

### Expo-Specific Edge Cases

- **App backgrounded:** TanStack Query's `refetchOnWindowFocus` becomes `refetchOnAppStateChange` via a plugin in the provider
- **SecureStore unavailable:** On very old devices, returns null. Caught with a clear `StorageError` and guidance
- **Simulator biometrics:** `expo-local-authentication` returns `{ success: false, error: 'not_enrolled' }` on simulators. Biometric strategy handles this gracefully

---

## 7. CLI Init Flow

The CLI ships as `torosdk-expo/cli` and runs via `npx torosdk-expo init`. It runs in Node, never bundled into the mobile app.

### What `npx torosdk-expo init` Does

1. **Detect Expo project**
   - Read `app.json` / `app.config.js` to confirm it's an Expo project
   - Detect SDK version
   - Abort with clear message if not in an Expo project root

2. **Install dependencies**
   - `npm install torosdk @tanstack/react-query expo-secure-store expo-local-authentication`
   - Detect yarn/pnpm if lock files exist, use the right package manager

3. **Scaffold files into `src/torosdk/`**
   - `config.ts` — typed config with env vars
   - `provider.tsx` — ToronetProvider wrapping the app
   - `auth.ts` — stub with comments showing all three strategy options

4. **Append to `.env.example`**
   - `TOROSDK_NETWORK=testnet`

5. **Print summary**
   - ✅ Dependencies installed
   - ✅ Config scaffolded at `src/torosdk/`
   - 📋 Next steps with instructions

### Edge Cases Handled

- `src/torosdk/` already exists → asks before overwriting
- Missing `app.json` → warns but continues
- Network offline → fails early with clear message
- Expo SDK < 50 → warns about potential Metro subpath export issues

### CLI is Not Imported at Runtime

The `package.json#exports` routes `torosdk-expo/cli` to a separate CJS entry that Metro never sees. No `fs`/`path` in the app bundle.

---

## 8. Example App

Located at `example/`, a standalone Expo SDK 52 project. Imports `torosdk-expo` and exercises every hook and flow. Configured for testnet — no real money, no real credentials.

### Screens

| Screen | Hooks Used | What It Demos |
|--------|-----------|---------------|
| HomeScreen | `useWallets`, `useBalances` | Wallet picker, 6-currency balance dashboard, pull-to-refresh, wallet switching |
| CreateWalletScreen | `useCreateWallet`, `useImportWallet`, `useDeleteWallet` | Full wallet lifecycle with error states |
| TransferScreen | `useTransfer`, `useBalance` | Pick currency, enter address/amount, biometric gate fires, success/failure |
| TNSScreen | `useResolveTNS`, `useLookupTNS`, `useSetTNS` | Name→address resolution, reverse lookup, name registration |
| KYCScreen | `useKYCStatus` | KYC status check for any address, provider info |
| ExchangeRatesScreen | `useExchangeRates` | Live rate table, auto-refreshes |

### App.tsx Wiring

```tsx
export default function App() {
  return (
    <ToroWrapper>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
          <Stack.Screen name="Transfer" component={TransferScreen} />
          <Stack.Screen name="TNS" component={TNSScreen} />
          <Stack.Screen name="KYC" component={KYCScreen} />
          <Stack.Screen name="ExchangeRates" component={ExchangeRatesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToroWrapper>
  );
}
```

### Development Connection

During development, the example app connects to the local `torosdk-expo` package via a relative path or yarn workspace link — not a published npm install. It serves as both the demo and the manual integration test.

---

## 9. Testing Strategy

| Layer | Tool | Strategy |
|-------|------|----------|
| `core/sdk.ts` | Jest | Mock axios, verify URL + params construction, error normalization |
| `core/storage.ts` | Jest + SecureStore mock | Key formation, list management, error passthrough |
| `core/auth.ts` | Jest + LocalAuthentication mock | Each strategy's authorize() flow, biometric fallback paths |
| `react/hooks/` | Jest + @testing-library/react-native | Render hooks with test provider, mock core, verify query keys, stale times, mutation invalidation |
| `react/provider.tsx` | @testing-library/react-native | Context propagation, config changes |
| `cli/init.ts` | Jest | Scaffold into temp dir, verify file contents, overwrite prompt |

No E2E tests — the example app serves as the manual integration test and video demo.

---

## 10. Excluded from Scope

- Native modules — pure JS/TS
- Monorepo tooling (turborepo, nx, lerna) — single package + example is simple enough
- Custom auth implementations — we ship the interface and built-in strategies, devs build their own via `createCustomStrategy`
- Offline signing / local key management — torosdk does this server-side
- New API endpoints — torosdk covers the full Toronet API surface; we wrap, we don't extend

---

## 11. Submission Deliverables Mapping

| Requirement | How We Meet It |
|-------------|---------------|
| Public GitHub repo | This repository |
| Comprehensive README | Covers architecture, prerequisites, setup, how to extend |
| Inline documentation | Every hook, core function, and SDK integration point documented |
| 3-8 min YouTube demo | Recorded from the `example/` app, "Toronet" in title |
| Architecture diagram | Included in README (wrapper → SDK → Toronet API relationship) |
| 500-1000 word technical decisions write-up | Separate doc covering the "why axios-only means no polyfills" discovery, auth strategy design, subpath exports, choice of SecureStore over AsyncStorage |
| Clone → running < 30 min | `npx torosdk-expo init` does the heavy lifting; example app runs immediately |
| No stubs or hardcoded credentials | All config via env vars; testnet by default |
| Production-grade | Typed, tested, documented, consistent naming, clear separation of concerns |
