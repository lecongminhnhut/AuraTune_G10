# Research: Listening Duration Analytics

**Feature**: [072 Listening Duration Analytics](./spec.md)  
**Status**: Draft; data source and analytics API contract need approval.

## Findings

| Topic | Finding | Planning consequence |
|---|---|---|
| Current UI | `HistoryPage.jsx` calculates top artists/genres client-side from demo history and duration metadata. | Reuse UI patterns only; production aggregation must be backend-owned per FR-007. |
| Required outputs | 7-day, 30-day, and all-time (365-day) total duration; top five artists by duration; daily totals for previous seven days. | Keep these as separate, explicit outputs and preserve the fixed seven-day trend regardless of selected summary range. |
| Qualifying events | 30-second minimum; hidden/cleared entries excluded. | Share 071 qualification and visibility semantics. |
| Data source | Database docs describe listening_history and user_listening_stats but state source/schema decisions are unresolved. | Do not assume cached aggregates or a particular SQL query. Determine event-level duration availability before design. |
| Performance | Spec targets under 1.5 seconds for up to 10,000 events. | Measure from client request through rendered data using representative data; choose aggregation strategy after source review. |

## Decisions and Open Gates

- Confirm whether each event stores actual listened seconds; full song duration is not equivalent to actual listened duration.
- Approve stats endpoint/response, timezone source, and range boundary semantics.
- Keep top five artists by duration in 072 even though 073 also has a separate top-ten ranking; 073's explicit FR-001 determines its own ordering.
- Confirm aggregation freshness after hide/clear changes. Do not infer cache invalidation or materialized views.

## Sources

- UC-070-005 and G07 use-case inventory coverage table.
- `docs/design/database/README.md`, `data-consistency.md`, `security-rules.md`.
- Existing History page and AppStore; 033 artifact approach for explicit open decisions.
