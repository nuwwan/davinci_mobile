import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import type { ColorName } from '@/src/theme';

/** Compact KPI tile (Figma Stats: "42 / Questions answered", "4 / Day streak 🔥"). */
export function StatTile({
  value,
  label,
  color = 'primary',
  className,
}: {
  value: string | number;
  label: string;
  color?: ColorName;
  className?: string;
}) {
  return (
    <Card className={className ?? 'flex-1'}>
      <AppText variant="pageTitle" color={color} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </AppText>
      <AppText variant="label" color="textSecondary" className="mt-1.5" numberOfLines={1}>
        {label}
      </AppText>
    </Card>
  );
}

/** Headline metric card: title · big value · caption · optional footer (progress, week strip…). */
export function MetricCard({
  title,
  value,
  valueColor = 'primary',
  size = 'md',
  caption,
  aside,
  children,
}: {
  title: string;
  value: string;
  valueColor?: ColorName;
  /** `lg` uses the 40pt display size (Accuracy). */
  size?: 'md' | 'lg';
  caption?: string;
  /** Right-aligned secondary text on the value row (e.g. "Best: 12 days"). */
  aside?: string;
  children?: ReactNode;
}) {
  return (
    <Card>
      <AppText variant="cardTitle">{title}</AppText>
      <View className="flex-row items-baseline justify-between">
        <AppText variant={size === 'lg' ? 'displayLg' : 'pageTitle'} color={valueColor}>
          {value}
        </AppText>
        {aside ? (
          <AppText variant="body" color="textTertiary">
            {aside}
          </AppText>
        ) : null}
      </View>
      {caption ? (
        <AppText variant="body" color="textSecondary" className="mt-0.5">
          {caption}
        </AppText>
      ) : null}
      {children ? <View className="mt-4">{children}</View> : null}
    </Card>
  );
}
