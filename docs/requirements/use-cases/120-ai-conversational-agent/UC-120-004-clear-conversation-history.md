# UC-120-004 – Clear Conversation History

---

## 1. Metadata

| Field | Value |
|---|---|
| **Use Case ID** | UC-120-004 |
| **Use Case Name** | Clear Conversation History |
| **Functional Group** | 120 – AI Conversational Agent |
| **Primary Actor** | Listener (`ACT-02`) |
| **Supporting Actors** | None |
| **Boundary Actor** | Guest / Visitor (`ACT-01`) |
| **Related FR IDs** | `121-FR-003`, `121-FR-008` |
| **Related Feature/Spec** | Feature 121: Conversational Interface (`specs/120-ai-conversational-agent/121-conversational-interface/spec.md`) |
| **Status** | Draft |
| **Author** | Lê Công Minh Nhựt |
| **Reviewer** | TBD |

---

## 2. Description

An authenticated listener clears the visual log of the active AI conversational terminal window by entering the `/clear` built-in command. The system immediately resets the terminal display buffer to its initial welcome banner state, purging all prior user messages, assistant responses, reasoning blocks, and tool execution logs from the active view, while preserving the recent prompt command history buffer for arrow key recall and leaving ongoing music playback completely unaffected.

---

## 3. Preconditions

- The user is authenticated as a valid `Listener` (`ACT-02`) with an active session (`121-FR-001`).
- The AI Conversational terminal panel (`AIHostChat.jsx`) is open and currently displaying at least one dialogue interaction or command output.
- The conversational agent is idle (not actively executing an in-flight prompt).

---

## 4. Trigger

The listener types `/clear` into the terminal prompt input field and presses `Enter` (or clicks the send button).

---

## 5. Basic Flow

| Step | Actor / System | Action |
|:---:|:---:|---|
| 1 | **Actor** | Enters the `/clear` command into the terminal prompt textarea `❯`. |
| 2 | **Actor** | Presses `Enter` to submit the command (`121-FR-008`). |
| 3 | **System** | Intercepts the input locally and identifies `/clear` as a built-in terminal utility command. |
| 4 | **System** | Appends the submitted command `/clear` to the 30-item command history ring buffer in memory (`121-FR-008`). |
| 5 | **System** | Clears the prompt input textarea and resets the history navigation pointer. |
| 6 | **System** | Resets the conversation `entries` state array, removing all conversational bubbles, thinking logs, tool results, and error notifications. |
| 7 | **System** | Re-renders the pristine initial welcome banner (`kind: 'banner'`) containing the version badge (`auratune-host v0.3`), introductory greeting, and suggestion chips (`121-FR-003`). |
| 8 | **System** | Retains focus within the prompt textarea ready for new listener commands, without initiating any network or AI backend requests. |

---

## 6. Alternative Flows

### AF-01 – Clearing via Command Recalled from History
- **Starting Step:** Step 1 of the Basic Flow.
- **Condition:** The listener has previously typed `/clear` in the current session.
1. **Actor:** Navigates the history buffer using the `ArrowUp` key until `/clear` appears in the prompt field.
2. **Actor:** Presses `Enter`.
- **Outcome:** Resumes at Step 3 of the Basic Flow.

### AF-02 – Clearing While Agent is Actively Running
- **Starting Step:** Step 1 of the Basic Flow.
- **Condition:** The listener attempts to clear the terminal while the agent is currently processing a prompt (`running === true`).
1. **Actor:** Focuses on the prompt input and attempts to submit `/clear`.
2. **System:** Inhibits prompt submission because the submit handler enforces `if (running) return`.
3. **Actor:** Presses `Esc` to abort the running agent turn (triggering `abortController.abort()`).
4. **System:** Stops the agent execution stream and marks the active turn as stopped (`■ Đã dừng`).
5. **Actor:** Enters `/clear` and presses `Enter`.
- **Outcome:** Resumes at Step 3 of the Basic Flow.

---

## 7. Exception Flows

### EF-01 – Unauthenticated Visitor Attempt
- **Starting Step:** Step 1 of the Basic Flow.
- **Condition:** The user session has expired or is invalid.
1. **System:** Closes the agent interface and displays an authentication modal.
2. **Actor:** Navigates to login.
- **Outcome:** Terminal state is discarded upon unmounting; redirects to `UC-010-002`.

---

## 8. Postconditions

### Success Postconditions
- The conversational scroll view is reset to display exclusively the initial welcome banner and suggestion chips.
- Up to 30 past prompt entries remain preserved in client memory, accessible via `ArrowUp` / `ArrowDown` navigation.
- No network requests are dispatched to external AI service providers or backend endpoints.
- Current audio playback, volume level, and play queue remain completely intact and undisturbed.

### Failure Postconditions
- If submission is blocked during an active run, existing conversation entries remain on screen without data loss.

---

## 9. Special Requirements

- **Client-Side Latency**: The clear operation must execute strictly in memory with zero noticeable rendering delay (< 16 ms / 1 animation frame).
- **Session Privacy**: Clearing removes sensitive or transient prompts from the immediate visual display, protecting listener privacy in public viewing environments.
- **Memory Integrity**: The 30-item command history buffer is maintained independently from the visual `entries` display state, allowing past commands to be reused even after a visual clear.

---

## 10. UI References

- **Implementation Component**: `src/frontend/src/components/chat/AIHostChat.jsx` (lines 163–168)
- **Related Screenshots**:
  - `prototypes/UC-120-001-basic-flow-open.png` (Initial welcome banner state re-established after clear)
  - `prototypes/UC-120-001-basic-flow-conversation.png` (Terminal screen prior to executing `/clear`)
  - `prototypes/UC-120-001-basic-flow-input.png` (Terminal prompt area where `/clear` is entered)

---

## 11. Traceability

- **Functional Requirements**: `121-FR-003`, `121-FR-008`
- **Spec Kit Specification**: `specs/120-ai-conversational-agent/121-conversational-interface/spec.md` (User Story 4)
- **Parent Use Case**: `UC-120-001` (Converse with AI Music Host)
