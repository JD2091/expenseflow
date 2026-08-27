/* ============================================================================
 * ExpenseFlow — expense service, DAY 1 IMPLEMENTATION
 * ============================================================================
 *
 *   >>> THIS IS THE SEAM WE DESIGNED YESTERDAY. <<<
 *
 * Nothing in here changed on Day 2. It is byte-for-byte the logic that shipped
 * at `day1-final`, moved sideways into its own file and left alone, plus the
 * server-side-totals function Day 2 added to the interface.
 *
 * It is kept for two reasons:
 *
 *   1. It is the fallback. If the tenant is unreachable mid-session — expired
 *      refresh token, VPN, a UiPath incident — append `?mock=1` to the URL and
 *      the entire app keeps working, live, with no rebuild. A workshop that
 *      dies because a network died is not a workshop.
 *
 *   2. It is the argument. Two files implement the same two signatures; one
 *      talks to an array and one talks to a platform, and not one component
 *      can tell the difference. That is what the hook layer bought us.
 * ========================================================================== */

import type {
  Expense,
  ExpenseFilters,
  ExpenseTotals,
  NewExpenseInput,
} from '../models/expense';
import { initialExpenses } from '../data/mockExpenses';
import { deriveTotals } from '../lib/totals';
import { isInFlight, isSubmitted } from '../models/status';
import { CURRENT_MANAGER, CURRENT_USER } from '../lib/constants';

/**
 * THE SWITCH.
 *
 * `?mock=1` on any URL, no rebuild, no redeploy — that is the point. The env
 * var is for a machine that should never touch the tenant at all (CI, a
 * rehearsal laptop with no `uip login`).
 */
export const USE_MOCK: boolean =
  import.meta.env?.VITE_EXPENSEFLOW_MOCK === '1' ||
  new URLSearchParams(window.location.search).get('mock') === '1';

/** The Day-1 "database". Day 2: a Data Fabric entity. */
let expenses: Expense[] = [...initialExpenses];

/**
 * The company's auto-approval ceiling, in rupees.
 *
 * On Day 2 this is `Assets.getByName('ExpenseFlow_PolicyThreshold')` and this
 * literal is the ONLY ₹25,000 left in `src/` — deliberately, so that
 * `grep -rn 25000 src/ | grep -v mock` comes back empty and the claim "the
 * business policy lives in UiPath" is checkable rather than rhetorical.
 */
export const MOCK_POLICY_THRESHOLD = 25000;

/**
 * A monotonic counter, seeded ABOVE the highest code in the fixture.
 *
 * The Day-1 starter minted codes from the size of the array plus 1001, which
 * repeats a code the moment a row is removed and re-added (STATE.md §4.11).
 * A counter only ever goes up. Day 2 replaces it with "lowest unused code in
 * the EXP-1xxx band", which is reset-stable in a way a counter is not.
 */
let nextCodeNumber = expenses.reduce(
  (highest, expense) => Math.max(highest, Number(expense.expenseCode.replace('EXP-', '')) || 0),
  1000,
);

function nextExpenseCode(): string {
  nextCodeNumber += 1;
  return `EXP-${nextCodeNumber}`;
}

/** Long enough that a skeleton is visible on a projector, short enough to feel instant. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/**
 * Dev-only failure switch: append `?simulateError=1` to any URL to see the
 * error state on a real screen. Day 2 does not need it — a 401 from an expired
 * token provides the same experience for free.
 */
function shouldSimulateFailure(): boolean {
  return new URLSearchParams(window.location.search).get('simulateError') === '1';
}

function matchesFilters(expense: Expense, filters: ExpenseFilters): boolean {
  if (filters.status && expense.status !== filters.status) return false;
  if (filters.category && expense.category !== filters.category) return false;
  // ISO dates (`YYYY-MM-DD`) compare correctly as strings — no Date parsing,
  // so no timezone surprises.
  if (filters.dateFrom && expense.expenseDate < filters.dateFrom) return false;
  if (filters.dateTo && expense.expenseDate > filters.dateTo) return false;
  return true;
}

/** Every expense, newest first, optionally narrowed. */
export async function listExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
  await delay(250);

  if (shouldSimulateFailure()) {
    throw new Error('Could not reach the expense service.');
  }

  const rows = filters ? expenses.filter((expense) => matchesFilters(expense, filters)) : expenses;
  return [...rows].sort((a, b) => b.expenseDate.localeCompare(a.expenseDate));
}

/**
 * Create an expense and put it straight into the pipeline.
 *
 * It lands as `Submitted`, not `Draft`: the button says "Submit Expense", and
 * the whole point of the Day-1 finale is watching the stat cards move.
 */
export async function createExpense(input: NewExpenseInput): Promise<Expense> {
  await delay(350);

  const expenseCode = nextExpenseCode();
  const expense: Expense = {
    id: expenseCode.toLowerCase(),
    expenseCode,
    employee: CURRENT_USER,
    description: input.description,
    category: input.category,
    amount: input.amount,
    expenseDate: input.expenseDate,
    status: 'Submitted',
    receiptName: input.receiptName,
    submittedAt: new Date().toISOString(),
  };

  expenses = [expense, ...expenses];
  return expense;
}

/**
 * A manager decision, with no Action Center to talk to.
 *
 * The real service completes the task FIRST and updates the record second, so
 * a failure leaves both systems agreeing. There is only one system here, so
 * the ordering has nothing to protect — but the SIGNATURE is identical, which
 * is the whole reason this file exists: `?mock=1` has to be a working app, not
 * a screenshot.
 */
export async function decideExpense(
  expense: Expense,
  decision: { action: 'Approve' | 'Reject' | 'Rework'; comments: string; decidedBy?: string },
): Promise<Expense> {
  await delay(300);

  if (shouldSimulateFailure()) {
    throw new Error('Could not reach the approval service.');
  }

  const status = (
    { Approve: 'Approved', Reject: 'Rejected', Rework: 'Reworked' } as const
  )[decision.action];

  const decided: Expense = {
    ...expense,
    status,
    decidedAt: new Date().toISOString(),
    decidedBy: decision.decidedBy ?? CURRENT_MANAGER,
    comments: decision.comments.trim() === '' ? expense.comments : decision.comments.trim(),
  };

  expenses = expenses.map((row) => (row.id === expense.id ? decided : row));
  return decided;
}

/**
 * The Finance snapshot, reduced over the array.
 *
 * The real service asks Data Fabric for COUNT / SUM / MAX and gets four numbers
 * back. There is no server here, so this is the arithmetic done the Day-1 way —
 * which is correct precisely because the whole "table" is one in-memory array.
 * That is the difference the segment is about: a reduce is not wrong, it is
 * wrong ONCE THE ROWS STOP FITTING IN ONE PAGE.
 */
export async function getFinanceSnapshot(): Promise<{
  summary: {
    submitted: { count: number; total: number };
    pending: { count: number; total: number };
    month: string | null;
    monthTotal: { count: number; total: number };
  };
  unsettled: Expense[];
}> {
  await delay(200);

  if (shouldSimulateFailure()) {
    throw new Error('Could not reach the expense service.');
  }

  const submitted = expenses.filter((expense) => isSubmitted(expense.status));
  const pending = submitted.filter((expense) => isInFlight(expense.status));

  const month = submitted.reduce(
    (latest, expense) =>
      expense.expenseDate.slice(0, 7) > latest ? expense.expenseDate.slice(0, 7) : latest,
    '',
  );
  const inMonth = submitted.filter((expense) => expense.expenseDate.startsWith(month));

  const roll = (rows: Expense[]) => ({
    count: rows.length,
    total: rows.reduce((sum, expense) => sum + expense.amount, 0),
  });

  return {
    summary: {
      submitted: roll(submitted),
      pending: roll(pending),
      month: month === '' ? null : month,
      monthTotal: roll(inMonth),
    },
    unsettled: submitted
      .filter((expense) => expense.status !== 'Approved' && expense.status !== 'Rejected')
      .sort((a, b) => b.amount - a.amount),
  };
}

/** Reduced over the array — the only place that is still the right answer. */
export async function getExpenseTotals(employee: string): Promise<ExpenseTotals> {
  await delay(120);
  return deriveTotals(expenses.filter((expense) => expense.employee === employee));
}

/** No Orchestrator to ask, so the constant above is the policy. */
export async function getPolicyThreshold(): Promise<number> {
  await delay(80);
  return MOCK_POLICY_THRESHOLD;
}
