# Interface Contract — Feature 091 Artist Profile

**Status**: Established route/envelope contract plus required behavior; artist wire payloads are **pending D06/D07**. This document does not invent approved JSON field names, parameters, pagination or database schema. [Decision register](../research.md#unresolved-decisions-and-implementation-gates).

## Existing HTTP surface

Base `/api/v1`, as defined by the [shared API Contract](../../../../docs/analysis-and-design/api-contract.md) §1/2.8 and [conventions](../../../../docs/design/api/api-conventions.md).

| Method/path | Existing contract responsibility | 091 obligation |
| --- | --- | --- |
| GET `/artists/:id` | Public artist information + featured songs | Public identity and ≤5 eligible featured songs with required order; identity must survive a featured-only failure using the reviewed D06 composition |
| GET `/artists/:id/songs` | Public artist songs | Same parent visibility gate; D06 must decide exact featured retry semantics without silently changing a general catalog endpoint into a five-song list |
| GET `/artists/:id/albums` | Public artist albums | Complete eligible ordered albums; transport completeness agreed in D07 |
| GET `/artists/:id/playlists` | Public related playlists | ≤6 official public playlists containing eligible artist song, ordered exactly |

All four endpoints must work without a token. Requests have no body. Artist ID format/validation depends on canonical catalog IDs (D02); mocks use slugs, reference ER uses stable IDs, auth uses text IDs, so no UUID/numeric-only validator is assumed. No query parameters for these paths are established by the shared contract. Document and review any needed parameters before implementation.

Every path checks that the parent is public and eligible before returning any data. Child requests must not disclose a hidden artist through success-empty versus not-found differences. Public GETs never provide a Studio/Admin bypass. Use backend-only access; no browser Supabase/service-role calls. Anonymous requests must remain independent of expired/banned-account sessions; the planned public adapter sends no token or cookies. Personalized projections are not silently introduced.

## Existing response envelope and errors

Successful JSON retains `success: true`, `message`, `data`, `error: null`; failed JSON retains `success: false`, `message`, `data: null`, `error: {code, details}`. No raw rows or alternate `status: 'error'` format.

| Outcome | HTTP / shared code | Profile interpretation |
| --- | --- | --- |
| Valid public result | 200 | Render approved public data; successful zero eligible items means section empty |
| Malformed ID | 400 / `VALIDATION_ERROR` | Neutral invalid/not-found presentation; no existence information; exact validator D02 |
| Unknown, deleted, wrong entity type, or non-public artist | 404 / `NOT_FOUND` | Identical status, generic message, null data and non-disclosing details on detail AND children |
| Unexpected catalog read failure | 500 / `INTERNAL_ERROR` | Retryable full/section error according to failing boundary; never convert to 404/empty |
| Rate limit if shared infrastructure applies | 429 / `RATE_LIMITED` | Temporary error/retry; no fabricated empty data |

The existing `503 / AI_SERVICE_UNAVAILABLE` is AI-specific and must not be reused for ordinary catalog failure. New general service-unavailable status/code combinations require shared-contract agreement. Do not fabricate per-section error codes. No auth-specific 401/403 is required for these public reads; protected follow/Studio endpoints retain their own policies.

Illustrative **existing-envelope** not-found response (no new artist schema):

```json
{
  "success": false,
  "message": "Artist not found",
  "data": null,
  "error": { "code": "NOT_FOUND", "details": [] }
}
```

Use the same externally visible response for unknown and non-public records. Never include artist name/image/bio, record-exists booleans, hidden/disabled reasons or related content in errors. Generic server diagnostics must not include tokens, raw database errors or private rows. This specifies response non-disclosure, not a new constant-time transport requirement.

## Required content semantics, independent of serialization

- Public artist identity contains stable ID, public name and optional public image/biography only.
- Featured: associated + displayable + playable, distinct song IDs, AuraTune all-time count descending → release date descending → song ID ascending; ≤5 after filtering/deduplication.
- Albums: associated + viewable, distinct IDs, release date descending → title ascending → ID ascending; all eligible albums, not a silent database default page.
- Playlists: official AND public AND viewable, with at least one displayable/playable artist song anywhere in catalog; distinct IDs; update time descending → ID ascending; ≤6.
- Selection metadata suffices for the existing destination. Do not expose source account data, private membership, internal eligibility flags/reasons or unfiltered totals.
- D05 settles canonical fields, null ordering, title collation and typed IDs. [Data model](../data-model.md) defines the logical pipeline.

## Required partial-failure contract review

D06 must choose and specify, with exact reviewed payload examples:

1. Detail identity/featured success, including zero featured songs.
2. Identity success with featured failure while albums/playlists may succeed; failure must not masquerade as an empty list or make identity fail.
3. Targeted featured retry using a reviewed existing-path behavior, without losing other loaded sections.
4. Album/playlist success-empty versus temporary HTTP error, with retry via the same path.
5. Public-parent recheck failure during a child request: whole profile invalidated rather than keep restricted cached identity.
6. Complete album transfer, including default Supabase row caps and changes between pages (D07).
7. Exact DTO field names/types/nullability, content-ID type, presentation metadata and any authorized sorting inputs; no mock-to-wire inference.

Recommended composition retains detail identity-plus-featured responsibility with separate featured outcome; alternative independent identity retrieval requires explicit reconciliation of the shared detail description. Both require review. Do not ship a hypothetical `sections`, `status`, `featuredSongs`, cursor or `limit=5` field merely because it would be convenient.

After D06/D07 close, publish reviewed OpenAPI **3.0.3** JSON within this directory and align shared documentation through its owners, as required by Vision §6.4. Final wire schemas/examples, query parameters, pagination and response validation tests are an implementation gate. This planning pass intentionally does not label an incomplete OpenAPI file as implementation-ready.

## Frontend integration contract

The proposed service translates approved wire fields into an internal safe presentation model; logical names in [data-model.md](../data-model.md) are not wire keys. It uses the existing API base and public fetch semantics, propagates HTTP/read errors without turning them into empty arrays, and associates results with artist ID/request generation.

| Boundary | Required behavior |
| --- | --- |
| Identity load | Distinct loading, public success, not-found, retryable failure |
| Section load | Distinct loading, available, empty and retryable failure; peer successes retained |
| Route change/retry race | Abort/ignore old generation; never render another artist's response |
| Parent no longer public | Clear all profile data, invalidate pending older responses |
| Album selection | Existing `/album/:id` navigation; no profile-owned playback |
| Playlist selection | Existing `/playlist/:id` navigation; no profile-owned playlist logic |
| Song selection | Existing destination confirmed by D09; no new route/player semantics |

No follow status/control, upload/edit/hide/delete, artist editing or administrative action is introduced. Existing 092 composition remains separately owned and must not become a prerequisite for public profile rendering.

## Contract acceptance gate

Test all paths anonymously, including direct child calls for nonexistent/non-public artists; match non-disclosing not-found outcomes. Assert allowlisted fields and no hidden counts. Shuffle fixtures to prove exact ties/filter-before-limit/dedup, test playlist qualification through a nonfeatured song and all-album completeness. Inject independent section failures and retry; verify no whole-page collapse, false-empty state, credential refresh dependency or side effects. Final schema validation requires the reviewed OpenAPI artifact above.
