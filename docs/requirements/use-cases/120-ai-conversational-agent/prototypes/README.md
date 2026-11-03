# Prototype and UI Asset Guide – Group 120: AI Conversational Agent

---

## 1. Purpose

This document defines the organization, conventions, and status of user interface prototypes and mockups for **Group 120 – AI Conversational Agent**. It aligns behavioral Use Case specifications with the latest terminal-style (CLI) agent frontend interface deployed in AuraTune, serving PA3 evaluation requirements and technical traceability.

---

## 2. Directory Organization and Naming Convention

All graphical assets for Group 120 are stored directly in this directory:
`docs/requirements/use-cases/120-ai-conversational-agent/prototypes/`

### Asset Naming Convention
Image files follow the standardized naming convention tied to Use Case IDs and operational flows:

$$\text{UC-120-[SEQUENCE]-[flow-indicator]-[description].png}$$

- **Basic Flow Assets**: `UC-120-[SEQUENCE]-basic-flow[-step].png`
- **Alternative Flow Assets**: `UC-120-[SEQUENCE]-AF-[NN]-[description].png`
- **Exception Flow Assets**: `UC-120-[SEQUENCE]-EF-[NN]-[description].png`
- **Specific Interaction Assets**: `UC-120-[SEQUENCE]-[state-description].png`

---

## 3. Current UI Implementation Context

In accordance with recent frontend updates (`src/frontend/src/components/chat/AIHostChat.jsx` / PR #28 & PR #32):
- **Interface Style**: Terminal / CLI-style panel (`AuraTune Agent`) anchored on the right side of the screen (`bg-[#0c0d12]`, mono typography, terminal prompt `❯`).
- **Core Elements**: Status badge (`~/auratune · online` / `● tạm ngưng`), initial welcome banner with syntax hints, suggestion chips, collapsible thinking block (`⠋ Đang suy nghĩ…` / `✻ Đã suy nghĩ 1.2s >`), structured tool execution lines (`● tool_name`), interactive confirmation prompts (`[y/N]`), streamed text with blinking cursor, inline `PlaylistCard` attachments, and terminal shortcut helpers (`⏎ gửi`, `↑↓ lịch sử`, `esc`, `/help`, `/clear`).
- **Asset Nature**: All screenshots in this directory represent the **current, active frontend implementation** captured at $1440 \times 900$ viewport resolution.

---

## 4. Prototype Inventory and Mapping

| Use Case ID | Flow / Step | Image File | Source Spec Asset | Status | Description |
|---|---|---|---|---|---|
| **UC-120-001** | Basic Flow (Closed State) | `UC-120-001-panel-closed.png` | `121/.../01-ai-host-closed.png` | **Available** | Platform layout showing the AI Host trigger button on the navigation bar before opening. |
| **UC-120-001** | Basic Flow (Initial Open) | `UC-120-001-basic-flow-open.png` | `121/.../02-ai-host-open.png` | **Available** | CLI panel open with welcome banner, hint commands, and active prompt input box. |
| **UC-120-001** | Basic Flow (History) | `UC-120-001-basic-flow-conversation.png` | `121/.../03-conversation-history.png` | **Available** | Chronological message thread displaying user prompt `❯` and assistant dialogue response. |
| **UC-120-001** | Basic Flow (Input) | `UC-120-001-basic-flow-input.png` | `121/.../04-message-input.png` | **Available** | Active typing state inside the terminal textarea with placeholder and quick chips. |
| **UC-120-001** | Basic Flow (Thinking) | `UC-120-001-basic-flow-thinking.png` | `121/.../05-typing-indicator.png` | **Available** | Spinner indicator `⠋ Đang suy nghĩ…` with live elapsed timer and collapsible reasoning block. |
| **UC-120-001** | EF-01 (Service Offline) | `UC-120-001-EF-01-service-unavailable.png` | `121/.../06-ai-host-unavailable.png` | **Available** | Suspended status `● tạm ngưng` with amber alert banner and disabled input textarea. |
| **UC-120-002** | Basic Flow (Prompt Chips) | `UC-120-002-basic-flow-quick-prompts.png` | `122/.../01-quick-prompt-suggestions.png` | **Available** | Horizontal suggestion chips bar for rapid prompt selection (`phát lofi chill`, etc.). |
| **UC-120-002** | Basic Flow (Query Input) | `UC-120-002-basic-flow-natural-language.png` | `122/.../02-natural-language-request.png` | **Available** | Complex natural language query entered via prompt bar with clause chaining. |
| **UC-120-002** | Basic Flow (Intent Parse) | `UC-120-002-basic-flow-intent-response.png` | `122/.../03-music-intent-response.png` | **Available** | Agent reasoning response resolving music intent and extracting parameter slots. |
| **UC-120-002** | AF-01 (Track Inquiry) | `UC-120-002-track-inquiry.png` | `122/.../04-track-question.png` | **Available** | Inquiry answering "bài đang phát là gì?" referencing active playback context. |
| **UC-120-002** | AF-02 (Playlist Suggestion) | `UC-120-002-playlist-recommendation.png` | `122/.../05-playlist-suggestion.png` | **Available** | Recommendation response with embedded interactive `PlaylistCard` in chat. |
| **UC-120-003** | Basic Flow (Track Context) | `UC-120-003-basic-flow-current-track.png` | `123/.../01-current-track-context.png` | **Available** | Agent reads context (`currentTrack`, `volume`, `isPlaying`) from persistent bottom player. |
| **UC-120-003** | Basic Flow (Assistance) | `UC-120-003-basic-flow-assistance-dialog.png` | `123/.../02-music-assistance-conversation.png` | **Available** | Execution stream displaying tool call `● set_volume` and playback synchronization. |
| **UC-120-003** | Basic Flow (Queue Add) | `UC-120-003-basic-flow-queue-add.png` | `123/.../03-add-suggested-tracks-to-queue.png` | **Available** | Tool execution `● queue_add` adding suggested playlist tracks to upcoming queue. |
| **UC-120-003** | Basic Flow (Queue Result) | `UC-120-003-queue-updated.png` | `123/.../04-queue-after-assistance.png` | **Available** | Side-by-side view showing queue panel updated with tracks dispatched by the agent. |
| **UC-120-003** | EF-01 (Host Unavailable) | `UC-120-003-EF-01-host-unavailable.png` | `123/.../05-host-unavailable-fallback.png` | **Available** | Fallback state during downstream AI downtime, leaving active audio streaming unaffected. |
| **UC-120-004** | Basic Flow (Clear Command) | `Pending` | `N/A` | **Pending** | Visual state after executing `/clear`, returning log view to the initial banner. |

---

## 5. Guidelines for Linking Prototypes in Use-Case Specifications

1. **Relative Markdown Image Path**: Reference image files directly from this directory:
   ```markdown
   ![CLI Agent Open State](prototypes/UC-120-001-basic-flow-open.png)
   *Figure 1: AuraTune Agent CLI panel opened on the right side.*
   ```
2. **Pending Assets**: For states lacking explicit screenshot captures (e.g. immediate transition of `/clear`), annotate clearly as `[Prototype Pending - To be generated during UI testing]` without fabricating false image files.
3. **Descriptive Captions**: Every embedded screenshot must include an italicized descriptive caption referencing the flow step it illustrates.
