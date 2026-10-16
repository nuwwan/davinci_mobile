import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { PageHeader, ScrollScreen } from '@/components/layout';
import { AttemptHistoryCard } from '@/components/question/attempt-history-card';
import { BreakdownCard, WeekStreak } from '@/components/stats';
import { AppText, Badge, Button, Card, EmptyState, MetricCard, ProgressBar, Skeleton, StatTile } from '@/components/ui';
import { isNetworkError } from '@/lib/api-error';
import { difficultyMeta, preferenceMeta } from '@/lib/question';
import { useAttemptHistory } from '@/src/features/questions/useAttemptHistory';
import { useLearnerStats } from '@/src/features/stats/useLearnerStats';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * Stats (Figma H1 loading · H2 overview · H2b scrolled · H3 no data).
 * Data: GET /learner/stats — contract in docs/api/learner-stats.md.
 */
export default function StatsScreen() {
  const router = useRouter();
  const { stats, isLoading, isFetching, isError, error, refetch } = useLearnerStats();
  const history = useAttemptHistory();

  const refreshAll = () => {
    refetch();
    history.refetch();
  };

  const header = <PageHeader title="Stats" subtitle="Your learning overview" />;

  // H1 — loading
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

  // H3 — no data
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

  // H2 / H2b — overview
  const pref = preferenceMeta(stats.difficultyPreference);
  const byDifficulty = stats.byDifficulty.map((d) => ({ ...d, label: difficultyMeta(d.level).label }));

  return (
    <ScrollScreen refreshing={isFetching} onRefresh={refreshAll} contentClassName="gap-3">
      <View className="mb-2">{header}</View>

      {/* KPI tiles (Figma H2) */}
      <View className="flex-row gap-3">
        <StatTile value={stats.answered} label="Questions answered" />
        <StatTile value={stats.totalScore} label="Total score" color="accent" />
      </View>

      {/* Accuracy */}
      <MetricCard
        title="Accuracy"
        value={`${Math.round(stats.accuracy * 100)}%`}
        size="lg"
        caption={
          stats.accuracySampleSize
            ? `Based on your last ${stats.accuracySampleSize} answers`
            : `${stats.correct} correct out of ${stats.answered}`
        }>
        <ProgressBar progress={stats.accuracy} />
      </MetricCard>

      {/* Streak + this week */}
      <MetricCard
        title="Streak"
        value={plural(stats.currentStreak, 'day')}
        valueColor="accent"
        aside={`Best: ${plural(stats.bestStreak, 'day')}`}>
        <WeekStreak days={stats.week} />
      </MetricCard>

      <MetricCard title="Learning time" value={`${stats.learningMinutes} min`} caption={stats.learningPeriod} />

      {/* Difficulty preference (Figma H2b) */}
      <Card>
        <AppText variant="cardTitle">Difficulty preference</AppText>
        <Badge label={pref.label} tone={pref.tone} className="mt-2" />
        <AppText variant="hint" color="textTertiary" className="mt-2">
          You can change this in your profile.
        </AppText>
      </Card>

      {/* By subject (Figma H2b) + extra breakdowns from screens.txt */}
      <BreakdownCard
        title="By subject"
        rows={stats.bySubject}
        emptyMessage="Your accuracy per subject will appear here as you answer questions."
      />
      <BreakdownCard title="By sub-area" rows={stats.bySubArea} />
      <BreakdownCard title="By difficulty" rows={byDifficulty} />

      {/* Attempt history */}
      <Card className="gap-4">
        <AppText variant="cardTitle">Attempt history</AppText>

        {history.isLoading ? (
          <View className="gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} height={88} />
            ))}
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
                You&apos;ve seen all your attempts
              </AppText>
            )}
          </View>
        )}
      </Card>

      {__DEV__ && stats.sourceNote ? (
        <AppText variant="hint" color="textTertiary" center>
          {stats.sourceNote}
        </AppText>
      ) : null}
    </ScrollScreen>
  );
}
