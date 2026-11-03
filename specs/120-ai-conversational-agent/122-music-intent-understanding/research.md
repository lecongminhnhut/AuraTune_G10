# Phase 0 Research: Music Intent Understanding (Feature 122)

## Overview

This research document consolidates architectural findings, design decisions, and technology choices for **Feature 122: Music Intent Understanding** under **Group 120 – AI Conversational Agent** in AuraTune.

Feature 122 is responsible for analyzing natural language chat messages from authenticated listeners to extract structured musical intents and entity slot parameters. It handles PII scrubbing, situational reference resolution, compound clause decomposition, smart heuristic defaults, and standardized payload routing to the Centralized AI Agent Orchestrator. Per FR-012, Feature 122 strictly separates understanding from execution: it does NOT mutate player state or render chat UI components.

---

## Research Tasks & Findings

### 1. Classification & Entity Extraction Engine: Hybrid LLM + Rule-Based Fallback

- **Context & Constraints**:
  - `spec.md` (FR-001, FR-002, FR-003, FR-010, SC-001, SC-002, SC-005): Must classify messages into 5 core intents (`play_music`, `search_music`, `query_music_info`, `manage_library`, `general_chitchat`), extract slots (title, artist, album, genre, mood, activity, volume), output structured results in < 1,200ms, and ensure 100% availability even if the external AI service is unreachable.
  - Existing implementation: `src/frontend/src/utils/agentService.js` provides `planClause(text, context)`, a deterministic regex and keyword-matching parser handling current track queries, volume controls, playback state, queue management, and mood recommendations.
- **Decision**:
  - Implement a **Two-Tier Hybrid Architecture**:
    - **Tier 1 (Primary - External LLM / Python AI Service)**: Structured prompt / function-calling contract (`POST /ai/intent/extract` or internal service) returning a validated JSON object conforming to `MusicIntentPayload`.
    - **Tier 2 (Deterministic Rule-Based Fallback)**: Client & backend pattern matcher based on normalized NFC text, regular expressions, and catalog keyword lookups (elevating `planClause` from `agentService.js`).
  - If Tier 1 fails to respond within 1,200ms (timeout) or returns HTTP 5xx, the system seamlessly falls back to Tier 2 without interrupting audio playback or returning an error to the user.
- **Rationale**:
  - Tier 1 handles nuanced natural language, bilingual expressions ("play bài Em của ngày hôm qua"), complex moods ("nhạc buồn nghe lúc trời mưa 2h sáng"), and conversational small talk.
  - Tier 2 provides zero-latency (< 5ms) deterministic guarantees for common commands (volume, playback toggle, "bài đang phát là gì?", "xóa hàng chờ") and acts as an unbreakable safety net.
- **Alternatives Considered**:
  - *Pure Rule-Based NLP*: Fails on unstructured, expressive musical descriptions, defeating the core value proposition of an AI conversational agent.
  - *Pure LLM without Fallback*: Violates FR-010 and SC-005; any network drop or external quota exhaustion would break conversational music assistance.

---

### 2. Personal Identifiable Information (PII) Sanitization Pipeline (FR-008, SC-003)

- **Context & Constraints**:
  - `spec.md` (FR-008, SC-003): System MUST sanitize and strip personal identifiable information (emails, phone numbers, passwords/credentials) before submitting text to external AI natural language processing services.
  - Legal requirement: Vietnamese Decree 13/2023/ND-CP strictly governs personal data processing.
- **Decision**:
  - Implement a synchronous pre-processing sanitizer pipeline prior to any outbound network dispatch:
    1. **Email sanitizer**: Matches RFC 5322 compliant regex `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}` and replaces with token `[EMAIL_REDACTED]`.
    2. **Phone number sanitizer**: Matches Vietnamese and international phone number formats (`(?:\+84|0)(?:3|5|7|8|9)\d{8}\b`) and replaces with `[PHONE_REDACTED]`.
    3. **Credential sanitizer**: Detects sensitive keyword patterns (`mật khẩu\s*[:=]?\s*\S+`, `token\s*[:=]?\s*\S+`) and masks values.
  - Sanitization executes locally on the backend API / client edge before any payload leaves AuraTune's trusted perimeter.
- **Rationale**:
  - Prevents accidental or adversarial leakage of private user identity data to third-party model providers.
  - Retains musical tokens intact (e.g., "Tôi là Nam, email nam@example.com, hãy bật nhạc Trịnh" -> "Tôi là Nam, email [EMAIL_REDACTED], hãy bật nhạc Trịnh" -> extracts artist: "Trịnh").
- **Alternatives Considered**:
  - *Relying on model system prompts ("do not store PII")*: Rejected because transmitting unredacted PII across untrusted network boundaries violates Decree 13/2023/ND-CP regardless of downstream model behavior.

---

### 3. Compound Instruction & Sequential Clause Decomposition (FR-005, Session 2026-11-01 Clarification)

- **Context & Constraints**:
  - `spec.md` (FR-005, Clarification 2026-11-01): Listeners naturally chain multiple commands into a single sentence (e.g., *"phát nhạc chill rồi giảm âm lượng 40%"* or *"thêm bài này vào danh sách, sau đó bật bảng xếp hạng"*).
  - Existing implementation: `agentService.js` splits prompts on `\s*(?:[,;]|\s+rồi\s+|\s+sau đó\s+)\s*`.
- **Decision**:
  - Standardize compound clause decomposition:
    1. Pre-process text by splitting on temporal and conjunction delimiters: `,`, `;`, `rồi`, `sau đó`, `tiếp theo`, `đồng thời`.
    2. Process each decomposed clause through the intent extraction engine sequentially.
    3. Aggregate the resulting clauses into an ordered list: `clauses: IntentClause[]`.
    4. Provide the aggregated structure to the Orchestrator for sequential execution.
- **Rationale**:
  - Perfectly reflects the existing shipped logic in `agentService.js`.
  - Enables complex multi-step user workflows through intuitive everyday language.
- **Alternatives Considered**:
  - *Single primary intent only (ignoring chained clauses)*: Frustrates users who expect conversational assistants to follow natural multi-step directions.
  - *Parallel non-deterministic execution*: Rejected because order matters (e.g., "phát nhạc rồi giảm âm lượng" must initiate playback before setting volume, otherwise playback initialization might overwrite volume).

---

### 4. Contextual Reference Resolution (FR-004)

- **Context & Constraints**:
  - `spec.md` (FR-004): Must resolve deictic and contextual references such as *"bài này"*, *"bài đang phát"*, *"ca sĩ này"*, *"bài tiếp theo"*, *"to lên"*, *"nhỏ lại"*.
- **Decision**:
  - The request payload injects a playback context snapshot:
    ```typescript
    context: {
      currentTrack: { id: string; title: string; artist: string } | null;
      isPlaying: boolean;
      volume: number; // 0 - 100
    }
    ```
  - When analyzing contextual references:
    - `"bài này"`, `"bài đang phát"` -> resolves to `context.currentTrack.id` and `context.currentTrack.title`.
    - `"ca sĩ này"` -> resolves to `context.currentTrack.artist`.
    - `"nhỏ lại"`, `"giảm âm lượng"` -> resolves to `action: "set_volume", value: max(0, context.volume - 20)`.
    - `"to lên"`, `"tăng âm lượng"` -> resolves to `action: "set_volume", value: min(100, context.volume + 20)`.
- **Rationale**:
  - Anchors language understanding directly to real-time client player state without requiring heavyweight historical chat re-indexing.
  - Provides instantaneous, accurate answers to questions like *"bài này là bài gì?"* (AF-01 in `UC-120-002`).

---

### 5. Smart Heuristic Defaults for Vague Requests (FR-005, Clarification 2026-10-30)

- **Context & Constraints**:
  - `spec.md` (FR-005, Clarification 2026-10-30, User Story 4): When an intent lacks explicit slot entities (e.g., *"bật nhạc đi"*, *"muốn nghe nhạc"*), how should the engine react?
- **Decision**:
  - Avoid conversational deadlocks or interrogation:
    - If `intent_type === "play_music"` and no track/artist/playlist is specified:
      - Set `completeness_status: "missing_parameters"`.
      - Automatically attach `inferred_defaults: { target_type: "playlist", default_source: "trending_or_recommendations" }`.
      - Route to Orchestrator to start playback of the listener's personalized recommendations or trending playlist immediately.
- **Rationale**:
  - Clarification explicitly mandated Option C (Smart heuristic defaults) over Option A (blocking clarification questions).
  - A music player assistant should be bias-to-action: when asked to play music, play music.

---

### 6. Architectural Boundary & Centralized Orchestrator Pattern (FR-007, FR-012)

- **Context & Constraints**:
  - `spec.md` (FR-007, FR-012): The intent understanding module MUST output structured data to the Centralized AI Agent Orchestrator and MUST NOT execute playback actions, mutate player state, or render UI directly.
- **Decision**:
  - Feature 122 operates as a pure classification and extraction service:
    - Input: `(rawText, playbackContext)`
    - Output: `MusicIntentResult`
    - Destination: Centralized Orchestrator in `agentConversationService.js` (backend) or `runAgent` (frontend `agentService.js`).
  - Downstream modules:
    - `123-real-time-music-assistance`: Executes tool calls (`play_playlist`, `set_volume`, `like_track`, `clear_queue`).
    - `030-search` / `100-ai-recommendations`: Handles semantic queries or mood retrieval.
    - `121-conversational-interface`: Streams Markdown dialogues and displays thinking logs.
- **Rationale**:
  - Preserves clean Separation of Concerns (SoC) and strict adherence to repository constitution and team contract.

---

## Summary of Architectural Decisions

| Area | Decision | Primary Rationale |
|---|---|---|
| **Parsing Engine** | Two-Tier Hybrid (LLM + Rule-Based Fallback) | Natural language expressiveness + guaranteed deterministic uptime < 1,200ms. |
| **PII Protection** | Local Regex Pre-Sanitization (Email, Phone, Passwords) | 100% compliance with Decree 13/2023/ND-CP before external network transit. |
| **Compound Messages** | Ordered Clause Decomposition (`rồi`, `sau đó`, `,`) | Reflects `agentService.js` implementation; supports multi-step instructions. |
| **Contextual References** | Client Playback Snapshot Injection (`currentTrack`, `volume`) | Instant resolution for "bài này", "ca sĩ này", "to lên/nhỏ lại". |
| **Incomplete Commands** | Smart Heuristic Defaults (Trending / Personalized) | Bias-to-action; prevents annoying clarification questions (FR-005). |
| **System Boundary** | Pure Intent Extraction -> Centralized Orchestrator | Strict decoupling from execution (123) and UI rendering (121). |
