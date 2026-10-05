import type { BadgeTone } from '@/components/ui/badge';

/** difficulty_level (1–5) → label + badge tone (Figma: Easy green · Medium amber · Hard+ red). */
const DIFFICULTY: Record<number, { label: string; tone: BadgeTone }> = {
  1: { label: 'Easy', tone: 'success' },
  2: { label: 'Medium', tone: 'accent' },
  3: { label: 'Hard', tone: 'error' },
  4: { label: 'Expert', tone: 'error' },
  5: { label: 'Master', tone: 'error' },
};

export function difficultyMeta(level: number | null | undefined) {
  return DIFFICULTY[level ?? 0] ?? { label: level ? `Level ${level}` : 'Unrated', tone: 'default' as BadgeTone };
}

/** Learner difficulty preference ("easy" | "medium" | "hard" | "mixed"). */
export const DIFFICULTY_PREFERENCES = ['easy', 'medium', 'hard', 'mixed'] as const;
export type DifficultyPreference = (typeof DIFFICULTY_PREFERENCES)[number];

const PREF_META: Record<DifficultyPreference, { label: string; tone: BadgeTone }> = {
  easy: { label: 'Easy', tone: 'success' },
  medium: { label: 'Medium', tone: 'accent' },
  hard: { label: 'Hard', tone: 'error' },
  mixed: { label: 'Mixed', tone: 'primary' },
};

export function preferenceMeta(pref: string | null | undefined) {
  return PREF_META[(pref ?? 'mixed') as DifficultyPreference] ?? PREF_META.mixed;
}

export const OPTION_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const optionLetter = (index: number) => OPTION_LETTERS[index] ?? String(index + 1);
