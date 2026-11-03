# Phase 0 Research: Conversational Interface (Feature 121)

## Overview

This research document consolidates architectural findings, design decisions, and technology choices for **Feature 121: Conversational Interface** under **Group 120 – AI Conversational Agent** in AuraTune.

Feature 121 delivers a dedicated conversational interface enabling authenticated listeners to converse with the AI host in natural language. It establishes the bidirectional message exchange pipeline, visual processing feedback (spinner, elapsed timer, expandable reasoning trace), Markdown response rendering, in-memory command history and `/clear` utility, non-disruptive failure recovery, and strict user account isolation.

---

## Research Tasks & Findings

### 1. Communication Protocol & Streaming Mechanism: Server-Sent Events (SSE) vs WebSockets vs Unary HTTP

- **Context & Constraints**:
  - `spec.md` (FR-002, FR-004, FR-007, FR-012): The interface requires immediate feedback upon message dispatch (< 300ms per SC-002), continuous processing status updates (thinking verbs, elapsed time), and incremental streaming of assistant responses.
  - `src/frontend/src/utils/agentService.js`: The current frontend mock uses an async generator (`for await (const event of runAgent(...))`) yielding sequential events: `thinking`, `text` (delta), `error`, and `done`.
  - Backend architecture (`docs/design/architecture/system-architecture.md`): Communication follows standard HTTP `/api/v1` conventions, secured by Bearer JWT tokens.
- **Decision**:
  - Implement **Server-Sent Events (SSE)** via `POST /api/v1/agent/chat` with `Accept: text/event-stream`.
  - The client transmits the user prompt and playback context (`currentTrack`, `isPlaying`, `volume`) as a standard JSON body in an HTTP POST request.
  - The backend verifies the Bearer JWT and opens an event stream (`Content-Type: text/event-stream`), streaming events:
    - `event: thinking\ndata: {"text": "Đang phân tích..."}\n\n`
    - `event: text\ndata: {"delta": "Chào bạn! "}\n\n`
    - `event: error\ndata: {"message": "..."}\n\n`
    - `event: done\ndata: {"totalDurationMs": 1240}\n\n`
  - The frontend consumes the stream using `fetch` with `ReadableStream` reader (or `@microsoft/fetch-event-source`) and `AbortController` for cancellation.
- **Rationale**:
  - SSE over HTTP POST enables passing standard HTTP Authorization headers and rich request context bodies without URL length limits.
  - Native browser `ReadableStream` reader handles token streaming without the operational complexity, persistent socket heartbeat management, or stateful connection tracking required by WebSockets.
  - Provides sub-100ms time-to-first-token rendering and seamless mapping to the existing `AIHostChat.jsx` async generator architecture.
- **Alternatives Considered**:
  - *WebSockets (`ws://` / `wss://`)*: Rejected because the conversational pattern in Feature 121 is request-response turns initiated by the user. WebSockets introduce unnecessary complexity for token refresh, load-balancer sticky sessions, and stateful socket reconnection without meaningful benefit for single-turn stream generation.
  - *Unary JSON HTTP (`POST /api/v1/agent/chat` returning full response at once)*: Rejected because it cannot provide real-time streaming tokens or live reasoning feedback, violating FR-004 and SC-002.
  - *Client polling (`GET /api/v1/agent/poll`)*: Highly inefficient, introduces latency jitter, and strains server resources.

---

### 2. Conversation Lifecycle & History Storage Architecture: Transient In-Memory vs Persistent Database

- **Context & Constraints**:
  - `spec.md` Clarification Session (2026-10-30 / updated 2026-11-01): Conversation lifecycle is explicitly defined as **Session / In-memory conversation lifecycle with command history**.
  - FR-008: The interface maintains active messages in client component memory, supports the `/clear` command to reset the view to initial banner state, and retains up to 30 recent prompts navigable via the Up/Down arrow keys.
  - Data protection: Decree 13/2023/ND-CP mandates strict personal data minimization and isolation.
- **Decision**:
  - Maintain active conversation `entries` strictly in **client component memory** (`useState` in `AIHostChat.jsx`).
  - Maintain recent user prompts in a fixed-size **in-memory ring buffer (maximum 30 items)** managed via `useRef` in the component.
  - The `/clear` command executes entirely client-side: it clears the `entries` state and resets the log to the initial welcome banner without making network calls.
  - On user logout or session termination, all in-memory conversational states and command history are discarded immediately.
- **Rationale**:
  - Complies strictly with the explicit clarification decision recorded in `spec.md`.
  - Enables instant responsiveness for `/clear` and arrow-key history recall without network latency.
  - Eliminates unnecessary database writes and eliminates the risk of stale chat data exposure on shared devices.
- **Alternatives Considered**:
  - *Persistent PostgreSQL tables (`conversations`, `messages`)*: Rejected because the team clarification specifically concluded that multi-session persistent dialogue storage is outside v1 scope and not needed for a terminal-style music host.
  - *Browser `localStorage` or `sessionStorage`*: Rejected because storing conversation content or prompt history in unencrypted web storage risks cross-user leakage on shared devices if users log out without clearing cache, violating FR-010.

---

### 3. Markdown Rendering and Input Sanitization (FR-007)

- **Context & Constraints**:
  - `spec.md` (FR-007, Clarification Session 2026-10-30): AI responses MUST render standard Markdown formatting (bold, italics, lists, links), while user inputs remain sanitized plain text.
  - Security requirements: Prevent Cross-Site Scripting (XSS), script tag injection, or dangerous HTML href attributes (e.g., `javascript:` links).
- **Decision**:
  - **User input**: Captured via standard `<textarea>`, sanitized by converting to a plain JavaScript string, trimming whitespace, and rendering via standard text nodes (prefixed with `❯`). User input is never parsed or executed as HTML/Markdown.
  - **AI response**: Rendered using a lightweight Markdown component (`react-markdown` configured with `rehype-sanitize` or custom parser for supported subset: bold `**`, italics `*`, bullet lists `-`/`*`, code blocks, and links `[text](url)`).
  - Hyperlinks rendered from AI Markdown are constrained to safe protocols (`http:`, `https:`, platform routes) and rendered with `target="_blank"` and `rel="noopener noreferrer"`.
- **Rationale**:
  - Guarantees complete immunity against client-side injection attacks.
  - Allows the AI host to provide rich, readable music descriptions, lists, and external reference links.
- **Alternatives Considered**:
  - *`dangerouslySetInnerHTML` with regex replacement*: Rejected as insecure and error-prone.
  - *Plain text only for AI responses*: Rejected because FR-007 explicitly mandates Markdown capabilities for bold emphasis, track lists, and links.

---

### 4. Non-Disruptive Failure Recovery & Service Outage Strategy (FR-009, FR-011)

- **Context & Constraints**:
  - `spec.md` (FR-009, FR-011, SC-005): If the AI service is disabled (`aiAvailable = false`), times out, or becomes unreachable, the UI must display status `● tạm ngưng` (suspended), render an inline amber alert notice, disable text input, and present an inline retry action—while ensuring background music playback continues 100% uninterrupted.
  - Core player architecture (`App.jsx`, `PlayerContext.jsx`): The audio player runs continuously in a dedicated provider context (`PlayerProvider`) separate from transient modal overlays.
- **Decision**:
  - **Service-level check (`aiAvailable`)**:
    - The application store (`AppStore`) maintains `aiAvailable: boolean`.
    - If `false`, `AIHostChat.jsx` renders the header status `~/auratune · ● tạm ngưng` (amber text), displays the non-blocking alert banner (`AlertTriangle`), and disables the `<textarea>` input (`disabled={!available}`).
  - **Request-level failure & Retry**:
    - If a network error, timeout, or HTTP 503 (`AI_SERVICE_UNAVAILABLE`) occurs during message dispatch:
      - The failed message entry in `entries` retains state `error` with message `✗ Lỗi kết nối đến AI Host`.
      - An inline "Thử lại" (Retry) button is rendered alongside the failed entry.
      - Clicking "Thử lại" re-dispatches the exact original prompt using the existing `runPrompt(prompt)` routine without requiring the user to retype.
  - **Audio playback isolation**:
    - `AIHostChat` component errors are caught locally via internal `try/catch` and an optional React `ErrorBoundary`.
    - No chat network request failure or unhandled exception is permitted to bubble up to `App.jsx` or interact with the HTML5 audio element in `PlayerContext`.
- **Rationale**:
  - Ensures robust fault isolation: a complete AI backend failure has zero impact on audio streaming or application navigation.
  - Complies with SC-005 and UC-120-001 (EF-01).
- **Alternatives Considered**:
  - *Global toast or modal popup for errors*: Rejected because blocking dialogs degrade listener experience and interrupt visual browsing. Inline failure indicators are non-intrusive.

---

### 5. UI Architecture & Terminal Alignment with Group 120 Implementation

- **Context & Constraints**:
  - The repository's current frontend implementation in `src/frontend/src/components/chat/AIHostChat.jsx` has established a distinctive **floating CLI/terminal interface**.
  - Key visual and interaction elements:
    - Anchored right panel (`bottom-[96px] right-2 top-2`, max-w 460px) with backdrop blur.
    - Monospace font styling (`font-mono text-[12px]`) with dark theme (`#0c0d12`).
    - Status badge in header (`~/auratune · ● online` / `● tạm ngưng`).
    - Welcome banner (`Banner` component) with introductory bullets and shortcut hints.
    - Built-in `/help` command rendering a command cheat sheet.
    - Animated braille spinner (`⠋⠙⠹...`) with rotating verbs ("Đang suy nghĩ", "Đang phân tích", etc.) and active elapsed seconds timer (`seconds(thoughtFor)`).
    - Expandable thinking accordion (`✻ Đã suy nghĩ [N]s >`) showing reasoning lines.
    - Pulsating terminal cursor (`█`) during streaming.
    - Quick prompt suggestion chips above the textarea.
    - History navigation with `ArrowUp` / `ArrowDown` keys.
    - In-flight turn abort with `Esc` key (marks `■ Đã dừng`).
- **Decision**:
  - Adopt and formalize the existing terminal CLI interaction model as the standard frontend technical approach for Feature 121.
  - Maintain the existing props and state interfaces while strengthening:
    1. Safe Markdown rendering in the streamed response block.
    2. Explicit inline failure and retry action handling.
    3. Proper token authentication and service layer abstraction.
- **Rationale**:
  - Fully aligns technical planning with the actual shipped frontend code, avoiding discrepancies between documentation and implementation.
  - Preserves established accessibility attributes (`role="dialog"`, `aria-modal="true"`, `role="log"`, `aria-live="polite"`).

---

### 6. Authentication Boundary & Data Privacy (FR-001, FR-010)

- **Context & Constraints**:
  - FR-001: System MUST restrict access to authenticated users, redirecting unauthenticated visitors to login.
  - FR-010: System MUST isolate all conversation data strictly by the authenticated user's account ID.
  - Decree 13/2023/ND-CP: Strict legal compliance for personal user data.
- **Decision**:
  - **Client authentication gate**:
    - The chat launch triggers in `TopBar.jsx` and `BottomPlayer.jsx` inspect `store.currentUser`.
    - If the user is unauthenticated, clicking the button opens the authentication challenge modal or routes to `/login`.
    - If `AIHostChat` is mounted without an active user, it gracefully inhibits submission and displays an authentication prompt.
  - **Server authentication gate**:
    - All requests to `/api/v1/agent/chat` require a valid JWT `Authorization: Bearer <token>`.
    - Backend middleware extracts `req.user.id`. The server never accepts a user ID in the request body.
    - Any attempt to query or post without valid credentials immediately returns HTTP 401 (`UNAUTHORIZED`).
- **Rationale**:
  - Establishes a zero-trust security perimeter at both client and API gateway levels.
  - Prevents spoofing or accidental data leakage across accounts.

---

## Summary of Architectural Decisions

| Area | Decision | Primary Rationale |
|---|---|---|
| **Streaming Protocol** | Server-Sent Events (SSE) via `POST /api/v1/agent/chat` | Native browser streaming, supports auth header & body context, lightweight. |
| **State & History** | Transient in-memory `entries` + 30-item ring buffer | Strictly complies with clarified v1 spec; instant `/clear`; privacy-safe. |
| **Formatting** | Plain text for user; sanitized Markdown for AI | Prevents XSS while supporting rich formatting (bold, lists, links). |
| **Error Handling** | Inline error status with "Thử lại" (Retry) action | Non-disruptive, preserves audio streaming, zero modal interruptions. |
| **Service Outage** | Amber badge (`● tạm ngưng`), alert banner, disabled input | Clear user feedback; audio playback continues 100% uninterrupted. |
| **Security & Privacy** | JWT Bearer token on all requests; client gate; memory wiped on logout | Zero cross-account data leakage; Decree 13/2023/ND-CP compliance. |
| **UI Paradigm** | Floating terminal CLI panel matching `AIHostChat.jsx` | Matches latest implemented UI; keyboard ergonomics; accessible dialog & log. |
