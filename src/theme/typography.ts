import type { TextStyle } from 'react-native';

export type FontFamilies = {
  /** 400 weight — body & metadata (Inter) */
  regular: string;
  /** 500 weight — question copy / emphasized body (Inter) */
  medium: string;
  /** 600 weight — section/card headings (display face) */
  semibold: string;
  /** 700 weight — screen titles (display face) */
  bold: string;
};

export type TypographyVariant =
  | 'screenTitle'
  | 'sectionHeading'
  | 'cardHeading'
  | 'questionBody'
  | 'body'
  | 'metadata'
  | 'hint';

/**
 * Sizes/line heights mirror davinci_web's Tailwind type scale
 * (`page-title` / `section` / `card-title` / `question` / `body` / `meta` / `hint`).
 * Weight comes from the embedded font face (no `fontWeight` here).
 */
const variants: Record<TypographyVariant, Pick<TextStyle, 'fontSize' | 'lineHeight'>> = {
  screenTitle: { fontSize: 32, lineHeight: 38 },     // page-title 32 / 1.2
  sectionHeading: { fontSize: 24, lineHeight: 31 },  // section 24 / 1.3
  cardHeading: { fontSize: 18, lineHeight: 25 },     // card-title 18 / 1.4
  questionBody: { fontSize: 15, lineHeight: 23 },    // question 15 / 1.5
  body: { fontSize: 14, lineHeight: 21 },            // body 14 / 1.5
  metadata: { fontSize: 13, lineHeight: 19 },        // meta 13 / 1.45
  hint: { fontSize: 12, lineHeight: 17 },            // hint 12 / 1.4
};

export function getTypographyStyle(
  variant: TypographyVariant,
  fonts: FontFamilies,
  weight: keyof FontFamilies = weightForVariant(variant)
): TextStyle {
  const base = variants[variant];
  return {
    ...base,
    fontFamily: fonts[weight],
  };
}

function weightForVariant(variant: TypographyVariant): keyof FontFamilies {
  switch (variant) {
    case 'screenTitle':
      return 'bold';
    case 'sectionHeading':
    case 'cardHeading':
      return 'semibold';
    case 'questionBody':
      return 'medium';
    default:
      return 'regular';
  }
}

/**
 * Default font family map: Inter for body weights (400/500),
 * Plus Jakarta Sans for display weights (600/700) — mirrors the web stack.
 */
export const interFontNames = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const satisfies FontFamilies;
