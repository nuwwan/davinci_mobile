import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, View, type ScrollViewProps, type ViewProps } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';
import { useTheme } from '@/src/theme';

export type ScreenProps = ViewProps & {
  children: ReactNode;
  /** Safe-area edges. Tab screens omit `bottom` (the tab bar owns it). */
  edges?: readonly Edge[];
  className?: string;
};

/** Root container for every screen: surface3 background + safe-area insets. */
export function Screen({ children, className, edges = ['top', 'left', 'right'], ...rest }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className={cn('flex-1 bg-surface-3', className)} {...rest}>
      {children}
    </SafeAreaView>
  );
}

export type ScrollScreenProps = Omit<ScrollViewProps, 'children'> & {
  children: ReactNode;
  edges?: readonly Edge[];
  /** Pinned above the scroll area (e.g. offline strip). */
  top?: ReactNode;
  /** Pull-to-refresh. */
  refreshing?: boolean;
  onRefresh?: () => void;
  contentClassName?: string;
};

/**
 * Standard scrolling screen: 16pt gutters, 20pt vertical rhythm between blocks,
 * pull-to-refresh, grows to fill so empty states can center.
 */
export function ScrollScreen({
  children,
  edges,
  top,
  refreshing,
  onRefresh,
  contentClassName,
  ...rest
}: ScrollScreenProps) {
  const { colors } = useTheme();
  return (
    <Screen edges={edges}>
      {top}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName={cn('grow gap-5 px-4 pb-10 pt-3', contentClassName)}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          ) : undefined
        }
        {...rest}>
        {children}
      </ScrollView>
    </Screen>
  );
}

/** Plain surface3 flex container without safe-area padding. */
export function ScreenBody({ children, className, ...rest }: ViewProps & { className?: string }) {
  return (
    <View className={cn('flex-1 bg-surface-3', className)} {...rest}>
      {children}
    </View>
  );
}
