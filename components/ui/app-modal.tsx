import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';

export type AppModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  /** Tap backdrop to dismiss */
  dismissOnBackdrop?: boolean;
};

export function AppModal({
  visible,
  onRequestClose,
  children,
  dismissOnBackdrop = true,
}: AppModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View className="flex-1 justify-center px-6">
        <Pressable
          className="absolute inset-0 z-[1] bg-scrim/[0.45]"
          onPress={dismissOnBackdrop ? onRequestClose : undefined}
          accessibilityElementsHidden
        />
        <View className="z-[2] w-full max-w-[520px] self-center rounded-2xl bg-surface p-6 shadow-lg">
          {children}
        </View>
      </View>
    </Modal>
  );
}
