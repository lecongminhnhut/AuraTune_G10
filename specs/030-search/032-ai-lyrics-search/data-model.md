# Data Model: AI Lyrics Search

**Feature**: [032 AI Lyrics Search](./spec.md)  
**Status**: Logical feature model only; no persistence schema is proposed.

## Persistence Decision (Resolved - T004)

No new PostgreSQL table, column migration, or database persistence is introduced for Feature 032.

* **Canonical Lyric Source:** Raw lyric content (plain text or `.lrc`-formatted lines) is stored directly in the verified `public.songs.lyrics` column in Supabase PostgreSQL (no external Cloudinary lyric file or `lyrics_url` column is used). Songs where `lyrics` is `NULL` or empty after trimming are excluded from lyric indexing.
* **In-Memory & Local Disk Index Cache:** To satisfy the 3-second AI latency budget and support instantaneous normalized-lyrics keyword fallback without repeated full-table lyric scans during user searches, the backend / AI service maintains an in-memory index (optionally backed by a local `.cache/` JSON file) populated from `public.songs.lyrics` on server warm-up and refreshed upon song creation/updates.
* **LRC Stripping & Normalization:** When ingesting `public.songs.lyrics` content into the search index, any embedded timestamp tags (e.g., `[00:15.20]`) are stripped to extract plain lyric lines, which are then normalized (trimmed, lowercased, diacritic- and punctuation-stripped) for fallback matching.
* **Song Identity & Playback Mapping:** Matched `song_id` keys from either the AI index or the fallback cache resolve display and playback metadata (`id`, `type: "track"`, `title`, `artist`, `artist_id`, `album`, `album_id`, `genre`, `release_date`, `duration_seconds`, `play_count`, `cover_url`) from `public.songs` joined with `public.albums` and `public.artists`, identical to Feature 031.

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
* ~~Canonical lyric source/index and availability/rights assumptions.~~ (Resolved in T004: Direct public.songs.lyrics text column in Supabase PostgreSQL indexed into backend/AI service in-memory cache; public catalog songs only.)
* ~~Song identity and playback metadata mapping for AI/fallback results.~~ (Resolved in T004: Mapped via songs.song_id -> albums -> artists, aligned with Feature 031 track projection.)
* Approved API response fields and pagination continuation format (Tracked in T002).
* Exact normalization rules for punctuation and diacritics (Tracked in T007).
* Deterministic ordering among fallback candidates with equal primary rank (Tracked in T007)