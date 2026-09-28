import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { Screen } from '@/components/layout';
import { OptionButton, type OptionVisualState } from '@/components/question';
import { ExplanationPanel } from '@/components/question/explanation-panel';
import { AppText, Badge, Button } from '@/components/ui';
import {
  useGetDailyQuestionQuery,
  useSubmitAttemptMutation,
  type AttemptResult,
  type QuestionOption,
  type QuestionResponse,
} from '@/src/api/enhanced';
import { useAppSelector } from '@/src/store/hooks';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/src/features/auth/authSlice';
import { useTheme } from '@/src/theme';

// ─── helpers ──────────────────────────────────────────────────────────────────

const DIFFICULTY_LABEL: Record<number, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
const DIFFICULTY_TONE: Record<number, 'success' | 'streak' | 'error'> = {
  1: 'success',
  2: 'streak',
  3: 'error',
};

function difficultyLabel(level: number) {
  return DIFFICULTY_LABEL[level] ?? `Level ${level}`;
}
function difficultyTone(level: number): 'success' | 'streak' | 'error' {
  return DIFFICULTY_TONE[level] ?? 'error';
}

/** Map each option to its visual state given the current UI phase. */
function resolveOptionState(
  opt: QuestionOption,
  selected: number | null,
  result: AttemptResult | null,
): OptionVisualState {
  const i = opt.index;
  if (!result) {
    // Pre-submit
    return selected === i ? 'selected' : 'default';
  }
  // Post-submit / revealed
  if (i === result.correct_answer_index) return 'correct';
  if (i === result.selected_option_index && !result.is_correct) return 'wrong';
  return 'dimmed';
}

// ─── sub-components ───────────────────────────────────────────────────────────

function EmptyDay() {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-6">
      <AppText variant="sectionHeading" color="textSecondary" center>
        No question today
      </AppText>
      <AppText variant="body" color="textTertiary" center>
        The admin hasn&apos;t published today&apos;s daily question yet. Check back soon!
      </AppText>
    </View>
  );
}

function ResultBanner({ result }: { result: AttemptResult }) {
  const correct = result.is_correct;
  return (
    <View
      className={`rounded-xl border p-4 ${
        correct
          ? 'border-correct-border bg-correct-bg'
          : 'border-wrong-border bg-wrong-bg'
      }`}>
      <AppText variant="sectionHeading" color={correct ? 'correct' : 'wrong'} center>
        {correct ? '🎉 Correct!' : '✗ Incorrect'}
      </AppText>
      <AppText variant="metadata" color={correct ? 'correct' : 'wrong'} center className="mt-1">
        {result.score > 0
          ? `+${result.score} points`
          : result.score < 0
            ? `${result.score} points`
            : 'No points'}
      </AppText>
    </View>
  );
}

type QuestionCardProps = {
  question: QuestionResponse;
  alreadyAnswered: boolean;
  correctAnswerIndex?: number; // provided when already answered
};

function QuestionCard({ question, alreadyAnswered, correctAnswerIndex }: QuestionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();

  const isRevealed = result !== null || alreadyAnswered;
  const canSubmit = selectedIndex !== null && !isRevealed && !isSubmitting;

  async function handleSubmit() {
    if (selectedIndex === null) return;
    try {
      const res = await submitAttempt({
        attemptSubmit: {
          question_id: question.id,
          selected_option_index: selectedIndex,
        },
      }).unwrap();
      setResult(res);
    } catch {
      // Error is surfaced via the mutation's isError — nothing extra needed
    }
  }

  return (
    <View className="gap-4">
      {/* Options */}
      <View className="gap-2">
        {question.options.map((opt) => {
          let state: OptionVisualState;
          if (alreadyAnswered && correctAnswerIndex !== undefined) {
            state = opt.index === correctAnswerIndex ? 'correct' : 'dimmed';
          } else {
            state = resolveOptionState(opt, selectedIndex, result);
          }

          return (
            <OptionButton
              key={opt.index}
              index={opt.index}
              label={opt.text ?? opt.alt_text ?? `Option ${opt.index + 1}`}
              state={state}
              onPress={() => {
                if (!isRevealed) setSelectedIndex(opt.index);
              }}
              disabled={isRevealed}
            />
          );
        })}
      </View>

      {/* Submit button */}
      {!isRevealed && (
        <Button
          title={isSubmitting ? 'Submitting…' : 'Submit answer'}
          loading={isSubmitting}
          disabled={!canSubmit}
          onPress={handleSubmit}
          fullWidth
        />
      )}

      {/* Result banner */}
      {result && <ResultBanner result={result} />}

      {/* Already-answered notice */}
      {alreadyAnswered && !result && (
        <View className="rounded-lg border border-border bg-surface-2 p-3">
          <AppText variant="metadata" color="textSecondary" center>
            You&apos;ve already answered today&apos;s question.
          </AppText>
        </View>
      )}

      {/* Explanation */}
      {(result || alreadyAnswered) && question.explanation?.text ? (
        <ExplanationPanel
          title="Explanation"
          tone={result?.is_correct || alreadyAnswered ? 'correct' : 'neutral'}>
          <AppText variant="body" color="textPrimary">
            {question.explanation.text}
          </AppText>
        </ExplanationPanel>
      ) : null}
    </View>
  );
}

// ─── main screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { colors } = useTheme();

  const {
    data: daily,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDailyQuestionQuery(undefined, { skip: !isAuthenticated });

  const firstName = user?.first_name ?? 'there';
  const question = daily?.question;

  return (
    <Screen>
      <ScrollView
        contentContainerClassName="grow gap-5 p-4 pb-16"
        showsVerticalScrollIndicator={false}>

        {/* ── Greeting ── */}
        <View className="gap-1">
          <AppText variant="screenTitle" color="textPrimary">
            Hi, {firstName} 👋
          </AppText>
          <AppText variant="body" color="textSecondary">
            Here&apos;s your daily question
          </AppText>
        </View>

        {/* ── Loading ── */}
        {isLoading && (
          <View className="flex-1 items-center justify-center py-16">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {/* ── Error ── */}
        {isError && !isLoading && (
          <View className="items-center gap-4 py-10">
            <AppText variant="body" color="textSecondary" center>
              Couldn&apos;t load today&apos;s question.
            </AppText>
            {__DEV__ && error && (
              <AppText variant="metadata" color="textTertiary" center>
                {'status' in error
                  ? `${error.status}: ${JSON.stringify(error.data)}`
                  : error.message}
              </AppText>
            )}
            <Button title="Try again" variant="outline" onPress={refetch} />
          </View>
        )}

        {/* ── No question published ── */}
        {!isLoading && !isError && !question && <EmptyDay />}

        {/* ── Question card ── */}
        {!isLoading && !isError && question && (
          <View className="rounded-2xl border border-border bg-surface p-4 shadow-sm gap-4">
            {/* Header row */}
            <View className="flex-row items-start justify-between gap-2">
              <AppText variant="sectionHeading" color="textPrimary" className="flex-1">
                {question.title}
              </AppText>
              <Badge
                label={difficultyLabel(question.difficulty_level)}
                tone={difficultyTone(question.difficulty_level)}
              />
            </View>

            {/* Question body text (content) */}
            {question.content?.text ? (
              <AppText variant="body" color="textSecondary">
                {question.content.text}
              </AppText>
            ) : null}

            <QuestionCard
              question={question}
              alreadyAnswered={daily.is_answered}
              correctAnswerIndex={
                daily.is_answered ? question.correct_answer_index : undefined
              }
            />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
