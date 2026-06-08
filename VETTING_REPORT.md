# torosdk-expo Vetting Report

**Vetted against Toronet Bounty Evaluation Criteria**
**Date:** 2026-06-08 (audit) · 2026-06-08 (corrections)
**Version:** v0.1.6
**Repository:** torosdk-expo (Expo SDK 52+ wrapper for torosdk v0.2.0)

> **Corrections Addendum (2026-06-08):** Two findings were determined to be false:
> - `getWalletList()` silent failure — code already throws `StorageError` correctly (`storage.ts:71-79`)
> - No example app README — `example/README.md` already exists (65 lines)
>
> One finding is now resolved:
> - `console.log` in production paths — gated behind `ToronetConfig.debug` flag (off by default)
>
> Corrected scores would be approximately **81/100** (Correctness +2, Code Quality +1, Documentation +1).

---

## Executive Summary

`torosdk-expo` is a well-architected Expo/React Native SDK wrapper that demonstrates strong engineering fundamentals. With three cleanly separated entry points (React hooks, core SDK, CLI scaffold), typed error handling, strategy-pattern authentication, and extensive test coverage, it delivers a production-quality developer experience. The primary gap is the absence of content marketing artifacts (blog posts, videos, Twitter threads) and a handful of production-readiness concerns around console logging.

**Overall Score: 78/100** (detailed breakdown below)

---

## 0. Minimum Bar Assessment

| Criterion | Status | Evidence |
|-----------|--------|----------|
| **Reproducibility** | ✅ PASS | `npm install` → `npm run build` → `npm test` defined in `package.json:32-34`. TypeScript compiles to `dist/`. Jest configured with ts-jest. |
| **Acceptance criteria coverage** | ✅ PASS | Wraps torosdk's wallet, balance, transfer, TNS, KYC, and exchange rate APIs. Adds SecureStore-backed password storage, biometric auth gating, TanStack Query hooks, and CLI bootstrap — all declared capabilities are implemented. |
| **Build produces correct artifact** | ✅ PASS | `tsc && cp -r src/cli/templates dist/cli/` (line 32). `files` array (line 21-27) includes `dist/`, `ios/`, podspec, README, LICENSE. |

**Minimum Bar Verdict: PASS** — The project builds, tests exist, and all claimed features are implemented.

---

## 1. Technical Delivery A — Correctness (25%) — Score: 21/25

### Strengths

**Typed error hierarchy (`src/core/errors.ts`)** — `ToroError` base class with `code`, `detail`, `cause` plus four subclasses (`NetworkError`, `APIError`, `AuthBlockedError`, `StorageError`). This is a best-practice pattern that makes error handling predictable for consumers. Each subclass captures the right metadata (HTTP status for API errors, operation name for auth blocks).

**Comprehensive `wrapError()` (`src/core/sdk.ts:59-89`)** — Normalizes unknown errors through progressive inspection: string pattern matching for transport failures → status/statusCode property check → regex HTTP code extraction → fallback to NetworkError. This is the right approach for wrapping an upstream SDK (torosdk) that may throw inconsistently.

**Per-currency fallback in `getBalances()` (`src/core/sdk.ts:223-234`)** — Uses `Promise.all` with per-currency try/catch, falling back to `'0'` for individual failures. This means one failing currency doesn't take down the entire balance display — correct behavior for a UI-facing SDK.

**Auth gating coverage** — Every sensitive operation (transfer, KYC, TNS writes, wallet mutations) passes through `authorizeOperation()` or `resolvePassword()`. Read operations (balance, TNS resolution, KYC status, exchange rates) correctly skip auth. The operation category is threaded through so the auth strategy can show context-appropriate prompts.

**Mutation-driven invalidation** — Every mutation hook invalidates the correct query keys on success. For example, `useTransfer` invalidates both `['torosdk', 'balance', address, currency]` and `['torosdk', 'balances', address]` (`src/react/hooks/useTransfer.ts:33-37`), ensuring the UI stays fresh without over-fetching.

**Exchange rate shape normalization (`src/core/sdk.ts:399-417`)** — Handles both array and record-typed API responses, normalizing to a uniform array. This is exactly the kind of defensive normalization a wrapper SDK should provide.

**Idempotent wallet list (`src/core/storage.ts:65-80`)** — `addWalletToList()` checks for duplicates before appending. This prevents edge cases where re-creating a wallet could corrupt the address list.

### Issues Found

**1. `console.log` in production paths (RESOLVED — v0.1.7)**
~~`src/core/axios-adapter.ts` contains 6+ `console.log`/`console.warn` statements (lines 181-186, 194-201, 208, 217, 256-259, 357, 407). These fire on every request in production and log potentially sensitive URLs and data lengths.~~ **FIXED:** All 5 `console.log` calls are now gated behind `ToronetConfig.debug` flag (off by default). 2 `console.warn` calls remain unconditional — both are for genuine error conditions (native request failure, XHR onerror) where a warning is appropriate.

**2. `getWalletList()` silent failure — FALSE FINDING**
~~`src/core/storage.ts:53-56` — If `SecureStore.getItemAsync()` throws, the catch block returns `[]` with no logging.~~ **CORRECTION:** The code at `storage.ts:71-79` wraps the catch in `throw new StorageError('Failed to read wallet list', err)` — it already throws correctly on error. No fix needed.

**3. `submitKYC` return type `Promise<unknown>` (LOW)**
`src/core/sdk.ts:376` — returns `Promise<unknown>`. The upstream SDK type is opaque, but a partial type (e.g., `Promise<{ reference?: string }>`) would improve consumer ergonomics. The `as any` cast on line 380 is justified by the comment but is still a type-safety hole.

**4. Example screen uses `as any` for styles (LOW)**
`example/src/screens/HomeScreen.tsx:133` — `width: '47%' as any`. This is a known React Native quirk (percentage strings aren't in the RN type definitions), but it's still a lint escape hatch.

**5. No integration tests against a real Toronet endpoint**
All tests mock `torosdk` at the module level. This is appropriate for unit tests, but there's no smoke test that validates the SDK actually works against a running Toronet node (even testnet).

**6. No empty-string guard for password (`src/core/storage.ts`)**
`setPassword()` accepts any string including `''`. Setting an empty password would cause `resolvePassword()` to return `''`, which would be truthy and pass the `if (!pwd)` check on `sdk.ts:38` — but would likely cause downstream API errors that surface as confusing `NetworkError` rather than a clear "empty password" error.

### Correctness Score: 21/25
Strong core logic with well-considered edge cases. Deductions for production logging, silent failure mode in storage, and lack of integration validation.

---

## 2. Technical Delivery A — Code Quality (20%) — Score: 17/20

### Strengths

**Layered architecture with clean separation** — `src/core/` (zero React), `src/react/` (hooks + provider), `src/cli/` (Node.js), `ios/` (native module). Each layer has a clear responsibility and a barrel index. The three subpath exports in `package.json` enforce this separation at the bundler level.

**Strategy pattern for authentication (`src/core/auth.ts`)** — `AuthStrategy` interface with three implementations (Password, Biometric, Custom). Adding a fourth strategy requires zero changes to existing code. The interface is a single-method contract (`authorize(operation): Promise<boolean>`) — exactly the right abstraction level.

**Consistent naming** — Files are named for their responsibility (`errors.ts`, `storage.ts`, `config.ts`). Functions use verb-noun naming (`createWallet`, `getBalanceForCurrency`, `resolvePassword`). No abbreviations that need decoding.

**DRY through internal helpers** — `authorizeOperation()`, `resolvePassword()`, and `wrapError()` extract repeated logic rather than duplicating it across 12 exported functions. The `wrapError` pattern (every public function has `try { ... } catch (err) { wrapError(err); }`) is consistent and predictable.

**Query key factory (`src/react/query-keys.ts`)** — Structured, read-only query keys rooted at `['torosdk']`. Mutations invalidate specific leaves rather than the entire tree. This prevents stale-while-revalidate storms.

**JSDoc on public API** — Every exported function in `sdk.ts` has `@param`, `@returns`, `@throws`, and `@remarks` with context about auth gating, side effects, and edge cases. This is production-grade documentation.

**Native module quality (`ios/ToroNetworking.m`)** — 241 lines, focused, single responsibility (raw TCP+TLS HTTP request). Uses Network framework's `nw_connection` correctly with block-based async patterns, proper error handling, and state machine management. Well-commented with the WHY (Darwin 25 CFNetwork restriction).

**Custom adapter with graceful degradation (`src/core/axios-adapter.ts`)** — Three-tier transport: native NWConnection → XHR → original adapter chain. Each tier falls through on failure. Timeout via `Promise.race`. Lazy-loads `react-native` to avoid Metro initialization ordering bugs — the JSDoc on `getNativeRawRequest()` (lines 75-87) explains exactly why.

**Module-level singleton pattern (`src/core/config.ts`, `src/core/auth.ts`)** — Appropriate for an SDK. The singleton is documented, and `getConfig()` throws a clear error if accessed before initialization.

### Issues Found

**1. Production `console.log` statements (RESOLVED)**
Covered in Correctness section. ~~Also a code quality concern — 6+ unconditional log calls in `axios-adapter.ts` produce noise in production.~~ **FIXED:** Debug flag gating implemented; see Correctness section.

**2. `eslint.config.mjs` is new/untracked (LOW)**
The file exists (15 lines, flat config) but is untracked per git status. A lint config that isn't committed doesn't enforce anything in CI or for contributors.

**3. No `.prettierrc` or formatting config (LOW)**
No code formatter configuration in the repo. The code is consistently formatted, but there's no automated enforcement.

**4. No CI/CD pipeline (LOW)**
No `.github/workflows/` or equivalent. Tests and build aren't enforced on PR/merge.

**5. Test mocks are file-level, not factory functions**
`__tests__/__mocks__/react-native.ts` (63 lines) is a static mock. If a test needs different mock behavior, it has to mock at the test level, which creates ordering dependencies.

### Code Quality Score: 17/20
Clean architecture, consistent patterns, excellent native code, good DRY discipline. Deductions for console.log in production, missing CI, and untracked lint config.

---

## 3. Technical Delivery A — Developer Experience (20%) — Score: 18/20

### Strengths

**CLI bootstrap (`src/cli/init.ts`)** — `npx torosdk-expo init` is the gold standard for SDK onboarding. It:
- Detects the Expo project root (line 18: checks for `app.json` or `app.config`)
- Detects the package manager (npm/yarn/pnpm)
- Installs 5 required peer dependencies
- Scaffolds 3 starter files into `src/torosdk/`
- Appends `TOROSDK_NETWORK=testnet` to `.env.example`
- Is a zero-dependency Node.js script (stdlib only)

**Subpath exports** — Three entry points for three audiences:
- `torosdk-expo` → React developers get hooks + provider
- `torosdk-expo/core` → Non-React Node tools get typed SDK wrappers
- `torosdk-expo/cli` → Everyone gets bootstrap

This is exactly how modern npm packages should be structured.

**Sensible TanStack Query defaults** — `staleTime` values are well-chosen:
- 30s for balances (change frequently)
- 60s for exchange rates (moderate volatility)
- 5min for TNS/KYC (slow-changing)

Default QueryClient has `retry: 2`, `staleTime: 30000`, `refetchOnWindowFocus: true` — reasonable production defaults.

**Optional biometric dependency** — `expo-local-authentication` is marked `optional: true` in `peerDependenciesMeta` (line 55-57). Apps that don't need biometric auth aren't forced to install it.

**Example app is comprehensive** — 6 screens covering the full surface area:
- `HomeScreen` — wallet display, multi-wallet switcher, balance grid
- `CreateWalletScreen` — create/import/delete with tabbed UI
- `TransferScreen` — send with currency picker, live balance display
- `ExchangeRatesScreen`, `KYCScreen`, `TNSScreen` (present in git)

Each screen demonstrates error states, loading states, and empty states — exactly what a reference implementation should show.

**Template files are well-commented** — `src/cli/templates/auth.ts.template` presents all 3 auth strategy options with inline comments explaining when to use each. The developer uncomments their choice and ships.

**Typed exports** — `Currency` enum re-exported from torosdk. `ToronetConfig` has a `network` field with `'testnet' | 'mainnet'` literal union. All hooks return properly typed results.

**`queryKeys` factory** — Structured invalidation targets. A mutation can invalidate `queryKeys.balances(address)` without knowing the internal key structure.

**Error messages include actionable context** — `"No stored password for ${address}. Import or create a wallet first."` tells the developer exactly what went wrong and how to fix it.

### Issues Found

**1. Example screens use `any` for navigation prop (LOW)**
All 6 screens type `navigation` as `any`. For an Expo app, typing this with `NativeStackNavigationProp` would improve the developer's autocomplete experience.

**2. No `.env.example` in the package root (LOW)**
The CLI appends to the project's `.env.example`, but the SDK itself doesn't ship with one. A developer reading the README sees `TOROSDK_NETWORK` referenced but doesn't have a template in the package.

**3. `react-native` peer dependency is `"*"` (LOW)**
`package.json:52` — allowing any version of react-native could lead to compatibility issues. The README specifies Expo SDK 52+, so `">=0.73.0"` (the RN version bundled with Expo 52) would be more precise.

### Developer Experience Score: 18/20
Excellent CLI onboarding, well-designed API surface, comprehensive example app, thoughtful defaults. Minor deductions for `any` types in examples and version range looseness.

---

## 4. Technical Delivery A — Documentation (15%) — Score: 12/15

### Strengths

**ARCHITECTURE.md** — 184 lines of dense, well-structured documentation covering:
- Layered architecture diagram
- 6 key design decisions with rationale
- "Patterns worth stealing" section (5 transferable patterns)
- Complete file map (21 files with responsibilities)

This is an exceptional architecture document — it explains not just WHAT but WHY.

**DEVELOPER_STORY.md** — 170-line narrative from "Amara's" perspective. Covers the full journey: CLI init → auth strategy selection → app wrapping → onboarding → dashboard → transfer → TNS → KYC. This is content marketing AND documentation in one.

**JSDoc on public API** — Every exported function in `sdk.ts` (12 functions, lines 93-417) has:
- `@param` for every parameter
- `@returns` with shape description
- `@throws` listing specific error types
- `@remarks` with auth gating context, side effects, and edge case notes

The `wrapError()` JSDoc (lines 46-58) is particularly good — it documents the inspection order and fallback behavior.

**Template comments** — `auth.ts.template` (36 lines) is almost entirely comments explaining 3 strategy options with example code for each.

**Inline rationale comments** — When the code does something non-obvious, it explains why:
- `axios-adapter.ts:6-21` — 15-line file overview explaining WHY the adapter exists
- `axios-adapter.ts:75-87` — explains the lazy `require('react-native')` pattern
- `sdk.ts:189-191` — documents the API response shape `{ result, balance, error }`

**README.md** — Covers installation, configuration, usage examples, and links to ARCHITECTURE.md. Present and functional.

### Issues Found

**1. No API reference docs (MEDIUM)**
There's no generated API reference (TypeDoc, API Extractor, etc.). The JSDoc is excellent but requires reading source files. For the 12 exported SDK functions and 7 React hooks, a single-page API reference with function signatures, parameters, and return types would significantly improve discoverability.

**2. No example app README — FALSE FINDING**
~~The example app directory has its own `package.json`, `app.json`, and screens but no README explaining how to run it.~~ **CORRECTION:** `example/README.md` exists (65 lines) with Quick Start, screen documentation, project structure, setup steps, and migration notes. This finding was an oversight.

**3. Some internal functions lack JSDoc (LOW)**
`buildRawHttpRequest()` (line 117), `getNativeRawRequest()` (line 90), and `setupAxiosAdapter()` (line 176) have JSDoc but functions like the adapter closure (line 189) and XHR path promise (line 266) do not. For a 415-line file with complex transport logic, this is a gap.

**4. No changelog**
No `CHANGELOG.md` in the repo. The git history shows structured commit messages (`release:`, `chore:`, `fix:`, `feat:`), but there's no user-facing changelog for version-to-version migration.

### Documentation Score: 12/15
Excellent architecture doc, strong JSDoc, good narrative content. Deductions for missing API reference and changelog.

---

## 5. Knowledge Sharing & Ecosystem Contribution — B (20%) — Score: 12/20

### Existing Content

**DEVELOPER_STORY.md** — The narrative walkthrough (170 lines, "Amara's journey") is exactly the kind of content this criterion values. It's developer marketing in written form. It demonstrates product thinking by showing the SDK through a new user's eyes. Good candidate for adaptation into a blog post.

**ARCHITECTURE.md "Patterns worth stealing"** — Five transferable patterns identified:
1. Typed wrappers around untyped SDKs
2. Strategy pattern for cross-cutting concerns
3. Subpath exports for package organization
4. React Query as data-fetching backbone
5. Secure credential storage in Expo

Each pattern is explained with context about when to apply it and why it works. This section is effectively a mini blog post embedded in the architecture document.

**README.md** — Functional but not content-marketing oriented. Covers installation and usage but doesn't tell the "why torosdk-expo" story.

### Gaps

**1. No blog posts (HIGH)**
The Toronet ecosystem needs content to attract builders. The DEVELOPER_STORY.md and ARCHITECTURE.md provide excellent source material for:
- "Building Expo dApps on Toronet: From Zero to Transfer in 15 Minutes"
- "The Strategy Pattern: One SDK, Three Auth Methods"
- "How We Built a Native TCP Module to Bypass Darwin 25's GET+body Restriction" — this is a genuinely interesting engineering story

**2. No video content (MEDIUM)**
A 5-minute "Getting Started" screen recording (CLI init → wrap app → show balances → make transfer) would be compelling. The example app is already built and demo-ready.

**3. No Twitter/X thread content (MEDIUM)**
No thread linking to the repo, explaining the problem space, or showing code snippets. Thread potential:
- "Just shipped torosdk-expo v0.1.6 — Expo SDK 52 wrapper for @Toronet with biometric auth, SecureStore, and TanStack Query hooks. Here's what 15-minute setup looks like: [screenshots]"

**4. No community contribution guide (LOW)**
No `CONTRIBUTING.md` to channel community interest.

**5. No Toronet ecosystem README cross-links (LOW)**
The README doesn't link to torosdk, Toronet docs, or other ecosystem projects. Cross-pollination matters for ecosystem growth.

### Knowledge Sharing Score: 12/20
Strong source material exists (DEVELOPER_STORY, architecture doc) but hasn't been adapted into distributable formats (blog, video, social). The raw content is there — packaging and distribution is the gap.

---

## 6. Ecosystem Impact — C (10%) — Score: 7/10

### Reusability Assessment

**Transferable patterns (high value):**

| Pattern | Reusability | Why it matters |
|---------|-------------|----------------|
| Typed error hierarchy wrapping an untyped SDK | High | Applicable to any Expo/RN wrapper around a JS SDK with poor error handling |
| Auth strategy pattern with modular implementations | High | Directly reusable for any crypto/wallet SDK that needs flexible auth gating |
| Subpath exports for multi-audience packages | Medium | Established npm pattern, but the three-audience split (React/core/CLI) is a clean reference |
| Query key factory with mutation invalidation | High | Reference implementation for any TanStack Query-based SDK |
| SecureStore key-per-wallet pattern | Medium | Specific to Expo but the pattern (scoped keys, lowercase normalization) is transferable |
| Custom axios adapter for GET+body | Medium | Niche but solves a real CFNetwork restriction that affects any Toronet API consumer |
| Native NWConnection raw TCP+TLS module | Medium | iOS-specific but the approach (Network framework for HTTP) is reusable for any API with unusual transport requirements |
| CLI bootstrap with template scaffolding | High | Pattern for any Expo SDK that needs quick project setup |

**Value to future Toronet builders:**

- **Expo compatibility is critical** — Expo is the dominant React Native framework. Without torosdk-expo, Expo developers cannot integrate with Toronet (torosdk's `fetch` usage conflicts with React Native's GET+body restrictions). This SDK unblocks an entire developer segment.

- **Auth flexibility reduces adoption friction** — Password (simplest), Biometric (secure), Custom (anything). A project with existing auth infrastructure can use CustomStrategy without rearchitecting.

- **The CLI is a force multiplier** — 137 lines of Node.js that take a developer from zero to "balances rendering in my app" in minutes. This lowers the activation energy for every new Toronet project.

### Gaps

**1. No example of CustomStrategy integration (LOW)**
The template and example app both default to PasswordStrategy. An example showing CustomStrategy wired to a real auth flow (e.g., a server-side challenge) would help builders with existing auth infrastructure.

**2. No React Native → Expo migration guide (LOW)**
Bare React Native projects that want to use torosdk-expo need to install the Expo modules (`expo-secure-store`, `expo-local-authentication`). A migration guide would capture this audience.

**3. Limited ecosystem discoverability (MEDIUM)**
The package is on npm (implied by version history) but there's no Expo Marketplace listing, no toronet.org integration page, and no "Built with torosdk-expo" showcase.

### Ecosystem Impact Score: 7/10
Strong technical foundations that transfer well. Fills a genuine ecosystem gap (Expo compatibility). Deductions for limited discoverability and missing advanced examples.

---

## 7. Detailed File-by-File Assessment

### Core Layer (`src/core/`)

| File | Quality | Notes |
|------|---------|-------|
| `types.ts` (44 lines) | ⭐⭐⭐⭐⭐ | Clean, minimal, well-scoped. Currency re-export, network union type, operation categories. |
| `errors.ts` (121 lines) | ⭐⭐⭐⭐⭐ | Excellent typed hierarchy. Base class with code/detail/cause. Four subclasses. |
| `config.ts` (76 lines) | ⭐⭐⭐⭐ | Clear singleton pattern. Calls `setupAxiosAdapter()` then `initializeSDK()`. `getConfig()` throws if uninitialized. |
| `storage.ts` (140 lines) | ⭐⭐⭐⭐⭐ | 8 well-scoped functions. Lowercase normalization. Idempotent list operations. Correctly throws StorageError on all failure paths. |
| `auth.ts` (197 lines) | ⭐⭐⭐⭐⭐ | Clean AuthStrategy interface. Three implementations. BiometricStrategy has requireFor/skipFor granularity. |
| `sdk.ts` (418 lines) | ⭐⭐⭐⭐ | 12 exported functions. Consistent try/catch/wrapError pattern. Good JSDoc. Minor: submitKYC uses `as any`. |
| `axios-adapter.ts` (425 lines) | ⭐⭐⭐⭐ | Ingenious solution to a hard problem. Well-documented. Debug logging gated behind ToronetConfig.debug flag (off in production). |
| `index.ts` (89 lines) | ⭐⭐⭐⭐⭐ | Clean barrel with section comments. |

### React Layer (`src/react/`)

| File | Quality | Notes |
|------|---------|-------|
| `provider.tsx` (111 lines) | ⭐⭐⭐⭐ | Clean provider pattern. Sensible QueryClient defaults. `useToronetContext()` throws on misuse. |
| `query-keys.ts` (62 lines) | ⭐⭐⭐⭐⭐ | Well-structured key factory. Typed members. |
| `useBalance.ts` (77 lines) | ⭐⭐⭐⭐ | `useBalance` + `useBalances`. Good enabled/disabled logic. |
| `useTransfer.ts` (57 lines) | ⭐⭐⭐⭐ | Clean mutation with correct invalidation. |
| `useWallets.ts` (124 lines) | ⭐⭐⭐⭐ | Justified use of useState over TanStack Query (DESIGN NOTE explains why). |
| `useWalletMutations.ts` (140 lines) | ⭐⭐⭐⭐ | Auth-gated, persists to SecureStore, invalidates correctly. |
| `useTNS.ts` (92 lines) | ⭐⭐⭐⭐ | Good staleTime (5min). Mutation invalidates both directions. |
| `useKYC.ts` (71 lines) | ⭐⭐⭐⭐ | Clean query + mutation pair. |
| `useExchangeRates.ts` (25 lines) | ⭐⭐⭐⭐⭐ | Simple, focused. |
| `index.ts` (49 lines) | ⭐⭐⭐⭐⭐ | Clean barrel with types re-export. |

### CLI Layer (`src/cli/`)

| File | Quality | Notes |
|------|---------|-------|
| `init.ts` (137 lines) | ⭐⭐⭐⭐ | Well-structured bootstrap. Detects project root, package manager. Scaffolds 3 files. |
| `templates/config.ts.template` (5 lines) | ⭐⭐⭐⭐ | Clean env-var-based configuration. |
| `templates/auth.ts.template` (36 lines) | ⭐⭐⭐⭐⭐ | All 3 options with inline docs. Excellent. |
| `templates/provider.tsx.template` (12 lines) | ⭐⭐⭐⭐ | Simple wrapper combining config + auth. |

### iOS Native (`ios/`)

| File | Quality | Notes |
|------|---------|-------|
| `ToroNetworking.m` (241 lines) | ⭐⭐⭐⭐⭐ | Clean Network framework usage. Block-based async. HTTP response parser. Single responsibility. |
| `torosdk-expo.podspec` (22 lines) | ⭐⭐⭐⭐ | Correct source_files, platform, dependencies. |

### Tests (`__tests__/`)

| File | Quality | Notes |
|------|---------|-------|
| `core/sdk.test.ts` (143 lines) | ⭐⭐⭐⭐ | Covers createWallet, balance, transfer, TNS, KYC, exchange rates. Tests normalization. |
| `core/storage.test.ts` (102 lines) | ⭐⭐⭐⭐ | Covers password, wallet list CRUD, active wallet, edge cases. |
| `core/auth.test.ts` (72 lines) | ⭐⭐⭐⭐ | Tests all 3 strategies, error cases, custom strategy. |
| `react/useBalance.test.tsx` (143 lines) | ⭐⭐⭐⭐ | Tests success, loading, error, disabled, query keys. |
| `react/useTransfer.test.tsx` (155 lines) | ⭐⭐⭐⭐ | Tests args, success, error, idle, pending. |
| `react/useWallets.test.tsx` (206 lines) | ⭐⭐⭐⭐⭐ | Most comprehensive test suite. All CRUD, edge cases, storage keys. |
| `react/provider.test.tsx` (38 lines) | ⭐⭐⭐⭐ | Context provision, outside-provider error. |
| `cli/init.test.ts` (51 lines) | ⭐⭐⭐ | Tests template existence. Could test init logic more deeply. |
| `__mocks__/react-native.ts` (63 lines) | ⭐⭐⭐⭐ | Good minimal mock. |

### Example App (`example/`)

| File | Quality | Notes |
|------|---------|-------|
| `HomeScreen.tsx` (138 lines) | ⭐⭐⭐⭐ | Wallet display, multi-wallet switcher, balance grid. All states covered. |
| `CreateWalletScreen.tsx` (180 lines) | ⭐⭐⭐⭐ | Create/import/delete with tabs. Loading/error/empty states. |
| `TransferScreen.tsx` (135 lines) | ⭐⭐⭐⭐ | Currency picker, live balance, send form. |
| `config.ts` (5 lines) | ⭐⭐⭐⭐ | Clean env-var config. |
| `auth.ts` (36 lines) | ⭐⭐⭐⭐⭐ | All 3 strategies documented. |
| `provider.tsx` (12 lines) | ⭐⭐⭐⭐ | Simple wrapper. |

---

## 8. Consolidated Recommendations

### High Priority (before v1.0.0 release)

1. ~~**Remove or gate `console.log` statements**~~ ✅ **RESOLVED** — Debug flag gating implemented via `ToronetConfig.debug` → `setupAxiosAdapter(debug)` → module-level `_debug` variable. 5 `console.log` calls gated, 2 error-condition `console.warn` calls kept.

2. ~~**Add error logging to `getWalletList()` catch**~~ ❌ **FALSE FINDING** — `getWalletList()` at `storage.ts:71-79` already throws `StorageError('Failed to read wallet list', err)`. No silent failure exists.

3. **Publish at least one blog post** — "Building Expo dApps on Toronet in 15 Minutes" adapted from DEVELOPER_STORY.md. This is the biggest single point impact on the Knowledge Sharing score.

4. **Add a changelog** — `CHANGELOG.md` with v0.1.0 → v0.1.6 entries. The git history has structured commits; this is low-effort.

### Medium Priority (before wider adoption push)

5. **Add CI/CD** — GitHub Actions workflow: `npm ci && npm run typecheck && npm run lint && npm test && npm run build`.

6. **Generate API reference** — TypeDoc or API Extractor from the existing JSDoc. Deploy to GitHub Pages.

7. ~~**Add example app README**~~ ❌ **FALSE FINDING** — `example/README.md` already exists (65 lines) with Quick Start, screen docs, and project structure.

8. **Create a 5-minute screen recording** — CLI init → wrap → show balances → make transfer. Post to YouTube/Twitter.

9. **Tighten `react-native` peer dep** — Change from `"*"` to `">=0.73.0"` to match Expo 52's bundled RN version.

10. **Add `CONTRIBUTING.md`** — How to contribute, test, and build locally.

### Low Priority (nice to have)

11. **Add CustomStrategy example** — In the example app or as a separate example directory.

12. **Add integration smoke test** — Single test that hits testnet.toronet.org to validate end-to-end connectivity.

13. **Add password validation** — Reject empty strings in `setPassword()` and `resolvePassword()`.

14. **Type the example navigation props** — Replace `any` with `NativeStackNavigationProp`.

15. **Commit `eslint.config.mjs`** — It's untracked but appears ready.

---

## 9. Score Summary

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Correctness | 25% | 21/25 | 21.0 |
| Code Quality | 20% | 17/20 | 17.0 |
| Developer Experience | 20% | 18/20 | 18.0 |
| Documentation | 15% | 12/15 | 12.0 |
| Knowledge Sharing (B) | 20% | 12/20 | 12.0 |
| Ecosystem Impact (C) | 10% | 7/10 | 7.0 |
| **Total** | **110%*** | | **87.0/110** |

*\*The evaluation criteria sum to 110% (80% A + 20% B + 10% C). Normalized to 100%:*

| Normalized Score | |
|------------------|------|
| **78/100** | |

### Score Interpretation

- **80-100**: Exceptional — ready for wide promotion with minor refinements
- **60-79**: Strong — solid technical foundation, needs content marketing and minor polish
- **40-59**: Adequate — functional but with significant gaps
- **Below 40**: Needs substantial work

**torosdk-expo scores 78/100 — Strong.** The technical foundation (architecture, code quality, DX, testing) is excellent. The primary gap is in Knowledge Sharing (no blog/video/social content) and Ecosystem Impact (limited discoverability). These are content and distribution problems, not engineering problems — they're fixable without touching a line of code.

---

## 10. Verdict

**torosdk-expo is a well-engineered SDK that's ready for technical adoption.** Developers who find it will have a good experience: the CLI works, the hooks are well-typed, the error handling is predictable, and the example app demonstrates real-world usage. The architecture documentation is exceptional — it explains both the HOW and the WHY, and the "Patterns worth stealing" section makes it valuable even to developers who never touch Toronet.

**The primary gap is visibility.** The package has strong source material for content marketing (DEVELOPER_STORY.md, ARCHITECTURE.md, the example app) but hasn't yet distributed it through channels that reach developers (blog posts, videos, social threads). Addressing this gap would increase both the Knowledge Sharing score and real-world adoption.

**For the Toronet ecosystem**, this SDK fills a critical gap: Expo/React Native developers could not previously integrate with Toronet due to the GET+body fetch restriction. The native NWConnection module is a creative and well-executed solution to this platform limitation, and the custom axios adapter with three-tier graceful degradation is a pattern that other React Native blockchain SDKs could adopt.

---

*Report prepared by automated codebase analysis against Toronet Bounty Evaluation Criteria v1.0.*
