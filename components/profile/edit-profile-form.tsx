import { useState } from 'react';
import { View } from 'react-native';

import { AppText, Button, Card, ChipGroup, Input } from '@/components/ui';
import { DIFFICULTY_PREFERENCES, preferenceMeta, type DifficultyPreference } from '@/lib/question';
import { validateEmail } from '@/lib/validation';
import type { LearnerProfilePatch } from '@/src/api/enhanced';

export type EditProfileValues = {
  firstName: string;
  lastName: string;
  email: string;
  difficulty: DifficultyPreference;
};

/**
 * Profile edit mode (Figma J). Only fields supported by PATCH /learner/me are editable;
 * bio / location / institution / phone from the mockup need API support first.
 */
export function EditProfileForm({
  initial,
  saving,
  onCancel,
  onSave,
}: {
  initial: EditProfileValues;
  saving: boolean;
  onCancel: () => void;
  onSave: (patch: LearnerProfilePatch) => void;
}) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});
  const set = <K extends keyof EditProfileValues>(k: K, val: EditProfileValues[K]) => setV((p) => ({ ...p, [k]: val }));

  function handleSave() {
    const next = {
      firstName: v.firstName.trim() ? undefined : 'First name is required',
      email: validateEmail(v.email),
    };
    if (next.firstName || next.email) {
      setErrors(next);
      return;
    }
    setErrors({});
    onSave({
      first_name: v.firstName.trim(),
      last_name: v.lastName.trim() || null,
      email: v.email.trim(),
      difficulty_preference: v.difficulty,
    });
  }

  return (
    <Card variant="section" title="Edit profile" className="gap-3">
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input label="First name" value={v.firstName} onChangeText={(t) => set('firstName', t)} autoCapitalize="words" error={errors.firstName} />
        </View>
        <View className="flex-1">
          <Input label="Last name" value={v.lastName} onChangeText={(t) => set('lastName', t)} autoCapitalize="words" />
        </View>
      </View>
      <Input
        label="Email"
        value={v.email}
        onChangeText={(t) => set('email', t)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.email}
      />
      <View>
        <AppText variant="label" color="textSecondary" className="mb-2">
          Difficulty preference
        </AppText>
        <ChipGroup
          layout="wrap"
          value={v.difficulty}
          onChange={(d) => set('difficulty', d)}
          options={DIFFICULTY_PREFERENCES.map((d) => ({ value: d, label: preferenceMeta(d).label }))}
        />
      </View>
      <View className="mt-2 flex-row gap-3">
        <View className="flex-1">
          <Button title="Cancel" variant="secondary" onPress={onCancel} disabled={saving} />
        </View>
        <View className="flex-1">
          <Button title="Save" onPress={handleSave} loading={saving} />
        </View>
      </View>
    </Card>
  );
}
