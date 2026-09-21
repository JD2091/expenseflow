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
  probedAt: "2026-09-21T10:38:00.000Z",
  org: "uiparth",
  tenant: "DefaultTenant",
  baseUrl: "https://api.uipath.com",
  folderKey: "dd035dc0-098f-4111-8158-df2d3c312dc9",
  folderPath: "Shared",
  entityId: "8ecee9a6-a8b5-f111-a6a7-000d3ab24594",
  entityName: "ExpenseFlow_Expense",
  statusChoiceSetId: "28d3687d-a8b5-f111-a6a7-000d3ab24594",
  categoryChoiceSetId: "80df4b84-a8b5-f111-a6a7-000d3ab24594",
  assetName: "ExpenseFlow_PolicyThreshold",
  bucketName: "ExpenseFlow_Receipts",
};
