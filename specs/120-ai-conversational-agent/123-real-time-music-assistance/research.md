# Phase 0 Research: Real-Time Music Assistance (Feature 123)

## Overview

This research document consolidates architectural findings, design decisions, and technology choices for **Feature 123: Real-Time Music Assistance** under **Group 120 – AI Conversational Agent** in AuraTune.

Feature 123 executes actionable musical operations in response to conversational instructions from authenticated listeners. Operating downstream from Intent Understanding (Feature 122), it coordinates playback controls, queue management, discovery streaming, and library interactions, providing real-time visual execution indicators, interactive confirmation for destructive operations, and guaranteed audio playback continuity.

---

## Research Tasks & Findings

### 1. Action Coordination Architecture: Client-Side Tool Dispatching vs Server-Side Player Control

- **Context & Constraints**:
  - `spec.md` (FR-002, FR-003, Clarification 2026-10-30): The assistant must execute three categories of actions: core playback controls, queue management & discovery streaming, and personal library interactions.
  - Runtime environment: The HTML5 audio element, audio streaming buffer, and active player queue reside strictly within the client browser DOM in `PlayerContext.jsx` (`040-music-player` / `050-queue-management`).
  - Performance requirement (`SC-001`): Playback commands must be received and dispatched to the player within 1,000 milliseconds.
- **Decision**:
  - Implement a **Client-Side Tool Dispatching Architecture**:
    1. The backend AI Conversational Agent Orchestrator outputs structured `tool_call` directives (`{ id, name, args, label, confirm? }`) over the SSE stream.
    2. The client conversational interface (`AIHostChat.jsx`) receives these events and immediately delegates execution to `executeTool` in `src/frontend/src/components/chat/agentTools.js`.
    3. Direct player actions (`play_playlist`, `play_tracks`, `playback`, `set_volume`, `queue_add`, `clear_queue`) operate locally on `PlayerContext` and `AppStore`.
    4. Library actions (`like_track`, `save_to_playlist`, `follow_artist`) invoke the respective backend authenticated REST APIs.
- **Rationale**:
  - Eliminates the need for stateful server-managed WebSockets for audio control, minimizing latency (< 50ms execution time on the client).
  - Directly matches the established implementation in `agentTools.js` and `AIHostChat.jsx`.
  - Ensures accurate synchronization between visual player widgets and audio streaming.
- **Alternatives Considered**:
  - *Server-Side Audio Orchestration*: Rejected because the server cannot directly manipulate client audio hardware or browser `<audio>` tags without complex, error-prone bidirectional socket channels.

---

### 2. Action Confirmation Policy & Safety Invariants (FR-013, Clarification 2026-11-01)

- **Context & Constraints**:
  - `spec.md` (FR-013, Clarification 2026-11-01): The system must balance conversational speed with user safety.
  - Risk analysis: Certain commands, such as clearing the entire playback queue, are irreversible and can wipe out a carefully assembled queue of dozens of songs.
- **Decision**:
  - Implement a **Destructive-Only Confirmation Policy**:
    - **Immediate Execution**: Playback (`play_tracks`, `play_playlist`), controls (`pause`, `resume`, `next`, `previous`), volume adjustments (`set_volume`), queue additions (`queue_add`), and favorites (`like_track`) execute immediately without user confirmation.
    - **Interactive Confirmation**: Irreversible destructive actions—specifically `clear_queue`—require explicit confirmation (`confirm: 'Xóa tất cả bài trong hàng chờ?' [y/N]`).
    - The client renders an inline interactive prompt with buttons `y · Đồng ý` and `n · Hủy`, accepting keyboard shortcuts (`y`, `n`, `Enter`).
    - If rejected or aborted via `Esc`, the tool is marked as `skipped` with message `Đã hủy theo yêu cầu` and execution proceeds safely.
- **Rationale**:
  - Prevents accidental queue destruction from ambiguous or misclassified voice/text instructions.
  - Avoids annoying conversational friction for standard, non-destructive listening requests.
- **Alternatives Considered**:
  - *Confirm every action*: High friction; listeners do not want to confirm every time they ask to skip a track or lower the volume.
  - *No confirmation for any action*: High risk of accidental data loss and listener dissatisfaction.

---

### 3. Sequential Compound Tool Dispatching & Real-Time Indicators (FR-014, Clarification 2026-11-01)

- **Context & Constraints**:
  - `spec.md` (FR-014, Clarification 2026-11-01): Multi-intent compound instructions (e.g. *"thêm nhạc năng lượng vào hàng chờ, âm lượng 40%"*) produce sequential tool calls.
  - Visual requirement: Real-time indicators for each step in the terminal stream.
- **Decision**:
  - Maintain an asynchronous sequential execution queue in `AIHostChat.jsx`:
    ```typescript
    interface ToolItemState {
      call: ToolCallEvent;
      state: 'running' | 'confirm' | 'ok' | 'error' | 'skipped';
      output: string;
    }
    ```
  - Tools are executed in strict left-to-right chronological order.
  - Visual status states:
    - `running`: Pulsating sky-blue dot (`●`) while tool is executing.
    - `confirm`: Amber dot (`●`) with confirmation box.
    - `ok`: Emerald dot (`●`) with output summary (e.g. `⎿ Âm lượng 40%`).
    - `error`: Rose dot (`●`) with error description (e.g. `⎿ Không có bài nào phát được`).
    - `skipped`: Muted zinc dot (`●`) when aborted.
- **Rationale**:
  - Full observability: The user can inspect exactly which actions succeeded or failed.
  - Preserves dependency order (e.g., adding to queue before initiating playback).
- **Alternatives Considered**:
  - *Parallel execution*: Rejected because player mutations have temporal dependencies (e.g. queue addition followed by volume change).

---

### 4. Interactive Rich Preview Card Widgets (FR-004, Clarification 2026-10-30)

- **Context & Constraints**:
  - `spec.md` (FR-004, Clarification 2026-10-30): Successful music assistance must deliver conversational confirmation paired with rich interactive preview card widgets.
- **Decision**:
  - When the assistant executes `play_playlist` or discovery streaming:
    - The SSE stream emits an event: `{ type: 'playlist', playlistId: string }`.
    - `AIHostChat.jsx` stores `run.playlistId`.
    - Upon completion, the component renders `<PlaylistCard compact playlist={playlist} onPlayPlaylist={onPlayPlaylist} isPlaying={isPlaying && currentPlaylistId === playlist.id} />` directly within the conversation thread.
    - The card displays artwork, title, track count, and allows interactive play/pause toggling.
- **Rationale**:
  - Provides rich visual and tactile feedback directly in the dialogue without requiring the user to navigate to the library.
- **Alternatives Considered**:
  - *Raw Markdown links only*: Lacks artwork, active play indicators, and tactile interactive controls.

---

### 5. Playback Continuity & Failure Isolation Invariant (FR-008, SC-003)

- **Context & Constraints**:
  - `spec.md` (FR-008, SC-003): In 100% of failed assistance scenarios (catalog miss, parameter error, 503 outage), currently active audio streaming must NEVER be interrupted or stopped.
- **Decision**:
  - Tool execution in `agentTools.js` employs defensive validation:
    - Before calling `player.playCollection`, verify tracks exist and are playable (`store.isPlayable(track.id)`).
    - If no tracks match, return `{ ok: false, output: 'Không tìm thấy bài hát hoặc playlist trống' }`.
    - Never invoke `player.stop()` or `player.togglePlayback()` on failure conditions.
    - Catch all unexpected exceptions inside `executeTool` and convert to `{ ok: false, output: error.message }`.
- **Rationale**:
  - Audio playback continuity is paramount; an AI assistant error must never ruin the listener's ongoing music experience.
- **Alternatives Considered**:
  - *Throwing errors up the React tree*: Crashes the UI and can reset context providers, killing the audio stream.

---

### 6. Personal Library & History Integration (FR-002, FR-010, SC-002, SC-005)

- **Context & Constraints**:
  - `spec.md` (FR-002, FR-010): Assistance includes liking songs, following artists, and recording playback into `listening_history`.
- **Decision**:
  - **Favorites (`like_track`)**:
    - Invokes `store.toggleLike(trackId)`, which calls `PUT /api/v1/songs/:id/like`.
    - Requires active session; if unauthenticated, returns `{ ok: false, output: 'Cần đăng nhập để thích bài hát' }`.
  - **Listening History Recording (`POST /api/v1/users/me/history`)**:
    - Triggered automatically via `PlayerContext` playback lifecycle whenever assisted playback begins, ensuring 100% consistency with Group 070.
- **Rationale**:
  - Leverages existing core application infrastructure without reinventing auth or analytics layers.

---

## Summary of Architectural Decisions

| Area | Decision | Primary Rationale |
|---|---|---|
| **Action Execution** | Client-Side Tool Dispatching (`agentTools.js`) | Controls HTML5 audio element directly in browser; sub-second latency (< 1,000ms). |
| **Safety Invariant** | Destructive-Only Confirmation (`clear_queue`) | Protects listener playlists/queue while keeping standard commands frictionless. |
| **Compound Execution** | Sequential Tool Pipeline with Step Indicators | Visual execution feedback (`running`, `confirm`, `ok`, `error`, `skipped`). |
| **Visual Feedback** | Embedded Compact `PlaylistCard` Widget | Rich tactile interaction (artwork, play/pause) inside the conversation log. |
| **Resilience** | Zero Audio Disruption Invariant | Defensive validation in `agentTools`; ongoing music never stops on failed actions. |
| **Library & History** | Direct `AppStore` / `PlayerContext` integration | Enforces user permissions; registers playback in listening history automatically. |
