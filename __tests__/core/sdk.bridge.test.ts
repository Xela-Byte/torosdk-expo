// Mock torosdk bridge/solana/swap surface
const mockBridgeTokenFromChain = jest.fn();
const mockGetBridgeTokenFeeEstimate = jest.fn();
const mockGetBridgeBalance = jest.fn();
const mockGetBridgeTokenBalance = jest.fn();
const mockGetBridgeTransactions = jest.fn();
const mockGetBridgeTokenTransactions = jest.fn();
const mockCreateSolanaAddress = jest.fn();
const mockCreateToronetSolanaAddress = jest.fn();
const mockIsValidSolanaAddress = jest.fn();
const mockTransferSolana = jest.fn();
const mockTransferSolToken = jest.fn();
const mockGetSolBalance = jest.fn();
const mockGetSolTokenBalance = jest.fn();
const mockGetSolTransactions = jest.fn();
const mockGetSolTokenTransactions = jest.fn();
const mockGetSwapQuote = jest.fn();
const mockSwapCurrency = jest.fn();

jest.mock('torosdk', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const actual = jest.requireActual('torosdk') as { Currency: unknown; BridgeNetwork: unknown };
  return {
    Currency: actual.Currency,
    BridgeNetwork: actual.BridgeNetwork,
    bridgeTokenFromChain: mockBridgeTokenFromChain,
    getBridgeTokenFeeEstimate: mockGetBridgeTokenFeeEstimate,
    getBridgeBalance: mockGetBridgeBalance,
    getBridgeTokenBalance: mockGetBridgeTokenBalance,
    getBridgeTransactions: mockGetBridgeTransactions,
    getBridgeTokenTransactions: mockGetBridgeTokenTransactions,
    createSolanaAddress: mockCreateSolanaAddress,
    createToronetSolanaAddress: mockCreateToronetSolanaAddress,
    isValidSolanaAddress: mockIsValidSolanaAddress,
    transferSolana: mockTransferSolana,
    transferSolToken: mockTransferSolToken,
    getSolBalance: mockGetSolBalance,
    getSolTokenBalance: mockGetSolTokenBalance,
    getSolTransactions: mockGetSolTransactions,
    getSolTokenTransactions: mockGetSolTokenTransactions,
    getSwapQuote: mockGetSwapQuote,
    swapCurrency: mockSwapCurrency,
  };
});

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
  bridgeToken,
  getBridgeTokenFee,
  getBridgeBalance,
  createSolanaAddress,
  transferSolana,
  getSolBalance,
  getSwapQuote,
  executeSwap,
} from '../../src/core/sdk';
import { BridgeNetwork } from 'torosdk';
import { NetworkError, APIError } from '../../src/core/errors';

beforeEach(() => {
  jest.clearAllMocks();
  mockAuthorize.mockResolvedValue(true);
  mockGetPassword.mockResolvedValue('stored-pwd');
});

describe('bridgeToken', () => {
  test('resolves password, gates on bridge, and maps params to torosdk shape', async () => {
    mockBridgeTokenFromChain.mockResolvedValueOnce({ result: true, txid: '0xabc' });

    const res = await bridgeToken({
      from: '0xSender',
      network: BridgeNetwork.Base,
      contractAddress: '0xToken',
      tokenName: 'USDC',
      amount: '25',
    });

    expect(mockAuthorize).toHaveBeenCalledWith('bridge');
    expect(mockGetPassword).toHaveBeenCalledWith('0xSender');
    expect(mockBridgeTokenFromChain).toHaveBeenCalledWith(
      BridgeNetwork.Base,
      {
        from: '0xSender',
        pwd: 'stored-pwd',
        network: BridgeNetwork.Base,
        contractaddress: '0xToken',
        tokenname: 'USDC',
        amount: '25',
      },
      undefined,
      undefined
    );
    expect(res).toEqual({ result: true, txid: '0xabc' });
  });

  test('forwards admin credentials as trailing args when provided', async () => {
    mockBridgeTokenFromChain.mockResolvedValueOnce({ result: true });
    await bridgeToken({
      from: '0xSender',
      network: BridgeNetwork.Base,
      contractAddress: '0xToken',
      tokenName: 'USDC',
      amount: '25',
      admin: { address: '0xAdmin', password: 'admin-pwd' },
    });
    expect(mockBridgeTokenFromChain).toHaveBeenCalledWith(
      BridgeNetwork.Base,
      expect.objectContaining({ from: '0xSender', pwd: 'stored-pwd' }),
      '0xAdmin',
      'admin-pwd'
    );
  });

  test('throws when no stored password exists', async () => {
    mockGetPassword.mockResolvedValueOnce(undefined);
    await expect(
      bridgeToken({
        from: '0xSender',
        network: BridgeNetwork.Base,
        contractAddress: '0xToken',
        tokenName: 'USDC',
        amount: '25',
      })
    ).rejects.toThrow();
    expect(mockBridgeTokenFromChain).not.toHaveBeenCalled();
  });
});

describe('bridge reads', () => {
  test('getBridgeTokenFee gates on bridge-read and passes network + params', async () => {
    mockGetBridgeTokenFeeEstimate.mockResolvedValueOnce({ result: true, fee: '0.5' });
    const res = await getBridgeTokenFee({
      network: BridgeNetwork.Polygon,
      contractAddress: '0xToken',
      amount: '10',
    });
    expect(mockAuthorize).toHaveBeenCalledWith('bridge-read');
    expect(mockGetBridgeTokenFeeEstimate).toHaveBeenCalledWith(BridgeNetwork.Polygon, {
      network: BridgeNetwork.Polygon,
      contractaddress: '0xToken',
      amount: '10',
    });
    expect(res).toEqual({ result: true, fee: '0.5' });
  });

  test('getBridgeBalance wraps a network failure as NetworkError', async () => {
    mockGetBridgeBalance.mockRejectedValueOnce(new Error('Network request failed'));
    await expect(
      getBridgeBalance({ address: '0xA', network: BridgeNetwork.BSC })
    ).rejects.toThrow(NetworkError);
  });

  test('getBridgeBalance wraps a 4xx as APIError', async () => {
    mockGetBridgeBalance.mockRejectedValueOnce(Object.assign(new Error('bad request'), { status: 400 }));
    await expect(
      getBridgeBalance({ address: '0xA', network: BridgeNetwork.BSC })
    ).rejects.toThrow(APIError);
  });
});

describe('solana', () => {
  test('createSolanaAddress gates on wallet-create', async () => {
    mockCreateSolanaAddress.mockResolvedValueOnce({ result: true, address: 'SoL111' });
    const res = await createSolanaAddress();
    expect(mockAuthorize).toHaveBeenCalledWith('wallet-create');
    expect(res).toEqual({ result: true, address: 'SoL111' });
  });

  test('transferSolana resolves password and gates on solana-transfer', async () => {
    mockTransferSolana.mockResolvedValueOnce({ result: true, txid: 'sig' });
    await transferSolana({ from: 'SoLFrom', to: 'SoLTo', amount: '1.5' });
    expect(mockAuthorize).toHaveBeenCalledWith('solana-transfer');
    expect(mockGetPassword).toHaveBeenCalledWith('SoLFrom');
    expect(mockTransferSolana).toHaveBeenCalledWith(
      {
        from: 'SoLFrom',
        to: 'SoLTo',
        amount: '1.5',
        pwd: 'stored-pwd',
      },
      undefined,
      undefined
    );
  });

  test('transferSolana forwards admin credentials when provided', async () => {
    mockTransferSolana.mockResolvedValueOnce({ result: true });
    await transferSolana({
      from: 'SoLFrom',
      to: 'SoLTo',
      amount: '1.5',
      admin: { address: 'AdminAddr', password: 'admin-pwd' },
    });
    expect(mockTransferSolana).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'SoLFrom', pwd: 'stored-pwd' }),
      'AdminAddr',
      'admin-pwd'
    );
  });

  test('getSolBalance gates on solana-read', async () => {
    mockGetSolBalance.mockResolvedValueOnce({ result: true, balance: '2' });
    await getSolBalance({ address: 'SoLAddr' });
    expect(mockAuthorize).toHaveBeenCalledWith('solana-read');
    expect(mockGetSolBalance).toHaveBeenCalledWith({ address: 'SoLAddr', network: undefined });
  });
});

describe('swap', () => {
  test('getSwapQuote gates on swap-read and forwards params', async () => {
    mockGetSwapQuote.mockResolvedValueOnce({ result: true, convertedAmount: 5, rate: 0.005 });
    const res = await getSwapQuote({ fromCurrency: 'naira', toCurrency: 'dollar', amount: 1000 });
    expect(mockAuthorize).toHaveBeenCalledWith('swap-read');
    expect(mockGetSwapQuote).toHaveBeenCalledWith({
      fromCurrency: 'naira',
      toCurrency: 'dollar',
      amount: 1000,
    });
    expect(res).toMatchObject({ convertedAmount: 5 });
  });

  test('executeSwap resolves client password and gates on swap', async () => {
    mockSwapCurrency.mockResolvedValueOnce({ result: true });
    await executeSwap({ fromCurrency: 'naira', toCurrency: 'dollar', amount: 1000, client: '0xC' });
    expect(mockAuthorize).toHaveBeenCalledWith('swap');
    expect(mockGetPassword).toHaveBeenCalledWith('0xC');
    expect(mockSwapCurrency).toHaveBeenCalledWith({
      fromCurrency: 'naira',
      toCurrency: 'dollar',
      amount: 1000,
      client: '0xC',
      clientPassword: 'stored-pwd',
    });
  });
});
