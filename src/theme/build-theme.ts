import type { TextStyle } from 'react-native';
import type { Theme as NavTheme } from '@react-navigation/native';

import { darkColors, lightColors, type ColorName } from './colors';
import { radius } from './radius';
import { spacing } from './spacing';
import { darkShadows, lightShadows } from './shadows';
import { getTypographyStyle, type FontFamilies, type TypographyVariant } from './typography';

export type ThemeColors = Record<ColorName, string>;

export type AppTheme = {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof lightShadows;
  fonts: FontFamilies;
  textStyle: (variant: TypographyVariant, color?: string) => TextStyle;
};

export function buildTheme(isDark: boolean, fonts: FontFamilies): AppTheme {
  const colors = (isDark ? darkColors : lightColors) as ThemeColors;
  const shadows = isDark ? darkShadows : lightShadows;

  return {
    colors,
    spacing,
    radius,
    shadows,
    fonts,
    textStyle(variant, color) {
      return {
        ...getTypographyStyle(variant, fonts),
        color: color ?? colors.textPrimary,
      };
    },
  };
}

export function buildNavigationTheme(theme: AppTheme, isDark: boolean): NavTheme {
  const { colors } = theme;
  return {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.surface3,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.secondary,
    },
    fonts: {
      regular: { fontFamily: theme.fonts.regular, fontWeight: '400' as const },
      medium: { fontFamily: theme.fonts.medium, fontWeight: '500' as const },
      bold: { fontFamily: theme.fonts.bold, fontWeight: '700' as const },
      heavy: { fontFamily: theme.fonts.bold, fontWeight: '800' as const },
    },
  };
}
