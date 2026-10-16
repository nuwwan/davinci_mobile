import { Pressable, View } from 'react-native';

import { AppText, Badge } from '@/components/ui';
import { plural } from '@/lib/format';
import { useTheme } from '@/src/theme';
import type { CatalogSubject } from '@/src/api/catalog';

/** Grid tile (Figma L / Q1): big initial · "Subscribed" pill · name · 2-line description · topic count. */
export function SubjectTile({ subject, onPress }: { subject: CatalogSubject; onPress: () => void }) {
  const { shadow } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${subject.name}, ${plural(subject.topic_count, 'topic')}${subject.is_subscribed ? ', subscribed' : ''}`}
      onPress={onPress}
      style={{ boxShadow: shadow }}
      className="min-h-[165px] flex-1 rounded-lg border border-border bg-surface p-4 active:opacity-80">
      <View className="flex-row items-start justify-between">
        <AppText variant="pageTitle" color="primary" className="leading-[40px]">
          {subject.name.trim().charAt(0).toUpperCase()}
        </AppText>
        {subject.is_subscribed ? <Badge label="Subscribed" tone="success" className="mt-0.5" /> : null}
      </View>
      <AppText variant="bodyStrong" weight="semibold" className="mt-1.5 text-[16px] leading-[24px]" numberOfLines={1}>
        {subject.name}
      </AppText>
      {subject.description ? (
        <AppText variant="hint" color="textSecondary" numberOfLines={2} className="mt-0.5">
          {subject.description}
        </AppText>
      ) : null}
      <View className="flex-1" />
      <AppText variant="badge" color="textTertiary" className="mt-3">
        {plural(subject.topic_count, 'topic')}
      </AppText>
    </Pressable>
  );
}
