import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';

export type SegmentedTab<T extends string | number> = { value: T; label: string; count?: number };

/**
 * Full-width tab strip (Figma Q7–Q9 "Easy 6 | Medium 8 | Hard 4"):
 * 40pt surface2 track (r12) with a raised surface thumb (r10) on the active tab.
 */
export function SegmentedTabs<T extends string | number>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: SegmentedTab<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <View accessibilityRole="tablist" className={cn('h-10 flex-row rounded-md bg-surface-2 p-0.5', className)}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <Pressable
            key={String(t.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={t.count != null ? `${t.label}, ${t.count} questions` : t.label}
            onPress={() => onChange(t.value)}
            className={cn('flex-1 items-center justify-center rounded-[10px]', active && 'border border-border bg-surface')}>
            <AppText variant="label" weight={active ? 'semibold' : 'medium'} color={active ? 'primary' : 'textSecondary'} numberOfLines={1}>
              {t.label}
              {t.count != null ? `  ${t.count}` : ''}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
