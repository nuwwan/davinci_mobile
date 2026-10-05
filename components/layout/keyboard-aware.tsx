import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';

type Props = ScrollViewProps & {
  children: ReactNode;
  contentContainerClassName?: string;
};

/**
 * Form screen shell: safe area + KeyboardAvoidingView + ScrollView so the keyboard never
 * covers the focused input. Taps on empty space dismiss the keyboard.
 */
export function KeyboardAwareScrollView({ children, contentContainerClassName, ...scrollProps }: Props) {
  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1 bg-surface-3">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerClassName={cn('grow', contentContainerClassName)}
          {...scrollProps}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
