import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { BrandHeader, KeyboardAwareScrollView } from '@/components/layout';
import { AppText, Button, Card, Input, TextLink, useToast } from '@/components/ui';
import { useRegisterMutation } from '@/src/api/enhanced';
import { validateEmail, validateNewPassword } from '@/lib/validation';

type Errors = { firstName?: string; email?: string; password?: string; confirm?: string };

function validate(firstName: string, email: string, password: string, confirm: string): Errors {
  const e: Errors = {};
  if (!firstName.trim()) e.firstName = 'First name is required';
  e.email = validateEmail(email);
  e.password = validateNewPassword(password);
  if (!confirm) e.confirm = 'Please confirm your password';
  else if (password !== confirm) e.confirm = 'Passwords do not match';
  return e;
}

/** Sign up (Figma B / B2). */
export default function SignUpScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [register, { isLoading }] = useRegisterMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  async function handleSignUp() {
    const next = validate(firstName, email, password, confirm);
    if (Object.values(next).some(Boolean)) {
      setErrors(next);
      return;
    }
    setErrors({});
    try {
      await register({
        userCreate: {
          first_name: firstName.trim(),
          last_name: lastName.trim() || null,
          email: email.trim(),
          password,
        },
      }).unwrap();
      showToast('Account created! Check your email to verify your account before signing in.', 'success', 4500);
      router.replace('/(auth)/login');
    } catch (err: any) {
      if (err?.status === 409) setErrors({ email: 'This email is already registered' });
      else showToast('Registration failed. Please try again.', 'error');
    }
  }

  return (
    <KeyboardAwareScrollView contentContainerClassName="px-4 pb-8 pt-12">
      <BrandHeader tagline="Create your account" />

      <Card variant="hero" className="mt-6 gap-4 px-6 py-6">
        <AppText variant="section" accessibilityRole="header">
          Sign up
        </AppText>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input
              label="First name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="e.g. Nuwan"
              autoCapitalize="words"
              autoComplete="given-name"
              editable={!isLoading}
              error={errors.firstName}
            />
          </View>
          <View className="flex-1">
            <Input
              label="Last name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="e.g. Silva"
              autoCapitalize="words"
              autoComplete="family-name"
              editable={!isLoading}
            />
          </View>
        </View>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          editable={!isLoading}
          error={errors.email}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Min. 8 characters"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          editable={!isLoading}
          error={errors.password}
        />
        <Input
          label="Confirm password"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Repeat your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          returnKeyType="go"
          onSubmitEditing={handleSignUp}
          editable={!isLoading}
          error={errors.confirm}
        />

        <Button title="Create account" onPress={handleSignUp} loading={isLoading} className="mt-2" />
      </Card>

      <View className="mt-6 flex-row items-center justify-center gap-1">
        <AppText color="textSecondary">Already have an account?</AppText>
        <TextLink title="Sign in" onPress={() => router.replace('/(auth)/login')} />
      </View>
    </KeyboardAwareScrollView>
  );
}
