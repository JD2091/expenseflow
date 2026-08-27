/* ============================================================================
 * ExpenseFlow — the Expense domain model
 * ----------------------------------------------------------------------------
 * Day 1 is backed by mock data, but these names are NOT Day-1 names: every
 * field mirrors a column on the Day-2 Data Fabric entity `ExpenseFlow_Expense`
 * (STATE.md §6), so the Day-2 mapper is a rename of casing and nothing more.
 *
 *   Day 1                Day 2 (Data Fabric)
 *   expenseCode    ->    ExpenseCode      (human id — NOT the DF `Id`)
 *   employee       ->    Employee
 *   description    ->    Description
 *   category       ->    Category         (ChoiceSetSingle)
 *   amount         ->    Amount
 *   expenseDate    ->    ExpenseDate
 *   status         ->    Status           (ChoiceSetSingle)
 *   receiptName    ->    ReceiptPath      (Storage Bucket path; see receiptPath)
 *   policyNote     ->    PolicyNote
 *   submittedAt    ->    SubmittedAt      (custom — never `CreateTime`)
 *   decidedAt      ->    DecidedAt
 *   decidedBy      ->    DecidedBy
 *   comments       ->    Comments
 * ========================================================================== */

/**
 * The FULL Day-2 status union, declared on Day 1 on purpose.
 *
 * Day 1 only ever produces `Draft` / `Submitted` / `Approved` / `Rejected`, but
 * `PolicyReview`, `PendingApproval` and `Reworked` arrive the moment Day 2
 * wires up the policy check and the Action Center task. Adding union members
 * mid-demo is a breaking type change; declaring them now costs nothing and
 * makes Day 2 a change to *behaviour*, not to *types*.
 */
export type ExpenseStatus =
  | 'Draft'
  | 'Submitted'
  | 'PolicyReview'
  | 'PendingApproval'
  | 'Approved'
  | 'Rejected'
  | 'Reworked';

export type ExpenseCategory = 'Travel' | 'Meals' | 'Accommodation' | 'Office' | 'Other';

export interface Expense {
  /** Local row identity. Day 2: the Data Fabric `Id` (a GUID). */
  id: string;
  /** The human-readable code shown in the UI, e.g. `EXP-1007`. */
  expenseCode: string;
  employee: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  /** ISO date, `YYYY-MM-DD`. Never a `Date` — dates cross a wire as strings. */
  expenseDate: string;
  status: ExpenseStatus;
  /** `null` means no receipt was attached — the Finance screen keys off this. */
  receiptName: string | null;
  /**
   * Day 2: the full Storage Bucket path the receipt was uploaded to, e.g.
   * `receipts/EXP-1007-bill.pdf`. `receiptName` stays the short, human form
   * shown in the UI; this is what `Buckets.getReadUri` needs. Undefined on
   * Day-1 mock rows and on rows with no receipt.
   */
  receiptPath?: string;
  policyNote?: string;
  /** ISO timestamps. Day 2: `SubmittedAt` / `DecidedAt` on the DF record. */
  submittedAt?: string;
  decidedAt?: string;
  decidedBy?: string;
  comments?: string;
  /** Day 2: the Action Center task id, set by T07 when approval is required. */
  approvalTaskId?: string;
}

/** Everything the New Expense form collects. The service supplies the rest. */
export interface NewExpenseInput {
  description: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  receiptName: string | null;
  /**
   * Day 2: the actual bytes.
   *
   * Day 1 captured `receiptName` and dropped the `File` on the floor, because
   * there was nowhere to put it. Day 2 has a Storage Bucket, so the file
   * travels with the input and `expenseService` uploads it before inserting
   * the record. Optional so the mock service and any caller that only has a
   * filename still type-check.
   */
  receiptFile?: File | null;
}

/**
 * Day 1 applies these client-side in `useExpenses`. Day 2 pushes the same shape
 * into a Data Fabric query — which is why it is a type, not four loose props.
 */
export interface ExpenseFilters {
  status?: ExpenseStatus;
  category?: ExpenseCategory;
  /** Inclusive ISO date bounds, `YYYY-MM-DD`. */
  dateFrom?: string;
  dateTo?: string;
}

/**
 * One dashboard stat card's worth of money.
 *
 * Lives in the model rather than in `useExpenses` because on Day 2 the numbers
 * are computed by Data Fabric, not by the hook — the service layer has to be
 * able to name the shape it returns without importing from `hooks/`.
 */
export interface TotalsBucket {
  amount: number;
  count: number;
}

/** The three numbers on Screen 1. */
export interface ExpenseTotals {
  /** Everything the employee has actually submitted — drafts excluded. */
  submitted: TotalsBucket;
  /** Decided, positive. */
  approved: TotalsBucket;
  /** Submitted and still waiting on a decision. */
  pending: TotalsBucket;
}

export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  'Travel',
  'Meals',
  'Accommodation',
  'Office',
  'Other',
];

export const EXPENSE_STATUSES: readonly ExpenseStatus[] = [
  'Draft',
  'Submitted',
  'PolicyReview',
  'PendingApproval',
  'Approved',
  'Rejected',
  'Reworked',
];
