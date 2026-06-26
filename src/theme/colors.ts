/**
 * Single source of truth for color hex values in the mobile app.
 *
 * This file mirrors `davinci_web/src/theme/tokens.css` and `global.css` (emerald +
 * slate + gold). It is the source for IMPERATIVE colors only (icons, spinners,
 * navigation theme) consumed via `useTheme().colors`.
 *
 * For styling, use Tailwind/NativeWind classes (bg-primary, text-t-secondary, …),
 * whose values come from the CSS variables in global.css. Keep both in sync.
 */

export const lightColors = {
  /* Brand — emerald (growth) */
  primary: '#059669',          // emerald-600
  primaryHover: '#047857',     // emerald-700
  primaryLight: '#ECFDF5',     // emerald-50
  primaryMuted: '#A7F3D0',     // emerald-200

  /* Secondary / accent — gold (premium highlights) */
  secondary: '#D97706',        // amber-600
  secondaryLight: '#FFFBEB',   // amber-50

  /* Surfaces — cool slate (ink) */
  surface: '#FFFFFF',
  surface2: '#F1F5F9',         // slate-100
  surface3: '#F8FAFC',         // slate-50

  /* Borders */
  border: '#E2E8F0',           // slate-200
  borderStrong: '#CBD5E1',     // slate-300

  /* Text */
  textPrimary: '#0F172A',      // slate-900
  textSecondary: '#475569',    // slate-600
  textTertiary: '#94A3B8',     // slate-400
  textInverse: '#FFFFFF',

  /* Feedback */
  correct: '#059669',
  correctBg: '#ECFDF5',
  correctBorder: '#A7F3D0',
  wrong: '#E11D48',            // rose-600
  wrongBg: '#FFF1F2',          // rose-50
  wrongBorder: '#FECDD3',      // rose-200

  streak: '#D97706',           // amber-600
  streakBg: '#FFFBEB',         // amber-50

  /** Modal / bottom-sheet scrim (opacity applied in component). */
  scrim: '#0F172A',
} as const;

export const darkColors = {
  primary: '#34D399',
  primaryHover: '#6EE7B7',
  primaryLight: '#022C22',
  primaryMuted: '#065F46',

  secondary: '#FBBF24',
  secondaryLight: '#1C1500',

  surface: '#0F172A',
  surface2: '#1E293B',
  surface3: '#020617',

  border: '#1E293B',
  borderStrong: '#334155',

  textPrimary: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#64748B',
  textInverse: '#0F172A',

  correct: '#34D399',
  correctBg: '#022C22',
  correctBorder: '#065F46',
  wrong: '#FB7185',
  wrongBg: '#2D0A0A',
  wrongBorder: '#7F1D1D',

  streak: '#FBBF24',
  streakBg: '#1C1500',

  scrim: '#0F172A',
} as const;

export type ColorName = keyof typeof lightColors;

/** Resolved color map for one scheme (used for imperative colors: icons, spinners, nav theme). */
export type ThemeColors = Record<ColorName, string>;
