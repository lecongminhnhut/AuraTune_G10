# UC-040-008 – Read Track Comments
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

---

## 1. Metadata
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Field | Value |
|---|---|
| **Use Case ID** | UC-040-008 |
| **Use Case Name** | Read Track Comments |
| **Functional Group** | 040 – Music Player |
| **Primary Actor** | Guest / Visitor (`ACT-01`), Listener (`ACT-02`) |
| **Supporting Actors** | None |
| **Related FR IDs** | `046-FR-006`, `046-FR-007`, `046-FR-014`, `046-FR-015` |
| **Related Feature/Spec** | Feature 046: Song Sharing and Comments (`specs/040-music-player/046-song-sharing-and-comments/spec.md`) |
| **Status** | Draft |
| Writer | Lê Công Minh Nhựt |
| Original Writer (PA3 draft) | Nguyễn Thanh Huy |
| Reviewer | Group 10 team |

---

## 2. Description
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Any visitor reads what others have said about the current track in the comments panel of the full player. Each comment shows its author, relative time, and text. Guests see a sign-in prompt instead of the comment input.

---

## 3. Preconditions
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- A track is loaded in the player (`UC-040-001`).
- The full player is open (`UC-040-006`).

---

## 4. Trigger
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

The actor selects the comments tab ("Bình luận") in the full player.

---

## 5. Basic Flow
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

1. **Actor:** Selects the comments tab.
2. **System:** Loads the comments for the current track (`046-FR-006`).
3. **System:** Shows each comment with its author, relative time, and text (`046-FR-007`).
4. **Actor:** Scrolls through the comments.

---

## 6. Alternative Flows
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### AF-01 – Track Has No Comments
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** Step 3 of the Basic Flow.
- **Condition:** No one has commented on the track (`046-FR-014`).
1. **System:** Shows an empty state inviting the first comment.
- **Continuation:** Use case ends successfully.

### AF-02 – Guest Reads Comments
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** Step 3 of the Basic Flow.
- **Condition:** The actor is not signed in (`046-FR-015`).
1. **System:** Shows the comments and replaces the comment input with a sign-in prompt.
- **Continuation:** Resumes at Step 4 of the Basic Flow.

### AF-03 – Write a Comment
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** Step 4 of the Basic Flow.
- **Condition:** A signed-in listener wants to add a comment.
1. **Actor:** Selects the comment input ("Viết bình luận…").
- **Continuation:** Use case ends; the listener continues in `UC-040-009`.

### AF-04 – Track Changes
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** Step 4 of the Basic Flow.
- **Condition:** The current track changes.
1. **System:** Loads and shows the comments of the new track.
- **Continuation:** Resumes at Step 3 of the Basic Flow.

---

## 7. Exception Flows
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### EF-01 – Comments Cannot Be Loaded
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** Step 2 of the Basic Flow.
- **Condition:** The comments request fails.
1. **System:** Shows an error with a retry option and keeps playback running.
- **Continuation:** Resumes at Step 2 on retry; otherwise the use case ends in failure.

---

## 8. Postconditions
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### Success
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- The actor sees all comments for the current track, or an empty state.

### Failure
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- An error is shown, and playback is unaffected.

---

## 9. Special Requirements
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- **Access**: Comments are public; reading requires no account (`046-FR-006`).
- **Readability**: Long text without spaces wraps inside the panel.

---

## 10. Prototype and Screenshots
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

> **Asset type**: Implementation screenshots captured from the current frontend prototype, which runs on demo data.

### Basic Flow
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

![Comments panel](prototypes/UC-040-008-basic-flow.png)
*Figure 1: Comments panel with author, relative time, and text (Steps 1–3).*

### Alternative Flow – AF-01 (No Comments)
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

![Empty comments](prototypes/UC-040-008-AF-01-no-comments.png)
*Figure 2: Empty state for a track with no comments.*

### Alternative Flow – AF-02 (Guest)
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

![Guest sign-in prompt](prototypes/UC-040-008-AF-02-guest-prompt.png)
*Figure 3: Comments shown to a guest with a sign-in prompt instead of the input.*

### Exception Flow – EF-01
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
*[Prototype Pending - To be generated during UI implementation]*  
*Planned Interface: Comment loading error with retry.*

---

## 11. Related Use Cases
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- **Preceding Use Case**: `UC-040-006` (Toggle Persistent Mini and Full Player).
- **Extended by**: `UC-040-009` (Post Track Comment), `UC-040-010` (Delete Track Comment).
- **Related Use Case**: `UC-040-005` (View Synchronized Lyrics) – The other tab of the full player.

---

## 12. Source References
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- `specs/040-music-player/046-song-sharing-and-comments/spec.md` – Requirements FR-006, FR-007, FR-014, FR-015, User Story 2.
- `docs/analysis-and-design/api-contract.md` – Section 2.4: `GET /songs/:id/comments`.

---

## 13. Notes and Open Questions
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- **Timestamped Comments**: The API Contract allows an optional `timestamp_seconds`, but the specification does not use it.

## PA4 implementation evidence and acceptance record
Performed by: Nguyễn Thanh Huy | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Player components and `useAudioPlayer.js` exist, with backend metadata/stream handling in `songController.js`. Comments remain browser-state operations in `AppStore.jsx`; backend lyrics and history-write integration remain open in Group 040 tasks. Stream/range tests are not proof of server-side comment persistence or every lyrics state.

The flows above state required behavior. This revision records source inspection only; no browser acceptance or new feature-test run is claimed. Before acceptance, execute the basic flow and its applicable alternative/exception flows, checking the documented success and failure postconditions. Record results against this UC ID in [the PA4 review register](../../use-case-model.md#11-pa4-decisions-and-source-review).
