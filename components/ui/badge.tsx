import { View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import type { ColorName } from '@/src/theme';

export type BadgeTone = 'default' | 'primary' | 'success' | 'error' | 'streak';

export type BadgeProps = ViewProps & {
  label: string;
  tone?: BadgeTone;
  className?: string;
};

const TONE_CLASS: Record<BadgeTone, { container: string; text: ColorName }> = {
  default: { container: 'bg-surface-2 border-border', text: 'textSecondary' },
  primary: { container: 'bg-primary-light border-primary-muted', text: 'primary' },
  success: { container: 'bg-correct-bg border-correct-border', text: 'correct' },
  error: { container: 'bg-wrong-bg border-wrong-border', text: 'wrong' },
  streak: { container: 'bg-streak-bg border-streak', text: 'streak' },
};

export function Badge({ label, tone = 'default', className, ...rest }: BadgeProps) {
  const toneClass = TONE_CLASS[tone];

  return (
    <View
      className={cn(
        'self-start rounded-sm border px-2 py-0.5',
        toneClass.container,
        className
      )}
      {...rest}>
      <AppText variant="hint" color={toneClass.text}>
        {label}
      </AppText>
    </View>
  );
}
