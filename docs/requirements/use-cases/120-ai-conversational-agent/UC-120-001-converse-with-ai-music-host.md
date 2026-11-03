# UC-120-001 – Converse with AI Music Host

---

## 1. Metadata

| Field | Value |
|---|---|
| **Use Case ID** | UC-120-001 |
| **Use Case Name** | Converse with AI Music Host |
| **Functional Group** | 120 – AI Conversational Agent |
| **Primary Actor** | Listener (`ACT-02`) |
| **Supporting Actors** | External AI Service Provider (`ACT-EXT-04`) |
| **Boundary Actor** | Guest / Visitor (`ACT-01`) |
| **Related FR IDs** | `121-FR-001`, `121-FR-002`, `121-FR-003`, `121-FR-004`, `121-FR-005`, `121-FR-006`, `121-FR-007`, `121-FR-008`, `121-FR-009`, `121-FR-010`, `121-FR-011`, `121-FR-012` |
| **Related Feature/Spec** | Feature 121: Conversational Interface (`specs/120-ai-conversational-agent/121-conversational-interface/spec.md`) |
| **Status** | Draft |
| **Author** | Lê Công Minh Nhựt |
| **Reviewer** | TBD |

---

## 2. Description

An authenticated listener interacts with the AuraTune conversational AI host via a dedicated terminal / CLI-style interface. The listener sends natural language messages, observes live reasoning states with active elapsed duration, and receives streamed Markdown responses, all while background music playback continues smoothly and uninterrupted.

---

## 3. Preconditions

- The user is authenticated as a valid `Listener` (`ACT-02`) with an active JWT session token (`121-FR-001`).
- The AuraTune frontend application is running in an active browser session.

---

## 4. Trigger

The listener clicks the "AuraTune Agent" button on the top navigation bar or the persistent bottom player bar.

---

## 5. Basic Flow

| Step | Actor / System | Action |
|:---:|:---:|---|
| 1 | **Actor** | Clicks the AI Agent button on the navigation bar or persistent bottom player bar. |
| 2 | **System** | Renders the floating terminal panel (`AIHostChat.jsx`) anchored on the right edge with backdrop blur, focuses the prompt textarea, and displays the status badge `~/auratune · ● online` along with the initial welcome banner and suggestion chips (`121-FR-002`, `121-FR-003`). |
| 3 | **Actor** | Enters a prompt into the terminal prompt textarea `❯` (e.g., *"bài đang phát là gì?"*) and presses `Enter` (`121-FR-002`). |
| 4 | **System** | Validates that input is non-empty (`121-FR-006`), clears the input field, stores the prompt into command history (`121-FR-008`), disables duplicate submissions (`121-FR-005`), and renders the user message prefixed with `❯` in the conversation log. |
| 5 | **System** | Displays an animated thinking spinner `⠋ Đang suy nghĩ…` alongside an active elapsed timer (`121-FR-004`). |
| 6 | **System** | Streams reasoning thoughts (e.g., *"Đọc trạng thái trình phát hiện tại"*) into a collapsible thinking section (`✻ Đã suy nghĩ [N]s >`) as Server-Sent Events arrive. |
| 7 | **System** | Streams the assistant's response text with a pulsating terminal cursor `█`, automatically scrolling the conversation view to the newest message (`121-FR-007`, `121-FR-012`). |
| 8 | **System** | Replaces the thinking indicator upon stream completion, records the execution time badge (e.g., `✓ xong trong 1.2s`), and re-enables the prompt input for subsequent interactions. |
| 9 | **Actor** | Reviews the conversational response and may click the thinking toggle to inspect the reasoning trace. |

---

## 6. Alternative Flows

### AF-01 – Quick Prompt Suggestion Chip Selection
- **Starting Step:** Step 3 of the Basic Flow.
- **Condition:** The listener selects one of the pre-populated suggestion chips above the input bar (e.g., *"phát lofi chill để code"*, *"bài đang phát là gì?"*).
1. **Actor:** Clicks on a suggestion chip.
2. **System:** Automatically populates and submits the selected prompt without manual typing.
- **Outcome:** Resumes at Step 4 of the Basic Flow.

### AF-02 – Command History Recall via Arrow Keys
- **Starting Step:** Step 3 of the Basic Flow.
- **Condition:** The listener presses `ArrowUp` or `ArrowDown` while the input textarea is empty or caret is at start (`121-FR-008`).
1. **Actor:** Presses `ArrowUp`.
2. **System:** Recalls previous prompts in reverse chronological order from the in-memory history buffer (up to 30 items) and populates the textarea.
3. **Actor:** Presses `Enter` to re-execute or edits the prompt.
- **Outcome:** Resumes at Step 4 of the Basic Flow.

### AF-03 – Aborting an In-Flight Agent Turn
- **Starting Step:** Step 5 of the Basic Flow.
- **Condition:** The listener presses `Esc` while the agent is running/thinking.
1. **Actor:** Presses `Esc`.
2. **System:** Dispatches an abort signal to `AbortController`, terminates the incoming event stream, and renders a status label `■ Đã dừng` (Stopped).
3. **System:** Re-enables the input prompt immediately.
- **Outcome:** Resumes at Step 8 of the Basic Flow; use case terminates gracefully.

### AF-04 – Viewing Terminal Shortcuts via `/help`
- **Starting Step:** Step 3 of the Basic Flow.
- **Condition:** The listener enters `/help` into the prompt bar.
1. **Actor:** Enters `/help` and presses `Enter`.
2. **System:** Renders the built-in shortcut cheat sheet (`/help`, `/clear`, `↑ ↓`, `esc`, `y / n`) directly into the terminal log without making external AI requests.
- **Outcome:** Resumes at Step 8 of the Basic Flow.

---

## 7. Exception Flows

### EF-01 – AI Service Suspended or Unreachable
- **Starting Step:** Step 2 of the Basic Flow.
- **Condition:** The AI service is toggled off (`aiAvailable = false`) or network failure prevents connection (`121-FR-009`).
1. **System:** Opens the terminal panel displaying a suspended status badge `● tạm ngưng` (amber).
2. **System:** Renders an inline alert banner: *"AI Host tạm thời không khả dụng. Các tính năng nghe nhạc khác vẫn hoạt động bình thường."*
3. **System:** Disables the prompt textarea to prevent submission while background music continues streaming uninterrupted (`121-FR-011`).
4. **Actor:** Acknowledges the notice and closes the panel.
- **Outcome:** Use Case terminates in degraded mode.

### EF-02 – Unauthenticated Visitor Access Attempt
- **Starting Step:** Step 1 of the Basic Flow.
- **Condition:** An unauthenticated visitor (`Guest`) clicks the AI Agent button (`121-FR-001`).
1. **System:** Identifies missing authentication tokens and displays an authentication challenge modal.
2. **Actor:** Navigates to the Login page.
- **Outcome:** Redirects to `UC-010-002` (Log In with Email); this use case terminates in failure.

---

## 8. Postconditions

### Success Postconditions
- The conversational dialogue is appended to the terminal log in strict chronological sequence.
- Prompt history is updated in client component memory (retaining up to 30 items).
- Background audio streaming remains completely uninterrupted throughout the interaction.

### Failure Postconditions
- An informative non-blocking notice is presented; no blank screens or uncaught exceptions occur.
- Existing playback state and platform navigation remain fully operational.

---

## 9. Special Requirements

- **Accessibility & Focus**: Keyboard trap within open panel; `Esc` closes panel when idle or stops agent when running; input textarea automatically gains focus on open.
- **Performance**: Processing indicator renders within 100 milliseconds; streaming text renders smoothly without UI stutter.
- **Privacy & Security**: Zero cross-user conversation exposure (Decree 13/2023/ND-CP). Dialogues are strictly isolated to the caller's session (`121-FR-010`).

---

## 10. UI References

- **Implementation Component**: `src/frontend/src/components/chat/AIHostChat.jsx`
- **Related Screenshots**:
  - `prototypes/UC-120-001-panel-closed.png` (Closed state on navigation bar)
  - `prototypes/UC-120-001-basic-flow-open.png` (Open panel with welcome banner)
  - `prototypes/UC-120-001-basic-flow-conversation.png` (Active conversation thread)
  - `prototypes/UC-120-001-basic-flow-input.png` (Prompt input and suggestion chips)
  - `prototypes/UC-120-001-basic-flow-thinking.png` (Spinner indicator with reasoning timer)
  - `prototypes/UC-120-001-EF-01-service-unavailable.png` (Suspended status and alert)

---

## 11. Traceability

- **Functional Requirements**: `121-FR-001` through `121-FR-012`
- **Spec Kit Specification**: `specs/120-ai-conversational-agent/121-conversational-interface/spec.md` (User Stories 1, 2, 3, 4)
- **Included Use Case**: `UC-120-002` (Interpret Music Intent via Chat)
