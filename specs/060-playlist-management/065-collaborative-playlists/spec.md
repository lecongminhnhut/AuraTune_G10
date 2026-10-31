# Feature Specification: 065 - Collaborative Playlists (Playlist Cộng tác)

> [!NOTE]
> **Contextual Note**: This specification was reconstructed and formalized based on AuraTune project requirements (Proposal, Vision Document, System Architecture, API Contract) and the existing frontend implementation in `src/frontend/src/pages/PlaylistDetail/PlaylistDetailPage.jsx` and `AppStore.jsx`.

---

## 1. Overview & Objective

The **Collaborative Playlists** feature empowers friends and music communities to co-curate shared music spaces:
1. **Collaboration Management Entry**: Accessible from any user-owned playlist via the "Quản lý cộng tác" button (`Users` icon).
2. **Collaborator Invitation**: An invitation modal (`CollaboratorsDialog`) enabling the playlist owner to toggle collaborative permissions and invite fellow AuraTune listeners via email.
3. **Collaborator Roster Management**: Displays active collaborators with user initial avatars, display names, email addresses, and an option for the owner to remove collaborators.
4. **Shared Collaborative Playlist Presentation**: Distinctive visual badge (`"PLAYLIST CỘNG TÁC"`) and metadata indicator (`"N cộng tác viên"`), granting invited members full rights to add, remove, and reorder songs.

---

## 2. User Stories & Acceptance Criteria

### User Story 1: Enable Collaboration on a Playlist
- **As a** playlist owner,
- **I want to** designate my playlist as collaborative,
- **So that** invited friends can contribute songs alongside me.

**Acceptance Criteria:**
- The playlist detail toolbar provides a "Quản lý cộng tác" button (`button[aria-label="Quản lý cộng tác"]`).
- Clicking it opens `CollaboratorsDialog` with a "Cho phép cộng tác" toggle.
- Enabling the toggle marks the playlist as collaborative in the state store.

### User Story 2: Invite Collaborators by Email
- **As a** playlist owner,
- **I want to** invite other registered AuraTune users using their email,
- **So that** they receive editing rights to the playlist.

**Acceptance Criteria:**
- Form includes an email input and "Mời" button.
- Submitting an existing AuraTune email (e.g., `minhanh@example.com` or `linh@example.com`) successfully links the user.
- A toast confirms: `"<Tên hiển thị> có thể cùng chỉnh sửa playlist này."`

### User Story 3: View and Manage Collaborators
- **As a** playlist owner,
- **I want to** see the list of active collaborators and remove anyone if needed,
- **So that** I maintain oversight of who can edit my playlist.

**Acceptance Criteria:**
- Active collaborators are listed with avatar, name, and email.
- Each collaborator entry features a remove button (`aria-label="Gỡ <Tên>"`).
- Removing a member revokes their editing access immediately.

### User Story 4: View Shared Collaborative Playlist
- **As a** playlist participant,
- **I want to** clearly distinguish collaborative playlists from standard ones,
- **So that** I know collaboration is active.

**Acceptance Criteria:**
- The hero header badge displays `"PLAYLIST CỘNG TÁC"` instead of `"PLAYLIST"`.
- Header subtitle reflects the collaborator count (e.g., `1 cộng tác viên`).

---

## 3. Frontend Component Mapping

- **Playlist Page & Collaborator Modal**: [`PlaylistDetailPage.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/pages/PlaylistDetail/PlaylistDetailPage.jsx) (`CollaboratorsDialog`)
- **State Store & Permissions**: [`AppStore.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/context/AppStore.jsx) (`addCollaborator`, `removeCollaborator`, `isCollaborative`, `collaborators`)

---

## 4. UI Screenshots

### 1. Collaborative Playlist Entry Point

**Related workflow:** Workflow A - Access collaborative playlist management.

![Collaborative Entry](./ui/01-collaborative-playlist-entry.png)

Shows the playlist detail action toolbar with the "Quản lý cộng tác" button (`button[aria-label="Quản lý cộng tác"]`) highlighted on hover.

---

### 2. Invite Collaborators Dialog

**Related workflow:** Workflow B - Invite collaborators.

![Invite Collaborators](./ui/02-invite-collaborators.png)

Shows the `CollaboratorsDialog` modal with the "Cho phép cộng tác" toggle, email invitation input (`minhanh@example.com`), and hint for demo accounts.

---

### 3. Active Collaborators Roster

**Related workflow:** Workflow D - View collaborators.

![Collaborative Members](./ui/04-collaborative-members.png)

Shows the active collaborator list within the modal, displaying Minh Anh's initial avatar, name, email, and removal button `X`.

---

### 4. Shared Collaborative Playlist View

**Related workflow:** Workflow C - View a shared playlist.

![Shared Playlist](./ui/03-shared-playlist.png)

Shows the updated playlist detail page featuring the prominent `"PLAYLIST CỘNG TÁC"` badge and metadata displaying `"1 cộng tác viên"`.
