import type { ReactNode } from 'react';

import { AppText, Button, Card } from '@/components/ui';

/**
 * Hero card for a subject (Figma M / Q4) or topic (Q7): optional overline · title ·
 * description · meta line · full-width Subscribe (primary) / Unsubscribe (outline).
 */
export function CatalogHero({
  overline,
  title,
  description,
  meta,
  subscribed,
  loading,
  onToggleSubscribe,
  children,
}: {
  overline?: string;
  title: string;
  description?: string | null;
  meta?: string;
  subscribed: boolean;
  loading?: boolean;
  onToggleSubscribe: () => void;
  children?: ReactNode;
}) {
  return (
    <Card variant="hero">
      {overline ? (
        <AppText variant="overline" color="textTertiary" numberOfLines={1}>
          {overline}
        </AppText>
      ) : null}
      <AppText variant="section" accessibilityRole="header" className={overline ? 'mt-1' : undefined}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="body" color="textSecondary" className="mt-1.5">
          {description}
        </AppText>
      ) : null}
      {meta ? (
        <AppText variant="badge" color="textTertiary" className="mt-3">
          {meta}
        </AppText>
      ) : null}
      {children}
      <Button
        title={subscribed ? 'Unsubscribe' : 'Subscribe'}
        variant={subscribed ? 'outline' : 'primary'}
        loading={loading}
        onPress={onToggleSubscribe}
        className="mt-4"
      />
    </Card>
  );
}
