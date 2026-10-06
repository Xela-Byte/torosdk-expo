import type { OperationCategory } from './types';
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
export declare function createPasswordStrategy(): AuthStrategy;
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
export declare function createBiometricStrategy(options: BiometricStrategyOptions): AuthStrategy;
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
export declare function createCustomStrategy(fn: (operation: OperationCategory) => Promise<boolean>): AuthStrategy;
/**
 * Register the global auth strategy.
 *
 * @remarks
 * Call once during app setup. {@link ToronetProvider} also calls this
 * automatically if you pass an `authStrategy` prop.
 *
 * @param strategy - The {@link AuthStrategy} to register.
 */
export declare function setAuthStrategy(strategy: AuthStrategy): void;
/**
 * Retrieve the currently registered auth strategy.
 *
 * @throws If {@link setAuthStrategy} has not been called yet.
 * @returns The active {@link AuthStrategy}.
 */
export declare function getAuthStrategy(): AuthStrategy;
//# sourceMappingURL=auth.d.ts.map