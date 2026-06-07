import type { Currency } from 'torosdk';

export type { Currency };

export type ToronetNetwork = 'testnet' | 'mainnet';

export interface ToronetConfig {
  network: ToronetNetwork;
  /** Optional: override the default API base URL */
  apiBaseUrl?: string;
}

export type OperationCategory =
  | 'balance'
  | 'transfer'
  | 'kyc'
  | 'tns-read'
  | 'tns-write'
  | 'exchange-rates'
  | 'wallet-create'
  | 'wallet-import'
  | 'wallet-delete';
