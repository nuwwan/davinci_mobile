import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { ProgressBar } from '@/components/ui/progress-bar';

/** "Programming ········ 92%" with a 6pt bar (Figma Stats → By subject). */
export function SubjectProgressRow({ label, value, detail }: { label: string; value: number; detail?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <AppText variant="bodyStrong">{label}</AppText>
        <AppText variant="bodyStrong">{detail ?? `${pct}%`}</AppText>
      </View>
      <ProgressBar progress={value} height={6} />
    </View>
  );
}
