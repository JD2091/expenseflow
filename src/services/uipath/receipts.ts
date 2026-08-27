/* ============================================================================
 * ExpenseFlow — receipts in a Storage Bucket
 * ----------------------------------------------------------------------------
 * Day 1 captured the receipt's FILENAME and threw the file away — there was
 * nowhere to put it. Day 2 uploads the bytes to `ExpenseFlow_Receipts` and
 * stores the bucket path on the record, so the file is still there after a
 * refresh, on another machine, and in the Orchestrator UI.
 *
 * Bucket calls are folder-scoped and take a NUMERIC `bucketId`, which the app
 * never hardcodes: the bucket is resolved by name once per page load. The
 * folder is passed as `folderKey` (a GUID) — never `parseInt`ed into a number
 * (STATE.md §7 gotcha 15).
 * ========================================================================== */

import { getClients } from './client';
import { UIPATH } from './config';
import { rethrowFriendly } from './errors';

let cachedBucketId: number | null = null;
let inFlight: Promise<number> | null = null;

async function getBucketId(): Promise<number> {
  if (cachedBucketId !== null) return cachedBucketId;
  if (inFlight !== null) return inFlight;

  inFlight = (async () => {
    const { buckets } = getClients();
    const bucket = await buckets.getByName(UIPATH.bucketName, { folderKey: UIPATH.folderKey });
    cachedBucketId = bucket.id;
    return bucket.id;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

export function resetBucketCache(): void {
  cachedBucketId = null;
  inFlight = null;
}

/**
 * Everything after the last `/` or `\`, with anything awkward flattened.
 *
 * Browsers hand back `C:\fakepath\bill.pdf` on some platforms, and a bucket
 * path with a space or a `#` in it makes for a read URI that needs escaping at
 * every call site. Normalising once here is cheaper than remembering to.
 */
function safeFileName(name: string): string {
  const tail = name.split(/[\\/]/).pop() ?? name;
  return tail.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '') || 'receipt';
}

/**
 * Upload one receipt and return the bucket path to store on the record.
 *
 * The path is prefixed with the expense code so the bucket stays browsable
 * during the demo — the presenter opens Orchestrator, sorts by name, and the
 * file they just uploaded is findable by the code on screen.
 */
export async function uploadReceipt(expenseCode: string, file: File): Promise<string> {
  try {
    const bucketId = await getBucketId();
    const path = `${UIPATH.receiptPrefix}/${expenseCode}-${safeFileName(file.name)}`;

    const response = await getClients().buckets.uploadFile(bucketId, path, file, {
      folderKey: UIPATH.folderKey,
    });

    if (!response.success) {
      throw new Error(`The bucket rejected ${path} (HTTP ${response.statusCode}).`);
    }

    return path;
  } catch (cause) {
    rethrowFriendly(cause, 'upload the receipt to UiPath');
  }
}

/**
 * A short-lived, directly-openable URL for a stored receipt.
 *
 * `getReadUri` returns a pre-signed blob URI, so the link works in a new tab
 * without the app having to proxy the bytes or attach a token.
 */
export async function getReceiptReadUri(path: string): Promise<string> {
  try {
    const bucketId = await getBucketId();
    const response = await getClients().buckets.getReadUri(bucketId, path, {
      folderKey: UIPATH.folderKey,
      expiryInMinutes: 15,
    });
    return response.uri;
  } catch (cause) {
    rethrowFriendly(cause, 'open the receipt from UiPath');
  }
}
