import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';

/** Expand/collapse block — header row toggles the body (e.g. attempt history items). */
export function Collapsible({
  title,
  header,
  initiallyOpen = false,
  children,
}: PropsWithChildren<{ title?: string; header?: ReactNode; initiallyOpen?: boolean }>) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((o) => !o)}
        className="flex-row items-center gap-2 active:opacity-70">
        <View className="flex-1">{header ?? <AppText variant="bodyStrong">{title}</AppText>}</View>
        <Icon
          name="chevR"
          size={16}
          color="textTertiary"
          style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}
        />
      </Pressable>
      {open ? <View className="mt-3">{children}</View> : null}
    </View>
  );
}
