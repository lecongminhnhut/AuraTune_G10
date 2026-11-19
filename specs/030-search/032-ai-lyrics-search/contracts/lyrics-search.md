# AI Lyrics Search API Contract

**Feature**: [032 AI Lyrics Search](../spec.md)  
**Status**: Approved for Implementation (Phase 1 Gates T001–T009 Resolved)  
**Shared conventions**: [AuraTune API Contract](../../../../docs/analysis-and-design/api-contract.md)

## Overview & Topology (T001 & T003 Resolved)

| Property | Public Caller-Facing Boundary | Internal AI Service Boundary |
| --- | --- | --- |
| **Method** | `GET` | `POST` |
| **Path** | `/api/v1/search/lyrics` | `/ai/search/lyrics` |
| **Owner** | Existing AuraTune Express Backend (`src/backend`) | Python FastAPI AI Service (`src/ai-service`) |
| **Access** | Public (no user access token required) | Internal only (`X-Internal-Api-Key` header via backend `.env`) |
| **Browser Access** | Yes (called by Frontend `aiLyricsSearchApi.js`) | **Forbidden** (never called directly from browser) |

### Execution & Fallback Flow

1. Frontend sends `GET /api/v1/search/lyrics?q=<fragment>&limit=20&offset=0` to the Express backend.
2. Express trims and validates query parameters (`>= 3` words, `<= 200` characters after trimming) and forwards `POST /ai/search/lyrics` to the internal Python AI Service with an enforced **3-second timeout** (`3000ms`).
3. **Normal AI Path (`200 OK`)**: Express resolves song metadata from Supabase (`public.songs` -> `public.albums` -> `public.artists`) and returns `meta.search_mode = "ai"`.
4. **Automatic Fallback Path (`HTTP 503` or `3s Timeout`)**: Express catches `503 AI_SERVICE_UNAVAILABLE` or timeout, automatically executes normalized lyrics-only keyword fallback against its in-memory/local cache indexed from Cloudinary (`public.songs.lyrics_url`), and returns `200 OK` with `meta.search_mode = "keyword_fallback"`.
5. **Non-Fallback Errors (`HTTP 400` / `429` / `500`)**: Express does **not** invoke keyword fallback; it returns the corresponding error envelope directly to the client.

---

## Public Request (`GET /api/v1/search/lyrics`)

Send query parameters using UTF-8 URL encoding. Unknown query parameters are rejected with `400 VALIDATION_ERROR`.

| Parameter | Required | Type | Default | Validation Rules |
| --- | --- | --- | --- | --- |
| `q` | Yes | string | — | Trim leading/trailing whitespace and collapse repeated internal whitespace. Must contain **at least 3 words** and **at most 200 characters** after trimming. |
| `limit` | No | integer | `20` | Inclusive range `1`–`50`; default batch size is `20`. |
| `offset` | No | integer | `0` | Non-negative integer (`>= 0`) indicating the starting result index. |

### Internal AI Service Request (`POST /ai/search/lyrics`)

Sent exclusively by the Express backend to the internal Python AI Service (`X-Internal-Api-Key` required):

```json
{
  "query": "thanh pho ngu chi con tieng mua",
  "limit": 20,
  "offset": 0
}
```

---

## Successful Response (`200 OK`) (T002 & T005 Resolved)

Uses AuraTune's shared response envelope, extended with `pagination` (matching Feature 031) and `meta.search_mode` so the frontend deterministically renders the dismissible inline fallback banner when backend fallback occurs.

```json
{
  "success": true,
  "message": "Lyrics search results retrieved",
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
      "matched_lyric": "Thành phố ngủ, chỉ còn tiếng mưa"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "next_offset": null,
    "has_more": false
  },
  "meta": {
    "search_mode": "ai"
  },
  "error": null
}
```

### Result Item Schema (`data[]`)

| Field | Type | Required | Nullable | Source / Mapping |
| --- | --- | --- | --- | --- |
| `id` | `string` | Yes | No | `String(songs.song_id)` |
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
| `matched_lyric` | `string` | Yes | Yes | Best matching plain lyric line/snippet (`null` if unavailable) |

### Pagination & Meta Schema

- `pagination`: `{ limit, offset, next_offset, has_more }` — identical semantics to Feature 031 (`next_offset = has_more ? offset + data.length : null`).
- `meta.search_mode`: Enum `"ai"` | `"keyword_fallback"`. When `"keyword_fallback"`, the frontend displays the dismissible inline fallback banner above results until dismissed or a new search is submitted.

---

## Normalization & Fallback Ranking Rules (T004 & T007 Resolved)

- **Lyric Index Source**: Raw `.lrc` / `.txt` files hosted on Cloudinary via `public.songs.lyrics_url` are stripped of LRC timestamps (e.g., `[00:15.20]`) and cached in memory/local index by the backend/AI service.
- **Normalization**: Trim leading/trailing whitespace, collapse internal whitespace, convert to lowercase, strip Unicode NFD diacritics, and remove punctuation.
- **Lyrics-Only Scope**: Keyword fallback searches normalized lyric text **only**; title, artist, album, and playlist matches are excluded.
- **Deterministic Fallback Ordering**:
  1. Exact normalized phrase match (`normalizedLyric.includes(normalizedQuery)`).
  2. Higher count of distinct matched normalized query words.
  3. Deterministic tie-breaker: `songs.total_plays DESC NULLS LAST, songs.song_id ASC`.

---

## Error Responses

| HTTP Status | Error Code | Trigger Condition | Client & Fallback Behavior |
| --- | --- | --- | --- |
| `400` | `VALIDATION_ERROR` | `< 3` words or `> 200` chars after trimming, invalid `limit`/`offset`, or unknown query params. | Show local/API validation feedback; **do not** fallback. |
| `429` | `RATE_LIMITED` | Shared rate-limit middleware or AI service quota limit. | Show retryable rate-limit message; **do not** fallback. |
| `503` | `AI_SERVICE_UNAVAILABLE` | Internal AI service returns `503` or exceeds `3000ms` timeout (handled by Express to trigger fallback). | Express automatically runs `keyword_fallback`; returns `503` only if fallback itself is unavailable. |
| `500` | `INTERNAL_ERROR` | Unexpected catalog, cache, or internal server failure. | Show error state with retry action; **do not** show stale results. |