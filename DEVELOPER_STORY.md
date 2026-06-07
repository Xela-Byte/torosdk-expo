# torosdk-expo: Developer Story

A walkthrough of the torosdk-expo experience from a developer's perspective.

---

Amara is building a mobile remittance app for Expo. She wants users to send Naira and check their Toronet balances. She's never used Toronet before.

She runs:

```
npx torosdk-expo init
```

The CLI detects her Expo SDK 52 project, installs `torosdk` + `@tanstack/react-query` + `expo-secure-store` + `expo-local-authentication`. It scaffolds:

```
src/torosdk/
  config.ts       ← network toggle, wallet list
  provider.tsx    ← wraps TanStack QueryProvider + ToronetProvider
  auth.ts         ← her custom auth strategy (stub, ready to fill)
```

It also prints: `torosdk-expo ready. Next: choose an auth strategy in src/torosdk/auth.ts`

Amara opens `auth.ts`. She wants biometric for transfers but silent password fill for balance checks. She writes:

```ts
import { createBiometricStrategy } from 'torosdk-expo/core';

export const authStrategy = createBiometricStrategy({
  requireFor: ['transfer', 'kyc', 'tns-write'],
  skipFor: ['balance', 'tns-read', 'exchange-rates'],
});
```

No custom auth code — the package ships with `createPasswordStrategy` and `createBiometricStrategy` pre-built. The `custom` option is there if she ever wants to wire up her own social auth.

Now she wraps her app:

```tsx
// App.tsx
import { ToronetProvider } from 'torosdk-expo';
import { config } from './torosdk/config';
import { authStrategy } from './torosdk/auth';

export default function App() {
  return (
    <ToronetProvider config={config} authStrategy={authStrategy}>
      <RootNavigator />
    </ToronetProvider>
  );
}
```

The provider sets `network: 'testnet'` from her `.env` and is ready.

**Building the onboarding screen.** Amara wants create-wallet and import-wallet flows:

```tsx
import { useCreateWallet, useImportWallet } from 'torosdk-expo';

function OnboardingScreen() {
  const createWallet = useCreateWallet();
  const importWallet = useImportWallet();

  return (
    <>
      <Button title="Create New Wallet" onPress={async () => {
        const address = await createWallet.mutateAsync({ username: 'amara', password: '...' });
        // → password verified via API, stored in SecureStore at wallet_pwd_${address}
        // → address added to wallet list
        console.log(address); // "0x7a9f..."
      }} />
      <Button title="Import" onPress={async () => {
        await importWallet.mutateAsync({ privateKey: '0x...', password: '...' });
        // same verify-then-store flow
      }} />
    </>
  );
}
```

She never touches `expo-secure-store` directly. The mutation handles verification, storage, and wallet list management.

**Building the dashboard.** She needs balances for all six currencies:

```tsx
import { useBalance, useExchangeRates, useWallets } from 'torosdk-expo';

function Dashboard() {
  const wallets = useWallets(); // reads from SecureStore, returns list
  const activeWallet = wallets.active;

  const ngnBalance = useBalance({ address: activeWallet, currency: 'NGN' });
  const usdBalance = useBalance({ address: activeWallet, currency: 'USD' });
  const zarBalance = useBalance({ address: activeWallet, currency: 'ZAR' });
  const rates = useExchangeRates();

  // TanStack Query handles caching, refetch on focus, loading states
  // authStrategy skips biometric — the stored password is injected silently
  return (
    <View>
      <Text>₦ {ngnBalance.data?.balance ?? '...'}</Text>
      <Text>${usdBalance.data?.balance ?? '...'}</Text>
      <Text>R {zarBalance.data?.balance ?? '...'}</Text>
    </View>
  );
}
```

No password arguments, no manual `axios` calls, no loading boolean state. The hook reads the active wallet from context, pulls the password from SecureStore, and calls torosdk under the hood.

**Sending money.** She builds a transfer screen:

```tsx
import { useTransfer } from 'torosdk-expo';

function SendScreen() {
  const transfer = useTransfer();

  return (
    <Button title="Send ₦5,000" onPress={async () => {
      // Setting up transfer → biometric kicks in (she configured it for 'transfer')
      // Android: fingerprint prompt. iOS: Face ID.
      // Only after biometric confirms → password is read from SecureStore → API call fires
      await transfer.mutateAsync({
        receiver: '0xabc...',
        amount: '5000',
        currency: 'NGN',
      });
    }} />
  );
}
```

The biometric gate fires automatically because she listed `'transfer'` in `requireFor`. If the fingerprint fails, the password never leaves SecureStore. She wrote zero biometric code.

**TNS lookup.** She wants users to type a name instead of a hex address:

```tsx
import { useResolveTNS } from 'torosdk-expo';

function RecipientInput() {
  const resolve = useResolveTNS('amara.toronet'); // name → address
  // resolves to 0x7a9f...
}
```

**KYC check before large transfers:**

```tsx
const kyc = useKYCStatus({ address: activeWallet });

if (kyc.data?.verified) {
  // show transfer button
}
```

---

The package handles the boilerplate Amara doesn't want to think about — calling torosdk directly, wiring up SecureStore, polyfilling anything, managing password-address mappings, and hand-rolling `useEffect` + `try/catch` for every loading state. What she keeps is control over the things that matter for her app: the network, which operation types get biometric gates, and the wallet-switching UX (`useWallets().switch(address)` gives her the action; she builds the UI around it).

Her project compiles and runs. She clones it fresh, runs `npx torosdk-expo init` in the new clone, `npx expo start`, and it's working in under 15 minutes. Two minutes under the submission requirement.
