import { useState } from 'react';
import { View } from 'react-native';

import { DifficultyBadge } from '@/components/question/difficulty-badge';
import { ExplanationPanel } from '@/components/question/explanation-panel';
import { ImageQuestion } from '@/components/question/image-question';
import { OptionButton, type OptionVisualState } from '@/components/question/option-button';
import { ResultBanner } from '@/components/question/result-banner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InlineAlert } from '@/components/ui/inline-alert';
import { AppText } from '@/components/ui/text';
import { useToast } from '@/components/ui/toast-context';
import { useSubmitAttemptMutation, type AttemptResult, type QuestionResponse } from '@/src/api/enhanced';

function optionState(
  index: number,
  selected: number | null,
  result: AttemptResult | null,
  answeredCorrectIndex: number | null
): OptionVisualState {
  if (answeredCorrectIndex !== null) return index === answeredCorrectIndex ? 'correct' : 'dimmed';
  if (!result) return selected === index ? 'selected' : 'default';
  if (index === result.correct_answer_index) return 'correct';
  if (index === result.selected_option_index && !result.is_correct) return 'wrong';
  return 'dimmed';
}

export type DailyQuestionCardProps = {
  question: QuestionResponse;
  /** Server says today's question was already answered (Figma E4). */
  alreadyAnswered?: boolean;
  onAnswered?: (result: AttemptResult) => void;
  /** Called when the user taps "Try another question" after an attempt. */
  onRefetch?: () => void;
};

/**
 * The daily MCQ flow in one reusable unit (Figma E2 → E3 / E4):
 * pick an option → Submit → options lock into correct / wrong / dimmed, verdict banner,
 * then the explanation card below.
 */
export function DailyQuestionCard({ question, alreadyAnswered = false, onAnswered, onRefetch }: DailyQuestionCardProps) {
  const { showToast } = useToast();
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [submit, { isLoading }] = useSubmitAttemptMutation();

  const locked = alreadyAnswered || result !== null;
  const answeredCorrectIndex = alreadyAnswered && !result ? question.correct_answer_index : null;

  async function handleSubmit() {
    if (selected === null) return;
    try {
      const res = await submit({
        attemptSubmit: { question_id: question.id, selected_option_index: selected },
      }).unwrap();
      setResult(res);
      onAnswered?.(res);
    } catch {
      showToast("Couldn't submit your answer. Try again.", 'error');
    }
  }

  const explanationText =
    question.explanation?.text ?? (typeof result?.explanation === 'string' ? result.explanation : null);
  const showExplanation = locked && (explanationText || question.explanation?.image_url);

  return (
    <View className="gap-4">
      <Card variant="hero" className="gap-4">
        {/* Title row */}
        <View className="flex-row items-start gap-2">
          <AppText variant="cardTitle" className="flex-1" accessibilityRole="header">
            {question.title}
          </AppText>
          <DifficultyBadge level={question.difficulty_level} />
        </View>

        {question.content?.text ? (
          <AppText variant="question" color="textSecondary">
            {question.content.text}
          </AppText>
        ) : null}

        {question.content?.image_url ? (
          <ImageQuestion uri={question.content.image_url} alt={question.content.alt_text} />
        ) : null}

        {/* Options */}
        <View accessibilityRole="radiogroup" className="gap-2">
          {question.options.map((opt) => (
            <OptionButton
              key={opt.index}
              index={opt.index}
              label={opt.text ?? opt.alt_text ?? `Option ${opt.index + 1}`}
              state={optionState(opt.index, selected, result, answeredCorrectIndex)}
              disabled={locked || isLoading}
              onPress={() => setSelected(opt.index)}
            />
          ))}
        </View>

        {/* Footer: submit → verdict / already-answered notice */}
        {!locked ? (
          <Button title="Submit answer" onPress={handleSubmit} disabled={selected === null} loading={isLoading} />
        ) : result ? (
          <ResultBanner isCorrect={result.is_correct} score={result.score} />
        ) : (
          <InlineAlert tone="neutral" center message="You've already answered today's question." className="py-3" />
        )}
      </Card>

      {showExplanation ? (
        <>
        <ExplanationPanel
          text={explanationText}
          imageUrl={question.explanation?.image_url}
          tone={result ? (result.is_correct ? 'success' : 'neutral') : 'success'}
        />
        <Button
          title="Try another question"
          variant="outline"
          icon="refresh"
          onPress={onRefetch}
        />
        </>
      ) : null}

      {/* {result !== null && onRefetch ? (
        <Button
          title="Try another question"
          variant="outline"
          icon="refresh"
          onPress={onRefetch}
        />
      ) : null} */}
    </View>
  );
}
