/* ============================================================================
 * ExpenseFlow — the SDK service bundle
 * ----------------------------------------------------------------------------
 * `expenseService` keeps its Day-1 signature — two plain async functions, no
 * React in sight. But the `UiPath` instance they need comes from `useAuth()`,
 * which is a hook. This module is the join: `<UiPathRuntime>` builds the
 * services once (constructor DI, inside a `useMemo`) and registers them here;
 * everything under `services/` reads them back synchronously.
 *
 * Two skill rules are load-bearing and both are easy to violate silently:
 *
 *   gotcha 11 — service classes are SUBPATH-only imports. Importing `Entities`
 *               from '@uipath/uipath-typescript' fails at build time.
 *   gotcha 12 — constructor DI. `new Entities(sdk)`, never `sdk.entities.*`,
 *               which is deprecated and will be removed.
 * ========================================================================== */

import { Assets } from '@uipath/uipath-typescript/assets';
import { Buckets } from '@uipath/uipath-typescript/buckets';
import { ChoiceSets, Entities } from '@uipath/uipath-typescript/entities';
import { Tasks } from '@uipath/uipath-typescript/tasks';
import type { UiPath } from '@uipath/uipath-typescript/core';

export interface UiPathClients {
  entities: Entities;
  choiceSets: ChoiceSets;
  assets: Assets;
  buckets: Buckets;
  tasks: Tasks;
  /**
   * The authenticated SDK instance itself.
   *
   * Held for exactly ONE caller: `folders.ts`, which has to reach an
   * Orchestrator endpoint the SDK does not wrap (`/odata/Folders`) and needs
   * `sdk.getToken()` and `sdk.config` to do it. Nothing else in `services/`
   * should touch this — if a second consumer appears, that is a sign the SDK
   * grew a service and we should be using it instead.
   */
  sdk: UiPath;
}

/**
 * Build every service from ONE authenticated `UiPath` instance.
 *
 * Call this inside a `useMemo(() => createClients(sdk), [sdk])` — rebuilding
 * the services on every render is wasteful and defeats the SDK's own caching.
 */
export function createClients(sdk: UiPath): UiPathClients {
  return {
    entities: new Entities(sdk),
    choiceSets: new ChoiceSets(sdk),
    assets: new Assets(sdk),
    buckets: new Buckets(sdk),
    tasks: new Tasks(sdk),
    sdk,
  };
}

let registered: UiPathClients | null = null;

export function registerClients(clients: UiPathClients | null): void {
  registered = clients;
}

export function hasClients(): boolean {
  return registered !== null;
}

/**
 * The services, or a message that says exactly what went wrong.
 *
 * The only way to reach this throw is calling the service layer outside
 * `<UiPathRuntime>` — which is a wiring bug, not a runtime condition, so it
 * should read like one.
 */
export function getClients(): UiPathClients {
  if (registered === null) {
    throw new Error(
      'The UiPath SDK is not ready yet. `expenseService` must be called from ' +
        'inside <UiPathRuntime>, which registers the SDK once the user is signed in.',
    );
  }
  return registered;
}
