# UC-120-003 – Execute Music Actions via Conversational Agent

---

## 1. Metadata

| Field | Value |
|---|---|
| **Use Case ID** | UC-120-003 |
| **Use Case Name** | Execute Music Actions via Conversational Agent |
| **Functional Group** | 120 – AI Conversational Agent |
| **Primary Actor** | Listener (`ACT-02`) |
| **Supporting Actors** | External AI Service Provider (`ACT-EXT-04`) |
| **Related FR IDs** | `123-FR-001`, `123-FR-002`, `123-FR-003`, `123-FR-004`, `123-FR-005`, `123-FR-006`, `123-FR-007`, `123-FR-008`, `123-FR-009`, `123-FR-010`, `123-FR-011`, `123-FR-012`, `123-FR-013`, `123-FR-014` |
| **Related Feature/Spec** | Feature 123: Real-Time Music Assistance (`specs/120-ai-conversational-agent/123-real-time-music-assistance/spec.md`) |
| **Status** | Draft |
| **Author** | Lê Công Minh Nhựt |
| **Reviewer** | TBD |

---

## 2. Description

The system executes real-time music actions in response to conversational instructions from an authenticated listener. Using a Client-Side Tool Dispatching architecture (`agentTools.js`), the agent controls audio playback (play, pause, skip, volume), updates playback queues, toggles track favorites, and navigates platform routes, providing live execution indicators and requiring explicit interactive confirmation (`[y/N]`) before executing destructive actions.

---

## 3. Preconditions

- The listener is authenticated as a `Listener` (`ACT-02`) with an active session (`123-FR-005`).
- An actionable musical intent and associated slot parameters have been validated by `UC-120-002` (`123-FR-001`).

---

## 4. Trigger

The Intent Understanding engine (`UC-120-002`) outputs a structured action directive for client tool execution.

---

## 5. Basic Flow

| Step | Actor / System | Action |
|:---:|:---:|---|
| 1 | **Actor** | Submits an actionable conversational request (e.g., *"thêm nhạc năng lượng vào hàng chờ, âm lượng 40%"*). |
| 2 | **System** | Resolves the sequential action plan and dispatches the first client tool via `agentTools.js` (`123-FR-003`, `123-FR-014`). |
| 3 | **System** | Renders a live tool execution line in the terminal log: `● tool_name(...)` with a pulsating status dot in `running` state (`123-FR-014`). |
| 4 | **System** | Executes the client tool operation: <br> • `queue_add`: Appends resolved tracks to `PlayerContext.queue` (`UC-050-002`). <br> • `set_volume`: Updates player audio volume percentage (`UC-040-002`). <br> • `play_playlist` / `play_tracks`: Triggers playback in Persistent Bottom Player (`UC-040-001`). <br> • `like_track`: Toggles favorite state in `user_liked_songs`. <br> • `navigate`: Switches route view to target platform page. |
| 5 | **System** | Marks tool status as `ok` (emerald dot) and prints the result summary (e.g., `⎿ Đã thêm 5 bài vào hàng chờ` or `⎿ Âm lượng 40%`). |
| 6 | **System** | If compound clauses exist, dispatches the next tool in sequence (e.g., `set_volume`), repeating Steps 3–5 (`123-FR-014`). |
| 7 | **System** | Streams the conversational host confirmation response summarizing actions taken and optionally embeds a compact `PlaylistCard` widget (`123-FR-004`). |
| 8 | **Actor** | Hears the audio adjust in real time and observes the updated queue or playback state. |

---

## 6. Alternative Flows

### AF-01 – User Confirmation for Destructive Queue Clearing
- **Starting Step:** Step 3 of the Basic Flow.
- **Condition:** The action is classified as destructive and irreversible (`clear_queue`) (`123-FR-013`).
1. **System:** Pauses execution and renders an interactive confirmation prompt: `? Xóa tất cả bài trong hàng chờ? [y/N]` with buttons `y · Đồng ý` and `n · Hủy`.
2. **Actor:** Presses `y` (or clicks `y · Đồng ý`) to confirm, or presses `n` (or clicks `n · Hủy`) to abort.
3. **System:** If confirmed: invokes `player.clearUpcoming()`, marks tool as `ok`, and logs `⎿ Đã xóa hàng chờ`. If cancelled: marks tool as `skipped` with `⎿ Đã hủy theo yêu cầu`.
- **Outcome:** Resumes at Step 7 of the Basic Flow.

### AF-02 – Playlist Recommendation with Attached Interactive Card
- **Starting Step:** Step 4 of the Basic Flow.
- **Condition:** Action is `play_playlist` resulting from music discovery or mood recommendations.
1. **System:** Initiates playlist playback and resolves the playlist entity ID.
2. **System:** Renders a compact interactive `PlaylistCard` directly within the conversational terminal stream (`123-FR-004`).
3. **Actor:** Can click the card or play/pause button directly within the chat dialogue.
- **Outcome:** Resumes at Step 8 of the Basic Flow.

---

## 7. Exception Flows

### EF-01 – Catalog Track / Playlist Missing
- **Starting Step:** Step 4 of the Basic Flow.
- **Condition:** Catalog verification fails to find playable audio for the requested entity (`123-FR-006`).
1. **System:** Marks tool call as `error` (rose dot) with output message: `⎿ Không tìm thấy bài hát hoặc playlist trống`.
2. **System:** Delivers an explanatory conversational message with alternative suggestions without stopping or muting active playback (`123-FR-004`, `123-FR-008`).
- **Outcome:** Resumes at Step 7 of the Basic Flow in error-handling mode.

### EF-02 – Unauthorized Library Action
- **Starting Step:** Step 4 of the Basic Flow.
- **Condition:** Unauthenticated visitor or session token lacks permissions for the library operation (`123-FR-005`).
1. **System:** Rejects tool execution with output: `⎿ Cần đăng nhập để thích bài hát`.
2. **System:** Prompts the user to log in while keeping the conversation open.
- **Outcome:** Resumes at Step 7 of the Basic Flow.

---

## 8. Postconditions

### Success Postconditions
- The requested playback, volume, queue, or library state is updated on the client.
- The conversational confirmation matches the synchronized player state (`123-FR-009`).
- Listening events are registered in `listening_history` when playback starts (`123-FR-010`).

### Failure Postconditions
- Active audio playback is never disrupted or muted (`123-FR-008`).
- Descriptive inline error feedback is presented to the user.

---

## 9. Special Requirements

- **Real-Time Responsiveness**: Action commands dispatch to player controllers within 1,000ms (`SC-001`).
- **Playback Continuity**: 100% of failed action executions preserve background music playback without interruption (`SC-003`).
- **Confirmation Safety**: Irreversible queue clearance strictly requires explicit `[y/N]` confirmation (`123-FR-013`).

---

## 10. UI References

- **Implementation Files**: `src/frontend/src/components/chat/agentTools.js` & `AIHostChat.jsx`
- **Related Screenshots**:
  - `prototypes/UC-120-003-basic-flow-current-track.png` (Active playback context snapshot)
  - `prototypes/UC-120-003-basic-flow-assistance-dialog.png` (Live tool execution stream)
  - `prototypes/UC-120-003-basic-flow-queue-add.png` (Tool call `queue_add` adding tracks)
  - `prototypes/UC-120-003-queue-updated.png` (Side-by-side view with updated queue panel)
  - `prototypes/UC-120-003-EF-01-host-unavailable.png` (Degraded fallback state)

---

## 11. Traceability

- **Functional Requirements**: `123-FR-001` through `123-FR-014`
- **Spec Kit Specification**: `specs/120-ai-conversational-agent/123-real-time-music-assistance/spec.md` (User Stories 1, 2, 3, 4, 5)
- **Delegated Player Use Cases**:
  - `UC-040-001` (Control Audio Playback)
  - `UC-040-002` (Adjust Volume & Mute)
  - `UC-050-002` (Add Track to Queue)
