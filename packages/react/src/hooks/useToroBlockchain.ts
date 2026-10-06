import { useState, useEffect, useCallback } from 'react';
import {
  getChainStatus,
  getLatestBlock,
  getBlocks,
  getChainTransactions,
  Block,
  BlockchainStatus,
  Transaction,
  ToroError,
} from '@reactforge/sdk-adapter';

// ── useToroBlockchain ──────────────────────────────────────────────────────

export interface BlockchainData {
  status: BlockchainStatus | null;
  latestBlock: Block | null;
  blocks: Block[];
}

export interface UseToroBlockchainResult {
  data: BlockchainData;
  loading: boolean;
  error: ToroError | Error | null;
  refetch: () => Promise<void>;
}

/** Fetch blockchain status, latest block, and recent blocks. */
export const useToroBlockchain = (blockCount: number = 10): UseToroBlockchainResult => {
  const [data, setData] = useState<BlockchainData>({ status: null, latestBlock: null, blocks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ToroError | Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusResult, latestBlockResult, blocksResult] = await Promise.allSettled([
        getChainStatus(),
        getLatestBlock(),
        getBlocks(blockCount),
      ]);
      setData({
        status: statusResult.status === 'fulfilled' ? statusResult.value : null,
        latestBlock: latestBlockResult.status === 'fulfilled' ? latestBlockResult.value : null,
        blocks: blocksResult.status === 'fulfilled' ? (blocksResult.value ?? []) : [],
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [blockCount]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

// ── useToroChainTransactions ───────────────────────────────────────────────

export interface UseToroChainTransactionsResult {
  data: Transaction[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/** Fetch the latest N transactions on the chain. */
export const useToroChainTransactions = (count: number = 20): UseToroChainTransactionsResult => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getChainTransactions(count);
      setData(result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};
