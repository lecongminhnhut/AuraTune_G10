# 091 — Owner decisions and design proposal

> **Latest owner approval / implementation:** The owner approved the visibility-column proposal and supplied users DDL confirming user_id primary key, separate unique id, and is_banned boolean. [Migration validation](../validation/artist-visibility-migration.md) records the new 003 migration and eight passing in-memory PostgreSQL checks. It is not applied to Supabase and does not yet implement ban/approval writers or the public API. Section 9 supersedes earlier questions about which account status column is used and whether to prepare the visibility extension.

**Date:** 2026-11-13.  
**Source:** User answers to questions 1–6 in this session.  
**Checkout observed:** `feature/cloudinary-upload`; no branch switch was performed.  
**Status:** Sections 1–2 record confirmed owner behavior. The later Q6 answer also confirms full-player selection, close-to-origin-profile, unavailable-content return and Artist link copying in section 5. Exact technical mappings and the section 4 catalog proposal remain open. No migration, endpoint or provider change is implemented by this document.

This updates the evidence in the [gate index](./gate-evidence-index.md) and [integration follow-up](../../group-090-integration-follow-up.md). The owner confirms artists exists directly in Supabase and has supplied an Artist schema image; section 8 records the visible fields. Migration capture, account FK target and physical visibility/account-status mapping are still needed; do not ask again whether artists exists.

## 1. Confirmed answers: do not ask again

| Question | Owner answer | Implementation consequence |
| --- | --- | --- |
| Q1 — First increment | Follow the proposed identity-first approach. | Start with US1: public name, optional image/biography, safe hidden/unknown outcomes, temporary error/retry and artist route lifecycle. Remaining 091 catalog stories follow later. |
| Q2 — Schema availability | Owner confirms artists was created directly in Supabase, not captured in migrations, and supplies Image #1 (artists.jpg). | Visible mapping: artist_id int8, user_id/name/biography/image_url text, created_at timestamptz. Use the real artist_id, not demo slug/id. Visibility field and actual users status/FK target are not shown. Capture the existing schema in a reviewed migration later; do not create/replace the existing table blindly. |
| Q3 — Account/profile state | account_status is active/banned; artist_visibility is public/hidden. Ban hides Artist profile. Unban leaves it hidden; republication requires Admin approval after Artist request or Admin review. | Public reads must honor current account/profile eligibility. No automatic republication, including profiles hidden manually before a ban. Exact table/column placement, keys and authorization/transaction mapping await schema. |
| Q4 — API composition | Option A: identity succeeds independently and survives featured failure. | Identity-first boundary is approved in principle; detail composition must preserve that independence. Exact serialization remains a proposal, not an approved wire schema. |
| Q5 — Catalog | Prepare a design for owner review. | Section 4 proposes source mappings, ordering, completeness and failure behavior; do not implement unreviewed mappings. |
| Q6 — Selection/handoff | Later owner answer confirms full player; closing it returns to the originating Artist profile; include unavailable-content handling and copy Artist link. | These user-visible behaviors are confirmed, not pending another vote. Preserve origin context for this profile handoff only. Technical eligibility/error/return-context integration still requires actual code/tests and mapping; catalog Q5 was not approved by this answer. |

The user has not answered the earlier Q7 about runtime/harness/governance handling. Record the open technical acceptance accurately; do not infer constitutional ratification, another person's sign-off or an approved test setup from Q1–Q6.

## 2. Confirmed account/visibility behavior

The linked Artist's account status is distinct from the current visitor's login status. Public 091 remains anonymous; a visitor's expired/banned personal session must not introduce an auth prerequisite to viewing some other public Artist.

| Initial owner account / profile | Event | Confirmed resulting state / public outcome |
| --- | --- | --- |
| active / public | Account banned | banned / hidden; profile returns the same safe not-found as an unknown Artist. |
| active / hidden (manually hidden) | Account banned | banned / hidden; ban must not make it public or erase the hidden outcome. |
| banned / hidden | Account unbanned | active / hidden; no automatic republication. |
| active / hidden | Artist requests republication or Admin begins review | Remains hidden until Admin approval. |
| active / hidden | Admin approves republication | active / public, subject to current existence and authorization. |

For 091's read predicate, **proposal for implementation review:** require profile public and, when an account is linked, that account active. This additionally prevents an inconsistent banned/public row from being disclosed while a ban write is in flight. Unlinked artists remain eligible for consideration rather than being rejected solely for no account link; actual nullable-link handling and missing-reference behavior must match the authoritative schema. If a required source/predicate cannot be evaluated because of a read error, use a temporary failure, not public-by-default or demo fallback.

**Proposed coordination, not a new 091 workflow:** account ban and profile hide should form one accepted atomic operation; unban changes only account state; approval rechecks active account/current profile and cannot race a later ban into publication. These writers belong to the existing account/Admin capabilities, coordinated with Khoa/Hoàng/Đăng. 091 implements the public read guard, not new Artist request forms, approval queues, storage states, moderation endpoints or notifications. No previous_visibility/hidden_reason column is needed merely to implement the confirmed rule that all unbanned profiles stay hidden; do not add one without a separate need/review.

## 3. Proposed identity-first API and UI design

**Review status: proposed.** Q1/Q4 settle first delivery and independence; they do not settle the following field names/types or physical mappings.

- Reuse GET `/api/v1/artists/:id` and existing `/artist/:id`; introduce no additional endpoint/query parameter. Align the [existing detail contract](../contracts/artist-profile.md) with the approved identity-first delivery before wire implementation.
- Proposed identity success uses the shared envelope, with `data` holding `id`, `name`, `imageUrl`, `biography`. Name is nonempty; optional image/bio are nullable; external ID representation and validation follow the actual canonical schema. Only these reviewed public fields are serialized, never raw joined rows or account data.
- Source resolution: actual artist key → current visibility/account eligibility → explicit public projection. Do not reuse [catalogRepository.findArtistById](../../../../src/backend/repositories/catalogRepository.js) unchanged: it selects all fields and falls back to matching demo artists when the real query returns no row or errors. A hidden real row cannot be replaced by a mock public row.
- Use dedicated credential-free native fetch with the existing API base: no access token, cookies or refresh dependency. Distinguish successful identity, safe not-found, malformed input and retryable source failure using existing 200/400/404/500 envelope vocabulary.
- Unknown/deleted/non-public Artist has identical generic 404 response. No name, image, biography, reason, existence hint or hidden counts, including direct child requests when those operations are implemented.
- ArtistPage renders public name, a real optional image with neutral failure/missing fallback, and plain-text biography with explicit missing/whitespace state. Clear old identity on route changes; abort/ignore stale results. No persistent profile cache or private account fallback.
- Identity-first delivery must not mix real identity with mock catalog rows or falsely confirmed mock follow state. Keep 092 composition separate; agree the interim page composition while implementing the approved identity slice. Do not report an unbuilt collection as successful empty data.
- In the later content increment, preserve loaded identity while featured/albums/playlists load or fail; targeted retry must not erase successful peers. Exact additive detail/featured outcome serialization is reviewed before implementing that increment, rather than inventing successful empty featured data now.

Identity tests after schema/contract/tooling closure: public/hidden/unknown, ban→hide, unban stays hidden, no republication before approval, inconsistent banned/public, linked/unlinked cases as mapped, all optional-field combinations, broken image, hostile/long biography, source outage versus not-found, malformed encoded route IDs, anonymous access and route/response races. Fixture data must use the real mapped schema, not arbitrary production records.

## 4. Proposed catalog design for Q5

**Review status: awaiting owner approval and schema mapping.** Existing FR comparator/limits remain requirements; recommendations below about nulls/collation/source mechanics are proposals.

| Surface | Proposed behavior | Schema evidence needed before implementation |
| --- | --- | --- |
| Artist–song association | Use the existing canonical attribution relation, supporting standalone songs and multiple credited artists when represented. Do not grant management ownership merely from display credit; do not force standalone songs into fabricated albums. | Actual FK/join/attribution mapping and authoritative ID types; if the complete schema has a representational gap, identify it for review rather than silently add a join table. |
| Song eligibility | Current parent eligible, song displayable/playable, not Artist-hidden, restricted or finally deleted under approved shared policy. Filter before sorting/dedup/limit; no public hidden counts. | Existing song preference/restriction/deletion and playability sources, preserving Group 110 and Player boundaries. |
| Featured songs | At most 5 distinct eligible songs: AuraTune all-time count DESC, full release date DESC, canonical song ID ASC. No Spotify popularity, count-read failure as zero or upload-date fallback. | Actual AuraTune count and release source; no inference from fixture total_plays or current date. |
| Missing ranking values | Recommend valid explicitly recorded zero stays zero; missing/unreadable count is a section error rather than an invented zero. Recommend unknown release dates sort after known dates when earlier rank values tie; do not fabricate a date. | Confirm how a legitimate zero/no-history record and an unavailable count differ; approve null ordering against existing data. |
| Albums | Return every distinct associated viewable album, including albums with no playable song; release DESC, title ASC, canonical ID ASC. | Association, full release dates and viewability source. Recommend null release last; recommend explicit Unicode code-point title order (case/diacritic sensitive) for deterministic server comparison, subject to owner approval rather than ambient localeCompare. |
| Album completeness | No product cap or added load-more requirement. Deliver the entire globally ordered eligible set, exceeding default REST/DB row caps when needed. Never present a partial traversal as complete. | Review the real query/transport and stable read boundary supported by existing DB access. A single consistent logical read is preferred; separate Supabase HTTP calls are not assumed to share a snapshot. No new RPC/cursor/paging schema chosen here. |
| Related playlists | At most 6 distinct official AND public AND viewable playlists containing any eligible Artist song, including a song outside featured five. Order updated time DESC, playlist ID ASC. | Authoritative official designation/public predicate/update field and current membership relation; Admin ownership alone is not designation. Recommend missing required update data is an explicit section failure, not a fabricated timestamp. |
| Projection/retries | Explicit card/selection fields only, no internal flags/reasons/private membership or unfiltered totals. Each failed section has its own retry; parent no longer public invalidates the whole profile. | Exact DTOs/OpenAPI examples, source-error composition and parent recheck boundaries. |

This binds to the owner's existing complete schema; it is not a request to recreate the catalog. Physical names in current fixture repositories are observations, not automatically the adopted mapping. Group 093 media upload/provider choice is not needed to read already-persisted public catalog data, but source eligibility must honor its eventual approved visibility/lifecycle writes.

## 5. Confirmed Q6 behavior and proposed integration details

**Owner confirmation:** select a song using the existing full player; close it to return to the originating Artist profile. Include neutral unavailable-content handling with a way back and copy the public Artist link. These behaviors must not be asked again. The [router](../../../../src/frontend/src/routes/AppRouter.jsx) has Artist/Album/Playlist routes but no song route. The [App playTrack wrapper](../../../../src/frontend/src/App.jsx) checks local playability, calls the player and opens full screen; closeFullScreen currently only hides the overlay, so explicit origin restoration after intervening navigation is not implemented. [songApi](../../../../src/frontend/src/services/songApi.js) can use direct audioUrl instead of the backend stream, so successful UI handoff is not proof of fresh media authorization.

1. **Song selection — confirmed destination:** reuse the existing full-player handoff rather than add `/song/:id`. Resolve current approved public song data/eligibility first; only then hand off to the player and open full screen. On close, return to the originating Artist profile for this handoff. Preserve player queue/playback ownership; closing does not introduce a new stop/pause rule. Coordinate the concrete origin/eligibility seam with Huy/Hoàng, not another vote on the selected destination.
2. **Album/playlist selection:** keep existing `/album/:id` and `/playlist/:id` navigation. Destination owners enforce current permissions, not only profile-rendered eligibility.
3. **Content disappears or becomes inaccessible:** use the same neutral content-not-found outcome for both; omit cached title/image/reason, provide an explicit return-to-origin-Artist action, and do not start a new play. For songs, use the existing player presentation/error boundary after owners review it; no invented song route or endpoint. If the parent is now hidden, returning produces the normal Artist-not-found outcome.
4. **Temporary failure:** show retryable failure distinct from content-not-found. Recheck current target before retrying; no automatic redirect/refresh or browser-back assumption.
5. **Return context — recommended:** preserve originating Artist ID/route in transient navigation/player state for this handoff only. Validate it and use an internal route, not arbitrary external return URLs. No new backend query/field, durable cache or history write.
6. **Share — recommended:** copy the canonical public Artist URL using the existing navigation origin and encoded actual ID. Show success only after clipboard completion, failure otherwise. No Web Share dialog/email/social integration; recipient is subject to current Artist visibility. Coordinate this narrower copy-only behavior with the existing share helper rather than silently change sharing elsewhere.

Items 3 and 6 correspond to the already-recorded G090-D17/D18 supplements and are included by the later Q6 answer. The close-to-origin-profile behavior is now explicit owner scope too. Record this accepted delivery scope during C12 alignment; exact technical mechanisms in items 2–6 remain design details, not an approved new schema/endpoint. Do not silently change player, album, playlist or account moderation requirements elsewhere.

## 6. What the answers unlock, and what remains pending

| Area | Evidence after this answer | Remaining work / affected tasks |
| --- | --- | --- |
| First delivery / C05 | Owner chose identity-first and independent identity success. Do not ask Q1/Q4 again. | T010 exact DTO/source examples still need actual mapping; then T011/T012/T013/T014/T015/T016/T017/T018/T019 follow their tests/predecessors. Composite featured implementation T022/T023 is not mandatory for the chosen first increment once sources/contracts are aligned. |
| C02 account/visibility policy | Owner supplied exact logical states and ban/unban/reapproval outcome. Treat this business fragment as resolved. | Actual tables/keys/predicate/join/ID validator and unlinked/missing-reference cases remain; T010/T011/T014/T015/T017. Do not conflate account_status with current is_banned/is_active fixtures. |
| C03/C07 catalog | Section 4 is the requested proposal. | Owner review + actual mappings before T020–T024/T027–T031. Accepted ranking/limits from the spec are not new product votes. |
| C12/C13 handoff/share | Owner confirms full player, close returns to originating Artist profile, unavailable-content return and Artist link copy. | Business destination/scope fragments resolved; concrete player seam, current eligibility, source/task alignment and executable T025/T026 verification remain. Not an identity-first blocker. |
| C01/C15 | Prior host runtime/build evidence exists; current frontend/backend harness scripts are now in the checkout. | Q7 disposition/setup still unconfirmed, and backend package.json currently has merge-conflict markers. Preserve the ongoing integration work; do not overwrite its manifest or claim current tests pass. T009 requires the complete accepted slice and a real harness smoke. |

No task is newly checked by recording answers. Owner-confirmed decisions are not reopened, but an implementation checkbox needs its actual code/contract/tests, not only these answers. No new schema, provider, migration, final OpenAPI, production read/write or approval workflow is selected/implemented here.

## 7. Inspection of the two supplied migrations

- [001_auth_tables.sql](../../../../src/database/migrations/001_auth_tables.sql) creates/upgrades users, oauth_links, user_sessions and password_reset_tokens. Its existing account flag is is_banned, not the owner-described account_status enum. It creates no artists table, Artist public identity fields or artist_visibility field.
- [002_listening_history_index.sql](../../../../src/database/migrations/002_listening_history_index.sql) creates only an index on public.listening_history(user_id, played_at). It assumes that table already exists and does not define its schema or any Artist/catalog tables.
- Therefore these files establish auth migration and a history index, not the complete Artist mapping needed for T010/T011. The policy is confirmed; its deployed representation and conversion from existing is_banned still need actual schema evidence. No live database was queried and no SQL was applied.
- Subsequent owner confirmation resolves the table-existence question: artists exists directly in Supabase. See section 8; these two migrations still do not capture that existing table.

## 8. Supplied Supabase Artist schema image

**Evidence:** Owner-provided Image #1, artists.jpg, supplied in this session on 2026-11-13. This is schema inspection evidence from the owner, not a live database query or migration execution.

| Visible database field | Visible type | Proposed safe identity mapping / use |
| --- | --- | --- |
| artist_id | int8 | Canonical Artist key; image shows key indicator. Proposed wire id is a decimal string so a PostgreSQL int8 cannot lose precision through JavaScript Number. Ensure lossless DB transport too; converting an already-rounded JSON number to string is insufficient. Exact fetch projection still requires implementation verification. |
| user_id | text | Linked-account reference for current eligibility; do not expose it as a public identity field. Actual FK target (users.id vs users.user_id), uniqueness and optionality must be read from DDL rather than guessed from diagram lines/icons. |
| name | text | Public name; proposed wire name. Missing-name data treatment/constraint confirmed from DDL, not private account fallback. |
| biography | text | Public biography; proposed wire biography, optional-field handling preserved. |
| image_url | text | Public image; proposed wire imageUrl, neutral missing/broken-image fallback. |
| created_at | timestamptz | Internal creation timestamp; not a song release date or an automatically public identity field. |

The six visible rows contain no artist_visibility or equivalent explicit public/hidden field. The name/type/ID mapping fragment of C02 is now supported; the full public predicate is not. The supplied image does not establish defaults, identity generation, nullability, check constraints, FK target/actions, unique indexes, grants/RLS or deployed state of related tables.

Two remaining physical-mapping questions, not a reopening of the approved behavior:

1. Is artist_visibility stored elsewhere, or has it not yet been added? If absent, propose a reviewed extension to the existing artists table with public/hidden, a safe hidden default for new records, and an explicitly reviewed treatment of existing rows. No automatic backfill/publication or ALTER TABLE is selected/executed here.
2. Does the deployed users table contain account_status, or is is_banned from 001_auth_tables.sql still the actual account-state field? Obtain its relevant nonsecret DDL/schema plus the exact artists.user_id FK target. Map the approved active/banned rule to the existing source; do not introduce two competing account-state authorities.

Do not change the existing Supabase table or generate final OpenAPI/production queries until those sources are clear. No credentials, user records or real tokens are required to answer these schema questions. The owner-confirmed identity-first, ban/unban and full-player/copy-link decisions remain unchanged.

## 9. Visibility approval, supplied users DDL and prepared migration

The later owner answer approves the visibility-column proposal and supplies the actual public.users DDL. Do not ask again whether to add visibility or which account status source to use. The deployed mapping supplied is:

- users.user_id: text NOT NULL, primary key; a duplicate unique users_user_id_unique_idx also exists.
- users.id: text NOT NULL, separate users_id_unique_idx, not the declared primary key. Values are not assumed identical to user_id for existing accounts.
- users.is_banned: boolean NOT NULL DEFAULT false; this is the existing account authority. Logical active means false, banned means true; do not introduce account_status alongside it.
- Name/email are NOT NULL, email unique, role constrained to user/artist/admin. Optional display_name/avatar_url remain account fields, never a fallback public Artist identity source.

[003_artist_visibility.sql](../../../../src/database/migrations/003_artist_visibility.sql) now implements the approved column/default/check extension. It intentionally leaves old rows NULL/unreviewed and defaults only new omitted values to hidden. No existing Artist row is backfilled/publicized. A new public resolver must exclude NULL, so existing rows need review before rollout. The supplied users DDL does not itself declare artists.user_id's FK target; no FK/account/key change or ban trigger is guessed in this migration.

[SQL validation](../validation/artist-visibility-migration.md): eight in-memory PostgreSQL checks passed. No SQL was applied to Supabase; its existing Artist table still needs the migration deployed through the normal process. This prepares one concrete authorized schema increment, not all of T009–T019. Public API/wire integration and ban/unban/Admin publication synchronization remain separate implementation and verification work. No existing task checkbox is newly marked complete.

## Accepted identity implementation update — 2026-11-13

The owner explicitly confirmed `artists.user_id → users.user_id` and accepted the remaining proposed identity design/tooling choices. Do not reopen these questions. Existing `users.is_banned` is the account authority; unlinked explicitly public Artists qualify; ban/unban persist hidden; old visibility NULL remains unreviewed. Identity-only anonymous GET returns exactly id/name/imageUrl/biography, with bigint as string before JSON. These confirmations authorize the slice without claiming team Constitution ratification.

[Implementation, commands, results and deployment limits](../validation/us1-results.md) replace earlier missing-evidence conclusions for identity only. T009–T019 are implemented/tested in the scoped delivery; C02/C05/C15 identity evidence is present. C03/C07 catalog and broader cross-feature gates remain open. Source code uses a backend-only filtered SQL view plus account/publication triggers; 003/004 have not been applied remotely. No Admin approval endpoint or workflow is claimed. Full-player selection still awaits catalog integration; copy Artist link is implemented.
