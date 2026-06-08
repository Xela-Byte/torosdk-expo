import { initializeSDK } from 'torosdk';
import type { ToronetConfig, ToronetNetwork } from './types';
import { setupAxiosAdapter } from './axios-adapter';

/** Package-level config singleton — set once during app startup. */
let _config: ToronetConfig | null = null;

/** Default Toronet API endpoints for each network. */
const DEFAULT_API_BASE_URLS: Record<ToronetNetwork, string> = {
  testnet: 'http://testnet.toronet.org/api',
  mainnet: 'https://api.toronet.org',
};

/**
 * Initialize the package configuration.
 *
 * @remarks
 * Must be called **once** before any SDK function or hook is used.
 * {@link ToronetProvider} calls this automatically in a `useEffect` on mount.
 *
 * This also initialises the underlying `torosdk` package via
 * `initializeSDK()`, passing the resolved network and base URL so
 * that `torosdk` calls use the correct Toronet API endpoint.
 *
 * @param config - Network selection and optional API base URL override.
 * @returns The resulting {@link ToronetConfig} object (same reference passed to {@link getConfig}).
 *
 * @example
 * ```ts
 * import { createConfig } from 'torosdk-expo/core';
 * createConfig({ network: 'testnet' });
 * ```
 */
export function createConfig(config: ToronetConfig): ToronetConfig {
  const apiBaseUrl =
    config.apiBaseUrl ?? DEFAULT_API_BASE_URLS[config.network];

  // Patch axios BEFORE any torosdk calls so GET+body requests use
  // XHR instead of fetch (which throws on GET+body per spec).
  setupAxiosAdapter();

  // Initialize the underlying torosdk so its network calls use the
  // correct API endpoint (testnet vs mainnet).
  initializeSDK({
    network: config.network,
    baseURL: apiBaseUrl,
  });

  _config = { network: config.network, apiBaseUrl };
  return _config;
}

/**
 * Retrieve the current package configuration.
 *
 * @throws If {@link createConfig} has not been called yet.
 * @returns The {@link ToronetConfig} set by {@link createConfig}.
 */
export function getConfig(): ToronetConfig {
  if (!_config) {
    throw new Error(
      '[torosdk-expo] Config not initialized. Call createConfig() before using any SDK functions.'
    );
  }
  return _config;
}

/**
 * Resolve the Toronet API base URL from config (or the network default).
 *
 * @returns The fully qualified API base URL string (e.g. `"https://api.testnet.toronet.org"`).
 */
export function getApiBaseUrl(): string {
  return getConfig().apiBaseUrl ?? DEFAULT_API_BASE_URLS[getConfig().network];
}
