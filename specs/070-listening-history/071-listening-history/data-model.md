# Data Model: Listening History

**Feature**: [071 Listening History](./spec.md)  
**Status**: Logical model only. The repository does not confirm a production database or migration schema.

## Persistence Decision

No physical schema or migration is proposed. Database documentation mentions PostgreSQL-style tables but explicitly says the current database choice is unconfirmed; Firestore documentation is a template, not an approved design. Confirm the canonical store before implementation.

## Logical Entities

### Listening History Event

One qualifying playback session belonging to one authenticated listener.

| Attribute | Meaning / constraint |
|---|---|
| Event identity | Stable unique identity required for pagination and safe retry handling; exact representation is pending storage/API approval. |
| Owner | Authenticated user identity; required and derived from the authenticated session, never trusted from request input. |
| Song identity | Stable catalog song identity; missing/deleted catalog behavior needs alignment with catalog policy. |
| Played at | Timestamp for the qualifying event; stored and compared consistently in UTC, rendered in the listener's local timezone. |
| Listened duration | Actual elapsed playback seconds needed by analytics; not present in the minimal historical FR-003 fields and must be confirmed against the 072 source requirement. |
| Visibility/deletion state | Supports the agreed hidden/cleared behavior. Clearing history permanently excludes events from personal stats and recommendations; the precise physical deletion vs tombstone approach is unresolved. |

## Qualification Rules

- A session qualifies at 30 seconds of playback.
- A track shorter than 30 seconds qualifies at >=90% completion.
- Each qualifying replay is a distinct event.
- A session must not produce multiple events as progress callbacks repeat. Retry idempotency depends on an approved event identity/contract.
- Events older than 365 days are purged.

## Relationships and Access

- One user owns many history events; one song may appear in many events.
- A listener may read, paginate, replay from, or clear only their own history.
- Hidden/cleared/expired events are excluded from analytics and recommendation inputs immediately after the defined state change.

## Open Decisions

- Canonical database, physical field names, indexes, and retention job implementation.
- Whether actual listened seconds are persisted per event or derived elsewhere; 072 analytics requires an accurate source.
- Hard delete versus tombstone for clear-all, including how the recommendation pipeline observes the purge.
- Cursor format, stable sort tie-breaker, and API contract.
