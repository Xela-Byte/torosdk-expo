import * as LocalAuthentication from 'expo-local-authentication';
import type { OperationCategory } from './types';
import { AuthBlockedError } from './errors';

export interface AuthStrategy {
  authorize(operation: OperationCategory): Promise<boolean>;
}

// --- Password strategy (always allow) ---

export function createPasswordStrategy(): AuthStrategy {
  return {
    async authorize(_operation: OperationCategory): Promise<boolean> {
      return true;
    },
  };
}

// --- Biometric strategy ---

export interface BiometricStrategyOptions {
  requireFor: OperationCategory[];
  skipFor: OperationCategory[];
}

export function createBiometricStrategy(options: BiometricStrategyOptions): AuthStrategy {
  return {
    async authorize(operation: OperationCategory): Promise<boolean> {
      if (options.skipFor.includes(operation)) {
        return true;
      }
      if (options.requireFor.includes(operation)) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: `Authenticate to ${describeOperation(operation)}`,
          fallbackLabel: 'Use device passcode',
        });
        if (!result.success) {
          throw new AuthBlockedError(operation, result.error ?? 'Biometric authentication failed');
        }
        return true;
      }
      // Operation not listed in either — default to allow
      return true;
    },
  };
}

// --- Custom strategy ---

export function createCustomStrategy(
  fn: (operation: OperationCategory) => Promise<boolean>
): AuthStrategy {
  return {
    async authorize(operation: OperationCategory): Promise<boolean> {
      const allowed = await fn(operation);
      if (!allowed) {
        throw new AuthBlockedError(operation, 'Custom auth strategy denied the operation');
      }
      return true;
    },
  };
}

// --- Helpers ---

function describeOperation(op: OperationCategory): string {
  const labels: Record<OperationCategory, string> = {
    balance: 'check balances',
    transfer: 'send funds',
    kyc: 'verify identity',
    'tns-read': 'look up names',
    'tns-write': 'register names',
    'exchange-rates': 'view rates',
    'wallet-create': 'create a wallet',
    'wallet-import': 'import a wallet',
    'wallet-delete': 'delete a wallet',
  };
  return labels[op] ?? op;
}
