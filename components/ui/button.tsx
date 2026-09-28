import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import { useTheme } from '@/src/theme';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
  /** Default 52 per auth / daily spec */
  height?: number;
  className?: string;
  style?: ViewStyle;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-primary active:bg-primary-hover active:scale-[0.98]',
  outline: 'border-[1.5px] border-primary bg-transparent active:bg-primary-light',
  ghost: 'bg-transparent active:bg-primary-light',
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  leftIcon,
  fullWidth = true,
  height = 52,
  className,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const labelColor = variant === 'primary' ? 'textInverse' : 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={[{ minHeight: height }, style]}
      className={cn(
        'flex-row items-center justify-center rounded-lg px-5',
        VARIANT_CLASS[variant],
        fullWidth && 'self-stretch',
        isDisabled && 'opacity-40',
        className
      )}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textInverse : colors.primary} />
      ) : (
        <>
          {leftIcon}
          <AppText variant="body" color={labelColor} className={leftIcon ? 'ml-2' : undefined}>
            {title}
          </AppText>
        </>
      )}
    </Pressable>
  );
}
