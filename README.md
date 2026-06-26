# DaVinci Mobile

Expo + React Native client for the DaVinci MCQ learning platform. Uses
Redux Toolkit + RTK Query for all server state, with typed hooks generated
from the backend's OpenAPI spec.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure the API base URL

   ```bash
   cp .env.example .env.local
   # then edit EXPO_PUBLIC_API_URL if the backend isn't on localhost:8000
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory.
This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## State management

| Concern | Where it lives |
|---|---|
| Server state (every backend call) | RTK Query (`src/api/baseApi.ts`, `enhanced.ts`, `generated.ts`) |
| Auth tokens + current user | `src/features/auth/authSlice.ts` |
| Persistent token storage | `expo-secure-store` (Keychain / EncryptedSharedPreferences) via `src/app/secureStorage.ts` |
| Token refresh on 401 | `baseQueryWithReauth` in `src/api/baseApi.ts` (calls `/auth/refresh`) |

Tokens **never** land in AsyncStorage. The redux-persist storage adapter
is backed by `expo-secure-store` so the entire auth slice is encrypted at
rest on both iOS and Android.

## Regenerating the API client

`src/api/generated.ts` is produced from
`../davinci_backend/docs/openapi.json` and **must not be hand-edited**.
After the backend's spec changes:

```bash
# In davinci_backend
python scripts/export_openapi.py

# In davinci_mobile
npm run gen:api
```

Custom tag invalidation, response transforms, and onQueryStarted hooks
live in `src/api/enhanced.ts` — those survive regeneration.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Expo dev server |
| `npm run ios` / `npm run android` / `npm run web` | Open on a specific target |
| `npm run lint` | `expo lint` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run gen:api` | Regenerate the typed RTK Query client |

## Tech stack

- Expo 54 + React Native 0.81 + React 19
- Expo Router for navigation
- TypeScript 5.9
- Redux Toolkit + RTK Query, react-redux, redux-persist, async-mutex
- `expo-secure-store` for tokens
- `@rtk-query/codegen-openapi` for typed hooks

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
