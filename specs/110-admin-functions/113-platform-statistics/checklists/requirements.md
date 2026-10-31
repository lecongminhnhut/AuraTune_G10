# Requirements Checklist

## Feature
Platform Statistics (113)

## Scope
This checklist captures the required outcomes for the Platform Statistics feature in Group 110 as defined by the active project documents and the admin statistics specification.

## Status legend
- [ ] Not started
- [ ] In progress
- [x] Complete
- [ ] Needs clarification before implementation

## Source alignment
- [x] Reviewed the proposal, team contract, API contract, architecture docs, database docs, and security docs.
- [x] Confirmed the admin-only boundary from the active API contract and role-navigation documentation.
- [x] Kept the feature separate from user-management, content-moderation, and personal-listening analytics features.
- [x] Identified the source-backed admin stats endpoint and the current boundary of what the project explicitly defines.
- [x] Flagged unresolved business decisions instead of inventing KPI logic or counting rules.

## Functional coverage
- [x] Admin access to the platform overview in the current scope.
- [x] Aggregate user-count and play-count coverage under the currently supported source set.
- [x] A read-only admin statistics view without mutation capability.
- [x] User access denial for non-admins and unauthenticated requests.
- [x] Zero-value handling distinct from empty and unavailable states.
- [x] Partial-data and full-failure handling without false success.
- [x] Sensitive field exclusion and backend-only enforcement.

## Explicitly not included
- [x] User ban or unban actions (feature 111)
- [x] Content moderation, hidden/restricted/deleted content management (feature 112)
- [x] Personal listening history or personal listening analytics (group 070 / 101)
- [x] Revenue, retention, forecast, online user metrics, or business KPI dashboards
- [x] Ranking, report export, AI analytics, or monitoring dashboards beyond the admin overview
- [x] Storage-level, schema-level, cache, charting, or deployment decisions not explicitly supported by the current source set

## Open decisions that still require project clarification before implementation
- [x] Scope is locked to exactly two KPI values for 113: total user count and total play count. No other KPI is in scope for this feature at the current branch state.
- [x] Total user count is defined as the number of distinct currently existing AuraTune user accounts, including all roles and current disabled/banned/locked statuses if present, counted once per user ID, excluding guests and deleted accounts, and returning 0 when none exist.
- [x] Total plays is defined as the total count of valid listening-history events retained in the system up to the time of the statistics calculation, with each distinct recorded listening event counted as one play if it was valid at creation time and not marked invalid by the source system; duplicate collapse is only allowed when a source-level event identifier exists; no new session or completion logic is added; historical valid plays remain counted even after hide/restrict/delete or lock status changes; and `songs.total_plays` is not used as a replacement or synchronized source.
- [x] Time-window and refresh behavior are defined: there is no date/month filter or time-range selector; stats are calculated when the admin opens the page or triggers a manual refresh; no automatic periodic refresh or real-time requirement is imposed; and each refresh creates a fresh snapshot instead of merging old and new data.
- [x] Timestamp behavior is defined: the successful calculation time is displayed using Asia/Ho_Chi_Minh (UTC+7), reflecting the statistics calculation time rather than the browser render time.
- [x] Unreliable result handling is defined: if the system cannot obtain a trustworthy result, the metric is shown as `unavailable` and is not replaced with `0` or reconstructed from partial or guessed data.
- [x] Per-metric failure handling is defined: each metric is evaluated independently; a valid metric remains visible even when another metric is unavailable, unless both are affected by the same shared source failure; stale values are never shown after a failed refresh; expired or unauthorized admin sessions hide all metrics.
- [x] No unresolved business clarifications remain for the current source-backed scope of 113.

## Final consistency note
- [x] The feature remains limited to the approved two KPI values and the documented admin-only, read-only behavior.
- [x] The spec documents no unsupported KPI additions, no timeline filter, no periodic refresh requirement, and no synthetic fallback values.
- [x] The checklist matches the final spec decisions and contains no artificial pending items.

## Verification checklist
- [x] The spec is written in English and follows the repository’s Spec Kit format.
- [x] The spec includes user scenarios, acceptance scenarios, edge cases, requirements, key entities, success criteria, and assumptions.
- [x] The spec distinguishes project-backed decisions from unresolved assumptions and open product questions.
- [x] The feature folder is created under the required path: `specs/110-admin-functions/113-platform-statistics`.
- [x] The required files are present: `spec.md` and `checklists/requirements.md`.
- [x] The draft reflects the confirmed policy decisions so far: admin-only access, read-only aggregate stats, no personal data leakage, zero-vs-unavailable state handling, and strict separation from 111 / 112 / 070 / 101.
- [x] No unresolved business clarifications remain for the current source-backed scope of 113.
