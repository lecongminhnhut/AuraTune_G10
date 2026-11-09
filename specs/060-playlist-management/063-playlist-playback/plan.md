# Implementation Plan: Playlist Playback (Feature 063)

**Branch**: `063-playlist-playback` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

## Summary

Connect playlist play, shuffle, selected-track playback, and append-to-queue actions to the shared player and queue state. Track a playback source so player surfaces can show the playlist name while playback remains within that source, then switch to queue context when playback moves to an unrelated queued item. Empty playlists produce a toast and do not alter the queue; unavailable tracks are skipped.

## Technical Context

**Language/Version**: JavaScript ES modules; React 18.3.1, Vite 5.4.11
**Primary Dependencies**: React, React DOM, Vite, Tailwind CSS 3, `lucide-react`, existing PlayerContext, mock player, and queue interfaces
**Storage**: Playlist/song data via AppStore/API; playback queue and context in client player state
**Testing**: Use existing repository verification setup when present; do not assume a test framework
**Target Platform**: AuraTune web client
**Project Type**: Web application
**Performance Goals**: Single-click enqueue/start under 200ms; next track starts within 1s when network permits
**Constraints**: Queue operations owned by 050; playback controls owned by 040; playlist playback composes those capabilities and should avoid duplicating them
**Scale/Scope**: Playlist playback actions and source context only

## Constitution Check

Constitution is unfilled; follow Team Contract. Gate: agree the PlayerContext and queue interface with 040/050 owners. The existing code is a simulated player, and 131 notes real audio is a later integration; plan must not claim real streaming is already available.

## Current Implementation Baseline

The repository has `src/frontend/src/context/PlayerContext.jsx`, `hooks/useMockPlayer.js`, `components/player/BottomPlayer.jsx`, `QueuePanel.jsx`, and playlist detail/card components. Inspect their current interfaces before wiring actions. 063 spec contains an early acceptance wording conflict; its Clarifications and final FR-003 specify full queue replacement with the selected song active and original playlist ordering, which is the behavioral baseline.

## Project Structure

### Planning artifacts

```text
specs/060-playlist-management/063-playlist-playback/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/playlist-playback.md
└── tasks.md
```

```text
src/frontend/src/
├── context/PlayerContext.jsx       # playlist queue and source context actions
├── hooks/useMockPlayer.js          # current playback progression baseline
├── components/player/              # bottom/full player context display
├── pages/PlaylistDetail/           # play and selected-track actions
└── components/playlist/PlaylistCard.jsx
```

**Structure Decision**: Keep playback session state in PlayerContext and have playlist UI call its public actions. Coordinate any shared queue contract changes with group 050.

## Design and Delivery Phases

1. **Player/queue contract**: Inspect the current player and queue APIs and agree a minimal playlist source metadata shape with 040/050.
2. **Queue construction**: Implement ordered replace-and-play, shuffle replace-and-play, selected-track start with full playlist queue and selected index, and append without interrupting current audio.
3. **Availability and progression**: Filter or skip unavailable tracks without corrupting queue progression; preserve current audio on append; handle empty playlists with notification and no queue mutation.
4. **Player context UI**: Surface current playlist context in bottom/full player and update to queue context when current item is no longer from the source.
5. **Review**: Validate all FR-001..009 and coordinate queue behaviors with 050 and audio behavior with 040.

## Risks

| Risk | Mitigation |
|---|---|
| Current player is simulated | Implement against existing interface and make no claim of real audio until 040 integration |
| Queue state semantics differ from 063 | Agree interface and ownership with 050 before modifying shared state |
| Shuffle randomness makes tests flaky | Validate membership exactly once and inject/use deterministic shuffle in verification where feasible |

## Complexity Tracking

No constitution violations.
