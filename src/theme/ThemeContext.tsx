import * as SecureStore from 'expo-secure-store';
import { colorScheme as nwColorScheme, useColorScheme } from 'nativewind';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { buildNavigationTheme } from './build-theme';
import { cardShadow, darkColors, lightColors, scrimOpacity, type ThemeColors } from './colors';

const THEME_PREFERENCE_KEY = 'theme_preference';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  /** Resolved color tokens for the active scheme (imperative use: icons, spinners, nav). */
  colors: ThemeColors;
  /** True when the dark scheme is currently applied. */
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => Promise<void>;
  /** Flip between light and dark and persist the choice. */
  toggleTheme: () => Promise<void>;
  navigationTheme: ReturnType<typeof buildNavigationTheme>;
  /** Card elevation as a CSS box-shadow string (RN new-architecture `boxShadow`). */
  shadow: string;
  /** Backdrop opacity for sheets / modals. */
  scrimOpacity: number;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(THEME_PREFERENCE_KEY);
        if (cancelled) return;
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreferenceState(stored);
          nwColorScheme.set(stored);
        }
      } catch {
        /* keep system default */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isDark = colorScheme === 'dark';
  const colors = useMemo<ThemeColors>(() => (isDark ? darkColors : lightColors), [isDark]);
  const navigationTheme = useMemo(() => buildNavigationTheme(colors, isDark), [colors, isDark]);

  const setPreference = useCallback(async (value: ThemePreference) => {
    setPreferenceState(value);
    nwColorScheme.set(value);
    try {
      await SecureStore.setItemAsync(THEME_PREFERENCE_KEY, value);
    } catch {
      /* SecureStore unavailable (e.g. web) — preference applies for this session only */
    }
  }, []);

  const toggleTheme = useCallback(
    () => setPreference(isDark ? 'light' : 'dark'),
    [isDark, setPreference]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors,
      isDark,
      preference,
      setPreference,
      toggleTheme,
      navigationTheme,
      shadow: isDark ? cardShadow.dark : cardShadow.light,
      scrimOpacity: isDark ? scrimOpacity.dark : scrimOpacity.light,
    }),
    [colors, isDark, preference, setPreference, toggleTheme, navigationTheme]
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
