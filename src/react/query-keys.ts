import type { Currency } from '../core/types';

export const queryKeys = {
  all: ['torosdk'] as const,

  balance: (address: string, currency: Currency) =>
    [...queryKeys.all, 'balance', address.toLowerCase(), currency] as const,

  balances: (address: string) =>
    [...queryKeys.all, 'balances', address.toLowerCase()] as const,

  transfer: () =>
    [...queryKeys.all, 'transfer'] as const,

  resolveTNS: (name: string) =>
    [...queryKeys.all, 'tns', 'resolve', name] as const,

  lookupTNS: (address: string) =>
    [...queryKeys.all, 'tns', 'lookup', address.toLowerCase()] as const,

  kycStatus: (address: string) =>
    [...queryKeys.all, 'kyc', address.toLowerCase()] as const,

  exchangeRates: () =>
    [...queryKeys.all, 'exchange-rates'] as const,
};
