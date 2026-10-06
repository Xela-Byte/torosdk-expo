/**
 * Machine-readable error codes for the {@link ToroError} hierarchy in @reactforge/react.
 */
export type ToroErrorCode = 'NETWORK' | 'API' | 'AUTH' | 'VALIDATION';

/**
 * Base error class for all @reactforge/react errors.
 */
export class ToroError extends Error {
  public readonly code: ToroErrorCode;
  public readonly detail: string;
  public readonly cause?: unknown;

  constructor(code: ToroErrorCode, detail: string, cause?: unknown) {
    super(`[@reactforge/react] ${detail}`);
    this.name = 'ToroError';
    this.code = code;
    this.detail = detail;
    this.cause = cause;
  }
}

/**
 * Thrown when a network-level failure occurs (timeout, offline, connection refused).
 */
export class NetworkError extends ToroError {
  constructor(detail: string, cause?: unknown) {
    super('NETWORK', detail, cause);
    this.name = 'NetworkError';
  }
}

/**
 * Thrown when the Toronet API returns an error response.
 */
export class APIError extends ToroError {
  public readonly status?: number;

  constructor(detail: string, status?: number, cause?: unknown) {
    super('API', detail, cause);
    this.name = 'APIError';
    this.status = status;
  }
}

/**
 * Normalizes an unknown error into a typed ToroError subclass.
 */
export function wrapError(err: unknown): never {
  if (err instanceof ToroError) {
    throw err;
  }
  if (err instanceof Error) {
    if (err.message.includes('Network') || err.message.includes('fetch') || err.message.includes('timeout')) {
      throw new NetworkError(err.message, err);
    }
    throw new APIError(err.message, undefined, err);
  }
  throw new APIError(String(err));
}
