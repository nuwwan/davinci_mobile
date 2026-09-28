/**
 * Global auth guard.
 *
 * Mounted in the root layout, inside <AppProviders>.
 * Reacts to auth state changes AND route segment changes, ensuring:
 *
 *   not authenticated + outside (auth) → redirect to /login
 *   authenticated     + outside (tabs) → redirect to /tabs
 *   otherwise                          → no-op
 */
import { useEffect } from 'react';
import { useRouter, useRootNavigationState, useSegments } from 'expo-router';
import { useAppSelector } from '@/src/store/hooks';
import {
  selectIsAuthenticated,
  selectIsBootstrapping,
} from '@/src/features/auth/authSlice';

export function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const isBootstrapping = useAppSelector(selectIsBootstrapping);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    // Wait until both auth state AND the router are ready
    if (isBootstrapping) return;
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && !inAuthGroup) {
      // Not signed in → kick to login (from root index, tabs, or any deep link)
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !inTabsGroup) {
      // Signed in but on auth screens or root index → send to main app
      router.replace('/(tabs)');
    }
  }, [isBootstrapping, isAuthenticated, segments, navigationState?.key, router]);

  return null;
}
