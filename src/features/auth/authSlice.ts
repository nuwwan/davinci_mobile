import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { UserRole, type TUser } from '../../types/user'
import type { RootState } from '../../store'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: TUser | null
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
}

type TokenPayload = {
  access_token: string
  refresh_token?: string | null
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
    },
    loggedOut(state) {
      state.accessToken = null
      state.refreshToken = null
      state.user = null
    },
  },
})

export const { tokensReceived, userReceived, loggedOut } = authSlice.actions
export default authSlice.reducer

export const selectAuth = (s: RootState) => s.auth
export const selectAccessToken = (s: RootState) => s.auth.accessToken
export const selectIsAuthenticated = (s: RootState) =>
  Boolean(s.auth.accessToken)
export const selectCurrentUser = (s: RootState) => s.auth.user
export const selectIsAdmin = (s: RootState) =>
  s.auth.user?.role === UserRole.ADMIN
