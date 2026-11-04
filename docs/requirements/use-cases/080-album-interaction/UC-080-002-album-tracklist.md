# UC-080-002 – Play Album Tracklist

---

## 1. Metadata

| Field | Value |
|---|---|
| **Use Case ID** | UC-080-002 |
| **Use Case Name** | Play Album Tracklist |
| **Functional Group** | 080 – Album |
| **Primary Actor** | Listener (`ACT-02`) |
| **Supporting Actors** | Music Player (`Group 040`) |
| **Related FR IDs** | `082-FR-001` to `082-FR-016` |
| **Related Feature/Spec** | Feature 082: Album Tracklist Playback (`specs/080-album-interaction/082-album-tracklist/spec.md`) |
| **Status** | Draft |
| **Writer** | Nguyễn Khánh Đăng |
| **Reviewer** | TBD |

---

## 2. Description

Allows a listener to start playback from the first playable track of an album or from a selected track, integrating with the existing Music Player and Queue Management behavior.

---

## 3. Preconditions

- The listener is viewing an album and its complete track data is available.
- The existing Music Player and Queue Management behavior are available to receive playback requests.

---

## 4. Trigger

The listener selects the "Play Album" (Phát album) action or a specific playable track row.

---

## 5. Basic Flow

1. **Actor:** Selects the "Play Album" action.
2. **System:** Verifies there are playable tracks. Turns off "Shuffle" mode if it is currently enabled (`082-FR-013`).
3. **System:** Replaces the playback queue with the album's playable tracks in artist-intended order (`082-FR-004`).
4. **System:** Starts playback from the first playable track in the album (`082-FR-004`).
5. **System:** Makes the remaining playable album tracks available in artist-intended order through the existing queue (`082-FR-004`, `082-FR-007`, `082-FR-009`).
6. **System:** Updates the persistent mini-player at the bottom with the new active track context (cover art, title, artist) and visually highlights the playing track row in the tracklist.
7. **Actor:** Listens to the album seamlessly, even if navigating to other pages (`082-FR-008`).

---

## 6. Alternative Flows

### AF-01 – Play Selected Track
- **Starting step:** Step 1 of the Basic Flow.
- **Condition:** The listener selects a specific playable track instead of Play Album.
1. **Actor:** Selects the play action on a specific playable track row.
2. **System:** Makes the selected track the current active track.
3. **System:** Inserts all playable tracks that *follow* it in the album into the upcoming queue (ignoring tracks before it) (`082-FR-006`).
- **Continuation:** Resumes at Step 6 of the Basic Flow.

### AF-02 – Add All to Queue
- **Starting step:** Step 1 of the Basic Flow.
- **Condition:** The listener selects the "Thêm tất cả vào danh sách chờ" (Add all to queue) action.
1. **Actor:** Clicks "Thêm tất cả vào danh sách chờ".
2. **System:** Appends all playable tracks from the album to the *end* of the current playback queue, without interrupting the song currently playing (`082-FR-016`).
- **Continuation:** Use Case ends successfully.

---

## 7. Exception Flows

### EF-01 – Unavailable Tracks
- **Starting step:** Step 5 of the Basic Flow.
- **Condition:** One or more tracks are marked unavailable for playback.
1. **System:** Keeps each unavailable track visible but disabled and shows the applicable reason (`082-FR-005`, `082-FR-011`).
2. **System:** Omits unavailable tracks from playback and continues with the next playable track in album order (`082-FR-011`).
- **Continuation:** Resume playback with the remaining valid sequence.

### EF-02 – Empty or Completely Unavailable Album
- **Starting step:** Step 2 of the Basic Flow.
- **Condition:** The album has zero playable tracks.
1. **System:** Disables the "Play Album" button.
2. **System:** Displays a state indicating no tracks are available and does not start the player or modify the queue (`082-FR-010`).
- **Continuation:** Use Case ends unsuccessfully.

### EF-03 – Track Becomes Unavailable at Playback
- **Starting step:** Step 4 of the Basic Flow or AF-01, Step 2.
- **Condition:** A track becomes unavailable when playback is attempted (`082-FR-014`).
1. **System:** Uses the existing player error and recovery behavior and does not substitute an unrelated track.
2. **System:** Continues with the next playable album track when possible (`082-FR-014`).
- **Continuation:** Resume the remaining album sequence, or end in a handled failure if no playable track remains.

---

## 8. Postconditions

### Success
- For Play Album, the first playable album track is active and the playback queue contains the album's playable tracks in the required order.
- For selected-track playback, the selected track is active and following playable tracks are queued in album order.
- Shuffle is off after Play Album; the requirement does not specify changing Shuffle for selected-track playback.

### Failure
- If playback fails, the existing player state is maintained and unrelated queue items are unharmed.

---

## 9. Special Requirements

- **Shuffle Override**: Playing a full album automatically disables Shuffle to respect artist-intended order (`082-FR-013`).
- **Queue Behavior**: This UC follows `082-FR-004` for Play Album, which says to replace the playback queue. The Feature 082 clarification says to preserve the existing upcoming queue after the album, and `082-FR-012` also says to preserve non-album tracks on replay; these source statements conflict and require owner resolution.
- **Re-play Handling**: Clicking Play Album on an already playing album restarts it from track 1 and rebuilds the queue block without duplicating tracks (`082-FR-012`).
- **State Persistence**: The player and queue must remain active while the user navigates across different pages.

---

## 10. Prototype and Screenshots

### Basic Flow - Album Tracklist View
![Album Tracklist](prototypes/UC-080-002-album-tracklist.png)
**Covered steps:** Basic Flow step 1.
**Prototype type:** Available; source type to verify

### Basic Flow - Play Album Action
![Play Album](prototypes/UC-080-002-play-album.png)
**Covered steps:** Basic Flow steps 1-4.
**Prototype type:** Available; source type to verify

### Alternative Flow - Play Selected Track (AF-01)
![Selected Track Playing](prototypes/UC-080-002-selected-track-playing.png)
**Covered steps:** AF-01 steps 1-2.
**Prototype type:** Available; source type to verify

### Basic Flow - Album Playback Queue Integration
![Album Queue](prototypes/UC-080-002-album-queue.png)
**Covered steps:** Basic Flow step 5.
**Prototype type:** Available; source type to verify

---

## 11. Related Use Cases

- **Target Player**: `UC-040-001` (Control Audio Playback)
- **Target Queue**: `UC-050-001` (Manage Queue)

---

## 12. Source References

- `specs/080-album-interaction/082-album-tracklist/spec.md` – Requirements 082-FR-001 through 082-FR-016.
- `docs/proposal/proposal.md`

---

## 13. Notes and Open Questions

- **Queue Logic**: See the source conflict recorded under Special Requirements; do not treat queue preservation and queue replacement as simultaneously confirmed behavior.
