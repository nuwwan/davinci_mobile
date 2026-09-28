import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';

export type ProgressBarProps = ViewProps & {
  /** 0–1 */
  progress: number;
  /** Default 4px — daily header spec */
  height?: number;
  trackColorToken?: 'surface2' | 'surface';
  fillColorToken?: 'primary' | 'secondary';
  className?: string;
};

const TRACK_CLASS = {
  surface2: 'bg-surface-2',
  surface: 'bg-surface',
} as const;

const FILL_CLASS = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
} as const;

export function ProgressBar({
  progress,
  height = 4,
  trackColorToken = 'surface2',
  fillColorToken = 'primary',
  className,
  style,
  ...rest
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View
      className={cn('w-full overflow-hidden rounded-full', TRACK_CLASS[trackColorToken], className)}
      style={[{ height }, style]}
      {...rest}>
      <View
        className={cn('h-full rounded-full', FILL_CLASS[fillColorToken])}
        style={{ width: `${clamped * 100}%` }}
      />
    </View>
  );
}
