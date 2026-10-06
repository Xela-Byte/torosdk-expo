# @reactforge/react

The complete, official React toolkit and hooks library for the **Toronet** blockchain ecosystem.

[![npm version](https://img.shields.io/npm/v/@reactforge/react.svg)](https://www.npmjs.com/package/@reactforge/react)
[![license](https://img.shields.io/npm/l/@reactforge/react.svg)](https://github.com/toroforge/reactforge/blob/main/LICENSE)

`@reactforge/react` delivers 100% API coverage of Toronet features for modern React applications. It features reactive state management, typed error classes, active address persistence via `localStorage`, and clean composable hooks for balances, transfers, smart contracts, TNS, Solana bridge, swaps, keystore, virtual wallets, KYC, currency administration, and permissions.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Features & Hooks](#core-features--hooks)
  - [Provider & Context](#provider--context)
  - [Wallet Operations](#wallet-operations)
  - [Balances & Currencies](#balances--currencies)
  - [Transfers & Payments](#transfers--payments)
  - [Toro Name Service (TNS)](#toro-name-service-tns)
  - [Cross-Chain Bridge](#cross-chain-bridge)
  - [Solana Suite](#solana-suite)
  - [Currency Swaps](#currency-swaps)
  - [Currency Administration](#currency-administration)
  - [KYC & Compliance](#kyc--compliance)
  - [Transactions & Blockchain](#transactions--blockchain)
  - [Roles & Permissions](#roles--permissions)
  - [Smart Contract Deployer](#smart-contract-deployer)
  - [Products & Virtual Wallets](#products--virtual-wallets)
  - [Chain Storage](#chain-storage)
- [Error Handling](#error-handling)
- [Mobile Version](#mobile-version)
- [License](#license)

---

## Installation

```bash
npm install @reactforge/react @reactforge/sdk-adapter
# or
pnpm add @reactforge/react @reactforge/sdk-adapter
# or
yarn add @reactforge/react @reactforge/sdk-adapter
```

---

## Quick Start

Wrap your React root with `<ToroProvider>`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ToroProvider } from "@reactforge/react";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToroProvider network="testnet">
      <App />
    </ToroProvider>
  </React.StrictMode>,
);
```

Then consume any hook in your components:

```tsx
import React from "react";
import { useToroBalance, useToroContext } from "@reactforge/react";

export function WalletBadge() {
  const { activeAddress } = useToroContext();
  const { balance, loading, error, refetch } = useToroBalance(
    activeAddress,
    "TORO",
  );

  if (!activeAddress) return <p>Please connect or select a wallet</p>;
  if (loading) return <p>Loading balance...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <span>{balance} TORO</span>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

---

## Core Features & Hooks

### Provider & Context

- `<ToroProvider network="testnet" | "mainnet" [baseURL="..."]>`: Top-level context provider that automatically configures SDK endpoints and persists `activeAddress` to `localStorage`.
- `useToroContext()`: Returns `{ network, activeAddress, setActiveAddress }`.

```tsx
const { activeAddress, setActiveAddress, network } = useToroContext();
// Sets address and persists to localStorage across page reloads
setActiveAddress("0x1234567890abcdef...");
```

---

### Wallet Operations

- `useToroWallet(address?)`: Read raw wallet key data for the active (or given) address.
- `useToroCreateWallet()`: Create a new wallet address with an encrypted password.
- `useToroImportWallet()`: Import a wallet via private key.
- `useToroVerifyPassword()`: Verify a password for an address without sending funds.
- `useToroUpdatePassword()`: Rotate or update the active wallet's password.
- `useToroDeleteWallet()`: Remove a wallet account from the network.
- `useToroKeystore(address)`: Fetch public keystore metadata for an on-chain address.

```tsx
// Create a wallet
const { createWallet, loading, error } = useToroCreateWallet();
const result = await createWallet("my_username", "super_secure_pwd");
console.log("Created address:", result.address);

// Verify a password before signing
const { verify, isValid } = useToroVerifyPassword();
await verify("0xAddress...", "wallet_password");
console.log("Password valid?", isValid);
```

---

### Balances & Currencies

- `useToroBalance(address, currency)`: Fetch native TORO or currency balances (`NGN`, `USD`, `EUR`, `GBP`, `KSH`, `ZAR`).
- `useToroTokenBalance(address, contractAddress)`: Fetch ERC-20 / Toronet token balance.
- `useToroTokenExtended(address, contractAddress)`: Fetch token metadata (name, symbol, decimals, fees, allowance).
- `useToroExchangeRates()`: Fetch live network exchange rates across all supported pairs.

```tsx
const { balance, loading } = useToroBalance(activeAddress, "USD");
const { data: rates } = useToroExchangeRates();
```

---

### Transfers & Payments

- `useToroSend()`: Send native currency or TORO from one wallet to another.
- `useToroPayment()`: Execute payment flows and gateway transactions.

```tsx
const { sendFunds, loading, error } = useToroSend();

const handleSend = async () => {
  const receipt = await sendFunds({
    currency: "USD",
    to: "0xRecipientAddress...",
    amount: "25.00",
    password: "wallet_password",
  });
  console.log("Transaction hash:", receipt.hash);
};
```

---

### Toro Name Service (TNS)

- `useToroTNS(name)`: Resolve `.toronet` domain names to addresses or reverse lookup.
- `useToroUpdateTNS()`: Register or update TNS domain records.

```tsx
const { address, loading } = useToroTNS("alice.toronet");
const { updateTNS } = useToroUpdateTNS();
```

---

### Cross-Chain Bridge

Granular hooks for cross-chain token bridging between Toronet and external networks (Ethereum, Polygon, BSC, Arbitrum, Base, Avalanche):

- `useToroBridgeToken()`: Initiate cross-chain token transfer.
- `useToroBridgeFee(network, contract, amount)`: Estimate bridge fees.
- `useToroBridgeBalance(address, network)`: Native balance on target chain.
- `useToroBridgeTokenBalance(address, network, contract)`: Token balance on target chain.
- `useToroBridgeTransactions(address, network)`: History of bridge transactions.
- `useToroBridgeTokenTransactions(address, network, contract)`: History of token bridge transactions.

---

### Solana Suite

Native integration with the Toronet-Solana bridge:

- `useToroCreateSolanaAddress()`: Generate a Solana address.
- `useToroCreateToronetSolanaAddress()`: Link a Toronet account to Solana.
- `useToroTransferSolana()`: Send native SOL.
- `useToroTransferSolToken()`: Send SPL tokens on Solana.
- `useToroSolBalance(address)`: Query SOL balance.
- `useToroSolTokenBalance(address, mint)`: Query SPL token balance.
- `useToroSolTransactions(address)`: View Solana transaction history.
- `useToroIsValidSolanaAddress(address)`: Client-side validation of Solana pubkeys.

---

### Currency Swaps

- `useToroSwapQuote({ fromCurrency, toCurrency, amount })`: Instant algorithmic price quotes.
- `useToroSwap()`: Execute decentralized atomic currency swaps on Toronet.

```tsx
const { quote, loading: quoting } = useToroSwapQuote({
  fromCurrency: "USD",
  toCurrency: "NGN",
  amount: 50,
});

const { executeSwap, loading: swapping } = useToroSwap();
```

---

### Currency Administration

Admin-only hooks for managing on-chain currency parameters. All actions are protected by admin credentials.

- `useToroCurrencyAdmin()`: Unified hook exposing:
  - `allowCurrencyTransfer(currency, address, password)` — whitelist an address for transfers.
  - `disableCurrencyTransfer(currency, address, password)` — revoke transfer permission.
  - `freezeCurrencyAddress(params)` — freeze an address from sending a specific currency.
  - `unfreezeCurrencyAddress(params)` — lift a freeze on an address.
  - `enrollCurrencyAddress(params)` — enroll an address in a currency program.
  - `mintCurrencyFunds(params)` — mint new units of a currency to an address.
  - `burnCurrencyFunds(params)` — burn/destroy currency units from an address.

```tsx
const { mintCurrencyFunds, freezeCurrencyAddress, loading, error } =
  useToroCurrencyAdmin();

// Mint 1000 NGN to an address
await mintCurrencyFunds({
  currency: "NGN",
  address: "0x...",
  amount: "1000",
  password: "admin_pwd",
});

// Freeze a bad actor
await freezeCurrencyAddress({
  currency: "USD",
  address: "0xBadActor...",
  password: "admin_pwd",
});
```

---

### KYC & Compliance

- `useToroKYCStatus(address)`: Query whether a wallet address has passed KYC verification. Returns `{ isVerified, loading, error, refetch }`.
- `useToroPerformKYC()`: Admin mutation hook to submit KYC data for a customer. Returns `{ submitKYC, success, loading, error }`.

```tsx
// Check KYC status
const { isVerified, loading } = useToroKYCStatus(activeAddress);
if (isVerified === false) return <p>Please complete identity verification.</p>;

// Submit KYC (admin side)
const { submitKYC, success } = useToroPerformKYC();
await submitKYC({
  address: "0xCustomer...",
  adminAddress: "0xAdmin...",
  adminPassword: "admin_pwd",
  kycData: { name: "Alice", idNumber: "A12345678" },
});
```

---

### Transactions & Blockchain

- `useToroTransactions(address)`: Toronet transaction ledger for a wallet.
- `useToroTransactionByHash(hash)`: Transaction details and receipt.
- `useToroBlockchain()`: General chain metrics (block height, validators, gas price).

---

### Roles & Permissions

- `useToroAddressRole(address)`: Check if an address has `admin` or `superadmin` status.
- `useToroRoleMutations()`: Superadmin actions (`addAdmin`, `removeAdmin`).

---

### Smart Contract Deployer

- `useToroDeployContract()`: Deploy arbitrary EVM bytecode and constructor arguments to Toronet.

```tsx
const { deploy, loading, contractAddress } = useToroDeployContract();

await deploy({
  abi: myContractAbi,
  bytecode: myBytecode,
  constructorArgs: ["Initial Supply", 1000000],
  password: "admin_password",
});
```

---

### Products & Virtual Wallets

- `useToroProducts()`: Query merchant product catalogs.
- `useToroVirtualWallet()`: Query or provision off-chain/virtual sub-wallets.

---

### Chain Storage

- `useToroStorage()`: Query and configure chain-level decentralized key-value storage.

---

## Error Handling

`@reactforge/react` exports typed error classes for programmatic handling:

```tsx
import { ToroError, NetworkError, APIError } from '@reactforge/react';

try {
  await sendFunds(...);
} catch (err) {
  if (err instanceof NetworkError) {
    console.error('Offline or network timeout');
  } else if (err instanceof APIError) {
    console.error('Node rejected transaction with status:', err.status, err.detail);
  } else if (err instanceof ToroError) {
    console.error('Toro error code:', err.code);
  }
}
```

---

## Mobile Version

Building a React Native or Expo app? Use [`@reactforge/react-native`](https://www.npmjs.com/package/@reactforge/react-native) which includes:

- Hardware biometric authentication (Face ID / Fingerprint) via `expo-local-authentication`
- Hardware keychain security via `expo-secure-store`
- Out-of-the-box caching with TanStack Query
- CLI project generator (`npx toroforge-rn init`)

---

## License

MIT © [ToroForge Team](https://github.com/toroforge)
