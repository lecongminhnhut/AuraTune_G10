# Research: Playlist Playback

**Feature**: [063 Playlist Playback](./spec.md)
**Date**: 2026-11-09

## Specification Source Selection

`spec.md` has a primary Spec Kit requirements section followed by reconstructed UI notes. Task phases follow the primary user stories and FRs. The clarification and FR-003 in the primary section resolve the selected-track wording: replace the queue with the full playlist in original order and activate the selected track.

## Findings and Decisions

### Player and queue ownership
- **Finding**: The repository has `PlayerContext.jsx`, `useMockPlayer.js`, and queue UI; actual playback is a mock baseline. Group 040 owns player controls, group 050 owns queue management.
- **Decision**: Feature 063 composes the existing PlayerContext/queue interface; it must not create a second queue or claim real audio support before 040 integration.

### Selected-track behavior
- **Finding**: The spec has an early acceptance sentence that could imply only subsequent tracks, but its clarification and FR-003 explicitly require full replacement with all playlist tracks and the selected song active.
- **Decision**: Follow the clarification/FR-003: preserve full playlist order and set selected index as current.

### Edge cases and context
- **Finding**: Empty playlists must not affect queue; unavailable tracks are skipped; context changes to queue if current track is no longer from source playlist.
- **Decision**: Keep source metadata with client playback state; append operation must not interrupt current audio. Use existing notification pattern.

## Approval Gates

- Confirm player public action API and queue ownership with groups 040/050.
- Confirm how unavailable tracks are represented by the catalog/player.
- Confirm context display surface and semantics for manually queued tracks.
- No server persistence or new playback API is implied by this client behavior.
