/**
 * Global auth guard.
 *
 * Mounted in the root layout, inside <AppProviders>.
 * Reacts to auth state changes AND route segment changes, ensuring:
 *
 *   not authenticated + outside (auth)          → redirect to /login
 *   authenticated     + in (auth) or root index → redirect to /tabs
 *   (authenticated users may visit other stack routes such as /settings)
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
    const route = segments as string[];
    const atRootIndex = route.length === 0 || route[0] === 'index';

    if (!isAuthenticated && !inAuthGroup) {
      // Not signed in → kick to login (from root index, tabs, or any deep link)
      router.replace('/(auth)/login');
    } else if (isAuthenticated && (inAuthGroup || atRootIndex)) {
      // Signed in but on auth screens or root index → send to main app
      router.replace('/(tabs)');
    }
  }, [isBootstrapping, isAuthenticated, segments, navigationState?.key, router]);

  return null;
}
