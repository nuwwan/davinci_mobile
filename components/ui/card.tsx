import type { ReactNode } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import { useTheme } from '@/src/theme';

/**
 * Surfaces from the mockups:
 *  hero    — r28, p16  (auth form card, daily question card)
 *  section — r20, p16  (Profile / Settings groups — pair with `title` overline)
 *  default — r16, p16  (list items, stat tiles, explanation)
 * Tones recolor the surface for success / error / neutral callouts.
 */
export type CardVariant = 'default' | 'section' | 'hero';
export type CardTone = 'default' | 'success' | 'error' | 'muted';

export type CardProps = ViewProps & {
  children: ReactNode;
  variant?: CardVariant;
  tone?: CardTone;
  /** Uppercase overline title (e.g. "PERSONAL INFO"). */
  title?: string;
  /** Right side of the title row. */
  titleRight?: ReactNode;
  elevated?: boolean;
  padded?: boolean;
  onPress?: () => void;
  className?: string;
};

const RADIUS: Record<CardVariant, string> = {
  default: 'rounded-lg',
  section: 'rounded-xl',
  hero: 'rounded-2xl',
};

const TONE: Record<CardTone, string> = {
  default: 'bg-surface border-border',
  success: 'bg-success-bg border-success-border',
  error: 'bg-error-bg border-error-border',
  muted: 'bg-surface-2 border-border',
};

export function Card({
  children,
  variant = 'default',
  tone = 'default',
  title,
  titleRight,
  elevated = true,
  padded = true,
  onPress,
  className,
  style,
  ...rest
}: CardProps) {
  const { shadow } = useTheme();
  const cls = cn('border', RADIUS[variant], TONE[tone], padded && 'p-4', className);
  const shadowStyle = elevated && tone === 'default' ? { boxShadow: shadow } : undefined;

  const content = (
    <>
      {title ? (
        <View className="mb-1 flex-row items-center justify-between">
          <AppText variant="overline" color={tone === 'error' ? 'error' : 'textTertiary'}>
            {title}
          </AppText>
          {titleRight}
        </View>
      ) : null}
      {children}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={[shadowStyle, style as object]}
        className={cn(cls, 'active:opacity-80')}
        {...rest}>
        {content}
      </Pressable>
    );
  }
  return (
    <View style={[shadowStyle, style]} className={cls} {...rest}>
      {content}
    </View>
  );
}
