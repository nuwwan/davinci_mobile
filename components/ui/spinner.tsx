import { ActivityIndicator, View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';
import { useTheme } from '@/src/theme';

export type SpinnerProps = ViewProps & {
  /** Fills the parent, centered, on surface3. */
  fullScreen?: boolean;
  size?: 'small' | 'large';
  className?: string;
};

export function Spinner({ fullScreen, size = 'large', className, ...rest }: SpinnerProps) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      className={cn(fullScreen ? 'flex-1 items-center justify-center bg-surface-3' : 'items-center justify-center py-16', className)}
      {...rest}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}
