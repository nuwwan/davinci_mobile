import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import { useTheme } from '@/src/theme';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  className?: string;
};

export function Input({ label, error, secureTextEntry, className, ...rest }: InputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  const borderClass = error
    ? 'border-wrong-border'
    : focused
      ? 'border-border-strong'
      : 'border-border';

  return (
    <View className="w-full">
      {label ? (
        <AppText variant="metadata" color="textSecondary" className="mb-2">
          {label}
        </AppText>
      ) : null}
      <View
        className={cn(
          'relative justify-center rounded-md border-[1.5px] bg-surface',
          borderClass
        )}>
        <TextInput
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.primary}
          className={cn(
            'min-h-12 py-3.5 pl-4 text-body font-inter text-t-primary',
            secureTextEntry ? 'pr-11' : 'pr-4',
            className
          )}
          secureTextEntry={secureTextEntry && hidden}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden((v) => !v)}
            className="absolute right-2 h-12 w-10 items-center justify-center">
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="metadata" color="wrong" className="mt-2">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
