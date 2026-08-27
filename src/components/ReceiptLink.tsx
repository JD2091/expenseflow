import { useState } from 'react';
import { ExternalLink, Loader2, Paperclip } from 'lucide-react';

import { getReceiptUrl } from '../services/expenseService';
import type { Expense } from '../models/expense';

/**
 * The receipt chip, and — when there is a file behind it — a way to open it.
 *
 *   >>> THE URL IS FETCHED ON CLICK, NOT ON RENDER. <<<
 *
 * `Buckets.getReadUri` mints a short-lived pre-signed URL. Two consequences
 * shape this component:
 *
 *   1. it EXPIRES. A URL fetched when the table rendered is stale by the time
 *      anybody clicks it, so an `<a href>` prepared in advance would work in
 *      testing and 403 during the demo;
 *   2. it COSTS a round trip. Fetching one per row on render means fifteen
 *      Orchestrator calls to draw a page where the user opens at most one.
 *
 * So the chip is a button that fetches, then opens. The window is opened with
 * `noopener` — a pre-signed blob URL is somebody else's origin.
 */
export function ReceiptLink({ expense }: { expense: Expense }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (expense.receiptName === null) {
    return <span className="muted-text">No receipt attached</span>;
  }

  // A Day-1 mock row has a filename and no bucket path. Showing the chip
  // without the affordance is the honest rendering: there is a receipt, and
  // there is nothing to open.
  if (expense.receiptPath === undefined) {
    return (
      <span className="receipt-chip">
        <Paperclip size={13} aria-hidden />
        <span className="truncate" title={expense.receiptName}>
          {expense.receiptName}
        </span>
      </span>
    );
  }

  async function open() {
    setBusy(true);
    setError(null);
    try {
      const url = await getReceiptUrl(expense.receiptPath ?? '');
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The receipt could not be opened.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="receipt-chip is-interactive"
        onClick={() => void open()}
        disabled={busy}
        title={`Open ${expense.receiptName} from the ExpenseFlow_Receipts bucket`}
      >
        {busy ? (
          <Loader2 size={13} aria-hidden className="spin" />
        ) : (
          <Paperclip size={13} aria-hidden />
        )}
        <span className="truncate">{expense.receiptName}</span>
        <ExternalLink size={12} aria-hidden />
      </button>
      {error === null ? null : (
        <span className="field-hint is-error" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
