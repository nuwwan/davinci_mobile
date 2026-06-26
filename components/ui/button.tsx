import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
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
  style?: ViewStyle;
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
  style,
}: ButtonProps) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;
  const opacity = isDisabled ? 0.4 : 1;

  const containerBase: ViewStyle[] = [
    styles.base,
    { minHeight: height, borderRadius: theme.radius.lg, opacity },
    ...(fullWidth ? [styles.fullWidth] : []),
  ];

  const palette = (pressed: boolean) => {
    if (variant === 'primary') {
      return {
        bg: pressed ? theme.colors.primaryHover : theme.colors.primary,
        borderColor: theme.colors.primary,
      };
    }
    if (variant === 'outline') {
      return {
        bg: pressed ? theme.colors.primaryLight : 'transparent',
        borderColor: theme.colors.primary,
      };
    }
    return {
      bg: pressed ? theme.colors.primaryLight : 'transparent',
      borderColor: 'transparent',
    };
  };

  const labelColor = variant === 'primary' ? 'textInverse' : 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        ...containerBase,
        {
          backgroundColor: palette(pressed).bg,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: palette(pressed).borderColor,
        },
        variant === 'primary' && pressed && !isDisabled && { transform: [{ scale: 0.97 }] },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? theme.colors.textInverse : theme.colors.primary} />
      ) : (
        <>
          {leftIcon}
          <AppText
            variant="body"
            color={labelColor}
            style={leftIcon ? { marginLeft: theme.spacing.xs } : undefined}>
            {title}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
});
