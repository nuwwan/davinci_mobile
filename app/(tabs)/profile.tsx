import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  loggedOut,
} from '@/src/features/auth/authSlice';
import {
  useGetMyProfileQuery,
  usePatchMyProfileMutation,
  type LearnerProfilePatch,
} from '@/src/api/enhanced';
import { Screen } from '@/components/layout';
import { Avatar } from '@/components/ui/avatar';
import { AppText } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast-context';
import type { BadgeTone } from '@/components/ui/badge';
import { UserRole } from '@/src/types/user';
import { useTheme } from '@/src/theme';

// ─── constants ────────────────────────────────────────────────────────────────

const ROLE_LABEL: Record<UserRole, string> = {
  [UserRole.LEARNER]: 'Learner',
  [UserRole.CREATOR]: 'Creator',
  [UserRole.AUTHOR]: 'Author',
  [UserRole.ADMIN]: 'Admin',
};

const ROLE_TONE: Record<UserRole, BadgeTone> = {
  [UserRole.LEARNER]: 'primary',
  [UserRole.CREATOR]: 'success',
  [UserRole.AUTHOR]: 'streak',
  [UserRole.ADMIN]: 'error',
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  mixed: 'Mixed',
};

// ─── small helpers ────────────────────────────────────────────────────────────

type InfoRowProps = { label: string; value: string };
function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View className="flex-row items-start justify-between gap-4 py-3 border-b border-border">
      <AppText variant="metadata" color="textSecondary" className="w-36">
        {label}
      </AppText>
      <AppText variant="body" color="textPrimary" className="flex-1 text-right">
        {value}
      </AppText>
    </View>
  );
}

type SectionProps = { title: string; children: React.ReactNode };
function Section({ title, children }: SectionProps) {
  return (
    <View className="rounded-2xl border border-border bg-surface p-4 gap-1">
      <AppText variant="cardHeading" color="textSecondary" className="mb-2">
        {title}
      </AppText>
      {children}
    </View>
  );
}

// ─── edit form ────────────────────────────────────────────────────────────────

type EditFormProps = {
  initial: LearnerProfilePatch;
  onSave: (patch: LearnerProfilePatch) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
};

function EditForm({ initial, onSave, onCancel, isSaving }: EditFormProps) {
  const [firstName, setFirstName] = useState(initial.first_name ?? '');
  const [lastName, setLastName] = useState(initial.last_name ?? '');
  const [email, setEmail] = useState(initial.email ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email address';
    }
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    await onSave({
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
      email: email.trim() || null,
    });
  }

  return (
    <View className="gap-4">
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            error={errors.firstName}
          />
        </View>
        <View className="flex-1">
          <Input
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
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
        error={errors.email}
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            disabled={isSaving}
          />
        </View>
        <View className="flex-1">
          <Button
            title="Save"
            loading={isSaving}
            onPress={handleSave}
          />
        </View>
      </View>
    </View>
  );
}

// ─── main screen ─────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const authUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [editing, setEditing] = useState(false);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useGetMyProfileQuery(undefined, { skip: !isAuthenticated });

  const [patchProfile, { isLoading: isSaving }] = usePatchMyProfileMutation();

  // Only block if there is genuinely no token — authUser may be null on first
  // login before getCurrentUser has been called.
  if (!isAuthenticated) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <AppText variant="sectionHeading" color="textSecondary" center>
            Not signed in
          </AppText>
        </View>
      </Screen>
    );
  }

  // Prefer data from /learner/me; fall back to Redux authUser slice
  const firstName = profile?.profile?.first_name ?? authUser?.first_name ?? null;
  const lastName  = profile?.profile?.last_name  ?? authUser?.last_name  ?? null;
  const email     = profile?.email               ?? authUser?.email       ?? '';
  const userId    = profile?.id                  ?? authUser?.id          ?? '';
  const isActive  = profile?.is_active           ?? authUser?.is_active   ?? true;
  const roleRaw   = (profile?.role               ?? authUser?.role        ?? UserRole.LEARNER) as UserRole;
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const avatarUrl = profile?.profile?.avatar_url;
  const learner = profile?.learner_profile;

  async function handleSave(patch: LearnerProfilePatch) {
    try {
      await patchProfile({ learnerProfilePatch: patch }).unwrap();
      showToast('Profile updated!', 'success');
      setEditing(false);
    } catch {
      showToast('Failed to save. Please try again.', 'error');
    }
  }

  return (
    <Screen>
      <ScrollView
        contentContainerClassName="gap-5 p-4 pb-16"
        showsVerticalScrollIndicator={false}>

        {/* ── Avatar + name ── */}
        <View className="items-center gap-3 pt-6">
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <Avatar uri={avatarUrl} name={fullName || email} size={84} />
              <View className="items-center gap-1">
                <AppText variant="sectionHeading" color="textPrimary" center>
                  {fullName || 'No name set'}
                </AppText>
                <AppText variant="body" color="textSecondary" center>
                  {email}
                </AppText>
              </View>
              <Badge
                label={ROLE_LABEL[roleRaw] ?? roleRaw}
                tone={ROLE_TONE[roleRaw] ?? 'default'}
              />
            </>
          )}
        </View>

        {/* ── Error state ── */}
        {isError && !isLoading && (
          <View className="items-center gap-3 py-6">
            <AppText variant="body" color="textSecondary" center>
              Couldn't load profile details.
            </AppText>
            <Button title="Try again" variant="outline" onPress={refetch} />
          </View>
        )}

        {/* ── Edit form / details ── */}
        {!isLoading && !isError && (
          editing ? (
            <Section title="Edit profile">
              <EditForm
                initial={{
                  first_name: firstName ?? '',
                  last_name: lastName ?? '',
                  email: email ?? '',
                }}
                onSave={handleSave}
                onCancel={() => setEditing(false)}
                isSaving={isSaving}
              />
            </Section>
          ) : (
            <>
              {/* Personal info */}
              <Section title="Personal info">
                <InfoRow label="First name" value={firstName ?? '—'} />
                {lastName ? <InfoRow label="Last name" value={lastName} /> : null}
                <InfoRow label="Email" value={email} />
                {profile?.profile?.bio ? (
                  <InfoRow label="Bio" value={profile.profile.bio} />
                ) : null}
                {profile?.profile?.location ? (
                  <InfoRow label="Location" value={profile.profile.location} />
                ) : null}
                {profile?.profile?.institution ? (
                  <InfoRow label="Institution" value={profile.profile.institution} />
                ) : null}
                {profile?.profile?.phone ? (
                  <InfoRow label="Phone" value={profile.profile.phone} />
                ) : null}
                <View className="pt-3">
                  <Button
                    title="Edit profile"
                    variant="outline"
                    onPress={() => setEditing(true)}
                  />
                </View>
              </Section>

              {/* Learning stats */}
              {learner && (
                <Section title="Learning stats">
                  <InfoRow
                    label="Difficulty"
                    value={DIFFICULTY_LABEL[learner.difficulty_preference ?? ''] ?? 'Mixed'}
                  />
                  {learner.current_streak != null && (
                    <InfoRow
                      label="Current streak"
                      value={`${learner.current_streak} day${learner.current_streak !== 1 ? 's' : ''}`}
                    />
                  )}
                  {learner.best_streak != null && (
                    <InfoRow
                      label="Best streak"
                      value={`${learner.best_streak} day${learner.best_streak !== 1 ? 's' : ''}`}
                    />
                  )}
                  {learner.total_learning_minutes != null && (
                    <InfoRow
                      label="Learning time"
                      value={`${learner.total_learning_minutes} min`}
                    />
                  )}
                </Section>
              )}

              {/* Account */}
              <Section title="Account">
                <InfoRow label="Role" value={ROLE_LABEL[roleRaw] ?? roleRaw} />
                <InfoRow label="Status" value={isActive ? 'Active' : 'Inactive'} />
                <InfoRow label="User ID" value={userId} />
              </Section>
            </>
          )
        )}

        {/* ── Sign out ── */}
        {!editing && (
          <Button
            title="Sign out"
            variant="outline"
            onPress={() => dispatch(loggedOut())}
            fullWidth
          />
        )}
      </ScrollView>
    </Screen>
  );
}
