# @reactforge/react-native

Official React Native & Expo SDK toolkit for the Toronet blockchain, powered by `@reactforge/sdk-adapter`.

Provides hardware-backed password storage (`expo-secure-store`), biometric authentication gating (`expo-local-authentication`), reactive hooks (`@tanstack/react-query`), and cross-platform mobile connectivity.

---

## Installation

```bash
# In your Expo or React Native project
npm install @reactforge/react-native @reactforge/sdk-adapter @tanstack/react-query expo-secure-store expo-local-authentication
```

Or using pnpm:

```bash
pnpm add @reactforge/react-native @reactforge/sdk-adapter @tanstack/react-query expo-secure-store expo-local-authentication
```

---

## Quickstart

### 1. Setup Provider & Auth Strategy

Wrap your app root with `ToronetProvider`:

```tsx
import React from "react";
import { ToronetProvider } from "@reactforge/react-native";
import { createBiometricStrategy } from "@reactforge/react-native/core";

// Require Face ID / Fingerprint for sensitive mutations
const authStrategy = createBiometricStrategy({
  requireFor: ["transfer", "swap", "wallet-delete", "kyc"],
  skipFor: ["balance", "exchange-rates", "tns-read"],
});

export default function App() {
  return (
    <ToronetProvider
      config={{ network: "testnet" }}
      authStrategy={authStrategy}
    >
      <MainWalletScreen />
    </ToronetProvider>
  );
}
```

### 2. Manage Wallets & View Balances

```tsx
import React from "react";
import { View, Text, Button, FlatList } from "react-native";
import {
  useWallets,
  useBalances,
  useCreateWallet,
} from "@reactforge/react-native";

export function MainWalletScreen() {
  const { activeWallet, wallets, setActiveWallet } = useWallets();
  const { data: balances, isLoading } = useBalances(activeWallet ?? undefined);
  const createWallet = useCreateWallet();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Active Wallet: {activeWallet ?? "None"}
      </Text>

      {isLoading ? (
        <Text>Loading balances...</Text>
      ) : (
        balances?.map((b) => (
          <Text key={b.currency}>
            {b.currency}: {b.balance}
          </Text>
        ))
      )}

      <Button
        title="Create New Wallet"
        onPress={() =>
          createWallet.mutate({
            username: "alice",
            password: "secretPassword123!",
          })
        }
      />
    </View>
  );
}
```

### 3. Send Inter-Wallet Transfers

Sensitive operations automatically gate on the selected `authStrategy` (e.g., biometric prompt) and resolve the stored password from `expo-secure-store`:

```tsx
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { useTransfer, Currency } from "@reactforge/react-native";

export function TransferScreen({ fromAddress }: { fromAddress: string }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("10");
  const transfer = useTransfer();

  const handleSend = () => {
    transfer.mutate(
      {
        sender: fromAddress,
        receiver: recipient,
        amount,
        currency: Currency.Naira,
      },
      {
        onSuccess: (res) =>
          Alert.alert("Success", `Transfer sent: ${res.transactionHash}`),
        onError: (err) => Alert.alert("Error", err.message),
      },
    );
  };

  return (
    <View>
      <TextInput
        placeholder="Recipient address"
        value={recipient}
        onChangeText={setRecipient}
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button
        title={
          transfer.isPending ? "Authenticating & Sending..." : "Send Funds"
        }
        onPress={handleSend}
      />
    </View>
  );
}
```

---

## Available Hooks

| Hook                                    | Description                                                                    |
| :-------------------------------------- | :----------------------------------------------------------------------------- |
| `useWallets()`                          | Read stored wallet addresses, active wallet, and switch active wallet          |
| `useCreateWallet()`                     | Create a new Toronet wallet and persist encrypted credentials to SecureStore   |
| `useImportWallet()`                     | Import an existing wallet via private key and password                         |
| `useVerifyPassword()`                   | Verify a wallet password without committing a transaction                      |
| `useUpdatePassword()`                   | Rotate / update the stored wallet password                                     |
| `useDeleteWallet()`                     | Remove wallet and its SecureStore credentials                                  |
| `useKeystore(address)`                  | Fetch public keystore metadata for an on-chain address                         |
| `useBalance(address, currency)`         | Query real-time balance for a specific Toronet currency                        |
| `useBalances(address)`                  | Fetch all 6 supported fiat and digital currencies in parallel                  |
| `useTokenBalance(address, contract?)`   | Fetch ERC-20 / Toronet token balance                                           |
| `useTokenExtended(address?, contract?)` | Token metadata: name, symbol, decimals, fees, allowance                        |
| `useExchangeRates()`                    | Live market exchange rates between supported currency pairs                    |
| `useTransfer()`                         | Inter-wallet transfer with biometric auth gating and auto cache invalidation   |
| `useSwap()`                             | Get currency swap quotes and execute instant atomic currency swaps             |
| `useTNS()`                              | TNS name lookup, domain resolution, and on-chain name registration             |
| `useTransactions(address)`              | Transaction ledger for a wallet with pagination support                        |
| `useBlockchain()`                       | Chain metrics: block height, validators, gas price                             |
| `useRoles(address)`                     | Query address admin/superadmin role; mutations: `addAdmin`, `removeAdmin`      |
| `useCurrencyAdmin()`                    | Admin: freeze/unfreeze, mint, burn, enroll, allow/disable currency transfers   |
| `useKYC()`                              | Query address KYC status and submit identity verification (admin)              |
| `useProducts()`                         | Query merchant product catalog and individual product details                  |
| `useVirtualWallet(address?)`            | Provision and query off-chain / virtual sub-wallets                            |
| `useStorage()`                          | Read and configure chain-level decentralized key-value storage                 |
| `useDeployer()`                         | Deploy arbitrary EVM bytecode to Toronet with constructor arguments            |
| `useBridge()`                           | Cross-chain bridge operations (Base, Polygon, Arbitrum, Ethereum, BSC, Solana) |
| `useSolana()`                           | Toronet-managed Solana addresses, SOL transfers, and SPL token transfers       |

---

## Security Features

1. **Hardware-Backed Storage**: All wallet credentials and passwords are saved using `expo-secure-store` which maps to the **iOS Keychain** and **Android Keystore**.
2. **Strategy Pattern Auth**:
   - `createPasswordStrategy()`: Auto-resolves credentials silently from SecureStore.
   - `createBiometricStrategy(options)`: Requires Fingerprint / Face ID via `expo-local-authentication` before sensitive operations.
   - `createCustomStrategy(fn)`: Plug your own backend or custom approval modal.
3. **Hermes / React Native Network Adapter**: Includes built-in Axios adapter overcoming Hermes `fetch` limitations on GET requests with JSON payloads.

---

## License

MIT
