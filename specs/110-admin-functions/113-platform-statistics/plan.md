# Implementation Plan: 113 — Platform Statistics

**Branch**: `110-admin-functions-plan-tasks` | **Date**: 2026-11-09 | **Spec**: [Platform Statistics](./spec.md)

**Performed by**: Codex, requested planning draft | **Reviewed by**: Not assigned; review pending | **Edited by**: Codex

**Input**: Existing [specification](./spec.md), [requirements checklist](./checklists/requirements.md) and five [UI references](./ui/).

**Status**: Review-ready design package; implementation **HOLD**. All P01–P13 [decisions](./research.md#decision-register) remain open. No Tasks, migrations or application changes are delivered.

## Summary

Provide a server-authorized Admin overview through the existing API inventory entry `GET /api/v1/admin/stats`. Calculate trusted aggregates from authoritative persistent sources, render independent availability and successful calculation timestamps, recalculate on open/manual refresh, and clear old results on failure or authorization loss. Preserve current-account and retained-history definitions without summing song counters or browser mock histories.

The October clarification/checklist lock two read-only values; the November clarification and FR-002 require four cards and hints. FR-021 requires System controls while US4/FR-008/SC-004 prohibit feature mutations. This package covers **all 21 FRs, seven SCs and four stories**, including disputed capabilities, with explicit gates. It neither drops newer requirements nor treats the mock dashboard as an approved aggregate implementation.

Extend existing React/Express/Supabase boundaries after approval of scope, canonical sources and exact interfaces. No new analytics service, event producer, charting library, aggregate table, worker, caching policy, provider or retention mechanism is selected.

## Technical Context

**Language/Version**: Existing JavaScript/JSX and Node ES modules. Manifests specify React `^18.3.1`, Vite `^5.4.11`, Express `^4.21.2`; supported Node/npm versions require P13 verification. Manifest declarations do not verify deployment.

**Primary Dependencies**: Existing React/custom navigation/store, Tailwind `^3.4.17`, Express, JWT/cookie/session authentication, Supabase JS `^2.119.0` and Firebase-to-AuraTune session exchange. No additional dependency selected.

**Storage**: Actual auth migration creates users/OAuth links/sessions only. Catalog/history PostgreSQL ERD is reference design; no deployed authoritative statistics source verified. Service-role access stays backend-only; volatile auth/demo fallback is not durable platform evidence. P03–P06 gate implementation.

**Testing**: Existing frontend build and backend auth smoke commands only; no verified statistics runner. [Quickstart](./quickstart.md) contains planned validation, P13. No application tests executed.

**Target Platform**: Existing responsive browser SPA and Node API; shared Vision browser/security requirements apply. Deployment and complete persistent dataset remain unverified.

**Project Type**: Existing frontend/backend web application; aggregate read interface plus separately gated FR-021 System capability.

**Performance Goals**: Applicable [Vision §6](../../../docs/proposal/Auratune_Vision_Document.md) SPA/browser/security goals. Its metadata/profile/playlist query p95 <100 ms is not an approved full-history aggregate SLA. No 113-specific numeric latency, dataset or concurrency target exists; P12 requires measurable acceptance. Do not import 093's unresolved 500 ms upload criterion or personal-history timings.

**Constraints**: Admin-only minimal aggregates, no private rows/secrets/client service-role credentials. No date/month/range selector, polling, realtime refresh, stale-as-current fallback, estimated or partial totals. Per-metric successful calculation time in Asia/Ho_Chi_Minh. Source precedence/System boundary NEEDS CLARIFICATION (P02/P11).

**Scale/Scope**: Four P1 stories; 21 FRs/seven SCs. Two defined metrics versus four required cards/hints unresolved. Aggregate complete sources rather than a UI/provider-limited page. No volume, TTL or retention override presumed.

## Constitution Check

*Checked before research and again after design.*

| Gate | Pre-design / post-design | Evidence/action |
| --- | --- | --- |
| Ratified Constitution | HOLD / HOLD | [Constitution](../../../.specify/memory/constitution.md) has unfilled principles/governance placeholders. Sample comments are not ratified rules. P01 requires governance evidence. |
| Existing architecture/least privilege | Bounded / bounded | Existing stack, current-session/current-role backend checks, server-only sources and aggregate allowlist. Endpoint/tests remain future work. |
| Source consistency | HOLD / HOLD | P02 preserves two/four-card and read-only/System conflicts. P04–P06 identify source/lifecycle gaps. No silent precedence. |
| Contract/implementation evidence | HOLD / HOLD | Route inventory exists; exact DTO/partial results/timestamps do not. ERD/mock UI are not deployment evidence. P03–P13 apply. |
| Workflow/output scope | Satisfied for this pass | [Skill](../../../.agents/skills/speckit-plan/SKILL.md), [template](../../../.specify/templates/plan-template.md), [workflow](../../../.specify/workflows/speckit/workflow.yml); setup used explicit feature/no selector persistence. No extension-hooks file found. Five local outputs only. |

The skill asks research to close clarifications/error on unresolved gates. The user's explicit request requires a reviewable package with blockers instead. Design review may proceed with HOLDs; implementation cannot pass these gates. No constitutional exception or approval is fabricated.

## Project Structure

### Documentation (this feature)

```text
specs/110-admin-functions/113-platform-statistics/
├── spec.md                         # existing, unchanged
├── checklists/requirements.md      # existing, unchanged
├── ui/                            # five existing PNGs, unchanged
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/platform-statistics.md
```

Tasks belong to a later reviewed workflow stage and are not generated.

### Source Code (repository root)

```text
src/frontend/src/
├── pages/Admin/AdminPage.jsx       # existing shared shell/mock cards/System
├── context/AppStore.jsx            # mock history and session context
├── services/sessionApiClient.js    # refresh/replay integration
├── App.jsx                        # mock recording hookup
└── hooks/useMockPlayer.js          # timer player, not event authority
src/backend/
├── server.js                      # auth routes only; future stats registration
├── routes/                        # future approved Admin integration
├── controllers/                   # future transport/projection boundary
├── middleware/authMiddleware.js   # existing current-user/session checks
└── repositories/authRepository.js # auth source; no stats repository
src/database/
├── supabaseClient.js              # backend service-role configuration
└── migrations/001_auth_tables.sql  # auth only
```

**Structure Decision**: Extend existing boundaries after relevant P gates. Exact new source/test filenames and any approved migration depend on accepted contracts/store/harness. This tree does not prescribe missing modules or schema. Shared Admin/auth files require coordination with 111/112 rather than competing rewrites.

## Architecture and data flow

1. Authorized open/manual refresh creates a new load generation bound to the originating account/session. Existing values cease to represent the current load; do not merge an old success with a new peer failure.
2. Existing Bearer/session validation reloads the current user. Require a current valid, unbanned Admin before aggregate queries/disclosure. Cached roles/Firebase identity alone are insufficient. P09 aligns current auth discrepancies with 111.
3. Future statistics logic calculates only accepted metrics from complete authoritative server-side sources. Logical account/catalog/history adapters separate definitions/failures; they do not imply new services/tables/endpoints.
4. Each metric has a trusted exact value with its successful calculation instant, or unavailable. Untrusted/incomplete/conflicting data yields no subtotal. Shared failures affect all dependent metrics; independent successes may remain within the same load.
5. A minimal P07 projection uses the shared envelope without user/song/history rows or sensitive diagnostics. P08 defines calculation/read consistency under concurrent changes; no distributed snapshot transaction is presumed.
6. The UI accepts only the latest load for the same still-authorized originating session, formats calculation instants in UTC+7 and exposes loading/zero/partial/unavailable/retry. Authorization loss clears all values/hints/timestamps and rejects late responses. P10 guards replay as well as rendering.
7. FR-021 is separately gated. GET statistics remains read-only. Existing `aiAvailable`/`resetDemo` names are local code identifiers, not approved wire fields/global settings/database-reset permission. P02/P11 must settle scope, authority, persistence and interface.

See [metric dictionary](./data-model.md#metric-dictionary), [contract](./contracts/platform-statistics.md) and [research](./research.md#decision-register).

## Cross-feature integration

| Dependency | Required boundary |
| --- | --- |
| [111 plan](../111-user-management/plan.md), [U register](../111-user-management/research.md) | Canonical account/current role/ban/session enforcement. Ban does not remove an account from total users. Role changes do not create Artist records, alter follows or transfer ownership. U04/U06/U07/U09/U11 remain open, not delivered fixes. |
| [112 plan](../112-content-moderation/plan.md), [M register](../112-content-moderation/research.md) | Independent Artist visibility/Admin restriction. M02/M03/M04/M07/M09 settle inventory/removal/history mapping. Preserve required valid history; audit preservation does not authorize an audit metric/UI. |
| [091](../../090-artist-profile-studio/091-artist-profile/spec.md) | Canonical artist records/public-profile eligibility differs from account ban, role and track visibility. Anonymous public APIs must not acquire authentication requirements or Admin aggregates. |
| [092](../../090-artist-profile-studio/092-follow-artist/spec.md) | Private own-account follows remain independent. No follower KPI, private-list summation or personal follow fields in public responses. |
| [093](../../090-artist-profile-studio/093-artist-track-management/spec.md), [owner record](../../../docs/requirements/use-cases/090-artist-profile-studio/README.md) | Current inventory differs from history; D06 concerns own Studio, not a platform formula. D05/D07 preserve restriction/playback boundaries. No audio replacement, album CRUD, approval queue or ownership mutation. |
| [071 spec](../../070-listening-history/071-listening-history/spec.md), [research](../../070-listening-history/071-listening-history/research.md), [Player](../../040-music-player/041-playback-controls/spec.md) | Consume accepted valid producer events; add no threshold/heuristic in 113. Source qualification, identity/retry, clear-all and 365-day purge require integration evidence. Retained-event count is not lifetime plays or stream requests. |
| [101 research](../../100-ai-recommendations/101-listening-history-analysis/research.md) | Personal SQL/current-song filtering is not 113 approval/deployment evidence. No personal-history disclosure or current-catalog filtering of historical validity. |

Group 090 planning/research/Tasks/consolidated review files are **absent in this checkout**; available specs/checklists/UI and owner use-case records were reviewed. Do not import prior conversational artifacts or recreate C01–C15 as current approved decisions. P13 records this limitation. The 113 spec's older statement that 111/112 are absent is now historical.

## Implementation phases and dependency ordering

These phases are not executable Tasks or authorization to change shared sources.

| Phase | Deliverable/exit evidence | Dependencies/parallel work |
| --- | --- | --- |
| 0 — Governance/scope | Recorded P01/P02 disposition, complete FR/SC interpretation | Evidence gathering/written scenarios runnable now; screenshots cannot settle precedence. |
| 1 — Source contracts | Account P03, catalog/hints P04, event P05, lifecycle P06, System P11 accepted definitions | Research streams may run in parallel; schema/auth acceptance coordinated. No speculative persistence implementation. |
| 2 — Integration design | P07 DTO/errors, P08 timestamps/consistency, P09 server authority, P10 session-bound client, P12 query/precision, P13 harness | Depends on relevant source definitions. Fixture/security analysis may run independently; shared shell/auth edits need coordination. |
| 3 — Backend, gated | Approved Admin handler/guard and complete persistent calculations, safe independent failure | Relevant P01–P09/P12/P13 closed; no demo fallback. |
| 4 — Frontend/System, gated | API-backed cards/states/manual refresh/timestamps/latest-session safety; conditional separate System capability | P02/P07/P09/P10 and P11 for controls; accepted fixtures allow component work alongside backend. |
| 5 — Acceptance | Actual [validation](./quickstart.md), lifecycle/race/privacy/completeness/performance evidence and peer review | All applicable gates closed; no current execution/implementation-readiness claim. |

## Requirements and success-criteria traceability

| Requirement | Planned behavior/evidence | Gate; validation |
| --- | --- | --- |
| FR-001 | Current Admin overview/approved GET | P07/P09; V01/V02 |
| FR-002 | Four cards and every hint explicitly retained, scope gated | P02/P04/P07; V02/V04/V05 |
| FR-003 | Current distinct accounts, all roles/statuses/demo; guests/removed excluded | P03; V03 |
| FR-004 | Retained valid history/source identity; no counter/browser addition | P05/P06; V06/V07 |
| FR-005 | True zero distinct from missing/untrusted source | P07; V08 |
| FR-006 | Independent success/partial/full failure | P07/P08; V08/V09 |
| FR-007 | Guest/User/Artist denied before aggregates | P09; V01/V12 |
| FR-008 | Read-only stats; System conflict preserved | P02/P11; V14 |
| FR-009 | Aggregate allowlist, no PII/history/secrets | P07/P09; V12 |
| FR-010 | No unsupported KPI/chart/export/analytics | P02; V14 |
| FR-011 | No 111/112 actions in statistics | P02/P11; V14 |
| FR-012 | No personal-history/analytics exposure | P05/P07; V12/V14 |
| FR-013 | Aggregate operational projection only | P07; V12 |
| FR-014 | No mutation/job required to view | P05/P12; V14 |
| FR-015 | Current accounts/retained history, no range selector | P03/P05/P06; V03/V06/V14 |
| FR-016 | Open/manual new calculations; no polling/old-new merge | P08/P10; V09/V10 |
| FR-017 | Successful calculation instant per metric, UTC+7 | P07/P08; V10 |
| FR-018 | Trusted values or unavailable, no partial subtotals | P05–P08; V08/V09 |
| FR-019 | No stale values after failed refresh; retry | P10; V09/V11 |
| FR-020 | Lost/expired Admin withholds all metrics/late data | P09/P10; V01/V11 |
| FR-021 | AI availability/demo-reset capability preserved; authority/read-only conflict gated | P02/P11; V15 |

| Story/criterion | Acceptance coverage |
| --- | --- |
| US1 — Authorized overview | V01–V07/V10: accepted platform aggregates, current independent results, no personal scope |
| US2 — Zero/empty/unavailable | V08–V11: true source-empty zero, unavailable source, peer/whole failure, fresh retry |
| US3 — Authorization/privacy | V01/V11/V12: guest/User/Artist denial, minimal Admin projection, unsupported fields excluded |
| US4 — Read-only boundary | V14 and gated V15: no source/account/content/history writes; P02 resolves System contradiction |
| SC-001 | V01–V07 accepted metric set/current Admin |
| SC-002 | V08–V11 zero/empty/partial/unavailable correctness |
| SC-003 | V01/V11 denied access/no stale disclosure |
| SC-004 | V14/P02/P11 read-only proof and System disposition |
| SC-005 | V12 response/DOM/log privacy |
| SC-006 | V02/V04–V07/V14 source formulas/no new windows/KPIs |
| SC-007 | Metric dictionary, P02–P08 closure, V03–V10 provenance proof |

## Readiness and review gates

Review may assess conflicts, definitions, component boundaries, proposed flow and coverage now. Implementation cannot proceed on disputed metrics/controls or unverified schema/DTO. Resolve P01/P02 first, then source/lifecycle/control contracts, then API/read consistency/auth/client/query verification. Evidence collection and written fixtures are runnable; production queries/code/exact payload tests/System actions remain gated.

Checklist ticks do not establish precedence, deployment or passed acceptance. Following team disposition, a later authorized pass must synchronize affected sources/contracts and obtain independent review before a full `/speckit.tasks` package or implementation-readiness claim.

## Complexity Tracking

No ratified constitutional exception claimed. P01 is a governance gap, not justification for complexity. The proposed design stays within the current application; any new analytics/cache/job architecture needs separate source-backed review.

