import { useEffect, type ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/text';
import { Button, type ButtonVariant } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { useTheme, type ColorName } from '@/src/theme';

/**
 * Bottom sheet (Figma K / N3 / M3): scrim (45% / 60% dark) · surface sheet, top radius 20 ·
 * 32×4 grab handle · content. Tapping the scrim dismisses.
 */
export function BottomSheet({
  visible,
  onClose,
  children,
  dismissible = true,
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  dismissible?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { colors, scrimOpacity } = useTheme();
  const fade = useSharedValue(0);

  useEffect(() => {
    fade.value = withTiming(visible ? 1 : 0, { duration: 200 });
  }, [visible, fade]);
  const scrimStyle = useAnimatedStyle(() => ({ opacity: fade.value * scrimOpacity }));

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Animated.View
          pointerEvents="none"
          style={[{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.scrim }, scrimStyle]}
        />
        <Pressable
          className="absolute inset-0"
          accessibilityLabel="Close"
          onPress={dismissible ? onClose : undefined}
        />
        <View
          className="rounded-t-xl bg-surface px-6 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}>
          <View className="mb-6 h-1 w-8 self-center rounded-full bg-surface-2" />
          {children}
        </View>
      </View>
    </Modal>
  );
}

export type ConfirmSheetProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  icon?: IconName;
  iconColor?: ColorName;
  confirmLabel: string;
  confirmVariant?: ButtonVariant;
  cancelLabel?: string;
  loading?: boolean;
};

/** Confirmation sheet: icon · title · message · confirm + cancel (Sign out?, Delete account?). */
export function ConfirmSheet({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  icon,
  iconColor = 'error',
  confirmLabel,
  confirmVariant = 'destructive',
  cancelLabel = 'Cancel',
  loading,
}: ConfirmSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} dismissible={!loading}>
      <View className="items-center">
        {icon ? <Icon name={icon} size={32} color={iconColor} /> : null}
        <AppText variant="section" center className="mt-4">
          {title}
        </AppText>
        {message ? (
          <AppText variant="body" color="textSecondary" center className="mt-2 max-w-[300px]">
            {message}
          </AppText>
        ) : null}
      </View>
      <View className="mt-6 gap-3">
        <Button title={confirmLabel} variant={confirmVariant} loading={loading} onPress={onConfirm} />
        <Button title={cancelLabel} variant="secondary" disabled={loading} onPress={onClose} />
      </View>
    </BottomSheet>
  );
}
