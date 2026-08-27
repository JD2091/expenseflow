/* ============================================================================
 * ExpenseFlow — the UiPath runtime gate
 * ----------------------------------------------------------------------------
 * Day 1's `expenseService` needed nothing but an array. Day 2's needs an
 * authenticated `UiPath` instance — and that instance comes from `useAuth()`,
 * which is a React hook, while `listExpenses()` is a plain async function with
 * a signature we promised not to change.
 *
 * This component is the join, and it is the only React in `services/`:
 *
 *   1. build the SDK services ONCE, with constructor DI, in a `useMemo`
 *      (gotchas 11, 12, 13) and register them for the service layer;
 *   2. sign the user in if they are not already;
 *   3. warm the entity schema and both choice-set maps before any screen
 *      renders, so `mappers.ts` can translate synchronously;
 *   4. only then render the app.
 *
 * In mock mode it does none of that and renders straight through — that is
 * what makes `?mock=1` a real fallback rather than a slower way to fail.
 * ========================================================================== */

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Loader2, PlugZap, TriangleAlert } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { USE_MOCK } from '../expenseService.mock';
import { createClients, registerClients } from './client';
import { UIPATH } from './config';
import { describeError } from './errors';
import { warmUp } from './entityClient';

type Phase = 'signing-in' | 'connecting' | 'ready' | 'failed';

function Splash({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="boot-screen">
      <div className="state-block is-error">
        <div className="state-icon">{icon}</div>
        <h3 className="state-title">{title}</h3>
        <p className="state-message">{message}</p>
        {action ? <div className="state-action">{action}</div> : null}
      </div>
    </div>
  );
}

export function UiPathRuntime({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, sdk, login, error: authError } = useAuth();

  // ONE set of services per SDK instance. Rebuilding them every render throws
  // away the SDK's own request caching for no reason.
  const clients = useMemo(() => createClients(sdk), [sdk]);

  // Mock mode never connects to anything, so it starts ready rather than
  // being flipped there by an effect.
  const [phase, setPhase] = useState<Phase>(() => (USE_MOCK ? 'ready' : 'signing-in'));
  const [failure, setFailure] = useState<string | null>(null);
  const didStartLogin = useRef(false);
  const didWarmUp = useRef(false);

  // Nudge the user through OAuth exactly once. `useAuth` already guards
  // `completeOAuth()` against Strict Mode's double effect; this guards the
  // redirect that precedes it.
  useEffect(() => {
    if (USE_MOCK || isLoading || isAuthenticated || didStartLogin.current) return;
    didStartLogin.current = true;
    void login();
  }, [isAuthenticated, isLoading, login]);

  useEffect(() => {
    if (USE_MOCK || !isAuthenticated || didWarmUp.current) return;
    didWarmUp.current = true;

    registerClients(clients);
    setPhase('connecting');

    warmUp()
      .then(() => setPhase('ready'))
      .catch((cause: unknown) => {
        setFailure(describeError(cause, 'connect to Data Fabric').message);
        setPhase('failed');
      });
  }, [clients, isAuthenticated]);

  if (USE_MOCK) return <>{children}</>;

  if (phase === 'failed') {
    return (
      <Splash
        icon={<TriangleAlert size={20} aria-hidden />}
        title="Could not connect to UiPath"
        message={failure ?? 'Unknown error.'}
        action={
          <button type="button" className="secondary-button" onClick={() => location.reload()}>
            Reload
          </button>
        }
      />
    );
  }

  if (authError !== null && !isAuthenticated) {
    return (
      <Splash
        icon={<TriangleAlert size={20} aria-hidden />}
        title="Sign-in failed"
        message={authError}
        action={
          <button type="button" className="primary-button" onClick={() => void login()}>
            Try signing in again
          </button>
        }
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Splash
        icon={<PlugZap size={20} aria-hidden />}
        title="Signing in to UiPath"
        message={`Redirecting to ${UIPATH.org} / ${UIPATH.tenant} to authorise ExpenseFlow.`}
        action={
          <button type="button" className="secondary-button" onClick={() => void login()}>
            Sign in
          </button>
        }
      />
    );
  }

  if (phase !== 'ready') {
    return (
      <Splash
        icon={<Loader2 size={20} aria-hidden className="spin" />}
        title="Connecting to Data Fabric"
        message="Reading the ExpenseFlow_Expense schema and the Status and Category choice sets."
      />
    );
  }

  return <>{children}</>;
}
