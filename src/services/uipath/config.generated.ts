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
  probedAt: "",
  org: "your-org",
  tenant: "your-tenant",
  baseUrl: "https://cloud.api.uipath.com",
  folderKey: "00000000-0000-0000-0000-000000000000",
  folderPath: "Shared",
  entityId: "00000000-0000-0000-0000-000000000000",
  entityName: "ExpenseFlow_Expense",
  statusChoiceSetId: "",
  categoryChoiceSetId: "",
  assetName: "ExpenseFlow_PolicyThreshold",
  bucketName: "ExpenseFlow_Receipts",
};
