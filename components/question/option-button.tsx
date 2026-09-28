import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import type { ColorName } from '@/src/theme';

export type OptionVisualState =
  | 'default'
  | 'pressed'
  | 'selected'
  | 'correct'
  | 'wrong'
  | 'dimmed';

export type OptionButtonProps = {
  index: number;
  label: string;
  state: OptionVisualState;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function letterFor(index: number) {
  return LETTERS[index] ?? String(index + 1);
}

type StateStyle = {
  container: string;
  badge: string;
  badgeText: ColorName;
  label: ColorName;
};

const STATE_STYLE: Record<OptionVisualState, StateStyle> = {
  default: {
    container:
      'border border-border bg-surface-2 active:border-primary active:bg-primary-light',
    badge: 'bg-surface-3',
    badgeText: 'textSecondary',
    label: 'textPrimary',
  },
  pressed: {
    container: 'border border-primary bg-primary-light',
    badge: 'bg-primary',
    badgeText: 'textInverse',
    label: 'textPrimary',
  },
  selected: {
    container: 'border-[1.5px] border-primary bg-primary-light',
    badge: 'bg-primary',
    badgeText: 'textInverse',
    label: 'textPrimary',
  },
  correct: {
    container: 'border border-correct-border bg-correct-bg',
    badge: 'bg-correct',
    badgeText: 'textInverse',
    label: 'correct',
  },
  wrong: {
    container: 'border border-wrong-border bg-wrong-bg',
    badge: 'bg-wrong',
    badgeText: 'textInverse',
    label: 'wrong',
  },
  dimmed: {
    container: 'border border-border bg-surface',
    badge: 'bg-surface-3',
    badgeText: 'textTertiary',
    label: 'textTertiary',
  },
};

export function OptionButton({
  index,
  label,
  state,
  onPress,
  disabled,
  className,
}: OptionButtonProps) {
  const styleSet = STATE_STYLE[state];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={cn(
        'min-h-[52px] w-full flex-row items-center rounded-lg px-3 py-2',
        styleSet.container,
        disabled && 'opacity-50',
        className
      )}>
      <View
        className={cn('mr-3 h-7 w-7 items-center justify-center rounded-md', styleSet.badge)}>
        <AppText variant="metadata" color={styleSet.badgeText} center>
          {letterFor(index)}
        </AppText>
      </View>
      <AppText variant="body" color={styleSet.label} className="flex-1">
        {label}
      </AppText>
    </Pressable>
  );
}
