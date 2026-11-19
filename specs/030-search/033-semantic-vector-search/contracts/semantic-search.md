# Semantic Vector Music Search API Contract

**Feature**: [033 Semantic Vector Music Search](../spec.md)  
**Status**: Approved for Implementation (Phase 1 Gates T001–T010 Resolved — Zero-New-Route Alignment with `api-contract.md`)  
**Shared conventions**: [AuraTune API Contract](../../../../docs/analysis-and-design/api-contract.md)

## Service Boundary & Topology (T001 & T003 Resolved)

To keep `docs/analysis-and-design/api-contract.md` completely unchanged, Semantic Vector Search extends the existing public `GET /search` route via `mode=semantic` and reuses the existing internal `POST /ai/recommend` AI Service boundary.

| Property | Public Caller-Facing Boundary | Internal AI Service Boundary |
| --- | --- | --- |
| **Method** | `GET` | `POST` |
| **Path** | `/api/v1/search?mode=semantic` | `/ai/recommend` |
| **Owner** | Existing AuraTune Express Backend (`src/backend`) | Python FastAPI AI Service (`src/ai-service`) |
| **Access** | Public / Listener (optional `Authorization: Bearer <token>` used solely to load local user profile for Privacy Guard) | Internal only (`X-Internal-Api-Key` header via backend `.env`) |
| **Browser Access** | Yes (via Frontend `semanticSearchAdapter.js`) | **Forbidden** (never called directly from browser or third-party client) |

### Execution, Privacy & Fallback Flow

1. Frontend sends `GET /api/v1/search?q=<query>&mode=semantic&limit=20&offset=0` to the Express backend. (Requests omitting `mode` or passing `mode=metadata` continue executing Feature 031 Metadata Search).
2. Express validates the query (`>= 1` meaningful alphanumeric token, `<= 150` characters after trimming) and runs the **local Privacy Guard** (`semanticPrivacyGuard.js`).
3. If the query contains unremovable PII (authenticated profile name/email, detected email patterns, or ambiguous personal names not matching the cached `public.artists.name` whitelist), Express **skips the AI Service** and executes local keyword fallback (`meta.search_mode = "keyword_fallback"`).
4. Otherwise, Express forwards sanitized `POST /ai/recommend` (`purpose: "semantic_search"`) to the internal Python AI Service with an enforced **1,500 ms deadline** (`AbortSignal.timeout(1500)`).
5. If the AI Service returns `200 OK` with valid, safe candidate `song_id` rankings within 1,500 ms, Express hydrates track metadata from Supabase (`public.songs` -> `public.albums` -> `public.artists`), deduplicates results, and returns `meta.search_mode = "semantic"`.
6. If the AI Service times out (`> 1500 ms`), returns `503`, returns `429` (internal rate limit), or fails schema/safety validation, Express automatically executes keyword fallback without retrying and returns `200 OK` with `meta.search_mode = "keyword_fallback"`.

---

## Public Request (`GET /api/v1/search?mode=semantic`)

Unknown query parameters are rejected with `400 VALIDATION_ERROR`.

| Parameter | Required | Type | Default | Validation Rules |
| --- | --- | --- | --- | --- |
| `q` | Yes | string | — | Trim surrounding whitespace. Must contain at least one meaningful alphanumeric token and be `<= 150` characters. Preserves emojis, punctuation, and supported languages. |
| `mode` | Yes (for 033) | string | `"metadata"` | Must be `"semantic"` to invoke Semantic Vector Search. |
| `limit` | No | integer | `20` | Inclusive range `1`–`50`; default `20`. |
| `offset` | No | integer | `0` | Non-negative integer (`>= 0`). |

### Internal AI Service Request (`POST /ai/recommend`)

Sent exclusively by the Express backend after local PII sanitization (`X-Internal-Api-Key` required):

```json
{
  "purpose": "semantic_search",
  "query": "lofi chill de code mua dem",
  "limit": 20,
  "offset": 0
}
```

---

## Successful Response (`200 OK`) (T004 & T007 Resolved)

Returns ranked, deduplicated **track** results only (playlist generation remains on `POST /playlists/ai-generate`).

```json
{
  "success": true,
  "message": "Semantic search results retrieved",
  "data": [
    {
      "id": "101",
      "type": "track",
      "title": "Midnight Coffee",
      "artist": "AuraTune Studio",
      "artist_id": "12",
      "album": "Lofi bên cửa sổ",
      "album_id": "5",
      "genre": "lofi",
      "release_date": "2026-01-15",
      "duration_seconds": 210,
      "play_count": 204000,
      "cover_url": "https://res.cloudinary.com/auratune/image/upload/v1/covers/101.jpg",
      "ai_reason": "Beat nhẹ, ít lời, phù hợp không gian tập trung ban đêm."
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "next_offset": null,
    "has_more": false
  },
  "meta": {
    "search_mode": "semantic"
  },
  "error": null
}
```

### Result Item Schema (`data[]`)

| Field | Type | Required | Nullable | Source / Mapping |
| --- | --- | --- | --- | --- |
| `id` | `string` | Yes | No | `String(songs.song_id)` (deduplicated across result set) |
| `type` | `string` | Yes | No | Constant discriminator `"track"` |
| `title` | `string` | Yes | No | `songs.title` |
| `artist` | `string` | Yes | No | `artists.name ?? "Unknown Artist"` |
| `artist_id` | `string` | No | Yes | `artists.artist_id ? String(artists.artist_id) : null` |
| `album` | `string` | No | Yes | `albums.title ?? null` |
| `album_id` | `string` | No | Yes | `songs.album_id ? String(songs.album_id) : null` |
| `genre` | `string` | No | Yes | `songs.genre ?? null` |
| `release_date` | `string` | No | Yes | ISO `YYYY-MM-DD` from `albums.release_date ?? null` |
| `duration_seconds` | `integer` | No | Yes | `songs.duration ?? 0` |
| `play_count` | `integer` | No | Yes | `songs.total_plays ?? 0` |
| `cover_url` | `string` | No | Yes | `songs.image_url ?? albums.image_url ?? null` |
| `ai_reason` | `string` | No | Yes | Optional privacy-safe short context note for the AI understanding card (`null` in `keyword_fallback` mode or if unavailable) |

---

## Semantic Ranking & Tie-Breaking Contract (T004 & T007 Resolved)

- **Score Owner:** Calculated inside the Python AI Service (`POST /ai/recommend` with `purpose: "semantic_search"`) and returned as a normalized relevance score in `[0.0, 1.0]`.
- **Weighted Ensemble:**
  - Metadata similarity: **30%** (sourced from `public.songs`, `albums`, `artists`)
  - Lyrics similarity: **40%** (sourced from cached plain lyrics indexed via `public.songs.lyrics_url`)
  - Audio-characteristic similarity: **30%** (sourced from available audio fields; `public.songs.duration` is currently populated in PostgreSQL, while unpopulated attributes are treated as absent dimensions without fabrication)
- **Availability Re-normalization:** For any query/song pair where one or more dimensions are absent, weights are re-normalized across available dimensions (`w_d / sum(w_available)`).
- **Deduplication & Tie-Breaking:** Duplicate `song_id` entries are removed (retaining the highest score). Equal semantic scores are ordered deterministically by `songs.total_plays DESC NULLS LAST, songs.song_id ASC`.

---

## Privacy, Timeout & Error Handling (T006 & T008 Resolved)

- **Privacy Guarantee:** Listener `name`, `display_name`, `email`, and redacted PII are stripped/blocked locally before external AI calls and are never written to AI requests, diagnostics, logs, or error payloads. Recognized catalog artists (`public.artists.name`) are preserved.
- **Unsafe AI Response Policy:** Responses failing schema validation, referencing non-existent catalog IDs, or containing PII patterns are rejected as unsafe and routed to `keyword_fallback`.
- **Timeout Threshold:** Keyword fallback triggers at **1,500 ms** (`FR-016` / `SC-003a`), separate from the **3,000 ms** end-to-end initial-result goal (`SC-003`).

| HTTP Status | Error Code | Trigger Condition | Client & Fallback Behavior |
| --- | --- | --- | --- |
| `400` | `VALIDATION_ERROR` | Empty/whitespace query, no alphanumeric token, `> 150` chars, or invalid pagination/unknown query params. | Show local validation guidance; **do not** call AI or fallback. |
| `429` | `RATE_LIMITED` | Public API rate-limit middleware rejects the client request. *(Internal AI HTTP 429 triggers `keyword_fallback` automatically instead of returning 429).* | Show retryable rate-limit state. |
| `500` | `INTERNAL_ERROR` | Both semantic processing and catalog keyword fallback fail unexpectedly. | Show unavailable-catalog / error state without exposing PII or stack traces. |