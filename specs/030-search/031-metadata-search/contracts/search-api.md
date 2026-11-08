# Metadata Search API Contract

## Overview

| Property | Contract |
| --- | --- |
| Method | `GET` |
| Route | `/search` |
| Full path | `/api/v1/search` |
| Base path | `/api/v1` |
| Access | Public; no access token is required |
| Owner | Existing AuraTune Express backend |
| Data source | Approved PostgreSQL catalog accessed through Supabase |
| Content types | Tracks, artists, albums, and playlists |

The endpoint follows the shared response and error conventions in [`docs/analysis-and-design/api-contract.md`](../../../../docs/analysis-and-design/api-contract.md). Search extends the standard envelope with a top-level `pagination` object on successful responses.

## Request

The request has no body. Send query parameters using UTF-8 URL encoding. Unknown query parameters are rejected with `400 VALIDATION_ERROR` so callers cannot rely on unapproved behavior.

| Parameter | Required | Type | Default | Rules |
| --- | --- | --- | --- | --- |
| `q` | Yes | string | — | Trim surrounding whitespace. Must contain 2–100 characters after trimming. Search is case-, diacritic-, and punctuation-insensitive. |
| `type` | No | enum | `all` | One of `all`, `tracks`, `artists`, `albums`, `playlists`. Restricts results to that category. |
| `limit` | No | integer | `20` | Inclusive range `1`–`50`; maximum page size is 50 items. |
| `offset` | No | integer | `0` | Integer greater than or equal to zero; identifies the first result position for this batch. |
| `genre` | No | string | — | Canonical genre ID from the approved catalog (for example, `vpop`, `indie`, `rnb`, `lofi`, `ballad`, or `chill`). Applies to tracks and albums only. |
| `release_year` | No | integer | — | Four-digit calendar year. Matches the year portion of the catalog `release_date`; applies to tracks and albums only. |
| `sort` | No | enum | `relevance` | One of `relevance`, `plays`, `newest`, `title`; applicability is defined below. |

### Parameter applicability

- `genre` and `release_year` are valid for `type=tracks` and `type=albums`.
- With `type=all`, either metadata filter narrows the response to matching tracks and albums; artists and playlists are omitted because those entities do not have the corresponding catalog attributes.
- Supplying `genre` or `release_year` with `type=artists` or `type=playlists` returns `400 VALIDATION_ERROR`.
- `relevance` is valid for every type and uses the search service's default relevance order. No numeric ranking formula is part of this contract.
- `plays` is valid for `type=all` and `type=tracks`; it orders track results by `play_count` descending. For `type=all`, other result groups retain their default order.
- `newest` is valid for `type=all`, `type=tracks`, and `type=albums`; it orders applicable results by `release_date` descending. For `type=all`, artists and playlists retain their default order.
- `title` is valid for every type and orders each result group by its display name ascending using the project's Vietnamese locale rules.
- A non-default sort that is not applicable to the selected `type` returns `400 VALIDATION_ERROR`.
- When `type=all`, results are grouped in this order: tracks, artists, albums, playlists. The selected sort is applied within each applicable group; it does not interleave different entity types.

### Request examples

```http
GET /api/v1/search?q=co%20em&type=all&limit=20&offset=0
GET /api/v1/search?q=lofi&type=tracks&genre=lofi&release_year=2026&sort=newest
GET /api/v1/search?q=vu&type=artists&sort=title
```

## Successful response

Return `200 OK` using the shared envelope. `data` is always an array on success, including when no items match. `pagination` is always present on success.

```json
{
  "success": true,
  "message": "Search results retrieved",
  "data": [
    {
      "id": "t3",
      "type": "track",
      "title": "Có em",
      "artist": "Madihu, Low G",
      "artist_id": "madihu",
      "album": "Có em",
      "album_id": "al-co-em",
      "genre": "rnb",
      "release_date": "2023-04-21",
      "duration_seconds": 224,
      "play_count": 842000,
      "cover_url": "https://cdn.example.test/covers/t3.jpg"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "next_offset": null,
    "has_more": false
  },
  "error": null
}
```

### Result item schema

`data` is a mixed array when `type=all`, or contains only the requested entity type otherwise. Every item has a string `id` and a singular `type` discriminator. IDs are opaque to clients. Type-specific fields are:

| `type` | Required identifying fields | Optional metadata fields |
| --- | --- | --- |
| `track` | `id`, `type`, `title`, `artist` | `artist_id`, `album`, `album_id`, `genre`, `release_date`, `duration_seconds`, `play_count`, `cover_url` |
| `artist` | `id`, `type`, `name` | `role`, `avatar_url` |
| `album` | `id`, `type`, `title`, `artist` | `artist_id`, `genre`, `release_date`, `cover_url` |
| `playlist` | `id`, `type`, `title` | `description`, `owner`, `track_count`, `cover_url` |

Dates use ISO 8601 calendar date format (`YYYY-MM-DD`). `duration_seconds` and `play_count` are non-negative integers; `track_count` is a non-negative integer. Nullable optional values are returned as `null` when the field is part of the selected result representation but catalog data is absent. The `type` discriminator is the only basis clients should use to select a result renderer.

### Pagination schema

| Field | Type | Meaning |
| --- | --- | --- |
| `limit` | integer | Effective page size used by the request. |
| `offset` | integer | Starting result position for this response. |
| `next_offset` | integer or `null` | `offset + data.length` when more results are available; otherwise `null`. |
| `has_more` | boolean | `true` when another batch is available; otherwise `false`. |

Clients request another batch only when `has_more` is `true`, passing `next_offset` as the next `offset`. Empty successful results use `data: []`, `next_offset: null`, and `has_more: false`.

## Error responses

Errors follow the shared error envelope and never include a successful pagination object.

```json
{
  "success": false,
  "message": "Search query is invalid",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "q", "issue": "Must contain between 2 and 100 characters after trimming" }
    ]
  }
}
```

| HTTP status | Error code | When to return |
| --- | --- | --- |
| `400` | `VALIDATION_ERROR` | Missing/short/overlong `q`, invalid `type`, non-integer or out-of-range `limit`, invalid `offset`, malformed `release_year`, unsupported `genre`, inapplicable filter/sort, or unknown query parameter. Include one or more `{ "field": string, "issue": string }` entries in `error.details`. |
| `429` | `RATE_LIMITED` | Only when the shared backend rate-limit middleware rejects the request. |
| `500` | `INTERNAL_ERROR` | Unexpected search or catalog access failure. Do not expose database credentials, SQL, or internal stack traces. |

The endpoint is public under the shared API convention and does not return `401` for a missing access token. A catalog failure is an error response, not an empty successful result; clients may retry after displaying the feature's actionable error state.

## Matching and filtering behavior

- Search the approved text fields: track title, artist name, album name, and playlist name; artist results match the artist name.
- Normalize case, diacritics, and punctuation consistently with the feature's search normalization policy. Trim `q` before validation and matching.
- Apply `genre` and `release_year` together as an AND constraint. When both are supplied, a track or album must satisfy both.
- Filtering is performed before sorting and pagination so `data`, `has_more`, and `next_offset` describe the filtered result set.
- Do not include AI lyrics or semantic search results in this endpoint.

## Decisions captured by this contract

- Express backend owns the route; PostgreSQL/Supabase is the catalog source.
- The default page size is 20, with a maximum of 50; the default type is `all`, offset is `0`, and sort is `relevance`.
- `genre` and `release_year` apply to tracks and albums; sort applicability and behavior follow the rules above.
- Successful responses use the shared API envelope with `data` as an array and a required top-level `pagination` object.
- No feature-specific numeric latency or availability objective is defined.
