# Quickstart Validation Guide: Real-Time Music Assistance (Feature 123)

## Overview

This guide details runnable verification scenarios to validate that **Feature 123: Real-Time Music Assistance** correctly coordinates player actions, queue manipulations, interactive confirmations, rich preview cards, and library updates without ever interrupting background audio playback.

---

## Prerequisites & Environment Setup

1. **Node.js**: Ensure Node.js >= 18 is installed.
2. **Start Frontend Application**:
   ```bash
   cd src/frontend
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in a modern browser.

---

## Validation Scenarios

### Scenario 1: Core Playback Controls via Conversation (FR-002, SC-001)

- **Steps**:
  1. Start any song playing in AuraTune.
  2. Open the AI Host terminal dialog.
  3. Type `"tạm dừng nhạc"` and press `Enter`.
  4. Verify:
     - Tool execution line appears: `● playback("pause")` with green dot.
     - Audio pauses immediately (< 1,000ms).
     - Response confirms: `"Đã tạm dừng."`
  5. Type `"tiếp tục phát"` and press `Enter`.
  6. Verify:
     - Tool line appears: `● playback("resume")`.
     - Audio resumes playing immediately.

---

### Scenario 2: Adjust Volume Dynamically (FR-002)

- **Steps**:
  1. In the open chat terminal, type `"đặt âm lượng 40%"` and press `Enter`.
  2. Verify:
     - Tool line appears: `● set_volume(40)` -> `⎿ Âm lượng 40%`.
     - Master volume slider on bottom player updates to 40%.
     - Host confirms: `"Đã chỉnh âm lượng về 40%."`

---

### Scenario 3: Queue Management and Compound Action (FR-002, FR-014)

- **Steps**:
  1. In the open chat terminal, type `"thêm nhạc năng lượng vào hàng chờ, âm lượng 60%"` and press `Enter`.
  2. Verify:
     - Tool 1 executes: `● queue_add(...)` -> `⎿ Đã thêm N bài vào hàng chờ`.
     - Tool 2 executes sequentially: `● set_volume(60)` -> `⎿ Âm lượng 60%`.
     - Open Queue Panel (`QueuePanel.jsx`) and verify the newly added tracks appear in upcoming queue.
     - Ongoing track audio continues uninterrupted throughout execution.

---

### Scenario 4: Destructive Queue Clearance with Interactive Confirmation (FR-013)

- **Steps**:
  1. Ensure the playback queue has at least 1 upcoming song.
  2. In the chat terminal, type `"xóa hàng chờ"` and press `Enter`.
  3. Verify:
     - Tool execution suspends in `confirm` state (amber dot `●`).
     - Interactive prompt renders: `? Xóa tất cả bài trong hàng chờ? [y/N]` with buttons `y · Đồng ý` and `n · Hủy`.
     - The queue remains untouched while awaiting input.
  4. Press `n` (or click `n · Hủy`).
  5. Verify:
     - Tool marks as `skipped` with `⎿ Đã hủy theo yêu cầu`.
     - The queue remains intact.
  6. Re-type `"xóa hàng chờ"`, press `Enter`, then press `y`.
  7. Verify:
     - Tool marks as `ok` with `⎿ Đã xóa hàng chờ`.
     - Queue panel reflects an empty queue.

---

### Scenario 5: Embedded Interactive Preview Card for Playlists (FR-004)

- **Steps**:
  1. In the chat terminal, type `"phát lofi chill để code"` and press `Enter`.
  2. Verify:
     - Tool line executes: `● play_playlist(...)`.
     - Audio begins streaming tracks from the resolved playlist.
     - Upon completion, an embedded compact `PlaylistCard` widget is rendered inside the chat log showing album art, title, track count, and active play/pause button.
     - Clicking the play/pause button on the card toggles playback directly.

---

### Scenario 6: Catalog Miss Failure Isolation (FR-008, SC-003)

- **Steps**:
  1. While a track is actively playing, type a command for a non-existent track: `"phát bài XYZ123NotReal"`.
  2. Verify:
     - Tool executes with rose error dot: `● Không có bài nào phát được`.
     - Assistant responds with a friendly explanation and suggests alternatives.
     - **Critical check**: The currently playing song **NEVER stops, pauses, or glitches**.

---

### Scenario 7: Library Favorite Toggle (`like_track`) (FR-002, FR-005, SC-002)

- **Steps**:
  1. Logged in as User A, listen to Track 1.
  2. In chat, type `"thích bài này"` and press `Enter`.
  3. Verify:
     - Tool executes: `● like_track("...")` -> `⎿ Đã thêm vào Bài hát đã thích`.
     - Heart icon on bottom player turns filled/active.
  4. Verify as Guest (logged out):
     - Attempting `"thích bài này"` yields: `⎿ Cần đăng nhập để thích bài hát`.

---

### Scenario 8: Automatic Listening History Registration (FR-010, SC-005)

- **Steps**:
  1. Command assistant: `"phát nhạc chill"`.
  2. Allow the track to play for > 15 seconds.
  3. Navigate to `/history` ("Lịch sử nghe").
  4. Verify the newly played track is registered in the listening history stream.

---

## Automated Verification

```bash
# Run unit & component tests for agent tools
cd src/frontend
npm run test -- agentTools.test.js
```
