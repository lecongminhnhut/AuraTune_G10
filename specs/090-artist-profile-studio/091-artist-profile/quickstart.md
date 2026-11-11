# Quickstart and Validation — Feature 091 Artist Profile

**Purpose**: Future implementation validation guide. Planning has created no artist backend routes, catalog schema or automated tests. The commands below start existing services; they do not prove 091 is implemented. [Plan](./plan.md), [decisions](./research.md#unresolved-decisions-and-implementation-gates), [contract](./contracts/artist-profile.md).

## Prerequisites and safe setup

1. Keep branch `090-artist-profile-studio-plan-tasks`; create/switch/push no branches for this work. Review D01–D09 before implementing the dependent boundaries.
2. Confirm supported Node/npm runtime and shared test harness (D08). Node is not pinned; the planning environment lacks an available Node executable and has broken macOS Command Line Tools. Restore the development environment before running application commands.
3. Use a local/disposable catalog with the reviewed schema and fixtures. The existing auth migration does not create artist/song/album/playlist tables. Do not apply invented catalog DDL or reset a shared database. Existing backend Supabase settings are `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (legacy service key supported by current client); configure server-side only. Never put service credentials in a `VITE_*` variable.
4. Existing frontend base setting is `VITE_API_BASE_URL`, default `http://localhost:5000/api/v1`; Vite dev server defaults to 5173. Backend defaults to 5000 and allows this frontend development origin. Firebase credentials belong to existing authentication setup, not anonymous profile prerequisites. No secrets or real account/catalog data in fixtures.
5. Resolve D06/D07 to obtain exact response schemas and fixture setup through the reviewed catalog mechanism. No seed command exists for 091 yet.

From repository root, install existing dependencies when needed:

```sh
npm install
npm --prefix src/backend install
npm --prefix src/frontend install
```

Run in separate terminals:

```sh
npm run dev:backend
```

```sh
npm run dev:frontend
```

Build the existing frontend:

```sh
npm --prefix src/frontend run build
```

Root `npm run test:backend` runs existing authentication smoke checks and requires the backend; it is not a 091 suite. No `npm test`, lint, typecheck or artist E2E command is currently defined. After D08, add approved test entry points and record exact commands here. Do not mark feature validation passed on a build or auth smoke result alone.

## Fixture matrix (through the approved catalog schema)

Use synthetic public names/content and persistent, known canonical IDs; fixture labels below are conceptual, not literal database keys.

- Public artist with name/image/bio and eligible songs/albums/playlists; public artists missing image, bio and both, including whitespace-only/long biography and broken image URL.
- Nonexistent/deleted/non-public/disabled artist cases, wrong entity type and malformed identifier. Define disabled predicate via D02, not a new fixture-only flag.
- More than five eligible songs plus higher-ranked hidden/private/removed/unplayable candidates. Include ties in count and release date, valid zero counts, duplicate/stale associations, albumless and multiple-artist cases per D03. Missing rank values follow resolved D05 policy.
- More albums than the backend's default row cap, including equal release date, equal title, final ID ties, hidden albums, and a viewable album with no eligible songs. All eligible albums must remain reachable in the profile collection.
- More than six qualifying playlists plus public nonofficial, private/shared official, official public with only hidden songs, duplicate memberships and deleted references. Include one playlist whose sole eligible artist song ranks below featured five, and one that loses its last eligible association.
- Independent failures for featured, albums and playlists; multiple failures; identity-only failure; slow responses, out-of-order route requests and overlapping retries. Fault injection stays in disposable/test infrastructure, not a public production query switch.

## Validation scenarios and acceptance evidence

| ID | Steps / assertions | Requirement coverage |
| --- | --- | --- |
| V01 — Public identity | Open `/artist/<public-id>` anonymously and as signed-in roles; public identity/sections accessible without auth hydration or refresh. Missing/broken image gives neutral fallback; missing/whitespace bio explicit; long/untrusted text remains safe and usable. | FR-001–006, FR-023; US1 |
| V02 — Parent privacy | Call all four artist GET paths directly for unknown/deleted/non-public/disabled IDs. Confirm same 404/code/message/data/details, no name/image/bio/content/existence/reason. Test malformed ID safely. No role bypasses public viewability. | FR-006–008, FR-018/018A; US1 |
| V03 — Featured selection | Randomize candidate order; verify eligible distinct top five using count DESC, release DESC, ID ASC, including zero. Hidden/unplayable high-count candidates cannot consume the limit. No external data call/count source or ineligible substitutes. | FR-007–010B, FR-022, FR-027; US2 |
| V04 — Complete albums | Verify every eligible album, including beyond default row cap, exactly once; date DESC, title ASC, ID ASC under approved collation. Public album with no playable song follows album policy, not an invented featured-song rule. Test transport failure mid-traversal without falsely claiming completeness. | FR-007/008, FR-011/012, FR-022; US2 |
| V05 — Related playlists | Exactly official/public/qualifying playlists, ≤6; update DESC, ID ASC. Nonfeatured qualifying song counts; private/shared/nonofficial or hidden-only memberships fail. Dedup before limit. Losing last eligible song removes playlist on next successful read. | FR-007/008, FR-013/014/014A, FR-022, FR-027; US3 |
| V06 — Empty combinations | Test all 8 combinations of empty/nonempty songs/albums/playlists with successful identity. Each successful empty section has specific copy; others usable. All-ineligible and genuinely empty look the same; no hidden counts/placeholders/substitutes. | FR-008, FR-017, FR-027; US2/3 |
| V07 — Failure/recovery | Inject each of 7 nonempty combinations of failed/successful content sections. Identity and successful peers persist. Errors differ from empty; retry only failed content and recover on same route. Identity failure has full retry and differs from not-found. | FR-019–021; US4 |
| V08 — Race/revocation | Navigate A→B before A resolves; overlap retries; late A/old results ignored. Hide parent then retry a child: entire profile clears; stale successes cannot restore it. Hide/delete content then select: destination enforces current eligibility and cannot expose cached restricted data. | FR-006–008, FR-018/018A, FR-020/021; edge cases |
| V09 — Navigation/scope | Select each content kind; verify approved existing destination (song after D09), no profile-owned playback redesign. 091 presentation/service has no follow, Studio, edit or admin actions; existing 092 owner composition remains independent. GETs never write relationships/history/counters. | FR-015/016, FR-024–026; US2/3 |
| V10 — Access/inference | Inspect raw JSON, DOM, alt/accessibility text, labels/counts, error payloads and client logs, not only visible rows. Test direct child requests, service-role authorization, malicious ID/text, and fresh anonymous context with no cookies/tokens. No raw account/management data. | FR-006–008, FR-018A, FR-023 |

Suffix IDs above are literal 091 FR IDs; ranges include only the applicable feature requirements. D05-dependent null/collation/ID tests are required once policy is recorded; they must not create new product defaults.

HTTP smoke commands after backend implementation (replace ID with a fixture ID; no credentials required):

```sh
curl -i http://localhost:5000/api/v1/artists/PUBLIC_FIXTURE_ID
curl -i http://localhost:5000/api/v1/artists/PUBLIC_FIXTURE_ID/songs
curl -i http://localhost:5000/api/v1/artists/PUBLIC_FIXTURE_ID/albums
curl -i http://localhost:5000/api/v1/artists/PUBLIC_FIXTURE_ID/playlists
```

Repeat with unknown and non-public fixture IDs, comparing envelopes. Validate successful payloads against the D06-approved OpenAPI before asserting exact JSON fields. At planning time these artist paths hit the existing generic fallback and do not demonstrate compliance.

## Success criteria measurements

| Spec criterion | Evidence to collect |
| --- | --- |
| SC-001 | First-attempt usability tasks: ≥95% identify name and locate biography/missing state. Record participant count, successes and denominator. |
| SC-002 | Selection tasks for song/album/playlist: ≥90% reach intended existing destination without assistance; record destination and failures. |
| SC-003 | 100% privacy fixtures pass V02/V03/V04/V05/V08/V10, including raw-response and inference checks. |
| SC-004 | All 8 successful empty-content combinations pass V06. |
| SC-005 | All 7 content-failure combinations plus identity failure pass V07; successful sections remain usable. |
| SC-006 | Record request-to-identity/definitive-not-found timing on agreed normal dataset/network; ≥95% ≤2 seconds. Include slow/failing content to prove identity independence; document warm/cold conditions rather than dropping slow samples silently. |
| SC-007 | ≥90% distinguish temporary failure from artist-not-found in usability tasks; record sample/denominator. |
| SC-008 | All acceptance selections pass V09 scope/no-management assertions. |

Also measure real metadata/profile query p95 <100 ms per Vision §6.1; inspect actual query plans and approved indexes. Shared Vision browser parity/accessibility validation covers latest two major Chrome/Edge/Firefox/Safari releases and responsive widths 375–2560px, including tablet breakpoints, keyboard focus and retry/link operation. Do not add player controls or require voice/media features to prove profile accessibility.

## Review completion record

Implementation review must attach schema/decision closures, approved OpenAPI, actual test commands/results, fixture provenance, ordering/completeness assertions, privacy/fault-injection results, browser/responsive observations and usability/performance denominators. Planning does not claim those implementation outcomes.

Planning scope checks: five generated artifacts, no `tasks.md`, unchanged existing specs/checklist/source, same branch reference and no extension hooks. Re-run the Constitution/decision gates after shared resolutions. No application code, secrets, branch operations or deployment is part of this command.
