/* ============================================================================
 * ExpenseFlow — UiPath error translation
 * ============================================================================
 *
 *   >>> NO RAW ERROR EVER REACHES THE SCREEN. <<<
 *
 * This is the 37–43 minute segment of Day 2, and the script is explicit that it
 * is "much more valuable than adding another feature". The contrast slide is
 * two strings:
 *
 *     Unhandled Promise Error
 *
 *     ⚠ Expense submission failed.
 *       We couldn't process this expense. Please try again.
 *
 * The first one is what a `UiPathError` looks like when nobody catches it. It
 * names no cause, suggests no action, and tells the audience that the person on
 * stage did not think about failure. The second is this module.
 *
 * Every `UiPathError` subclass maps to ONE sentence naming the likely cause,
 * plus a `recovery` telling the UI which affordance to draw — retry, sign in,
 * or nothing. A message that says "try again" next to no button is only half a
 * translation.
 * ========================================================================== */

import {
  isAuthenticationError,
  isAuthorizationError,
  isNetworkError,
  isNotFoundError,
  isRateLimitError,
  isServerError,
  isUiPathError,
  isValidationError,
} from '@uipath/uipath-typescript/core';

import { UIPATH } from './config';

/**
 * What the UI should OFFER, not just what it should say.
 *
 *   retry    — the same call might genuinely work: 5xx, throttling, a dropped
 *              connection. Draw a Retry button.
 *   signIn   — the session is gone. Retrying is pointless until the user signs
 *              in again, so draw that instead.
 *   none     — nothing the user can do from here. Draw no false hope.
 */
export type ErrorRecovery = 'retry' | 'signIn' | 'none';

/** What the user reads, plus what the UI should do about it. */
export interface FriendlyError {
  /** One sentence, safe to render in an `ErrorState` or a toast. */
  message: string;
  recovery: ErrorRecovery;
  /** True when retrying the same call might genuinely work (5xx, throttling). */
  isRetryable: boolean;
}

function friendly(message: string, recovery: ErrorRecovery): FriendlyError {
  return { message, recovery, isRetryable: recovery === 'retry' };
}

/**
 * The field-level detail a `ValidationError` carries.
 *
 * Data Fabric's validation failures are the one class where the SERVER knows
 * something the app does not — WHICH field, and WHY. Replacing that with a
 * generic "check your input" throws away the only useful part.
 *
 * The detail lives on `message`, not on a structured `details` array: the
 * installed SDK's `UiPathError` carries exactly `message`, `statusCode`,
 * `requestId` and `timestamp` (checked against the 1.6.2 `.d.ts` and the
 * bundle, not the reference doc). So the sentence quotes the server verbatim,
 * which is how a message like `Required field "Description" is not provided`
 * reaches the person who can fix it.
 */
function validationDetail(cause: unknown): string {
  const message = (cause as { message?: unknown })?.message;
  return typeof message === 'string' ? message.trim() : '';
}

/**
 * `what` names the operation in the user's language — "load your expenses",
 * "save the expense", "read the policy threshold". It is spliced straight into
 * the sentence, so keep it a lowercase verb phrase.
 */
export function describeError(cause: unknown, what: string): FriendlyError {
  if (isAuthenticationError(cause)) {
    return friendly(
      `Your UiPath session expired, so ExpenseFlow could not ${what}. Sign in again to continue.`,
      'signIn',
    );
  }

  if (isAuthorizationError(cause)) {
    return friendly(
      `You do not have permission to ${what}. ` +
        `Check the app's OAuth scopes and your permissions on the ${UIPATH.folderPath} folder.`,
      'none',
    );
  }

  if (isValidationError(cause)) {
    const detail = validationDetail(cause);
    return friendly(
      `ExpenseFlow could not ${what} because UiPath rejected the details it sent.` +
        (detail === '' ? '' : ` ${detail}`),
      'none',
    );
  }

  if (isNotFoundError(cause)) {
    return friendly(
      `That expense no longer exists — it may have been withdrawn or the demo tenant may have ` +
        `been reset. ExpenseFlow could not ${what}.`,
      'none',
    );
  }

  if (isRateLimitError(cause)) {
    // The caller has usually already backed off and retried (see `withRetry`),
    // so by the time this sentence is rendered the automatic attempts are
    // exhausted. Say what happened rather than promising another retry.
    return friendly(
      `UiPath is throttling requests, so ExpenseFlow could not ${what}. Wait a moment and try again.`,
      'retry',
    );
  }

  if (isServerError(cause)) {
    // Data Fabric returns a transient 500 on roughly one call in ten
    // (STATE.md §11). It is worth retrying and worth saying so.
    return friendly(
      `Something went wrong on UiPath's side, so ExpenseFlow could not ${what}. ` +
        'This one is usually transient — try again.',
      'retry',
    );
  }

  if (isNetworkError(cause)) {
    return friendly(
      `ExpenseFlow can't reach UiPath, so it could not ${what}. Check your connection and try again.`,
      'retry',
    );
  }

  if (isUiPathError(cause)) {
    return friendly(`ExpenseFlow could not ${what}: ${cause.message}`, 'retry');
  }

  if (cause instanceof Error && cause.message) {
    return friendly(`ExpenseFlow could not ${what}: ${cause.message}`, 'none');
  }

  return friendly(`ExpenseFlow could not ${what}.`, 'none');
}

/* --- carrying the translation through a plain `Error` --------------------- */

/**
 * Marks an error this module already translated.
 *
 * `Symbol.for` rather than a private symbol so the tag survives the module
 * being evaluated twice — which happens in dev with HMR, and is exactly when
 * a mysteriously double-wrapped message would be most confusing.
 */
export const TRANSLATED = Symbol.for('expenseflow.translatedError');

/** The `recovery` a translated error was built with, for the UI to read back. */
const RECOVERY = Symbol.for('expenseflow.errorRecovery');

export function isTranslated(error: unknown): boolean {
  return error instanceof Error && TRANSLATED in error;
}

/**
 * Build a plain `Error` that the UI may render as-is.
 *
 * Components render `error.message` and know nothing about `UiPathError` — the
 * Day-1 contract. So the translation has to survive the trip up through the
 * service and the hook, and it does that by being the message itself, with the
 * recovery hint riding along on a symbol.
 */
export function translatedError(
  message: string,
  recovery: ErrorRecovery = 'none',
  cause?: unknown,
): Error {
  const error = cause === undefined ? new Error(message) : new Error(message, { cause });
  Object.defineProperty(error, TRANSLATED, { value: true });
  Object.defineProperty(error, RECOVERY, { value: recovery });
  return error;
}

/**
 * What the UI should offer for an error that has already been translated.
 *
 * Defaults to `retry` for anything untagged: an unknown error is more likely to
 * be a blip than a permanent condition, and a Retry button that does nothing
 * useful is a smaller failure than no way forward at all.
 */
export function recoveryFor(error: unknown): ErrorRecovery {
  if (error instanceof Error && RECOVERY in error) {
    return (error as unknown as Record<symbol, ErrorRecovery>)[RECOVERY];
  }
  return 'retry';
}

/**
 * Rethrow as a plain `Error` carrying the friendly message.
 *
 * The original is kept on `cause` and logged, so the console still has the
 * status code and request id when something needs debugging live.
 *
 * An already-translated error passes straight through. Otherwise a receipt
 * upload failing inside a submit would read "ExpenseFlow could not save the
 * expense: ExpenseFlow could not upload the receipt to UiPath."
 */
export function rethrowFriendly(cause: unknown, what: string): never {
  if (isTranslated(cause)) throw cause;

  const { message, recovery } = describeError(cause, what);
  console.error(`[uipath] failed to ${what}`, cause);

  throw translatedError(message, recovery, cause);
}

/* --- automatic backoff ---------------------------------------------------- */

/** Wait, without importing a timer library for four lines. */
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Retry a UiPath call that failed for a reason that might not repeat.
 *
 *   >>> ONLY 429 AND 5xx. NEVER A 4xx THE USER CAUSED. <<<
 *
 * Retrying a `ValidationError` sends the same bad payload again and turns one
 * clear rejection into three slow ones. Retrying a `NotFoundError` waits for a
 * record to appear that was never there. So the predicate is the SDK's own type
 * guards, not a `catch`-everything loop.
 *
 * Exponential, starting at 400 ms: 400, 800, 1600. Three attempts total, which
 * is under two seconds of waiting in the worst case — long enough to ride out
 * a throttle, short enough that a presenter does not start apologising.
 *
 * Deliberately NOT applied to writes. A retried `insertRecordById` that timed
 * out on the way back can create the record twice, and two ₹37,550 expenses on
 * screen is a worse failure than one honest error message.
 */
export async function withRetry<T>(operation: () => Promise<T>, attempts = 3): Promise<T> {
  let delay = 400;

  for (let attempt = 1; ; attempt += 1) {
    try {
      return await operation();
    } catch (cause) {
      const worthRetrying = isRateLimitError(cause) || isServerError(cause) || isNetworkError(cause);

      if (!worthRetrying || attempt >= attempts) throw cause;

      console.warn(
        `[uipath] attempt ${attempt} of ${attempts} failed; retrying in ${delay}ms`,
        cause,
      );
      await wait(delay);
      delay *= 2;
    }
  }
}
