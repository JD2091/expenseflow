/* ============================================================================
 * ExpenseFlow — entity schema introspection
 * ----------------------------------------------------------------------------
 * `entities.getById()` once on app load, cached. It buys three things:
 *
 *   1. the exact PascalCase field names, so writes can be checked before they
 *      are sent — STATE.md §7 gotcha 3: an unknown key on insert is NOT an
 *      error, it is silently dropped. A typo becomes a missing value;
 *   2. the choice-set ids, read off the Status and Category fields, so the
 *      choice maps work on a re-provisioned tenant with no config change;
 *   3. a cheap, early failure if the entity is missing or renamed.
 *
 * This lives in its own module rather than in `entityClient.ts` purely to keep
 * the import graph acyclic: `entityClient` and `mappers` both need it, and
 * they need each other.
 * ========================================================================== */

import { FieldDisplayType } from '@uipath/uipath-typescript/entities';
import type { FieldMetaData } from '@uipath/uipath-typescript/entities';

import { getClients } from './client';
import type { ChoiceSetIds } from './choiceSets';
import { FIELD, UIPATH } from './config';

export interface EntitySchema {
  id: string;
  name: string;
  fields: FieldMetaData[];
  /** Field name (verbatim casing) -> its metadata. */
  byName: Map<string, FieldMetaData>;
}

/**
 * Columns Data Fabric owns. Writing any of them is either rejected or silently
 * dropped, which is exactly why `SubmittedAt` exists as a custom field rather
 * than the app leaning on `CreateTime` (STATE.md §7 gotcha 2).
 */
const AUDIT_FIELDS: ReadonlySet<string> = new Set([
  'Id',
  'CreateTime',
  'UpdateTime',
  'CreatedBy',
  'UpdatedBy',
  'RecordOwner',
]);

let cached: EntitySchema | null = null;
let inFlight: Promise<EntitySchema> | null = null;

export async function loadSchema(): Promise<EntitySchema> {
  if (cached !== null) return cached;
  if (inFlight !== null) return inFlight;

  inFlight = (async () => {
    const { entities } = getClients();
    const entity = await entities.getById(UIPATH.entityId);

    const fields = entity.fields ?? [];
    const byName = new Map(fields.map((field) => [field.name, field]));

    if (!byName.has(FIELD.expenseCode)) {
      throw new Error(
        `Entity ${entity.name} has no ${FIELD.expenseCode} field. ` +
          'The tenant does not match STATE.md §6 — re-run `uipath/provisioning/provision.mjs`.',
      );
    }

    cached = { id: entity.id, name: entity.name, fields, byName };
    return cached;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

export function resetSchema(): void {
  cached = null;
  inFlight = null;
}

export function schema(): EntitySchema {
  if (cached === null) {
    throw new Error(
      'The entity schema has not been loaded yet. <UiPathRuntime> loads it once on app load.',
    );
  }
  return cached;
}

/**
 * The choice-set ids, taken from the schema rather than from config.
 *
 * `fieldDisplayType` IS a plain string enum; `fieldDataType` is an OBJECT
 * (gotcha 5), which is why only the former is compared directly here.
 */
export function choiceSetIdsFromSchema(loaded: EntitySchema): ChoiceSetIds {
  function idFor(fieldName: string, fallback: string): string {
    const field = loaded.byName.get(fieldName);
    if (field === undefined) return fallback;
    if (field.fieldDisplayType !== FieldDisplayType.ChoiceSetSingle) return fallback;
    return field.referenceChoiceSet?.id ?? field.choiceSetId ?? fallback;
  }

  return {
    status: idFor(FIELD.status, UIPATH.statusChoiceSetId),
    category: idFor(FIELD.category, UIPATH.categoryChoiceSetId),
  };
}

/**
 * Refuse to send a payload whose keys the entity does not have.
 *
 * `insertRecordById` accepts unknown keys and drops them without a word, so
 * this is the only thing standing between a typo and a column that is
 * permanently blank in the demo. It throws in dev — where a presenter is
 * writing the code — and logs loudly in a production build, where crashing a
 * submit would be worse than saving an incomplete row.
 */
export function assertWritableKeys(payload: Record<string, unknown>, where: string): void {
  const loaded = schema();
  const problems: string[] = [];

  for (const key of Object.keys(payload)) {
    if (AUDIT_FIELDS.has(key)) {
      problems.push(`"${key}" is a Data Fabric audit column and cannot be written`);
    } else if (!loaded.byName.has(key)) {
      problems.push(`"${key}" is not a field on ${loaded.name}`);
    }
  }

  if (problems.length === 0) return;

  const message =
    `${where}: ${problems.join('; ')}. ` +
    `Data Fabric drops unknown keys silently. Known fields: ${[...loaded.byName.keys()].join(', ')}.`;

  if (import.meta.env?.DEV) throw new Error(message);
  console.error(`[uipath] ${message}`);
}
