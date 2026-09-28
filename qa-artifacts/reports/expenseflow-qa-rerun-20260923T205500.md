# ExpenseFlow QA blocked-case rerun — 20260923T205500

Generated: 2026-09-23 20:55 IST (2026-09-23T15:25:06.098Z)

## Scope and decision

This rerun re-evaluated the seven regression cases that were `BLOCKED` in the prior regression execution. The current source change is `8300fa5ce4532daa873fb8cd5a73b660d866278b` on `main`; it fixes the Finance month upper bound by using the actual last day of the month instead of a hard-coded `-31` date.

The change unlocked the Finance data path for **EF-REG-008 only**. The other six cases remain blocked for independent environment, fixture, locale, configuration, or identity prerequisites. No new product failure was observed.

## Environment

- Project: `EXPENSEFLOW` / ExpenseFlow QA (`ec245f49-f3da-0200-9a6c-0b4a286e44f7`)
- Connected staging: `http://localhost:5173` (verified listener via `http://127.0.0.1:5173/`; connected UI observed at `http://localhost:5173/finance`)
- UiPath: `https://staging.uipath.com` / `testcloud_team` / `TAM`
- Orchestrator folder: `Shared` (`01a3eae4-d43c-4009-9342-969b1262b1e1`)
- Current SHA: `8300fa5ce4532daa873fb8cd5a73b660d866278b`
- Prior approved SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`
- Preflight: `npm test` passed 32/32; `npm run build` succeeded; local app returned HTTP 200.

## Rerun outcome

| Stable ID | QA classification | Test Manager | Outcome |
|---|---|---|---|
| EF-REG-007 | Blocked | Not rerun | No EFREG007 connected record/task; no approved connected decision-failure fixture. |
| EF-REG-008 | Restricted / partial | Passed | 2 of 3 steps passed; Finance classification verified; detail-row readback restricted by Edge masking/COM transport and mock-query contamination risk. |
| EF-REG-009 | Blocked | Not rerun | No EFREG009 connected fixture; demo failure switches bypass UiPath calls. |
| EF-REG-010 | Blocked | Not rerun | No approved receipt access-denied/unavailable fixture. |
| EF-REG-011 | Blocked | Not rerun | Required alternate locale/timezone unavailable; current runtime is Asia/Calcutta. |
| EF-REG-012 | Blocked | Not rerun | No isolated invalid/missing-resource configuration. |
| EF-REG-013 | Blocked | Not rerun | No dedicated least-privilege and separate authorized identities. |

Summary: **1 case rerun / 0 fully passed by QA classification / 1 restricted partial / 6 still blocked / 0 new product failures.**

## EF-REG-008 published execution

- Test Manager execution: [08f1f869-86cd-0d00-0f01-0b4a2980d487](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/08f1f869-86cd-0d00-0f01-0b4a2980d487)
- Test-case log: `0dfc8735-47ef-6f00-bde8-0b4a2980d4bf`
- Stored step logs: `103282bf-519f-42f9-c89b-08df184ede01`, `497ebbc6-1754-48c2-c89c-08df184ede01`, `ce665c45-f3d4-4eb3-c89d-08df184ede01`
- Test Manager stats: `1 Passed / 0 Failed / 0 None`; the third step is stored as `Restricted`, so the publisher’s overall `Passed` must not be interpreted as full QA completion.
- All three step logs have uploaded execution-trace attachments.

### Step-level expected versus actual

1. **Seed or locate five synthetic records — Passed**
   - Expected: all five EFREG008 records retrievable through Finance’s unsettled query path.
   - Actual: inserted five uniquely tagged records (`EFQA-20260923T203800`) with 0 failures. A fresh server query returned Policy Review (`Status=2`), Pending Approval (`Status=3`), Reworked (`Status=6`), Submitted with null receipt (`Status=1`), and Submitted with receipt (`Status=1`). Records were retained for audit.

2. **Open Finance and inspect attention list — Passed**
   - Expected: the first four records appear once with correct reasons and the submitted-with-receipt control is excluded.
   - Actual: connected Finance loaded and refreshed after the `ExpenseDate` fix. The rendered table showed Policy Review, Pending Approval, Needs Rework, and Missing Receipt. The submitted-with-receipt control was excluded; the server query confirmed the same five-row fixture state.

3. **Open each attention row — Restricted**
   - Expected: each attention row navigates to its matching detail page.
   - Actual: the attached Edge window became visually masked and browser COM/page transport was unavailable. A fresh tab retained `?mock=1`, so connected detail-route readback could not be trusted. No business mutation occurred; this is an evidence limitation, not a product failure.

## Remaining blockers

- `EF-REG-007`: no connected EFREG007 record or task; app-level `demo=fail-decide` fails before UiPath calls and cannot prove connected task-completion failure.
- `EF-REG-009`: no connected EFREG009 recovery fixture; app-level demo switches are not connected failure evidence; unsafe fault injection was not attempted.
- `EF-REG-010`: no safe receipt access-denied/unavailable fixture; authorized EF-REG-004 path was not repurposed.
- `EF-REG-011`: no alternate locale/timezone west of UTC; current runtime remains Asia/Calcutta.
- `EF-REG-012`: no isolated invalid/missing-resource configuration.
- `EF-REG-013`: no least-privilege employee plus separate manager/Finance identities.

## Existing product failures and baseline

- `EF-SMOKE-007` remains an existing product failure: unknown expense route rendered an empty body/root instead of actionable not-found UI.
- `EF-SMOKE-010` remains an existing product failure: narrow views had page-level horizontal overflow and off-viewport controls.
- `EF-REG-014` was not reproduced through the corrected Finance path; the current change resolves the prior invalid `ExpenseDate` month-end bound.
- Baseline was **not advanced**. There are still six blocked target cases, one restricted step, and two confirmed prior product failures.

## Evidence files

- Manifest: `qa-artifacts/state/rerun-manifest-20260923T205500.json`
- Results: `qa-artifacts/state/EF-REG-008-test-results-20260923T205100.json`
- Fixture: `qa-artifacts/state/EF-REG-008-fixture-20260923T203800.json`
- Trace manifest: `qa-artifacts/traces/EF-REG-008-20260923T203300-execution-traces.json`
- Raw trace: `qa-artifacts/traces/EF-REG-008-20260923T203300.json`
- Prior historical report and manifest remain unchanged under `expenseflow-qa-report-20260923T160000.*` and `execution-manifest-20260923T160000.json`.
