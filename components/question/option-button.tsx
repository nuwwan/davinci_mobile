import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import { optionLetter } from '@/lib/question';
import type { ColorName } from '@/src/theme';

/** Figma "MCQ OPTIONS": default · selected · correct · wrong · dimmed. */
export type OptionVisualState = 'default' | 'selected' | 'correct' | 'wrong' | 'dimmed';

export type OptionButtonProps = {
  index: number;
  label: string;
  state: OptionVisualState;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
};

const STYLE: Record<
  OptionVisualState,
  { box: string; badge: string; badgeText: ColorName; label: ColorName }
> = {
  default: {
    box: 'border border-border bg-surface active:border-primary-muted active:bg-primary-light',
    badge: 'bg-surface-2',
    badgeText: 'textSecondary',
    label: 'textPrimary',
  },
  selected: {
    box: 'border-[1.5px] border-primary bg-primary-light',
    badge: 'bg-primary',
    badgeText: 'textInverse',
    label: 'textPrimary',
  },
  correct: {
    box: 'border border-success-border bg-success-bg',
    badge: 'bg-success',
    badgeText: 'textInverse',
    label: 'textPrimary',
  },
  wrong: {
    box: 'border border-error-border bg-error-bg',
    badge: 'bg-error',
    badgeText: 'textInverse',
    label: 'textPrimary',
  },
  dimmed: {
    box: 'border border-border bg-surface',
    badge: 'bg-surface-2',
    badgeText: 'textTertiary',
    label: 'textTertiary',
  },
};

const A11Y_SUFFIX: Partial<Record<OptionVisualState, string>> = {
  selected: ', selected',
  correct: ', correct answer',
  wrong: ', your answer, incorrect',
};

/** One MCQ answer row: 28pt letter badge + label, min 52pt, radius 12. */
export function OptionButton({ index, label, state, onPress, disabled, className }: OptionButtonProps) {
  const s = STYLE[state];
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`Option ${optionLetter(index)}: ${label}${A11Y_SUFFIX[state] ?? ''}`}
      accessibilityState={{ selected: state === 'selected', disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn('min-h-[52px] w-full flex-row items-center gap-3 rounded-md px-3 py-3', s.box, className)}>
      <View className={cn('h-7 w-7 items-center justify-center rounded-sm', s.badge)}>
        <AppText variant="label" weight="semibold" color={s.badgeText}>
          {optionLetter(index)}
        </AppText>
      </View>
      <AppText variant="body" color={s.label} className="flex-1">
        {label}
      </AppText>
    </Pressable>
  );
}
