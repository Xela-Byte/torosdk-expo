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
