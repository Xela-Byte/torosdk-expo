"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPasswordStrategy = createPasswordStrategy;
exports.createBiometricStrategy = createBiometricStrategy;
exports.createCustomStrategy = createCustomStrategy;
exports.setAuthStrategy = setAuthStrategy;
exports.getAuthStrategy = getAuthStrategy;
const LocalAuthentication = __importStar(require("expo-local-authentication"));
const errors_1 = require("./errors");
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
function createPasswordStrategy() {
    return {
        async authorize(_operation) {
            return true;
        },
    };
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
function createBiometricStrategy(options) {
    return {
        async authorize(operation) {
            if (options.skipFor.includes(operation)) {
                return true;
            }
            if (options.requireFor.includes(operation)) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: `Authenticate to ${describeOperation(operation)}`,
                    fallbackLabel: 'Use device passcode',
                });
                if (!result.success) {
                    throw new errors_1.AuthBlockedError(operation, result.error ?? 'Biometric authentication failed');
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
function createCustomStrategy(fn) {
    return {
        async authorize(operation) {
            const allowed = await fn(operation);
            if (!allowed) {
                throw new errors_1.AuthBlockedError(operation, 'Custom auth strategy denied the operation');
            }
            return true;
        },
    };
}
// --- Global auth strategy ---
/** Package-level auth strategy singleton. */
let _authStrategy = null;
/**
 * Register the global auth strategy.
 *
 * @remarks
 * Call once during app setup. {@link ToronetProvider} also calls this
 * automatically if you pass an `authStrategy` prop.
 *
 * @param strategy - The {@link AuthStrategy} to register.
 */
function setAuthStrategy(strategy) {
    _authStrategy = strategy;
}
/**
 * Retrieve the currently registered auth strategy.
 *
 * @throws If {@link setAuthStrategy} has not been called yet.
 * @returns The active {@link AuthStrategy}.
 */
function getAuthStrategy() {
    if (!_authStrategy) {
        throw new Error('[torosdk-expo] Auth strategy not set. Call setAuthStrategy() or use ToronetProvider.');
    }
    return _authStrategy;
}
// --- Helpers ---
/** Map an operation category to a human-readable label for biometric prompts. */
function describeOperation(op) {
    const labels = {
        balance: 'check balances',
        transfer: 'send funds',
        kyc: 'verify identity',
        'tns-read': 'look up names',
        'tns-write': 'register names',
        'exchange-rates': 'view rates',
        'wallet-create': 'create a wallet',
        'wallet-import': 'import a wallet',
        'wallet-verify': 'verify wallet password',
        'wallet-delete': 'delete a wallet',
        bridge: 'bridge tokens across chains',
        'bridge-read': 'view bridge balances',
        swap: 'swap currencies',
        'swap-read': 'view swap rates',
        'solana-transfer': 'send on Solana',
        'solana-read': 'view Solana balances',
        read: 'read blockchain data',
        admin: 'perform admin operation',
    };
    return labels[op] ?? op;
}
//# sourceMappingURL=auth.js.map