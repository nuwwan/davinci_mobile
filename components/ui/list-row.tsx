import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Icon, type IconName } from '@/components/ui/icon';
import { cn } from '@/lib/cn';
import type { ColorName } from '@/src/theme';

/**
 * Read-only key/value row (Profile "PERSONAL INFO", "ACCOUNT", Settings "ABOUT").
 * Label 13 Regular secondary · value 14 Medium right-aligned · 1pt divider below.
 */
export function InfoRow({
  label,
  value,
  valueColor = 'textPrimary',
  right,
  onPress,
  last,
}: {
  label: string;
  value?: string;
  valueColor?: ColorName;
  /** Custom right content (e.g. <StatusDot />). Replaces `value`. */
  right?: ReactNode;
  /** Makes the row tappable and adds a chevron. */
  onPress?: () => void;
  /** Hide the divider on the final row. */
  last?: boolean;
}) {
  const body = (
    <View className={cn('min-h-[36px] flex-row items-center gap-4 py-2.5', !last && 'border-b border-border')}>
      <AppText variant="caption" color="textSecondary">
        {label}
      </AppText>
      <View className="flex-1 flex-row items-center justify-end gap-1">
        {right ?? (
          value !== undefined ? (
            <AppText variant="bodyStrong" color={valueColor} numberOfLines={1} right className="flex-shrink">
              {value}
            </AppText>
          ) : null
        )}
        {onPress ? <Icon name="chevR" size={16} color="textTertiary" /> : null}
      </View>
    </View>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress} className="active:opacity-60">
      {body}
    </Pressable>
  ) : (
    body
  );
}

/**
 * Setting / navigation row (Settings "Daily question reminder", "Notification time").
 * Label 14 Regular primary · optional hint · right accessory (Switch, SegmentedControl, value).
 */
export function ListRow({
  label,
  hint,
  icon,
  labelColor = 'textPrimary',
  value,
  right,
  onPress,
  chevron,
  last,
}: {
  label: string;
  hint?: string;
  icon?: IconName;
  labelColor?: ColorName;
  value?: string;
  right?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
  last?: boolean;
}) {
  const body = (
    <View className={cn('min-h-[48px] flex-row items-center gap-3 py-2', !last && 'border-b border-border')}>
      {icon ? <Icon name={icon} size={20} color={labelColor} /> : null}
      <View className="flex-1 gap-0.5">
        <AppText variant={labelColor === 'textPrimary' ? 'body' : 'bodyStrong'} color={labelColor}>
          {label}
        </AppText>
        {hint ? (
          <AppText variant="hint" color="textTertiary">
            {hint}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="body" color="textSecondary">
          {value}
        </AppText>
      ) : null}
      {right}
      {(chevron ?? (!!onPress && !right)) ? <Icon name="chevR" size={16} color="textTertiary" /> : null}
    </View>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress} className="active:opacity-60">
      {body}
    </Pressable>
  ) : (
    body
  );
}

export function Divider({ className }: { className?: string }) {
  return <View className={cn('h-px bg-border', className)} />;
}
