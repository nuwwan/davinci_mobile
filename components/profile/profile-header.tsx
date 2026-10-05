import { View } from 'react-native';

import { AppText, Avatar, Badge, type BadgeTone } from '@/components/ui';
import { UserRole } from '@/src/types/user';

export const ROLE_META: Record<UserRole, { label: string; tone: BadgeTone }> = {
  [UserRole.LEARNER]: { label: 'Learner', tone: 'primary' },
  [UserRole.CREATOR]: { label: 'Creator', tone: 'success' },
  [UserRole.AUTHOR]: { label: 'Author', tone: 'accent' },
  [UserRole.ADMIN]: { label: 'Admin', tone: 'error' },
};

export function roleMeta(role: string | null | undefined) {
  return ROLE_META[String(role ?? '').toUpperCase() as UserRole] ?? ROLE_META[UserRole.LEARNER];
}

/** Centered identity block (Figma I2): 84pt avatar · name · email · role pill. */
export function ProfileHeader({
  name,
  email,
  role,
  avatarUrl,
}: {
  name: string;
  email: string;
  role?: string | null;
  avatarUrl?: string | null;
}) {
  const r = roleMeta(role);
  return (
    <View className="items-center">
      <Avatar uri={avatarUrl} name={name || email} size="lg" />
      <AppText variant="section" center className="mt-3" numberOfLines={1}>
        {name || 'No name set'}
      </AppText>
      <AppText variant="body" color="textSecondary" center className="mt-1" numberOfLines={1}>
        {email}
      </AppText>
      <Badge label={r.label} tone={r.tone} className="mt-3 self-center" />
    </View>
  );
}
