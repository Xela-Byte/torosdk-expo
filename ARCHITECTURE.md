# torosdk-expo Architecture

## Overview

`torosdk-expo` is a typed React Native / Expo SDK 52 wrapper around `torosdk`
(v0.2.0), the official SDK for the Toronet blockchain. It has three entry
points — `torosdk-expo` (React hooks), `torosdk-expo/core` (SDK wrappers), and
`torosdk-expo/cli` (project scaffolding) — so Expo developers get hook-based
access to wallet management, balances, transfers, TNS name resolution, KYC,
and exchange rates.

## Layered Architecture

```
┌──────────────────────────────────────┐
│  torosdk-expo (React entry point)    │
│  Hooks: useBalance, useTransfer,     │
│  useWallets, useTNS, useKYC,         │
│  useExchangeRates, useCreateWallet,  │
│  useImportWallet, useDeleteWallet    │
│  Provider: ToronetProvider           │
│  Query Keys: queryKeys               │
├──────────────────────────────────────┤
│  torosdk-expo/core (SDK entry point) │
│  sdk.ts      — wrapped torosdk calls  │
│  auth.ts     — auth strategy pattern │
│  storage.ts  — SecureStore helpers   │
│  config.ts   — singleton config      │
│  errors.ts   — typed error hierarchy │
│  types.ts    — shared TypeScript     │
├──────────────────────────────────────┤
│  torosdk-expo/cli                    │
│  init.ts     — project bootstrap     │
├──────────────────────────────────────┤
│  torosdk v0.2.0 (upstream)          │
└──────────────────────────────────────┘
```

The package uses npm subpath exports so consumers import only what they need.
A developer who wants the full React experience imports from `torosdk-expo`.
Someone building a non-React Node.js tool imports from `torosdk-expo/core`.
Tree-shaking works because each subpath is an independent barrel.

## Key Design Decisions

### 1. Strategy-pattern authentication

Authentication uses the `AuthStrategy` interface — a single-method contract
(`authorize(category: OperationCategory): Promise<void>`). Three
implementations ship with the package:

- **PasswordStrategy** — reads a previously stored password from
  `expo-secure-store` and presents it silently. If no password is cached, it
  falls back to a user-provided prompt callback.
- **BiometricStrategy** — uses `expo-local-authentication` to trigger
  fingerprint or Face ID. Falls back to device passcode or a password prompt
  depending on configuration.
- **CustomStrategy** — accepts an arbitrary async function, letting
  developers wire in their own auth flow (a server-side challenge, one-time
  codes, whatever they need).

The active strategy lives in a module-level variable and is accessed via
`getAuthStrategy()`. This is deliberately not React context — the core layer
has to work without React. Each sensitive SDK operation calls
`authorizeOperation()` which gates on the strategy before proceeding.

### 2. Typed error hierarchy

Every error that surfaces to a consumer extends `ToroError`, which captures
an error code (`ToroErrorCode`) and the original cause. Four subclasses:

| Class | Code | When |
|-------|------|------|
| `NetworkError` | `NETWORK_ERROR` | fetch fails or times out |
| `APIError` | `API_ERROR` | Toronet returns a non-OK response |
| `AuthBlockedError` | `AUTH_BLOCKED` | user cancels biometric prompt |
| `StorageError` | `STORAGE_ERROR` | SecureStore read/write fails |

The internal `wrapError()` helper in `sdk.ts` catches any thrown value and
normalizes it into the appropriate subclass. Callers can `instanceof`-check
or switch on `error.code`.

### 3. SecureStore-backed credential storage

All persistent secrets — wallet passwords, the wallet address list, and the
active wallet selection — go into `expo-secure-store`, which is backed by the
iOS Keychain and Android Keystore. The storage module exports eight functions:
`getPassword` / `setPassword` / `deletePassword` for individual wallet
credentials, `getWalletList` / `addWalletToList` / `removeWalletFromList` for
the address roster, and `getActiveWallet` / `setActiveWallet` for the
currently selected wallet. All of them throw `StorageError` on failure with
the underlying OS error attached.

### 4. React Query integration

The React layer is built on `@tanstack/react-query` v5. Every read operation
has a corresponding query with an appropriate `staleTime`:

- 30 seconds for balances (they change frequently)
- 60 seconds for exchange rates (moderate volatility)
- 5 minutes for TNS resolution and KYC status (slow-changing)

Mutations — transfer, wallet creation/import/deletion, TNS registration, KYC
submission — use `useMutation` and invalidate the relevant query keys on
success so the UI refetches fresh data automatically. The `queryKeys` object
is a structured, read-only key factory rooted at `['torosdk']`, which keeps
targeted invalidation simple.

### 5. Auth gating on sensitive operations

Not every operation needs authentication. Reads (balance, TNS resolution,
KYC status, exchange rates) proceed without prompting. Writes (transfer, TNS
registration, KYC submission) and wallet lifecycle operations (create,
import, delete) call `authorizeOperation()` first, which invokes the active
`AuthStrategy`. The operation category is passed through so the strategy can
show a meaningful prompt — "Authenticate to send 100 NGN" versus
"Authenticate to create a wallet."

### 6. CLI bootstrap

`torosdk-expo init` detects an Expo project root, figures out the package
manager (npm, yarn, or pnpm), installs the four required peer dependencies,
scaffolds three starter files (`config.ts`, `auth.ts`, `provider.tsx`) into
`src/torosdk/`, and appends `TOROSDK_NETWORK=testnet` to `.env.example`. The
developer then picks an auth strategy, wraps their app, and can use hooks
immediately. The CLI is a plain Node.js script with no dependencies beyond the
Node standard library — it copies template files directly from the installed
package.

## Patterns worth stealing

**Typed wrappers around untyped SDKs.** `torosdk` exports types like
`Currency` (a TypeScript enum) and `ToronetSDK`, but its error handling is
string-based. The `core` layer adds a typed error hierarchy, normalizes every
thrown value, and wraps each public function with proper parameter and return
types. If you're integrating a third-party library that could use better
TypeScript ergonomics, this pattern transfers cleanly.

**Strategy pattern for cross-cutting concerns.** Authentication varies per
app (password, biometric, custom). Instead of baking conditionals into every
SDK function, each auth flow lives behind the same interface. Adding a new
strategy doesn't touch existing code.

**Subpath exports for package organization.** Three entry points serve three
audiences — SDK integrators, React developers, and CLI users — without any of
them importing code they won't use. The `exports` field in `package.json`
makes this transparent to bundlers like Metro.

**React Query as a data-fetching backbone.** The hooks keep query definitions
(staleTime, enabled conditions, query keys) separate from mutation side
effects (targeted cache invalidation). The `queryKeys` factory makes sure
mutations invalidate only the queries that depend on the changed data — no
over-fetching, no stale UI.

**Secure credential storage in Expo.** `expo-secure-store` is the standard
way to store sensitive data in managed Expo apps. The storage module builds a
small key-value API on top of it with proper error wrapping and
lowercase-normalized keys. The password-per-wallet approach
(`wallet_pwd_<address>`) means deleting one wallet never touches another's
credentials.

## File map

| File | Responsibility |
|------|---------------|
| `src/core/types.ts` | `Currency` re-export, `ToronetConfig`, `ToronetNetwork`, `OperationCategory` |
| `src/core/errors.ts` | `ToroError` base + `NetworkError`, `APIError`, `AuthBlockedError`, `StorageError` |
| `src/core/config.ts` | `createConfig` / `getConfig` singleton, `getApiBaseUrl` helper |
| `src/core/storage.ts` | SecureStore helpers for passwords, wallet list, active wallet |
| `src/core/auth.ts` | `AuthStrategy` interface + three implementations + strategy management |
| `src/core/sdk.ts` | 12 wrapped torosdk functions with auth gating and error normalization |
| `src/core/index.ts` | Barrel re-export of all core symbols |
| `src/react/provider.tsx` | `ToronetProvider` context + `useToronetContext` hook |
| `src/react/query-keys.ts` | Structured query key factory for `@tanstack/react-query` |
| `src/react/hooks/useWallets.ts` | Wallet list state, active wallet, CRUD actions |
| `src/react/hooks/useBalance.ts` | `useBalance` and `useBalances` queries |
| `src/react/hooks/useTransfer.ts` | `useTransfer` mutation with balance invalidation |
| `src/react/hooks/useTNS.ts` | `useResolveTNS`, `useLookupTNS` queries + `useSetTNS` mutation |
| `src/react/hooks/useKYC.ts` | `useKYCStatus` query + `useSubmitKYC` mutation |
| `src/react/hooks/useExchangeRates.ts` | `useExchangeRates` query |
| `src/react/hooks/useWalletMutations.ts` | `useCreateWallet`, `useImportWallet`, `useDeleteWallet` |
| `src/react/index.ts` | Barrel re-export of all React symbols |
| `src/cli/init.ts` | `torosdk-expo init` bootstrap script |
