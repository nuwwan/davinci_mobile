/**
 * Root entry point.
 *
 * Shows nothing while BootstrapAuth + AuthGate determine where to redirect.
 * After bootstrap, AuthGate pushes the user to either /(auth)/login or /(tabs).
 */
import { View } from 'react-native';

export default function Index() {
  return <View />;
}
