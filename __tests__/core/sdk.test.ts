// Mock torosdk
const mockCreateWallet = jest.fn();
const mockGetCurrencyBalance = jest.fn();
const mockMakeInterWalletTransfer = jest.fn();
const mockConfigureTNS = jest.fn();
const mockIsAddressKYCVerified = jest.fn();
const mockGetSupportedAssetsExchangeRates = jest.fn();
const mockImportWalletFromPrivateKeyAndPassword = jest.fn();
const mockVerifyWalletPassword = jest.fn();
const mockGetAddr = jest.fn();

jest.mock('torosdk', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const actual = jest.requireActual('torosdk') as { Currency: unknown };
  return {
    Currency: (actual as { Currency: Record<string, string> }).Currency,
    createWallet: mockCreateWallet,
    getCurrencyBalance: mockGetCurrencyBalance,
    makeInterWalletTransfer: mockMakeInterWalletTransfer,
    configureTNS: mockConfigureTNS,
    isAddressKYCVerified: mockIsAddressKYCVerified,
    getSupportedAssetsExchangeRates: mockGetSupportedAssetsExchangeRates,
    importWalletFromPrivateKeyAndPassword: mockImportWalletFromPrivateKeyAndPassword,
    verifyWalletPassword: mockVerifyWalletPassword,
    getAddr: mockGetAddr,
  };
});

// Mock auth strategy and storage
const mockAuthorize = jest.fn();
const mockGetPassword = jest.fn();

jest.mock('../../src/core/auth', () => ({
  getAuthStrategy: () => ({ authorize: mockAuthorize }),
  setAuthStrategy: jest.fn(),
}));

jest.mock('../../src/core/storage', () => ({
  getPassword: (...args: unknown[]) => mockGetPassword(...args),
  setPassword: jest.fn(),
  addWalletToList: jest.fn(),
  setActiveWallet: jest.fn(),
}));

jest.mock('../../src/core/config', () => ({
  getConfig: () => ({ network: 'testnet', apiBaseUrl: 'https://api.testnet.toronet.org' }),
  createConfig: jest.fn(),
}));

import {
  createWallet,
  getBalanceForCurrency,
  makeTransfer,
  resolveTNS,
  getKYCStatus,
  getExchangeRates,
} from '../../src/core/sdk';
import { Currency } from 'torosdk';
import { NetworkError } from '../../src/core/errors';

beforeEach(() => {
  jest.clearAllMocks();
  mockAuthorize.mockResolvedValue(true);
  mockGetPassword.mockResolvedValue('test-password');
});

describe('createWallet', () => {
  test('returns address on success', async () => {
    mockCreateWallet.mockResolvedValueOnce('0x123');
    const result = await createWallet('user1', 'secret');
    expect(result).toBe('0x123');
    expect(mockCreateWallet).toHaveBeenCalledWith({ username: 'user1', password: 'secret' });
  });

  test('wraps network errors', async () => {
    mockCreateWallet.mockRejectedValueOnce(new Error('Network Error'));
    await expect(createWallet('user1', 'secret')).rejects.toThrow(NetworkError);
  });
});

describe('getBalanceForCurrency', () => {
  test('authorizes and returns balance', async () => {
    mockGetCurrencyBalance.mockResolvedValueOnce('1500.50');
    const result = await getBalanceForCurrency('0xABC', Currency.Naira);
    expect(mockAuthorize).toHaveBeenCalledWith('balance');
    expect(mockGetCurrencyBalance).toHaveBeenCalledWith({ currency: Currency.Naira, address: '0xABC' });
    expect(result).toEqual({ balance: '1500.50', currency: Currency.Naira });
  });
});

describe('makeTransfer', () => {
  test('authorizes, gets password, and transfers', async () => {
    mockMakeInterWalletTransfer.mockResolvedValueOnce({ transactionHash: '0xhash' });
    const result = await makeTransfer('0xSender', '0xReceiver', '100', Currency.Naira);
    expect(mockAuthorize).toHaveBeenCalledWith('transfer');
    expect(mockGetPassword).toHaveBeenCalledWith('0xSender');
    expect(mockMakeInterWalletTransfer).toHaveBeenCalledWith(
      '0xSender', 'test-password', '0xReceiver', '100', Currency.Naira
    );
    expect(result).toEqual({ transactionHash: '0xhash' });
  });
});

describe('resolveTNS', () => {
  test('resolves name to address', async () => {
    mockGetAddr.mockResolvedValueOnce('0xResolved');
    const result = await resolveTNS('alice.toronet');
    expect(mockGetAddr).toHaveBeenCalledWith({ name: 'alice.toronet' });
    expect(result).toBe('0xResolved');
  });
});

describe('getKYCStatus', () => {
  test('returns verified status', async () => {
    mockIsAddressKYCVerified.mockResolvedValueOnce(true);
    const result = await getKYCStatus('0xABC');
    expect(mockIsAddressKYCVerified).toHaveBeenCalledWith({ address: '0xABC' });
    expect(result).toEqual({ verified: true });
  });
});

describe('getExchangeRates', () => {
  test('normalizes object result to array', async () => {
    mockGetSupportedAssetsExchangeRates.mockResolvedValueOnce({
      'NGN/USD': 0.0012,
      'NGN/EUR': 0.0010,
    });
    const result = await getExchangeRates();
    expect(mockAuthorize).toHaveBeenCalledWith('exchange-rates');
    expect(result).toEqual([
      { pair: 'NGN/USD', rate: 0.0012 },
      { pair: 'NGN/EUR', rate: 0.0010 },
    ]);
  });

  test('returns array as-is', async () => {
    mockGetSupportedAssetsExchangeRates.mockResolvedValueOnce([
      { pair: 'NGN/USD', rate: 0.0012 },
    ]);
    const result = await getExchangeRates();
    expect(result).toEqual([{ pair: 'NGN/USD', rate: 0.0012 }]);
  });
});
