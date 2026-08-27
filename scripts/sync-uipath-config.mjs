#!/usr/bin/env node
/* ============================================================================
 * sync-uipath-config — uipath/preflight/last-probe.json  ->  config.generated.ts
 * ----------------------------------------------------------------------------
 * `probe.mjs` resolves every UiPath resource BY NAME and writes the resolved
 * IDs to `uipath/preflight/last-probe.json`. This script copies the handful the
 * app actually needs into a normal TypeScript module under `src/`.
 *
 * Why a generated file rather than importing the JSON directly:
 *   - the probe output lives outside the Vite root, so a direct import needs
 *     an alias + `resolveJsonModule` + a tsconfig `include` widening, i.e.
 *     three edits to Day-1 config files for no gain;
 *   - the generated module is committed, so `npm run build` works on a clean
 *     clone with no tenant access;
 *   - its path contains `services/uipath/config`, which is the ONE place
 *     T06's verification grep allows a UUID literal to appear.
 *
 * Re-run it whenever the tenant is re-provisioned:
 *
 *     node uipath/preflight/probe.mjs          # from the repo root
 *     npm run sync:uipath -w apps/expenseflow
 *
 * Deliberately NOT copied: the `name -> numberId` choice maps and the policy
 * asset's value. Both are fetched at runtime — baking them in is exactly the
 * bug STATE.md §7 gotcha 1 and §4.4 warn about.
 * ========================================================================== */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..');
const probePath = resolve(repoRoot, 'uipath', 'preflight', 'last-probe.json');
const outPath = resolve(here, '..', 'src', 'services', 'uipath', 'config.generated.ts');

let probe;
try {
  probe = JSON.parse(readFileSync(probePath, 'utf8'));
} catch (cause) {
  console.error(`Could not read ${probePath}`);
  console.error('Run `node uipath/preflight/probe.mjs` from the repo root first.');
  console.error(String(cause));
  process.exit(1);
}

const required = ['entityId', 'folderKey', 'folderPath', 'org', 'tenant'];
const missing = required.filter((key) => !probe[key]);
if (missing.length > 0) {
  console.error(`last-probe.json is missing: ${missing.join(', ')}`);
  console.error('Re-run the probe; it must report READY before T06 code can resolve anything.');
  process.exit(1);
}

const statusChoiceSetId = probe.choiceSets?.ExpenseFlow_Status?.id ?? '';
const categoryChoiceSetId = probe.choiceSets?.ExpenseFlow_Category?.id ?? '';

const banner = `/* ============================================================================
 * AUTO-GENERATED — DO NOT EDIT BY HAND.
 * ----------------------------------------------------------------------------
 * Source : uipath/preflight/last-probe.json
 * Probed : ${probe.probedAt ?? 'unknown'}
 * Regen  : npm run sync:uipath -w apps/expenseflow
 *
 * These are RESOLVED ids, not authored ones. Every resource is created and
 * looked up by NAME by the scripts under \`uipath/\`; this file is only the
 * cached answer so the browser does not have to resolve them on every load.
 *
 * This is the only file in \`src/\` permitted to contain a UUID literal.
 * ========================================================================== */
`;

const body = `
export interface ResolvedUiPathConfig {
  /** ISO timestamp of the probe run these ids came from. */
  probedAt: string;
  org: string;
  tenant: string;
  /** The API subdomain — NOT the portal host (STATE.md §7 gotcha 18). */
  baseUrl: string;
  /** Orchestrator folder GUID. Never \`parseInt\` this (gotcha 15). */
  folderKey: string;
  /** Slash-delimited folder path, e.g. \`Shared\`. */
  folderPath: string;
  entityId: string;
  entityName: string;
  /**
   * Choice-set ids, kept only as a fallback: the app prefers the ids carried
   * on the entity schema itself (\`field.referenceChoiceSet.id\`), so a
   * re-provisioned tenant works without regenerating this file.
   */
  statusChoiceSetId: string;
  categoryChoiceSetId: string;
  assetName: string;
  bucketName: string;
}

export const RESOLVED: ResolvedUiPathConfig = {
  probedAt: ${JSON.stringify(probe.probedAt ?? '')},
  org: ${JSON.stringify(probe.org)},
  tenant: ${JSON.stringify(probe.tenant)},
  baseUrl: ${JSON.stringify(probe.baseUrl ?? '')},
  folderKey: ${JSON.stringify(probe.folderKey)},
  folderPath: ${JSON.stringify(probe.folderPath)},
  entityId: ${JSON.stringify(probe.entityId)},
  entityName: ${JSON.stringify(probe.entityName ?? 'ExpenseFlow_Expense')},
  statusChoiceSetId: ${JSON.stringify(statusChoiceSetId)},
  categoryChoiceSetId: ${JSON.stringify(categoryChoiceSetId)},
  assetName: ${JSON.stringify(probe.asset?.name ?? 'ExpenseFlow_PolicyThreshold')},
  bucketName: ${JSON.stringify(probe.bucket?.name ?? 'ExpenseFlow_Receipts')},
};
`;

writeFileSync(outPath, `${banner}${body}`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`  entity  ${probe.entityName} = ${probe.entityId}`);
console.log(`  folder  ${probe.folderPath} = ${probe.folderKey}`);
console.log(`  probed  ${probe.probedAt}`);
