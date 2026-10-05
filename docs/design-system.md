# DaVinci Mobile — Design System

Source of truth: Figma **DaVinci Mobile** (pages: Auth/Onboarding/Home · Stats/Profile/Settings/States · Questions/Subjects).

## Tokens
- Colors: `src/theme/colors.ts` (light + dark) → mirrored as CSS vars in `global.css` → Tailwind names in `tailwind.config.js`.
  Classes: `bg-primary`, `bg-primary-light`, `bg-accent(-light)`, `bg-surface`, `bg-surface-2`, `bg-surface-3`, `border-border`,
  `text-t-primary|secondary|tertiary|inverse`, `bg-success(-bg)`, `border-success-border`, `bg-error(-bg)`, `border-error-border`.
- Type scale: `src/theme/typography.ts` — always render text with `<AppText variant=… color=…>`.
- Radii: sm 8 (inputs) · md 12 (options, toasts) · lg 16 (buttons, cards) · xl 20 (section cards, sheets) · 2xl 28 (hero cards).
- Spacing: 16pt gutters, 20pt gap between screen blocks, 12pt inside stacks. Sizes in `src/theme/tokens.ts`.
- Imperative colors (icons, spinners): `useTheme().colors`; card shadow `useTheme().shadow`.

## Components (`@/components/ui`)
AppText · Icon (Figma SVG set, `name` + semantic `color`) · Button (primary/outline/secondary/destructive/destructiveOutline/ghost) ·
TextLink · IconButton · Input / SearchBar · Badge / StatusDot · Chip / ChipGroup · SegmentedControl · Switch ·
Card (default/section/hero, tones) · InfoRow / ListRow / Divider · Avatar · ProgressBar · Skeleton · Spinner ·
EmptyState · InlineAlert / StatusStrip · StatTile / MetricCard · BottomSheet / ConfirmSheet · Collapsible · Toast (`useToast`).

Domain components: `@/components/question` (OptionButton, DailyQuestionCard, QuestionListItem, DifficultyBadge, ResultBanner,
ExplanationPanel), `@/components/stats` (WeekStreak, SubjectProgressRow), `@/components/profile` (ProfileHeader, EditProfileForm).
Layout: `@/components/layout` (Screen, ScrollScreen, PageHeader, NavHeader, BrandHeader, KeyboardAwareScrollView).

## Rules
1. No raw hex / font names in screens — use tokens and AppText variants.
2. Every data screen handles loading (Skeleton/Spinner), empty (EmptyState), error (EmptyState/InlineAlert + "Try again").
3. Reanimated `Animated.View` ignores `className` — style it with `style`.
4. Icons missing from the set: add a glyph to `components/ui/icon.tsx` in the same style (24 grid, 1.75 stroke, round caps).

## Pending API support (UI is ready)
- Questions tab list → `src/features/questions/useQuestionFeed.ts` (no learner question-list endpoint yet).
- Stats: answered / accuracy / by-subject → `src/features/stats/useLearnerStats.ts`.
- Profile edit: bio / location / institution / phone (PATCH /learner/me doesn't accept them).
- Settings: notification, font-size, privacy toggles and delete-account are local-only.
