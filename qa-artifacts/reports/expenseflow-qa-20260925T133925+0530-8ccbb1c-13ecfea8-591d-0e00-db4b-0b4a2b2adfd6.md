# ExpenseFlow QA — Change Regression Execution

Generated: 2026-09-25T08:09:25.544Z

## Decision

Execution **13ecfea8-591d-0e00-db4b-0b4a2b2adfd6** finished in Test Manager. The baseline is **not advanced**: `lastSuccessfulBaselineSha` remains `null`.

## Scope and environment

- Environment: **Local**
- Application URL: https://testcloud-team.staging.uipath.host/expenseflow
- Repository: https://github.com/JD2091/expenseflow
- Baseline SHA: `null`
- Current SHA: `8ccbb1c11d36088a36900e737ea0951854a72b65`
- Commits analyzed in this continuation: none; approved case source references: `571c2192d3d786a03eb7f57d89bec70998ef1d57`
- Pull requests analyzed: none
- Test Manager project: **ExpenseFlow QA / EXPENSEFLOW** (ec245f49-f3da-0200-9a6c-0b4a286e44f7)
- Test set: **EXPENSEFLOW:2** (03262d27-ec98-0400-849d-0b4a286e63ce)
- Execution: [13ecfea8-591d-0e00-db4b-0b4a2b2adfd6](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6)

## Reconciled totals

| Scope | Passed | Failed | Restricted | None | Total |
|---|---:|---:|---:|---:|---:|
| Test Manager case logs | 9 | 1 | — | 10 | 20 |
| Test Manager step logs | 20 | 1 | 47 | 0 | 68 |

- Step-log attachment flags: **42/68 captured**; **26 not captured**.
- Local staged per-step traces independently verified: **30**.
- The case-log counts and step-log counts were recomputed from Test Manager and match the execution aggregate where applicable.

## Change-impact summary and risk areas

This was a continuation of the approved catalog execution, not an incremental baseline comparison. The exercised risk areas were policy-threshold routing, Data Fabric mapping and pagination, receipt upload/access, Action Center sequencing and conflict recovery, Finance attention classification, runtime/OAuth URL switches, locale formatting, authorization characterization, month-end boundaries, and empty Finance state behavior.

### Changed/affected files traced by approved cases

- `scripts/format.test.ts`
- `src/App.tsx`
- `src/components/AppLayout.tsx`
- `src/components/ErrorState.tsx`
- `src/components/ExpenseTable.tsx`
- `src/components/NewExpenseForm.tsx`
- `src/components/ReceiptLink.tsx`
- `src/components/Sidebar.tsx`
- `src/components/TablePager.tsx`
- `src/hooks/useAuth.tsx`
- `src/hooks/useExpenses.tsx`
- `src/hooks/useFinance.tsx`
- `src/lib/format.ts`
- `src/models/expense.ts`
- `src/models/status.ts`
- `src/pages/ApprovalPage.tsx`
- `src/pages/DashboardPage.tsx`
- `src/pages/ExpenseDetailPage.tsx`
- `src/pages/ExpenseListPage.tsx`
- `src/pages/FinancePage.tsx`
- `src/services/demoFailure.ts`
- `src/services/expenseService.ts`
- `src/services/uipath/approvals.ts`
- `src/services/uipath/choiceSets.ts`
- `src/services/uipath/client.ts`
- `src/services/uipath/config.ts`
- `src/services/uipath/entityClient.ts`
- `src/services/uipath/errors.ts`
- `src/services/uipath/folders.ts`
- `src/services/uipath/mappers.ts`
- `src/services/uipath/policy.ts`
- `src/services/uipath/receipts.ts`
- `src/services/uipath/runtime.tsx`
- `src/services/uipath/schema.ts`
- `vite.config.ts`

## Case summary

| Stable ID | Result | Steps (P/F/R/N) | Attachments | Case log |
|---|---|---:|---:|---|
| EF-REG-001 | PASS | 1/0/4/0 | 5/5 | `9f08895b-f3bc-7300-2037-0b4a2b2ae017` |
| EF-REG-002 | PASS | 2/0/0/0 | 2/2 | `725245c9-f4bc-7300-11fb-0b4a2b2ae03a` |
| EF-REG-003 | PASS | 2/0/0/0 | 2/2 | `697e96c3-f5bc-7300-2607-0b4a2b2ae05e` |
| EF-REG-004 | PASS | 2/0/1/0 | 3/3 | `7654ad14-f6bc-7300-ce19-0b4a2b2ae08c` |
| EF-REG-005 | NOT RUN/RESTRICTED | 0/0/3/0 | 1/3 | `e1229e71-f7bc-7300-5d64-0b4a2b2ae0af` |
| EF-REG-006 | NOT RUN/RESTRICTED | 0/0/4/0 | 2/4 | `9b404937-f8bc-7300-3775-0b4a2b2ae0d2` |
| EF-REG-007 | PASS | 1/0/1/0 | 2/2 | `2820b224-f9bc-7300-6f3f-0b4a2b2ae0fa` |
| EF-REG-008 | PASS | 2/0/1/0 | 3/3 | `150ef759-fabc-7300-a14b-0b4a2b2ae11c` |
| EF-REG-009 | NOT RUN/RESTRICTED | 0/0/2/0 | 2/2 | `89a010ad-fbbc-7300-002c-0b4a2b2ae13f` |
| EF-REG-010 | NOT RUN/RESTRICTED | 0/0/2/0 | 0/2 | `abc7cf93-fcbc-7300-28b0-0b4a2b2ae164` |
| EF-REG-011 | NOT RUN/RESTRICTED | 0/0/2/0 | 2/2 | `15bee759-fdbc-7300-9298-0b4a2b2ae186` |
| EF-REG-012 | NOT RUN/RESTRICTED | 0/0/3/0 | 0/3 | `a7975289-febc-7300-cd68-0b4a2b2ae1a8` |
| EF-REG-013 | NOT RUN/RESTRICTED | 0/0/2/0 | 0/2 | `ea724388-ffbc-7300-7a16-0b4a2b2ae1cb` |
| EF-REG-014 | PASS | 2/0/1/0 | 3/3 | `a8a9a459-00bd-7300-57a0-0b4a2b2ae1ee` |
| EF-REG-015 | NOT RUN/RESTRICTED | 0/0/5/0 | 0/5 | `b234d275-01bd-7300-0348-0b4a2b2ae21b` |
| EF-REG-017 | NOT RUN/RESTRICTED | 0/0/5/0 | 0/5 | `32f5a4f0-02bd-7300-ecdf-0b4a2b2ae23c` |
| EF-REG-018 | FAIL | 4/1/0/0 | 5/5 | `6ecb2de4-03bd-7300-ca13-0b4a2b2ae25e` |
| EF-REG-022 | PASS | 2/0/3/0 | 5/5 | `096abcd7-04bd-7300-6871-0b4a2b2ae282` |
| EF-REG-023 | PASS | 2/0/3/0 | 5/5 | `878ca4d4-05bd-7300-454e-0b4a2b2ae2a6` |
| EF-REG-024 | NOT RUN/RESTRICTED | 0/0/5/0 | 0/5 | `95af9181-06bd-7300-aa2b-0b4a2b2ae2c9` |

Legend: case result `None` with Restricted step logs is reported as blocked/restricted coverage, not as a product failure.

## Detailed step results

### EF-REG-001 — PASS

Test case: **EF-REG-001 - Connected submission applies policy threshold routing**; key `EXPENSEFLOW:13`; case log `9f08895b-f3bc-7300-2037-0b4a2b2ae017`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-001
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify connected submission reads the policy threshold and persists the correct status/routing decision.

Synthetic data:
- Below threshold: EFREG001-Low; Travel; 24000; 2026-08-22.
- Above threshold: EFREG001-High; Travel; 25001; 2026-08-22.
- Boundary: an expense amount exactly equal to the live ExpenseFlow_PolicyThreshold value.
- Missing receipt: a below-threshold expense submitted without a receipt.

Negative checks:
- A boundary value is not misclassified due to client rounding.
- The strict amount > threshold rule is preserved: equality is not treated as above threshold.
- A missing receipt routes to approval even when the amount is below the policy threshold.
- Policy threshold read failure produces an honest warning rather than a false routing claim.

Affected components/files:
- src/components/NewExpenseForm.tsx
- src/services/expenseService.ts
- src/services/uipath/policy.ts
- src/hooks/useExpenses.tsx

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/components/NewExpenseForm.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/expenseService.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/policy.ts

</details>

Affected files: `src/components/NewExpenseForm.tsx`, `src/services/expenseService.ts`, `src/services/uipath/policy.ts`, `src/hooks/useExpenses.tsx`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | A connected Data Fabric record is created with the below-threshold outcome defined by the policy service. | Observed: connected submission created EXP-1033 for EFREG001-Low at INR 24,000 on 2026-08-22. The record persisted as Pending Approval because this run intentionally did not attach a receipt, so the below-threshold routing cannot be isolated from the missing-receipt rule. | RESTRICTED | TM attachment `testStepLog:351e59c6-49bd-46b2-097b-08df1a31d8f8;HasAttachment=true` |
| 2 | The policy warning/routing behavior indicates manager approval is required and the record reflects the above-threshold path. | Observed: connected submission created EXP-1034 for EFREG001-High at INR 25,001 on 2026-08-22. The record persisted as Pending Approval; approval-required behavior was observed, but the missing receipt is an additional approval trigger in this run. | RESTRICTED | TM attachment `testStepLog:d4e7119f-b78a-4921-097c-08df1a31d8f8;HasAttachment=true` |
| 3 | Amounts, status, and persisted policy notes/routing agree with the current threshold. | Observed: after navigating to My expenses and paging to page 2, EXP-1033 was present at INR 24,000 Pending Approval and EXP-1034 was present at INR 25,001 Pending Approval. Both records were readable, but persisted policy-note attribution was not isolated because both submissions lacked receipts. | RESTRICTED | TM attachment `testStepLog:38cbfdf0-1397-4f41-097d-08df1a31d8f8;HasAttachment=true` |
| 4 | The exact-equality expense follows the non-above-threshold branch; it is not routed as above-threshold solely due to rounding, and the persisted status and policy note agree with the strict amount > threshold rule. | Observed: exact-threshold submission created EXP-1035 at INR 25,000 and the persisted list status was Pending Approval. The amount equality was exercised, but the missing receipt prevents isolating the strict threshold branch from receipt-driven approval routing. | RESTRICTED | TM attachment `testStepLog:e4211352-97be-406b-097e-08df1a31d8f8;HasAttachment=true` |
| 5 | The missing receipt forces the approval route despite the below-threshold amount; the persisted record shows the correct status and routing and does not contain a receipt path. | Observed: below-threshold synthetic expense EFREG001-NoReceipt-20260925T1046 created EXP-1036 at INR 9,000 with no receipt selected. The persisted My expenses row showed Pending Approval, matching the expected missing-receipt approval route. | PASS | TM attachment `testStepLog:e368caed-fc18-41ef-097f-08df1a31d8f8;HasAttachment=true` |

### EF-REG-002 — PASS

Test case: **EF-REG-002 - Connected Data Fabric mapping preserves choice values and dates**; key `EXPENSEFLOW:14`; case log `725245c9-f4bc-7300-11fb-0b4a2b2ae03a`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-002
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify Data Fabric entity round-trip mapping correctly translates choice fields, dates, and nullable data.

Synthetic data:
- EFREG002-Accommodation; category Accommodation; status Submitted; date 2026-08-18.
- EFREG002-NoReceipt; category Office; null receipt path.

Negative checks:
- Unknown or missing choice values do not crash the UI.
- A null receipt maps to an absent receipt affordance rather than an invalid URL.

Affected components/files:
- src/services/uipath/mappers.ts
- src/services/uipath/entityClient.ts
- src/services/uipath/choiceSets.ts
- src/models/expense.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/mappers.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/entityClient.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/choiceSets.ts

</details>

Affected files: `src/services/uipath/mappers.ts`, `src/services/uipath/entityClient.ts`, `src/services/uipath/choiceSets.ts`, `src/models/expense.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Records are readable by the app with the intended category, status, date, and receipt values. | Observed: connected fixture EFREG002-Accommodation-EFQA-20260923T1235 (EF2-1235-A) rendered in detail with status Submitted, category Accommodation, date 18 Aug 2026, receipt accommodation-receipt.pdf, policy text 'Synthetic mapping fixture with receipt path', and expected status progression. | PASS | TM attachment `testStepLog:80551677-b4d9-4c5b-696a-08df19d7ace6;HasAttachment=true` |
| 2 | Choice-set display values and null receipt behavior map consistently into the Expense model. | Observed: connected list mapping preserved choice display values and formatted dates; null-receipt fixture EFREG002-NoReceipt-EFQA-20260923T1235 (EF2-1235-N) rendered in detail with status Submitted, category Office, date 18 Aug 2026, Receipt 'No receipt attached', and no raw null or invalid receipt path. | PASS | TM attachment `testStepLog:34e51522-098f-47b0-696b-08df19d7ace6;HasAttachment=true` |

### EF-REG-003 — PASS

Test case: **EF-REG-003 - Connected list pagination and aggregate totals remain complete**; key `EXPENSEFLOW:15`; case log `697e96c3-f5bc-7300-2607-0b4a2b2ae05e`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-003
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify connected list retrieval and Finance aggregates remain correct beyond a single page of Data Fabric records.

Synthetic data:
- At least 26 synthetic employee expenses spanning Submitted, Approved, PendingApproval, and Draft statuses.

Negative checks:
- Client-side totals are not calculated from only the first server page.
- Filtering from a later page clamps the page index instead of showing a false empty state.

Affected components/files:
- src/services/uipath/entityClient.ts
- src/hooks/useExpenses.tsx
- src/hooks/useFinance.tsx
- src/components/TablePager.tsx

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/entityClient.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/hooks/useFinance.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/components/TablePager.tsx

</details>

Affected files: `src/services/uipath/entityClient.ts`, `src/hooks/useExpenses.tsx`, `src/hooks/useFinance.tsx`, `src/components/TablePager.tsx`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Connected list retrieval exposes all matching records through paging or aggregate-aware service behavior. | Observed: connected My Expenses loaded 64 records with 25 rows shown on page 1 of 3. The dataset exceeded one UI page and the list was reachable through the connected runtime. | PASS | TM attachment `testStepLog:e25a5ad5-536d-465e-0d02-08df19cef660;HasAttachment=true` |
| 2 | Visible rows, page controls, and aggregate values remain consistent with the full dataset. | Observed: My Expenses traversed Showing 1-25 of 64, 26-50 of 64, and 51-64 of 64; the last page was Page 3 of 3 with Next disabled. Finance then rendered Expenses 68 / INR 9,02,855 submitted, Pending 28 / INR 5,64,828 in flight, This month INR 5.4L for 29 September 2026 expenses, and a Needs Attention queue of 29 records on page 1 of 2. | PASS | TM attachment `testStepLog:268b34fe-44e3-4688-0d03-08df19cef660;HasAttachment=true` |

### EF-REG-004 — PASS

Test case: **EF-REG-004 - Connected receipt upload and authorized receipt access**; key `EXPENSEFLOW:16`; case log `7654ad14-f6bc-7300-ce19-0b4a2b2ae08c`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-004
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify a synthetic receipt is uploaded, persisted, and accessed through the configured storage bucket.

Synthetic data:
- Synthetic file efreg004-receipt.pdf.
- Expense EFREG004-Receipt; Travel; 1250; 2026-08-22.
- Receipt-name variants containing spaces, #, parentheses, and browser path prefixes.

Negative checks:
- Unsupported or missing receipt input does not create a broken record path.
- Receipt access failure is presented as a recoverable user-facing error.
- Unsafe receipt names are sanitized for storage while remaining associated with the created record and openable through authorized access.

Affected components/files:
- src/components/NewExpenseForm.tsx
- src/components/ReceiptLink.tsx
- src/services/uipath/receipts.ts
- src/services/expenseService.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/components/NewExpenseForm.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/components/ReceiptLink.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/receipts.ts

</details>

Affected files: `src/components/NewExpenseForm.tsx`, `src/components/ReceiptLink.tsx`, `src/services/uipath/receipts.ts`, `src/services/expenseService.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Submission succeeds and the created record retains a receipt path/name. | Observed: submitted the fresh connected synthetic expense EFREG004-Receipt with category Travel, amount ₹1,250, date 22 Aug 2026, and receipt fixture efreg004-receipt.pdf. The application confirmed EXP-1037 submitted for ₹1,250, and the created detail retained the receipt name efreg004-receipt.pdf. | PASS | [trace](../../../../../../AppData/Roaming/UiPath Assistant/traces/f97355bd-7990-4189-99ef-826a15be4fb8/EF-REG-004-step01-trace.json); TM attachment `testStepLog:1c8060ff-5a8d-49c1-8b1c-08df1a19787e;HasAttachment=true` |
| 2 | The receipt opens through authorized bucket access without exposing a raw storage secret. | Observed: EXP-1037 detail displayed the receipt control efreg004-receipt.pdf with tooltip identifying the ExpenseFlow_Receipts bucket. Opening it produced an application/pdf response over the authorized staging blob host with no raw storage secret recorded; the signed query string was withheld from evidence. | PASS | [trace](../../../../../../AppData/Roaming/UiPath Assistant/traces/f97355bd-7990-4189-99ef-826a15be4fb8/EF-REG-004-step02-trace.json); TM attachment `testStepLog:68d36c61-ae4f-4ac3-8b1d-08df1a19787e;HasAttachment=true` |
| 3 | Each record stores a sanitized receipt path/name that remains associated with the record and opens through authorized bucket access; no raw local path or invalid storage path is exposed. | Observed: submitted a fresh variant using receipt filename EFREG004 receipt #1 (copy).pdf with spaces, #, and parentheses. The application confirmed EXP-1038 submitted for ₹1,251; detail stored/displayed the sanitized name EFREG004-receipt-1-copy-.pdf with no spaces, #, parentheses, or local path, and the sanitized receipt opened through the authorized ExpenseFlow_Receipts blob route. Restricted: the browser path prefix branch (for example C:\fakepath\) could not be isolated because the native file input exposed only the bare File.name to the browser automation; no product failure is inferred. | RESTRICTED | [trace](../../../../../../AppData/Roaming/UiPath Assistant/traces/f97355bd-7990-4189-99ef-826a15be4fb8/EF-REG-004-step03-trace.json); TM attachment `testStepLog:522d8af5-606b-40ae-8b1e-08df1a19787e;HasAttachment=true` |

### EF-REG-005 — NOT RUN/RESTRICTED

Test case: **EF-REG-005 - Connected Action Center approval completes before Data Fabric decision**; key `EXPENSEFLOW:17`; case log `e1229e71-f7bc-7300-5d64-0b4a2b2ae0af`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-005
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify decision sequencing completes the Action Center task before mutating the Data Fabric record.

Synthetic data:
- Pending synthetic expense EFREG005-Approve with Action Center task ID.
- Decision comment: Approved for regression.

Negative checks:
- If task completion fails, the Data Fabric record remains untouched.
- A successful decision is not duplicated on retry/refresh.

Affected components/files:
- src/pages/ApprovalPage.tsx
- src/services/expenseService.ts
- src/services/uipath/approvals.ts
- src/services/uipath/entityClient.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/pages/ApprovalPage.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/expenseService.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/approvals.ts

</details>

Affected files: `src/pages/ApprovalPage.tsx`, `src/services/expenseService.ts`, `src/services/uipath/approvals.ts`, `src/services/uipath/entityClient.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The card identifies its Action Center task and exposes an optional comments field with decision actions. | Observed: the connected Approval queue rendered 23 cards waiting on Neha Kulkarni. The required EFREG005-Approve synthetic record and its Action Center task were absent from the complete rendered queue; no pager or alternate queue scope was available. BLOCKED: the case prerequisite was unavailable in this environment, so no unrelated approval was opened or mutated. | RESTRICTED | [trace](../../../../../../AppData/Roaming/UiPath Assistant/traces/f97355bd-7990-4189-99ef-826a15be4fb8/EF-REG-005-step01-trace.json); TM attachment `testStepLog:d357518d-a356-4c07-025a-08df1a26c3bd;HasAttachment=true` |
| 2 | Action Center task completion succeeds first, then Data Fabric status/decision metadata updates and the row leaves the queue. | BLOCKED: EFREG005-Approve and its Action Center task were not present in the connected Approval queue, so the required approval action could not be exercised without mutating an unrelated synthetic record. No approval, comment, or Data Fabric decision write was attempted. | RESTRICTED | not captured |
| 3 | Final status, decision timestamp, decider, and comment are persisted consistently. | BLOCKED: because the EFREG005-Approve prerequisite was absent and step 2 could not execute, refresh/detail persistence verification was not run. No final status, decision timestamp, decider, or comment is claimed for EFREG005-Approve. | RESTRICTED | not captured |

### EF-REG-006 — NOT RUN/RESTRICTED

Test case: **EF-REG-006 - Connected reject and rework decisions preserve comments and state**; key `EXPENSEFLOW:18`; case log `9b404937-f8bc-7300-3775-0b4a2b2ae0d2`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-006
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify connected Reject and Request rework flows persist their distinct statuses and comments.

Synthetic data:
- EFREG006-Reject with comment Duplicate claim.
- EFREG006-Rework with comment Please upload a clearer receipt.
- Whitespace-only comment input for a decision that does not provide meaningful audit text.

Negative checks:
- Decision failures keep typed comments and re-enable action controls.
- Reject and Rework do not collapse into the same status.
- Whitespace-only comments are omitted from the update payload rather than persisted as meaningless audit data.

Affected components/files:
- src/pages/ApprovalPage.tsx
- src/services/expenseService.ts
- src/services/uipath/approvals.ts
- src/models/status.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/pages/ApprovalPage.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/approvals.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/models/status.ts

</details>

Affected files: `src/pages/ApprovalPage.tsx`, `src/services/expenseService.ts`, `src/services/uipath/approvals.ts`, `src/models/status.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Task and record reflect Rejected status and the saved comment. | Observed: the connected Approval queue loaded 23 approval cards waiting on Neha Kulkarni. The required EFREG006-Reject, EFREG006-Rework, and EFREG006-Blank synthetic fixtures were absent from the complete rendered queue; no pager or alternate queue scope was available. BLOCKED: the EF-REG-006 decision fixtures were unavailable in this environment, so no unrelated approval was opened or mutated. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-006-step01-trace.json); TM attachment `testStepLog:952fec60-59b7-4de7-0267-08df1a26c3bd;HasAttachment=true` |
| 2 | Task and record reflect Reworked status and the saved comment. | Observed: a read-only DOM search confirmed EFREG006-Reject, EFREG006-Rework, and EFREG006-Blank were absent from the approvals route. No alternate fixture was substituted. BLOCKED: the reject, rework, and blank-comment decision paths could not be exercised without mutating an unrelated record. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-006-step02-trace.json); TM attachment `testStepLog:eb2aba4d-cc3e-433c-0268-08df1a26c3bd;HasAttachment=true` |
| 3 | Neither decided item remains in the active queue and each retains its correct audit data. | BLOCKED: EFREG006-Reject and EFREG006-Rework fixtures were unavailable, so the reject/rework action controls, comment persistence, and failure-recovery behavior were not executed. No approval or comment write was attempted. | RESTRICTED | not captured |
| 4 | Whitespace-only comment content is omitted from the update payload; the decision status is persisted correctly without storing meaningless whitespace audit text, and the controls remain usable. | BLOCKED: EFREG006-Blank was unavailable, so whitespace-only comment omission and final status persistence could not be verified. No final decision, comment, or Data Fabric write is claimed. | RESTRICTED | not captured |

### EF-REG-007 — PASS

Test case: **EF-REG-007 - Connected decision failure leaves source record unmodified**; key `EXPENSEFLOW:19`; case log `2820b224-f9bc-7300-6f3f-0b4a2b2ae0fa`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-007
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify a safe decision failure does not create cross-system inconsistency.

Synthetic data:
- Synthetic pending expense EFREG007-DecisionFailure with captured initial record state.

Negative checks:
- No artificial task/record orphan is manufactured.
- Failure is classified as BLOCKED when no safe failure hook is available, not as a product defect.

Affected components/files:
- src/pages/ApprovalPage.tsx
- src/services/expenseService.ts
- src/services/uipath/errors.ts
- src/services/uipath/approvals.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/pages/ApprovalPage.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/expenseService.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/errors.ts

</details>

Affected files: `src/pages/ApprovalPage.tsx`, `src/services/expenseService.ts`, `src/services/uipath/errors.ts`, `src/services/uipath/approvals.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | A friendly decision error is shown and the typed comment remains available for retry. | Observed on the approved safe failure route /approvals?demo=fail-decide: target EXP-1028 / EFREG007-DecisionFail-EFQA-20260924T1300 remained visible with its Action Center task #101647442. After entering the synthetic comment QA decision failure EFQA-20260925T1150 and invoking Reject, the app showed the friendly message 'The decision could not be recorded. The Action Center task is untouched and the expense is unchanged. Try again.' The comment remained available in the card textarea and decision controls remained usable. | PASS | [trace](../../../../../../AppData/Roaming/UiPath Assistant/traces/f97355bd-7990-4189-99ef-826a15be4fb8/EF-REG-007-step01-trace.json); TM attachment `testStepLog:22d407f5-79b3-425f-6970-08df19d7ace6;HasAttachment=true` |
| 2 | No decision status, decider, timestamp, or comment was written to the record when task completion failed. | Observed: the failed decision left EXP-1028 at Pending Approval with 'Manager approval' and 'Waiting on a manager in Action Center.' The detail page displayed the same friendly no-write message, and no decider or decision timestamp was present. Restricted: the approved ?demo=fail-decide hook throws before any UiPath call, so it proves UI recovery and no-write behavior but does not exercise a real Action Center task-completion failure or independently read Action Center task state. | RESTRICTED | [trace](../../../../../../AppData/Roaming/UiPath Assistant/traces/f97355bd-7990-4189-99ef-826a15be4fb8/EF-REG-007-step02-trace.json); TM attachment `testStepLog:30a40ea3-af96-4840-6971-08df19d7ace6;HasAttachment=true` |

### EF-REG-008 — PASS

Test case: **EF-REG-008 - Connected Finance attention classification covers all unsettled reasons**; key `EXPENSEFLOW:20`; case log `150ef759-fabc-7300-a14b-0b4a2b2ae11c`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-008
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify Finance classifies connected unsettled records into Policy Review, Pending Approval, Needs Rework, and Missing Receipt.

Synthetic data:
- EFREG008-PolicyReview.
- EFREG008-PendingApproval.
- EFREG008-Reworked.
- EFREG008-MissingReceipt Submitted with null receipt.
- EFREG008-SubmittedWithReceipt control.

Negative checks:
- Missing Receipt is derived from null receipt data, not stored as a status.
- A Submitted record with a receipt is not incorrectly listed.

Affected components/files:
- src/pages/FinancePage.tsx
- src/hooks/useFinance.tsx
- src/services/uipath/entityClient.ts
- src/models/status.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/pages/FinancePage.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/hooks/useFinance.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/entityClient.ts

</details>

Affected files: `src/pages/FinancePage.tsx`, `src/hooks/useFinance.tsx`, `src/services/uipath/entityClient.ts`, `src/models/status.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | All records are retrievable through Finance's unsettled query path. | Observed: Finance's connected unsettled attention query returned the four EFREG008 records EFREG008-PolicyReview-203800 (Policy Review, ₹82,000), EFREG008-PendingApproval-203800 (Pending Approval, ₹37,550), EFREG008-Reworked-203800 (Needs Rework, ₹5,900), and EFREG008-MissingReceipt-203800 (Missing Receipt, ₹2,500), each once across the two-page queue. The expected SubmittedWithReceipt control record was not visible in the connected attention list, so complete five-record retrieval could not be isolated in this environment; this is recorded as a limitation, not a product failure. | RESTRICTED | [trace](../../../../../../AppData/Roaming/UiPath Assistant/traces/f97355bd-7990-4189-99ef-826a15be4fb8/EF-REG-008-step01-trace.json); TM attachment `testStepLog:69a92a38-360e-4578-8b16-08df1a19787e;HasAttachment=true` |
| 2 | Each first four record appears once with the correct attention reason; the control is excluded. | Observed: Finance page 1 showed each of the first four EFREG008 records once with the correct attention reasons: Policy Review, Pending Approval, Needs Rework, and Missing Receipt. The SubmittedWithReceipt control was absent from the attention list, matching the expected exclusion condition. | PASS | [trace](../../../../../../AppData/Roaming/UiPath Assistant/traces/f97355bd-7990-4189-99ef-826a15be4fb8/EF-REG-008-step02-trace.json); TM attachment `testStepLog:c08b2487-4c0e-4501-8b17-08df1a19787e;HasAttachment=true` |
| 3 | Each row navigates to the matching expense detail. | Observed: each attention row navigated to the matching expense detail. PolicyReview opened /expenseflow/expenses/EFREG008-PolicyReview-203800 with Policy Review and ₹82,000; PendingApproval opened /expenseflow/expenses/EFREG008-PendingApproval-203800 with Pending Approval and ₹37,550; Reworked opened /expenseflow/expenses/EFREG008-Reworked-203800 with Needs Rework and ₹5,900; MissingReceipt opened /expenseflow/expenses/EFREG008-MissingReceipt-203800 with the matching identifier, ₹2,500, overall status Submitted, and No receipt attached. The queue reason for that row was Missing Receipt. | PASS | [trace](../../../../../../AppData/Roaming/UiPath Assistant/traces/f97355bd-7990-4189-99ef-826a15be4fb8/EF-REG-008-step03-trace.json); TM attachment `testStepLog:b089193b-5b7f-4554-8b18-08df1a19787e;HasAttachment=true` |

### EF-REG-009 — NOT RUN/RESTRICTED

Test case: **EF-REG-009 - Connected service errors expose retryable user feedback**; key `EXPENSEFLOW:21`; case log `89a010ad-fbbc-7300-002c-0b4a2b2ae13f`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-009
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify connected runtime/service failures are normalized into user-facing recovery states.

Synthetic data:
- Safe failure target EFREG009-Recovery.

Negative checks:
- No credentials, tokens, request headers, or raw stack traces are displayed.
- Unsafe fault injection is not attempted; unavailable capability is BLOCKED.

Affected components/files:
- src/components/ErrorState.tsx
- src/services/uipath/errors.ts
- src/hooks/useExpenses.tsx
- src/hooks/useFinance.tsx
- src/components/NewExpenseForm.tsx

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/components/ErrorState.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/errors.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/hooks/useExpenses.tsx

</details>

Affected files: `src/components/ErrorState.tsx`, `src/services/uipath/errors.ts`, `src/hooks/useExpenses.tsx`, `src/hooks/useFinance.tsx`, `src/components/NewExpenseForm.tsx`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The app presents a friendly error state or inline form error with a retry path; no raw provider exception is shown. | Observed: the connected Approval queue contained 24 cards, but the approved safe target EFREG009-Recovery was absent. The repository-approved ?demo=fail-decide hook is available only as a controlled pre-write demo route and cannot prove a real connected provider failure for the missing target. Restricted: no unrelated approval or unsafe fault injection was used. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-009-step01-trace.json); TM attachment `testStepLog:04e3d7e3-d20b-4875-9766-08df1a33073e;HasAttachment=true` |
| 2 | The page or operation recovers without requiring a full app reset and without duplicate writes. | BLOCKED: because EFREG009-Recovery was absent and no safe connected fault target was available, normal-condition restoration and Retry/re-submit recovery were not executed. No unrelated record was retried or changed. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-009-step02-trace.json); TM attachment `testStepLog:f915c26b-63ee-400f-9767-08df1a33073e;HasAttachment=true` |

### EF-REG-010 — NOT RUN/RESTRICTED

Test case: **EF-REG-010 - Connected receipt access failures are contained and recoverable**; key `EXPENSEFLOW:22`; case log `abc7cf93-fcbc-7300-28b0-0b4a2b2ae164`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-010
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify receipt retrieval failures do not break expense detail or expose internal storage information.

Synthetic data:
- Synthetic expense EFREG010-ReceiptAccess with receipt path metadata.

Negative checks:
- No raw signed URL, credential, or storage token is rendered.
- The expense record is not modified by a receipt read failure.

Affected components/files:
- src/components/ReceiptLink.tsx
- src/services/uipath/receipts.ts
- src/pages/ExpenseDetailPage.tsx
- src/services/uipath/errors.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/components/ReceiptLink.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/receipts.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/pages/ExpenseDetailPage.tsx

</details>

Affected files: `src/components/ReceiptLink.tsx`, `src/services/uipath/receipts.ts`, `src/pages/ExpenseDetailPage.tsx`, `src/services/uipath/errors.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The detail page remains usable and receipt access failure is handled without leaking implementation details. | RESTRICTED: The approved synthetic EFREG010-ReceiptAccess fixture and a controlled receipt-provider failure target were not available in connected Local staging. No unrelated expense was opened or modified, so receipt failure handling was not exercised. | RESTRICTED | not captured |
| 2 | Receipt access succeeds through the configured bucket path. | RESTRICTED: Because EFREG010-ReceiptAccess and a safe restored-access target were unavailable, normal authorized receipt retrieval was not executed. No unrelated receipt or expense record was accessed. | RESTRICTED | not captured |

### EF-REG-011 — NOT RUN/RESTRICTED

Test case: **EF-REG-011 - Locale-stable currency, compact amount, and date formatting**; key `EXPENSEFLOW:23`; case log `15bee759-fdbc-7300-9298-0b4a2b2ae186`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-011
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify financial and date values remain correct across locale and timezone differences.

Synthetic data:
- Amounts 48250, 4825000, 840000, and 12000000.
- Dates 2026-08-18, 2026-01-01, 2026-08-18T23:45:00+05:30, and invalid value not-a-date.

Negative checks:
- No locale-default US grouping appears for lakh-scale amounts.
- No new Date(YYYY-MM-DD) timezone shift or NaN undefined date output appears.

Affected components/files:
- src/lib/format.ts
- src/pages/DashboardPage.tsx
- src/pages/ExpenseDetailPage.tsx
- src/pages/FinancePage.tsx
- scripts/format.test.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/lib/format.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/pages/FinancePage.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/scripts/format.test.ts

</details>

Affected files: `src/lib/format.ts`, `src/pages/DashboardPage.tsx`, `src/pages/ExpenseDetailPage.tsx`, `src/pages/FinancePage.tsx`, `scripts/format.test.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Indian grouping is used; 840000 renders ₹8.4L and 12000000 renders ₹1.2Cr. | Observed: Fresh connected Dashboard and Finance views used Indian digit grouping for full values, and Finance displayed the current compact tile as ₹5.4L. The connected Finance dataset did not contain the canonical ₹8,40,000 and ₹1,20,00,000 fixtures needed to directly observe ₹8.4L and ₹1.2Cr in this run. An existing connected detail also rendered full Indian-grouped amounts such as ₹35,000 and ₹25,000. Restricted: exact canonical compact-value fixtures were unavailable; no records were created or changed to force them. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-011-step01-trace.json); TM attachment `testStepLog:8951d7ed-acb7-4f45-975c-08df1a33073e;HasAttachment=true` |
| 2 | 2026-08-18 displays 18 Aug 2026 without a previous-day shift; invalid date text remains unchanged. | Observed: Existing connected fixture EF2-1235-N displayed the date-only value 18 Aug 2026, matching the expected calendar date. The browser runtime was en-IN / Asia/Calcutta; an alternate timezone west of UTC was not safely configurable in the current runtime, and invalid date text cannot be supplied through the connected read-only UI. Restricted: alternate-timezone and invalid-date UI branches were not exercised; no data was changed. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-011-step02-trace.json); TM attachment `testStepLog:4490bbdb-edfc-4bed-975d-08df1a33073e;HasAttachment=true` |

### EF-REG-012 — NOT RUN/RESTRICTED

Test case: **EF-REG-012 - Runtime configuration, OAuth callback, and startup failure recovery**; key `EXPENSEFLOW:24`; case log `a7975289-febc-7300-cd68-0b4a2b2ae1a8`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-012
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify connected runtime starts only after valid configuration/schema warm-up and preserves non-OAuth query switches through callback cleanup.

Synthetic data:
- Valid resource configuration.
- Missing entity or folder configuration.
- Callback query containing code, state, session_state, iss, mock=1, and demo=fail.

Negative checks:
- Service calls do not run before runtime clients are registered and warmed.
- Callback cleanup does not replace the full query and lose mock/demo switches.

Affected components/files:
- src/hooks/useAuth.tsx
- src/services/uipath/runtime.tsx
- src/services/uipath/config.ts
- src/services/uipath/client.ts
- src/services/uipath/schema.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/hooks/useAuth.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/runtime.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/schema.ts

</details>

Affected files: `src/hooks/useAuth.tsx`, `src/services/uipath/runtime.tsx`, `src/services/uipath/config.ts`, `src/services/uipath/client.ts`, `src/services/uipath/schema.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | OAuth/runtime completes, schema and choice sets warm, and application routes render. | RESTRICTED: The valid connected startup route was not independently executed in this publication because the paired isolated invalid/missing-resource configuration was unavailable. No startup or runtime behavior is claimed from this restricted result. | RESTRICTED | not captured |
| 2 | Could not connect to UiPath splash and Reload action appear instead of partial application rendering. | RESTRICTED: The isolated invalid or missing-resource configuration required to verify the Could not connect to UiPath and Reload state was not available. No shared runtime configuration was changed. | RESTRICTED | not captured |
| 3 | OAuth keys are removed after completion while mock and demo switches remain. | RESTRICTED: The controlled OAuth callback scenario with preserved non-OAuth query switches was not executed because the isolated callback/runtime setup was unavailable. No callback query or connected data was mutated. | RESTRICTED | not captured |

### EF-REG-013 — NOT RUN/RESTRICTED

Test case: **EF-REG-013 - Authorization characterization for approvals and Finance**; key `EXPENSEFLOW:25`; case log `ea724388-ffbc-7300-7a16-0b4a2b2ae1cb`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-013
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Determine whether least-privilege identities can access or act through approvals and Finance routes.

Synthetic data:
- Pending approval expense EFREG013-pending.
- Finance attention expense EFREG013-finance.

Negative checks:
- Route visibility alone is not authorization.
- Unauthorized action does not update Action Center or Data Fabric.

Affected components/files:
- src/App.tsx
- src/pages/ApprovalPage.tsx
- src/pages/FinancePage.tsx
- src/hooks/useAuth.tsx
- src/services/uipath/errors.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/App.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/pages/ApprovalPage.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/pages/FinancePage.tsx

</details>

Affected files: `src/App.tsx`, `src/pages/ApprovalPage.tsx`, `src/pages/FinancePage.tsx`, `src/hooks/useAuth.tsx`, `src/services/uipath/errors.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The employee does not gain successful approval or Finance actions merely by entering a route. | RESTRICTED: A separate least-privilege employee identity was not available for the Local staging run. Route visibility and authorization behavior were not inferred, and no authorization-sensitive action was attempted. | RESTRICTED | not captured |
| 2 | Unauthorized attempt is unavailable or denied without mutation; authorized identity receives required queue/data and decisions. | RESTRICTED: The required least-privilege identity, EFREG013-pending fixture, and authorized comparison identity were unavailable together. No unauthorized or authorized decision was attempted on an unrelated record. | RESTRICTED | not captured |

### EF-REG-014 — PASS

Test case: **EF-REG-014 - Pagination clamps after result-set reduction**; key `EXPENSEFLOW:26`; case log `a8a9a459-00bd-7300-57a0-0b4a2b2ae1ee`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-014
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify client pagination clamps to page 1 when sorting or filtering reduces a result set below the current page.

Synthetic data:
- At least 26 employee expenses.
- A filter value narrowing the output to 1 through 3 records.

Negative checks:
- No blank table body appears while matching records exist.
- No page number exceeds total pages and Previous/Next disable at boundaries.

Affected components/files:
- src/components/TablePager.tsx
- src/components/ExpenseTable.tsx
- src/pages/FinancePage.tsx
- src/pages/ExpenseListPage.tsx

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/components/TablePager.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/components/ExpenseTable.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/pages/FinancePage.tsx

</details>

Affected files: `src/components/TablePager.tsx`, `src/components/ExpenseTable.tsx`, `src/pages/FinancePage.tsx`, `src/pages/ExpenseListPage.tsx`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | Footer indicates page 2 and displays rows 26 and later. | Observed: Connected My Expenses loaded 66 records. Initial footer showed Showing 1–25 of 66, Page 1 of 3, with Next enabled. After the semantic Next-page action, the footer showed Showing 26–50 of 66, Page 2 of 3, 25 rows, and the first visible row was EFREG001-High-EFQA-20260924T1030 / EXP-1007. | PASS | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-014-step01-trace.json); TM attachment `testStepLog:0292e815-1752-4fe7-9759-08df1a33073e;HasAttachment=true` |
| 2 | Table automatically renders valid page-1 results and footer indicates Page 1 of 1. | Observed: While the connected My Expenses list was on page 2, the non-destructive Status=Rejected filter reduced the result set to two rows and automatically clamped the table to Showing 1–2 of 2. The two visible rows were rejected synthetic records and no data was modified. | PASS | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-014-step02-trace.json); TM attachment `testStepLog:629070e2-7428-4db4-975a-08df1a33073e;HasAttachment=true` |
| 3 | Finance pagination clamps to a valid page with correct disabled boundaries. | Observed: Connected Finance loaded 29 attention records. Page 1 showed Showing 1–25 of 29, Page 1 of 2, with Next enabled. Page 2 showed Showing 26–29 of 29, Page 2 of 2, four rows, Previous enabled, and Next disabled. The required reduction after page 2 could not be exercised safely because it would require approving or otherwise mutating existing approval records; no unrelated records were changed. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-014-step03-trace.json); TM attachment `testStepLog:3fdeb98f-31aa-46f4-975b-08df1a33073e;HasAttachment=true` |

### EF-REG-015 — NOT RUN/RESTRICTED

Test case: **EF-REG-015 - Finance month-end bounds include actual last days for 28, 29, and 30-day months**; key `EXPENSEFLOW:77`; case log `b234d275-01bd-7300-0348-0b4a2b2ae21b`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-015
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify Finance date-range bounds use the actual last day for 28-day, leap-year 29-day, and 30-day months, and that server-side counts and totals include boundary records exactly once.

Preconditions:
- Connected staging runtime is healthy and the Finance route is authorized.
- ExpenseFlow_Expense schema, Status/Category choice sets, and Finance query permissions are available.
- Use an isolated synthetic data scope with a unique run identifier.

Synthetic data:
- Non-Draft Finance records on 2026-02-28, 2028-02-29, and 2026-04-30 with known amounts and statuses.
- A 2026-05-31 control record and a next-day record outside each selected month.
- Expected counts and totals are calculated before opening Finance.

Negative checks:
- Selecting February, including the leap-year February control, and a 30-day month never generates an invalid 31st-day query or a Data Fabric 400.
- A record on the actual last day is included exactly once, while the next-day record is excluded.
- Displayed count and total match the expected boundary-inclusive dataset rather than an off-by-one or timezone-shifted range.
- No stale data from the previous month remains after changing the date range.

Affected components/files:
- src/services/uipath/entityClient.ts
- src/hooks/useFinance.tsx
- src/pages/FinancePage.tsx
- src/lib/format.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/entityClient.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/hooks/useFinance.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/pages/FinancePage.tsx

</details>

Affected files: `src/services/uipath/entityClient.ts`, `src/hooks/useFinance.tsx`, `src/pages/FinancePage.tsx`, `src/lib/format.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The isolated dataset contains the planned last-day and outside-range records with recorded expected counts and totals. | RESTRICTED: The isolated month-end synthetic data scope for 2026-02-28, 2028-02-29, 2026-04-30, and next-day controls was unavailable. No shared Finance data was seeded or changed. | RESTRICTED | not captured |
| 2 | Each query completes without a Data Fabric 400 or invalid-date error, and the selected range is shown correctly. | RESTRICTED: The required isolated boundary dataset was unavailable, so the three month-range queries were not executed against unrelated Finance records. | RESTRICTED | not captured |
| 3 | The 28th and 29th day records are included exactly once, the next-day controls are excluded, and no stale month rows remain. | RESTRICTED: February 2026 and leap-year February 2028 boundary verification was dependent on the unavailable isolated dataset; no inclusion or exclusion result is claimed. | RESTRICTED | not captured |
| 4 | The April 30th record is included, April 31st is never queried, and the Finance count and total equal the expected boundary-inclusive values. | RESTRICTED: April 2026 boundary aggregation could not be verified without the approved isolated dataset. No shared Finance aggregate was treated as equivalent evidence. | RESTRICTED | not captured |
| 5 | Boundary records remain stable after refresh and range changes; no off-by-one, duplicate, timezone-shifted, or stale aggregate appears. | RESTRICTED: Refresh and range-change stability was not run because the required isolated month-end records were unavailable and unrelated data could not be substituted safely. | RESTRICTED | not captured |

### EF-REG-017 — NOT RUN/RESTRICTED

Test case: **EF-REG-017 - Live policy change between display and submit uses current threshold**; key `EXPENSEFLOW:78`; case log `32f5a4f0-02bd-7300-ecdf-0b4a2b2ae23c`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-017
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify a submission evaluates the live policy asset at submit time even when the form was loaded while an older threshold was displayed.

Preconditions:
- Connected staging runtime is healthy and the policy asset is writable by the authorized test operator.
- Use an isolated threshold change window and record the original asset value for restoration.
- Use a unique synthetic expense and do not reuse a prior task or expense code.

Synthetic data:
- Initial policy threshold: 25000.
- Updated live policy threshold: 30000.
- Synthetic expense amount: 27500, between the old and new thresholds.
- Unique description: EFREG017-LivePolicy.

Negative checks:
- The submit path does not trust a threshold cached when the form first loaded.
- The expense is not incorrectly routed using the old 25000 threshold after the asset changes to 30000.
- The persisted policy note/decision and displayed result agree with the live value used at submit time.
- Refresh or retry does not create a duplicate record or approval task.

Affected components/files:
- src/components/NewExpenseForm.tsx
- src/services/expenseService.ts
- src/services/uipath/policy.ts
- src/hooks/useExpenses.tsx

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/components/NewExpenseForm.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/expenseService.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/policy.ts

</details>

Affected files: `src/components/NewExpenseForm.tsx`, `src/services/expenseService.ts`, `src/services/uipath/policy.ts`, `src/hooks/useExpenses.tsx`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The form displays the initial policy context and the original asset value is recorded for later restoration. | RESTRICTED: The authorized isolated policy-asset context required to record and verify the original threshold was unavailable. No shared policy value was read as a substitute and no asset was changed. | RESTRICTED | not captured |
| 2 | The asset read succeeds and the open form still represents the earlier display state while the live value is now 30000. | RESTRICTED: Authorized mutation of the live policy asset from 25000 to 30000 was not available. No policy asset or shared configuration was modified. | RESTRICTED | not captured |
| 3 | The submit path evaluates the live 30000 threshold rather than the cached 25000 value; the user-facing decision/routing is correct for 27500 versus 30000. | RESTRICTED: The live-threshold submission could not be exercised without the authorized isolated policy change window and synthetic EFREG017-LivePolicy record. No expense was submitted. | RESTRICTED | not captured |
| 4 | The persisted record and policy note reflect the live 30000 decision, no stale 25000 decision is recorded, and no duplicate record or task is created. | RESTRICTED: No persisted policy decision or approval task was inspected because the protected policy mutation and synthetic submission were unavailable. No duplicate record or task was created by this run. | RESTRICTED | not captured |
| 5 | The original policy value is restored and the synthetic record remains a single intact audit object. | RESTRICTED: The original threshold could not be restored because no authorized policy mutation was performed. Shared policy state was left unchanged. | RESTRICTED | not captured |

### EF-REG-018 — FAIL

Test case: **EF-REG-018 - URL switches persist across navigation and disable cleanly after removal**; key `EXPENSEFLOW:79`; case log `6ecb2de4-03bd-7300-ca13-0b4a2b2ae25e`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-018
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify mock, demo-failure, and simulated-read-error URL switches remain stable across client-side navigation, do not create extra browser history, and are disabled after removal and a hard reload.

Preconditions:
- Local ExpenseFlow app is reachable at the verified local URL and runs in mock mode.
- Use a clean browser tab with navigation history recorded before each variant.
- The browser supports inspecting the current URL and Back behavior without reloading two-segment routes directly.

Synthetic data:
- Query variants: ?mock=1, ?mock=1&demo=fail, and ?mock=1&simulateError=1.
- Dashboard, Expenses, New Expense, Approvals, and Finance routes.
- A successful mock submission and a one-shot submit failure for the recovery checks.

Negative checks:
- URL switches survive sidebar/client-side navigation and are not silently dropped.
- Client-side navigation does not add an extra Back history entry for the same route transition.
- Removing a switch and hard-loading the resulting URL disables the prior behavior; stale query state is not retained in application memory.
- A one-shot demo failure is consumed once and does not poison later normal submissions.
- Two-segment routes are reached by clicking in the app; direct reload of /expenses/new or /expenses/:code is not used as a valid path.

Affected components/files:
- src/App.tsx
- src/components/AppLayout.tsx
- src/components/Sidebar.tsx
- src/hooks/useAuth.tsx
- src/services/demoFailure.ts
- vite.config.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/App.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/components/AppLayout.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/hooks/useAuth.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/demoFailure.ts

</details>

Affected files: `src/App.tsx`, `src/components/AppLayout.tsx`, `src/components/Sidebar.tsx`, `src/hooks/useAuth.tsx`, `src/services/demoFailure.ts`, `vite.config.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The mock=1 switch remains present after each client-side navigation and every screen renders from the mock service without an OAuth or connected-mode dependency. | Observed: Loaded https://testcloud-team.staging.uipath.host/expenseflow/?mock=1 and verified Dashboard, My Expenses, New Expense, Approvals, and Finance rendered from the mock service. The mock=1 switch remained present across the observed routes, and no OAuth callback keys were present. | PASS | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-018-step01-trace.json); TM attachment `testStepLog:1101e96f-c0de-42b5-8b2e-08df1a19787e;HasAttachment=true` |
| 2 | The two-segment route is reached by clicking, the switch is preserved, and navigation does not create an extra duplicate history entry for the same transition. | Observed: From /expenseflow/finance?mock=1, in-app navigation reached /expenseflow/expenses/new?mock=1 and returned to /expenseflow/expenses?mock=1. The mock switch remained present, the two-segment route rendered, and browser history advanced by one entry per transition without a duplicate same-route entry. | PASS | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-018-step02-trace.json); TM attachment `testStepLog:e2cad0f9-4441-4895-8b2f-08df1a19787e;HasAttachment=true` |
| 3 | The first submit shows the translated recoverable failure and preserves form data; the failure is consumed and the retry succeeds without a false success on the first attempt. | Observed: In a fresh mock tab at /expenseflow/expenses/new?mock=1&demo=fail, the first synthetic submit (EFREG018-Mock-Retry, Travel, 3300) showed the translated recoverable failure and preserved the description, amount, and date. Retrying with the same URL showed the same failure again; no success state or created-record confirmation appeared. The approved source implementation reads the demo flag on every call, so the failure remains armed until the demo query parameter is removed. Expected one-shot consumption and retry success were not observed. | FAIL | TM attachment `testStepLog:503dd4a2-285d-4159-8b30-08df1a19787e;HasAttachment=true` |
| 4 | The simulated read failure remains active across client-side navigation, shows the translated error/retry state without a raw exception, and does not create a connected request. | Observed: Loaded /expenseflow/?mock=1&simulateError=1 and navigated to /expenseflow/finance?mock=1&simulateError=1. The translated read-failure state showed 'Something went wrong', 'Could not reach the expense service', and 'Try again'; the simulated-error switch persisted and no raw exception, stack trace, token, credential, or secret terms were exposed. | PASS | TM attachment `testStepLog:bb697c2c-ae6f-4708-8b31-08df1a19787e;HasAttachment=true` |
| 5 | The simulated failure and demo switch are no longer active after hard load; normal mock data renders, the URL contains only the intended remaining query state, and history remains coherent. | Observed: Hard-loaded /expenseflow/?mock=1 after removing the demo and simulateError switches, then navigated to /expenseflow/finance?mock=1. Normal mock aggregates and five attention rows rendered; demo and simulateError were absent from the URL, no error panel was present, and the mock state remained healthy after navigation. | PASS | TM attachment `testStepLog:099fcfa5-db6e-4a2a-8b32-08df1a19787e;HasAttachment=true` |

### EF-REG-022 — PASS

Test case: **EF-REG-022 - Over-threshold submission creates one linked approval task**; key `EXPENSEFLOW:80`; case log `096abcd7-04bd-7300-6871-0b4a2b2ae282`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-022
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify an over-threshold submission creates exactly one approval task in the intended folder and preserves an auditable link between the Action Center task and the Data Fabric expense record.

Preconditions:
- Connected staging runtime is healthy and the authorized employee can submit expenses.
- The live policy threshold, intended Orchestrator folder, Action Center task type, and ExpenseFlow_Expense schema are recorded.
- No prior EFREG022-ApprovalLink expense, approval task, or task link exists in the isolated synthetic scope.

Synthetic data:
- Unique description: EFREG022-ApprovalLink.
- Connected expense amount: 35000, confirmed above the live policy threshold immediately before submit.
- Category: Travel; date: 2026-09-24; no receipt unless the configured policy requires one.
- Expected task title, priority, folder, and decision facts are recorded before execution.

Negative checks:
- Exactly one Action Center task is created in the intended folder for the submitted record.
- Task title/payload/priority carry the expense code, amount, employee/decision facts, and approval reason without exposing credentials or raw tokens.
- ApprovalTaskId is persisted as text on the expense record and remains navigable/inspectable after refresh.
- Refresh, retry, or revisiting the detail route does not create a duplicate record or approval task.
- A task-creation failure does not result in a falsely linked or partially claimed approval state.

Affected components/files:
- src/components/NewExpenseForm.tsx
- src/services/expenseService.ts
- src/services/uipath/approvals.ts
- src/services/uipath/folders.ts
- src/services/uipath/entityClient.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/components/NewExpenseForm.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/expenseService.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/approvals.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/folders.ts

</details>

Affected files: `src/components/NewExpenseForm.tsx`, `src/services/expenseService.ts`, `src/services/uipath/approvals.ts`, `src/services/uipath/folders.ts`, `src/services/uipath/entityClient.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The amount is confirmed above the live threshold, the intended folder/task facts are recorded, and the isolated scope has no prior matching record or task. | Observed: the live policy threshold was ₹25,000, and the existing queue showed a different prior EFREG022-ApprovalLink record/task. A fresh timestamped description was prepared at ₹35,000; the exact pre-submit absence check for the new description and the intended Action Center folder/task facts were not directly available. Restricted: no existing record was reused or mutated. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-022-step01-trace.json); TM attachment `testStepLog:588c1b79-48d0-4524-0996-08df1a31d8f8;HasAttachment=true` |
| 2 | Exactly one Data Fabric expense record is created and the user-facing result states that manager approval is required; no duplicate submit is issued. | Observed: the fresh synthetic expense EFREG022-ApprovalLink-EFQA-20260925T1245 was submitted once for ₹35,000. The form reset and displayed the confirmation EXP-1039 submitted for ₹35,000; no duplicate submit was issued. | PASS | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-022-step02-trace.json); TM attachment `testStepLog:04b0415c-be4b-4f53-0997-08df1a31d8f8;HasAttachment=true` |
| 3 | Exactly one task exists in the intended folder; title, priority, payload, amount, expense code, employee/decision facts, and approval reason match the submitted record without secrets. | Observed: the approvals queue displayed exactly one fresh EXP-1039 card with ₹35,000, threshold ₹25,000, date 25 Sep 2026, no receipt, the manager-approval reason, and one visible linked task #101661275. Restricted: Action Center task-form inspection required an unresolved organization-unit/folder id, and the cross-folder read-only lookup failed; priority and hidden task payload fields were not claimed. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-022-step03-trace.json); TM attachment `testStepLog:f503d7d1-b862-4614-0998-08df1a31d8f8;HasAttachment=true` |
| 4 | ApprovalTaskId is persisted as text, matches the single Action Center task id, and the record remains navigable with consistent PendingApproval/task-link data. | Observed: the fresh detail route for EXP-1039 showed Pending Approval, ₹35,000, Submitted and Policy validation completed, Manager approval active, Finance processing pending, and Waiting on a manager in Action Center. Restricted: ApprovalTaskId was not rendered on the detail route, so its persisted text value was not independently verified. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-022-step04-trace.json); TM attachment `testStepLog:28fa52a9-5435-49f4-0999-08df1a31d8f8;HasAttachment=true` |
| 5 | No additional record or task is created; the original record and task identifiers remain stable and the linked approval state is idempotent. | Observed after refresh: exactly one EFREG022-ApprovalLink-EFQA-20260925T1245 card and one occurrence of task #101661275 remained in the approvals queue. Revisiting the detail showed the same EXP-1039 record still Pending Approval with no second decision or task; no duplicate submission was issued. | PASS | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-022-step05-trace.json); TM attachment `testStepLog:9cd4d55f-6102-4c7e-099a-08df1a31d8f8;HasAttachment=true` |

### EF-REG-023 — PASS

Test case: **EF-REG-023 - External task completion conflict prevents duplicate app decision**; key `EXPENSEFLOW:81`; case log `878ca4d4-05bd-7300-454e-0b4a2b2ae2a6`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-023
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify the app handles an Action Center task completed externally before the same decision is submitted in the app, returning the specific completed-task conflict and leaving the Data Fabric expense unchanged.

Preconditions:
- Connected staging runtime is healthy and an authorized manager can access both the app and Action Center.
- An isolated pending-approval expense and its Action Center task can be completed from a separate channel.
- Capture the original Data Fabric record fields and task state before the race.

Synthetic data:
- Unique pending expense: EFREG023-ExternalComplete.
- Action Center task linked to that expense.
- External decision: Approve with comment Completed externally for regression.
- App decision attempt: the same Approve action after the task is already completed.

Negative checks:
- The app shows the specific already-completed-task message rather than a generic success or raw service error.
- The app does not mutate the Data Fabric record after the external completion conflict.
- No duplicate Action Center task, decision, comment, or approval record is created.
- Refresh and revisiting the approval/detail route do not convert the conflict into a false success.

Affected components/files:
- src/pages/ApprovalPage.tsx
- src/services/expenseService.ts
- src/services/uipath/approvals.ts
- src/services/uipath/entityClient.ts
- src/services/uipath/errors.ts

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/pages/ApprovalPage.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/expenseService.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/approvals.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/errors.ts

</details>

Affected files: `src/pages/ApprovalPage.tsx`, `src/services/expenseService.ts`, `src/services/uipath/approvals.ts`, `src/services/uipath/entityClient.ts`, `src/services/uipath/errors.ts`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The expense is PendingApproval, the task link is present, and the original record/task snapshot is captured before the race. | Observed: the connected approvals card for EFREG023-ExternalComplete-EFQA-20260924T1400 showed EXP-1030 as Pending Approval with Task #101647510, amount ₹35,000, and the above-threshold reason. Canonical Action Center readback showed that task was already Completed with action Approve and comment Completed externally for regression. Restricted: a fresh pending-task snapshot before external completion was unavailable; no task was re-completed. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-023-step01-trace.json); TM attachment `testStepLog:f0f045d1-5384-4c61-8b51-08df1a19787e;HasAttachment=true` |
| 2 | The Action Center task reaches its completed state and the external decision is recorded once. | BLOCKED: Action Center task #101647510 was already Completed with Approve and the approved external comment, so the external completion action was not repeated. Restricted: the fresh race setup could not be recreated without attempting a duplicate task completion. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-023-step02-trace.json); TM attachment `testStepLog:6242be90-2ff3-46b0-8b52-08df1a19787e;HasAttachment=true` |
| 3 | The app returns the specific already-completed-task conflict message; it does not show a false success or raw exception. | Observed: submitting the app-side Approve action once for the dedicated EF-REG-023 card returned the specific conflict message that ExpenseFlow could not record the decision because the Action Center action was already completed by the same user. No false success or raw exception was shown. | PASS | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-023-step03-trace.json); TM attachment `testStepLog:aa469fa8-7f52-4585-8b53-08df1a19787e;HasAttachment=true` |
| 4 | The Data Fabric record has no second decision mutation or duplicate comment, the task remains completed, and no second task is created. | Observed: the EXP-1030 detail remained Pending Approval with the same ₹35,000 record and manager-approval state; no duplicate marker was present. Canonical task readback remained Completed with action Approve and comment Completed externally for regression, with no second task or second completion created. | PASS | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-023-step04-trace.json); TM attachment `testStepLog:b9bac21d-b47e-461b-8b54-08df1a19787e;HasAttachment=true` |
| 5 | The completed-task conflict remains accurately represented, no duplicate decision/task appears, and the original record/task identifiers remain stable. | Observed after refresh: exactly one EFREG023-ExternalComplete-EFQA-20260924T1400 card, one EXP-1030 occurrence, and one Task #101647510 occurrence remained. Restricted: the post-refresh page did not retain the transient conflict banner, so persistent conflict-message rendering after refresh was not independently verified; no duplicate decision or task was observed. | RESTRICTED | [trace](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/EF-REG-023-step05-trace.json); TM attachment `testStepLog:6752dd3f-d914-4101-8b55-08df1a19787e;HasAttachment=true` |

### EF-REG-024 — NOT RUN/RESTRICTED

Test case: **EF-REG-024 - Empty Finance dataset renders zero aggregates and no-data state**; key `EXPENSEFLOW:82`; case log `95af9181-06bd-7300-aa2b-0b4a2b2ae2c9`; execution [link](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6).

<details><summary>Objective, preconditions, synthetic data, negative checks, and source traceability</summary>

Stable ID: EF-REG-024
Catalog: regression
Approved source SHA: 571c2192d3d786a03eb7f57d89bec70998ef1d57

Objective: Verify the Finance view behaves correctly when the connected dataset contains no non-Draft records: zero aggregates, an explicit no-data month presentation, no invalid date-range query, and an empty attention state.

Preconditions:
- Connected staging runtime is healthy and the Finance route is authorized.
- Use an isolated synthetic tenant/data scope with no non-Draft ExpenseFlow_Expense records.
- If a Draft control record is retained, its exclusion from Finance aggregates is recorded before execution.

Synthetic data:
- Zero Submitted, Approved, PendingApproval, PolicyReview, Rejected, and Reworked records in the selected month.
- Optional Draft-only control record outside the aggregate population.
- Selected month has no valid expense rows and expected count/total are both zero.

Negative checks:
- Finance displays zero count and zero total without NaN, undefined, stale values, or a false positive aggregate.
- The month presentation is null/no-data or the documented empty equivalent rather than an invented date.
- No invalid date-range query is issued for an empty dataset and no Data Fabric 400 is surfaced.
- The needs-attention queue shows its intentional empty state and does not classify Draft-only data as attention.
- Refresh, date-range changes, and navigation do not repopulate stale rows from a prior dataset.

Affected components/files:
- src/pages/FinancePage.tsx
- src/hooks/useFinance.tsx
- src/services/uipath/entityClient.ts
- src/services/uipath/mappers.ts
- src/components/TablePager.tsx

Source traceability:
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/pages/FinancePage.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/hooks/useFinance.tsx
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/entityClient.ts
- https://github.com/JD2091/expenseflow/blob/571c2192d3d786a03eb7f57d89bec70998ef1d57/src/services/uipath/mappers.ts

</details>

Affected files: `src/pages/FinancePage.tsx`, `src/hooks/useFinance.tsx`, `src/services/uipath/entityClient.ts`, `src/services/uipath/mappers.ts`, `src/components/TablePager.tsx`; source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`.

| # | Expected | Actual | Result | Evidence |
|---:|---|---|---|---|
| 1 | The selected scope contains no aggregate-eligible records; any Draft-only control is explicitly identified and excluded from expected Finance results. | RESTRICTED: An isolated Finance scope with no non-Draft ExpenseFlow_Expense records was unavailable. No connected records were deleted, reclassified, or otherwise changed to manufacture an empty dataset. | RESTRICTED | not captured |
| 2 | Finance renders zero count and zero total without NaN, undefined, stale values, a raw exception, or a Data Fabric 400. | RESTRICTED: Finance initial-load behavior for an approved empty scope was not exercised because the isolated no-data dataset was unavailable; existing connected rows were not treated as empty-state evidence. | RESTRICTED | not captured |
| 3 | The month presentation is the documented null/no-data state rather than an invented date, and the date range remains valid without issuing an invalid query. | RESTRICTED: Empty-month summary and date-range behavior could not be verified without the isolated Finance scope. No invalid query or empty-state claim is made. | RESTRICTED | not captured |
| 4 | The attention area shows its intentional empty state, Draft-only data is not classified as attention, and the table/pager do not display phantom rows or invalid navigation. | RESTRICTED: The empty needs-attention queue and table/pager behavior were not exercised because the required isolated empty dataset was unavailable. No unrelated Finance records were filtered or changed. | RESTRICTED | not captured |
| 5 | Zero aggregates, the no-data presentation, and the empty attention state remain stable; no rows or totals from a prior dataset reappear. | RESTRICTED: Refresh, range-change, and navigation stability for an empty Finance dataset was not run without the isolated scope. No stale-data conclusion is claimed. | RESTRICTED | not captured |

## Failure analysis

- Test Manager step `337e7d05-23c4-0e00-d931-0b4a2a2c222b` / step log `503dd4a2-285d-4159-8b30-08df1a19787e`: Observed: In a fresh mock tab at /expenseflow/expenses/new?mock=1&demo=fail, the first synthetic submit (EFREG018-Mock-Retry, Travel, 3300) showed the translated recoverable failure and preserved the description, amount, and date. Retrying with the same URL showed the same failure again; no success state or created-record confirmation appeared. The approved source implementation reads the demo flag on every call, so the failure remains armed until the demo query parameter is removed. Expected one-shot consumption and retry success were not observed.

Likely affected components are listed in the corresponding case sections above; this run records the observed product failure without converting prerequisite gaps into failures.

## Missing or failed evidence

- `3b1f5c5d-667a-0e00-35c1-0b4a287e1e40` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `c3f5dd3f-687a-0e00-58a8-0b4a287e2070` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `7fb64d90-6d7a-0e00-8339-0b4a287e5886` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `07140bab-16c4-0e00-5f62-0b4a2a2bb406` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `2531f50a-7b7a-0e00-d7e7-0b4a287ebd87` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `f1f48af1-7d7a-0e00-8499-0b4a287ebff5` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `6a29c3eb-947a-0e00-2776-0b4a287f5177` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `152b73ce-997a-0e00-d411-0b4a287f5971` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `2f4161e3-9b7a-0e00-5710-0b4a287f5e04` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `73677f85-9f7a-0e00-4c15-0b4a287f86ac` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `aa28e2c5-a07a-0e00-eab4-0b4a287f897a` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `f80b429e-17c4-0e00-b112-0b4a2a2bd9e9` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `3171814b-18c4-0e00-63c4-0b4a2a2bdafe` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `c3232ec6-19c4-0e00-b256-0b4a2a2bdbf1` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `e0aa6f54-1ac4-0e00-f162-0b4a2a2bdcd5` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `bda566be-1bc4-0e00-1298-0b4a2a2bddd8` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `e0d17641-1cc4-0e00-8b69-0b4a2a2bfeac` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `a71f1102-1dc4-0e00-086f-0b4a2a2bffa1` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `23a091e0-1ec4-0e00-941f-0b4a2a2c00bb` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `266e9e92-1fc4-0e00-8791-0b4a2a2c01a3` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `533c9c22-20c4-0e00-292c-0b4a2a2c02aa` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `209bb1de-30c4-0e00-46c7-0b4a2a2c7567` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `9a161eaa-31c4-0e00-f09f-0b4a2a2c76c7` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `f6c7aa29-32c4-0e00-7e65-0b4a2a2c77ec` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `492160f6-33c4-0e00-42ff-0b4a2a2c792b` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.
- `36311f0e-34c4-0e00-a5d4-0b4a2a2c7a2a` (not-captured): No Test Manager attachment and no local execution trace were verified for this step.

## Limitations and uncovered risks

- 47 steps were published as Restricted because approved fixtures, identities, isolated datasets, safe fault targets, or authorized configuration were unavailable; these are not product failures.
- 26 of 68 step logs have no Test Manager attachment flag; no evidence was fabricated for those steps.
- 30 local per-step execution-trace files were verified in the current execution trace directory; 12 additional attachments are confirmed by Test Manager but were not locally staged in this directory.
- No standalone screenshot files were claimed in this manifest; screenshotRelativePath is null unless a file is independently verified. Trace attachments are the evidence source where present.
- Synthetic staging records and tasks were retained for audit; no unrelated approval, policy, tenant, or shared data mutation was performed.
- No commit range or pull request was analyzed in this continuation run. Case definitions carry approved source traceability to the source SHA listed per case.

## Baseline update decision

**Not advanced.** The prior successful baseline is preserved as `null`; the current run contains one confirmed product failure and restricted/unexercised prerequisites.

## Evidence manifest

- [Machine-readable evidence manifest](../traces/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6/evidence-manifest.json)
- [Execution in Test Manager](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/13ecfea8-591d-0e00-db4b-0b4a2b2adfd6)
