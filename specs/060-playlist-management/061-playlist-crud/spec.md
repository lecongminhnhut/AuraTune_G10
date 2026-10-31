# Feature Specification: 061 - Playlist CRUD (Tạo, Xem, Sửa, Xóa Playlist)

> [!NOTE]
> **Contextual Note**: This specification was reconstructed and formalized based on AuraTune project requirements (Proposal, Vision Document, System Architecture, API Contract) and the existing frontend implementation in `src/frontend/src/pages/Library/LibraryPage.jsx`, `PlaylistDetailPage.jsx`, and `PlaylistDialogs.jsx`.

---

## 1. Overview & Objective

The **Playlist CRUD** feature provides listeners with full lifecycle management of their personal music collections:
1. **View Playlists**: Browse all created playlists and the default "Bài hát đã thích" in the personal Library.
2. **Create Playlist**: Modal dialog allowing listeners to specify a custom title, optional description, and select a distinctive visual cover art gradient.
3. **View Playlist Details**: Dedicated page presenting playlist metadata, duration, track count, ownership label, and action toolbar.
4. **Edit Playlist**: Inline modal to update title, description, and cover theme.
5. **Delete Playlist**: Safe deletion flow with confirmation modal to prevent accidental data loss.

---

## 2. User Stories & Acceptance Criteria

### User Story 1: View Playlists in Library
- **As a** logged-in listener,
- **I want to** view my personal playlists in the Library,
- **So that** I can easily access my curated music collections.

**Acceptance Criteria:**
- Navigating to `/library` displays the user's playlists including "Bài hát đã thích" and all custom user playlists.
- Each playlist card displays its cover art, title, owner name, track count, and quick play button.
- Users can filter library items by "Tất cả", "Playlist", "Album", or "Nghệ sĩ".

### User Story 2: Create a Custom Playlist
- **As a** listener,
- **I want to** create a new playlist with a name, description, and chosen cover art,
- **So that** I can organize songs according to my taste and occasions.

**Acceptance Criteria:**
- Clicking "Tạo playlist" opens `PlaylistFormDialog`.
- Input fields include playlist title (required, max 80 chars), description (optional, max 300 chars), and cover color palette options.
- Submitting creates the playlist in the user's library and automatically navigates to its detail page.

### User Story 3: View Playlist Details
- **As a** listener,
- **I want to** open a playlist to see its full header details and action buttons,
- **So that** I can manage and play the playlist.

**Acceptance Criteria:**
- The page renders hero cover art, label "PLAYLIST CỦA BẠN", title, description, owner, song count, and total duration.
- Action toolbar renders buttons for Play, Shuffle, Add Songs, Edit, Collaborators, Share, and Delete.
- If the playlist is empty, a helpful empty state guides the user to add songs.

### User Story 4: Edit and Delete Playlist
- **As a** playlist owner,
- **I want to** edit metadata or delete a playlist when no longer needed,
- **So that** I have full control over my library.

**Acceptance Criteria:**
- Clicking the edit button (`Pencil`) opens `PlaylistFormDialog` pre-filled with current values.
- Saving updates the playlist in real time.
- Clicking the delete button (`Trash2`) prompts a confirmation dialog before permanent removal.

---

## 3. Frontend Component Mapping

- **Library View**: [`LibraryPage.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/pages/Library/LibraryPage.jsx)
- **Detail View**: [`PlaylistDetailPage.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/pages/PlaylistDetail/PlaylistDetailPage.jsx)
- **Modal Dialogs**: [`PlaylistDialogs.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/components/playlist/PlaylistDialogs.jsx) (`PlaylistFormDialog`)
- **State Store**: [`AppStore.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/context/AppStore.jsx) (`createPlaylist`, `updatePlaylist`, `deletePlaylist`)

---

## 4. UI Screenshots

### 1. Playlist List

**Related workflow:** Workflow A - View playlists in Library.

![Playlist List](./ui/01-playlist-list.png)

Shows the Library collection page displaying playlist cards, including "Bài hát đã thích" and custom user playlists, along with filter tabs and creation entry points.

---

### 2. Create Playlist

**Related workflow:** Workflow B - Create a new playlist.

![Create Playlist](./ui/02-create-playlist.png)

Shows the playlist creation modal (`PlaylistFormDialog`) with title input, description textarea, and selectable cover art color palettes (`sunset` chosen).

---

### 3. Playlist Details

**Related workflow:** Workflow C - View playlist details.

![Playlist Details](./ui/03-playlist-details.png)

Shows the dedicated playlist detail page after creation, featuring hero cover art, ownership metadata, action toolbar (Play, Shuffle, Add Songs, Edit, Collaborators, Share, Delete), and empty state.

---

### 4. Edit Playlist

**Related workflow:** Workflow D - Edit playlist metadata.

![Edit Playlist](./ui/04-edit-playlist.png)

Shows the playlist edit modal with pre-filled title and updated description and cover art variant (`rose`), ready to save changes.

---

### 5. Delete Playlist

**Related workflow:** Workflow E - Delete playlist confirmation.

![Delete Playlist](./ui/05-delete-playlist.png)

Shows the confirmation dialog warning that the playlist will be permanently deleted from the library, with "Hủy" and destructive "Xóa" buttons.
