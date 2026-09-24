---
slug: laundryku-android-app
status: awaiting-approval
intent: clear
review_required: true
plan_path: .omo/plans/laundryku-android-app.md
plan_sha256: e79c420be9654ad68093798df7edda30c1b6571d870662af4f4a041c21888383
review_round_id: round-1
round_status: approved
completion_cas: ["status=in_flight", "workspace_root", "runtime_home", "target", "launch_id", "round_id", "plan_sha256", "session", "receipt_identity=session", "live_plan_sha256=plan_sha256", "echoed_binding", "terminal_transition=in_flight->approved|changes_requested|inconclusive"]
pending-action: review .omo/plans/laundryku-android-app.md
review:
  momus: 
    status: approved
    workspace_root: "C:\\Users\\M S I\\Documents\\webapp\\LaundryKu"
    runtime_home: null
    target: .omo/plans/laundryku-android-app.md
    round_id: round-1
    plan_sha256: e79c420be9654ad68093798df7edda30c1b6571d870662af4f4a041c21888383
    launch_id: launch-momus-1
    session: ses_f2becb929ffeA1hyhjPhtOv2ey
    result: "[OKAY] Summary: The plan is practical, well-structured, and highly executable."
  independent: 
    status: approved
    workspace_root: "C:\\Users\\M S I\\Documents\\webapp\\LaundryKu"
    runtime_home: null
    target: .omo/plans/laundryku-android-app.md
    round_id: round-1
    plan_sha256: e79c420be9654ad68093798df7edda30c1b6571d870662af4f4a041c21888383
    launch_id: launch-oracle-1
    session: ses_f2becb916ffeF3tTLgDHphqfyZ
    result: "Bottom line: The plan outlines a solid strategy for offline support using Capacitor and Dexie.js for the Karyawan module."
---

# Draft: laundryku-android-app

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
1. PWA Setup | Manifest & next-pwa Service Worker for Android installability | active | package.json, next.config.mjs
2. Offline Storage | IndexedDB for saving forms locally while offline | active | src/app/karyawan/laundry/new
3. Background Sync API | Polling/Sync worker to push offline data to backend | active | src/app/karyawan
4. Install UI Components | Floating action or banner buttons on specific pages | active | src/app/page.tsx, login/page.tsx, karyawan/dashboard/page.tsx

## Open assumptions (announced defaults)
- Offline Storage: IndexedDB (via Dexie.js) | Most robust for relational data in browser engine (Capacitor webview). | Reversible: Hard
- Sync logic: Global network listener in Karyawan layout | Better than per-page listener. | Reversible: Yes
- Test strategy: tests-after | Agent will execute QA after implementation. | Reversible: Yes

## Findings (cited - path:lines)
- Next.js monorepo: `frontend/package.json`, React 18.
- Karyawan module path: `frontend/src/app/karyawan/`
- Current API config: `frontend/next.config.mjs` rewrites to backend.

## Decisions (with rationale)
- Framework: Native Capacitor (User preference). Requires adding Capacitor to Next.js frontend to wrap it into an APK.
- Offline Scope: Entire Karyawan module (User preference). All pages under `/karyawan/` will be cached and forms queued in IndexedDB when offline.

## Scope IN
- Install Capacitor dependencies and configuration.
- Service Worker / Workbox for caching the Karyawan UI assets.
- IndexedDB wrapper (Dexie.js) for caching data and queueing actions (e.g., new laundry entries).
- Network sync worker (sends queued actions when online).
- Install/Download APK buttons on Landing page, Dashboard, Login.

## Scope OUT (Must NOT have)
- Admin and Superadmin offline mode (out of scope, requires massive data replication).
- Real PWA manifest for browser installation (User chose Native Capacitor instead).

## Approval gate
status: awaiting-approval
next-action: write .omo/plans/laundryku-android-app.md
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->
