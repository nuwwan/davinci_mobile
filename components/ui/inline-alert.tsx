import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import type { ColorName } from '@/src/theme';

type Tone = 'error' | 'success' | 'info' | 'neutral';

const TONE: Record<Tone, { box: string; text: ColorName }> = {
  error: { box: 'bg-error-bg border-error-border', text: 'error' },
  success: { box: 'bg-success-bg border-success-border', text: 'success' },
  info: { box: 'bg-primary-light border-primary-muted', text: 'primary' },
  neutral: { box: 'bg-surface-2 border-border', text: 'textSecondary' },
};

/**
 * In-flow message box (radius 12). E.g. Profile "Couldn't load full profile. [Try again]",
 * Home "You've already answered today's question."
 */
export function InlineAlert({
  tone = 'neutral',
  message,
  actionLabel,
  onAction,
  center,
  children,
  className,
}: {
  tone?: Tone;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  center?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <View accessibilityRole="alert" className={cn('rounded-md border p-4', t.box, className)}>
      <AppText variant={center ? 'label' : 'body'} color={t.text} center={center}>
        {message}
      </AppText>
      {children}
      {actionLabel && onAction ? (
        <Button title={actionLabel} variant="outline" size="sm" fullWidth={false} onPress={onAction} className="mt-3 px-6" />
      ) : null}
    </View>
  );
}

/** Full-width strip under the status bar (Figma E6 "No internet connection"). */
export function StatusStrip({ message, tone = 'error' }: { message: string; tone?: 'error' | 'info' }) {
  const t = TONE[tone];
  return (
    <View accessibilityRole="alert" className={cn('h-[34px] items-center justify-center border-b', t.box)}>
      <AppText variant="label" color={t.text}>
        {message}
      </AppText>
    </View>
  );
}
