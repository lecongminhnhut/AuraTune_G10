# Data Model: AI Lyrics Search

**Feature**: [032 AI Lyrics Search](./spec.md)  
**Status**: Logical feature model only; no persistence schema is proposed.

## Persistence Decision

The feature specification and inspected code do not establish a production lyric catalog schema. Existing lyric data in frontend fixtures is demo-only. This feature plan therefore proposes no database table, migration, or storage technology. The approved lyrics source and song identity mapping must be confirmed before implementation.

## Logical Entities

### Lyric Search Query

Represents the submitted fragment and the client-side identity required to associate results and messages with the current search.

| Attribute | Constraint / meaning |
|---|---|
| Submitted fragment | User-entered text; trim leading/trailing whitespace before validation. |
| Normalized fragment | Whitespace-normalized representation for request preparation and fallback matching; exact punctuation/diacritic normalization policy needs alignment with the existing project behavior. |
| Word count | Must be at least 3 after whitespace normalization. |
| Character count | Must be no more than 200 after trimming. |
| Current request identity | Client-side identity used to ignore stale AI, fallback, or pagination responses. Not a persisted identifier. |

### AI Lyrics Search Result

Represents a song match returned by the approved AI search contract. Song identity, display metadata, lyric context, and response field names are **not defined here** because the API schema has not been approved. The implementation must map only fields documented by the approved contract and sufficient for the existing song result/playback UI.

### Keyword Search Result

Represents a song matched by fallback against normalized lyric text only. A title-only or artist-only match is not eligible. Rank exact normalized phrase matches above results containing more of the submitted query words. Equal-rank ordering remains unresolved.

### Search Mode Notice

Represents the client display state indicating that the current result set came from keyword fallback after AI unavailability. It is shown as a dismissible inline banner above fallback results, remains visible until dismissed or a new search is submitted, and does not block result inspection. Whether the API returns a mode field is unresolved; the client must not assume one.

### Result Batch

Represents up to 20 matches associated with the current query and request identity. The next-batch token/offset and `has_more` representation are unresolved until the API contract is approved. The UI exposes Load More only when the approved continuation mechanism indicates additional results.

## State Transitions

```text
Idle -> Validating -> Loading AI
Loading AI -> AI Results | Empty | Unavailable -> Loading Fallback -> Fallback Results | Empty | Error
Loading AI -> Rate Limited (429) | Error (other failure)
Any in-flight state -> New Query (old response ignored)
Results -> Loading More -> Appended Batch | Error
Fallback Results -> Notice Dismissed
```

## Open Data Decisions

- Canonical lyric source/index and availability/rights assumptions.
- Song identity and playback metadata mapping for AI/fallback results.
- Approved API response fields and pagination continuation format.
- Exact normalization rules for punctuation and diacritics.
- Deterministic ordering among fallback candidates with equal primary rank.
