# Research: Music Player — Core Playback & Stream (Group 040)

## R1. Audio engine: one `HTMLAudioElement` owned by a hook

- **Decision**: `useAudioPlayer` creates a single `Audio` object, not attached to the DOM, and keeps it for the app's lifetime.
- **Rationale**: Mini and full player must share state (041-FR-010) and playback must survive route changes (045-FR-002). The engine lives in `AppShell` above the router, so a single element covers both requirements.
- **Alternatives considered**:
  - Web Audio API: needs whole-file decoding and has no native progressive streaming.
  - An `<audio>` element rendered inside a player component: it would unmount whenever a view closes.

## R2. State model: intent first, element synced by `commit()`

- **Decision**: Actions compute the next state from a ref holding the latest state, then `commit()` updates React and applies the difference to the element: load source, seek, play or pause.
- **Rationale**: Actions stay pure and testable through `utils/playback.js`. Rapid successive actions see the latest state, and no React effect has to chase `elapsed` back into the element, which would create seek loops.
- **Alternatives considered**: Syncing the element in `useEffect` from state. Rejected because every `timeupdate` would look like a seek.

## R3. Counting a play (041-FR-014)

- **Decision**: Count only continuous forward playback. A `timeupdate` delta between 0 and 2 seconds is added when the element is not seeking. The threshold is `min(30 s, duration / 2)`.
- **Rationale**: This matches the working interpretation agreed for Group 070: pausing keeps the count, seeking forward adds nothing, skipping before the threshold records nothing, and a replay starts a new session.
- **Alternatives considered**: Using wall-clock time since start. Rejected because it counts pauses and seeks.

## R4. Shuffle without reordering (043-FR-002/003/012, 054-FR-009)

- **Decision**: The queue order never changes. With shuffle on, Next picks a random queued track other than the current one, unless a Play Next track is pinned in the upcoming part, which always wins. Starting a collection shuffled picks a random first track and keeps the collection order.
- **Rationale**: FR-003 forbids changing the displayed order, and 054-FR-009 gives Play Next priority over shuffle.
- **Alternatives considered**: Shuffling the queue array (the old prototype). Rejected because it violates FR-003.

## R5. Stream endpoint and Range handling

- **Decision**:
  - Express handler parses a single `bytes=` range (RFC 9110). Multiple ranges are ignored and the full file is served with 200; out-of-range requests get 416 with `Content-Range: bytes */size`.
  - Every audio response sets `Accept-Ranges: bytes`, `Cache-Control: private, max-age=3600` and `X-Content-Type-Options: nosniff`.
- **Rationale**: Browsers seek by issuing Range requests, so they do not download the whole file. A single range is all a media element uses.
- **Alternatives considered**:
  - `express.static` / `res.sendFile`: covers local files but not remote or generated sources, and cannot apply the `is_active` check.

## R6. Audio sources without shipping copyrighted files

- **Decision**: Sources are tried in this order:
  1. A remote `audio_url` (302 redirect).
  2. A local file in `MEDIA_DIR`: the relative `audio_url`, or `<song_id>.<ext>`, with path-traversal protection.
  3. Outside production, a deterministic 16 kHz mono WAV synthesized per byte range. Each song gets its own melody seeded from its id, and the length matches the catalog duration.
- **Rationale**: The team can develop and demo real streaming, seeking and buffering before the data layer (Group 080) and media storage (Group 090) land, without committing audio files.
- **Alternatives considered**:
  - Committing sample MP3s: copyright and repository-size concerns.
  - Pre-generating WAV files: unnecessary disk usage.

## R7. Persistence (045-FR-012, 051-FR-011)

- **Decision**:
  - The snapshot stores ids only and is versioned (`v: 1`).
  - It is restored through the store's `findTrack`/`isPlayable`, always paused, with the position clamped below the track length.
  - Volume is not persisted.
- **Rationale**: Track data can change between visits (moderation, edits). Ids keep the snapshot small and let unavailable tracks drop out. Restoring paused avoids autoplay-policy failures.
- **Alternatives considered**: Storing full track objects. Rejected because the data could be stale or unavailable.

## R8. Media Session

- **Decision**: Publish title, artist and album, and handle play, pause, previous, next and seekto.
- **Rationale**: Hardware media keys and lock-screen controls then drive the same engine, and external pauses are synced back into state.

## R9. Lyrics format in `songs.lyrics` (T031)

- **Decision**: Read the existing text column and accept LRC (`[mm:ss.xx]` tags, several tags per line, `[offset:±ms]`, enhanced `<mm:ss.xx>` word tags), a JSON array of `{ time, text }`, or plain text. Parse on the server and return `{ synced, plain }`, the shape `LyricsPanel` already used for mock data.
- **Rationale**: The shared schema already has `songs.lyrics text` (Group 030's lyrics search reads it), so no migration is needed. LRC is the common time-stamped format. Parsing on the server keeps one implementation and lets the response be cached (`Cache-Control: public, max-age=300`).
- **Alternatives considered**: A separate `song_lyrics` table with one row per line; rejected because the column already exists and lyrics are read whole.
- **Data on 2026-11-25**: none of the 17 catalog songs has lyrics.

## R10. Comment storage and permissions (Feature 046)

- **Decision**: New table `song_comments(comment_id, song_id, user_id, content, created_at)` with `ON DELETE CASCADE` to `songs` and `users`, a CHECK of 1–300 characters after trimming, RLS on and no grants to `anon`/`authenticated`. The backend checks permissions: public read, signed-in post, author or `role = 'admin'` delete. Lists are newest first, 50 per request (at most 100).
- **Rationale**: The ER design has no comment entity, and the API contract fixes the routes (`/songs/:id/comments`, `/comments/:id`). Keeping all access in the backend matches the other Group 040 tables (`listening_history`) and keeps FR-012 in one place. The optional `timestamp_seconds` of the API contract is not stored, because the spec does not use it.
- **Order**: the spec's screenshots disagree (oldest first in the thread view, "appears at the top" after posting). Newest first was chosen so a new comment is visible without scrolling.
- **Alternatives considered**: Supabase RLS policies for direct client access; rejected because the frontend authenticates against the backend's own tokens, not Supabase Auth.

## R11. Share links and copying (Feature 046)

- **Decision**: Web Share API → Clipboard API → hidden text field with `execCommand('copy')`. Links open `/search?q=<title>`.
- **Rationale**: The Clipboard API is missing on pages that are not served over HTTPS or localhost and is refused in some embedded browsers (verified on 2026-11-25: "Write permission denied" in the desktop app's browser pane), where the text-field copy still works. The album page (Group 080) requests `GET /api/v1/albums/:id`, which the backend does not serve, so album links open an error page; a search for the title lists the track for everyone (FR-005, SC-001).
- **Alternatives considered**: A dedicated `/track/:id` page; more work than the spec needs while the search already lists the track.
