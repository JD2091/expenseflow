/* ============================================================================
 * ExpenseFlow — useExpenses
 * ============================================================================
 *
 *   Component  ->  Hook  ->  Service  ->  (Day 2: UiPath SDK)
 *                  ^^^^
 * `Expense tracker app screens.md` calls this the most important design
 * decision in the app, and it is the layer the Day-1 starter was missing.
 *
 * This hook owns ALL expense state: the rows, the filters, the totals, the
 * loading flag and the error. No component imports `expenseService` — this
 * file is its only caller. Swapping the service for the UiPath SDK on Day 2
 * changed not one component.
 *
 * It is exposed through a provider because five screens share one dataset:
 * submitting on `/expenses/new` has to move the stat cards on `/`. A bare hook
 * called five times would give five disconnected copies of the truth.
 *
 * ---------------------------------------------------------------------------
 * WHAT DAY 2 CHANGED HERE, AND WHY
 *
 * Two things, both of which are the service layer reaching through rather than
 * the UI changing shape:
 *
 *   totals          — was a `useMemo` reducing over the loaded rows. That is
 *                     only correct while every row is loaded, and every list
 *                     call returns ONE page (Critical Rule 14). It is now a
 *                     server-side COUNT/SUM, with the Day-1 reduction kept as
 *                     the synchronous fallback until the first result lands.
 *   policyThreshold — was the `POLICY_THRESHOLD` constant. It is now an
 *                     Orchestrator Asset, so it can be `null` while in flight.
 *
 * The list/create path — `expenses`, `mine`, `filtered`, `refresh`, `submit` —
 * is untouched.
 * ========================================================================== */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import {
  createExpense,
  decideExpense,
  getExpenseTotals,
  getPolicyThreshold,
  listExpenses,
} from '../services/expenseService';
import type { ExpenseDecision } from '../services/expenseService';
import type {
  Expense,
  ExpenseFilters,
  ExpenseTotals,
  NewExpenseInput,
} from '../models/expense';
import { deriveTotals } from '../lib/totals';
import { CURRENT_USER } from '../lib/constants';

export type { ExpenseTotals, TotalsBucket } from '../models/expense';

export interface UseExpenses {
  /** Every expense in the system — Screens 4 and 5 need other people's rows. */
  expenses: Expense[];
  /** The signed-in employee's rows — Screens 1 to 3. */
  mine: Expense[];
  /** `mine`, narrowed by the current filters. */
  filtered: Expense[];
  filters: ExpenseFilters;
  setFilters: (filters: ExpenseFilters) => void;
  totals: ExpenseTotals;
  /** From the `ExpenseFlow_PolicyThreshold` Asset. `null` until it arrives. */
  policyThreshold: number | null;
  /**
   * Why the threshold is missing, when it is.
   *
   * The Asset read is non-fatal — a screen full of expenses is still useful
   * without it — but "non-fatal" is not "invisible". Swallowing this into a
   * `console.error` is how a form quietly stops warning people that ₹37,550
   * needs approval, with nothing on screen to say the warning is gone.
   */
  policyThresholdError: string | null;
  isLoading: boolean;
  /** Already translated by the service layer — safe to render as-is. */
  error: string | null;
  /**
   * The error object behind `error`, so `<ErrorState>` can draw the right
   * affordance (Retry vs Sign in again) instead of always guessing Retry.
   */
  errorCause: unknown;
  refresh: () => Promise<void>;
  submit: (input: NewExpenseInput) => Promise<Expense>;
  /**
   * A manager's approve / reject / rework.
   *
   * Deliberately NOT swallowing its error: the caller is a button that has to
   * stay enabled and show what went wrong, and a hook that returns `void` on
   * failure cannot tell it. Same contract as `submit`.
   */
  decide: (expense: Expense, decision: ExpenseDecision) => Promise<Expense>;
}

const ExpensesContext = createContext<UseExpenses | undefined>(undefined);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [serverTotals, setServerTotals] = useState<ExpenseTotals | null>(null);
  const [policyThreshold, setPolicyThreshold] = useState<number | null>(null);
  const [policyThresholdError, setPolicyThresholdError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCause, setErrorCause] = useState<unknown>(null);
  const didLoad = useRef(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setErrorCause(null);
    try {
      // One round trip for the rows, one for the arithmetic. The second one
      // returns seven small grouped rows rather than every expense again.
      const [rows, totals] = await Promise.all([
        listExpenses(),
        getExpenseTotals(CURRENT_USER),
      ]);
      setExpenses(rows);
      setServerTotals(totals);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load expenses.');
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

  /**
   * The policy threshold is read once per page load, separately from the list.
   *
   * Separately, because a screen full of expenses is still useful when the
   * Asset cannot be read, and because "change the Asset, reload the app" is
   * the demo instruction — a page load is exactly the right cache boundary.
   */
  useEffect(() => {
    let cancelled = false;
    getPolicyThreshold()
      .then((value) => {
        if (!cancelled) setPolicyThreshold(value);
      })
      .catch((cause: unknown) => {
        // Non-fatal, but not silent — the form says so where the hint would be.
        console.error('[expenseflow] could not read the policy threshold', cause);
        if (!cancelled) {
          setPolicyThresholdError(
            cause instanceof Error
              ? cause.message
              : 'The policy threshold could not be read from Orchestrator.',
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = useCallback(
    async (input: NewExpenseInput) => {
      const created = await createExpense(input);
      await refresh();
      return created;
    },
    [refresh],
  );

  const decide = useCallback(
    async (expense: Expense, decision: ExpenseDecision) => {
      const decided = await decideExpense(expense, decision);
      await refresh();
      return decided;
    },
    [refresh],
  );

  const mine = useMemo(
    () => expenses.filter((expense) => expense.employee === CURRENT_USER),
    [expenses],
  );

  const filtered = useMemo(
    () =>
      mine.filter((expense) => {
        if (filters.status && expense.status !== filters.status) return false;
        if (filters.category && expense.category !== filters.category) return false;
        // ISO dates sort and compare correctly as plain strings.
        if (filters.dateFrom && expense.expenseDate < filters.dateFrom) return false;
        if (filters.dateTo && expense.expenseDate > filters.dateTo) return false;
        return true;
      }),
    [mine, filters],
  );

  /**
   * The three numbers on Screen 1. Never literals — which is why submitting an
   * expense moves both the amount and the "N expenses" helper (STATE.md §4.10:
   * the starter hardcoded them and they went stale on the first submit).
   *
   * Day 2 prefers the server's answer and falls back to the Day-1 reduction
   * only for the moment before it arrives.
   */
  const totals = useMemo<ExpenseTotals>(
    () => serverTotals ?? deriveTotals(mine),
    [serverTotals, mine],
  );

  const value = useMemo<UseExpenses>(
    () => ({
      expenses,
      mine,
      filtered,
      filters,
      setFilters,
      totals,
      policyThreshold,
      policyThresholdError,
      isLoading,
      error,
      errorCause,
      refresh,
      submit,
      decide,
    }),
    [
      expenses,
      mine,
      filtered,
      filters,
      totals,
      policyThreshold,
      policyThresholdError,
      isLoading,
      error,
      errorCause,
      refresh,
      submit,
      decide,
    ],
  );

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export function useExpenses(): UseExpenses {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
}
