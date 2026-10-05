/**
 * Non-color design tokens (spacing, radii, sizes). Use Tailwind classes where possible;
 * these constants exist for imperative styles (animations, SVG, nav options).
 */
export const spacing = {
  gutter: 16, // horizontal screen padding
  cardPadding: 16,
  sectionGap: 20, // vertical gap between blocks on a screen
  stackGap: 12,
} as const;

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  full: 9999,
} as const;

export const sizes = {
  buttonHeight: 52,
  buttonHeightSm: 44,
  inputHeight: 48,
  optionMinHeight: 52,
  chipHeight: 30,
  badgeHeight: 22,
  tabBarHeight: 49, // + bottom safe-area inset (Figma: 83 on a 34pt-inset device)
  tabIcon: 24,
  icon: 24,
  iconSm: 20,
  iconXs: 16,
  emptyStateIcon: 48,
} as const;

export const avatarSizes = { sm: 40, md: 64, lg: 84 } as const;
