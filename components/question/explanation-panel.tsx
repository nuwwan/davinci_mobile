import { Image } from 'expo-image';
import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

/**
 * Answer explanation. `success` tone (green, Figma E4) when the learner got it right /
 * already answered; `neutral` card (Figma E3) after a wrong answer.
 */
export function ExplanationPanel({
  text,
  imageUrl,
  tone = 'neutral',
  title = 'Explanation',
}: {
  text?: string | null;
  imageUrl?: string | null;
  tone?: 'success' | 'neutral';
  title?: string;
}) {
  if (!text && !imageUrl) return null;
  return (
    <Card tone={tone === 'success' ? 'success' : 'default'} elevated>
      <AppText variant="cardTitle" color={tone === 'success' ? 'success' : 'textPrimary'}>
        {title}
      </AppText>
      {text ? (
        <AppText variant="body" className="mt-1.5">
          {text}
        </AppText>
      ) : null}
      {imageUrl ? (
        <View className="mt-3 overflow-hidden rounded-md bg-surface-2">
          <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 200 }} contentFit="contain" transition={200} />
        </View>
      ) : null}
    </Card>
  );
}
