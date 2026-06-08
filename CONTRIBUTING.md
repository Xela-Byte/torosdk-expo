# Contributing to torosdk-expo

Thank you for your interest in contributing! This guide covers local development, testing, and pull request workflows.

## Prerequisites

- Node.js 18+
- npm 9+
- An Expo project for manual testing (optional)

## Setup

```bash
git clone https://github.com/nonomnonom/torosdk-expo.git
cd torosdk-expo
npm install
```

## Development Workflow

### Build

```bash
npm run build
```

This runs `tsc` to compile TypeScript to `dist/`, then copies CLI templates. The build output is what consumers use — always build before manually testing in an example app.

### Type Check (no emit)

```bash
npm run typecheck
```

Faster than a full build; catches type errors without writing `dist/`.

### Lint

```bash
npm run lint
```

ESLint with TypeScript rules. The config is in `eslint.config.mjs`.

### Test

```bash
npm test
```

Jest with `ts-jest`. Tests mock the upstream `torosdk` and `react-native` modules.

### Integration Tests (opt-in)

```bash
RUN_INTEGRATION=1 npm run test:integration
```

Makes real HTTP requests to `testnet.toronet.org`. Skipped by default.
Requires network access to the Toronet testnet.

### Full CI Check (run before pushing)

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

## Project Structure

```
src/
├── core/          # Zero React — types, config, errors, storage, auth, SDK wrappers, axios adapter
│   └── index.ts   # Barrel export for torosdk-expo/core
├── react/         # React hooks, TanStack Query provider, query key factory
│   └── index.ts   # Barrel export for torosdk-expo
└── cli/           # Node.js CLI bootstrap (npx torosdk-expo init)
    ├── init.ts
    └── templates/ # Scaffolded file templates
```

Three subpath exports in `package.json`:
- `torosdk-expo` → React hooks + provider (`src/react/`)
- `torosdk-expo/core` → Typed SDK wrappers, zero React (`src/core/`)
- `torosdk-expo/cli` → Bootstrap CLI (`src/cli/`)

## Testing

Tests live in `__tests__/` and mirror the `src/` structure:

- `__tests__/core/` — SDK wrappers, storage, auth
- `__tests__/react/` — React hooks and provider
- `__tests__/cli/` — CLI init logic

Mocks are in `__tests__/__mocks__/` (react-native, torosdk, expo modules).

### Running specific tests

```bash
npx jest __tests__/core/sdk.test.ts
npx jest --watch  # watch mode
```

## Code Style

- TypeScript strict mode
- JSDoc on all exported functions (`@param`, `@returns`, `@throws`, `@remarks`)
- No `any` without an explanatory comment and `eslint-disable`
- Files are named for their responsibility (`errors.ts`, `storage.ts`)
- Functions use verb-noun naming (`createWallet`, `getBalance`)
- Barrel exports in `index.ts` with section comments

## Commit Messages

Follow the existing convention:
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `chore:` — maintenance, dependencies, config
- `release:` — version bump

## Pull Requests

1. Run the full CI check locally: `npm run typecheck && npm run lint && npm test && npm run build`
2. Update `CHANGELOG.md` under `[Unreleased]` with your changes
3. Open a PR against `main` with a description of what changed and why

## Questions?

Open an issue on GitHub or reach out to the Toronet community.
