import { View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import type { ColorName } from '@/src/theme';

/**
 * Figma "BADGES AND CHIPS" — read-only pill, 22pt tall, 12 Medium.
 *  success (Easy / Active) · accent (Medium / streak) · error (Hard) · primary (role) · default (tags)
 */
export type BadgeTone = 'default' | 'primary' | 'success' | 'accent' | 'error';

export type BadgeProps = ViewProps & {
  label: string;
  tone?: BadgeTone;
  className?: string;
};

const TONE: Record<BadgeTone, { box: string; text: ColorName }> = {
  default: { box: 'bg-surface-2', text: 'textSecondary' },
  primary: { box: 'bg-primary-light', text: 'primary' },
  success: { box: 'bg-success-bg', text: 'success' },
  accent: { box: 'bg-accent-light', text: 'accent' },
  error: { box: 'bg-error-bg', text: 'error' },
};

export function Badge({ label, tone = 'default', className, ...rest }: BadgeProps) {
  const t = TONE[tone];
  return (
    <View
      className={cn('h-[22px] justify-center self-start rounded-full px-2', t.box, className)}
      {...rest}>
      <AppText variant="badge" color={t.text} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

/** Small status dot + label (e.g. "● Active"). */
export function StatusDot({
  label,
  tone = 'success',
}: {
  label: string;
  tone?: 'success' | 'error' | 'accent' | 'textTertiary';
}) {
  const dot = {
    success: 'bg-success',
    error: 'bg-error',
    accent: 'bg-accent',
    textTertiary: 'bg-t-tertiary',
  }[tone];
  return (
    <View className="flex-row items-center gap-1.5">
      <View className={cn('h-2 w-2 rounded-full', dot)} />
      <AppText variant="bodyStrong" color={tone}>
        {label}
      </AppText>
    </View>
  );
}
