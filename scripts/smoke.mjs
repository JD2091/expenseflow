/* ============================================================================
 * ExpenseFlow — headless walk-through of the built app
 * ============================================================================
 *
 *   >>> THE UNIT TESTS CANNOT SEE A BLANK PAGE. <<<
 *
 * `npm test` proves the service layer's logic. It cannot prove that the app
 * RENDERS, that a link goes where it says, or that the rehearsed failure still
 * fires after somebody clicks something — and those are the failures a live
 * demo actually dies of.
 *
 * This drives real Chrome over the DevTools protocol. No puppeteer, no
 * playwright, nothing to install: Chrome is already on the machine that will
 * present, and that is the machine whose behaviour matters.
 *
 * Two parts. PART ONE checks the shell — every screen, both pagers, the error
 * path, labels, no horizontal scroll. PART TWO walks the exact ARM / SUBMIT /
 * DISARM sequence `docs/STATE.md` §12 tells the presenter to type, verbatim,
 * including the hard refresh the Day-2 script calls for. A documented sequence
 * that nobody has walked is a rumour.
 *
 * It runs entirely in `?mock=1`, so it needs no tenant, no sign-in and no
 * network. It therefore proves everything about the SHELL and nothing about
 * UiPath — see STATE.md §11 Q12 for what still needs a real browser session.
 *
 * ---------------------------------------------------------------------------
 * RUN IT
 *
 *     npm run build   -w apps/expenseflow
 *     npx vite preview --port 4188 --strictPort    # in apps/expenseflow
 *     npm run smoke   -w apps/expenseflow
 *
 * ---------------------------------------------------------------------------
 * WHAT IT CAUGHT
 *
 * Two things that reading the code did not, both on the first run:
 *
 *   1. `<Link>` DROPS THE QUERY STRING. One click on the sidebar and
 *      `?demo=fail` was gone, so the rehearsed failure fired from the dashboard
 *      and never from the form — the one screen the script uses it on. `?mock=1`
 *      disappeared from the address bar too, so the first hard refresh (which
 *      the Day-2 script explicitly calls for) would have dropped the fallback
 *      back onto the tenant it was there to avoid. Fixed by
 *      `components/StickySwitches.tsx`; steps 5 and 6 below are the regression.
 *
 *   2. A TWO-SEGMENT ROUTE CANNOT BE LOADED DIRECTLY under `base: './'` —
 *      `/expenses/new` asks for `/expenses/assets/index-*.js`, the SPA fallback
 *      answers with index.html, and the page is blank. That is a hosting
 *      property rather than an app bug, and the demo never types a deep URL, so
 *      the steps below CLICK their way in. Written up as STATE.md §11 Q17.
 * ========================================================================== */

import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// Defaults to the local `vite preview`. Point it at a DEPLOYED app to prove the
// hosted URL actually renders — the one thing a 200 from curl cannot tell you:
//
//   $env:SMOKE_BASE = 'https://<org>.cloud.uipath.host/expenseflow'
//   npm run smoke -w apps/expenseflow
//
// Every step runs in ?mock=1, so this needs no sign-in and touches no tenant.
// T09 uses it as the last gate before saying a deployment is good.
const BASE = (process.env.SMOKE_BASE || 'http://localhost:4188').replace(/\/$/, '');
const profile = mkdtempSync(join(tmpdir(), 'ef-smoke-'));

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=9333',
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cdpTargets() {
  const res = await fetch('http://127.0.0.1:9333/json/list');
  return res.json();
}

async function connect() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const list = await cdpTargets();
      const page = list.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error('Chrome did not expose a debugging target');
}

const wsUrl = await connect();
const ws = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

let nextId = 1;
const pending = new Map();
const consoleErrors = [];
const pageErrors = [];

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
    return;
  }
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    pageErrors.push(msg.params.exceptionDetails.text ?? 'exception');
  }
};

function send(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const res = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res.result?.result?.value;
}

async function goto(path) {
  consoleErrors.length = 0;
  pageErrors.length = 0;
  await send('Page.navigate', { url: `${BASE}${path}` });
  await sleep(2500);
}

await send('Page.enable');
await send('Runtime.enable');

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

/* --- 1. dashboard ------------------------------------------------------- */
await goto('/?mock=1');
const dashText = await evaluate('document.body.innerText');
check('dashboard renders', typeof dashText === 'string' && dashText.length > 100);
check('dashboard KPIs are the Day-1 numbers', /₹48,250/.test(dashText) && /₹31,800/.test(dashText) && /₹16,450/.test(dashText));
check('no uncaught render error', pageErrors.length === 0, pageErrors.join(' | '));

/* --- 2. expense list paginates ------------------------------------------ */
await goto('/expenses?mock=1');
const listText = await evaluate('document.body.innerText');
check('expense list shows "Showing X–Y of Z"', /Showing\s+\d+–\d+\s+of\s+\d+/.test(listText), listText.match(/Showing[^\n]*/)?.[0] ?? 'not found');

/* --- 3. finance --------------------------------------------------------- */
await goto('/finance?mock=1');
const finText = await evaluate('document.body.innerText');
check('finance renders KPI tiles', /Expenses/.test(finText) && /Pending/.test(finText) && /This month/.test(finText));
check('finance needs-attention table paginates', /Showing\s+\d+–\d+\s+of\s+\d+/.test(finText) || /Nothing needs attention/.test(finText), finText.match(/Showing[^\n]*/)?.[0] ?? '(empty state)');

/* --- 4. approvals ------------------------------------------------------- */
await goto('/approvals?mock=1');
const apprText = await evaluate('document.body.innerText');
check('approval queue offers all three actions', /Approve/.test(apprText) && /Reject/.test(apprText) && /Request rework/.test(apprText), apprText.includes('Nothing to approve') ? 'EMPTY QUEUE' : '');

/* --- 5. the deliberate failure ------------------------------------------ */
/*
 * Reached by CLICKING the sidebar link, not by navigating to the URL.
 * `base: './'` (Critical Rule 9) means a two-segment route served by the SPA
 * fallback resolves `./assets/…` to `/expenses/assets/…`, which the fallback
 * answers with index.html — a module script served as text/html, so the page
 * is blank. That is a HOSTING property, not an app bug, and it is exactly how
 * the demo is driven anyway: nobody types a deep URL, they click.
 * Written up for T09 in STATE.md §11 Q17.
 */
await goto('/?mock=1&demo=fail');
await evaluate(`document.querySelector('a[href$="/expenses/new"]').click(); true`);
await sleep(1200);

// Fill the form and submit it, the way a presenter would.
await evaluate(`(() => {
  const setValue = (el, value) => {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const desc = document.querySelector('input[placeholder^="e.g."]');
  const amount = document.querySelector('input[type="number"]');
  setValue(desc, 'Customer conference travel');
  setValue(amount, '37550');
  return true;
})()`);
await sleep(200);
await evaluate(`document.querySelector('form').requestSubmit(); true`);
await sleep(1500);

const failText = await evaluate('document.body.innerText');
const descValue = await evaluate(`document.querySelector('input[placeholder^="e.g."]').value`);
const amountValue = await evaluate(`document.querySelector('input[type="number"]').value`);
const submitDisabled = await evaluate(`document.querySelector('button[type="submit"]').disabled`);

check('?demo=fail produces a friendly error', /Expense submission failed/.test(failText), failText.match(/Expense submission failed[^\n]*/)?.[0] ?? failText.slice(0, 200));
check('the failure never shows a raw error', !/Unhandled|\[object|TypeError|undefined is not/.test(failText));
check('the form keeps the description', descValue === 'Customer conference travel', `got "${descValue}"`);
check('the form keeps the amount', amountValue === '37550', `got "${amountValue}"`);
check('the submit button re-enables', submitDisabled === false, `disabled=${submitDisabled}`);
check('a toast announced the failure', (await evaluate(`document.querySelector('.toast-region')?.innerText ?? ''`)).length > 0);
check('the toast region is a live region', (await evaluate(`document.querySelector('.toast-region')?.getAttribute('aria-live')`)) === 'polite');

/* --- 6. recovery: drop the flag ----------------------------------------- */
await goto('/?mock=1');
await evaluate(`document.querySelector('a[href$="/expenses/new"]').click(); true`);
await sleep(1200);
await evaluate(`(() => {
  const setValue = (el, value) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  setValue(document.querySelector('input[placeholder^="e.g."]'), 'Customer conference travel');
  setValue(document.querySelector('input[type="number"]'), '37550');
  return true;
})()`);
await sleep(200);
await evaluate(`document.querySelector('form').requestSubmit(); true`);
await sleep(1500);
const okText = await evaluate('document.body.innerText');
check('removing the flag makes the very next submit succeed', /submitted for ₹37,550/.test(okText), okText.match(/EXP-\d+ submitted[^\n]*/)?.[0] ?? okText.slice(0, 200));

/* --- 7. labels ---------------------------------------------------------- */
await goto('/?mock=1');
await evaluate(`document.querySelector('a[href$="/expenses/new"]').click(); true`);
await sleep(1200);
const unlabelled = await evaluate(`(() => {
  const controls = [...document.querySelectorAll('input, select, textarea')];
  return controls.filter((el) => {
    if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return false;
    if (el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]')) return false;
    return !el.closest('label');
  }).map((el) => el.outerHTML.slice(0, 80));
})()`);
check('every form control has a label', Array.isArray(unlabelled) && unlabelled.length === 0, (unlabelled ?? []).join(' | '));

/* --- 8. no horizontal page scroll --------------------------------------- */
for (const width of [1280, 1440, 1920]) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
  await goto('/finance?mock=1');
  const overflow = await evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth');
  check(`no page-level horizontal scroll at ${width}px`, overflow <= 0, `overflow=${overflow}`);
}


/* --- helpers for the scripted walk-through ------------------------------- */

const fill = () => evaluate(`(() => {
  const set = (el, v) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  set(document.querySelector('input[placeholder^="e.g."]'), 'Customer conference travel');
  set(document.querySelector('input[type="number"]'), '37550');
  return true;
})()`);

const clickNav = (href) => evaluate(`document.querySelector('a[href$="${href}"]').click(); true`);
const submit = () => evaluate(`document.querySelector('form').requestSubmit(); true`);

/* ==========================================================================
 * PART TWO — the sequence the run-of-show actually tells the presenter to type
 * --------------------------------------------------------------------------
 * STATE.md §12 ("T07 — the Day-2 demo, timed") gives an exact ARM / SUBMIT /
 * DISARM sequence. A documented sequence nobody has walked is a rumour, so
 * this walks it verbatim — including the hard refresh the Day-2 script calls
 * for, which is the step that would have exposed the dropped `?mock=1`.
 * ======================================================================== */

/* --- ARM: "go to …/?demo=fail then click New Expense" -------------------- */
await goto('/?mock=1&demo=fail');
await clickNav('/expenses/new');
await sleep(1200);
check(
  'the switch follows the click (URL still shows it)',
  /demo=fail/.test(await evaluate('location.href')),
  await evaluate('location.href'),
);
check('the New Expense form rendered', (await evaluate(`!!document.querySelector('form.expense-form')`)) === true);

/* --- SUBMIT: the failure --------------------------------------------------*/
await fill();
await sleep(300);
await submit();
await sleep(1500);
const armedText = await evaluate('document.body.innerText');
check('the friendly error appears', /Expense submission failed/.test(armedText));
check('the form kept its data', (await evaluate(`document.querySelector('input[placeholder^="e.g."]').value`)) === 'Customer conference travel');
check('the button is enabled again', (await evaluate(`document.querySelector('button[type="submit"]').disabled`)) === false);

/* --- second armed attempt still fails (repeatable) ----------------------- */
await submit();
await sleep(1500);
check('a second attempt fails the same way', /Expense submission failed/.test(await evaluate('document.body.innerText')));

/* --- DISARM: "go to …/ with no query, press Enter" ----------------------- */
await goto('/?mock=1');
check('the switch is gone after a full page load', !/demo=fail/.test(await evaluate('location.href')), await evaluate('location.href'));
await clickNav('/expenses/new');
await sleep(1200);
check('and stays gone after clicking through', !/demo=fail/.test(await evaluate('location.href')), await evaluate('location.href'));
await fill();
await sleep(300);
await submit();
await sleep(1500);
const disarmedText = await evaluate('document.body.innerText');
check('the very next submit succeeds', /submitted for ₹37,550/.test(disarmedText), disarmedText.match(/EXP-\d+ submitted[^.]*/)?.[0] ?? '');

/* --- ?mock=1 survives a hard refresh mid-demo ---------------------------- */
await goto('/?mock=1');
await clickNav('/expenses');
await sleep(1200);
const listUrl = await evaluate('location.href');
check('?mock=1 is still in the URL after navigating', /mock=1/.test(listUrl), listUrl);
await send('Page.reload');
await sleep(2500);
check(
  'a hard refresh mid-demo keeps mock mode (the Day-2 "refresh the browser" beat)',
  /mock=1/.test(await evaluate('location.href')) && /Showing/.test(await evaluate('document.body.innerText')),
  await evaluate('location.href'),
);

/* --- approvals: single-segment route, safe to type ----------------------- */
await goto('/approvals?mock=1&demo=fail');
const before = await evaluate('document.body.innerText');
check('the approval queue rendered', /Approval queue/.test(before));
await evaluate(`[...document.querySelectorAll('button')].find(b => b.textContent.trim().startsWith('Approve')).click(); true`);
await sleep(1500);
const afterText = await evaluate('document.body.innerText');
check('an armed decision fails with the decision-specific message', /decision could not be recorded/i.test(afterText), afterText.match(/The decision[^\n]*/)?.[0] ?? '');
check('the expense is still in the queue', /Approval queue/.test(afterText));

console.log('');
const failed = results.filter((r) => !r.ok);
console.log(`${results.length - failed.length}/${results.length} checks passed`);

ws.close();
chrome.kill();
process.exit(failed.length === 0 ? 0 : 1);
