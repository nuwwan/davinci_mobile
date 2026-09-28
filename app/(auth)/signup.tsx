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
import { useRegisterMutation } from '@/src/api/enhanced';

type FormErrors = {
  firstName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function validate(
  firstName: string,
  email: string,
  password: string,
  confirmPassword: string,
): FormErrors {
  const errs: FormErrors = {};
  if (!firstName.trim()) errs.firstName = 'First name is required';
  if (!email.trim()) {
    errs.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errs.email = 'Enter a valid email address';
  }
  if (!password) {
    errs.password = 'Password is required';
  } else if (password.length < 8) {
    errs.password = 'Password must be at least 8 characters';
  }
  if (!confirmPassword) {
    errs.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errs.confirmPassword = 'Passwords do not match';
  }
  return errs;
}

export default function SignUpScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [register, { isLoading }] = useRegisterMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSignUp() {
    const errs = validate(firstName, email, password, confirmPassword);
    if (Object.keys(errs).length) {
      setErrors(errs);
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

      showToast(
        'Account created! Check your email to verify your account before signing in.',
        'success',
      );
      router.replace('/(auth)/login');
    } catch (err: any) {
      const status = err?.status;
      if (status === 409) {
        setErrors({ email: 'This email is already registered' });
      } else {
        showToast('Registration failed. Please try again.', 'error');
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
              Create your account
            </AppText>
          </View>

          {/* ── Form card ── */}
          <View className="rounded-2xl border border-border bg-surface p-6 shadow-md gap-4">
            <AppText variant="sectionHeading" color="textPrimary">
              Sign up
            </AppText>

            {/* Name row */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input
                  label="First name"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoComplete="given-name"
                  placeholder="Nuwan"
                  error={errors.firstName}
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Last name"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoComplete="family-name"
                  placeholder="Silva"
                />
              </View>
            </View>

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
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              error={errors.password}
            />

            <Input
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              placeholder="Repeat your password"
              error={errors.confirmPassword}
            />

            <Button
              title="Create account"
              loading={isLoading}
              onPress={handleSignUp}
              fullWidth
            />
          </View>

          {/* ── Footer ── */}
          <View className="mt-6 flex-row items-center justify-center gap-1">
            <AppText variant="body" color="textSecondary">
              Already have an account?
            </AppText>
            <AppText
              variant="body"
              color="primary"
              onPress={() => router.push('/(auth)/login')}>
              Sign in
            </AppText>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
