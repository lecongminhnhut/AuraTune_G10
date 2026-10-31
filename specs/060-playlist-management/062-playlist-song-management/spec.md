# Feature Specification: Playlist Song Management

**Feature Branch**: `062-playlist-song-management`

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "Specify feature 062-playlist-song-management for the AuraTune project. This feature provides the logic and UI for managing the tracks within a playlist."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add Tracks to Playlist (Priority: P1)

As a listener, I want to add songs to my playlists from anywhere in the app so that I can curate my music collection.

**Why this priority**: Essential for building playlists. Without adding songs, a playlist is just an empty container.

**Independent Test**: Can be tested by selecting "Add to playlist" on a song, picking a target playlist, and verifying the song appears in that playlist's tracklist.

**Acceptance Scenarios**:

1. **Given** I am a logged-in user viewing a song, **When** I open the `TrackMenu` and select "Add to playlist" > [Playlist Name], **Then** the song is added to the end of that playlist and I see a success notification.
2. **Given** I am a logged-in user, **When** I add a song to a playlist, **Then** the playlist's `total_song_count` increases by 1 and `total_duration` increases by the song's duration in real-time.

---

### User Story 2 - Liked Songs Integration (Priority: P1)

As a listener, I want to toggle a "Like" on any song to automatically manage my "Liked Songs" playlist.

**Why this priority**: "Liked Songs" is a core user expectation in music streaming apps for quick curation.

**Independent Test**: Can be tested by clicking the heart icon on a song and verifying it appears in (or is removed from) the "Liked Songs" playlist.

**Acceptance Scenarios**:

1. **Given** a song is not in my "Liked Songs", **When** I click the heart icon, **Then** the song is added to my "Liked Songs" playlist and the heart icon turns active.
2. **Given** a song is already in my "Liked Songs", **When** I click the heart icon, **Then** the song is removed from my "Liked Songs" playlist and the heart icon returns to its inactive state.

---

### User Story 3 - Remove and Reorder Tracks (Priority: P2)

As a listener, I want to remove songs or change their order within my playlist so that I can control the playback sequence.

**Why this priority**: Standard playlist management functionality for refining the listening experience.

**Independent Test**: Can be tested by dragging a `SongRow` to a new position or selecting "Remove from playlist" and verifying the changes persist.

**Acceptance Scenarios**:

1. **Given** I am viewing a playlist I own, **When** I drag a song from position 1 to position 3 using the `GripVertical` icon, **Then** the tracklist reorders and the new sequence is saved.
2. **Given** I am viewing a playlist I own, **When** I select "Remove from playlist" in the `TrackMenu` for a song, **Then** the song is removed from the view and the database, and the playlist metadata (count/duration) updates accordingly.

---

### Edge Cases

- **Duplicate Add**: What happens if a user adds the same song to the same playlist twice? (System should allow it but treat them as separate entries with unique sort orders).
- **Concurrent Reordering**: If a user reorders a playlist on two devices simultaneously, the last state received by the server wins.
- **Collaborative Playlists**: How do permissions work for adding/removing? (Owners and shared users with edit permissions can manage songs; specific permissions are defined in feature 065).
- **Network Failure**: If an add/remove/reorder action fails, the UI must revert to the previous state and show an error toast.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow authenticated users to add any song to their owned or collaborative playlists via the `TrackMenu` component.
- **FR-002**: System MUST automatically maintain a "Liked Songs" playlist for every user, syncing additions/removals with the song "Like" (heart) toggle.
- **FR-003**: System MUST persist the association between playlists and songs in the `playlist_songs` table, including a `sort_order` or `position`.
- **FR-004**: System MUST support drag-and-drop reordering of songs within the playlist detail view using `SongRow` with `GripVertical` icons.
- **FR-005**: System MUST allow the playlist owner to remove any song from their playlist via the `TrackMenu`.
- **FR-006**: System MUST update the playlist's `total_song_count` and `total_duration` metadata in the `playlists` table whenever songs are added or removed.
- **FR-007**: System MUST prevent users from adding songs to playlists they do not own or have collaborative access to.

### Key Entities *(include if feature involves data)*

- **PlaylistSong**: Represents the link between a playlist and a song.
    - Attributes: `playlist_id` (FK), `song_id` (FK), `added_at` (Timestamp), `sort_order` (Integer).
- **UserLikedSong**: Represents a user's liked status for a song (linked to the "Liked Songs" playlist).
    - Attributes: `user_id` (FK), `song_id` (FK), `created_at` (Timestamp).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Adding a song to a playlist completes (UI feedback + persistence) in under 800ms on a standard 4G connection.
- **SC-002**: "Liked Songs" toggle updates the underlying playlist and reflects the change in the UI within 300ms.
- **SC-003**: Drag-and-drop reordering provides smooth 60fps visual feedback and persists the final state to the database within 1 second of drop.
- **SC-004**: Playlist metadata (song count and total duration) is always consistent with the actual tracks in the `playlist_songs` table (0% drift).

## Assumptions

- Users must be authenticated to add/remove/reorder songs.
- The `TrackMenu` and `SongRow` components are already available and only need integration logic.
- "Liked Songs" is a system-managed playlist created automatically upon user registration or first "Like" action.
- Collaborative playlist permissions (065) will use the same underlying management logic but with extended authorization checks.
- Metadata updates (count/duration) may be handled via database triggers or application-level logic after successful `playlist_songs` mutations.
