# Implementation Plan: Music Player — Core Playback & Stream (Group 040)

**Branch**: `feature/040-music-player-implement` | **Date**: 2026-11-10 | **Specs**: [041](./041-playback-controls/spec.md), [042](./042-playback-progress-and-volume/spec.md), [043](./043-shuffle-and-repeat/spec.md), [044](./044-synchronized-lyrics/spec.md), [045](./045-persistent-bottom-player/spec.md)

**Input**: Feature specifications 041–045 in `specs/040-music-player/`. Feature 046 (sharing and comments) is outside this iteration.

## Summary

Replace the timer-based prototype player (`useMockPlayer`) with a real audio engine built on one `HTMLAudioElement`, and add backend endpoints that stream song audio with HTTP Range support. A single engine (`useAudioPlayer`) drives both the mini player and the full player through the existing `PlayerContext`, so the 17 pages and components that already call `usePlayer()` keep working unchanged.

The five features share one engine, so this plan covers the whole group instead of one plan per feature. Each functional requirement is still traced to its implementation (see [Requirement Coverage](#requirement-coverage)).

## Technical Context

**Language/Version**: JavaScript ES modules. React 18.3.1 and Vite 5.4.11 in the frontend; Node.js 24 with Express 4 in the backend.

**Primary Dependencies**: No new packages. The design uses `HTMLAudioElement`, the Media Session API, Node streams, and the existing Supabase client.

**Storage**:
- Frontend: a `localStorage` snapshot (`auratune:player`) holds track and queue ids, position, shuffle/repeat state and Play Next pins. Volume is deliberately not stored.
- Backend: the Supabase `songs` table when it exists, falling back to a demo catalog that matches the frontend mock tracks.
- Audio sources: a remote `audio_url`, local files in `MEDIA_DIR`, or (outside production) synthesized demo audio.

**Testing**:
- `node --test` (built into Node, no new dependency): backend endpoint and Range tests in `src/backend/tests/`, and frontend pure-helper tests in `src/frontend/src/utils/*.test.js`.
- Manual browser verification, following [quickstart.md](./quickstart.md).

**Target Platform**: Responsive AuraTune web application on desktop, tablet and mobile browsers.

**Project Type**: Web application with `src/frontend` and `src/backend` projects.

**Performance Goals**:
- No audio request until the listener starts playback.
- React re-renders at most once per second during playback, because elapsed time is published per whole second.
- Seeking issues a Range request instead of downloading the whole file.
- The demo stream is generated in 64 KB chunks.

**Constraints**:
- Keep the `PlayerContext` interface intact.
- Do not change Group 050 queue rules beyond the Play Next/shuffle interaction (054-FR-009).
- Ship no copyrighted audio in the repository.
- Do not commit secrets or `.env` files.

**Scale/Scope**: Features 041–045, plus the backend song stream they depend on.

## Constitution Check

`.specify/memory/constitution.md` still contains unfilled template placeholders, so there are no ratified gates to evaluate. This plan records concrete repository constraints instead.

## Project Structure

### Documentation

```text
specs/040-music-player/
├── plan.md                  # This file (group-level, covers 041–045)
├── research.md              # Design decisions and alternatives
├── data-model.md            # Player state, listening session, snapshot, song and audio source
├── quickstart.md            # Run and verify
├── contracts/songs-api.md   # GET /api/v1/songs/:id and /stream
├── tasks.md                 # Dependency-ordered tasks with status
└── 041-…046-*/spec.md       # Feature specifications
```

### Source Code

```text
src/backend/
├── routes/songRoutes.js             # Mounts /api/v1/songs
├── controllers/songController.js    # Metadata + Range streaming, JSON error envelope
├── repositories/songRepository.js   # Supabase `songs` lookup with demo-catalog fallback
├── data/demoSongs.js                # Demo catalog matching frontend mock tracks t1–t10
├── utils/httpRange.js               # RFC 9110 single-range parser
├── utils/audioSource.js             # Remote URL → MEDIA_DIR file → demo audio
├── utils/demoAudio.js               # Deterministic WAV synthesized per byte range
└── tests/songStream.test.js

src/frontend/src/
├── hooks/useAudioPlayer.js          # Audio engine (replaces hooks/useMockPlayer.js)
├── services/songApi.js              # Stream URL for a track
├── utils/playback.js                # Pure helpers: next/previous, play threshold, active lyric
├── utils/playerStorage.js           # Save/restore snapshot
├── components/player/LyricsPanel.jsx
├── components/player/PlaybackAlert.jsx
├── components/player/BottomPlayer.jsx, FullScreenPlayer.jsx, WaveformSeekBar.jsx
└── App.jsx                          # Wires the engine, records history at the play threshold
```

## Technical Approach

1. **One engine, intent-driven.** React state holds the listener's intent: current track, queue, playing or paused, position, and modes. Every action computes the next state and calls `commit()`, which updates React and then brings the `<audio>` element in line. Element events (`timeupdate`, `ended`, `waiting`, `error`, …) feed back into the same state.
2. **Listening sessions.** `playKey` increases whenever a track starts from 0: a new track, a replay after the end, repeat-one, or Previous after 3 seconds. Each session counts continuous listening time.
   - Seeking forward adds nothing, pausing keeps the count, and skipping before the threshold counts nothing.
   - The engine sets `playCounted` once the session reaches 30 seconds or half the duration, whichever comes first. `App.jsx` writes a history entry only at that point (041-FR-014).
3. **Lazy, recoverable loading.** The source is attached only when playback starts.
   - Element errors set `status = 'error'` with a short message. `retry()` reloads from the same position, and Skip calls `nextTrack()` (041-FR-009).
   - Changing modes never reloads the source (043-FR-011).
4. **Stream endpoint.** `GET /api/v1/songs/:id/stream` validates the id, refuses inactive songs (410), resolves an audio source and serves 200, 206 or 416 with `Accept-Ranges: bytes`. A remote `audio_url` is answered with a 302 redirect, so Supabase Storage or a CDN serves the bytes.
5. **Restore paused.** The snapshot is saved on change, every 5 seconds of playback and on `pagehide`. It is restored at startup with tracks looked up again through the store, unavailable tracks dropped, and playback always paused (045-FR-012).

## Requirement Coverage

| Requirement | Implementation |
| --- | --- |
| 041-FR-001/002 play, pause, resume | `togglePlayback`; position kept by the element |
| 041-FR-003/006 next, auto-advance | `nextTrack`, `ended` handler → `pickAdjacentTrack` |
| 041-FR-004/005 previous within or after 3 s | `previousTrack` |
| 041-FR-007 stop after last track | `pickAdjacentTrack` returns `null` → `stopAtEnd` |
| 041-FR-008 unavailable tracks | App wrappers refuse; `pickAdjacentTrack` skips; stream returns 410 |
| 041-FR-009 stream failure | `status`/`error`, `PlaybackAlert` (Retry / Skip) in both views |
| 041-FR-010 identical state | One engine through `PlayerContext` |
| 041-FR-014 play event | `listened`/`playCounted` → `recordPlay` in `App.jsx` |
| 042-FR-001..004 progress, seek, clamp | `duration` from media metadata; `seek` clamps |
| 042-FR-005 buffering | `waiting`/`seeking` → `isBuffering` (spinner, `aria-busy`) |
| 042-FR-006..010 volume and mute | `setVolume` (0–100, unmutes), `setMuted`; state survives track changes |
| 042-FR-011/012 input and accessibility | Native range inputs; `aria-valuetext` with elapsed and total time |
| 043-FR-001..012 shuffle and repeat | `pickAdjacentTrack`; repeat-one handled first in `ended`; `playCollection({ shuffle })` keeps display order |
| 044-FR-001..009 lyrics | `LyricsPanel`: synced, plain, or notice; follows `elapsed` |
| 044-FR-012 tap a lyric to seek | `playFrom(line.time)` |
| 045-FR-001..011 persistent player | Existing `BottomPlayer`/`FullScreenPlayer` on the shared engine |
| 045-FR-012 restore after reload | `playerStorage.js` snapshot, restored paused |

## Open Items and Dependencies

- **Songs schema (Group 080 data layer):** `normalizeSong` reads `song_id`, `title`, `duration`, `audio_url`, `is_active`/`status`. Confirm these columns once the migration lands.
- **Media storage (Group 090):** `utils/audioSource.js` is where the storage adapter plugs in. Artist-uploaded tracks have no audio yet, so playing one shows the error state.
- **Lyrics API:** `GET /api/v1/songs/:id/lyrics` is not built. The panel reads `lyrics` (synced) or `plainLyrics` from track data.
- **Feature 046 (sharing and comments):** UI unchanged; it has no backend yet.
- **Group 050:** the 50-track queue cap (051-FR-013 / 052-FR-012) is not enforced by this change.
- **Group 070:** history is still written to the local store. `POST /users/me/history` belongs to that group.
- **Environment:** the frontend on `main` fails to start without the `VITE_FIREBASE_*` variables. This is unrelated to this change.
