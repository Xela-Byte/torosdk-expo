import {
  createBiometricStrategy,
  type AuthStrategy,
} from 'torosdk-expo/core';

/**
 * Biometric auth strategy — requires fingerprint/Face ID for sensitive operations.
 *
 * Adjust requireFor / skipFor to match your app's security requirements.
 * To switch to password or custom auth, see the commented alternatives below.
 */
export const authStrategy: AuthStrategy = createBiometricStrategy({
  requireFor: ['transfer', 'kyc', 'tns-write', 'wallet-delete'],
  skipFor: ['balance', 'tns-read', 'exchange-rates', 'wallet-create', 'wallet-import'],
});

// --- Alternative: Password (silent fill) ---
// import { createPasswordStrategy } from 'torosdk-expo/core';
// export const authStrategy = createPasswordStrategy();

// --- Alternative: Custom ---
// import { createCustomStrategy } from 'torosdk-expo/core';
// export const authStrategy = createCustomStrategy(async (operation) => {
//   console.log(`Authorizing operation: ${operation}`);
//   return true;
// });
