# UC-060-008 – Remove Song from Playlist

## 1. Metadata

| Field | Value |
|---|---|
| Use Case ID | UC-060-008 |
| Use Case Name | Remove Song from Playlist |
| Functional Group | 060 – Playlist Management |
| Primary Actor | Playlist Editor |
| Supporting Actors | None |
| Related FR IDs | 062-FR-005, 062-FR-006, 062-FR-007, 065-FR-004, 065-FR-008 |
| Related Feature ID | 062-playlist-song-management |
| Related Spec Kit File | [specs/060-playlist-management/062-playlist-song-management/spec.md](../../../../specs/060-playlist-management/062-playlist-song-management/spec.md) |
| Writer | Mai Đăng Khoa |
| Reviewer | [FULL NAME] |
| Status | Draft |
| Last Updated | 2026-11-03 |

## 2. Goal

The playlist editor wants to remove a song from a playlist.

## 3. Description

This use case describes how an authorized user removes a track from a playlist via the track options menu.

## 4. Preconditions

- The listener is authenticated and has edit rights for the playlist.
- The playlist detail page is open.

## 5. Trigger

The listener clicks the options menu (three dots) on a song row and selects "Xóa khỏi playlist" (Remove from playlist).

## 6. Basic Flow

1. **Playlist Editor:** Opens the `TrackMenu` for a specific song.
2. **Playlist Editor:** Selects "Xóa khỏi playlist".
3. **System:** Removes the link between the playlist and the song from the database.
4. **System:** Updates the UI by removing the song row.
5. **System:** Recalculates and updates the playlist's total song count and duration.
6. **System:** Displays a success toast notification: `"Đã xóa “<Tên bài hát>” khỏi <Tên playlist>."`

## 7. Alternative Flows

None identified.

## 8. Exception Flows

### EX-01 – Unauthorized Removal

- **Starting step:** 2
- **Condition:** User does not have permission to modify the playlist.
1. **System:** Does not show the "Remove" option in the menu or returns a "403 Forbidden" error.

- **Outcome:** Use case ends unsuccessfully.

## 9. Postconditions

### 9.1 Success Postconditions
- The song is removed from the `playlist_songs` table for this playlist.
- The playlist metadata is updated.

### 9.2 Failure Postconditions
- The song remains in the playlist.

## 10. Special Requirements

- **Performance:** Song removal is reflected in the UI immediately.

## 11. Business Rules

| Rule ID | Rule Description | Source |
|---|---|---|
| BR-060-09 | Meta Updates | [062-FR-006] System MUST update total song count and duration on removal. |

## 12. Prototype and Screenshots

### 12.1 Basic Flow

![Basic Flow – Remove Song from Playlist](../../../../specs/060-playlist-management/062-playlist-song-management/ui/03-remove-song.png)

**Covered steps:** 2-6

**Prototype type:** Implemented UI

## 13. Related Use Cases

- UC-060-003 – View Playlist Details
- UC-060-007 – Add Songs to Playlist

## 14. Traceability and Sources

| Source Type | ID / File | Relevant Section |
|---|---|---|
| Functional Requirement | 062-FR-005 | System MUST allow the playlist owner to remove any song from their playlist. |
| Functional Requirement | 062-FR-006 | Update playlist count and duration after a track is removed. |
| Functional Requirement | 062-FR-007, 065-FR-008 | Only owners and authorized collaborators can modify the playlist. |
| Functional Requirement | 065-FR-004 | Authorized collaborators can remove tracks from a collaborative playlist. |
| Spec Kit Specification | specs/060-playlist-management/062-playlist-song-management/spec.md | User Story 3 |

## 15. Open Questions

None
