import { Image } from 'expo-image';
import { View } from 'react-native';

/** Question / option image: full width, max 200pt tall, radius 12, surface2 while loading. */
export function ImageQuestion({ uri, alt }: { uri: string; alt?: string | null }) {
  return (
    <View className="w-full overflow-hidden rounded-md bg-surface-2">
      <Image
        source={{ uri }}
        accessibilityLabel={alt ?? undefined}
        style={{ width: '100%', height: 200 }}
        contentFit="contain"
        transition={200}
      />
    </View>
  );
}
