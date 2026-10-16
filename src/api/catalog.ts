/**
 * Learner catalog — Questions tab (Figma Q1–Q11):
 * Subjects → Topics (sub-areas) → Questions by difficulty.
 *
 * Types and plain hooks come from the generated client (`npm run gen:api`).
 * Only the paginated topic-question list is hand-written (infinite query).
 * Contract: docs/api/learner-catalog.md. Subscribe / unsubscribe reuse the existing
 * /learner/subscriptions/* endpoints (see enhanced.ts).
 *
 * Tags: every query provides 'Learner' so the existing subscription mutations
 * (which invalidate 'Learner') refresh `is_subscribed` everywhere; topic questions
 * also provide 'AttemptHistory' so a new attempt refreshes `my_attempt`.
 */
import { baseApi } from './baseApi';
import type {
  CatalogSearchResponse,
  CatalogSubject,
  CatalogTopic,
  CatalogTopicDetail,
  DifficultyCount,
  MyAttemptSummary,
  TopicQuestion,
} from './generated';

export type {
  CatalogSearchResponse,
  CatalogSubject,
  CatalogTopic,
  CatalogTopicDetail,
  DifficultyCount,
  MyAttemptSummary,
  TopicQuestion,
};
export {
  useListCatalogSubjectsQuery,
  useSearchCatalogQuery,
  useGetCatalogSubjectQuery,
  useListSubjectTopicsQuery,
  useGetCatalogTopicQuery,
} from './generated';

export type Paginated<T> = { items: T[]; page: number; page_size: number; total: number };

const PAGE_SIZE = 20;

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listTopicQuestionsInfinite: build.infiniteQuery<
      Paginated<TopicQuestion>,
      { topicId: number; difficultyLevel: number },
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (last) => (last.page * last.page_size < last.total ? last.page + 1 : undefined),
      },
      query: ({ queryArg, pageParam }) => ({
        url: `/learner/catalog/topics/${queryArg.topicId}/questions`,
        params: { difficulty_level: queryArg.difficultyLevel, page: pageParam, page_size: PAGE_SIZE },
      }),
      providesTags: ['AttemptHistory', 'Learner'],
    }),
  }),
  overrideExisting: false,
});

export const useListTopicQuestionsInfiniteQuery = catalogApi.useListTopicQuestionsInfiniteInfiniteQuery;
