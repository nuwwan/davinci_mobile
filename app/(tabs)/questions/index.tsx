import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { SubjectResultRow, SubjectTile, TopicResultRow } from '@/components/catalog';
import { PageHeader, ScrollScreen } from '@/components/layout';
import { AppText, EmptyState, SearchBar, Skeleton } from '@/components/ui';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { isNetworkError } from '@/lib/api-error';
import { useListCatalogSubjectsQuery, useSearchCatalogQuery, type CatalogSubject, type CatalogTopic } from '@/src/api/catalog';

const MIN_QUERY = 2;

function pairs<T>(items: T[]) {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += 2) out.push(items.slice(i, i + 2));
  return out;
}

/** Questions tab root — Subjects grid + subject/topic search (Figma Q1 · Q2 · Q3). */
export default function SubjectsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const q = useDebouncedValue(search.trim());
  const searching = q.length >= MIN_QUERY;

  const subjects = useListCatalogSubjectsQuery({});
  const results = useSearchCatalogQuery({ q }, { skip: !searching });

  const openSubject = (s: Pick<CatalogSubject, 'id' | 'name'>) =>
    router.push({ pathname: '/questions/subject/[subjectId]', params: { subjectId: String(s.id), name: s.name } });
  const openTopic = (t: Pick<CatalogTopic, 'id' | 'name' | 'subject_name'>) =>
    router.push({ pathname: '/questions/topic/[topicId]', params: { topicId: String(t.id), name: t.name, subject: t.subject_name } });

  return (
    <ScrollScreen
      contentClassName="gap-4"
      refreshing={(searching ? results.isFetching : subjects.isFetching) && !subjects.isLoading}
      onRefresh={searching ? results.refetch : subjects.refetch}>
      <PageHeader title="Subjects" subtitle="Browse by subject area" />
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search subjects and topics..." />

      {searching ? (
        <SearchResults
          query={q}
          loading={results.isFetching && !results.data}
          error={results.isError}
          subjects={results.data?.subjects ?? []}
          topics={results.data?.topics ?? []}
          onClear={() => setSearch('')}
          onRetry={results.refetch}
          onSubject={openSubject}
          onTopic={openTopic}
        />
      ) : subjects.isLoading ? (
        <View className="gap-3">
          {[0, 1, 2].map((i) => (
            <View key={i} className="flex-row gap-3">
              <View className="flex-1"><Skeleton height={165} /></View>
              <View className="flex-1"><Skeleton height={165} /></View>
            </View>
          ))}
        </View>
      ) : subjects.isError ? (
        <EmptyState
          className="flex-1 justify-center"
          icon={isNetworkError(subjects.error) ? 'wifiOff' : 'alert'}
          title="Couldn't load subjects."
          message={isNetworkError(subjects.error) ? 'Check your internet connection and try again.' : 'Please try again.'}
          actionLabel="Try again"
          onAction={subjects.refetch}
        />
      ) : !subjects.data?.items.length ? (
        <EmptyState
          className="flex-1 justify-center"
          icon="book"
          title="No subjects yet"
          message="Subjects will appear here once they're published."
        />
      ) : (
        <View className="gap-3">
          {pairs(subjects.data.items).map((row) => (
            <View key={row[0].id} className="flex-row gap-3">
              {row.map((s) => (
                <SubjectTile key={s.id} subject={s} onPress={() => openSubject(s)} />
              ))}
              {row.length === 1 ? <View className="flex-1" /> : null}
            </View>
          ))}
        </View>
      )}
    </ScrollScreen>
  );
}

function SearchResults({
  query,
  loading,
  error,
  subjects,
  topics,
  onClear,
  onRetry,
  onSubject,
  onTopic,
}: {
  query: string;
  loading: boolean;
  error: boolean;
  subjects: CatalogSubject[];
  topics: CatalogTopic[];
  onClear: () => void;
  onRetry: () => void;
  onSubject: (s: CatalogSubject) => void;
  onTopic: (t: CatalogTopic) => void;
}) {
  if (loading) {
    return (
      <View className="gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} height={68} radius={12} />
        ))}
      </View>
    );
  }
  if (error) {
    return (
      <EmptyState className="flex-1 justify-center" icon="alert" title="Search failed." message="Please try again." actionLabel="Try again" onAction={onRetry} />
    );
  }
  if (!subjects.length && !topics.length) {
    return (
      <EmptyState
        className="flex-1 justify-center"
        icon="search"
        title={`No results for “${query}”`}
        message="Try another subject or topic name."
        actionLabel="Clear search"
        onAction={onClear}
      />
    );
  }
  return (
    <View className="gap-5">
      {subjects.length ? (
        <View className="gap-2">
          <AppText variant="overline" color="textTertiary">Subjects</AppText>
          {subjects.map((s) => (
            <SubjectResultRow key={s.id} subject={s} onPress={() => onSubject(s)} />
          ))}
        </View>
      ) : null}
      {topics.length ? (
        <View className="gap-3">
          <AppText variant="overline" color="textTertiary">Topics</AppText>
          {topics.map((t) => (
            <TopicResultRow key={t.id} topic={t} onPress={() => onTopic(t)} />
          ))}
        </View>
      ) : null}
    </View>
  );
}
