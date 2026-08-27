import { Link } from 'react-router-dom';

import { useExpenses } from '../hooks/useExpenses';
import { CURRENT_USER, RECENT_LIMIT } from '../lib/constants';
import { formatCurrency } from '../lib/format';
import { StatCard } from '../components/StatCard';
import { ExpenseTable } from '../components/ExpenseTable';
import { ErrorState } from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function expenseCount(count: number): string {
  return `${count} ${count === 1 ? 'expense' : 'expenses'}`;
}

/**
 * Screen 1 — the Day-1 hero screen.
 *
 * Every number on it is derived from `useExpenses().totals`. Nothing here is a
 * literal, which is why submitting an expense moves the amount AND the
 * "N expenses" helper in the same render.
 */
export function DashboardPage() {
  const { mine, totals, isLoading, error, errorCause, refresh } = useExpenses();

  const recent = [...mine]
    .sort((a, b) => b.expenseDate.localeCompare(a.expenseDate))
    .slice(0, RECENT_LIMIT);

  return (
    <div className="content-stack">
      <div className="welcome-row">
        <div>
          <h2 className="page-title">
            {greeting()}, {CURRENT_USER.split(' ')[0]} 👋
          </h2>
          <p className="page-subtitle">Here is your expense snapshot for August.</p>
        </div>
        <Link className="primary-button" to="/expenses/new">
          + New Expense
        </Link>
      </div>

      {error ? (
        <ErrorState message={error} error={errorCause} onRetry={() => void refresh()} />
      ) : (
        <>
          {isLoading ? (
            <LoadingSkeleton count={3} variant="cards" />
          ) : (
            <div className="stats-grid">
              <StatCard
                label="Submitted"
                value={formatCurrency(totals.submitted.amount)}
                helper={expenseCount(totals.submitted.count)}
              />
              <StatCard
                label="Approved"
                value={formatCurrency(totals.approved.amount)}
                helper={expenseCount(totals.approved.count)}
                tone="positive"
              />
              <StatCard
                label="Pending"
                value={formatCurrency(totals.pending.amount)}
                helper={expenseCount(totals.pending.count)}
              />
            </div>
          )}

          <ExpenseTable
            expenses={recent}
            isLoading={isLoading}
            kicker="RECENT ACTIVITY"
            title="Recent Expenses"
            headerAction={
              <Link className="link-button" to="/expenses">
                View all
              </Link>
            }
            emptyTitle="Nothing submitted yet"
            emptyMessage="Your expenses will show up here the moment you submit one."
            emptyAction={
              <Link className="primary-button" to="/expenses/new">
                + New Expense
              </Link>
            }
          />
        </>
      )}
    </div>
  );
}
