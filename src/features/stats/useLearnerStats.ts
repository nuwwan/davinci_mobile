import { useMemo } from 'react';

import { useGetAttemptHistoryQuery, useGetMyProfileQuery, type AttemptHistoryItem } from '@/src/api/enhanced';
import { useGetMyStatsQuery, type LearnerStatsResponse } from '@/src/api/stats';
import type { DayStatus } from '@/components/stats';
import { describeError, isNetworkError } from '@/lib/api-error';
import { selectIsAuthenticated } from '@/src/features/auth/authSlice';
import { useAppSelector } from '@/src/store/hooks';
import { useSubjectBreakdown } from './useSubjectBreakdown';

export type StatBreakdown = { key: string; label: string; attempted: number; correct: number; accuracy: number };

/** Screen-facing view model for the Stats tab (Figma H2 / H2b). */
export type LearnerStats = {
  answered: number;
  correct: number;
  accuracy: number;
  totalScore: number;
  /** Set when accuracy is computed from a sample (fallback with > 100 attempts). */
  accuracySampleSize?: number;
  currentStreak: number;
  bestStreak: number;
  week: DayStatus[];
  learningMinutes: number;
  learningPeriod: 'this month' | 'total';
  difficultyPreference: string;
  bySubject: StatBreakdown[];
  bySubArea: StatBreakdown[];
  byDifficulty: (StatBreakdown & { level: number })[];
  hasActivity: boolean;
  /** Where the numbers came from — shown in a dev-only footer. */
  source: 'stats' | 'fallback';
  sourceNote?: string;
};

const DEVICE_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
const HISTORY_SAMPLE = 100;

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const ratio = (c: number, a: number) => (a > 0 ? c / a : 0);
const byAttemptsDesc = <T extends { attempted: number }>(a: T, b: T) => b.attempted - a.attempted;

/** Local YYYY-MM-DD for a Date. */
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Defensive mapping — tolerates missing sections / fields from the backend. */
function fromStatsResponse(r: Partial<LearnerStatsResponse>): LearnerStats {
  const s = r.summary ?? ({} as Partial<LearnerStatsResponse['summary']>);
  const answered = num(s.questions_answered);
  const correct = num(s.correct_answers);
  const mapGroup = (g: { attempted?: number; correct?: number; accuracy?: number }) => {
    const attempted = num(g.attempted);
    const c = num(g.correct);
    return { attempted, correct: c, accuracy: typeof g.accuracy === 'number' ? g.accuracy : ratio(c, attempted) };
  };
  const week = r.streak?.week?.map((d) => d.status) ?? [];

  return {
    answered,
    correct,
    accuracy: typeof s.accuracy === 'number' ? s.accuracy : ratio(correct, answered),
    totalScore: num(s.total_score),
    currentStreak: num(r.streak?.current),
    bestStreak: num(r.streak?.best),
    week: week.length === 7 ? week : Array(7).fill('upcoming'),
    learningMinutes: num(r.learning_time?.this_month_minutes),
    learningPeriod: 'this month',
    difficultyPreference: r.difficulty_preference ?? 'mixed',
    bySubject: (r.by_subject ?? [])
      .map((g) => ({ key: `s${g.subject_id}`, label: g.name, ...mapGroup(g) }))
      .sort(byAttemptsDesc),
    bySubArea: (r.by_sub_area ?? [])
      .map((g) => ({ key: `a${g.sub_area_id}`, label: g.name, ...mapGroup(g) }))
      .sort(byAttemptsDesc),
    byDifficulty: [...(r.by_difficulty ?? [])]
      .sort((a, b) => a.difficulty_level - b.difficulty_level)
      .map((g) => ({ key: `d${g.difficulty_level}`, label: '', level: g.difficulty_level, ...mapGroup(g) })),
    hasActivity: answered > 0,
    source: 'stats',
  };
}

/** Week strip + current streak from attempt dates (fallback only). */
function streakFromHistory(items: AttemptHistoryItem[], now = new Date()) {
  const days = new Set(items.map((i) => dayKey(new Date(i.attempted_at))));
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayIdx = (today.getDay() + 6) % 7; // Monday = 0

  const week: DayStatus[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - todayIdx + i);
    if (i > todayIdx) return 'upcoming';
    if (days.has(dayKey(d))) return 'done';
    return i === todayIdx ? 'today' : 'missed';
  });

  let current = 0;
  const cursor = new Date(today);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1); // streak may end yesterday
  while (days.has(dayKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
  const monthSeconds = items
    .filter((i) => new Date(i.attempted_at).getTime() >= monthStart)
    .reduce((sum, i) => sum + num(i.time_taken_seconds), 0);

  return { week, current, monthMinutes: Math.floor(monthSeconds / 60) };
}

/**
 * Stats tab data.
 * Primary: GET /learner/stats (contract: docs/api/learner-stats.md).
 * Fallback (endpoint missing or failing): attempt history + /learner/me, so every
 * Figma section still renders with real numbers.
 */
export function useLearnerStats() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const statsQuery = useGetMyStatsQuery({ tz: DEVICE_TZ }, { skip: !isAuthenticated });
  const useFallback = statsQuery.isError && !isNetworkError(statsQuery.error);

  const skipFallback = !isAuthenticated || !useFallback;
  const profileQuery = useGetMyProfileQuery(undefined, { skip: skipFallback });
  const historyQuery = useGetAttemptHistoryQuery({ page: 1, pageSize: HISTORY_SAMPLE }, { skip: skipFallback });
  const historyItems = useFallback ? historyQuery.data?.items : undefined;
  const derivedBySubject = useSubjectBreakdown(historyItems);

  const fallbackStats = useMemo<LearnerStats | undefined>(() => {
    if (!useFallback || (!profileQuery.data && !historyQuery.data)) return undefined;
    const lp = profileQuery.data?.learner_profile;
    const items = historyQuery.data?.items ?? [];
    const total = historyQuery.data?.total ?? items.length;
    const correct = items.filter((i) => i.is_correct).length;
    const h = streakFromHistory(items);
    const current = Math.max(h.current, num(lp?.current_streak));

    return {
      answered: total,
      correct,
      accuracy: ratio(correct, items.length),
      accuracySampleSize: total > items.length ? items.length : undefined,
      totalScore: items.reduce((sum, i) => sum + num(i.score), 0),
      currentStreak: current,
      bestStreak: Math.max(current, num(lp?.best_streak)),
      week: h.week,
      learningMinutes: h.monthMinutes || num(lp?.total_learning_minutes),
      learningPeriod: h.monthMinutes ? 'this month' : 'total',
      difficultyPreference: lp?.difficulty_preference ?? 'mixed',
      bySubject: derivedBySubject,
      bySubArea: [],
      byDifficulty: [],
      hasActivity: total > 0 || num(lp?.best_streak) > 0,
      source: 'fallback',
      sourceNote: `GET /learner/stats failed (${describeError(statsQuery.error)}) — showing values derived from attempt history`,
    };
  }, [useFallback, profileQuery.data, historyQuery.data, derivedBySubject, statsQuery.error]);

  if (!useFallback) {
    return {
      stats: statsQuery.data ? fromStatsResponse(statsQuery.data) : undefined,
      isLoading: statsQuery.isLoading,
      isFetching: statsQuery.isFetching,
      isError: statsQuery.isError,
      error: statsQuery.error,
      refetch: statsQuery.refetch,
    };
  }

  return {
    stats: fallbackStats,
    isLoading: !fallbackStats && (profileQuery.isLoading || historyQuery.isLoading),
    isFetching: profileQuery.isFetching || historyQuery.isFetching,
    isError: !fallbackStats && profileQuery.isError && historyQuery.isError,
    error: profileQuery.error ?? historyQuery.error,
    refetch: () => {
      statsQuery.refetch();
      profileQuery.refetch();
      historyQuery.refetch();
    },
  };
}
