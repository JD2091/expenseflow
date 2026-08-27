# ExpenseFlow

An enterprise expense-tracking web app, built as a **UiPath Coded Web App** (React + TypeScript +
Vite). It runs standalone on in-memory data, or wired to a UiPath tenant for real persistence,
policy checks and approvals.

- **Mock mode** (default): five screens on an in-memory fixture — no sign-in, no network.
- **Connected mode**: the list comes from a Data Fabric entity and survives a refresh, submitting
  writes a record and uploads the receipt to a storage bucket, the auto-approval threshold is an
  Orchestrator asset, and an over-threshold expense raises an Action Center task that the
  approval screen completes.

The service layer keeps one signature (`src/services/expenseService.ts`) with two
implementations behind it, so components never know which mode they are in.

## Screens

| Route            | Screen                                                                    |
| ---------------- | ------------------------------------------------------------------------- |
| `/`              | Employee dashboard — three derived KPIs and recent activity              |
| `/expenses`      | Full list with status / category / date-range filters and sorting       |
| `/expenses/new`  | New Expense form                                                         |
| `/expenses/:code`| Expense detail with a four-step status tracker (reach it by clicking a row)|
| `/approvals`     | Approval queue — Approve / Reject / Request rework                       |
| `/finance`       | Finance operations view — server-side KPIs and a "needs attention" queue |

> **Two-segment routes cannot be loaded directly.** `vite.config.ts` sets `base: './'`, so
> `/expenses/new` requests `/expenses/assets/index-*.js`; an SPA fallback serves `index.html`, the
> browser rejects the module script, and the page is blank. Navigate to the detail and New Expense
> screens by clicking, and do not reload while on one.

## URL switches

| Switch             | Effect                                                                       |
| ------------------ | --------------------------------------------------------------------------- |
| `?mock=1`          | Force mock mode for this tab (no sign-in, no network). Survives navigation. |
| `?demo=fail`       | Arm a one-shot failure on the next submit or approval — see below           |
| `?simulateError=1` | Mock mode only: make the mock service's reads fail, to preview the error UI |

They compose: `?mock=1&demo=fail` exercises error handling with no tenant at all.

`?demo=fail` checks *before* the first UiPath call, so an armed failure writes nothing — no
record, no receipt, no task — and the form keeps its fields so the retry is one click. Variants:
`?demo=fail-submit` and `?demo=fail-decide` arm only one of the two.
`VITE_EXPENSEFLOW_MOCK=1` makes mock mode permanent for a build. Implementation:
`src/services/demoFailure.ts`.

## Run it

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>. With no `uipath.json` configured the app starts in mock mode.

> **`@expenseflow/design-tokens` is a private package** (colours, spacing, type). `npm install`
> needs access to it, or vendor it / swap `src/main.tsx`'s two token imports for plain CSS.

## Connect it to a UiPath tenant

### 1. Provision the resources

Create these in your tenant with these **exact names** — the app resolves them by name:

| Resource            | Name                                                | Where                         |
| ------------------- | -------------------------------------------------- | ----------------------------- |
| Data Fabric entity  | `ExpenseFlow_Expense`                              | Data Fabric                   |
| Choice set          | `ExpenseFlow_Status`                               | Data Fabric                   |
| Choice set          | `ExpenseFlow_Category`                             | Data Fabric                   |
| Orchestrator asset  | `ExpenseFlow_PolicyThreshold` — Integer, e.g. `25000` | a folder, e.g. `Shared`   |
| Storage bucket      | `ExpenseFlow_Receipts`                             | the same folder               |

- `ExpenseFlow_Expense` fields: see `FIELD` in `src/services/uipath/config.ts`.
- `ExpenseFlow_Status` values: `Draft`, `Submitted`, `PolicyReview`, `PendingApproval`,
  `Approved`, `Rejected`, `Reworked`.
- `ExpenseFlow_Category` values: `Travel`, `Meals`, `Accommodation`, `Office`, `Other`.

### 2. Register an OAuth application

Create a **non-confidential** External Application (PKCE) with redirect URI
`http://localhost:5173` and these scopes:

```text
DataFabric.Schema.Read DataFabric.Data.Read DataFabric.Data.Write
OR.Assets.Read OR.Buckets OR.Tasks OR.Folders.Read
```

### 3. Fill in `uipath.json`

```jsonc
{
  "clientId":    "<your External Application client ID>",
  "scope":       "DataFabric.Schema.Read DataFabric.Data.Read DataFabric.Data.Write OR.Assets.Read OR.Buckets OR.Tasks OR.Folders.Read",
  "orgName":     "<your org>",
  "tenantName":  "<your tenant>",
  "baseUrl":     "https://cloud.api.uipath.com",
  "redirectUri": "http://localhost:5173"
}
```

`baseUrl` must be the **API** subdomain (`cloud.api.uipath.com`), never `cloud.uipath.com` — the
portal host fails CORS. `@uipath/coded-apps-dev` reads this file locally to inject the
`<meta name="uipath:*">` tags the SDK needs; in production the platform injects them. It holds no
secrets (a public client ID plus org / tenant / base URL / redirect URI), which is why it is
committed and there is no `.env`.

### 4. Fill in the two ids that can't be resolved by name

`src/services/uipath/config.generated.ts` ships with placeholder ids. Replace two:

| Field       | Value                                              | Find it with                                        |
| ----------- | ------------------------------------------------- | --------------------------------------------------- |
| `entityId`  | the `ExpenseFlow_Expense` entity id              | Data Fabric UI, or `uip df entities list`           |
| `folderKey` | GUID of the folder holding the asset + bucket    | `uip or folders list` — also set `folderPath` to that folder's name |

Choice-set ids and field metadata are read off the entity schema at load time, so those two are
all a fresh tenant needs.

Now `npm run dev` signs you in and connects.

## Deploy

```bash
npm install -g @uipath/cli
uip tools install @uipath/codedapp-tool @uipath/orchestrator-tool
uip login                                  # opens a browser
```

Then from the repo:

```bash
npm run build
uip codedapp pack dist -n ExpenseFlow --version 1.0.0
uip codedapp publish                       # uploads the package + registers the app
uip codedapp deploy -n ExpenseFlow --folder-key <your folder GUID>
```

`publish` writes `.uipath/app.config.json` with the live `appUrl`. Bump `--version` on every
re-publish. After the first deploy, add the deployed URL as a redirect URI on the OAuth
application.

## Tests

```bash
npm test
```

Plain `node --test` over the service layer — no browser, no framework. Each file pins something
that would otherwise fail silently:

| File                       | What it protects                                                        |
| -------------------------- | --------------------------------------------------------------------- |
| `scripts/policy.test.ts`   | A submit decides against a live asset read, not a page-load cache       |
| `scripts/approval.test.ts` | Action Center first, Data Fabric second — and `Status` written as a numberId |
| `scripts/errors.test.ts`   | Every `UiPathError` subclass has a distinct, actionable message         |
| `scripts/finance.test.ts`  | Choice filters are translated; aggregate aliases survive the server's case change |
| `scripts/format.test.ts`   | `en-IN` grouping, and dates formatted from the string not through a `Date` |

`scripts/smoke.mjs` drives headless Chrome over the DevTools protocol (no puppeteer) against the
**built** app in mock mode — every screen renders, tables paginate, `?demo=fail` shows the error
and keeps form data, controls are labelled, no horizontal scroll:

```bash
npm run build
npx vite preview --port 4188 --strictPort     # in another shell
npm run smoke
```

## Layout

```text
src/
├── components/   # presentational, no SDK calls
├── pages/        # one per screen
├── hooks/        # useExpenses.tsx (expense state), useFinance.tsx, useToasts.tsx, useAuth.tsx
├── services/
│   ├── expenseService.ts       # the one seam — same signatures, tenant-backed bodies
│   ├── expenseService.mock.ts  # in-memory implementation (the ?mock=1 path)
│   ├── demoFailure.ts          # ?demo=fail one-shot failure
│   └── uipath/                 # the only code that knows the SDK exists
│       ├── config.ts + config.generated.ts   # resolved ids; the only UUIDs in src/
│       ├── client.ts        # subpath imports + constructor DI, registered once
│       ├── runtime.tsx      # signs in, warms the schema and choice maps
│       ├── schema.ts        # entity introspection; blocks silently-dropped keys
│       ├── choiceSets.ts    # byName and byNumberId, fetched on load
│       ├── mappers.ts       # EntityRecord <-> Expense; all choice translation
│       ├── entityClient.ts  # cursor-looping queries, server-side aggregates
│       ├── policy.ts        # the threshold asset
│       ├── receipts.ts      # the receipt bucket (upload + pre-signed read URI)
│       ├── approvals.ts     # Action Center: create the task, complete the task
│       ├── folders.ts       # the numeric folder id Tasks.create requires
│       └── errors.ts        # UiPathError -> one sentence + a recovery affordance
├── models/       # types
├── data/         # in-memory seed data
├── lib/          # formatters, helpers
└── styles/app.css
```

Architecture is **Component → Hook → Service → SDK**; components never import the SDK directly.

## Things that look like noise and are not

- **`vite.config.ts` → `base: './'`** — deployed apps mount at a non-root prefix; without this
  every asset 404s in production.
- **No `server.proxy`** — it breaks the OAuth callback and asset resolution.
- **`new UiPath()` takes no arguments.** It reads the injected meta tags. Do not pass config.
- **The `didInit` ref in `src/hooks/useAuth.tsx`.** Strict Mode double-invokes effects and OAuth
  codes are single-use — without the guard the second `completeOAuth()` fails.
- **`createBrowserRouter(..., { basename: getAppBase() })` in `src/App.tsx`.** `getAppBase()` is
  `'/'` locally and the platform's mount prefix in production; a hardcoded `'/'` 404s on deploy.
- **`src/services/uipath/entityClient.ts` cursor-loops every list call.** Every UiPath list call
  returns one page even with no options; a single `queryRecordsById` looks fine at 12 rows and
  truncates at 150. Same reason the dashboard totals are a server-side `COUNT` / `SUM`.
- **Choice fields are translated in `src/services/uipath/mappers.ts` and nowhere else.** A Data
  Fabric choice value reads back as an integer, so `record.Status === 'Approved'` is always
  false. A `toName` / `toNumberId` call outside that file means the mapper has a hole.
- **`src/services/uipath/config.generated.ts` holds the only UUIDs in `src/`** — hand-edit
  `entityId` and `folderKey` as described above.
- **`src/hooks/useExpenses.tsx` is the only file that imports `expenseService`.** Verify:
  `grep -rl expenseService src/ | grep -v src/hooks/ | grep -v src/services/` (expect nothing).
- **`src/components/ErrorBoundary.tsx` wraps the router.** Error translation and per-screen error
  states do not catch a component that throws while rendering — React unmounts the whole tree.
- **`NewExpenseForm` clears its fields only on success**, so a failed submit is a one-click retry.
- **The Action Center task is completed before the Data Fabric record is updated**
  (`expenseService.decideExpense`); `scripts/approval.test.ts` pins the ordering. The other order
  can leave a record marked "Approved" while the task sits open.
- **`src/lib/format.ts` is the only file that formats a number or a date.** `en-IN` groups
  `4825000` as `48,25,000`; a stray `.toLocaleString()` elsewhere renders it the US way. Verify:
  `grep -rn toLocaleString src/ | grep -v src/lib/format` (expect nothing).
- **The OAuth callback strips only the OAuth params**, not the whole query string
  (`src/hooks/useAuth.tsx`) — replacing `window.location.search` wholesale would drop `?mock=1`.
- **Every dependency is pinned to an exact version** (no `^`, no `~`). Re-pin deliberately.
