const mockAuthenticateAsync = jest.fn();

jest.mock('expo-local-authentication', () => ({
  authenticateAsync: mockAuthenticateAsync,
}));

import {
  createPasswordStrategy,
  createBiometricStrategy,
  createCustomStrategy,
} from '../../src/core/auth';
import { AuthBlockedError } from '../../src/core/errors';

beforeEach(() => {
  mockAuthenticateAsync.mockReset();
});

describe('createPasswordStrategy', () => {
  test('always returns true for any operation', async () => {
    const strategy = createPasswordStrategy();
    await expect(strategy.authorize('balance')).resolves.toBe(true);
    await expect(strategy.authorize('transfer')).resolves.toBe(true);
    await expect(strategy.authorize('wallet-delete')).resolves.toBe(true);
  });
});

describe('createBiometricStrategy', () => {
  const strategy = createBiometricStrategy({
    requireFor: ['transfer', 'kyc'],
    skipFor: ['balance', 'exchange-rates'],
  });

  test('returns true immediately for skipFor operations', async () => {
    await expect(strategy.authorize('balance')).resolves.toBe(true);
    expect(mockAuthenticateAsync).not.toHaveBeenCalled();
  });

  test('calls biometric auth for requireFor operations on success', async () => {
    mockAuthenticateAsync.mockResolvedValueOnce({ success: true });
    await expect(strategy.authorize('transfer')).resolves.toBe(true);
    expect(mockAuthenticateAsync).toHaveBeenCalledTimes(1);
  });

  test('throws AuthBlockedError when biometric fails', async () => {
    mockAuthenticateAsync.mockResolvedValueOnce({ success: false, error: 'user_cancel' });
    await expect(strategy.authorize('transfer')).rejects.toThrow(AuthBlockedError);
  });

  test('defaults to allow for unlisted operations', async () => {
    await expect(strategy.authorize('tns-read')).resolves.toBe(true);
    expect(mockAuthenticateAsync).not.toHaveBeenCalled();
  });
});

describe('createCustomStrategy', () => {
  test('returns true when fn returns true', async () => {
    const strategy = createCustomStrategy(async () => true);
    await expect(strategy.authorize('transfer')).resolves.toBe(true);
  });

  test('throws AuthBlockedError when fn returns false', async () => {
    const strategy = createCustomStrategy(async () => false);
    await expect(strategy.authorize('transfer')).rejects.toThrow(AuthBlockedError);
  });

  test('receives the operation as argument', async () => {
    const fn = jest.fn().mockResolvedValue(true);
    const strategy = createCustomStrategy(fn);
    await strategy.authorize('kyc');
    expect(fn).toHaveBeenCalledWith('kyc');
  });
});
