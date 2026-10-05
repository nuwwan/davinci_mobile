import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';

export type SegmentOption<T extends string> = { value: T; label: string };

/**
 * Figma Settings → "System | Light | Dark": 32pt track (surface2, r10) with a raised
 * 28pt thumb (surface + border, r8). Selected label in primary.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <View accessibilityRole="tablist" className={cn('h-8 flex-row rounded-[10px] bg-surface-2 p-0.5', className)}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(o.value)}
            className={cn(
              'min-w-[55px] flex-1 items-center justify-center rounded-sm px-2',
              selected && 'border border-border bg-surface'
            )}>
            <AppText variant="badge" color={selected ? 'primary' : 'textSecondary'}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
