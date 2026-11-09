# Quickstart: Playlist Playback

**Feature**: [063 Playlist Playback](./spec.md)

## Prerequisites

- Start the frontend and use the existing PlayerContext mock playback baseline.
- Confirm player and queue interfaces with 040/050 as recorded in [research.md](./research.md).
- Review [playback interaction contract](./contracts/playlist-playback.md) and [data model](./data-model.md).

## Validation Scenarios

1. Play a non-empty playlist; verify queue replacement preserves order and starts the first available song.
2. Shuffle; verify exactly the playable playlist songs occur once and playback starts.
3. Select a middle track; verify full playlist order remains and selected track becomes active.
4. Append a playlist while another song plays; verify current playback continues and new tracks append.
5. Verify empty playlist shows a temporary notification and leaves queue/current track unchanged.
6. Include unavailable tracks; verify they are skipped during construction/progression.
7. Verify bottom/full player shows playlist context, then queue context after an unrelated queued track becomes current.
8. Verify automatic progression using the player behavior supported by the current implementation.

Real audio streaming is outside this feature's baseline until 040 completes its audio integration.
