import type { ColorName } from './colors';

/**
 * Font family names — must match the faces loaded in app/_layout.tsx and the
 * `fontFamily` keys in tailwind.config.js. Inter for body, Plus Jakarta for display.
 */
export const fontFamilies = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  displaySemibold: 'PlusJakartaSans_600SemiBold',
  displayBold: 'PlusJakartaSans_700Bold',
} as const;

export type TypographyVariant =
  | 'screenTitle'
  | 'sectionHeading'
  | 'cardHeading'
  | 'questionBody'
  | 'body'
  | 'metadata'
  | 'hint';

/**
 * Tailwind class per typography variant — size + line-height + font face.
 * Mirrors the web type scale (page-title / section / card-title / question / body / meta / hint).
 */
export const VARIANT_TEXT_CLASS: Record<TypographyVariant, string> = {
  screenTitle: 'text-page-title font-display',
  sectionHeading: 'text-section font-display-semibold',
  cardHeading: 'text-card-title font-display-semibold',
  questionBody: 'text-question font-inter-medium',
  body: 'text-body font-inter',
  metadata: 'text-meta font-inter',
  hint: 'text-hint font-inter',
};

/** Text-color class per semantic color token (matches tailwind.config.js color names). */
export const COLOR_TEXT_CLASS: Record<ColorName, string> = {
  primary: 'text-primary',
  primaryHover: 'text-primary-hover',
  primaryLight: 'text-primary-light',
  primaryMuted: 'text-primary-muted',
  secondary: 'text-secondary',
  secondaryLight: 'text-secondary-light',
  surface: 'text-surface',
  surface2: 'text-surface-2',
  surface3: 'text-surface-3',
  border: 'text-border',
  borderStrong: 'text-border-strong',
  textPrimary: 'text-t-primary',
  textSecondary: 'text-t-secondary',
  textTertiary: 'text-t-tertiary',
  textInverse: 'text-t-inverse',
  correct: 'text-correct',
  correctBg: 'text-correct-bg',
  correctBorder: 'text-correct-border',
  wrong: 'text-wrong',
  wrongBg: 'text-wrong-bg',
  wrongBorder: 'text-wrong-border',
  streak: 'text-streak',
  streakBg: 'text-streak-bg',
  scrim: 'text-scrim',
};
