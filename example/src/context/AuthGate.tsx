import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'torosdk_app_pin';

interface AuthContextValue {
  /** `true` when the app is locked and LoginScreen should be shown */
  isLocked: boolean;
  /** `true` during initial biometric/hardware check */
  isLoading: boolean;
  /** Device supports AND has enrolled biometrics */
  hasBiometrics: boolean;
  /** PIN has been set (false on first-ever launch) */
  hasPin: boolean;
  /** Prompt biometric auth — return true if successful */
  unlockWithBiometrics: () => Promise<boolean>;
  /** Validate PIN — return true if correct */
  unlockWithPin: (pin: string) => Promise<boolean>;
  /** Persist a new PIN (first-time setup) and unlock */
  setPin: (pin: string) => Promise<void>;
  /** Lock the app (logout) — next render shows LoginScreen */
  lock: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthGate({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [hasPin, setHasPin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Check biometric availability
        const [compat, enrolled] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
        ]);
        if (cancelled) return;
        setHasBiometrics(compat && enrolled);

        // Check if PIN exists
        const stored = await SecureStore.getItemAsync(PIN_KEY);
        if (cancelled) return;
        setHasPin(!!stored);

        // Auto-attempt biometric unlock on launch
        if (compat && enrolled) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Unlock Toro Wallet',
            fallbackLabel: 'Use PIN',
          });
          if (!cancelled && result.success) {
            setIsLocked(false);
          }
        }
      } catch {
        // Hardware check failed — let user fall back to PIN
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const unlockWithBiometrics = useCallback(async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Toro Wallet',
        fallbackLabel: 'Use PIN',
      });
      if (result.success) {
        setIsLocked(false);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const unlockWithPin = useCallback(async (pin: string): Promise<boolean> => {
    const stored = await SecureStore.getItemAsync(PIN_KEY);
    if (stored === pin) {
      setIsLocked(false);
      return true;
    }
    return false;
  }, []);

  const setAppPin = useCallback(async (pin: string) => {
    await SecureStore.setItemAsync(PIN_KEY, pin);
    setHasPin(true);
    setIsLocked(false);
  }, []);

  const lock = useCallback(() => {
    setIsLocked(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLocked,
        isLoading,
        hasBiometrics,
        hasPin,
        unlockWithBiometrics,
        unlockWithPin,
        setPin: setAppPin,
        lock,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Access the auth gate from any screen (for logout, etc.) */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthGate>');
  return ctx;
}
