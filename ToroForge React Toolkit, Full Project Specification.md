# ToroForge React Toolkit

## Web-First Developer Toolkit for the Toronet Ecosystem

### 1. Project Overview

ToroForge React Toolkit is a web-first developer toolkit designed to make building applications on the Toronet ecosystem easier for React and TypeScript developers.

The project sits on top of the official ToroSDK and provides a simpler, more frontend-friendly development experience through:

- React hooks
- TypeScript utilities
- Optional React components
- Interactive documentation
- Real testnet examples
- Testnet development lab
- Curated example applications
- Build guides
- Developer debugging tools
- Testing and compatibility infrastructure

The goal is not to replace or rewrite the official ToroSDK.

Instead:

```text
React Application
       ↓
ToroForge React Toolkit
       ↓
Official ToroSDK
       ↓
Toronet
```

The official ToroSDK remains the underlying SDK and source of the blockchain/ecosystem functionality.

The ToroForge React Toolkit provides the developer experience layer that makes those capabilities easier to consume from React applications.

---

# 2. Project Goals

The project should solve practical problems a React developer faces when building on Toronet.

### Primary goals

1. Make Toronet development easier for React developers.
2. Provide strong TypeScript support.
3. Reduce repetitive SDK integration code.
4. Provide consistent React APIs for common Toronet operations.
5. Make the SDK easier for beginners to understand.
6. Give developers working examples instead of documentation alone.
7. Allow developers to test functionality against the testnet.
8. Provide reusable frontend primitives for real applications.
9. Provide debugging and inspection tools.
10. Make examples and documentation easy to maintain as the underlying SDK evolves.

---

# 3. What This Project Is Not

The project should deliberately avoid becoming several unrelated products.

### It is not:

- A replacement for ToroSDK.
- A fork and complete rewrite of ToroSDK.
- A generic blockchain explorer.
- An AI development assistant.
- A code generator.
- A separate SDK Explorer that simply redirects developers to documentation.
- A Flutter SDK.
- A collection of unrelated demo projects.
- A marketing website.

The project is primarily a **React + TypeScript developer toolkit and development environment for Toronet**.

---

# 4. Web-First Scope

The first complete implementation focuses on:

- React
- TypeScript
- Web applications
- JavaScript/TypeScript tooling
- Browser-based development
- Toronet testnet
- npm-based distribution

Flutter/Dart is intentionally outside the current scope.

The architecture should remain clean enough that a Flutter toolkit could potentially be introduced later, but Flutter should not influence the first implementation unnecessarily.

---

# 5. Core Architecture

```text
                         Toronet
                            │
                            ▼
                    Official ToroSDK
                            │
                            ▼
                ToroForge React Toolkit
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
          Hooks         Utilities      Components
             │              │              │
             └──────────────┼──────────────┘
                            │
                            ▼
                    React Applications
```

The toolkit becomes the interface most React developers interact with.

For example, instead of requiring developers to understand every low-level SDK operation immediately, they can work with a React API such as:

```tsx
const {
  transactions,
  loading,
  error,
  refetch
} = useToroTransactions({
  address,
  currency: "NGN"
});
```

Internally, the toolkit handles the interaction with the official ToroSDK.

The exact API names and signatures should be finalized after a complete inspection of the current ToroSDK implementation.

---

# 6. Package Structure

The project can be organized as a monorepo.

```text
toroforge-react-toolkit/
│
├── apps/
│   ├── docs/
│   └── lab/
│
├── packages/
│   ├── react/
│   ├── sdk-adapter/
│   ├── ui/
│   └── testing/
│
├── examples/
│   ├── wallet/
│   ├── balance-dashboard/
│   ├── transactions/
│   ├── tns/
│   ├── tokens/
│   ├── payments/
│   ├── contracts/
│   └── bridge/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── LICENSE
```

The exact repository structure can change after implementation begins.

---

# 7. React Toolkit Package

The main package is the heart of the project.

Possible package name:

```text
@toroforge/react
```

The final package name should be confirmed before publication so that the project does not imply official ownership without approval.

The package should expose a clean React API.

---

# 8. React Toolkit API Areas

The toolkit should organize functionality around actual developer tasks.

## Wallet

Potential APIs:

```tsx
useToroWallet()
useToroAddress()
useToroWalletStatus()
useToroCreateWallet()
```

Responsibilities could include:

- Wallet creation
- Wallet state
- Address retrieval
- Wallet connection/state
- Wallet-related operations
- Testnet wallet management

Exact functionality depends on what the underlying SDK supports.

---

# 9. Balances

Potential APIs:

```tsx
useToroBalance()
useToroBalances()
```

Example:

```tsx
const {
  balance,
  loading,
  error,
  refetch
} = useToroBalance({
  address,
  currency: "NGN"
});
```

Possible functionality:

- Token balance
- Currency balance
- Multiple balances
- Loading state
- Error state
- Refetching
- Formatted values

The toolkit should normalize the response where doing so improves frontend development.

---

# 10. Transactions

Potential APIs:

```tsx
useToroTransaction()
useToroTransactions()
useToroSend()
useToroTransactionStatus()
```

Potential capabilities:

- Transaction lookup
- Transaction history
- Transaction status
- Sending transactions
- Transaction response handling
- Error handling
- Refreshing transaction state

Example:

```tsx
const {
  transactions,
  loading,
  error
} = useToroTransactions({
  address
});
```

---

# 11. TNS

TNS functionality should have a dedicated React interface.

Potential APIs:

```tsx
useToroTNS()
useToroTNSResolve()
useToroTNSRecords()
```

Possible functionality:

- Resolve a TNS name
- Resolve an address
- Retrieve relevant TNS information
- Display TNS information in React applications

Example:

```tsx
const {
  address,
  loading,
  error
} = useToroTNSResolve({
  name: "example.toro"
});
```

The exact naming should follow the actual TNS functionality available in ToroSDK.

---

# 12. Tokens

Potential APIs:

```tsx
useToroToken()
useToroTokenBalance()
useToroTokenMetadata()
```

Possible functionality:

- Token information
- Token balances
- Token metadata
- Token operations supported by the official SDK

Example:

```tsx
const {
  token,
  loading,
  error
} = useToroToken({
  address: tokenAddress
});
```

---

# 13. Payments

Payment functionality should be exposed through frontend-friendly primitives.

Potential API:

```tsx
useToroPayment()
```

Possible functionality:

- Payment creation
- Payment status
- Payment information
- Payment confirmation
- Error handling

This section should only expose functionality actually supported by the underlying SDK/API.

---

# 14. Smart Contracts

The toolkit should provide React-friendly contract functionality where supported.

Potential APIs:

```tsx
useToroContract()
useToroReadContract()
useToroWriteContract()
```

Possible functionality:

- Contract information
- Read operations
- Write operations
- Transaction status
- Events
- Contract interaction

Example:

```tsx
const {
  data,
  loading,
  error
} = useToroReadContract({
  address,
  abi,
  functionName: "balanceOf",
  args: [userAddress]
});
```

The actual API should be designed around Toronet's contract capabilities rather than copying APIs from unrelated blockchain libraries.

---

# 15. Bridges

If the official SDK supports the required bridge operations, the toolkit can provide:

```tsx
useToroBridge()
useToroBridgeStatus()
```

Potential functionality:

- Bridge initiation
- Bridge status
- Source transaction
- Destination transaction
- Bridge errors
- Progress/status information

Supported networks must be derived from the current ToroSDK rather than assumed.

---

# 16. Utilities

The toolkit should also provide small utilities that solve common frontend problems.

Potential examples:

```text
formatToroAmount()
validateToroAddress()
formatToroTransaction()
formatToroCurrency()
parseToroError()
```

Utilities should remain focused.

The project should not become a huge collection of unrelated helper functions.

---

# 17. React Components

Hooks and primitives are the core of the toolkit.

However, optional components can be provided for developers who want ready-made functionality.

Potential components:

```tsx
<ToroWallet />
<ToroBalance />
<ToroTransactionList />
<ToroTransactionStatus />
<ToroTNS />
<ToroTokenBalance />
<ToroPayment />
<ToroContract />
```

These components should be optional.

Developers should be able to use the hooks without adopting a specific visual design system.

For example:

```tsx
const { balance } = useToroBalance({
  address
});

return <MyCustomBalance balance={balance} />;
```

This keeps the toolkit flexible.

---

# 18. SDK Adapter Layer

The React package should not become tightly coupled to every internal detail of ToroSDK.

A lower-level adapter can isolate the official SDK.

```text
packages/
├── sdk-adapter/
│
└── react/
```

Architecture:

```text
React Hook
   ↓
Toolkit Adapter
   ↓
ToroSDK
   ↓
Toronet API
```

This makes it easier to:

- Normalize responses
- Handle SDK changes
- Centralize error handling
- Maintain compatibility
- Mock SDK behavior during unit testing
- Keep React-specific code separate from SDK integration code

---

# 19. Documentation Website

The documentation website is a major part of the project.

Importantly, **the documentation is documentation for our React Toolkit**.

It should not simply reproduce the official ToroSDK documentation.

A developer coming to the project should be able to learn how to build a React application using our toolkit.

---

# 20. Documentation Structure

## Getting Started

- Introduction
- Installation
- Requirements
- Project setup
- First application
- Testnet setup
- Configuration
- Environment variables

## Wallet

- Create wallet
- Access wallet
- Retrieve address
- Wallet state
- Wallet errors
- Security considerations

## Balances

- Retrieve balance
- Retrieve multiple balances
- Formatting
- Loading states
- Error handling

## Transactions

- Retrieve transaction
- Transaction history
- Send transaction
- Transaction status
- Handling failures

## TNS

- Resolve names
- Resolve addresses
- Working with TNS data

## Tokens

- Token information
- Token balances
- Token operations

## Payments

- Create payment
- Payment status
- Payment handling

## Smart Contracts

- Contract configuration
- Read contract data
- Write contract data
- Transaction handling
- Events

## Bridges

- Bridge operations
- Bridge status
- Handling bridge transactions

## Utilities

- Address utilities
- Amount formatting
- Transaction formatting
- Error utilities

## Security

- Wallet security
- Private information
- Testnet accounts
- Transaction confirmation
- Permissions
- Safe frontend patterns

## Testing

- Unit testing
- Integration testing
- Testnet testing
- Mocking
- End-to-end testing

---

# 21. Documentation Page Format

Each important API page should follow a consistent structure.

```text
Title

What it does

When to use it

Installation/configuration

Basic example

Parameters

Return value

Interactive example

Response

Errors

Common mistakes

Advanced example

Related APIs
```

The goal is to move developers from:

**reading → understanding → trying → copying → building**

---

# 22. Interactive Documentation

This is one of the defining features of the project.

Documentation examples should not be static code blocks only.

Where technically possible, each relevant example should have:

```text
Code
 ↓
Try it
 ↓
Real testnet operation
 ↓
Result
```

For example:

```text
useToroBalance()
```

The documentation can show the code and provide:

**Try it**

The developer enters an address or uses a safe testnet example.

The example executes the actual toolkit.

The developer sees the result.

---

# 23. Interactive Example Modal

For operations where a modal makes sense:

```text
┌─────────────────────────────────────┐
│ Try useToroBalance                  │
│                                     │
│ Address                             │
│ [_______________________________]   │
│                                     │
│ Currency                            │
│ [ NGN ▼ ]                           │
│                                     │
│              [ Run Example ]        │
│                                     │
│ Result                              │
│ ┌─────────────────────────────────┐ │
│ │ balance: ...                    │ │
│ │ currency: NGN                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Copy Result] [View Source]         │
└─────────────────────────────────────┘
```

The example should use the actual React Toolkit.

It should not be a fake UI pretending to execute an operation.

---

# 24. Interactive Example Requirements

Interactive examples should show enough information for developers to understand what happened.

Where technically possible:

```text
Input
 ↓
Toolkit Hook
 ↓
SDK Operation
 ↓
Request
 ↓
Response
```

For example:

```text
Toolkit:
useToroBalance()

Operation:
getBalance()

Result:
{
  ...
}
```

Sensitive information must never be exposed unnecessarily.

---

# 25. Copyable Code Examples

Every canonical documentation example should have:

- Copy button
- TypeScript syntax highlighting
- React example
- Clear imports
- Minimal unnecessary code

The code shown in documentation should be production-oriented enough that developers can actually adapt it.

There is no need for a separate code generator.

The examples themselves are the canonical implementation.

---

# 26. Testnet Lab

The Testnet Lab is separate from documentation because its purpose is experimentation.

Documentation teaches:

> "How do I use this?"

The Lab allows:

> "Let me actually experiment with it."

---

# 27. Testnet Lab Structure

Possible sections:

```text
Testnet Lab
│
├── Wallet
├── Balances
├── Send
├── Transactions
├── TNS
├── Tokens
├── Payments
├── Contracts
└── Bridges
```

The exact sections depend on actual SDK capabilities.

---

# 28. Lab Workspace

A developer should be able to perform operations and inspect the result.

Example:

```text
Operation
[ Get Balance ]

Address
[ 0x.... ]

Currency
[ NGN ]

[ Execute ]

Result
--------------------------------
Balance: ...
Currency: ...
Status: success
--------------------------------

Toolkit Method
useToroBalance()

[ View Source ]
```

The Lab should make the toolkit feel like something developers can actually work with, rather than just documentation.

---

# 29. Operation History

The Testnet Lab can optionally maintain a local session history.

Example:

```text
Recent Operations

Get Balance       Success
Create Wallet     Success
Resolve TNS       Success
Get Transaction   Success
Send Transaction  Success
```

This should not expose private information or permanently store sensitive wallet credentials.

---

# 30. Developer Tools

The project should include tools that help developers understand and debug Toronet applications.

These should be focused and useful.

---

# 31. Transaction Debugger

The Transaction Debugger can accept a transaction hash.

Example:

```text
Transaction Hash
[________________________]

[ Inspect ]
```

Result:

```text
Transaction
────────────────────
Status
Block
From
To
Value
Receipt
Events
Error/Revert reason
```

Where supported, the debugger can also show:

```text
Related Toolkit Operation

useToroTransaction()
```

This creates a direct relationship between the toolkit and the debugging experience.

---

# 32. Address Inspector

The Address Inspector can provide supported public information about an address.

Potential information:

- Address
- TNS information
- Balances
- Transaction information
- Other publicly accessible information

Only information actually exposed by the current Toronet APIs/SDK should be included.

The tool should not attempt to expose private user information.

---

# 33. Contract Inspector

Where supported, developers could provide:

```text
Contract Address
ABI
```

Then inspect:

- Contract information
- Read functions
- Write functions
- Events
- Responses

The tool can demonstrate the React Toolkit contract APIs.

---

# 34. Bridge Monitor

If supported by the ecosystem, developers can inspect bridge activity.

Potential information:

```text
Source transaction
Bridge transaction
Destination transaction
Current status
```

Again, this should be based on actual supported bridge functionality.

---

# 35. No Generic Blockchain Explorer

A generic blockchain explorer should not be built as part of this project.

The purpose is developer tooling.

If Toronet already provides explorer functionality, duplicating it would add unnecessary scope.

The Transaction Debugger and Address Inspector should solve developer-specific problems instead.

---

# 36. Example Applications

The project should include complete React + TypeScript applications.

These are not random demos.

Each example should demonstrate a real use case for the toolkit.

---

# 37. Wallet Example

A complete wallet interface demonstrating:

- Wallet creation
- Address
- Balance
- Transactions
- Basic wallet actions

It should use the React Toolkit throughout.

---

# 38. Balance Dashboard

A simple dashboard demonstrating:

```text
Wallet
   ↓
Balances
   ↓
Token/Currency information
   ↓
Transaction activity
```

This can serve as a beginner-friendly example.

---

# 39. Transaction Application

An application focused on:

- Transaction history
- Transaction details
- Status
- Sending
- Confirmation

It should demonstrate proper loading and error states.

---

# 40. TNS Application

A small application demonstrating:

```text
TNS Name
    ↓
Resolve
    ↓
Address
    ↓
Display information
```

This demonstrates how developers can integrate TNS functionality.

---

# 41. Token Dashboard

A token-focused React application showing:

- Token information
- Balances
- Relevant token operations

---

# 42. Payment Application

A complete payment flow demonstrating the toolkit's payment functionality.

Potential flow:

```text
Create Payment
      ↓
Payment Information
      ↓
User Action
      ↓
Payment Processing
      ↓
Payment Status
```

---

# 43. Contract Interface

A React application demonstrating smart-contract interaction.

Potential features:

- Contract address
- ABI
- Read operation
- Write operation
- Transaction status
- Events

---

# 44. Bridge Application

If the current SDK supports the required functionality, provide an application demonstrating:

```text
Source
 ↓
Bridge
 ↓
Status
 ↓
Destination
```

---

# 45. Build Guides

API documentation explains individual features.

Build guides explain how to combine them.

Examples:

## Build a Toronet Wallet Dashboard

```text
useToroWallet()
       ↓
useToroAddress()
       ↓
useToroBalance()
       ↓
useToroTransactions()
       ↓
React UI
```

## Build a Payment Application

```text
Wallet
 ↓
Payment
 ↓
Transaction
 ↓
Status
 ↓
UI
```

## Build a Token Dashboard

```text
Token
 ↓
Token Balance
 ↓
Transaction History
 ↓
Dashboard
```

## Build a TNS Application

```text
TNS Input
 ↓
Resolve
 ↓
Address
 ↓
Display
```

## Build a Transaction Dashboard

```text
Address
 ↓
Transactions
 ↓
Transaction Details
 ↓
Status
```

These guides should use the toolkit, not raw ToroSDK calls.

---

# 46. Testing Infrastructure

Testing should be part of the actual project, not something added at the end.

Testing areas:

```text
Unit Tests
Integration Tests
Testnet Tests
End-to-End Tests
Documentation Tests
Compatibility Tests
```

---

# 47. Unit Testing

Test:

- Hooks
- Utilities
- Response normalization
- Error handling
- State transitions
- Validation
- Formatting

---

# 48. Integration Testing

Integration tests should verify that the toolkit communicates correctly with the underlying ToroSDK.

Example:

```text
React Toolkit
      ↓
Adapter
      ↓
ToroSDK
      ↓
Expected response
```

---

# 49. Testnet Integration Tests

Where feasible, selected tests can execute against Toronet testnet.

This provides confidence that the examples are not simply passing mocked data.

Testnet operations must use safe test accounts and avoid exposing private credentials.

---

# 50. End-to-End Testing

Use browser-level testing to verify:

- Documentation pages
- Interactive examples
- Testnet Lab
- Forms
- Wallet flows
- Transaction flows
- Developer tools

A typical flow could be:

```text
Open documentation
      ↓
Open example
      ↓
Click Try It
      ↓
Execute testnet operation
      ↓
Verify result
```

---

# 51. Documentation Validation

Documentation examples should be treated as code.

Where possible:

```text
Documentation Example
        ↓
TypeScript Compilation
        ↓
Tests
        ↓
Example Validation
```

This helps prevent documentation from becoming outdated.

---

# 52. SDK Compatibility

The official ToroSDK can change.

The project should therefore track SDK compatibility.

For example:

```text
ToroForge React Toolkit
        │
        ├── ToroSDK version X
        ├── ToroSDK version Y
        └── Compatibility status
```

The project should clearly communicate supported versions.

---

# 53. API Change Detection

If the underlying SDK changes:

```text
ToroSDK Update
      ↓
Compatibility Tests
      ↓
Detected Changes
      ↓
Toolkit Update
      ↓
Documentation Update
      ↓
Example Validation
```

This becomes important if the toolkit is expected to remain useful over time.

---

# 54. Error Handling

The toolkit should provide a consistent error experience.

Instead of every React application having to understand different low-level SDK errors, the toolkit can normalize common cases.

Example:

```tsx
const {
  data,
  error
} = useToroBalance(...);
```

The error object should be predictable.

Potential structure:

```text
code
message
operation
details
```

Exact structure should be determined from actual SDK behavior.

---

# 55. Loading and State Management

Hooks should follow predictable React patterns.

For example:

```tsx
const {
  data,
  loading,
  error,
  refetch
} = useToroTransactions(...);
```

The developer should not need to build custom state-management logic for every simple SDK call.

---

# 56. TypeScript First

TypeScript should be a major part of the toolkit.

The package should provide:

- Strong types
- Typed parameters
- Typed responses
- Typed errors where possible
- Autocomplete
- Useful interfaces
- No unnecessary `any`

Example:

```tsx
const result: ToroTransaction = ...
```

Developers should be able to understand the API through their editor.

---

# 57. Security

Because the toolkit deals with wallets and financial operations, security must be considered from the beginning.

Principles:

- Do not unnecessarily store private keys.
- Do not expose sensitive credentials.
- Do not hide signing operations.
- Clearly identify transaction actions.
- Use testnet accounts for demonstrations.
- Avoid persistent storage of sensitive wallet information.
- Explain security implications in documentation.
- Keep permissions minimal.
- Never make a transaction without an explicit user action.

Interactive examples should use disposable/testnet credentials where needed.

---

# 58. Configuration

The toolkit should have a predictable configuration system.

Potential:

```tsx
<ToroProvider
  config={{
    network: "testnet"
  }}
>
  <App />
</ToroProvider>
```

Then hooks can access the configured environment.

For example:

```tsx
function App() {
  const { balance } = useToroBalance({
    address
  });

  return ...
}
```

The exact provider/API should be designed after understanding the official SDK's initialization requirements.

---

# 59. Environment Support

The toolkit should clearly distinguish environments.

For example:

```text
Testnet
Production
```

Developers should not accidentally connect an experimental application to production.

The documentation should explain environment configuration clearly.

---

# 60. UI Philosophy

The toolkit should not force developers into one design system.

The optional UI package can provide useful primitives, but developers should remain free to use:

- Tailwind
- CSS
- CSS Modules
- Material UI
- shadcn/ui
- Other React UI libraries

The core package should remain UI-independent.

---

# 61. Documentation Design

The documentation should feel like a developer product rather than a marketing website.

Important elements:

- Sidebar navigation
- Search
- TypeScript examples
- Copy buttons
- Interactive examples
- API reference
- Guides
- Testnet links
- GitHub/source links
- Clear error explanations

---

# 62. Documentation Example Flow

A typical page should feel like this:

```text
# Get Balance

Retrieve a wallet balance.

## Example

[TypeScript Code]

const { balance } = useToroBalance({
  address
});

## Try it

[Interactive Example]

## Response

{
  ...
}

## Parameters

...

## Errors

...

## Related

Transactions
Wallet
Tokens
```

---

# 63. No Separate SDK Explorer

The documentation itself is the exploration experience.

Developers can:

```text
Browse API
 ↓
Read explanation
 ↓
See code
 ↓
Try code
 ↓
Inspect result
 ↓
Copy code
```

There is no need to build another interface whose only purpose is to redirect developers into the docs.

---

# 64. No Code Generator

The project does not need a code generator.

The canonical code examples already provide the implementation.

The useful workflow is:

```text
Read
 ↓
Try
 ↓
Understand
 ↓
Copy
 ↓
Modify
 ↓
Build
```

This keeps the project focused.

---

# 65. No AI

AI is not part of the project.

The value should come from:

- Good abstractions
- Good documentation
- Working examples
- Testnet experimentation
- Developer tools
- Type safety
- Testing
- Clear APIs

---

# 66. Developer Experience

The project should make the following experience possible:

```text
Developer discovers project
        ↓
Installs package
        ↓
Reads Getting Started
        ↓
Copies first example
        ↓
Runs React application
        ↓
Uses Testnet
        ↓
Experiments in Lab
        ↓
Reads Build Guide
        ↓
Uses Example Application
        ↓
Builds own Toronet application
```

---

# 67. Repository Documentation

The GitHub repository should contain:

```text
README.md
CONTRIBUTING.md
SECURITY.md
CHANGELOG.md
LICENSE
```

The README should quickly explain:

- What the project is
- Why it exists
- Installation
- Quick example
- Documentation
- Testnet Lab
- Examples
- Contributing

---

# 68. Contribution Workflow

Contributors should be able to work on:

- React hooks
- Utilities
- Components
- Documentation
- Examples
- Developer tools
- Tests
- Bug fixes
- SDK compatibility

Contribution guidelines should explain:

```text
Issue
 ↓
Implementation
 ↓
Tests
 ↓
Documentation
 ↓
Example
 ↓
Pull Request
```

---

# 69. Release Process

The project should use versioning.

Example:

```text
0.x.x
```

during active development, followed by stable releases when the API is mature.

Every release should document:

- New functionality
- Breaking changes
- SDK compatibility
- Bug fixes
- Documentation changes

---

# 70. Continuous Integration

CI should run:

```text
Install
 ↓
Type Check
 ↓
Lint
 ↓
Unit Tests
 ↓
Build
 ↓
Integration Tests
 ↓
E2E Tests
```

Where testnet credentials are required, those tests should be separated and securely configured.

---

# 71. Deployment

Potential deployments:

```text
Documentation
→ Vercel or equivalent

Testnet Lab
→ Vercel or equivalent

Package
→ npm

Examples
→ Individual deployments where useful
```

The exact hosting provider is not essential to the architecture.

---

# 72. Project Relationship With ToroForge

The project should initially be positioned carefully.

If it is independently built, it should not imply that it is an official ToroForge product unless ToroForge explicitly adopts it.

Possible wording:

> A community-built React and TypeScript developer toolkit for the Toro ecosystem.

If ToroForge later adopts or officially sponsors the project, branding can be changed accordingly.

---

# 73. Relationship With ToroSDK

The relationship should remain explicit:

```text
ToroSDK
= underlying official SDK

ToroForge React Toolkit
= React developer experience layer
```

This avoids duplication and gives the official SDK continued importance.

---

# 74. Why Not Fork ToroSDK?

A full fork would introduce unnecessary problems:

- Duplicated implementation
- Maintenance burden
- Divergence from upstream
- More difficult updates
- Confusion about which SDK developers should use
- Larger responsibility for low-level blockchain functionality

Building the React layer on top of the official SDK provides a better separation:

```text
ToroSDK
Low-level ecosystem functionality

ToroForge React Toolkit
Frontend developer experience
```

---

# 75. What Makes the Project Different

The project is not just another wrapper.

Its value comes from combining:

```text
React Toolkit
+
TypeScript
+
Interactive Documentation
+
Real Testnet Examples
+
Testnet Lab
+
Curated Applications
+
Build Guides
+
Developer Debugging Tools
+
Testing
+
SDK Compatibility
```

The important part is that all of these pieces reinforce the same goal:

**making it easier to build real React applications on Toronet.**

---

# 76. Example End-to-End Experience

Imagine a developer wants to display a user's balance.

They open the documentation.

They see:

```tsx
const {
  balance,
  loading,
  error
} = useToroBalance({
  address,
  currency: "NGN"
});
```

They click:

**Try it**

The example runs against the testnet.

They see the actual result.

They open:

**View Source**

They understand how the example works.

They click:

**Copy**

They put it into their React application.

Later, their transaction fails.

They open the Transaction Debugger.

They inspect the transaction.

They return to the documentation and read the transaction/error handling guide.

That is the experience the entire project should be designed around.

---

# 77. Final Project Structure

The complete vision can be summarized as:

```text
ToroForge React Toolkit
│
├── React + TypeScript SDK
│   ├── Wallet
│   ├── Balances
│   ├── Transactions
│   ├── TNS
│   ├── Tokens
│   ├── Payments
│   ├── Contracts
│   ├── Bridges
│   └── Utilities
│
├── Documentation
│   ├── Getting Started
│   ├── API Reference
│   ├── Interactive Examples
│   ├── Security
│   └── Testing
│
├── Testnet Lab
│   ├── Wallet
│   ├── Balances
│   ├── Transactions
│   ├── TNS
│   ├── Tokens
│   ├── Payments
│   ├── Contracts
│   └── Bridges
│
├── Developer Tools
│   ├── Transaction Debugger
│   ├── Address Inspector
│   ├── Contract Inspector
│   └── Bridge Monitor
│
├── Examples
│   ├── Wallet
│   ├── Balance Dashboard
│   ├── Transactions
│   ├── TNS
│   ├── Tokens
│   ├── Payments
│   ├── Contracts
│   └── Bridge
│
├── Build Guides
│   ├── Wallet Dashboard
│   ├── Payment App
│   ├── Token Dashboard
│   ├── TNS App
│   └── Transaction Dashboard
│
└── Engineering
    ├── Unit Tests
    ├── Integration Tests
    ├── E2E Tests
    ├── Testnet Tests
    ├── Documentation Validation
    ├── SDK Compatibility
    └── CI/CD
```

# 78. Development Principle

The central principle of the project should be:

> **Don't just tell developers how to build on Toronet. Give them the React tools, working examples, testnet environment, documentation, and debugging utilities to actually build it.**

That is the complete web-first vision.

Flutter/Dart can remain a future expansion once the React/TypeScript toolkit is mature, without making it part of the current implementation.