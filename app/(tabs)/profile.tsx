import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ScrollScreen } from '@/components/layout';
import { EditProfileForm, ProfileHeader, roleMeta } from '@/components/profile';
import {
  Button,
  Card,
  ConfirmSheet,
  IconButton,
  InfoRow,
  InlineAlert,
  Skeleton,
  StatusDot,
  useToast,
} from '@/components/ui';
import { preferenceMeta, type DifficultyPreference } from '@/lib/question';
import { useGetMyProfileQuery, usePatchMyProfileMutation, type LearnerProfilePatch } from '@/src/api/enhanced';
import { loggedOut, selectCurrentUser, selectIsAuthenticated } from '@/src/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';

const days = (n?: number) => (n == null ? '—' : `${n} day${n === 1 ? '' : 's'}`);
const monthYear = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '—';
const shortId = (id: string) => (id.length > 8 ? `${id.slice(0, 8)}…` : id);

/** Profile (Figma I1 loading · I2 details · I3 load error · J edit · K sign-out sheet). */
export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const authUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [editing, setEditing] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const { data: profile, isLoading, isFetching, isError, refetch } = useGetMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [patchProfile, { isLoading: isSaving }] = usePatchMyProfileMutation();

  const firstName = profile?.profile?.first_name ?? authUser?.first_name ?? '';
  const lastName = profile?.profile?.last_name ?? authUser?.last_name ?? '';
  const email = profile?.email ?? authUser?.email ?? '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const isActive = profile?.is_active ?? authUser?.is_active ?? true;
  const role = profile?.role ?? authUser?.role;
  const userId = profile?.id ?? authUser?.id ?? '';
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

  function handleSignOut() {
    setConfirmSignOut(false);
    dispatch(loggedOut());
    showToast("You've been signed out.", 'info');
  }

  const settingsButton = (
    <View className="absolute right-0 top-0 z-10">
      <IconButton icon="settings" accessibilityLabel="Settings" onPress={() => router.push('/settings')} />
    </View>
  );

  if (isLoading) {
    return (
      <ScrollScreen scrollEnabled={false}>
        <View className="items-center gap-3 pt-3">
          <Skeleton width={84} height={84} radius={42} />
          <Skeleton width={160} height={24} radius={8} />
          <Skeleton width={200} height={16} radius={8} />
        </View>
        <Skeleton height={228} radius={20} />
      </ScrollScreen>
    );
  }

  return (
    <ScrollScreen refreshing={isFetching && !isLoading} onRefresh={refetch} contentClassName="gap-4">
      <View className="pt-3">
        {settingsButton}
        <ProfileHeader name={fullName} email={email} role={role} avatarUrl={profile?.profile?.avatar_url} />
      </View>

      {isError ? (
        <InlineAlert tone="error" message="Couldn't load full profile." actionLabel="Try again" onAction={refetch} />
      ) : null}

      {editing ? (
        <EditProfileForm
          initial={{
            firstName,
            lastName: lastName ?? '',
            email,
            difficulty: (learner?.difficulty_preference as DifficultyPreference) ?? 'mixed',
          }}
          saving={isSaving}
          onCancel={() => setEditing(false)}
          onSave={handleSave}
        />
      ) : (
        <>
          <Card variant="section" title="Personal info">
            <InfoRow label="First name" value={firstName || '—'} />
            {lastName ? <InfoRow label="Last name" value={lastName} /> : null}
            <InfoRow label="Email" value={email} />
            {profile?.profile?.bio ? <InfoRow label="Bio" value={profile.profile.bio} /> : null}
            {profile?.profile?.location ? <InfoRow label="Location" value={profile.profile.location} /> : null}
            {profile?.profile?.institution ? <InfoRow label="Institution" value={profile.profile.institution} /> : null}
            {!isError ? (
              <Button title="Edit profile" variant="outline" onPress={() => setEditing(true)} className="mt-3" />
            ) : null}
          </Card>

          {learner ? (
            <Card variant="section" title="Learning stats">
              <InfoRow label="Difficulty" value={preferenceMeta(learner.difficulty_preference).label} />
              <InfoRow label="Current streak" value={days(learner.current_streak)} />
              <InfoRow label="Best streak" value={days(learner.best_streak)} />
              <InfoRow label="Learning time" value={`${learner.total_learning_minutes ?? 0} min`} last />
            </Card>
          ) : null}

          <Card variant="section" title="Account">
            <InfoRow label="Role" value={roleMeta(role).label} />
            <InfoRow
              label="Status"
              right={<StatusDot label={isActive ? 'Active' : 'Inactive'} tone={isActive ? 'success' : 'error'} />}
            />
            {profile?.created_at ? <InfoRow label="Joined" value={monthYear(profile.created_at)} /> : null}
            <InfoRow label="User ID" value={shortId(userId)} last />
          </Card>

          <Button title="Sign out" variant="destructiveOutline" onPress={() => setConfirmSignOut(true)} />
        </>
      )}

      <ConfirmSheet
        visible={confirmSignOut}
        onClose={() => setConfirmSignOut(false)}
        onConfirm={handleSignOut}
        icon="logout"
        title="Sign out?"
        message="You'll need to sign back in to access your daily questions."
        confirmLabel="Sign out"
      />
    </ScrollScreen>
  );
}
