# UC-060-009 – Reorder Songs in Playlist

## 1. Metadata

| Field | Value |
|---|---|
| Use Case ID | UC-060-009 |
| Use Case Name | Reorder Songs in Playlist |
| Functional Group | 060 – Playlist Management |
| Primary Actor | Playlist Editor |
| Supporting Actors | None |
| Related FR IDs | 062-FR-003, 062-FR-004, 062-FR-007, 065-FR-004, 065-FR-008 |
| Related Feature ID | 062-playlist-song-management |
| Related Spec Kit File | [specs/060-playlist-management/062-playlist-song-management/spec.md](../../../../specs/060-playlist-management/062-playlist-song-management/spec.md) |
| Writer | Mai Đăng Khoa |
| Reviewer | [FULL NAME] |
| Status | Draft |
| Last Updated | 2026-11-03 |

## 2. Goal

The playlist editor wants to change the sequence of songs in a playlist.

## 3. Description

This use case describes how an authorized user uses drag-and-drop handles to rearrange the order of tracks in the playlist detail view.

## 4. Preconditions

- The listener is authenticated and has edit rights for the playlist.
- The playlist detail page is open and contains at least two songs.

## 5. Trigger

The listener clicks and drags the grip handle (`⋮⋮`) on a song row.

## 6. Basic Flow

1. **Playlist Editor:** Drags a song row to a new position in the list.
2. **System:** Provides visual feedback (60fps) during the drag operation.
3. **Playlist Editor:** Drops the row at the desired position.
4. **System:** Updates the `sort_order` or position of the tracks in the database.
5. **System:** Persists the new sequence for all future views.
6. **System:** Displays a success toast notification.

## 7. Alternative Flows

None identified.

## 8. Exception Flows

### EX-01 – Persistence Failure

- **Starting step:** 4
- **Condition:** Database update fails due to network error.
1. **System:** Reverts the UI list to the previous order.
2. **System:** Displays an error toast notification.

- **Outcome:** Resume at Basic Flow step 1.

## 9. Postconditions

### 9.1 Success Postconditions
- The new song order is saved in the database.

### 9.2 Failure Postconditions
- The song order remains unchanged.

## 10. Special Requirements

- **Performance:** Drag-and-drop provides smooth 60fps feedback.
- **Concurrency:** Last state received by the server wins.

## 11. Business Rules

| Rule ID | Rule Description | Source |
|---|---|---|
| BR-060-10 | Order Persistence | [062-FR-003] System MUST persist sort_order or position. |

## 12. Prototype and Screenshots

### 12.1 Basic Flow

![Basic Flow – Reorder Songs in Playlist](../../../../specs/060-playlist-management/062-playlist-song-management/ui/01-playlist-tracklist.png)

**Covered steps:** 1 (Grip handles are visible)

**Prototype type:** Implemented UI

## 13. Related Use Cases

- UC-060-003 – View Playlist Details

## 14. Traceability and Sources

| Source Type | ID / File | Relevant Section |
|---|---|---|
| Functional Requirement | 062-FR-004 | System MUST support drag-and-drop reordering of songs within the playlist detail view. |
| Functional Requirement | 062-FR-003 | Persist each playlist-song association with its position. |
| Functional Requirement | 062-FR-007, 065-FR-008 | Only owners and authorized collaborators can modify the playlist. |
| Functional Requirement | 065-FR-004 | Authorized collaborators can reorder tracks in a collaborative playlist. |
| Spec Kit Specification | specs/060-playlist-management/062-playlist-song-management/spec.md | User Story 3 |

## 15. Open Questions

None
