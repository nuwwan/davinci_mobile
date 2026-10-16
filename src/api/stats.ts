/**
 * GET /learner/stats — aggregates for the Stats tab (Figma H1 / H2 / H2b / H3).
 *
 * Hand-written until the backend endpoint is in openapi.yaml. Contract:
 * docs/api/learner-stats.md. Once `npm run gen:api` generates it, swap these types for
 * the generated ones (field names are identical) and delete this file.
 */
import { baseApi } from './baseApi';

export type StreakDayStatus = 'done' | 'missed' | 'today' | 'upcoming';

export type StatsBreakdownBase = {
  attempted: number;
  correct: number;
  /** correct / attempted, 0–1 (0 when attempted = 0). */
  accuracy: number;
  score: number;
};

export type SubjectStat = StatsBreakdownBase & { subject_id: number; name: string };
export type SubAreaStat = StatsBreakdownBase & { sub_area_id: number; subject_id: number; name: string };
export type DifficultyStat = StatsBreakdownBase & { difficulty_level: number };

export type LearnerStatsResponse = {
  summary: {
    questions_answered: number;
    correct_answers: number;
    accuracy: number;
    total_score: number;
  };
  streak: {
    current: number;
    best: number;
    /** ISO date (YYYY-MM-DD, learner's timezone) of the last answered daily question. */
    last_active_date: string | null;
    /** Exactly 7 entries, Monday → Sunday of the current week. */
    week: { date: string; status: StreakDayStatus }[];
  };
  learning_time: {
    this_month_minutes: number;
    total_minutes: number;
  };
  difficulty_preference: 'easy' | 'medium' | 'hard' | 'mixed';
  by_subject: SubjectStat[];
  by_sub_area: SubAreaStat[];
  by_difficulty: DifficultyStat[];
  /** ISO-8601 timestamp when the aggregates were computed. */
  generated_at: string;
};

export type LearnerStatsArg = {
  /** IANA timezone used for "today", the streak week and "this month". */
  tz?: string;
};

export const statsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyStats: build.query<LearnerStatsResponse, LearnerStatsArg>({
      query: ({ tz }) => ({ url: '/learner/stats', params: tz ? { tz } : undefined }),
      providesTags: ['Stats'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMyStatsQuery } = statsApi;
