import { createBiometricStrategy, type AuthStrategy } from 'torosdk-expo/core';

export const authStrategy: AuthStrategy = createBiometricStrategy({
  requireFor: ['transfer', 'kyc', 'tns-write', 'wallet-delete'],
  skipFor: ['balance', 'tns-read', 'exchange-rates', 'wallet-create', 'wallet-import'],
});
