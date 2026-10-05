import type { Theme as NavTheme } from '@react-navigation/native';

import type { ThemeColors } from './colors';
import { fontFamilies } from './typography';

/** React Navigation theme derived from the resolved color tokens. */
export function buildNavigationTheme(colors: ThemeColors, isDark: boolean): NavTheme {
  return {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.surface3,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.error,
    },
    fonts: {
      regular: { fontFamily: fontFamilies.regular, fontWeight: '400' },
      medium: { fontFamily: fontFamilies.medium, fontWeight: '500' },
      bold: { fontFamily: fontFamilies.displayBold, fontWeight: '700' },
      heavy: { fontFamily: fontFamilies.displayBold, fontWeight: '800' },
    },
  };
}
