import SettingsButton from '@/components/settingsButton';
import TalusSelect from '@/components/talusSelect';
import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from 'expo-router';
import React from 'react';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootLayout = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Provider>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                title: 'Login',
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#25292e'
                }
              }}
            />
            <Stack.Screen
              name="signup"
              options={{
                title: 'Sign Up',
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#25292e'
                }
              }}
            />
            <Stack.Screen
              name="home"
              options={{
                title: 'Home',
                headerLeft: TalusSelect,
                headerRight: SettingsButton,
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#25292e'
                }
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                title: 'Settings',
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#25292e'
                }
              }}
            />
            <Stack.Screen
              name="qrCodeScanner"
              options={{
                title: 'QR Code Scanner',
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#25292e'
                }
              }}
            />
            <Stack.Screen
              name="manageDevices"
              options={{
                title: 'Manage Devices',
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#25292e'
                }
              }}
            />
          </Stack>
        </Provider>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default RootLayout;
