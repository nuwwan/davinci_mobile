import { useCallback, useState } from 'react';

import { useToast } from '@/components/ui';
import {
  useSubscribeToSubjectMutation,
  useSubscribeToTopicMutation,
  useUnsubscribeFromSubjectMutation,
  useUnsubscribeFromTopicMutation,
} from '@/src/api/enhanced';

export type SubscriptionTarget = { kind: 'subject' | 'topic'; id: number; name: string };

const keyOf = (t: SubscriptionTarget) => `${t.kind}:${t.id}`;

/**
 * Subscribe / unsubscribe for subjects and topics (sub-areas), with toasts.
 * Uses the existing /learner/subscriptions/* endpoints; they invalidate the 'Learner'
 * tag so every catalog query refreshes its `is_subscribed` flags.
 */
export function useCatalogSubscription() {
  const { showToast } = useToast();
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [subSubject] = useSubscribeToSubjectMutation();
  const [unsubSubject] = useUnsubscribeFromSubjectMutation();
  const [subTopic] = useSubscribeToTopicMutation();
  const [unsubTopic] = useUnsubscribeFromTopicMutation();

  const run = useCallback(
    async (target: SubscriptionTarget, subscribe: boolean) => {
      setPendingKey(keyOf(target));
      try {
        if (target.kind === 'subject') {
          await (subscribe ? subSubject({ subjectId: target.id }) : unsubSubject({ subjectId: target.id })).unwrap();
        } else {
          await (subscribe ? subTopic({ subAreaId: target.id }) : unsubTopic({ subAreaId: target.id })).unwrap();
        }
        showToast(subscribe ? `Subscribed to ${target.name}!` : `Unsubscribed from ${target.name}.`, subscribe ? 'success' : 'info');
      } catch {
        showToast('Something went wrong. Try again.', 'error');
      } finally {
        setPendingKey(null);
      }
    },
    [showToast, subSubject, unsubSubject, subTopic, unsubTopic]
  );

  return {
    subscribe: (t: SubscriptionTarget) => run(t, true),
    unsubscribe: (t: SubscriptionTarget) => run(t, false),
    isPending: (t: SubscriptionTarget) => pendingKey === keyOf(t),
  };
}
