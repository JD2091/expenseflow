/* ============================================================================
 * ExpenseFlow — typed wrapper over the Entities service
 * ============================================================================
 *
 *   >>> EVERY LIST CALL RETURNS ONE PAGE. INCLUDING WITH NO OPTIONS. <<<
 *
 * Critical Rule 14. `NonPaginatedResponse` is a misleading name: it describes
 * the SHAPE of the response, not how many rows came back. With no options the
 * SDK sends no `pageSize` and the SERVER applies its own cap. There is no
 * "give me everything" call.
 *
 * So `result.items.length` after a single call is a bug, not a total. It is
 * also a bug that hides: it looks right at 12 seed rows and quietly truncates
 * at 144. Everything that needs all the rows goes through `queryAll`, and
 * everything that needs a COUNT goes through `getTotals`, which asks the
 * server to do the arithmetic.
 * ========================================================================== */

import {
  EntityAggregateFunction,
  LogicalOperator,
  QueryFilterOperator,
} from '@uipath/uipath-typescript/entities';
import type {
  EntityAggregate,
  EntityQueryFilter,
  EntityQueryFilterGroup,
  EntityQuerySortOption,
  EntityRecord,
} from '@uipath/uipath-typescript/entities';
import type { PaginatedResponse, PaginationCursor } from '@uipath/uipath-typescript/core';

import type {
  Expense,
  ExpenseFilters,
  ExpenseStatus,
  TotalsBucket,
} from '../../models/expense';
import { getClients } from './client';
import { IN_FLIGHT_STATUSES } from '../../models/status';
import { choiceMaps, loadChoiceMaps, toFilterValue, toName } from './choiceSets';
import { FIELD, UIPATH, assertConfigured } from './config';
import {
  equalsFilterGroup,
  toExpense,
  toFilterGroup,
  toInsertPayload,
  toUpdatePayload,
} from './mappers';
import type { ExpenseUpdate, ExpenseWrite } from './mappers';
import { choiceSetIdsFromSchema, loadSchema } from './schema';

/**
 * Fetch the entity schema and both choice sets, once, before anything reads a
 * record. Both caches dedupe concurrent callers, so this is safe to call from
 * the runtime gate and from a racing service call at the same time.
 */
export async function warmUp(): Promise<void> {
  assertConfigured();
  const loaded = await loadSchema();
  await loadChoiceMaps(choiceSetIdsFromSchema(loaded));
}

/* --- reading ------------------------------------------------------------- */

/**
 * The query shape this app uses — everything `EntityQueryRecordsOptions`
 * offers EXCEPT the pagination keys, which `queryAll` owns.
 *
 * Spelled out rather than derived, because `EntityQueryRecordsOptions` is a
 * three-way union (the SDK makes `cursor` and `jumpToPage` mutually exclusive
 * that way). Spreading a union-typed value produces a union of spreads, and
 * the SDK's conditional return type then collapses to `NonPaginatedResponse` —
 * i.e. `hasNextPage` disappears and the cursor loop silently becomes a
 * one-page fetch. Keeping our own flat type keeps the narrowing honest.
 */
export interface QueryAllOptions {
  filterGroup?: EntityQueryFilterGroup;
  selectedFields?: string[];
  sortOptions?: EntityQuerySortOption[];
  aggregates?: EntityAggregate[];
  groupBy?: string[];
}

/**
 * Cursor-loop `queryRecordsById` until the server stops offering a next page.
 *
 * The two-branch call is deliberate: `pageSize` and `cursor` have to appear as
 * literal keys for the SDK's conditional return type to narrow to
 * `PaginatedResponse`, which is what carries `hasNextPage` / `nextCursor`.
 */
export async function queryAll(options: QueryAllOptions = {}): Promise<EntityRecord[]> {
  const { entities } = getClients();
  const all: EntityRecord[] = [];
  let cursor: PaginationCursor | undefined;

  for (;;) {
    const page: PaginatedResponse<EntityRecord> =
      cursor === undefined
        ? await entities.queryRecordsById(UIPATH.entityId, {
            ...options,
            pageSize: UIPATH.fetchPageSize,
          })
        : await entities.queryRecordsById(UIPATH.entityId, {
            ...options,
            pageSize: UIPATH.fetchPageSize,
            cursor,
          });

    all.push(...page.items);

    if (!page.hasNextPage || page.nextCursor === undefined) break;
    cursor = page.nextCursor;
  }

  return all;
}

/**
 * Every expense, newest first, narrowed server-side.
 *
 * Both the filtering and the sorting happen in Data Fabric — pulling 144 rows
 * across the wire to `.filter()` them in the browser would defeat the point of
 * having an entity, and would break the moment the table outgrows one page.
 */
export async function listExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
  const filterGroup = toFilterGroup(filters);

  const records = await queryAll({
    ...(filterGroup === undefined ? {} : { filterGroup }),
    sortOptions: [{ fieldName: FIELD.expenseDate, isDescending: true }],
  });

  return records.map(toExpense);
}

/**
 * Count and sum per status, computed by the SERVER.
 *
 * Gotcha 9: counts and chart data must use `aggregates` + `groupBy`. The Day-1
 * dashboard reduced over a client-side array, which is correct only while
 * every row happens to fit in one page — i.e. right up until the demo tenant
 * has real data in it.
 *
 * The `groupBy` keys come back as choice `numberId` integers like every other
 * read path, so they are translated on the way out.
 */
export async function getTotals(
  employee?: string,
): Promise<Partial<Record<ExpenseStatus, TotalsBucket>>> {
  const filterGroup =
    employee === undefined ? undefined : equalsFilterGroup(FIELD.employee, employee);

  const rows = await queryAll({
    ...(filterGroup === undefined ? {} : { filterGroup }),
    selectedFields: [FIELD.status],
    groupBy: [FIELD.status],
    aggregates: [
      { function: EntityAggregateFunction.Count, field: FIELD.id, alias: 'count' },
      { function: EntityAggregateFunction.Sum, field: FIELD.amount, alias: 'total' },
    ],
  });

  const totals: Partial<Record<ExpenseStatus, TotalsBucket>> = {};
  const statuses = choiceMaps().status;

  for (const row of rows) {
    const status = toName(statuses, row[FIELD.status]) as ExpenseStatus;
    totals[status] = {
      count: readAggregate(row, 'count'),
      amount: readAggregate(row, 'total'),
    };
  }

  return totals;
}

/**
 * Read one aggregate off a grouped row, case-insensitively.
 *
 * The alias goes up as `count`; whether it comes back as `count`, `Count` or
 * `COUNT` is the server's business, and getting it wrong here would not throw
 * — it would put a confident ₹0 on the hero screen. So: match loosely, and say
 * so loudly in dev if the alias is not there at all.
 */
function readAggregate(row: EntityRecord, alias: string): number {
  const key = findAlias(row, alias);

  if (key === undefined) {
    if (import.meta.env?.DEV) {
      console.error(
        `[uipath] aggregate "${alias}" is missing from a grouped row. Keys: ${Object.keys(row).join(', ')}`,
      );
    }
    return 0;
  }

  const value = Number(row[key]);
  return Number.isFinite(value) ? value : 0;
}

/**
 * The key a grouped row actually used for `alias`, whatever case it chose.
 *
 * `alias: 'count'` comes back as `Count`; `'n'` comes back as `N`. Indexing by
 * the alias you SENT is a coin flip that resolves to `undefined`, and
 * `Number(undefined)` is `NaN` — which a guarded `?? 0` then turns into a
 * confident zero on the hero screen with no error anywhere (gotcha 26).
 */
function findAlias(row: EntityRecord, alias: string): string | undefined {
  return Object.keys(row).find((candidate) => candidate.toLowerCase() === alias.toLowerCase());
}

/**
 * The lowest unused code in the `EXP-1xxx` band.
 *
 * NOT `max + 1`. STATE.md §11: `EXP-1007` is deliberately absent from the seed
 * because it is the code the live Day-2 submission mints. A monotonic counter
 * would mint `EXP-1014` on the first rehearsal and `EXP-1015` on the second,
 * so the run-of-show and the screen would disagree on the second run-through.
 * "Lowest unused" yields `EXP-1007` again after every reset.
 */
export async function nextExpenseCode(): Promise<string> {
  const records = await queryAll({
    filterGroup: {
      logicalOperator: LogicalOperator.And,
      queryFilters: [
        { fieldName: FIELD.expenseCode, operator: QueryFilterOperator.StartsWith, value: 'EXP-1' },
      ],
    },
    selectedFields: [FIELD.expenseCode],
  });

  const taken = new Set<number>();
  for (const record of records) {
    const parsed = Number(String(record[FIELD.expenseCode] ?? '').replace('EXP-', ''));
    if (Number.isInteger(parsed)) taken.add(parsed);
  }

  for (let candidate = 1001; candidate <= 1999; candidate += 1) {
    if (!taken.has(candidate)) return `EXP-${candidate}`;
  }

  throw new Error('The EXP-1xxx code band is full. Reset the demo tenant.');
}

/* --- the Finance dashboard ------------------------------------------------ */

/**
 * A `filterGroup` matching several choice values at once.
 *
 * `In` takes a `valueList` of STRINGS, and every one of them has to be the
 * `numberId` (gotcha 1). An `Equals` with an untranslated value 400s on this
 * tenant with "not of decimal format" — but the other operators carry no such
 * guarantee, and a silently empty "needs attention" table looks exactly like a
 * quiet Tuesday.
 */
function statusInFilter(statuses: readonly ExpenseStatus[]): EntityQueryFilterGroup {
  return {
    logicalOperator: LogicalOperator.And,
    queryFilters: [statusFilter(QueryFilterOperator.In, statuses)],
  };
}

/** One `In` / `NotIn` filter over a set of statuses, translated to numberIds. */
function statusFilter(
  operator: QueryFilterOperator,
  statuses: readonly ExpenseStatus[],
): EntityQueryFilter {
  const map = choiceMaps().status;
  return {
    fieldName: FIELD.status,
    operator,
    valueList: statuses.map((status) => toFilterValue(map, status)),
  };
}

/** One row of arithmetic the server did. */
export interface AggregateRow {
  count: number;
  total: number;
}

/**
 * COUNT and SUM over a filtered slice, computed by Data Fabric.
 *
 * No `groupBy`. Verified against the live tenant: `aggregates` on its own
 * returns exactly one row. A `groupBy` here would send back one row per
 * distinct value and leave the folding to the browser for no reason.
 */
async function aggregate(filters: EntityQueryFilter[]): Promise<AggregateRow> {
  const rows = await queryAll({
    ...(filters.length === 0
      ? {}
      : { filterGroup: { logicalOperator: LogicalOperator.And, queryFilters: filters } }),
    aggregates: [
      { function: EntityAggregateFunction.Count, field: FIELD.id, alias: 'count' },
      { function: EntityAggregateFunction.Sum, field: FIELD.amount, alias: 'total' },
    ],
  });

  const row = rows[0];
  if (row === undefined) return { count: 0, total: 0 };
  return { count: readAggregate(row, 'count'), total: readAggregate(row, 'total') };
}

/** The three numbers across the top of Screen 5. */
export interface FinanceSummary {
  /** Every expense that left an employee's hands — Drafts excluded. */
  submitted: AggregateRow;
  /** Submitted and still waiting on a decision. */
  pending: AggregateRow;
  /** The most recent month present in the data, `YYYY-MM`, or `null`. */
  month: string | null;
  monthTotal: AggregateRow;
}

/**
 * The Finance KPIs — 142 / 18 / 8.4L — every one of them computed by the
 * SERVER.
 *
 *   >>> NOT `expenses.filter(...).reduce(...)`. <<<
 *
 * Gotcha 9, and the reason it is a rule rather than a preference: a client-side
 * reduce is correct only while every row is loaded, and every list call returns
 * ONE page. It looks perfect on twelve seed rows and is quietly wrong on a
 * hundred and forty-four — which is to say, it looks perfect right up until the
 * demo tenant has real data in it.
 *
 * "This month" is the newest month PRESENT rather than the calendar month, so
 * the tile reads 8.4L on a fixed seed and still moves the moment somebody
 * submits today. `MAX(ExpenseDate)` gets that from the server too — verified
 * live, a MAX on a DATE column comes back as `2026-08-22` with no rows fetched.
 */
export async function getFinanceSummary(): Promise<FinanceSummary> {
  const notDraft = statusFilter(QueryFilterOperator.NotIn, ['Draft']);

  // One round trip for the newest date, so the month filter below is built from
  // an answer rather than from a guess about what "this month" means.
  const [latestRow] = await queryAll({
    filterGroup: { logicalOperator: LogicalOperator.And, queryFilters: [notDraft] },
    aggregates: [
      { function: EntityAggregateFunction.Max, field: FIELD.expenseDate, alias: 'latest' },
    ],
  });

  const latestKey = latestRow === undefined ? undefined : findAlias(latestRow, 'latest');
  const latest =
    latestRow === undefined || latestKey === undefined ? '' : String(latestRow[latestKey] ?? '');
  const month = latest.length >= 7 ? latest.slice(0, 7) : null;

  const [submitted, pending, monthTotal] = await Promise.all([
    aggregate([notDraft]),
    aggregate([statusFilter(QueryFilterOperator.In, IN_FLIGHT_STATUSES)]),
    month === null
      ? Promise.resolve({ count: 0, total: 0 })
      : aggregate([
          notDraft,
          // Inclusive string bounds. ISO dates compare correctly as text, and
          // `-31` is a safe upper bound for every month: no date string in a
          // 30-day month can exceed it.
          {
            fieldName: FIELD.expenseDate,
            operator: QueryFilterOperator.GreaterThanOrEqual,
            value: `${month}-01`,
          },
          {
            fieldName: FIELD.expenseDate,
            operator: QueryFilterOperator.LessThanOrEqual,
            value: `${month}-31`,
          },
        ]),
  ]);

  return { submitted, pending, month, monthTotal };
}

/**
 * Statuses that can still put an expense in front of Finance.
 *
 * `Submitted` is in the list for one reason: a submitted expense with no
 * receipt is the third row of the wireframe. Most `Submitted` rows are moving
 * along fine and are dropped by `attentionFor` in the page — see the note there
 * about why that last step cannot happen server-side.
 */
const UNSETTLED_STATUSES: readonly ExpenseStatus[] = [
  'Submitted',
  'PolicyReview',
  'PendingApproval',
  'Reworked',
];

/**
 * The "needs attention" candidates, narrowed BY THE SERVER.
 *
 *   >>> AND THE ONE STEP THAT CANNOT BE. <<<
 *
 * The `Status In (...)` filter does the work: on the seeded tenant it turns 146
 * rows into 19. What it cannot do is find the rows with no receipt, because
 * Data Fabric has no `IsNull` operator (gotcha 6) and — verified live on this
 * tenant, 2026-08-22 — a NULL column matches NOTHING, not even the operators
 * you would expect to catch it:
 *
 *     ReceiptPath =  ''            ->   0 rows
 *     ReceiptPath != ''            -> 142 rows   (the NULLs are excluded)
 *     ReceiptPath contains .       -> 142 rows
 *     ReceiptPath not contains .   ->   0 rows
 *
 * There is no filter that selects them. So the receipt check happens in the
 * page, over a bounded set the server already narrowed — never over the whole
 * table. That distinction is the point: "filter client-side" is a last resort
 * applied to the one predicate the platform cannot express, not a licence to
 * fetch everything and sort it out in the browser.
 */
export async function listUnsettled(): Promise<Expense[]> {
  const records = await queryAll({
    filterGroup: statusInFilter(UNSETTLED_STATUSES),
    sortOptions: [{ fieldName: FIELD.amount, isDescending: true }],
  });

  return records.map(toExpense);
}

/* --- writing ------------------------------------------------------------- */

/**
 * Insert ONE record.
 *
 * `insertRecordById` (singular) fires Data Fabric trigger events; the batch
 * variant `insertRecordsById` does not. The workshop's whole premise is that
 * the platform reacts to what the app writes, so the singular call is the
 * correct one even for a single row.
 */
export async function insertExpense(write: ExpenseWrite): Promise<Expense> {
  const { entities } = getClients();
  const record = await entities.insertRecordById(UIPATH.entityId, toInsertPayload(write));
  return toExpense(record);
}

/**
 * Update ONE record. Also the trigger-firing variant, for the same reason.
 *
 *   >>> `updateRecordById`, SINGULAR. <<<
 *
 * The bulk variant does not fire Data Fabric triggers, and "the platform
 * reacts to what the app writes" is the sentence this whole day is built
 * around. A batch of one is still a batch.
 *
 * The patch is typed (`ExpenseUpdate`), not a loose bag of field names: it
 * goes through `toUpdatePayload`, so `Status` is translated to its choice
 * `numberId` on the way and the field names are the schema's, verbatim.
 */
export async function updateExpense(recordId: string, update: ExpenseUpdate): Promise<Expense> {
  const { entities } = getClients();
  const record = await entities.updateRecordById(
    UIPATH.entityId,
    recordId,
    toUpdatePayload(update),
  );
  return toExpense(record);
}
