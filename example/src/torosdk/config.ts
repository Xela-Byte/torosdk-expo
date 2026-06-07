import type { ToronetConfig } from 'torosdk-expo/core';

export const config: ToronetConfig = {
  network: (process.env.TOROSDK_NETWORK as 'testnet' | 'mainnet') ?? 'mainnet',
};
