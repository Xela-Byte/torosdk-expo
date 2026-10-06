// ── Address Utilities ─────────────────────────────────────────────────────

/**
 * Format a raw ToroG token amount (removing decimals, applying precision)
 */
export const formatToroAmount = (rawAmount: string | number, decimals: number = 18, displayDecimals: number = 4): string => {
  try {
    const raw = typeof rawAmount === 'string' ? rawAmount : rawAmount.toString();
    if (!raw || raw === '0') return '0.0000';
    const value = parseFloat(raw) / Math.pow(10, decimals);
    return value.toFixed(displayDecimals);
  } catch {
    return '0.0000';
  }
};

/**
 * Format a currency balance with symbol
 */
export const formatToroCurrency = (amount: string | number, currency: string, displayDecimals: number = 2): string => {
  try {
    const value = parseFloat(String(amount));
    if (isNaN(value)) return `0.00 ${currency}`;
    return `${value.toFixed(displayDecimals)} ${currency}`;
  } catch {
    return `0.00 ${currency}`;
  }
};

/**
 * Validate whether a string is a plausible Toronet address (0x-prefixed hex, 42 chars)
 */
export const validateToroAddress = (address: string): boolean => {
  if (!address || typeof address !== 'string') return false;
  return /^0x[0-9a-fA-F]{40}$/.test(address.trim());
};

/**
 * Shorten a Toronet address for display: 0x1234...5678
 */
export const shortenAddress = (address: string, start: number = 6, end: number = 4): string => {
  if (!address || address.length < start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

/**
 * Format a transaction object for display — normalises common field names
 */
export const formatToroTransaction = (tx: any): {
  hash: string;
  from: string;
  to: string;
  amount: string;
  currency: string;
  status: string;
  timestamp: string;
} => {
  return {
    hash: tx?.hash || tx?.txhash || tx?.id || '',
    from: tx?.from || tx?.sender || tx?.senderAddr || '',
    to: tx?.to || tx?.receiver || tx?.receiverAddr || '',
    amount: tx?.value || tx?.amount || tx?.val || '0',
    currency: tx?.currency || tx?.token || 'TORO',
    status: tx?.status || (tx?.result ? 'success' : 'pending'),
    timestamp: tx?.timestamp || tx?.time || '',
  };
};

/**
 * Parse a ToroError or raw error into a user-friendly message
 */
export const parseToroError = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data) return JSON.stringify(error.response.data);
  return 'An unknown error occurred';
};

/**
 * Convert a wei-style big number string to a human-readable value
 */
export const fromWei = (value: string | number, decimals: number = 18): string => {
  try {
    const num = parseFloat(String(value)) / Math.pow(10, decimals);
    return isNaN(num) ? '0' : num.toString();
  } catch {
    return '0';
  }
};

/**
 * Convert a human-readable value to wei-style big number string
 */
export const toWei = (value: string | number, decimals: number = 18): string => {
  try {
    const num = parseFloat(String(value)) * Math.pow(10, decimals);
    return isNaN(num) ? '0' : num.toFixed(0);
  } catch {
    return '0';
  }
};
