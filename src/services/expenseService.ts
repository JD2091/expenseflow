/* ============================================================================
 * ExpenseFlow — expense service
 * ============================================================================
 *
 *   >>> THIS IS THE DAY 2 DIFF. THE WHOLE DAY 2 DIFF. <<<
 *
 * Day 1:  useExpenses -> expenseService -> an in-memory array
 * Day 2:  useExpenses -> expenseService -> services/uipath/* -> UiPath SDK
 *
 * `listExpenses(filters?)` and `createExpense(input)` have exactly the
 * signatures they had at `day1-final`. Only the bodies changed. Every screen,
 * every component and the hook's list/create path are untouched — which is the
 * entire argument for having built a service layer on Day 1.
 *
 * The payoff is small and enormous: refresh the browser, and the data is
 * still there.
 *
 * ---------------------------------------------------------------------------
 * WHERE TO LOOK WHEN THIS BREAKS
 *
 *   choice values read back as integers ......... services/uipath/choiceSets.ts
 *   list calls return one page .................. services/uipath/entityClient.ts
 *   unknown keys are dropped silently ........... services/uipath/schema.ts
 *   the SDK is not signed in yet ................ services/uipath/runtime.tsx
 *   the tenant is unreachable ................... append ?mock=1 to the URL
 *   the receipt did not appear in the bucket .... services/uipath/receipts.ts
 *   the threshold is not what Orchestrator says . services/uipath/policy.ts
 * ========================================================================== */

import type {
  Expense,
  ExpenseFilters,
  ExpenseTotals,
  NewExpenseInput,
} from '../models/expense';
import { rollUpStatusTotals } from '../lib/totals';
import { formatCurrency } from '../lib/format';
import { CURRENT_USER } from '../lib/constants';
import * as mock from './expenseService.mock';
import { USE_MOCK } from './expenseService.mock';
import type { ExpenseStatus } from '../models/expense';
import * as entityClient from './uipath/entityClient';
import type { FinanceSummary } from './uipath/entityClient';
import { getReceiptReadUri, uploadReceipt } from './uipath/receipts';
import { completeApprovalTask, createApprovalTask } from './uipath/approvals';
import type { ApprovalAction } from './uipath/approvals';
import {
  getPolicyThreshold as readPolicyAssetCached,
  readPolicyThresholdNow,
} from './uipath/policy';
import { rethrowFriendly, withRetry } from './uipath/errors';
import { CURRENT_MANAGER } from '../lib/constants';
import { failIfDemoFailureArmed } from './demoFailure';

/**
 * Every expense, newest first, optionally narrowed.
 *
 * The filtering and the sort are done by Data Fabric, not by the browser:
 * `queryRecordsById` takes a `filterGroup` and `sortOptions`, and
 * `entityClient.queryAll` cursor-loops until the server runs out of pages.
 * A single call would return ONE page however many rows match — the failure
 * that looks like working code right up until the data grows.
 */
export async function listExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
  if (USE_MOCK) return mock.listExpenses(filters);

  try {
    // A READ is safe to repeat, so a throttle or a transient 500 costs a
    // second rather than an error message. See `withRetry` for why the WRITES
    // below deliberately do not get the same treatment.
    return await withRetry(() => entityClient.listExpenses(filters));
  } catch (cause) {
    rethrowFriendly(cause, 'load your expenses');
  }
}

/**
 * Create an expense and put it straight into the pipeline.
 *
 * Four UiPath calls, in this order and for these reasons:
 *
 *   1. read the policy — an Orchestrator Asset, not a constant, and read LIVE
 *                        on every submit rather than from the page's cache.
 *                        Change `ExpenseFlow_PolicyThreshold` in Orchestrator
 *                        and the very next submit routes differently — no
 *                        reload, no rebuild, no redeploy. See policy.ts for
 *                        why this is a live read and not a cached one;
 *   2. mint the code   — the lowest unused code in the `EXP-1xxx` band, so a
 *                        reset tenant mints `EXP-1007` every single time and
 *                        the run-of-show and the screen never disagree;
 *   3. upload the file — BEFORE the insert. A row pointing at a receipt that
 *                        failed to upload is worse than no row: it looks
 *                        complete and is not;
 *   4. insert the row  — `insertRecordById`, singular. It fires Data Fabric
 *                        trigger events; the batch variant does not, and this
 *                        whole workshop is about the platform reacting to what
 *                        the app writes.
 *
 * Day 1 always landed on `Submitted`. Day 2 branches on the policy, so a small
 * expense is `Approved` on the spot and a large one waits for a manager. The
 * Action Center task that manager acts on is T07 — this decides the status and
 * writes the note, nothing more.
 */
export async function createExpense(input: NewExpenseInput): Promise<Expense> {
  // The rehearsed failure, if it is armed. BEFORE the mock branch as well as
  // before the first UiPath call: `?mock=1` is the fallback the whole session
  // runs on when the tenant is unreachable, and the error-handling segment has
  // to work there too. Nothing is written on either path, so "nothing was
  // saved" is literally true and the demo is repeatable.
  failIfDemoFailureArmed('submit');

  if (USE_MOCK) return mock.createExpense(input);

  try {
    // LIVE read, not the cached one the form hint uses. A stale hint is
    // cosmetic; a stale decision is written to the record for good.
    const threshold = await readPolicyThresholdNow();
    const decision = applyPolicy(input.amount, threshold);
    const expenseCode = await entityClient.nextExpenseCode();

    const receiptPath =
      input.receiptFile === undefined || input.receiptFile === null
        ? null
        : await uploadReceipt(expenseCode, input.receiptFile);

    const created = await entityClient.insertExpense({
      expenseCode,
      employee: CURRENT_USER,
      description: input.description,
      category: input.category,
      amount: input.amount,
      expenseDate: input.expenseDate,
      status: decision.status,
      policyNote: decision.policyNote,
      receiptPath,
      submittedAt: new Date().toISOString(),
    });

    if (decision.status !== 'PendingApproval') return created;

    // Above the threshold: a manager has to see this, so it becomes a real
    // Action Center task and the record learns the task's id.
    return await raiseForApproval(created, threshold);
  } catch (cause) {
    rethrowFriendly(cause, 'save the expense');
  }
}

/**
 * Turn a freshly-inserted over-threshold expense into a real approval task.
 *
 * Two calls, in this order:
 *
 *   1. `Tasks.create` — the manager's inbox item, carrying enough of the
 *      expense that the decision can be made from Action Center alone;
 *   2. `updateRecordById` — write `ApprovalTaskId` back onto the record.
 *
 * Step 2 is not bookkeeping. It is the only link from a row to its task: with
 * no `ApprovalTaskId`, Approve and Reject have nothing to complete and the
 * screen would be updating a status while the task sat open forever.
 *
 * If step 1 fails the expense still exists, `PendingApproval`, with no task —
 * which is recoverable and visible. If step 2 fails we log the id loudly,
 * because a task with no record pointing at it is the one state a human has to
 * clean up by hand.
 */
async function raiseForApproval(created: Expense, threshold: number): Promise<Expense> {
  const taskId = await createApprovalTask({
    expenseCode: created.expenseCode,
    employee: created.employee,
    description: created.description,
    category: created.category,
    amount: created.amount,
    expenseDate: created.expenseDate,
    receiptPath: created.receiptPath ?? null,
    threshold,
  });

  try {
    return await entityClient.updateExpense(created.id, { approvalTaskId: taskId });
  } catch (cause) {
    console.error(
      `[expenseflow] ${created.expenseCode} has Action Center task ${taskId}, but writing ` +
        'ApprovalTaskId back to the record failed. Approve/Reject cannot find the task until ' +
        'that field is set by hand.',
      cause,
    );
    throw cause;
  }
}

/** Approve, reject, or send back — the three things a manager can do. */
export interface ExpenseDecision {
  action: ApprovalAction;
  comments: string;
  /** Whose name is stamped on the record. */
  decidedBy?: string;
}

const DECIDED_STATUS: Record<ApprovalAction, ExpenseStatus> = {
  Approve: 'Approved',
  Reject: 'Rejected',
  Rework: 'Reworked',
};

/**
 * Record a manager's decision on one expense.
 *
 *   >>> ACTION CENTER FIRST. DATA FABRIC SECOND. ALWAYS. <<<
 *
 * If the task completion fails, the record is untouched and the UI can say
 * "nothing happened" and mean it. Do it the other way round and a failure
 * leaves a record that says Approved next to a task still sitting in the
 * manager's inbox — two systems disagreeing, with nothing on either screen to
 * say so. That is the worst thing to demonstrate on a stage, and the worst
 * thing to ship.
 *
 * An expense with no `ApprovalTaskId` is decided in Data Fabric alone. That is
 * the seeded rows' situation (they predate the app) and it is stated plainly
 * rather than papered over — see `usedActionCenter` on the result.
 */
export async function decideExpense(
  expense: Expense,
  decision: ExpenseDecision,
): Promise<Expense> {
  failIfDemoFailureArmed('decide');

  if (USE_MOCK) return mock.decideExpense(expense, decision);

  const comments = decision.comments.trim();

  if (expense.approvalTaskId !== undefined) {
    await completeApprovalTask(expense.approvalTaskId, decision.action, comments);
  }

  try {
    return await entityClient.updateExpense(expense.id, {
      status: DECIDED_STATUS[decision.action],
      decidedAt: new Date().toISOString(),
      decidedBy: decision.decidedBy ?? CURRENT_MANAGER,
      ...(comments === '' ? {} : { comments }),
    });
  } catch (cause) {
    rethrowFriendly(cause, 'save the decision to the expense record');
  }
}

export interface PolicyDecision {
  status: ExpenseStatus;
  policyNote: string;
}

/**
 * The whole business rule, in five lines, with the number supplied from
 * outside.
 *
 * The note is built from the threshold that was actually read, so flipping the
 * Asset to 5,000 makes the app say "Above ₹5,000 policy threshold" without
 * anybody editing a string.
 */
export function applyPolicy(amount: number, threshold: number): PolicyDecision {
  if (amount > threshold) {
    return {
      status: 'PendingApproval',
      policyNote: `Above ${formatCurrency(threshold)} policy threshold`,
    };
  }
  return {
    status: 'Approved',
    policyNote: 'Auto-approved under policy threshold',
  };
}

/**
 * The three dashboard numbers, for one employee, computed by the SERVER.
 *
 * Day 1 reduced over the loaded array. That is only correct while every row
 * fits in one page, so on Day 2 it is a `COUNT`/`SUM` with a `groupBy` on
 * Status — Data Fabric does the arithmetic and sends back seven small rows
 * instead of every expense in the company.
 *
 * This is the third export on a file whose Day-1 comment said "resist adding a
 * third export". It is added deliberately: a total that cannot be computed
 * from one page is not a UI concern, and pretending otherwise is exactly the
 * bug Critical Rule 14 exists to prevent.
 */
export async function getExpenseTotals(employee: string): Promise<ExpenseTotals> {
  if (USE_MOCK) return mock.getExpenseTotals(employee);

  try {
    return rollUpStatusTotals(await withRetry(() => entityClient.getTotals(employee)));
  } catch (cause) {
    rethrowFriendly(cause, 'add up your expenses');
  }
}

/* --- the Finance operations view (Screen 5) -------------------------------- */

/** Everything Screen 5 draws, in one object. */
export interface FinanceSnapshot {
  /** The three KPI tiles. Every number computed server-side. */
  summary: FinanceSummary;
  /**
   * Every expense that has not settled — the pool the "needs attention" table
   * is drawn from. Already narrowed by a server-side `filterGroup`; the page
   * applies the one predicate Data Fabric cannot express (a NULL receipt).
   */
  unsettled: Expense[];
}

/**
 * The Finance dashboard, in two round trips.
 *
 *   >>> THE SCREEN THAT MAKES THE ARGUMENT. <<<
 *
 * "Coded Apps aren't only forms that start automations — they can be the
 * operational interface around automation." That sentence is only earned if the
 * screen behaves like an operations tool rather than a demo: the counts are
 * over EVERY row in the company, not the page that happened to load, and the
 * table pages rather than dumping.
 *
 * So the tiles come from `aggregates` (COUNT / SUM / MAX, computed by Data
 * Fabric) and the table comes from a filtered query that returns nineteen rows
 * out of a hundred and forty-six. Neither one fetches the table to count it.
 */
export async function getFinanceSnapshot(): Promise<FinanceSnapshot> {
  if (USE_MOCK) return mock.getFinanceSnapshot();

  try {
    const [summary, unsettled] = await Promise.all([
      withRetry(() => entityClient.getFinanceSummary()),
      withRetry(() => entityClient.listUnsettled()),
    ]);
    return { summary, unsettled };
  } catch (cause) {
    rethrowFriendly(cause, 'load the Finance dashboard');
  }
}

/**
 * A short-lived, directly-openable URL for a stored receipt.
 *
 * Minted on demand rather than kept on the record: `Buckets.getReadUri` returns
 * a pre-signed URI that EXPIRES, so one fetched when the page rendered would
 * work in testing and 403 on stage. `ReceiptLink` calls this on click.
 *
 * In mock mode there is no bucket, so there is nothing to open — and saying so
 * is better than handing back a URL that 404s.
 */
export async function getReceiptUrl(receiptPath: string): Promise<string> {
  if (USE_MOCK) {
    throw new Error(
      'Receipts are not stored in mock mode (?mock=1) — there is no storage bucket to read from.',
    );
  }

  return getReceiptReadUri(receiptPath);
}

/**
 * The auto-approval ceiling, in rupees, from the Orchestrator Asset
 * `ExpenseFlow_PolicyThreshold`.
 *
 *   "We are not hardcoding ₹25,000 into our application.
 *    The business policy lives in UiPath."
 *
 * That claim is checkable rather than rhetorical: grepping `src/` for the
 * threshold literal finds nothing outside `expenseService.mock.ts`, where
 * there is no Orchestrator to ask.
 *
 * This is the CACHED read, for display only — a form hint and a detail-page
 * label, both of which render often. `createExpense` deliberately does not use
 * it; it reads the Asset live, because a decision is permanent and a label is
 * not.
 */
export async function getPolicyThreshold(): Promise<number> {
  if (USE_MOCK) return mock.getPolicyThreshold();
  return readPolicyAssetCached();
}
