import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { CatalogHero, TopicTile } from '@/components/catalog';
import { NavHeader, ScrollScreen } from '@/components/layout';
import { AppText, ConfirmSheet, EmptyState, SearchBar, Skeleton } from '@/components/ui';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { plural } from '@/lib/format';
import { useGetCatalogSubjectQuery, useListSubjectTopicsQuery, type CatalogTopic } from '@/src/api/catalog';
import { useCatalogSubscription, type SubscriptionTarget } from '@/src/features/catalog/useCatalogSubscription';

/** Subject detail — topics list with topic search (Figma Q4 · Q5 · Q6, M3 sheet). */
export default function SubjectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ subjectId: string; name?: string }>();
  const subjectId = Number(params.subjectId);

  const [search, setSearch] = useState('');
  const q = useDebouncedValue(search.trim());
  const [confirm, setConfirm] = useState<SubscriptionTarget | null>(null);

  const subject = useGetCatalogSubjectQuery({ subjectId });
  const topics = useListSubjectTopicsQuery({ subjectId, search: q || undefined });
  const subs = useCatalogSubscription();

  const name = subject.data?.name ?? params.name ?? 'Subject';
  const subjectTarget: SubscriptionTarget = { kind: 'subject', id: subjectId, name };
  const topicTarget = (t: CatalogTopic): SubscriptionTarget => ({ kind: 'topic', id: t.id, name: t.name });

  const openTopic = (t: CatalogTopic) =>
    router.push({ pathname: '/questions/topic/[topicId]', params: { topicId: String(t.id), name: t.name, subject: name } });

  const toggle = (target: SubscriptionTarget, subscribed: boolean) => (subscribed ? setConfirm(target) : subs.subscribe(target));

  const items = topics.data?.items ?? [];

  return (
    <ScrollScreen
      contentClassName="gap-4 pt-1"
      refreshing={(subject.isFetching || topics.isFetching) && !subject.isLoading}
      onRefresh={() => {
        subject.refetch();
        topics.refetch();
      }}>
      <NavHeader backLabel="Subjects" />

      {subject.isLoading ? (
        <Skeleton height={190} radius={28} />
      ) : subject.isError || !subject.data ? (
        <EmptyState icon="alert" title="Couldn't load this subject." actionLabel="Try again" onAction={subject.refetch} />
      ) : (
        <CatalogHero
          title={subject.data.name}
          description={subject.data.description}
          subscribed={subject.data.is_subscribed}
          loading={subs.isPending(subjectTarget)}
          onToggleSubscribe={() => toggle(subjectTarget, subject.data!.is_subscribed)}
        />
      )}

      <View className="mt-2 flex-row items-baseline justify-between">
        <AppText variant="cardTitle">Topics in this subject</AppText>
        {subject.data ? (
          <AppText variant="body" color="textTertiary">
            {plural(subject.data.topic_count, 'topic')}
          </AppText>
        ) : null}
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder={`Search topics in ${name}...`} />

      {q && !topics.isFetching ? (
        <AppText variant="caption" color="textSecondary" className="-mb-1">
          {plural(items.length, 'topic matches', 'topics match')} “{q}”
        </AppText>
      ) : null}

      {topics.isLoading || (topics.isFetching && !topics.data) ? (
        <View className="gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={84} radius={12} />
          ))}
        </View>
      ) : topics.isError ? (
        <EmptyState icon="alert" title="Couldn't load topics." actionLabel="Try again" onAction={topics.refetch} />
      ) : items.length === 0 ? (
        q ? (
          <EmptyState icon="search" title={`No topics match “${q}”`} message="Try a different keyword." actionLabel="Clear search" onAction={() => setSearch('')} />
        ) : (
          <EmptyState icon="book" title="No topics yet" message={`Topics in ${name} will appear here once they're published.`} />
        )
      ) : (
        <View className="gap-3">
          {items.map((t) => (
            <TopicTile
              key={t.id}
              topic={t}
              onPress={() => openTopic(t)}
              subscribing={subs.isPending(topicTarget(t))}
              onToggleSubscribe={() => toggle(topicTarget(t), t.is_subscribed)}
            />
          ))}
        </View>
      )}

      <ConfirmSheet
        visible={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) subs.unsubscribe(confirm);
          setConfirm(null);
        }}
        title={`Unsubscribe from ${confirm?.name ?? ''}?`}
        message={
          confirm?.kind === 'subject'
            ? 'You will no longer receive questions from this subject.'
            : 'You will no longer get questions from this topic in your daily feed.'
        }
        confirmLabel="Unsubscribe"
      />
    </ScrollScreen>
  );
}
