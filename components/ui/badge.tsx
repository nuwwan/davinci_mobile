import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/text';
import { useTheme } from '@/src/theme';

export type BadgeTone = 'default' | 'primary' | 'success' | 'error' | 'streak';

export type BadgeProps = ViewProps & {
  label: string;
  tone?: BadgeTone;
};

export function Badge({ label, tone = 'default', style, ...rest }: BadgeProps) {
  const { theme } = useTheme();

  const colors = (() => {
    switch (tone) {
      case 'primary':
        return {
          bg: theme.colors.primaryLight,
          border: theme.colors.primaryMuted,
          text: 'primary' as const,
        };
      case 'success':
        return {
          bg: theme.colors.correctBg,
          border: theme.colors.correctBorder,
          text: 'correct' as const,
        };
      case 'error':
        return {
          bg: theme.colors.wrongBg,
          border: theme.colors.wrongBorder,
          text: 'wrong' as const,
        };
      case 'streak':
        return {
          bg: theme.colors.streakBg,
          border: theme.colors.streak,
          text: 'streak' as const,
        };
      default:
        return {
          bg: theme.colors.surface2,
          border: theme.colors.border,
          text: 'textSecondary' as const,
        };
    }
  })();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderRadius: theme.radius.sm,
          paddingHorizontal: theme.spacing.xs,
          paddingVertical: 2,
        },
        style,
      ]}
      {...rest}>
      <AppText variant="hint" color={colors.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
