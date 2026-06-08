# Migrating from React Native (torosdk) to Expo (torosdk-expo)

This guide walks through migrating an existing React Native app that uses `torosdk` directly to Expo with `torosdk-expo`. You'll replace manual fetch calls and bespoke auth logic with TanStack Query hooks, strategy-pattern auth gating, and encrypted password storage.

---

## Table of Contents

1. [Why Migrate?](#why-migrate)
2. [Prerequisites](#prerequisites)
3. [Step 1: Install torosdk-expo](#step-1-install-torosdk-expo)
4. [Step 2: Scaffold with the CLI](#step-2-scaffold-with-the-cli)
5. [Step 3: Add the Provider](#step-3-add-the-provider)
6. [Step 4: Replace Manual torosdk Calls](#step-4-replace-manual-torosdk-calls)
7. [Step 5: Migrate Auth Logic](#step-5-migrate-auth-logic)
8. [Step 6: Migrate Storage](#step-6-migrate-storage)
9. [Step 7: Handle iOS GET+body (if applicable)](#step-7-handle-ios-getbody-if-applicable)
10. [Step 8: Remove Old Dependencies](#step-8-remove-old-dependencies)
11. [Migration Checklist](#migration-checklist)
12. [Common Patterns: Before & After](#common-patterns-before--after)

---

## Why Migrate?

| With plain torosdk | With torosdk-expo |
|-------------------|-------------------|
| Manual `fetch()` / `axios` calls | TanStack Query hooks with caching, retry, invalidation |
| Bespoke auth gating per screen | Strategy pattern — one config, gates all 12 operations |
| Passwords in AsyncStorage or in memory | expo-secure-store (iOS Keychain / Android Keystore) |
| String-matching error handling | Typed `ToroError` hierarchy with `instanceof` checks |
| iOS 26 GET+body → native code required | Native NWConnection module included |
| Manual cache management | Automatic mutation-driven invalidation |
| Loading/error states written per screen | Standard `isLoading`/`isError`/`data` from TanStack Query |

---

## Prerequisites

- An existing React Native project using `torosdk`
- Expo SDK 52+ (or a plan to migrate to Expo)
- Node.js 18+

If your project is bare React Native (not Expo), you'll need to migrate to Expo first — torosdk-expo depends on `expo-secure-store` and `expo-local-authentication`. See the [Expo migration guide](https://docs.expo.dev/bare/using-expo-cli/) for bare-to-managed migration. For Expo SDK 56, reference the [v56 docs](https://docs.expo.dev/versions/v56.0.0/).

---

## Step 1: Install torosdk-expo

```bash
npm install torosdk-expo
```

This installs `torosdk-expo` and its peer dependencies:
- `torosdk` (you already have this)
- `@tanstack/react-query` ^5
- `expo-secure-store`
- `expo-local-authentication`

If any peer dependency is missing, install it explicitly:

```bash
npx expo install @tanstack/react-query expo-secure-store expo-local-authentication
```

---

## Step 2: Scaffold with the CLI

```bash
npx torosdk-expo init
```

The CLI creates three files:

```
src/torosdk/
├── config.ts     ← network (testnet/mainnet) and API base URL
├── auth.ts       ← pick password, biometric, or custom auth
└── provider.tsx  ← ToroWrapper combining ToronetProvider + auth
```

**What to do with your existing config:** Move your `torosdk` initialization (API URL, network selection) into `src/torosdk/config.ts`. The scaffolded file has comments showing where to put each value.

---

## Step 3: Add the Provider

In your root component (typically `App.tsx`), wrap your navigation tree:

```tsx
// Before (plain React Native)
import { initTorosdk } from 'torosdk';

initTorosdk({ apiUrl: 'http://testnet.toronet.org/api' });

export default function App() {
  return <NavigationContainer>{/* your screens */}</NavigationContainer>;
}
```

```tsx
// After (with torosdk-expo)
import { ToroWrapper } from './src/torosdk/provider';

export default function App() {
  return (
    <ToroWrapper>
      <NavigationContainer>{/* your screens */}</NavigationContainer>
    </ToroWrapper>
  );
}
```

`ToroWrapper` handles SDK initialization, auth strategy registration, and TanStack Query setup in one component. If you need a custom QueryClient, pass it as a prop:

```tsx
<ToroWrapper queryClient={myCustomQueryClient}>
  <App />
</ToroWrapper>
```

---

## Step 4: Replace Manual torosdk Calls

This is the biggest change. You'll replace direct `torosdk` function calls with hooks.

### Balances

```tsx
// Before: manual fetch with useState/useEffect
import torosdk from 'torosdk';
import { useState, useEffect } from 'react';

function HomeScreen({ address }) {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    torosdk.getBalances(address)
      .then(setBalances)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [address]);

  if (loading) return <Skeleton />;
  if (error) return <ErrorView message={error.message} />;
  return <BalanceList data={balances} />;
}
```

```tsx
// After: useBalances hook
import { useBalances } from 'torosdk-expo';

function HomeScreen({ address }) {
  const { data: balances, isLoading, isError, error } = useBalances({
    address,
    enabled: !!address,  // don't fire until we have an address
  });

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorView message={error?.detail} />;
  return <BalanceList data={balances} />;
}
```

**What you get for free:**
- 30-second stale-time caching — no duplicate requests
- Automatic retry on network failure
- `enabled` flag prevents queries on empty addresses
- Cached data shows instantly while background refetch runs

### Transfers

```tsx
// Before: manual try/catch with ad-hoc state
const [sending, setSending] = useState(false);

const sendTransfer = async () => {
  setSending(true);
  try {
    const result = await torosdk.transfer({
      senderAddress: '0x...',
      receiverAddress: '0x...',
      amount: '100',
      currency: 'NGN',
    });
    Alert.alert('Sent!', `TX: ${result.transactionHash}`);
    // Manually refetch balances — easy to forget!
    refetchBalances();
  } catch (err) {
    Alert.alert('Error', err.message);
  } finally {
    setSending(false);
  }
};
```

```tsx
// After: useTransfer mutation — balances auto-invalidate
import { useTransfer } from 'torosdk-expo';
import { ToroError, AuthBlockedError } from 'torosdk-expo/core';

function TransferScreen() {
  const transfer = useTransfer();

  const send = async () => {
    try {
      const result = await transfer.mutateAsync({
        senderAddress: '0x...',
        receiverAddress: '0x...',
        amount: '100',
        currency: Currency.Naira,
      });
      Alert.alert('Sent!', `TX: ${result.transactionHash}`);
      // Balances auto-invalidate — no manual refetch!
    } catch (err) {
      if (err instanceof AuthBlockedError) {
        Alert.alert('Auth Required', 'Biometric confirmation needed');
      } else if (err instanceof ToroError) {
        Alert.alert('Error', err.detail);
      }
    }
  };

  return (
    <Button
      onPress={send}
      disabled={transfer.isPending}
      title={transfer.isPending ? 'Sending...' : 'Send'}
    />
  );
}
```

### TNS Resolution

```tsx
// Before
const [address, setAddress] = useState(null);
useEffect(() => { torosdk.resolveTNS('alice').then(setAddress); }, []);

// After
const { data: address } = useResolveTNS('alice');
```

### Exchange Rates

```tsx
// Before
const [rates, setRates] = useState([]);
useEffect(() => { torosdk.getExchangeRates().then(setRates); }, []);

// After
const { data: rates } = useExchangeRates();  // 60s stale time built in
```

---

## Step 5: Migrate Auth Logic

If you had custom auth gating (checking permissions before sensitive operations), replace it with a strategy:

```tsx
// Before: ad-hoc auth checks scattered across screens
async function handleTransfer() {
  const biometricOk = await LocalAuthentication.authenticateAsync();
  if (!biometricOk) {
    Alert.alert('Auth required');
    return;
  }
  // proceed with transfer...
}

async function handleCreateWallet() {
  // No auth check here — inconsistent!
  // proceed with wallet creation...
}
```

```tsx
// After: strategy in one file, all operations gated consistently
// src/torosdk/auth.ts
import { createBiometricStrategy } from 'torosdk-expo/core';

export const authStrategy = createBiometricStrategy({
  requireFor: ['transfer', 'kyc', 'tns-write', 'wallet-delete'],
  skipFor: ['balance', 'tns-read', 'exchange-rates'],
});
```

Every hook and SDK function automatically calls `authorizeOperation(category)` before executing. No per-screen auth code. No inconsistencies.

**If you need custom auth logic** (server-side approval, multi-factor):

```ts
import { createCustomStrategy } from 'torosdk-expo/core';

export const authStrategy = createCustomStrategy(async (operation) => {
  // Your existing auth logic here
  if (operation === 'transfer' && amountExceedsThreshold) {
    return await myServerApprovalFlow();
  }
  return true;
});
```

---

## Step 6: Migrate Storage

Replace AsyncStorage password storage with `expo-secure-store`:

```tsx
// Before: passwords in AsyncStorage (plaintext at rest)
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem(`wallet_pwd_${address}`, password);
const password = await AsyncStorage.getItem(`wallet_pwd_${address}`);
```

```tsx
// After: torosdk-expo handles this automatically via useCreateWallet / useImportWallet
// No manual storage code needed.

// If you need programmatic access (not recommended unless you're building a custom flow):
import { setPassword, getPassword, deletePassword } from 'torosdk-expo/core';

await setPassword(address, password);       // → iOS Keychain / Android Keystore
const pwd = await getPassword(address);     // → encrypted at rest
await deletePassword(address);              // → secure deletion
```

**Migration script for existing passwords:**

If you have existing passwords in AsyncStorage, run a one-time migration:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setPassword } from 'torosdk-expo/core';

async function migratePasswordsToSecureStore() {
  const keys = await AsyncStorage.getAllKeys();
  const walletKeys = keys.filter(k => k.startsWith('wallet_pwd_'));

  for (const key of walletKeys) {
    const address = key.replace('wallet_pwd_', '');
    const password = await AsyncStorage.getItem(key);
    if (password) {
      await setPassword(address, password);
      await AsyncStorage.removeItem(key);  // clean up
    }
  }
}

// Run once at app startup, guarded by a flag
const MIGRATED = await AsyncStorage.getItem('torosdk_migrated_v1');
if (!MIGRATED) {
  await migratePasswordsToSecureStore();
  await AsyncStorage.setItem('torosdk_migrated_v1', 'true');
}
```

---

## Step 7: Handle iOS GET+body (if applicable)

If your app was running into `NSURLErrorDomain -1103` on iOS 26 when calling Toronet's API, torosdk-expo fixes this automatically.

**No code changes needed.** The axios adapter chain detects iOS at runtime and routes GET-with-body requests through `ToroNetworking.m`, a native `NWConnection` module that bypasses CFNetwork's restriction.

The native module is linked via the `torosdk-expo.podspec` — no extra linker flags or manual Xcode configuration.

**To verify it's working**, check that balance queries and TNS lookups succeed on an iOS 26 simulator:

```tsx
const { data, isError, error } = useBalances({ address: '0x...' });
// Should return data, not a NetworkError, on iOS 26
```

If you were previously using a custom workaround (custom `URLProtocol`, patched `fetch`), you can remove that code — torosdk-expo handles it at a lower level.

---

## Step 8: Remove Old Dependencies

After migration, you may be able to remove:

```bash
# If you were only using AsyncStorage for wallet passwords:
npm uninstall @react-native-async-storage/async-storage

# If you had a custom biometric wrapper:
# (expo-local-authentication is already a dependency of torosdk-expo)

# If you had a custom fetch adapter for iOS GET+body:
# Remove your custom adapter — the built-in one handles it
```

Verify nothing else in your app uses these before removing.

---

## Migration Checklist

- [ ] `npx torosdk-expo init` ran successfully
- [ ] `ToroWrapper` wraps root component
- [ ] Config moved to `src/torosdk/config.ts`
- [ ] Auth strategy selected in `src/torosdk/auth.ts`
- [ ] All `useEffect` + `torosdk.*` calls replaced with hooks
- [ ] Manual loading/error states replaced with TanStack Query states
- [ ] Ad-hoc auth checks replaced with strategy pattern
- [ ] AsyncStorage password storage migrated to SecureStore
- [ ] iOS GET+body workarounds removed (if any)
- [ ] Old dependencies removed (if no longer used)
- [ ] `catch` blocks use `instanceof ToroError` instead of string matching
- [ ] App builds and runs on both iOS and Android
- [ ] All existing functionality verified

---

## Common Patterns: Before & After

### Wallet Creation

```tsx
// BEFORE: manual torosdk call + manual storage
import torosdk from 'torosdk';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function createWallet(username, password) {
  const { address } = await torosdk.createWallet({ username, password });
  await AsyncStorage.setItem(`wallet_pwd_${address}`, password);
  const wallets = JSON.parse(await AsyncStorage.getItem('wallets') || '[]');
  wallets.push(address);
  await AsyncStorage.setItem('wallets', JSON.stringify(wallets));
  await AsyncStorage.setItem('active_wallet', address);
  return address;
}

// AFTER: one hook call handles everything
import { useCreateWallet } from 'torosdk-expo';

function CreateWalletScreen() {
  const mutation = useCreateWallet();
  // mutation.mutateAsync({ username, password }) handles:
  // API call → SecureStore → wallet list → active wallet → cache invalidation
}
```

### Loading States

```tsx
// BEFORE: manual loading state per screen
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

useEffect(() => {
  setLoading(true);
  torosdk.getBalances(address)
    .then(d => { setData(d); setError(null); })
    .catch(e => setError(e))
    .finally(() => setLoading(false));
}, [address]);

if (loading) return <Loading />;
if (error) return <Error message={error.message} />;
if (!data) return <Empty />;

// AFTER: TanStack Query states are standardized
const { data, isLoading, isError, error } = useBalances({ address, enabled: !!address });

if (isLoading) return <Loading />;
if (isError) return <Error message={error?.detail} />;
if (!data?.length) return <Empty />;
```

### Error Handling

```tsx
// BEFORE: string matching on error messages
catch (err) {
  if (err.message?.includes('Network')) {
    showToast('Connection error');
  } else if (err.message?.includes('400')) {
    showToast('Bad request');
  } else if (err.message?.includes('auth')) {
    showToast('Authentication failed');
  }
}

// AFTER: instanceof checks on typed error classes
import { NetworkError, APIError, AuthBlockedError } from 'torosdk-expo/core';

catch (err) {
  if (err instanceof NetworkError) {
    showToast('Connection error');
  } else if (err instanceof APIError && err.status === 400) {
    showToast('Bad request');
  } else if (err instanceof AuthBlockedError) {
    showToast(`${err.operation} requires authentication`);
  }
}
```

---

## Need Help?

- **[API Reference](API_REFERENCE.md)** — Complete function/hook signatures and types
- **[Architecture Guide](ARCHITECTURE.md)** — Design decisions and data flow
- **[Example App](https://github.com/toroforge/torosdk-expo/tree/main/example)** — Full 6-screen reference implementation
- **[Toronet Discord](https://discord.gg/toronet)** — Community support

---

*Migration guide for torosdk-expo v0.1.4+. Last updated June 2026.*
