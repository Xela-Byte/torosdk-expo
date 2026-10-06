const mockMakeTransfer = jest.fn();

jest.mock('../../src/core/sdk', () => ({
  makeTransfer: ((...args: unknown[]) => mockMakeTransfer(...args)) as typeof mockMakeTransfer,
}));

jest.mock('../../src/core/storage', () => ({
  getPassword: jest.fn().mockResolvedValue('test-password'),
}));

jest.mock('../../src/core/config', () => ({
  getConfig: () => ({ network: 'testnet' as const, apiBaseUrl: 'https://api.testnet.toronet.org' }),
}));

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Currency } from 'torosdk';
import { useTransfer } from '../../src/react/hooks/useTransfer';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useTransfer', () => {
  beforeEach(() => {
    queryClient.clear();
    mockMakeTransfer.mockReset();
  });

  test('calls makeTransfer with correct arguments', async () => {
    mockMakeTransfer.mockResolvedValueOnce({ transactionHash: '0xdone' });

    const { result } = renderHook(() => useTransfer(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        senderAddress: '0xSender',
        receiverAddress: '0xReceiver',
        amount: '100',
        currency: Currency.Naira,
      });
    });

    expect(mockMakeTransfer).toHaveBeenCalledWith(
      '0xSender', '0xReceiver', '100', Currency.Naira
    );
  });

  test('returns transaction hash on success', async () => {
    mockMakeTransfer.mockResolvedValueOnce({ transactionHash: '0xabc123' });

    const { result } = renderHook(() => useTransfer(), { wrapper });

    await act(async () => {
      const data = await result.current.mutateAsync({
        senderAddress: '0xSender',
        receiverAddress: '0xReceiver',
        amount: '50',
        currency: Currency.Dollar,
      });
      expect(data).toEqual({ transactionHash: '0xabc123' });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  test('handles transfer error', async () => {
    mockMakeTransfer.mockRejectedValueOnce(new Error('Insufficient funds'));

    const { result } = renderHook(() => useTransfer(), { wrapper });

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          senderAddress: '0xSender',
          receiverAddress: '0xReceiver',
          amount: '999999',
          currency: Currency.Naira,
        });
      })
    ).rejects.toThrow('Insufficient funds');

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error).toBeDefined();
  });

  test('is in idle state before mutation is triggered', () => {
    const { result } = renderHook(() => useTransfer(), { wrapper });

    expect(result.current.status).toBe('idle');
    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
  });

  test('shows pending state during transfer', async () => {
    // Create a promise we can control
    let resolvePromise!: (value: unknown) => void;
    mockMakeTransfer.mockImplementationOnce(
      () => new Promise((resolve) => { resolvePromise = resolve; })
    );

    const { result } = renderHook(() => useTransfer(), { wrapper });

    // Start the mutation
    let mutatePromise: Promise<unknown>;
    await act(async () => {
      mutatePromise = result.current.mutateAsync({
        senderAddress: '0xSender',
        receiverAddress: '0xReceiver',
        amount: '100',
        currency: Currency.Naira,
      });
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Complete the transfer
    await act(async () => {
      resolvePromise({ transactionHash: '0xdone' });
      await mutatePromise;
    });
  });

  test('uses mutate (fire-and-forget) correctly', async () => {
    mockMakeTransfer.mockResolvedValueOnce({ transactionHash: '0xmutate' });

    const { result } = renderHook(() => useTransfer(), { wrapper });

    await act(async () => {
      result.current.mutate({
        senderAddress: '0xA',
        receiverAddress: '0xB',
        amount: '10',
        currency: Currency.Naira,
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockMakeTransfer).toHaveBeenCalledWith('0xA', '0xB', '10', Currency.Naira);
  });
});
