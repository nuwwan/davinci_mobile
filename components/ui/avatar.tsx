import { Image } from 'expo-image';
import { View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';

export type AvatarProps = ViewProps & {
  uri?: string | null;
  name?: string;
  size?: number;
  className?: string;
};

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

export function Avatar({ uri, name = '', size = 40, className, style, ...rest }: AvatarProps) {
  const label = initialsFrom(name);

  return (
    <View
      className={cn(
        'items-center justify-center overflow-hidden rounded-full border border-primary-muted bg-primary-light',
        className
      )}
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      {...rest}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <AppText variant="metadata" color="primary" style={{ fontSize: Math.round(size * 0.35) }}>
          {label}
        </AppText>
      )}
    </View>
  );
}
