// Mock SecureStore so that storage.ts calls are intercepted
const mockStore: Record<string, string> = {
  torosdk_wallets: JSON.stringify(['0xaaa', '0xbbb']),
  torosdk_active_wallet: '0xaaa',
};

const mockGetItemAsync = jest.fn(async (key: string) => mockStore[key] ?? null);
const mockSetItemAsync = jest.fn(async (key: string, value: string) => {
  mockStore[key] = value;
});
const mockDeleteItemAsync = jest.fn(async (key: string) => {
  delete mockStore[key];
});

jest.mock('expo-secure-store', () => ({
  getItemAsync: mockGetItemAsync,
  setItemAsync: mockSetItemAsync,
  deleteItemAsync: mockDeleteItemAsync,
}));

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWallets } from '../../src/react/hooks/useWallets';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useWallets', () => {
  beforeEach(() => {
    mockStore['torosdk_wallets'] = JSON.stringify(['0xaaa', '0xbbb']);
    mockStore['torosdk_active_wallet'] = '0xaaa';
    queryClient.clear();
  });

  afterEach(() => {
    delete mockStore['torosdk_wallets'];
    delete mockStore['torosdk_active_wallet'];
  });

  test('loads wallets from storage on mount', async () => {
    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.all).toEqual(['0xaaa', '0xbbb']);
    expect(result.current.active).toBe('0xaaa');
    expect(result.current.error).toBeNull();
  });

  test('starts with loading state true', () => {
    const { result } = renderHook(() => useWallets(), { wrapper });

    // Before the async effect resolves, loading should be true
    expect(result.current.isLoading).toBe(true);
    expect(result.current.all).toEqual([]);
    expect(result.current.active).toBeNull();
  });

  test('handles empty wallet list', async () => {
    mockStore['torosdk_wallets'] = JSON.stringify([]);
    mockStore['torosdk_active_wallet'] = '';

    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.all).toEqual([]);
    expect(result.current.active).toBe('');
  });

  test('switchWallet updates active wallet via storage', async () => {
    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.switchWallet('0xbbb');
    });

    expect(result.current.active).toBe('0xbbb');
    expect(mockStore['torosdk_active_wallet']).toBe('0xbbb');
  });

  test('switchWallet throws and sets error on storage failure', async () => {
    mockSetItemAsync.mockRejectedValueOnce(new Error('Unauthorized'));

    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.switchWallet('0xccc');
      })
    ).rejects.toThrow();

    // Active wallet should remain unchanged
    expect(result.current.active).toBe('0xaaa');
  });

  test('addWallet adds a new wallet and refreshes the list', async () => {
    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addWallet('0xccc');
    });

    expect(result.current.all).toContain('0xccc');
    // The original wallets should still be there
    expect(result.current.all).toEqual(['0xaaa', '0xbbb', '0xccc']);
  });

  test('addWallet does not duplicate existing wallets', async () => {
    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addWallet('0xaaa');
    });

    // Should still only have 2 entries (no duplicate)
    expect(result.current.all).toEqual(['0xaaa', '0xbbb']);
  });

  test('removeWallet removes a wallet and refreshes the list', async () => {
    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.removeWallet('0xaaa');
    });

    expect(result.current.all).toEqual(['0xbbb']);
    expect(result.current.all).not.toContain('0xaaa');
  });

  test('removeWallet on non-existent address does not change the list', async () => {
    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.removeWallet('0xzzz');
    });

    expect(result.current.all).toEqual(['0xaaa', '0xbbb']);
  });

  test('refresh reloads wallets from storage', async () => {
    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Manually update storage
    mockStore['torosdk_wallets'] = JSON.stringify(['0x111', '0x222']);
    mockStore['torosdk_active_wallet'] = '0x111';

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.all).toEqual(['0x111', '0x222']);
    expect(result.current.active).toBe('0x111');
  });

  test('getItemAsync is called with correct keys on mount', async () => {
    mockGetItemAsync.mockClear();

    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetItemAsync).toHaveBeenCalledWith('torosdk_wallets');
    expect(mockGetItemAsync).toHaveBeenCalledWith('torosdk_active_wallet');
  });
});
