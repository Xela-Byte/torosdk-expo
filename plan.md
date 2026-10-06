# ToroForge React Toolkit - Implementation Plan

## Goal Description
Build a web-first developer toolkit for the Toronet ecosystem, consisting of React hooks, utilities, and a **Unified Developer Dashboard** that seamlessly blends interactive documentation with a testnet lab. This project will wrap the existing `torosdk` to provide a seamless, type-safe, and state-managed developer experience for React applications.

## User Review Required
> [!IMPORTANT]
> **Authentication Architecture**: Since the `torosdk` requires a password for every write operation (no local private key signing), the React hooks will need a mechanism to securely prompt users for passwords when transactions occur. We will implement this via a `ToroProvider` context that can securely handle these prompts without exposing passwords to generic component state.
> 
> **Admin Credentials**: Features like fiat deposits and virtual wallets require server-side `admin` credentials. These **cannot** be exposed in the frontend toolkit. We will design the hooks for these features to accept a proxy URL so developers can route these requests securely through their own backend.
>
> **Missing Smart Contract APIs**: The official `torosdk` does not currently expose arbitrary smart contract read/write functions. We will omit the smart contract hooks and contract tools from Phase 1, pending updates to the upstream SDK.

## Phase 1: Foundation & Monorepo Setup
**Goal**: Establish the repository structure, tooling, and workspaces.
- Initialize a `pnpm` workspace (or Turborepo) in the `toroforge-react-toolkit` directory.
- Scaffold the `packages/`:
  - `packages/sdk-adapter`: The low-level wrapper around `torosdk`.
  - `packages/react`: The React hooks and context providers.
  - `packages/ui`: Optional UI components.
- Scaffold the `apps/`:
  - `apps/dashboard`: A unified Next.js application that serves as both the Interactive Documentation and the Testnet Lab.
- Set up shared ESLint, Prettier, and TypeScript configurations.

## Phase 2: SDK Adapter Layer (`@toroforge/sdk-adapter`)
**Goal**: Abstract `torosdk` into a clean, predictable, and normalized interface.
- Implement the singleton configuration wrapper (mapping `initializeSDK`).
- Build a generic Error Normalizer to convert raw `axios` string errors into a standard `ToroError` class with `{ code, message, operation, details }`.
- Implement adapter modules for:
  - Wallet & TNS operations
  - Balance operations (normalizing NGN/USD/ToroG responses)
  - Token operations
  - Payment/Bridge proxy endpoints
- Write robust unit tests with mocked `axios` responses.

## Phase 3: Core React Hooks (`@toroforge/react`)
**Goal**: Provide the primary developer interface for React applications.
- Implement `<ToroProvider>` to handle global configuration (mainnet/testnet) and credential management.
- Build data fetching hooks (using a pattern similar to SWR/React Query for `loading`, `error`, `data`, `refetch`):
  - `useToroWallet()`, `useToroCreateWallet()`
  - `useToroBalance()`, `useToroCurrencyBalance()`
  - `useToroTNSResolve()`, `useToroTNSLookup()`
  - `useToroTokenBalance()`, `useToroTokenMetadata()`
  - `useToroTransactions()`, `useToroTransactionStatus()`
- Build mutation hooks:
  - `useToroSend()` (for transfers)
  - `useToroUpdateTNS()`

## Phase 4: Unified Developer Dashboard (Docs + Lab)
**Goal**: Build the canonical learning resource with live, executable examples in a single, cohesive dashboard interface.
- Set up a Next.js application with a standard dashboard layout (sidebar navigation, main content area).
- **Sidebar Structure**:
  - Parent Headers (Getting Started, Wallet, Balances, Transactions, TNS, Tokens, Payments, Bridges, Utilities).
  - Children nested under parents (e.g., under Wallet: Create wallet, Access wallet, Retrieve address).
- **Page Format**: Every API page will follow the strict structure: Title → What it does → When to use it → Installation → Basic Example → Parameters → Return value → Response → Errors.
- **The "Try It" Lab Integration**: At the bottom of each documentation page, embed the interactive Testnet Lab component. Instead of going to a separate app, developers can click "Run Example" directly within the docs to execute the React Hook against the Toronet testnet and see the real JSON response.
- **Developer Tools**: Add dedicated sidebar items for the following tools (as outlined in the spec):
  - **Transaction Debugger**
  - **Address Inspector**
  - **Bridge Monitor**
  - *(Contract Inspector omitted pending SDK support)*

## Phase 5: Example Applications (`examples/*`)
**Goal**: Provide 8 real-world reference implementations exactly as specified.
- `examples/wallet-example`: Full wallet dashboard (creation, balances, tx history).
- `examples/balance-dashboard`: Simple dashboard for token/currency info and activity.
- `examples/transaction-app`: Focused on sending, confirming, and viewing tx history.
- `examples/tns-application`: TNS registration and lookup app.
- `examples/token-dashboard`: ToroG token information, operations, and balances.
- `examples/payment-application`: Complete payment flow (fiat deposit and virtual wallet flow with mock backend).
- `examples/bridge-application`: Source → Bridge → Destination interface.
- *(Contract Interface omitted pending SDK support)*

## Phase 6: Verification & QA
**Goal**: Ensure production readiness and SDK compatibility.
- Write E2E tests for the Unified Dashboard using Playwright to ensure the "Try It" interactive examples work against the testnet safely.
- Verify `torosdk` compatibility checks.
- Audit for accidental private key or password leakage in UI states.

## Verification Plan
1. **Automated Tests**: Unit tests for the SDK Adapter and React hooks, mocked to avoid live network flakiness in CI.
2. **Manual Verification**: We will manually execute the "Try It" operations in the dashboard against the Toronet testnet to ensure the hooks function properly end-to-end. We will verify the dashboard layout functions intuitively as both a documentation site and an interactive lab.
