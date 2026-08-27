import { RefreshCw, TriangleAlert } from 'lucide-react';

import { recoveryFor } from '../services/uipath/errors';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  /**
   * The error itself, when the caller has it.
   *
   * Passing it lets this component draw the RIGHT affordance rather than
   * always a Retry button: an expired session gets "Sign in again", a 403 gets
   * nothing at all. `message` stays required so a caller with only a string
   * still works — every screen had one of those on Day 1.
   */
  error?: unknown;
}

/**
 * Every failed call ends up here, and none of them arrive raw.
 *
 * `services/uipath/errors.ts` has already turned the `UiPathError` into one
 * sentence naming the likely cause and a `recovery` naming what the user can
 * do about it. This component's whole job is to render both — because a
 * message that says "try again" with no button to press is only half a
 * translation, and a Retry button on an expired session is worse than none: it
 * invites the user to fail three more times.
 */
export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  error,
}: ErrorStateProps) {
  const recovery = error === undefined ? 'retry' : recoveryFor(error);
  const showRetry = onRetry !== undefined && recovery === 'retry';
  const showSignIn = recovery === 'signIn';

  return (
    <div className="state-block is-error" role="alert">
      <div className="state-icon is-error">
        <TriangleAlert size={20} aria-hidden />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-message">{message}</p>

      {showRetry || showSignIn ? (
        <div className="state-action">
          {showSignIn ? (
            // A reload restarts the OAuth handshake `<UiPathRuntime>` owns —
            // which is the only way back from an expired refresh token, and a
            // shorter path than explaining one to the user.
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                window.location.reload();
              }}
            >
              Sign in again
            </button>
          ) : (
            <button type="button" className="secondary-button" onClick={onRetry}>
              <RefreshCw size={14} aria-hidden />
              <span>{retryLabel}</span>
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
