import { Text, type TextProps } from 'react-native';

import { cn } from '@/lib/cn';
import {
  COLOR_TEXT_CLASS,
  VARIANT_TEXT_CLASS,
  type ColorName,
  type TypographyVariant,
} from '@/src/theme';

export type AppTextProps = TextProps & {
  variant: TypographyVariant;
  /** Semantic color token (maps to a Tailwind text-* class). */
  color?: ColorName;
  center?: boolean;
  className?: string;
};

export function AppText({
  variant,
  color = 'textPrimary',
  center,
  className,
  ...rest
}: AppTextProps) {
  return (
    <Text
      className={cn(
        VARIANT_TEXT_CLASS[variant],
        COLOR_TEXT_CLASS[color],
        center && 'text-center',
        className
      )}
      {...rest}
    />
  );
}
