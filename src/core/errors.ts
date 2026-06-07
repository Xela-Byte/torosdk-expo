/**
 * Machine-readable error codes for the {@link ToroError} hierarchy.
 *
 * @remarks
 * Use these codes for programmatic error handling without string matching:
 *
 * ```ts
 * if (error instanceof ToroError && error.code === 'AUTH_BLOCKED') { ... }
 * ```
 */
export type ToroErrorCode = 'NETWORK' | 'API' | 'AUTH_BLOCKED' | 'STORAGE';

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
export class ToroError extends Error {
  /** Machine-readable error code (e.g. `'NETWORK'`, `'AUTH_BLOCKED'`). */
  public readonly code: ToroErrorCode;
  /** Human-readable description of the error. */
  public readonly detail: string;
  /** The original underlying error, if any. */
  public readonly cause?: unknown;

  constructor(code: ToroErrorCode, detail: string, cause?: unknown) {
    super(`[torosdk-expo] ${detail}`);
    this.name = 'ToroError';
    this.code = code;
    this.detail = detail;
    this.cause = cause;
  }
}

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
export class NetworkError extends ToroError {
  constructor(detail: string, cause?: unknown) {
    super('NETWORK', detail, cause);
    this.name = 'NetworkError';
  }
}

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
export class APIError extends ToroError {
  /** HTTP status code from the API response, if available. */
  public readonly status?: number;

  constructor(detail: string, status?: number, cause?: unknown) {
    super('API', detail, cause);
    this.name = 'APIError';
    this.status = status;
  }
}

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
export class AuthBlockedError extends ToroError {
  /** The {@link OperationCategory} that was blocked. */
  public readonly operation: string;

  constructor(operation: string, detail?: string) {
    super('AUTH_BLOCKED', detail ?? `Auth blocked for operation: ${operation}`);
    this.name = 'AuthBlockedError';
    this.operation = operation;
  }
}

/**
 * Thrown when a SecureStore read or write operation fails.
 *
 * @remarks
 * This typically indicates the OS keystore is unavailable — check that
 * `expo-secure-store` is properly configured in your `app.json`.
 */
export class StorageError extends ToroError {
  constructor(detail: string, cause?: unknown) {
    super('STORAGE', detail, cause);
    this.name = 'StorageError';
  }
}
