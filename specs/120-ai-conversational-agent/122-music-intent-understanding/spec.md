# Feature Specification: Music Intent Understanding

**Feature Branch**: `122-music-intent-understanding`

**Created**: 2026-10-30

**Status**: Draft — Ready for Planning

**Input**: User description: "AI Conversational Agent của AuraTune có khả năng hiểu ý định âm nhạc của người dùng từ nội dung tin nhắn trong cuộc hội thoại. Hệ thống phân tích yêu cầu bằng ngôn ngữ tự nhiên để xác định người dùng đang muốn thực hiện hành động hoặc tìm kiếm thông tin âm nhạc nào. Làm rõ các loại ý định được hỗ trợ, cách trích xuất thông tin liên quan từ tin nhắn, cách xử lý khi một yêu cầu có nhiều ý định, thiếu thông tin hoặc không thể xác định ý định. Kết quả nhận diện phải được chuyển tiếp đến thành phần phù hợp để xử lý theo phạm vi chức năng được tài liệu dự án xác định. Không bao gồm: giao diện hội thoại và quản lý tin nhắn (spec 121-conversational-interface), thực hiện hành động âm nhạc theo thời gian thực như phát nhạc hoặc điều khiển Music Player (spec 123-real-time-music-assistance), xây dựng hoặc huấn luyện mô hình AI, tự quyết định thuật toán NLP hoặc mô hình LLM nếu tài liệu nguồn chưa xác định. Dữ liệu và quy tắc: đối chiếu docs/proposal/proposal.md, docs/management/team-contract.md, docs/design/database/README.md, API contract và các spec liên quan trong repository. Làm rõ dependency với Conversational Interface, Songs, Albums, Artists, Playlists, Music Player và các chức năng âm nhạc khác nếu được xác định. Nếu tài liệu chưa xác định danh sách ý định, cấu trúc kết quả nhận diện, cách xử lý yêu cầu mơ hồ hoặc cơ chế chuyển tiếp kết quả, ghi nhận là điểm cần clarification thay vì tự giả định."

## Clarifications

### Session 2026-10-30

- Q: Which core categories of music intents must the intent understanding engine officially support and classify in version 1? (FR-002) → A: Extended scope including playback, search/discovery, information inquiries, general chat, and library management (Option B: `play_music`, `search_music`, `query_music_info`, `manage_library`, `general_chitchat`).
- Q: How should the intent understanding engine handle user messages that lack necessary slot entities or contain multiple conflicting intents? (FR-005) → A: Smart heuristic defaults (Option C). When an intent lacks explicit slot entities (e.g., "bật nhạc đi"), the system automatically infers reasonable defaults (e.g., falling back to trending tracks or user personalized recommendations) rather than blocking on clarifying questions; for multi-intent inputs, it prioritizes the primary actionable playback intent with inferred defaults and preserves secondary intents in context metadata.
- Q: What routing architecture should be used to forward the structured intent result to downstream execution and response components? (FR-007) → A: Centralized AI Agent Orchestrator pattern (Option A). The intent understanding module outputs a standardized JSON payload (`intent_type`, `confidence_score`, `completeness_status`, `extracted_entities`, `suggested_action`) to the backend AI Conversational Agent Orchestrator, which centrally coordinates and routes requests to Real-time Music Assistance (spec 123), Search/Recommendations (030/100), or Conversational Interface (spec 121).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand Music Playback and Control Requests (Priority: P1)

As an authenticated listener chatting with the AI host, I want the system to correctly understand my natural language requests to play specific tracks, artists, or playback controls so that my desired musical action can be executed without manual navigation.

**Why this priority**: Directing playback through conversational natural language is the fundamental capability that makes the AI host feel like an active musical assistant and DJ.

**Independent Test**: Can be tested independently by supplying user messages expressing playback desires (e.g., "bật bài Nơi này có anh", "phát nhạc của Vũ", "tạm dừng nhạc") and verifying that the system correctly identifies the playback intent and extracts the target track or artist entity with high accuracy.

**Acceptance Scenarios**:

1. **Given** a user message requesting a specific song playback (e.g., "bật bài Chúng ta của hiện tại"), **When** the intent understanding engine analyzes the text, **Then** it classifies the intent as a playback request (`play_music`) and extracts the song title entity ("Chúng ta của hiện tại").
2. **Given** a user message requesting playback of an artist's songs (e.g., "phát nhạc của Đen Vâu"), **When** the message is analyzed, **Then** the intent is classified as playback with the artist entity ("Đen Vâu").
3. **Given** a user message requesting basic playback control (e.g., "tạm dừng", "tiếp tục bài tiếp theo"), **When** analyzed, **Then** the intent is classified as playback control with the specific action parameter (e.g., pause, skip).

---

### User Story 2 - Understand Music Search and Discovery Requests (Priority: P1)

As an authenticated listener, I want the system to understand natural language descriptions of songs, moods, activities, or lyrics fragments so that it can find music matching my vibe.

**Why this priority**: Natural language discovery (finding songs by mood, context, or vague descriptions) solves the primary pain point where listeners do not know exact song titles.

**Independent Test**: Can be tested by providing conversational queries describing feelings or activities (e.g., "tìm cho mình mấy bài chill để học bài đêm khuya", "bài nào có lời 'nụ cười em như nắng mai'") and verifying that the system identifies the search/discovery intent and extracts parameters such as mood ("chill"), activity ("học bài đêm khuya"), or lyric snippet.

**Acceptance Scenarios**:

1. **Given** a message expressing mood or situational music needs (e.g., "gợi ý nhạc vui vẻ cho buổi sáng chạy bộ"), **When** analyzed, **Then** the engine identifies the intent as music discovery/recommendation (`search_music` / `recommend_music`) and extracts contextual attributes (mood: "vui vẻ", activity: "chạy bộ", time: "buổi sáng").
2. **Given** a message containing partial lyrics (e.g., "tìm bài hát có đoạn 'hạt mưa rơi nhẹ rơi'"), **When** analyzed, **Then** the engine identifies the intent as lyric search with the lyric entity text extracted.
3. **Given** a request to explore an album or genre, **When** analyzed, **Then** the engine identifies the entity type (album or genre) and associates it with the search request.

---

### User Story 3 - Understand Music Information and Trivia Queries (Priority: P2)

As an authenticated listener, I want the system to understand questions about music information, current playback, artist bios, or song meaning so that the AI host can answer my inquiries informatively.

**Why this priority**: Enhances conversational engagement by enabling the AI agent to act like a knowledgeable radio DJ sharing trivia, context, and details about tracks and artists.

**Independent Test**: Can be tested by submitting questions regarding musical metadata or current playing track (e.g., "bài này tên gì vậy?", "cho mình biết thông tin về ban nhạc Ngọt") and verifying the intent is identified as a music information inquiry with the relevant entity or context anchor.

**Acceptance Scenarios**:

1. **Given** a user asks about the currently playing track (e.g., "bài đang phát là bài gì thế?"), **When** the message is analyzed in combination with the current playback context, **Then** the engine classifies the intent as a current-track inquiry (`query_music_info`) targeting the active playing track ID.
2. **Given** a user asks about an artist's background (e.g., "nghệ sĩ này quê ở đâu?", "kể về ca sĩ Mỹ Tâm"), **When** analyzed, **Then** the engine identifies an artist inquiry intent with the target artist entity extracted.

---

### User Story 4 - Handle Ambiguous, Incomplete, or Out-of-Scope Messages (Priority: P2)

As an authenticated listener, I want the system to gracefully handle vague requests, missing information, or non-music chit-chat so that the conversation stays helpful and never crashes or produces unexpected musical actions.

**Why this priority**: Real users frequently submit partial thoughts (e.g., "bật nhạc đi"), combined instructions, or off-topic chat; the system must handle ambiguity predictably.

**Independent Test**: Can be tested by submitting ambiguous inputs (e.g., "bật nhạc đi"), multi-intent requests, and off-topic messages (e.g., "thời tiết hôm nay thế nào?"), verifying that completeness flags and appropriate intent fallbacks are assigned.

**Acceptance Scenarios**:

1. **Given** a vague playback command lacking specific parameters (e.g., "bật nhạc lên"), **When** analyzed, **Then** the system automatically applies smart defaults (inferring playback of trending tracks or user recommendations) and sets completeness status with inferred default metadata.
2. **Given** a message unrelated to music (e.g., "hôm nay ăn gì nhỉ?"), **When** analyzed, **Then** the engine classifies the intent as general conversation / unsupported (`general_chitchat`), preventing erroneous player actions.
3. **Given** an unclassifiable or unintelligible message, **When** analyzed, **Then** the engine assigns a low confidence score and marks the intent status as unrecognized, allowing the conversational interface to respond politely.

---

### User Story 5 - Protect User Privacy in Message Analysis (Priority: P1)

As an authenticated listener, I want my personal identity information (real name, email, credentials) excluded from intent analysis payloads so that my personal data is strictly protected according to privacy regulations.

**Why this priority**: In accordance with Vietnamese Decree 13/2023/ND-CP and project security guidelines, personal identifiable information must never be exposed to external AI processing services or leaked.

**Independent Test**: Can be tested by submitting messages that accidentally or intentionally include personal data (e.g., "Tôi là Nam, email nam@example.com, hãy bật nhạc Trịnh") and verifying that personal identifiers are filtered before external NLP processing occurs.

**Acceptance Scenarios**:

1. **Given** a message containing personal identifiers (email addresses, phone numbers, or account details), **When** processed for intent understanding, **Then** personal identifiers are scrubbed or masked while retaining musical keywords.
2. **Given** intent analysis results are logged or transmitted, **When** data is stored, **Then** no sensitive user credentials or unmasked private data are persisted in analytical logs.

---

### Edge Cases

- **Mixed Vietnamese and English queries**: A user queries with bilingual syntax (e.g., "play bài Em của ngày hôm qua của Son Tung"). The system must extract the intent ("play") and entities ("Em của ngày hôm qua", "Son Tung") despite language mixing.
- **Typographical errors and informal slang**: A user misspells an artist or song name (e.g., "bật sơm tùng mtp"). The entity extractor should extract the approximate text token with an ambiguity/confidence indicator.
- **Multiple conflicting intents in a single message**: A user asks to "bật bài Nắng ấm xa dần và cho hỏi thông tin ca sĩ Mỹ Tâm". The system prioritizes the primary actionable playback intent ("bật bài Nắng ấm xa dần") and captures the secondary informational inquiry in the structured result context.
- **External AI service timeout or error**: If the natural language parsing service times out (e.g., > 1,500ms) or is unreachable, the system must trigger a deterministic keyword-matching fallback or return an explicit unavailable status without disrupting the rest of the application.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST analyze natural language messages submitted within an active conversation thread and identify the underlying music intent and associated entity parameters.
- **FR-002**: System MUST categorize message intents into five supported intent categories: playback and playback controls (`play_music`), music search and discovery (`search_music`), music and artist information inquiry (`query_music_info`), playlist and library management (`manage_library`: create playlist, add to playlist, like song, follow artist via chat commands), and general chit-chat / unsupported out-of-scope conversation (`general_chitchat`).
- **FR-003**: System MUST extract relevant musical entity slots from the user message, including song title, artist name, album title, genre, mood, activity, playback control actions, playlist name, and library target entity when present in the user text.
- **FR-004**: System MUST utilize conversation context (including current playback state and active track ID if provided) to resolve contextual references (such as "bài này", "ca sĩ này", "tiếp theo").
- **FR-005**: System MUST resolve messages with missing required slot entities or multi-intent requests using smart heuristic defaults: when an intent lacks explicit entities (such as "bật nhạc đi"), the system MUST automatically supply a sensible default target (such as trending songs or personal recommendations) without blocking on clarifying questions; for multi-intent messages, the system MUST prioritize the primary actionable playback intent with inferred defaults and record secondary intents in context.
- **FR-006**: System MUST assign a confidence evaluation or completeness status to each recognized intent, marking messages that fall below a confidence threshold as unrecognized or requiring clarification.
- **FR-007**: System MUST produce a standardized structured intent result (including intent type, confidence score, completeness status, extracted entities, and suggested action) and forward it to the backend Centralized AI Agent Orchestrator, which centrally dispatches downstream requests to Real-time Music Assistance (spec `123-real-time-music-assistance`), Search/Recommendations (Group `030`/`100`), or Conversational Interface (spec `121-conversational-interface`).
- **FR-008**: System MUST sanitize and strip personal identifiable information (PII) including email addresses, phone numbers, and account credentials from messages before submitting text to external AI natural language processing services, adhering to Decree 13/2023/ND-CP.
- **FR-009**: System MUST isolate intent understanding processing strictly within the context of the authenticated user's session, preventing any cross-user data leakage.
- **FR-010**: System MUST provide a fallback mechanism (e.g., rule-based keyword matching or a graceful unrecognized status response) if the external AI language processing service times out or is unreachable, ensuring continuous system availability.
- **FR-011**: System MUST process intent understanding in a timely manner (producing recognized intent structure within defined timeout limits) without blocking client-side audio playback or navigation.
- **FR-012**: System MUST NOT execute playback actions, mutate the music player state, or render chat UI components directly, maintaining strict boundary separation from spec `121-conversational-interface` and spec `123-real-time-music-assistance`.

### Key Entities *(include if feature involves data)*

- **Intent Analysis Request**: Represents the input payload for intent evaluation, containing the raw message text, user session context, and optional playback state snapshot (e.g., `current_song_id`, playback status).
- **Intent Understanding Result**: Represents the structured outcome of language analysis. Key attributes include:
  - `intent_type`: The classified intent category (e.g., `play_music`, `search_music`, `query_music_info`, `manage_library`, `general_chitchat`, `unknown`).
  - `confidence_score`: A normalized numerical score indicating classification confidence.
  - `completeness_status`: Indicator of whether all required parameters for intent fulfillment are present (`complete`, `missing_parameters`, `ambiguous`).
  - `extracted_entities`: Key-value map of recognized slots (such as `song_title`, `artist_name`, `album_name`, `genre`, `mood`, `activity`, `control_action`).
  - `suggested_action`: Recommended routing destination (e.g., `real_time_assistance`, `search_service`, `dialogue_response`).
- **Music Entity Slot**: Represents an extracted domain entity token mapped to a specific catalog or conversational attribute (e.g., entity type, raw text token, resolved catalog candidate ID if matchable).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: System correctly identifies intent and extracts primary music entities in at least 90% of standard benchmark test cases across supported intent categories.
- **SC-002**: Intent understanding analysis completes and outputs a structured result within 1,200 milliseconds under normal network conditions.
- **SC-003**: In 100% of test cases containing personal identifiers (emails, phone numbers), the sensitive data is stripped before reaching external AI natural language parsing endpoints.
- **SC-004**: 100% of non-music messages (such as general greetings or out-of-scope chit-chat) are safely classified without triggering accidental player actions or music queue mutations.
- **SC-005**: In 100% of simulated AI parsing service outages or timeouts, a fallback classification or safe unrecognized response is returned without crashing the host application or halting audio playback.

## Assumptions

- Messages analyzed by this feature are provided as sanitized text strings by the Conversational Interface (`121-conversational-interface`).
- Direct execution of player commands (such as play, pause, queue addition) is handled by Real-Time Music Assistance (`123-real-time-music-assistance`) and Music Player / Queue features (`040`/`050`), not by this intent understanding module.
- Catalog entity verification (checking if an extracted song or artist name exists in the AuraTune database) is performed using the existing database schema (`songs`, `artists`, `albums`).
- Communication with external AI natural language models or text processing APIs is mediated by backend server-side components with credentials safely secured in environment variables.
- Listeners may communicate in Vietnamese, English, or a mix of both when referencing artists and track names.
- In compliance with Decree 13/2023/ND-CP and project rules, intent extraction does not store raw user-identifying conversational profiling data without consent.
