import type { ToronetConfig } from './types';
/**
 * Initialize the package configuration.
 *
 * @remarks
 * Must be called **once** before any SDK function or hook is used.
 * {@link ToronetProvider} calls this automatically in a `useEffect` on mount.
 *
 * This also initialises the underlying `@reactforge/sdk-adapter` package via
 * `initToroforge()`, passing the resolved network and base URL so
 * that calls use the correct Toronet API endpoint.
 *
 * @param config - Network selection and optional API base URL override.
 * @returns The resulting {@link ToronetConfig} object (same reference passed to {@link getConfig}).
 *
 * @example
 * ```ts
 * import { createConfig } from '@reactforge/react-native/core';
 * createConfig({ network: 'testnet' });
 * ```
 */
export declare function createConfig(config: ToronetConfig): ToronetConfig;
/**
 * Retrieve the current package configuration.
 *
 * @throws If {@link createConfig} has not been called yet.
 * @returns The {@link ToronetConfig} set by {@link createConfig}.
 */
export declare function getConfig(): ToronetConfig;
/**
 * Resolve the Toronet API base URL from config (or the network default).
 *
 * @returns The fully qualified API base URL string (e.g. `"https://api.testnet.toronet.org"`).
 */
export declare function getApiBaseUrl(): string;
//# sourceMappingURL=config.d.ts.map