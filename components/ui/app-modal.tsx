import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { useTheme } from '@/src/theme';

export type AppModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  /** Tap backdrop to dismiss */
  dismissOnBackdrop?: boolean;
};

/** Centered dialog. Prefer `BottomSheet` / `ConfirmSheet` for confirmations on mobile. */
export function AppModal({ visible, onRequestClose, children, dismissOnBackdrop = true }: AppModalProps) {
  const { scrimOpacity } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View className="flex-1 justify-center px-6">
        <Pressable
          className="absolute inset-0 bg-scrim"
          style={{ opacity: scrimOpacity }}
          onPress={dismissOnBackdrop ? onRequestClose : undefined}
          accessibilityElementsHidden
        />
        <View className="w-full max-w-[520px] self-center rounded-xl bg-surface p-6">{children}</View>
      </View>
    </Modal>
  );
}
