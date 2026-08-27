/* ============================================================================
 * ExpenseFlow — EntityRecord <-> Expense
 * ----------------------------------------------------------------------------
 * The ONLY place choice translation happens, in all three directions. If a
 * `toNumberId` or a `toName` call appears anywhere else in the app, this
 * module has a hole in it.
 *
 * It is also the only place that writes Data Fabric field names. They are
 * PascalCase, verbatim, from `config.ts` — never string literals at a call
 * site, because a typo is silently dropped rather than rejected
 * (STATE.md §7 gotcha 3).
 * ========================================================================== */

import { LogicalOperator, QueryFilterOperator } from '@uipath/uipath-typescript/entities';
import type {
  EntityQueryFilter,
  EntityQueryFilterGroup,
  EntityRecord,
} from '@uipath/uipath-typescript/entities';

import { EXPENSE_CATEGORIES, EXPENSE_STATUSES } from '../../models/expense';
import type {
  Expense,
  ExpenseCategory,
  ExpenseFilters,
  ExpenseStatus,
} from '../../models/expense';
import { choiceMaps, toFilterValue, toName, toNumberId } from './choiceSets';
import { FIELD } from './config';
import { assertWritableKeys } from './schema';

/* --- reading ------------------------------------------------------------- */

function asString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

function asOptionalString(value: unknown): string | undefined {
  const text = asString(value).trim();
  return text === '' ? undefined : text;
}

function asNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  const parsed = Number(asString(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * A DF `DATE` reads back as `2026-08-14` on some paths and as a full ISO
 * timestamp on others. The whole app compares dates as plain `YYYY-MM-DD`
 * strings — no `Date` parsing, so no timezone surprises — so normalise once,
 * here.
 */
function asDate(value: unknown): string {
  return asString(value).slice(0, 10);
}

function asTimestamp(value: unknown): string | undefined {
  return asOptionalString(value);
}

/** The bucket stores `receipts/EXP-1007-bill.pdf`; the UI shows `bill.pdf`. */
export function receiptFileName(path: string): string {
  const tail = path.split('/').pop() ?? path;
  // Uploaded receipts are prefixed with the expense code to keep the bucket
  // browsable; strip it back off so the chip reads like the user's own file.
  return tail.replace(/^EXP-\d+-/, '');
}

function asCategory(value: unknown): ExpenseCategory {
  const name = toName(choiceMaps().category, value);
  return EXPENSE_CATEGORIES.includes(name as ExpenseCategory) ? (name as ExpenseCategory) : 'Other';
}

function asStatus(value: unknown): ExpenseStatus {
  const name = toName(choiceMaps().status, value);
  return EXPENSE_STATUSES.includes(name as ExpenseStatus) ? (name as ExpenseStatus) : 'Draft';
}

/**
 * One Data Fabric row -> one `Expense`.
 *
 * Every choice field goes through `toName`. `record.Status` is the integer
 * `4`, and every comparison in the app is against `'Approved'`.
 */
export function toExpense(record: EntityRecord): Expense {
  const receiptPath = asOptionalString(record[FIELD.receiptPath]);

  return {
    id: asString(record[FIELD.id]),
    expenseCode: asString(record[FIELD.expenseCode]),
    employee: asString(record[FIELD.employee]),
    description: asString(record[FIELD.description]),
    category: asCategory(record[FIELD.category]),
    amount: asNumber(record[FIELD.amount]),
    expenseDate: asDate(record[FIELD.expenseDate]),
    status: asStatus(record[FIELD.status]),
    receiptName: receiptPath === undefined ? null : receiptFileName(receiptPath),
    receiptPath,
    policyNote: asOptionalString(record[FIELD.policyNote]),
    submittedAt: asTimestamp(record[FIELD.submittedAt]),
    decidedAt: asTimestamp(record[FIELD.decidedAt]),
    decidedBy: asOptionalString(record[FIELD.decidedBy]),
    comments: asOptionalString(record[FIELD.comments]),
    approvalTaskId: asOptionalString(record[FIELD.approvalTaskId]),
  };
}

/* --- writing ------------------------------------------------------------- */

/** Everything the app ever writes to a new row. */
export interface ExpenseWrite {
  expenseCode: string;
  employee: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  /** `YYYY-MM-DD`. */
  expenseDate: string;
  status: ExpenseStatus;
  /** Full bucket path, or `null` when no receipt was attached. */
  receiptPath: string | null;
  policyNote?: string;
  /** ISO timestamp. A CUSTOM field — never `CreateTime` (gotcha 2). */
  submittedAt: string;
}

/**
 * `ExpenseWrite` -> the record Data Fabric expects.
 *
 * Choice fields become integers. Empty optionals are OMITTED rather than sent
 * as `null`, and the finished payload is checked against the live schema
 * before it leaves — the only defence against a silently dropped key.
 */
export function toInsertPayload(write: ExpenseWrite): Record<string, unknown> {
  const maps = choiceMaps();

  const payload: Record<string, unknown> = {
    [FIELD.expenseCode]: write.expenseCode,
    [FIELD.employee]: write.employee,
    [FIELD.description]: write.description,
    [FIELD.category]: toNumberId(maps.category, write.category),
    [FIELD.amount]: write.amount,
    [FIELD.expenseDate]: write.expenseDate,
    [FIELD.status]: toNumberId(maps.status, write.status),
    [FIELD.submittedAt]: write.submittedAt,
  };

  if (write.receiptPath !== null) payload[FIELD.receiptPath] = write.receiptPath;
  if (write.policyNote !== undefined) payload[FIELD.policyNote] = write.policyNote;

  assertWritableKeys(payload, 'Insert into ExpenseFlow_Expense');
  return payload;
}

/**
 * Everything the app ever changes on an EXISTING row.
 *
 * Deliberately not `Partial<ExpenseWrite>`: an update must never be able to
 * rewrite `ExpenseCode`, `Employee` or `Amount`, and a type that says so is
 * worth more than a comment that asks nicely. Every key here is written by the
 * approval flow.
 */
export interface ExpenseUpdate {
  status?: ExpenseStatus;
  /** The Action Center task id, as text — Data Fabric stores it as STRING. */
  approvalTaskId?: string;
  /** ISO timestamp. */
  decidedAt?: string;
  decidedBy?: string;
  comments?: string;
  policyNote?: string;
}

/**
 * `ExpenseUpdate` -> the patch Data Fabric expects.
 *
 * The `Status` translation is the reason this exists. `updateRecordById` is
 * happy to be handed `{ Status: 'Approved' }` and Data Fabric will reject it
 * with a message about decimal format (gotcha 27) — or, on another operator,
 * accept it and do nothing. Choice fields are integers on the way in as well
 * as on the way out, and that translation belongs here with the other two
 * directions, not at a call site.
 */
export function toUpdatePayload(update: ExpenseUpdate): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (update.status !== undefined) {
    payload[FIELD.status] = toNumberId(choiceMaps().status, update.status);
  }
  if (update.approvalTaskId !== undefined) payload[FIELD.approvalTaskId] = update.approvalTaskId;
  if (update.decidedAt !== undefined) payload[FIELD.decidedAt] = update.decidedAt;
  if (update.decidedBy !== undefined) payload[FIELD.decidedBy] = update.decidedBy;
  if (update.comments !== undefined) payload[FIELD.comments] = update.comments;
  if (update.policyNote !== undefined) payload[FIELD.policyNote] = update.policyNote;

  if (Object.keys(payload).length === 0) {
    throw new Error('An expense update with no fields would be a silent no-op.');
  }

  assertWritableKeys(payload, 'Update ExpenseFlow_Expense');
  return payload;
}

/* --- filtering ----------------------------------------------------------- */

/**
 * `ExpenseFilters` -> a server-side `filterGroup`.
 *
 * The choice filters are the trap: a filter value must be the `numberId` AS A
 * STRING. `value: 'Approved'` is not an error — it quietly matches nothing,
 * which reads like a broken filter rather than an untranslated one.
 *
 * Returns `undefined` when nothing is filtered, so the caller can omit the key
 * entirely instead of sending an empty group.
 */
export function toFilterGroup(filters?: ExpenseFilters): EntityQueryFilterGroup | undefined {
  if (filters === undefined) return undefined;

  const maps = choiceMaps();
  const queryFilters: EntityQueryFilter[] = [];

  if (filters.status !== undefined) {
    queryFilters.push({
      fieldName: FIELD.status,
      operator: QueryFilterOperator.Equals,
      value: toFilterValue(maps.status, filters.status),
    });
  }

  if (filters.category !== undefined) {
    queryFilters.push({
      fieldName: FIELD.category,
      operator: QueryFilterOperator.Equals,
      value: toFilterValue(maps.category, filters.category),
    });
  }

  if (filters.dateFrom !== undefined && filters.dateFrom !== '') {
    queryFilters.push({
      fieldName: FIELD.expenseDate,
      operator: QueryFilterOperator.GreaterThanOrEqual,
      value: filters.dateFrom,
    });
  }

  if (filters.dateTo !== undefined && filters.dateTo !== '') {
    queryFilters.push({
      fieldName: FIELD.expenseDate,
      operator: QueryFilterOperator.LessThanOrEqual,
      value: filters.dateTo,
    });
  }

  if (queryFilters.length === 0) return undefined;
  return { logicalOperator: LogicalOperator.And, queryFilters };
}

/** A one-field equality group — used to scope the dashboard to one employee. */
export function equalsFilterGroup(fieldName: string, value: string): EntityQueryFilterGroup {
  return {
    logicalOperator: LogicalOperator.And,
    queryFilters: [{ fieldName, operator: QueryFilterOperator.Equals, value }],
  };
}
