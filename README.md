# torosdk-expo

[![npm version](https://img.shields.io/npm/v/torosdk-expo.svg)](https://www.npmjs.com/package/torosdk-expo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Expo / React Native wrapper around [torosdk](https://www.npmjs.com/package/torosdk)** — the official Toronet blockchain SDK. Provides secure password storage, biometric-gated transactions, TanStack Query hooks, and a one-command project scaffold.

## Quick Start

```bash
npx torosdk-expo init
```

This detects your Expo project, installs dependencies, and scaffolds `src/torosdk/` with config, auth strategy, and a provider wrapper.

## Features

- **Zero polyfills** — torosdk is a pure HTTP client, works in Hermes as-is
- **Secure password storage** — passwords encrypted at rest via iOS Keychain / Android Keystore (expo-secure-store)
- **Biometric gates** — fingerprint/Face ID before transfers and sensitive operations (expo-local-authentication)
- **TanStack Query hooks** — `useBalance`, `useTransfer`, `useWallets`, `useResolveTNS`, `useKYCStatus`, `useExchangeRates`
- **Configurable auth** — choose password (silent fill), biometric, or bring your own strategy
- **CLI init** — one command scaffolds everything

## Installation

```bash
npm install torosdk-expo torosdk @tanstack/react-query expo-secure-store expo-local-authentication
```

## Setup

Wrap your app with `ToronetProvider`:

```tsx
import { ToronetProvider } from 'torosdk-expo';
import { createBiometricStrategy } from 'torosdk-expo/core';

const authStrategy = createBiometricStrategy({
  requireFor: ['transfer', 'kyc', 'tns-write', 'wallet-delete'],
  skipFor: ['balance', 'tns-read', 'exchange-rates', 'wallet-create', 'wallet-import'],
});

export default function App() {
  return (
    <ToronetProvider
      config={{ network: 'testnet' }}
      authStrategy={authStrategy}
    >
      <RootNavigator />
    </ToronetProvider>
  );
}
```

## Hooks

### `useWallets()`
Manage stored wallets. Returns `{ all, active, switchWallet, addWallet, removeWallet, refresh, isLoading }`.

### `useBalance({ address, currency })`
Fetch balance for a single currency. Returns TanStack Query result with `{ balance, currency }`.

### `useBalances({ address })`
Fetch all 6 currencies (NGN, USD, KSH, ZAR, GBP, EUR) in parallel.

### `useTransfer()`
Mutation hook. Biometric gate fires automatically if configured.

### `useResolveTNS(name)` / `useLookupTNS(address)` / `useSetTNS()`
TNS name resolution, reverse lookup, and registration.

### `useKYCStatus({ address })` / `useSubmitKYC()`
Check KYC verification and submit KYC data.

### `useExchangeRates()`
Live exchange rates. Auto-refreshes every 60 seconds.

## Package Structure

| Entry | Contents |
|-------|----------|
| `torosdk-expo` | React hooks + ToronetProvider |
| `torosdk-expo/core` | Zero React: types, auth strategies, storage, typed SDK wrappers |
| `torosdk-expo/cli` | `npx torosdk-expo init` — scaffold script (Node only) |

## Example App

See the `example/` directory for a complete Expo SDK 52 app exercising every hook.

## Architecture

```
┌──────────────────────────────────────────────┐
│                  Your Expo App                │
│  ┌────────────────────────────────────────┐  │
│  │         torosdk-expo (React hooks)      │  │
│  │  useBalance  useTransfer  useWallets   │  │
│  └──────────────┬─────────────────────────┘  │
│                 │                             │
│  ┌──────────────▼─────────────────────────┐  │
│  │       torosdk-expo/core                 │  │
│  │  Auth Strategies  Storage  SDK Wrappers│  │
│  └──────┬──────────────┬──────────────────┘  │
│         │              │                      │
│  ┌──────▼──────┐ ┌─────▼──────────┐          │
│  │   torosdk   │ │expo-secure-store│         │
│  │  (HTTP/REST)│ │  (Keychain)     │         │
│  └──────┬──────┘ └────────────────┘          │
│         │                                     │
│  ┌──────▼──────┐                             │
│  │ Toronet API │                             │
│  └─────────────┘                             │
└──────────────────────────────────────────────┘
```

## API Reference

All functions mirror torosdk but handle password injection, error normalization, and type safety:

- `createWallet(username, password)` → `address`
- `importWallet(privateKey, password)` → `address`
- `verifyWalletPassword(address, password)` → `boolean`
- `getBalanceForCurrency(address, currency)` → `{ balance, currency }`
- `getBalances(address)` → `Array<{ balance, currency }>`
- `makeTransfer(sender, receiver, amount, currency)` → `{ transactionHash }`
- `resolveTNS(name)` → `address`
- `lookupTNS(address)` → `name | null`
- `setTNS(address, name)` → `void`
- `getKYCStatus(address)` → `{ verified }`
- `submitKYC(address, customerData)` → result
- `getExchangeRates()` → `Array<{ pair, rate }>`

## Auth Strategies

| Strategy | Description |
|----------|-------------|
| `createPasswordStrategy()` | Silent fill from SecureStore |
| `createBiometricStrategy({ requireFor, skipFor })` | OS biometric prompt for listed operations |
| `createCustomStrategy(fn)` | Your own async `(operation) => Promise<boolean>` |

## License

MIT
