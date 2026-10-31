# Feature Specification: 063 - Playlist Playback (Phát nhạc từ Playlist)

> [!NOTE]
> **Contextual Note**: This specification was reconstructed and formalized based on AuraTune project requirements (Proposal, Vision Document, System Architecture, API Contract) and the existing frontend implementation in `src/frontend/src/pages/PlaylistDetail/PlaylistDetailPage.jsx`, `BottomPlayer.jsx`, and `useMockPlayer.js`.

---

## 1. Overview & Objective

The **Playlist Playback** feature enables listeners to initiate playback directly from any playlist context:
1. **Primary Play Button**: A prominent circular button in the playlist action toolbar that initiates sequential playback from the beginning of the collection.
2. **Shuffle Play Button**: Initiates playback with randomized track ordering.
3. **In-Playlist Track Selection**: Clicking any individual song row starts playback from that exact track while establishing the entire playlist as the current playback queue.
4. **Playback State Synchronization**: The persistent bottom player, full-screen player, and tracklist highlight the actively playing track in real time.

---

## 2. User Stories & Acceptance Criteria

### User Story 1: Start Playlist Playback
- **As a** listener,
- **I want to** click the main play button on a playlist,
- **So that** I can listen to the entire playlist in order.

**Acceptance Criteria:**
- The primary play button (`button[aria-label="Phát playlist"]`) is enabled when the playlist contains at least one song.
- Clicking the play button calls `player.playPlaylist(playlist)`, loading the songs into the playback queue and starting playback from track #1.
- The play button state reflects active playback.

### User Story 2: Play a Specific Song from Playlist
- **As a** listener,
- **I want to** click on a specific song within the playlist,
- **So that** playback begins from that track while preserving the playlist queue context.

**Acceptance Criteria:**
- Clicking on a song row or its play icon initiates playback for that track.
- The active track is highlighted with violet styling and animated playing indicators.
- The persistent bottom player displays the current song title, artist, cover art, and playback progress bar.

---

## 3. Frontend Component Mapping

- **Playlist Detail Page**: [`PlaylistDetailPage.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/pages/PlaylistDetail/PlaylistDetailPage.jsx)
- **Persistent Player**: [`BottomPlayer.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/components/player/BottomPlayer.jsx)
- **Player State & Queue Management**: [`useMockPlayer.js`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/hooks/useMockPlayer.js) (`playPlaylist`, `playTrack`)

---

## 4. UI Screenshots

### 1. Playlist Play Button

**Related workflow:** Workflow A - Start playlist playback.

![Playlist Play Button](./ui/01-playlist-play-button.png)

Shows the playlist detail page before playback, with cursor hovering over the primary circular play button (`button[aria-label="Phát playlist"]`) and adjacent shuffle button.

---

### 2. Playback Started from Playlist

**Related workflow:** Workflow B - Playback initiated from playlist.

![Playback Started](./ui/02-playback-from-playlist.png)

Shows the playlist view with playback actively running, the first track playing in the persistent bottom player dock, and playlist context established.

---

### 3. Playing Specific Playlist Track

**Related workflow:** Workflow C - Play another song from the playlist.

![Playlist Track Playing](./ui/03-playlist-track-playing.png)

Shows the playlist tracklist with a selected track ("Chuyện rằng") actively playing, highlighted with violet text and synced with the bottom player controls.
