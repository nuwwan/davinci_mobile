import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import type { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { ToastProvider } from '@/components/ui/toast-context';
import { ThemeProvider, useTheme } from '@/src/theme';
import { persistor, store } from '@/src/store';

function NavigationThemeBridge({ children }: { children: ReactNode }) {
  const { navigationTheme } = useTheme();
  return <NavigationThemeProvider value={navigationTheme}>{children}</NavigationThemeProvider>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <NavigationThemeBridge>
            <ToastProvider>{children}</ToastProvider>
          </NavigationThemeBridge>
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
