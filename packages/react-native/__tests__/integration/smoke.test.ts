/**
 * Integration smoke tests against the Toronet testnet.
 *
 * These tests make real HTTP requests to http://testnet.toronet.org/api.
 *
 * Opt-in — they are skipped by default. To run:
 *   RUN_INTEGRATION=1 npm run test:integration
 *
 * Requirements:
 *   - Network access to testnet.toronet.org
 *   - The testnet API must be reachable
 *
 * @remarks
 * These tests are deliberately lightweight and read-only. They verify
 * connectivity and basic SDK plumbing, not wallet operations.
 */

// Use the real torosdk (no mock) for integration tests.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const torosdk = jest.requireActual('torosdk') as typeof import('torosdk');

import { createConfig, getConfig } from '../../src/core/config';

const RUN_INTEGRATION = process.env.RUN_INTEGRATION === '1';

// Restore original torosdk module after this suite so other test files
// still get the mock.
afterAll(() => {
  jest.resetModules();
});

describe('Integration: Toronet testnet connectivity', () => {
  beforeAll(() => {
    createConfig({ network: 'testnet', debug: false });
  });

  /** Test helper: skip unless RUN_INTEGRATION=1 */
  function integrationTest(name: string, fn: () => Promise<void>): void {
    if (RUN_INTEGRATION) {
      test(name, fn, 15_000); // 15s timeout for network calls
    } else {
      test.skip(`[SKIP — set RUN_INTEGRATION=1] ${name}`, () => {});
    }
  }

  integrationTest('config is initialized for testnet', async () => {
    const cfg = getConfig();
    expect(cfg.network).toBe('testnet');
    expect(cfg.apiBaseUrl).toBeTruthy();
  });

  integrationTest(
    'getSupportedAssetsExchangeRates returns data from testnet',
    async () => {
      const result = await torosdk.getSupportedAssetsExchangeRates();

      // The API should return a non-null, non-empty result.
      expect(result).toBeTruthy();

      if (Array.isArray(result)) {
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty('pair');
        expect(result[0]).toHaveProperty('rate');
      } else if (typeof result === 'object') {
        const keys = Object.keys(result as Record<string, unknown>);
        expect(keys.length).toBeGreaterThan(0);
      }
    }
  );

  integrationTest(
    'getCurrencyBalance returns a response for a known address',
    async () => {
      // A known Toronet testnet address (may have zero balance — that's fine;
      // we're verifying the API responds, not that the balance is non-zero).
      const testAddress = '0x0000000000000000000000000000000000000000';

      const result = await torosdk.getCurrencyBalance({
        currency: (torosdk as { Currency?: { Naira: number } }).Currency?.Naira ?? 0,
        address: testAddress,
      });

      // API should return something — even an error response with a "balance"
      // or "error" field counts as connectivity success.
      expect(result).toBeTruthy();
    }
  );

  integrationTest(
    'getAddr resolves a known TNS name',
    async () => {
      // Try resolving a name — even if it doesn't exist, the API should
      // respond (rather than timing out or throwing a network error).
      try {
        const address = await torosdk.getAddr({ name: 'test.toronet' });
        // Any string response (even empty) means the API is reachable.
        expect(typeof address).toBe('string');
      } catch (err) {
        // A 404 or "not found" is still a valid HTTP response — the API is up.
        // Only fail if it's a genuine network error (fetch/connect failure).
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes('fetch') ||
          msg.includes('Network') ||
          msg.includes('ECONNREFUSED') ||
          msg.includes('ENOTFOUND') ||
          msg.includes('timeout')
        ) {
          throw err;
        }
        // API-level errors (4xx, 5xx, "not found") are fine — the server responded.
      }
    }
  );
});
