/* ============================================================================
 * ExpenseFlow — formatting helpers
 * ============================================================================
 *
 *   >>> THE ONLY FILE IN `src/` THAT FORMATS A NUMBER OR A DATE. <<<
 *
 * That is checkable, not aspirational:
 *
 *     grep -rn "toLocaleString" src/ | grep -v src/lib/format    # empty
 *
 * It matters because the audience is in Mumbai and the money is in rupees.
 * `48250` groups as `48,250` under `en-IN` and as `48,250` under `en-US` — but
 * `4825000` groups as `48,25,000` and `4,825,000`. One stray
 * `amount.toLocaleString()` at a call site renders lakhs in the American
 * grouping on one screen and the Indian grouping on the next, and nobody spots
 * it until it is on a projector.
 *
 * The dates are deliberately timezone-proof, and deliberately NOT
 * `toLocaleDateString`. `new Date('2026-08-18')` parses as UTC midnight, so it
 * renders as 17 Aug anywhere west of Greenwich. An expense date is a calendar
 * date, not an instant — so we format the STRING, never a `Date`.
 * ========================================================================== */

/**
 * One locale, one place. Every grouped number in the app goes through it.
 */
const LOCALE = 'en-IN';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

/** `48250` -> `₹48,250`. Indian digit grouping, no paise. */
export function formatCurrency(amount: number): string {
  return `₹${formatNumber(amount)}`;
}

/**
 * `142` -> `142`, `4825000` -> `48,25,000`. A count, not money.
 *
 * Looks redundant at three digits, which is exactly why it is easy to skip and
 * exactly why it is here: the Finance tile reads 142 today and five figures the
 * first time this runs against a real tenant.
 */
export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString(LOCALE);
}

/** `840000` -> `₹8.4L`. For KPI tiles where the full number is noise. */
export function formatCurrencyCompact(amount: number): string {
  if (Math.abs(amount) >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (Math.abs(amount) >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return formatCurrency(amount);
}

/** `'2026-08-18'` -> `'18 Aug 2026'`. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  const monthIndex = Number(month) - 1;
  if (!year || !day || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return isoDate;
  return `${Number(day)} ${MONTHS[monthIndex]} ${year}`;
}

/** `'2026-08'` -> `'Aug 2026'`. */
export function formatMonth(isoMonth: string): string {
  const [year, month] = isoMonth.split('-');
  const monthIndex = Number(month) - 1;
  if (!year || !MONTHS[monthIndex]) return isoMonth;
  return `${MONTHS[monthIndex]} ${year}`;
}

/** An ISO timestamp rendered as a plain calendar date. */
export function formatTimestamp(iso: string): string {
  return formatDate(iso.slice(0, 10));
}

/** Today as `YYYY-MM-DD` in the user's own timezone — the form's default date. */
export function todayIso(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** `'Rahul Mehta'` -> `'RM'`. */
export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
