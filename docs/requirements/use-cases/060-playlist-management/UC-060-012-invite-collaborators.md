# UC-060-012 – Invite Collaborators

## 1. Metadata

| Field | Value |
|---|---|
| Use Case ID | UC-060-012 |
| Use Case Name | Invite Collaborators |
| Functional Group | 060 – Playlist Management |
| Primary Actor | Playlist Owner |
| Supporting Actors | None |
| Related FR IDs | FR-065-02, FR-065-03 |
| Related Feature ID | 065-collaborative-playlists |
| Related Spec Kit File | [specs/060-playlist-management/065-collaborative-playlists/spec.md](../../../../specs/060-playlist-management/065-collaborative-playlists/spec.md) |
| Writer | Mai Đăng Khoa |
| Reviewer | [FULL NAME] |
| Status | Draft |
| Last Updated | 2026-11-03 |

## 2. Goal

The playlist owner wants to invite specific users to collaborate on their playlist.

## 3. Description

This use case describes how the owner of a collaborative playlist invites other registered users by entering their email address.

## 4. Preconditions

- The listener is authenticated and owns the playlist.
- Collaborative mode is enabled for the playlist.
- The `CollaboratorsDialog` is open.

## 5. Trigger

The listener enters an email address in the invitation input and clicks "Mời" (Invite).

## 6. Basic Flow

1. **Playlist Owner:** Enters a valid email of a registered AuraTune user.
2. **Playlist Owner:** Clicks the "Mời" button.
3. **System:** Validates that the email belongs to a registered user.
4. **System:** Creates a record in the `playlist_shared_users` table with the role `Collaborator`.
5. **System:** Adds the user to the collaborators roster in the modal.
6. **System:** Displays a success toast: `"<Tên hiển thị> có thể cùng chỉnh sửa playlist này."`
7. **System:** (Implicitly) Grants the invited user editing access.

## 7. Alternative Flows

None identified.

## 8. Exception Flows

### EX-01 – User Not Found

- **Starting step:** 3
- **Condition:** The entered email does not belong to any registered user.
1. **System:** Displays an error message: "Không tìm thấy người dùng với email này."

- **Outcome:** Resume at Basic Flow step 1.

### EX-02 – User Already a Collaborator

- **Starting step:** 3
- **Condition:** The user is already invited or is the owner.
1. **System:** Displays a message stating the user is already a member.

- **Outcome:** Resume at Basic Flow step 1.

## 9. Postconditions

### 9.1 Success Postconditions
- The invited user is linked to the playlist with collaborator permissions.
- The playlist appears in the invited user's Library.

### 9.2 Failure Postconditions
- No new collaborator is added.

## 10. Special Requirements

- **Other:** Invited users immediately receive collaborator access.

## 11. Business Rules

| Rule ID | Rule Description | Source |
|---|---|---|
| BR-060-13 | Targeted Invitation | [Spec 065] Owner invites registered users by entering their email address. |

## 12. Prototype and Screenshots

### 12.1 Basic Flow

![Basic Flow – Invite Collaborators](../../../../specs/060-playlist-management/065-collaborative-playlists/ui/02-invite-collaborators.png)

**Covered steps:** 1-2

**Prototype type:** Implemented UI

## 13. Related Use Cases

- UC-060-011 – Enable Collaboration on Playlist
- UC-060-013 – Manage Collaborators

## 14. Traceability and Sources

| Source Type | ID / File | Relevant Section |
|---|---|---|
| Functional Requirement | FR-065-02 | System MUST allow playlist owners to invite registered AuraTune users by entering their email address. |
| Functional Requirement | FR-065-03 | Invited users MUST immediately receive collaborator access upon invitation. |
| Spec Kit Specification | specs/060-playlist-management/065-collaborative-playlists/spec.md | User Story 2 |

## 15. Open Questions

None
