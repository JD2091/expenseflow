/* ============================================================================
 * ExpenseFlow — useFinance
 * ----------------------------------------------------------------------------
 * A second hook, deliberately, rather than four more fields on `useExpenses`.
 *
 * `useExpenses` owns ONE employee's world: their rows, their filters, their
 * three stat cards. Four of the five screens read it and it is loaded on every
 * page. The Finance dashboard is a different question asked of the same entity
 * — company-wide aggregates and an unsettled queue — and it is asked by exactly
 * one screen.
 *
 * Folding it into `useExpenses` would mean every visit to `/expenses` paid for
 * four Finance round trips it never renders. Keeping it separate means the
 * Finance screen pays for its own data, and the two hooks can be read
 * independently by someone who has thirty seconds and a projector.
 *
 * It is a plain hook, not a provider: one consumer, no shared state to keep in
 * sync.
 * ========================================================================== */

import { useCallback, useEffect, useRef, useState } from 'react';

import { getFinanceSnapshot } from '../services/expenseService';
import type { FinanceSnapshot } from '../services/expenseService';

export interface UseFinance {
  snapshot: FinanceSnapshot | null;
  isLoading: boolean;
  /** Already translated by the service layer — safe to render as-is. */
  error: string | null;
  /** The error object, so `<ErrorState>` draws the right affordance. */
  errorCause: unknown;
  refresh: () => Promise<void>;
}

export function useFinance(): UseFinance {
  const [snapshot, setSnapshot] = useState<FinanceSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCause, setErrorCause] = useState<unknown>(null);
  const didLoad = useRef(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setErrorCause(null);
    try {
      setSnapshot(await getFinanceSnapshot());
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Could not load the Finance dashboard.',
      );
      setErrorCause(cause);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Strict Mode double-invokes effects in dev; one load is enough.
    if (didLoad.current) return;
    didLoad.current = true;
    void refresh();
  }, [refresh]);

  return { snapshot, isLoading, error, errorCause, refresh };
}
