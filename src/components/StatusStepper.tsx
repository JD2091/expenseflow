import type { ExpenseStatus } from '../models/expense';
import { APPROVAL_STEPS, statusProgress } from '../models/status';

/**
 * Screen 3's four-step tracker.
 *
 *   ✓ done      ● current      ○ future
 *
 * Day 1 renders it from the mock status. Day 2 renders it from the real Data
 * Fabric record and the Action Center task — same component, same three glyphs,
 * different source. That is the point of building it now.
 */
export function StatusStepper({ status }: { status: ExpenseStatus }) {
  const progress = statusProgress(status);

  return (
    <div className="stepper">
      <ol className="stepper-list">
        {APPROVAL_STEPS.map((step, index) => {
          const isDone = index < progress.completed;
          const isCurrent = index === progress.current;
          const state = isDone ? 'is-done' : isCurrent ? 'is-current' : 'is-future';
          const glyph = isDone ? '✓' : isCurrent ? '●' : '○';

          return (
            <li key={step} className={`stepper-step ${state}`}>
              <span className="stepper-glyph" aria-hidden>
                {glyph}
              </span>
              <span className="stepper-label truncate" title={step}>
                {step}
              </span>
            </li>
          );
        })}
      </ol>
      {progress.note ? <p className="stepper-note">{progress.note}</p> : null}
    </div>
  );
}
