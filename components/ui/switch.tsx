import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { cn } from '@/lib/cn';

/** Figma Settings toggle — 51×31 track, 27pt thumb. On = primary, off = surface2 + border. */
export function Switch({
  value,
  onValueChange,
  disabled,
  accessibilityLabel,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const x = useSharedValue(value ? 20 : 0);
  useEffect(() => {
    x.value = withTiming(value ? 20 : 0, { duration: 160 });
  }, [value, x]);
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      className={cn(
        'h-[31px] w-[51px] justify-center rounded-full px-0.5',
        value ? 'bg-primary' : 'border border-border bg-surface-2',
        disabled && 'opacity-40'
      )}>
      {/* Reanimated views aren't className-aware — style the thumb directly. */}
      <Animated.View style={[styles.thumb, thumb]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  thumb: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.15)',
  },
});
