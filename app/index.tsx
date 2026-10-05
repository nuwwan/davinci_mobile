/**
 * Splash / bootstrap (Figma A).
 * Visible while BootstrapAuth + AuthGate resolve the session, then AuthGate
 * replaces it with /(auth)/login or /(tabs).
 */
import { View } from 'react-native';

import { BrandHeader } from '@/components/layout';

export default function Splash() {
  return (
    <View className="flex-1 items-center justify-center bg-surface-3">
      <BrandHeader />
    </View>
  );
}
