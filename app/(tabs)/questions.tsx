import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { PageHeader, ScrollScreen } from '@/components/layout';
import { QuestionListItem } from '@/components/question';
import { ChipGroup, EmptyState, SearchBar, Skeleton, type ChipOption } from '@/components/ui';
import { useListSubjectsQuery } from '@/src/api/enhanced';
import {
  useQuestionFeed,
  type DifficultyFilter,
  type StatusFilter,
} from '@/src/features/questions/useQuestionFeed';

type QuickFilter = DifficultyFilter | Exclude<StatusFilter, 'all'>;

const QUICK_FILTERS: ChipOption<QuickFilter>[] = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'answered', label: 'Answered' },
  { value: 'unanswered', label: 'Unanswered' },
];

/** Questions (Figma F1 loading · F2 list · F3 empty · F4 search empty). */
export default function QuestionsScreen() {
  const [search, setSearch] = useState('');
  const [quick, setQuick] = useState<QuickFilter>('all');
  const [subjectId, setSubjectId] = useState<number | 'all'>('all');

  const { data: subjects } = useListSubjectsQuery({ pageSize: 50 });
  const subjectOptions = useMemo<ChipOption<number | 'all'>[]>(
    () => [{ value: 'all', label: 'All subjects' }, ...(subjects?.items ?? []).map((s) => ({ value: s.id, label: s.name }))],
    [subjects]
  );
  const subjectName = (id?: number | null) => subjects?.items.find((s) => s.id === id)?.name;

  const isStatus = quick === 'answered' || quick === 'unanswered';
  const { items, isLoading } = useQuestionFeed({
    search,
    difficulty: isStatus ? 'all' : (quick as DifficultyFilter),
    status: isStatus ? (quick as StatusFilter) : 'all',
    subjectId,
  });

  const filtersActive = !!search.trim() || quick !== 'all' || subjectId !== 'all';

  return (
    <ScrollScreen contentClassName="gap-3">
      <PageHeader title="Questions" subtitle="Browse your topics" className="mb-2" />

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search questions, subjects..." />
      <ChipGroup options={QUICK_FILTERS} value={quick} onChange={setQuick} />
      {subjectOptions.length > 1 ? <ChipGroup options={subjectOptions} value={subjectId} onChange={setSubjectId} /> : null}

      {isLoading ? (
        <View className="mt-1 gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={131} />
          ))}
        </View>
      ) : items.length > 0 ? (
        <View className="mt-1 gap-3">
          {items.map((q) => (
            <QuestionListItem
              key={q.id}
              title={q.title}
              difficultyLevel={q.difficulty_level}
              subjectName={subjectName(q.subject_id)}
              tags={q.tags}
              isVerified={q.is_verified}
              isAnswered={q.is_answered}
            />
          ))}
        </View>
      ) : filtersActive ? (
        <EmptyState
          className="flex-1 justify-center"
          icon="search"
          title={search.trim() ? `No results for "${search.trim()}"` : 'No matching questions'}
          message="Try a different keyword or remove filters."
          actionLabel="Clear search"
          onAction={() => {
            setSearch('');
            setQuick('all');
            setSubjectId('all');
          }}
        />
      ) : (
        <EmptyState
          className="flex-1 justify-center"
          icon="book"
          title="No questions yet"
          message="Questions will appear here once they're published by your instructor."
        />
      )}
    </ScrollScreen>
  );
}
