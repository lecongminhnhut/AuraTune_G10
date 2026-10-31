# Feature Specification: 052 - Add and Remove Queue Items (Thêm và xóa bài hát khỏi hàng chờ)

> [!NOTE]
> **Contextual Note**: This specification was reconstructed and formalized based on AuraTune project requirements (Proposal, Vision Document, System Architecture, API Contract) and the existing frontend implementation in `src/frontend/src/components/song/TrackMenu.jsx`, `QueuePanel.jsx`, and `App.jsx`.

---

## 1. Overview & Objective

The **Add and Remove Queue Items** feature provides listeners with full dynamic control over what gets added to and removed from their active listening session.
- **Add to Queue**: Available through any song row's options menu (`...`), letting users queue songs from playlists, search results, or charts without interrupting current playback.
- **Remove from Queue**: Available directly within the Queue drawer on each upcoming item via an individual removal button (`X`), instantly removing the track from the upcoming queue and updating the queue counter.
- **Feedback**: Instant toast notifications confirm each action (e.g., `"Đã thêm “...” vào danh sách chờ."`).

---

## 2. User Stories & Acceptance Criteria

### User Story 1: Add a Track to Queue via Options Menu
- **As a** listener,
- **I want to** select "Thêm vào danh sách chờ" from a track's context menu,
- **So that** the song is appended to the end of my active upcoming queue.

**Acceptance Criteria:**
- Clicking the track menu `...` opens the options dropdown containing "Thêm vào danh sách chờ" (`ListEnd` icon).
- Selecting "Thêm vào danh sách chờ" appends the track to the queue if not already present.
- A toast notification confirms: `"Đã thêm “<Tên bài hát>” vào danh sách chờ."` (or warns if already queued).
- The song appears at the tail of the upcoming queue list in `QueuePanel`.

### User Story 2: Remove a Track from Queue
- **As a** listener,
- **I want to** remove an individual song from the upcoming queue,
- **So that** I can filter out songs I do not wish to hear during this session.

**Acceptance Criteria:**
- Each upcoming item in the `QueuePanel` has a dedicated remove button (`aria-label="Xóa <Tên bài hát> khỏi danh sách chờ"`).
- Clicking the remove button instantly removes the song from the queue array in player state.
- The upcoming count in the header decrements accordingly.
- If the last upcoming song is removed, the panel gracefully displays the empty queue state.

---

## 3. Frontend Component Mapping

- **Options Menu Component**: [`TrackMenu.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/components/song/TrackMenu.jsx)
- **Queue Panel**: [`QueuePanel.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/components/player/QueuePanel.jsx)
- **Application Context & Toast**: [`App.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/App.jsx) (`addToQueue`, `store.toast`)
- **Player State**: [`useMockPlayer.js`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/hooks/useMockPlayer.js) (`addToQueue`, `removeFromQueue`)

---

## 4. UI Screenshots

| # | Screenshot Filename | Workflow Step / State | UI Elements & Components |
|---|---------------------|------------------------|---------------------------|
| 1 | [`01-track-menu-add-to-queue.png`](ui/01-track-menu-add-to-queue.png) | Track Context Menu with Add to Queue Option | Song row ("Bước qua mùa cô đơn"), TrackMenu portal popover, highlighted "Thêm vào danh sách chờ" action |
| 2 | [`02-add-to-queue-toast-feedback.png`](ui/02-add-to-queue-toast-feedback.png) | Toast Notification on Add to Queue | Bottom-left toast message: `"Đã thêm “Bước qua mùa cô đơn” vào danh sách chờ."`, active charts table |
| 3 | [`03-queue-after-adding-song.png`](ui/03-queue-after-adding-song.png) | Queue Panel Reflecting New Song | QueuePanel drawer open, upcoming counter ("Tiếp theo · 1"), newly added song card displayed |
| 4 | [`04-queue-remove-item-action.png`](ui/04-queue-remove-item-action.png) | Queue Item Removal Button Hover | Queue item row, focused remove button (`aria-label="Xóa Bước qua mùa cô đơn khỏi danh sách chờ"`), hover styling |
| 5 | [`05-queue-after-removing-song.png`](ui/05-queue-after-removing-song.png) | Queue After Song Removal | QueuePanel updated with song removed, upcoming counter ("Tiếp theo · 0"), empty state placeholder |

### Detailed Screenshot Descriptions

#### 1. Track Context Menu with Add to Queue Option
- **Path**: `ui/01-track-menu-add-to-queue.png`
- **State**: Track options menu `...` open on the Charts table.
- **Description**: Displays the dropdown menu triggered by the options button on "Bước qua mùa cô đơn" by Vũ. The menu item "Thêm vào danh sách chờ" (`ListEnd` icon) is highlighted on hover.

#### 2. Toast Notification on Add to Queue
- **Path**: `ui/02-add-to-queue-toast-feedback.png`
- **State**: Immediately after selecting "Thêm vào danh sách chờ".
- **Description**: Shows the prominent toast notification at the bottom of the screen displaying `"Đã thêm “Bước qua mùa cô đơn” vào danh sách chờ."`, verifying immediate user feedback.

#### 3. Queue Panel Reflecting New Song
- **Path**: `ui/03-queue-after-adding-song.png`
- **State**: Queue panel opened following track addition.
- **Description**: Demonstrates the QueuePanel state showing "Tiếp theo · 1" and the queued song "Bước qua mùa cô đơn" listed in the upcoming queue.

#### 4. Queue Item Removal Button Hover
- **Path**: `ui/04-queue-remove-item-action.png`
- **State**: User hovering over the removal icon (`X`) on the upcoming track item.
- **Description**: Highlights the delete/remove button (`button[aria-label="Xóa Bước qua mùa cô đơn khỏi danh sách chờ"]`) with transition styling (`hover:text-rose-300`).

#### 5. Queue After Song Removal
- **Path**: `ui/05-queue-after-removing-song.png`
- **State**: Instant UI update upon clicking the remove button.
- **Description**: Shows the QueuePanel refreshed with the item removed, the count decremented to 0, and the empty state placeholder rendered.
