import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/cn';

/**
 * Tab-screen header (Figma "Hi, Nuwan 👋 / Here's your daily question", "Stats / Your learning overview"):
 * 32pt display title + 14pt secondary subtitle, optional right action.
 */
export function PageHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <View className={cn('flex-row items-start gap-3', className)}>
      <View className="flex-1 gap-1">
        <AppText variant="pageTitle" accessibilityRole="header" numberOfLines={2}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="body" color="textSecondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/**
 * Pushed-screen header (Figma Settings: "‹ Profile" back link, then a 24pt section title).
 */
export function NavHeader({
  backLabel = 'Back',
  title,
  onBack,
  right,
}: {
  backLabel?: string;
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  const router = useRouter();
  return (
    <View className="gap-2">
      <View className="-ml-1 flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Back to ${backLabel}`}
          onPress={onBack ?? (() => router.back())}
          hitSlop={8}
          className="h-11 flex-row items-center active:opacity-60">
          <Icon name="chevL" size={24} color="primary" />
          <AppText variant="cardTitle" color="primary" className="ml-1">
            {backLabel}
          </AppText>
        </Pressable>
        {right}
      </View>
      {title ? (
        <AppText variant="section" accessibilityRole="header">
          {title}
        </AppText>
      ) : null}
    </View>
  );
}

/** Centered brand lockup used by splash + auth screens. */
export function BrandHeader({ tagline = 'The smarter way to learn' }: { tagline?: string }) {
  return (
    <View className="items-center gap-2">
      <AppText variant="pageTitle" color="primary" accessibilityRole="header">
        DaVinci
      </AppText>
      <AppText variant="body" color="textSecondary" center>
        {tagline}
      </AppText>
    </View>
  );
}
