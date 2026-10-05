import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';

export type ProgressBarProps = ViewProps & {
  /** 0–1 */
  progress: number;
  /** Track height — 8 (default, headline metrics) or 6 (per-subject rows). */
  height?: 6 | 8;
  tone?: 'primary' | 'success' | 'accent' | 'error';
  className?: string;
};

const FILL = {
  primary: 'bg-primary',
  success: 'bg-success',
  accent: 'bg-accent',
  error: 'bg-error',
} as const;

export function ProgressBar({ progress, height = 8, tone = 'primary', className, style, ...rest }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress || 0));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      className={cn('w-full overflow-hidden rounded-full bg-surface-2', className)}
      style={[{ height }, style]}
      {...rest}>
      <View className={cn('h-full rounded-full', FILL[tone])} style={{ width: `${clamped * 100}%` }} />
    </View>
  );
}
