import { Image } from 'expo-image';
import { View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import { avatarSizes, fontFamilies } from '@/src/theme';

export type AvatarSize = keyof typeof avatarSizes;

export type AvatarProps = ViewProps & {
  uri?: string | null;
  name?: string;
  /** sm 40 (lists) · md 64 (headers) · lg 84 (profile). */
  size?: AvatarSize;
  className?: string;
};

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** Circle avatar: image when available, else initials (Plus Jakarta Bold) on primaryLight. */
export function Avatar({ uri, name = '', size = 'sm', className, style, ...rest }: AvatarProps) {
  const px = avatarSizes[size];
  return (
    <View
      className={cn(
        'items-center justify-center overflow-hidden rounded-full border-[1.5px] border-primary-muted bg-primary-light',
        className
      )}
      style={[{ width: px, height: px }, style]}
      {...rest}>
      {uri ? (
        <Image source={{ uri }} style={{ width: px, height: px }} contentFit="cover" transition={150} />
      ) : (
        <AppText
          color="primary"
          style={{ fontFamily: fontFamilies.displayBold, fontSize: Math.round(px * 0.31), lineHeight: Math.round(px * 0.4) }}>
          {initialsFrom(name)}
        </AppText>
      )}
    </View>
  );
}
