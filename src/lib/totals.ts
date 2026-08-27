/* ============================================================================
 * ExpenseFlow — the three dashboard numbers
 * ----------------------------------------------------------------------------
 * Two ways in, one shape out.
 *
 *   deriveTotals()        — reduce over rows already in memory. Day 1's way,
 *                           and still correct for the mock service.
 *   rollUpStatusTotals()  — fold a per-status COUNT/SUM that Data Fabric
 *                           computed server-side. Day 2's way.
 *
 * The buckets are scoped to one employee by the caller: Screen 1 greets Rahul
 * by name and shows Rahul's money. His two Drafts (₹18,500, ₹2,500) appear in
 * the table and in none of the cards — that visible gap is the proof the cards
 * are computed rather than typed in.
 * ========================================================================== */

import type { Expense, ExpenseStatus, ExpenseTotals, TotalsBucket } from '../models/expense';
import { isInFlight, isSubmitted } from '../models/status';

const ZERO: TotalsBucket = { amount: 0, count: 0 };

export const EMPTY_TOTALS: ExpenseTotals = {
  submitted: ZERO,
  approved: ZERO,
  pending: ZERO,
};

function plus(bucket: TotalsBucket, amount: number, count: number): TotalsBucket {
  return { amount: bucket.amount + amount, count: bucket.count + count };
}

/** Client-side. Only correct when every row is already loaded. */
export function deriveTotals(expenses: Expense[]): ExpenseTotals {
  let submitted = ZERO;
  let approved = ZERO;
  let pending = ZERO;

  for (const expense of expenses) {
    if (!isSubmitted(expense.status)) continue; // a Draft is not submitted
    submitted = plus(submitted, expense.amount, 1);
    if (expense.status === 'Approved') approved = plus(approved, expense.amount, 1);
    else if (isInFlight(expense.status)) pending = plus(pending, expense.amount, 1);
  }

  return { submitted, approved, pending };
}

/**
 * Server-side. Folds `{ Approved: { count, amount }, ... }` into the same
 * three cards, using exactly the same status rules as `deriveTotals` so the
 * two paths can never disagree about what "pending" means.
 */
export function rollUpStatusTotals(
  byStatus: Partial<Record<ExpenseStatus, TotalsBucket>>,
): ExpenseTotals {
  let submitted = ZERO;
  let approved = ZERO;
  let pending = ZERO;

  for (const [key, bucket] of Object.entries(byStatus)) {
    const status = key as ExpenseStatus;
    if (bucket === undefined || !isSubmitted(status)) continue;
    submitted = plus(submitted, bucket.amount, bucket.count);
    if (status === 'Approved') approved = plus(approved, bucket.amount, bucket.count);
    else if (isInFlight(status)) pending = plus(pending, bucket.amount, bucket.count);
  }

  return { submitted, approved, pending };
}
