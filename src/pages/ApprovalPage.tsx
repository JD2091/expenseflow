import { useState } from 'react';
import { Check, Loader2, RotateCcw, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useExpenses } from '../hooks/useExpenses';
import { useToasts } from '../hooks/useToasts';
import type { Expense } from '../models/expense';
import { needsDecision } from '../models/status';
import type { ApprovalAction } from '../services/uipath/approvals';
import { CURRENT_MANAGER } from '../lib/constants';
import { statusLabel } from '../models/status';
import { formatCurrency, formatDate } from '../lib/format';
import { StatusPill } from '../components/StatusPill';
import { ReceiptLink } from '../components/ReceiptLink';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

/** Label, style and icon for each of the three things a manager can do. */
const ACTIONS: ReadonlyArray<{
  action: ApprovalAction;
  label: string;
  className: string;
  icon: typeof Check;
}> = [
  { action: 'Reject', label: 'Reject', className: 'danger-button', icon: X },
  { action: 'Rework', label: 'Request rework', className: 'secondary-button', icon: RotateCcw },
  { action: 'Approve', label: 'Approve', className: 'primary-button', icon: Check },
];

/**
 * Screen 4 — Manager Approval, now with a real task behind every button.
 *
 * Day 1 shipped this screen with the layout, the queue and the buttons all
 * real, and a decision that moved local state and nothing else. Day 2 changed
 * one function call. The screen is the same screen — that IS the demo ("we
 * don't rebuild anything", Event Structure.md) — but pressing Approve now:
 *
 *   1. completes the Action Center task the submit created,
 *   2. writes Status / DecidedAt / DecidedBy / Comments to the Data Fabric
 *      record,
 *   3. refreshes.
 *
 * In that order, always. See `expenseService.decideExpense` for why the order
 * is the interesting part.
 */
export function ApprovalPage() {
  const { expenses, policyThreshold, isLoading, error, errorCause, refresh, decide } =
    useExpenses();
  const { push } = useToasts();

  // Per-card state, keyed by record id. A busy Approve on one card must not
  // disable the other cards, and one card's failure is not the page's failure.
  const [comments, setComments] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<Record<string, ApprovalAction>>({});
  const [failures, setFailures] = useState<Record<string, string>>({});

  if (error) {
    return <ErrorState message={error} error={errorCause} onRetry={() => void refresh()} />;
  }

  const queue = expenses
    .filter((expense) => needsDecision(expense.status))
    .sort((a, b) => b.amount - a.amount);

  async function onDecide(expense: Expense, action: ApprovalAction) {
    setBusy((current) => ({ ...current, [expense.id]: action }));
    setFailures((current) => {
      const next = { ...current };
      delete next[expense.id];
      return next;
    });

    try {
      const decided = await decide(expense, { action, comments: comments[expense.id] ?? '' });
      push('success', `${expense.expenseCode} is now ${statusLabel(decided.status)}.`);
      // The row leaves the queue on refresh, so its comment draft goes with it.
      setComments((current) => {
        const next = { ...current };
        delete next[expense.id];
        return next;
      });
    } catch (cause) {
      // Never a raw error, and never a lost draft: the typed comment is still
      // in state and the buttons come back enabled in `finally`.
      const message =
        cause instanceof Error ? cause.message : 'The decision could not be recorded.';
      setFailures((current) => ({ ...current, [expense.id]: message }));
      // Both: the toast catches the eye, the inline message stays put next to
      // the card it belongs to. A toast alone is a notification, not a state.
      push('error', message);
    } finally {
      setBusy((current) => {
        const next = { ...current };
        delete next[expense.id];
        return next;
      });
    }
  }

  return (
    <div className="content-stack">
      <div className="welcome-row">
        <div>
          <h2 className="page-title">Approval queue</h2>
          <p className="page-subtitle">
            {queue.length} expense{queue.length === 1 ? '' : 's'} waiting on {CURRENT_MANAGER}.
          </p>
        </div>
      </div>

      <div className="callout">
        Every card below is an <strong>Action Center task</strong>. Approve, Reject and Request
        rework complete that task first and write the decision to the Data Fabric record second —
        so if UiPath says no, the record stays untouched and this screen says so.
      </div>

      {isLoading ? (
        <section className="panel">
          <div className="panel-body">
            <LoadingSkeleton count={3} variant="block" />
          </div>
        </section>
      ) : queue.length === 0 ? (
        <section className="panel">
          <div className="panel-body">
            <EmptyState
              title="Nothing to approve"
              message="Every submitted expense has already been decided."
            />
          </div>
        </section>
      ) : (
        <div className="approval-grid">
          {queue.map((expense) => {
            const aboveThreshold = policyThreshold !== null && expense.amount > policyThreshold;
            const running = busy[expense.id];
            const failure = failures[expense.id];
            const commentId = `comments-${expense.id}`;

            return (
              <section key={expense.id} className="panel approval-card">
                <div className="panel-header">
                  <div className="panel-heading">
                    <div className="panel-kicker">{expense.expenseCode}</div>
                    <h2 className="truncate" title={expense.employee}>
                      {expense.employee}
                    </h2>
                  </div>
                  <StatusPill status={expense.status} />
                </div>

                <div className="panel-body">
                  <p className="approval-description truncate" title={expense.description}>
                    {expense.description}
                  </p>

                  <dl className="detail-grid">
                    <div className="detail-row">
                      <dt>Amount</dt>
                      <dd className={`amount ${aboveThreshold ? 'is-flagged' : ''}`}>
                        {formatCurrency(expense.amount)}
                      </dd>
                    </div>
                    <div className="detail-row">
                      <dt>Policy threshold</dt>
                      <dd>{policyThreshold === null ? '—' : formatCurrency(policyThreshold)}</dd>
                    </div>
                    <div className="detail-row">
                      <dt>Date</dt>
                      <dd>{formatDate(expense.expenseDate)}</dd>
                    </div>
                    <div className="detail-row">
                      <dt>Receipt</dt>
                      <dd>
                        {/*
                          A manager should not have to approve 37,550 rupees on
                          faith. The chip opens the actual file out of the
                          ExpenseFlow_Receipts bucket, in a new tab, without
                          leaving the queue.
                        */}
                        <ReceiptLink expense={expense} />
                      </dd>
                    </div>
                    <div className="detail-row">
                      <dt>Action Center</dt>
                      {/*
                        Stated rather than hidden. A seeded row predates the app
                        and has no task, so its decision is Data Fabric only —
                        which is honest, and worth being able to point at when
                        somebody asks why the Action Center inbox and this queue
                        are not the same length.
                      */}
                      <dd>
                        {expense.approvalTaskId ? (
                          <span className="mono-text">Task #{expense.approvalTaskId}</span>
                        ) : (
                          <span className="muted-text">No task — decided in Data Fabric only</span>
                        )}
                      </dd>
                    </div>
                  </dl>

                  {expense.policyNote ? <p className="detail-note">{expense.policyNote}</p> : null}

                  <div className="field">
                    <label className="field-label" htmlFor={commentId}>
                      Comments
                    </label>
                    <textarea
                      id={commentId}
                      className="comment-box"
                      rows={2}
                      value={comments[expense.id] ?? ''}
                      onChange={(event) =>
                        setComments((current) => ({
                          ...current,
                          [expense.id]: event.target.value,
                        }))
                      }
                      placeholder="Optional — sent to Action Center and stored on the record."
                      disabled={running !== undefined}
                    />
                  </div>

                  {failure ? (
                    <div className="form-message is-error" role="alert">
                      {failure}
                    </div>
                  ) : null}

                  <div className="approval-actions">
                    <Link className="link-button" to={`/expenses/${expense.expenseCode}`}>
                      Open expense
                    </Link>
                    <div className="button-row">
                      {ACTIONS.map(({ action, label, className, icon: Icon }) => (
                        <button
                          key={action}
                          type="button"
                          className={className}
                          disabled={running !== undefined}
                          onClick={() => void onDecide(expense, action)}
                        >
                          {running === action ? (
                            <Loader2 size={14} aria-hidden className="spin" />
                          ) : (
                            <Icon size={14} aria-hidden />
                          )}
                          <span>{running === action ? 'Working…' : label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
