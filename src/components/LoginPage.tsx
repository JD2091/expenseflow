import { Loader2, LogIn, TriangleAlert } from 'lucide-react';

interface LoginPageProps {
  /** True while `useAuth` is checking for an OAuth callback or an existing session. */
  isLoading: boolean;
  /** Set when the last sign-in attempt failed; already translated by `describeError`. */
  error: string | null;
  org: string;
  tenant: string;
  onSignIn: () => void;
}

/**
 * The dedicated sign-in screen, shown by `<UiPathRuntime>` before the router
 * mounts — see runtime.tsx for why this can't be a react-router route. Unlike
 * the old behaviour, it does NOT redirect on its own; the user has to click.
 */
export function LoginPage({ isLoading, error, org, tenant, onSignIn }: LoginPageProps) {
  return (
    <div className="boot-screen">
      <div className="state-block login-card">
        <div className="login-mark">E</div>
        <div className="login-name">ExpenseFlow</div>

        {isLoading ? (
          <>
            <div className="state-icon">
              <Loader2 size={20} aria-hidden className="spin" />
            </div>
            <p className="state-message">Checking your session…</p>
          </>
        ) : (
          <>
            {error !== null && (
              <div className="login-error">
                <div className="state-icon is-error">
                  <TriangleAlert size={20} aria-hidden />
                </div>
                <p className="state-message">{error}</p>
              </div>
            )}
            {error === null && (
              <p className="state-message">
                Sign in with your {org} / {tenant} UiPath account to continue.
              </p>
            )}
            <div className="state-action">
              <button type="button" className="primary-button" onClick={onSignIn}>
                <LogIn size={18} aria-hidden />
                {error !== null ? 'Try again' : 'Sign in with UiPath'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
