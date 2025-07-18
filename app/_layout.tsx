import SettingsButton from '@/components/settingsButton';
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootLayout = (): React.JSX.Element => {
  return (
    <SafeAreaProvider>
      <Stack initialRouteName="index">
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
      </Stack>
    </SafeAreaProvider>
  );
};

export default RootLayout;
