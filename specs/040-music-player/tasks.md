---
description: "Dependency-ordered implementation tasks for Group 040 Music Player — core playback and stream"
---

# Tasks: Music Player — Core Playback & Stream (Group 040)

**Input**: Design documents from `specs/040-music-player/`: [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/songs-api.md](./contracts/songs-api.md), [quickstart.md](./quickstart.md).

**Tests**: The repository has no test runner, so tests use Node's built-in `node --test` with no new dependency (`npm test` in `src/backend` and `src/frontend`).

**Organization**: Tasks are grouped by feature (041–045) after shared setup and foundation. `[P]` marks tasks that touch different files and can run in parallel. `[X]` means done on branch `feature/040-music-player-implement`.

## Phase 1: Setup

- [X] T001 Confirm player consumers: 17 components use `usePlayer()`; keep the `useMockPlayer` interface (`track`, `queue`, `elapsed`, `isPlaying`, actions) so no consumer changes.
- [X] T002 Add `"test": "node --test …"` scripts to `src/backend/package.json` and `src/frontend/package.json`.
- [X] T003 [P] Ignore `src/backend/media/` in `.gitignore` for local audio files.

---

## Phase 2: Foundational — Song Stream API (blocks every feature)

- [X] T004 [P] Implement the single-range parser in `src/backend/utils/httpRange.js` (200 / 206 / 416 rules from the contract).
- [X] T005 [P] Implement the demo catalog `src/backend/data/demoSongs.js` (ids and durations match `mockData.js` t1–t10).
- [X] T006 [P] Implement deterministic per-range WAV synthesis in `src/backend/utils/demoAudio.js`.
- [X] T007 Implement `src/backend/repositories/songRepository.js`: Supabase `songs` lookup, demo fallback, `SongLookupError` for unrecoverable database errors.
- [X] T008 Implement `src/backend/utils/audioSource.js`: remote URL redirect, then `MEDIA_DIR` file (path-traversal safe), then demo audio outside production.
- [X] T009 Implement `getSong` and `streamSong` in `src/backend/controllers/songController.js` with the JSON error envelope; mount `src/backend/routes/songRoutes.js` at `/api/v1/songs` in `server.js`.
- [X] T010 Add `src/backend/tests/songStream.test.js`: range parsing, metadata, HEAD length, WAV header, overlapping ranges, 416, 410, local file, path traversal, redirect.

**Checkpoint**: `curl -H "Range: bytes=0-43" localhost:5000/api/v1/songs/t8/stream` returns 206 with a RIFF/WAVE header.

---

## Phase 3: Foundational — Audio Engine

- [X] T011 [P] Rewrite `src/frontend/src/utils/playback.js` as pure helpers: `pickAdjacentTrack`, `playThresholdSeconds`, `findActiveLyricIndex`, robust `getDurationSeconds`.
- [X] T012 [P] Add `src/frontend/src/services/songApi.js` (`trackAudioUrl` prefers `track.audioUrl`, else the stream endpoint).
- [X] T013 Implement `src/frontend/src/hooks/useAudioPlayer.js`: one `Audio` element, `commit()` sync, lazy source loading, element event handlers, Media Session.
- [X] T014 Switch `src/frontend/src/App.jsx` to `useAudioPlayer({ findTrack, isPlayable })` and delete `hooks/useMockPlayer.js`.
- [X] T015 Add `src/frontend/src/utils/playback.test.js`.

**Checkpoint**: The existing pages play real audio through the unchanged `PlayerContext`.

---

## Phase 4: Feature 041 — Playback Controls (P1, MVP)

**Independent test**: [quickstart.md](./quickstart.md) rows 1, 4, 5, 7, 8 and 12.

- [X] T016 [US041] Play, pause and resume, plus replay from the end, in `togglePlayback` (FR-001, FR-002).
- [X] T017 [US041] Next, previous with the 3-second rule, auto-advance, and stop after the last track (FR-003..FR-007).
- [X] T018 [US041] Skip unavailable tracks during navigation using the store's `isPlayable` (FR-008).
- [X] T019 [US041] Stream errors: `status`/`error` state, `retry()`, and `components/player/PlaybackAlert.jsx` with Retry and Skip in the bottom, compact and full players (FR-009).
- [X] T020 [US041] Listening-session counting (`listened`, `playCounted`), with history recorded at the threshold in `App.jsx` instead of at start (FR-014).
- [X] T021 [US041] Remove the "DEMO" and "simulated playback" labels now that audio is real.

---

## Phase 5: Feature 042 — Progress and Volume (P1)

**Independent test**: [quickstart.md](./quickstart.md) rows 2 and 11.

- [X] T022 [P] [US042] `WaveformSeekBar` uses the media `duration`, a clamped integer position, `aria-valuetext` with elapsed and total time, and `aria-busy` while buffering (FR-001..FR-005, FR-012).
- [X] T023 [US042] Buffering state from `waiting`/`seeking`, shown as a spinner on Play in every view (FR-005).
- [X] T024 [US042] `setVolume` clamps to 0–100 and unmutes; mute keeps the level; volume is not persisted across reloads (FR-006..FR-010).

---

## Phase 6: Feature 043 — Shuffle and Repeat (P2)

**Independent test**: [quickstart.md](./quickstart.md) row 6, plus `npm test` in `src/frontend`.

- [X] T025 [US043] Shuffle picks a random other track without reordering the queue; `playCollection({ shuffle: true })` starts on a random track (FR-001..FR-003, FR-012).
- [X] T026 [US043] Repeat off → all → one; repeat one wins over shuffle at the end of a track; Next still works (FR-004..FR-009).
- [X] T027 [US043] Changing modes never reloads the source (FR-011).
- [X] T028 [US043] Play Next pins win over shuffle (`pinnedNextIds`, 054-FR-009).

---

## Phase 7: Feature 044 — Synchronized Lyrics (P2)

**Independent test**: [quickstart.md](./quickstart.md) rows 3 and 10.

- [X] T029 [P] [US044] `components/player/LyricsPanel.jsx`: emphasized current line, dimmed previous and next lines, instrumental intro marker, plain-lyrics fallback, "no lyrics" notice (FR-001..FR-009).
- [X] T030 [US044] Tapping a line calls `playFrom(line.time)` (FR-012).
- [X] T031 [US044] Load lyrics from `GET /api/v1/songs/:id/lyrics`: `utils/lyrics.js` parses `songs.lyrics` (LRC or plain), `getSongLyrics` serves it, and `hooks/useTrackLyrics.js` loads it for catalog songs while the lyrics tab is open, with loading and error states in `LyricsPanel`. Tests: `tests/songLyrics.test.js`, `services/commentApi.test.js` (lyrics client), `tests/components/PlayerPanels.test.jsx`.

---

## Phase 8: Feature 045 — Persistent Bottom Player (P1)

**Independent test**: [quickstart.md](./quickstart.md) row 9.

- [X] T032 [P] [US045] `utils/playerStorage.js`: versioned snapshot of ids, position and modes; validated restore (FR-012).
- [X] T033 [US045] Save on change, every 5 seconds and on `pagehide`; restore paused with no request before Play.
- [X] T034 [P] [US045] Add `src/frontend/src/utils/playerStorage.test.js`.

---

## Phase 9: Polish and Cross-cutting

- [X] T035 Verify in the browser on desktop and mobile: playback, seek and buffering, lyric seek, auto-advance, stop at end, repeat one, error and retry, restore after reload, play threshold.
- [X] T036 Map `normalizeSong` to the real Supabase catalog: `songs(song_id, title, album_id, audio_url, duration, genre, total_plays, image_url)` joined to `albums` and `artists`, the schema used by `scripts/seedMusicCatalog.js` and `searchRepository`. Falls back to flat columns when the relations cannot be embedded; soft-deleted rows are inactive. Unit tests are in `tests/listeningHistory.test.js`.
- [X] T037 Cloudinary media: catalog rows store the Cloudinary `secure_url` in `audio_url`, which `utils/audioSource.js` serves as a 302 redirect. `config/cloudinary.js` now configures the SDK on first use, so the API starts without Cloudinary credentials and only uploads fail (503).
- [X] T038 Persist play events in Supabase: `POST/PATCH/GET/DELETE /api/v1/users/me/history` ([contracts/history-api.md](./contracts/history-api.md)), `repositories/listeningHistoryRepository.js` with no in-memory fallback, migration `src/database/migrations/007_listening_history.sql`, and `services/historyApi.js` called by `AppStore.recordPlay`, `updateListened` and `clearHistory` for backend sessions. History, Home and Recommendations read the entries back from the API. Tests are in `tests/listeningHistory.test.js`.
- [ ] T039 Run [quickstart.md](./quickstart.md) rows 13–15 against the team Supabase project (play → database row → read-back after restarting the backend and reloading the browser) and record the evidence in `docs/test/PA4_Section_E_evidence.md`.

---

## Phase 10: Feature 046 — Song Sharing and Comments (P1, iteration 2)

**Independent test**: [quickstart.md](./quickstart.md) rows 17–22.

- [X] T040 [US046] Migration `src/database/migrations/009_song_comments.sql`: `song_comments` with foreign keys to `songs` and `users`, a 1–300 character CHECK, RLS on and no client grants.
- [X] T041 [US046] `repositories/commentRepository.js`, `controllers/commentController.js` and `routes/commentRoutes.js` mounted at `/api/v1` ([contracts/comments-api.md](./contracts/comments-api.md)): public list with optional token for `can_delete`, signed-in post, author/admin delete with 403 otherwise (FR-006..FR-012). `/api/v1/comments/` added to the JSON 401 envelope in `authMiddleware.js`.
- [X] T042 [P] [US046] `tests/songComments.test.js`: guest read, newest first, `can_delete` per viewer, invalid token, limits, validation (empty, whitespace, 301 characters, emoji count), 401/403/404/410/503, repository query shape and missing-table mapping.
- [X] T043 [US046] `services/commentApi.js`, `hooks/useTrackComments.js`, `components/player/CommentThread.jsx` and `TrackComments.jsx`: backend comments for catalog songs, prototype comments for demo tracks, loading/error/empty states, text kept on a failed post (FR-013), sign-in prompt (FR-015).
- [X] T044 [US046] Sharing: Web Share → Clipboard API → text-field copy in `utils/share.js`; share links open a search for the track while the album page cannot load albums (FR-002..FR-005).
- [X] T045 [P] [US046] Tests: `utils/share.test.js`, `utils/relativeTime.test.js`, `services/commentApi.test.js`, `tests/components/PlayerPanels.test.jsx`.
- [X] T046 [US046] Browser check on 2026-11-25 (guest): lyrics request and "no lyrics" notice for a catalog song; share from the track menu copies `/search?q=Glad%20To%20Be%20Stuck%20Inside`, which lists the track; comments panel shows the 503 fallback before migration 009.
- [X] T047 [US046] Migration 009 applied to the team Supabase project on 2026-11-25; [quickstart.md](./quickstart.md) rows 18, 19 and 21 pass live (guest read, post → 201 and a `song_comments` row, read-back after a backend restart, author delete → 200 and the row gone). Row 20: guest `can_delete: false` and 401 without a token were checked live; 403 for another account and admin deletion are covered by `tests/songComments.test.js`. Evidence: [docs/test/040_Music_Player_iteration2_evidence.md](../../docs/test/040_Music_Player_iteration2_evidence.md).

## Dependencies

- Phase 2 → Phase 3 → Phases 4–8. Phases 5–8 depend only on Phase 3 and can proceed in parallel.
- T039 needs the team Supabase credentials and migration 007 applied. T047 needs migration 009 applied in the Supabase SQL Editor.
- Album share links wait on `GET /api/v1/albums/:id` (Group 080).
