/* ============================================================================
 * AUTO-GENERATED — DO NOT EDIT BY HAND.
 * ----------------------------------------------------------------------------
 * Source : uipath/preflight/last-probe.json
 * Probed : 2026-08-21T17:47:16.705Z
 * Regen  : npm run sync:uipath -w apps/expenseflow
 *
 * These are RESOLVED ids, not authored ones. Every resource is created and
 * looked up by NAME by the scripts under `uipath/`; this file is only the
 * cached answer so the browser does not have to resolve them on every load.
 *
 * This is the only file in `src/` permitted to contain a UUID literal.
 * ========================================================================== */

export interface ResolvedUiPathConfig {
  /** ISO timestamp of the probe run these ids came from. */
  probedAt: string;
  org: string;
  tenant: string;
  /** The API subdomain — NOT the portal host (STATE.md §7 gotcha 18). */
  baseUrl: string;
  /** Orchestrator folder GUID. Never `parseInt` this (gotcha 15). */
  folderKey: string;
  /** Slash-delimited folder path, e.g. `Shared`. */
  folderPath: string;
  entityId: string;
  entityName: string;
  /**
   * Choice-set ids, kept only as a fallback: the app prefers the ids carried
   * on the entity schema itself (`field.referenceChoiceSet.id`), so a
   * re-provisioned tenant works without regenerating this file.
   */
  statusChoiceSetId: string;
  categoryChoiceSetId: string;
  assetName: string;
  bucketName: string;
}

export const RESOLVED: ResolvedUiPathConfig = {
  probedAt: "2026-08-21T17:47:16.705Z",
  org: "uipathlabsunifiedmix",
  tenant: "Testing",
  baseUrl: "https://staging.api.uipath.com",
  folderKey: "711a27d3-cc8a-4327-891e-f8646047151d",
  folderPath: "Shared",
  entityId: "44edfba2-769d-f111-9b33-6045bdd6658d",
  entityName: "ExpenseFlow_Expense",
  statusChoiceSetId: "d9397c17-769d-f111-9b33-6045bdd6658d",
  categoryChoiceSetId: "671244cd-759d-f111-9b33-6045bdd6658d",
  assetName: "ExpenseFlow_PolicyThreshold",
  bucketName: "ExpenseFlow_Receipts",
};
