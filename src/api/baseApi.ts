/**
 * RTK Query base API for the DaVinci backend (mobile).
 *
 * Mirrors davinci_web/src/api/baseApi.ts in shape, with two differences:
 *   - The base URL comes from EXPO_PUBLIC_API_URL (Expo's runtime env var).
 *   - Reauth handling is identical (mutex-guarded single-flight refresh) and
 *     drives the same authSlice actions.
 */
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import type { RootState } from '../store'
import { loggedOut, tokensReceived } from '../features/auth/authSlice'

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

const refreshMutex = new Mutex()

type RefreshResponseShape = {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await refreshMutex.waitForUnlock()
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status !== 401) return result

  if (refreshMutex.isLocked()) {
    await refreshMutex.waitForUnlock()
    return rawBaseQuery(args, api, extraOptions)
  }

  const release = await refreshMutex.acquire()
  try {
    const refreshToken = (api.getState() as RootState).auth.refreshToken
    if (!refreshToken) {
      api.dispatch(loggedOut())
      return result
    }

    const refresh = await rawBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refresh_token: refreshToken },
      },
      api,
      extraOptions,
    )

    if (!refresh.data) {
      api.dispatch(loggedOut())
      return result
    }

    api.dispatch(tokensReceived(refresh.data as RefreshResponseShape))
    result = await rawBaseQuery(args, api, extraOptions)
  } finally {
    release()
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Question', 'Subject', 'User', 'Stats'],
  endpoints: () => ({}),
})
