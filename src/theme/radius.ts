/**
 * Radius scale — mirrors davinci_web/src/theme/tokens.css.
 * (`xxl` is kept as an alias for the web `2xl` so existing callers keep working.)
 */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
} as const;

export type RadiusName = keyof typeof radius;
