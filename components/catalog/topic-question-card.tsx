import { View } from 'react-native';

import { AppText, Badge, Card, Icon } from '@/components/ui';
import { compactNumber } from '@/lib/format';
import type { ColorName } from '@/src/theme';
import type { TopicQuestion } from '@/src/api/catalog';

const RESULT: Record<'correct' | 'wrong' | 'none', { label: string; color: ColorName }> = {
  correct: { label: '✓ Correct', color: 'success' },
  wrong: { label: '✗ Wrong', color: 'error' },
  none: { label: 'Not attempted', color: 'textTertiary' },
};

/**
 * Question summary in a topic tab (Figma Q7/Q8): title · "1.2k attempts · 82% got it right" ·
 * tag pills · the learner's own result.
 */
export function TopicQuestionCard({ question, onPress }: { question: TopicQuestion; onPress?: () => void }) {
  const result = question.my_attempt ? (question.my_attempt.is_correct ? 'correct' : 'wrong') : 'none';
  const r = RESULT[result];
  const global =
    question.total_attempts > 0 && question.correct_rate != null
      ? `${compactNumber(question.total_attempts)} attempts · ${Math.round(question.correct_rate * 100)}% got it right`
      : 'No attempts yet — be the first';

  return (
    <Card onPress={onPress} accessibilityLabel={`${question.title}. ${global}. ${r.label}`}>
      <View className="flex-row items-start gap-2">
        <AppText variant="bodyStrong" weight="semibold" className="flex-1 text-[15px] leading-[21px]" numberOfLines={3}>
          {question.title}
        </AppText>
        {onPress ? <Icon name="chevR" size={16} color="textTertiary" style={{ marginTop: 2 }} /> : null}
      </View>
      <AppText variant="badge" color="textTertiary" className="mt-1.5">
        {global}
      </AppText>
      <View className="mt-2.5 flex-row items-center gap-1.5">
        <View className="flex-1 flex-row flex-wrap gap-1.5">
          {(question.tags ?? []).slice(0, 3).map((t) => (
            <Badge key={t} label={t} />
          ))}
          {question.is_verified && (question.tags ?? []).length === 0 ? <Badge label="✓ Verified" tone="success" /> : null}
        </View>
        <AppText variant="badge" color={r.color}>
          {r.label}
        </AppText>
      </View>
    </Card>
  );
}
