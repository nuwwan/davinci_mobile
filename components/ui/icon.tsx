import { memo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { ColorName } from '@/src/theme';
import { useTheme } from '@/src/theme';

/**
 * DaVinci icon set — exported from Figma ("Icon set — SF Symbols style").
 * 24pt grid · 1.75 stroke · round caps and joins · one color per state.
 *
 * Each glyph keeps the viewBox it was exported with; the stroke width is scaled so it
 * always renders at `strokeWidth` (default 1.75) on a 24pt grid, at any `size`.
 * Glyphs marked "added" are drawn in the same style to cover screens beyond the Figma set.
 */
type Glyph = { vb: number; d: string[] };

const GLYPHS = {
  house: { vb: 24, d: ['M3 11.5L12 4L21 11.5', 'M5.5 10V19.5H10V14H14V19.5H18.5V10'] },
  book: {
    vb: 24,
    d: ['M12 6.5C10 5 7 4.5 4 5V18C7 17.5 10 18 12 19.5C14 18 17 17.5 20 18V5C17 4.5 14 5 12 6.5Z', 'M12 6.5V19.5'],
  },
  chart: { vb: 24, d: ['M5 20V12M12 20V5M19 20V11'] },
  person: {
    vb: 24,
    d: [
      'M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z',
      'M4.5 20.5C5.5 16.9 8.5 15 12 15C15.5 15 18.5 16.9 19.5 20.5',
    ],
  },
  eye: {
    vb: 20,
    d: [
      'M2.08331 10C2.08331 10 4.99998 4.58334 9.99998 4.58334C15 4.58334 17.9166 10 17.9166 10C17.9166 10 15 15.4167 9.99998 15.4167C4.99998 15.4167 2.08331 10 2.08331 10Z',
      'M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z',
    ],
  },
  /** added — eye with slash, for "hide password" */
  eyeOff: {
    vb: 20,
    d: [
      'M2.08331 10C2.08331 10 4.99998 4.58334 9.99998 4.58334C15 4.58334 17.9166 10 17.9166 10C17.9166 10 15 15.4167 9.99998 15.4167C4.99998 15.4167 2.08331 10 2.08331 10Z',
      'M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z',
      'M3 3L17 17',
    ],
  },
  search: {
    vb: 32,
    d: [
      'M14 22.6668C18.7864 22.6668 22.6666 18.7866 22.6666 14.0002C22.6666 9.2137 18.7864 5.3335 14 5.3335C9.21351 5.3335 5.33331 9.2137 5.33331 14.0002C5.33331 18.7866 9.21351 22.6668 14 22.6668Z',
      'M26.6667 26.6666L20.1334 20.1333',
    ],
  },
  chevR: { vb: 32, d: ['M12 6.6665L21.3333 15.9998L12 25.3332'] },
  chevL: { vb: 24, d: ['M15 5L8 12L15 19'] },
  check: { vb: 40, d: ['M8.33325 20.8333L15.8333 28.3333L31.6666 12.5'] },
  xmark: { vb: 32, d: ['M8 8L24 24M24 8L8 24'] },
  flame: {
    vb: 80,
    d: [
      'M40 10C43.3334 21.6667 58.3334 28.3333 58.3334 45C58.3334 49.8623 56.4018 54.5255 52.9636 57.9636C49.5255 61.4018 44.8623 63.3333 40 63.3333C35.1377 63.3333 30.4746 61.4018 27.0364 57.9636C23.5982 54.5255 21.6667 49.8623 21.6667 45C21.6667 38.3333 25 34.3333 28.3334 31.6667C29 36.6667 31.6667 39.3333 34.3334 40C33.3334 30 35 18.3333 40 10Z',
    ],
  },
  wifiOff: {
    vb: 32,
    d: [
      'M4 4L28 28M6.66667 13.3333C8.51059 11.5625 10.8247 10.3592 13.3333 9.86667M25.3333 13.3333C23.9991 12.0412 22.4096 11.0421 20.6667 10.4M11.3333 18C12.2895 17.1907 13.4371 16.6399 14.6667 16.4M20.6667 18C20.1588 17.4714 19.5745 17.022 18.9333 16.6667',
      'M16 25.3332C16.7364 25.3332 17.3334 24.7362 17.3334 23.9998C17.3334 23.2635 16.7364 22.6665 16 22.6665C15.2636 22.6665 14.6667 23.2635 14.6667 23.9998C14.6667 24.7362 15.2636 25.3332 16 25.3332Z',
    ],
  },
  logout: {
    vb: 32,
    d: [
      'M12 5.3335H7.33334C6.8029 5.3335 6.29419 5.54421 5.91912 5.91928C5.54405 6.29436 5.33334 6.80306 5.33334 7.3335V24.6668C5.33334 25.1973 5.54405 25.706 5.91912 26.081C6.29419 26.4561 6.8029 26.6668 7.33334 26.6668H12',
      'M21.3333 21.3332L26.6667 15.9998L21.3333 10.6665M26.6667 15.9998H12',
    ],
  },
  trash: {
    vb: 32,
    d: ['M5.33333 9.33333H26.6667M12.6667 9.33333V6H19.3333V9.33333M7.99999 9.33333L9.33333 26.6667H22.6667L24 9.33333M13.3333 14.6667V21.3333M18.6667 14.6667V21.3333'],
  },
  bell: {
    vb: 32,
    d: [
      'M8 21.9998V14.6665C8 12.5448 8.84286 10.5099 10.3431 9.00965C11.8434 7.50936 13.8783 6.6665 16 6.6665C18.1217 6.6665 20.1566 7.50936 21.6569 9.00965C23.1571 10.5099 24 12.5448 24 14.6665V21.9998L26 24.6665H6L8 21.9998Z',
      'M13.3333 28C13.3333 28.7072 13.6143 29.3855 14.1144 29.8856C14.6145 30.3857 15.2928 30.6667 16 30.6667C16.7073 30.6667 17.3855 30.3857 17.8856 29.8856C18.3857 29.3855 18.6667 28.7072 18.6667 28',
    ],
  },
  calendar: {
    vb: 32,
    d: [
      'M23.3333 7.3335H8.66668C6.82573 7.3335 5.33334 8.82588 5.33334 10.6668V23.3335C5.33334 25.1744 6.82573 26.6668 8.66668 26.6668H23.3333C25.1743 26.6668 26.6667 25.1744 26.6667 23.3335V10.6668C26.6667 8.82588 25.1743 7.3335 23.3333 7.3335Z',
      'M5.33334 13.3332H26.6667M11.3333 4.6665V9.99984M20.6667 4.6665V9.99984',
    ],
  },
  mail: {
    vb: 40,
    d: [
      'M30.8333 9.16675H9.16667C6.86548 9.16675 5 11.0322 5 13.3334V26.6667C5 28.9679 6.86548 30.8334 9.16667 30.8334H30.8333C33.1345 30.8334 35 28.9679 35 26.6667V13.3334C35 11.0322 33.1345 9.16675 30.8333 9.16675Z',
      'M6.66675 13.3333L20.0001 22.4999L33.3334 13.3333',
    ],
  },
  /** added — settings (sliders) */
  settings: {
    vb: 24,
    d: [
      'M4 7H13M17 7H20M4 17H7M11 17H20',
      'M15 9C16.1046 9 17 8.10457 17 7C17 5.89543 16.1046 5 15 5C13.8954 5 13 5.89543 13 7C13 8.10457 13.8954 9 15 9Z',
      'M9 19C10.1046 19 11 18.1046 11 17C11 15.8954 10.1046 15 9 15C7.89543 15 7 15.8954 7 17C7 18.1046 7.89543 19 9 19Z',
    ],
  },
  /** added — lock (change password) */
  lock: {
    vb: 24,
    d: [
      'M17 11H7C5.89543 11 5 11.8954 5 13V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V13C19 11.8954 18.1046 11 17 11Z',
      'M8 11V7.5C8 5.29086 9.79086 3.5 12 3.5C14.2091 3.5 16 5.29086 16 7.5V11',
    ],
  },
  /** added — info circle */
  info: {
    vb: 24,
    d: [
      'M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z',
      'M12 11V16M12 8H12.01',
    ],
  },
  /** added — alert circle (errors) */
  alert: {
    vb: 24,
    d: [
      'M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z',
      'M12 7.5V12.5M12 16H12.01',
    ],
  },
  /** added — circular refresh / reload arrow (arrow.clockwise style) */
  refresh: {
    vb: 24,
    d: [
      'M19.9 12C19.9 16.4 16.4 19.9 12 19.9C7.6 19.9 4.1 16.4 4.1 12C4.1 7.6 7.6 4.1 12 4.1C14.5 4.1 16.8 5.3 18.2 7.1',
      'M18.2 4V7.5H14.7',
    ],
  },
  /** added — clock face (time taken) */
  clock: {
    vb: 24,
    d: [
      'M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z',
      'M12 7V12L15.5 14.5',
    ],
  },
} satisfies Record<string, Glyph>;

export type IconName = keyof typeof GLYPHS;
export const ICON_NAMES = Object.keys(GLYPHS) as IconName[];

export type IconProps = {
  name: IconName;
  /** Rendered size in pt. Default 24. */
  size?: number;
  /** Semantic token (preferred) — resolves per color scheme. */
  color?: ColorName;
  /** Raw color override (e.g. tab bar tint). Wins over `color`. */
  tint?: string;
  /** Stroke width on the 24pt grid. Default 1.75. */
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

function IconBase({
  name,
  size = 24,
  color = 'textSecondary',
  tint,
  strokeWidth = 1.75,
  style,
  accessibilityLabel,
}: IconProps) {
  const { colors } = useTheme();
  const glyph: Glyph = GLYPHS[name];
  const stroke = tint ?? colors[color];
  const sw = (strokeWidth * glyph.vb) / 24;

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${glyph.vb} ${glyph.vb}`}
      fill="none"
      style={style}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}>
      {glyph.d.map((d, i) => (
        <Path
          key={i}
          d={d}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}

export const Icon = memo(IconBase);
