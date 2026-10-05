import { forwardRef, useState } from 'react';
import { Platform, Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Icon, type IconName } from '@/components/ui/icon';
import { cn } from '@/lib/cn';
import { useTheme } from '@/src/theme';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  /** Leading icon (e.g. `search`). */
  leftIcon?: IconName;
  /** Shows an × button when there is text. */
  clearable?: boolean;
  onClear?: () => void;
  /** Container radius — `sm` (8, forms) or `md` (12, search). */
  radius?: 'sm' | 'md';
  containerClassName?: string;
  className?: string;
};

/**
 * Figma "Component states → INPUTS": 48pt, radius 8, 1.5 border.
 * Border: default `border` → focused `primary` → error `error`. Label 13 Medium above (8pt gap),
 * error 13 Regular below. Secure fields get an eye toggle.
 */
export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    clearable,
    onClear,
    radius = 'sm',
    secureTextEntry,
    multiline,
    editable = true,
    containerClassName,
    className,
    value,
    ...rest
  },
  ref
) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  const borderClass = error ? 'border-error' : focused ? 'border-primary' : 'border-border';
  const showClear = clearable && !!value && editable;
  const hasRightAccessory = secureTextEntry || showClear;

  return (
    <View className={cn('w-full', containerClassName)}>
      {label ? (
        <AppText variant="label" color="textSecondary" className="mb-2">
          {label}
        </AppText>
      ) : null}

      <View
        className={cn(
          'flex-row items-center border-[1.5px] bg-surface',
          radius === 'md' ? 'rounded-md' : 'rounded-sm',
          multiline ? 'min-h-[72px] items-start' : 'h-12',
          borderClass,
          !editable && 'opacity-60'
        )}>
        {leftIcon ? (
          <View className="pl-3.5">
            <Icon name={leftIcon} size={20} color="textTertiary" />
          </View>
        ) : null}

        <TextInput
          ref={ref}
          value={value}
          editable={editable}
          multiline={multiline}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.primary}
          secureTextEntry={secureTextEntry && hidden}
          accessibilityLabel={label}
          className={cn(
            'flex-1 font-inter text-body text-t-primary',
            leftIcon ? 'pl-2.5' : 'pl-3.5',
            hasRightAccessory ? 'pr-1' : 'pr-3.5',
            multiline ? 'py-3' : 'h-full',
            className
          )}
          style={[
            multiline ? { textAlignVertical: 'top' } : null,
            // Web only: the container border already shows focus.
            Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
          ]}
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
            onPress={() => setHidden((h) => !h)}
            className="h-full w-11 items-center justify-center">
            <Icon name={hidden ? 'eye' : 'eyeOff'} size={20} color="textTertiary" />
          </Pressable>
        ) : null}

        {showClear ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear"
            onPress={onClear}
            className="h-full w-11 items-center justify-center">
            <Icon name="xmark" size={20} color="textTertiary" />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <AppText variant="caption" color="error" className="mt-2">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="hint" color="textTertiary" className="mt-2">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
});

/** Search field used on list screens (radius 12, search icon, clear button). */
export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search…',
  ...rest
}: Omit<InputProps, 'leftIcon' | 'clearable' | 'radius'> & {
  value: string;
  onChangeText: (t: string) => void;
}) {
  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      leftIcon="search"
      radius="md"
      clearable
      onClear={() => onChangeText('')}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="search"
      {...rest}
    />
  );
}
