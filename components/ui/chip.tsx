import { Pressable, ScrollView, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';

/** Figma "Selected / Unselected" chip — 30pt pill, 13 Medium. Used for filters & preferences. */
export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
};

export function Chip({ label, selected = false, onPress, className }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'h-[30px] justify-center rounded-full px-3 active:opacity-80',
        selected ? 'bg-primary' : 'bg-surface-2',
        className
      )}>
      <AppText variant="label" color={selected ? 'textInverse' : 'textSecondary'} numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}

export type ChipOption<T extends string | number> = { value: T; label: string };

export type ChipGroupProps<T extends string | number> = {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Horizontal scroll row (filters) vs. wrapping row (forms). Default `scroll`. */
  layout?: 'scroll' | 'wrap';
  className?: string;
};

/** Single-select chip row. Scrolls horizontally edge-to-edge on list screens. */
export function ChipGroup<T extends string | number>({
  options,
  value,
  onChange,
  layout = 'scroll',
  className,
}: ChipGroupProps<T>) {
  const chips = options.map((o) => (
    <Chip key={String(o.value)} label={o.label} selected={o.value === value} onPress={() => onChange(o.value)} />
  ));

  if (layout === 'wrap') {
    return <View className={cn('flex-row flex-wrap gap-2', className)}>{chips}</View>;
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={cn('-mx-4 grow-0', className)}
      contentContainerClassName="gap-2 px-4">
      {chips}
    </ScrollView>
  );
}
