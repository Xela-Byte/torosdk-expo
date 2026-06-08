import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthGate';

export default function LoginScreen() {
  const auth = useAuth();

  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPinEntry, setShowPinEntry] = useState(false);

  if (auth.isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // ── First-time PIN setup ──────────────────────────────────────────
  if (!auth.hasPin) {
    return <PinSetupView />;
  }

  // ── Unlock: biometric + PIN ───────────────────────────────────────
  const handleBiometric = async () => {
    setPinError('');
    const ok = await auth.unlockWithBiometrics();
    if (!ok) setPinError('Biometric authentication failed. Try again or use PIN.');
  };

  const handlePinSubmit = async () => {
    setPinError('');
    if (pin.length < 4) {
      setPinError('PIN must be at least 4 digits');
      return;
    }
    const ok = await auth.unlockWithPin(pin);
    if (!ok) {
      setPinError('Incorrect PIN');
      setPin('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        {/* Logo / branding */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={styles.title}>Toronet Wallet</Text>
          <Text style={styles.subtitle}>Unlock to continue</Text>
        </View>

        {/* Biometric button (always shown if available) */}
        {auth.hasBiometrics && !showPinEntry && (
          <TouchableOpacity style={styles.bioButton} onPress={handleBiometric}>
            <Text style={styles.bioIcon}>🔐</Text>
            <Text style={styles.bioLabel}>
              Unlock with {Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint'}
            </Text>
          </TouchableOpacity>
        )}

        {/* PIN entry */}
        {(showPinEntry || !auth.hasBiometrics) && (
          <View style={styles.pinSection}>
            <Text style={styles.pinLabel}>Enter your PIN</Text>
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={(t) => { setPin(t); setPinError(''); }}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              placeholder="••••••"
              placeholderTextColor="#444"
              autoFocus
              onSubmitEditing={handlePinSubmit}
            />
            {pinError !== '' && <Text style={styles.errorText}>{pinError}</Text>}
            <TouchableOpacity
              style={[styles.pinButton, pin.length < 4 && styles.disabled]}
              onPress={handlePinSubmit}
              disabled={pin.length < 4}
            >
              <Text style={styles.pinButtonText}>Unlock</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Toggle between biometric and PIN */}
        {auth.hasBiometrics && (
          <TouchableOpacity
            style={styles.toggleLink}
            onPress={() => { setShowPinEntry(!showPinEntry); setPin(''); setPinError(''); }}
          >
            <Text style={styles.toggleText}>
              {showPinEntry ? 'Use Face ID instead' : 'Use PIN instead'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

/** Separate component for PIN setup (first-time) to keep state clean */
function PinSetupView() {
  const auth = useAuth();
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [firstPin, setFirstPin] = useState('');
  const [secondPin, setSecondPin] = useState('');
  const [error, setError] = useState('');

  const isConfirm = step === 'confirm';

  const handleContinue = () => {
    setError('');
    const current = isConfirm ? secondPin : firstPin;

    if (current.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    if (!isConfirm) {
      // Save first entry, move to confirm
      setStep('confirm');
    } else {
      // Compare
      if (secondPin !== firstPin) {
        setError('PINs do not match. Try again.');
        setSecondPin('');
        return;
      }
      // Persist and unlock
      auth.setPin(firstPin);
    }
  };

  const goBack = () => {
    setError('');
    if (isConfirm) {
      setStep('enter');
      setSecondPin('');
    }
  };

  const currentValue = isConfirm ? secondPin : firstPin;
  const setCurrentValue = isConfirm ? setSecondPin : setFirstPin;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            {isConfirm ? 'Confirm your PIN' : 'Create a PIN to secure your wallet'}
          </Text>
        </View>

        <View style={styles.pinSection}>
          <Text style={styles.pinLabel}>
            {isConfirm ? 'Re-enter PIN' : 'New PIN'}
          </Text>
          <TextInput
            style={styles.pinInput}
            value={currentValue}
            onChangeText={(t) => { setCurrentValue(t); setError(''); }}
            keyboardType="number-pad"
            maxLength={6}
            secureTextEntry
            placeholder="••••••"
            placeholderTextColor="#444"
            autoFocus
            onSubmitEditing={handleContinue}
          />
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.setupButtonRow}>
            {isConfirm && (
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.pinButton, styles.setupButton, currentValue.length < 4 && styles.disabled]}
              onPress={handleContinue}
              disabled={currentValue.length < 4}
            >
              <Text style={styles.pinButtonText}>
                {isConfirm ? 'Set PIN' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
  },
  inner: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
  },
  loadingText: {
    color: '#aaa',
    marginTop: 12,
    fontSize: 14,
  },

  // Biometric
  bioButton: {
    backgroundColor: '#0f3460',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#1a5276',
  },
  bioIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  bioLabel: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },

  // PIN
  pinSection: {
    width: '100%',
    alignItems: 'center',
  },
  pinLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pinInput: {
    backgroundColor: '#0f3460',
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 12,
    textAlign: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    marginBottom: 16,
  },
  pinButton: {
    backgroundColor: '#e94560',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  setupButton: {
    flex: 1,
  },
  disabled: {
    opacity: 0.4,
  },
  pinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  setupButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  backButtonText: {
    color: '#aaa',
    fontWeight: '600',
    fontSize: 16,
  },

  // Toggle
  toggleLink: {
    marginTop: 24,
    paddingVertical: 8,
  },
  toggleText: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: '600',
  },

  // Error
  errorText: {
    color: '#e94560',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
});
