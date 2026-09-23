# ExpenseFlow QA Report — 20260923T160000

Generated: 2026-09-23T11:03:35.337Z

## Scope

- Project: EXPENSEFLOW (ec245f49-f3da-0200-9a6c-0b4a286e44f7)
- Repository: https://github.com/JD2091/expenseflow
- Branch/SHA: `main` / `571c2192d3d786a03eb7f57d89bec70998ef1d57`
- Connected URL: http://localhost:5173
- UiPath: staging / testcloud_team / TAM
- Approved source SHA: `571c2192d3d786a03eb7f57d89bec70998ef1d57`

## Final totals

- Approved catalog coverage: **24 cases / 63 steps**
- Step classifications: **44 Passed / 3 Failed / 16 Blocked**
- Smoke execution: **8 Passed / 2 Failed / 0 None**, Finished
- Regression execution: **6 Passed / 1 Failed / 7 None (blocked)**, Finished

## Test Manager executions

- Smoke: [cb776125-ebc2-0d00-2da6-0b4a2881d0d9](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/cb776125-ebc2-0d00-2da6-0b4a2881d0d9)
- Regression: [618057ff-ecc2-0d00-fa65-0b4a2881d4ef](https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/618057ff-ecc2-0d00-fa65-0b4a2881d4ef)

## Case results

| Stable ID | Classification | Test Manager result | Steps | Log ID |
|---|---|---|---:|---|
| EF-SMOKE-001 | Passed | Passed | 3 | 423cf684-41a1-6f00-4b92-0b4a2881d0f7 |
| EF-SMOKE-002 | Passed | Passed | 4 | e9634819-42a1-6f00-7954-0b4a2881d10e |
| EF-SMOKE-003 | Passed | Passed | 3 | 1d222bb0-43a1-6f00-05b7-0b4a2881d123 |
| EF-SMOKE-004 | Passed | Passed | 3 | 591ff6e6-44a1-6f00-3b83-0b4a2881d137 |
| EF-SMOKE-005 | Passed | Passed | 3 | 652325f0-45a1-6f00-71dc-0b4a2881d14a |
| EF-SMOKE-006 | Passed | Passed | 2 | 90bf1fd1-46a1-6f00-a73c-0b4a2881d15f |
| EF-SMOKE-007 | Failed | Failed | 2 | 2973819e-47a1-6f00-0012-0b4a2881d17c |
| EF-SMOKE-008 | Passed | Passed | 3 | da1d437d-48a1-6f00-934a-0b4a2881d198 |
| EF-SMOKE-009 | Passed | Passed | 3 | 6a9b960e-49a1-6f00-baf3-0b4a2881d1ac |
| EF-SMOKE-010 | Failed | Failed | 3 | d54d0638-4aa1-6f00-5519-0b4a2881d1c0 |
| EF-REG-001 | Passed | Passed | 3 | 61507c0a-4ba1-6f00-f246-0b4a2881d513 |
| EF-REG-002 | Passed | Passed | 2 | dd54b1b0-4ca1-6f00-8c01-0b4a2881d527 |
| EF-REG-003 | Passed | Passed | 2 | 328a5c8d-4da1-6f00-25bc-0b4a2881d53c |
| EF-REG-004 | Passed | Passed | 2 | 48c287f0-50a1-6f00-7765-0b4a2881d550 |
| EF-REG-005 | Passed | Passed | 3 | dccfc954-51a1-6f00-079c-0b4a2881d564 |
| EF-REG-006 | Passed | Passed | 3 | cc6831f2-52a1-6f00-8001-0b4a2881d579 |
| EF-REG-007 | Blocked | None | 2 | b9553946-53a1-6f00-c6f7-0b4a2881d58c |
| EF-REG-008 | Blocked | None | 3 | a0b347eb-54a1-6f00-2b7e-0b4a2881d5a1 |
| EF-REG-009 | Blocked | None | 2 | 506f9c9f-55a1-6f00-ef47-0b4a2881d5b5 |
| EF-REG-010 | Blocked | None | 2 | 029ef2c0-56a1-6f00-b7e2-0b4a2881d5c9 |
| EF-REG-011 | Blocked | None | 2 | a4a28446-57a1-6f00-59a7-0b4a2881d5dd |
| EF-REG-012 | Blocked | None | 3 | 2b0bba0f-58a1-6f00-9527-0b4a2881d5f0 |
| EF-REG-013 | Blocked | None | 2 | abb0f974-59a1-6f00-f10d-0b4a2881d604 |
| EF-REG-014 | Failed | Failed | 3 | a00db41b-5aa1-6f00-7de3-0b4a2881d619 |

## Confirmed product failures

| Case | Expected | Actual |
|---|---|---|
| EF-SMOKE-007 | Unknown expense route renders actionable recovery UI. | Invalid expense /expenses/EXP-9999?mock=1 rendered empty body/root instead of actionable not-found state. |
| EF-SMOKE-010 | Narrow views keep controls reachable without page-level overflow. | At measured 382 CSS px, My Expenses, Approvals, and Finance had page-level horizontal overflow and off-viewport controls; local table guards worked. |
| EF-REG-014 | Finance attention table clamps pagination after reduction. | Finance dashboard failed to render: The provided value for field [ExpenseDate] is not of date time format. |

## Blocked cases

| Case | Reason |
|---|---|
| EF-REG-007 | BLOCKED before execution: connected staging did not provide an approved safe failure hook or a naturally inaccessible test task. Deliberate task corruption, orphan creation, or fault injection was not permitted, so the decision-failure condition could not be initiated safely. |
| EF-REG-008 | BLOCKED before fixture seeding: the connected Finance runtime was already failing on the retained dataset with [ExpenseDate] not being in date-time format. Five additional EF-REG-008 records were not created because the target attention query could not be verified safely. |
| EF-REG-009 | BLOCKED before execution: no approved safe connected read/write failure condition was available in staging. Unsafe network denial, credential manipulation, request tampering, and deliberate service fault injection were not attempted. |
| EF-REG-010 | BLOCKED before execution: staging had no approved safe receipt access-denied or unavailable condition for the synthetic receipt path. EF-REG-004 verified only authorized receipt access and was not repurposed as a failure fixture. |
| EF-REG-011 | BLOCKED before execution: the connected browser/runtime was not configured with the required non-Indian locale and timezone west of UTC. The existing Asia/Calcutta environment could not prove the alternate-locale negative checks. |
| EF-REG-012 | BLOCKED before execution: the valid connected configuration was already exercised by earlier cases, but no separate isolated invalid or missing-resource configuration was available. The valid startup path was not duplicated as evidence for the invalid path. |
| EF-REG-013 | BLOCKED before execution: no dedicated least-privilege employee identity and no separate authorized manager or Finance identity were established in staging. The current Jeet Doshi identity is authorized/admin and cannot characterize least-privilege behavior. |

## Evidence and limitations

- Executed cases with Test Manager attachments are marked `captured-in-TestManager` in the manifest.
- Local per-step trace manifests are copied under `qa-artifacts/traces` when present; earlier smoke cases without a local trace file are not claimed as locally captured.
- Restricted cases have no trace attachments because no blocked action was executed.
- Synthetic Data Fabric records, bucket files, and Action Center tasks were intentionally retained for audit.
- `lastSuccessfulBaselineSha` was not advanced because product failures remain; no prior state file was overwritten.

## Source and change notes

- Current HEAD equals the approved SHA; no change range was inferred or invented.
- Working tree contains only the pre-existing untracked `.uipath/` build metadata; no source files were modified by this run.