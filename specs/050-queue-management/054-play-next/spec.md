# Feature Specification: 054 - Play Next (Phát tiếp theo)

> [!NOTE]
> **Contextual Note**: This specification was reconstructed and formalized based on AuraTune project requirements (Proposal, Vision Document, System Architecture, API Contract) and the existing frontend implementation in `src/frontend/src/components/song/TrackMenu.jsx`, `QueuePanel.jsx`, `App.jsx`, and `useMockPlayer.js`.

---

## 1. Overview & Objective

The **Play Next** feature gives listeners immediate priority control over their playback flow. When browsing songs in charts, search results, albums, or playlists, selecting "Phát tiếp theo" inserts the target song immediately after the currently playing track (at position #1 of the upcoming queue).
- **High-Priority Placement**: The chosen track bypasses the rest of the queue to become the very next song played.
- **Immediate Feedback**: A toast notification informs the user: `“<Tên bài hát>” sẽ phát tiếp theo.`
- **Playback Transition**: Upon completing the current track or skipping forward, playback seamlessly advances to the prioritized song.

---

## 2. User Stories & Acceptance Criteria

### User Story 1: Prioritize a Track with Play Next
- **As a** listener,
- **I want to** select "Phát tiếp theo" on any song I encounter,
- **So that** it plays as soon as the current song finishes without erasing my existing queue.

**Acceptance Criteria:**
- The track options dropdown `...` contains "Phát tiếp theo" with the `ListStart` icon.
- Choosing "Phát tiếp theo" moves or inserts the track into the upcoming queue at index 0 (immediately after the currently playing song).
- A toast notification confirms: `“<Tên bài hát>” sẽ phát tiếp theo.` (or informs if the song is already currently playing).

### User Story 2: Inspect Prioritized Position and Playback Transition
- **As a** listener,
- **I want to** verify that the prioritized track sits at position #1 in the queue and plays next,
- **So that** I have full confidence in the playback order.

**Acceptance Criteria:**
- Opening `QueuePanel` displays the prioritized song at the very top of the upcoming list (#1 under "Đang phát").
- Advancing playback (via `nextTrack` or natural completion) immediately switches playback to the prioritized song.
- The "Đang phát" card in the queue drawer updates to reflect the new active song.

---

## 3. Frontend Component Mapping

- **Track Context Menu**: [`TrackMenu.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/components/song/TrackMenu.jsx)
- **Application Routing & Notification**: [`App.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/App.jsx) (`playNext`)
- **Queue State & Navigation**: [`useMockPlayer.js`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/hooks/useMockPlayer.js) (`playNext(track)`, `nextTrack()`)
- **Queue Presentation**: [`QueuePanel.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/components/player/QueuePanel.jsx)

---

## 4. UI Screenshots

| # | Screenshot Filename | Workflow Step / State | UI Elements & Components |
|---|---------------------|------------------------|---------------------------|
| 1 | [`01-track-menu-play-next.png`](ui/01-track-menu-play-next.png) | Track Menu "Phát tiếp theo" Option | Track options popover on "Chuyện rằng" (Thịnh Suy), highlighted "Phát tiếp theo" (`ListStart` icon) |
| 2 | [`02-play-next-toast-feedback.png`](ui/02-play-next-toast-feedback.png) | Play Next Confirmation Toast | Notification message: `“Chuyện rằng” sẽ phát tiếp theo.`, active Charts view |
| 3 | [`03-queue-position-after-play-next.png`](ui/03-queue-position-after-play-next.png) | Prioritized Queue Position #1 | QueuePanel drawer showing "Chuyện rằng" elevated to position #1 in "Tiếp theo", directly under active track |
| 4 | [`04-play-next-playback-transition.png`](ui/04-play-next-playback-transition.png) | Seamless Playback Transition | Playback transitioned: "Chuyện rằng" now rendered in "Đang phát" violet card, remaining queue intact |

### Detailed Screenshot Descriptions

#### 1. Track Menu "Phát tiếp theo" Option
- **Path**: `ui/01-track-menu-play-next.png`
- **State**: Options menu `...` opened for "Chuyện rằng" on the Charts page.
- **Description**: Shows the context menu with the top action "Phát tiếp theo" highlighted on hover, indicating the user intent to prioritize this song.

#### 2. Play Next Confirmation Toast
- **Path**: `ui/02-play-next-toast-feedback.png`
- **State**: Immediately after selecting "Phát tiếp theo".
- **Description**: Displays the toast banner confirming `“Chuyện rằng” sẽ phát tiếp theo.`, verifying responsive system feedback.

#### 3. Prioritized Queue Position #1
- **Path**: `ui/03-queue-position-after-play-next.png`
- **State**: QueuePanel open displaying updated sequence.
- **Description**: Shows "Chuyện rằng" positioned as the first item in the upcoming tracks list (#1 under "Tiếp theo · 9"), demonstrating that it was inserted ahead of all previously queued songs.

#### 4. Seamless Playback Transition
- **Path**: `ui/04-play-next-playback-transition.png`
- **State**: Next track action triggered.
- **Description**: Displays the QueuePanel after clicking next track: "Chuyện rằng" is now the active song displayed in the "Đang phát" card, confirming smooth playback execution.
