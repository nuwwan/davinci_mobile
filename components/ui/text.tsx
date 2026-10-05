import { Text, type TextProps } from 'react-native';

import { cn } from '@/lib/cn';
import {
  COLOR_TEXT_CLASS,
  VARIANT_TEXT_CLASS,
  WEIGHT_CLASS,
  type ColorName,
  type FontWeight,
  type TypographyVariant,
} from '@/src/theme';

export type AppTextProps = TextProps & {
  /** Type-scale role. See src/theme/typography.ts. Default `body`. */
  variant?: TypographyVariant;
  /** Semantic color token. Default `textPrimary`. */
  color?: ColorName;
  /** Override the variant's Inter weight (e.g. body + semibold for inline links). */
  weight?: FontWeight;
  center?: boolean;
  right?: boolean;
  className?: string;
};

/** The only text primitive screens should use — enforces the DaVinci type scale. */
export function AppText({
  variant = 'body',
  color = 'textPrimary',
  weight,
  center,
  right,
  className,
  ...rest
}: AppTextProps) {
  return (
    <Text
      className={cn(
        VARIANT_TEXT_CLASS[variant],
        weight && WEIGHT_CLASS[weight],
        COLOR_TEXT_CLASS[color],
        center && 'text-center',
        right && 'text-right',
        className
      )}
      {...rest}
    />
  );
}
