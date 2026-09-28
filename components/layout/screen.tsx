import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';

export type ScreenProps = ViewProps & {
  children: React.ReactNode;
  /** Safe-area edges; bottom is included by default for home indicator */
  edges?: readonly Edge[];
  /** When false, content can extend under the home indicator (e.g. full-screen readers) */
  safeBottom?: boolean;
  className?: string;
};

export function Screen({
  children,
  className,
  edges = ['top', 'left', 'right'],
  safeBottom = true,
  ...rest
}: ScreenProps) {
  const resolvedEdges: readonly Edge[] = safeBottom ? [...edges, 'bottom'] : edges;

  return (
    <SafeAreaView edges={resolvedEdges} className={cn('flex-1 bg-surface-3', className)} {...rest}>
      {children}
    </SafeAreaView>
  );
}

/** Same background as Screen but without safe-area padding — use inside Screen or modals when you need a plain flex container */
export function ScreenBody({ children, className, ...rest }: ViewProps & { className?: string }) {
  return (
    <View className={cn('flex-1 bg-surface-3', className)} {...rest}>
      {children}
    </View>
  );
}
