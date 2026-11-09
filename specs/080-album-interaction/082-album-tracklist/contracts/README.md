# Integration Contract Boundary: Album Tracklist Playback

Feature 082 defines no new REST endpoint or payload. It consumes the existing album catalog/store and calls the shared playback/queue interface exposed through `PlayerContext`.

## Required behavior at the existing boundary

- Input: complete album track list in catalog order, plus each track's existing playability/status information.
- Play Album: turn Shuffle off and start the first playable track. Queue mutation is blocked pending requirements reconciliation.
- Selected track: start the selected playable track and schedule only later playable album tracks before existing upcoming tracks, subject to the shared queue contract.
- Add all: request append of playable album tracks without interrupting current playback, subject to Group 050 capacity and duplicate rules.
- Output: current track and upcoming queue remain in the shared player state and are visible/editable through existing player/queue UI.
- Unavailable track: retain it in the visible list, disable its play action, and reuse the existing generic unavailable feedback.

This note is not a new API or final player contract. Play Album replacement vs insertion, queue capacity handling for full long albums, and playback-time failure recovery must be approved by the requirements and Group 040/050 owners before implementation. Do not create a new callback, payload, queue schema, or endpoint on the basis of this note.
