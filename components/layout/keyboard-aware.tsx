import type { ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  type KeyboardAvoidingViewProps,
  type ScrollViewProps,
} from 'react-native';

const defaultBehavior: KeyboardAvoidingViewProps['behavior'] =
  Platform.OS === 'ios' ? 'padding' : 'height';

type KeyboardAvoidingScreenProps = {
  children: ReactNode;
  behavior?: KeyboardAvoidingViewProps['behavior'];
  className?: string;
};

/** Wraps content with platform keyboard behavior (plan: padding on iOS, height on Android). */
export function KeyboardAvoidingScreen({
  children,
  behavior = defaultBehavior,
  className,
}: KeyboardAvoidingScreenProps) {
  return (
    <KeyboardAvoidingView className={className ?? 'flex-1'} behavior={behavior}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">{children}</View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

type KeyboardScrollProps = ScrollViewProps & {
  children: ReactNode;
  behavior?: KeyboardAvoidingViewProps['behavior'];
  contentContainerClassName?: string;
};

/** Scrollable form area with keyboard avoidance and tap-to-dismiss. */
export function KeyboardAwareScrollView({
  children,
  behavior = defaultBehavior,
  contentContainerClassName,
  keyboardShouldPersistTaps = 'handled',
  ...scrollProps
}: KeyboardScrollProps) {
  return (
    <KeyboardAvoidingView className="flex-1" behavior={behavior}>
      <ScrollView
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        contentContainerClassName={contentContainerClassName ?? 'grow'}
        {...scrollProps}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
