# ExpenseFlow QA six-case execution — 20260924T124500

Generated: 2026-09-24 13:04 IST (2026-09-24T07:43:06.058Z)

## Decision

The six newly created regression cases were reconciled against Test Manager. EF-REG-018 produced one confirmed product failure in the mock one-shot retry scenario; EF-REG-015 is restricted because the connected Edge transport was unavailable; EF-REG-017, EF-REG-022, EF-REG-023, and EF-REG-024 were not run because their safe connected prerequisites were unavailable. The baseline remains unadvanced.

## Scope and environment

- Project: **EXPENSEFLOW** / ExpenseFlow QA (ec245f49-f3da-0200-9a6c-0b4a286e44f7)
- Application URL: `http://localhost:5173`
- Verified mock routes: `http://localhost:5173/?mock=1`, `http://localhost:5173/expenses/new?mock=1`, `http://localhost:5173/expenses?mock=1`, `http://localhost:5173/?mock=1&demo=fail`, `http://localhost:5173/?mock=1&simulateError=1`
- Test Manager: `https://staging.uipath.com` / `testcloud_team` / `TAM`
- Browser: Google Chrome for the mock run; connected Edge automation was masked/unavailable.
- Executed by: `jeet.doshi@uipath.com`
- Approved/source baseline SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`
- Current SHA: `8300fa5ce4532daa873fb8cd5a73b660d866278b`
- Change context: the prior Finance month-end correction uses the actual last day of the month rather than a hard-coded `-31` bound; the six-case scope also covers live policy, URL-switch, approval-link, external-completion, and empty-Finance behaviors.
- PR/commit identifier: no separate PR identifier was present in the reconciled artifacts.

## Coverage totals

| Scope | Cases | Steps | Passed | Failed | Blocked | Restricted |
|---|---:|---:|---:|---:|---:|---:|
| Previously reconciled QA catalog | 24 | 63 | 46 | 3 | 13 | 1 |
| This six-case run | 6 | 30 | 4 | 1 | 24 | 1 |
| **Cumulative** | **30** | **93** | **50** | **4** | **37** | **2** |

| Cumulative case classification | Count |
|---|---:|
| Passed | 14 |
| Failed | 4 |
| Blocked | 10 |
| Restricted | 2 |

## Six-case outcome

| Stable ID | Test Manager case | QA classification | TM result | Execution |
|---|---|---|---|---|
| EF-REG-015 | EF-REG-015 - Finance month-end bounds include actual last days for 28, 29, and 30-day months | Restricted | None | [8e0c48b5-3012-0e00-a4d4-0b4a2a3a23e3](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/8e0c48b5-3012-0e00-a4d4-0b4a2a3a23e3) |
| EF-REG-017 | EF-REG-017 - Live policy change between display and submit uses current threshold | Blocked / not run | Not run | Not run |
| EF-REG-018 | EF-REG-018 - URL switches persist across navigation and disable cleanly after removal | Failed | Failed | [48211cc8-7b12-0e00-28cd-0b4a2a3ec74a](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/48211cc8-7b12-0e00-28cd-0b4a2a3ec74a) |
| EF-REG-022 | EF-REG-022 - Over-threshold submission creates one linked approval task | Blocked / not run | Not run | Not run |
| EF-REG-023 | EF-REG-023 - External task completion conflict prevents duplicate app decision | Blocked / not run | Not run | Not run |
| EF-REG-024 | EF-REG-024 - Empty Finance dataset renders zero aggregates and no-data state | Blocked / not run | Not run | Not run |

## Expected versus actual step results

### EF-REG-015 — Restricted

| # | Expected | Actual / evidence | Result | TM step log |
|---:|---|---|---|---|
| 1 | The isolated dataset contains the planned last-day and outside-range records with recorded expected counts and totals. | Blocked before connected fixture seeding: Edge remained on the verified ExpenseFlow URL, but the attached screen was masked and both accessibility extraction and DOM inspection returned the same COM transport error. No connected data was submitted or mutated.<br>[evidence](../traces/EF-REG-015-20260924T122300-step-f80b429e-17c4-0e00-b112-0b4a2a2bd9e9-execution-trace.json) | Restricted (Restricted) | `22c86854-f010-4649-8a4a-08df19d74366` |
| 2 | Each query completes without a Data Fabric 400 or invalid-date error, and the selected range is shown correctly. | Not run because the connected browser transport was unavailable before fixture seeding could be verified. | Not run (Blocked) | `5acb6e48-b18b-48f6-8a4b-08df19d74366` |
| 3 | The 28th and 29th day records are included exactly once, the next-day controls are excluded, and no stale month rows remain. | Not run because the connected browser transport was unavailable before fixture seeding could be verified. | Not run (Blocked) | `4d1a14a5-ca25-4ea6-8a4c-08df19d74366` |
| 4 | The April 30th record is included, April 31st is never queried, and the Finance count and total equal the expected boundary-inclusive values. | Not run because the connected browser transport was unavailable before fixture seeding could be verified. | Not run (Blocked) | `445d0be0-a029-4032-8a4d-08df19d74366` |
| 5 | Boundary records remain stable after refresh and range changes; no off-by-one, duplicate, timezone-shifted, or stale aggregate appears. | Not run because the connected browser transport was unavailable before fixture seeding could be verified. | Not run (Blocked) | `8bc0327d-f2e3-4fbd-8a4e-08df19d74366` |

### EF-REG-017 — Blocked

| # | Expected | Actual / evidence | Result | TM step log |
|---:|---|---|---|---|
| 1 | The form displays the initial policy context and the original asset value is recorded for later restoration. | Not run: the connected threshold-change fixture required a writable policy asset and an isolated restoration window that were not safely available. No asset or expense mutation was attempted. | None (Blocked) | — |
| 2 | The asset read succeeds and the open form still represents the earlier display state while the live value is now 30000. | Not run: the connected threshold-change fixture required a writable policy asset and an isolated restoration window that were not safely available. No asset or expense mutation was attempted. | None (Blocked) | — |
| 3 | The submit path evaluates the live 30000 threshold rather than the cached 25000 value; the user-facing decision/routing is correct for 27500 versus 30000. | Not run: the connected threshold-change fixture required a writable policy asset and an isolated restoration window that were not safely available. No asset or expense mutation was attempted. | None (Blocked) | — |
| 4 | The persisted record and policy note reflect the live 30000 decision, no stale 25000 decision is recorded, and no duplicate record or task is created. | Not run: the connected threshold-change fixture required a writable policy asset and an isolated restoration window that were not safely available. No asset or expense mutation was attempted. | None (Blocked) | — |
| 5 | The original policy value is restored and the synthetic record remains a single intact audit object. | Not run: the connected threshold-change fixture required a writable policy asset and an isolated restoration window that were not safely available. No asset or expense mutation was attempted. | None (Blocked) | — |

### EF-REG-018 — Failed

| # | Expected | Actual / evidence | Result | TM step log |
|---:|---|---|---|---|
| 1 | The mock=1 switch remains present after each client-side navigation and every screen renders from the mock service without an OAuth or connected-mode dependency. | Observed: Loaded http://localhost:5173/?mock=1 in Chrome and verified the mock=1 switch remained present across the observed app route/navigation state; seeded mock dashboard rendered without OAuth or connected-mode dependency.<br>[evidence](../traces/EF-REG-018-20260924T124500-step-bde52cbd-21c4-0e00-fe32-0b4a2a2c2064-execution-trace.json) | Passed (Passed) | `286c0ef1-6809-4ea9-0c61-08df19cef660` |
| 2 | The two-segment route is reached by clicking, the switch is preserved, and navigation does not create an extra duplicate history entry for the same transition. | Observed: In-app navigation reached /expenses/new?mock=1 and returned to /expenses?mock=1; history length advanced from 3 to 4 to 5 without dropping mock=1, and both pages rendered.<br>[evidence](../traces/EF-REG-018-20260924T124500-step-c714fd72-22c4-0e00-a394-0b4a2a2c215a-execution-trace.json) | Passed (Passed) | `d4d321a0-4025-43c2-0c62-08df19cef660` |
| 3 | The first submit shows the translated recoverable failure and preserves form data; the failure is consumed and the retry succeeds without a false success on the first attempt. | Observed: With synthetic values description=Mock retry expense, category=Travel, amount=4800, date=2026-09-24, the first submit showed the translated recoverable failure, preserved all values, exposed Submit Expense retry, and showed no raw exception. The second submit produced the same translated failure again; expected one-shot consumption and retry success were not observed because ?demo=fail remained armed on every submit in the current build.<br>[evidence](../traces/EF-REG-018-20260924T124500-step-337e7d05-23c4-0e00-d931-0b4a2a2c222b-execution-trace.json) | Failed (Failed) | `e0415000-baa2-4302-0c63-08df19cef660` |
| 4 | The simulated read failure remains active across client-side navigation, shows the translated error/retry state without a raw exception, and does not create a connected request. | Observed: http://localhost:5173/?mock=1&simulateError=1 rendered the translated read error state: Something went wrong / Could not reach the expense service / Try again. No raw exception, stack trace, or uncaught error text was present.<br>[evidence](../traces/EF-REG-018-20260924T124500-step-1d8cf55b-24c4-0e00-12d6-0b4a2a2c230a-execution-trace.json) | Passed (Passed) | `affa5b58-1868-4d18-0c64-08df19cef660` |
| 5 | The simulated failure and demo switch are no longer active after hard load; normal mock data renders, the URL contains only the intended remaining query state, and history remains coherent. | Observed: Hard-loaded http://localhost:5173/?mock=1 after removing failure switches. All four seeded expenses rendered, demo and simulateError were absent from the URL, no error state or raw exception was present, and Dashboard, My Expenses, New Expense, Approvals, and Finance navigation links were available.<br>[evidence](../traces/EF-REG-018-20260924T124500-step-a141a5ca-25c4-0e00-cba5-0b4a2a2c23d5-execution-trace.json) | Passed (Passed) | `0e6842ce-d047-4444-0c65-08df19cef660` |

### EF-REG-022 — Blocked

| # | Expected | Actual / evidence | Result | TM step log |
|---:|---|---|---|---|
| 1 | The amount is confirmed above the live threshold, the intended folder/task facts are recorded, and the isolated scope has no prior matching record or task. | Not run: no safe connected approval-task fixture and verified isolated folder/task scope were available for this execution. No connected submission was issued. | None (Blocked) | — |
| 2 | Exactly one Data Fabric expense record is created and the user-facing result states that manager approval is required; no duplicate submit is issued. | Not run: no safe connected approval-task fixture and verified isolated folder/task scope were available for this execution. No connected submission was issued. | None (Blocked) | — |
| 3 | Exactly one task exists in the intended folder; title, priority, payload, amount, expense code, employee/decision facts, and approval reason match the submitted record without secrets. | Not run: no safe connected approval-task fixture and verified isolated folder/task scope were available for this execution. No connected submission was issued. | None (Blocked) | — |
| 4 | ApprovalTaskId is persisted as text, matches the single Action Center task id, and the record remains navigable with consistent PendingApproval/task-link data. | Not run: no safe connected approval-task fixture and verified isolated folder/task scope were available for this execution. No connected submission was issued. | None (Blocked) | — |
| 5 | No additional record or task is created; the original record and task identifiers remain stable and the linked approval state is idempotent. | Not run: no safe connected approval-task fixture and verified isolated folder/task scope were available for this execution. No connected submission was issued. | None (Blocked) | — |

### EF-REG-023 — Blocked

| # | Expected | Actual / evidence | Result | TM step log |
|---:|---|---|---|---|
| 1 | The expense is PendingApproval, the task link is present, and the original record/task snapshot is captured before the race. | Not run: no isolated pending approval record/task and separate approved external-completion channel were available. No race or decision mutation was attempted. | None (Blocked) | — |
| 2 | The Action Center task reaches its completed state and the external decision is recorded once. | Not run: no isolated pending approval record/task and separate approved external-completion channel were available. No race or decision mutation was attempted. | None (Blocked) | — |
| 3 | The app returns the specific already-completed-task conflict message; it does not show a false success or raw exception. | Not run: no isolated pending approval record/task and separate approved external-completion channel were available. No race or decision mutation was attempted. | None (Blocked) | — |
| 4 | The Data Fabric record has no second decision mutation or duplicate comment, the task remains completed, and no second task is created. | Not run: no isolated pending approval record/task and separate approved external-completion channel were available. No race or decision mutation was attempted. | None (Blocked) | — |
| 5 | The completed-task conflict remains accurately represented, no duplicate decision/task appears, and the original record/task identifiers remain stable. | Not run: no isolated pending approval record/task and separate approved external-completion channel were available. No race or decision mutation was attempted. | None (Blocked) | — |

### EF-REG-024 — Blocked

| # | Expected | Actual / evidence | Result | TM step log |
|---:|---|---|---|---|
| 1 | The selected scope contains no aggregate-eligible records; any Draft-only control is explicitly identified and excluded from expected Finance results. | Not run: no isolated connected empty-month data scope was available. No connected data cleanup or mutation was attempted. | None (Blocked) | — |
| 2 | Finance renders zero count and zero total without NaN, undefined, stale values, a raw exception, or a Data Fabric 400. | Not run: no isolated connected empty-month data scope was available. No connected data cleanup or mutation was attempted. | None (Blocked) | — |
| 3 | The month presentation is the documented null/no-data state rather than an invented date, and the date range remains valid without issuing an invalid query. | Not run: no isolated connected empty-month data scope was available. No connected data cleanup or mutation was attempted. | None (Blocked) | — |
| 4 | The attention area shows its intentional empty state, Draft-only data is not classified as attention, and the table/pager do not display phantom rows or invalid navigation. | Not run: no isolated connected empty-month data scope was available. No connected data cleanup or mutation was attempted. | None (Blocked) | — |
| 5 | Zero aggregates, the no-data presentation, and the empty attention state remain stable; no rows or totals from a prior dataset reappear. | Not run: no isolated connected empty-month data scope was available. No connected data cleanup or mutation was attempted. | None (Blocked) | — |

## Test Manager reconciliation

- **EF-REG-015**: execution [8e0c48b5-3012-0e00-a4d4-0b4a2a3a23e3](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/8e0c48b5-3012-0e00-a4d4-0b4a2a3a23e3); case log `952ac6e9-1971-7300-5087-0b4a2a3a240d`; status Finished; Test Manager stats 0 Passed / 0 Failed / 1 None; one restricted step attachment uploaded.
- **EF-REG-018**: execution [48211cc8-7b12-0e00-28cd-0b4a2a3ec74a](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/48211cc8-7b12-0e00-28cd-0b4a2a3ec74a); case log `2b3e03c3-0b72-7300-c5d4-0b4a2a3ec772`; status Finished; Test Manager stats 0 Passed / 1 Failed / 0 None; five of five step trace attachments uploaded.
- EF-REG-017, EF-REG-022, EF-REG-023, and EF-REG-024: no Test Manager execution history; no duplicate execution was created.

## Failure analysis

- **New EF-REG-018 failure**: the expected one-shot `?demo=fail` failure was not consumed. The first submit correctly displayed a translated recoverable error and preserved the synthetic form values, but the retry displayed the same error again. The current `failIfDemoFailureArmed` implementation re-reads the URL on every submit, so the switch remains armed until removed.
- **EF-REG-015 restriction**: Edge pixels were masked and DOM/accessibility transport returned a COM error before connected fixture seeding; this is an evidence/environment limitation, not a product failure.
- **Prior known failures retained**: EF-SMOKE-007 (unknown expense route empty root) and EF-SMOKE-010 (narrow-view page overflow).
- **Prior EF-REG-014 issue**: the Finance month-end invalid-date failure was not reproduced after the actual-last-day fix.

## Evidence and limitations

- Manifest: [execution-manifest-20260924T124500-six-cases.json](../state/execution-manifest-20260924T124500-six-cases.json)
- EF-REG-015 results: [execution-results-20260924T122300-EF-REG-015.json](../state/execution-results-20260924T122300-EF-REG-015.json)
- EF-REG-018 results: [execution-results-20260924T124500-EF-REG-018.json](../state/execution-results-20260924T124500-EF-REG-018.json)
- EF-REG-015 trace manifest: [evidence](../traces/EF-REG-015-20260924T122300-execution-traces.json); raw trace: [evidence](../traces/EF-REG-015-20260924T122300.json)
- EF-REG-018 trace manifest: [evidence](../traces/EF-REG-018-20260924T124500-execution-traces.json); raw trace: [evidence](../traces/EF-REG-018-20260924T124500.json)
- All six executed/restricted step traces were uploaded to Test Manager (EF-REG-015: 1/5; EF-REG-018: 5/5).
- Four blocked cases have no trace or Test Manager execution because the required safe connected fixtures, identities, task scope, or empty data scope were unavailable.
- `ChecklistPath` pointed to `C:/Users/jeet.doshi/AppData/Roaming/UiPath Assistant/projects/2067b7a7-f53d-47f7-8d27-e319ed02aaea/checklist.md`, but the file was absent; no checklist rows were invented or changed.

## Baseline decision

- Last successful baseline SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57` was not promoted; the existing rollup remains `lastSuccessfulBaselineSha: null`.
- Baseline advanced: **false**.
- Reason: EF-REG-018 has a confirmed failure, EF-REG-015 is restricted, four cases remain blocked/not run, and prior confirmed product failures remain open.

## Artifact paths

- `qa-artifacts/state/execution-manifest-20260924T124500-six-cases.json`
- `qa-artifacts/reports/expenseflow-qa-six-case-20260924T124500.md`
- `qa-artifacts/reports/expenseflow-qa-six-case-20260924T124500.html`
