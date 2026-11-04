# Use-Case Inventory – 060 Playlist Management

## 1. Purpose

This inventory lists all approved and candidate use cases within 060. Every use case shown in the group's Use-Case Model must be listed here and must have a corresponding specification file.

## 2. Inventory

| UC ID | Use-Case Name | Primary Actor | Supporting Actors | Related FR IDs | Feature ID | Writer | Reviewer | Status | Specification |
|---|---|---|---|---|---|---|---|---|---|
| UC-060-001 | View Playlists in Library | Listener | None | 061-FR-004, 061-FR-010, 062-FR-002 | 061-playlist-crud | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-001-view-playlists-in-library.md) |
| UC-060-002 | Create Playlist | Listener | None | 061-FR-001, 061-FR-002, 061-FR-003, 061-FR-009 | 061-playlist-crud | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-002-create-playlist.md) |
| UC-060-003 | View Playlist Details | Listener | None | 061-FR-005, 061-FR-006, 065-FR-010 | 061-playlist-crud | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-003-view-playlist-details.md) |
| UC-060-004 | Edit Playlist Metadata | Playlist Owner | None | 061-FR-007, 065-FR-006 | 061-playlist-crud | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-004-edit-playlist-metadata.md) |
| UC-060-005 | Delete Playlist | Playlist Owner | None | 061-FR-008, 065-FR-006 | 061-playlist-crud | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-005-delete-playlist.md) |
| UC-060-006 | Bookmark Public Playlist | Listener | None | 061-FR-010 | 061-playlist-crud | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-006-bookmark-public-playlist.md) |
| UC-060-007 | Add Songs to Playlist | Playlist Editor | None | 062-FR-001, 062-FR-003, 062-FR-006, 062-FR-007, 062-FR-008, 065-FR-004, 065-FR-008 | 062-playlist-song-management | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-007-add-songs-to-playlist.md) |
| UC-060-008 | Remove Song from Playlist | Playlist Editor | None | 062-FR-005, 062-FR-006, 062-FR-007, 065-FR-004, 065-FR-008 | 062-playlist-song-management | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-008-remove-song-from-playlist.md) |
| UC-060-009 | Reorder Songs in Playlist | Playlist Editor | None | 062-FR-003, 062-FR-004, 062-FR-007, 065-FR-004, 065-FR-008 | 062-playlist-song-management | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-009-reorder-songs-in-playlist.md) |
| UC-060-010 | Toggle Like Song | Listener | None | 062-FR-002 | 062-playlist-song-management | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-010-toggle-like-song.md) |
| UC-060-011 | Enable Collaboration on Playlist | Playlist Owner | None | 065-FR-001, 065-FR-009 | 065-collaborative-playlists | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-011-enable-collaboration-on-playlist.md) |
| UC-060-012 | Invite Collaborators | Playlist Owner | None | 065-FR-002, 065-FR-003, 065-FR-009 | 065-collaborative-playlists | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-012-invite-collaborators.md) |
| UC-060-013 | Manage Collaborators | Playlist Owner | None | 065-FR-007, 065-FR-009 | 065-collaborative-playlists | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-013-manage-collaborators.md) |
| UC-060-014 | View Collaborative Playlist Details | Participant | None | 065-FR-004, 065-FR-005, 065-FR-009, 065-FR-010 | 065-collaborative-playlists | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-014-view-collaborative-playlist-details.md) |
| UC-060-015 | Play Playlist | Listener | AuraTune Player / Queue Management | 063-FR-001 through 063-FR-009 | 063-playlist-playback | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-015-play-playlist.md) |
| UC-060-016 | Generate AI Playlist | Listener | AI Recommendation Service | 064-FR-001 through 064-FR-010 | 064-ai-playlist-generation | Mai Đăng Khoa | [FULL NAME] | Draft | [UC specification](./UC-060-016-generate-ai-playlist.md) |

## 3. Status Definitions

| Status | Meaning |
|---|---|
| Not Started | No specification draft exists. |
| Draft | The writer is preparing the specification. |
| In Review | The specification and its prototype are ready for peer review. |
| Changes Requested | Reviewer identified changes that must be addressed. |
| Approved | Group owner/reviewer accepted the specification and its traceability. |

## 4. Coverage Check

FR IDs in this inventory are prefixed with their feature ID to distinguish locally numbered requirements such as `FR-001` across different Spec Kit features.

| FR ID | Requirement Summary | Covered by UC IDs | Coverage Status | Notes |
|---|---|---|---|---|
| 061-FR-001 | Create playlist with name and description | UC-060-002 | Covered | Feature-qualified ID; see 061 spec. |
| 061-FR-002 | Default new playlists to Private | UC-060-002 | Covered | |
| 061-FR-003 | Enforce character limits (Title 80, Desc 300) | UC-060-002 | Covered | |
| 061-FR-004 | Retrieve list of user playlists | UC-060-001 | Covered | |
| 061-FR-005 | View public playlist metadata, count and duration | UC-060-003 | Covered | |
| 061-FR-006 | Restrict viewing of private playlists | UC-060-003 | Covered | |
| 061-FR-007 | Update playlist metadata | UC-060-004 | Covered | |
| 061-FR-008 | Delete playlist permanently with confirmation | UC-060-005 | Covered | |
| 061-FR-009 | Provide default cover image | UC-060-002 | Covered | |
| 061-FR-010 | Save public playlists to library | UC-060-006 | Covered | |
| 062-FR-001 | Add songs to owned or collaborative playlist | UC-060-007 | Covered | |
| 062-FR-002 | Sync Like toggle with Liked Songs | UC-060-010 | Covered | |
| 062-FR-003 | Persist playlist-song association and position | UC-060-007, UC-060-009 | Covered | |
| 062-FR-004 | Drag-and-drop reordering | UC-060-009 | Covered | |
| 062-FR-005 | Remove song from playlist | UC-060-008 | Covered | |
| 062-FR-006 | Update playlist count and duration when tracks change | UC-060-007, UC-060-008 | Covered | |
| 062-FR-007 | Prevent edits without ownership or collaborative access | UC-060-007, UC-060-008, UC-060-009 | Covered | |
| 062-FR-008 | Prevent duplicate songs in a playlist | UC-060-007 | Covered | |
| 065-FR-001 | Toggle collaborative status | UC-060-011 | Covered | |
| 065-FR-002 | Invite registered users by email | UC-060-012 | Covered | |
| 065-FR-003 | Grant invitees immediate collaborator access | UC-060-012 | Covered | |
| 065-FR-004 | Allow collaborators to add, remove, and reorder tracks | UC-060-014 | Covered | |
| 065-FR-005 | Record contributor for each track | UC-060-014 | Covered | |
| 065-FR-006 | Restrict metadata edits and playlist deletion to owner | UC-060-004, UC-060-005 | Covered | |
| 065-FR-007 | View and revoke collaborators | UC-060-013 | Covered | |
| 065-FR-008 | Prevent modification by non-collaborators | UC-060-007, UC-060-008, UC-060-009 | Covered | |
| 065-FR-009 | Synchronize collaboration membership and interactions | UC-060-011, UC-060-012, UC-060-013, UC-060-014 | Covered | |
| 065-FR-010 | Keep collaborative playlists public while edits require membership | UC-060-003, UC-060-014 | Covered | |
| 063-FR-001 | Play a playlist from the beginning, replacing the queue | UC-060-015 | Covered | |
| 063-FR-002 | Shuffle playlist tracks and begin playback | UC-060-015 | Covered | |
| 063-FR-003 | Start at a selected playlist track while retaining playlist order | UC-060-015 | Covered | |
| 063-FR-004 | Append playlist tracks to the current queue | UC-060-015 | Covered | |
| 063-FR-005 | Track the current playlist playback source | UC-060-015 | Covered | |
| 063-FR-006 | Display playlist or queue playback context | UC-060-015 | Covered | |
| 063-FR-007 | Automatically play the next queued track | UC-060-015 | Covered | |
| 063-FR-008 | Skip unavailable tracks | UC-060-015 | Covered | |
| 063-FR-009 | Notify when attempting to play an empty playlist | UC-060-015 | Covered | |
| 064-FR-001 | Limit the playlist prompt to 200 characters | UC-060-016 | Covered | |
| 064-FR-002 | Require authentication for AI generation | UC-060-016 | Covered | |
| 064-FR-003 | Return 10–20 tracks for successful generation | UC-060-016 | Covered | |
| 064-FR-004 | Explain why tracks were selected | UC-060-016 | Covered | |
| 064-FR-005 | Allow previewing proposal tracks | UC-060-016 | Covered | |
| 064-FR-006 | Allow proposal track removal/reordering and playlist renaming | UC-060-016 | Covered | Track metadata cannot be renamed; the proposed playlist title may be renamed. |
| 064-FR-007 | Save the finalized proposal as a standard private playlist | UC-060-016 | Covered | |
| 064-FR-008 | Use semantic/vector search to map prompts to tracks | UC-060-016 | Covered | |
| 064-FR-009 | Filter unavailable or restricted tracks | UC-060-016 | Covered | |
| 064-FR-010 | Provide a manual creation fallback if AI service fails | UC-060-016 | Covered | |

## 5. Review Checklist

- [x] Every UC currently shown in the diagram is listed in this inventory.
- [x] Every inventory entry has a corresponding specification file (verify links before review).
- [x] UC IDs and names are consistent across the model, inventory and specification files.
- [x] Features 063 and 064 are mapped to UC-060-015 and UC-060-016 respectively.
- [x] Feature IDs and Spec Kit paths are valid.
