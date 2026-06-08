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
//
// `createCustomStrategy` lets you plug in any auth flow — social login,
// server-side challenge, hardware key, multi-sig, rate-limited API, etc.
// The function receives the OperationCategory and must return true (allow)
// or false (deny → throws AuthBlockedError).
//
// Pattern A: Server-side challenge
// ---------------------------------
// export const authStrategy: AuthStrategy = createCustomStrategy(async (operation) => {
//   const res = await fetch('https://your-api.example/authorize', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ operation, timestamp: Date.now() }),
//   });
//   if (!res.ok) return false;
//   const { allowed } = await res.json();
//   return allowed;
// });
//
// Pattern B: PIN / passphrase modal
// ---------------------------------
// export const authStrategy: AuthStrategy = createCustomStrategy(async (operation) => {
//   // showPinModal is your own UI function that returns a Promise<string | null>
//   const pin = await showPinModal(`Enter PIN to ${operation}`);
//   return pin === getUserStoredPin(); // false → AuthBlockedError
// });
//
// Pattern C: Log-everything (debug / audit trail)
// ------------------------------------------------
// export const authStrategy: AuthStrategy = createCustomStrategy(async (operation) => {
//   console.log(`[torosdk] authorize: ${operation} at ${new Date().toISOString()}`);
//   // Send to your analytics / audit backend
//   await analytics.track('wallet_operation', { operation });
//   return true;
// });
