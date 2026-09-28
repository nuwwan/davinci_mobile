import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { UserRole, type TUser } from '../../types/user'
import type { RootState } from '../../store'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: TUser | null
  /** True while the app is doing the initial token → user bootstrap on launch. */
  isBootstrapping: boolean
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isBootstrapping: true,
}

type TokenPayload = {
  access_token: string
  refresh_token?: string | null
  expires_in?: number
  token_type?: string | null
}

const normalizeUser = (user: TUser): TUser => ({
  ...user,
  role: String(user.role).toUpperCase() as UserRole,
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Persist tokens after login or refresh-token rotation. */
    tokensReceived(state, action: PayloadAction<TokenPayload>) {
      state.accessToken = action.payload.access_token
      if (action.payload.refresh_token) {
        state.refreshToken = action.payload.refresh_token
      }
    },
    userReceived(state, action: PayloadAction<TUser>) {
      state.user = normalizeUser(action.payload)
      state.isBootstrapping = false
    },
    loggedOut(state) {
      state.accessToken = null
      state.refreshToken = null
      state.user = null
      state.isBootstrapping = false
    },
    /** Call once the bootstrapping check (silent refresh) has been attempted. */
    bootstrapFinished(state) {
      state.isBootstrapping = false
    },
  },
})

export const {
  tokensReceived,
  userReceived,
  loggedOut,
  bootstrapFinished,
} = authSlice.actions

export default authSlice.reducer

export const selectAuth = (s: RootState) => s.auth
export const selectAccessToken = (s: RootState) => s.auth.accessToken
export const selectIsAuthenticated = (s: RootState) =>
  Boolean(s.auth.accessToken)
export const selectCurrentUser = (s: RootState) => s.auth.user
export const selectIsBootstrapping = (s: RootState) => s.auth.isBootstrapping
export const selectIsAdmin = (s: RootState) =>
  s.auth.user?.role === UserRole.ADMIN
