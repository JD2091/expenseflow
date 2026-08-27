import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Paperclip } from 'lucide-react';

import { EXPENSE_CATEGORIES } from '../models/expense';
import type { Expense, ExpenseCategory, NewExpenseInput } from '../models/expense';
import { useExpenses } from '../hooks/useExpenses';
import { useToasts } from '../hooks/useToasts';
import { statusLabel } from '../models/status';
import { formatCurrency, todayIso } from '../lib/format';

interface NewExpenseFormProps {
  onSubmit: (input: NewExpenseInput) => Promise<Expense>;
  onCancel: () => void;
}

/**
 * Screen 2, laid out as the spec draws it: Description on its own row, then
 * Category + Amount, then Date + Receipt, then Cancel + Submit.
 *
 * Three starter defects are fixed here:
 *   §4.12  the receipt filename was captured and then dropped on the floor;
 *          it now travels to the service. Day 2 carries the `File` itself as
 *          well, because there is finally somewhere to put the bytes.
 *   §4.16  the layout was a single column and there was no Cancel button.
 *   —      `error` and `success` were ONE string rendered in info-blue, so a
 *          validation failure looked like a confirmation. They are now two
 *          pieces of state with two different styles.
 *
 * The date defaults to today rather than to the hardcoded '2026-08-19' the
 * starter shipped, which would have been visibly wrong at the event.
 */
export function NewExpenseForm({ onSubmit, onCancel }: NewExpenseFormProps) {
  // Day 2: the ceiling comes from an Orchestrator Asset, so it can be `null`
  // for the moment before it arrives.
  const { policyThreshold, policyThresholdError } = useExpenses();
  const { push } = useToasts();

  // One id prefix per mounted form, so every `<label for>` points at exactly
  // one input even if two forms ever share a page.
  const fieldId = useId();

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Travel');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(todayIso());
  // Day 2 keeps the FILE, not just its name: `expenseService` uploads it to
  // the ExpenseFlow_Receipts bucket before inserting the record.
  const [receipt, setReceipt] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Expense | null>(null);

  const numericAmount = Number(amount);
  const aboveThreshold =
    policyThreshold !== null && Number.isFinite(numericAmount) && numericAmount > policyThreshold;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCreated(null);

    if (!description.trim()) {
      setError('Give the expense a description so your manager knows what it is.');
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Enter an amount greater than ₹0.');
      return;
    }
    if (!expenseDate) {
      setError('Pick the date the expense was incurred.');
      return;
    }

    try {
      setSaving(true);
      const expense = await onSubmit({
        description: description.trim(),
        category,
        amount: numericAmount,
        expenseDate,
        receiptName: receipt?.name ?? null,
        receiptFile: receipt,
      });
      setCreated(expense);
      push(
        'success',
        `${expense.expenseCode} submitted for ${formatCurrency(expense.amount)} — ${statusLabel(expense.status)}.`,
      );

      // Cleared ONLY here, on the success path. See the catch below.
      setDescription('');
      setAmount('');
      setReceipt(null);
      setExpenseDate(todayIso());
    } catch (cause) {
      /*
       * >>> THE FORM KEEPS EVERY FIELD. <<<
       *
       * Nothing is reset here, deliberately. Wiping a form on failure means
       * the user retypes a description, re-picks a category and re-attaches a
       * receipt to try again — in front of an audience, at the exact moment
       * the app already looks broken. The data the user typed is the one thing
       * an error must not cost them.
       *
       * The button re-enables in `finally`, so the retry is one click.
       */
      const message = cause instanceof Error ? cause.message : 'Could not save the expense.';
      setError(message);
      push('error', message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel form-panel">
      <div className="panel-header">
        <div className="panel-heading">
          <div className="panel-kicker">SUBMIT EXPENSE</div>
          <h2>New expense</h2>
        </div>
      </div>

      <form className="expense-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor={`${fieldId}-description`}>
            Description
          </label>
          <input
            id={`${fieldId}-description`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. Mumbai customer dinner"
            autoComplete="off"
          />
        </div>

        <div className="form-grid">
          <div className="field">
            <label className="field-label" htmlFor={`${fieldId}-category`}>
              Category
            </label>
            <select
              id={`${fieldId}-category`}
              value={category}
              onChange={(event) => setCategory(event.target.value as ExpenseCategory)}
            >
              {EXPENSE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field-label" htmlFor={`${fieldId}-amount`}>
              Amount
            </label>
            <input
              id={`${fieldId}-amount`}
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="4800"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label className="field-label" htmlFor={`${fieldId}-date`}>
              Date
            </label>
            <input
              id={`${fieldId}-date`}
              type="date"
              value={expenseDate}
              onChange={(event) => setExpenseDate(event.target.value)}
            />
          </div>

          <div className="field">
            {/*
              The visible label wraps the control here rather than pointing at
              it by id: a file input is visually hidden and the whole chip is
              the click target, so the wrapping <label> IS the affordance. The
              hint is tied on with aria-describedby so it is announced too.
            */}
            <label className="field-label" htmlFor={`${fieldId}-receipt`}>
              Receipt
            </label>
            <label className="file-field">
              <Paperclip size={15} aria-hidden />
              <span className="truncate">{receipt?.name ?? 'Upload receipt'}</span>
              <input
                id={`${fieldId}-receipt`}
                type="file"
                accept="image/*,.pdf"
                aria-describedby={`${fieldId}-receipt-hint`}
                onChange={(event) => setReceipt(event.target.files?.[0] ?? null)}
              />
            </label>
            <small className="field-hint" id={`${fieldId}-receipt-hint`}>
              Uploaded to the ExpenseFlow_Receipts storage bucket on submit.
            </small>
          </div>
        </div>

        {aboveThreshold && policyThreshold !== null ? (
          <div className="form-message is-info">
            Above the {formatCurrency(policyThreshold)} policy threshold — this one routes to your
            manager for approval.
          </div>
        ) : null}

        {/*
          The hint above is the only thing that tells an employee their expense
          is about to need a manager. If the Asset could not be read, saying so
          is better than showing nothing and letting them assume it will sail
          through. The submit still works: it reads the threshold live and
          decides correctly either way.
        */}
        {policyThresholdError !== null ? (
          <div className="form-message is-info">
            ExpenseFlow could not read the policy threshold from Orchestrator, so it cannot warn
            you in advance whether this expense needs approval. Submitting still applies the
            policy. ({policyThresholdError})
          </div>
        ) : null}

        {error ? (
          <div className="form-message is-error" role="alert">
            {error}
          </div>
        ) : null}

        {created ? (
          <div className="form-message is-success" role="status">
            {created.expenseCode} submitted for {formatCurrency(created.amount)}.{' '}
            <Link to="/">See it on your dashboard</Link> or{' '}
            <Link to={`/expenses/${created.expenseCode}`}>open the expense</Link>.
          </div>
        ) : null}

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="primary-button" disabled={saving} type="submit">
            {saving ? <Loader2 size={15} aria-hidden className="spin" /> : null}
            <span>{saving ? 'Submitting…' : 'Submit Expense'}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
