/* ============================================================================
 * policy.ts — the threshold a submit is DECIDED against
 * ----------------------------------------------------------------------------
 * Regression test for the defect T06 shipped and the Day-2 rehearsal caught:
 *
 *   The Asset was 5,000. The screen said "Above the ₹5,000 threshold".
 *   The record that was written said "Auto-approved under policy threshold"
 *   and landed Approved — a ₹8,500 expense decided against 25,000.
 *
 * Cause: the threshold was cached for the lifetime of the page, and the SUBMIT
 * used that cache. Change the Asset mid-session and the app keeps deciding
 * against the value it read at boot, while simultaneously displaying the new
 * one. The screen contradicts itself and the record is wrong for good.
 *
 * A cached value is fine for a hint on a form. It is not fine for a decision
 * that is written to a record and cannot be taken back.
 *
 * Runs on plain Node — `policy.ts` and its imports touch no browser globals.
 *
 *     node --test apps/expenseflow/scripts/policy.test.ts
 * ========================================================================== */

import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { registerClients } from '../src/services/uipath/client';
import type { UiPathClients } from '../src/services/uipath/client';
import {
  getPolicyThreshold,
  readPolicyThresholdNow,
  resetPolicyThreshold,
} from '../src/services/uipath/policy';

/** What Orchestrator currently holds. Reassign to simulate someone editing it. */
let assetValue = '25000';
let reads = 0;

function stubClients(): void {
  const assets = {
    getByName: async () => {
      reads += 1;
      return { value: assetValue };
    },
  };
  // Only `assets` is exercised here; the rest of the bundle is never touched.
  registerClients({ assets } as unknown as UiPathClients);
}

function reset(): void {
  assetValue = '25000';
  reads = 0;
  resetPolicyThreshold();
  stubClients();
}

test('the cached read is cached — one Asset call serves many hints', async () => {
  reset();

  assert.equal(await getPolicyThreshold(), 25000);
  assert.equal(await getPolicyThreshold(), 25000);
  assert.equal(reads, 1, 'a form hint must not hit Orchestrator on every render');
});

test('a submit sees an Asset that changed after the page loaded', async () => {
  reset();

  // The page boots and reads the threshold for the form hint.
  assert.equal(await getPolicyThreshold(), 25000);

  // Someone edits the Asset in Orchestrator. The page is NOT reloaded.
  assetValue = '5000';

  // This is what `createExpense` must use. Before the fix it returned the
  // stale 25000, so a ₹8,500 expense was auto-approved against a ₹5,000
  // policy — exactly what EXP-1014 recorded.
  assert.equal(
    await readPolicyThresholdNow(),
    5000,
    'the submit decision must read the Asset, not a cache from page load',
  );
});

test('a fresh read refreshes the cache the UI reads from', async () => {
  reset();

  await getPolicyThreshold();
  assetValue = '5000';
  await readPolicyThresholdNow();

  // Otherwise the form hint keeps claiming ₹25,000 while submits decide
  // against ₹5,000 — the same contradiction, pointing the other way.
  assert.equal(await getPolicyThreshold(), 5000);
});
