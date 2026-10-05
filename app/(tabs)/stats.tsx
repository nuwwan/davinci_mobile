import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { PageHeader, ScrollScreen } from '@/components/layout';
import { SubjectProgressRow, WeekStreak, weekFromStreak } from '@/components/stats';
import { AttemptHistoryCard } from '@/components/question/attempt-history-card';
import { AppText, Badge, Button, Card, EmptyState, MetricCard, ProgressBar, Skeleton, StatTile } from '@/components/ui';
import { isNetworkError } from '@/lib/api-error';
import { preferenceMeta } from '@/lib/question';
import { useLearnerStats } from '@/src/features/stats/useLearnerStats';
import { useAttemptHistory } from '@/src/features/questions/useAttemptHistory';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Stats (Figma H1 loading · H2 overview · H3 no data). */
export default function StatsScreen() {
  const router = useRouter();
  const { stats, isLoading, isFetching, isError, error, refetch } = useLearnerStats();
  const history = useAttemptHistory();

  const header = <PageHeader title="Stats" subtitle="Your learning overview" />;

  if (isLoading) {
    return (
      <ScrollScreen scrollEnabled={false}>
        {header}
        <View className="gap-3">
          <Skeleton height={92} />
          <Skeleton height={140} />
          <Skeleton height={174} />
        </View>
      </ScrollScreen>
    );
  }

  if (isError || !stats) {
    return (
      <ScrollScreen refreshing={isFetching} onRefresh={refetch}>
        {header}
        <EmptyState
          className="flex-1 justify-center"
          icon={isNetworkError(error) ? 'wifiOff' : 'alert'}
          title="Couldn't load your stats."
          message={isNetworkError(error) ? 'Check your internet connection and try again.' : 'Please try again.'}
          actionLabel="Try again"
          onAction={refetch}
        />
      </ScrollScreen>
    );
  }

  if (!stats.hasActivity) {
    return (
      <ScrollScreen refreshing={isFetching} onRefresh={refetch}>
        {header}
        <EmptyState
          className="flex-1 justify-center"
          icon="chart"
          iconSize={64}
          title="No stats yet"
          message="Answer your first daily question to start tracking your progress."
          actionLabel="Go to today's question"
          actionVariant="primary"
          onAction={() => router.navigate('/(tabs)')}
        />
      </ScrollScreen>
    );
  }

  const pref = preferenceMeta(stats.difficultyPreference);
  const accuracy = stats.answered ? (stats.correct ?? 0) / stats.answered : undefined;

  return (
    <ScrollScreen refreshing={isFetching} onRefresh={refetch} contentClassName="gap-3">
      <View className="mb-2">{header}</View>

      {/* KPI tiles */}
      <View className="flex-row gap-3">
        {stats.answered !== undefined ? (
          <StatTile value={stats.answered} label="Questions answered" />
        ) : (
          <StatTile value={stats.bestStreak} label="Best streak" />
        )}
        <StatTile value={stats.currentStreak} label="Day streak 🔥" color="accent" />
      </View>

      {accuracy !== undefined ? (
        <MetricCard
          title="Accuracy"
          value={`${Math.round(accuracy * 100)}%`}
          size="lg"
          caption={`${stats.correct} correct out of ${stats.answered}`}>
          <ProgressBar progress={accuracy} />
        </MetricCard>
      ) : null}

      <MetricCard
        title="Streak"
        value={plural(stats.currentStreak, 'day')}
        valueColor="accent"
        aside={`Best: ${plural(stats.bestStreak, 'day')}`}>
        <WeekStreak days={weekFromStreak(stats.currentStreak, false)} />
      </MetricCard>

      <MetricCard title="Learning time" value={`${stats.learningMinutes} min`} caption="total" />

      <Card>
        <AppText variant="cardTitle">Difficulty preference</AppText>
        <Badge label={pref.label} tone={pref.tone} className="mt-2" />
        <AppText variant="hint" color="textTertiary" className="mt-2">
          You can change this in your profile.
        </AppText>
      </Card>

      {stats.bySubject?.length ? (
        <Card className="gap-4">
          <AppText variant="cardTitle">By subject</AppText>
          {stats.bySubject.map((s) => (
            <SubjectProgressRow key={s.subjectId} label={s.name} value={s.attempted ? s.correct / s.attempted : 0} />
          ))}
        </Card>
      ) : null}

      {/* ── Attempt history ── */}
      <Card className="gap-4">
        <AppText variant="cardTitle">Attempt history</AppText>

        {history.isLoading ? (
          <View className="gap-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} height={88} />)}
          </View>
        ) : history.items.length === 0 ? (
          <AppText variant="body" color="textTertiary">
            No attempts recorded yet.
          </AppText>
        ) : (
          <View className="gap-3">
            {history.items.map((item) => (
              <AttemptHistoryCard key={item.attempt_id} item={item} />
            ))}

            {history.hasMore ? (
              <Button
                title="Load more"
                variant="outline"
                size="sm"
                loading={history.isFetching}
                onPress={history.loadMore}
              />
            ) : (
              <AppText variant="hint" color="textTertiary" center>
                You've seen all your attempts
              </AppText>
            )}
          </View>
        )}
      </Card>
    </ScrollScreen>
  );
}
