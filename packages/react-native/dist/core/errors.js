"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageError = exports.AuthBlockedError = exports.APIError = exports.NetworkError = exports.ToroError = void 0;
/**
 * Base error class for all torosdk-expo errors.
 *
 * @remarks
 * Every error thrown by this package is an instance of `ToroError`.
 * Use {@link code} for machine-readable dispatch and {@link detail} for
 * human-readable messages.
 *
 * All subclass constructors accept an optional `cause` for error chaining.
 */
class ToroError extends Error {
    constructor(code, detail, cause) {
        super(`[torosdk-expo] ${detail}`);
        this.name = 'ToroError';
        this.code = code;
        this.detail = detail;
        this.cause = cause;
    }
}
exports.ToroError = ToroError;
/**
 * Thrown when a network-level failure occurs (timeout, DNS failure, `fetch` error).
 *
 * @example
 * ```ts
 * try { await makeTransfer(...) }
 * catch (err) {
 *   if (err instanceof NetworkError) showOfflineBanner();
 * }
 * ```
 */
class NetworkError extends ToroError {
    constructor(detail, cause) {
        super('NETWORK', detail, cause);
        this.name = 'NetworkError';
    }
}
exports.NetworkError = NetworkError;
/**
 * Thrown when the Toronet API returns a non-2xx response.
 *
 * @remarks
 * Inspect {@link status} for the HTTP status code (e.g. 400, 429, 500).
 *
 * @example
 * ```ts
 * if (err instanceof APIError && err.status === 400) {
 *   showValidationError(err.detail);
 * }
 * ```
 */
class APIError extends ToroError {
    constructor(detail, status, cause) {
        super('API', detail, cause);
        this.name = 'APIError';
        this.status = status;
    }
}
exports.APIError = APIError;
/**
 * Thrown when an auth strategy denies an operation.
 *
 * @remarks
 * This is thrown when the user cancels biometric authentication or a custom
 * strategy returns `false`. Inspect {@link operation} to determine which
 * operation was blocked.
 *
 * @example
 * ```ts
 * if (err instanceof AuthBlockedError) {
 *   Alert.alert('Authentication required', `Please authenticate to ${err.operation}`);
 * }
 * ```
 */
class AuthBlockedError extends ToroError {
    constructor(operation, detail) {
        super('AUTH_BLOCKED', detail ?? `Auth blocked for operation: ${operation}`);
        this.name = 'AuthBlockedError';
        this.operation = operation;
    }
}
exports.AuthBlockedError = AuthBlockedError;
/**
 * Thrown when a SecureStore read or write operation fails.
 *
 * @remarks
 * This typically indicates the OS keystore is unavailable — check that
 * `expo-secure-store` is properly configured in your `app.json`.
 */
class StorageError extends ToroError {
    constructor(detail, cause) {
        super('STORAGE', detail, cause);
        this.name = 'StorageError';
    }
}
exports.StorageError = StorageError;
//# sourceMappingURL=errors.js.map