import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { Icon, type IconName } from '@/components/ui/icon';
import { fontFamilies, sizes, useTheme } from '@/src/theme';

const TAB_ICON: Record<string, IconName> = {
  index: 'house',
  questions: 'book',
  stats: 'chart',
  profile: 'person',
};

/** Bottom tabs (Figma): Home · Questions · Stats · Profile. Surface bg, 1pt top border. */
export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: sizes.tabBarHeight + 8 + Math.max(insets.bottom, 8),
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarLabelStyle: { fontFamily: fontFamilies.medium, fontSize: 11, marginTop: 2 },
        tabBarIcon: ({ color }) => <Icon name={TAB_ICON[route.name] ?? 'house'} tint={color} size={sizes.tabIcon} />,
      })}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="questions" options={{ title: 'Questions' }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
