import { Badge } from '@/components/ui/badge';
import { difficultyMeta } from '@/lib/question';

export function DifficultyBadge({ level }: { level: number | null | undefined }) {
  const { label, tone } = difficultyMeta(level);
  return <Badge label={label} tone={tone} />;
}
