# Feature Specification: 051 - View Queue (Xem danh sách chờ)

> [!NOTE]
> **Contextual Note**: This specification was reconstructed and formalized based on AuraTune project requirements (Proposal, Vision Document, System Architecture, API Contract) and the existing frontend implementation in `src/frontend/src/components/player/QueuePanel.jsx` and `BottomPlayer.jsx`.

---

## 1. Overview & Objective

The **View Queue** feature enables listeners to inspect the playback sequence without disrupting their listening experience. When opened, the Queue drawer presents two distinct zones:
1. **Now Playing ("Đang phát")**: A prominent card displaying the currently active song, including cover artwork, track title, and artist name.
2. **Upcoming ("Tiếp theo · N")**: An ordered list of songs scheduled to play next in sequence.

Users can open and close the queue panel smoothly from the persistent bottom player, view the upcoming count, and see an empty state indicator when no subsequent songs are queued.

---

## 2. User Stories & Acceptance Criteria

### User Story 1: Open Queue Panel from Bottom Player
- **As a** listener,
- **I want to** access the queue panel by clicking the queue icon on the bottom player,
- **So that** I can easily inspect what music will be playing next.

**Acceptance Criteria:**
- The bottom player features a dedicated queue button with `aria-label="Danh sách chờ"` and `ListMusic` icon.
- Clicking the button slides open a modal drawer docked to the right edge with a backdrop blur overlay.
- Clicking the close button (`X`) or backdrop dismisses the drawer without interrupting playback.

### User Story 2: Inspect Currently Playing and Upcoming Songs
- **As a** listener,
- **I want to** see which song is currently active and the complete sequence of upcoming tracks,
- **So that** I know the queue progression and context.

**Acceptance Criteria:**
- "Đang phát" section displays the active track with cover art, title, and artist in a highlighted violet container.
- "Tiếp theo · N" header displays the total count of upcoming tracks.
- Each upcoming track item renders cover art, title, artist, drag handle, and quick controls.

### User Story 3: View Empty Queue State
- **As a** listener,
- **I want to** see clear visual feedback when no tracks are queued,
- **So that** I understand how to add new songs to the queue.

**Acceptance Criteria:**
- If the upcoming queue has no tracks, a dashed card states: `"Chưa có bài nào trong hàng chờ. Chọn “Thêm vào danh sách chờ” ở menu “…” của một bài hát."`
- The "Xóa tất cả" (Clear All) button is hidden when the queue is already empty.

---

## 3. Frontend Component Mapping

- **Drawer Component**: [`QueuePanel.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/components/player/QueuePanel.jsx)
- **Bottom Entry Trigger**: [`BottomPlayer.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/components/player/BottomPlayer.jsx)
- **State Management**: [`useMockPlayer.js`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/hooks/useMockPlayer.js) (`upcoming`, `clearUpcoming`, `playFromQueue`)

---

## 4. UI Screenshots

| # | Screenshot Filename | Workflow Step / State | UI Elements & Components |
|---|---------------------|------------------------|---------------------------|
| 1 | [`01-queue-button-entry.png`](ui/01-queue-button-entry.png) | Bottom Player Queue Entry Point | BottomPlayer control dock, queue toggle button (`aria-label="Danh sách chờ"`), active track info |
| 2 | [`02-queue-panel-overview.png`](ui/02-queue-panel-overview.png) | Queue Panel Overview | Queue drawer dialog (`aria-labelledby="queue-title"`), header "Danh sách chờ", close button, "Đang phát" card, "Tiếp theo · 9" list |
| 3 | [`03-queue-current-and-upcoming.png`](ui/03-queue-current-and-upcoming.png) | Current Track & Upcoming Items Detail | Violet now-playing card, upcoming list items with drag handle (`GripVertical`), cover art, title, artist, reorder & remove actions |
| 4 | [`04-queue-empty-state.png`](ui/04-queue-empty-state.png) | Empty Queue State | Empty queue dashed container with informational guidance text, "Đang phát" card preserved |

### Detailed Screenshot Descriptions

#### 1. Bottom Player Queue Entry Point
- **Path**: `ui/01-queue-button-entry.png`
- **State**: Persistent bottom player rendered at the bottom edge of the viewport (1440x900).
- **Description**: Displays the persistent player controls with the Queue toggle button (`aria-label="Danh sách chờ"`) highlighted on hover. Current track "Nàng thơ" by Hoàng Dũng is actively playing.

#### 2. Queue Panel Overview
- **Path**: `ui/02-queue-panel-overview.png`
- **State**: Queue panel open with darkened backdrop overlay (`bg-black/45 backdrop-blur-[2px]`).
- **Description**: The right-aligned drawer presents the header "Danh sách chờ", close icon `X`, the "Đang phát" section containing the active track, and the "Tiếp theo · 9" header with "Xóa tất cả" action and upcoming list items.

#### 3. Current Track & Upcoming Items Detail
- **Path**: `ui/03-queue-current-and-upcoming.png`
- **State**: Focus and hover on upcoming track item in QueuePanel.
- **Description**: Demonstrates the item hierarchy in the upcoming list: reorder grip handle, cover art with quick play button overlay, track title, artist name, and action buttons (`ArrowUp`, `ArrowDown`, `X`).

#### 4. Empty Queue State
- **Path**: `ui/04-queue-empty-state.png`
- **State**: Upcoming queue cleared.
- **Description**: Displays the empty state dashed container informing the user that the queue is empty and guiding them to add songs using the track options menu `...`.
