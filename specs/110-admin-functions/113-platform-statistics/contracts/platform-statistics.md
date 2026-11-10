# Interface Contract — Feature 113 Platform Statistics

**Date**: 2026-11-09 | **Performed by**: Codex | **Reviewed by**: Not assigned; pending | **Edited by**: Codex

**Status**: Review contract with explicit unresolved wire details; not final OpenAPI or implementation authorization. [Spec](../spec.md), [research gates](../research.md#decision-register), [metric dictionary](../data-model.md#metric-dictionary), [validation](../quickstart.md).

## Source-backed public interface

| Item | Established boundary |
| --- | --- |
| Base | `/api/v1` from [API conventions](../../../../docs/design/api/api-conventions.md) |
| Method/path | `GET /admin/stats` from [current shared API Contract](../../../../docs/analysis-and-design/api-contract.md), therefore full path `GET /api/v1/admin/stats` |
| Authority | Valid authenticated current Admin only; Bearer access token/current AuraTune session; frontend role hiding insufficient |
| Purpose | Minimal supported aggregate platform overview; no private-source-row response |
| Request filtering | No date/month/time-range selector. No new filter, paging, sort, metric-selection query or GET body is approved. Unknown-input policy needs P07 examples; do not add hidden test/fault query parameters. |
| Side effects | Read-only. No account/catalog/moderation/history/counter mutation, AI toggle/reset or job creation by GET |
| Current implementation | No registered statistics handler in backend server; contract inventory does not imply endpoint exists |

## Authorization matrix

| Principal/context | Statistics | Conditional FR-021 System capability |
| --- | --- | --- |
| Anonymous/invalid token | Deny; no aggregates | Deny administrative operation |
| Current User | Deny even if UI/cached role says Admin | Deny |
| Current Artist, linked or unlinked | Deny; ownership grants no Admin access | Deny |
| Valid session, current unbanned Admin | Minimal accepted aggregates | Only after P02/P11 accepted capability contract |
| Banned/demoted/deleted account; revoked/expired/mismatched session | Withhold all results; current backend authority wins over token role | Deny; exact lifecycle and in-flight rules P09/P11 |
| Auth storage unavailable | Fail closed, no stats | No presumed fallback authority |

Existing middleware reloads current role/session but lacks Admin gate and has shared status/envelope drift. P09 aligns 111 U06/U07 and 112 M06. This document does not approve creating a new authentication mechanism or granting normal Admin an Artist's ownership.

## Response envelope and projection

Use the four existing top-level fields `success`, `message`, `data`, `error`. Successful JSON has error null; failed JSON has data null and safe error code/details, as shared conventions require. No actual credentials in examples.

Exact **data keys, nested structure, count type, timestamps, availability vocabulary, hint association and all-unavailable HTTP/envelope mapping are OPEN P07**. M1–M4/H1–H4 in the model are document labels, not approved payload fields. Do not fabricate JSON samples whose names appear final.

The accepted projection must express:

1. The scope-approved main cards and all FR-002 hints, with no extra metric.
2. Exact trusted nonnegative values, distinguishing true zero from unavailable; large-count representation must avoid precision loss.
3. Each metric's successful calculation instant from backend P08 semantics, independent of browser render. UTC+7 display is a UI obligation; serialization/clock precision still need accepted examples.
4. Independent per-metric failure without a partial subtotal; safe availability information only, no raw DB/provider/source row diagnostics.
5. Hint trust/parent failure/timestamp rules: never fabricate hint values when parent succeeds or vice versa. Their exact independent behavior must be agreed, not inferred from typography.
6. Same-load results; no old/new merge. Failed refresh cannot re-present previous successful data as current.
7. A distinguishable complete payload failure/all-unavailable outcome consistent with shared envelope/no-false-success requirements.

Do not expose account IDs/emails/ban reasons, Artist/track metadata or restriction reasons, personal history entries, OAuth identities, session data, credentials, source queries, service keys, stack traces or internal storage diagnostics. No personal follow fields or private-list counts. No new client tracking, export/drilldown or per-user statistics interface.

## Metric source obligations

| Logical result | Interface acceptance constraint |
| --- | --- |
| M1 Total Users | Current distinct accounts across all roles/statuses/demo; guest/removed excluded under accepted source lifecycle. No auth-provider/session/profile join multiplicity. |
| M2 public Artists/H2 Artist-role hint | Distinct universes; do not substitute role accounts for public profiles or assume equal cardinality. P02/P04 source alignment required. |
| M3 Tracks/H3 hidden-removed hint | Approved inventory/overlap/terminal mapping; not automatically public-only, not mock status enum. No duplicate track across independent visibility/restriction layers. |
| M4 Total Plays | Retained valid source history events only, source identity duplicate rule only, event-time valid references. No song-counter, browser/demo sum or current-eligibility join. |
| H1 locked/H4 demo hints | Accepted predicates/source/total relationship required. Local code identifiers are not source authority. |

Complete authoritative empty M1/M4 is 0; missing schema/identifiers, source conflict, untrusted incomplete count or outage is unavailable. Known invalid events can be excluded under accepted source rules; uncertain event eligibility cannot be hidden behind a “known valid subtotal.”

## Error mapping boundaries

| Condition | Shared vocabulary | Additional closure |
| --- | --- | --- |
| Successful trusted request | 200 | Exact metric payload/partial handling P07; cannot label all-failed aggregate as generic success |
| Invalid request | 400 / VALIDATION_ERROR | Accepted query validation/error examples; no invented parameters |
| Missing/invalid/expired credentials | 401 / UNAUTHORIZED or TOKEN_EXPIRED | Align current ad hoc auth envelopes via P09 |
| Authenticated wrong current role | 403 / FORBIDDEN | No aggregates even on errors |
| Banned account | Shared 403 / USER_BANNED | Existing middleware's 401 drift is unresolved P09, not a new approved mapping |
| Applicable existing throttling | 429 / RATE_LIMITED | No new statistics quota chosen |
| Unexpected server/source failure | Shared 500 / INTERNAL_ERROR vocabulary | Per-metric versus whole failure schema/status P07; safe diagnostics only |

Shared 503/AI_SERVICE_UNAVAILABLE is AI-specific, not automatic database/statistics error mapping. No new 207, metric-specific error code or pagination schema presumed. A genuine empty dataset is not a 404/error. No target-ID route exists for this overview.

## Refresh, concurrent reads and retries

- Opening overview/manual refresh starts a new calculation, no polling/realtime timer. Use current source data at accepted P08 read boundary with per-metric calculation instants.
- Multiple source calculations may complete/fail independently; no assumed cross-source distributed transaction. P08 must define what “current” means under simultaneous registration, ban/role/catalog changes, event recording and history purge.
- Full-source count may not truncate to provider/client page size or estimate missing rows. P12 must prove completeness and exact precision.
- A late response from a previous load cannot overwrite a newer one. Timeout/outage clears stale current values and permits manual retry.
- Originating account/session must stay bound through token refresh and any safe GET retry. Account A's request must not be replayed as B; stale role results cannot authorize display.
- Loss of current Admin/session withholds every metric/hint/timestamp. No private data in browser persisted caches or shared cached pages; exact HTTP cache/header policy requires P07/P10 approval, no TTL selected.
- Read retry may recalculate different values; no exactly-once snapshot promise. Statistics GET itself has no mutation uncertainty. Conditional System actions require their own uncertainty rules, not GET retry assumptions.

## Conditional System capability: FR-021

Both capabilities remain requirements to resolve, not omitted scope:

| Source capability | Verified local behavior | Required P02/P11 closure |
| --- | --- | --- |
| AI availability toggle (`aiAvailable`) | Browser store toggle used by mock fallback | Scope of “platform-wide” versus browser demo, current Admin authority, actual AI/backend fallback integration, accepted defaults/persistence/application boundary and exact interface if remote |
| Demo reset (`resetDemo`) | Browser initial-state recreation, not an approved database reset | Explicit demo-only boundary/effects, affected account/session/browser state and data, relation to production statistics, feedback/retry semantics and accepted interface if any |

These identifiers are existing local function/state names, **not proposed payload keys**. No backend toggle/reset route, method, body, table/provider/retention setting or production destructive action is invented. Separating System tab from aggregate GET is an architectural proposal subject to source disposition, not approval to ignore US4/SC-004.

If an accepted capability mutates shared state, its contract must define current Admin authorization, exact permitted effect, consistency, error/timeout/uncertain-outcome recognition and retry safety before implementation. If explicitly demo-local, do not give it remote authority or silently erase authoritative backend history. Do not add a confirmation workflow or broaden permissions without requirement evidence.

## Completion gates for an implementable interface

Accepted examples/schema must cover full/zero/partial/all-unavailable responses, per-result calculation instants/hint failures, count precision, no-filter request validation, safe auth/source errors, current-session replay boundaries, completeness/concurrent-read rules and FR-002/021 source disposition. Close relevant P02–P12 with real source/deployment evidence and P13 test commands. This Markdown boundary is reviewable; it is intentionally not an invented exact DTO.

