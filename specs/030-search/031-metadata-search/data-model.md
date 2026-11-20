# Data Model: Metadata Search

**Feature**: [031-metadata-search](./spec.md)
**API source of truth**: [Search API Contract](./contracts/search-api.md)

## Scope

This feature adds no persisted database entity, table, column, or migration. The backend reads the existing approved PostgreSQL catalog through the Supabase client in `src/database/supabaseClient.js`. The checked-in migration is auth-only; catalog table definitions in database design documents are reference material and require verification against the approved/deployed schema. Implementation must map the logical fields below to that schema without inventing columns.

## Request Model: SearchQuery

An ephemeral request value sent to `GET /api/v1/search`:

| Field | Type | Constraints and behavior |
| --- | --- | --- |
| `q` | string | Required; trim surrounding whitespace; 2–100 characters; matching ignores case, diacritics, and punctuation. |
| `type` | enum | Optional; `all`, `tracks`, `artists`, `albums`, or `playlists`; defaults to `all`. |
| `limit` | integer | Optional; 1–50 inclusive; defaults to 20. |
| `offset` | integer | Optional; non-negative; defaults to 0. |
| `genre` | catalog genre ID | Optional; valid for tracks/albums and the documented `all` behavior only. |
| `release_year` | four-digit calendar year | Optional; matches the year portion of the existing catalog release date; valid for tracks/albums and documented `all` behavior only. |
| `sort` | enum | Optional; `relevance`, `plays`, `newest`, or `title`; defaults to `relevance`, with applicability and semantics defined in the API contract. |

Unknown query parameters and invalid or inapplicable values produce the contract's validation error. Filter and sort details are intentionally not duplicated here; the API contract is authoritative.

## Result Models

The successful response's `data` contains zero or more typed result records. Each record has an opaque string `id` and singular type discriminator. It is one of:

- **Track**: required `id`, `type`, `title`, `artist`; optional catalog identity and metadata such as artist/album IDs, album, genre, release date, duration, play count, and cover URL.
- **Artist**: required `id`, `type`, `name`; optional role and avatar URL.
- **Album**: required `id`, `type`, `title`, `artist`; optional artist ID, genre, release date, and cover URL.
- **Playlist**: required `id`, `type`, `title`; optional description, owner, track count, and cover URL.

The API contract defines the exact field nullability and serialized shape. These are response projections of existing catalog data, not new database entities.

## Pagination Model

`pagination` is required on every successful response:

| Field | Type | Rule |
| --- | --- | --- |
| `limit` | integer | Effective bounded batch size. |
| `offset` | integer | First result position represented by this batch. |
| `next_offset` | integer or `null` | `offset + data.length` when another batch exists; otherwise `null`. |
| `has_more` | boolean | True only when another batch is available. |

Only request another batch when `has_more` is true, using `next_offset` as the next request's `offset`.

## Client-Only Model: RecentQueryHistory

The browser may persist a list of at most ten recent query strings in LocalStorage, as required by FR-019. It contains no result records, credentials, or server-side state. Malformed or unavailable LocalStorage is recoverable; search remains usable in memory. This is not a server/database entity.

## Relationships and Source Mapping

Result relationships (for example, track-to-artist and track-to-album identifiers) are projections of the approved catalog schema. Map them only after verifying the real schema. Do not create new relationships or fields to satisfy this document; if a required contract field cannot be sourced, resolve the catalog mapping with the database owner before implementation.

## Verified PostgreSQL / Supabase Catalog Mapping (T001)

> Verified against the deployed Supabase PostgreSQL schema. No feature-specific schema changes or migrations are introduced for Feature 031.

### 1. Tracks (`type = "track"`) -> `public.songs`
* **Source & Joins:** `public.songs` (`LEFT JOIN public.albums` -> `LEFT JOIN public.artists`)
* **Field Projections:**
  * `id`: `String(songs.song_id)`
  * `type`: `"track"`
  * `title`: `songs.title`
  * `artist`: `artists.name ?? "Unknown Artist"` (fallback if `songs.album_id` is `NULL`)
  * `artist_id`: `artists.artist_id ? String(artists.artist_id) : null`
  * `album`: `albums.title ?? null`
  * `album_id`: `songs.album_id ? String(songs.album_id) : null`
  * `genre`: `songs.genre ?? null`
  * `release_date`: `albums.release_date ?? null` (ISO `YYYY-MM-DD`)
  * `duration_seconds`: `songs.duration ?? 0`
  * `play_count`: `songs.total_plays ?? 0`
  * `cover_url`: `songs.image_url ?? albums.image_url ?? null` (prioritizes track artwork, falls back to album artwork)
* **Filter & Sort Semantics:**
  * `genre`: Matches `songs.genre`
  * `release_year`: Derived from `EXTRACT(YEAR FROM albums.release_date)`
  * `plays` sort: `songs.total_plays DESC NULLS LAST, songs.song_id ASC`
  * `newest` sort: `albums.release_date DESC NULLS LAST, songs.song_id DESC`

### 2. Artists (`type = "artist"`) -> `public.artists`
* **Source & Joins:** `public.artists` (`LEFT JOIN public.users`)
* **Field Projections:**
  * `id`: `String(artists.artist_id)`
  * `type`: `"artist"`
  * `name`: `artists.name`
  * `role`: `users.role ?? "artist"`
  * `avatar_url`: `artists.image_url ?? users.avatar_url ?? null`

### 3. Albums (`type = "album"`) -> `public.albums`
* **Source & Joins:** `public.albums` (`LEFT JOIN public.artists`, `LEFT JOIN public.songs` when resolving/filtering `genre`)
* **Field Projections:**
  * `id`: `String(albums.album_id)`
  * `type`: `"album"`
  * `title`: `albums.title`
  * `artist`: `artists.name ?? "Unknown Artist"`
  * `artist_id`: `albums.artist_id ? String(albums.artist_id) : null`
  * `genre`: Derived from associated `songs.genre` within the album (or `null` if no songs exist)
  * `release_date`: `albums.release_date ?? null` (ISO `YYYY-MM-DD`)
  * `cover_url`: `albums.image_url ?? null`
* **Filter & Sort Semantics:**
  * `genre`: Matches albums containing at least one track with matching `songs.genre`
  * `release_year`: Derived from `EXTRACT(YEAR FROM albums.release_date)`
  * `newest` sort: `albums.release_date DESC NULLS LAST, albums.album_id DESC`

### 4. Playlists (`type = "playlist"`) -> `public.playlists`
* **Source & Joins:** `public.playlists` (`LEFT JOIN public.users`, aggregate `COUNT` from `public.playlist_songs`)
* **Visibility Constraint:** **MUST filter `playlists.status = 'Public'`** on all public metadata search queries (`Private` and `Shared` playlists are excluded).
* **Field Projections:**
  * `id`: `String(playlists.playlist_id)`
  * `type`: `"playlist"`
  * `title`: `playlists.name`
  * `description`: `null` (`public.playlists` has no `description` column)
  * `owner`: `users.display_name ?? users.name ?? null` (via `playlists.user_id_creator = users.user_id`)
  * `track_count`: Count of rows in `public.playlist_songs` for `playlist_id` (default `0`)
  * `cover_url`: `null` (`public.playlists` has no `image_url` column)