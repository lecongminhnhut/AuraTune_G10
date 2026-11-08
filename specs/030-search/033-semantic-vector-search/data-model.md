# Data Model: Semantic Vector Music Search

**Feature**: [033 Semantic Vector Music Search](./spec.md)
**Status**: Logical model only; no persistence schema, catalog ingestion process, or vector-index implementation is approved.

## Persistence Decision

No database migration or semantic index schema is proposed. The feature spec identifies what content dimensions must be searchable, but the repository does not establish the production catalog source, audio-field availability, vector storage, or index lifecycle. Project-plan ED-06 and ED-08 also leave catalog selection and AI/vector technology decisions outstanding. Resolve those decisions before creating persistence or ingestion work.

## Logical Entities

### Search Query

Represents the Listener's natural-language mood, emotion, or context request.

| Attribute | Constraint / meaning |
|---|---|
| Original query | User-entered text; keep only within the trusted application boundary for the active request and do not add persistent search-history storage in this feature. |
| Normalized query | A meaning-preserving normalized form; behavior must handle supported languages, punctuation, emojis, and common variations. Exact normalization policy remains to be defined. |
| Validation status | Accept a query containing at least one meaningful alphanumeric token up to 150 characters; reject empty/whitespace-only and over-limit input with clear feedback and no semantic request. |
| Privacy decision | Local result indicating safe sanitized processing or keyword fallback when identity data cannot be safely removed. Must not expose PII. |
| Search mode | Semantic or keyword fallback for the current search; expose fallback mode clearly when fallback is used. An API mode field is not approved. |
| Request identity | Client-side association to prevent stale responses from updating the current search; not persisted by this logical model. |

### Music Search Document

Represents the searchable content for a song. The actual source, storage, and service representation are unresolved.

| Content dimension | Required content |
|---|---|
| Metadata | Song metadata available from the approved catalog. Exact fields are not enumerated by this feature spec. |
| Lyrics | Lyrics available from the approved catalog; missing lyrics do not make a song ineligible. |
| Audio characteristics | BPM/tempo, key, mode, energy, valence, danceability, acousticness, instrumentalness, speechiness, loudness, liveness, time signature, and duration, when available. |
| Song identity | Stable identifier and the standard metadata needed to identify/play the result; exact contract fields remain pending. |

The model must not include listener names or email addresses in content sent to a third-party AI service.

No canonical production catalog, availability guarantee, or owner is established for the listed dimensions. Treat missing lyrics, metadata, and audio characteristics as unavailable dimensions rather than fabricated values; the matching song remains eligible using dimensions present for both query and song.

### Semantic Representation

Represents the comparable semantic form of a sanitized query and available song content. The representation may be embedding/vector-based because the feature specifies vector search, but its data shape, model, storage, and generation process are not selected here. Do not infer a particular vector dimension or provider.

### Similarity Dimensions and Score

The feature requires metadata similarity (30%), lyric similarity (40%), and audio-characteristic similarity (30%). For each query/song pair, re-normalize weights only across dimensions available for both. The service contract must clarify whether dimension scores are returned to the backend or combined inside the AI service. Equal-score tie-breaking is not specified.

### Search Result

Represents a ranked song result with no duplicate song entries and enough standard song information to identify and initiate existing playback. Additional score/explanation fields may only be exposed if they are approved by the API contract.

### Search Mode

Represents whether results came from semantic processing or keyword fallback. The UI must clearly indicate fallback mode. Whether the API returns an explicit mode field or the application derives it from the request transition is unresolved.

## State Transitions

```text
Idle -> Validating -> Local Privacy Check
Local Privacy Check -> Safe Semantic Request | Keyword Fallback (unsafe/ambiguous)
Safe Semantic Request -> Semantic Results | Empty | Invalid/Unavailable/Timeout -> Keyword Fallback
Keyword Fallback -> Fallback Results | Empty | Catalog Unavailable
Semantic request -> AI-service HTTP 429 -> Keyword Fallback
Any pending request -> New Query (older response ignored)
```

## Open Data Decisions

- Canonical searchable catalog and stable song/playback identity mapping.
- Availability and source for each audio-characteristic field.
- Index/vector representation, dimensions, generation, persistence, and update lifecycle.
- Exact normalized query behavior and score ownership (client/service).
- API response fields, explanation policy, semantic/fallback mode indicator, and tie-breaking rule.
- Trusted source of profile identity and catalog artist names for local privacy detection.
- Provider, embedding/vector representation, persistence, and index generation/update lifecycle.

An HTTP 429 from the internal AI dependency follows the feature's AI-unavailability fallback behavior. This logical model does not define retries or change how the public API handles its own rate limit.
