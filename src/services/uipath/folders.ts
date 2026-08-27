/* ============================================================================
 * ExpenseFlow — the numeric Orchestrator folder id
 * ============================================================================
 *
 *   >>> THE ONE PLACE A GUID IS NOT ENOUGH. <<<
 *
 * Every other Orchestrator call in this app is folder-scoped by `folderKey`
 * (a GUID) or `folderPath` (a string), which is why `receipts.ts` and
 * `policy.ts` never touch a number and STATE.md §7 gotcha 15 — "never
 * `parseInt` a folder key" — is easy to obey.
 *
 * `Tasks.create(options, folderId)` breaks that pattern. Its second argument is
 * typed `number` and goes straight into the `X-UIPATH-OrganizationUnitId`
 * header, which Orchestrator will not accept a GUID for. So Action Center
 * needs the folder's numeric id, and there is nowhere to get it:
 *
 *   - the SDK exposes no Folders service (there is no `/folders` subpath);
 *   - `uip or folders list` returns Key / Name / Path and NO Id, so the
 *     preflight probe cannot cache one into `config.generated.ts`;
 *   - `Assets.getByName` and `Buckets.getByName` responses carry neither;
 *   - the `Processes.getAll()` bridge the skill suggests needs
 *     `OR.Execution.Read`, which this app deliberately does not request.
 *
 * What is left is the Orchestrator OData endpoint the SDK itself calls
 * internally for the reverse lookup (`orchestrator_/odata/Folders`). `sdk`
 * exposes `getToken()` and `config`, so one small `fetch` gets us there, and
 * `OR.Folders.Read` — already in the scope string — is exactly the grant it
 * needs.
 *
 * Resolved ONCE per page load and cached. The URL is built the same way the
 * SDK builds its own (`new URL(`${org}/${tenant}/${path}`, baseUrl)`), so the
 * API-subdomain rule in gotcha 18 keeps applying with no extra thought.
 * ========================================================================== */

import { getClients } from './client';
import { UIPATH } from './config';
import { rethrowFriendly } from './errors';

/** The shape we read off `/odata/Folders`. Orchestrator answers in PascalCase. */
interface OrchestratorFolder {
  Id?: number;
  Key?: string;
  FullyQualifiedName?: string;
  DisplayName?: string;
}

let cached: number | null = null;
let inFlight: Promise<number> | null = null;

function odataUrl(sdkConfig: { baseUrl: string; orgName: string; tenantName: string }): string {
  // `$filter` on a string column is portable; filtering on the Guid `Key`
  // needs OData's unquoted-Guid literal form, which not every Orchestrator
  // build accepts. So we narrow by path and VERIFY the key we get back.
  // OData escapes a single quote by doubling it; `URLSearchParams` then does
  // the percent-encoding exactly once, which hand-rolling would not.
  const path = UIPATH.folderPath.replace(/'/g, "''");
  const query = new URLSearchParams({
    $filter: `FullyQualifiedName eq '${path}'`,
    $select: 'Id,Key,FullyQualifiedName,DisplayName',
    $top: '2',
  });

  return new URL(
    `${sdkConfig.orgName}/${sdkConfig.tenantName}/orchestrator_/odata/Folders?${query.toString()}`,
    sdkConfig.baseUrl,
  ).toString();
}

async function fetchFolders(url: string, token: string): Promise<OrchestratorFolder[]> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });

  if (!response.ok) {
    // Not a `UiPathError` — this call bypasses the SDK — so say enough that the
    // status code is actionable without opening the network tab.
    throw new Error(
      `Orchestrator answered ${response.status} ${response.statusText} for /odata/Folders. ` +
        (response.status === 401 || response.status === 403
          ? 'OR.Folders.Read is the scope this needs; check it is granted on the OAuth client.'
          : `Check that ${UIPATH.folderPath} exists in ${UIPATH.org}/${UIPATH.tenant}.`),
    );
  }

  const body: unknown = await response.json();
  const items = (body as { value?: unknown })?.value;
  return Array.isArray(items) ? (items as OrchestratorFolder[]) : [];
}

async function resolveFolderId(): Promise<number> {
  try {
    const { sdk } = getClients();
    const token = sdk.getToken();

    if (token === undefined) {
      throw new Error('The UiPath session has no access token yet.');
    }

    const folders = await fetchFolders(odataUrl(sdk.config), token);

    // Prefer the folder whose Key matches the one the probe resolved. If the
    // path was renamed since the probe ran, the key is the truth and the
    // mismatch is worth a word in the console rather than a silent wrong
    // folder — a task created in the wrong folder is invisible, not an error.
    const byKey = folders.find((folder) => folder.Key === UIPATH.folderKey);
    const folder = byKey ?? folders[0];

    if (folder === undefined || typeof folder.Id !== 'number') {
      throw new Error(
        `No Orchestrator folder matched "${UIPATH.folderPath}" in ${UIPATH.org}/${UIPATH.tenant}. ` +
          'Re-run `node uipath/preflight/probe.mjs` and `npm run sync:uipath -w apps/expenseflow`.',
      );
    }

    if (byKey === undefined) {
      console.warn(
        `[uipath] folder "${UIPATH.folderPath}" resolved to key ${folder.Key ?? '(none)'}, ` +
          `but config.generated.ts says ${UIPATH.folderKey}. The probe is stale.`,
      );
    }

    cached = folder.Id;
    return folder.Id;
  } catch (cause) {
    rethrowFriendly(cause, 'find the UiPath folder that holds the approval tasks');
  }
}

/**
 * The numeric folder id, resolved once per page load.
 *
 * Cached because it cannot change under a running app: the folder key comes
 * from build-time config, and a folder's numeric id is stable for its
 * lifetime. Unlike the policy threshold (see `policy.ts`), nothing here is a
 * business decision — it is an address.
 */
export async function getFolderId(): Promise<number> {
  if (cached !== null) return cached;
  if (inFlight !== null) return inFlight;

  inFlight = resolveFolderId();
  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

/** Drop the cache — used by the runtime gate and by the tests. */
export function resetFolderId(): void {
  cached = null;
  inFlight = null;
}
