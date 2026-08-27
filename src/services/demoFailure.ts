/* ============================================================================
 * ExpenseFlow — the rehearsed failure
 * ============================================================================
 *
 *   >>> DO NOT WAIT FOR A REAL SERVICE TO BE DOWN AT THE RIGHT MOMENT. <<<
 *
 * The Day-2 script spends six minutes (37–43) on error handling, and it needs a
 * failure to happen ON CUE, in front of an audience, on the first try. There
 * are two ways to get one:
 *
 *   1. hope something breaks — which is not a demo, it is a gamble, and it
 *      fails in the one direction you cannot recover from: nothing goes wrong
 *      and there is nothing to show;
 *   2. arm a failure deliberately and show the app handling it.
 *
 * This module is (2). It is not a mock and it is not a stub: the app really
 * does try to submit, the error really does travel the same path a 500 from
 * Data Fabric would, and every layer above — the service's `rethrowFriendly`,
 * the hook's error state, the form's "keep the data, re-enable the button" —
 * behaves exactly as it would in a genuine outage.
 *
 * ---------------------------------------------------------------------------
 * HOW TO TRIGGER IT — this is the bit the run-of-show quotes
 *
 *     …/expenses/new?demo=fail          the next submit fails
 *     …/approvals?demo=fail             the next approve / reject / rework fails
 *     …/expenses/new?demo=fail-submit   only submits fail
 *     …/approvals?demo=fail-decide      only decisions fail
 *
 * The flag lives in the URL, so it survives a reload, it is visible in the
 * address bar (nobody has to wonder afterwards whether the failure was real),
 * and turning it off is deleting ten characters. Delete it, press Submit again,
 * and it works — which is the recovery half of the beat and the reason the
 * trigger is a URL and not a build flag.
 *
 * It is checked BEFORE any UiPath call, so an armed failure writes nothing: no
 * record, no receipt in the bucket, no Action Center task. The tenant is
 * exactly as clean afterwards as it was before, which is what makes the segment
 * repeatable — and `reset.mjs` has nothing extra to undo.
 *
 * The ₹0 path in the script needs none of this: `NewExpenseForm` already
 * refuses an amount of zero with its own message. Showing both is the point —
 * one failure never leaves the browser, the other comes back from a service,
 * and they deserve different-looking treatment.
 * ========================================================================== */

import { translatedError } from './uipath/errors';

/** Which operation an armed failure applies to. */
export type DemoFailureScope = 'submit' | 'decide';

/**
 * The message the audience reads.
 *
 * Written to be indistinguishable in tone from the real translated errors in
 * `services/uipath/errors.ts` — because the point of the contrast slide is
 * `Unhandled Promise Error` versus a sentence a finance clerk can act on, not
 * a real error versus an obviously fake one.
 *
 * Both say what did NOT happen. "Nothing was saved" is the sentence that stops
 * a user pressing Submit four more times.
 */
const MESSAGES: Record<DemoFailureScope, string> = {
  submit:
    'Expense submission failed. We could not process this expense — nothing was saved, ' +
    'and your details are still here. Try again.',
  decide:
    'The decision could not be recorded. The Action Center task is untouched and the ' +
    'expense is unchanged. Try again.',
};

function armedScopes(): ReadonlySet<DemoFailureScope> {
  // Read on every call rather than once at module load: the presenter edits the
  // URL live, and a value captured at boot would need a reload to take effect.
  const value = new URLSearchParams(window.location.search).get('demo');
  if (value === null) return new Set();

  const flags = new Set(value.split(',').map((part) => part.trim().toLowerCase()));

  if (flags.has('fail')) return new Set<DemoFailureScope>(['submit', 'decide']);

  const scopes = new Set<DemoFailureScope>();
  if (flags.has('fail-submit')) scopes.add('submit');
  if (flags.has('fail-decide')) scopes.add('decide');
  return scopes;
}

/** True when `?demo=fail` (or the scoped form) is on the current URL. */
export function isDemoFailureArmed(scope: DemoFailureScope): boolean {
  return armedScopes().has(scope);
}

/**
 * Throw the rehearsed failure, if it is armed. A no-op otherwise.
 *
 * Called at the TOP of the service function, before the first UiPath call, so
 * that "nothing was saved" in the message above is literally true.
 *
 * The error is built by `translatedError`, so the service layer's own
 * translation passes it straight through instead of wrapping it in "ExpenseFlow
 * could not save the expense: …" — and `recovery: 'retry'` means the UI draws
 * the same Retry affordance a genuine 500 would get.
 */
export function failIfDemoFailureArmed(scope: DemoFailureScope): void {
  if (!isDemoFailureArmed(scope)) return;

  console.error(`[expenseflow] ?demo=fail is armed — failing "${scope}" deliberately.`);
  throw translatedError(MESSAGES[scope], 'retry');
}
