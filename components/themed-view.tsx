import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';

export type ThemedViewProps = ViewProps & {
  className?: string;
};

export function ThemedView({ className, ...otherProps }: ThemedViewProps) {
  return <View className={cn('bg-surface-3', className)} {...otherProps} />;
}
