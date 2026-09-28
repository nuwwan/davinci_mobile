/**
 * Silent session restore.
 *
 * Rendered once inside <AppProviders> (above the router Stack).
 * If a persisted access-token is found in Redux state, it fires
 * `getCurrentUser` to validate the session and load the user profile.
 * The auth slice tracks `isBootstrapping` so the root index route can
 * wait until this is done before redirecting.
 */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  selectAccessToken,
  bootstrapFinished,
} from '@/src/features/auth/authSlice';
import { useLazyGetCurrentUserQuery } from '@/src/api/enhanced';

export function BootstrapAuth() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const [triggerGetCurrentUser] = useLazyGetCurrentUserQuery();

  useEffect(() => {
    if (accessToken) {
      // The enhanced endpoint's onQueryStarted handler will dispatch
      // userReceived or loggedOut + bootstrapFinished automatically.
      triggerGetCurrentUser();
    } else {
      // No stored token — nothing to restore
      dispatch(bootstrapFinished());
    }
    // We only need this to run once on mount; intentionally no deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Renders nothing — side-effect only
  return null;
}
