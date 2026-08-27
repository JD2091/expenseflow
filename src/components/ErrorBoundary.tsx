import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * The last line of defence, wrapped around the router.
 *
 *   >>> A `try`/`catch` IN A SERVICE CANNOT CATCH A RENDER. <<<
 *
 * Every UiPath call in this app is already translated by
 * `services/uipath/errors.ts`, and every screen has a loading, an empty and an
 * error state. None of that helps if a COMPONENT throws while rendering — a
 * mapper handed an unexpected shape, a `.map` on something that turned out to
 * be `undefined`. React's answer to an uncaught render error is to unmount the
 * whole tree, and what the audience sees is a blank white page with the app
 * gone and no way back.
 *
 * That is the single worst thing that can happen on a projector, and an error
 * boundary is the only construct that prevents it. It has to be a class: React
 * exposes `componentDidCatch` and `getDerivedStateFromError` to classes only,
 * and there is still no hook equivalent.
 *
 * It sits OUTSIDE `<RouterProvider>` rather than inside a route, because a
 * throw during routing itself would otherwise escape it.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // The screen gets one sentence; the console gets the component stack, which
    // is the part that actually locates the bug during a live session.
    console.error('[expenseflow] a render threw and the error boundary caught it', error, info);
  }

  render(): ReactNode {
    const { error } = this.state;
    if (error === null) return this.props.children;

    return (
      <div className="boot-screen">
        <div className="state-block is-error" role="alert">
          <div className="state-icon is-error">
            <TriangleAlert size={20} aria-hidden />
          </div>
          <h3 className="state-title">ExpenseFlow hit an unexpected problem</h3>
          <p className="state-message">
            The screen could not be drawn, so nothing was changed. Reloading usually clears it —
            your data is in UiPath, not in this page.
          </p>
          {/*
            The raw message, deliberately. This boundary only ever fires on a
            BUG, not on a handled failure, and the one thing a presenter needs
            in that moment is the sentence to search for. Every path a user can
            reach normally is translated long before it gets here.
          */}
          <p className="state-detail mono-text">{error.message}</p>
          <div className="state-action">
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload ExpenseFlow
            </button>
          </div>
        </div>
      </div>
    );
  }
}
