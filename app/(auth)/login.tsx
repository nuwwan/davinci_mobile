import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';

import { AppText } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast-context';
import { useAppDispatch } from '@/src/store/hooks';
import { useLoginMutation } from '@/src/api/enhanced';
import { tokensReceived } from '@/src/features/auth/authSlice';

function validate(email: string, password: string) {
  const errors: { email?: string; password?: string } = {};
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address';
  }
  if (!password) {
    errors.password = 'Password is required';
  }
  return errors;
}

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  async function handleLogin() {
    const errs = validate(email, password);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    try {
      const tokens = await login({ userLogin: { email: email.trim(), password } }).unwrap();
      dispatch(tokensReceived(tokens));
      // Replace with the main app — back-button cannot return to login
      router.replace('/(tabs)');
    } catch (err: any) {
      const status = err?.status;
      if (status === 400 || status === 403) {
        showToast('Invalid email or password.', 'error');
      } else {
        showToast('Something went wrong. Try again.', 'error');
      }
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface-3"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-12"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Branding ── */}
          <View className="mb-10 items-center gap-2">
            <AppText variant="screenTitle" color="primary">
              DaVinci
            </AppText>
            <AppText variant="body" color="textSecondary" center>
              The smarter way to learn
            </AppText>
          </View>

          {/* ── Form card ── */}
          <View className="rounded-2xl border border-border bg-surface p-6 shadow-md gap-4">
            <AppText variant="sectionHeading" color="textPrimary">
              Sign in
            </AppText>

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              placeholder="••••••••"
              error={errors.password}
            />

            <Button
              title="Sign in"
              loading={isLoading}
              onPress={handleLogin}
              fullWidth
            />
          </View>

          {/* ── Footer ── */}
          <View className="mt-6 flex-row items-center justify-center gap-1">
            <AppText variant="body" color="textSecondary">
              Don&apos;t have an account?
            </AppText>
            <AppText
              variant="body"
              color="primary"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onPress={() => router.push('/(auth)/signup' as any)}>
              Sign up
            </AppText>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
