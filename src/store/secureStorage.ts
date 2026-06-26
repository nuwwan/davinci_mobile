/**
 * redux-persist storage adapter backed by expo-secure-store.
 *
 * Tokens are secrets — they belong in Keychain (iOS) / EncryptedSharedPreferences
 * (Android), not AsyncStorage. `expo-secure-store` handles both. We satisfy
 * redux-persist's tiny `Storage` contract (getItem/setItem/removeItem, all
 * string-keyed).
 *
 * Important: redux-persist composes keys like `persist:<root-key>` and
 * `persist:<root-key>:<slice>`. The `:` separator is **not** allowed by
 * `expo-secure-store`, which only accepts `[A-Za-z0-9._-]`. We sanitize keys
 * before every call so the storage adapter can be a drop-in for redux-persist.
 *
 * NOTE: SecureStore values are limited to 2KB on iOS (and roughly the same
 * on Android). The auth slice is a few hundred bytes, well within budget.
 */
import * as SecureStore from 'expo-secure-store'
import type { Storage } from 'redux-persist'

const safeKey = (key: string) => key.replace(/[^A-Za-z0-9._-]/g, '_')

const secureStorage: Storage = {
  getItem: (key) => SecureStore.getItemAsync(safeKey(key)),
  setItem: (key, value) => SecureStore.setItemAsync(safeKey(key), value),
  removeItem: (key) => SecureStore.deleteItemAsync(safeKey(key)),
}

export default secureStorage
