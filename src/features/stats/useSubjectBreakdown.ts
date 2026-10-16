import { useEffect, useMemo, useState } from 'react';

import { davinciApi, useListSubjectsQuery, type AttemptHistoryItem } from '@/src/api/enhanced';
import { useAppDispatch } from '@/src/store/hooks';

const MAX_LOOKUPS = 50;

export type DerivedBreakdown = { key: string; label: string; attempted: number; correct: number; accuracy: number };

/**
 * Fallback "By subject" breakdown built client-side from attempt history: looks up each
 * attempted question (GET /questions/{id}, cached by RTK) to learn its subject.
 * Only used while GET /learner/stats is unavailable.
 */
export function useSubjectBreakdown(items: AttemptHistoryItem[] | undefined) {
  const dispatch = useAppDispatch();
  const [subjectByQuestion, setSubjectByQuestion] = useState<Record<string, number | null>>({});
  const { data: subjects } = useListSubjectsQuery({ pageSize: 100 }, { skip: !items?.length });

  useEffect(() => {
    if (!items?.length) return;
    const ids = [...new Set(items.map((i) => i.question_id))]
      .filter((id) => !(id in subjectByQuestion))
      .slice(0, MAX_LOOKUPS);
    if (!ids.length) return;

    let cancelled = false;
    Promise.all(
      ids.map(async (id) => {
        const sub = dispatch(davinciApi.endpoints.getQuestion.initiate({ questionId: id }));
        try {
          const q = await sub.unwrap();
          return [id, q.subject_id ?? null] as const;
        } catch {
          return [id, null] as const;
        } finally {
          sub.unsubscribe();
        }
      })
    ).then((entries) => {
      if (!cancelled) setSubjectByQuestion((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, dispatch]);

  return useMemo<DerivedBreakdown[]>(() => {
    if (!items?.length) return [];
    const groups = new Map<number, { attempted: number; correct: number }>();
    for (const a of items) {
      const sid = subjectByQuestion[a.question_id];
      if (sid == null) continue;
      const g = groups.get(sid) ?? { attempted: 0, correct: 0 };
      g.attempted += 1;
      if (a.is_correct) g.correct += 1;
      groups.set(sid, g);
    }
    return [...groups.entries()]
      .map(([sid, g]) => ({
        key: `s${sid}`,
        label: subjects?.items.find((s) => s.id === sid)?.name ?? `Subject ${sid}`,
        attempted: g.attempted,
        correct: g.correct,
        accuracy: g.attempted ? g.correct / g.attempted : 0,
      }))
      .sort((a, b) => b.attempted - a.attempted);
  }, [items, subjectByQuestion, subjects]);
}
