/**
 * redux-persist storage adapter — platform-aware.
 *
 * ┌─────────────┬────────────────────────────────────────────────┐
 * │ iOS/Android │ expo-secure-store (Keychain / EncryptedPrefs)  │
 * │ Web browser │ AsyncStorage → localStorage                    │
 * │ SSR / Node  │ no-op (redux-persist is skipped on the server) │
 * └─────────────┴────────────────────────────────────────────────┘
 *
 * Keys are sanitized for SecureStore which only accepts [A-Za-z0-9._-].
 */
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import type { Storage } from 'redux-persist'

const safeKey = (key: string) => key.replace(/[^A-Za-z0-9._-]/g, '_')

/** iOS / Android — Keychain / EncryptedSharedPreferences */
const nativeStorage: Storage = {
  getItem: (key) => SecureStore.getItemAsync(safeKey(key)),
  setItem: (key, value) => SecureStore.setItemAsync(safeKey(key), value),
  removeItem: (key) => SecureStore.deleteItemAsync(safeKey(key)),
}

/** Browser — AsyncStorage (backed by localStorage) */
const webStorage: Storage = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key),
}

/**
 * SSR / Node.js — no-op.
 * Expo Router pre-renders pages on the server where `window` is unavailable.
 * redux-persist state is irrelevant server-side; we just need the calls to
 * succeed silently so the store can boot without crashing.
 */
const noopStorage: Storage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
}

function resolveStorage(): Storage {
  if (Platform.OS !== 'web') return nativeStorage
  // typeof check works in both browser and Node (SSR)
  if (typeof window === 'undefined') return noopStorage
  return webStorage
}

export default resolveStorage()
