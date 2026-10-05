import { useGetMyProfileQuery } from '@/src/api/enhanced';
import { selectIsAuthenticated } from '@/src/features/auth/authSlice';
import { useAppSelector } from '@/src/store/hooks';

export type SubjectStat = { subjectId: number; name: string; correct: number; attempted: number };

export type LearnerStats = {
  currentStreak: number;
  bestStreak: number;
  learningMinutes: number;
  difficultyPreference: string;
  /** Not yet exposed by the API — screens hide the related cards while undefined. */
  answered?: number;
  correct?: number;
  bySubject?: SubjectStat[];
  hasActivity: boolean;
};

/**
 * View-model for the Stats tab. Today it derives from `/learner/me`; when a dedicated
 * stats endpoint lands (answered / accuracy / by-subject / by-difficulty), map it here and
 * the UI picks it up without changes.
 */
export function useLearnerStats() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const query = useGetMyProfileQuery(undefined, { skip: !isAuthenticated });
  const lp = query.data?.learner_profile;

  const stats: LearnerStats | undefined = query.data
    ? {
        currentStreak: lp?.current_streak ?? 0,
        bestStreak: lp?.best_streak ?? 0,
        learningMinutes: lp?.total_learning_minutes ?? 0,
        difficultyPreference: lp?.difficulty_preference ?? 'mixed',
        hasActivity: (lp?.best_streak ?? 0) > 0 || (lp?.total_learning_minutes ?? 0) > 0,
      }
    : undefined;

  return { ...query, stats };
}
