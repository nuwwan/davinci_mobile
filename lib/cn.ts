type ClassValue = string | false | null | undefined;

/** Tiny className joiner — drops falsy values and trims. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
