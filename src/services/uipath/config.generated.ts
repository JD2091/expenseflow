/* ============================================================================
 * Resolved UiPath resource ids — the only file in `src/` with a UUID literal.
 * ----------------------------------------------------------------------------
 * Ships with PLACEHOLDERS. Point the app at your own tenant by replacing
 * `entityId` and `folderKey` below with the real GUIDs (see the README,
 * "Point it at your own UiPath tenant"). Everything else is resolved by NAME
 * at runtime, so those two are all a fresh tenant needs.
 *
 * In the workshop this file was regenerated from a probe run
 * (`npm run sync:uipath`); that harness is not part of this repo.
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
  probedAt: "2026-09-22T11:32:00.000Z",
  org: "testcloud_team",
  tenant: "TAM",
  baseUrl: "https://staging.api.uipath.com",
  folderKey: "01a3eae4-d43c-4009-9342-969b1262b1e1",
  folderPath: "Shared",
  entityId: "65e0d30d-79b6-f111-a6a9-6045bddc9767",
  entityName: "ExpenseFlow_Expense",
  statusChoiceSetId: "2a1c8470-78b6-f111-a6a9-6045bddc9767",
  categoryChoiceSetId: "ce3ba077-78b6-f111-a6a9-6045bddc9767",
  assetName: "ExpenseFlow_PolicyThreshold",
  bucketName: "ExpenseFlow_Receipts",
};
