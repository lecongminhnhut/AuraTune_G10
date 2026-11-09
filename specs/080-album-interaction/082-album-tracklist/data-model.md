# Data Model: Album Tracklist Playback

Feature 082 introduces no database entity, API payload, or album ordering field. It consumes the complete ordered album tracks and availability from the existing catalog/store and operates on the shared player/queue state.

## Existing entities and runtime state

| Entity/state | Existing owner | Fields or values used | Feature 082 use |
| --- | --- | --- | --- |
| Album Tracklist | Album catalog / `AppStore` | Album ID and complete ordered track references | Visible order and the complete input for album actions; do not derive sequence from rendered rows. |
| Track | Catalog / `AppStore` | Track ID, album ID, catalog order, metadata, availability/status | Visible row identity and playability decision. Keep unavailable tracks visible; exclude them from action sequences. |
| Current Track | Shared player (`useMockPlayer`) | Current track reference and playback state | Selected playable track becomes current; Play Album starts its first playable track. |
| Upcoming Queue | Shared player and Queue Management | Ordered track references after current track | Receives remaining album sequence or bulk append according to approved semantics; stays editable through QueuePanel. |
| Shuffle State | Shared player | Boolean shuffle state | Must be turned off for Play Album; listener can later enable it. |

## Derived playback sequences

- **Play Album candidates**: Filter the complete ordered album list to tracks currently playable. If empty, do not mutate player or queue and communicate that no tracks are available.
- **Selected-track sequence**: Selected playable track plus later playable tracks in album order; tracks before the selected track are not included.
- **Add all candidates**: Every playable track in album order. The actual accepted append is subject to the existing queue-capacity rule; its conflict with the feature's “all tracks” requirement is unresolved.
- **Unavailable row state**: Retain row and catalog position, disable play action, and show the existing approved generic unavailable reason. Do not define a new availability taxonomy.

## State transitions and invariants

1. Browse: render the complete ordered track set; empty lists have no album-play action.
2. Start album: when playable candidates exist, turn Shuffle off and start the first candidate; queue treatment is blocked pending reconciliation of replacement vs insertion semantics.
3. Start selected track: make that track current and sequence only later playable album tracks before existing upcoming tracks, subject to the shared queue contract.
4. Add all: preserve current playback and request append of playable album tracks; capacity and duplicate handling follow Group 050 once reconciled.
5. Repeat Play Album: restart the first playable track, rebuild the album segment without duplicates, and preserve unrelated queued tracks; exact segment policy depends on resolution of the spec conflict.
6. Playback-time failure: use Group 040's approved recovery; continuation behavior is blocked until its contract is identified.

## Unresolved constraints

The replacement/insertion conflict, 50-item queue limit vs complete 100+ track sequence, and Group 040 recovery contract are requirements/integration blockers. This model records them without proposing a schema or algorithm.
