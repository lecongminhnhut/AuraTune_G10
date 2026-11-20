# 091 gate evidence index and review package

> **Approved visibility increment prepared:** Owner approved the extension and supplied users DDL: user_id is the primary key; id has a separate unique index; is_banned is the actual account-state flag. [003 migration and eight passing PostgreSQL checks](../validation/artist-visibility-migration.md) implement hidden by default for new Artists and preserve legacy rows as NULL/unreviewed. No account_status column or Artist table recreation. Not deployed to Supabase; no ban/approval trigger, public API or full GATED task is claimed complete. [Current mapping record](./owner-decisions-and-design-proposal.md#9-visibility-approval-supplied-users-ddl-and-prepared-migration) supersedes earlier status-column questions.

> **Supabase schema image received:** Owner confirms artists exists directly in Supabase, outside migrations. [Visible field mapping](./owner-decisions-and-design-proposal.md#8-supplied-supabase-artist-schema-image): artist_id int8, user_id/name/biography/image_url text, created_at timestamptz. C02 identity names/types are partially evidenced; physical visibility/account-status source and account FK target remain unresolved. Do not ask again whether the Artist table exists or reuse mock slugs. No implementation checkbox is completed by the image.

> **Latest Q2/Q6 clarification:** The owner supplied the two migration paths and confirmed full-player selection, closing back to the originating Artist profile, unavailable-content return and Artist link copying. [Inspection and updated decisions](./owner-decisions-and-design-proposal.md#7-inspection-of-the-two-supplied-migrations): 001 defines auth only (is_banned), 002 only adds a history index; neither supplies Artist identity/visibility DDL. C13 destination/C12 business-scope fragments are resolved by the owner; technical mapping, alignment and tests remain. No implementation task is marked complete.

> **Owner answers — 2026-11-13:** [Confirmed decisions and requested design proposal](./owner-decisions-and-design-proposal.md) record identity-first delivery (Q1), independent identity success (Q4 A), complete schema reported by owner (Q2; authoritative location/DDL pending), and the resolved account_status/artist_visibility ban→hidden, unban→still hidden, Admin-approved republication rule (Q3). Do not ask those business questions again. Catalog and navigation/share designs are proposed for review, not approved. Current physical mappings/exact wire examples/tooling evidence still gate implementation; no task is newly completed.

> **Follow-up:** [Host runtime, baseline runs, local integration refs and concrete identity-slice decisions](../../group-090-integration-follow-up.md) supersede the initial sandbox runtime inference. Node 26.13.0/npm 11.20.0 and frontend build are verified outside sandbox. Auth smoke has four failed checks despite exit 0. Main/Player provide reusable Node/JSX harness evidence; accepted Group 090 source/contracts/tooling closure remains incomplete. No additional GATED task is complete.

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

**Disposition:** 8 READY deliverables prepared; 34 GATED tasks examined individually below, none eligible to execute. No reviewed/accepted closure evidence was found for C01 or the applicable technical gates. Reviewer: not yet assigned/accepted; audit author does not self-approve. Date of review acceptance: pending. This checked-in package is available for team review; no message/PR was sent.

## Preparation dependency completion

T001 source ledger precedes independent case/audit tasks, then this index. Shared evidence reused by reference: [canonical/catalog audit](../../091-artist-profile/preparation/catalog-source-audit.md), [runtime audit](../../091-artist-profile/preparation/tooling-audit.md), [session replay audit](../../092-follow-artist/preparation/session-replay-audit.md), [actual media inventory](../../093-artist-track-management/preparation/media-and-recovery-options.md). Existing code is evidence of capability presence, not a recorded architecture acceptance.

| Task | Deliverable |
| --- | --- |
| T001 | [source-and-scope-ledger.md](./source-and-scope-ledger.md) |
| T002 | [public-policy-cases.md](./public-policy-cases.md) |
| T003 | [ordering-and-completeness-cases.md](./ordering-and-completeness-cases.md) |
| T004 | [public-interface-options.md](./public-interface-options.md) |
| T005 | [catalog-source-audit.md](./catalog-source-audit.md) |
| T006 | [song-navigation-audit.md](./song-navigation-audit.md) |
| T007 | [tooling-audit.md](./tooling-audit.md) |

## Original decision trace (unchanged register)

The following rows retain original register IDs, responsibilities and closure conditions. They remain OPEN for technical acceptance. Supporting evidence is in the preparation rows above and cluster table below; no owner decision is fabricated.

| ID | Original gap | Existing coordination roles | Required closure evidence |
| --- | --- | --- | --- |
| D01 | Constitution is unratified template | Nhựt/team | Ratified principles or recorded governance disposition; blocks constitutional sign-off, not permission to rewrite it here. |
| D02 | Actual catalog schema/provider, canonical IDs, public artist/album/song predicates, hidden/disabled meaning, account-ban relationship, public fields | Đăng + Hoàng; Khoa for account policy | Reviewed schema/migration and policy mapping including unknown/missing state. Blocks repository queries, ID validation and DTO projection. No assumption that banned account means disabled artist. |
| D03 | Standalone/multiple-artist song association versus album-only reference ER | Đăng + Hoàng | Approved association source covering albumless/collaborative tracks and stale references. Blocks complete songs/playlists. No invented join table, direct artist column or forced album creation. |
| D04 | Official/public playlist evidence and update timestamp | Khoa + Hoàng + Đăng | Confirm authoritative designation, public status and update field semantics. Admin creation path/owner role alone does not prove official designation. Blocks related-playlist query. |
| D05 | Canonical all-time counts, song release dates, null rules, title collation and typed ID comparison | Khoa/history + Đăng + Hoàng | Map documented `total_plays` to real count source; agree release-date source and missing-data handling. Confirm numeric versus string ID ordering and title collation across DB/API. No zero/date-now/album-date fallback silently invented. Blocks faithful ranking on incomplete records. |
| D06 | Public wire DTOs and identity/featured partial-failure/retry contract | Hoàng + foundation owner + Đăng | Reviewed fields/examples within existing paths/envelope, exact child semantics, anonymous request mode. Demonstrate identity success when featured fails and targeted recovery. Blocks controller/adapter integration and final OpenAPI. |
| D07 | All albums versus database row caps/payload/pagination | Đăng + Hoàng | Approved complete response or traversal with stable order, no hidden totals and demonstrable completeness. Partial list cannot be represented as complete/empty. Blocks complete-discography acceptance. |
| D08 | Node runtime and executable test harness absent | Nhựt/foundation owner + Hoàng | Supported runtime, shared runner/scripts/layout. Blocks executable automated test commands, not scenario design. |
| D09 | Existing selected-song destination | Huy + Hoàng | Confirm existing full-player handoff satisfies navigation or identify approved destination. No song route exists; share URLs alone do not settle this. Blocks song-selection acceptance. |

## Cluster closure and direct task impact

Every implementation/test task also inherits C01 through its foundation dependencies. “Direct tasks” below lists explicit gate mentions; dependent descendants remain blocked too. These are per-feature slices: unrelated media/playlist choices are not blanket prerequisites for public identity or follows.

| Cluster | Responsibility | Evidence missing / decision to settle | Direct tasks in this feature | Acceptance |
| --- | --- | --- | --- | --- |
| C01 | Nhựt/team | Template constitution remains unratified; require recorded governance disposition/ratification. | T009, T010, T011, T012, T013, T014, T015, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032, T033, T034, T035, T036, T037, T038, T039, T040, T041, T042 | OPEN; reviewer/date pending |
| C02 | Hoàng/Đăng; Khoa account policy | Actual canonical account↔artist/owner IDs, validator, public/hidden/disabled/ban predicates and safe projections with representative eligible/ineligible records. | T010, T011, T012, T013, T014, T015, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032, T033, T034, T035, T036, T037, T038, T039, T040, T041, T042 | OPEN; reviewer/date pending |
| C03 | Đăng/Hoàng; Khoa history | Actual catalog/association/genre/duration/rights/media/count/release sources, nulls/collation/typed ordering and historical attribution; reference ER/mock fields insufficient. | T020, T021, T022, T023, T024, T026, T027, T028, T029, T030, T031, T032, T034, T036, T037, T038, T041, T042 | OPEN; reviewer/date pending |
| C05 | Hoàng/Đăng/Khoa and shared frontend owner to be assigned | Reviewed exact per-operation wire examples/OpenAPI 3.0.3, public partial-failure and protected Studio read contracts, safe complete traversal and retry semantics. | T010, T011, T012, T013, T014, T015, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032, T033, T034, T035, T036, T037, T038, T039, T040, T041, T042 | OPEN; reviewer/date pending |
| C07 | Khoa/Hoàng/Đăng | Authoritative official/public playlist designation, update/membership mapping and eligibility existence query across all artist songs. | T027, T028, T029, T030, T031, T032, T034, T036, T037, T038, T041, T042 | OPEN; reviewer/date pending |
| C12 | Hoàng/Nhựt/team; Đăng shared moderation | Uniform source/delivery disposition for owner supplements incl. D17/D18 and broader deferrals; independent Artist preference/Admin restriction mapping and protected concurrent branches. | T025, T026, T039, T040, T041, T042 | OPEN; reviewer/date pending |
| C13 | Hoàng/Huy | Confirm existing selected-song handoff/destination and demonstrate unavailable-content behavior; no new song route assumed. | T025, T026, T039, T040, T041, T042 | OPEN; reviewer/date pending |
| C15 | Nhựt/foundation responsibility to be assigned; Hoàng | Supported Node/runtime and approved installed shared harness/versions/scripts/layout with runnable smoke and feature checks. Host Node 26.13.0/npm 11.20.0 and baseline build verified; reuse main's Node/JSX harness for review, Group 090 runtime pin/layout/browser checks pending. | T009, T012, T013, T015, T016, T018, T019, T020, T021, T024, T025, T026, T027, T030, T031, T032, T033, T035, T036, T037, T038, T039, T040, T041, T042 | PARTIAL evidence; acceptance pending |

## Every GATED task evaluated

Each task below was checked against the current source audits and its closure/predecessor clauses in [tasks](../tasks.md). All remain HOLD: accepted governance and the named technical closure evidence are absent; none was executed or ticked.

| Task | Explicit gate slice | Predecessors / conditional prerequisites from task | Outcome |
| --- | --- | --- | --- |
| T009 | C01, C15 |  T008; do not execute simply because the tooling audit exists. | HOLD; closure missing |
| T010 | C01, C02, C05 |  T008. | HOLD; closure missing |
| T011 | C01, C02, C05 |  T010. | HOLD; closure missing |
| T012 | C01, C02, C05, C15 |  T009, T010. | HOLD; closure missing |
| T013 | C01, C02, C05, C15 |  T009, T010, T012. | HOLD; closure missing |
| T014 | C01, C02, C05 |  T010, T011. | HOLD; closure missing |
| T015 | C01, C02, C05, C15 |  T009, T010; fail against real unfinished handlers, not only test doubles. | HOLD; closure missing |
| T016 | C01, C02, C05, C15 |  T009, T010. | HOLD; closure missing |
| T017 | C01, C02, C05 |  T011, T014, T015. | HOLD; closure missing |
| T018 | C01, C02, C05, C15 |  T013, T016, T017. | HOLD; closure missing |
| T019 | C01, C02, C05, C15 |  T015–T018; **conditional prerequisite T023** if C05 requires identity-plus-featured implementation for a valid successful detail response. | HOLD; closure missing |
| T020 | C01, C02, C03, C05, C15 |  T009, T010, T003, T005. | HOLD; closure missing |
| T021 | C01, C02, C03, C05, C15 |  T009, T010, T003, T005. | HOLD; closure missing |
| T022 | C01, C02, C03, C05 |  T011, T020, T021; this task may precede US1 acceptance when C05 composite-detail requires it. | HOLD; closure missing |
| T023 | C01, C02, C03, C05 |  T010, T014, T017, T022. | HOLD; closure missing |
| T024 | C01, C02, C03, C05, C15 |  T012, T013, T018, T023. | HOLD; closure missing |
| T025 | C01, C02, C05, C12, C13, C15 |  T006, T008, T024. | HOLD; closure missing |
| T026 | C01, C02, C03, C05, C12, C13, C15 |  T020–T025. | HOLD; closure missing |
| T027 | C01, C02, C03, C05, C07, C15 |  T009, T010, T003, T005. | HOLD; closure missing |
| T028 | C01, C02, C03, C05, C07 |  T022, T027; serialize with all edits to this repository file. | HOLD; closure missing |
| T029 | C01, C02, C03, C05, C07 |  T023, T028; do not change public/private boundaries. | HOLD; closure missing |
| T030 | C01, C02, C03, C05, C07, C15 |  T024, T029; serialize with shared page/hook/service writers. | HOLD; closure missing |
| T031 | C01, C02, C03, C05, C07, C15 |  T027–T030. | HOLD; closure missing |
| T032 | C01, C02, C03, C05, C07, C15 |  T009, T023, T029; test written before T034. | HOLD; closure missing |
| T033 | C01, C02, C05, C15 |  T009, T013, T016; independent of backend test-file edits. | HOLD; closure missing |
| T034 | C01, C02, C03, C05, C07 |  T017, T023, T029, T032. | HOLD; closure missing |
| T035 | C01, C02, C05, C15 |  T030, T033, T034; no personal auth or mutation side effects. | HOLD; closure missing |
| T036 | C01, C02, C03, C05, C07, C15 |  T031–T035. | HOLD; closure missing |
| T037 | C01, C02, C03, C05, C07, C15 |  T019, T026, T031, T036. | HOLD; closure missing |
| T038 | C01, C02, C03, C05, C07, C15 |  T019, T026, T031, T036. | HOLD; closure missing |
| T039 | C01, C02, C05, C12, C13, C15 |  T026, T031, T036; no shared source writer may run concurrently. | HOLD; closure missing |
| T040 | C01, C02, C05, C12, C13, C15 |  T019, T026, T031, T036. | HOLD; closure missing |
| T041 | C01, C02, C03, C05, C07, C12, C13, C15 |  T019, T026, T031, T036–T040. | HOLD; closure missing |
| T042 | C01, C02, C03, C05, C07, C12, C13, C15 |  T041. | HOLD; closure missing |

## Exact implementation paths awaiting approval

Existing migration location is [src/database/migrations](../../../../src/database/migrations/); only 001_auth_tables.sql exists. **Next migration filename/version and DDL: not selected or approved**; require actual canonical mapping/history/lifecycle acceptance first. Proposed feature modules/test destinations are those in [plan](../plan.md) and [tasks](../tasks.md), not installed or approved paths. No speculative migration or final OpenAPI is created.

Pending final contract path from T010: contracts/artist-profile-api.json. Proposed identity repository/routes/controllers, service/hook and tests in tasks require C02/C05/C15 acceptance. C05 must establish independently usable identity or require featured T022/T023 before MVP; C03/C07 content work is not automatically a public identity dependency. C04 only applies if shared public-fetch seam changes.

## Review order and validation limits

Actual documentation/scope checks are recorded in the [shared execution validation record](../../091-artist-profile/preparation/tooling-audit.md#execution-validation-record--2026-11-11). Written cases are not executed feature tests.

Resolve governance/source lineage, canonical keys/visibility/ownership and applicable contract/completeness first; shared auth/atomic/media/lifecycle design then feature-specific tests. Runtime work can proceed independently as evidence gathering. Record accepted artifact link, responsible reviewer, acceptance date and exact satisfied slice before changing a gate. No full bundled D/F/S entry is closed here. Existing SDK upload code supplies a new fragment for S06, not accepted C09/S08 distribution or C08 consistency. All application/test/build/media/database/browser/performance acceptance remains unexecuted in this shell. See [shared checks](../../091-artist-profile/preparation/tooling-audit.md) and the execution validation record added after document checks.

## Accepted identity implementation update — 2026-11-13

The owner explicitly confirmed `artists.user_id → users.user_id` and accepted the remaining proposed identity design/tooling choices. Do not reopen these questions. Existing `users.is_banned` is the account authority; unlinked explicitly public Artists qualify; ban/unban persist hidden; old visibility NULL remains unreviewed. Identity-only anonymous GET returns exactly id/name/imageUrl/biography, with bigint as string before JSON. These confirmations authorize the slice without claiming team Constitution ratification.

[Implementation, commands, results and deployment limits](../validation/us1-results.md) replace earlier missing-evidence conclusions for identity only. T009–T019 are implemented/tested in the scoped delivery; C02/C05/C15 identity evidence is present. C03/C07 catalog and broader cross-feature gates remain open. Source code uses a backend-only filtered SQL view plus account/publication triggers; 003/004 have not been applied remotely. No Admin approval endpoint or workflow is claimed. Full-player selection still awaits catalog integration; copy Artist link is implemented.
