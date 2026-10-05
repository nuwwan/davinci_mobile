/**
 * Paginated attempt-history accumulator.
 *
 * Safe approach:
 *  - useEffect handles accumulation (never writes refs/state during render)
 *  - displayItems falls back to data?.items while the effect hasn't run yet,
 *    so cached responses never cause a blank-state flash
 *  - seenIds deduplicates across re-renders / strict-mode double-invocations
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { useGetAttemptHistoryQuery, type AttemptHistoryItem } from '@/src/api/enhanced';

const PAGE_SIZE = 15;

export type UseAttemptHistoryResult = {
  items: AttemptHistoryItem[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
};

export function useAttemptHistory(): UseAttemptHistoryResult {
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<AttemptHistoryItem[]>([]);
  // Tracks which attempt_ids have already been added — prevents duplicates on
  // re-renders, strict-mode double-invocations, or overlapping pages.
  const seenIds = useRef(new Set<string>());

  const { data, isLoading, isFetching, isError, refetch: rtkRefetch } = useGetAttemptHistoryQuery(
    { page, pageSize: PAGE_SIZE },
  );

  useEffect(() => {
    if (!data?.items?.length) return;

    setAccumulated((prev) => {
      const newItems = data.items.filter((item) => !seenIds.current.has(item.attempt_id));
      if (!newItems.length) return prev;
      newItems.forEach((item) => seenIds.current.add(item.attempt_id));
      // page 1 always resets the list (handles invalidation / pull-to-refresh)
      return page === 1 ? newItems : [...prev, ...newItems];
    });
  }, [data, page]);

  // While the effect hasn't run yet (e.g. data arrived from cache on this render),
  // fall back to data.items so there is never a blank frame.
  const displayItems = accumulated.length > 0 ? accumulated : (data?.items ?? []);

  const hasMore = data ? displayItems.length < data.total : true;

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) setPage((p) => p + 1);
  }, [isFetching, hasMore]);

  const refetch = useCallback(() => {
    seenIds.current.clear();
    setAccumulated([]);
    setPage(1);
    rtkRefetch();
  }, [rtkRefetch]);

  return {
    items: displayItems,
    // Only show skeleton when truly no data yet (first request, no cache)
    isLoading: isLoading && !data,
    isFetching,
    isError,
    hasMore,
    loadMore,
    refetch,
  };
}
