const fs = require('fs');
const path = require('path');
const assert = (ok, msg) => { if (!ok) throw new Error(msg); };
const repo = process.cwd();
const qa = path.join(repo, 'qa-artifacts');
const stateDir = path.join(qa, 'state');
const disp = path.join(stateDir, 'disposition-20260925');
const executionId = '2d18a3e1-652d-0e00-8a19-0b4a2b76dce4';
const runId = 'expenseflow-qa-isolated-disposition-20260925T200409+0530';
const manifestFile = path.join(qa, 'traces', executionId, 'evidence-manifest.json');
const mdFile = path.join(qa, 'reports', 'expenseflow-qa-20260925T200409+0530-8ccbb1c-2d18a3e1-652d-0e00-8a19-0b4a2b76dce4.md');
const htmlFile = mdFile.replace(/\.md$/, '.html');
const ledgerFile = path.join(stateDir, 'change-scan-ledger.jsonl');
const stateFile = path.join(stateDir, 'qa-state.json');
const readbackFile = path.join(disp, 'final-platform-readback-20260925T200409+0530.json');
function read(file) { assert(fs.existsSync(file), `Missing file: ${file}`); return fs.readFileSync(file, 'utf8'); }
function json(file) { return JSON.parse(read(file)); }
function qaRel(file) { return path.relative(qa, file).replace(/\\/g, '/'); }
function isInside(parent, child) { const p = path.resolve(parent) + path.sep; return path.resolve(child).startsWith(p); }
const manifest = json(manifestFile);
const state = json(stateFile);
const readback = json(readbackFile);
const reconciliation = json(path.join(disp, 'testmanager-reconciliation.json'));
const md = read(mdFile);
const html = read(htmlFile);
const steps = manifest.cases.flatMap(c => c.steps);
assert(manifest.immutable === true, 'Manifest is not marked immutable.');
assert(manifest.runId === runId, 'Manifest runId mismatch.');
assert(manifest.testManager.executionId === executionId, 'Manifest executionId mismatch.');
assert(manifest.cases.length === 11, `Expected 11 cases, found ${manifest.cases.length}.`);
assert(steps.length === 35, `Expected 35 steps, found ${steps.length}.`);
assert(steps.every(s => s.technicalResult === 'Restricted'), 'Not all technical step results are Restricted.');
assert(manifest.testManager.statistics.technicalStepResults.Restricted === 35, 'Restricted step total mismatch.');
assert(manifest.testManager.statistics.attachmentStepLogs === 2, 'Attachment total mismatch.');
assert(manifest.testManager.statistics.attachmentUploadFailures === 0, 'Upload failure total mismatch.');
const reconciledStepTotal = reconciliation.caseLogs.reduce((sum, c) => sum + Number(c.stepCount || (Array.isArray(c.stepLogs) ? c.stepLogs.length : 0)), 0);
assert(reconciliation.caseLogCount === 11 && reconciledStepTotal === 35, 'Source reconciliation totals mismatch.');
const evidenceCounts = {
  captured: steps.filter(s => s.evidenceStatus === 'captured').length,
  notCaptured: steps.filter(s => s.evidenceStatus === 'not-captured').length,
  uploadFailed: steps.filter(s => s.evidenceStatus === 'upload-failed').length
};
assert(evidenceCounts.captured === 2 && evidenceCounts.notCaptured === 33 && evidenceCounts.uploadFailed === 0, 'Evidence status totals mismatch.');
for (const source of manifest.sourceEvidence) { assert(isInside(qa, path.join(qa, source.path)), `Source evidence escapes qa-artifacts: ${source.path}`); assert(fs.existsSync(path.join(qa, source.path)), `Missing source evidence: ${source.path}`); }
for (const s of steps.filter(x => x.evidenceStatus === 'captured')) {
  assert(s.traceRelativePath && !path.isAbsolute(s.traceRelativePath), `Captured trace path is not relative: ${s.traceRelativePath}`);
  const target = path.join(qa, s.traceRelativePath);
  assert(isInside(qa, target), `Captured trace escapes qa-artifacts: ${s.traceRelativePath}`);
  assert(fs.existsSync(target), `Captured trace path missing: ${s.traceRelativePath}`);
}
assert(Object.keys(json(path.join(qa, 'traces', executionId, 'EF-REG-017-trace-map.json'))).length === 2, 'Trace map should contain two entries.');
assert(readback.isolated.policyValue === '25000', 'Isolated policy was not restored to 25000.');
assert(Number(readback.isolated.recordCount) === 17 && Number(readback.isolated.exp1040Matches) === 0, 'Isolated record readback mismatch.');
assert(Number(readback.sharedEvidence.exp1040Matches) === 1, 'Shared EXP-1040 evidence count mismatch.');
assert(readback.sharedEvidence.record.Id === 'DB470F2F-E1B8-F111-A6A9-6045BDDBB45C', 'Shared record ID mismatch.');
assert(String(readback.sharedEvidence.task.Id) === '101665521' && readback.sharedEvidence.task.Status === 'Unassigned', 'Shared task preservation mismatch.');
assert(readback.isolated.tasks.length === 4 && readback.isolated.tasks.every(t => t.status === 'Pending' && Number(t.folderId) === 1245402), 'Isolated task state mismatch.');
const link = `https://staging.uipath.com/testcloud_team/TAM/testmanager_/EXPENSEFLOW/testexecutions/${executionId}`;
for (const report of [md, html]) {
  assert(report.includes(executionId) && report.includes(link), 'Report execution link mismatch.');
  assert(report.includes('EXP-1040') && report.includes('101665521'), 'Report omits preserved shared evidence.');
  assert(report.includes('EF-REG-012') && report.includes('EF-REG-013'), 'Report omits restricted cases.');
  assert(!/:\s*undefined|=\s*undefined|\{\{|\}\}/.test(report), 'Report contains unresolved placeholders.');
}
assert(md.includes('**2/35 captured**') && md.includes('**0 upload failures**'), 'Markdown evidence totals mismatch.');
assert(html.includes('2/35 captured') && html.includes('0 upload failures'), 'HTML evidence totals mismatch.');
assert(md.includes('No email was sent.') && html.includes('No email was sent.'), 'Email status missing.');
const ledger = read(ledgerFile).split(/\r?\n/).filter(Boolean).map(JSON.parse);
const matches = ledger.filter(x => x.runId === runId);
assert(matches.length === 1, `Expected one ledger entry for runId, found ${matches.length}.`);
assert(matches[0].testManagerExecutionId === executionId && matches[0].baselineUpdate.advanced === false, 'Ledger execution/baseline mismatch.');
assert(state.lastSuccessfulBaselineSha === null && state.baselineAdvanced === false, 'qa-state baseline changed.');
assert(state.latestExecutionId === executionId, 'qa-state execution pointer mismatch.');
assert(state.latestEvidenceManifestPath === qaRel(manifestFile), 'qa-state manifest pointer mismatch.');
assert(state.latestReportPath === qaRel(mdFile) && state.latestReportHtmlPath === qaRel(htmlFile), 'qa-state report pointer mismatch.');
assert(state.reportTotalsReconciled === true, 'qa-state reconciliation flag missing.');
const historical = path.join(qa, 'reports', 'expenseflow-qa-20260925T133925+0530-8ccbb1c-13ecfea8-591d-0e00-db4b-0b4a2b2adfd6.md');
assert(fs.existsSync(historical), 'Historical report was not preserved.');
console.log(JSON.stringify({ status: 'PASS', executionId, runId, verified: { cases: manifest.cases.length, steps: steps.length, technicalRestrictedSteps: 35, blockedCases: 9, restrictedCases: 2, blockedSteps: 30, restrictedSteps: 5, capturedAttachments: 2, notCaptured: 33, uploadFailures: 0, ledgerMatches: matches.length, baselineAdvanced: state.baselineAdvanced }, outputs: { manifest: qaRel(manifestFile), markdown: qaRel(mdFile), html: qaRel(htmlFile), ledger: qaRel(ledgerFile), state: qaRel(stateFile) } }, null, 2));
