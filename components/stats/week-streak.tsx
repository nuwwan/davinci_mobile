import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/cn';

export type DayStatus = 'done' | 'today' | 'missed' | 'upcoming';

const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * Mon–Sun streak strip (Figma Stats → Streak): done = filled primary + check,
 * today = primaryLight ring, upcoming/missed = empty ring.
 */
export function WeekStreak({ days }: { days: DayStatus[] }) {
  return (
    <View className="flex-row justify-between">
      {LABELS.map((label, i) => {
        const status = days[i] ?? 'upcoming';
        return (
          <View key={i} className="items-center gap-1.5" accessibilityLabel={`${label}: ${status}`}>
            <View
              className={cn(
                'h-7 w-7 items-center justify-center rounded-full',
                status === 'done' && 'bg-primary',
                status === 'today' && 'border-[1.5px] border-primary bg-primary-light',
                (status === 'upcoming' || status === 'missed') && 'border-[1.5px] border-border'
              )}>
              {status === 'done' ? <Icon name="check" size={16} strokeWidth={1.75} color="textInverse" /> : null}
            </View>
            <AppText variant="hint" color="textTertiary">
              {label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

/**
 * Derive this week's strip from the current streak length (until the API exposes per-day
 * history). Days within the streak ending today/yesterday are "done".
 */
export function weekFromStreak(currentStreak: number, answeredToday: boolean, now = new Date()): DayStatus[] {
  const todayIdx = (now.getDay() + 6) % 7; // Monday = 0
  const lastDone = answeredToday ? todayIdx : todayIdx - 1;
  return LABELS.map((_, i) => {
    if (i === todayIdx && !answeredToday) return 'today';
    if (i > todayIdx) return 'upcoming';
    return i <= lastDone && lastDone - i < currentStreak ? 'done' : 'missed';
  });
}
