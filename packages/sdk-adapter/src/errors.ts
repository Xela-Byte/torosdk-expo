export class ToroError extends Error {
  public code: string;
  public operation: string;
  public details: any;

  constructor(message: string, code: string, operation: string, details?: any) {
    super(message);
    this.name = 'ToroError';
    this.code = code;
    this.operation = operation;
    this.details = details;
  }
}

export const normalizeError = (error: any, operation: string): ToroError => {
  let message = 'An unknown error occurred';
  let code = 'UNKNOWN_ERROR';
  
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && error.response && error.response.data) {
    message = error.response.data.error || JSON.stringify(error.response.data);
  } else if (error && error.message) {
    message = error.message;
  }
  
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('insufficient')) {
    code = 'INSUFFICIENT_FUNDS';
  } else if (lowerMsg.includes('password') || lowerMsg.includes('credentials') || lowerMsg.includes('auth')) {
    code = 'INVALID_PASSWORD';
  } else if (lowerMsg.includes('not found') || lowerMsg.includes('unavailable') || lowerMsg.includes('does not exist')) {
    code = 'NOT_FOUND';
  } else if (lowerMsg.includes('taken') || lowerMsg.includes('already exists') || lowerMsg.includes('in use')) {
    code = 'ALREADY_EXISTS';
  } else if (lowerMsg.includes('network') || lowerMsg.includes('timeout') || lowerMsg.includes('econnrefused')) {
    code = 'NETWORK_ERROR';
  } else if (lowerMsg.includes('invalid') || lowerMsg.includes('format')) {
    code = 'INVALID_INPUT';
  } else if (lowerMsg.includes('kyc') || lowerMsg.includes('verify')) {
    code = 'KYC_ERROR';
  } else if (lowerMsg.includes('admin') || lowerMsg.includes('permission') || lowerMsg.includes('unauthorized')) {
    code = 'UNAUTHORIZED';
  }

  return new ToroError(message, code, operation, error);
};
