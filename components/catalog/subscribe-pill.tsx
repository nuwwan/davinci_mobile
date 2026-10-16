import { ActivityIndicator, Pressable } from 'react-native';

import { AppText } from '@/components/ui';
import { cn } from '@/lib/cn';
import { useTheme } from '@/src/theme';

/** Compact subscribe toggle on topic tiles (Figma Q4/Q5): outline "Subscribe" ↔ green "✓ Subscribed". */
export function SubscribePill({
  subscribed,
  loading,
  onPress,
  label,
}: {
  subscribed: boolean;
  loading?: boolean;
  onPress: () => void;
  /** Accessible name, e.g. topic name. */
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subscribed ? `Unsubscribe from ${label}` : `Subscribe to ${label}`}
      accessibilityState={{ busy: loading, checked: subscribed }}
      disabled={loading}
      onPress={onPress}
      hitSlop={6}
      className={cn(
        'h-[30px] min-w-[96px] items-center justify-center rounded-[10px] px-3 active:opacity-70',
        subscribed ? 'bg-success-bg' : 'border-[1.5px] border-primary'
      )}>
      {loading ? (
        <ActivityIndicator size="small" color={subscribed ? colors.success : colors.primary} />
      ) : (
        <AppText variant="badge" weight="semibold" color={subscribed ? 'success' : 'primary'}>
          {subscribed ? '✓ Subscribed' : 'Subscribe'}
        </AppText>
      )}
    </Pressable>
  );
}
