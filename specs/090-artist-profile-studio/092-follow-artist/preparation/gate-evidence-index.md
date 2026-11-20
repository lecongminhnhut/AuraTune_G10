# 092 gate evidence index and review package

> **Follow-up:** [Host runtime, baseline runs, local integration refs and concrete identity-slice decisions](../../group-090-integration-follow-up.md) supersede the initial sandbox runtime inference. Node 26.13.0/npm 11.20.0 and frontend build are verified outside sandbox. Auth smoke has four failed checks despite exit 0. Main/Player provide reusable Node/JSX harness evidence; accepted Group 090 source/contracts/tooling closure remains incomplete. No additional GATED task is complete.

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

**Disposition:** 9 READY deliverables prepared; 39 GATED tasks examined individually below, none eligible to execute. No reviewed/accepted closure evidence was found for C01 or the applicable technical gates. Reviewer: not yet assigned/accepted; audit author does not self-approve. Date of review acceptance: pending. This checked-in package is available for team review; no message/PR was sent.

## Preparation dependency completion

T001 source ledger precedes independent case/audit tasks, then this index. Shared evidence reused by reference: [canonical/catalog audit](../../091-artist-profile/preparation/catalog-source-audit.md), [runtime audit](../../091-artist-profile/preparation/tooling-audit.md), [session replay audit](../../092-follow-artist/preparation/session-replay-audit.md), [actual media inventory](../../093-artist-track-management/preparation/media-and-recovery-options.md). Existing code is evidence of capability presence, not a recorded architecture acceptance.

| Task | Deliverable |
| --- | --- |
| T001 | [source-and-scope-ledger.md](./source-and-scope-ledger.md) |
| T002 | [identity-and-visibility-cases.md](./identity-and-visibility-cases.md) |
| T003 | [persistence-and-lifecycle-audit.md](./persistence-and-lifecycle-audit.md) |
| T004 | [interface-and-recognition-options.md](./interface-and-recognition-options.md) |
| T005 | [atomic-processing-histories.md](./atomic-processing-histories.md) |
| T006 | [session-replay-audit.md](./session-replay-audit.md) |
| T007 | [acceptance-and-privacy-cases.md](./acceptance-and-privacy-cases.md) |
| T008 | [tooling-and-shared-file-audit.md](./tooling-and-shared-file-audit.md) |

## Original decision trace (unchanged register)

The following rows retain original register IDs, responsibilities and closure conditions. They remain OPEN for technical acceptance. Supporting evidence is in the preparation rows above and cluster table below; no owner decision is fabricated.

| ID | Original gap | Existing coordination roles | Required closure evidence |
| --- | --- | --- | --- |
| F01 | Ratified Constitution absent | Nhựt/team | Ratification or recorded governance disposition, aligned with 091-D01; constitutional approval cannot be claimed. |
| F02 | Canonical artist IDs, public/hidden/disabled predicate and safe fields; effect of linked-account ban not defined | Hoàng + Đăng, Khoa for account policy | Reviewed shared policy and catalog schema/ID validation, reuse 091-D02 and ID portion of D05; blocks correct follow/list/non-disclosure. |
| F03 | Actual relation persistence/key mapping and original follow time absent from migrations | Đăng + Hoàng + Khoa | Confirm existing reference table deployment, map verified auth owner (`id`/`user_id`) and artist key, uniqueness, timestamp type/precision/source, migration of missing historic times. No guessed timestamp name/backfill date; blocks durable follows/order. |
| F04 | Atomic transaction/serialization transport not implemented | Đăng + Hoàng + Nhựt | Approved DB execution boundary and lock strategy covering absent pairs, multiple workers, visibility/delete races and rollback; demonstrate commit-order histories. No invented RPC/function/lock schema; blocks FR-015 and count atomicity if applicable. |
| F05 | Exact personal DTOs, duplicate/no-op statuses, complete own-list traversal/state recognition, hidden-unfollow no-own-relation case | Hoàng + Khoa + Đăng | Reviewed examples/OpenAPI using only current endpoints; absence-as-negative safe only for public artist and complete authoritative list. Define non-disclosing no-op/404 treatment without leaking another account's relation. Blocks UI/backend integration and final contract schemas. |
| F06 | Auth error-envelope/status drift; origin-bound refresh/replay and session revocation/ban ordering | Khoa + Hoàng | Shared auth alignment: bearer/session checks retained; standard failures, banned denial, no A→B replay. Tests cover refresh in flight, same-account new session, logout and revocation. No new authentication mechanism; blocks safe personal integration. |
| F07 | User/Vision request follow counts while 092 excludes assumed follower counts; no schema/API/count predicate/live semantics | Hoàng + Nhựt + Đăng + Khoa | Decide count meaning (artist follower total vs own visible list), eligible membership incl. hidden/banned/deleted states, audience, freshness and approved read/representation. Confirm in-scope change or explicit deferral; no count column/API/UI invented. Blocks any count implementation/claim of full Vision count coverage. |
| F08 | Permanent deletion cleanup/storage and races undecided | Đăng + Hoàng + Khoa | Shared lifecycle disposition needed for FK/delete integration and stale refs; preserve FR-016 outward result without selecting cascade/retention policy. Can validate behavior through approved fixtures meanwhile; no cleanup migration under 092 assumptions. |
| F09 | Runtime/tests not pinned/installed | Nhựt/foundation owner + Hoàng | Supported runtime, shared runner/scripts/layout incl. multi-worker integration tests; maps 091-D08. Blocks runnable automated validation instructions, not review of scenarios. |

## Cluster closure and direct task impact

Every implementation/test task also inherits C01 through its foundation dependencies. “Direct tasks” below lists explicit gate mentions; dependent descendants remain blocked too. These are per-feature slices: unrelated media/playlist choices are not blanket prerequisites for public identity or follows.

| Cluster | Responsibility | Evidence missing / decision to settle | Direct tasks in this feature | Acceptance |
| --- | --- | --- | --- | --- |
| C01 | Nhựt/team | Template constitution remains unratified; require recorded governance disposition/ratification. | T010, T011, T012, T013, T014, T015, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032, T033, T034, T035, T036, T037, T038, T039, T040, T041, T042, T043, T044, T045, T046, T047, T048 | OPEN; reviewer/date pending |
| C02 | Hoàng/Đăng; Khoa account policy | Actual canonical account↔artist/owner IDs, validator, public/hidden/disabled/ban predicates and safe projections with representative eligible/ineligible records. | T011, T012, T013, T014, T015, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032, T033, T034, T035, T036, T037, T038, T039, T040, T041, T042, T043, T044, T045, T046, T047, T048 | OPEN; reviewer/date pending |
| C04 | Khoa/Hoàng | Accepted standard error and originating-account/session refresh/replay/final-authorization design; current client lacks explicit origin-generation guard. | T011, T012, T013, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032, T033, T034, T035, T036, T037, T038, T039, T040, T041, T042, T043, T044, T045, T046, T047, T048 | OPEN; reviewer/date pending |
| C06 | Đăng/Hoàng/Khoa | Deployed follow pair/time/precision/history mapping, duplicate/no-op/hidden-no-pair outcomes and complete authoritative own-state recognition protocol. | T011, T012, T013, T014, T015, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032, T033, T034, T035, T036, T037, T038, T039, T040, T041, T042, T043, T044, T045, T046, T047, T048 | OPEN; reviewer/date pending |
| C08 | Đăng/Hoàng/Nhựt; Khoa auth/history | Database atomic execution and successful-processing order across workers/absent pairs, transaction rollback, track dedup/reconciliation/finalization without resurrection. | T014, T015, T016, T020, T022, T025, T026, T028, T030, T031, T033, T034, T035, T036, T041, T042, T043, T044, T046, T047, T048 | OPEN; reviewer/date pending |
| C10 | Đăng/Hoàng/Khoa/Huy | Reviewed artist/track lifecycle, FK/playlist/media cleanup and historical plays preservation, concurrent hide/delete/current new-start enforcement. | T014, T015, T016, T017, T020, T022, T025, T026, T028, T030, T031, T035, T036, T037, T041, T042, T043, T044, T046, T047, T048 | OPEN; reviewer/date pending |
| C11 | Hoàng/Nhựt/Đăng/Khoa | Follower-count scope, meaning/predicate/audience/freshness or explicit authorized deferral of Vision obligation; no count schema/UI assumed. | T048 | OPEN; reviewer/date pending |
| C15 | Nhựt/foundation responsibility to be assigned; Hoàng | Supported Node/runtime and approved installed shared harness/versions/scripts/layout with runnable smoke and feature checks. Host Node 26.13.0/npm 11.20.0 and baseline build verified; reuse main's Node/JSX harness for review, Group 090 runtime pin/layout/browser checks pending. | T010, T012, T013, T014, T015, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030, T031, T032, T033, T034, T035, T036, T037, T038, T039, T040, T041, T042, T043, T044, T045, T046, T047, T048 | PARTIAL evidence; acceptance pending |

## Every GATED task evaluated

Each task below was checked against the current source audits and its closure/predecessor clauses in [tasks](../tasks.md). All remain HOLD: accepted governance and the named technical closure evidence are absent; none was executed or ticked.

| Task | Explicit gate slice | Predecessors / conditional prerequisites from task | Outcome |
| --- | --- | --- | --- |
| T010 | C01, C15 |  T009. | HOLD; closure missing |
| T011 | C01, C02, C04, C06 |  T009. | HOLD; closure missing |
| T012 | C01, C02, C04, C06, C15 |  T010, T011. | HOLD; closure missing |
| T013 | C01, C02, C04, C06, C15 |  T012. | HOLD; closure missing |
| T014 | C01, C02, C06, C08, C10, C15 |  T010, T011. | HOLD; closure missing |
| T015 | C01, C02, C06, C08, C10, C15 |  T013, T014. | HOLD; closure missing |
| T016 | C01, C02, C04, C06, C08, C10, C15 |  T013, T015. | HOLD; closure missing |
| T017 | C01, C02, C04, C06, C10, C15 |  T011, T013, T016. | HOLD; closure missing |
| T018 | C01, C02, C04, C06, C15 |  T010, T011, T013, T017. | HOLD; closure missing |
| T019 | C01, C02, C04, C06, C15 |  T018. | HOLD; closure missing |
| T020 | C01, C02, C04, C06, C08, C10, C15 |  T010, T011, T016. | HOLD; closure missing |
| T021 | C01, C02, C04, C06, C15 |  T010, T011, T019. | HOLD; closure missing |
| T022 | C01, C02, C04, C06, C08, C10, C15 |  T017, T020. | HOLD; closure missing |
| T023 | C01, C02, C04, C06, C15 |  T019, T021, T022. | HOLD; closure missing |
| T024 | C01, C02, C04, C06, C15 |  T023. | HOLD; closure missing |
| T025 | C01, C02, C04, C06, C08, C10, C15 |  T020–T024. | HOLD; closure missing |
| T026 | C01, C02, C04, C06, C08, C10, C15 |  T010, T011, T016. | HOLD; closure missing |
| T027 | C01, C02, C04, C06, C15 |  T010, T011, T019. | HOLD; closure missing |
| T028 | C01, C02, C04, C06, C08, C10, C15 |  T022, T026. | HOLD; closure missing |
| T029 | C01, C02, C04, C06, C15 |  T024, T027, T028. | HOLD; closure missing |
| T030 | C01, C02, C04, C06, C08, C10, C15 |  T026–T029. | HOLD; closure missing |
| T031 | C01, C02, C04, C06, C08, C10, C15 |  T028, T030. | HOLD; closure missing |
| T032 | C01, C02, C04, C06, C15 |  T013, T029. | HOLD; closure missing |
| T033 | C01, C02, C04, C06, C08, C15 |  T029. | HOLD; closure missing |
| T034 | C01, C02, C04, C06, C08, C15 |  T031, T032, T033. | HOLD; closure missing |
| T035 | C01, C02, C04, C06, C08, C10, C15 |  T031, T034. | HOLD; closure missing |
| T036 | C01, C02, C04, C06, C08, C10, C15 |  T032–T035. | HOLD; closure missing |
| T037 | C01, C02, C04, C06, C10, C15 |  T010, T011, T017. | HOLD; closure missing |
| T038 | C01, C02, C04, C06, C15 |  T010, T011, T019. | HOLD; closure missing |
| T039 | C01, C02, C04, C06, C15 |  T034, T037, T038. | HOLD; closure missing |
| T040 | C01, C02, C04, C06, C15 |  T024, T029, T039. | HOLD; closure missing |
| T041 | C01, C02, C04, C06, C08, C10, C15 |  T025, T030, T036, T040. | HOLD; closure missing |
| T042 | C01, C02, C04, C06, C08, C10, C15 |  T037–T041. | HOLD; closure missing |
| T043 | C01, C02, C04, C06, C08, C10, C15 |  T036, T042. | HOLD; closure missing |
| T044 | C01, C02, C04, C06, C08, C10, C15 |  T036, T042. | HOLD; closure missing |
| T045 | C01, C02, C04, C06, C15 |  T036, T042. | HOLD; closure missing |
| T046 | C01, C02, C04, C06, C08, C10, C15 |  T036, T042. | HOLD; closure missing |
| T047 | C01, C02, C04, C06, C08, C10, C15 |  T043–T046. | HOLD; closure missing |
| T048 | C01, C02, C04, C06, C08, C10, C11, C15 |  T009, T047. | HOLD; closure missing |

## Exact implementation paths awaiting approval

Existing migration location is [src/database/migrations](../../../../src/database/migrations/); only 001_auth_tables.sql exists. **Next migration filename/version and DDL: not selected or approved**; require actual canonical mapping/history/lifecycle acceptance first. Proposed feature modules/test destinations are those in [plan](../plan.md) and [tasks](../tasks.md), not installed or approved paths. No speculative migration or final OpenAPI is created.

Pending final contract path: contracts/follow-artist-api.json as task contract serialization requires. Proposed migration/test file names in tasks must be explicitly accepted with C06/C08/C15; no exact new migration path is approved. Reuse 091 canonical resolver and shared harness/auth seams, not playlist/song-handoff prerequisites. C11 count scope remains unresolved and unimplemented; Vision obligation is not waived.

## Review order and validation limits

Actual documentation/scope checks are recorded in the [shared execution validation record](../../091-artist-profile/preparation/tooling-audit.md#execution-validation-record--2026-11-11). Written cases are not executed feature tests.

Resolve governance/source lineage, canonical keys/visibility/ownership and applicable contract/completeness first; shared auth/atomic/media/lifecycle design then feature-specific tests. Runtime work can proceed independently as evidence gathering. Record accepted artifact link, responsible reviewer, acceptance date and exact satisfied slice before changing a gate. No full bundled D/F/S entry is closed here. Existing SDK upload code supplies a new fragment for S06, not accepted C09/S08 distribution or C08 consistency. All application/test/build/media/database/browser/performance acceptance remains unexecuted in this shell. See [shared checks](../../091-artist-profile/preparation/tooling-audit.md) and the execution validation record added after document checks.

## Owner acceptance and executed implementation — 2026-11-13

[Accepted design](./accepted-design.md) supersedes earlier missing-evidence conclusions for this local increment. Owner supplied exact deployed follow DDL and accepted the proposed duplicate/no-op, contract, transaction/auth and no-count choices. F02 reuses implemented 091 canonical/public policy. F03 maps follow user_id to users.user_id and original created_at; NULL history remains a rollout preflight stop. F04/C08 now has actual independent-connection PostgreSQL lock/rollback evidence. F05 has exact [OpenAPI](../contracts/follow-artist-api.json), complete single-snapshot aggregate and optional public-target recognition. F06 implements scoped strict auth plus origin-bound refresh/replay; F07 count totals explicitly deferred; F08 preserves supplied NO ACTION without inventing cleanup; F09 reuses verified native/JSX/PGlite/browser tooling plus real PostgreSQL. These owner decisions authorize implementation, not team Constitution ratification or independent review.

T010–T043 are implemented/locally verified with [handoff](../validation/review-handoff.md), [persistence](../validation/persistence.md) and [processing/recovery](../validation/processing-and-recovery.md) evidence. T044–T048 remain open for their specific final validation/review gaps. Follow-table RLS/browser grants are changed by prepared migration 005; live schema/ACL/session mapping/PostgREST and historic NULL values still require rollout verification. No production migration, commit/push, source-framework replacement or 093 implementation was performed.
