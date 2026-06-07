# torosdk-expo Architecture

## Overview

`torosdk-expo` is a typed React Native / Expo SDK 52 wrapper around `torosdk`
(v0.2.0), the official SDK for interacting with the Toronet blockchain. The
package provides three entry points — `torosdk-expo` (React hooks),
`torosdk-expo/core` (SDK wrappers), and `torosdk-expo/cli` (project
initialisation) — and is designed to give Expo developers a familiar,
hook-based interface for wallet management, balances, transfers, TNS name
resolution, KYC, and exchange rates.

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

The package uses npm **subpath exports** so consumers import only what they
need. A developer who wants the full React experience imports from
`torosdk-expo`. Someone building a non-React Node.js tool imports from
`torosdk-expo/core`. Tree-shaking is preserved because each subpath is an
independent barrel.

## Key Design Decisions

### 1. Strategy-Pattern Authentication

Authentication is modelled as the `AuthStrategy` interface — a single-method
contract (`authorize(category: OperationCategory): Promise<void>`). Three
implementations are provided:

- **PasswordStrategy** — reads a previously stored password from
  `expo-secure-store` and presents it silently. If no password is cached, it
  falls back to a user-provided prompt callback.
- **BiometricStrategy** — uses `expo-local-authentication` to trigger
  fingerprint or Face ID. Falls back to device passcode or a password prompt
  depending on configuration.
- **CustomStrategy** — accepts an arbitrary async function, letting
  developers integrate their own auth flow (e.g. a server-side challenge).

The active strategy is stored in a module-level variable and accessed via
`getAuthStrategy()`. This is intentionally **not** React context — the core
layer must work without React. Each sensitive SDK operation calls
`authorizeOperation()` which gates on the strategy before proceeding.

### 2. Typed Error Hierarchy

Every error that can surface to a consumer extends `ToroError`, which
captures an error code (`ToroErrorCode`) and the original cause. Four
subclasses refine this:

| Class | Code | When |
|-------|------|------|
| `NetworkError` | `NETWORK_ERROR` | fetch fails or times out |
| `APIError` | `API_ERROR` | Toronet returns a non-OK response |
| `AuthBlockedError` | `AUTH_BLOCKED` | user cancels biometric prompt |
| `StorageError` | `STORAGE_ERROR` | SecureStore read/write fails |

The internal `wrapError()` helper in `sdk.ts` catches any thrown value and
normalises it into the appropriate subclass. Callers can `instanceof`-check
or switch on `error.code`.

### 3. SecureStore-Backed Credential Storage

All persistent secrets — wallet passwords, the wallet address list, and the
active wallet selection — are stored in `expo-secure-store`, which uses the
iOS Keychain and Android Keystore under the hood. The storage module exports
eight functions: `getPassword` / `setPassword` / `deletePassword` for
individual wallet credentials, `getWalletList` / `addWalletToList` /
`removeWalletFromList` for the address roster, and `getActiveWallet` /
`setActiveWallet` for the currently selected wallet. All throw `StorageError`
on failure with the underlying OS error attached.

### 4. React Query Integration

The React layer is built on `@tanstack/react-query` v5. Every read operation
has a corresponding query with an appropriate `staleTime`:

- **30 seconds** for balances (they change frequently).
- **60 seconds** for exchange rates (moderate volatility).
- **5 minutes** for TNS resolution and KYC status (slow-changing).

Mutations — transfer, wallet creation/import/deletion, TNS registration, KYC
submission — use `useMutation` and invalidate the relevant query keys on
success so the UI refetches fresh data automatically. The `queryKeys` object
provides a structured, readonly key factory rooted at `['torosdk']`, making
targeted invalidation straightforward.

### 5. Auth Gating on Sensitive Operations

Not every operation requires authentication. Reads (balance, TNS resolution,
KYC status, exchange rates) proceed without prompting. Writes (transfer, TNS
registration, KYC submission) and wallet lifecycle operations (create,
import, delete) call `authorizeOperation()` first, which invokes the active
`AuthStrategy`. The operation category is passed through so the strategy can
display a meaningful prompt — for example, "Authenticate to send 100 NGN"
versus "Authenticate to create a wallet."

### 6. CLI Bootstrap

`torosdk-expo init` detects an Expo project root, determines the package
manager (npm, yarn, or pnpm), installs the four required peer dependencies,
scaffolds three starter files (`config.ts`, `auth.ts`, `provider.tsx`) into
`src/torosdk/`, and appends `TOROSDK_NETWORK=testnet` to `.env.example`. The
developer then chooses an auth strategy, wraps their app, and can immediately
begin using hooks. The CLI is a plain Node.js script with no external
dependencies beyond the Node standard library — it copies template files
directly from the installed package.

## What Other Developers Can Learn

**Building typed wrappers around untyped SDKs.** `torosdk` exports types
like `Currency` (a TypeScript enum) and `ToronetSDK`, but its error handling
is string-based. The `core` layer adds a typed error hierarchy, normalises
all thrown values, and wraps every public function with proper parameter and
return types. This pattern is applicable to any project integrating a
third-party library that needs better TypeScript ergonomics.

**Strategy pattern for cross-cutting concerns.** Authentication is a
cross-cutting concern that varies per app (password vs biometric vs custom).
Rather than baking conditionals into every SDK function, the strategy pattern
encapsulates each auth flow behind a single interface. New strategies can be
added without modifying any existing code.

**Subpath exports for package organisation.** By exporting `./core`, `.`,
and `./cli` as separate subpaths, the package serves three audiences — SDK
integrators, React developers, and DevOps/CLI users — without forcing any of
them to import code they don't need. The `exports` field in `package.json`
makes this transparent to bundlers like Metro.

**React Query as a data-fetching backbone.** The hooks demonstrate a clean
separation between query definitions (staleTime, enabled conditions, query
keys) and mutation side-effects (targeted cache invalidation). The
`queryKeys` factory ensures that mutations invalidate exactly the queries
that depend on the changed data, avoiding both over-fetching and stale UI.

**Secure credential storage in Expo.** `expo-secure-store` is the
recommended way to store sensitive data in managed Expo apps. The storage
module shows how to build a simple key-value API on top of it, with proper
error wrapping and lowercase-normalised keys. The password-per-wallet
approach (`wallet_pwd_<address>`) means deleting one wallet never affects
another's credentials.

## File Map

| File | Responsibility |
|------|---------------|
| `src/core/types.ts` | `Currency` re-export, `ToronetConfig`, `ToronetNetwork`, `OperationCategory` |
| `src/core/errors.ts` | `ToroError` base + `NetworkError`, `APIError`, `AuthBlockedError`, `StorageError` |
| `src/core/config.ts` | `createConfig` / `getConfig` singleton, `getApiBaseUrl` helper |
| `src/core/storage.ts` | SecureStore helpers for passwords, wallet list, active wallet |
| `src/core/auth.ts` | `AuthStrategy` interface + three implementations + strategy management |
| `src/core/sdk.ts` | 12 wrapped torosdk functions with auth gating and error normalisation |
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
