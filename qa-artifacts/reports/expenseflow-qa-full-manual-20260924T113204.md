# ExpenseFlow QA — full manual execution of all Test Manager cases — 20260924T113204

Generated: 2026-09-24 11:32 UTC

## Decision

All 31 cases in project EXPENSEFLOW were executed (or explicitly classified) and results, step logs and screenshots were published to Test Manager. **19 passed, 4 failed, 5 restricted (partially executed), 3 blocked.** The baseline is **not** advanced.

## Scope and environment

- Project: EXPENSEFLOW (ec245f49-f3da-0200-9a6c-0b4a286e44f7); Test Manager tenant: https://staging.uipath.com / testcloud_team / TAM
- App URL: `http://localhost:5173` (Vite dev server, verified reachable). Mock cases used `?mock=1`; connected cases ran against the staging tenant (Data Fabric entity `ExpenseFlow_Expense`, Action Center folder `Shared`, bucket `ExpenseFlow_Receipts`).
- Browser: Microsoft Edge driven with Playwright. Connected cases used your Edge staging SSO session via a temporary profile copy (Edge was stopped with your approval to release the cookie lock; the copy was deleted after the run). Mock cases used a clean Edge profile.
- Baseline SHA: none recorded (`lastSuccessfulBaselineSha` = null); current HEAD `8ccbb1c11d36088a36900e737ea0951854a72b65`. This was a catalog execution, not a change-range scan, so no commit/PR delta was analysed.
- Synthetic data only (`EFREG*`, `EFQA-20260924T*`); records and Action Center tasks created are retained for audit (see limitations).
- Execution method: steps were driven by Playwright scripts with per-step assertions; every screenshot was captured by the script and uploaded to the matching Test Manager step log. Spot checks of screenshots and a round-trip download from Test Manager were done, not every image was viewed.

## Totals

| Case result | Count |
|---|---:|
| Passed | 19 |
| Failed | 4 |
| Restricted | 5 |
| Blocked | 3 |
| **Cases** | **31** |

| Step result | Count |
|---|---:|
| Blocked | 14 |
| Failed | 4 |
| Passed | 75 |
| Restricted | 9 |

Screenshot/evidence attachments uploaded to Test Manager: 140 of 140 attempted.

## Case summary

| Stable ID | Result | Steps (P/F/R/B) | Test Manager execution |
|---|---|---|---|
| EF-SMOKE-001 | PASS | 3/0/0/0 | [a5286adb](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/a5286adb-2a13-0e00-afde-0b4a2a51c3a4) |
| EF-SMOKE-002 | PASS | 4/0/0/0 | [8b628bc4](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/8b628bc4-2d13-0e00-066e-0b4a2a5293fa) |
| EF-SMOKE-003 | PASS | 3/0/0/0 | [79f7a082](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/79f7a082-2e13-0e00-0fc0-0b4a2a52a586) |
| EF-SMOKE-004 | PASS | 3/0/0/0 | [0c41f171](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/0c41f171-2f13-0e00-25b5-0b4a2a52b60d) |
| EF-SMOKE-005 | PASS | 3/0/0/0 | [8ff3ad9b](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/8ff3ad9b-3013-0e00-1897-0b4a2a52c98e) |
| EF-SMOKE-006 | PASS | 2/0/0/0 | [c1635629](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/c1635629-3213-0e00-692e-0b4a2a52d6da) |
| EF-SMOKE-007 | PASS | 2/0/0/0 | [79131249](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/79131249-3313-0e00-a9c3-0b4a2a52e27c) |
| EF-SMOKE-008 | PASS | 3/0/0/0 | [f971f2aa](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/f971f2aa-3413-0e00-5a41-0b4a2a52ef4a) |
| EF-SMOKE-009 | PASS | 3/0/0/0 | [acf0c20e](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/acf0c20e-3513-0e00-5691-0b4a2a530075) |
| EF-SMOKE-010 | FAIL | 2/1/0/0 | [d686ac26](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/d686ac26-3613-0e00-6eaa-0b4a2a530f99) |
| EF-SMOKE-011 | PASS | 5/0/0/0 | [b4d16f2e](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/b4d16f2e-3713-0e00-ad28-0b4a2a53234d) |
| EF-REG-001 | PASS | 5/0/0/0 | [6d97fdbb](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/6d97fdbb-0014-0e00-5511-0b4a2a5ea3dd) |
| EF-REG-002 | PASS | 2/0/0/0 | [3ced9cca](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/3ced9cca-0114-0e00-42fb-0b4a2a5ec28f) |
| EF-REG-003 | PASS | 2/0/0/0 | [a121ff4e](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/a121ff4e-0214-0e00-a9f1-0b4a2a5edd25) |
| EF-REG-004 | RESTRICTED | 2/0/1/0 | [a9d7d08d](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/a9d7d08d-0314-0e00-de0e-0b4a2a5eee2c) |
| EF-REG-005 | PASS | 3/0/0/0 | [8ca10f43](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/8ca10f43-0414-0e00-bc47-0b4a2a5f0383) |
| EF-REG-006 | PASS | 4/0/0/0 | [b131f1b8](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/b131f1b8-0514-0e00-2e0a-0b4a2a5f1ca7) |
| EF-REG-007 | RESTRICTED | 1/0/1/0 | [da7b6ea2](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/da7b6ea2-0614-0e00-230d-0b4a2a5f4159) |
| EF-REG-008 | PASS | 3/0/0/0 | [7087bb11](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/7087bb11-0714-0e00-598d-0b4a2a5f4f3e) |
| EF-REG-009 | RESTRICTED | 1/0/1/0 | [28a0f5d4](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/28a0f5d4-0814-0e00-b4af-0b4a2a5f6389) |
| EF-REG-010 | FAIL | 0/1/1/0 | [6579cd78](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/6579cd78-0914-0e00-af2f-0b4a2a5f7035) |
| EF-REG-011 | RESTRICTED | 1/0/1/0 | [e1915076](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/e1915076-3813-0e00-04f6-0b4a2a533539) |
| EF-REG-012 | FAIL | 1/1/0/1 | [c2b7f0bc](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/c2b7f0bc-0b14-0e00-e49d-0b4a2a5f7e0e) |
| EF-REG-013 | BLOCKED | 0/0/0/2 | [237b66db](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/237b66db-0c14-0e00-bbd5-0b4a2a5f8bb2) |
| EF-REG-014 | PASS | 3/0/0/0 | [4cb10781](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/4cb10781-0d14-0e00-c89d-0b4a2a5f9a39) |
| EF-REG-015 | RESTRICTED | 0/0/4/1 | [54b93d09](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/54b93d09-0e14-0e00-5968-0b4a2a5fad01) |
| EF-REG-017 | BLOCKED | 0/0/0/5 | [ee14a5ba](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/ee14a5ba-0f14-0e00-2e2b-0b4a2a5fbc59) |
| EF-REG-018 | FAIL | 4/1/0/0 | [5bab3371](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/5bab3371-3b13-0e00-7033-0b4a2a53511a) |
| EF-REG-022 | PASS | 5/0/0/0 | [12b4a353](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/12b4a353-1014-0e00-5347-0b4a2a5fc8b7) |
| EF-REG-023 | PASS | 5/0/0/0 | [1bf1ff18](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/1bf1ff18-1214-0e00-dc5f-0b4a2a5fdc73) |
| EF-REG-024 | BLOCKED | 0/0/0/5 | [817bf195](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/817bf195-1614-0e00-82fd-0b4a2a5fedd4) |

## Failures (product behaviour differs from expected)

- **EF-SMOKE-010 step 3** — expected: Tables use their guarded overflow container; controls remain reachable without page-level horizontal breakage.
  - actual: ✘ MyExpenses @375px: page scrollWidth 447 vs clientWidth 375 → PAGE-LEVEL HORIZONTAL OVERFLOW | ✘ Approvals @375px: page scrollWidth 449 vs clientWidth 375 → PAGE-LEVEL HORIZONTAL OVERFLOW | ✘ Finance @375px: page scrollWidth 448 vs clientWidth 375 → PAGE-LEVEL HORIZONTAL OVERFLOW
- **EF-REG-010 step 1** — expected: The detail page remains usable and receipt access failure is handled without leaking implementation details.
  - actual: ✔ detail renders with an interactive receipt chip for a record whose bucket object was never uploaded | after opening the unavailable receipt: alert="ExpenseFlow could not open the receipt from UiPath: BlobFileInfo does not exist."; new tab opened=false | ✔ detail page remains usable | ✔ the failure is surfaced (inline alert or blob 404 tab) rather than silently ignored | failure condition: natural (bucket object absent for the seeded fixture); no fault injection, no credential or network manipulation | ✘ no implementation details (storage host, signature, stack, provider type names such as Bl
- **EF-REG-012 step 3** — expected: OAuth keys are removed after completion while mock and demo switches remain.
  - actual: chain: localhost:5173/ -> localhost:5173/ -> localhost:5173/expenses?demo&foo -> localhost:5173/expenses?demo&foo -> localhost:5173/?code&state&iss -> localhost:5173/?code&state&iss -> localhost:5173/?iss -> localhost:5173/ | final URL after real OAuth completion: /(no query) | ✔ OAuth keys (code/state/session_state/iss) removed after completion | ✘ non-OAuth keys demo=fail and foo=bar remain after the callback (observed: dropped — the OAuth redirect returns to the app root, so the original path and query were lost)
- **EF-REG-018 step 3** — expected: The first submit shows the translated recoverable failure and preserves form data; the failure is consumed and the retry succeeds without a false success on the first attempt.
  - actual: ✔ first submit: translated recoverable failure, no false success | ✔ form data preserved | URL at second submit: http://localhost:5173/expenses/new?mock=1&demo=fail | ✘ second submit succeeds (one-shot failure consumed)

## Step results

### EF-SMOKE-001 - Mock dashboard renders deterministic employee totals — Passed

Test Manager: case `EXPENSEFLOW:3`, execution `a5286adb-2a13-0e00-afde-0b4a2a51c3a4`, case log `26880590-3c7e-7300-0ef1-0b4a2a51c3be`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | No OAuth prompt appears and the dashboard loads successfully. | ✔ URL stayed on http://localhost:5173/?mock=1 (no OAuth redirect) / ✔ Dashboard greeting rendered | PASS | [EF-SMOKE-001-step1-dashboard.png](../screenshots/20260924T093500/EF-SMOKE-001-step1-dashboard.png) |
| 2 | Submitted is ₹48,250 / 4 expenses; Approved is ₹31,800 / 2 expenses; Pending is ₹16,450 / 2 expenses. | ✔ Submitted ₹48,250 / 4 expenses / ✔ Approved ₹31,800 / 2 expenses / ✔ Pending ₹16,450 / 2 expenses | PASS | [EF-SMOKE-001-step2-kpi-cards.png](../screenshots/20260924T093500/EF-SMOKE-001-step2-kpi-cards.png) |
| 3 | Recent employee rows render; New Expense and View all actions are available; drafts EXP-1003 and EXP-1004 do not contribute to KPI totals. | ✔ Recent expense rows render / ✔ Drafts EXP-1003/EXP-1004 listed as Draft / ✔ New Expense action visible / ✔ View all action visible / ✔ KPI total still excludes draft amounts (₹18,500 + ₹2,500) | PASS | [EF-SMOKE-001-step3-recent-expenses.png](../screenshots/20260924T093500/EF-SMOKE-001-step3-recent-expenses.png) |

### EF-SMOKE-002 - Employee list filtering, sorting, clearing, and pagination — Passed

Test Manager: case `EXPENSEFLOW:4`, execution `8b628bc4-2d13-0e00-066e-0b4a2a5293fa`, case log `69b11b41-497e-7300-1d56-0b4a2a529412`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | My Expenses loads with Rahul's expenses initially ordered newest first. | ✔ My Expenses opened: http://localhost:5173/expenses?mock=1 / ✔ first row is newest (EXP-1001, 18 Aug 2026); order EXP-1001,EXP-1002,EXP-1003,EXP-1004,EXP-1007,EXP-1005 | PASS | [EF-SMOKE-002-step1-list-default.png](../screenshots/20260924T093500/EF-SMOKE-002-step1-list-default.png) |
| 2 | Draft returns EXP-1003 and EXP-1004; adding Office leaves EXP-1004 only. | ✔ Draft → EXP-1003,EXP-1004 / ✔ Draft+Office → EXP-1004 | PASS | [EF-SMOKE-002-step2-status-draft.png](../screenshots/20260924T093500/EF-SMOKE-002-step2-status-draft.png)<br>[EF-SMOKE-002-step2-draft-office.png](../screenshots/20260924T093500/EF-SMOKE-002-step2-draft-office.png) |
| 3 | An empty filtered state appears, then the full employee list returns after clearing. | ✔ no rows for 2027-01-01..2027-01-31 / main text after exclusion: L EXPENSES My expenses 0 records No expenses match these filters Widen the date range or clear a filter to see more. Clear filters / ✔ after Clear, full list of 6 returns | PASS | [EF-SMOKE-002-step3-empty-state.png](../screenshots/20260924T093500/EF-SMOKE-002-step3-empty-state.png)<br>[EF-SMOKE-002-step3-cleared.png](../screenshots/20260924T093500/EF-SMOKE-002-step3-cleared.png) |
| 4 | Sort directions and indicators are correct; pagination clamps to page 1 with visible results. | ✔ Expense toggles ascending → descending and reorders rows / ✔ Category toggles ascending → descending and reorders rows / ✔ Date toggles descending → ascending and reorders rows / ✔ Amount toggles descending → ascending and reorders rows / ✔ Status toggles ascending → descending and reorders rows / aria-sort: Expense:ascending/descending; Category:ascending/descending; Date:descending/ascending; Amount:descending/ascending; Status:ascending/descending / ✔ seeded list shows "Showing 1–25 of 26" / ✔ page 2 footer: Showing 26–26 of 26, Page 2 of 2 / ✔ filter to Drafts from page 2 clamps to page 1: footer "Showing 1–2 of 2", 2 visible rows, no pager (single page) | PASS | [EF-SMOKE-002-step4-sorted.png](../screenshots/20260924T093500/EF-SMOKE-002-step4-sorted.png)<br>[EF-SMOKE-002-step4-page2.png](../screenshots/20260924T093500/EF-SMOKE-002-step4-page2.png)<br>[EF-SMOKE-002-step4-clamped.png](../screenshots/20260924T093500/EF-SMOKE-002-step4-clamped.png) |

### EF-SMOKE-003 - Valid mock expense submission updates shared UI state — Passed

Test Manager: case `EXPENSEFLOW:5`, execution `79f7a082-2e13-0e00-0fc0-0b4a2a52a586`, case log `c371a15f-4a7e-7300-63e8-0b4a2a52a5be`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The New Expense form renders. | ✔ New Expense form rendered at http://localhost:5173/expenses/new?mock=1 | PASS | [EF-SMOKE-003-step1-form.png](../screenshots/20260924T093500/EF-SMOKE-003-step1-form.png) |
| 2 | A success confirmation identifies a generated EXP-* code; a fresh mock session starts new codes at EXP-1013. | ✔ success confirmation identifies EXP-1013: "EXP-1013 submitted for ₹4,800. See it on your dashboard or open the expense. EXP-1013 submitted for ₹4,800 — Submitted." | PASS | [EF-SMOKE-003-step2-form-filled.png](../screenshots/20260924T093500/EF-SMOKE-003-step2-form-filled.png)<br>[EF-SMOKE-003-step2-confirmation.png](../screenshots/20260924T093500/EF-SMOKE-003-step2-confirmation.png) |
| 3 | The new row is Submitted and shared dashboard/list state reflects it. | ✔ confirmation exposes a link to the new expense / ✔ opened detail http://localhost:5173/expenses/EXP-1013?mock=1 / ✔ My Expenses lists EXP-1013 as Submitted / ✔ record count is now 7 / ✔ dashboard Submitted total now ₹53,050 / 5 expenses (48,250 + 4,800) | PASS | [EF-SMOKE-003-step3-detail.png](../screenshots/20260924T093500/EF-SMOKE-003-step3-detail.png)<br>[EF-SMOKE-003-step3-list.png](../screenshots/20260924T093500/EF-SMOKE-003-step3-list.png)<br>[EF-SMOKE-003-step3-dashboard.png](../screenshots/20260924T093500/EF-SMOKE-003-step3-dashboard.png) |

### EF-SMOKE-004 - Local form validation and cancellation preserve data integrity — Passed

Test Manager: case `EXPENSEFLOW:6`, execution `0c41f171-2f13-0e00-25b5-0b4a2a52b60d`, case log `f775cc55-4b7e-7300-2f7d-0b4a2a52b626`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Required-description and amount validation errors appear; no expense is created. | ✔ empty description → validation error: Description / Give the expense a description so your manager knows what it is. / ✔ amount 0 → validation error: Amount / Enter an amount greater than ₹0. / non-numeric typed into number input → input value "" (browser rejects letters) / ✔ non-numeric/empty amount → validation error / ✔ no expense created (still 6 records) | PASS | [EF-SMOKE-004-step1-no-description.png](../screenshots/20260924T093500/EF-SMOKE-004-step1-no-description.png)<br>[EF-SMOKE-004-step1-zero-amount.png](../screenshots/20260924T093500/EF-SMOKE-004-step1-zero-amount.png)<br>[EF-SMOKE-004-step1-nonnumeric-amount.png](../screenshots/20260924T093500/EF-SMOKE-004-step1-nonnumeric-amount.png) |
| 2 | A required-date validation error appears; no expense is created. | ✔ cleared date → required-date error: Date / Pick the date the expense was incurred. / ✔ no expense created (6 records) | PASS | [EF-SMOKE-004-step2-no-date.png](../screenshots/20260924T093500/EF-SMOKE-004-step2-no-date.png) |
| 3 | My Expenses opens without success confirmation or a new row. | ✔ Cancel opened My Expenses: http://localhost:5173/expenses?mock=1 / ✔ no new row; still 6 records / ✔ no success confirmation displayed | PASS | [EF-SMOKE-004-step3-valid-before-cancel.png](../screenshots/20260924T093500/EF-SMOKE-004-step3-valid-before-cancel.png)<br>[EF-SMOKE-004-step3-after-cancel.png](../screenshots/20260924T093500/EF-SMOKE-004-step3-after-cancel.png) |

### EF-SMOKE-005 - Mock submit failure preserves form data and supports recovery — Passed

Test Manager: case `EXPENSEFLOW:7`, execution `8ff3ad9b-3013-0e00-1897-0b4a2a52c98e`, case log `624f891d-4c7e-7300-e3ce-0b4a2a52c9a5`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | A friendly submission error appears; no raw exception or success state is shown. | ✔ friendly submission error shown / ✔ no raw exception text / ✔ no success state | PASS | [EF-SMOKE-005-step1-error.png](../screenshots/20260924T093500/EF-SMOKE-005-step1-error.png) |
| 2 | Entered values remain, Submit is re-enabled, and inline/toast error feedback is available. | ✔ description preserved / ✔ amount preserved / ✔ Submit re-enabled / ✔ inline alert/toast error feedback present | PASS | [EF-SMOKE-005-step2-form-after-failure.png](../screenshots/20260924T093500/EF-SMOKE-005-step2-form-after-failure.png) |
| 3 | Submission succeeds normally. | ✔ submission succeeds normally (EXP-1013 confirmation) | PASS | [EF-SMOKE-005-step3-success.png](../screenshots/20260924T093500/EF-SMOKE-005-step3-success.png) |

### EF-SMOKE-006 - Expense detail renders status, policy, receipt, and timeline — Passed

Test Manager: case `EXPENSEFLOW:8`, execution `c1635629-3213-0e00-692e-0b4a2a52d6da`, case log `111bc5f7-4f7e-7300-887c-0b4a2a52d713`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Detail page shows code, description, Submitted/Pending status, amount, category, date, employee, receipt, policy, and submitted timeline data. | ✔ opened via table row: http://localhost:5173/expenses/EXP-1007?mock=1 / ✔ detail shows "EXP-1007" / ✔ detail shows "Customer conference travel" / ✔ detail shows "Pending Approval" / ✔ detail shows "₹11,650" / ✔ detail shows "Travel" / ✔ detail shows "12 Aug 2026" / ✔ detail shows "Rahul Mehta" / ✔ detail shows "mumbai-trip.pdf" / ✔ detail shows "Within the ₹25,000 threshold" / ✔ detail shows "Submitted 12 Aug 2026" | PASS | [EF-SMOKE-006-step1-detail.png](../screenshots/20260924T093500/EF-SMOKE-006-step1-detail.png) |
| 2 | Receipt affordance is available and the back action returns to the list. | ✔ receipt affordance (mumbai-trip.pdf) visible / receipt element: SPAN(text) / ✔ Back to my expenses returned to list | PASS | [EF-SMOKE-006-step2-back-to-list.png](../screenshots/20260924T093500/EF-SMOKE-006-step2-back-to-list.png) |

### EF-SMOKE-007 - Unknown expense and unknown route render recovery states — Passed

Test Manager: case `EXPENSEFLOW:9`, execution `79131249-3313-0e00-a9c3-0b4a2a52e27c`, case log `6c00fcff-507e-7300-3c6a-0b4a2a52e370`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Expense not found state names the unknown code and offers Back to my expenses. | ✔ Expense not found state names EXP-9999 / ✔ Back to my expenses offered / body text length 312 (prior run observed empty root) | PASS | [EF-SMOKE-007-step1-not-found.png](../screenshots/20260924T093500/EF-SMOKE-007-step1-not-found.png) |
| 2 | Not Found page renders with a route back to the application. | ✔ Not Found page renders / ✔ route back to application offered / ✔ Back to dashboard works | PASS | [EF-SMOKE-007-step2-unknown-route.png](../screenshots/20260924T093500/EF-SMOKE-007-step2-unknown-route.png) |

### EF-SMOKE-008 - Mock approval queue supports approve, reject, and rework decisions — Passed

Test Manager: case `EXPENSEFLOW:10`, execution `f971f2aa-3413-0e00-5a41-0b4a2a52ef4a`, case log `2eee131f-517e-7300-f70b-0b4a2a52ef81`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Decision-eligible expenses appear in amount-descending queue order with comments and three actions. | ✔ queue order (amount desc 82,000 / 37,550 / 11,650): EXP-1008,EXP-1009,EXP-1007 / ✔ each card has a Comments box / ✔ 3 × Approve buttons / ✔ 3 × Reject buttons / ✔ 3 × Request rework buttons | PASS | [EF-SMOKE-008-step1-queue.png](../screenshots/20260924T093500/EF-SMOKE-008-step1-queue.png) |
| 2 | Success feedback appears and the decided row leaves the queue after refresh. | ✔ success feedback: "EXP-1008 is now Approved." / ✔ EXP-1008 left the queue after refresh; remaining EXP-1009,EXP-1007 | PASS | [EF-SMOKE-008-step2-approved-feedback.png](../screenshots/20260924T093500/EF-SMOKE-008-step2-approved-feedback.png)<br>[EF-SMOKE-008-step2-queue-after-approve.png](../screenshots/20260924T093500/EF-SMOKE-008-step2-queue-after-approve.png) |
| 3 | Each action records its distinct resulting status and removes the card from the decision queue. | ✔ Reject: EXP-1008 card removed from decision queue / ✔ Reject: Finance shows EXP-1008 settled (not in attention list) — distinct resulting status Rejected / ✔ Request rework: EXP-1008 card removed from decision queue / ✔ Request rework: Finance shows EXP-1008 as Needs Rework — distinct resulting status Needs Rework | PASS | [EF-SMOKE-008-step3-Reject-queue.png](../screenshots/20260924T093500/EF-SMOKE-008-step3-Reject-queue.png)<br>[EF-SMOKE-008-step3-Reject-finance.png](../screenshots/20260924T093500/EF-SMOKE-008-step3-Reject-finance.png)<br>[EF-SMOKE-008-step3-Requestrework-queue.png](../screenshots/20260924T093500/EF-SMOKE-008-step3-Requestrework-queue.png)<br>[EF-SMOKE-008-step3-Requestrework-finance.png](../screenshots/20260924T093500/EF-SMOKE-008-step3-Requestrework-finance.png) |

### EF-SMOKE-009 - Finance dashboard classifies seeded attention records — Passed

Test Manager: case `EXPENSEFLOW:11`, execution `acf0c20e-3513-0e00-5691-0b4a2a530075`, case log `5cda53f1-527e-7300-0757-0b4a2a5300ad`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Expenses, Pending, and This month cards render company-level values. | ✔ Expenses card 10 / ₹1,84,450 (company level) / ✔ Pending card 5 / ₹1,38,500 / ✔ This month ₹1.8L, 10 expenses in Aug 2026 | PASS | [EF-SMOKE-009-step1-summary.png](../screenshots/20260924T093500/EF-SMOKE-009-step1-summary.png) |
| 2 | Rows classify Policy Review, Pending Approval, Needs Rework, and Missing Receipt according to seed data. | ✔ EXP-1008 classified Policy Review / ✔ EXP-1009 classified Pending Approval / ✔ EXP-1007 classified Pending Approval / ✔ EXP-1011 classified Needs Rework / ✔ EXP-1006 classified Missing Receipt / ✔ 5 attention rows | PASS | [EF-SMOKE-009-step2-attention.png](../screenshots/20260924T093500/EF-SMOKE-009-step2-attention.png) |
| 3 | Both supported row interactions navigate to the corresponding expense detail. | ✔ click → http://localhost:5173/expenses/EXP-1008?mock=1 / ✔ keyboard Enter → http://localhost:5173/expenses/EXP-1009?mock=1 / keyboard Space → http://localhost:5173/expenses/EXP-1007?mock=1 | PASS | [EF-SMOKE-009-step3-click-nav.png](../screenshots/20260924T093500/EF-SMOKE-009-step3-click-nav.png)<br>[EF-SMOKE-009-step3-keyboard-nav.png](../screenshots/20260924T093500/EF-SMOKE-009-step3-keyboard-nav.png) |

### EF-SMOKE-010 - Core navigation, accessible labels, and narrow-screen overflow remain usable — Failed

Test Manager: case `EXPENSEFLOW:12`, execution `d686ac26-3613-0e00-6eaa-0b4a2a530f99`, case log `066f429f-537e-7300-0e17-0b4a2a530fe1`, TM result **Failed**, stats {"Passed": 0, "Failed": 1, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Each route renders its expected page title and active navigation state. | ✔ Dashboard: h1 "Dashboard", active nav "Dashboard" / ✔ My Expenses: h1 "My expenses", active nav "My Expenses" / ✔ New Expense: h1 "New expense", active nav "New Expense" / ✔ Approvals: h1 "Manager approval", active nav "Approvals" / ✔ Finance: h1 "Finance overview", active nav "Finance" | PASS | [EF-SMOKE-010-step1-Dashboard.png](../screenshots/20260924T093500/EF-SMOKE-010-step1-Dashboard.png)<br>[EF-SMOKE-010-step1-MyExpenses.png](../screenshots/20260924T093500/EF-SMOKE-010-step1-MyExpenses.png)<br>[EF-SMOKE-010-step1-NewExpense.png](../screenshots/20260924T093500/EF-SMOKE-010-step1-NewExpense.png)<br>[EF-SMOKE-010-step1-Approvals.png](../screenshots/20260924T093500/EF-SMOKE-010-step1-Approvals.png)<br>[EF-SMOKE-010-step1-Finance.png](../screenshots/20260924T093500/EF-SMOKE-010-step1-Finance.png) |
| 2 | Interactive controls have discernible labels and feedback is exposed through appropriate status or alert semantics. | ✔ form controls all have accessible names / ✔ validation errors exposed via role=alert / ✔ table has an accessible name (aria-label/caption) / ✔ status/live regions present (toast region) / ✔ filter controls labelled | PASS | [EF-SMOKE-010-step2-form-alert.png](../screenshots/20260924T093500/EF-SMOKE-010-step2-form-alert.png)<br>[EF-SMOKE-010-step2-list-a11y.png](../screenshots/20260924T093500/EF-SMOKE-010-step2-list-a11y.png) |
| 3 | Tables use their guarded overflow container; controls remain reachable without page-level horizontal breakage. | ✘ MyExpenses @375px: page scrollWidth 447 vs clientWidth 375 → PAGE-LEVEL HORIZONTAL OVERFLOW / ✘ Approvals @375px: page scrollWidth 449 vs clientWidth 375 → PAGE-LEVEL HORIZONTAL OVERFLOW / ✘ Finance @375px: page scrollWidth 448 vs clientWidth 375 → PAGE-LEVEL HORIZONTAL OVERFLOW | FAIL | [EF-SMOKE-010-step3-MyExpenses-375.png](../screenshots/20260924T093500/EF-SMOKE-010-step3-MyExpenses-375.png)<br>[EF-SMOKE-010-step3-Approvals-375.png](../screenshots/20260924T093500/EF-SMOKE-010-step3-Approvals-375.png)<br>[EF-SMOKE-010-step3-Finance-375.png](../screenshots/20260924T093500/EF-SMOKE-010-step3-Finance-375.png) |

### EF-SMOKE-011 - Mock read failure renders recovery state and recovers — Passed

Test Manager: case `EXPENSEFLOW:83`, execution `b4d16f2e-3713-0e00-ad28-0b4a2a53234d`, case log `6e5674a6-547e-7300-79fb-0b4a2a532363`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Normal seeded mock data, aggregates, and attention content render without a connected dependency. | ✔ Dashboard normal: KPI ₹48,250 + recent rows / ✔ Finance normal: aggregates + attention | PASS | [EF-SMOKE-011-step1-dashboard-normal.png](../screenshots/20260924T093500/EF-SMOKE-011-step1-dashboard-normal.png)<br>[EF-SMOKE-011-step1-finance-normal.png](../screenshots/20260924T093500/EF-SMOKE-011-step1-finance-normal.png) |
| 2 | The screen renders the translated read-failure message and the intended retry/recovery affordance instead of raw exception text, a stack trace, or a blank unhandled state. | ✔ translated read-failure message shown / ✔ retry affordance visible / ✔ no raw exception/stack / ✔ Finance also shows failure (simulate persists across in-app nav) | PASS | [EF-SMOKE-011-step2-dashboard-error.png](../screenshots/20260924T093500/EF-SMOKE-011-step2-dashboard-error.png)<br>[EF-SMOKE-011-step2-finance-error.png](../screenshots/20260924T093500/EF-SMOKE-011-step2-finance-error.png) |
| 3 | No token, credential, raw request body, stack trace, or connected-service internals are exposed; stale rows and misleading aggregates are not presented as current data. | ✔ no stale rows or aggregates shown on the failed screen / ✔ no token/credential terms exposed / console errors: none | PASS | [EF-SMOKE-011-step3-failed-screen-inspect.png](../screenshots/20260924T093500/EF-SMOKE-011-step3-failed-screen-inspect.png) |
| 4 | Normal mock reads succeed, the expected seeded data/aggregates return, and no duplicate or partial read-side effect is created. | ✔ normal reads succeed after removing simulateError; seeded KPI + rows return | PASS | [EF-SMOKE-011-step4-recovered.png](../screenshots/20260924T093500/EF-SMOKE-011-step4-recovered.png) |
| 5 | Both screens remain healthy after recovery, the error state is cleared, and no stale failure switch or stale error content reappears. | ✔ Finance healthy / ✔ Dashboard healthy / ✔ after refresh: healthy, no stale error / ✔ no stale failure switch in URL: http://localhost:5173/?mock=1 | PASS | [EF-SMOKE-011-step5-healthy-after-refresh.png](../screenshots/20260924T093500/EF-SMOKE-011-step5-healthy-after-refresh.png) |

### EF-REG-001 - Connected submission applies policy threshold routing — Passed

Test Manager: case `EXPENSEFLOW:13`, execution `6d97fdbb-0014-0e00-5511-0b4a2a5ea3dd`, case log `973937e3-4c82-7300-9034-0b4a2a5ea416`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | A connected Data Fabric record is created with the below-threshold outcome defined by the policy service. | confirmation: EXP-1017 submitted for ₹12,000. See it on your dashboard or open the expense. / EXP-1017 submitted for ₹12,000 — Approved. / ✔ below-threshold (₹12,000, receipt attached) created EXP-1017 without approval requirement | PASS | [EF-REG-001-step1-below-threshold.png](../screenshots/20260924T093500/EF-REG-001-step1-below-threshold.png) |
| 2 | The policy warning/routing behavior indicates manager approval is required and the record reflects the above-threshold path. | confirmation: EXP-1018 submitted for ₹35,000. See it on your dashboard or open the expense. / EXP-1018 submitted for ₹35,000 — Pending Approval. / ✔ above-threshold (₹35,000) created EXP-1018; approval-required routing indicated | PASS | [EF-REG-001-step2-above-threshold.png](../screenshots/20260924T093500/EF-REG-001-step2-above-threshold.png) |
| 3 | Amounts, status, and persisted policy notes/routing agree with the current threshold. | ✔ EXP-1017 (low) present in My Expenses after refresh / ✔ EXP-1018 (high) present in My Expenses after refresh / EXP-1017 detail: EXPENSE MANAGEMENT Expense detail RM Rahul Mehta Employee Back to my expenses EXPENSE EXP-1017 EFREG001-Low-EFQA-20260924T1130 Approved Amount ₹12,000 Category Travel Date 24 Sep 2026 Employee Rahul Mehta Receipt qa-receipt.pdf Policy Auto-approved under policy threshold STATUS ✓ Submitted ✓ Policy validation ✓ Manager approval ● Finance processing Submitted 24 Sep 2026 / ✔ EXP-1017 status/policy note consistent with threshold / EXP-1018 detail: EXPENSE MANAGEMENT Expense detail RM Rahul Mehta Employee Back to my expenses EXPENSE EXP-1018 EFREG001-High-EFQA-202609 | PASS | [EF-REG-001-step3-list-after-refresh.png](../screenshots/20260924T093500/EF-REG-001-step3-list-after-refresh.png)<br>[EF-REG-001-step3-detail-low.png](../screenshots/20260924T093500/EF-REG-001-step3-detail-low.png)<br>[EF-REG-001-step3-detail-high.png](../screenshots/20260924T093500/EF-REG-001-step3-detail-high.png) |
| 4 | The exact-equality expense follows the non-above-threshold branch; it is not routed as above-threshold solely due to rounding, and the persisted status and policy note agree with the strict amount > threshold rule. | live policy threshold shown on approval cards: ₹25,000 / confirmation: EXP-1019 submitted for ₹25,000. See it on your dashboard or open the expense. / EXP-1019 submitted for ₹25,000 — Approved. / ✔ live threshold is ₹25,000 / ✔ amount == threshold (₹25,000) follows the non-above-threshold branch (EXP-1019) / ✔ persisted record: non-pending status (Approved), policy note auto-approved/within threshold | PASS | [EF-REG-001-step4-equal-threshold.png](../screenshots/20260924T093500/EF-REG-001-step4-equal-threshold.png)<br>[EF-REG-001-step4-equal-detail.png](../screenshots/20260924T093500/EF-REG-001-step4-equal-detail.png) |
| 5 | The missing receipt forces the approval route despite the below-threshold amount; the persisted record shows the correct status and routing and does not contain a receipt path. | confirmation: EXP-1020 submitted for ₹9,000. See it on your dashboard or open the expense. / EXP-1020 submitted for ₹9,000 — Pending Approval. / ✔ EXP-1020: below-threshold ₹9,000 without receipt forces approval route / ✔ persisted record: Pending Approval, no receipt path shown / detail: EXPENSE MANAGEMENT Expense detail RM Rahul Mehta Employee Back to my expenses EXPENSE EXP-1020 EFREG001-NoReceipt-EFQA-20260924T1130 Pending Approval Amount ₹9,000 Category Travel Date 24 Sep 2026 Employee Rahul Mehta Receipt No receipt attached Policy No receipt attached — manager approval required STATUS ✓ Submitted ✓ Policy validation ● Manager approval ○ Finance processing  | PASS | [EF-REG-001-step5-no-receipt.png](../screenshots/20260924T093500/EF-REG-001-step5-no-receipt.png)<br>[EF-REG-001-step5-no-receipt-detail.png](../screenshots/20260924T093500/EF-REG-001-step5-no-receipt-detail.png) |

### EF-REG-002 - Connected Data Fabric mapping preserves choice values and dates — Passed

Test Manager: case `EXPENSEFLOW:14`, execution `3ced9cca-0114-0e00-42fb-0b4a2a5ec28f`, case log `e7c7d031-4d82-7300-ed9e-0b4a2a5ec2c9`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Records are readable by the app with the intended category, status, date, and receipt values. | ✔ EXP-1017 detail shows "Travel" / ✔ EXP-1017 detail shows "Approved" / ✔ EXP-1017 detail shows "24 Sep 2026" / ✔ EXP-1017 detail shows "qa-receipt.pdf" / ✔ EXP-1018 detail shows "Travel" / ✔ EXP-1018 detail shows "Pending Approval" / ✔ EXP-1018 detail shows "24 Sep 2026" / ✔ EXP-1018 detail shows "qa-receipt.pdf" / ✔ EXP-1020 detail shows "Travel" / ✔ EXP-1020 detail shows "Pending Approval" / ✔ EXP-1020 detail shows "24 Sep 2026" / ✔ EXP-1020 detail shows "No receipt attached" | PASS | [EF-REG-002-step1-detail-EXP-1017.png](../screenshots/20260924T093500/EF-REG-002-step1-detail-EXP-1017.png)<br>[EF-REG-002-step1-detail-EXP-1018.png](../screenshots/20260924T093500/EF-REG-002-step1-detail-EXP-1018.png)<br>[EF-REG-002-step1-detail-EXP-1020.png](../screenshots/20260924T093500/EF-REG-002-step1-detail-EXP-1020.png) |
| 2 | Choice-set display values and null receipt behavior map consistently into the Expense model. | ✔ 25 list rows on page 1 map to choice-set display values and formatted dates / ✔ null receipt renders "No receipt attached" (no error, no "null") | PASS | [EF-REG-002-step2-list.png](../screenshots/20260924T093500/EF-REG-002-step2-list.png)<br>[EF-REG-002-step2-detail-null-receipt.png](../screenshots/20260924T093500/EF-REG-002-step2-detail-null-receipt.png) |

### EF-REG-003 - Connected list pagination and aggregate totals remain complete — Passed

Test Manager: case `EXPENSEFLOW:15`, execution `a121ff4e-0214-0e00-a9f1-0b4a2a5edd25`, case log `1a42ca76-4e82-7300-9cbc-0b4a2a5edd41`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Connected list retrieval exposes all matching records through paging or aggregate-aware service behavior. | list header: 51 records; footer: Showing 1–25 of 51 / Data Fabric independent aggregate (uip df): total=56, non-draft=55 (₹615428), drafts=1 / ✔ dataset exceeds one UI page (51 > 25) / DF employee-scoped count (Rahul Mehta): 51 / ✔ UI total (51) equals Data Fabric employee-scoped count (51) — all matching records exposed, none truncated at page size 100/25 | PASS | [EF-REG-003-step1-list-page1.png](../screenshots/20260924T093500/EF-REG-003-step1-list-page1.png) |
| 2 | Visible rows, page controls, and aggregate values remain consistent with the full dataset. | ✔ last page footer consistent: Showing 51–51 of 51  / ✔ Next disabled on last page / Finance summary: Expenses 55 ₹6,15,428 submitted across the company Pending 39 ₹4,37,113 in flight This month ₹3.4L 20 expenses in Sep 2026 NEEDS ATTENTION Blocked or waiting 39 records EMPLOYEE EXPENSE AMOUNT WAITING / ✔ Finance "Expenses" card equals Data Fabric aggregate (55, ₹6,15,428) / Finance attention footer: Showing 1–25 of 39 / ✔ Finance attention paging crosses page boundary | PASS | [EF-REG-003-step2-list-last-page.png](../screenshots/20260924T093500/EF-REG-003-step2-list-last-page.png)<br>[EF-REG-003-step2-finance.png](../screenshots/20260924T093500/EF-REG-003-step2-finance.png) |

### EF-REG-004 - Connected receipt upload and authorized receipt access — Restricted

Test Manager: case `EXPENSEFLOW:16`, execution `a9d7d08d-0314-0e00-de0e-0b4a2a5eee2c`, case log `fe80dcf8-4f82-7300-2f7e-0b4a2a5eee62`, TM result **Restricted**, stats {"Passed": 0, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Submission succeeds and the created record retains a receipt path/name. | confirmation: EXP-1022 submitted for ₹1,250. See it on your dashboard or open the expense. / EXP-1022 submitted for ₹1,250 — Approved. / ✔ submission succeeded (EXP-1022) / ✔ created record retains receipt name qa-receipt.pdf | PASS | [EF-REG-004-step1-submitted.png](../screenshots/20260924T093500/EF-REG-004-step1-submitted.png)<br>[EF-REG-004-step1-detail-receipt.png](../screenshots/20260924T093500/EF-REG-004-step1-detail-receipt.png) |
| 2 | The receipt opens through authorized bucket access without exposing a raw storage secret. | ✔ receipt chip is an interactive control / receipt opened in new tab: https://crpabetaporch0eusstg.blob.core.windows.net/orchestrator-932c00cc-8cb5-4d47-b8f2-d7dd94d6fe8a/BlobFilePersistence/a72bcdc2-778e-432c- (query string withheld from record) / ✔ receipt opened over https via storage host (authorized read URI), not a local path / ✔ URL carries no raw storage secret/key terms | PASS | [EF-REG-004-step2-receipt-tab.png](../screenshots/20260924T093500/EF-REG-004-step2-receipt-tab.png)<br>[EF-REG-004-step2-detail-after-open.png](../screenshots/20260924T093500/EF-REG-004-step2-detail-after-open.png) |
| 3 | Each record stores a sanitized receipt path/name that remains associated with the record and opens through authorized bucket access; no raw local path or invalid storage path is exposed. | submitted with "QA receipt #1 (copy).pdf" → EXP-1023 / stored/displayed receipt name: QA-receipt-1-copy-.pdf / ✔ stored name is sanitized (no spaces, #, parentheses, or local path) / ✔ sanitized receipt opens through authorized bucket access / RESTRICTED: the "browser path prefix" variant (C:akepath...) cannot be produced by browser automation: the File object exposes only the bare name, so the prefix-stripping branch was not exercised. Spaces, #, and parentheses were exercised and verified. | RESTRICTED | [EF-REG-004-step3-sanitized-detail.png](../screenshots/20260924T093500/EF-REG-004-step3-sanitized-detail.png) |

### EF-REG-005 - Connected Action Center approval completes before Data Fabric decision — Passed

Test Manager: case `EXPENSEFLOW:17`, execution `8ca10f43-0414-0e00-bc47-0b4a2a5f0383`, case log `cf4d798d-5082-7300-c655-0b4a2a5f039d`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The card identifies its Action Center task and exposes an optional comments field with decision actions. | ✔ card for EXP-1024 (EFREG005-Approve) present exactly once / card: EXP-1024 Rahul Mehta Pending Approval EFREG005-Approve-EFQA-20260924T1300 Amount ₹26,001 Policy threshold ₹25,000 Date 24 Sep 2026 Receipt qa-receipt.pdf Action Center Task #101647429 Above ₹25,000 policy threshold Comments Open expense Reject Request rework A / ✔ card identifies its Action Center task (Task #101647429) / ✔ optional comments field and decision actions present | PASS | [EF-REG-005-step1-card.png](../screenshots/20260924T093500/EF-REG-005-step1-card.png) |
| 2 | Action Center task completion succeeds first, then Data Fabric status/decision metadata updates and the row leaves the queue. | ✔ success feedback: "EXP-1024 is now Approved." / ✔ decided row left the queue / write requests in order: POST //v2/track -> POST //v2/track -> POST //v2/track -> POST //v2/track -> POST //v2/track -> POST //v2/track -> POST //v2/track -> POST //v2/track -> POST /testcloud_team/TAM/orchestrator_/tasks/GenericTasks/CompleteTask -> POST /EntityService/entity/{id}/update/4CB5E05D-05B8-F111-A6A9-6045BDDBB45C -> POST /testcloud_team/TAM/datafabric_/api/EntityService/entity/{id}/query -> POST /testcloud_team/TAM/datafabric_/api/EntityService/entity/{id}/query -> POST //v2/track -> POST //v2/track -> POST //v2/track -> POST //v2/track -> POST //v2/track | PASS | [EF-REG-005-step2-approved.png](../screenshots/20260924T093500/EF-REG-005-step2-approved.png) |
| 3 | Final status, decision timestamp, decider, and comment are persisted consistently. | ✔ detail status Approved / ✔ decision comment persisted on detail / Data Fabric record: {"Status":4,"DecidedBy":"Neha Kulkarni","DecidedAt":"2026-09-24T10:48:45.247+00:00","Comments":"QA approve comment EFQA-20260924T1300","ApprovalTaskId":"101647429"} / ✔ DF record has decider, decision timestamp, and comment (independent uip df read) | PASS | [EF-REG-005-step3-detail.png](../screenshots/20260924T093500/EF-REG-005-step3-detail.png) |

### EF-REG-006 - Connected reject and rework decisions preserve comments and state — Passed

Test Manager: case `EXPENSEFLOW:18`, execution `b131f1b8-0514-0e00-2e0a-0b4a2a5f1ca7`, case log `012c620a-5182-7300-eebc-0b4a2a5f1cdc`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Task and record reflect Rejected status and the saved comment. | ✔ EXP-1025 is now Rejected (toast) / DF: {"Status":5,"Comments":"QA reject comment EFQA-20260924T1300"} / ✔ record saved the reject comment | PASS | [EF-REG-006-step1-rejected.png](../screenshots/20260924T093500/EF-REG-006-step1-rejected.png) |
| 2 | Task and record reflect Reworked status and the saved comment. | ✔ EXP-1026 is now Needs Rework (toast) / DF: {"Status":6,"Comments":"QA rework comment EFQA-20260924T1300"} / ✔ record saved the rework comment | PASS | [EF-REG-006-step2-reworked.png](../screenshots/20260924T093500/EF-REG-006-step2-reworked.png) |
| 3 | Neither decided item remains in the active queue and each retains its correct audit data. | ✔ neither decided item remains in the active queue after refresh / ✔ EXP-1025 detail retains Rejected + comment / ✔ EXP-1026 detail retains Needs Rework + comment | PASS | [EF-REG-006-step3-queue-after.png](../screenshots/20260924T093500/EF-REG-006-step3-queue-after.png)<br>[EF-REG-006-step3-detail-Reject.png](../screenshots/20260924T093500/EF-REG-006-step3-detail-Reject.png)<br>[EF-REG-006-step3-detail-Rework.png](../screenshots/20260924T093500/EF-REG-006-step3-detail-Rework.png) |
| 4 | Whitespace-only comment content is omitted from the update payload; the decision status is persisted correctly without storing meaningless whitespace audit text, and the controls remain usable. | write requests inspected: 13; requests containing a Comments field: 1 / ✔ whitespace-only comment is not sent in any request payload / DF: {"Status":4} / ✔ record does not store meaningless whitespace comment (Comments=undefined) / ✔ controls usable; decided item left queue | PASS | [EF-REG-006-step4-blank-comment.png](../screenshots/20260924T093500/EF-REG-006-step4-blank-comment.png) |

### EF-REG-007 - Connected decision failure leaves source record unmodified — Restricted

Test Manager: case `EXPENSEFLOW:19`, execution `da7b6ea2-0614-0e00-230d-0b4a2a5f4159`, case log `2512f204-5282-7300-3419-0b4a2a5f418f`, TM result **Restricted**, stats {"Passed": 0, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | A friendly decision error is shown and the typed comment remains available for retry. | ✔ friendly decision error shown / ✔ typed comment remains available for retry / ✔ decision controls usable again | PASS | [EF-REG-007-step1-decision-error.png](../screenshots/20260924T093500/EF-REG-007-step1-decision-error.png) |
| 2 | No decision status, decider, timestamp, or comment was written to the record when task completion failed. | DF record after failed decision: {"Status":3,"ApprovalTaskId":"101647442"} / ✔ no decider, timestamp, or comment written to the Data Fabric record / ✔ card still in queue with its Action Center task id (task not completed) / RESTRICTED: the failure was injected by the app switch ?demo=fail-decide, which throws before any UiPath call; it proves no write occurs and the UI recovers, but it does not exercise a real Action Center task-completion failure (the ordering guarantee "task first, record second"). Action Center task state was inferred from the queue card (task still open), not read from Action Center itself. | RESTRICTED | [EF-REG-007-step2-still-pending.png](../screenshots/20260924T093500/EF-REG-007-step2-still-pending.png) |

### EF-REG-008 - Connected Finance attention classification covers all unsettled reasons — Passed

Test Manager: case `EXPENSEFLOW:20`, execution `7087bb11-0714-0e00-598d-0b4a2a5f4f3e`, case log `b3f8856f-5382-7300-b299-0b4a2a5f4f73`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | All records are retrievable through Finance's unsettled query path. | ✔ EFREG008-PolicyReview-203800 retrievable in Data Fabric (Status=2, receipt=yes) / ✔ EFREG008-PendingApproval-203800 retrievable in Data Fabric (Status=3, receipt=yes) / ✔ EFREG008-Reworked-203800 retrievable in Data Fabric (Status=6, receipt=yes) / ✔ EFREG008-MissingReceipt-203800 retrievable in Data Fabric (Status=1, receipt=none) / ✔ EFREG008-SubmittedWithReceipt-203800 retrievable in Data Fabric (Status=1, receipt=yes) / ✔ Finance unsettled query path loads | PASS | [EF-REG-008-step1-finance.png](../screenshots/20260924T093500/EF-REG-008-step1-finance.png) |
| 2 | Each first four record appears once with the correct attention reason; the control is excluded. | attention footer: Showing 1–25 of 43 / ✔ EFREG008-PolicyReview-203800 listed once with reason "Policy Review" → "QA-20260923T203800 ₹82,000 Policy Review" / ✔ EFREG008-PendingApproval-203800 listed once with reason "Pending Approval" → "20260923T203800 ₹37,550 Pending Approval" / ✔ EFREG008-Reworked-203800 listed once with reason "Needs Rework" → "EFQA-20260923T203800 ₹5,900 Needs Rework" / ✔ EFREG008-MissingReceipt-203800 listed once with reason "Missing Receipt" → "A-20260923T203800 ₹2,500 Missing Receipt" / ✔ EFREG008-SubmittedWithReceipt-203800 (submitted-with-receipt control) is excluded from attention / attention rows scanned across pages: 43 | PASS | [EF-REG-008-step2-attention-list.png](../screenshots/20260924T093500/EF-REG-008-step2-attention-list.png) |
| 3 | Each row navigates to the matching expense detail. | ✔ attention row for PolicyReview located / ✔ PolicyReview row navigated to its own detail (/expenses/EFREG008-PolicyReview-203800) / ✔ attention row for PendingApproval located / ✔ PendingApproval row navigated to its own detail (/expenses/EFREG008-PendingApproval-203800) / ✔ attention row for Reworked located / ✔ Reworked row navigated to its own detail (/expenses/EFREG008-Reworked-203800) / ✔ attention row for MissingReceipt located / ✔ MissingReceipt row navigated to its own detail (/expenses/EFREG008-MissingReceipt-203800) | PASS | [EF-REG-008-step3-detail-PolicyReview.png](../screenshots/20260924T093500/EF-REG-008-step3-detail-PolicyReview.png)<br>[EF-REG-008-step3-detail-PendingApproval.png](../screenshots/20260924T093500/EF-REG-008-step3-detail-PendingApproval.png)<br>[EF-REG-008-step3-detail-Reworked.png](../screenshots/20260924T093500/EF-REG-008-step3-detail-Reworked.png)<br>[EF-REG-008-step3-detail-MissingReceipt.png](../screenshots/20260924T093500/EF-REG-008-step3-detail-MissingReceipt.png) |

### EF-REG-009 - Connected service errors expose retryable user feedback — Restricted

Test Manager: case `EXPENSEFLOW:21`, execution `28a0f5d4-0814-0e00-b4af-0b4a2a5f6389`, case log `c995c286-5482-7300-af9a-0b4a2a5f63c7`, TM result **Restricted**, stats {"Passed": 0, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The app presents a friendly error state or inline form error with a retry path; no raw provider exception is shown. | ✔ friendly inline form error shown with retry guidance / ✔ no raw provider exception / ✔ no record written during the failed attempt (0 records in Data Fabric) / failure injected with the app-documented rehearsed switch ?demo=fail-submit against the connected runtime (no real provider outage was created) | PASS | [EF-REG-009-step1-write-failure.png](../screenshots/20260924T093500/EF-REG-009-step1-write-failure.png) |
| 2 | The page or operation recovers without requiring a full app reset and without duplicate writes. | ✔ after removing the switch, re-submitting succeeds without an app reset: EXP-1031 submitted for ₹3,300. See it on your dashboard or open the expense. / EXP-1031 su / ✔ exactly one record after recovery (no duplicate writes): 1 / RESTRICTED: a genuine connected READ failure could not be triggered safely (simulateError is mock-only, and network/credential fault injection was not attempted); only the write-failure path was exercised through the app-documented demo switch. | RESTRICTED | [EF-REG-009-step2-recovered.png](../screenshots/20260924T093500/EF-REG-009-step2-recovered.png) |

### EF-REG-010 - Connected receipt access failures are contained and recoverable — Failed

Test Manager: case `EXPENSEFLOW:22`, execution `6579cd78-0914-0e00-af2f-0b4a2a5f7035`, case log `790332a6-5582-7300-4061-0b4a2a5f706d`, TM result **Failed**, stats {"Passed": 0, "Failed": 1, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The detail page remains usable and receipt access failure is handled without leaking implementation details. | ✔ detail renders with an interactive receipt chip for a record whose bucket object was never uploaded / after opening the unavailable receipt: alert="ExpenseFlow could not open the receipt from UiPath: BlobFileInfo does not exist."; new tab opened=false / ✔ detail page remains usable / ✔ the failure is surfaced (inline alert or blob 404 tab) rather than silently ignored / failure condition: natural (bucket object absent for the seeded fixture); no fault injection, no credential or network manipulation / ✘ no implementation details (storage host, signature, stack, provider type names such as BlobFileInfo) leaked in the page | FAIL | [EF-REG-010-step1-receipt-failure.png](../screenshots/20260924T093500/EF-REG-010-step1-receipt-failure.png) |
| 2 | Receipt access succeeds through the configured bucket path. | ✔ receipt with an existing bucket object opens through authorized bucket access / RESTRICTED: the step is about restoring access after a failure induced on the SAME receipt; the induced failure was a missing object on a different fixture, so "restore then reopen" was shown as a successful open of a healthy receipt, not recovery of the failed one. | RESTRICTED | [EF-REG-010-step2-receipt-tab.png](../screenshots/20260924T093500/EF-REG-010-step2-receipt-tab.png)<br>[EF-REG-010-step2-detail-normal.png](../screenshots/20260924T093500/EF-REG-010-step2-detail-normal.png) |

### EF-REG-011 - Locale-stable currency, compact amount, and date formatting — Restricted

Test Manager: case `EXPENSEFLOW:23`, execution `e1915076-3813-0e00-04f6-0b4a2a533539`, case log `b048f2f6-557e-7300-4b57-0b4a2a53356c`, TM result **Restricted**, stats {"Passed": 0, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Indian grouping is used; 840000 renders ₹8.4L and 12000000 renders ₹1.2Cr. | ✔ Dashboard shows Indian-grouped full values (₹1,28,88,250, ₹1,28,56,450, ₹1,20,00,000, ₹8,40,000) / ✔ 840000 renders ₹8.4L in Finance "This month" tile / ✔ Finance full totals use Indian grouping: ₹10,24,450 ₹9,78,500 ₹8 ₹8,40,000 ₹82,000 ₹37,550 / ✔ 12000000 renders ₹1.2Cr in Finance "This month" tile / ✔ Detail EXP-1001 shows ₹12,450 | PASS | [EF-REG-011-step1-dashboard-full.png](../screenshots/20260924T093500/EF-REG-011-step1-dashboard-full.png)<br>[EF-REG-011-step1-finance-8.4L.png](../screenshots/20260924T093500/EF-REG-011-step1-finance-8.4L.png)<br>[EF-REG-011-step1-finance-1.2Cr.png](../screenshots/20260924T093500/EF-REG-011-step1-finance-1.2Cr.png)<br>[EF-REG-011-step1-detail-full.png](../screenshots/20260924T093500/EF-REG-011-step1-detail-full.png) |
| 2 | 2026-08-18 displays 18 Aug 2026 without a previous-day shift; invalid date text remains unchanged. | browser tz/locale: Pacific/Honolulu / en-US / ✔ EXP-1001 date-only 2026-08-18 displays "18 Aug 2026" under Pacific/Honolulu (no previous-day shift) / ✔ timestamp-derived decision date (2026-08-19T11:40+05:30) shows 19 Aug 2026 (calendar date from ISO string, not shifted to 18 Aug) / ✔ Indian grouping retained under en-US locale / ✔ list dates unshifted: 18 Aug / 17 Aug / RESTRICTED: the "invalid date text remains unchanged" sub-check cannot be produced through the UI (dates come from typed <input type=date> or seeded data); it was verified only by the format unit test (npm test: "an unparseable date is returned as-is rather than as NaN undefined" — 32/32 pass), not by manual UI observation. | RESTRICTED | [EF-REG-011-step2-detail-honolulu.png](../screenshots/20260924T093500/EF-REG-011-step2-detail-honolulu.png)<br>[EF-REG-011-step2-list-honolulu.png](../screenshots/20260924T093500/EF-REG-011-step2-list-honolulu.png) |

### EF-REG-012 - Runtime configuration, OAuth callback, and startup failure recovery — Failed

Test Manager: case `EXPENSEFLOW:24`, execution `c2b7f0bc-0b14-0e00-e49d-0b4a2a5f7e0e`, case log `afba0a40-5882-7300-4f13-0b4a2a5f7e44`, TM result **Failed**, stats {"Passed": 0, "Failed": 1, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | OAuth/runtime completes, schema and choice sets warm, and application routes render. | navigation chain (main frame, query keys only): localhost:5173/ -> localhost:5173/ -> localhost:5173/ -> localhost:5173/?code&state&iss -> localhost:5173/?code&state&iss -> localhost:5173/?iss -> localhost:5173/ / ✔ OAuth round trip completed: callback with code/state reached the app and the session is authenticated / ✔ runtime ready: dashboard rendered with connected records (schema and choice sets warm: categories/statuses mapped) / ✔ no startup failure splash / ✔ My Expenses route renders / ✔ Approvals route renders / ✔ Finance route renders | PASS | [EF-REG-012-step1-routes-render.png](../screenshots/20260924T093500/EF-REG-012-step1-routes-render.png) |
| 2 | Could not connect to UiPath splash and Reload action appear instead of partial application rendering. | BLOCKED: no isolated invalid or missing-resource configuration is available; producing one would require editing the deployed runtime configuration (config.generated.ts / UiPath resources) or breaking tenant resources, which was not attempted. | BLOCKED | not captured |
| 3 | OAuth keys are removed after completion while mock and demo switches remain. | chain: localhost:5173/ -> localhost:5173/ -> localhost:5173/expenses?demo&foo -> localhost:5173/expenses?demo&foo -> localhost:5173/?code&state&iss -> localhost:5173/?code&state&iss -> localhost:5173/?iss -> localhost:5173/ / final URL after real OAuth completion: /(no query) / ✔ OAuth keys (code/state/session_state/iss) removed after completion / ✘ non-OAuth keys demo=fail and foo=bar remain after the callback (observed: dropped — the OAuth redirect returns to the app root, so the original path and query were lost) | FAIL | [EF-REG-012-step3-after-oauth.png](../screenshots/20260924T093500/EF-REG-012-step3-after-oauth.png) |

### EF-REG-013 - Authorization characterization for approvals and Finance — Blocked

Test Manager: case `EXPENSEFLOW:25`, execution `237b66db-0c14-0e00-bbd5-0b4a2a5f8bb2`, case log `ec850661-5982-7300-7f41-0b4a2a5f8bcd`, TM result **Restricted**, stats {"Passed": 0, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The employee does not gain successful approval or Finance actions merely by entering a route. | single authenticated identity in this environment (jeet.doshi); the app header shows the persona label "Rahul Mehta / Manager" on /approvals and "Finance" on /finance with no role check / BLOCKED: a least-privilege employee identity and a separate authorized manager/Finance identity are not available in this environment; only one authenticated user exists, so the negative authorization check (deny without mutation) cannot be performed truthfully. | BLOCKED | [EF-REG-013-step1-approvals-as-current-user.png](../screenshots/20260924T093500/EF-REG-013-step1-approvals-as-current-user.png) |
| 2 | Unauthorized attempt is unavailable or denied without mutation; authorized identity receives required queue/data and decisions. | BLOCKED: no second identity to attempt or compare decisions on EFREG013-pending; no decision was attempted to avoid mutating state without an authorization contrast. | BLOCKED | [EF-REG-013-step2-finance-as-current-user.png](../screenshots/20260924T093500/EF-REG-013-step2-finance-as-current-user.png) |

### EF-REG-014 - Pagination clamps after result-set reduction — Passed

Test Manager: case `EXPENSEFLOW:26`, execution `4cb10781-0d14-0e00-c89d-0b4a2a5f9a39`, case log `f49c5fec-5a82-7300-39ee-0b4a2a5f9a6f`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Footer indicates page 2 and displays rows 26 and later. | ✔ page 2 footer "Showing 26–50 of 59", Page 2 indicated, rows start at 26 | PASS | [EF-REG-014-step1-page2.png](../screenshots/20260924T093500/EF-REG-014-step1-page2.png) |
| 2 | Table automatically renders valid page-1 results and footer indicates Page 1 of 1. | ✔ Status=Rejected from page 2 → page 1 results, footer "Showing 1–2 of 2", 2 rows / ✔ Category=Meals → valid page 1: Showing 1–7 of 7 / ✔ date filter From 2026-09-24 → valid page 1: Showing 1–25 of 25 | PASS | [EF-REG-014-step2-status-clamp.png](../screenshots/20260924T093500/EF-REG-014-step2-status-clamp.png)<br>[EF-REG-014-step2-date-clamp.png](../screenshots/20260924T093500/EF-REG-014-step2-date-clamp.png) |
| 3 | Finance pagination clamps to a valid page with correct disabled boundaries. | Finance attention initially: Showing 1–25 of 43 / ✔ attention set exceeds one page (43 rows) / ✔ Finance attention on last page 2: Showing 26–43 of 43  (Next disabled) / reduced the attention set from a second tab by approving 18 retained synthetic EFREG003-Pending fixtures (Data-Fabric-only, no Action Center task) / after Refresh on the same tab: Showing 1–25 of 25 / ✔ Finance pagination clamped to a valid page 1 after reduction (Showing 1–25 of 25, 25 rows, no phantom page) / ✔ pager boundaries valid (no navigable page 2) | PASS | [EF-REG-014-step3-finance-page2.png](../screenshots/20260924T093500/EF-REG-014-step3-finance-page2.png)<br>[EF-REG-014-step3-finance-clamped.png](../screenshots/20260924T093500/EF-REG-014-step3-finance-clamped.png) |

### EF-REG-015 - Finance month-end bounds include actual last days for 28, 29, and 30-day months — Restricted

Test Manager: case `EXPENSEFLOW:77`, execution `54b93d09-0e14-0e00-5968-0b4a2a5fad01`, case log `286ecab1-5b82-7300-235e-0b4a2a5fad67`, TM result **Restricted**, stats {"Passed": 0, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The isolated dataset contains the planned last-day and outside-range records with recorded expected counts and totals. | Finance month tile before seeding: This month ₹5.4L 28 expenses in Sep 2026 / ✔ Finance in this tenant derives its month from the latest submitted record (no date-range selector exists in the UI); the active month is Sep 2026 / seeded record dated 2026-09-30 (last day of a 30-day month): EXP-1032 submitted for ₹1,111. See it on your dashboard or open the expense. / EXP-1032 su / ✔ boundary record dated 2026-09-30 created / RESTRICTED: only the 30-day-month boundary (2026-09-30) could be seeded: 2026-02-28, 2028-02-29, 2026-04-30 and the next-day controls would make older months non-latest in a shared tenant, and the app has no month selector, so the planned Feb/Feb-leap/Apr datasets cannot b | RESTRICTED | [EF-REG-015-step1-seeded.png](../screenshots/20260924T093500/EF-REG-015-step1-seeded.png) |
| 2 | Each query completes without a Data Fabric 400 or invalid-date error, and the selected range is shown correctly. | ✔ Finance loads for the 30-day month (Sep 2026) with no Data Fabric 400 / invalid-date / error text / month tile: This month ₹5.4L 29 expenses in Sep 2026 / RESTRICTED: the app offers no date-range selector, so February 2026 / 2028 / April 2026 could not be selected; only the latest month (Sep 2026, 30 days) was queried. | RESTRICTED | [EF-REG-015-step2-finance-sep.png](../screenshots/20260924T093500/EF-REG-015-step2-finance-sep.png) |
| 3 | The 28th and 29th day records are included exactly once, the next-day controls are excluded, and no stale month rows remain. | BLOCKED: February 2026 and leap-year February 2028 cannot be queried: Finance has no month selector and always uses the latest month with data; older months are not reachable without deleting or dating-out newer shared records. | BLOCKED | not captured |
| 4 | The April 30th record is included, April 31st is never queried, and the Finance count and total equal the expected boundary-inclusive values. | Finance month tile now: This month ₹5.4L 29 expenses in Sep 2026; DF record: {"ExpenseCode":"EXP-1032","ExpenseDate":"2026-09-30","Amount":1111} / ✔ the 2026-09-30 record exists in Data Fabric with the correct date / ✔ the 30-day month is queried through its actual last day (Sep 2026 tile renders; the previous hard-coded -31 bound would have caused an invalid-date 400) / RESTRICTED: April 2026 (30-day) was not the latest month, so its aggregate could not be compared; the equivalent 30-day boundary was verified for Sep 2026 only. Count/total precomputed comparison for the whole month was not performed. | RESTRICTED | not captured |
| 5 | Boundary records remain stable after refresh and range changes; no off-by-one, duplicate, timezone-shifted, or stale aggregate appears. | ✔ Finance stable after refresh (Sep 2026 tile): This month ₹5.4L 29 expenses in Sep 2026 / RESTRICTED: switching among three month ranges is not possible (no range control). | RESTRICTED | [EF-REG-015-step5-finance-refresh.png](../screenshots/20260924T093500/EF-REG-015-step5-finance-refresh.png) |

### EF-REG-017 - Live policy change between display and submit uses current threshold — Blocked

Test Manager: case `EXPENSEFLOW:78`, execution `ee14a5ba-0f14-0e00-2e2b-0b4a2a5fbc59`, case log `607e72a0-5c82-7300-80ed-0b4a2a5fbc74`, TM result **Restricted**, stats {"Passed": 0, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The form displays the initial policy context and the original asset value is recorded for later restoration. | live policy threshold read from the app: Policy threshold ₹25,000 / BLOCKED: the case requires changing the shared Orchestrator asset ExpenseFlow_PolicyThreshold from 25000 to 30000 while a form is open, then restoring it. That is a mutation of shared tenant configuration and needs explicit authorization plus an isolated restoration window; neither was available. | BLOCKED | [EF-REG-017-step1-threshold-25000.png](../screenshots/20260924T093500/EF-REG-017-step1-threshold-25000.png) |
| 2 | The asset read succeeds and the open form still represents the earlier display state while the live value is now 30000. | BLOCKED: depends on step 1 (asset change not authorized). | BLOCKED | not captured |
| 3 | The submit path evaluates the live 30000 threshold rather than the cached 25000 value; the user-facing decision/routing is correct for 27500 versus 30000. | BLOCKED: depends on step 2 (no live threshold change). Unit coverage exists (npm test: "a submit sees an Asset that changed after the page loaded" passes) but is not a manual UI verification. | BLOCKED | not captured |
| 4 | The persisted record and policy note reflect the live 30000 decision, no stale 25000 decision is recorded, and no duplicate record or task is created. | BLOCKED: depends on step 3. | BLOCKED | not captured |
| 5 | The original policy value is restored and the synthetic record remains a single intact audit object. | BLOCKED: nothing to restore because the threshold was not changed. | BLOCKED | not captured |

### EF-REG-018 - URL switches persist across navigation and disable cleanly after removal — Failed

Test Manager: case `EXPENSEFLOW:79`, execution `5bab3371-3b13-0e00-7033-0b4a2a53511a`, case log `44fd3fd3-597e-7300-fbbf-0b4a2a53513c`, TM result **Failed**, stats {"Passed": 0, "Failed": 1, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The mock=1 switch remains present after each client-side navigation and every screen renders from the mock service without an OAuth or connected-mode dependency. | start URL http://localhost:5173/?mock=1 / ✔ Dashboard: /?mock=1 keeps mock=1 / ✔ Dashboard: renders from mock service, no OAuth / ✔ My Expenses: /expenses?mock=1 keeps mock=1 / ✔ My Expenses: renders from mock service, no OAuth / ✔ New Expense: /expenses/new?mock=1 keeps mock=1 / ✔ New Expense: renders from mock service, no OAuth / ✔ Approvals: /approvals?mock=1 keeps mock=1 / ✔ Approvals: renders from mock service, no OAuth / ✔ Finance: /finance?mock=1 keeps mock=1 / ✔ Finance: renders from mock service, no OAuth | PASS | [EF-REG-018-step1-finance-last.png](../screenshots/20260924T093500/EF-REG-018-step1-finance-last.png) |
| 2 | The two-segment route is reached by clicking, the switch is preserved, and navigation does not create an extra duplicate history entry for the same transition. | history.length before=8, after New Expense=9, after return to Expenses=10; URLs http://localhost:5173/expenses/new?mock=1 → http://localhost:5173/expenses?mock=1 / ✔ two-segment route reached by click with mock=1 preserved / ✔ each transition adds exactly one history entry (no duplicate) | PASS | [EF-REG-018-step2-expenses-after-return.png](../screenshots/20260924T093500/EF-REG-018-step2-expenses-after-return.png) |
| 3 | The first submit shows the translated recoverable failure and preserves form data; the failure is consumed and the retry succeeds without a false success on the first attempt. | ✔ first submit: translated recoverable failure, no false success / ✔ form data preserved / URL at second submit: http://localhost:5173/expenses/new?mock=1&demo=fail / ✘ second submit succeeds (one-shot failure consumed) | FAIL | [EF-REG-018-step3-first-submit.png](../screenshots/20260924T093500/EF-REG-018-step3-first-submit.png)<br>[EF-REG-018-step3-second-submit.png](../screenshots/20260924T093500/EF-REG-018-step3-second-submit.png) |
| 4 | The simulated read failure remains active across client-side navigation, shows the translated error/retry state without a raw exception, and does not create a connected request. | ✔ Dashboard shows translated read error, no raw exception / ✔ failure persists after in-app navigation: http://localhost:5173/finance?mock=1&simulateError=1 | PASS | [EF-REG-018-step4-finance-error.png](../screenshots/20260924T093500/EF-REG-018-step4-finance-error.png) |
| 5 | The simulated failure and demo switch are no longer active after hard load; normal mock data renders, the URL contains only the intended remaining query state, and history remains coherent. | ✔ hard-load URL: http://localhost:5173/?mock=1 / ✔ normal mock data renders, no error state / ✔ after navigating: http://localhost:5173/?mock=1 | PASS | [EF-REG-018-step5-normal.png](../screenshots/20260924T093500/EF-REG-018-step5-normal.png) |

### EF-REG-022 - Over-threshold submission creates one linked approval task — Passed

Test Manager: case `EXPENSEFLOW:80`, execution `12b4a353-1014-0e00-5347-0b4a2a5fc8b7`, case log `1153de10-5d82-7300-5b85-0b4a2a5fc8fb`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The amount is confirmed above the live threshold, the intended folder/task facts are recorded, and the isolated scope has no prior matching record or task. | live policy threshold (from approval cards): ₹25,000; intended Orchestrator folder: Shared (01a3eae4-d43c-4009-9342-969b1262b1e1) / ✔ amount 35000 is above the live threshold 25000 / ✔ no prior matching Data Fabric record for EFREG022-ApprovalLink-EFQA-20260924T1400 | PASS | [EF-REG-022-step1-queue-threshold.png](../screenshots/20260924T093500/EF-REG-022-step1-queue-threshold.png) |
| 2 | Exactly one Data Fabric expense record is created and the user-facing result states that manager approval is required; no duplicate submit is issued. | result: EXP-1029 submitted for ₹35,000. See it on your dashboard or open the expense. / EXP-1029 submitted for ₹35,000 — Pending Approval. / ✔ user-facing result states approval is required (Pending Approval) / ✔ exactly one Data Fabric record created (1) = EXP-1029 | PASS | [EF-REG-022-step2-submitted.png](../screenshots/20260924T093500/EF-REG-022-step2-submitted.png) |
| 3 | Exactly one task exists in the intended folder; title, priority, payload, amount, expense code, employee/decision facts, and approval reason match the submitted record without secrets. | Action Center tasks in folder Shared whose title contains EXP-1029: 1 / ✔ exactly one task exists for the expense / task 101647500: {"Title":"Approve EXP-1029 — Rahul Mehta — ₹35,000","Priority":"Medium","Status":"Unassigned","Type":"ExternalTask","Folder":"Shared","Amount":35000,"ExpenseCode":"EXP-1029","PolicyThreshold":25000,"ReceiptPath":"receipts/EXP-1029-qa-receipt.pdf"} / ✔ task title/payload match the submitted record (code, amount, description) / ✔ task is in the intended folder (Shared) with priority Medium (35000 < 2x threshold) / ✔ payload contains no secrets | PASS | [EF-REG-022-step3-approval-card-task.png](../screenshots/20260924T093500/EF-REG-022-step3-approval-card-task.png)<br>[EF-REG-022-step3-action-center.png](../screenshots/20260924T093500/EF-REG-022-step3-action-center.png) |
| 4 | ApprovalTaskId is persisted as text, matches the single Action Center task id, and the record remains navigable with consistent PendingApproval/task-link data. | ✔ ApprovalTaskId persisted as text and equals the Action Center task id (101647500) / ✔ detail shows PendingApproval with Action Center wait affordance | PASS | [EF-REG-022-step4-detail.png](../screenshots/20260924T093500/EF-REG-022-step4-detail.png) |
| 5 | No additional record or task is created; the original record and task identifiers remain stable and the linked approval state is idempotent. | ✔ record count 1; ExpenseCode and ApprovalTaskId unchanged after revisit/refresh / ✔ task count still 1 | PASS | [EF-REG-022-step5-detail-after-refresh.png](../screenshots/20260924T093500/EF-REG-022-step5-detail-after-refresh.png) |

### EF-REG-023 - External task completion conflict prevents duplicate app decision — Passed

Test Manager: case `EXPENSEFLOW:81`, execution `1bf1ff18-1214-0e00-dc5f-0b4a2a5fdc73`, case log `b1dda2c7-6482-7300-4574-0b4a2a5fdc8e`, TM result **Passed**, stats {"Passed": 1, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The expense is PendingApproval, the task link is present, and the original record/task snapshot is captured before the race. | ✔ approval card for EXP-1030 open in the app (this page is intentionally not refreshed before the race) / snapshot before race: {"code":"EXP-1030","Status":3,"ApprovalTaskId":"101647510","taskStatus":"Unassigned","taskAction":null} / ✔ expense is PendingApproval with a linked open task | PASS | [EF-REG-023-step1-before-race.png](../screenshots/20260924T093500/EF-REG-023-step1-before-race.png) |
| 2 | The Action Center task reaches its completed state and the external decision is recorded once. | uip tasks complete -> Success / task after external completion: {"Status":"Completed","Action":"Approve","CompletedTime":"2026-09-24T10:54:48.7650757Z"} / ✔ Action Center task is Completed with action Approve (external decision recorded once) | PASS | [EF-REG-023-step2-task-after-external-completion.json](../screenshots/20260924T093500/EF-REG-023-step2-task-after-external-completion.json) |
| 3 | The app returns the specific already-completed-task conflict message; it does not show a false success or raw exception. | ✔ app returns the specific already-completed-task conflict message / ✔ no false success toast / ✔ no raw exception / message: pdf Action Center Task #101647510 Above ₹25,000 policy threshold Comments ExpenseFlow could not record the approve decision in Action Center: This Action is already completed by the same user Open exp | PASS | [EF-REG-023-step3-conflict-message.png](../screenshots/20260924T093500/EF-REG-023-step3-conflict-message.png) |
| 4 | The Data Fabric record has no second decision mutation or duplicate comment, the task remains completed, and no second task is created. | after conflict: {"records":1,"Status":3,"tasks":1,"taskStatus":"Completed"} / ✔ Data Fabric record has no second decision mutation or duplicate comment / ✔ task remains completed; no second task created | PASS | [EF-REG-023-step4-record-and-task-count.json](../screenshots/20260924T093500/EF-REG-023-step4-record-and-task-count.json) |
| 5 | The completed-task conflict remains accurately represented, no duplicate decision/task appears, and the original record/task identifiers remain stable. | after refresh the card is still listed in the queue / detail after refresh: EXPENSE MANAGEMENT Expense detail RM Rahul Mehta Employee Back to my expenses EXPENSE EXP-1030 EFREG023-ExternalComplete-EFQA-20260924T1400 Pending Approval Amount ₹35,000 Category Travel Date 24 Sep 2026 Employee Rahul Mehta Receipt qa-receipt.pdf Policy Abov / ✔ no duplicate decision/task; original record and task identifiers stable / ✔ known limitation observed: the record stays PendingApproval in Data Fabric because the external completion did not update it (app does not reconcile) — reported for the analyst, not asserted as expected | PASS | [EF-REG-023-step5-queue-after-refresh.png](../screenshots/20260924T093500/EF-REG-023-step5-queue-after-refresh.png)<br>[EF-REG-023-step5-detail-after-refresh.png](../screenshots/20260924T093500/EF-REG-023-step5-detail-after-refresh.png) |

### EF-REG-024 - Empty Finance dataset renders zero aggregates and no-data state — Blocked

Test Manager: case `EXPENSEFLOW:82`, execution `817bf195-1614-0e00-82fd-0b4a2a5fedd4`, case log `d1c41831-7182-7300-89ef-0b4a2a5fee0e`, TM result **Restricted**, stats {"Passed": 0, "Failed": 0, "None": 0, "Status": "Finished"}

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The selected scope contains no aggregate-eligible records; any Draft-only control is explicitly identified and excluded from expected Finance results. | Finance currently shows: Expenses 64 ₹8,19,854 submitted across the company Pending 24 ₹4,81,827 in flight This month ₹5.4L 29 expenses in Sep 2026 NEEDS ATTENTION Blocked or waiting 25 records E / BLOCKED: the Finance view aggregates the whole shared ExpenseFlow_Expense entity (dozens of non-Draft records from earlier QA runs); an empty non-Draft scope would require deleting or re-dating shared records, which needs explicit authorization. No isolated empty tenant scope exists. | BLOCKED | [EF-REG-024-step1-finance-not-empty.png](../screenshots/20260924T093500/EF-REG-024-step1-finance-not-empty.png) |
| 2 | Finance renders zero count and zero total without NaN, undefined, stale values, a raw exception, or a Data Fabric 400. | BLOCKED: depends on step 1 (empty scope unavailable). | BLOCKED | not captured |
| 3 | The month presentation is the documented null/no-data state rather than an invented date, and the date range remains valid without issuing an invalid query. | BLOCKED: depends on step 1. | BLOCKED | not captured |
| 4 | The attention area shows its intentional empty state, Draft-only data is not classified as attention, and the table/pager do not display phantom rows or invalid navigation. | BLOCKED: depends on step 1. | BLOCKED | not captured |
| 5 | Zero aggregates, the no-data presentation, and the empty attention state remain stable; no rows or totals from a prior dataset reappear. | BLOCKED: depends on step 1. | BLOCKED | not captured |

## Limitations

- Restricted/Blocked items are listed per step above; they are environment or data constraints (no second identity, no month selector, no empty tenant scope, shared asset not authorised for change, no safe provider fault), not product failures.
- EF-REG-007 and EF-REG-009 used the app's documented `?demo=fail-*` switches (fault thrown before any UiPath call); they do not prove real Action Center/Data Fabric outage handling.
- EF-REG-014 has an earlier mock-only execution (Restricted) and this connected execution; the connected one is the result of record.
- Test Manager created an ad-hoc test set per manual execution (name pattern `<case> manual execution 20260924T093500 - …`); they were not added to the two maintained sets.
- Synthetic records/tasks retained in staging: EXP-1007..EXP-1032 (this run), plus 18 retained EFREG003 fixtures approved during EF-REG-014, plus earlier runs' fixtures.
- ChecklistPath file was not touched.

## Baseline decision

Baseline **not advanced**: confirmed product failures remain and several cases are only partially executable in this environment.
