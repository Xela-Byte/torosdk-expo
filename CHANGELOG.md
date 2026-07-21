# Changelog

All notable changes to torosdk-expo are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Cross-chain Bridge coverage.** Core wrappers `bridgeToken`, `getBridgeTokenFee`, `getBridgeBalance`, `getBridgeTokenBalance`, `getBridgeTransactions`, `getBridgeTokenTransactions`, and matching hooks (`useBridgeToken`, `useBridgeTokenFee`, `useBridgeBalance`, `useBridgeTokenBalance`, `useBridgeTransactions`, `useBridgeTokenTransactions`). Re-exports the `BridgeNetwork` enum (Solana, Base, Polygon, BSC, Arbitrum, Ethereum).
- **Solana coverage.** Core wrappers `createSolanaAddress`, `createToronetSolanaAddress`, `isValidSolanaAddress`, `transferSolana`, `transferSolToken`, `getSolBalance`, `getSolTokenBalance`, `getSolTransactions`, `getSolTokenTransactions`, and matching hooks (`useCreateSolanaAddress`, `useCreateToronetSolanaAddress`, `useTransferSolana`, `useTransferSolToken`, `useSolBalance`, `useSolTokenBalance`, `useSolTransactions`, `useSolTokenTransactions`).
- **Currency swap coverage.** Core wrappers `getSwapQuote` and `executeSwap`, plus `useSwapQuote` and `useSwap` hooks.
- New `OperationCategory` values (`bridge`, `bridge-read`, `swap`, `swap-read`, `solana-transfer`, `solana-read`) so auth strategies can gate the new operations.
- Optional `AdminCredentials` passthrough on the sensitive write wrappers (`bridgeToken`, `transferSolana`, `transferSolToken`, `createSolanaAddress`) and their hooks, for Toronet deployments that require a privileged admin/relayer to authorize the operation. Backward-compatible: omit it and the operation runs under the wallet's own stored password exactly as before.
- `ToroRawResult` type documenting the raw Toronet response envelope returned by bridge/Solana/swap endpoints.
- `ToronetConfig.debug` flag to gate verbose adapter logging (off by default).
- `CHANGELOG.md` — this file.
- `CONTRIBUTING.md` — local development and contribution guide.
- CI/CD GitHub Actions workflow (`npm ci && typecheck && lint && test && build`).

### Changed
- Bumped the `torosdk` dependency from `^0.2.0` to `^0.5.0` (Bridge, Solana, and swap functions require 0.5.x).
- Tightened `react-native` peer dependency from `"*"` to `">=0.73.0"` (Expo 52 minimum).
- All `console.log` calls in `axios-adapter.ts` are now gated behind `ToronetConfig.debug`.

### Fixed
- Corrected two false findings in `VETTING_REPORT.md` (see corrections addendum).

## [0.1.6] — 2026-06-08

### Added
- iOS native `ToroNetworking` module using Network framework (`nw_connection`) for raw TCP+TLS HTTP requests.
- Custom axios adapter with three-tier transport: native NWConnection → XHR → original adapter chain.
- `ARCHITECTURE.md` — layered architecture overview, design decisions, and patterns.
- `DEVELOPER_STORY.md` — narrative developer journey from zero to transfer.
- `VETTING_REPORT.md` — comprehensive codebase audit against Toronet bounty criteria.

### Changed
- GET requests with JSON body now route through the custom adapter (bypasses CFNetwork's GET+body restriction on iOS 26+/Darwin 25).

## [0.1.5] — 2026-06-08

### Added
- Example app updated to Expo SDK 52 structure with 6 demo screens.
- Wallet display, multi-wallet switcher, balance grid, transfer form, TNS, KYC, exchange rates.

### Changed
- Example app uses published `torosdk-expo` from npm registry (no local Metro path aliases).

## [0.1.4] — 2026-06-08

### Added
- Native `NWConnection` module for iOS — raw TCP+TLS HTTP requests bypassing CFNetwork.

### Fixed
- GET requests with JSON body on iOS 26+ / Darwin 25 now work via native transport fallback.

## [0.1.3] — 2026-06-07

### Changed
- Example app dependency bumped to `torosdk-expo ^0.1.3`.

## [0.1.2] — 2026-06-07

### Fixed
- Use raw `XMLHttpRequest` instead of `fetch` for GET requests carrying a JSON body (React Native's WHATWG fetch throws on GET+body per spec).

## [0.1.1] — 2026-06-07

### Added
- CLI bootstrap: `npx torosdk-expo init` scaffolds `src/torosdk/` (config, auth, provider).
- CLI auto-detects Expo project root, package manager (npm/yarn/pnpm), and installs peer dependencies.

### Fixed
- `createConfig()` now calls `initializeSDK()` so torosdk uses the correct network endpoint.
- `Currency` enum re-exported as a value (not just a type) for runtime use.

### Changed
- Example app consumes `torosdk-expo` from npm registry instead of local source.

## [0.1.0] — 2026-06-07

### Added
- Initial release.
- **Core layer** (`torosdk-expo/core`):
  - `ToroError` hierarchy: `NetworkError`, `APIError`, `AuthBlockedError`, `StorageError`.
  - `ToronetConfig` with `network` and `apiBaseUrl`.
  - `createConfig()` / `getConfig()` singleton pattern.
  - SecureStore wrappers: password CRUD, wallet list, active wallet tracking.
  - Auth strategy pattern: `PasswordStrategy`, `BiometricStrategy`, `CustomStrategy`.
  - Typed SDK wrappers: `createWallet`, `getBalance`, `getBalances`, `transfer`, `resolveTNS`, `lookupTNS`, `setTNS`, `submitKYC`, `getKYCStatus`, `getExchangeRates`.
  - `wrapError()` normalizes unknown upstream errors into typed `ToroError` subclasses.
- **React layer** (`torosdk-expo`):
  - `ToronetProvider` with sensible TanStack Query defaults.
  - Query key factory with structured invalidation targets.
  - Hooks: `useBalance`, `useBalances`, `useTransfer`, `useWallets`, `useCreateWallet`, `useImportWallet`, `useDeleteWallet`, `useResolveTNS`, `useLookupTNS`, `useSetTNS`, `useKYCStatus`, `useSubmitKYC`, `useExchangeRates`.
  - Mutation-driven cache invalidation.
- **CLI layer** (`torosdk-expo/cli`):
  - `npx torosdk-expo init` bootstrap command.
  - Templates: `config.ts.template`, `auth.ts.template`, `provider.tsx.template`.
- **iOS native module**: `ToroNetworking` with `rawRequest` for NWConnection-based HTTP.
- **Tests**: 9 test suites covering core SDK, storage, auth, React hooks, provider, and CLI.
- **Documentation**: README with installation/usage, JSDoc on all public API, example app.
