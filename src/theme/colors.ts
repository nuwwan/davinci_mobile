/**
 * DaVinci color tokens — single source of truth for hex values.
 *
 * Source: Figma "DaVinci Mobile" → variable collection "DaVinci Colors" (light) and the
 * "(Dark)" frames (dark). Brand seeds: #007A8C (teal), #336749 (green), #6C757D (slate).
 *
 * Styling should use NativeWind classes (bg-primary, text-t-secondary, border-border …),
 * whose values come from the CSS variables in global.css. This file feeds IMPERATIVE
 * colors only (icons, spinners, switches, navigation theme) via `useTheme().colors`.
 * Keep global.css in sync with this file.
 */

export const lightColors = {
  /* Brand */
  primary: '#007A8C',
  primaryHover: '#00616F',
  primaryLight: '#E0F2F4',
  primaryMuted: '#8CC7CF',

  /* Accent — streaks, "Medium" difficulty, highlights */
  accent: '#9A6408',
  accentLight: '#FBF0DA',

  /* Surfaces */
  surface: '#FFFFFF', // cards, sheets, inputs, tab bar
  surface2: '#EEF1F3', // chips, badge/track backgrounds, dividers
  surface3: '#F6F8F9', // screen background

  /* Borders */
  border: '#DEE2E6',
  borderStrong: '#C5CCD2',

  /* Text */
  textPrimary: '#1B2A30',
  textSecondary: '#6C757D',
  textTertiary: '#98A1A8',
  textInverse: '#FFFFFF',

  /* Feedback */
  success: '#336749',
  successBg: '#E8F3EC',
  successBorder: '#A9CDB8',
  error: '#C0392B',
  errorBg: '#FCECEA',
  errorBorder: '#F0B7B0',

  /** Sheet / modal backdrop (opacity applied separately — see `scrimOpacity`). */
  scrim: '#000000',
} as const;

export type ColorName = keyof typeof lightColors;

/** Resolved color map for one scheme. */
export type ThemeColors = Record<ColorName, string>;

export const darkColors: ThemeColors = {
  primary: '#3FB8CB',
  primaryHover: '#2DA0B3',
  primaryLight: '#10353B',
  primaryMuted: '#1F6F7C',

  accent: '#E0A23B',
  accentLight: '#3A2C10',

  surface: '#172429',
  surface2: '#22333A',
  surface3: '#0F1A1D',

  border: '#2C3F47',
  borderStrong: '#3D535C',

  textPrimary: '#E8F0F2',
  textSecondary: '#9FB0B7',
  textTertiary: '#6F838B',
  textInverse: '#06222A',

  success: '#5BB98A',
  successBg: '#14301F',
  successBorder: '#2A5A40',
  error: '#E5675A',
  errorBg: '#3A1C19',
  errorBorder: '#6B2E29',

  scrim: '#000000',
};

/** Backdrop opacity for sheets/modals per scheme (Figma: 45% light, 60% dark). */
export const scrimOpacity = { light: 0.45, dark: 0.6 } as const;

/** Card elevation per scheme (Figma: 0 1 3 rgba(0,0,0,.08) light / .30 dark). */
export const cardShadow = {
  light: '0px 1px 3px rgba(0, 0, 0, 0.08)',
  dark: '0px 1px 3px rgba(0, 0, 0, 0.30)',
} as const;
