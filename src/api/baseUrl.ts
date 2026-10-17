/**
 * Resolve the FastAPI origin for this runtime.
 *
 * `localhost` works on the iOS simulator (and web). It does **not** work in
 * Expo Go on a physical phone — there `localhost` is the phone itself.
 *
 * When the configured URL is loopback, we rewrite the host to the machine
 * Expo is already using for Metro (your Mac's LAN IP, e.g. 192.168.1.100).
 * Override with EXPO_PUBLIC_API_URL only when you want a non-loopback host
 * (staging, a deployed API, or a fixed LAN IP).
 */
import Constants from 'expo-constants'
import { Platform } from 'react-native'

const DEFAULT_API_URL = 'http://localhost:8000'

function isLoopbackHost(host: string): boolean {
  return host === 'localhost' || host === '127.0.0.1' || host === '::1'
}

/** Host Expo Go / Metro already connected to (the computer running `expo start`). */
function getExpoDevHost(): string | null {
  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.debuggerHost,
    Constants.linkingUri,
  ]

  for (const raw of candidates) {
    if (!raw) continue
    const withoutProtocol = raw.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, '')
    const host = withoutProtocol.split('/')[0]?.split(':')[0]
    if (host && !isLoopbackHost(host)) return host
  }

  return null
}

export function resolveApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL

  let parsed: URL
  try {
    parsed = new URL(configured)
  } catch {
    return configured.replace(/\/$/, '')
  }

  if (!isLoopbackHost(parsed.hostname)) {
    return parsed.toString().replace(/\/$/, '')
  }

  const lanHost = getExpoDevHost()
  if (lanHost) {
    parsed.hostname = lanHost
    return parsed.toString().replace(/\/$/, '')
  }

  // Android emulator loopback alias for the host machine.
  if (Platform.OS === 'android') {
    parsed.hostname = '10.0.2.2'
    return parsed.toString().replace(/\/$/, '')
  }

  return parsed.toString().replace(/\/$/, '')
}

export const API_BASE_URL = resolveApiBaseUrl()

if (__DEV__) {
  console.log(`[api] base URL → ${API_BASE_URL}`)
}
