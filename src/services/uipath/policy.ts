/* ============================================================================
 * ExpenseFlow — the policy threshold
 * ----------------------------------------------------------------------------
 * "We are not hardcoding ₹25,000 into our application. The business policy
 *  lives in UiPath."
 *
 * That sentence is the point of the whole beat, and it is only true if there
 * is no ₹25,000 anywhere in `src/`. There isn't — grep for it.
 *
 * The live demo: change `ExpenseFlow_PolicyThreshold` in Orchestrator, reload
 * the app, and a ₹12,450 expense starts routing to approval. No rebuild, no
 * redeploy, no code change.
 * ========================================================================== */

import { getClients } from './client';
import { UIPATH } from './config';
import { rethrowFriendly } from './errors';

let cached: number | null = null;
let inFlight: Promise<number> | null = null;

async function fetchThreshold(): Promise<number> {
  try {
    const { assets } = getClients();

    // Asset lookup is folder-scoped. `folderPath` reads better on a slide
    // than a GUID, and it is the form the skill documents.
    const asset = await assets.getByName(UIPATH.assetName, {
      folderPath: UIPATH.folderPath,
    });

    // An Integer asset still arrives as a string on `value`.
    const value = Number(asset.value);
    if (!Number.isFinite(value)) {
      throw new Error(
        `Asset ${UIPATH.assetName} holds ${JSON.stringify(asset.value)}, which is not a number. ` +
          'It must be an Integer asset.',
      );
    }

    cached = value;
    return value;
  } catch (cause) {
    rethrowFriendly(cause, 'read the policy threshold from UiPath');
  }
}

/**
 * The threshold for DISPLAY — a form hint, a detail-page label.
 *
 * Cached, because this is read on render and an Asset call per render would be
 * absurd. Concurrent first callers share one request.
 *
 * **Never decide anything with this.** See `readPolicyThresholdNow`.
 */
export async function getPolicyThreshold(): Promise<number> {
  if (cached !== null) return cached;
  if (inFlight !== null) return inFlight;

  inFlight = fetchThreshold();
  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

/**
 * The threshold to DECIDE against. Always a live read; refreshes the cache.
 *
 *   >>> This distinction is not premature caution. It is a bug we shipped. <<<
 *
 * T06 cached the threshold for the lifetime of the page and let `createExpense`
 * decide from that cache. During the Day-2 rehearsal the Asset was changed to
 * ₹5,000 mid-session and a ₹8,500 expense was written as **Approved**, with the
 * note "Auto-approved under policy threshold" — while the very same screen
 * displayed "Above the ₹5,000 threshold". The app contradicted itself, and the
 * record was wrong permanently. (`EXP-1014`, if you want to go and look.)
 *
 * A stale hint is a cosmetic bug you can fix on the next render. A stale
 * DECISION is written to a record and cannot be taken back. One Orchestrator
 * call on a button press is a rounding error next to that.
 *
 * It also makes the demo strictly better: change the Asset, submit — the
 * routing changes with no reload at all.
 */
export async function readPolicyThresholdNow(): Promise<number> {
  return fetchThreshold();
}

/** Drop the cache so the next read hits Orchestrator again. */
export function resetPolicyThreshold(): void {
  cached = null;
  inFlight = null;
}
