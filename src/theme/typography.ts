import type { ColorName } from './colors';

/**
 * Font family names — must match the faces loaded in app/_layout.tsx and the
 * `fontFamily` keys in tailwind.config.js. Inter for UI/body, Plus Jakarta Sans for display.
 */
export const fontFamilies = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  displaySemibold: 'PlusJakartaSans_600SemiBold',
  displayBold: 'PlusJakartaSans_700Bold',
} as const;

/**
 * Type scale (Figma "DaVinci Mobile"):
 *
 * | variant    | font                      | size/line |
 * |------------|---------------------------|-----------|
 * | displayLg  | Plus Jakarta Sans Bold    | 40/48     | big stat values (Accuracy %)
 * | pageTitle  | Plus Jakarta Sans Bold    | 32/38     | screen titles, wordmark, stat values
 * | section    | Plus Jakarta Sans SemiBold| 24/31     | form headings, empty-state titles, sheets
 * | cardTitle  | Inter SemiBold            | 18/25     | card headings, question title
 * | question   | Inter Regular             | 15/23     | question body copy
 * | button     | Inter SemiBold            | 15/18     | button labels
 * | body       | Inter Regular             | 14/21     | default copy
 * | bodyStrong | Inter Medium              | 14/20     | list values, toasts
 * | label      | Inter Medium              | 13/19     | field labels
 * | caption    | Inter Regular             | 13/19     | row labels, inline errors
 * | overline   | Inter Medium, UPPERCASE   | 13/19     | section-card titles ("PERSONAL INFO")
 * | hint       | Inter Regular             | 12/17     | helper text
 * | badge      | Inter Medium              | 12/15     | pills
 * | tab        | Inter Medium              | 11/13     | tab bar labels
 */
export type TypographyVariant =
  | 'displayLg'
  | 'pageTitle'
  | 'section'
  | 'cardTitle'
  | 'question'
  | 'button'
  | 'body'
  | 'bodyStrong'
  | 'label'
  | 'caption'
  | 'overline'
  | 'hint'
  | 'badge'
  | 'tab';

export const VARIANT_TEXT_CLASS: Record<TypographyVariant, string> = {
  displayLg: 'text-display-lg font-display',
  pageTitle: 'text-page-title font-display',
  section: 'text-section font-display-semibold',
  cardTitle: 'text-card-title font-inter-semibold',
  question: 'text-question font-inter',
  button: 'text-button font-inter-semibold',
  body: 'text-body font-inter',
  bodyStrong: 'text-body-tight font-inter-medium',
  label: 'text-meta font-inter-medium',
  caption: 'text-meta font-inter',
  overline: 'text-meta font-inter-medium uppercase tracking-wide',
  hint: 'text-hint font-inter',
  badge: 'text-badge font-inter-medium',
  tab: 'text-tab font-inter-medium',
};

/** Optional weight override (Inter variants only). */
export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export const WEIGHT_CLASS: Record<FontWeight, string> = {
  regular: 'font-inter',
  medium: 'font-inter-medium',
  semibold: 'font-inter-semibold',
  bold: 'font-inter-bold',
};

/** Text-color class per semantic color token (matches tailwind.config.js color names). */
export const COLOR_TEXT_CLASS: Record<ColorName, string> = {
  primary: 'text-primary',
  primaryHover: 'text-primary-hover',
  primaryLight: 'text-primary-light',
  primaryMuted: 'text-primary-muted',
  accent: 'text-accent',
  accentLight: 'text-accent-light',
  surface: 'text-surface',
  surface2: 'text-surface-2',
  surface3: 'text-surface-3',
  border: 'text-border',
  borderStrong: 'text-border-strong',
  textPrimary: 'text-t-primary',
  textSecondary: 'text-t-secondary',
  textTertiary: 'text-t-tertiary',
  textInverse: 'text-t-inverse',
  success: 'text-success',
  successBg: 'text-success-bg',
  successBorder: 'text-success-border',
  error: 'text-error',
  errorBg: 'text-error-bg',
  errorBorder: 'text-error-border',
  scrim: 'text-scrim',
};
