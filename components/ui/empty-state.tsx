import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Button, type ButtonVariant } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { cn } from '@/lib/cn';

/**
 * Centered status block used for empty / error / no-data states
 * (Figma E5, E6, F3, F4, H3): 48pt tertiary icon · section title · body message · optional action.
 */
export function EmptyState({
  icon,
  iconSize = 48,
  title,
  message,
  actionLabel,
  onAction,
  actionVariant = 'outline',
  className,
}: {
  icon?: IconName;
  iconSize?: number;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: ButtonVariant;
  className?: string;
}) {
  const fullWidthAction = actionVariant === 'primary';
  return (
    <View className={cn('items-center px-6 py-10', className)}>
      {icon ? <Icon name={icon} size={iconSize} strokeWidth={1.75} color="textTertiary" /> : null}
      <AppText variant="section" color="textSecondary" center className="mt-5">
        {title}
      </AppText>
      {message ? (
        <AppText variant="body" color="textTertiary" center className="mt-2 max-w-[300px]">
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          variant={actionVariant}
          onPress={onAction}
          fullWidth={fullWidthAction}
          className={cn('mt-7', !fullWidthAction && 'self-center px-8')}
        />
      ) : null}
    </View>
  );
}
