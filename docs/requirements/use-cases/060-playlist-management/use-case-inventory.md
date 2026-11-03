# Use-Case Inventory – 060 Playlist Management

## 1. Purpose

This inventory lists all approved and candidate use cases within 060. Every use case shown in the group's Use-Case Model must be listed here and must have a corresponding specification file.

## 2. Inventory

| UC ID | Use-Case Name | Primary Actor | Supporting Actors | Related FR IDs | Feature ID | Writer | Reviewer | Status | Specification |
|---|---|---|---|---|---|---|---|---|---|
| UC-060-001 | View Playlists in Library | Listener | None | FR-004 | 061-playlist-crud | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-001-view-playlists-in-library.md] |
| UC-060-002 | Create Playlist | Listener | None | FR-001, FR-002, FR-003, FR-009 | 061-playlist-crud | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-002-create-playlist.md] |
| UC-060-003 | View Playlist Details | Listener | None | FR-005, FR-006 | 061-playlist-crud | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-003-view-playlist-details.md] |
| UC-060-004 | Edit Playlist Metadata | Playlist Owner | None | FR-007 | 061-playlist-crud | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-004-edit-playlist-metadata.md] |
| UC-060-005 | Delete Playlist | Playlist Owner | None | FR-008 | 061-playlist-crud | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-005-delete-playlist.md] |
| UC-060-006 | Bookmark Public Playlist | Listener | None | FR-010 | 061-playlist-crud | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-006-bookmark-public-playlist.md] |
| UC-060-007 | Add Songs to Playlist | Playlist Editor | None | FR-001 | 062-playlist-song-management | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-007-add-songs-to-playlist.md] |
| UC-060-008 | Remove Song from Playlist | Playlist Editor | None | FR-005 | 062-playlist-song-management | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-008-remove-song-from-playlist.md] |
| UC-060-009 | Reorder Songs in Playlist | Playlist Editor | None | FR-004 | 062-playlist-song-management | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-009-reorder-songs-in-playlist.md] |
| UC-060-010 | Toggle Like Song | Listener | None | FR-002 | 062-playlist-song-management | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-010-toggle-like-song.md] |
| UC-060-011 | Enable Collaboration on Playlist | Playlist Owner | None | FR-065-01 | 065-collaborative-playlists | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-011-enable-collaboration-on-playlist.md] |
| UC-060-012 | Invite Collaborators | Playlist Owner | None | FR-065-02, FR-065-03 | 065-collaborative-playlists | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-012-invite-collaborators.md] |
| UC-060-013 | Manage Collaborators | Playlist Owner | None | FR-065-07 | 065-collaborative-playlists | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-013-manage-collaborators.md] |
| UC-060-014 | View Collaborative Playlist Details | Participant | None | FR-065-04, FR-065-05, FR-065-10 | 065-collaborative-playlists | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-060-014-view-collaborative-playlist-details.md] |

## 3. Status Definitions

| Status | Meaning |
|---|---|
| Not Started | No specification draft exists. |
| Draft | The writer is preparing the specification. |
| In Review | The specification and its prototype are ready for peer review. |
| Changes Requested | Reviewer identified changes that must be addressed. |
| Approved | Group owner/reviewer accepted the specification and its traceability. |

## 4. Coverage Check

| FR ID | Requirement Summary | Covered by UC IDs | Coverage Status | Notes |
|---|---|---|---|---|
| FR-001 | Create playlist with name and description | UC-060-002 | Covered | |
| FR-002 | Default new playlists to Private | UC-060-002 | Covered | |
| FR-003 | Enforce character limits (Title 80, Desc 300) | UC-060-002 | Covered | |
| FR-004 | Retrieve list of user playlists | UC-060-001 | Covered | |
| FR-005 | View metadata of public playlists | UC-060-003 | Covered | |
| FR-006 | Restrict viewing of private playlists | UC-060-003 | Covered | |
| FR-007 | Update playlist metadata | UC-060-004 | Covered | |
| FR-008 | Delete playlist permanently with confirmation | UC-060-005 | Covered | |
| FR-009 | Provide default cover image | UC-060-002 | Covered | |
| FR-010 | Save public playlists to library | UC-060-006 | Covered | |
| FR-062-01 | Add songs to playlist | UC-060-007 | Covered | |
| FR-062-02 | Liked Songs integration | UC-060-010 | Covered | |
| FR-062-03 | Persist association and order | UC-060-007, UC-060-009 | Covered | |
| FR-062-04 | Drag-and-drop reordering | UC-060-009 | Covered | |
| FR-062-05 | Remove song from playlist | UC-060-008 | Covered | |
| FR-062-06 | Update metadata on track changes | UC-060-007, UC-060-008 | Covered | |
| FR-065-01 | Toggle collaborative status | UC-060-011 | Covered | |
| FR-065-02 | Invite users by email | UC-060-012 | Covered | |
| FR-065-03 | Immediate access for invited users | UC-060-012 | Covered | |
| FR-065-04 | Collaborators can add/remove/reorder | UC-060-014 | Covered | |
| FR-065-05 | Record contributor of each track | UC-060-014 | Covered | |
| FR-065-07 | Manage collaborator roster | UC-060-013 | Covered | |

## 5. Review Checklist

- [x] Every UC in the diagram is listed in this inventory.
- [x] Every inventory entry has a corresponding specification file.
- [x] UC IDs and names are consistent across the model, inventory and specification files.
- [x] Every in-scope FR is mapped to one or more UCs, or has a documented reason for not being represented as a UC.
- [x] Feature IDs and Spec Kit paths are valid.
- [x] Writers and reviewers are assigned.
- [x] Status values reflect the actual review state.
