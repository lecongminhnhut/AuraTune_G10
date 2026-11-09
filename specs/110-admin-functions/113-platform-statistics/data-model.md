# Data Model and Metric Dictionary — Feature 113

**Date**: 2026-11-09 | **Performed by**: Codex | **Reviewed by**: Not assigned; pending | **Edited by**: Codex

**Status**: Logical read model for review, **not** approved DDL, API fields or deployment. [Research decisions](./research.md#decision-register) gate exact mappings. [Spec](./spec.md), [plan](./plan.md), [contract](./contracts/platform-statistics.md).

## Existing physical evidence

| Source | Established fields/relationships | Limit |
| --- | --- | --- |
| [Auth migration](../../../src/database/migrations/001_auth_tables.sql) | users.id primary key, unique user_id, role, is_banned, lockout_until; OAuth links/session records reference id. | Does not define all removed/disabled lifecycle predicates or a production metric source. role has no enum CHECK here. Do not count login methods/sessions. |
| [Reference ERD](../../../docs/design/database/er-diagram.md), [DB description](../../../docs/design/database/README.md) | users.user_id, artists.artist_id with optional unique linked user; albums.artist_id; songs.album_id; listening_history.history_id with user/song references; song total_plays and user_listening_stats described. | Not executable/deployed migration; nullable history links, no ON DELETE policy, no confirmed artist visibility/moderation/terminal-deletion/source-invalidity/demo-attribution fields. No hypothetical columns added here. |
| [071 spec](../../070-listening-history/071-listening-history/spec.md) | Producer requirement includes user_id/song_id/played_at, qualification and history lifecycle. | Its logical is_hidden/event design is not proof of deployed mapping or sufficient event-time validity evidence. Exact source contract P05/P06. |
| [Browser store](../../../src/frontend/src/context/AppStore.jsx) | Mock users/artists/tracks/local histories, statuses and System state. | Not canonical schema, durable history, valid zero evidence or platform authority. |

No new statistics table/entity persistence, mutation counter, invalid-event flag, cache, event archive, provider or aggregation job is selected.

## Logical entities and relationships

These names describe concepts, **not wire keys**.

- **Current Admin principal**: Authenticated AuraTune account plus valid session and current backend Admin role. May read minimal aggregates; may not receive private source rows.
- **Account membership**: Current extant account identity, independent of login methods, Artist-profile linkage, follows or session count. Canonical id/user_id mapping requires P03.
- **Artist identity**: Artist record, optionally linked to an account; public-profile visibility is independent of account role/ban and individual track visibility. Role artist does not prove a linked/public profile.
- **Catalog track**: Canonical track membership and identity, with independent Artist preference, Admin restriction and terminal lifecycle once mapped by shared contracts. Album relations must not multiply counts.
- **Recorded listening event**: Retained source event, with valid user/song references at recording time, source-provided identity and invalidity semantics. Current entity eligibility must not be substituted for historical validity.
- **Metric result**: Exact trusted aggregate and successful calculation instant, or unavailable without a fabricated value. This is transient server/UI projection, not a new database row.
- **Overview load**: One open/manual refresh calculation generation. Per-metric successful instants can differ under accepted P08 consistency; results from separate generations cannot be merged.
- **System capability context**: Conditional FR-021 controls governed by P02/P11. No settings record or backend-reset entity presumed.

## Metric dictionary

M1–M4/H1–H4 are **document-local labels**, not API field names or approved additional KPIs. M2/M3 and all hints remain explicitly covered FR-002 requirements subject to P02 scope alignment. No fifth card or unrelated metric is added.

### M1 — Total Users

- **Business definition**: Distinct AuraTune accounts currently existing at calculation, once per canonical user identity. FR-003.
- **Inclusions**: All roles user/artist/admin; banned/locked/disabled if already represented; extant demo/test accounts; account without Artist record; account with multiple login methods counted once.
- **Exclusions**: Guests/unregistered identities and accounts removed under the accepted existing lifecycle. No “active-only” interpretation or lifetime registrations.
- **Source/logic**: Complete authoritative account membership count with accepted removal predicate; avoid joining OAuth links/sessions/artists/follows. id/user_id mapping and actual source P03.
- **Time/freshness**: Current membership at successful calculation on open/manual refresh, no time filter. Server calculation instant, not created_at or render time.
- **Lifecycle**: Ban/unban or ordinary role change does not alter existence/count. No ban→profile hide or ownership/follow cascade. Deletion affects current membership only under approved lifecycle.
- **Security/consistency/performance**: Current Admin only; exact scalar aggregate, no account directory. Registration/removal concurrent-read semantics P08; full-source count/precision P12.
- **Missing dependencies**: P03/P07/P08/P09/P12. True no-account source is 0; missing/untrusted account source unavailable.

### H1 — Locked-account hint

- **Requirement**: FR-002/November user-card hint, not a new user-management capability.
- **Definition gap**: “Locked” may mean Admin is_banned versus temporary auth lockout_until; mock user.banned is not sufficient source precedence. Do not union/add categories without approval.
- **Source/aggregation**: Accepted subset of current accounts by accepted source predicate, distinct account identity; overlapping reasons must not duplicate. P04 must define inclusion of removed/disabled/temporary-lock cases.
- **Time/lifecycle**: Current count at accepted calculation boundary; ban/unban may change hint while total users remains unchanged. No date window.
- **Auth/availability/performance**: Admin-only aggregate; no identifiers or ban reasons. Exact independent hint failure/timestamp/parent-result behavior P07/P08. No fake 0 when unavailable.
- **Gates**: P02/P03/P04/P07–P09/P12.

### M2 — Total public Artists

- **Requirement/definition**: November clarification says public Artist **records**, not all Artist-role accounts. FR-002 abbreviated label must be aligned through P02/P04.
- **Inclusion/exclusion**: Count each authoritative currently public Artist identity once. Hidden profiles are not public. Exact terminal/missing-profile predicate and any account-linked lifecycle dependency require accepted shared eligibility; do not add ban exclusion.
- **Source/logic**: Complete Artist source/public-profile predicate, independent of linked-account role and number of songs/albums/follows. Do not count joined track rows or use Artist-role account count.
- **Time/freshness**: Current visibility at calculation, no time range; successful instant per accepted metric result.
- **Lifecycle**: Track hide/delete/moderation does not itself hide the Artist profile or require decrement. Account ban is separate unless authoritative policy connects it. An Artist with no linked user is not automatically invalid under reference optional linkage.
- **Auth/consistency/performance**: Admin-only aggregate; does not change anonymous 091 endpoint policy. Atomic visibility reads/shared identity P04/P08; complete count P12.
- **Gates**: P02/P03/P04/P07–P09/P12/P13. No deployed Artist schema/public flag approved here.

### H2 — Artist-role account hint

- **Definition**: Accounts with current Artist role, a different universe from M2 public profiles. Exact membership/removal/ban inclusions must be accepted under P04, aligned with M1 rather than inferred from local arrays.
- **Source/logic**: Canonical current accounts/accepted role vocabulary; each account once, no profile prerequisite or automatic Artist-record creation.
- **Time/lifecycle**: Current role at calculation; role changes can change hint, not total users, ownership or follow membership. No time range.
- **Auth/availability/performance**: Admin-only count, no user details. P07 defines whether hint can be unavailable with trusted parent card and its calculation timestamp representation. Complete exact count.
- **Gates**: P02/P03/P04/P07–P09/P12.

### M3 — Total Tracks

- **Requirement/definition gap**: FR-002 requires inventory count, not an approved formula for public/playable-only versus all retained/non-deleted tracks. Mock tracks.length cannot choose that policy.
- **Required source/rules**: Canonical song identity, actual catalog membership, accepted Artist-hidden/Admin-restricted/removed/terminal-deleted mapping. Decide whether retained removed/tombstoned items are inventory and how missing metadata affects trust, without creating states.
- **Aggregation**: Count each eligible canonical track once after accepted inventory predicate; album/artist/playlist joins cannot multiply rows. Do not apply 091 public ranking predicate by default.
- **Time/lifecycle**: Current inventory at calculation. Metadata edits do not create tracks; visibility/restriction changes affect inventory only as accepted. Terminal deletion is independent from retained historical plays.
- **Auth/consistency/performance**: Admin-only aggregate may differ from publicly visible inventory; no hidden metadata disclosure. Concurrent upload/delete/moderation P08/shared 112 decisions, complete count P12.
- **Gates**: P02/P04/P07–P09/P12/P13; exact current eligibility missing, never guessed.

### H3 — Hidden/removed-track hint

- **Requirement/definition gap**: FR-002 requires hint; artist self-hide, Admin restriction, reversible removed and terminal deleted must not be collapsed without accepted mapping.
- **Source/aggregation**: Accepted distinct-track subset/union of inventory or accepted broader membership. A track both Artist-hidden and Admin-restricted counts once where union is intended; exact denominator, overlap and terminal deletion inclusion require P04.
- **Time/lifecycle**: Current state at successful calculation, no date range; Artist restore cannot override Admin restriction; no restoration of terminal-deleted content. No mutation triggered by counting.
- **Auth/availability/performance**: Admin-only aggregate, no titles/owners/reasons. Parent/hint failure and timestamp behavior P07/P08, no partial count on source conflicts.
- **Gates**: P02/P04/P07–P09/P12 and shared 112 M02/M03/M04/M07/M09.

### M4 — Total Plays

- **Business definition**: Count distinct valid recorded listening events retained in the authoritative source up to calculation. Valid user/song references **at event time**, not subsequently marked invalid under source semantics. FR-004/015.
- **Inclusions**: Separate valid repeat events, even same user/song/time; historical valid retained events despite later user ban/removal, artist/track hide, moderation or song deletion. No current public-catalog inner join.
- **Exclusions/deduplication**: Source-known invalid events and duplicate identity only under an existing source-level event identity/rule. Never invent session IDs, time-bucket/user-song deduplication, completion thresholds or invalid flags.
- **Producer dependency**: 071 requires 30 seconds/short-track >=90% qualification. 113 consumes accepted valid records; it does not create a parallel qualification rule, backfill legacy records by guess or treat browser play starts as valid producer output.
- **Aggregation source**: listening_history only. No sum/add/sync of songs.total_plays, seeded playCount, private-user stats, frontend library lengths or stream requests. Event-ID names in ERD do not establish deployed retry identity.
- **Time/freshness**: All valid **retained** events, not lifetime before purge; no date selector/new 365-day filter in 113. Source retention applies through actual source lifecycle, not an invented statistics job.
- **Lifecycle**: Distinguish later entity visibility/deletion from legitimate source purge/clear. P06 aligns 071 purge/clear with 112 preservation. If required identifiers are lost/conflicted and trust cannot be established, result unavailable, not joined-away subtotal/reconstruction/zero.
- **Auth/consistency/performance**: Current Admin scalar only; no personal events. Concurrent insert/retry/purge/read boundary P05/P08; full exact source aggregation/precision P12.
- **Gates**: P05/P06/P07/P08/P09/P12/P13. Zero is valid only after trustworthy complete calculation with no valid retained events.

### H4 — Demo-play hint

- **Requirement/definition gap**: FR-002/November requires demo hint; source does not establish durable demo attribution, relation to valid retained history or whether a separate demo mode is intended.
- **Source/aggregation**: P04/P05 must identify an existing authoritative classification or obtain an approved design. Do not invent a demo flag/event table or count browser-local history as platform activity.
- **Total relationship**: Never add the hint to M4 merely because mock does so. If accepted as subset, no duplicate addition; any alternative conflicting with FR-004 requires explicit source disposition.
- **Time/lifecycle**: Same accepted retained-history/source lifecycle; resetDemo must not erase authoritative platform history by inference. Hint-specific current snapshot/timestamp behavior P07/P08.
- **Auth/availability/performance**: Admin-only aggregate; no personal/demo-user history. No source means unresolved/unavailable under accepted scope, not synthetic zero.
- **Gates**: P02/P04/P05/P06/P07/P08/P11/P12.

## Result validation and UI states

These are semantic states, not an approved enum or response schema.

| Condition | Required representation / transition |
| --- | --- |
| First open/manual refresh | New calculation generation; loading, no old value presented as current. |
| Complete trusted empty source | M1/M4 show valid 0 with successful calculation time. Expanded metrics require accepted definitions. |
| Complete trusted nonzero | Exact nonnegative count with successful calculation time; no loss of integer precision. |
| Missing source/data contract, invalidity/identity conflict, truncated query, store failure | Affected metric unavailable, no value/partial subtotal; no fabricated successful timestamp. |
| One independent source fails | Trusted peer results for this generation remain with own timestamps; affected metrics unavailable. |
| Shared source fails/all unavailable | Whole overview truthfully unavailable/failure under accepted P07 envelope; no generic false success or 0. |
| Refresh fails after earlier success | Old numbers/hints do not remain as current; retry available. Do not borrow Studio stale-portion policy. |
| Session expires/current Admin lost/account replaced | Withhold all values/hints/timestamps, reject late responses, prevent cross-origin-session replay. |
| Earlier load completes after newer load | Reject earlier result; never merge generations. |

Successful calculation instants originate server-side at the accepted P08 read/calculation boundary. Format Asia/Ho_Chi_Minh (UTC+7) at presentation; do not substitute browser time or account/event timestamps. Exact serialization/clock precision/count encoding/hint timestamps await P07/P08. No automatic polling or backend aggregate cache policy introduced.

## Lifecycle and consistency matrix

| Event | M1 current users | Catalog/role hints | M4 historical retained valid plays |
| --- | --- | --- | --- |
| User ban/unban | Existing account remains counted | H1 only under accepted definition; no automatic profile visibility cascade | Prior valid events remain |
| Role change | Still one account | H2 may change; M2/ownership/follows independent | Prior valid events remain |
| Artist profile hidden | No account-count change | M2 public membership changes under approved predicate; individual track semantics separate | Prior valid events remain |
| Artist track hide/restore or Admin restrict/unrestrict | No account-count change | M3/H3 accepted inventory rules; layers independent | Prior valid events remain |
| Track terminal deletion | No account-count change | M3/H3 deletion predicate needs approval; no resurrection | Valid history preserved; lost required IDs => unavailable |
| Account removal | Excluded if removed by accepted lifecycle | Profile/track/follow consequences require own policies | Preserved retained valid events; no current-user join filter |
| 071 clear/purge | No account-count change | No invented catalog effects | Source lifecycle P06; no guaranteed lifetime total or secret archive |
| Demo reset/AI toggle | No backend source change authorized by mock | P02/P11 controls scope unresolved | No authoritative history reset authorized by inference |

Counting never writes roles, bans, profiles, tracks, follows, history or counters. Authorization/read consistency and lifecycle evidence are needed before exact queries, not postponed inside implementation.

