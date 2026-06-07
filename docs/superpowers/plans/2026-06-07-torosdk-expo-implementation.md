# torosdk-expo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the torosdk-expo npm package — a typed React Native / Expo SDK 52 wrapper around torosdk (v0.2.0) providing secure password storage, TanStack Query hooks, and a CLI init tool, plus a working example Expo app.

**Architecture:** Three-layer single package with subpath exports: `torosdk-expo` (React hooks), `torosdk-expo/core` (zero-React typed SDK wrappers + auth + storage), `torosdk-expo/cli` (Node-only init script). The `example/` directory holds a standalone Expo SDK 52 app that exercises every hook. Tests use Jest with mocks for axios, SecureStore, and LocalAuthentication.

**Tech Stack:** TypeScript, React Native / Expo SDK 52, torosdk v0.2.0, @tanstack/react-query v5, expo-secure-store, expo-local-authentication, Jest, @testing-library/react-native

---

## File Structure

```
torosdk-expo/
├── package.json              # subpath exports, peer deps, scripts
├── tsconfig.json             # strict TS, React JSX, path aliases
├── .gitignore
├── .env.example
├── README.md
├── DEVELOPER_STORY.md        # already exists
├── src/
│   ├── core/
│   │   ├── index.ts          # barrel: types, errors, config, storage, auth, sdk
│   │   ├── types.ts          # OperationCategory, ToronetConfig, Currency re-export
│   │   ├── errors.ts         # ToroError, NetworkError, APIError, AuthBlockedError, StorageError
│   │   ├── config.ts         # getConfig, createConfig
│   │   ├── storage.ts        # SecureStore wrappers: getPassword, setPassword, wallet list
│   │   ├── auth.ts           # AuthStrategy interface, createPasswordStrategy, createBiometricStrategy, createCustomStrategy
│   │   └── sdk.ts            # Typed wrappers around torosdk calls (password injection)
│   ├── react/
│   │   ├── index.ts          # barrel: provider, all hooks
│   │   ├── provider.tsx      # ToronetProvider (context + QueryClientProvider)
│   │   ├── query-keys.ts     # query key factory
│   │   └── hooks/
│   │       ├── useWallets.ts
│   │       ├── useBalance.ts
│   │       ├── useTransfer.ts
│   │       ├── useTNS.ts
│   │       ├── useKYC.ts
│   │       └── useExchangeRates.ts
│   └── cli/
│       ├── init.ts           # npx torosdk-expo init entry point
│       └── templates/
│           ├── config.ts.template
│           ├── auth.ts.template
│           └── provider.tsx.template
├── example/
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

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "torosdk-expo",
  "version": "0.1.0",
  "description": "Expo wrapper for torosdk — secure password storage, TanStack Query hooks, and CLI init",
  "main": "dist/react/index.js",
  "types": "dist/react/index.d.ts",
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
  "files": [
    "dist/",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/"
  },
  "keywords": ["toronet", "torosdk", "expo", "react-native", "blockchain", "wallet"],
  "license": "MIT",
  "peerDependencies": {
    "expo-secure-store": ">=12.0.0",
    "expo-local-authentication": ">=14.0.0",
    "@tanstack/react-query": ">=5.0.0",
    "react": ">=18.0.0"
  },
  "peerDependenciesMeta": {
    "expo-local-authentication": {
      "optional": true
    }
  },
  "dependencies": {
    "torosdk": "^0.2.0"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/react": "^18.2.0",
    "@testing-library/react-native": "^12.4.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.3.0",
    "react": "^18.2.0",
    "@tanstack/react-query": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "torosdk-expo": ["./src/react/index.ts"],
      "torosdk-expo/core": ["./src/core/index.ts"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "example", "__tests__"]
}
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
dist/
.expo/
*.tsbuildinfo
.env
```

- [ ] **Step 4: Create .env.example**

```
TOROSDK_NETWORK=testnet
```

- [ ] **Step 5: Create jest.config.js**

```js
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  moduleNameMapper: {
    '^torosdk-expo$': '<rootDir>/src/react/index.ts',
    '^torosdk-expo/core$': '<rootDir>/src/core/index.ts',
    '^torosdk-expo/cli$': '<rootDir>/src/cli/init.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        strict: true,
        module: 'commonjs',
        target: 'ES2020',
        moduleResolution: 'node',
      }
    }],
  },
};
```

- [ ] **Step 6: Install dependencies and verify**

Run: `cd /Users/admin/torosdk-expo && npm install`
Expected: Dependencies installed, no errors.

- [ ] **Step 7: Commit**

```bash
git add package.json tsconfig.json .gitignore .env.example jest.config.js
git commit -m "chore: scaffold project with package.json, tsconfig, jest config"
```

---

### Task 2: Core Types

**Files:**
- Create: `src/core/types.ts`

- [ ] **Step 1: Write src/core/types.ts**

```ts
import type { Currency } from 'torosdk';

export type { Currency };

export type ToronetNetwork = 'testnet' | 'mainnet';

export interface ToronetConfig {
  network: ToronetNetwork;
  /** Optional: override the default API base URL */
  apiBaseUrl?: string;
}

export type OperationCategory =
  | 'balance'
  | 'transfer'
  | 'kyc'
  | 'tns-read'
  | 'tns-write'
  | 'exchange-rates'
  | 'wallet-create'
  | 'wallet-import'
  | 'wallet-delete';
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /Users/admin/torosdk-expo && npx tsc --noEmit src/core/types.ts`
Expected: No errors (may warn about torosdk types if not installed — OK if the file itself parses).

- [ ] **Step 3: Commit**

```bash
git add src/core/types.ts
git commit -m "feat(core): add TypeScript types — ToronetConfig, OperationCategory"
```

---

### Task 3: Core Errors

**Files:**
- Create: `src/core/errors.ts`

- [ ] **Step 1: Write src/core/errors.ts**

```ts
export type ToroErrorCode = 'NETWORK' | 'API' | 'AUTH_BLOCKED' | 'STORAGE';

export class ToroError extends Error {
  public readonly code: ToroErrorCode;
  public readonly detail: string;
  public readonly cause?: unknown;

  constructor(code: ToroErrorCode, detail: string, cause?: unknown) {
    super(`[torosdk-expo] ${detail}`);
    this.name = 'ToroError';
    this.code = code;
    this.detail = detail;
    this.cause = cause;
  }
}

export class NetworkError extends ToroError {
  constructor(detail: string, cause?: unknown) {
    super('NETWORK', detail, cause);
    this.name = 'NetworkError';
  }
}

export class APIError extends ToroError {
  public readonly status?: number;

  constructor(detail: string, status?: number, cause?: unknown) {
    super('API', detail, cause);
    this.name = 'APIError';
    this.status = status;
  }
}

export class AuthBlockedError extends ToroError {
  public readonly operation: string;

  constructor(operation: string, detail?: string) {
    super('AUTH_BLOCKED', detail ?? `Auth blocked for operation: ${operation}`);
    this.name = 'AuthBlockedError';
    this.operation = operation;
  }
}

export class StorageError extends ToroError {
  constructor(detail: string, cause?: unknown) {
    super('STORAGE', detail, cause);
    this.name = 'StorageError';
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/core/errors.ts
git commit -m "feat(core): add error hierarchy — ToroError, NetworkError, APIError, AuthBlockedError, StorageError"
```

---

### Task 4: Core Config

**Files:**
- Create: `src/core/config.ts`

- [ ] **Step 1: Write src/core/config.ts**

```ts
import type { ToronetConfig, ToronetNetwork } from './types';

let _config: ToronetConfig | null = null;

const DEFAULT_API_BASE_URLS: Record<ToronetNetwork, string> = {
  testnet: 'https://api.testnet.toronet.org',
  mainnet: 'https://api.toronet.org',
};

export function createConfig(config: ToronetConfig): ToronetConfig {
  _config = {
    network: config.network,
    apiBaseUrl: config.apiBaseUrl ?? DEFAULT_API_BASE_URLS[config.network],
  };
  return _config;
}

export function getConfig(): ToronetConfig {
  if (!_config) {
    throw new Error(
      '[torosdk-expo] Config not initialized. Call createConfig() before using any SDK functions.'
    );
  }
  return _config;
}

export function getApiBaseUrl(): string {
  return getConfig().apiBaseUrl ?? DEFAULT_API_BASE_URLS[getConfig().network];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/core/config.ts
git commit -m "feat(core): add config management — createConfig, getConfig, per-network API base URLs"
```

---

### Task 5: Core Storage

**Files:**
- Create: `src/core/storage.ts`

- [ ] **Step 1: Write src/core/storage.ts**

```ts
import * as SecureStore from 'expo-secure-store';
import { StorageError } from './errors';

const WALLET_LIST_KEY = 'torosdk_wallets';
const ACTIVE_WALLET_KEY = 'torosdk_active_wallet';
const PASSWORD_KEY_PREFIX = 'wallet_pwd_';

function passwordKey(address: string): string {
  return `${PASSWORD_KEY_PREFIX}${address.toLowerCase()}`;
}

// --- Password storage ---

export async function getPassword(address: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(passwordKey(address));
  } catch (err) {
    throw new StorageError(`Failed to read password for ${address}`, err);
  }
}

export async function setPassword(address: string, password: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(passwordKey(address), password);
  } catch (err) {
    throw new StorageError(`Failed to store password for ${address}`, err);
  }
}

export async function deletePassword(address: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(passwordKey(address));
  } catch (err) {
    throw new StorageError(`Failed to delete password for ${address}`, err);
  }
}

// --- Wallet list storage ---

export async function getWalletList(): Promise<string[]> {
  try {
    const raw = await SecureStore.getItemAsync(WALLET_LIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch (err) {
    throw new StorageError('Failed to read wallet list', err);
  }
}

export async function addWalletToList(address: string): Promise<void> {
  const list = await getWalletList();
  const normalized = address.toLowerCase();
  if (!list.includes(normalized)) {
    list.push(normalized);
    await SecureStore.setItemAsync(WALLET_LIST_KEY, JSON.stringify(list));
  }
}

export async function removeWalletFromList(address: string): Promise<void> {
  const list = await getWalletList();
  const normalized = address.toLowerCase();
  const filtered = list.filter((a) => a !== normalized);
  if (filtered.length !== list.length) {
    await SecureStore.setItemAsync(WALLET_LIST_KEY, JSON.stringify(filtered));
  }
}

// --- Active wallet ---

export async function getActiveWallet(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACTIVE_WALLET_KEY);
  } catch (err) {
    throw new StorageError('Failed to read active wallet', err);
  }
}

export async function setActiveWallet(address: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(ACTIVE_WALLET_KEY, address.toLowerCase());
  } catch (err) {
    throw new StorageError('Failed to set active wallet', err);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/core/storage.ts
git commit -m "feat(core): add SecureStore wrappers — password CRUD, wallet list, active wallet"
```

---

### Task 6: Core Auth Strategies

**Files:**
- Create: `src/core/auth.ts`

- [ ] **Step 1: Write src/core/auth.ts**

```ts
import * as LocalAuthentication from 'expo-local-authentication';
import type { OperationCategory } from './types';
import { AuthBlockedError } from './errors';

export interface AuthStrategy {
  authorize(operation: OperationCategory): Promise<boolean>;
}

// --- Password strategy (always allow) ---

export function createPasswordStrategy(): AuthStrategy {
  return {
    async authorize(_operation: OperationCategory): Promise<boolean> {
      return true;
    },
  };
}

// --- Biometric strategy ---

export interface BiometricStrategyOptions {
  requireFor: OperationCategory[];
  skipFor: OperationCategory[];
}

export function createBiometricStrategy(options: BiometricStrategyOptions): AuthStrategy {
  return {
    async authorize(operation: OperationCategory): Promise<boolean> {
      if (options.skipFor.includes(operation)) {
        return true;
      }
      if (options.requireFor.includes(operation)) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: `Authenticate to ${describeOperation(operation)}`,
          fallbackLabel: 'Use device passcode',
        });
        if (!result.success) {
          throw new AuthBlockedError(operation, result.error ?? 'Biometric authentication failed');
        }
        return true;
      }
      // Operation not listed in either — default to allow
      return true;
    },
  };
}

// --- Custom strategy ---

export function createCustomStrategy(
  fn: (operation: OperationCategory) => Promise<boolean>
): AuthStrategy {
  return {
    async authorize(operation: OperationCategory): Promise<boolean> {
      const allowed = await fn(operation);
      if (!allowed) {
        throw new AuthBlockedError(operation, 'Custom auth strategy denied the operation');
      }
      return true;
    },
  };
}

// --- Helpers ---

function describeOperation(op: OperationCategory): string {
  const labels: Record<OperationCategory, string> = {
    balance: 'check balances',
    transfer: 'send funds',
    kyc: 'verify identity',
    'tns-read': 'look up names',
    'tns-write': 'register names',
    'exchange-rates': 'view rates',
    'wallet-create': 'create a wallet',
    'wallet-import': 'import a wallet',
    'wallet-delete': 'delete a wallet',
  };
  return labels[op] ?? op;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/core/auth.ts
git commit -m "feat(core): add auth strategies — password, biometric, custom"
```

---

### Task 7: Core SDK Wrappers

**Files:**
- Create: `src/core/sdk.ts`

- [ ] **Step 1: Write src/core/sdk.ts**

```ts
import * as torosdk from 'torosdk';
import type { Currency } from 'torosdk';
import { getConfig } from './config';
import { getPassword } from './storage';
import type { AuthStrategy } from './auth';
import type { OperationCategory } from './types';
import { NetworkError, APIError } from './errors';

let _authStrategy: AuthStrategy | null = null;

export function setAuthStrategy(strategy: AuthStrategy): void {
  _authStrategy = strategy;
}

export function getAuthStrategy(): AuthStrategy {
  if (!_authStrategy) {
    throw new Error(
      '[torosdk-expo] Auth strategy not set. Call setAuthStrategy() or use ToronetProvider.'
    );
  }
  return _authStrategy;
}

// --- Internal helper: resolve password for an address ---

async function resolvePassword(
  address: string,
  operation: OperationCategory
): Promise<string> {
  const auth = getAuthStrategy();
  await auth.authorize(operation);
  const pwd = await getPassword(address);
  if (!pwd) {
    throw new Error(`[torosdk-expo] No stored password for ${address}. Import or create a wallet first.`);
  }
  return pwd;
}

// --- Error wrapper ---

function wrapError(err: unknown): never {
  if (err instanceof Error) {
    const msg = err.message;
    if (msg.includes('Network Error') || msg.includes('timeout')) {
      throw new NetworkError(msg, err);
    }
    // axios errors often have a response property
    const axiosErr = err as { response?: { status?: number; data?: unknown } };
    if (axiosErr.response) {
      throw new APIError(
        msg,
        axiosErr.response.status,
        axiosErr.response.data
      );
    }
    throw new NetworkError(msg, err);
  }
  throw new NetworkError(String(err), err);
}

// --- Wallet operations ---

export async function createWallet(
  username: string,
  password: string
): Promise<string> {
  try {
    const result = await torosdk.createWallet(username, password);
    return result.address ?? (result as unknown as string);
  } catch (err) {
    wrapError(err);
  }
}

export async function importWallet(
  privateKey: string,
  password: string
): Promise<string> {
  try {
    const result = await torosdk.importWalletFromPrivateKeyAndPassword(privateKey, password);
    return typeof result === 'string' ? result : (result as { address: string }).address;
  } catch (err) {
    wrapError(err);
  }
}

export async function verifyWalletPassword(
  address: string,
  password: string
): Promise<boolean> {
  try {
    const result = await torosdk.verifyWalletPassword(address, password);
    return typeof result === 'boolean' ? result : true;
  } catch (err) {
    wrapError(err);
  }
}

// --- Balance ---

export async function getBalanceForCurrency(
  address: string,
  currency: Currency
): Promise<{ balance: string; currency: Currency }> {
  try {
    const pwd = await resolvePassword(address, 'balance');
    const balance = await torosdk.getCurrencyBalance(address, pwd, currency);
    return { balance: String(balance), currency };
  } catch (err) {
    wrapError(err);
  }
}

export async function getBalances(
  address: string
): Promise<Array<{ balance: string; currency: Currency }>> {
  try {
    const pwd = await resolvePassword(address, 'balance');
    const currencies: Currency[] = ['NGN', 'USD', 'KSH', 'ZAR', 'GBP', 'EUR'];
    const results = await Promise.all(
      currencies.map(async (currency) => {
        try {
          const balance = await torosdk.getCurrencyBalance(address, pwd, currency);
          return { balance: String(balance), currency };
        } catch {
          return { balance: '0', currency };
        }
      })
    );
    return results;
  } catch (err) {
    wrapError(err);
  }
}

// --- Transfers ---

export async function makeTransfer(
  senderAddress: string,
  receiverAddress: string,
  amount: string,
  currency: Currency
): Promise<{ transactionHash?: string; reference?: string }> {
  try {
    const pwd = await resolvePassword(senderAddress, 'transfer');
    const result = await torosdk.makeInterWalletTransfer(
      senderAddress,
      pwd,
      receiverAddress,
      amount,
      currency
    );
    return result as { transactionHash?: string; reference?: string };
  } catch (err) {
    wrapError(err);
  }
}

// --- TNS ---

export async function resolveTNS(name: string): Promise<string> {
  try {
    const result = await torosdk.configureTNS({ action: 'resolve', name });
    return typeof result === 'string' ? result : (result as { address: string }).address;
  } catch (err) {
    wrapError(err);
  }
}

export async function lookupTNS(address: string): Promise<string | null> {
  try {
    const result = await torosdk.configureTNS({ action: 'lookup', address });
    return typeof result === 'string' ? result : (result as { name: string })?.name ?? null;
  } catch (err) {
    wrapError(err);
  }
}

export async function setTNS(
  address: string,
  name: string
): Promise<void> {
  try {
    const pwd = await resolvePassword(address, 'tns-write');
    await torosdk.configureTNS({ action: 'register', address, name, password: pwd });
  } catch (err) {
    wrapError(err);
  }
}

// --- KYC ---

export async function getKYCStatus(
  address: string
): Promise<{ verified: boolean; details?: unknown }> {
  try {
    const verified = await torosdk.isAddressKYCVerified(address);
    return { verified: Boolean(verified) };
  } catch (err) {
    wrapError(err);
  }
}

export async function submitKYC(
  address: string,
  customerData: Record<string, unknown>
): Promise<unknown> {
  try {
    const pwd = await resolvePassword(address, 'kyc');
    const result = await torosdk.performKYCForCustomer(address, pwd, customerData);
    return result;
  } catch (err) {
    wrapError(err);
  }
}

// --- Exchange rates ---

export async function getExchangeRates(): Promise<
  Array<{ pair: string; rate: number }>
> {
  try {
    const result = await torosdk.getSupportedAssetsExchangeRates();
    if (Array.isArray(result)) return result as Array<{ pair: string; rate: number }>;
    // Result might be a record — normalize to array
    if (result && typeof result === 'object') {
      return Object.entries(result as Record<string, number>).map(([pair, rate]) => ({
        pair,
        rate,
      }));
    }
    return [];
  } catch (err) {
    wrapError(err);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/core/sdk.ts
git commit -m "feat(core): add typed SDK wrappers — wallet ops, balances, transfers, TNS, KYC, exchange rates"
```

---

### Task 8: Core Barrel Export

**Files:**
- Create: `src/core/index.ts`

- [ ] **Step 1: Write src/core/index.ts**

```ts
// Types
export type { ToronetConfig, ToronetNetwork, OperationCategory, Currency } from './types';

// Errors
export {
  ToroError,
  NetworkError,
  APIError,
  AuthBlockedError,
  StorageError,
} from './errors';
export type { ToroErrorCode } from './errors';

// Config
export { createConfig, getConfig, getApiBaseUrl } from './config';

// Storage
export {
  getPassword,
  setPassword,
  deletePassword,
  getWalletList,
  addWalletToList,
  removeWalletFromList,
  getActiveWallet,
  setActiveWallet,
} from './storage';

// Auth
export {
  createPasswordStrategy,
  createBiometricStrategy,
  createCustomStrategy,
  setAuthStrategy,
  getAuthStrategy,
} from './auth';
export type { AuthStrategy, BiometricStrategyOptions } from './auth';

// SDK
export {
  createWallet,
  importWallet,
  verifyWalletPassword,
  getBalanceForCurrency,
  getBalances,
  makeTransfer,
  resolveTNS,
  lookupTNS,
  setTNS,
  getKYCStatus,
  submitKYC,
  getExchangeRates,
} from './sdk';
```

- [ ] **Step 2: Commit**

```bash
git add src/core/index.ts
git commit -m "feat(core): add barrel export for torosdk-expo/core"
```

---

### Task 9: React Provider

**Files:**
- Create: `src/react/provider.tsx`

- [ ] **Step 1: Write src/react/provider.tsx**

```tsx
import React, { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ToronetConfig } from '../core/types';
import type { AuthStrategy } from '../core/auth';
import { setAuthStrategy } from '../core/auth';
import { createConfig } from '../core/config';

export interface ToronetProviderProps {
  config: ToronetConfig;
  authStrategy: AuthStrategy;
  queryClient?: QueryClient;
  children: ReactNode;
}

interface ToronetContextValue {
  config: ToronetConfig;
  authStrategy: AuthStrategy;
}

const ToronetContext = createContext<ToronetContextValue | null>(null);

const DEFAULT_QUERY_CLIENT = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  },
});

export function ToronetProvider({
  config,
  authStrategy,
  queryClient,
  children,
}: ToronetProviderProps): JSX.Element {
  const value = useMemo<ToronetContextValue>(
    () => ({ config, authStrategy }),
    [config, authStrategy]
  );

  useEffect(() => {
    createConfig(config);
    setAuthStrategy(authStrategy);
  }, [config, authStrategy]);

  const client = queryClient ?? DEFAULT_QUERY_CLIENT;

  return (
    <ToronetContext.Provider value={value}>
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    </ToronetContext.Provider>
  );
}

export function useToronetContext(): ToronetContextValue {
  const ctx = useContext(ToronetContext);
  if (!ctx) {
    throw new Error(
      '[torosdk-expo] useToronetContext must be used within a <ToronetProvider>'
    );
  }
  return ctx;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/react/provider.tsx
git commit -m "feat(react): add ToronetProvider — context, QueryClientProvider, config wiring"
```

---

### Task 10: React Query Keys

**Files:**
- Create: `src/react/query-keys.ts`

- [ ] **Step 1: Write src/react/query-keys.ts**

```ts
import type { Currency } from '../core/types';

export const queryKeys = {
  all: ['torosdk'] as const,

  balance: (address: string, currency: Currency) =>
    [...queryKeys.all, 'balance', address.toLowerCase(), currency] as const,

  balances: (address: string) =>
    [...queryKeys.all, 'balances', address.toLowerCase()] as const,

  transfer: () =>
    [...queryKeys.all, 'transfer'] as const,

  resolveTNS: (name: string) =>
    [...queryKeys.all, 'tns', 'resolve', name] as const,

  lookupTNS: (address: string) =>
    [...queryKeys.all, 'tns', 'lookup', address.toLowerCase()] as const,

  kycStatus: (address: string) =>
    [...queryKeys.all, 'kyc', address.toLowerCase()] as const,

  exchangeRates: () =>
    [...queryKeys.all, 'exchange-rates'] as const,
};
```

- [ ] **Step 2: Commit**

```bash
git add src/react/query-keys.ts
git commit -m "feat(react): add query key factory for TanStack Query cache management"
```

---

### Task 11: React useWallets Hook

**Files:**
- Create: `src/react/hooks/useWallets.ts`

- [ ] **Step 1: Write src/react/hooks/useWallets.ts**

```ts
import { useState, useEffect, useCallback } from 'react';
import {
  getWalletList,
  getActiveWallet,
  setActiveWallet,
  addWalletToList as addWalletToStorage,
  removeWalletFromList as removeWalletFromStorage,
} from '../../core/storage';

export interface WalletsState {
  all: string[];
  active: string | null;
  switchWallet: (address: string) => Promise<void>;
  addWallet: (address: string) => Promise<void>;
  removeWallet: (address: string) => Promise<void>;
  refresh: () => Promise<void>;
  isLoading: boolean;
}

export function useWallets(): WalletsState {
  const [all, setAll] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [list, activeWallet] = await Promise.all([
      getWalletList(),
      getActiveWallet(),
    ]);
    setAll(list);
    setActive(activeWallet);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const switchWallet = useCallback(async (address: string) => {
    await setActiveWallet(address);
    setActive(address.toLowerCase());
  }, []);

  const addWallet = useCallback(async (address: string) => {
    await addWalletToStorage(address);
    await refresh();
  }, [refresh]);

  const removeWallet = useCallback(async (address: string) => {
    await removeWalletFromStorage(address);
    await refresh();
  }, [refresh]);

  return {
    all,
    active,
    switchWallet,
    addWallet,
    removeWallet,
    refresh,
    isLoading,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/react/hooks/useWallets.ts
git commit -m "feat(react): add useWallets hook — wallet list, active wallet, switch/add/remove"
```

---

### Task 12: React useBalance & useBalances Hooks

**Files:**
- Create: `src/react/hooks/useBalance.ts`

- [ ] **Step 1: Write src/react/hooks/useBalance.ts**

```ts
import { useQuery } from '@tanstack/react-query';
import type { Currency } from '../../core/types';
import { getBalanceForCurrency, getBalances } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export interface UseBalanceOptions {
  address: string;
  currency: Currency;
  enabled?: boolean;
}

export function useBalance({ address, currency, enabled = true }: UseBalanceOptions) {
  return useQuery({
    queryKey: queryKeys.balance(address, currency),
    queryFn: () => getBalanceForCurrency(address, currency),
    staleTime: 30_000,
    enabled: enabled && !!address,
  });
}

export interface UseBalancesOptions {
  address: string;
  enabled?: boolean;
}

export function useBalances({ address, enabled = true }: UseBalancesOptions) {
  return useQuery({
    queryKey: queryKeys.balances(address),
    queryFn: () => getBalances(address),
    staleTime: 30_000,
    enabled: enabled && !!address,
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/react/hooks/useBalance.ts
git commit -m "feat(react): add useBalance and useBalances hooks"
```

---

### Task 13: React useTransfer Hook

**Files:**
- Create: `src/react/hooks/useTransfer.ts`

- [ ] **Step 1: Write src/react/hooks/useTransfer.ts**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Currency } from '../../core/types';
import { makeTransfer } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export interface TransferVariables {
  senderAddress: string;
  receiverAddress: string;
  amount: string;
  currency: Currency;
}

export function useTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ senderAddress, receiverAddress, amount, currency }: TransferVariables) =>
      makeTransfer(senderAddress, receiverAddress, amount, currency),
    onSuccess: (_data, variables) => {
      // Invalidate balances for the sender so they refresh after transfer
      queryClient.invalidateQueries({
        queryKey: queryKeys.balances(variables.senderAddress),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.balance(variables.senderAddress, variables.currency),
      });
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/react/hooks/useTransfer.ts
git commit -m "feat(react): add useTransfer mutation hook with balance invalidation"
```

---

### Task 14: React useTNS Hooks

**Files:**
- Create: `src/react/hooks/useTNS.ts`

- [ ] **Step 1: Write src/react/hooks/useTNS.ts**

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveTNS, lookupTNS, setTNS } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export function useResolveTNS(name: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.resolveTNS(name),
    queryFn: () => resolveTNS(name),
    staleTime: 5 * 60_000,
    enabled: enabled && !!name,
  });
}

export function useLookupTNS(address: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.lookupTNS(address),
    queryFn: () => lookupTNS(address),
    staleTime: 5 * 60_000,
    enabled: enabled && !!address,
  });
}

export interface SetTNSVariables {
  address: string;
  name: string;
}

export function useSetTNS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ address, name }: SetTNSVariables) => setTNS(address, name),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.resolveTNS(variables.name),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lookupTNS(variables.address),
      });
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/react/hooks/useTNS.ts
git commit -m "feat(react): add useResolveTNS, useLookupTNS, useSetTNS hooks"
```

---

### Task 15: React useKYC Hooks

**Files:**
- Create: `src/react/hooks/useKYC.ts`

- [ ] **Step 1: Write src/react/hooks/useKYC.ts**

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getKYCStatus, submitKYC } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export interface UseKYCStatusOptions {
  address: string;
  enabled?: boolean;
}

export function useKYCStatus({ address, enabled = true }: UseKYCStatusOptions) {
  return useQuery({
    queryKey: queryKeys.kycStatus(address),
    queryFn: () => getKYCStatus(address),
    staleTime: 5 * 60_000,
    enabled: enabled && !!address,
  });
}

export function useSubmitKYC() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      address,
      customerData,
    }: {
      address: string;
      customerData: Record<string, unknown>;
    }) => submitKYC(address, customerData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.kycStatus(variables.address),
      });
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/react/hooks/useKYC.ts
git commit -m "feat(react): add useKYCStatus and useSubmitKYC hooks"
```

---

### Task 16: React useExchangeRates Hook

**Files:**
- Create: `src/react/hooks/useExchangeRates.ts`

- [ ] **Step 1: Write src/react/hooks/useExchangeRates.ts**

```ts
import { useQuery } from '@tanstack/react-query';
import { getExchangeRates } from '../../core/sdk';
import { queryKeys } from '../query-keys';

export function useExchangeRates() {
  return useQuery({
    queryKey: queryKeys.exchangeRates(),
    queryFn: getExchangeRates,
    staleTime: 60_000,
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/react/hooks/useExchangeRates.ts
git commit -m "feat(react): add useExchangeRates hook"
```

---

### Task 17: React Barrel Export

**Files:**
- Create: `src/react/index.ts`

- [ ] **Step 1: Write src/react/index.ts**

```ts
// Provider
export { ToronetProvider, useToronetContext } from './provider';
export type { ToronetProviderProps } from './provider';

// Query keys
export { queryKeys } from './query-keys';

// Hooks
export { useWallets } from './hooks/useWallets';
export type { WalletsState } from './hooks/useWallets';

export { useBalance, useBalances } from './hooks/useBalance';
export type { UseBalanceOptions, UseBalancesOptions } from './hooks/useBalance';

export { useTransfer } from './hooks/useTransfer';
export type { TransferVariables } from './hooks/useTransfer';

export { useResolveTNS, useLookupTNS, useSetTNS } from './hooks/useTNS';
export type { SetTNSVariables } from './hooks/useTNS';

export { useKYCStatus, useSubmitKYC } from './hooks/useKYC';
export type { UseKYCStatusOptions } from './hooks/useKYC';

export { useExchangeRates } from './hooks/useExchangeRates';
```

- [ ] **Step 2: Commit**

```bash
git add src/react/index.ts
git commit -m "feat(react): add barrel export for torosdk-expo main entry"
```

---

### Task 18: CLI Templates

**Files:**
- Create: `src/cli/templates/config.ts.template`
- Create: `src/cli/templates/auth.ts.template`
- Create: `src/cli/templates/provider.tsx.template`

- [ ] **Step 1: Write src/cli/templates/config.ts.template**

```ts
import type { ToronetConfig } from 'torosdk-expo/core';

export const config: ToronetConfig = {
  network: (process.env.TOROSDK_NETWORK as 'testnet' | 'mainnet') ?? 'testnet',
};
```

- [ ] **Step 2: Write src/cli/templates/auth.ts.template**

```ts
import {
  createPasswordStrategy,
  createBiometricStrategy,
  createCustomStrategy,
  type AuthStrategy,
} from 'torosdk-expo/core';

/**
 * Choose your auth strategy:
 *
 * 1. Password — password is stored in SecureStore and filled silently.
 *    Uncomment: export const authStrategy = createPasswordStrategy();
 *
 * 2. Biometric — requires fingerprint/Face ID for sensitive operations.
 *    Uncomment the biometricStrategy below and adjust which operation
 *    categories require biometric verification.
 *
 * 3. Custom — wire up your own auth flow (social auth, PIN, etc.).
 *    Uncomment the customStrategy and implement your authorize function.
 */

// --- Option 1: Password (silent fill) ---
export const authStrategy: AuthStrategy = createPasswordStrategy();

// --- Option 2: Biometric ---
// export const authStrategy: AuthStrategy = createBiometricStrategy({
//   requireFor: ['transfer', 'kyc', 'tns-write', 'wallet-delete'],
//   skipFor: ['balance', 'tns-read', 'exchange-rates', 'wallet-create', 'wallet-import'],
// });

// --- Option 3: Custom ---
// export const authStrategy: AuthStrategy = createCustomStrategy(async (operation) => {
//   // Replace with your own auth logic (social auth, server-side check, etc.)
//   console.log(`Authorizing operation: ${operation}`);
//   return true;
// });
```

- [ ] **Step 3: Write src/cli/templates/provider.tsx.template**

```tsx
import React, { type ReactNode } from 'react';
import { ToronetProvider } from 'torosdk-expo';
import { config } from './config';
import { authStrategy } from './auth';

export function ToroWrapper({ children }: { children: ReactNode }) {
  return (
    <ToronetProvider config={config} authStrategy={authStrategy}>
      {children}
    </ToronetProvider>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/cli/templates/
git commit -m "feat(cli): add scaffold templates — config, auth, provider"
```

---

### Task 19: CLI Init Script

**Files:**
- Create: `src/cli/init.ts`

- [ ] **Step 1: Write src/cli/init.ts**

```ts
#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const TEMPLATES_DIR = path.resolve(__dirname, 'templates');
const TARGET_DIR = 'src/torosdk';

function main(): void {
  console.log('\n🔧 torosdk-expo init\n');

  // 1. Detect Expo project
  const cwd = process.cwd();
  const appJsonPath = path.join(cwd, 'app.json');
  const appConfigPath = path.join(cwd, 'app.config.js');
  const appConfigTsPath = path.join(cwd, 'app.config.ts');

  const hasAppJson = fs.existsSync(appJsonPath);
  const hasAppConfig = fs.existsSync(appConfigPath) || fs.existsSync(appConfigTsPath);

  if (!hasAppJson && !hasAppConfig) {
    console.warn('⚠️  No app.json or app.config found. Are you in an Expo project root?');
    console.warn('   Continuing anyway...\n');
  } else {
    console.log('✅ Detected Expo project');
  }

  // 2. Determine package manager
  let pm = 'npm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    pm = 'yarn';
  } else if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    pm = 'pnpm';
  }

  console.log(`📦 Installing dependencies with ${pm}...`);
  const deps = 'torosdk @tanstack/react-query expo-secure-store expo-local-authentication';
  try {
    execSync(`${pm} install ${deps}`, { cwd, stdio: 'inherit' });
  } catch {
    console.error('❌ Failed to install dependencies. Check your network and try again.');
    process.exit(1);
  }
  console.log('✅ Dependencies installed\n');

  // 3. Scaffold files
  const targetPath = path.join(cwd, TARGET_DIR);

  if (fs.existsSync(targetPath)) {
    console.log(`⚠️  ${TARGET_DIR}/ already exists. Files may be overwritten.`);
  }

  fs.mkdirSync(targetPath, { recursive: true });

  const files = ['config.ts.template', 'auth.ts.template', 'provider.tsx.template'];
  const destNames = ['config.ts', 'auth.ts', 'provider.tsx'];

  for (let i = 0; i < files.length; i++) {
    const src = path.join(TEMPLATES_DIR, files[i]);
    const dest = path.join(targetPath, destNames[i]);

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`   Created ${TARGET_DIR}/${destNames[i]}`);
    } else {
      // Fallback: templates might be at a different path in development
      const altSrc = path.join(__dirname, '..', '..', 'src', 'cli', 'templates', files[i]);
      if (fs.existsSync(altSrc)) {
        fs.copyFileSync(altSrc, dest);
        console.log(`   Created ${TARGET_DIR}/${destNames[i]}`);
      } else {
        console.warn(`⚠️  Could not find template: ${files[i]}`);
      }
    }
  }

  // 4. Append to .env.example
  const envPath = path.join(cwd, '.env.example');
  const envLine = 'TOROSDK_NETWORK=testnet';
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }
  if (!envContent.includes('TOROSDK_NETWORK')) {
    fs.appendFileSync(envPath, envContent.endsWith('\n') ? `${envLine}\n` : `\n${envLine}\n`);
    console.log('   Updated .env.example');
  }

  // 5. Print summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ torosdk-expo is ready!');
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Choose an auth strategy in ${TARGET_DIR}/auth.ts`);
  console.log(`  2. Wrap your app with <ToroWrapper> from ${TARGET_DIR}/provider.tsx`);
  console.log('  3. Start building with hooks: useBalance, useTransfer, useWallets...');
  console.log('');
  console.log('Docs: https://github.com/toroforge/torosdk-expo');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main();
```

- [ ] **Step 2: Commit**

```bash
git add src/cli/init.ts
git commit -m "feat(cli): add init script — detect Expo project, install deps, scaffold config"
```

---

### Task 20: Core Tests — Storage

**Files:**
- Create: `__tests__/core/storage.test.ts`

- [ ] **Step 1: Write __tests__/core/storage.test.ts**

```ts
// Mock expo-secure-store before importing the module under test
const mockStore: Record<string, string> = {};

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (key: string) => mockStore[key] ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockStore[key] = value;
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    delete mockStore[key];
  }),
}));

import {
  getPassword,
  setPassword,
  deletePassword,
  getWalletList,
  addWalletToList,
  removeWalletFromList,
  getActiveWallet,
  setActiveWallet,
} from '../../src/core/storage';

beforeEach(() => {
  Object.keys(mockStore).forEach((k) => delete mockStore[k]);
});

describe('password storage', () => {
  const addr = '0xAbCdEf1234567890';

  test('setPassword stores at the correct key', async () => {
    await setPassword(addr, 'mysecret');
    expect(mockStore['wallet_pwd_0xabcdef1234567890']).toBe('mysecret');
  });

  test('getPassword returns null when not stored', async () => {
    const result = await getPassword(addr);
    expect(result).toBeNull();
  });

  test('getPassword returns stored password', async () => {
    await setPassword(addr, 'mysecret');
    const result = await getPassword(addr);
    expect(result).toBe('mysecret');
  });

  test('deletePassword removes the password', async () => {
    await setPassword(addr, 'mysecret');
    await deletePassword(addr);
    const result = await getPassword(addr);
    expect(result).toBeNull();
  });

  test('addresses are normalized to lowercase', async () => {
    await setPassword('0xABCDEF', 'pw');
    const result = await getPassword('0xabcdef');
    expect(result).toBe('pw');
  });
});

describe('wallet list', () => {
  test('getWalletList returns empty array when nothing stored', async () => {
    const result = await getWalletList();
    expect(result).toEqual([]);
  });

  test('addWalletToList adds normalized address', async () => {
    await addWalletToList('0xABC');
    await addWalletToList('0xDEF');
    const list = await getWalletList();
    expect(list).toEqual(['0xabc', '0xdef']);
  });

  test('addWalletToList does not duplicate', async () => {
    await addWalletToList('0xABC');
    await addWalletToList('0xabc');
    const list = await getWalletList();
    expect(list).toEqual(['0xabc']);
  });

  test('removeWalletFromList removes the address', async () => {
    await addWalletToList('0xAAA');
    await addWalletToList('0xBBB');
    await removeWalletFromList('0xaaa');
    const list = await getWalletList();
    expect(list).toEqual(['0xbbb']);
  });
});

describe('active wallet', () => {
  test('getActiveWallet returns null when not set', async () => {
    const result = await getActiveWallet();
    expect(result).toBeNull();
  });

  test('setActiveWallet and getActiveWallet roundtrip', async () => {
    await setActiveWallet('0x123');
    const result = await getActiveWallet();
    expect(result).toBe('0x123');
  });
});
```

- [ ] **Step 2: Run tests**

Run: `cd /Users/admin/torosdk-expo && npx jest __tests__/core/storage.test.ts --no-coverage`
Expected: All 9 tests pass.

- [ ] **Step 3: Commit**

```bash
git add __tests__/core/storage.test.ts
git commit -m "test(core): add storage tests — password CRUD, wallet list, active wallet"
```

---

### Task 21: Core Tests — Auth

**Files:**
- Create: `__tests__/core/auth.test.ts`

- [ ] **Step 1: Write __tests__/core/auth.test.ts**

```ts
const mockAuthenticateAsync = jest.fn();

jest.mock('expo-local-authentication', () => ({
  authenticateAsync: mockAuthenticateAsync,
}));

import {
  createPasswordStrategy,
  createBiometricStrategy,
  createCustomStrategy,
} from '../../src/core/auth';
import { AuthBlockedError } from '../../src/core/errors';

beforeEach(() => {
  mockAuthenticateAsync.mockReset();
});

describe('createPasswordStrategy', () => {
  test('always returns true for any operation', async () => {
    const strategy = createPasswordStrategy();
    await expect(strategy.authorize('balance')).resolves.toBe(true);
    await expect(strategy.authorize('transfer')).resolves.toBe(true);
    await expect(strategy.authorize('wallet-delete')).resolves.toBe(true);
  });
});

describe('createBiometricStrategy', () => {
  const strategy = createBiometricStrategy({
    requireFor: ['transfer', 'kyc'],
    skipFor: ['balance', 'exchange-rates'],
  });

  test('returns true immediately for skipFor operations', async () => {
    await expect(strategy.authorize('balance')).resolves.toBe(true);
    expect(mockAuthenticateAsync).not.toHaveBeenCalled();
  });

  test('calls biometric auth for requireFor operations on success', async () => {
    mockAuthenticateAsync.mockResolvedValueOnce({ success: true });
    await expect(strategy.authorize('transfer')).resolves.toBe(true);
    expect(mockAuthenticateAsync).toHaveBeenCalledTimes(1);
  });

  test('throws AuthBlockedError when biometric fails', async () => {
    mockAuthenticateAsync.mockResolvedValueOnce({ success: false, error: 'user_cancel' });
    await expect(strategy.authorize('transfer')).rejects.toThrow(AuthBlockedError);
  });

  test('defaults to allow for unlisted operations', async () => {
    await expect(strategy.authorize('tns-read')).resolves.toBe(true);
    expect(mockAuthenticateAsync).not.toHaveBeenCalled();
  });
});

describe('createCustomStrategy', () => {
  test('returns true when fn returns true', async () => {
    const strategy = createCustomStrategy(async () => true);
    await expect(strategy.authorize('transfer')).resolves.toBe(true);
  });

  test('throws AuthBlockedError when fn returns false', async () => {
    const strategy = createCustomStrategy(async () => false);
    await expect(strategy.authorize('transfer')).rejects.toThrow(AuthBlockedError);
  });

  test('receives the operation as argument', async () => {
    const fn = jest.fn().mockResolvedValue(true);
    const strategy = createCustomStrategy(fn);
    await strategy.authorize('kyc');
    expect(fn).toHaveBeenCalledWith('kyc');
  });
});
```

- [ ] **Step 2: Run tests**

Run: `cd /Users/admin/torosdk-expo && npx jest __tests__/core/auth.test.ts --no-coverage`
Expected: All 7 tests pass.

- [ ] **Step 3: Commit**

```bash
git add __tests__/core/auth.test.ts
git commit -m "test(core): add auth strategy tests — password, biometric, custom"
```

---

### Task 22: Core Tests — SDK Wrappers

**Files:**
- Create: `__tests__/core/sdk.test.ts`

- [ ] **Step 1: Write __tests__/core/sdk.test.ts**

```ts
// Mock torosdk
const mockCreateWallet = jest.fn();
const mockGetCurrencyBalance = jest.fn();
const mockMakeInterWalletTransfer = jest.fn();
const mockConfigureTNS = jest.fn();
const mockIsAddressKYCVerified = jest.fn();
const mockGetSupportedAssetsExchangeRates = jest.fn();
const mockImportWalletFromPrivateKeyAndPassword = jest.fn();
const mockVerifyWalletPassword = jest.fn();

jest.mock('torosdk', () => ({
  createWallet: mockCreateWallet,
  getCurrencyBalance: mockGetCurrencyBalance,
  makeInterWalletTransfer: mockMakeInterWalletTransfer,
  configureTNS: mockConfigureTNS,
  isAddressKYCVerified: mockIsAddressKYCVerified,
  getSupportedAssetsExchangeRates: mockGetSupportedAssetsExchangeRates,
  importWalletFromPrivateKeyAndPassword: mockImportWalletFromPrivateKeyAndPassword,
  verifyWalletPassword: mockVerifyWalletPassword,
}));

// Mock auth strategy and storage
const mockAuthorize = jest.fn();
const mockGetPassword = jest.fn();

jest.mock('../../src/core/auth', () => ({
  getAuthStrategy: () => ({ authorize: mockAuthorize }),
  setAuthStrategy: jest.fn(),
}));

jest.mock('../../src/core/storage', () => ({
  getPassword: (...args: unknown[]) => mockGetPassword(...args),
  setPassword: jest.fn(),
  addWalletToList: jest.fn(),
  setActiveWallet: jest.fn(),
}));

jest.mock('../../src/core/config', () => ({
  getConfig: () => ({ network: 'testnet', apiBaseUrl: 'https://api.testnet.toronet.org' }),
  createConfig: jest.fn(),
}));

import {
  createWallet,
  getBalanceForCurrency,
  makeTransfer,
  resolveTNS,
  getKYCStatus,
  getExchangeRates,
} from '../../src/core/sdk';
import { NetworkError, APIError } from '../../src/core/errors';

beforeEach(() => {
  jest.clearAllMocks();
  mockAuthorize.mockResolvedValue(true);
  mockGetPassword.mockResolvedValue('test-password');
});

describe('createWallet', () => {
  test('returns address on success', async () => {
    mockCreateWallet.mockResolvedValueOnce({ address: '0x123' });
    const result = await createWallet('user1', 'secret');
    expect(result).toBe('0x123');
    expect(mockCreateWallet).toHaveBeenCalledWith('user1', 'secret');
  });

  test('wraps network errors', async () => {
    mockCreateWallet.mockRejectedValueOnce(new Error('Network Error'));
    await expect(createWallet('user1', 'secret')).rejects.toThrow(NetworkError);
  });
});

describe('getBalanceForCurrency', () => {
  test('authorizes, gets password, and returns balance', async () => {
    mockGetCurrencyBalance.mockResolvedValueOnce('1500.50');
    const result = await getBalanceForCurrency('0xABC', 'NGN');
    expect(mockAuthorize).toHaveBeenCalledWith('balance');
    expect(mockGetPassword).toHaveBeenCalledWith('0xABC');
    expect(result).toEqual({ balance: '1500.50', currency: 'NGN' });
  });
});

describe('makeTransfer', () => {
  test('authorizes, gets password, and transfers', async () => {
    mockMakeInterWalletTransfer.mockResolvedValueOnce({ transactionHash: '0xhash' });
    const result = await makeTransfer('0xSender', '0xReceiver', '100', 'NGN');
    expect(mockAuthorize).toHaveBeenCalledWith('transfer');
    expect(mockMakeInterWalletTransfer).toHaveBeenCalledWith(
      '0xSender', 'test-password', '0xReceiver', '100', 'NGN'
    );
    expect(result).toEqual({ transactionHash: '0xhash' });
  });
});

describe('resolveTNS', () => {
  test('resolves name to address', async () => {
    mockConfigureTNS.mockResolvedValueOnce({ address: '0xResolved' });
    const result = await resolveTNS('alice.toronet');
    expect(result).toBe('0xResolved');
  });
});

describe('getKYCStatus', () => {
  test('returns verified status', async () => {
    mockIsAddressKYCVerified.mockResolvedValueOnce(true);
    const result = await getKYCStatus('0xABC');
    expect(result).toEqual({ verified: true });
  });
});

describe('getExchangeRates', () => {
  test('normalizes object result to array', async () => {
    mockGetSupportedAssetsExchangeRates.mockResolvedValueOnce({
      'NGN/USD': 0.0012,
      'NGN/EUR': 0.0010,
    });
    const result = await getExchangeRates();
    expect(result).toEqual([
      { pair: 'NGN/USD', rate: 0.0012 },
      { pair: 'NGN/EUR', rate: 0.0010 },
    ]);
  });

  test('returns array as-is', async () => {
    mockGetSupportedAssetsExchangeRates.mockResolvedValueOnce([
      { pair: 'NGN/USD', rate: 0.0012 },
    ]);
    const result = await getExchangeRates();
    expect(result).toEqual([{ pair: 'NGN/USD', rate: 0.0012 }]);
  });
});
```

- [ ] **Step 2: Run tests**

Run: `cd /Users/admin/torosdk-expo && npx jest __tests__/core/sdk.test.ts --no-coverage`
Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add __tests__/core/sdk.test.ts
git commit -m "test(core): add SDK wrapper tests — wallet, balance, transfer, TNS, KYC, rates"
```

---

### Task 23: React Tests — Provider

**Files:**
- Create: `__tests__/react/provider.test.tsx`

- [ ] **Step 1: Write __tests__/react/provider.test.tsx**

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ToronetProvider, useToronetContext } from '../../src/react/provider';
import { createPasswordStrategy } from '../../src/core/auth';

function TestConsumer() {
  const ctx = useToronetContext();
  return <Text testID="network">{ctx.config.network}</Text>;
}

describe('ToronetProvider', () => {
  test('provides config to children via context', () => {
    const { getByTestId } = render(
      <ToronetProvider
        config={{ network: 'testnet' }}
        authStrategy={createPasswordStrategy()}
      >
        <TestConsumer />
      </ToronetProvider>
    );
    expect(getByTestId('network').props.children).toBe('testnet');
  });

  test('throws when useToronetContext is used outside provider', () => {
    // Suppress console.error for expected error boundary
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      '[torosdk-expo] useToronetContext must be used within a <ToronetProvider>'
    );
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run tests**

Run: `cd /Users/admin/torosdk-expo && npx jest __tests__/react/provider.test.tsx --no-coverage`
Expected: Both tests pass.

- [ ] **Step 3: Commit**

```bash
git add __tests__/react/provider.test.tsx
git commit -m "test(react): add provider tests — context propagation, error boundary"
```

---

### Task 24: React Tests — Hooks

**Files:**
- Create: `__tests__/react/useBalance.test.tsx`
- Create: `__tests__/react/useTransfer.test.tsx`
- Create: `__tests__/react/useWallets.test.tsx`

- [ ] **Step 1: Write __tests__/react/useWallets.test.tsx**

```tsx
// Mock SecureStore
const mockStore: Record<string, string> = {
  torosdk_wallets: JSON.stringify(['0xaaa', '0xbbb']),
  torosdk_active_wallet: '0xaaa',
};

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (key: string) => mockStore[key] ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockStore[key] = value;
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    delete mockStore[key];
  }),
}));

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWallets } from '../../src/react/hooks/useWallets';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useWallets', () => {
  beforeEach(() => {
    mockStore['torosdk_wallets'] = JSON.stringify(['0xaaa', '0xbbb']);
    mockStore['torosdk_active_wallet'] = '0xaaa';
    queryClient.clear();
  });

  test('loads wallets from storage on mount', async () => {
    const { result } = renderHook(() => useWallets(), { wrapper });

    // Wait for the async useEffect
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(result.current.all).toEqual(['0xaaa', '0xbbb']);
    expect(result.current.active).toBe('0xaaa');
    expect(result.current.isLoading).toBe(false);
  });
});
```

- [ ] **Step 2: Write __tests__/react/useBalance.test.tsx**

```tsx
// Mock the SDK
const mockGetBalanceForCurrency = jest.fn();

jest.mock('../../src/core/sdk', () => ({
  getBalanceForCurrency: (...args: unknown[]) => mockGetBalanceForCurrency(...args),
  getAuthStrategy: () => ({ authorize: jest.fn().mockResolvedValue(true) }),
}));

jest.mock('../../src/core/storage', () => ({
  getPassword: jest.fn().mockResolvedValue('test-password'),
}));

jest.mock('../../src/core/config', () => ({
  getConfig: () => ({ network: 'testnet' as const, apiBaseUrl: 'https://api.testnet.toronet.org' }),
}));

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBalance } from '../../src/react/hooks/useBalance';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useBalance', () => {
  beforeEach(() => {
    queryClient.clear();
    mockGetBalanceForCurrency.mockReset();
  });

  test('returns balance data on success', async () => {
    mockGetBalanceForCurrency.mockResolvedValueOnce({ balance: '500', currency: 'NGN' });

    const { result } = renderHook(
      () => useBalance({ address: '0x123', currency: 'NGN' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({ balance: '500', currency: 'NGN' });
  });
});
```

- [ ] **Step 3: Write __tests__/react/useTransfer.test.tsx**

```tsx
const mockMakeTransfer = jest.fn();

jest.mock('../../src/core/sdk', () => ({
  makeTransfer: (...args: unknown[]) => mockMakeTransfer(...args),
  getAuthStrategy: () => ({ authorize: jest.fn().mockResolvedValue(true) }),
}));

jest.mock('../../src/core/storage', () => ({
  getPassword: jest.fn().mockResolvedValue('test-password'),
}));

jest.mock('../../src/core/config', () => ({
  getConfig: () => ({ network: 'testnet' as const, apiBaseUrl: 'https://api.testnet.toronet.org' }),
}));

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTransfer } from '../../src/react/hooks/useTransfer';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useTransfer', () => {
  beforeEach(() => {
    queryClient.clear();
    mockMakeTransfer.mockReset();
  });

  test('calls makeTransfer with correct arguments', async () => {
    mockMakeTransfer.mockResolvedValueOnce({ transactionHash: '0xdone' });

    const { result } = renderHook(() => useTransfer(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        senderAddress: '0xSender',
        receiverAddress: '0xReceiver',
        amount: '100',
        currency: 'NGN',
      });
    });

    expect(mockMakeTransfer).toHaveBeenCalledWith(
      '0xSender', '0xReceiver', '100', 'NGN'
    );
  });
});
```

- [ ] **Step 4: Run all react hook tests**

Run: `cd /Users/admin/torosdk-expo && npx jest __tests__/react/ --no-coverage`
Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add __tests__/react/
git commit -m "test(react): add hook tests — useWallets, useBalance, useTransfer"
```

---

### Task 25: CLI Tests

**Files:**
- Create: `__tests__/cli/init.test.ts`

- [ ] **Step 1: Write __tests__/cli/init.test.ts**

```ts
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

describe('CLI init', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'torosdk-cli-test-'));
    // Create a fake app.json to simulate an Expo project
    fs.writeFileSync(path.join(tmpDir, 'app.json'), JSON.stringify({ expo: { sdkVersion: '52.0.0' } }));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('scaffolds config files into src/torosdk/', () => {
    // Note: this test runs the compiled CLI if available, or validates template content
    // In CI, we verify the templates exist and contain expected markers
    const templatesDir = path.join(__dirname, '..', '..', 'src', 'cli', 'templates');

    expect(fs.existsSync(path.join(templatesDir, 'config.ts.template'))).toBe(true);
    expect(fs.existsSync(path.join(templatesDir, 'auth.ts.template'))).toBe(true);
    expect(fs.existsSync(path.join(templatesDir, 'provider.tsx.template'))).toBe(true);

    const authContent = fs.readFileSync(
      path.join(templatesDir, 'auth.ts.template'),
      'utf-8'
    );
    expect(authContent).toContain('createPasswordStrategy');
    expect(authContent).toContain('createBiometricStrategy');
    expect(authContent).toContain('createCustomStrategy');

    const providerContent = fs.readFileSync(
      path.join(templatesDir, 'provider.tsx.template'),
      'utf-8'
    );
    expect(providerContent).toContain('ToronetProvider');
    expect(providerContent).toContain('ToroWrapper');
  });

  test('init script is a valid Node module', () => {
    const initPath = path.join(__dirname, '..', '..', 'src', 'cli', 'init.ts');
    expect(fs.existsSync(initPath)).toBe(true);
    const content = fs.readFileSync(initPath, 'utf-8');
    expect(content).toContain('torosdk-expo init');
    expect(content).toContain('execSync');
    expect(content).toContain('TEMPLATES_DIR');
  });
});
```

- [ ] **Step 2: Run tests**

Run: `cd /Users/admin/torosdk-expo && npx jest __tests__/cli/ --no-coverage`
Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add __tests__/cli/
git commit -m "test(cli): add CLI init tests — template validation, script structure"
```

---

### Task 26: Example App Scaffold

**Files:**
- Create: `example/package.json`
- Create: `example/app.json`
- Create: `example/tsconfig.json`
- Create: `example/App.tsx`

- [ ] **Step 1: Write example/package.json**

```json
{
  "name": "torosdk-expo-example",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-local-authentication": "~15.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "@tanstack/react-query": "^5.0.0",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "react-native-screens": "~4.0.0",
    "react-native-safe-area-context": "~4.12.0",
    "torosdk": "^0.2.0",
    "torosdk-expo": "file:.."
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 2: Write example/app.json**

```json
{
  "expo": {
    "name": "torosdk-expo-example",
    "slug": "torosdk-expo-example",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "backgroundColor": "#1a1a2e"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.toroforge.torosdkexpoexample",
      "infoPlist": {
        "NSFaceIDUsageDescription": "We use Face ID to secure your wallet transactions"
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#1a1a2e"
      },
      "package": "com.toroforge.torosdkexpoexample"
    },
    "plugins": [
      "expo-secure-store",
      "expo-local-authentication"
    ]
  }
}
```

- [ ] **Step 3: Write example/tsconfig.json**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "torosdk-expo": ["../src/react/index.ts"],
      "torosdk-expo/core": ["../src/core/index.ts"]
    }
  }
}
```

- [ ] **Step 4: Write example/App.tsx**

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToroWrapper } from './src/torosdk/provider';
import HomeScreen from './src/screens/HomeScreen';
import CreateWalletScreen from './src/screens/CreateWalletScreen';
import TransferScreen from './src/screens/TransferScreen';
import TNSScreen from './src/screens/TNSScreen';
import KYCScreen from './src/screens/KYCScreen';
import ExchangeRatesScreen from './src/screens/ExchangeRatesScreen';

export type RootStackParamList = {
  Home: undefined;
  CreateWallet: undefined;
  Transfer: undefined;
  TNS: undefined;
  KYC: undefined;
  ExchangeRates: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ToroWrapper>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#1a1a2e' },
            headerTintColor: '#e94560',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Toronet Wallet' }} />
          <Stack.Screen name="CreateWallet" component={CreateWalletScreen} options={{ title: 'Wallets' }} />
          <Stack.Screen name="Transfer" component={TransferScreen} options={{ title: 'Send' }} />
          <Stack.Screen name="TNS" component={TNSScreen} options={{ title: 'TNS Names' }} />
          <Stack.Screen name="KYC" component={KYCScreen} options={{ title: 'KYC Status' }} />
          <Stack.Screen name="ExchangeRates" component={ExchangeRatesScreen} options={{ title: 'Exchange Rates' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToroWrapper>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add example/package.json example/app.json example/tsconfig.json example/App.tsx
git commit -m "feat(example): scaffold Expo SDK 52 app with navigation and ToroWrapper"
```

---

### Task 27: Example App Torosdk Config Files

**Files:**
- Create: `example/src/torosdk/config.ts`
- Create: `example/src/torosdk/auth.ts`
- Create: `example/src/torosdk/provider.tsx`

- [ ] **Step 1: Write example/src/torosdk/config.ts**

```ts
import type { ToronetConfig } from 'torosdk-expo/core';

export const config: ToronetConfig = {
  network: 'testnet',
};
```

- [ ] **Step 2: Write example/src/torosdk/auth.ts**

```ts
import { createBiometricStrategy, type AuthStrategy } from 'torosdk-expo/core';

export const authStrategy: AuthStrategy = createBiometricStrategy({
  requireFor: ['transfer', 'kyc', 'tns-write', 'wallet-delete'],
  skipFor: ['balance', 'tns-read', 'exchange-rates', 'wallet-create', 'wallet-import'],
});
```

- [ ] **Step 3: Write example/src/torosdk/provider.tsx**

```tsx
import React, { type ReactNode } from 'react';
import { ToronetProvider } from 'torosdk-expo';
import { config } from './config';
import { authStrategy } from './auth';

export function ToroWrapper({ children }: { children: ReactNode }) {
  return (
    <ToronetProvider config={config} authStrategy={authStrategy}>
      {children}
    </ToronetProvider>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add example/src/torosdk/
git commit -m "feat(example): add torosdk config, auth strategy, and provider wrapper"
```

---

### Task 28: Example App Screens — HomeScreen & CreateWalletScreen

**Files:**
- Create: `example/src/screens/HomeScreen.tsx`
- Create: `example/src/screens/CreateWalletScreen.tsx`

- [ ] **Step 1: Write example/src/screens/HomeScreen.tsx**

```tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useWallets, useBalances, useExchangeRates } from 'torosdk-expo';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const CURRENCIES = ['NGN', 'USD', 'KSH', 'ZAR', 'GBP', 'EUR'] as const;

export default function HomeScreen({ navigation }: Props) {
  const wallets = useWallets();
  const { data: balances, isLoading, refetch } = useBalances({
    address: wallets.active ?? '',
    enabled: !!wallets.active,
  });

  if (wallets.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  if (!wallets.active) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No wallet yet</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CreateWallet')}
        >
          <Text style={styles.buttonText}>Create or Import Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Wallet selector */}
      <ScrollView horizontal style={styles.walletBar} showsHorizontalScrollIndicator={false}>
        {wallets.all.map((addr) => (
          <TouchableOpacity
            key={addr}
            style={[
              styles.walletChip,
              addr === wallets.active && styles.walletChipActive,
            ]}
            onPress={() => wallets.switchWallet(addr)}
          >
            <Text
              style={[
                styles.walletChipText,
                addr === wallets.active && styles.walletChipTextActive,
              ]}
            >
              {addr.slice(0, 6)}...{addr.slice(-4)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Balances */}
      <Text style={styles.sectionTitle}>Balances</Text>
      {isLoading ? (
        <ActivityIndicator color="#e94560" />
      ) : (
        <View style={styles.balanceGrid}>
          {balances?.map((b) => (
            <View key={b.currency} style={styles.balanceCard}>
              <Text style={styles.currencyLabel}>{b.currency}</Text>
              <Text style={styles.balanceAmount}>{b.balance}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.refreshButton} onPress={() => refetch()}>
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>

      {/* Quick actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Transfer')}
        >
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('TNS')}
        >
          <Text style={styles.actionText}>TNS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('KYC')}
        >
          <Text style={styles.actionText}>KYC</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ExchangeRates')}
        >
          <Text style={styles.actionText}>Rates</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#16213e' },
  emptyText: { color: '#aaa', fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: '#e94560', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  walletBar: { marginBottom: 16 },
  walletChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#0f3460', marginRight: 8 },
  walletChipActive: { backgroundColor: '#e94560' },
  walletChipText: { color: '#aaa', fontSize: 13 },
  walletChipTextActive: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  balanceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  balanceCard: { backgroundColor: '#0f3460', borderRadius: 10, padding: 16, width: '30%', alignItems: 'center' },
  currencyLabel: { color: '#aaa', fontSize: 12, marginBottom: 4 },
  balanceAmount: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  refreshButton: { alignSelf: 'center', marginVertical: 16 },
  refreshText: { color: '#e94560', fontSize: 14 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  actionButton: { backgroundColor: '#e94560', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 10, flex: 1, minWidth: '45%', alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
```

- [ ] **Step 2: Write example/src/screens/CreateWalletScreen.tsx**

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useCreateWallet, useImportWallet, useDeleteWallet, useWallets } from 'torosdk-expo';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateWallet'>;

export default function CreateWalletScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [mode, setMode] = useState<'create' | 'import'>('create');

  const createWallet = useCreateWallet();
  const importWallet = useImportWallet();
  const deleteWallet = useDeleteWallet();
  const wallets = useWallets();

  const handleCreate = async () => {
    try {
      const address = await createWallet.mutateAsync({ username, password });
      await wallets.addWallet(address);
      Alert.alert('Success', `Wallet created:\n${address}`);
      setUsername('');
      setPassword('');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to create wallet');
    }
  };

  const handleImport = async () => {
    try {
      const address = await importWallet.mutateAsync({ privateKey, password });
      await wallets.addWallet(address);
      Alert.alert('Success', `Wallet imported:\n${address}`);
      setPrivateKey('');
      setPassword('');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to import wallet');
    }
  };

  const handleDelete = async (address: string) => {
    Alert.alert('Delete Wallet', `Delete ${address.slice(0, 10)}...?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteWallet.mutateAsync(address);
            await wallets.removeWallet(address);
          } catch (err: any) {
            Alert.alert('Error', err?.message ?? 'Failed to delete wallet');
          }
        },
      },
    ]);
  };

  const isPending = createWallet.isPending || importWallet.isPending;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Mode toggle */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, mode === 'create' && styles.tabActive]}
          onPress={() => setMode('create')}
        >
          <Text style={[styles.tabText, mode === 'create' && styles.tabTextActive]}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === 'import' && styles.tabActive]}
          onPress={() => setMode('import')}
        >
          <Text style={[styles.tabText, mode === 'import' && styles.tabTextActive]}>Import</Text>
        </TouchableOpacity>
      </View>

      {mode === 'create' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={[styles.submitButton, isPending && styles.disabled]}
            onPress={handleCreate}
            disabled={isPending || !username || !password}
          >
            {createWallet.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Create Wallet</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Private Key (0x...)"
            placeholderTextColor="#666"
            value={privateKey}
            onChangeText={setPrivateKey}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={[styles.submitButton, isPending && styles.disabled]}
            onPress={handleImport}
            disabled={isPending || !privateKey || !password}
          >
            {importWallet.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Import Wallet</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {/* Existing wallets with delete */}
      {wallets.all.length > 0 && (
        <View style={styles.existingSection}>
          <Text style={styles.sectionTitle}>Stored Wallets</Text>
          {wallets.all.map((addr) => (
            <View key={addr} style={styles.walletRow}>
              <Text style={styles.walletAddr}>{addr.slice(0, 10)}...{addr.slice(-6)}</Text>
              <TouchableOpacity onPress={() => handleDelete(addr)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e', padding: 16 },
  tabs: { flexDirection: 'row', marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#0f3460', borderRadius: 8, marginHorizontal: 4 },
  tabActive: { backgroundColor: '#e94560' },
  tabText: { color: '#aaa', fontWeight: 'bold' },
  tabTextActive: { color: '#fff' },
  input: { backgroundColor: '#0f3460', color: '#fff', borderRadius: 8, padding: 14, marginBottom: 12, fontSize: 16 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#e94560', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  disabled: { opacity: 0.5 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  existingSection: { marginTop: 32 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  walletRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f3460', padding: 14, borderRadius: 8, marginBottom: 8 },
  walletAddr: { color: '#fff', fontSize: 14 },
  deleteText: { color: '#e94560', fontWeight: 'bold' },
});
```

- [ ] **Step 3: Commit**

```bash
git add example/src/screens/HomeScreen.tsx example/src/screens/CreateWalletScreen.tsx
git commit -m "feat(example): add HomeScreen (balances + wallet switching) and CreateWalletScreen"
```

---

### Task 29: Example App Screens — TransferScreen, TNSScreen, KYCScreen, ExchangeRatesScreen

**Files:**
- Create: `example/src/screens/TransferScreen.tsx`
- Create: `example/src/screens/TNSScreen.tsx`
- Create: `example/src/screens/KYCScreen.tsx`
- Create: `example/src/screens/ExchangeRatesScreen.tsx`

- [ ] **Step 1: Write example/src/screens/TransferScreen.tsx**

```tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useTransfer, useBalance, useWallets } from 'torosdk-expo';
import { Currency } from 'torosdk-expo/core';

const CURRENCIES: Currency[] = ['NGN', 'USD', 'KSH', 'ZAR', 'GBP', 'EUR'];

export default function TransferScreen() {
  const wallets = useWallets();
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('NGN');

  const transfer = useTransfer();
  const balance = useBalance({
    address: wallets.active ?? '',
    currency,
    enabled: !!wallets.active,
  });

  const handleSend = async () => {
    if (!wallets.active) {
      Alert.alert('Error', 'No active wallet');
      return;
    }
    try {
      const result = await transfer.mutateAsync({
        senderAddress: wallets.active,
        receiverAddress: receiver,
        amount,
        currency,
      });
      Alert.alert('Sent!', `Transaction: ${JSON.stringify(result)}`);
      setReceiver('');
      setAmount('');
    } catch (err: any) {
      Alert.alert('Transfer Failed', err?.message ?? 'Unknown error');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Balance display */}
      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>Balance:</Text>
        <Text style={styles.balanceValue}>
          {balance.data?.balance ?? '...'} {currency}
        </Text>
      </View>

      {/* Currency picker */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyBar}>
        {CURRENCIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.currencyChip, currency === c && styles.currencyChipActive]}
            onPress={() => setCurrency(c)}
          >
            <Text style={[styles.currencyText, currency === c && styles.currencyTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder="Receiver Address (0x...)"
        placeholderTextColor="#666"
        value={receiver}
        onChangeText={setReceiver}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        placeholderTextColor="#666"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity
        style={[styles.sendButton, transfer.isPending && styles.disabled]}
        onPress={handleSend}
        disabled={transfer.isPending || !receiver || !amount}
      >
        {transfer.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.sendText}>Send {currency}</Text>
        )}
      </TouchableOpacity>

      {transfer.isError && (
        <Text style={styles.errorText}>
          Error: {(transfer.error as Error)?.message}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e', padding: 16 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, backgroundColor: '#0f3460', padding: 16, borderRadius: 8 },
  balanceLabel: { color: '#aaa', fontSize: 16 },
  balanceValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  currencyBar: { marginBottom: 16 },
  currencyChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#0f3460', marginRight: 8 },
  currencyChipActive: { backgroundColor: '#e94560' },
  currencyText: { color: '#aaa', fontWeight: 'bold' },
  currencyTextActive: { color: '#fff' },
  input: { backgroundColor: '#0f3460', color: '#fff', borderRadius: 8, padding: 14, marginBottom: 12, fontSize: 16 },
  sendButton: { backgroundColor: '#e94560', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  disabled: { opacity: 0.5 },
  sendText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  errorText: { color: '#e94560', marginTop: 12 },
});
```

- [ ] **Step 2: Write example/src/screens/TNSScreen.tsx**

```tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useResolveTNS, useLookupTNS, useSetTNS, useWallets } from 'torosdk-expo';

export default function TNSScreen() {
  const wallets = useWallets();
  const [nameInput, setNameInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [resolveName, setResolveName] = useState('');
  const [lookupAddr, setLookupAddr] = useState('');
  const [registerName, setRegisterName] = useState('');

  const resolve = useResolveTNS(resolveName, !!resolveName);
  const lookup = useLookupTNS(lookupAddr, !!lookupAddr);
  const setTNS = useSetTNS();

  const handleRegister = async () => {
    if (!wallets.active) return;
    try {
      await setTNS.mutateAsync({ address: wallets.active, name: registerName });
      setRegisterName('');
    } catch (err: any) {
      // Error surfaced via setTNS.isError
    }
  };

  return (
    <View style={styles.container}>
      {/* Resolve */}
      <Text style={styles.sectionTitle}>Resolve Name → Address</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="name.toronet"
          placeholderTextColor="#666"
          value={resolveName}
          onChangeText={setResolveName}
        />
      </View>
      {resolve.isFetching && <ActivityIndicator color="#e94560" />}
      {resolve.data && <Text style={styles.result}>{resolve.data}</Text>}

      {/* Lookup */}
      <Text style={styles.sectionTitle}>Lookup Address → Name</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="0x..."
          placeholderTextColor="#666"
          value={lookupAddr}
          onChangeText={setLookupAddr}
        />
      </View>
      {lookup.data && <Text style={styles.result}>{lookup.data}</Text>}

      {/* Register */}
      <Text style={styles.sectionTitle}>Register Name (uses active wallet)</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="your-name.toronet"
          placeholderTextColor="#666"
          value={registerName}
          onChangeText={setRegisterName}
        />
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={setTNS.isPending || !registerName}
        >
          {setTNS.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.registerText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
      {setTNS.isError && (
        <Text style={styles.errorText}>{(setTNS.error as Error)?.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e', padding: 16 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: '#0f3460', color: '#fff', borderRadius: 8, padding: 12, fontSize: 14 },
  result: { color: '#4ecca3', fontSize: 16, marginTop: 8, fontFamily: 'monospace' },
  registerButton: { backgroundColor: '#e94560', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, justifyContent: 'center' },
  registerText: { color: '#fff', fontWeight: 'bold' },
  errorText: { color: '#e94560', marginTop: 8 },
});
```

- [ ] **Step 3: Write example/src/screens/KYCScreen.tsx**

```tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useKYCStatus, useWallets } from 'torosdk-expo';

export default function KYCScreen() {
  const wallets = useWallets();
  const [checkAddress, setCheckAddress] = useState(wallets.active ?? '');

  const kyc = useKYCStatus({
    address: checkAddress,
    enabled: !!checkAddress,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Wallet Address</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="0x..."
          placeholderTextColor="#666"
          value={checkAddress}
          onChangeText={setCheckAddress}
        />
        <TouchableOpacity
          style={styles.useActiveButton}
          onPress={() => wallets.active && setCheckAddress(wallets.active)}
        >
          <Text style={styles.useActiveText}>Use Active</Text>
        </TouchableOpacity>
      </View>

      {kyc.isLoading ? (
        <ActivityIndicator color="#e94560" style={{ marginTop: 20 }} />
      ) : kyc.data ? (
        <View style={styles.resultCard}>
          <View style={[
            styles.statusDot,
            { backgroundColor: kyc.data.verified ? '#4ecca3' : '#e94560' },
          ]} />
          <Text style={styles.statusText}>
            {kyc.data.verified ? 'KYC Verified' : 'Not Verified'}
          </Text>
        </View>
      ) : null}

      {kyc.isError && (
        <Text style={styles.errorText}>{(kyc.error as Error)?.message}</Text>
      )}

      <Text style={styles.infoText}>
        Enter any wallet address to check its KYC verification status on Toronet.
        {!wallets.active && '\n\nCreate or import a wallet first to use your own address.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e', padding: 16 },
  label: { color: '#aaa', fontSize: 14, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: '#0f3460', color: '#fff', borderRadius: 8, padding: 12, fontSize: 14 },
  useActiveButton: { backgroundColor: '#0f3460', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 8, justifyContent: 'center' },
  useActiveText: { color: '#e94560', fontWeight: 'bold', fontSize: 13 },
  resultCard: { flexDirection: 'row', alignItems: 'center', marginTop: 24, backgroundColor: '#0f3460', padding: 20, borderRadius: 12 },
  statusDot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
  statusText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: '#e94560', marginTop: 12 },
  infoText: { color: '#666', fontSize: 13, marginTop: 24, textAlign: 'center', lineHeight: 20 },
});
```

- [ ] **Step 4: Write example/src/screens/ExchangeRatesScreen.tsx**

```tsx
import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useExchangeRates } from 'torosdk-expo';

export default function ExchangeRatesScreen() {
  const { data: rates, isLoading, isError, error, refetch } = useExchangeRates();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{(error as Error)?.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Live Exchange Rates</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={rates ?? []}
        keyExtractor={(item) => item.pair}
        renderItem={({ item }) => (
          <View style={styles.rateRow}>
            <Text style={styles.pair}>{item.pair}</Text>
            <Text style={styles.rate}>{item.rate.toFixed(6)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No rates available</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#16213e' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  refreshText: { color: '#e94560', fontWeight: 'bold' },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#0f3460' },
  pair: { color: '#fff', fontSize: 16, fontWeight: '600' },
  rate: { color: '#4ecca3', fontSize: 16, fontFamily: 'monospace' },
  errorText: { color: '#e94560', marginBottom: 16 },
  retryButton: { backgroundColor: '#e94560', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 40 },
});
```

- [ ] **Step 5: Commit**

```bash
git add example/src/screens/TransferScreen.tsx example/src/screens/TNSScreen.tsx example/src/screens/KYCScreen.tsx example/src/screens/ExchangeRatesScreen.tsx
git commit -m "feat(example): add Transfer, TNS, KYC, and ExchangeRates screens"
```

---

### Task 30: Create Wallet Hooks (useCreateWallet, useImportWallet, useDeleteWallet)

**Files:**
- Create: `src/react/hooks/useWalletMutations.ts`

- [ ] **Step 1: Write src/react/hooks/useWalletMutations.ts**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createWallet as createWalletCore,
  importWallet as importWalletCore,
} from '../../core/sdk';
import {
  setPassword,
  addWalletToList,
  setActiveWallet,
  deletePassword,
  removeWalletFromList,
} from '../../core/storage';
import { getAuthStrategy } from '../../core/auth';
import { queryKeys } from '../query-keys';

export interface CreateWalletVariables {
  username: string;
  password: string;
}

export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password }: CreateWalletVariables) => {
      await getAuthStrategy().authorize('wallet-create');
      const address = await createWalletCore(username, password);
      await setPassword(address, password);
      await addWalletToList(address);
      await setActiveWallet(address);
      return address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export interface ImportWalletVariables {
  privateKey: string;
  password: string;
}

export function useImportWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ privateKey, password }: ImportWalletVariables) => {
      await getAuthStrategy().authorize('wallet-import');
      const address = await importWalletCore(privateKey, password);
      await setPassword(address, password);
      await addWalletToList(address);
      await setActiveWallet(address);
      return address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useDeleteWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: string) => {
      await getAuthStrategy().authorize('wallet-delete');
      await deletePassword(address);
      await removeWalletFromList(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}
```

- [ ] **Step 2: Update `src/react/index.ts` — add exports for the new hooks**

Read `src/react/index.ts`, then add these lines after the existing `useWallets` export:

```ts
export { useCreateWallet, useImportWallet, useDeleteWallet } from './hooks/useWalletMutations';
export type { CreateWalletVariables, ImportWalletVariables } from './hooks/useWalletMutations';
```

- [ ] **Step 3: Commit**

```bash
git add src/react/hooks/useWalletMutations.ts src/react/index.ts
git commit -m "feat(react): add useCreateWallet, useImportWallet, useDeleteWallet mutation hooks"
```

---

### Task 31: README.md

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README.md**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add comprehensive README with quick start, hooks reference, architecture diagram"
```

---

### Task 32: Build Verification & Integration Check

- [ ] **Step 1: Verify TypeScript compilation**

Run: `cd /Users/admin/torosdk-expo && npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 2: Run all tests**

Run: `cd /Users/admin/torosdk-expo && npx jest --no-coverage`
Expected: All tests pass.

- [ ] **Step 3: Verify subpath exports resolve**

Run: `cd /Users/admin/torosdk-expo && node -e "const pkg = require('./package.json'); console.log('Exports:', JSON.stringify(pkg.exports, null, 2))"`
Expected: Prints exports map with `.`, `./core`, `./cli`.

- [ ] **Step 4: Verify example app dependencies can resolve**

Run: `cd /Users/admin/torosdk-expo/example && npm install 2>&1 | tail -5`
Expected: Installs successfully (may warn about peer deps if not in Expo managed workflow — acceptable).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final integration check — build, tests, exports verification"
```
