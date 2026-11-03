# UC-060-004 – Edit Playlist Metadata

## 1. Metadata

| Field | Value |
|---|---|
| Use Case ID | UC-060-004 |
| Use Case Name | Edit Playlist Metadata |
| Functional Group | 060 – Playlist Management |
| Primary Actor | Playlist Owner |
| Supporting Actors | None |
| Related FR IDs | FR-007 |
| Related Feature ID | 061-playlist-crud |
| Related Spec Kit File | [specs/060-playlist-management/061-playlist-crud/spec.md](../../../../specs/060-playlist-management/061-playlist-crud/spec.md) |
| Writer | Mai Đăng Khoa |
| Reviewer | [FULL NAME] |
| Status | Draft |
| Last Updated | 2026-11-03 |

## 2. Goal

The playlist owner wants to update the title, description, or cover theme of their playlist.

## 3. Description

This use case describes how the owner of a playlist modifies its descriptive information using the edit modal.

## 4. Preconditions

- The listener is authenticated and owns the playlist.
- The playlist detail page is open.

## 5. Trigger

The listener clicks the "Chỉnh sửa chi tiết" (Edit Details) button (pencil icon) on the playlist detail page.

## 6. Basic Flow

1. **Playlist Owner:** Clicks the Edit button.
2. **System:** Opens the "Chỉnh sửa chi tiết" modal dialog, pre-filled with current title, description, and cover theme.
3. **Playlist Owner:** Modifies the title, description, or cover theme.
4. **Playlist Owner:** Clicks "Lưu" (Save).
5. **System:** Validates the input (character limits).
6. **System:** Updates the playlist record in the database.
7. **System:** Updates the UI in real-time to reflect changes.
8. **System:** Displays a success toast notification.

## 7. Alternative Flows

### AF-01 – Change Visibility

- **Starting step:** 3
- **Condition:** Owner wants to change the playlist from Private to Public (or vice versa).

1. **Playlist Owner:** Toggles the "Công khai" (Public) switch.
2. **System:** Records the status change.

- **Outcome:** Resume at Basic Flow step 4.

## 8. Exception Flows

### EX-01 – Unauthorized Edit Attempt

- **Starting step:** 1
- **Condition:** User is not the owner of the playlist.
1. **System:** Does not display the Edit button, or if accessed via URL, returns a "403 Forbidden" error.

- **Outcome:** Use case ends unsuccessfully.

### EX-02 – Validation Errors

- **Starting step:** 5
- **Condition:** Title > 80 characters or Description > 300 characters.
1. **System:** Prevents saving and displays validation messages.

- **Outcome:** Resume at Basic Flow step 3.

## 9. Postconditions

### 9.1 Success Postconditions
- The playlist metadata is updated in the database.
- The UI reflects the new metadata.

### 9.2 Failure Postconditions
- The playlist metadata remains unchanged.

## 10. Special Requirements

- **Security:** 100% of unauthorized attempts to edit are blocked by the backend.
- **Concurrency:** If multiple edits happen, the last write wins.

## 11. Business Rules

| Rule ID | Rule Description | Source |
|---|---|---|
| BR-060-04 | Ownership Check | [FR-007] Only the owner can update playlist metadata. |

## 12. Prototype and Screenshots

### 12.1 Basic Flow

![Basic Flow – Edit Playlist Metadata](../../../../specs/060-playlist-management/061-playlist-crud/ui/04-edit-playlist.png)

**Covered steps:** 2-4

**Prototype type:** Implemented UI

## 13. Related Use Cases

- UC-060-003 – View Playlist Details

## 14. Traceability and Sources

| Source Type | ID / File | Relevant Section |
|---|---|---|
| Functional Requirement | FR-007 | System MUST allow the owner of a playlist to update its name, description, cover_url, and status. |
| Spec Kit Specification | specs/060-playlist-management/061-playlist-crud/spec.md | User Story 4 |

## 15. Open Questions

None
