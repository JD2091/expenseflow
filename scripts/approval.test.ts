/* ============================================================================
 * decideExpense — Action Center first, Data Fabric second
 * ============================================================================
 *
 *   >>> THE ONE ORDERING BUG YOU CANNOT SEE ON A SCREEN. <<<
 *
 * If the task completion fails and the record was already updated, the app
 * shows "Approved", the Data Fabric row says "Approved", and the manager's
 * Action Center inbox still has the task sitting in it. Nothing errors.
 * Nothing looks wrong. The two systems simply disagree, forever, and the only
 * way anyone finds out is by opening both.
 *
 * So the order is load-bearing, and an ordering guarantee that is only written
 * down in a comment is a guarantee that survives exactly until the next
 * refactor. This test is what makes it survive.
 *
 *     npm test -w apps/expenseflow
 * ========================================================================== */

import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, test } from 'node:test';

/* --- environment ---------------------------------------------------------- */

/**
 * `expenseService.mock` reads `window.location.search` at module load to decide
 * whether `?mock=1` is on. Node has no `window`, so give it the smallest one
 * that answers "no" — the real service path is what we are here to test.
 */
Object.defineProperty(globalThis, 'window', {
  value: { location: { search: '' } },
  configurable: true,
  writable: true,
});

const { registerClients } = await import('../src/services/uipath/client');
type UiPathClients = import('../src/services/uipath/client').UiPathClients;
const { decideExpense } = await import('../src/services/expenseService');
const { resetSchema } = await import('../src/services/uipath/schema');
const { resetChoiceMaps } = await import('../src/services/uipath/choiceSets');
const { resetFolderId } = await import('../src/services/uipath/folders');
const { warmUp } = await import('../src/services/uipath/entityClient');
type Expense = import('../src/models/expense').Expense;

/* --- the fake tenant ------------------------------------------------------ */

/** Every call the service makes, in the order it made them. */
let calls: string[] = [];
let failTaskCompletion = false;
let taskIsCompleted = false;

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

/** The record `updateRecordById` last wrote, so assertions can read it back. */
let lastPatch: Record<string, unknown> = {};

/** Matches `config.generated.ts`, so the folder lookup takes its happy path. */
const { UIPATH } = await import('../src/services/uipath/config');
const FOLDER_KEY = UIPATH.folderKey;

function stubClients(): void {
  const entities = {
    getById: async () => ({
      id: 'entity-1',
      name: 'ExpenseFlow_Expense',
      fields: [
        { name: 'Id', fieldDisplayType: 'Number' },
        { name: 'ExpenseCode', fieldDisplayType: 'Text' },
        { name: 'Employee', fieldDisplayType: 'Text' },
        { name: 'Description', fieldDisplayType: 'Text' },
        { name: 'Category', fieldDisplayType: 'ChoiceSetSingle', choiceSetId: 'cat' },
        { name: 'Amount', fieldDisplayType: 'Decimal' },
        { name: 'ExpenseDate', fieldDisplayType: 'Date' },
        { name: 'Status', fieldDisplayType: 'ChoiceSetSingle', choiceSetId: 'status' },
        { name: 'ReceiptPath', fieldDisplayType: 'Text' },
        { name: 'ApprovalTaskId', fieldDisplayType: 'Text' },
        { name: 'PolicyNote', fieldDisplayType: 'Text' },
        { name: 'SubmittedAt', fieldDisplayType: 'DateTime' },
        { name: 'DecidedAt', fieldDisplayType: 'DateTime' },
        { name: 'DecidedBy', fieldDisplayType: 'Text' },
        { name: 'Comments', fieldDisplayType: 'Text' },
      ],
    }),
    updateRecordById: async (_entityId: string, recordId: string, patch: Record<string, unknown>) => {
      calls.push('entities.updateRecordById');
      lastPatch = patch;
      return { Id: recordId, ExpenseCode: 'EXP-1007', Status: patch.Status, Category: 0, ...patch };
    },
  };

  const choiceSets = {
    getById: async (id: string) => ({
      items: id === 'status' ? STATUS_VALUES : CATEGORY_VALUES,
      hasNextPage: false,
      nextCursor: undefined,
    }),
  };

  const tasks = {
    getById: async (id: number) => {
      calls.push('tasks.getById');
      return {
        id,
        type: 'ExternalTask',
        action: null,
        isCompleted: taskIsCompleted,
        complete: async () => {
          calls.push('task.complete');
          if (failTaskCompletion) throw new Error('Orchestrator said no.');
          return { success: true };
        },
      };
    },
  };

  // `folders.ts` reaches Orchestrator's /odata/Folders directly, because the
  // SDK wraps no Folders service and `Tasks.create` needs the NUMERIC id.
  // Stubbing it here keeps that path under test rather than around it.
  const sdk = {
    config: { baseUrl: 'https://api.example.test/', orgName: 'org', tenantName: 'tenant' },
    getToken: () => 'test-token',
  };

  globalThis.fetch = (async (url: string) => {
    calls.push('odata/Folders');
    assert.match(String(url), /orchestrator_\/odata\/Folders/);
    return {
      ok: true,
      status: 200,
      json: async () => ({ value: [{ Id: 4204, Key: FOLDER_KEY, FullyQualifiedName: 'Shared' }] }),
    };
  }) as unknown as typeof fetch;

  registerClients({
    entities,
    choiceSets,
    tasks,
    sdk,
    // Nothing below is exercised by these tests.
    assets: {},
    buckets: {},
  } as unknown as UiPathClients);
}

const PENDING: Expense = {
  id: 'record-1',
  expenseCode: 'EXP-1007',
  employee: 'Rahul Mehta',
  description: 'Customer conference travel',
  category: 'Travel',
  amount: 37550,
  expenseDate: '2026-08-22',
  status: 'PendingApproval',
  receiptName: 'mumbai-trip.pdf',
  receiptPath: 'receipts/EXP-1007-mumbai-trip.pdf',
  approvalTaskId: '4821',
};

beforeEach(async () => {
  calls = [];
  lastPatch = {};
  failTaskCompletion = false;
  taskIsCompleted = false;
  resetSchema();
  resetChoiceMaps();
  resetFolderId();
  stubClients();
  // The choice maps have to exist before any write: `toUpdatePayload` needs
  // them to turn 'Approved' into its numberId, synchronously.
  await warmUp();
});

afterEach(() => {
  registerClients(null);
});

/* --- the tests ------------------------------------------------------------ */

test('the Action Center task is completed BEFORE the record is updated', async () => {
  await decideExpense(PENDING, { action: 'Approve', comments: 'Within the travel budget.' });

  assert.deepEqual(calls, [
    'odata/Folders',
    'tasks.getById',
    'task.complete',
    'entities.updateRecordById',
  ]);
});

test('a failed task completion leaves the Data Fabric record untouched', async () => {
  failTaskCompletion = true;

  await assert.rejects(
    decideExpense(PENDING, { action: 'Approve', comments: '' }),
    /could not/i,
    'the caller must see a translated failure, not a silent success',
  );

  assert.equal(
    calls.includes('entities.updateRecordById'),
    false,
    'the record must not claim Approved while the task is still open in the inbox',
  );
});

test('an already-completed task is refused by name, not by a generic error', async () => {
  taskIsCompleted = true;

  await assert.rejects(decideExpense(PENDING, { action: 'Approve', comments: '' }), (error) => {
    assert.ok(error instanceof Error);
    assert.match(error.message, /already completed/i);
    return true;
  });

  assert.equal(calls.includes('task.complete'), false);
  assert.equal(calls.includes('entities.updateRecordById'), false);
});

test('Status is written as its choice numberId, never as the name', async () => {
  await decideExpense(PENDING, { action: 'Reject', comments: 'Missing itemised receipt.' });

  // 'Rejected' is numberId 5 in the fake tenant above. Sending the STRING
  // 'Rejected' is not a type error and Data Fabric answers with a message
  // about decimal format — see STATE.md §7 gotcha 27.
  assert.equal(lastPatch.Status, 5);
  assert.equal(lastPatch.DecidedBy, 'Neha Kulkarni');
  assert.equal(lastPatch.Comments, 'Missing itemised receipt.');
  assert.ok(typeof lastPatch.DecidedAt === 'string');
});

test('an empty comment is omitted rather than written as an empty string', async () => {
  await decideExpense(PENDING, { action: 'Rework', comments: '   ' });

  assert.equal('Comments' in lastPatch, false);
  assert.equal(lastPatch.Status, 6);
});

test('an expense with no task is decided in Data Fabric alone', async () => {
  const seeded: Expense = { ...PENDING, approvalTaskId: undefined };

  await decideExpense(seeded, { action: 'Approve', comments: '' });

  // Seeded rows predate the app and have no Action Center task. Reaching for
  // one anyway would 404 and block a decision that is perfectly legitimate.
  assert.deepEqual(calls, ['entities.updateRecordById']);
});
