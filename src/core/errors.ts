export type ToroErrorCode = 'NETWORK' | 'API' | 'AUTH_BLOCKED' | 'STORAGE';

export class ToroError extends Error {
  public readonly code: ToroErrorCode;
  public readonly detail: string;
  public readonly cause?: unknown;

  constructor(code: ToroErrorCode, detail: string, cause?: unknown) {
    super(`[torosdk-expo] ${detail}`);
    this.name = 'ToroError';
    this.code = code;
    this.detail = detail;
    this.cause = cause;
  }
}

export class NetworkError extends ToroError {
  constructor(detail: string, cause?: unknown) {
    super('NETWORK', detail, cause);
    this.name = 'NetworkError';
  }
}

export class APIError extends ToroError {
  public readonly status?: number;

  constructor(detail: string, status?: number, cause?: unknown) {
    super('API', detail, cause);
    this.name = 'APIError';
    this.status = status;
  }
}

export class AuthBlockedError extends ToroError {
  public readonly operation: string;

  constructor(operation: string, detail?: string) {
    super('AUTH_BLOCKED', detail ?? `Auth blocked for operation: ${operation}`);
    this.name = 'AuthBlockedError';
    this.operation = operation;
  }
}

export class StorageError extends ToroError {
  constructor(detail: string, cause?: unknown) {
    super('STORAGE', detail, cause);
    this.name = 'StorageError';
  }
}
