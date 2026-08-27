import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

import { useToasts } from '../hooks/useToasts';
import type { ToastTone } from '../hooks/useToasts';

const ICONS: Record<ToastTone, typeof Info> = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
};

/**
 * The live region every toast is announced through.
 *
 * `aria-live="polite"` rather than `assertive`: a screen reader should finish
 * the sentence it is on before saying "EXP-1007 submitted". `role="status"`
 * on the wrapper gives the same semantics to older assistive technology.
 *
 * The region is rendered ALWAYS, even when empty. A live region that is added
 * to the DOM at the same moment as its first message is frequently not
 * announced at all — the assistive technology has to be watching the node
 * before the text arrives.
 */
export function ToastRegion() {
  const { toasts, dismiss } = useToasts();

  return (
    <div className="toast-region" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map(({ id, tone, message }) => {
        const Icon = ICONS[tone];
        return (
          <div key={id} className={`toast is-${tone}`}>
            <Icon size={16} aria-hidden className="toast-icon" />
            <p className="toast-message">{message}</p>
            <button
              type="button"
              className="icon-button toast-dismiss"
              onClick={() => dismiss(id)}
              aria-label="Dismiss notification"
            >
              <X size={14} aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
