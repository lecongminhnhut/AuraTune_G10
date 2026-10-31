# Feature Specification: 062 - Playlist Song Management (Quản lý Bài hát trong Playlist)

> [!NOTE]
> **Contextual Note**: This specification was reconstructed and formalized based on AuraTune project requirements (Proposal, Vision Document, System Architecture, API Contract) and the existing frontend implementation in `src/frontend/src/pages/PlaylistDetail/PlaylistDetailPage.jsx`, `SongTable.jsx`, and `TrackMenu.jsx`.

---

## 1. Overview & Objective

The **Playlist Song Management** feature enables listeners to curate and modify the tracks contained within any user-owned or collaborative playlist:
1. **View Playlist Tracklist**: Full tabular song display including track number, artwork, title, artist link, album, duration, play count, like button, download button, and options menu.
2. **Add Songs to Playlist**: An interactive search dialog (`AddSongsDialog`) allowing users to search public songs by title or artist, previewing tracks and adding them with a single click.
3. **Remove Songs from Playlist**: Removing individual songs directly through the track options menu `...` with instant toast notification feedback and dynamic list update.
4. **Reorder Songs**: In-place drag-and-drop reordering via grip handle (`⋮⋮`) or contextual controls.

---

## 2. User Stories & Acceptance Criteria

### User Story 1: View Playlist Tracklist
- **As a** listener,
- **I want to** see the complete list of songs in a playlist with metadata,
- **So that** I know the exact composition and sequence of the collection.

**Acceptance Criteria:**
- Tracklist displays all contained songs using `SongTable`.
- Each row includes order number, cover art, track title, clickable artist name, album name, duration, and action icons.
- Top metadata recalculates total song count and combined playlist duration dynamically.

### User Story 2: Search and Add Songs to Playlist
- **As a** playlist editor,
- **I want to** search for songs and add them directly into my playlist,
- **So that** I can enrich the playlist with new music easily.

**Acceptance Criteria:**
- Clicking "Thêm bài hát" opens the `AddSongsDialog` modal with search input.
- Typing in the search field dynamically filters the song catalog.
- Clicking "Thêm" appends the track to the playlist and toggles button label to disabled "Đã thêm".

### User Story 3: Remove Songs from Playlist
- **As a** playlist editor,
- **I want to** remove an unwanted song from the playlist,
- **So that** I can maintain a collection tailored to my preferences.

**Acceptance Criteria:**
- Track menu `...` on each song row includes option "Xóa khỏi playlist".
- Selecting it removes the song from the playlist state.
- A toast notification confirms: `"Đã xóa “<Tên bài hát>” khỏi <Tên playlist>."`
- The tracklist and top song counter update immediately.

---

## 3. Frontend Component Mapping

- **Playlist Page & Add Modal**: [`PlaylistDetailPage.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/pages/PlaylistDetail/PlaylistDetailPage.jsx) (`AddSongsDialog`)
- **Song Table Component**: [`SongTable.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/components/song/SongTable.jsx)
- **Track Options Menu**: [`TrackMenu.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/components/song/TrackMenu.jsx)
- **State Store**: [`AppStore.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/context/AppStore.jsx) (`addTrackToPlaylist`, `removeTrackFromPlaylist`, `moveTrackInPlaylist`)

---

## 4. UI Screenshots

### 1. Playlist Tracklist

**Related workflow:** Workflow A - View playlist tracklist.

![Playlist Tracklist](./ui/01-playlist-tracklist.png)

Shows the playlist detail view with multiple curated songs displayed in `SongTable`, showing index, cover, title, artist, album, duration, action icons, and drag-and-drop reorder hint.

---

### 2. Add Songs Dialog

**Related workflow:** Workflow B - Add songs to a playlist.

![Add Songs Dialog](./ui/02-add-songs.png)

Shows the `AddSongsDialog` modal with search input, song catalog search results, and "Đã thêm" indicators for added songs.

---

### 3. Remove Song from Playlist

**Related workflow:** Workflow C - Remove a song from a playlist.

![Remove Song](./ui/03-remove-song.png)

Shows the resulting state after removing a song from the playlist, with confirmation toast notification: *"Đã xóa “Bước qua mùa cô đơn” khỏi Tuyển tập Indie Việt."* and updated track count.
