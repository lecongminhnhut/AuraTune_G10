# Quickstart and Validation — Feature 092 Follow Artist

**Status**: Guide for future implementation validation. No 092 endpoint, migration, test suite or application change is delivered by this planning command. [Plan](./plan.md), [decisions](./research.md#decision-register), [model](./data-model.md), [contract](./contracts/follow-artist.md).

## Prerequisites

- Remain on `090-artist-profile-studio-plan-tasks`. No branch creation/switch/merge/commit/push is part of this work. Resolve critical F01–F09 and shared 091 identity dependencies before dependent production implementation.
- Confirm supported Node/npm and test harness (F09). Current manifests do not pin Node or provide follow tests. The prior planning environment had no available Node and broken macOS Command Line Tools; verify the actual development environment rather than assume commands passed here.
- Use disposable/local database and synthetic accounts/artists. Confirm deployed catalog and reference relation mapping, authoritative follow time, public predicate and database transaction boundary (F02–F04). Existing auth migration alone does not create follows/catalog. Do not create guessed DDL or reset shared data.
- Configure existing server secrets privately: `JWT_SECRET` in production, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (legacy service key supported). Never send service-role credentials to frontend. Existing identity/session setup remains owned by auth; no new Firebase setup is required specifically for follow.
- Frontend `VITE_API_BASE_URL` defaults to `http://localhost:5000/api/v1`. Backend default 5000, frontend default 5173 and existing CORS permits development origin. Backend session checks bind user-agent; API validation sessions must preserve their originating client headers and follow existing login/refresh setup.

## Existing baseline commands

Run from repository root if dependencies need installation:

```sh
npm install
npm --prefix src/backend install
npm --prefix src/frontend install
```

Run separate terminals:

```sh
npm run dev:backend
```

```sh
npm run dev:frontend
```

Existing build/auth checks:

```sh
npm --prefix src/frontend run build
npm run test:backend
```

The root backend test is an authentication smoke script, not a Follow Artist suite. No follow-specific automated test/lint command currently exists. F09 must add agreed test entry points and record exact commands here; do not invent `npm test` or claim runtime/feature success from a frontend build. At planning time the three follow/list paths hit the server fallback, so HTTP 404 alone does not demonstrate required not-found behavior.

## Fixtures and test controls

Create fixtures through the reviewed schema/seed mechanism after F02–F04; no 092 seed command exists yet.

1. Account A and B with distinct relationships; additional current User, Artist and Admin sessions, banned account, invalid/expired/revoked session, account-switch and refresh-in-flight controls. No real personal data or committed bearer tokens.
2. Existing public artists, hidden/disabled existing artist with retained A relation and original time, a hidden artist with no A relation, deleted/unknown IDs, and an artist with missing image. Disabled definition comes from the shared public policy, not a test-only guessed flag.
3. Public follows with different authoritative instants and exact equal-instant ties; duplicate follow; successful unfollow then refollow. Include enough relationships to exceed any backend default row cap and include hidden-only/mixed lists.
4. Database/handler synchronization barriers to enforce successful processing order for two sessions/devices/workers. Include absent-pair starts and visibility/deletion races. Browser click timing alone cannot prove FR-015.
5. Definite pre-commit rejection/rollback, response dropped after commit, unknown commit result, personal list failure, reconciliation failure, delayed old reads/results and account switch during refresh replay. Fault injection belongs to disposable tests, not public production query flags.
6. If F07 approves counts, two different followers racing on one artist, duplicate/no-op/rollback cases and approved hidden/banned/deleted contribution rules; compare aggregate with authoritative relations.

## Acceptance and privacy matrix

| ID | Validation procedure / expected outcome | Coverage |
| --- | --- | --- |
| V01 — Primary follow | Sign in as A, open public artist, wait for confirmed Not following, follow, reload/relogin; exactly one relation and confirmed Following. Repeat follow: one row, original time unchanged, no new-relationship claim. | FR-001/004/005/006; US1; SC-001/004 |
| V02 — Unfollow/refollow | Unfollow public target; zero A relation and next successful list excludes it. Repeat absent public unfollow; still zero, other relations untouched. Follow again: new original time/order. | FR-002/004/006/014; US2; SC-001/004/005 |
| V03 — Role and owner isolation | User, Artist and Admin each use own capability; guest/banned/invalid session denied. Attempt owner B via body/query/path while A authenticates: no B read/write. Target artist ownership irrelevant; Admin no bypass. | FR-003/009; US4; SC-002/003 |
| V04 — Own ordered list | Distinct eligible A entries with public names, safe image fallback and artist links; B data absent. Sort time DESC then canonical ID ASC; exact ties and repeated loads deterministic. Include beyond backend cap; no false negative Following state from partial traversal. | FR-005/007/008/014; US3; SC-002/004/005 |
| V05 — Hidden retention | Follow public artist, record original time, make non-public via approved fixture; list omits without name/image/count/placeholder; old public link and follow attempt match unknown not-found. Restore public: original relation/time/order returns. | FR-007/011/013/014; US1/3; SC-003/005 |
| V06 — Hidden-owner removal | While hidden and A relationship exists, valid A DELETE removes it with no hidden metadata; no hidden interface required. Restore public: relation does not reappear. Check hidden/no-own-relation case per reviewed F05 without exposing another owner's relation. | FR-002/003/013; US2; SC-002/005 |
| V07 — Unknown/deleted | DELETE unknown and permanently deleted target: same status/code/message/data/details, no old metadata/prior-existence hint and no unrelated changes. Deleted references never appear or affect visible totals; do not assume cascade policy. | FR-007/011/016; US2/3; SC-003/005 |
| V08 — Empty versus error | Successful no-relations and hidden-only lists use same normal mockup empty state. Loading/read failure/auth denial are distinct, with appropriate retry/login; no hidden totals or fake empty success. | FR-005/007/008/009/010; US3/4; SC-003 |
| V09 — Rejection/uncertainty | Reject before commit: no storage/time/count changes, truthful error/retry. Drop response after commit: no false failure/success, reconcile authoritative state before definitive display. Failed reconciliation remains unresolved; no blind inverse/toggle or duplicate time. | FR-004/005/010/015; US4; SC-001/003/006 |
| V10 — Processing order | Execute histories below with barriers and separate sessions/workers; next successful authoritative load on both devices reflects last successfully processed operation, not click/arrival order. No failed mutation/time changes. | FR-004/010/015; US4; SC-001/006 |
| V11 — Account/refresh races | Begin A load/action, logout/login B before response; no A state/toast/list shown as B, no A desired action replayed with B token. Repeat during token refresh, same-account new session and session revocation; inspect storage as well as UI. | FR-003/009/010/012; US4; SC-002/003 |
| V12 — 091 composition | Public profile identity/sections usable while personal load/auth fails. Hidden profile result consistent with 091; follow never reveals content or grants access. Public JSON has no added personal state; artist card navigates existing profile without playback/Studio/admin. | FR-005/007/011/013; US1/3; SC-003/004 |
| V13 — Count consistency gate | Record F07 scope/disposition. If approved: compare count with approved membership predicate; actual creation/removal causes ±1, duplicate/no-op/rejection/rollback causes 0, different followers do not lose updates, no negative counts/private inference. If deferred, explicitly record unfulfilled Vision count scope; do not claim count coverage. | Current request + Vision FR-090-002; F07, no fabricated 092 FR |
| V14 — Validation/security | Direct protected API requests, malicious IDs/owner selectors, response/DOM/accessible-label/log inspection and nonshared cache tests. No token/secret/private row or hidden reasons; safe ID validation and standard envelopes. | FR-003/007/009/011/012/016; SC-002/003 |

## Deterministic concurrency histories

For each history verify row membership, authoritative original time, unrelated rows and any F07-approved aggregate. Force database processing order, allow HTTP responses to arrive reversed, then perform a fresh successful list/state load from both sessions.

| History | Required final outcome |
| --- | --- |
| Initially absent: Follow commits → Unfollow commits | Absent, both devices next load Not following for public target |
| Initially absent: Unfollow no-op completes → Follow commits | One relation with new follow time |
| Initially absent: two concurrent follows | One relation; first actual insertion time retained |
| Initially present: duplicate follow completes → opposing unfollow rejected/rolled back | One relation; original time unchanged |
| Initially present: unfollow commits → refollow commits; old delete response arrives last | One new relation/time; old response cannot overwrite authoritative state |
| A and B follow the same artist concurrently | One relation per owner; no lost aggregate increments if counts approved |
| Hide/delete races with follow/unfollow | Chosen F04 ordering has coherent shared-policy result; no follow based on stale public read, permitted hidden-owner removal, deleted-ID non-disclosure |

Use real database transaction/constraint tests; the existing 450ms browser mock cannot prove these properties. No live subscription is required: assert the next successful authoritative load, not immediate cross-device repaint.

## Measurable completion evidence

| Success criterion | Required evidence |
| --- | --- |
| SC-001 | All V01/V02/V09/V10 membership and duplicate-time assertions pass, including later session persistence |
| SC-002 | All V03/V04/V06/V11/V14 account-isolation checks pass; no other owner read/write or wrong-account attribution |
| SC-003 | V05/V07/V08/V09/V11/V12/V14: distinct operational states, equivalent required not-found results, zero false confirmations or restricted disclosure |
| SC-004 | Every primary journey: follow→own list→existing public profile→unfollow→next list, with B unchanged |
| SC-005 | V02/V04–V07: exact ordering/ties, hidden retention/restoration/original-time and no restoration after owner unfollow |
| SC-006 | All forced cross-device histories pass on next successful loads; failed writes change nothing and duplicate times stay unchanged |

Run shared browser/keyboard/responsive checks per Vision §6.3: latest two major Chrome/Edge/Firefox/Safari, widths 375–2560px and tablet breakpoints, focus-visible follow/retry/link operation and touch activation. Match mockup intent without copying unsupported shell/player behavior. Record actual query plans/latency for public artist joins under Vision's core query goal; no invented follow write SLA or usability percentage.

Review evidence should include closed decision dispositions, final OpenAPI/actual commands, synthetic fixture provenance, committed-processing histories, raw response/privacy inspection, refresh/account-race checks and independent reviewer results. Build/auth smoke alone does not establish feature compliance. Planning completes with documents and explicit gates; it does not claim these implementation tests passed.
