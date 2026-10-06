import { initializeSDK, getSDKConfig } from 'torosdk';

export type NetworkType = 'mainnet' | 'testnet';

export interface ToroforgeConfig {
  network: NetworkType;
  baseURL?: string;
  connectWURL?: string;
}

let isInitialized = false;

export const initToroforge = (config: ToroforgeConfig) => {
  initializeSDK(config);
  isInitialized = true;
};

export const getConfig = (): any => {
  if (!isInitialized) {
    throw new Error('Toroforge SDK adapter is not initialized. Call initToroforge first.');
  }
  return getSDKConfig();
};
