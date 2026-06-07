// Mock expo-secure-store before importing the module under test
const mockStore: Record<string, string> = {};

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (key: string) => mockStore[key] ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockStore[key] = value;
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    delete mockStore[key];
  }),
}));

import {
  getPassword,
  setPassword,
  deletePassword,
  getWalletList,
  addWalletToList,
  removeWalletFromList,
  getActiveWallet,
  setActiveWallet,
} from '../../src/core/storage';

beforeEach(() => {
  Object.keys(mockStore).forEach((k) => delete mockStore[k]);
});

describe('password storage', () => {
  const addr = '0xAbCdEf1234567890';

  test('setPassword stores at the correct key', async () => {
    await setPassword(addr, 'mysecret');
    expect(mockStore['wallet_pwd_0xabcdef1234567890']).toBe('mysecret');
  });

  test('getPassword returns null when not stored', async () => {
    const result = await getPassword(addr);
    expect(result).toBeNull();
  });

  test('getPassword returns stored password', async () => {
    await setPassword(addr, 'mysecret');
    const result = await getPassword(addr);
    expect(result).toBe('mysecret');
  });

  test('deletePassword removes the password', async () => {
    await setPassword(addr, 'mysecret');
    await deletePassword(addr);
    const result = await getPassword(addr);
    expect(result).toBeNull();
  });

  test('addresses are normalized to lowercase', async () => {
    await setPassword('0xABCDEF', 'pw');
    const result = await getPassword('0xabcdef');
    expect(result).toBe('pw');
  });
});

describe('wallet list', () => {
  test('getWalletList returns empty array when nothing stored', async () => {
    const result = await getWalletList();
    expect(result).toEqual([]);
  });

  test('addWalletToList adds normalized address', async () => {
    await addWalletToList('0xABC');
    await addWalletToList('0xDEF');
    const list = await getWalletList();
    expect(list).toEqual(['0xabc', '0xdef']);
  });

  test('addWalletToList does not duplicate', async () => {
    await addWalletToList('0xABC');
    await addWalletToList('0xabc');
    const list = await getWalletList();
    expect(list).toEqual(['0xabc']);
  });

  test('removeWalletFromList removes the address', async () => {
    await addWalletToList('0xAAA');
    await addWalletToList('0xBBB');
    await removeWalletFromList('0xaaa');
    const list = await getWalletList();
    expect(list).toEqual(['0xbbb']);
  });
});

describe('active wallet', () => {
  test('getActiveWallet returns null when not set', async () => {
    const result = await getActiveWallet();
    expect(result).toBeNull();
  });

  test('setActiveWallet and getActiveWallet roundtrip', async () => {
    await setActiveWallet('0x123');
    const result = await getActiveWallet();
    expect(result).toBe('0x123');
  });
});
