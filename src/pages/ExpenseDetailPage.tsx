import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency, formatDate, formatTimestamp } from '../lib/format';
import { StatusPill } from '../components/StatusPill';
import { ReceiptLink } from '../components/ReceiptLink';
import { StatusStepper } from '../components/StatusStepper';
import { ErrorState } from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

/**
 * Screen 3 — the screen the spec says "becomes useful on Day 2".
 *
 * It is reachable by clicking any table row, and the URL carries the human
 * expense code (`/expenses/EXP-1007`) so the presenter can type it live.
 */
export function ExpenseDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { expenses, policyThreshold, isLoading, error, errorCause, refresh } = useExpenses();
  const navigate = useNavigate();

  const expense = expenses.find(
    (item) => item.expenseCode.toLowerCase() === (code ?? '').toLowerCase(),
  );

  if (error) {
    return <ErrorState message={error} error={errorCause} onRetry={() => void refresh()} />;
  }

  if (isLoading) {
    return (
      <section className="panel">
        <div className="panel-body">
          <LoadingSkeleton count={5} variant="block" />
        </div>
      </section>
    );
  }

  if (!expense) {
    return (
      <ErrorState
        title="Expense not found"
        message={`No expense with the code ${code ?? ''} exists.`}
        onRetry={() => void navigate('/expenses')}
        retryLabel="Back to my expenses"
      />
    );
  }

  const aboveThreshold = policyThreshold !== null && expense.amount > policyThreshold;

  return (
    <div className="content-stack">
      <Link className="back-link" to="/expenses">
        <ArrowLeft size={15} aria-hidden />
        <span>Back to my expenses</span>
      </Link>

      <section className="panel">
        <div className="panel-header">
          <div className="panel-heading">
            <div className="panel-kicker">EXPENSE {expense.expenseCode}</div>
            <h2 className="truncate" title={expense.description}>
              {expense.description}
            </h2>
          </div>
          <StatusPill status={expense.status} />
        </div>

        <div className="panel-body detail-body">
          <dl className="detail-grid">
            <div className="detail-row">
              <dt>Amount</dt>
              <dd className="amount">{formatCurrency(expense.amount)}</dd>
            </div>
            <div className="detail-row">
              <dt>Category</dt>
              <dd>{expense.category}</dd>
            </div>
            <div className="detail-row">
              <dt>Date</dt>
              <dd>{formatDate(expense.expenseDate)}</dd>
            </div>
            <div className="detail-row">
              <dt>Employee</dt>
              <dd className="truncate">{expense.employee}</dd>
            </div>
            <div className="detail-row">
              <dt>Receipt</dt>
              <dd>
                <ReceiptLink expense={expense} />
              </dd>
            </div>
            <div className="detail-row">
              <dt>Policy</dt>
              {/*
                The DECISION that was recorded, when there is one — not a fresh
                comparison against today's threshold. The Asset can change after
                a row is written, and re-judging an old row against the new
                value makes the screen contradict itself: "Above the ₹5,000
                threshold" sitting next to "Auto-approved under policy
                threshold". Seeded rows carry no note, so they fall back to the
                live comparison.
              */}
              <dd>
                {expense.policyNote
                  ? expense.policyNote
                  : policyThreshold === null
                    ? 'Reading the policy threshold…'
                    : aboveThreshold
                      ? `Above the ${formatCurrency(policyThreshold)} threshold`
                      : `Within the ${formatCurrency(policyThreshold)} threshold`}
              </dd>
            </div>
          </dl>

          <div className="detail-status">
            <h3 className="detail-heading">Status</h3>
            <StatusStepper status={expense.status} />

            <ul className="detail-timeline">
              {expense.submittedAt ? (
                <li>
                  <span className="muted-text">Submitted</span>
                  <span>{formatTimestamp(expense.submittedAt)}</span>
                </li>
              ) : null}
              {expense.decidedAt ? (
                <li>
                  <span className="muted-text">Decided</span>
                  <span>
                    {formatTimestamp(expense.decidedAt)}
                    {expense.decidedBy ? ` · ${expense.decidedBy}` : ''}
                  </span>
                </li>
              ) : null}
            </ul>

            {expense.comments ? (
              <p className="detail-note">
                <strong>Comments:</strong> {expense.comments}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
