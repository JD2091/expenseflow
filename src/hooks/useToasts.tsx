/* ============================================================================
 * ExpenseFlow — toasts
 * ----------------------------------------------------------------------------
 * A submit succeeds on `/expenses/new` and the row appears on `/expenses`. A
 * decision succeeds on `/approvals` and the card leaves the queue. In both
 * cases the RESULT is visible, and the ACT is not — so the user is left to
 * infer that the button worked from the fact that something moved.
 *
 * Toasts say it out loud, once, and get out of the way.
 *
 * Two rules they follow, both of which most toast implementations get wrong:
 *
 *   1. A FAILURE TOAST DOES NOT DISAPPEAR ON ITS OWN. A success can vanish
 *      after four seconds because there is nothing left to do about it. An
 *      error the user did not finish reading is an error they will hit again.
 *   2. THEY ARE NOT THE ONLY REPORT OF A FAILURE. The form still shows its
 *      inline message; the approval card still shows its own. A toast that
 *      scrolls past is not an error state — it is a notification about one.
 * ========================================================================== */

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type ToastTone = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

export interface UseToasts {
  toasts: Toast[];
  /** Show one. Returns its id, so a caller can dismiss it early if it wants. */
  push: (tone: ToastTone, message: string) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<UseToasts | undefined>(undefined);

/** How long a self-dismissing toast lives. Errors ignore this entirely. */
const AUTO_DISMISS_MS = 4500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, message: string) => {
      const id = nextId.current;
      nextId.current += 1;

      setToasts((current) => [...current, { id, tone, message }]);

      // Rule 1: an error stays until it is dismissed. There is nothing to be
      // gained from hiding the one message that says what to do next.
      if (tone !== 'error') {
        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
        }, AUTO_DISMISS_MS);
      }

      return id;
    },
    [],
  );

  const value = useMemo<UseToasts>(() => ({ toasts, push, dismiss }), [toasts, push, dismiss]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToasts(): UseToasts {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToasts must be used within a ToastProvider');
  }
  return context;
}
