import { Pressable, View } from 'react-native';

import { AppText, Icon } from '@/components/ui';
import { cn } from '@/lib/cn';
import { plural } from '@/lib/format';
import { useTheme } from '@/src/theme';
import type { CatalogTopic } from '@/src/api/catalog';
import { SubscribePill } from './subscribe-pill';

/**
 * Topic card in a subject (Figma Q4/Q5): status dot (green = subscribed) · name · description ·
 * "24 questions · 10 answered" · chevron (opens topic) · subscribe pill.
 */
export function TopicTile({
  topic,
  onPress,
  onToggleSubscribe,
  subscribing,
}: {
  topic: CatalogTopic;
  onPress: () => void;
  onToggleSubscribe: () => void;
  subscribing?: boolean;
}) {
  const { shadow } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${topic.name}, ${plural(topic.question_count, 'question')}`}
      onPress={onPress}
      style={{ boxShadow: shadow }}
      className="rounded-md border border-border bg-surface px-4 py-3 active:opacity-80">
      <View className="flex-row items-center gap-1.5">
        <View className={cn('h-2 w-2 rounded-full', topic.is_subscribed ? 'bg-success' : 'bg-t-tertiary')} />
        <AppText variant="bodyStrong" weight="semibold" className="flex-1" numberOfLines={1}>
          {topic.name}
        </AppText>
        <Icon name="chevR" size={16} color="textTertiary" />
      </View>
      <View className="mt-1 flex-row items-end gap-3">
        <View className="flex-1 gap-1">
          {topic.description ? (
            <AppText variant="caption" color="textSecondary" numberOfLines={1}>
              {topic.description}
            </AppText>
          ) : null}
          <AppText variant="badge" color="textTertiary">
            {plural(topic.question_count, 'question')} · {topic.answered_count} answered
          </AppText>
        </View>
        <SubscribePill subscribed={topic.is_subscribed} loading={subscribing} onPress={onToggleSubscribe} label={topic.name} />
      </View>
    </Pressable>
  );
}
