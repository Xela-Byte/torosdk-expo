import { Currency } from 'torosdk';

/** Re-export the `Currency` enum from `torosdk` for convenience. */
export { Currency };

/**
 * Supported Toronet network environments.
 *
 * @remarks
 * `'testnet'` uses the sandbox API — ideal for development and testing.
 * `'mainnet'` uses the production Toronet API with real value.
 */
export type ToronetNetwork = 'testnet' | 'mainnet';

/**
 * Package configuration passed to {@link createConfig}.
 *
 * @property network - Which Toronet network to target.
 * @property apiBaseUrl - Optional override for the default API endpoint (useful for custom gateways or proxies).
 */
export interface ToronetConfig {
  network: ToronetNetwork;
  /** Optional: override the default API base URL */
  apiBaseUrl?: string;
}

/**
 * Categories of operations that may require auth gating.
 *
 * @remarks
 * Used by {@link AuthStrategy} implementations to decide which operations
 * need biometric confirmation, password re-entry, or custom approval.
 */
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
