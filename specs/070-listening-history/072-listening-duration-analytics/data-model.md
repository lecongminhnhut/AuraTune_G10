# Data Model: Listening Duration Analytics

**Feature**: [072 Listening Duration Analytics](./spec.md)  
**Status**: Logical response model; no aggregate persistence schema is selected.

## Logical Entities

### Listening Duration Summary

| Attribute | Meaning |
|---|---|
| Range | One of 7 days, 30 days, or all time within the 365-day retention window. |
| Total listened seconds | Sum of qualifying, visible event listening duration in the selected range. |
| Qualifying play count | Number of qualifying visible events in the selected range. |
| Unique song count | Number of distinct songs with at least one qualifying visible event in the selected range. |

### Artist Duration Ranking

Artist identity/display name plus aggregate listened seconds for qualifying visible events in the selected range; return at most five, ordered by duration descending with a deterministic tie-breaker to be approved.

### Daily Listening Total

Calendar date and aggregate listened seconds for each of the previous seven days, including zero-value dates where the presentation requires a continuous chart. The timezone defines date boundaries and must be approved.

## Calculation Rules

- Include only >=30-second qualifying sessions, in keeping with 071/072 requirements.
- Exclude hidden and cleared events immediately after the source change is committed.
- Bound the selected range by the approved listener timezone and inclusive/exclusive boundary convention.
- The daily trend always covers the previous seven days, regardless of the summary range selector.
- All time is capped by 071's 365-day retention.

## Persistence Decision

No materialized view, cache, database schema, or SQL query is proposed. Aggregate from the approved source of truth or use an approved derived store with a documented refresh/invalidation strategy.

## Open Decisions

- Source for actual listened seconds and event qualification.
- Timezone source and exact day/range boundary semantics.
- Artist identity join behavior for missing/deleted catalog metadata.
- Deterministic tie-breakers, refresh latency, and API response field names.
