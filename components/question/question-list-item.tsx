import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { DifficultyBadge } from '@/components/question/difficulty-badge';

export type QuestionListItemProps = {
  title: string;
  difficultyLevel: number;
  subjectName?: string | null;
  tags?: string[];
  isVerified?: boolean;
  isAnswered?: boolean;
  onPress?: () => void;
};

/**
 * Question summary card (Figma F2): title + chevron · difficulty / subject / tag pills ·
 * "✓ Verified" and answered status.
 */
export function QuestionListItem({
  title,
  difficultyLevel,
  subjectName,
  tags = [],
  isVerified,
  isAnswered,
  onPress,
}: QuestionListItemProps) {
  return (
    <Card onPress={onPress} accessibilityLabel={title}>
      <View className="flex-row items-start gap-2">
        <AppText variant="bodyStrong" weight="semibold" className="flex-1 text-[15px] leading-[21px]" numberOfLines={2}>
          {title}
        </AppText>
        <Icon name="chevR" size={16} color="textTertiary" />
      </View>

      <View className="mt-2 flex-row flex-wrap gap-1.5">
        <DifficultyBadge level={difficultyLevel} />
        {subjectName ? <Badge label={subjectName} /> : null}
        {tags.slice(0, 2).map((t) => (
          <Badge key={t} label={t} />
        ))}
      </View>

      <View className="mt-2.5 flex-row items-center justify-between">
        {isVerified ? (
          <AppText variant="badge" color="success">
            ✓ Verified
          </AppText>
        ) : (
          <View />
        )}
        <AppText variant="badge" color={isAnswered ? 'success' : 'textTertiary'}>
          {isAnswered ? 'Answered' : '—'}
        </AppText>
      </View>
    </Card>
  );
}
