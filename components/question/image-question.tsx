import { Image } from 'expo-image';
import type { ImageSourcePropType } from 'react-native';
import { View } from 'react-native';

export type ImageQuestionProps = {
  source: ImageSourcePropType;
  aspectRatio?: number;
};

export function ImageQuestion({ source, aspectRatio = 16 / 9 }: ImageQuestionProps) {
  return (
    <View className="w-full overflow-hidden rounded-lg bg-surface-2">
      <Image
        source={source}
        style={{ width: '100%', aspectRatio, borderRadius: 16 }}
        contentFit="contain"
        transition={200}
      />
    </View>
  );
}
