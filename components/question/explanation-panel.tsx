import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';

export type ExplanationPanelProps = ViewProps & {
  title?: string;
  /** Controls the colour theme of the panel. Defaults to 'neutral'. */
  tone?: 'correct' | 'neutral';
  children: ReactNode;
  className?: string;
};

const TONE_STYLES = {
  correct: {
    container: 'border-correct-border bg-correct-bg',
    heading: 'correct' as const,
    body: 'correct' as const,
  },
  neutral: {
    container: 'border-border bg-surface-2',
    heading: 'textSecondary' as const,
    body: 'textPrimary' as const,
  },
};

export function ExplanationPanel({
  title = 'Explanation',
  tone = 'neutral',
  children,
  className,
  ...rest
}: ExplanationPanelProps) {
  const styles = TONE_STYLES[tone];

  const body =
    typeof children === 'string' || typeof children === 'number' ? (
      <AppText variant="body" color={styles.body}>
        {String(children)}
      </AppText>
    ) : (
      <View className="mt-1">{children}</View>
    );

  return (
    <View
      className={cn('w-full rounded-lg border p-4', styles.container, className)}
      {...rest}>
      <AppText variant="cardHeading" color={styles.heading} className="mb-2">
        {title}
      </AppText>
      {body}
    </View>
  );
}
