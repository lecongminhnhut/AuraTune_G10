# Playlist Playback Interaction Contract

**Feature**: [063 Playlist Playback](../spec.md)
**Shared ownership**: Feature 040 owns player controls/audio; feature 050 owns queue behavior.

## Required Player Operations

| Action | Required behavior |
|---|---|
| Play playlist | Replace queue with playable tracks in playlist order; activate first available track. |
| Shuffle playlist | Replace queue with all playable tracks exactly once in randomized order; start playback. |
| Play selected track | Keep full playlist ordering and activate selected track index. Clarification in spec is authoritative. |
| Append playlist | Add playable tracks to queue tail without interrupting current playback. |
| Track end | Advance according to 050 queue progression; skip unavailable tracks. |

## Context and Empty State

Playback context records playlist ID/name while active item belongs to source. Update display to queue/equivalent when current item is unrelated. Empty playlist action emits a temporary notification and performs no queue mutation.

This is an interaction contract, not an approved backend API. Exact PlayerContext method names and unavailable-track fields must match the 040/050 implementation; do not introduce a duplicate queue abstraction.
