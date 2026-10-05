import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { BrandHeader, KeyboardAwareScrollView } from '@/components/layout';
import { AppText, Button, Card, Input, TextLink, useToast } from '@/components/ui';
import { useLoginMutation, useRequestActivationMutation } from '@/src/api/enhanced';
import { tokensReceived } from '@/src/features/auth/authSlice';
import { useAppDispatch } from '@/src/store/hooks';
import { validateEmail } from '@/lib/validation';

type Errors = { email?: string; password?: string };

/** Sign in (Figma C / C2 / D). */
export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [login, { isLoading }] = useLoginMutation();
  const [resend, { isLoading: isResending }] = useRequestActivationMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [unverified, setUnverified] = useState(false);

  async function handleLogin() {
    const next: Errors = { email: validateEmail(email) };
    if (!password) next.password = 'Password is required';
    if (next.email || next.password) {
      setErrors(next);
      return;
    }
    setErrors({});
    setUnverified(false);

    try {
      const tokens = await login({ userLogin: { email: email.trim(), password } }).unwrap();
      dispatch(tokensReceived(tokens));
      showToast('Welcome back!', 'info', 2000);
      router.replace('/(tabs)');
    } catch (err: any) {
      const status = err?.status;
      if (status === 403) {
        setUnverified(true);
        showToast('Your account is not active yet. Check your email for a verification link.', 'error', 4000);
      } else if (status === 400 || status === 401) {
        showToast('Invalid email or password.', 'error');
      } else {
        showToast('Something went wrong. Try again.', 'error');
      }
    }
  }

  async function handleResend() {
    try {
      await resend({ email: email.trim() }).unwrap();
      showToast('Verification email sent. Please check your inbox.', 'info');
    } catch {
      showToast("Couldn't send email. Please try again.", 'error');
    }
  }

  return (
    <KeyboardAwareScrollView contentContainerClassName="px-4 pb-8 pt-12">
      <BrandHeader />

      <Card variant="hero" className="mt-6 gap-4 px-6 py-6">
        <AppText variant="section" accessibilityRole="header">
          Sign in
        </AppText>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          editable={!isLoading}
          error={errors.email}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleLogin}
          editable={!isLoading}
          error={errors.password}
        />

        <View className="mt-2 gap-3">
          <Button title="Sign in" onPress={handleLogin} loading={isLoading} />
          {unverified ? (
            <Button title="Resend verification email" variant="outline" onPress={handleResend} loading={isResending} />
          ) : null}
        </View>
      </Card>

      <View className="mt-6 flex-row items-center justify-center gap-1">
        <AppText color="textSecondary">Don&apos;t have an account?</AppText>
        <TextLink title="Sign up" onPress={() => router.push('/(auth)/signup')} />
      </View>
    </KeyboardAwareScrollView>
  );
}
