const fs = require('fs');
const path = require('path');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const repo = process.cwd();
const qa = path.join(repo, 'qa-artifacts');
const stateDir = path.join(qa, 'state');
const disp = path.join(stateDir, 'disposition-20260925');
const executionId = '2d18a3e1-652d-0e00-8a19-0b4a2b76dce4';
const runId = 'expenseflow-qa-isolated-disposition-20260925T200409+0530';
const manifestFile = path.join(qa, 'traces', executionId, 'evidence-manifest.json');
const mdFile = path.join(qa, 'reports', 'expenseflow-qa-20260925T200409+0530-8ccbb1c-2d18a3e1-652d-0e00-8a19-0b4a2b76dce4.md');
const htmlFile = path.join(qa, 'reports', 'expenseflow-qa-20260925T200409+0530-8ccbb1c-2d18-0e00-8a19-0b4a2b76dce4.html');
const ledgerFile = path.join(stateDir, 'change-scan-ledger.jsonl');
const stateFile = path.join(stateDir, 'qa-state.json');
const readbackFile = path.join(disp, 'final-platform-readback-20260925T200409+0530.json');
function read(file) { assert(fs.existsSync(file), `Missing file: ${file}`); return fs.readFileSync(file, 'utf8'); }
function json(file) { return JSON.parse(read(file)); }
function rel(file) { return path.relative(qa, file).replace(/\\/g, '/'); }
const manifest = json(manifestFile);
const state = json(stateFile);
const readback = json(readbackFile);
const md = read(mdFile);
const html = read(htmlFile);
const traceMap = json(path.join(qa, 'traces', executionId, 'EF-REG-017-trace-map.json'));
const reconciliation = json(path.join(disp, 'testmanager-reconciliation.json'));

assert(manifest.immutable === true, 'Manifest is not marked immutable.');
assert(manifest.testManager.executionId === executionId, 'Manifest execution ID mismatch.');
assert(manifest.testManager.projectKey === 'EXPENSEFLOW', 'Manifest project key mismatch.');
assert(manifest.testManager.testSetKey === 'EXPENSEFLOW:2', 'Manifest test-set key mismatch.');
const cases = manifest.cases;
const steps = cases.flatMap(c => c.steps);
assert(cases.length === 11, `Expected 11 cases, found ${cases.length}.`);
assert(steps.length === 35, `Expected 35 steps, found ${steps.length}.`);
assert(steps.every(s => s.technicalResult === 'Restricted'), 'Not every technical step result is Restricted.');
assert(cases.filter(c => c.qaClassification === 'BLOCKED').length === 9, 'Expected 9 BLOCKED cases.');
assert(cases.filter(c => c.qaClassification === 'RESTRICTED').length === 2, 'Expected 2 RESTRICTED cases.');
assert(steps.filter(s => s.qaClassification === 'BLOCKED').length === 30, 'Expected 30 BLOCKED steps.');
assert(steps.filter(s => s.qaClassification === 'RESTRICTED').length === 5, 'Expected 5 RESTRICTED steps.');
assert(steps.filter(s => s.evidenceStatus === 'captured').length === 2, 'Expected 2 captured evidence steps.');
assert(steps.filter(s => s.evidenceStatus === 'upload-failed').length === 0, 'Expected 0 evidence upload failures.');
assert(manifest.testManager.statistics.caseLogs === 11, 'Manifest case-log total mismatch.');
assert(manifest.testManager.statistics.stepLogs === 35, 'Manifest step-log total mismatch.');
assert(manifest.testManager.statistics.technicalStepResults.Restricted === 35, 'Manifest restricted step total mismatch.');
assert(manifest.testManager.statistics.attachmentStepLogs === 2, 'Manifest attachment total mismatch.');
assert(manifest.testManager.statistics.attachmentUploadFailures === 0, 'Manifest upload-failure total mismatch.');
assert(reconciliation.caseLogCount === 11, 'Source reconciliation case count mismatch.');
assert(reconciliation.totalStepLogs === 35, 'Source reconciliation step count mismatch.');

for (const f of manifest.sourceEvidence) assert(fs.existsSync(path.join(qa, f.path)), `Missing source evidence: ${f.path}`);
for (const f of [manifest.readback.source, 'traces/' + executionId + '/EF-REG-017-execution-traces.json', 'traces/' + executionId + '/EF-REG-017-step00-trace.json', 'traces/' + executionId + '/EF-REG-017-step02-trace.json']) assert(fs.existsSync(path.join(qa, f)), `Missing referenced trace/readback: ${f}`);
for (const [stepId, tracePath] of Object.entries(traceMap)) { assert(fs.existsSync(tracePath), `Trace-map target missing for ${stepId}: ${tracePath}`); }
assert(Object.keys(traceMap).length === 2, `Expected 2 trace-map entries, found ${Object.keys(traceMap).length}.`);

const sharedRecordId = 'DB470F2F-E1B8-F111-A6A9-6045BDDBB45C';
assert(readback.isolated.policyValue === '25000', 'Final isolated policy readback is not 25000.');
assert(Number(readback.isolated.recordCount) === 17, 'Final isolated record count is not 17.');
assert(Number(readback.isolated.exp1040Matches) === 0, 'Isolated EXP-1040 query is not empty.');
assert(Number(readback.sharedEvidence.exp1040Matches) === 1, 'Shared EXP-1040 evidence count is not 1.');
assert(readback.sharedEvidence.record.Id === sharedRecordId, 'Shared evidence record ID mismatch.');
assert(String(readback.sharedEvidence.task.Id) === '101665521', 'Shared evidence task ID mismatch.');
assert(readback.sharedEvidence.task.Status === 'Unassigned', 'Shared evidence task was not preserved as Unassigned.');
assert(readback.isolated.tasks.length === 4 && readback.isolated.tasks.every(t => t.status === 'Pending' && Number(t.folderId) === 1245402), 'Isolated task readback mismatch.');

const link = 'https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/' + executionId;
for (const report of [md, html]) {
  assert(report.includes(executionId), 'Report omits execution ID.');
  assert(report.includes(link), 'Report omits canonical execution link.');
  assert(report.includes('lastSuccessfulBaselineSha') || report.includes('Baseline SHA'), 'Report omits baseline decision context.');
  assert(report.includes('EXP-1040'), 'Report omits shared-scope evidence.');
  assert(report.includes('101665521'), 'Report omits preserved shared task ID.');
  assert(report.includes('EF-REG-012') && report.includes('EF-REG-013'), 'Report omits restricted cases.');
  assert(!/:\s*undefined|=\s*undefined|\{\{|\}\}/.test(report), 'Report contains unresolved template/undefined markers.');
}
assert(md.includes('11 | 11') && md.includes('35 | 35'), 'Markdown total rows are missing expected totals.');
assert(md.includes('**2/35 captured**') && md.includes('**0 upload failures**'), 'Markdown evidence totals are missing or incorrect.');
assert(html.includes('2/35 captured') && html.includes('0 upload failures'), 'HTML evidence totals are missing or incorrect.');
assert(md.includes('No email was sent.') && html.includes('No email was sent.'), 'Reports do not state email status.');

const ledgerLines = read(ledgerFile).split(/\r?\n/).filter(Boolean);
const ledgerEntries = ledgerLines.map(line => JSON.parse(line));
const matches = ledgerEntries.filter(e => e.runId === runId);
assert(matches.length === 1, `Expected exactly one ledger entry for ${runId}, found ${matches.length}.`);
const entry = matches[0];
assert(entry.testManagerExecutionId === executionId, 'Ledger execution ID mismatch.');
assert(entry.evidenceManifestPath === rel(manifestFile), 'Ledger manifest path mismatch.');
assert(entry.markdownReportPath === rel(mdFile), 'Ledger Markdown path mismatch.');
assert(entry.htmlReportPath === rel(htmlFile), 'Ledger HTML path mismatch.');
assert(entry.baselineUpdate.advanced === false, 'Ledger says baseline advanced.');
assert(entry.resultTotals.testManagerSteps.Restricted === 35, 'Ledger step total mismatch.');

assert(state.lastSuccessfulBaselineSha === null, 'qa-state baseline was advanced unexpectedly.');
assert(state.latestExecutionId === executionId, 'qa-state execution pointer mismatch.');
assert(state.latestEvidenceManifestPath === rel(manifestFile), 'qa-state manifest pointer mismatch.');
assert(state.latestReportPath === rel(mdFile), 'qa-state Markdown pointer mismatch.');
assert(state.latestReportHtmlPath === rel(htmlFile), 'qa-state HTML pointer mismatch.');
assert(state.reportTotalsReconciled === true, 'qa-state reconciliation flag is not true.');
assert(state.baselineAdvanced === false, 'qa-state baselineAdvanced is not false.');
for (const f of [manifestFile, mdFile, htmlFile, ledgerFile, stateFile]) assert(fs.statSync(f).size > 0, `Empty output file: ${f}`);
const historical = path.join(qa, 'reports', 'expenseflow-qa-20260925T133925+0530-8ccbb1c-13ecfea8-591d-0e00-db4b-0b4a2b2adfd6.md');
assert(fs.existsSync(historical), 'Historical report was not preserved.');

console.log(JSON.stringify({ status: 'PASS', executionId, runId, verified: { cases: cases.length, steps: steps.length, technicalRestrictedSteps: 35, blockedCases: 9, restrictedCases: 2, blockedSteps: 30, restrictedSteps: 5, capturedAttachments: 2, uploadFailures: 0, ledgerMatches: matches.length, baselineAdvanced: state.baselineAdvanced }, paths: { manifest: rel(manifestFile), markdown: rel(mdFile), html: rel(htmlFile), ledger: rel(ledgerFile), state: rel(stateFile) } }, null, 2));
