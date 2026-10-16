import { View } from 'react-native';

import { AppText, Badge, Card, Icon } from '@/components/ui';
import { plural } from '@/lib/format';
import type { CatalogSubject, CatalogTopic } from '@/src/api/catalog';

/** Search result row for a subject (Figma Q2 "SUBJECTS"). */
export function SubjectResultRow({ subject, onPress }: { subject: CatalogSubject; onPress: () => void }) {
  return (
    <Card onPress={onPress} className="flex-row items-center gap-3 rounded-md px-3 py-3" accessibilityLabel={subject.name}>
      <View className="h-10 w-10 items-center justify-center rounded-[10px] bg-primary-light">
        <AppText variant="cardTitle" color="primary" className="font-display">
          {subject.name.trim().charAt(0).toUpperCase()}
        </AppText>
      </View>
      <View className="flex-1">
        <AppText variant="bodyStrong" weight="semibold" className="text-[15px]" numberOfLines={1}>
          {subject.name}
        </AppText>
        <AppText variant="badge" color="textTertiary" numberOfLines={1} className="mt-1">
          {[subject.description, plural(subject.topic_count, 'topic')].filter(Boolean).join(' · ')}
        </AppText>
      </View>
      {subject.is_subscribed ? <Badge label="Subscribed" tone="success" /> : null}
      <Icon name="chevR" size={16} color="textTertiary" />
    </Card>
  );
}

/** Search result row for a topic (Figma Q2 "TOPICS"): name · "Subject · N questions". */
export function TopicResultRow({ topic, onPress }: { topic: CatalogTopic; onPress: () => void }) {
  return (
    <Card onPress={onPress} className="flex-row items-center gap-3 rounded-md" accessibilityLabel={`${topic.name}, ${topic.subject_name}`}>
      <View className="flex-1 gap-1">
        <AppText variant="bodyStrong" weight="semibold" numberOfLines={1}>
          {topic.name}
        </AppText>
        <AppText variant="caption" color="textSecondary" numberOfLines={1}>
          {topic.subject_name} · {plural(topic.question_count, 'question')}
        </AppText>
      </View>
      {topic.is_subscribed ? <Badge label="Subscribed" tone="success" /> : null}
      <Icon name="chevR" size={16} color="textTertiary" />
    </Card>
  );
}
