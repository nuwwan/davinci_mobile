import { ActivityIndicator, View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';
import { useTheme } from '@/src/theme';

export type SpinnerProps = ViewProps & {
  /** Full-screen centered loader on surface3 */
  fullScreen?: boolean;
  size?: 'small' | 'large';
  className?: string;
};

export function Spinner({ fullScreen, size = 'large', className, ...rest }: SpinnerProps) {
  const { colors } = useTheme();

  return (
    <View
      className={cn(
        fullScreen && 'absolute inset-0 items-center justify-center bg-surface-3',
        className
      )}
      {...rest}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}
