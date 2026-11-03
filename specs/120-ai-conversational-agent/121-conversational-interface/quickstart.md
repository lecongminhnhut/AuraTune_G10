# Quickstart Validation Guide: Conversational Interface (Feature 121)

## Overview

This guide outlines runnable end-to-end validation scenarios to verify that **Feature 121: Conversational Interface** functions correctly in accordance with `spec.md`, the UI implementation, and the interface contracts.

---

## Prerequisites & Environment Setup

1. **Node.js**: Ensure Node.js >= 18 is installed.
2. **Repository Dependencies**:
   ```bash
   cd src/frontend
   npm install
   ```
3. **Run Frontend Application**:
   ```bash
   npm run dev
   ```
4. **Access Application**:
   Navigate to `http://localhost:5173` in a modern browser.

---

## Validation Scenarios

### Scenario 1: Access Conversational Panel as Authenticated Listener (FR-001, FR-002, FR-003)

- **Objective**: Verify that an authenticated user can open the terminal panel and see the initial welcome state.
- **Steps**:
  1. Log in as an authenticated listener (or use default mock user in demo mode).
  2. Locate the "AuraTune Agent" button in the top navigation bar or the persistent bottom player bar.
  3. Click the button to launch the panel.
- **Expected Outcome**:
  - The floating terminal dialog opens anchored on the right edge (`bottom-[96px] right-2 top-2`).
  - Header displays `AuraTune Agent` and `~/auratune · ● online` (emerald badge).
  - The message body displays the welcome banner (`✻ Chào mừng đến với AuraTune Agent`) and example suggestion bullets.
  - Suggestion chips are visible above the prompt textarea.
  - The prompt textarea with prefix `❯` is automatically focused.

---

### Scenario 2: Send Message and Stream Response with Processing State (FR-004, FR-005, FR-006, FR-007, FR-012)

- **Objective**: Verify message dispatch, duplicate prevention, animated spinner, elapsed timer, thinking trace, and streamed Markdown response.
- **Steps**:
  1. Click on a suggestion chip (e.g., *"bài đang phát là gì?"*) or type `"Xin chào, bạn có thể giúp gì cho mình?"` into the prompt textarea.
  2. Press `Enter` (or submit form).
- **Expected Outcome**:
  - The user message is immediately rendered prefixed with `❯`.
  - The input field is cleared; duplicate submissions are disabled during execution.
  - An animated thinking spinner `⠋` appears with active verbs (e.g., `"Đang suy nghĩ..."`) and an elapsed timer (`0.5s`, `1.1s`...).
  - The assistant response streams in real time with a pulsating cursor `█`.
  - Rich Markdown formatting (bold, bullet lists, links) renders properly.
  - The conversation view automatically scrolls to the newest content.
  - Upon completion, the timer badge `✓ xong trong [N]s` is displayed, and the input field is re-enabled.

---

### Scenario 3: Terminal Command History & Arrow Key Navigation (FR-008)

- **Objective**: Verify prompt recall via `ArrowUp` and `ArrowDown` keys.
- **Steps**:
  1. Submit prompt 1: `"Nhạc lofi chill"`
  2. Wait for completion, then submit prompt 2: `"Bài đang phát là gì?"`
  3. With the textarea empty, press `ArrowUp`.
  4. Press `ArrowUp` again.
  5. Press `ArrowDown`.
- **Expected Outcome**:
  - Pressing `ArrowUp` first populates `"Bài đang phát là gì?"`.
  - Pressing `ArrowUp` again populates `"Nhạc lofi chill"`.
  - Pressing `ArrowDown` returns to `"Bài đang phát là gì?"`.
  - Pressing `ArrowDown` past index 0 restores an empty input field.

---

### Scenario 4: Clear Conversation View via `/clear` Command (FR-008)

- **Objective**: Verify visual terminal reset to initial welcome banner without making network calls.
- **Steps**:
  1. In a conversation containing multiple messages, type `/clear` into the prompt textarea.
  2. Press `Enter`.
- **Expected Outcome**:
  - All past messages, thinking blocks, and responses are cleared from the visual log.
  - The initial pristine welcome banner (`kind: 'banner'`) re-appears.
  - No network requests are dispatched to backend or external AI services.
  - Pressing `ArrowUp` still recalls `/clear` and previous prompts from memory.
  - Background audio playback in `BottomPlayer` continues uninterrupted.

---

### Scenario 5: Built-in Shortcut Cheat Sheet via `/help`

- **Objective**: Verify offline cheat sheet rendering.
- **Steps**:
  1. Type `/help` into the prompt textarea and press `Enter`.
- **Expected Outcome**:
  - An inline cheat sheet renders displaying shortcuts (`/help`, `/clear`, `↑ ↓`, `esc`, `y / n`).
  - No external AI requests are triggered.

---

### Scenario 6: In-Flight Turn Cancellation via `Esc` Key

- **Objective**: Verify listener abort of a running agent turn.
- **Steps**:
  1. Submit a prompt.
  2. While the thinking spinner is active (`running === true`), press `Escape`.
- **Expected Outcome**:
  - The active `AbortController` triggers.
  - The running stream immediately halts.
  - The turn status updates to `■ Đã dừng` (amber).
  - The prompt input is re-enabled immediately.

---

### Scenario 7: AI Service Suspension / Network Outage Handling (FR-009, FR-011, SC-005)

- **Objective**: Verify non-disruptive degradation when `aiAvailable = false` or the backend is offline.
- **Steps**:
  1. Simulate AI outage: set `store.aiAvailable = false` in `AppStore` (or toggle simulated offline state).
  2. Open the AI Host panel while audio playback is active.
- **Expected Outcome**:
  - Header status badge displays `~/auratune · ● tạm ngưng` (amber text).
  - An inline alert banner renders: *"AI Host tạm thời không khả dụng. Các tính năng nghe nhạc khác vẫn hoạt động bình thường."*
  - The textarea input is disabled (`disabled={true}`).
  - Audio playback in `BottomPlayer` continues streaming with **zero stutter, pause, or interruption**.
  - Other pages and navigation tabs remain fully functional.

---

### Scenario 8: User Account Isolation (FR-001, FR-010, SC-004)

- **Objective**: Verify strict account data isolation.
- **Steps**:
  1. User A logs in, opens AI Host, and sends messages.
  2. User A logs out.
  3. User B logs in on the same browser session and opens AI Host.
- **Expected Outcome**:
  - User B sees the pristine welcome banner; none of User A's dialogue entries or command history are accessible.
  - Unauthenticated visitors attempting to open the agent are prompted with a login dialog.

---

## Automated Verification Commands

```bash
# Run frontend unit & component tests
cd src/frontend
npm run test -- AIHostChat

# Run linting check
npm run lint
```
