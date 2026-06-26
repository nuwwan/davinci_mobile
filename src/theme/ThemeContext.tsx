import * as SecureStore from 'expo-secure-store';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { buildNavigationTheme, buildTheme, type AppTheme } from './build-theme';
import { interFontNames, type FontFamilies } from './typography';

const THEME_PREFERENCE_KEY = 'theme_preference';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: AppTheme;
  /** Resolved light/dark for painting UI */
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => Promise<void>;
  /** Toggles between light and dark and persists as an explicit preference */
  toggleTheme: () => Promise<void>;
  navigationTheme: ReturnType<typeof buildNavigationTheme>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
  fontFamilies?: FontFamilies;
};

export function ThemeProvider({ children, fontFamilies }: ThemeProviderProps) {
  const systemScheme = useSystemColorScheme() ?? 'light';
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(THEME_PREFERENCE_KEY);
        if (cancelled) return;
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreferenceState(stored);
        }
      } catch {
        /* keep system default */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fonts = fontFamilies ?? interFontNames;

  const isDark = useMemo(() => {
    if (preference === 'system') {
      return systemScheme === 'dark';
    }
    return preference === 'dark';
  }, [preference, systemScheme]);

  const theme = useMemo(() => buildTheme(isDark, fonts), [isDark, fonts]);

  const navigationTheme = useMemo(() => buildNavigationTheme(theme, isDark), [theme, isDark]);

  const setPreference = useCallback(async (value: ThemePreference) => {
    setPreferenceState(value);
    await SecureStore.setItemAsync(THEME_PREFERENCE_KEY, value);
  }, []);

  const toggleTheme = useCallback(async () => {
    const next: ThemePreference = isDark ? 'light' : 'dark';
    await setPreference(next);
  }, [isDark, setPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isDark,
      preference,
      setPreference,
      toggleTheme,
      navigationTheme,
    }),
    [theme, isDark, preference, setPreference, toggleTheme, navigationTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
