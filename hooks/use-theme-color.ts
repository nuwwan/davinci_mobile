/**
 * Legacy bridge for starter components — resolves tokens from `useTheme()`.
 * Prefer Tailwind `className` (e.g. text-t-primary) in new code.
 */

import { useTheme } from '@/src/theme';

const legacyMap = {
  text: 'textPrimary',
  background: 'surface3',
  tint: 'primary',
  icon: 'textSecondary',
  tabIconDefault: 'textTertiary',
  tabIconSelected: 'primary',
} as const;

export type LegacyThemeColorName = keyof typeof legacyMap;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: LegacyThemeColorName
) {
  const { colors, isDark } = useTheme();
  const colorFromProps = props[isDark ? 'dark' : 'light'];

  if (colorFromProps) {
    return colorFromProps;
  }

  return colors[legacyMap[colorName]];
}
