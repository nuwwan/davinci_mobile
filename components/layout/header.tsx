import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';

export type HeaderProps = {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function Header({ title, subtitle, left, right, className }: HeaderProps) {
  return (
    <View
      className={cn(
        'min-h-[52px] flex-row items-center border-b border-border px-4 py-3',
        className
      )}>
      <View className="w-[72px] justify-center">{left}</View>
      <View className="flex-1 items-center gap-0.5">
        <AppText variant="sectionHeading" color="textPrimary" numberOfLines={1} center>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="metadata" color="textSecondary" numberOfLines={2} center>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View className="w-[72px] items-end justify-center">{right}</View>
    </View>
  );
}
