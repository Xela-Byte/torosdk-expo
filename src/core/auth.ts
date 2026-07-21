import * as LocalAuthentication from 'expo-local-authentication';
import type { OperationCategory } from './types';
import { AuthBlockedError } from './errors';

/**
 * Pluggable auth strategy for gating sensitive wallet operations.
 *
 * @remarks
 * Create one of the built-in strategies via the factory functions below,
 * or implement this interface directly for full control.
 *
 * @see {@link createPasswordStrategy}
 * @see {@link createBiometricStrategy}
 * @see {@link createCustomStrategy}
 */
export interface AuthStrategy {
  /**
   * Authorize a specific operation.
   *
   * @param operation - Which {@link OperationCategory} is being performed.
   * @returns `true` if the operation is allowed.
   * @throws {@link AuthBlockedError} if the operation should be denied.
   */
  authorize(operation: OperationCategory): Promise<boolean>;
}

// --- Password strategy (always allow) ---

/**
 * Create a "password" auth strategy that silently allows all operations.
 *
 * @remarks
 * This is the default when using the password flow. The wallet password is
 * still required for sensitive operations (transfer, KYC, TNS writes), but
 * no additional user interaction is needed beyond what the SDK already does.
 *
 * @example
 * ```ts
 * import { setAuthStrategy, createPasswordStrategy } from 'torosdk-expo/core';
 * setAuthStrategy(createPasswordStrategy());
 * ```
 */
export function createPasswordStrategy(): AuthStrategy {
  return {
    async authorize(_operation: OperationCategory): Promise<boolean> {
      return true;
    },
  };
}

// --- Biometric strategy ---

/**
 * Configuration for {@link createBiometricStrategy}.
 *
 * @property requireFor - Operations that MUST pass biometric auth.
 * @property skipFor - Operations that bypass biometric auth entirely.
 *   Unlisted operations default to allow.
 */
export interface BiometricStrategyOptions {
  requireFor: OperationCategory[];
  skipFor: OperationCategory[];
}

/**
 * Create a biometric auth strategy using `expo-local-authentication`.
 *
 * @remarks
 * Operations listed in {@link BiometricStrategyOptions.requireFor} will
 * trigger a fingerprint / Face ID prompt. Operations in `skipFor` bypass
 * biometric auth entirely. Operations not listed in either array default
 * to allow.
 *
 * @param options - Which operations require or skip biometric auth.
 * @throws {@link AuthBlockedError} if the user cancels or fails biometric auth.
 *
 * @example
 * ```ts
 * import { setAuthStrategy, createBiometricStrategy } from 'torosdk-expo/core';
 *
 * setAuthStrategy(createBiometricStrategy({
 *   requireFor: ['transfer', 'wallet-delete'],
 *   skipFor: ['balance', 'exchange-rates'],
 * }));
 * ```
 */
export function createBiometricStrategy(options: BiometricStrategyOptions): AuthStrategy {
  return {
    async authorize(operation: OperationCategory): Promise<boolean> {
      if (options.skipFor.includes(operation)) {
        return true;
      }
      if (options.requireFor.includes(operation)) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: `Authenticate to ${describeOperation(operation)}`,
          fallbackLabel: 'Use device passcode',
        });
        if (!result.success) {
          throw new AuthBlockedError(operation, result.error ?? 'Biometric authentication failed');
        }
        return true;
      }
      // Operation not listed in either — default to allow
      return true;
    },
  };
}

// --- Custom strategy ---

/**
 * Create a fully custom auth strategy using a user-provided authorize function.
 *
 * @remarks
 * Use this for custom auth flows — e.g. a server-side approval check,
 * a PIN-code modal, or a multi-signature gate. The function receives the
 * operation category and must return `true` to allow or throw
 * {@link AuthBlockedError} to deny.
 *
 * @param fn - Async function that returns `true` to allow the operation.
 *   Returning `false` causes an {@link AuthBlockedError} to be thrown.
 *
 * @example
 * ```ts
 * import { setAuthStrategy, createCustomStrategy } from 'torosdk-expo/core';
 *
 * setAuthStrategy(createCustomStrategy(async (op) => {
 *   const confirmed = await showCustomPinModal(op);
 *   return confirmed; // false → throws AuthBlockedError
 * }));
 * ```
 */
export function createCustomStrategy(
  fn: (operation: OperationCategory) => Promise<boolean>
): AuthStrategy {
  return {
    async authorize(operation: OperationCategory): Promise<boolean> {
      const allowed = await fn(operation);
      if (!allowed) {
        throw new AuthBlockedError(operation, 'Custom auth strategy denied the operation');
      }
      return true;
    },
  };
}

// --- Global auth strategy ---

/** Package-level auth strategy singleton. */
let _authStrategy: AuthStrategy | null = null;

/**
 * Register the global auth strategy.
 *
 * @remarks
 * Call once during app setup. {@link ToronetProvider} also calls this
 * automatically if you pass an `authStrategy` prop.
 *
 * @param strategy - The {@link AuthStrategy} to register.
 */
export function setAuthStrategy(strategy: AuthStrategy): void {
  _authStrategy = strategy;
}

/**
 * Retrieve the currently registered auth strategy.
 *
 * @throws If {@link setAuthStrategy} has not been called yet.
 * @returns The active {@link AuthStrategy}.
 */
export function getAuthStrategy(): AuthStrategy {
  if (!_authStrategy) {
    throw new Error(
      '[torosdk-expo] Auth strategy not set. Call setAuthStrategy() or use ToronetProvider.'
    );
  }
  return _authStrategy;
}

// --- Helpers ---

/** Map an operation category to a human-readable label for biometric prompts. */
function describeOperation(op: OperationCategory): string {
  const labels: Record<OperationCategory, string> = {
    balance: 'check balances',
    transfer: 'send funds',
    kyc: 'verify identity',
    'tns-read': 'look up names',
    'tns-write': 'register names',
    'exchange-rates': 'view rates',
    'wallet-create': 'create a wallet',
    'wallet-import': 'import a wallet',
    'wallet-delete': 'delete a wallet',
    bridge: 'bridge tokens across chains',
    'bridge-read': 'view bridge balances',
    swap: 'swap currencies',
    'swap-read': 'view swap rates',
    'solana-transfer': 'send on Solana',
    'solana-read': 'view Solana balances',
  };
  return labels[op] ?? op;
}
