import { RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useFinance } from '../hooks/useFinance';
import type { Expense } from '../models/expense';
import { formatCurrency, formatCurrencyCompact, formatMonth, formatNumber } from '../lib/format';
import { StatCard } from '../components/StatCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { TablePager, usePagination } from '../components/TablePager';

interface Attention {
  expense: Expense;
  reason: string;
  tone: 'review' | 'pending' | 'blocked';
}

/**
 * Why one unsettled expense is Finance's problem — or isn't.
 *
 *   >>> THE ONLY CLIENT-SIDE STEP ON THIS SCREEN, AND IT IS HERE ON PURPOSE. <<<
 *
 * `listUnsettled()` has already asked Data Fabric for the four statuses that
 * can still need something: 19 rows out of 146. Three of the four reasons below
 * are just that status, read back.
 *
 * The fourth — Missing Receipt — is the one Data Fabric cannot express. There
 * is no `IsNull` operator (gotcha 6), and a NULL column matches none of the
 * operators that look like they should catch it (verified live; the numbers are
 * in `entityClient.listUnsettled`). So a plain `Submitted` row WITH a receipt is
 * dropped here, in the browser, over a bounded set the server already narrowed.
 *
 * That is what "filter client-side" is supposed to mean: the last predicate the
 * platform cannot do, not the whole query.
 */
function attentionFor(expense: Expense): Attention | null {
  if (expense.status === 'PolicyReview') {
    return { expense, reason: 'Policy Review', tone: 'review' };
  }
  if (expense.status === 'PendingApproval') {
    return { expense, reason: 'Pending Approval', tone: 'pending' };
  }
  if (expense.status === 'Reworked') {
    return { expense, reason: 'Needs Rework', tone: 'blocked' };
  }
  if (expense.receiptName === null) {
    // A derived flag, not an ExpenseFlow_Status value (docs/design-system.md §3).
    // `receiptName` is null exactly when `ReceiptPath` was empty on the record,
    // so this is the same test in both the real and the mock service.
    return { expense, reason: 'Missing Receipt', tone: 'blocked' };
  }
  return null;
}

const TONE_TOKENS: Record<Attention['tone'], { bg: string; fg: string }> = {
  review: { bg: 'var(--color-status-review-bg)', fg: 'var(--color-status-review-fg)' },
  pending: { bg: 'var(--color-status-pending-bg)', fg: 'var(--color-status-pending-fg)' },
  blocked: { bg: 'var(--color-status-blocked-bg)', fg: 'var(--color-status-blocked-fg)' },
};

/**
 * Screen 5 — the Finance dashboard, and the screen that makes the argument:
 *
 *   "Coded Apps aren't only forms that start automations.
 *    They can be the operational interface around automation."
 *
 * That is a claim about the app being real, so the numbers have to be real.
 * Every tile is a `COUNT` / `SUM` / `MAX` that Data Fabric computed over every
 * row in the company — not a `.reduce()` over whatever happened to be loaded,
 * which is right on twelve rows and quietly wrong on a hundred and forty-four.
 */
export function FinancePage() {
  const { snapshot, isLoading, error, errorCause, refresh } = useFinance();
  const navigate = useNavigate();

  const attention = (snapshot?.unsettled ?? [])
    .map(attentionFor)
    .filter((item): item is Attention => item !== null);
  const pagination = usePagination(attention);

  if (error !== null) {
    return <ErrorState message={error} error={errorCause} onRetry={() => void refresh()} />;
  }

  const summary = snapshot?.summary;

  return (
    <div className="content-stack">
      <div className="welcome-row">
        <div>
          <h2 className="page-title">ExpenseFlow — Finance</h2>
          <p className="page-subtitle">
            Every employee, every expense, one view — counted by Data Fabric, not by this page.
          </p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() => void refresh()}
          disabled={isLoading}
        >
          <RefreshCw size={14} aria-hidden className={isLoading ? 'spin' : undefined} />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading || summary === undefined ? (
        <LoadingSkeleton count={3} variant="cards" />
      ) : (
        <div className="stats-grid">
          <StatCard
            label="Expenses"
            value={formatNumber(summary.submitted.count)}
            helper={`${formatCurrency(summary.submitted.total)} submitted across the company`}
          />
          <StatCard
            label="Pending"
            value={formatNumber(summary.pending.count)}
            helper={`${formatCurrency(summary.pending.total)} in flight`}
          />
          <StatCard
            label="This month"
            value={formatCurrencyCompact(summary.monthTotal.total)}
            helper={
              summary.month === null
                ? 'no data yet'
                : `${formatNumber(summary.monthTotal.count)} expenses in ${formatMonth(summary.month)}`
            }
          />
        </div>
      )}

      <section className="panel">
        <div className="panel-header">
          <div className="panel-heading">
            <div className="panel-kicker">NEEDS ATTENTION</div>
            <h2>Blocked or waiting</h2>
          </div>
          <span className="table-count">
            {isLoading ? '…' : `${formatNumber(attention.length)} records`}
          </span>
        </div>

        {isLoading ? (
          <div className="panel-body">
            <LoadingSkeleton count={4} />
          </div>
        ) : attention.length === 0 ? (
          <div className="panel-body">
            <EmptyState
              title="Nothing needs attention"
              message="No policy reviews, no open approvals, no missing receipts."
            />
          </div>
        ) : (
          <>
            {/* Critical Rule 12: the table scrolls inside its own box, never the page. */}
            <div className="overflow-guard">
              <table className="expense-table" aria-label="Expenses that need attention">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Expense</th>
                    <th className="align-right">Amount</th>
                    <th>Waiting on</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.visible.map(({ expense, reason, tone }) => (
                    <tr
                      key={expense.id}
                      className="row-link"
                      tabIndex={0}
                      role="link"
                      onClick={() => void navigate(`/expenses/${expense.expenseCode}`)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          void navigate(`/expenses/${expense.expenseCode}`);
                        }
                      }}
                    >
                      <td>
                        <div className="expense-title truncate" title={expense.employee}>
                          {expense.employee}
                        </div>
                        <div className="expense-id">{expense.expenseCode}</div>
                      </td>
                      <td className="truncate" title={expense.description}>
                        {expense.description}
                      </td>
                      <td className="amount align-right">{formatCurrency(expense.amount)}</td>
                      <td>
                        <span
                          className="status-pill"
                          style={{ background: TONE_TOKENS[tone].bg, color: TONE_TOKENS[tone].fg }}
                        >
                          {reason}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePager pagination={pagination} />
          </>
        )}
      </section>
    </div>
  );
}
