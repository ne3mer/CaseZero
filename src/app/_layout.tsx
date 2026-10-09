import { DarkTheme, ThemeProvider, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NoirColors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  const noirTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: NoirColors.background,
      card: NoirColors.surface,
      text: NoirColors.textPrimary,
      border: NoirColors.borderSubtle,
      primary: NoirColors.goldPrimary,
    },
  };

  return (
    <ThemeProvider value={noirTheme}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: NoirColors.background },
          animation: 'fade',
        }}>
        <Stack.Screen name="index" />
      </Stack>
    </ThemeProvider>
  );
}
