# UC-040-007 – Share Song

---

## 1. Metadata

| Field | Value |
|---|---|
| **Use Case ID** | UC-040-007 |
| **Use Case Name** | Share Song |
| **Functional Group** | 040 – Music Player |
| **Primary Actor** | Guest / Visitor (`ACT-01`), Listener (`ACT-02`) |
| **Supporting Actors** | None |
| **Related FR IDs** | `046-FR-001`, `046-FR-002`, `046-FR-003`, `046-FR-004`, `046-FR-005` |
| **Related Feature/Spec** | Feature 046: Song Sharing and Comments (`specs/040-music-player/046-song-sharing-and-comments/spec.md`) |
| **Status** | Draft |
| **Writer** | Nguyễn Thanh Huy |
| **Reviewer** | TBD |

---

## 2. Description

A guest or listener shares a track with other people by using the device share sheet or by copying a link. The link opens content that contains the shared track, and the actor is told the result.

---

## 3. Preconditions

- The track is visible in the full player or in a track list with the "…" menu.

---

## 4. Trigger

The actor selects the share control in the full player, or "Chia sẻ" in a track's "…" menu (`046-FR-001`).

---

## 5. Basic Flow

1. **Actor:** Selects the share control (`046-FR-001`).
2. **System:** Builds a link that opens content containing the track: the album page focused on the track, or a search for the track when it has no album (`046-FR-005`).
3. **System:** Detects that no device share sheet is available and copies the link to the clipboard (`046-FR-002`).
4. **System:** Confirms that the link was copied (`046-FR-003`).
5. **Actor:** Pastes the link wherever they want to share it.

---

## 6. Alternative Flows

### AF-01 – Share Through the Device Share Sheet
- **Starting step:** Step 3 of the Basic Flow.
- **Condition:** The device supports a share sheet, for example on a phone (`046-FR-002`).
1. **System:** Opens the device share sheet with the track title and link.
2. **Actor:** Chooses an app or contact and completes sharing.
- **Continuation:** Use case ends successfully.

### AF-02 – Share Cancelled
- **Starting step:** Step 2 of AF-01.
- **Condition:** The actor closes the share sheet without sharing (`046-FR-004`).
1. **System:** Shows no message.
- **Continuation:** Use case ends with no change.

---

## 7. Exception Flows

### EF-01 – Sharing Fails
- **Starting step:** Step 3 of the Basic Flow.
- **Condition:** The link cannot be copied or the share sheet fails (`046-FR-003`).
1. **System:** Shows a message suggesting that the actor copy the link from the address bar.
- **Continuation:** Use case ends in failure.

---

## 8. Postconditions

### Success
- The link is copied or shared, and it opens content containing the shared track.

### Failure
- Nothing is shared, and the actor has been told why, except after a cancel.

---

## 9. Special Requirements

- **Correctness**: 100% of share links open content containing the track.
- **Privacy**: The link contains no personal data.

---

## 10. Prototype and Screenshots

> **Asset type**: Implementation screenshots captured from the current frontend prototype, which runs on demo data.

### Basic Flow

![Share confirmation](prototypes/UC-040-007-basic-flow.png)
*Figure 1: Share control in the full player and the "link copied" confirmation (Steps 1–4).*

### Alternative Flow – AF-01 and Exception Flow – EF-01
*[Prototype Pending - To be generated during UI implementation]*  
*Planned Interface: Device share sheet on a phone and the failure message. The share sheet is drawn by the operating system.*

---

## 11. Related Use Cases

- **Related Use Case**: `UC-080-005` (Share Album) – The same sharing pattern for albums.
- **Target Navigation**: `UC-080-001` (View Album Details and Tracklist), `UC-030-001` (Search Catalog by Text Metadata).

---

## 12. Source References

- `specs/040-music-player/046-song-sharing-and-comments/spec.md` – Requirements FR-001 to FR-005, User Story 1, Edge Cases.
- `docs/proposal/proposal.md` – Section 6.4: share.

---

## 13. Notes and Open Questions

- **Social Features**: The proposal notes that sharing and comments make AuraTune closer to a social network, which may need a licence in Vietnam (proposal, Section 4.2). This does not change the behavior specified here.
