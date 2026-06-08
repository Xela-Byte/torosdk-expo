import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToroWrapper } from './src/torosdk/provider';
import { AuthGate, useAuth } from './src/context/AuthGate';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateWalletScreen from './src/screens/CreateWalletScreen';
import TransferScreen from './src/screens/TransferScreen';
import TNSScreen from './src/screens/TNSScreen';
import KYCScreen from './src/screens/KYCScreen';
import ExchangeRatesScreen from './src/screens/ExchangeRatesScreen';

export type RootStackParamList = {
  Home: undefined;
  CreateWallet: undefined;
  Transfer: undefined;
  TNS: undefined;
  KYC: undefined;
  ExchangeRates: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const auth = useAuth();

  if (auth.isLocked) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#e94560',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Toronet Wallet' }} />
        <Stack.Screen name="CreateWallet" component={CreateWalletScreen} options={{ title: 'Wallets' }} />
        <Stack.Screen name="Transfer" component={TransferScreen} options={{ title: 'Send' }} />
        <Stack.Screen name="TNS" component={TNSScreen} options={{ title: 'TNS Names' }} />
        <Stack.Screen name="KYC" component={KYCScreen} options={{ title: 'KYC Status' }} />
        <Stack.Screen name="ExchangeRates" component={ExchangeRatesScreen} options={{ title: 'Exchange Rates' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ToroWrapper>
      <AuthGate>
        <AppNavigator />
      </AuthGate>
    </ToroWrapper>
  );
}
