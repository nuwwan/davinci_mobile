import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Icon, type IconName } from '@/components/ui/icon';
import { cn } from '@/lib/cn';
import { useTheme, type ColorName } from '@/src/theme';

/**
 * Figma "Component states → BUTTONS"
 *  primary            — filled brand            (Sign in, Submit answer, Save)
 *  outline            — brand border            (Edit profile, Try again, Resend)
 *  secondary          — neutral border          (Cancel)
 *  destructive        — filled error            (Sign out / Delete in sheets)
 *  destructiveOutline — error border            (Sign out on Profile)
 *  ghost              — text only               (inline actions)
 */
export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'secondary'
  | 'destructive'
  | 'destructiveOutline'
  | 'ghost';

export type ButtonSize = 'md' | 'sm';

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  /** Stretch to the parent width. Default true. */
  fullWidth?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const VARIANT: Record<ButtonVariant, { box: string; label: ColorName }> = {
  primary: { box: 'bg-primary active:bg-primary-hover', label: 'textInverse' },
  outline: { box: 'border-[1.5px] border-primary active:bg-primary-light', label: 'primary' },
  secondary: { box: 'border-[1.5px] border-t-secondary active:bg-surface-2', label: 'textSecondary' },
  destructive: { box: 'bg-error active:opacity-90', label: 'textInverse' },
  destructiveOutline: { box: 'border-[1.5px] border-error active:bg-error-bg', label: 'error' },
  ghost: { box: 'active:bg-primary-light', label: 'primary' },
};

const SIZE: Record<ButtonSize, string> = {
  md: 'h-[52px] px-5',
  sm: 'h-11 px-4',
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
  className,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { colors } = useTheme();
  const v = VARIANT[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={style}
      className={cn(
        'flex-row items-center justify-center rounded-lg active:scale-[0.98]',
        SIZE[size],
        v.box,
        fullWidth ? 'self-stretch' : 'self-start',
        disabled && !loading && 'opacity-40',
        className
      )}>
      {loading ? (
        <ActivityIndicator color={colors[v.label]} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon ? <Icon name={icon} size={20} color={v.label} /> : null}
          <AppText variant="button" color={v.label} numberOfLines={1}>
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

/** Inline tappable text (e.g. "Sign up" in auth footers). */
export function TextLink({
  title,
  onPress,
  color = 'primary',
}: {
  title: string;
  onPress: () => void;
  color?: ColorName;
}) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8} className="active:opacity-60">
      <AppText variant="body" weight="semibold" color={color}>
        {title}
      </AppText>
    </Pressable>
  );
}

/** Square icon-only button (44pt target) — header actions, clear buttons. */
export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  color = 'primary',
  size = 24,
  className,
}: {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  color?: ColorName;
  size?: number;
  className?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={6}
      className={cn('h-11 w-11 items-center justify-center rounded-full active:bg-surface-2', className)}>
      <Icon name={icon} size={size} color={color} />
    </Pressable>
  );
}
