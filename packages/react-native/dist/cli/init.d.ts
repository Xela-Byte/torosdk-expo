#!/usr/bin/env node
/**
 * CLI entry point for `torosdk-expo init`.
 *
 * @remarks
 * This script bootstraps a torosdk integration into an existing Expo
 * project. It performs five sequential steps:
 *
 * 1. **Detect** the Expo project root via `app.json` or `app.config.*`.
 * 2. **Determine** the package manager (npm, yarn, or pnpm).
 * 3. **Install** the required peer dependencies: `torosdk`,
 *    `@tanstack/react-query`, `expo-secure-store`, and
 *    `expo-local-authentication`.
 * 4. **Scaffold** three starter files into `src/torosdk/`:
 *    `config.ts`, `auth.ts`, and `provider.tsx`.
 * 5. **Append** `TOROSDK_NETWORK=testnet` to `.env.example` if the
 *    variable is not already present.
 *
 * After the script finishes, the developer chooses an auth strategy,
 * wraps their app, and can immediately begin using hooks such as
 * {@link useBalance} and {@link useTransfer}.
 *
 * @example
 * ```bash
 * npx torosdk-expo init
 * ```
 *
 * @packageDocumentation
 */
export {};
//# sourceMappingURL=init.d.ts.map