/* ============================================================================
 * ExpenseFlow — status semantics
 * ----------------------------------------------------------------------------
 * One place that knows what a status *means*: what colour it wears, what it is
 * called in English, and how far through the pipeline it sits.
 *
 * `STATUS_TOKENS` is a LOOKUP, not a `switch`. Adding a status is a new row
 * here plus a new row in `docs/design-system.md` §3 — never a new `case` buried
 * in a component.
 *
 * Day-2 reminder (STATE.md §7.1): Data Fabric returns choice fields as an
 * integer `numberId` on every read path. The key into this map is the NAME, so
 * translate `numberId -> name` through the ChoiceSet map first.
 * ========================================================================== */

import type { ExpenseStatus } from './expense';

export interface StatusToken {
  bg: string;
  fg: string;
  label: string;
}

export const STATUS_TOKENS: Record<ExpenseStatus, StatusToken> = {
  Draft: {
    bg: 'var(--color-status-draft-bg)',
    fg: 'var(--color-status-draft-fg)',
    label: 'Draft',
  },
  Submitted: {
    bg: 'var(--color-status-pending-bg)',
    fg: 'var(--color-status-pending-fg)',
    label: 'Submitted',
  },
  PolicyReview: {
    bg: 'var(--color-status-review-bg)',
    fg: 'var(--color-status-review-fg)',
    label: 'Policy Review',
  },
  PendingApproval: {
    bg: 'var(--color-status-pending-bg)',
    fg: 'var(--color-status-pending-fg)',
    label: 'Pending Approval',
  },
  Approved: {
    bg: 'var(--color-status-approved-bg)',
    fg: 'var(--color-status-approved-fg)',
    label: 'Approved',
  },
  Rejected: {
    bg: 'var(--color-status-rejected-bg)',
    fg: 'var(--color-status-rejected-fg)',
    label: 'Rejected',
  },
  Reworked: {
    bg: 'var(--color-status-blocked-bg)',
    fg: 'var(--color-status-blocked-fg)',
    label: 'Needs Rework',
  },
};

export function statusLabel(status: ExpenseStatus): string {
  return STATUS_TOKENS[status].label;
}

/* --- Which bucket does a status fall into? -------------------------------- */

/** Submitted and not yet decided — the money the employee is waiting on. */
export const IN_FLIGHT_STATUSES: readonly ExpenseStatus[] = [
  'Submitted',
  'PolicyReview',
  'PendingApproval',
];

export function isInFlight(status: ExpenseStatus): boolean {
  return IN_FLIGHT_STATUSES.includes(status);
}

/** Anything that has left the employee's hands. A `Draft` has not. */
export function isSubmitted(status: ExpenseStatus): boolean {
  return status !== 'Draft';
}

/** Waiting on a human decision — the Manager Approval queue (Screen 4). */
export function needsDecision(status: ExpenseStatus): boolean {
  return status === 'PendingApproval' || status === 'PolicyReview';
}

/* --- The four-step tracker on Screen 3 ------------------------------------ */

export const APPROVAL_STEPS = [
  'Submitted',
  'Policy validation',
  'Manager approval',
  'Finance processing',
] as const;

export interface StatusProgress {
  /** Steps with index < `completed` are done. */
  completed: number;
  /** The step currently in progress, or `null` when nothing is running. */
  current: number | null;
  /** One line under the tracker explaining a terminal or stalled state. */
  note?: string;
}

/**
 * Where each status sits in the four-step pipeline.
 *
 * `current` is the step that is genuinely RUNNING. A terminal status has no
 * running step, so `current` is `null` and the tracker shows no `●` — the
 * pipeline stopped, and drawing a pulsing "in progress" glyph on a rejected
 * expense would be a lie the eye reads before the note underneath corrects it.
 *
 * The four steps come from `APPROVAL_STEPS`:
 *   0 Submitted · 1 Policy validation · 2 Manager approval · 3 Finance processing
 */
const PROGRESS: Record<ExpenseStatus, StatusProgress> = {
  Draft: { completed: 0, current: null, note: 'Not submitted yet.' },
  // Submitted and being checked against the policy threshold.
  Submitted: { completed: 1, current: 1 },
  PolicyReview: { completed: 1, current: 1, note: 'Above the policy threshold — under review.' },
  // Policy said "a human decides this". The Action Center task is open.
  PendingApproval: { completed: 2, current: 2, note: 'Waiting on a manager in Action Center.' },
  // Approved: three steps behind it, finance processing is what is running.
  Approved: { completed: 3, current: 3 },
  // Both of these are DECIDED. Manager approval happened — it just did not end
  // in a yes — so the step is complete and nothing is running.
  Rejected: { completed: 3, current: null, note: 'Rejected — this expense stops here.' },
  Reworked: {
    completed: 3,
    current: null,
    note: 'Sent back to the employee — resubmit to start the pipeline again.',
  },
};

export function statusProgress(status: ExpenseStatus): StatusProgress {
  return PROGRESS[status];
}
