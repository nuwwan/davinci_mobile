import { Platform, type ViewStyle } from 'react-native';

/**
 * Shadow/elevation tokens. Light values mirror davinci_web's `shadow-sm`,
 * `shadow-soft`, and `shadow-lift` recipes. Android falls back to `elevation`
 * because RN cannot render layered shadows there.
 */
type ShadowSet = {
  sm: ViewStyle;
  md: ViewStyle;
  lg: ViewStyle;
};

const iosShadow = (
  color: string,
  opacity: number,
  radius: number,
  offsetY: number,
  offsetX = 0
): ViewStyle => ({
  shadowColor: color,
  shadowOffset: { width: offsetX, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: radius,
});

export const lightShadows: ShadowSet = {
  sm: Platform.select({
    ios: iosShadow('#0F172A', 0.04, 4, 1),
    android: { elevation: 1 },
    default: {},
  }) as ViewStyle,
  md: Platform.select({
    ios: iosShadow('#0F172A', 0.12, 16, 8),
    android: { elevation: 4 },
    default: {},
  }) as ViewStyle,
  lg: Platform.select({
    ios: iosShadow('#0F172A', 0.2, 24, 16),
    android: { elevation: 12 },
    default: {},
  }) as ViewStyle,
};

export const darkShadows: ShadowSet = {
  sm: Platform.select({
    ios: iosShadow('#000000', 0.4, 6, 2),
    android: { elevation: 2 },
    default: {},
  }) as ViewStyle,
  md: Platform.select({
    ios: iosShadow('#000000', 0.5, 18, 8),
    android: { elevation: 6 },
    default: {},
  }) as ViewStyle,
  lg: Platform.select({
    ios: iosShadow('#000000', 0.6, 28, 16),
    android: { elevation: 12 },
    default: {},
  }) as ViewStyle,
};
