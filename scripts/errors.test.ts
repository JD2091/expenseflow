/* ============================================================================
 * errors.ts — every UiPathError subclass has its own sentence
 * ============================================================================
 *
 * The Day-2 error-handling segment rests on a claim that is easy to make and
 * easy to quietly break: "no raw error reaches the UI, and every failure says
 * something the user can act on."
 *
 * A `default:` branch satisfies a type checker and defeats the claim — seven
 * different failures all rendering "Something went wrong" is exactly the
 * `Unhandled Promise Error` problem wearing nicer clothes. So this test walks
 * every subclass the SDK exports and asserts three things:
 *
 *   1. the message is specific — no two subclasses share a sentence;
 *   2. the recovery affordance is right — a Retry button on an expired session
 *      invites the user to fail three more times;
 *   3. `withRetry` retries the transient ones and ONLY the transient ones.
 *
 *     npm test -w apps/expenseflow
 * ========================================================================== */

import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import {
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
} from '@uipath/uipath-typescript/core';

import { describeError, isTranslated, recoveryFor, translatedError, withRetry } from '../src/services/uipath/errors';
import type { ErrorRecovery } from '../src/services/uipath/errors';

const CASES: ReadonlyArray<{ name: string; error: Error; recovery: ErrorRecovery }> = [
  {
    name: 'AuthenticationError',
    error: new AuthenticationError({ message: '401 Unauthorized', statusCode: 401 }),
    recovery: 'signIn',
  },
  {
    name: 'AuthorizationError',
    error: new AuthorizationError({ message: '403 Forbidden', statusCode: 403 }),
    recovery: 'none',
  },
  {
    name: 'ValidationError',
    error: new ValidationError({
      message: 'Required field "Description" is not provided',
      statusCode: 400,
    }),
    recovery: 'none',
  },
  {
    name: 'NotFoundError',
    error: new NotFoundError({ message: '404 Not Found', statusCode: 404 }),
    recovery: 'none',
  },
  {
    name: 'RateLimitError',
    error: new RateLimitError({ message: '429 Too Many Requests', statusCode: 429 }),
    recovery: 'retry',
  },
  {
    name: 'ServerError',
    error: new ServerError({ message: '500 Internal Server Error', statusCode: 500 }),
    recovery: 'retry',
  },
  {
    name: 'NetworkError',
    error: new NetworkError({ message: 'Failed to fetch' }),
    recovery: 'retry',
  },
];

test('every subclass gets its own sentence — no shared fallback', () => {
  const messages = CASES.map(({ error }) => describeError(error, 'save the expense').message);

  for (const [index, message] of messages.entries()) {
    assert.ok(
      message.length > 30,
      `${CASES[index]?.name} produced a message too short to be actionable: "${message}"`,
    );
  }

  assert.equal(
    new Set(messages).size,
    CASES.length,
    'two subclasses share a message, which means one of them fell through to a default branch',
  );
});

test('the recovery affordance matches what the user can actually do', () => {
  for (const { name, error, recovery } of CASES) {
    const described = describeError(error, 'save the expense');
    assert.equal(described.recovery, recovery, `${name} offers the wrong recovery`);
    assert.equal(described.isRetryable, recovery === 'retry', `${name} disagrees with itself`);
  }
});

test('a ValidationError surfaces the field-level detail the server sent', () => {
  const { message } = describeError(
    new ValidationError({ message: 'Required field "Description" is not provided' }),
    'save the expense',
  );

  // The server is the only party that knows WHICH field. Swallowing that and
  // saying "check your input" throws away the useful half.
  assert.match(message, /Description/);
});

test('an unknown error still produces a sentence, never an empty string', () => {
  assert.match(describeError('a bare string', 'load your expenses').message, /load your expenses/);
  assert.match(describeError(null, 'load your expenses').message, /load your expenses/);
});

test('a translated error is tagged, and carries its recovery', () => {
  const error = translatedError('Nothing was saved.', 'retry');

  assert.equal(isTranslated(error), true);
  assert.equal(recoveryFor(error), 'retry');
  assert.equal(isTranslated(new Error('untagged')), false);
});

test('withRetry retries a transient failure and eventually succeeds', async () => {
  let attempts = 0;

  const result = await withRetry(async () => {
    attempts += 1;
    if (attempts < 3) throw new ServerError({ message: '500', statusCode: 500 });
    return 'ok';
  });

  assert.equal(result, 'ok');
  assert.equal(attempts, 3);
});

test('withRetry does NOT retry a failure the user caused', async () => {
  let attempts = 0;

  await assert.rejects(
    withRetry(async () => {
      attempts += 1;
      throw new ValidationError({ message: 'Amount must be greater than zero', statusCode: 400 });
    }),
  );

  // Retrying a 400 sends the same bad payload again and turns one clear
  // rejection into three slow ones.
  assert.equal(attempts, 1);
});

test('withRetry gives up rather than looping forever', async () => {
  let attempts = 0;

  await assert.rejects(
    withRetry(async () => {
      attempts += 1;
      throw new RateLimitError({ message: '429', statusCode: 429 });
    }),
  );

  assert.equal(attempts, 3);
});
