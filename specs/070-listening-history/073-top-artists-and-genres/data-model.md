# Data Model: Top Artists and Genres

**Feature**: [073 Top Artists and Genres](./spec.md)  
**Status**: Logical response model only; aggregate persistence is not selected.

## Logical Entities

### Artist Listening Rank

| Attribute | Meaning |
|---|---|
| Artist identity | Stable catalog artist identifier and display name. |
| Play count | Number of qualifying visible history events for the artist. |
| Listened seconds | Sum of actual listened duration for those events. |
| Rank | Position after ordering by listened seconds descending, then play count descending; final tie-breaker needs approval. |

Return no more than ten artists.

### Genre Play Distribution

Each genre tag has a name, qualifying play count, and percentage of all counted genre-tag assignments. Every tag associated with a played song receives one count per qualifying event; multi-tag songs increment each tag. Show the top 5–10 genres and aggregate remaining tags into Other.

### Track Play Rank

Stable song identity and approved display/playback fields plus qualifying play count, ordered by count descending with an approved deterministic tie-breaker. Return no more than ten tracks.

## Calculation Rules

- Use qualifying events (>=30 seconds) within the selected 7-day, 30-day, or 365-day range.
- Exclude hidden/cleared history immediately after re-aggregation.
- All time is bounded by the 365-day retention window.
- Artists use duration-first ordering, then play count; genres use play count; tracks use play count.
- Genre percentages use the sum of counted genre-tag assignments as denominator. Confirm whether UI needs percentages or counts only.
- The UC defines fewer than five qualifying events as the not-enough-data state. Confirm whether this gates all components or only the aggregate view.

## Persistence Decision

No stored aggregate, cache, schema, or database query is proposed. Use the approved 071 source of truth or a derived aggregate with an approved refresh/invalidation policy.

## Open Decisions

- Approved catalog source for multiple genre tags and stable metadata identities.
- API route and response schema, timezone boundaries, missing artist/genre behavior.
- Artist/song tie-breakers and scope of the five-event threshold.
- Cache/refresh freshness and how immediate hidden-state changes invalidate aggregates.
