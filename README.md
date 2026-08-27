# ExpenseFlow

The app the workshop builds. **One app across Day 1 and Day 2** (decision D6) — it evolves via git
tags, it is never re-scaffolded on Day 2.

| Day | Tag range | What it becomes |
|---|---|---|
| Day 1 | `day1-00-start` → `day1-final` (`v0.1.0`) | The experience: React fundamentals, mock data, five screens |
| Day 2 | `day2-00-start` → `day2-final` (`v1.0.0`) | The same UI, wired to Data Fabric, Orchestrator and Action Center |

At `day1-00-start` this is a **valid but deliberately empty** UiPath Coded Web App: it builds
clean, the SDK is wired, and it renders one placeholder screen. That is the state the audience
sees at minute 18 of Day 1, and the tag the speaker resets to if the live build goes sideways.

At `day1-final` (`v0.1.0`) it is the finished Day-1 product: **five screens**, twelve components
and a mock-data service, with nothing UiPath-specific in the UI yet.

At `day2-final` (`v1.0.0`) the same five screens are backed by the platform end to end: the list
comes out of Data Fabric and survives a refresh, submitting writes a real record and uploads the
receipt to a storage bucket, the approval threshold is an Orchestrator Asset, an over-threshold
expense raises a real **Action Center task**, and the manager's Approve / Reject / Request-rework
buttons complete that task. **`listExpenses` and `createExpense` still have their Day-1
signatures** — that is the point, and `git diff day1-final -- src/services/expenseService.ts` is
the slide.

| Route | Screen |
|---|---|
| `/` | Employee dashboard — three derived KPIs and recent activity |
| `/expenses` | The full list, with status / category / date-range filters and sorting |
| `/expenses/new` | The New Expense form |
| `/expenses/:code` | Expense detail with the four-step status tracker, e.g. `/expenses/EXP-1007`. **Reach it by clicking a row — see below** |
| `/approvals` | Manager approval queue — Approve / Reject / Request rework, against real Action Center tasks |
| `/finance` | Finance operations view — server-side KPIs and the "needs attention" queue |

> **Two-segment routes cannot be loaded directly.** `base: './'` (Critical Rule 9) makes
> `/expenses/new` request `/expenses/assets/index-*.js`; the SPA fallback answers with
> `index.html`, the browser refuses a module script served as `text/html`, and the page is blank
> with an empty console. Single-segment routes are fine. **Click into the detail and New Expense
> screens; do not type their URLs and do not reload while on one.** The fix is a hosting decision
> and belongs to T09 — STATE.md §11 Q17.

### URL switches

Three, all documented because all three are used live on stage.

| Switch | What it does |
|---|---|
| `?mock=1` | The Day-2 fallback — see below |
| `?demo=fail` | Arms the rehearsed failure — see below |
| `?simulateError=1` | Mock-mode only: makes the mock service's reads fail, to see the error state with no tenant at all |

They compose: `?mock=1&demo=fail` demonstrates error handling on a machine with no tenant access.

### `?demo=fail` — the rehearsed failure

The Day-2 script spends six minutes (37–43) on error handling and needs a failure **on cue**.
Waiting for a real service to be down at the right moment is not a demo, it is a gamble — and it
fails in the direction you cannot recover from, which is nothing going wrong.

**Arm it on a single-segment route and click through** — two-segment routes cannot be loaded
directly (see the warning above), and the switch follows you across in-app navigation.

| Do this | Effect |
|---|---|
| `…/?demo=fail`, then click **New Expense** | The next **submit** fails |
| `…/approvals?demo=fail` | The next **approve / reject / rework** fails |
| `…/?demo=fail-submit` / `?demo=fail-decide` | One of the two only |

Disarm by going to `…/` with no query and pressing Enter: that is a full page load, and the
sticky-switch memory (`components/StickySwitches.tsx`) dies with the page.

The check runs **before the first UiPath call**, so an armed failure writes nothing: no record, no
receipt in the bucket, no Action Center task. Nothing to undo, and the segment can be run twice.
The form also keeps every field and re-enables its button, so the retry is one click.

The `₹0` path in the script needs none of this: the form refuses a zero amount with its own
message. Showing both is the point — one failure never leaves the browser, the other comes back
from a service.

Implementation: `src/services/demoFailure.ts`.

### `?mock=1` — the Day-2 fallback

Append `?mock=1` to any URL and the app runs entirely on the Day-1 in-memory fixture, with no
network calls and no sign-in. Use it if the tenant is unreachable mid-session — an expired refresh
token, a VPN, a UiPath incident. No rebuild, no redeploy. `VITE_EXPENSEFLOW_MOCK=1` does the same
thing permanently, for a machine that should never touch the tenant.

The two implementations live side by side in `src/services/`: `expenseService.ts` talks to UiPath,
`expenseService.mock.ts` is Day 1's logic, untouched. Neither one is visible to a component.

## Run it

```bash
npm install          # from the repo root — this is an npm workspace
npm run dev -w apps/expenseflow
```

Then open <http://localhost:5173>.

## Sign-in

`uipath.json` is filled in — T05 resolved the tenant and provisioned everything Day 2 needs:

| | |
|---|---|
| Org / tenant | `uipathlabsunifiedmix` / `Testing` (**staging**) |
| Base URL | `https://staging.api.uipath.com` — the **API** subdomain, not the portal host |
| Client | `f5c54f70-…` — "ExpenseFlow Workshop", non-confidential, all seven Day-2 scopes |

Nothing in **Day 1** calls UiPath, so sign-in is not on the critical path for `day1-final`. Day 2
is where it starts mattering.

Before relying on it, prove the tenant is actually up:

```bash
node uipath/preflight/probe.mjs           # expect READY, exit 0
npm run sync:uipath -w apps/expenseflow   # copy the resolved ids into src/
```

The second command regenerates `src/services/uipath/config.generated.ts`. **Run it after any
re-provisioning** — every resource is resolved by NAME by the scripts under `uipath/`, and that
file is only the cached answer so the browser does not have to resolve them on every load. It is
the one file in `src/` allowed to contain a UUID.

`docs/setup.md` covers provisioning, the seed data, the reset command, and what to do about each
failing check.

## Things that must not be "cleaned up"

These look like noise and are not:

- **`vite.config.ts` → `base: './'`** — Critical Rule 9. Deployed apps mount at a non-root prefix;
  without this every asset 404s in production.
- **No `server.proxy`** — it breaks the OAuth callback and asset resolution.
- **`uipath.json` is committed on purpose.** It holds no secrets: a public non-confidential OAuth
  client ID plus org/tenant/base-URL/redirect-URI. The `uipathCodedApps()` plugin reads it to
  inject the `<meta name="uipath:*">` tags locally; the platform injects them in production.
  There is no `.env`.
- **`baseUrl` is `api.uipath.com`**, never `cloud.uipath.com` — the latter fails CORS.
- **`new UiPath()` takes no arguments.** It reads those meta tags. Do not "fix" it by passing config.
- **The `didInit` ref in `src/hooks/useAuth.tsx`.** Strict Mode double-invokes effects and OAuth
  codes are single-use — without the guard the second `completeOAuth()` fails.
- **`createBrowserRouter(..., { basename: getAppBase() })` in `src/App.tsx`.** Critical Rule 10.
  `getAppBase()` returns `'/'` locally and the platform's mount prefix in production; a hardcoded
  `'/'` basename 404s the moment the app deploys.
- **`src/services/uipath/entityClient.ts` cursor-loops every list call.** Every UiPath list call
  returns ONE page, even with no options — `NonPaginatedResponse` describes the response shape,
  not the row count. A single `queryRecordsById` looks correct at 12 rows and silently truncates
  at 144. Same reason the dashboard totals are a server-side `COUNT`/`SUM`.
- **Choice fields are translated in `src/services/uipath/mappers.ts` and nowhere else.** A Data
  Fabric choice value reads back as an integer on every path, so `record.Status === 'Approved'` is
  always false and a filter value of `'Approved'` matches nothing. If a `toName` or `toNumberId`
  call appears outside that file, the mapper has a hole in it.
- **`src/services/uipath/config.generated.ts` is generated.** Edit `last-probe.json` and re-run
  `npm run sync:uipath`; do not hand-edit it.
- **`src/hooks/useExpenses.tsx` is the only file that imports `expenseService`.** That is the
  architecture, not a coincidence — it is what makes Day 2 a diff to one file. Verify with:
  `grep -rl expenseService src/ | grep -v src/hooks/ | grep -v src/services/` (expect nothing).
- **The two `Draft` rows in `src/data/mockExpenses.ts`.** They are in the table and in none of the
  three stat cards, because a draft has not been submitted. That gap is what proves on stage that
  the numbers are derived. Do not "fix" the fixture to make them agree.
- **`src/components/ErrorBoundary.tsx` wraps the router in `App.tsx`.** Every UiPath call is
  translated and every screen has an error state, but neither catches a component that throws while
  RENDERING — and React's answer to one of those is to unmount the whole tree. A blank white page
  with the app gone is the one failure a live demo cannot survive.
- **`NewExpenseForm` clears its fields only on the success path.** Wiping a form on failure makes
  the user retype everything in front of an audience, at the moment the app already looks broken.
- **The Action Center task is completed BEFORE the Data Fabric record is updated**
  (`expenseService.decideExpense`). The other order leaves a record claiming "Approved" while the
  task sits open in someone's inbox, with nothing on either screen to say the two systems disagree.
  `scripts/approval.test.ts` pins the ordering.
- **`src/lib/format.ts` is the only file that formats a number or a date.** `4825000` is
  `48,25,000` under `en-IN` and `4,825,000` under `en-US`; one stray `.toLocaleString()` at a call
  site renders lakhs the American way on one screen and the Indian way on the next. Verify with
  `grep -rn toLocaleString src/ | grep -v src/lib/format` (expect nothing).
- **The OAuth callback strips only the OAuth params, not the whole query string**
  (`src/hooks/useAuth.tsx`). Replacing `window.location.search` wholesale deletes `?mock=1` and
  `?demo=fail` at the one moment nobody would think to look for them.
- **Every dependency is pinned to an exact version.** No `^`, no `~`. A live workshop cannot absorb
  a transitive breaking change on the morning of the event. Re-pin deliberately, never by
  `npm update`.

## Tests

```bash
npm test -w apps/expenseflow
```

Plain `node --test` over the service layer — no browser, no test framework, nothing to install.
They pin the four things that fail **silently** and would otherwise only be caught on a projector:

| File | What it protects |
|---|---|
| `scripts/policy.test.ts` | A submit decides against a LIVE Asset read, never a page-load cache |
| `scripts/approval.test.ts` | Action Center first, Data Fabric second — and `Status` written as a numberId |
| `scripts/errors.test.ts` | All seven `UiPathError` subclasses have distinct, actionable messages |
| `scripts/finance.test.ts` | Choice filters are translated; aggregate aliases survive the server's case change |
| `scripts/format.test.ts` | `en-IN` grouping, and dates formatted from the string not through a `Date` |

### The headless walk-through

Unit tests cannot see a blank page. `scripts/smoke.mjs` drives real Chrome over the DevTools
protocol — no puppeteer to install — through **33 checks** against the **built** app in mock mode.

Part one covers the shell: every screen renders, both tables say "Showing X–Y of Z", `?demo=fail`
produces the friendly error **and the form keeps its data**, every form control has a label, and
no screen scrolls horizontally at 1280 / 1440 / 1920.

Part two walks the exact ARM / SUBMIT / DISARM sequence `docs/STATE.md` §12 tells the presenter to
type — including the hard refresh the Day-2 script calls for, which is the step that exposed the
dropped `?mock=1`. A documented sequence nobody has walked is a rumour.

```bash
npm run build -w apps/expenseflow
npx vite preview --port 4188 --strictPort     # in apps/expenseflow, in another shell
npm run smoke -w apps/expenseflow
```

It found two things reading the code did not — see the header of the file. It proves nothing about
UiPath (it runs in `?mock=1` with no tenant); STATE.md §11 Q12 tracks what still needs a real
browser session.

## Layout

```text
src/
├── components/   # presentational, no SDK calls
├── pages/        # one per screen
├── hooks/        # useExpenses.tsx (all expense state), useFinance.tsx, useToasts.tsx, useAuth.tsx
├── services/
│   ├── expenseService.ts       # the Day-2 seam — Day-1 signatures, new bodies
│   ├── expenseService.mock.ts  # Day 1's logic, kept as the ?mock=1 fallback
│   ├── demoFailure.ts          # ?demo=fail — the rehearsed error-handling beat
│   └── uipath/                 # the only code that knows the SDK exists
│       ├── config.ts + config.generated.ts   # resolved ids; the only UUIDs in src/
│       ├── client.ts        # subpath imports + constructor DI, registered once
│       ├── runtime.tsx      # signs in, warms the schema and choice maps
│       ├── schema.ts        # entity introspection; blocks silently-dropped keys
│       ├── choiceSets.ts    # byName AND byNumberId, fetched on load
│       ├── mappers.ts       # EntityRecord <-> Expense; all choice translation
│       ├── entityClient.ts  # cursor-looping queries, server-side aggregates
│       ├── policy.ts        # the threshold Asset
│       ├── receipts.ts      # the receipt bucket (upload + pre-signed read URI)
│       ├── approvals.ts     # Action Center: create the task, complete the task
│       ├── folders.ts       # the numeric folder id Tasks.create insists on
│       └── errors.ts        # UiPathError -> one sentence + a recovery affordance
├── models/       # types
├── data/         # mock seed data (Day 1)
├── lib/          # formatters, helpers
└── styles/app.css
```

The mandated architecture is **Component → Hook → Service → SDK**. Components never import the
SDK directly.

Colours, spacing and type come from `@expenseflow/design-tokens` — no raw hex literals in
`app.css`. See `docs/design-system.md`.
