# Data Model: Playlist Playback

**Feature**: [063 Playlist Playback](./spec.md)

## Playback Queue Item

| Field | Meaning |
|---|---|
| song identity and display/playability metadata | Existing song view model; exact shape comes from AppStore/catalog. |
| playlist order | Ordered membership sequence supplied by 062/playlist read. |
| current index | Index of the active song; selected-track action points here while queue retains full playlist order. |

## Playback Context

| Field | Meaning / rule |
|---|---|
| source type | Playlist or queue/other source. |
| playlist identity/name | Present for playlist-originated playback; name displayed by player surfaces. |
| current item membership | When current song is not part of source playlist, context transitions to queue or equivalent. |

## State Transitions

- Play: replace upcoming queue with available playlist songs in order and start first available song.
- Shuffle: replace with each playable playlist song once in randomized order and start.
- Select song: retain full playlist order and set selected song active.
- Add to queue: append playable songs without changing active audio.
- Empty playlist: notify and leave queue/context untouched.
- End of track: advance to next available queue item according to shared player/queue behavior.
