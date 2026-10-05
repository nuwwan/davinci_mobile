import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import type { AttemptHistoryItem } from '@/src/api/enhanced';

function formatDate(raw: unknown): string {
  if (!raw) return '—';
  const d = new Date(raw as string);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(seconds: number | null | undefined): string | null {
  if (!seconds) return null;
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

export type AttemptHistoryCardProps = {
  item: AttemptHistoryItem;
};

/**
 * One row in the attempt-history list (Questions tab).
 * Shows: question title · correct/wrong badge · score · date · time taken.
 */
export function AttemptHistoryCard({ item }: AttemptHistoryCardProps) {
  const timeStr = formatTime(item.time_taken_seconds);

  return (
    <Card>
      {/* Title + result badge */}
      <View className="flex-row items-start gap-2">
        <AppText
          variant="bodyStrong"
          weight="semibold"
          className="flex-1 text-[15px] leading-[21px]"
          numberOfLines={2}>
          {item.question_title}
        </AppText>
        <Badge
          label={item.is_correct ? '✓ Correct' : '✗ Wrong'}
          tone={item.is_correct ? 'success' : 'error'}
        />
      </View>

      {/* Metadata row */}
      <View className="mt-2.5 flex-row items-center gap-4">
        {/* Score */}
        {item.score != null ? (
          <View className="flex-row items-center gap-1">
            <Icon name="flame" size={14} color={item.score > 0 ? 'accent' : 'textTertiary'} />
            <AppText variant="hint" color={item.score > 0 ? 'accent' : 'textTertiary'}>
              {item.score > 0 ? `+${item.score}` : `${item.score}`} pts
            </AppText>
          </View>
        ) : null}

        {/* Time taken */}
        {timeStr ? (
          <View className="flex-row items-center gap-1">
            <Icon name="clock" size={14} color="textTertiary" />
            <AppText variant="hint" color="textTertiary">
              {timeStr}
            </AppText>
          </View>
        ) : null}

        {/* Spacer */}
        <View className="flex-1" />

        {/* Date */}
        <AppText variant="hint" color="textTertiary">
          {formatDate(item.attempted_at)}
        </AppText>
      </View>
    </Card>
  );
}
