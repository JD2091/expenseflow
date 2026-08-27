/* ============================================================================
 * ExpenseFlow — UiPath resource configuration
 * ----------------------------------------------------------------------------
 * ONE place where a UiPath id exists. Components never see a GUID; they never
 * even see this file. `services/uipath/*` imports it, and that is all.
 *
 * The values come from `config.generated.ts`, which is written from
 * `uipath/preflight/last-probe.json` by `npm run sync:uipath`. The probe
 * resolves everything BY NAME, so a re-provisioned tenant needs one command,
 * not a hunt through the source for stale UUIDs.
 * ========================================================================== */

import { RESOLVED } from './config.generated';

/** Entity field names, verbatim PascalCase from STATE.md §6. */
export const FIELD = {
  id: 'Id',
  expenseCode: 'ExpenseCode',
  employee: 'Employee',
  description: 'Description',
  category: 'Category',
  amount: 'Amount',
  expenseDate: 'ExpenseDate',
  status: 'Status',
  receiptPath: 'ReceiptPath',
  approvalTaskId: 'ApprovalTaskId',
  policyNote: 'PolicyNote',
  submittedAt: 'SubmittedAt',
  decidedAt: 'DecidedAt',
  decidedBy: 'DecidedBy',
  comments: 'Comments',
} as const;

export const UIPATH = {
  entityId: RESOLVED.entityId,
  entityName: RESOLVED.entityName,

  /**
   * Orchestrator resources are folder-scoped. We pass `folderKey` (the GUID)
   * rather than `folderId` (a number) so nothing is ever tempted to
   * `parseInt` a GUID — STATE.md §7 gotcha 15.
   */
  folderKey: RESOLVED.folderKey,
  folderPath: RESOLVED.folderPath,

  assetName: RESOLVED.assetName,
  bucketName: RESOLVED.bucketName,

  /** Fallbacks only — the live ids are read off the entity schema on load. */
  statusChoiceSetId: RESOLVED.statusChoiceSetId,
  categoryChoiceSetId: RESOLVED.categoryChoiceSetId,

  /**
   * Rows per HTTP call inside `queryAll`'s cursor loop. NOT a UI page size —
   * `ExpenseTable` paginates at 25 independently. 100 keeps the 144-row seed
   * to two round trips.
   */
  fetchPageSize: 100,

  /** Bucket prefix for uploaded receipts, e.g. `receipts/EXP-1007-bill.pdf`. */
  receiptPrefix: 'receipts',

  /** Which probe run these ids came from — surfaced in error messages. */
  probedAt: RESOLVED.probedAt,
  org: RESOLVED.org,
  tenant: RESOLVED.tenant,
} as const;

/**
 * Fail loudly and early rather than 404-ing halfway through a demo.
 *
 * The generated module is committed, so this only trips on a clone where the
 * probe has never run — or on a hand-edit that blanked a value.
 */
export function assertConfigured(): void {
  if (!UIPATH.entityId || !UIPATH.folderKey) {
    throw new Error(
      'UiPath resources are not configured. Run `node uipath/preflight/probe.mjs` ' +
        'from the repo root, then `npm run sync:uipath -w apps/expenseflow`.',
    );
  }
}
