import { Currency, BridgeNetwork } from 'torosdk';

/** Re-export the `Currency` enum from `torosdk` for convenience. */
export { Currency };

/**
 * Re-export the `BridgeNetwork` enum from `torosdk`.
 *
 * @remarks
 * Identifies the external chain a cross-chain bridge operation targets:
 * `Solana` (`'sol'`), `Base` (`'base'`), `Polygon` (`'poly'`),
 * `BSC` (`'bsc'`), `Arbitrum` (`'arb'`), and `Ethereum` (`'eth'`).
 */
export { BridgeNetwork };

/**
 * Optional privileged signer credentials for operations that can be
 * authorized by an admin/relayer rather than the wallet owner alone.
 *
 * @remarks
 * Several `torosdk` bridge and Solana operations accept an optional trailing
 * admin address + password (e.g. to pay gas or authorize on a managed
 * network). Supply this only when the target Toronet deployment requires it;
 * omit it and the operation runs under the wallet's own stored password.
 *
 * @property address - The admin/relayer address.
 * @property password - The admin/relayer password.
 */
export interface AdminCredentials {
  address: string;
  password: string;
}

/**
 * Raw response envelope returned by Toronet bridge, Solana, and swap
 * endpoints.
 *
 * @remarks
 * These `torosdk` functions return loosely-typed payloads whose exact shape
 * varies by endpoint. This interface documents the fields that are commonly
 * present so callers can narrow without reaching for `any`. Additional
 * endpoint-specific fields are accessible via the index signature.
 *
 * @property result - Whether the operation succeeded (present on most write ops).
 * @property message - Human-readable status or error message from the API.
 * @property txid - Transaction id / hash, when the operation produced one.
 */
export interface ToroRawResult {
  result?: boolean;
  message?: string;
  txid?: string;
  [key: string]: unknown;
}

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
  /**
   * Enable verbose debug logging (adapter transport selection, request/response
   * traces, etc.).  Off by default — turn on only during development.
   */
  debug?: boolean;
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
  | 'wallet-delete'
  | 'bridge'
  | 'bridge-read'
  | 'swap'
  | 'swap-read'
  | 'solana-transfer'
  | 'solana-read';
