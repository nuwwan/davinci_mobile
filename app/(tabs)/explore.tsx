import { Image } from 'expo-image';
import { Platform, ScrollView, View } from 'react-native';

import { Screen } from '@/components/layout';
import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { Collapsible } from '@/components/ui/collapsible';
import { AppText } from '@/components/ui/text';

const monoFont = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

export default function TabTwoScreen() {
  return (
    <Screen>
      <ScrollView
        contentContainerClassName="gap-4 p-4 pb-16"
        showsVerticalScrollIndicator={false}>
        <View className="gap-2">
          <AppText variant="screenTitle" color="primary">
            Explore
          </AppText>
          <AppText variant="metadata" color="textSecondary">
            Starter notes below. Live components and tokens are on the Home tab.
          </AppText>
        </View>

        <View className="flex-row gap-2">
          <ThemedText type="title">Template topics</ThemedText>
        </View>
        <ThemedText>This app includes example code to help you get started.</ThemedText>
        <Collapsible title="File-based routing">
          <ThemedText>
            This app has two screens:{' '}
            <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
            <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
          </ThemedText>
          <ThemedText>
            The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
            sets up the tab navigator.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/router/introduction">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </Collapsible>
        <Collapsible title="Android, iOS, and web support">
          <ThemedText>
            You can open this project on Android, iOS, and the web. To open the web version, press{' '}
            <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
          </ThemedText>
        </Collapsible>
        <Collapsible title="Images">
          <ThemedText>
            For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
            <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
            different screen densities
          </ThemedText>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={{ width: 100, height: 100, alignSelf: 'center' }}
          />
          <ExternalLink href="https://reactnative.dev/docs/images">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </Collapsible>
        <Collapsible title="Light and dark mode components">
          <ThemedText>
            The app uses Tailwind classes via NativeWind for product colors and typography, shared
            with the web app.
          </ThemedText>
          <ExternalLink href="https://www.nativewind.dev/">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </Collapsible>
        <Collapsible title="Animations">
          <ThemedText>
            This template includes an example of an animated component. The{' '}
            <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
            the powerful{' '}
            <ThemedText type="defaultSemiBold" style={{ fontFamily: monoFont }}>
              react-native-reanimated
            </ThemedText>{' '}
            library to create a waving hand animation.
          </ThemedText>
        </Collapsible>
      </ScrollView>
    </Screen>
  );
}
