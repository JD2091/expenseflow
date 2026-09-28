const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const qa = path.join(repo, 'qa-artifacts');
const state = path.join(qa, 'state');
const dispDir = path.join(state, 'disposition-20260925');
const reports = path.join(qa, 'reports');
const executionId = '2d18a3e1-652d-0e00-8a19-0b4a2b76dce4';
const projectKey = 'EXPENSEFLOW';
const projectId = 'ec245f49-f3da-0200-9a6c-0b4a286e44f7';
const testSetKey = 'EXPENSEFLOW:2';
const testSetId = '5c3301fd-4ec4-0400-57d9-0b4a2b76dcd4';
const currentSha = '8ccbb1c11d36088a36900e737ea0951854a72b65';
const baselineSha = null;
const shortSha = currentSha.slice(0, 7);
const runStamp = '20260925T200409+0530';
const generatedAt = '2026-09-25T20:04:09.360+05:30';
const runId = `expenseflow-qa-isolated-disposition-${runStamp}`;
const executionLink = `https://staging.uipath.com/testcloud_team/TAM/testmanager_/${projectKey}/testexecutions/${executionId}`;
const traceDir = path.join(qa, 'traces', executionId);
const manifestPath = path.join(traceDir, 'evidence-manifest.json');
const readbackPath = path.join(dispDir, `final-platform-readback-${runStamp}.json`);
const mdPath = path.join(reports, `expenseflow-qa-${runStamp}-${shortSha}-${executionId}.md`);
const htmlPath = path.join(reports, `expenseflow-qa-${runStamp}-${shortSha}-${executionId}.html`);
const ledgerPath = path.join(state, 'change-scan-ledger.jsonl');
const qaStatePath = path.join(state, 'qa-state.json');

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function exists(file) { return fs.existsSync(file); }
function rel(file) { return path.relative(qa, file).replace(/\\/g, '/'); }
function required(file) { if (!exists(file)) throw new Error(`Required evidence file missing: ${file}`); return { path: rel(file), exists: true, bytes: fs.statSync(file).size }; }
function prop(o, ...names) { for (const n of names) if (o && Object.prototype.hasOwnProperty.call(o, n)) return o[n]; return null; }
function esc(s) { return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function md(s) { return String(s ?? '').replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|'); }
function listCount(obj, key) { return Array.isArray(obj?.[key]) ? obj[key].length : 0; }
function writeNew(file, content) { if (exists(file)) throw new Error(`Refusing to overwrite existing artifact: ${file}`); fs.writeFileSync(file, content, 'utf8'); }
function sumCounts(rows, key) { return rows.reduce((n, r) => n + (Number(r[key]) || 0), 0); }

const qaState = readJson(qaStatePath);
const reconciliation = readJson(path.join(dispDir, 'testmanager-reconciliation.json'));
const readiness = readJson(path.join(state, 'isolated-readiness-gate-20260925T192710.json'));
const policyBaseline = readJson(path.join(state, 'isolated-policy-runtime-baseline-20260925.json'));
const traceMap = readJson(path.join(traceDir, 'EF-REG-017-trace-map.json'));
const stats = reconciliation.executionStats;
const dispositions = readiness.executionGate.caseDisposition;
const caseJson = {};
const publishLogs = {};
for (const stableId of Object.keys(dispositions)) {
  caseJson[stableId] = readJson(path.join(dispDir, `${stableId}.json`));
  publishLogs[stableId] = required(path.join(dispDir, `publish-${stableId}.log`));
}
const sourceFiles = [
  required(path.join(dispDir, 'testmanager-reconciliation.json')),
  required(path.join(state, 'isolated-readiness-gate-20260925T192710.json')),
  required(path.join(state, 'isolated-policy-runtime-baseline-20260925.json')),
  required(path.join(traceDir, 'EF-REG-017-trace-map.json')),
  required(path.join(traceDir, 'EF-REG-017-execution-traces.json')),
  required(path.join(traceDir, 'EF-REG-017-step00-trace.json')),
  required(path.join(traceDir, 'EF-REG-017-step02-trace.json')),
  ...Object.keys(dispositions).map(k => required(path.join(dispDir, `${k}.json`))),
  ...Object.values(publishLogs)
];

const caseInfo = {
  'EF-REG-005': ['Verify approval completion updates the isolated Action Center task and Data Fabric record.', 'Isolated task 101664502 is pending and assigned; hosted build must be bound to the isolated folder/entity.', 'EFREG005-Approve; ₹27,501 synthetic approval fixture.'],
  'EF-REG-006': ['Verify reject, rework, and blank-comment decisions preserve state and comments.', 'Isolated tasks 101664529/101664538/101664542 are pending; hosted build must use isolated scope.', 'EFREG006-Reject ₹26,000; EFREG006-Rework ₹26,500; EFREG006-Blank ₹27,000.'],
  'EF-REG-007': ['Verify a connected decision failure leaves the source record and task unchanged.', 'A supported isolated provider-failure target must exist; no shared mutation is authorized.', 'Synthetic isolated decision-failure fixture; no safe isolated provider target was available.'],
  'EF-REG-009': ['Verify connected error recovery/retry does not create a duplicate write.', 'Hosted build must be isolated and a controlled failure condition must be available.', 'Synthetic isolated recovery fixture; no safe isolated failure target was available.'],
  'EF-REG-010': ['Verify receipt access failure and normal recovery behavior.', 'Isolated receipt objects and bucket are present; hosted build must use isolated entity/bucket.', 'Synthetic isolated receipt objects and receipt metadata.'],
  'EF-REG-011': ['Verify amount, currency, date, and timestamp formatting across connected views.', 'Formatting/date fixtures are verified in the isolated entity; hosted build must use that entity.', 'Synthetic compact/full amount and date/time boundary fixtures.'],
  'EF-REG-012': ['Verify invalid or missing OAuth/backend-resource configuration produces recoverable behavior.', 'An isolated invalid-resource configuration is required; shared runtime mutation is prohibited.', 'Read-only source/runtime switches only; no isolated invalid-resource configuration exists.'],
  'EF-REG-013': ['Characterize least-privilege authorization behavior without changing identities or permissions.', 'No identity, role, permission, license, or membership provisioning is allowed.', 'Existing staging identity inventory only; no substitute identity was used.'],
  'EF-REG-015': ['Verify month-end and leap-year Finance date boundaries and exclusions.', 'Fresh isolated server-side boundary matrix is verified; hosted build must use isolated scope.', '2026-02-28 ₹2,800; 2028-02-29 ₹3,000; 2026-04-30 ₹3,200 plus next-day controls.'],
  'EF-REG-017': ['Verify a live policy change between display and submit uses the current threshold.', 'Isolated policy baseline 25,000; temporary 30,000 change; receipt required to isolate threshold branch; hosted build must use isolated scope.', 'EFREG017-LivePolicy; ₹27,500; isolated asset e9f05dc0-4474-4226-96a1-102a6fada8a1.'],
  'EF-REG-024': ['Verify an empty Finance month renders zero aggregates and a stable no-data state.', 'Isolated scope contains only the intentional Draft control before non-Draft fixtures; hosted build must use isolated scope.', 'EFREG024-DraftControl-20260925 and empty non-Draft monthly dataset.']
};

const cases = (reconciliation.caseLogs || []).map(c => {
  const name = prop(c, 'testCaseName', 'TestCaseName') || '';
  const stableId = (name.match(/EF-REG-\d+/) || [''])[0];
  const disposition = dispositions[stableId] || 'NOT RUN';
  const steps = (c.stepLogs || []).slice().sort((a,b) => (Number(prop(a,'OrderNo','orderNo'))||0) - (Number(prop(b,'OrderNo','orderNo'))||0)).map((s, i) => {
    const stepId = String(prop(s, 'TestStepId', 'testStepId') || '');
    const stepLogId = String(prop(s, 'Id', 'id') || '');
    const technicalResult = String(prop(s, 'Result', 'result') || 'None');
    const hasAttachment = Boolean(prop(s, 'HasAttachment', 'hasAttachment'));
    const mapped = traceMap[stepId] || null;
    const mappedExists = Boolean(mapped && exists(mapped));
    const attachmentReference = hasAttachment ? `testStepLog:${stepLogId};HasAttachment=true` : null;
    let evidenceStatus = 'not-captured';
    if (mapped && !mappedExists) evidenceStatus = 'upload-failed';
    else if (hasAttachment && mappedExists) evidenceStatus = 'captured';
    return {
      stepNumber: Number(prop(s, 'OrderNo', 'orderNo')) + 1,
      orderNo: Number(prop(s, 'OrderNo', 'orderNo')),
      testStepId: stepId,
      stepLogId,
      expectedResult: prop(s, 'ExpectedResult', 'expectedResult') || 'No expected result defined',
      actualResult: prop(s, 'Comment', 'comment') || '',
      technicalResult,
      qaClassification: disposition,
      hasError: Boolean(prop(s, 'HasError', 'hasError')),
      actionType: prop(s, 'ActionType', 'actionType') || '',
      hasAttachment,
      attachmentReference,
      traceRelativePath: mappedExists ? rel(mapped) : null,
      evidenceStatus,
      evidenceNote: (!mapped && stableId === 'EF-REG-017') ? 'Per-step trace was not present in the finalized trace map; publication log recorded this as partial coverage.' : null
    };
  });
  return {
    stableId,
    testCaseKey: prop(c, 'testCaseKey', 'TestCaseKey') || '',
    testCaseId: prop(c, 'testCaseId', 'TestCaseId') || '',
    testCaseName: name,
    testCaseLogId: prop(c, 'testCaseLogId', 'TestCaseLogId') || '',
    technicalResult: prop(c, 'caseResult', 'CaseResult') || 'None',
    qaClassification: disposition,
    objective: (caseInfo[stableId] || ['Approved manual scenario.', 'Isolation gate and synthetic data readiness are required.', 'Synthetic isolated test data.'])[0],
    preconditions: (caseInfo[stableId] || [null, 'Isolation gate and synthetic data readiness are required.', null])[1],
    testData: (caseInfo[stableId] || [null, null, 'Synthetic isolated test data.'])[2],
    steps,
    attachmentCount: steps.filter(s => s.hasAttachment).length
  };
});

const totalSteps = cases.reduce((n,c) => n + c.steps.length, 0);
const technicalStepCounts = {};
for (const c of cases) for (const s of c.steps) technicalStepCounts[s.technicalResult] = (technicalStepCounts[s.technicalResult] || 0) + 1;
const qaCaseCounts = {};
const qaStepCounts = {};
for (const c of cases) {
  qaCaseCounts[c.qaClassification] = (qaCaseCounts[c.qaClassification] || 0) + 1;
  for (const s of c.steps) qaStepCounts[s.qaClassification] = (qaStepCounts[s.qaClassification] || 0) + 1;
}
const evidenceCounts = { captured: cases.flatMap(c=>c.steps).filter(s=>s.evidenceStatus==='captured').length, 'not-captured': cases.flatMap(c=>c.steps).filter(s=>s.evidenceStatus==='not-captured').length, 'upload-failed': cases.flatMap(c=>c.steps).filter(s=>s.evidenceStatus==='upload-failed').length };
if (cases.length !== 11 || totalSteps !== 35 || technicalStepCounts.Restricted !== 35 || Number(stats.None) !== 11 || evidenceCounts.captured !== 2 || evidenceCounts['upload-failed'] !== 0) throw new Error(`Reconciliation gate failed: cases=${cases.length}, steps=${totalSteps}, restricted=${technicalStepCounts.Restricted}, none=${stats.None}, captured=${evidenceCounts.captured}, uploadFailed=${evidenceCounts['upload-failed']}`);

const finalReadbackPath = path.join(dispDir, `final-platform-readback-20260925T200409+0530.json`);
const finalReadback = readJson(finalReadbackPath);
required(finalReadbackPath);

const changedFiles = [
  'scripts/format.test.ts', 'src/App.tsx', 'src/components/AppLayout.tsx', 'src/components/ErrorState.tsx',
  'src/components/ExpenseTable.tsx', 'src/components/NewExpenseForm.tsx', 'src/components/ReceiptLink.tsx',
  'src/components/Sidebar.tsx', 'src/components/TablePager.tsx', 'src/hooks/useAuth.tsx', 'src/hooks/useExpenses.tsx',
  'src/hooks/useFinance.tsx', 'src/lib/format.ts', 'src/models/expense.ts', 'src/models/status.ts',
  'src/pages/ApprovalPage.tsx', 'src/pages/DashboardPage.tsx', 'src/pages/ExpenseDetailPage.tsx',
  'src/pages/ExpenseListPage.tsx', 'src/pages/FinancePage.tsx', 'src/services/demoFailure.ts',
  'src/services/expenseService.ts', 'src/services/uipath/approvals.ts', 'src/services/uipath/choiceSets.ts',
  'src/services/uipath/client.ts', 'src/services/uipath/config.ts', 'src/services/uipath/entityClient.ts',
  'src/services/uipath/errors.ts', 'src/services/uipath/folders.ts', 'src/services/uipath/mappers.ts',
  'src/services/uipath/policy.ts', 'src/services/uipath/receipts.ts', 'src/services/uipath/runtime.tsx',
  'src/services/uipath/schema.ts', 'vite.config.ts'
];
const riskAreas = [
  'Hosted deployment scope binding: local generated configuration names the isolated entity, but the hosted build wrote to the shared tenant-level entity.',
  'Policy-threshold routing: EF-REG-017 did not exercise the live 30,000 threshold branch because no receipt was attached; the shared record followed the missing-receipt approval rule.',
  'Action Center sequencing and decision persistence: connected approval/reject/rework paths were not executed after the isolation gate failed.',
  'Receipt access and Finance/date-boundary UI: isolated fixtures are ready, but the hosted build was unsafe for connected UI reads.',
  'OAuth/resource-failure configuration: no isolated invalid-resource configuration exists; shared runtime mutation is prohibited.',
  'Authorization boundary: EF-REG-013 remains Restricted because identity/role/permission mutation is prohibited.'
];
const dispositionsTable = Object.entries(dispositions).map(([stableId, value]) => ({ stableId, qaClassification: value }));
const readbackSummary = {
  isolatedPolicyValue: prop(finalReadback.isolated, 'policyValue'),
  isolatedRecordCount: prop(finalReadback.isolated, 'recordCount'),
  isolatedExp1040Matches: prop(finalReadback.isolated, 'exp1040Matches'),
  isolatedTaskIds: (finalReadback.isolated.tasks || []).map(t => ({ id: t.id, status: t.status, folderId: t.folderId, type: t.type })),
  sharedExp1040Matches: prop(finalReadback.sharedEvidence, 'exp1040Matches'),
  sharedRecordId: prop(finalReadback.sharedEvidence?.record, 'Id'),
  sharedTaskId: prop(finalReadback.sharedEvidence?.task, 'Id'),
  sharedTaskStatus: prop(finalReadback.sharedEvidence?.task, 'Status'),
  sharedTaskFolderId: prop(finalReadback.sharedEvidence?.task, 'FolderId')
};
if (readbackSummary.isolatedPolicyValue !== '25000' || Number(readbackSummary.isolatedRecordCount) !== 17 || Number(readbackSummary.isolatedExp1040Matches) !== 0 || Number(readbackSummary.sharedExp1040Matches) !== 1 || readbackSummary.sharedRecordId !== 'DB470F2F-E1B8-F111-A6A9-6045BDDBB45C' || String(readbackSummary.sharedTaskId) !== '101665521' || readbackSummary.sharedTaskStatus !== 'Unassigned') throw new Error('Final platform readback assertions failed.');
if ((readbackSummary.isolatedTaskIds || []).length !== 4 || readbackSummary.isolatedTaskIds.some(t => t.status !== 'Pending' || Number(t.folderId) !== 1245402)) throw new Error('Isolated task readback assertions failed.');

const evidenceManifest = {
  schemaVersion: 1,
  immutable: true,
  generatedAt,
  runId,
  environment: 'Local',
  applicationUrl: 'https://testcloud-team.staging.uipath.host/expenseflow',
  repositoryUrl: 'https://github.com/JD2091/expenseflow',
  baselineSha,
  currentSha,
  commitsAnalyzed: [],
  pullRequestsAnalyzed: [],
  approvedSourceSha: '571c2192d3d786a03eb7f57d89bec70998ef1d57',
  uipath: { baseUrl: 'https://staging.uipath.com', organization: 'testcloud_team', tenant: 'TAM', folderPath: 'ExpenseFlow-QA-Isolated-20260925', folderKey: '8a0e5b85-291c-4fd4-b53c-648950c57716', folderId: 1245402 },
  testManager: { projectName: 'ExpenseFlow QA', projectKey, projectId, testSetKey, testSetId, executionId, executionLink, executionType: stats.ExecutionType, status: stats.Status, statistics: { caseLogs: cases.length, technicalCaseResults: { Passed: Number(stats.Passed)||0, Failed: Number(stats.Failed)||0, None: Number(stats.None)||0 }, stepLogs: totalSteps, technicalStepResults: technicalStepCounts, qaCaseClassifications: qaCaseCounts, qaStepClassifications: qaStepCounts, evidenceStatusCounts: evidenceCounts, attachmentStepLogs: evidenceCounts.captured, attachmentUploadFailures: evidenceCounts['upload-failed'] } },
  caseDispositions: dispositionsTable,
  changedFiles,
  riskAreas,
  readback: { source: rel(finalReadbackPath), assertions: readbackSummary, isolatedReadinessSource: rel(path.join(state, 'isolated-readiness-gate-20260925T192710.json')), policyBaselineSource: rel(path.join(state, 'isolated-policy-runtime-baseline-20260925.json')) },
  sourceEvidence: sourceFiles,
  cases
};
writeNew(manifestPath, JSON.stringify(evidenceManifest, null, 2) + '\n');

const caseRowsMd = cases.map(c => `| ${c.stableId} | ${c.qaClassification} | ${c.technicalResult} | ${c.steps.length} | ${c.attachmentCount} | ${c.testCaseLogId} |`).join('\n');
const caseSectionsMd = cases.map(c => {
  const stepRows = c.steps.map(s => `| ${s.stepNumber} | ${md(s.expectedResult)} | ${md(s.actualResult)} | ${s.qaClassification} | ${s.technicalResult} | ${s.evidenceStatus} | ${s.attachmentReference || '—'} | ${s.traceRelativePath ? `\`${s.traceRelativePath}\`` : '—'} |`).join('\n');
  return `### ${c.stableId} — ${c.qaClassification}\n\n**Test case:** ${md(c.testCaseName)}  \n**Test Manager case key:** ${c.testCaseKey || 'not returned by fresh case-log list; canonical case ID retained'}  \n**Test Manager case log:** \`${c.testCaseLogId}\`  \n**Objective:** ${md(c.objective)}  \n**Preconditions:** ${md(c.preconditions)}  \n**Synthetic data:** ${md(c.testData)}\n\n| Step | Expected result | Actual result / observation | QA classification | TM technical result | Evidence status | Attachment reference | Trace |\n|---:|---|---|---|---|---|---|---|\n${stepRows}`;
}).join('\n\n');
const markdown = `# ExpenseFlow QA — Isolated Readiness Disposition\n\nGenerated: ${generatedAt}\n\n## Decision\n\nExecution **${executionId}** is **Finished** in Test Manager. The approved connected run is **not a valid isolated pass**: the hosted build wrote EF-REG-017 to shared scope, and the remaining connected cases were deliberately not exercised against shared resources. The baseline is **not advanced**; \`lastSuccessfulBaselineSha\` remains \`null\`.\n\n## Scope and environment\n\n- Environment: **Local**\n- Application URL: https://testcloud-team.staging.uipath.host/expenseflow\n- Repository: https://github.com/JD2091/expenseflow\n- Baseline SHA: \`${baselineSha}\`\n- Current SHA: \`${currentSha}\`\n- Commits analyzed: none in this continuation; approved source SHA: \`571c2192d3d786a03eb7f57d89bec70998ef1d57\`\n- Pull requests analyzed: none\n- Test Manager project: **ExpenseFlow QA / ${projectKey}** (${projectId})\n- Test set: **${testSetKey}** (${testSetId})\n- Execution: [${executionId}](${executionLink})\n- Evidence manifest: \`${rel(manifestPath)}\`\n\n## Reconciled totals\n\n| Scope | Passed | Failed | Restricted | None | Total |\n|---|---:|---:|---:|---:|---:|\n| Test Manager case logs | ${Number(stats.Passed)||0} | ${Number(stats.Failed)||0} | — | ${Number(stats.None)||0} | ${cases.length} |\n| Test Manager step logs | ${technicalStepCounts.Passed||0} | ${technicalStepCounts.Failed||0} | ${technicalStepCounts.Restricted||0} | ${technicalStepCounts.None||0} | ${totalSteps} |\n| QA semantic case disposition | 0 | 0 | ${qaCaseCounts.RESTRICTED||0} | ${qaCaseCounts.BLOCKED||0} | ${cases.length} |\n| QA semantic step disposition | 0 | 0 | ${qaStepCounts.RESTRICTED||0} | ${qaStepCounts.BLOCKED||0} | ${totalSteps} |\n\n- Step-log attachment flags: **${evidenceCounts.captured}/${totalSteps} captured**; **${evidenceCounts['not-captured']} not captured**; **${evidenceCounts['upload-failed']} upload failures**.\n- EF-REG-017 uploaded attachment-bearing step logs: **2**; publication upload failures: **0**.\n- Technical Test Manager case result is \`None\` for all 11 cases because the published steps are \`Restricted\`; this is reported separately from the QA semantic \`BLOCKED\`/\`RESTRICTED\` classifications.\n\n## Case disposition\n\n| Stable ID | QA disposition | TM technical result | Steps | Attachments | Case log |\n|---|---|---|---:|---:|---|\n${caseRowsMd}\n\n## Change impact and risk areas\n\n${riskAreas.map(r => `- ${r}`).join('\n')}\n\n### Changed/affected files traced by the approved catalog\n\n${changedFiles.map(f => `- \`${f}\``).join('\n')}\n\n## Final platform readback\n\n- Isolated folder: \`ExpenseFlow-QA-Isolated-20260925\` / \`8a0e5b85-291c-4fd4-b53c-648950c57716\` (numeric folder ID \`1245402\`).\n- Isolated policy asset \`${readbackSummary.isolatedPolicyValue}\`; restored value verified as **25,000**.\n- Isolated entity \`${readiness.isolatedScope.entityId}\` contains **17** records; fresh query found **0** isolated \`EXP-1040\` rows.\n- All four isolated Action Center tasks remain **Pending** in folder ID \`1245402\`, assigned to Jeet Doshi; no isolated task was completed or reassigned.\n- Preserved shared evidence contains **1** \`EXP-1040\` row: record \`${readbackSummary.sharedRecordId}\`, amount ₹27,500, status PendingApproval, policy note “No receipt attached — manager approval required”, and shared task \`${readbackSummary.sharedTaskId}\` in shared folder ID \`${readbackSummary.sharedTaskFolderId}\`.\n- No retry, completion, deletion, or cleanup was performed on the shared row/task.\n\n## Evidence limitations\n\n- No screenshots were attached for this disposition publication.\n- EF-REG-017 has partial trace coverage by design: two finalized per-step traces were staged and uploaded; the publication log records three unmapped steps as partial coverage, not upload failures.\n- The UI success banner for EF-REG-017 is not treated as an isolated product pass because server reconciliation proved the hosted deployment used shared scope.\n- The 30,000 threshold branch was not exercised because no receipt was attached; the observed shared record followed the missing-receipt approval rule.\n- EF-REG-012 remains Restricted because no isolated invalid/missing-resource OAuth configuration exists.\n- EF-REG-013 remains Restricted because identity provisioning and permission mutation are prohibited.\n\n## Baseline update decision\n\n**Preserved, not advanced.** The current SHA is retained for future comparison, but \`lastSuccessfulBaselineSha\` stays \`null\` because the approved connected scope was not isolated and the execution contains unresolved blocked/restricted coverage.\n\n## Detailed step results\n\n${caseSectionsMd}\n\n## Historical artifact preservation\n\nPrevious reports, traces, readiness manifests, and Test Manager executions were preserved. This report and its HTML companion use unique filenames and do not overwrite prior evidence. No email was sent.\n`;
writeNew(mdPath, markdown);

function htmlTableRows() { return cases.map(c => `<tr><td>${esc(c.stableId)}</td><td>${esc(c.qaClassification)}</td><td>${esc(c.technicalResult)}</td><td>${c.steps.length}</td><td>${c.attachmentCount}</td><td><code>${esc(c.testCaseLogId)}</code></td></tr>`).join(''); }
function htmlStepRows(c) { return c.steps.map(s => `<tr><td>${s.stepNumber}</td><td>${esc(s.expectedResult)}</td><td>${esc(s.actualResult)}</td><td>${esc(s.qaClassification)}</td><td>${esc(s.technicalResult)}</td><td>${esc(s.evidenceStatus)}</td><td>${esc(s.attachmentReference || '—')}</td><td>${s.traceRelativePath ? `<code>${esc(s.traceRelativePath)}</code>` : '—'}</td></tr>`).join(''); }
const htmlSections = cases.map(c => `<section><h3>${esc(c.stableId)} — ${esc(c.qaClassification)}</h3><p><b>Test case:</b> ${esc(c.testCaseName)}<br><b>Case log:</b> <code>${esc(c.testCaseLogId)}</code><br><b>Objective:</b> ${esc(c.objective)}<br><b>Preconditions:</b> ${esc(c.preconditions)}<br><b>Synthetic data:</b> ${esc(c.testData)}</p><table><thead><tr><th>Step</th><th>Expected</th><th>Actual / observation</th><th>QA</th><th>TM</th><th>Evidence</th><th>Attachment</th><th>Trace</th></tr></thead><tbody>${htmlStepRows(c)}</tbody></table></section>`).join('');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>ExpenseFlow QA — Isolated Readiness Disposition</title><style>body{font-family:Segoe UI,Arial,sans-serif;color:#202124;line-height:1.45;margin:32px}h1{color:#16325c}h2{border-bottom:2px solid #d8e2f0;padding-bottom:4px;margin-top:32px}h3{color:#254b7a}table{border-collapse:collapse;width:100%;margin:12px 0 24px;font-size:12px}th,td{border:1px solid #ccd6e0;padding:6px;vertical-align:top}th{background:#edf3f8;text-align:left}code{font-family:Consolas,monospace;font-size:11px;overflow-wrap:anywhere}.callout{background:#fff4d6;border-left:5px solid #d99b00;padding:12px}.ok{background:#e8f5e9;border-left:5px solid #2e7d32;padding:12px}li{margin:4px 0}</style></head><body><h1>ExpenseFlow QA — Isolated Readiness Disposition</h1><p>Generated: ${esc(generatedAt)}</p><div class="callout"><b>Decision:</b> Execution <code>${executionId}</code> is Finished, but it is not a valid isolated pass. The baseline remains <code>null</code>.</div><h2>Scope and environment</h2><ul><li>Environment: <b>Local</b></li><li>Application URL: <a href="https://testcloud-team.staging.uipath.host/expenseflow">https://testcloud-team.staging.uipath.host/expenseflow</a></li><li>Repository: <a href="https://github.com/JD2091/expenseflow">https://github.com/JD2091/expenseflow</a></li><li>Baseline SHA: <code>null</code></li><li>Current SHA: <code>${currentSha}</code></li><li>Commits analyzed: none in this continuation; approved source SHA <code>571c2192d3d786a03eb7f57d89bec70998ef1d57</code></li><li>Pull requests analyzed: none</li><li>Test Manager project: <b>ExpenseFlow QA / ${projectKey}</b> (${projectId})</li><li>Test set: <code>${testSetKey}</code> (${testSetId})</li><li>Execution: <a href="${executionLink}">${executionId}</a></li><li>Evidence manifest: <code>${rel(manifestPath)}</code></li></ul><h2>Reconciled totals</h2><table><thead><tr><th>Scope</th><th>Passed</th><th>Failed</th><th>Restricted</th><th>None</th><th>Total</th></tr></thead><tbody><tr><td>Test Manager case logs</td><td>0</td><td>0</td><td>—</td><td>11</td><td>11</td></tr><tr><td>Test Manager step logs</td><td>0</td><td>0</td><td>35</td><td>0</td><td>35</td></tr><tr><td>QA semantic case disposition</td><td>0</td><td>0</td><td>${qaCaseCounts.RESTRICTED||0}</td><td>${qaCaseCounts.BLOCKED||0}</td><td>11</td></tr><tr><td>QA semantic step disposition</td><td>0</td><td>0</td><td>${qaStepCounts.RESTRICTED||0}</td><td>${qaStepCounts.BLOCKED||0}</td><td>35</td></tr></tbody></table><p>Attachment flags: <b>2/35 captured</b>; ${evidenceCounts['not-captured']} not captured; ${evidenceCounts['upload-failed']} upload failures. EF-REG-017 has two uploaded attachments and zero upload failures. Test Manager technical <code>None</code> is distinct from the QA semantic blocked/restricted classification.</p><h2>Case disposition</h2><table><thead><tr><th>Stable ID</th><th>QA</th><th>TM</th><th>Steps</th><th>Attachments</th><th>Case log</th></tr></thead><tbody>${htmlTableRows()}</tbody></table><h2>Change impact and risk areas</h2><ul>${riskAreas.map(r=>`<li>${esc(r)}</li>`).join('')}</ul><h3>Changed/affected files</h3><ul>${changedFiles.map(f=>`<li><code>${esc(f)}</code></li>`).join('')}</ul><h2>Final platform readback</h2><ul><li>Isolated folder <code>ExpenseFlow-QA-Isolated-20260925</code>; folder key <code>8a0e5b85-291c-4fd4-b53c-648950c57716</code>; numeric ID <code>1245402</code>.</li><li>Isolated policy value restored and verified at <b>25,000</b>.</li><li>Isolated entity has <b>17</b> records; fresh <code>EXP-1040</code> query returned <b>0</b>.</li><li>Four isolated tasks remain <b>Pending</b>; no completion or reassignment occurred.</li><li>Preserved shared evidence has one <code>EXP-1040</code> row, record <code>${readbackSummary.sharedRecordId}</code>, amount ₹27,500, missing-receipt approval note, and task <code>${readbackSummary.sharedTaskId}</code> in shared folder ID <code>${readbackSummary.sharedTaskFolderId}</code>.</li><li>No retry, completion, deletion, or cleanup was performed on shared evidence.</li></ul><h2>Evidence limitations</h2><ul><li>No screenshots were attached for this disposition publication.</li><li>EF-REG-017 has partial trace coverage: two staged per-step traces uploaded; three unmapped steps were recorded as partial coverage, not upload failures.</li><li>The hosted UI success banner is not treated as an isolated pass because server reconciliation proved the shared-scope write.</li><li>The threshold branch was not exercised because no receipt was attached.</li><li>EF-REG-012 is Restricted because no isolated invalid-resource OAuth configuration exists.</li><li>EF-REG-013 is Restricted because identity provisioning and permission mutation are prohibited.</li></ul><h2>Baseline update decision</h2><div class="ok"><b>Preserved, not advanced.</b> <code>lastSuccessfulBaselineSha</code> remains <code>null</code>.</div><h2>Detailed step results</h2>${htmlSections}<h2>Historical artifact preservation</h2><p>Previous reports, traces, readiness manifests, and Test Manager executions were preserved. This report and its Markdown companion use unique filenames. No email was sent.</p></body></html>`;
writeNew(htmlPath, html);

const ledgerEntry = {
  runId,
  runTimestamp: generatedAt,
  environment: 'Local',
  applicationUrl: 'https://testcloud-team.staging.uipath.host/expenseflow',
  baselineSha,
  targetSha: currentSha,
  commits: [],
  pullRequests: [],
  createdCases: [],
  updatedCases: [],
  executedCases: Object.keys(dispositions),
  testManagerExecutionId: executionId,
  resultTotals: { testManagerCases: { Passed: 0, Failed: 0, None: 11 }, testManagerSteps: technicalStepCounts, qaCases: qaCaseCounts, qaSteps: qaStepCounts, evidence: evidenceCounts },
  evidenceManifestPath: rel(manifestPath),
  markdownReportPath: rel(mdPath),
  htmlReportPath: rel(htmlPath),
  baselineUpdate: { advanced: false, previous: null, currentSha, reason: 'preserved-not-advanced-hosted-scope-mismatch-and-restricted-or-blocked-cases-remain' }
};
if (exists(ledgerPath)) {
  const old = fs.readFileSync(ledgerPath, 'utf8').split(/\r?\n/).filter(Boolean);
  if (old.some(line => { try { return JSON.parse(line).runId === runId; } catch { return false; } })) throw new Error(`Ledger already contains runId ${runId}`);
}
fs.appendFileSync(ledgerPath, JSON.stringify(ledgerEntry) + '\n', 'utf8');

const nextState = {
  ...qaState,
  schemaVersion: 1,
  lastSuccessfulBaselineSha: null,
  currentSha,
  currentBranch: 'main',
  lastRunId: runId,
  lastRunAt: generatedAt,
  latestExecutionId: executionId,
  latestReportPath: rel(mdPath),
  latestReportHtmlPath: rel(htmlPath),
  latestEvidenceManifestPath: rel(manifestPath),
  baselineAdvanced: false,
  baselineDecision: 'preserved-not-advanced-hosted-scope-mismatch-and-restricted-or-blocked-cases-remain',
  testManagerProjectKey: projectKey,
  testManagerProjectId: projectId,
  changeRegressionTestSetKey: testSetKey,
  changeRegressionTestSetId: testSetId,
  environment: 'Local',
  applicationUrl: 'https://testcloud-team.staging.uipath.host/expenseflow',
  finalReadbackPath: rel(finalReadbackPath),
  latestRunReconciliationPath: rel(path.join(dispDir, 'testmanager-reconciliation.json')),
  coverage: { approvedCases: 11, approvedSteps: 35, passedSteps: 0, failedSteps: 0, blockedSteps: qaStepCounts.BLOCKED || 0, restrictedSteps: qaStepCounts.RESTRICTED || 0, caseClassifications: qaCaseCounts },
  evidence: { capturedStepAttachments: evidenceCounts.captured, notCapturedStepEvidence: evidenceCounts['not-captured'], uploadFailures: evidenceCounts['upload-failed'], screenshotsCaptured: 0, stagedTraceFiles: 2 },
  sharedEvidencePreserved: { entityId: '65e0d30d-79b6-f111-a6a9-6045bddc9767', recordId: readbackSummary.sharedRecordId, taskId: readbackSummary.sharedTaskId, taskStatus: readbackSummary.sharedTaskStatus },
  isolatedReadiness: { folderKey: '8a0e5b85-291c-4fd4-b53c-648950c57716', folderId: 1245402, entityId: 'e6990e77-cdb8-f111-a6a9-6045bddc9767', recordCount: 17, policyValue: 25000, pendingTaskIds: readbackSummary.isolatedTaskIds.map(t=>t.id) },
  reportTotalsReconciled: true,
  notes: [...(qaState.notes || []), 'Final isolated/shared platform readback saved and verified at qa-artifacts/state/disposition-20260925/final-platform-readback-20260925T200409+0530.json.', 'Fresh Test Manager readback reconciled 11 case logs and 35 step logs; all 35 Restricted; 2 attachment flags; 0 upload failures.', 'Shared EXP-1040 record/task retained as evidence; no retry, completion, deletion, or cleanup performed.']
};
fs.writeFileSync(qaStatePath, JSON.stringify(nextState, null, 2) + '\n', 'utf8');

console.log(JSON.stringify({ runId, manifestPath: rel(manifestPath), markdownReportPath: rel(mdPath), htmlReportPath: rel(htmlPath), ledgerPath: rel(ledgerPath), qaStatePath: rel(qaStatePath), totals: { cases: cases.length, steps: totalSteps, technicalStepCounts, qaCaseCounts, qaStepCounts, evidenceCounts }, baselineAdvanced: false }, null, 2));
