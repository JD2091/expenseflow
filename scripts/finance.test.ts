/* ============================================================================
 * getFinanceSummary — the numbers on the hero screen
 * ============================================================================
 *
 * Two failures are being pinned here, and both of them are silent. Neither
 * throws, neither logs, and both put a confident, wrong number in 48-point type
 * in front of an audience.
 *
 *   1. AN UNTRANSLATED CHOICE FILTER. `valueList: ['Draft']` instead of
 *      `['0']`. On this tenant an `Equals` with an untranslated value 400s —
 *      but `In` and `NotIn` carry no such promise, and the failure mode is a
 *      count that is merely wrong.
 *
 *   2. AN ALIAS READ BACK IN THE WRONG CASE. We send `alias: 'count'`; the
 *      server answers with `Count`. `row.count` is `undefined`,
 *      `Number(undefined)` is `NaN`, and a well-meaning `?? 0` turns that into
 *      a tile reading 0 with nothing anywhere to say so (STATE.md §7 gotcha 26).
 *
 * The stub answers in the SERVER's casing on purpose. A stub that echoes the
 * alias you sent would make this test pass against code that is broken in
 * production, which is worse than having no test.
 *
 *     npm test -w apps/expenseflow
 * ========================================================================== */

import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, test } from 'node:test';

Object.defineProperty(globalThis, 'window', {
  value: { location: { search: '' } },
  configurable: true,
  writable: true,
});

const { registerClients } = await import('../src/services/uipath/client');
type UiPathClients = import('../src/services/uipath/client').UiPathClients;
const { resetSchema } = await import('../src/services/uipath/schema');
const { resetChoiceMaps } = await import('../src/services/uipath/choiceSets');
const { getFinanceSummary, listUnsettled, warmUp } = await import(
  '../src/services/uipath/entityClient'
);

/** Every query the code sent, so the filters can be inspected. */
let queries: Record<string, unknown>[] = [];

const STATUS_VALUES = [
  'Draft',
  'Submitted',
  'PolicyReview',
  'PendingApproval',
  'Approved',
  'Rejected',
  'Reworked',
].map((name, numberId) => ({ name, numberId }));

const CATEGORY_VALUES = ['Travel', 'Meals', 'Accommodation', 'Office', 'Other'].map(
  (name, numberId) => ({ name, numberId }),
);

function fieldNames(): { name: string; fieldDisplayType: string; choiceSetId?: string }[] {
  return [
    { name: 'Id', fieldDisplayType: 'Number' },
    { name: 'ExpenseCode', fieldDisplayType: 'Text' },
    { name: 'Employee', fieldDisplayType: 'Text' },
    { name: 'Description', fieldDisplayType: 'Text' },
    { name: 'Category', fieldDisplayType: 'ChoiceSetSingle', choiceSetId: 'cat' },
    { name: 'Amount', fieldDisplayType: 'Decimal' },
    { name: 'ExpenseDate', fieldDisplayType: 'Date' },
    { name: 'Status', fieldDisplayType: 'ChoiceSetSingle', choiceSetId: 'status' },
    { name: 'ReceiptPath', fieldDisplayType: 'Text' },
  ];
}

/** The four seeded rows that need attention, exactly as the tenant returns them. */
const UNSETTLED_ROWS = [
  { Id: 'a', ExpenseCode: 'EXP-1008', Employee: 'Priya Shah', Amount: 82000, Status: 2, ReceiptPath: 'mumbai-trip.pdf', Category: 0, ExpenseDate: '2026-08-19' },
  { Id: 'b', ExpenseCode: 'EXP-1009', Employee: 'Priya Shah', Amount: 37550, Status: 3, ReceiptPath: 'mumbai-trip.pdf', Category: 0, ExpenseDate: '2026-08-20' },
  { Id: 'c', ExpenseCode: 'EXP-1010', Employee: 'Aman Patel', Amount: 2500, Status: 1, ReceiptPath: null, Category: 3, ExpenseDate: '2026-08-18' },
  { Id: 'd', ExpenseCode: 'EXP-1013', Employee: 'Aman Patel', Amount: 1450, Status: 6, ReceiptPath: null, Category: 1, ExpenseDate: '2026-08-17' },
];

function stubClients(): void {
  const entities = {
    getById: async () => ({ id: 'entity-1', name: 'ExpenseFlow_Expense', fields: fieldNames() }),
    queryRecordsById: async (_id: string, options: Record<string, unknown>) => {
      queries.push(options);

      const aggregates = options.aggregates as { alias?: string; function: string }[] | undefined;

      if (aggregates !== undefined) {
        const row: Record<string, unknown> = {};
        for (const { alias, function: fn } of aggregates) {
          // >>> PascalCase, like the server. <<<
          const key = (alias ?? fn).charAt(0).toUpperCase() + (alias ?? fn).slice(1);
          row[key] = fn === 'COUNT' ? 142 : fn === 'MAX' ? '2026-08-22' : 840000;
        }
        return { items: [row], hasNextPage: false, nextCursor: undefined };
      }

      return { items: UNSETTLED_ROWS, hasNextPage: false, nextCursor: undefined };
    },
  };

  const choiceSets = {
    getById: async (id: string) => ({
      items: id === 'status' ? STATUS_VALUES : CATEGORY_VALUES,
      hasNextPage: false,
      nextCursor: undefined,
    }),
  };

  registerClients({ entities, choiceSets } as unknown as UiPathClients);
}

beforeEach(async () => {
  queries = [];
  resetSchema();
  resetChoiceMaps();
  stubClients();
  await warmUp();
});

afterEach(() => {
  registerClients(null);
});

/* --- the tests ------------------------------------------------------------ */

test('every status filter value is a numberId, as a string', async () => {
  await getFinanceSummary();
  await listUnsettled();

  const statusFilters = queries.flatMap((query) => {
    const group = query.filterGroup as
      | { queryFilters?: { fieldName: string; valueList?: string[] }[] }
      | undefined;
    return (group?.queryFilters ?? []).filter((filter) => filter.fieldName === 'Status');
  });

  assert.ok(statusFilters.length >= 3, 'the summary and the queue both filter on Status');

  for (const filter of statusFilters) {
    for (const value of filter.valueList ?? []) {
      assert.match(
        value,
        /^\d+$/,
        `Status filter sent "${value}" — a choice filter takes the numberId AS A STRING`,
      );
    }
  }
});

test('Draft is excluded from the company total by numberId, not by name', async () => {
  await getFinanceSummary();

  const notIn = queries
    .flatMap((query) => {
      const group = query.filterGroup as
        | { queryFilters?: { fieldName: string; operator: string; valueList?: string[] }[] }
        | undefined;
      return group?.queryFilters ?? [];
    })
    .find((filter) => filter.fieldName === 'Status' && filter.operator === 'not in');

  assert.deepEqual(notIn?.valueList, ['0'], 'Draft is numberId 0 in the fake tenant');
});

test('the KPI aggregates are read back despite the server changing the alias case', async () => {
  const summary = await getFinanceSummary();

  // The stub answers `Count` / `Total` / `Latest` for aliases sent as
  // `count` / `total` / `latest`. Indexing by the alias we SENT would give
  // undefined here, and every tile would read 0.
  assert.equal(summary.submitted.count, 142);
  assert.equal(summary.monthTotal.total, 840000);
  assert.equal(summary.month, '2026-08');
});

test('the KPI tiles never fetch rows to count them', async () => {
  await getFinanceSummary();

  // Four queries: MAX(ExpenseDate), then the three tiles. Every one of them
  // carries `aggregates`, so Data Fabric does the arithmetic and sends back a
  // single row. A query with no aggregates here would mean somebody had gone
  // back to `.filter().reduce()` over a page of records.
  assert.ok(queries.length >= 4);
  for (const query of queries) {
    assert.ok(
      query.aggregates !== undefined,
      'a Finance KPI query without `aggregates` is counting rows in the browser',
    );
  }
});

test('the unsettled queue is narrowed server-side and sorted by amount', async () => {
  const rows = await listUnsettled();

  const [query] = queries;
  const group = query?.filterGroup as
    | { queryFilters?: { fieldName: string; operator: string; valueList?: string[] }[] }
    | undefined;

  assert.equal(group?.queryFilters?.[0]?.operator, 'in');
  assert.deepEqual(
    group?.queryFilters?.[0]?.valueList,
    ['1', '2', '3', '6'],
    'Submitted, PolicyReview, PendingApproval, Reworked',
  );
  assert.deepEqual(query?.sortOptions, [{ fieldName: 'Amount', isDescending: true }]);

  // And the choice values come back translated, not as the integers DF sent.
  assert.deepEqual(
    rows.map((row) => row.status),
    ['PolicyReview', 'PendingApproval', 'Submitted', 'Reworked'],
  );
  // A null ReceiptPath becomes a null receiptName — the Missing Receipt test.
  assert.equal(rows[2]?.receiptName, null);
  assert.equal(rows[0]?.receiptName, 'mumbai-trip.pdf');
});
