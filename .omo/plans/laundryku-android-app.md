# laundryku-android-app - Work Plan

## TL;DR (For humans)
**What you'll get:** An integrated Android mobile wrapper (Capacitor) for your Next.js frontend, enabling offline functionality specifically for the Karyawan (employee) section. Employees can log new laundry data without internet, which queues locally and automatically syncs to your live backend when their connection returns. You'll also get "Download App" buttons on the landing page, dashboard, and login screen.

**Why this approach:** Using Native Capacitor + Dexie.js (IndexedDB) avoids full database replication while ensuring your Karyawan module works reliably offline and can be built into a standard APK. 

**What it will NOT do:** 
- It will NOT offline the Admin or Superadmin modules.
- It will NOT use Next.js standard API proxy rewrites for the mobile build.

**Effort:** Large
**Risk:** Medium - Converting Next.js to a static export for mobile requires adjusting how external APIs and images are loaded.
**Decisions to sanity-check:** Next.js must build as an SPA (`output: "export"`) for the Android APK, meaning API calls directly hit your public backend URL instead of passing through the Next.js node server.

Your next move: Start the worker session by running `$start-work laundryku-android-app`. Full execution detail follows below.

---

> TL;DR (machine): Large effort, medium risk, Native Capacitor wrapper + Dexie.js offline queue for Karyawan module.

## Scope
### Must have
- Install Capacitor core/cli/android in the `frontend` folder.
- Add Dexie.js for local IndexedDB caching and offline sync outbox.
- Update `next.config.mjs` for static export compatibility (`output: "export"`, unoptimized images) controlled via an env variable (e.g., `MOBILE_BUILD=true`).
- Update the API client (Axios) to hit absolute public URLs (bypassing Next.js rewrites) on Capacitor.
- Implement Background Sync manager checking `navigator.onLine` to flush Dexie `sync_outbox`.
- Refactor Karyawan forms to insert into `sync_outbox` when offline.
- Add "Download App" (APK link/banner) on Home, Login, and Dashboard.

### Must NOT have (guardrails, anti-slop, scope boundaries)
- DO NOT cache Admin/Superadmin data.
- DO NOT use Next.js server actions, `getServerSideProps`, or API rewrites for mobile build outputs.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: tests-after (Playwright functional tests & build validation)
- Evidence: `<attemptDir>/task-<N>-laundryku-android-app.txt`

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | None | 2, 4, 7 | None |
| 2 | 1 | 3 | 4 |
| 3 | 2 | 5, 6 | 4 |
| 4 | None | 5, 6 | 2, 3 |
| 5 | 3, 4 | 6 | None |
| 6 | 5 | None | None |
| 7 | None | None | 1, 2, 3, 4 |

## Todos
- [ ] 1. Initialize Capacitor in Frontend
  What to do / Must NOT do: Install `@capacitor/core`, `@capacitor/cli`, and `@capacitor/android` in `frontend/`. Initialize capacitor with `npx cap init LaundryKu com.laundryku.app --web-dir out`. Add android platform via `npx cap add android`. Must NOT alter existing Node scripts for web.
  Parallelization: Wave 1 | Blocked by: None | Blocks: 2, 4
  References: `frontend/package.json`
  Acceptance criteria: `npx cap sync` succeeds without errors in `frontend/`.
  QA scenarios: Happy: Generate capacitor config successfully. Evidence: `<attemptDir>/task-1-laundryku-android-app.txt`
  Commit: Y | build(frontend): initialize capacitor for android apk

- [ ] 2. Configure Next.js Static Export
  What to do / Must NOT do: Edit `frontend/next.config.mjs`. If `process.env.MOBILE_BUILD === 'true'`, set `output: 'export'` and `images: { unoptimized: true }`. Must NOT break default web builds (keep rewrites for non-mobile builds).
  Parallelization: Wave 2 | Blocked by: 1 | Blocks: 3
  References: `frontend/next.config.mjs`
  Acceptance criteria: `MOBILE_BUILD=true npm run build` produces an `out/` directory with `index.html`.
  QA scenarios: Happy: Build succeeds with static output. Failure: Build fails due to server features. Evidence: `<attemptDir>/task-2-laundryku-android-app.txt`
  Commit: Y | config(frontend): add mobile static export to next.config.mjs

- [ ] 3. Refactor Axios API Base URL
  What to do / Must NOT do: Update the frontend's Axios instance to use `process.env.NEXT_PUBLIC_API_URL` instead of relying on the relative `/api` Next.js rewrite, especially when running in Capacitor.
  Parallelization: Wave 3 | Blocked by: 2 | Blocks: 5, 6
  References: `frontend/src/lib/api.ts` (or equivalent file where axios is instantiated).
  Acceptance criteria: Unit test or script asserting `axios.defaults.baseURL` resolves to the absolute URL.
  QA scenarios: Happy: Axios calls correct absolute URL. Evidence: `<attemptDir>/task-3-laundryku-android-app.txt`
  Commit: Y | refactor(frontend): use absolute API URLs for capacitor compatibility

- [ ] 4. Setup Dexie IndexedDB Schema
  What to do / Must NOT do: Install `dexie` and `dexie-react-hooks`. Create `frontend/src/lib/db.ts`. Define DB schema with tables: `karyawan_cache` (for read-only data) and `sync_outbox` (for pending offline mutations). 
  Parallelization: Wave 2 | Blocked by: None | Blocks: 5, 6
  References: `frontend/package.json`
  Acceptance criteria: Playwright test evaluating `window.indexedDB.databases()` on a frontend page confirms DB creation.
  QA scenarios: Happy: DB instantiated correctly in browser. Evidence: `<attemptDir>/task-4-laundryku-android-app.txt`
  Commit: Y | feat(frontend): setup dexie.js for offline storage

- [ ] 5. Implement Sync Manager
  What to do / Must NOT do: Create a global listener (e.g. in `frontend/src/app/karyawan/layout.tsx` or a custom hook) that listens for `window.addEventListener('online', syncQueue)`. The `syncQueue` function loops through Dexie `sync_outbox`, fires the Axios requests, and deletes them upon success.
  Parallelization: Wave 4 | Blocked by: 3, 4 | Blocks: 6
  References: `frontend/src/lib/db.ts`, `frontend/src/app/karyawan/layout.tsx`
  Acceptance criteria: Playwright sets offline, adds item to Dexie, goes online, and intercepts network request confirming it sent.
  QA scenarios: Happy: Queue flushes when online. Evidence: `<attemptDir>/task-5-laundryku-android-app.txt`
  Commit: Y | feat(frontend): implement offline background sync manager

- [ ] 6. Refactor Karyawan Forms for Offline Queue
  What to do / Must NOT do: Update `karyawan/laundry/new/page.tsx` (and other mutation forms). When submitting, check `navigator.onLine`. If offline, save payload to `sync_outbox` via Dexie and show "Tersimpan Offline" toast. If online, send via Axios normally.
  Parallelization: Wave 5 | Blocked by: 5 | Blocks: None
  References: `frontend/src/app/karyawan/laundry/new/page.tsx`
  Acceptance criteria: Playwright (offline mode) submits the form, verifies Dexie `sync_outbox` has 1 entry, and UI shows success.
  QA scenarios: Happy: Form saves to outbox offline. Evidence: `<attemptDir>/task-6-laundryku-android-app.txt`
  Commit: Y | feat(frontend): make karyawan laundry form offline-capable

- [ ] 7. Add Download APK Install UI
  What to do / Must NOT do: Add a CTA component (Button/Banner) for "Download Aplikasi Android" in `page.tsx` (landing), `login/page.tsx`, and `karyawan/dashboard/page.tsx`. Link to the static APK download route (e.g. `/downloads/laundryku.apk`).
  Parallelization: Wave 1 | Blocked by: None | Blocks: None
  References: `frontend/src/app/page.tsx`, `frontend/src/app/login/page.tsx`, `frontend/src/app/karyawan/dashboard/page.tsx`
  Acceptance criteria: CTA buttons exist and point to the correct APK URL.
  QA scenarios: Happy: Buttons render in DOM. Evidence: `<attemptDir>/task-7-laundryku-android-app.txt`
  Commit: Y | feat(frontend): add download APK buttons to UI

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit
- [ ] F2. Code quality review
- [ ] F3. Real manual QA
- [ ] F4. Scope fidelity

## Commit strategy
Atomic commits per todo.
## Success criteria
Karyawan can create new laundry records without internet and they sync silently when the connection returns, running on a Capacitor Android APK without breaking the Next.js standard web version.
