/* ============================================================================
 * ExpenseFlow — app constants
 * ----------------------------------------------------------------------------
 * Everything here becomes a UiPath resource on Day 2. That is the point: on
 * Day 1 they are literals in one file, and on Day 2 each one is replaced by a
 * platform lookup — a one-line change with a very visible story behind it.
 * ========================================================================== */

/**
 * The signed-in employee.
 * Day 2: comes from the authenticated session (`useAuth()` -> the SDK's user),
 * not from a constant.
 */
export const CURRENT_USER = 'Rahul Mehta';

/** Their manager — the name stamped on an approve/reject decision. */
export const CURRENT_MANAGER = 'Neha Kulkarni';

/**
 * The company's auto-approval ceiling USED to live here, as a literal.
 *
 * Day 2 moved it to the Orchestrator Asset `ExpenseFlow_PolicyThreshold`,
 * read by `services/uipath/policy.ts` and surfaced as
 * `useExpenses().policyThreshold`. "We are not hardcoding ₹25,000 into our
 * application, the business policy lives in UiPath" is a checkable claim:
 *
 *     grep -rn 25000 src/ | grep -v mock     # empty
 *
 * The one surviving literal is in `expenseService.mock.ts`, where there is no
 * Orchestrator to ask.
 */

/** How many rows the dashboard's "Recent Expenses" panel previews. */
export const RECENT_LIMIT = 4;
