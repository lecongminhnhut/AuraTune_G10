# Feature Specification: 071 - Listening History (Lịch sử nghe)

> [!NOTE]
> **Contextual Note**: This specification was reconstructed and formalized based on AuraTune project requirements (Proposal, Vision Document, System Architecture, Database Schema in `docs/design/database/data-consistency.md`) and the existing frontend implementation in `src/frontend/src/pages/History/HistoryPage.jsx` and `AppStore.jsx`.

---

## 1. Overview & Objective

The **Listening History** feature gives listeners a transparent, private chronological record of their streaming activity on AuraTune:
1. **Private Access**: Listening history is strictly confidential and only visible to the authenticated listener (`/history`).
2. **Chronological Grouping**: Previously played tracks are grouped by day ("Hôm nay", "Hôm qua", "thứ hai, 27/10"...), detailing the played timestamp, track title, artist name, cover art, and actual listening duration.
3. **Playback from History**: Clicking any entry directly re-initiates playback of that track without complex navigation.
4. **History Erasure (Clear History)**: Listeners maintain full privacy control to purge their listening history with confirmation safeguard.
5. **Time Range Filtering**: Allows filtering history records by "7 ngày", "30 ngày", or "Toàn bộ".

---

## 2. User Stories & Acceptance Criteria

### User Story 1: Access and View Listening History
- **As a** logged-in listener,
- **I want to** navigate to my listening history from the sidebar or profile,
- **So that** I can review the songs I previously listened to.

**Acceptance Criteria:**
- Authenticated listeners can access the history page via the sidebar link "Lịch sử & thống kê" (`/history`).
- The "Lịch sử" tab displays played tracks organized chronologically into day sections.
- Each track item shows cover art, track title, artist, time of listening, and listened duration (e.g., *"nghe 4 phút"*).

### User Story 2: Resume Playback from History
- **As a** listener,
- **I want to** click on a historical track item,
- **So that** I can instantly replay a song I previously enjoyed.

**Acceptance Criteria:**
- Clicking on any history track item triggers `player.playTrack(track)`.
- Playback begins immediately and updates the persistent bottom player.

### User Story 3: Clear Listening History
- **As a** listener,
- **I want to** clear my listening history,
- **So that** I can reset my personal listening records for privacy reasons.

**Acceptance Criteria:**
- Clicking "Xóa lịch sử" displays a confirmation modal warning that personal history and stats will be cleared.
- Confirming deletes the history array in player state/storage and displays the empty state placeholder.

---

## 3. Frontend Component Mapping

- **History Page**: [`HistoryPage.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/pages/History/HistoryPage.jsx)
- **Sidebar Link**: [`Sidebar.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/components/common/Sidebar.jsx) (`user && { label: 'Lịch sử & thống kê', href: '/history' }`)
- **State Store**: [`AppStore.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/context/AppStore.jsx) (`library.history`, `clearHistory`, `recordPlay`)

---

## 4. UI Screenshots

### 1. Listening History Page

**Related workflow:** Workflow A - Open listening history.

![Listening History Page](./ui/01-listening-history-page.png)

Shows the listening history page overview with sidebar navigation link highlighted, page header ("Lịch sử nghe & Thống kê"), active "Lịch sử" tab, time range filters ("7 ngày", "30 ngày", "Toàn bộ"), and "Xóa lịch sử" action button.

---

### 2. Listening History Records

**Related workflow:** Workflow B - View listening history records.

![Listening History List](./ui/02-listening-history-list.png)

Shows the list of previously played tracks grouped chronologically by day ("Hôm nay", "Hôm qua"...), displaying artwork, title, artist name, played timestamp, and listened duration for each entry.

---

### 3. Inspect History Interactions

**Related workflow:** Workflow C - Inspect history interactions and deletion flow.

![Listening History Details](./ui/03-listening-history-details.png)

Shows the interactive state: playback initiated from history synced with bottom player, and the "Xóa lịch sử nghe?" confirmation modal dialog open.

---

### 4. Empty Listening History State

**Related workflow:** Workflow D - Empty and unavailable states.

![Listening History Empty State](./ui/04-listening-history-empty-state.png)

Shows the empty state container displayed when listening history is purged or contains no records, featuring the `Clock3` icon, informational guidance, and "Khám phá nhạc" navigation button.
