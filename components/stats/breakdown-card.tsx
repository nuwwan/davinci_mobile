import { AppText, Card } from '@/components/ui';
import { SubjectProgressRow } from './subject-progress-row';

export type BreakdownRow = { key: string; label: string; accuracy: number; attempted: number };

/**
 * Accuracy-per-group card (Figma H2b "By subject"): card title, then one
 * label · % · 6pt bar row per group. With no rows it shows `emptyMessage`,
 * or renders nothing when no message is given.
 */
export function BreakdownCard({
  title,
  rows,
  emptyMessage,
}: {
  title: string;
  rows: BreakdownRow[];
  emptyMessage?: string;
}) {
  if (!rows.length && !emptyMessage) return null;
  return (
    <Card className="gap-4">
      <AppText variant="cardTitle">{title}</AppText>
      {rows.length ? (
        rows.map((r) => <SubjectProgressRow key={r.key} label={r.label} value={r.accuracy} />)
      ) : (
        <AppText variant="body" color="textTertiary" className="-mt-2">
          {emptyMessage}
        </AppText>
      )}
    </Card>
  );
}
