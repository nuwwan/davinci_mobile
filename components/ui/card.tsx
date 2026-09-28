import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';

export type CardProps = ViewProps & {
  children: ReactNode;
  title?: string;
  /** Applies elevation / shadow from the design system */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
};

const SHADOW_CLASS = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
} as const;

export function Card({ children, title, shadow = 'md', className, ...rest }: CardProps) {
  return (
    <View
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-surface p-6',
        SHADOW_CLASS[shadow],
        className
      )}
      {...rest}>
      {title ? (
        <AppText variant="cardHeading" color="textPrimary" className="mb-3">
          {title}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}
