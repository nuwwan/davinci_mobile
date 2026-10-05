import { useMemo } from 'react';

import type { QuestionResponse } from '@/src/api/enhanced';

export type QuestionFeedItem = QuestionResponse & { is_answered?: boolean };

export type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';
export type StatusFilter = 'all' | 'answered' | 'unanswered';

export type QuestionFeedFilters = {
  search: string;
  difficulty: DifficultyFilter;
  status: StatusFilter;
  subjectId: number | 'all';
};

const LEVELS: Record<Exclude<DifficultyFilter, 'all'>, (lvl: number) => boolean> = {
  easy: (l) => l === 1,
  medium: (l) => l === 2,
  hard: (l) => l >= 3,
};

/**
 * Questions tab data source.
 *
 * TODO(api): the backend has no learner-facing question list yet (only /admin/questions and
 * /creator/questions). Swap `source` for that query when it exists — filtering below stays
 * client-side until the endpoint supports `search` / `difficulty` / `subject_id` params.
 */
export function useQuestionFeed(filters: QuestionFeedFilters) {
  const source: QuestionFeedItem[] = [];
  const isLoading = false;
  const isError = false;

  const items = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return source.filter((item) => {
      if (q && !`${item.title} ${(item.tags ?? []).join(' ')}`.toLowerCase().includes(q)) return false;
      if (filters.difficulty !== 'all' && !LEVELS[filters.difficulty](item.difficulty_level)) return false;
      if (filters.status === 'answered' && !item.is_answered) return false;
      if (filters.status === 'unanswered' && item.is_answered) return false;
      if (filters.subjectId !== 'all' && item.subject_id !== filters.subjectId) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.difficulty, filters.status, filters.subjectId]);

  return { items, total: source.length, isLoading, isError, refetch: () => {} };
}
