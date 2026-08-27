import type { ExpenseStatus } from '../models/expense';
import { STATUS_TOKENS } from '../models/status';

/**
 * A status is a LOOKUP, never a `switch`.
 *
 * The Day-1 starter did `status-${status.toLowerCase()}` and matched it against
 * four hand-written CSS classes, so a fifth status rendered an unstyled pill and
 * nobody noticed until Day 2. Reading the token map means an unhandled status is
 * a type error at build time instead of a beige pill on stage.
 */
export function StatusPill({ status }: { status: ExpenseStatus }) {
  const token = STATUS_TOKENS[status];

  return (
    <span className="status-pill" style={{ background: token.bg, color: token.fg }}>
      {token.label}
    </span>
  );
}
