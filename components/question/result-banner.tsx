import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';

/** Post-submit verdict (Figma E3): "🎉 Correct! / +10 points" or "✗ Incorrect / 0 points". */
export function ResultBanner({ isCorrect, score }: { isCorrect: boolean; score: number }) {
  const color = isCorrect ? 'success' : 'error';
  const points =
    score > 0 ? `+${score} points` : score < 0 ? `−${Math.abs(score)} points` : isCorrect ? 'No points awarded' : '0 points';
  return (
    <View
      accessibilityRole="alert"
      className={cn(
        'items-center rounded-md border px-4 py-2.5',
        isCorrect ? 'border-success-border bg-success-bg' : 'border-error-border bg-error-bg'
      )}>
      <AppText variant="section" color={color} center>
        {isCorrect ? '🎉 Correct!' : '✗ Incorrect'}
      </AppText>
      <AppText variant="label" color={color} center className="mt-0.5">
        {points}
      </AppText>
    </View>
  );
}
