// Mock the SDK
const mockGetBalanceForCurrency = jest.fn();

jest.mock('../../src/core/sdk', () => ({
  getBalanceForCurrency: ((...args: unknown[]) =>
    mockGetBalanceForCurrency(...args)) as typeof mockGetBalanceForCurrency,
  getBalances: jest.fn(),
}));

jest.mock('../../src/core/storage', () => ({
  getPassword: jest.fn().mockResolvedValue('test-password'),
}));

jest.mock('../../src/core/config', () => ({
  getConfig: () => ({ network: 'testnet' as const, apiBaseUrl: 'https://api.testnet.toronet.org' }),
}));

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Currency } from 'torosdk';
import { useBalance } from '../../src/react/hooks/useBalance';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useBalance', () => {
  beforeEach(() => {
    queryClient.clear();
    mockGetBalanceForCurrency.mockReset();
  });

  test('returns balance data on success', async () => {
    mockGetBalanceForCurrency.mockResolvedValueOnce({ balance: '500', currency: Currency.Naira });

    const { result } = renderHook(
      () => useBalance({ address: '0x123', currency: Currency.Naira }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({ balance: '500', currency: Currency.Naira });
  });

  test('passes address and currency to getBalanceForCurrency', async () => {
    mockGetBalanceForCurrency.mockResolvedValueOnce({ balance: '100', currency: Currency.Dollar });

    renderHook(
      () => useBalance({ address: '0xabc', currency: Currency.Dollar }),
      { wrapper }
    );

    await waitFor(() => {
      expect(mockGetBalanceForCurrency).toHaveBeenCalledWith('0xabc', Currency.Dollar);
    });
  });

  test('shows loading state while fetching', async () => {
    // Don't resolve the promise yet
    mockGetBalanceForCurrency.mockImplementationOnce(
      () => new Promise(() => {})
    );

    const { result } = renderHook(
      () => useBalance({ address: '0x123', currency: Currency.Naira }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isPending).toBe(true);
  });

  test('handles error state', async () => {
    mockGetBalanceForCurrency.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(
      () => useBalance({ address: '0x123', currency: Currency.Naira }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  test('does not fetch when enabled is false', async () => {
    const { result } = renderHook(
      () => useBalance({ address: '0x123', currency: Currency.Naira, enabled: false }),
      { wrapper }
    );

    // Give time for any potential fetch
    await new Promise((r) => setTimeout(r, 50));

    expect(mockGetBalanceForCurrency).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe('idle');
  });

  test('does not fetch when address is empty', async () => {
    renderHook(
      () => useBalance({ address: '', currency: Currency.Naira }),
      { wrapper }
    );

    await new Promise((r) => setTimeout(r, 50));

    expect(mockGetBalanceForCurrency).not.toHaveBeenCalled();
  });

  test('uses the correct query key for caching', async () => {
    mockGetBalanceForCurrency.mockResolvedValue({ balance: '50', currency: Currency.Naira });

    const { result, rerender } = renderHook(
      (props: { address: string; currency: Currency }) =>
        useBalance({ address: props.address, currency: props.currency }),
      { wrapper, initialProps: { address: '0x123', currency: Currency.Naira } }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetBalanceForCurrency).toHaveBeenCalledTimes(1);

    // Re-render with same props should use cached data
    rerender({ address: '0x123', currency: Currency.Naira });

    await new Promise((r) => setTimeout(r, 50));

    // Should not have called again (cached)
    expect(mockGetBalanceForCurrency).toHaveBeenCalledTimes(1);
  });
});
