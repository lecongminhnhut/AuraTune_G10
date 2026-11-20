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
- [ ] T031 [US044] Load lyrics from a backend `GET /api/v1/songs/:id/lyrics` once the songs schema has lyric columns (blocked on the Group 080 data layer).

---

## Phase 8: Feature 045 — Persistent Bottom Player (P1)

**Independent test**: [quickstart.md](./quickstart.md) row 9.

- [X] T032 [P] [US045] `utils/playerStorage.js`: versioned snapshot of ids, position and modes; validated restore (FR-012).
- [X] T033 [US045] Save on change, every 5 seconds and on `pagehide`; restore paused with no request before Play.
- [X] T034 [P] [US045] Add `src/frontend/src/utils/playerStorage.test.js`.

---

## Phase 9: Polish and Cross-cutting

- [X] T035 Verify in the browser on desktop and mobile: playback, seek and buffering, lyric seek, auto-advance, stop at end, repeat one, error and retry, restore after reload, play threshold.
- [ ] T036 Map `normalizeSong` to the final `songs` migration columns once Group 080 publishes it.
- [ ] T037 Plug Group 090 media storage into `utils/audioSource.js`, so uploaded tracks get `audio_url`.
- [ ] T038 Send the play event to `POST /api/v1/users/me/history` when Group 070 exposes it (currently stored by `AppStore.recordPlay`).

## Dependencies

- Phase 2 → Phase 3 → Phases 4–8. Phases 5–8 depend only on Phase 3 and can proceed in parallel.
- T031, T036, T037 and T038 wait on other groups (080, 090, 070).
