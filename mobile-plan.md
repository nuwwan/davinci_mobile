# QnA MCQ Platform — Mobile App Plan
> Coding agent instructions · React Native + Expo · iOS & Android
> This file is the single source of truth for building the mobile app.
> Follow sections in order. Do not skip ahead.

---

## 1. Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | React Native 0.73+ with Expo SDK 50+ |
| Language | TypeScript |
| Navigation | React Navigation v6 (Native Stack + Bottom Tabs) |
| Global state | Redux Toolkit |
| Server state + API | RTK Query |
| Styling | StyleSheet API + theme object (no Tailwind on mobile) |
| Forms + validation | React Hook Form + Zod |
| File uploads | expo-image-picker + expo-file-system → presigned S3 URL |
| Images | expo-image (caching + progressive loading) |
| Push notifications | expo-notifications |
| Secure storage | expo-secure-store (tokens) |
| Haptics | expo-haptics (feedback on answer selection) |
| Charts | victory-native |
| Icons | @expo/vector-icons (Ionicons set) |
| Offline | redux-persist + AsyncStorage |
| Testing | Jest + React Native Testing Library |

---

## 2. Project Folder Structure

```
src/
├── theme/
│   ├── colors.ts          # all color tokens — light and dark
│   ├── spacing.ts         # spacing scale
│   ├── typography.ts      # font sizes and weights
│   ├── radius.ts          # border radius scale
│   └── index.ts           # exports ThemeProvider and useTheme hook
├── navigation/
│   ├── RootNavigator.tsx  # top-level: auth vs app stack
│   ├── AppNavigator.tsx   # bottom tabs + nested stacks
│   ├── AuthNavigator.tsx  # login / register
│   └── types.ts           # NavigationProp types for all screens
├── features/
│   ├── auth/              # login, register, token refresh
│   ├── questions/         # browse, create (creator), detail
│   ├── daily/             # learner daily queue + attempt flow
│   ├── papers/            # Phase 2 — paper list + exam mode
│   ├── progress/          # stats, streak, history
│   ├── subjects/          # browse, subscribe, settings
│   └── admin/             # moderation, user management
├── components/
│   ├── ui/                # Button, Card, Badge, Input, Modal, Spinner, Toast, Avatar, ProgressBar
│   ├── question/          # QuestionCard, OptionButton, ExplanationPanel, ImageQuestion
│   └── layout/            # Screen, Header, SafeArea, KeyboardAware
├── hooks/                 # useAuth, useTheme, useToast, useHaptics, useDebounce
├── store/
│   ├── index.ts           # Redux store + persist config
│   ├── authSlice.ts
│   └── api/               # RTK Query feature endpoints
├── utils/                 # token helpers, formatters, validators
└── types/                 # shared TypeScript interfaces
```

Every feature folder contains:
- `featureApi.ts` — RTK Query endpoints
- `featureSlice.ts` — local Redux state if needed
- Screen-level components named `FeatureScreen.tsx`
- A `components/` subfolder for feature-specific smaller pieces

---

## 3. Navigation Structure

```
RootNavigator
├── AuthNavigator (if not logged in)
│   ├── LoginScreen
│   └── RegisterScreen
│
└── AppNavigator (if logged in)
    ├── BottomTabNavigator
    │   ├── Tab: Home         → HomeScreen (role-aware dashboard)
    │   ├── Tab: Learn        → DailyScreen (learner) / QuestionsScreen (creator)
    │   ├── Tab: Papers       → PaperListScreen               [Phase 2]
    │   ├── Tab: Progress     → ProgressScreen
    │   └── Tab: Profile      → ProfileScreen
    │
    └── Modal / Stack screens (presented over tabs)
        ├── QuestionDetailScreen
        ├── QuestionEditorScreen    (creator)
        ├── SubjectDetailScreen
        ├── SubjectBrowseScreen
        ├── AttemptResultScreen     (daily results)
        ├── PaperAttemptScreen      (full-screen exam) [Phase 2]
        ├── PaperResultScreen                          [Phase 2]
        ├── ModerationScreen        (admin)
        └── AdminUsersScreen        (admin)
```

**Navigation rules:**
- Use `NativeStackNavigator` for all screen-to-screen navigation — native transitions
- Use `BottomTabNavigator` for the main 5-tab structure
- Present exam/attempt screens as full-screen modals that hide the tab bar
- Admin-only screens do not appear in tabs — accessed via Profile screen links
- After login: navigate to Home, reset auth stack so back button cannot return to login
- On logout: reset to AuthNavigator

**Tab bar visibility:**
- Hide tab bar on: QuestionEditorScreen, PaperAttemptScreen, AttemptResultScreen
- Always visible on all other screens

---

## 4. Design Tokens

Create `src/theme/colors.ts`. This is the only place hex values appear in the entire codebase.

### Light theme object

```
primary:          #4F46E5   — buttons, selected states, active nav
primaryHover:     #4338CA   — pressed state
primaryLight:     #EEF2FF   — option hover bg, tinted surfaces
primaryMuted:     #C7D2FE   — borders on tinted backgrounds
secondary:        #0EA5E9   — progress bars, links, accents
secondaryLight:   #E0F2FE   — secondary tints

surface:          #FFFFFF   — cards, modals, inputs
surface2:         #F8F9FF   — option default bg, inner panels
surface3:         #F1F3FA   — screen background

border:           #E4E7F0   — default borders and dividers
borderStrong:     #C8CDD8   — active inputs

textPrimary:      #0F172A   — headings, question text
textSecondary:    #475569   — labels, metadata
textTertiary:     #94A3B8   — placeholders, hints
textInverse:      #FFFFFF   — text on colored buttons

correct:          #059669   — correct answer text
correctBg:        #ECFDF5   — correct answer background
correctBorder:    #6EE7B7   — correct answer border
wrong:            #DC2626   — wrong answer text
wrongBg:          #FEF2F2   — wrong answer background
wrongBorder:      #FCA5A5   — wrong answer border

streak:           #D97706   — streak counter, XP, fire
streakBg:         #FFFBEB   — streak card background
```

### Dark theme object

```
primary:          #818CF8
primaryHover:     #6366F1
primaryLight:     #1E1B4B
primaryMuted:     #312E81
secondary:        #38BDF8
secondaryLight:   #0C2A3D

surface:          #1A1D2E
surface2:         #1E2235
surface3:         #252840

border:           #2E3250
borderStrong:     #404668

textPrimary:      #F1F5F9
textSecondary:    #94A3B8
textTertiary:     #475569
textInverse:      #0F172A

correct:          #34D399
correctBg:        #022C22
correctBorder:    #065F46
wrong:            #F87171
wrongBg:          #2D0A0A
wrongBorder:      #7F1D1D

streak:           #FCD34D
streakBg:         #1C1500
```

### Spacing scale (4px base — use only these values)
`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64`

### Border radius scale
| Name | Value | Use |
|------|-------|-----|
| sm | 4 | Tags, badges |
| md | 8 | Buttons, inputs |
| lg | 12 | Option buttons |
| xl | 16 | Cards |
| xxl | 24 | Bottom sheets, modals |
| full | 9999 | Pills, avatars, streak badges |

### Typography scale
| Size | Weight | Use |
|------|--------|-----|
| 28 | 700 | Screen titles |
| 22 | 600 | Section headings |
| 18 | 600 | Card headings |
| 16 | 500 | Question body text |
| 15 | 400 | Option labels, body copy |
| 13 | 400 | Metadata, helper text |
| 12 | 400 | Timestamps, hints |

Font: Use `Inter` via `expo-font` and `@expo-google-fonts/inter`. Load `Inter_400Regular`, `Inter_500Medium`, `Inter_600SemiBold`, `Inter_700Bold`.

### Theme context
- Create a `ThemeContext` with `theme` object and `isDark` boolean and `toggleTheme` function
- Wrap the entire app in `ThemeProvider`
- Every component accesses colors via `const { theme } = useTheme()` — never import colors directly
- Store preference in `expo-secure-store` as `theme_preference`
- Default to system preference via `useColorScheme()` on first launch

---

## 5. Authentication

### Token storage
- Access token: stored in `expo-secure-store` — expires in 15 minutes
- Refresh token: stored in `expo-secure-store` — expires in 7 days
- User object: stored in Redux + persisted with `redux-persist`
- On app launch: read tokens from SecureStore → call refresh → update Redux state

### Auth flow
1. App launches → check SecureStore for tokens
2. If tokens exist: call `POST /api/auth/refresh` silently
3. If refresh succeeds: store new access token, set user in Redux, go to AppNavigator
4. If refresh fails or no tokens: go to AuthNavigator
5. On login form submit: POST login → store tokens → navigate to AppNavigator with reset
6. On logout: clear SecureStore, clear Redux state, navigate to AuthNavigator with reset

### RTK Query auth integration
- Use `baseQuery` with automatic token injection from SecureStore
- On 401 response: attempt refresh → retry original request → if still 401, logout
- All API calls are queued during token refresh to avoid duplicate refresh requests

### Redux `authSlice` holds
- `user` — `{ user_id, username, email, role, avatar_url }` or `null`
- `isAuthenticated` — boolean
- `isLoading` — true during initial token check

---

## 6. API Layer (RTK Query)

Base URL from Expo constants / environment config. One base `api` with injected endpoint groups per feature.

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`

### Questions
- `GET /api/questions` — params: `subject_id`, `difficulty`, `tags`, `media_type`, `search`, `page`
- `GET /api/questions/:id`
- `POST /api/questions` — multipart (creator)
- `PUT /api/questions/:id` — multipart (creator/admin)
- `POST /api/questions/:id/rate`
- `POST /api/questions/:id/report`

### Daily
- `GET /api/daily-questions`
- `POST /api/daily-questions/:id/attempt`

### Subjects
- `GET /api/subjects`
- `GET /api/subjects/:id`
- `GET /api/subjects/:id/sub-areas`

### Subscriptions
- `GET /api/subscriptions`
- `POST /api/subscriptions`
- `PUT /api/subscriptions/:id`
- `DELETE /api/subscriptions/:id`

### Progress
- `GET /api/progress`
- `GET /api/progress/subjects/:id`

### Papers — Phase 2
- `GET /api/papers`
- `GET /api/papers/:id`
- `POST /api/papers/:id/attempt`
- `GET /api/papers/:id/results/:attempt_id`

### Admin
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/deactivate`
- `GET /api/admin/questions/pending`
- `PUT /api/admin/questions/:id/approve`
- `PUT /api/admin/questions/:id/reject`

---

## 7. Screen-by-Screen Instructions

---

### 7.1 Login Screen

- Full-screen layout with logo at top (40% of screen height for branding area)
- Logo: app name in 28px bold primary color on surface-3 background
- Form card: white surface, rounded-xxl, padding 24, shadow-md
- Fields: Email input, Password input with show/hide eye icon
- "Sign in" button: full width, primary bg, 52px height, rounded-lg
- "Don't have an account? Register" — centered text link below button
- Keyboard: `KeyboardAvoidingView` wrapping the form, behavior `padding` on iOS / `height` on Android
- Error: red text below the relevant field, not a toast
- Loading: spinner inside button, button disabled

---

### 7.2 Register Screen

- Same layout as login
- Fields: First name, Last name, Email, Password, Confirm password
- Role selector: two large toggle cards — "I want to learn" and "I want to create content"
  - Selected card: primary border + primary-light bg
  - Unselected: border + surface bg
- Password strength: row of 4 dots below password field that fill with primary color as strength increases
- "Create account" button: primary, full width
- Success: navigate to a "Check your email" screen — do not auto-login

---

### 7.3 Home Screen (Dashboard)

**Learner view:**
- Top section: greeting ("Good morning, [name]") + avatar
- Streak card: horizontal card with fire emoji (24px), streak number in streak color, "day streak" label
- Today's progress: progress bar + "X of Y questions done today" text + "Start" button
- Stats row: 3 small metric cards in a row — Accuracy, Answered, This week
- "My subjects" section: horizontal scroll of subject pills — tap to go to subject detail

**Creator view:**
- Greeting + avatar
- Stats row: My questions count, Pending review, Average rating
- "Recent questions" list: last 5 questions with status badge
- "Create question" FAB-style button fixed at bottom right

**Admin view:**
- Greeting + avatar
- Stats row: Total users, Pending moderation, Questions today
- Moderation queue preview: top 3 items with "Review all →" link

---

### 7.4 Daily Questions Screen — the most important screen

This screen is a focused, distraction-free single-question experience.

**Header:**
- Question number: "3 / 10" — right aligned
- Progress bar below header: full width, 4px height, primary color fill
- Subject pill + difficulty badge inline

**Question area:**
- Scroll view — question can have long text or an image
- If image question: full-width image with rounded-lg corners, then text below
- If text only: 16px / 500 weight, 1.6 line height, generous vertical padding
- Question text area has minimum 60% of screen height before options start

**Options area (below question):**
- 4 option buttons stacked, 8px gap
- Each option: 52px minimum height, rounded-lg, full width
- Index badge (A/B/C/D): 28×28 square, rounded-md, left side of button
- Option label: 15px, left of index badge, flex-1, wraps if needed

**Option states:**
| State | Background | Border color | Index badge | Text color |
|-------|-----------|--------------|-------------|-----------|
| Default | surface-2 | border | surface-3 bg + textSecondary | textPrimary |
| Pressed | primaryLight | primary | primary bg + white | textPrimary |
| Selected | primaryLight | primary, 1.5px | primary bg + white | textPrimary |
| Correct | correctBg | correctBorder | correct bg + white | correct |
| Wrong | wrongBg | wrongBorder | wrong bg + white | wrong |
| Dimmed (others after submit) | surface | border | surface-3 | textTertiary |

**Haptic feedback:**
- Light impact on option selection
- Success haptic on correct answer
- Warning haptic on wrong answer

**Submit / next flow:**
- "Submit" button: active only when option selected, primary bg, full width, 52px, rounded-lg, fixed at bottom
- After submit: explanation panel slides up from below options with animation (spring, 300ms)
- Explanation panel: correctBg border + background, correct text color, rounded-lg, padding 16
- Button changes to "Next →"
- Last question: button changes to "See results →"
- "Skip" link: small, textSecondary, centered, above submit button

**Bottom sheet or full-screen for results:**
- After all daily questions: navigate to AttemptResultScreen
- Show: score card, accuracy %, correct/wrong/skipped breakdown
- Subject performance row
- "Back to home" button

---

### 7.5 Subject Browse Screen

- Search bar at top (always visible, not collapsible)
- Filter chips below search: "All" · "Subscribed" · "Mathematics" · "Science" etc.
- Grid: 2 columns of subject cards
- Each card: subject icon (48px, rounded-xl), name, question count, subscriber count
- Subscribed indicator: small primary checkmark badge on top-right of card
- Pull to refresh

**Subject Detail Screen (pushed from browse):**
- Header: large subject icon + name + description
- Stats row: questions, sub-areas, your accuracy
- "Subscribe" / "Subscribed" button — full width
- If subscribed: settings section below
  - Daily count: slider with value label (1–50)
  - Difficulty: segmented control (Easy / Medium / Hard / Mixed)
  - Save button
- Sub-areas list: each row has name + accuracy bar (if subscribed)
- "Unsubscribe" text button at bottom, destructive red color

---

### 7.6 Question Editor Screen (Creator only)

Scrollable single-column form. Presented as a modal stack so it can be dismissed.

**Section 1 — Question content:**
- Content type picker: "Text" / "Image" / "Both" — segmented control
- If text: multiline TextInput, min height 100, grows with content
- If image: large dashed upload area (tap to open image picker), preview replaces area after selection, alt text input below preview
- If both: text input first, then image upload below

**Section 2 — Answer options:**
- 2 options shown by default, "Add option" button to add up to 6
- Each option row:
  - Left: radio button (tap to mark as correct)
  - Center: text input + optional small image attachment icon
  - Right: drag handle (reorder) + remove button
- Correct option row has primary-light background + primary left border (3px)

**Section 3 — Explanation:**
- Toggle to expand/collapse (collapsed by default)
- Text input + optional image upload inside

**Section 4 — Metadata:**
- Subject: modal picker (search + list)
- Sub-area: modal picker (filtered by chosen subject)
- Tags: tag input with autocomplete — shows suggestions below input
- Difficulty: 5 horizontal buttons labeled 1–5, selected fills with primary
- Marks: numeric input, default 1.0
- Negative marks: numeric input, default 0.0

**Footer (fixed at bottom):**
- Two buttons: "Save draft" (outline) + "Submit for review" (primary)
- Both full width in a row with 8px gap

---

### 7.7 Progress Screen

- Top: circular accuracy indicator (large, primary color arc) with percentage inside
- Below: streak card + total answered count
- Section: "Accuracy over time" — line chart (victory-native), 30-day window, scroll horizontally if needed
- Section: "By subject" — list of subject cards
  - Each: subject name, linear progress bar, correct/total text, chevron to expand
  - Expanded: sub-area list with individual accuracy bars
- Section: "Weak areas" — red-tinted list of sub-areas below 70% accuracy
- Section: "Attempt history" — paginated FlatList, each row: date, question preview, result dot (green/red), marks

---

### 7.8 Profile Screen

- Avatar (80px circle) + name + email + role badge
- "Edit profile" row
- "Change password" row
- Section "Preferences":
  - Dark mode toggle row
  - Notification settings row
- Section "Account":
  - "Sign out" row (red text)
- Admin section (visible only if role === 'admin'):
  - "Moderation queue" row with pending count badge
  - "Manage users" row
  - "Manage subjects" row

---

### 7.9 Moderation Screen (Admin only)

- Accessed from Profile screen, not bottom tabs
- Card-based list of pending questions
- Each card: question preview (2 lines), creator name, subject, submitted date, two action buttons inline
- Action buttons: "Approve" (green outline) + "Reject" (red outline)
- Reject: tap opens a bottom sheet with a reason text input + confirm button
- Pull to refresh
- Empty state: illustration + "All caught up!"

---

### 7.10 Paper List Screen — Phase 2

- Header with "Available papers" title + filter icon
- Filter bottom sheet: subject, difficulty, duration
- List of paper cards: name, subject, question count, duration, marks, "Start" button
- Started/completed papers show result badge instead of start button

**Paper Attempt Screen — Phase 2:**

Full-screen — hide tab bar completely.

- Custom header: paper name (truncated) + timer + "Exit" button (left)
- Timer: `MM:SS` format, turns red when under 5 minutes
- Question display: identical to daily question card (same option states, same haptics)
- Bottom bar: Previous button + question grid icon (center) + Next button
- Question grid (bottom sheet): 5-column dot grid, each dot colored by status:
  - Gray = unanswered
  - Primary = answered
  - Amber = marked for review
- "Mark for review" star icon in question header
- Auto-save on each answer selection — no per-question submit
- Final submit: confirmation bottom sheet showing answered/unanswered/review counts

**Paper Results Screen — Phase 2:**
- Score card with marks obtained / total, percentage, time taken
- Accuracy donut chart (victory-native)
- Per-question review list — expandable rows
- Correct rows: correctBg tint · Wrong rows: wrongBg tint

---

## 8. Global Mobile UI Behaviour

### Offline support
- Cache today's daily questions to AsyncStorage after first load via redux-persist
- If offline: show cached questions with "Offline mode" banner, sync attempts when back online
- Do not cache papers — require connection
- Show network status banner when offline (amber, top of screen)

### Pull to refresh
- Every list/feed screen must implement pull-to-refresh
- Spinner color: primary

### Loading states
- Full-screen loading: centered ActivityIndicator in primary color on surface-3 background
- List loading: skeleton rows (gray animated pulse)
- Button loading: replace label with ActivityIndicator, disable button
- Image loading: blur-hash placeholder until image loads

### Empty states
- Every FlatList needs `ListEmptyComponent`
- Daily queue empty: "You've finished for today!" + check illustration + "Back to home" button
- Subject list empty: "No subjects yet" + browse button
- Question list empty (creator): "No questions yet" + create button

### Error handling
- Network error: toast "No connection. Check your internet."
- 401: auto-refresh or logout (handled in baseQuery, not in screens)
- 403: inline message on screen, not a toast
- Server error: toast with "Something went wrong. Try again."

### Toasts / snackbars
- Use a custom toast that appears at top of screen (below status bar)
- Success: correctBg + correct text
- Error: wrongBg + wrong text
- Info: primaryLight + primary text
- Auto-dismiss after 3 seconds
- Never show more than one toast at a time

### Keyboard behaviour
- All screens with inputs: `KeyboardAvoidingView` — behavior `padding` iOS, `height` Android
- For forms that scroll: `KeyboardAwareScrollView` from `react-native-keyboard-aware-scroll-view`
- Dismiss keyboard on tap outside input

### Safe areas
- All screens: wrap content in `SafeAreaView` from `react-native-safe-area-context`
- Bottom padding accounts for home indicator on iPhone, navigation bar on Android
- Tab bar respects safe area automatically via React Navigation

### Animations and transitions
- Screen transitions: default native slide (iOS) / fade-up (Android)
- Option state change: 150ms color transition using `Animated.Value` or `react-native-reanimated`
- Explanation panel: spring slide-up animation when revealed after answer submit
- Bottom sheets: use `@gorhom/bottom-sheet` for all bottom sheet interactions

### Haptics (expo-haptics)
- `ImpactFeedbackStyle.Light` — option button tap
- `NotificationFeedbackType.Success` — correct answer revealed
- `NotificationFeedbackType.Warning` — wrong answer revealed
- `ImpactFeedbackStyle.Medium` — submit button tap

---

## 9. Push Notifications

Use `expo-notifications`. Request permission on first login (after successful auth, not on app launch).

### Notification types
| Trigger | Message |
|---------|---------|
| Daily questions available | "Your [N] daily questions are ready! 🎯" |
| Streak at risk | "Don't break your [N]-day streak! Answer today's questions." |
| Question approved (creator) | "Your question was approved and is now live." |
| Question rejected (creator) | "A question needs your attention — see feedback." |

### Local notification scheduling
- Schedule a daily notification at the user's preferred time (stored in subscription preferences)
- Cancel and reschedule when user changes preferred time
- Cancel all notifications on logout

---

## 10. Component Colour Rules

| Component | Default | Pressed | Selected | Disabled |
|-----------|---------|---------|----------|----------|
| Primary button | primary bg, white text | primaryHover bg, scale 0.97 | — | 40% opacity |
| Outline button | transparent, primary border+text | primaryLight bg | primary bg + white text | 40% opacity |
| Answer option | surface2, border | primaryLight, primary border | primaryLight, primary border, primary index | — |
| Correct option | correctBg, correctBorder, correct text | — | — | — |
| Wrong option | wrongBg, wrongBorder, wrong text | — | — | — |
| Input | surface, border | — | borderStrong, focus ring | surface3, textTertiary |
| Tab bar item | textTertiary icon | — | primary icon + label | — |
| Bottom sheet handle | border color | — | — | — |

---

## 11. Responsive Layout Targets

| Device | Width | Notes |
|--------|-------|-------|
| Small phone (SE) | 375px | Single column, compact spacing (12px base) |
| Standard phone | 390–430px | Default layout |
| Large phone | 430px+ | Slightly larger text, more padding |
| Tablet (future) | 768px+ | Two-column layout for daily + settings |

Use `Dimensions.get('window').width` once in a `useWindowDimensions` hook and derive layout decisions from it. Do not hardcode widths for device-specific layouts.

---

## 12. Phase Build Order

Build in this exact order. Do not start Phase 2 until Phase 1 is stable on both iOS and Android.

### Phase 1 (build first)
1. Project setup — Expo + TypeScript + theme system + navigation skeleton
2. Auth — login, register, token storage, auto-refresh, guards
3. Bottom tab navigation + Home screen (all three role views)
4. Subject browse + subscribe + preferences
5. Daily question screen — the full attempt flow with all option states
6. Attempt results screen
7. Progress screen + charts
8. Creator: question editor screen
9. Creator: question list screen
10. Admin: moderation screen
11. Profile screen + dark mode toggle + logout
12. Push notifications setup

### Phase 2 (after Phase 1 stable)
1. Paper list screen
2. Paper detail screen
3. Paper attempt screen (exam mode, full screen)
4. Paper results screen

### Phase 3 (future)
- AI question generation (creator)
- Certificate display screen
- Organisation/institution support
- Advanced analytics screens

---

## 13. Environment Configuration

Use `expo-constants` and `app.config.ts` for all environment values.

```
API_URL           = https://your-api-domain.com
CDN_URL           = https://your-cloudfront-url.cloudfront.net
SENTRY_DSN        = (for crash reporting)
```

Use `app.config.ts` with `extra` field and access via `Constants.expoConfig.extra`.

---

## 14. Critical Rules for the Coding Agent

1. **Never hardcode a hex color.** Always access colors through `theme.colors.*` via `useTheme()`.
2. **Never store the access token in AsyncStorage.** Use `expo-secure-store` exclusively.
3. **All list screens must use `FlatList` or `SectionList`.** Never `ScrollView` with `.map()` — it renders all items at once and kills performance.
4. **Every image must have an `accessibilityLabel` prop.** This is the alt text equivalent on mobile.
5. **All API calls go through RTK Query.** No raw `fetch` calls in screen components.
6. **Test on both iOS and Android after every major screen.** Spacing, shadows, and font rendering differ significantly between platforms.
7. **The daily question attempt is irreversible.** Once an answer is submitted, disable all options. Never allow re-selection.
8. **Haptics are mandatory on answer selection and result reveal.** They are core to the "engaging" experience requirement.
9. **Dark mode must work perfectly.** Every screen built must be tested in dark mode before marking complete.
10. **The exam (paper attempt) screen must auto-save.** Treat the attempt as a draft that is continuously persisted — the explicit submit just finalises it.
11. **Never use inline styles for colors or spacing.** Always reference theme tokens. This ensures dark mode and consistency.
12. **Bottom sheets must use `@gorhom/bottom-sheet`.** Do not build custom bottom sheet implementations.
13. **`user_progress` is read-only from the mobile app.** Never write to it via API — it is backend-computed only.
