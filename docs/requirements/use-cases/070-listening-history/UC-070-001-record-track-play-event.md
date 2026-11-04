# UC-070-001 – Record Track Play Event

---

## 1. Metadata

| Field | Value |
|---|---|
| Use Case ID | UC-070-001 |
| Use Case Name | Record Track Play Event |
| Functional Group | 070 – Listening History |
| Primary Actor | System / Player |
| Supporting Actors | None |
| Related FR IDs | `071-FR-001`, `071-FR-002`, `071-FR-003`, `071-FR-010` |
| Related Feature ID | 071 |
| Related Spec Kit File | [`specs/070-listening-history/071-listening-history/spec.md`](../../../../specs/070-listening-history/071-listening-history/spec.md) |
| Writer | Mai Đăng Khoa |
| Reviewer | [FULL NAME] |
| Status | Draft |
| Last Updated | 2026-11-03 |

---

## 2. Goal
The system automatically records a playback session to the user's history once a specific listening threshold is reached, ensuring data for analytics and recommendations.

## 3. Description
This use case occurs in the background during music playback. When a song is played for at least 30 seconds (or 90% for very short songs), the Music Player triggers a request to the backend to log the event with the user ID, song ID, and current timestamp.

---

## 4. Preconditions
- A Listener is authenticated and has an active session.
- A song is currently being played in the AuraTune Music Player.

---

## 5. Trigger
The playback of a track reaches the 30-second threshold (or 90% completion for tracks shorter than 30 seconds).

---

## 6. Basic Flow

1. **System:** Monitors the active playback duration of the current track.
2. **System:** Detects that playback has reached 30 seconds (`071-FR-001`).
3. **System:** Dispatches a `POST /api/history` request containing `user_id`, `song_id`, and `played_at` timestamp (`071-FR-003`).
4. **System:** Validates the request and persists the record into the `listening_history` database table.
5. **System:** Returns a success confirmation to the client (silently handled).

---

## 7. Alternative Flows

### AF-01 – Short Track Completion
- **Starting step:** 1
- **Condition:** The track is shorter than 30 seconds.
1. **System:** Monitors playback until the song reaches 90% completion.
2. **System:** Records the play event with the required user, song, and timestamp data.
- **Outcome:** Use case ends successfully.

---

## 8. Exception Flows

### EF-01 – Network Interruption
- **Starting step:** 3
- **Condition:** The client loses internet connection before the request can be sent or confirmed.
1. **System:** Follows the configured event-delivery retry policy, if one exists.
2. **System:** If the event cannot be delivered, the record is not created.
- **Outcome:** Use case ends in failure.

---

## 9. Postconditions

### 9.1 Success Postconditions
- A new entry is added to the `listening_history` table for the authenticated user.
- The record is immediately available for recently played lists and statistics.

### 9.2 Failure Postconditions
- No record is created in the database.
- No error is shown to the user (background process).

---

## 10. Special Requirements
- **Performance:** Recording events must not impact audio playback performance or UI responsiveness.
- **Privacy:** Play events are only recorded for authenticated users. A history opt-out is not specified by the source requirements.

---

## 11. Business Rules

| Rule ID | Rule Description | Source |
|---|---|---|
| BR-070-01 | Minimum threshold for a "valid play" is 30 seconds or 90% of duration. | 071/spec.md |

---

## 12. Prototype and Screenshots
*No UI prototype for this background process. See UC-070-002 for the visual result of these records.*

---

## 13. Related Use Cases
- UC-070-002 – View Listening History

---

## 14. Traceability and Sources

| Source Type | ID / File | Relevant Section |
|---|---|---|
| Functional Requirement | 071-FR-001 | Automatic play recording. |
| Spec Kit Specification | specs/070-listening-history/071-listening-history/spec.md | User Story 1 |
| Architecture Document | docs/design/database/data-consistency.md | History logging |

---

## 15. Open Questions

- Automatic 365-day retention is represented by UC-070-007; confirm the retention process owner and schedule.
- The retry policy for a failed event-delivery request is not specified in the feature requirements.
