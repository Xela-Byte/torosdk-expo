import {
  createPasswordStrategy,
  createBiometricStrategy,
  createCustomStrategy,
  type AuthStrategy,
} from 'torosdk-expo/core';

/**
 * Choose your auth strategy:
 *
 * 1. Password — password is stored in SecureStore and filled silently.
 *    Uncomment: export const authStrategy = createPasswordStrategy();
 *
 * 2. Biometric — requires fingerprint/Face ID for sensitive operations.
 *    Uncomment the biometricStrategy below and adjust which operation
 *    categories require biometric verification.
 *
 * 3. Custom — wire up your own auth flow (social auth, PIN, etc.).
 *    Uncomment the customStrategy and implement your authorize function.
 */

// --- Option 1: Password (silent fill) ---
export const authStrategy: AuthStrategy = createPasswordStrategy();

// --- Option 2: Biometric ---
// export const authStrategy: AuthStrategy = createBiometricStrategy({
//   requireFor: ['transfer', 'kyc', 'tns-write', 'wallet-delete'],
//   skipFor: ['balance', 'tns-read', 'exchange-rates', 'wallet-create', 'wallet-import'],
// });

// --- Option 3: Custom ---
// export const authStrategy: AuthStrategy = createCustomStrategy(async (operation) => {
//   // Replace with your own auth logic (social auth, server-side check, etc.)
//   console.log(`Authorizing operation: ${operation}`);
//   return true;
// });
