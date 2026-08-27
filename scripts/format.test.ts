/* ============================================================================
 * format.ts — one locale, one formatter
 * ============================================================================
 *
 * The audience is in Mumbai and the money is in rupees, so digit grouping is
 * not a detail. `4825000` is `48,25,000` under `en-IN` and `4,825,000` under
 * `en-US`, and a machine set to a US locale renders the American grouping
 * everywhere the code says `.toLocaleString()` with no locale argument.
 *
 * That is a bug you cannot see on your own laptop. These tests pin the locale
 * explicitly so it fails in CI rather than on a projector.
 *
 * The date tests pin the other half: an expense date is a CALENDAR date, and
 * `new Date('2026-08-18')` is UTC midnight — which renders as 17 Aug anywhere
 * west of Greenwich. Every date in this app is formatted from the string.
 *
 *     npm test -w apps/expenseflow
 * ========================================================================== */

import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatMonth,
  formatNumber,
  initials,
} from '../src/lib/format';

test('money uses Indian digit grouping, whatever the machine locale is', () => {
  assert.equal(formatCurrency(48250), '₹48,250');
  // The one that separates en-IN from en-US. en-US would say ₹4,825,000.
  assert.equal(formatCurrency(4825000), '₹48,25,000');
  assert.equal(formatNumber(4825000), '48,25,000');
});

test('money has no paise — an expense list of 48,250.00 reads as noise', () => {
  assert.equal(formatCurrency(48249.6), '₹48,250');
  assert.equal(formatCurrency(0), '₹0');
});

test('the compact form turns 840000 into the tile the wireframe asks for', () => {
  // Event Structure.md draws this tile as ₹8.4L.
  assert.equal(formatCurrencyCompact(840000), '₹8.4L');
  assert.equal(formatCurrencyCompact(12000000), '₹1.2Cr');
  // Below a lakh there is nothing to compact, so it stays exact.
  assert.equal(formatCurrencyCompact(37550), '₹37,550');
});

test('a date is formatted from the string, never through a Date', () => {
  // The regression this guards: `new Date('2026-08-18')` is UTC midnight, so
  // `toLocaleDateString()` renders 17 Aug in every timezone west of Greenwich —
  // including on a laptop that was fine in rehearsal and travelled.
  assert.equal(formatDate('2026-08-18'), '18 Aug 2026');
  assert.equal(formatDate('2026-01-01'), '1 Jan 2026');
  // A full ISO timestamp is truncated to its calendar date, not re-parsed.
  assert.equal(formatDate('2026-08-18T23:45:00+05:30'), '18 Aug 2026');
});

test('an unparseable date is returned as-is rather than as "NaN undefined"', () => {
  assert.equal(formatDate('not-a-date'), 'not-a-date');
  assert.equal(formatMonth('nonsense'), 'nonsense');
});

test('formatMonth labels the Finance tile', () => {
  assert.equal(formatMonth('2026-08'), 'Aug 2026');
});

test('initials take the first two words only', () => {
  assert.equal(initials('Rahul Mehta'), 'RM');
  assert.equal(initials('Neha Kulkarni Singh'), 'NK');
  assert.equal(initials(''), '');
});
