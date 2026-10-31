# Feature Specification: 083 - Save and Share Album (Lưu và Chia sẻ Album)

> [!NOTE]
> **Contextual Note**: This specification document was reconstructed to document the implemented UI workflows in the AuraTune frontend (`src/frontend/src/pages/Album/AlbumPage.jsx` and `AppStore.jsx`). The original specification was not provided in the repository archive (only `.gitkeep` was present). Scope is derived strictly from `docs/proposal/proposal.md` and actual application behavior.

---

## 1. Overview & Objective

The **Save and Share Album** feature enables listeners to bookmark favorite albums into their personal library and share album links with friends:
1. **Save Album to Library**: Listeners can click the "Lưu album" button in the album action toolbar to bookmark any catalog album into their personal library (`/library` under tab "Album"). The button dynamically toggles to "Đã lưu" with confirmation toast feedback.
2. **Share Album**: Listeners can share any album using the "Chia sẻ album" action button, invoking the platform's standard sharing mechanism and copying the direct URL (`/album/:id`) to the clipboard with confirmation toast feedback.
3. **Authentication Gating**: Saving an album requires an authenticated session; unauthenticated guests attempting to save are prompted to log in.

---

## 2. Implemented Frontend Workflows

### Workflow A: Save Album to Library
- **Action**: Clicking the "Lưu album" button (`Bookmark` icon) in the action toolbar.
- **State Change**: `store.toggleSaveAlbum(album.id)` updates `state.libraries[userId].savedAlbumIds`.
- **UI Feedback**:
  - The button label changes to "Đã lưu" with `BookmarkCheck` icon and violet active styling (`border-violet-300/40 bg-violet-300/10 text-violet-200`).
  - A toast notification confirms: *"Đã lưu album vào thư viện."* (or *"Đã xóa album khỏi thư viện."* when untoggled).
  - The saved album appears in the listener's Library (`/library`) under the "Album đã lưu" grid.

### Workflow B: Share Album
- **Action**: Clicking the "Chia sẻ album" button (`button[aria-label="Chia sẻ album"]` with `Share2` icon).
- **Behavior**: Calls `player.share('/album/' + album.id, album.title + ' · ' + artist.name)`.
- **UI Feedback**:
  - Leverages Web Share API or falls back to `navigator.clipboard.writeText`.
  - Toast notification confirms: *"Đã sao chép liên kết vào bộ nhớ tạm."*

---

## 3. Frontend Component Mapping

- **Album Page Toolbar**: [`AlbumPage.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/pages/Album/AlbumPage.jsx) (`toggleSave`, `player.share`)
- **Library Album Grid**: [`LibraryPage.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/pages/Library/LibraryPage.jsx) (`store.library.savedAlbumIds`)
- **State Store**: [`AppStore.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/context/AppStore.jsx) (`toggleSaveAlbum`, `isAlbumSaved`)

---

## 4. UI Screenshots

### 1. Album Save Action

**Related workflow:** Workflow A - Save album to library.

![Album Save Action](./ui/01-album-save-action.png)

Shows the album detail action toolbar with cursor hovering on the "Lưu album" button (`Bookmark` icon) prior to bookmarking the album.

---

### 2. Album Saved State

**Related workflow:** Workflow A - Album saved confirmation and updated state.

![Album Saved State](./ui/02-album-saved-state.png)

Shows the album page after clicking "Lưu album": the button updates to "Đã lưu" with the `BookmarkCheck` icon and violet accent border/background, accompanied by the confirmation toast *"Đã lưu album vào thư viện."*.

---

### 3. Album Share Action

**Related workflow:** Workflow B - Share album.

![Album Share Action](./ui/03-album-share-action.png)

Shows the action toolbar with cursor hovering over the circular "Chia sẻ album" button (`button[aria-label="Chia sẻ album"]` with `Share2` icon).

---

### 4. Album Share Result

**Related workflow:** Workflow B - Share result feedback.

![Album Share Result](./ui/04-album-share-result.png)

Shows the system toast notification *"Đã sao chép liên kết vào bộ nhớ tạm."* displayed after selecting the share action, confirming the album link was successfully copied to the clipboard.
