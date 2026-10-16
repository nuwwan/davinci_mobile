import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { CatalogHero, TopicQuestionCard } from '@/components/catalog';
import { NavHeader, ScrollScreen } from '@/components/layout';
import { AppText, Button, ConfirmSheet, EmptyState, SegmentedTabs, Skeleton, type SegmentedTab } from '@/components/ui';
import { plural } from '@/lib/format';
import { difficultyMeta } from '@/lib/question';
import { useGetCatalogTopicQuery, useListTopicQuestionsInfiniteQuery } from '@/src/api/catalog';
import { useCatalogSubscription, type SubscriptionTarget } from '@/src/features/catalog/useCatalogSubscription';

/** Easy · Medium · Hard are always shown; Expert / Master only when the topic has them. */
const ALWAYS_SHOWN = [1, 2, 3];

/** Topic — questions in difficulty tabs with a subscribe button on top (Figma Q7 · Q8 · Q9 · Q10 · Q11). */
export default function TopicScreen() {
  const params = useLocalSearchParams<{ topicId: string; name?: string; subject?: string }>();
  const topicId = Number(params.topicId);

  const topic = useGetCatalogTopicQuery({ subAreaId: topicId });
  const subs = useCatalogSubscription();
  const [confirm, setConfirm] = useState(false);
  const [level, setLevel] = useState(1);

  const t = topic.data;
  const name = t?.name ?? params.name ?? 'Topic';
  const subjectName = t?.subject_name ?? params.subject ?? 'Subjects';
  const target: SubscriptionTarget = { kind: 'topic', id: topicId, name };

  const tabs = useMemo<SegmentedTab<number>[]>(() => {
    const counts = new Map((t?.difficulty_counts ?? []).map((d) => [d.difficulty_level, d.question_count]));
    return [1, 2, 3, 4, 5]
      .filter((lvl) => ALWAYS_SHOWN.includes(lvl) || (counts.get(lvl) ?? 0) > 0)
      .map((lvl) => ({ value: lvl, label: difficultyMeta(lvl).label, count: t ? counts.get(lvl) ?? 0 : undefined }));
  }, [t]);

  const questions = useListTopicQuestionsInfiniteQuery({ topicId, difficultyLevel: level }, { skip: !t });
  const items = questions.data?.pages.flatMap((p) => p.items) ?? [];
  const levelLabel = difficultyMeta(level).label;

  return (
    <ScrollScreen
      contentClassName="gap-4 pt-1"
      refreshing={(topic.isFetching || questions.isFetching) && !topic.isLoading && !questions.isFetchingNextPage}
      onRefresh={() => {
        topic.refetch();
        if (t) questions.refetch();
      }}>
      <NavHeader backLabel={subjectName} />

      {/* Q10 — loading */}
      {topic.isLoading ? (
        <View className="gap-4">
          <Skeleton height={226} radius={28} />
          <Skeleton height={40} radius={12} />
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={116} />
          ))}
        </View>
      ) : topic.isError || !t ? (
        <EmptyState className="flex-1 justify-center" icon="alert" title="Couldn't load this topic." actionLabel="Try again" onAction={topic.refetch} />
      ) : (
        <>
          <CatalogHero
            overline={t.subject_name}
            title={t.name}
            description={t.description}
            meta={`${plural(t.question_count, 'question')} · ${t.answered_count} answered · ${t.is_subscribed ? 'Subscribed' : 'Not subscribed'}`}
            subscribed={t.is_subscribed}
            loading={subs.isPending(target)}
            onToggleSubscribe={() => (t.is_subscribed ? setConfirm(true) : subs.subscribe(target))}
          />

          <SegmentedTabs tabs={tabs} value={level} onChange={setLevel} />

          {questions.isLoading || (questions.isFetching && !questions.data) ? (
            <View className="gap-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} height={116} />
              ))}
            </View>
          ) : questions.isError ? (
            <EmptyState icon="alert" title="Couldn't load questions." actionLabel="Try again" onAction={questions.refetch} />
          ) : items.length === 0 ? (
            /* Q9 — empty tab */
            <EmptyState
              icon="book"
              title={`No ${levelLabel.toLowerCase()} questions yet`}
              message={`New questions in ${t.name} will appear here once they're published.`}
            />
          ) : (
            <View className="gap-3">
              {items.map((qn) => (
                // TODO(question-detail): pass onPress to open the question (Figma G / G2) once that screen exists.
                <TopicQuestionCard key={qn.id} question={qn} />
              ))}
              {questions.hasNextPage ? (
                <Button
                  title="Load more"
                  variant="outline"
                  size="sm"
                  loading={questions.isFetchingNextPage}
                  onPress={() => questions.fetchNextPage()}
                />
              ) : (
                <AppText variant="hint" color="textTertiary" center>
                  That&apos;s all the {levelLabel.toLowerCase()} questions in {t.name}
                </AppText>
              )}
            </View>
          )}
        </>
      )}

      {/* Q11 — unsubscribe sheet */}
      <ConfirmSheet
        visible={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          subs.unsubscribe(target);
        }}
        title={`Unsubscribe from ${name}?`}
        message="You will no longer get questions from this topic in your daily feed."
        confirmLabel="Unsubscribe"
      />
    </ScrollScreen>
  );
}
