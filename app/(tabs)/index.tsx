import { View } from 'react-native';

import { PageHeader, ScrollScreen } from '@/components/layout';
import { DailyQuestionCard } from '@/components/question';
import { AppText, Card, EmptyState, Icon, Spinner, StatusStrip } from '@/components/ui';
import { describeError, httpStatus, isNetworkError } from '@/lib/api-error';
import { useGetDailyQuestionQuery } from '@/src/api/enhanced';
import { selectCurrentUser, selectIsAuthenticated } from '@/src/features/auth/authSlice';
import { useAppSelector } from '@/src/store/hooks';

/** Home — today's question (Figma E1 loading · E2/E3 answering · E4 answered · E5 none · E6 offline). */
export default function HomeScreen() {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data, isLoading, isFetching, isError, error, refetch } = useGetDailyQuestionQuery(undefined, {
    skip: !isAuthenticated,
  });

  const offline = isError && isNetworkError(error);
  const noQuestion = (isError && httpStatus(error) === 404) || (!isLoading && !isError && !data?.question);
  const hardError = isError && !offline && !noQuestion;

  return (
    <ScrollScreen
      top={offline ? <StatusStrip message="No internet connection" /> : null}
      refreshing={isFetching && !isLoading}
      onRefresh={refetch}>
      <PageHeader
        title={`Hi, ${user?.first_name ?? 'there'} 👋`}
        subtitle={offline || hardError ? undefined : "Here's your daily question"}
      />

      {isLoading ? (
        <Spinner className="flex-1" />
      ) : offline ? (
        <EmptyState
          className="flex-1 justify-center"
          icon="wifiOff"
          title="Couldn't load today's question."
          message="Check your internet connection and try again."
          actionLabel="Try again"
          onAction={refetch}
        />
      ) : hardError ? (
        <View className="flex-1 justify-center">
          <EmptyState
            icon="alert"
            title="Couldn't load today's question."
            message="Something went wrong on our side. Please try again."
            actionLabel="Try again"
            onAction={refetch}
          />
          {__DEV__ ? (
            <AppText variant="hint" color="textTertiary" center>
              {describeError(error)}
            </AppText>
          ) : null}
        </View>
      ) : noQuestion || !data ? (
        <Card variant="hero" className="items-center px-6 py-12">
          <Icon name="calendar" size={48} color="textTertiary" />
          <AppText variant="section" color="textSecondary" center className="mt-5">
            No question today
          </AppText>
          <AppText variant="body" color="textTertiary" center className="mt-2 max-w-[280px]">
            The admin hasn&apos;t published today&apos;s question yet. Check back soon!
          </AppText>
        </Card>
      ) : (
        <DailyQuestionCard
          key={data.daily_question_id}
          question={data.question}
          alreadyAnswered={data.is_answered}
          onRefetch={refetch}
        />
      )}
    </ScrollScreen>
  );
}
