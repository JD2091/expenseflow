/* ============================================================================
 * applyPolicy — the whole submit-time business rule
 * ----------------------------------------------------------------------------
 * A missing receipt sends the expense to a manager regardless of amount, even
 * one that would otherwise auto-approve under the policy threshold.
 *
 *     npm test -w apps/expenseflow
 * ========================================================================== */

import { strict as assert } from 'node:assert';
import { test } from 'node:test';

/**
 * `expenseService` pulls in `expenseService.mock`, which reads
 * `window.location.search` at module load. Node has no `window` — give it the
 * smallest one that answers "no", same as approval.test.ts.
 */
Object.defineProperty(globalThis, 'window', {
  value: { location: { search: '' } },
  configurable: true,
  writable: true,
});

const { applyPolicy } = await import('../src/services/expenseService');

test('a missing receipt always sends the expense to a manager', () => {
  assert.equal(applyPolicy(1000, 25000, false).status, 'PendingApproval');
});

test('a receipt under the threshold still auto-approves', () => {
  assert.equal(applyPolicy(1000, 25000, true).status, 'Approved');
});

test('over the threshold still needs a manager, receipt or not', () => {
  assert.equal(applyPolicy(30000, 25000, true).status, 'PendingApproval');
});
