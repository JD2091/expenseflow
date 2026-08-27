/* ============================================================================
 * ExpenseFlow — choice-set translation
 * ============================================================================
 *
 *   >>> THE SINGLE MOST EXPENSIVE MISTAKE IN A DATA FABRIC APP. <<<
 *
 * A ChoiceSetSingle field reads back as an INTEGER on every path — query
 * results, single-record reads, groupBy keys, all of them. `record.Status` is
 * `4`, not `'Approved'`. So:
 *
 *     if (record.Status === 'Approved')   // ALWAYS false
 *     record.Category.toLowerCase()       // throws
 *
 * Neither is a type error, so `tsc` is perfectly happy and the bug only shows
 * up on a projector. Translation is needed in THREE directions:
 *
 *   | Path                                    | Direction              |
 *   |-----------------------------------------|------------------------|
 *   | Writes (insertRecordById/updateRecordById) | name -> numberId     |
 *   | Filter values in queryRecordsById        | name -> numberId, as a STRING |
 *   | Reads and groupBy keys                   | numberId -> name       |
 *
 * The filter one is the nastiest: the API happily returns 0 rows (Equals) or
 * every row (NotEquals) when the value is untranslated, so it presents as a
 * filter bug rather than a type bug.
 *
 * `numberId` is assigned in value-creation order, so a re-provisioned tenant
 * can hand out different numbers. That is why they are FETCHED once on load
 * and never hardcoded — even though STATE.md §7 writes today's values down for
 * humans debugging under time pressure.
 * ========================================================================== */

import type { ChoiceSetGetResponse } from '@uipath/uipath-typescript/entities';

import { getClients } from './client';
import { UIPATH } from './config';

export interface ChoiceMap {
  /** Choice-set name, e.g. `ExpenseFlow_Status` — used in error messages. */
  name: string;
  id: string;
  byName: Record<string, number>;
  byNumberId: Record<number, string>;
}

export interface ChoiceMaps {
  status: ChoiceMap;
  category: ChoiceMap;
}

export interface ChoiceSetIds {
  status: string;
  category: string;
}

let maps: ChoiceMaps | null = null;
let inFlight: Promise<ChoiceMaps> | null = null;

/** Every value in one choice set. Cursor-looped — see `entityClient.queryAll`. */
async function fetchValues(choiceSetId: string): Promise<ChoiceSetGetResponse[]> {
  const { choiceSets } = getClients();

  let page = await choiceSets.getById(choiceSetId, { pageSize: UIPATH.fetchPageSize });
  const values = [...page.items];

  while (page.hasNextPage && page.nextCursor) {
    page = await choiceSets.getById(choiceSetId, {
      pageSize: UIPATH.fetchPageSize,
      cursor: page.nextCursor,
    });
    values.push(...page.items);
  }

  return values;
}

async function buildMap(name: string, choiceSetId: string): Promise<ChoiceMap> {
  const values = await fetchValues(choiceSetId);

  const byName: Record<string, number> = {};
  const byNumberId: Record<number, string> = {};

  for (const value of values) {
    byName[value.name] = value.numberId;
    byNumberId[value.numberId] = value.name;
  }

  if (values.length === 0) {
    throw new Error(`Choice set ${name} came back empty — the tenant looks half-provisioned.`);
  }

  return { name, id: choiceSetId, byName, byNumberId };
}

/**
 * Fetch both choice sets ONCE on app load and build BOTH maps.
 *
 * Concurrent callers share one request: the app-load warm-up and a racing
 * `listExpenses` must not fetch the same values twice.
 */
export async function loadChoiceMaps(ids: ChoiceSetIds): Promise<ChoiceMaps> {
  if (maps !== null) return maps;
  if (inFlight !== null) return inFlight;

  inFlight = (async () => {
    const [status, category] = await Promise.all([
      buildMap('ExpenseFlow_Status', ids.status),
      buildMap('ExpenseFlow_Category', ids.category),
    ]);
    maps = { status, category };
    return maps;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

/** Drop the cache — used by the runtime gate on sign-out. */
export function resetChoiceMaps(): void {
  maps = null;
  inFlight = null;
}

/**
 * The loaded maps, synchronously.
 *
 * `mappers.ts` runs inside a tight loop over query results and must not be
 * async, so the warm-up is a precondition rather than something each mapper
 * awaits.
 */
export function choiceMaps(): ChoiceMaps {
  if (maps === null) {
    throw new Error(
      'Choice sets have not been loaded yet. <UiPathRuntime> fetches them once on app load.',
    );
  }
  return maps;
}

/** name -> numberId. For writes, and for filter values (stringify the result). */
export function toNumberId(set: ChoiceMap, name: string): number {
  const numberId = set.byName[name];
  if (numberId === undefined) {
    throw new Error(
      `"${name}" is not a value of ${set.name}. Known values: ${Object.keys(set.byName).join(', ')}.`,
    );
  }
  return numberId;
}

/** Same thing, shaped for a `queryRecordsById` filter — always a string. */
export function toFilterValue(set: ChoiceMap, name: string): string {
  return String(toNumberId(set, name));
}

/**
 * numberId -> name. For reads and groupBy keys.
 *
 * Takes `unknown` on purpose: this is the boundary where an untyped
 * `EntityRecord` value arrives. A string that is already a known name passes
 * through, so the app survives an SDK that starts translating for us.
 */
export function toName(set: ChoiceMap, value: unknown): string {
  if (typeof value === 'number') {
    const name = set.byNumberId[value];
    if (name !== undefined) return name;
    throw new Error(`${set.name} has no value with numberId ${value}.`);
  }

  if (typeof value === 'string') {
    if (value in set.byName) return value;
    // groupBy keys arrive as strings on some paths — `"4"`, not `4`.
    const parsed = Number(value);
    if (Number.isInteger(parsed) && set.byNumberId[parsed] !== undefined) {
      return set.byNumberId[parsed];
    }
  }

  throw new Error(`Cannot read ${JSON.stringify(value)} as a ${set.name} value.`);
}

/** Same as `toName`, but returns `null` instead of throwing on a blank field. */
export function toNameOrNull(set: ChoiceMap, value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  return toName(set, value);
}
