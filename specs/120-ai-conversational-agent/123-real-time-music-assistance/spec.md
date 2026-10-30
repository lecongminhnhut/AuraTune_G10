# Feature Specification: Real-Time Music Assistance

**Feature Branch**: `feat/123-real-time-music-assistance`

**Created**: 2026-10-30

**Status**: Draft — Ready for Planning

**Input**: User description: "AI Conversational Agent của AuraTune hỗ trợ người dùng thực hiện các yêu cầu liên quan đến âm nhạc ngay trong quá trình hội thoại. Sau khi tiếp nhận tin nhắn và kết quả nhận diện ý định từ spec `122-music-intent-understanding`, hệ thống xử lý yêu cầu và phối hợp với các chức năng âm nhạc tương ứng để cung cấp hỗ trợ cho người dùng. Làm rõ các hành động âm nhạc được hỗ trợ, cách chuyển tiếp yêu cầu đến thành phần xử lý phù hợp, cách phản hồi kết quả cho người dùng và cách xử lý khi yêu cầu không hợp lệ, thiếu thông tin hoặc dịch vụ liên quan không khả dụng. Không bao gồm: giao diện hội thoại và quản lý tin nhắn (spec `121-conversational-interface`), nhận diện ý định âm nhạc từ ngôn ngữ tự nhiên (spec `122-music-intent-understanding`), xây dựng hoặc huấn luyện mô hình AI, tự quyết định các hành động âm nhạc, thuật toán hoặc kiến trúc xử lý nếu tài liệu nguồn chưa xác định. Dữ liệu và quy tắc: đối chiếu `docs/proposal/proposal.md`, `docs/management/team-contract.md`, `docs/design/database/README.md`, API contract và các spec liên quan trong repository. Làm rõ dependency với Conversational Interface, Music Intent Understanding, Music Player, Songs, Albums, Artists và Playlists nếu được hỗ trợ. Đảm bảo các hành động được thực hiện trong phạm vi quyền của người dùng hiện tại. Nếu tài liệu chưa xác định danh sách hành động, cách thực thi, cơ chế phản hồi hoặc hành vi khi lỗi, ghi nhận là điểm cần clarification thay vì tự giả định."

## Clarifications

### Session 2026-10-30

- Q: Trợ lý âm nhạc thời gian thực của AuraTune cần hỗ trợ những nhóm hành động âm nhạc cụ thể nào trực tiếp từ hội thoại trong phiên bản đầu tiên? (FR-002) → A: Hỗ trợ âm nhạc toàn diện (Option C). Hệ thống hỗ trợ thực thi ba nhóm hành động: (1) Điều khiển phát nhạc cốt lõi (`PLAY_TRACK`, `PAUSE`, `RESUME`, `SKIP_NEXT`, `SKIP_PREVIOUS`), (2) Quản lý hàng đợi và luồng khám phá (`ADD_TO_QUEUE`, `PLAY_NEXT`, nạp danh sách gợi ý theo tâm trạng / tìm kiếm ngữ nghĩa vào player queue), và (3) Tương tác thư viện cá nhân (`LIKE_SONG`, `SAVE_TO_PLAYLIST`, `FOLLOW_ARTIST`) trong phạm vi quyền hạn tài khoản đã đăng nhập.
- Q: Hệ thống nên sử dụng cơ chế chuyển tiếp và phối hợp nào để gửi chỉ thị hành động âm nhạc từ AI Conversational Agent đến Music Player (trên Web Client) và các dịch vụ backend? (FR-003) → A: Điều phối hành động phía Client qua Payload phản hồi (Option A). Backend AI Orchestrator xử lý logic, thẩm định thực thể và trả về gói tin JSON chứa mảng chỉ thị `client_actions` chuẩn hóa kèm phản hồi hội thoại; Web Client tiếp nhận và trực tiếp phát lệnh điều khiển phát nhạc/hàng đợi tới Persistent Bottom Player (`040`/`050`), đồng thời thực hiện gọi các API backend tương ứng cho các thao tác thư viện cá nhân (`060`/`090`).
- Q: Kết quả thực hiện hỗ trợ âm nhạc (bao gồm cả trạng thái thành công và xử lý ngoại lệ khi lỗi) nên được phản hồi và hiển thị như thế nào trong luồng hội thoại với người dùng? (FR-004) → A: Câu thoại của AI host kèm Thẻ bài hát/hành động tương tác (Option A). Phản hồi người dùng bằng câu thoại đàm thoại tự nhiên của AI host kết hợp widget thẻ xem trước trực quan (gồm ảnh bìa, tên bài hát, nghệ sĩ, nút phát/dừng phụ) trong luồng chat; khi xảy ra lỗi (không tìm thấy bài hát, thiếu thông tin, dịch vụ AI 503), hiển thị thông báo lỗi nhẹ nhàng kèm nút Retry và đề xuất gợi ý thay thế mà không bao giờ ngắt bài hát hiện đang phát.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Real-time Playback and Audio Control Assistance (Priority: P1)

As an authenticated listener conversing with the AI agent, I want the system to execute playback actions (play, pause, resume, skip track, adjust playback) in response to my conversational requests so that I can control my audio stream seamlessly without leaving the chat or manually clicking the player controls.

**Why this priority**: Immediate playback execution is the core value proposition of an interactive AI musical host/DJ. Without real-time audio control, conversational music assistance cannot fulfill its primary user need.

**Independent Test**: Can be tested independently by providing a validated playback intent (e.g., `play_music` targeting a specific song or artist) and verifying that the music assistance engine coordinates with the music player to load the track stream, initiate playback, and return a confirming host response.

**Acceptance Scenarios**:

1. **Given** an authenticated user requesting a specific track (e.g., "bật bài Nơi này có anh") and an identified song entity, **When** real-time music assistance processes the intent, **Then** the system retrieves the target song details from the catalog, dispatches a playback command to the music player, and streams the song audio without disrupting user navigation.
2. **Given** an active audio playback session, **When** the user requests a playback control action (e.g., "tạm dừng nhạc", "tiếp tục", "chuyển bài tiếp theo"), **Then** the system immediately issues the corresponding control command (`pause`, `resume`, `skip_next`) to the active player and acknowledges the action to the user.
3. **Given** a request to play songs by an artist (e.g., "phát nhạc của Vũ"), **When** processed, **Then** the system resolves the artist's top tracks or representative album, queues them in the player, and begins playing the first track.

---

### User Story 2 - Queue Management and Discovery Stream Assistance (Priority: P1)

As an authenticated listener, I want the assistant to add tracks to my upcoming playback queue or start a dynamic recommendation/search stream through conversational commands so that my music listening remains continuous and tailored to my vibe.

**Why this priority**: Queue control and discovery streaming empower the AI agent to act as an active curator and DJ, ensuring music continues smoothly beyond a single track.

**Independent Test**: Can be tested by issuing queue-related commands (e.g., "thêm bài X vào danh sách chờ", "phát bài Y tiếp theo") and verifying that the playback queue updates with the specified track in the correct position without interrupting current track audio.

**Acceptance Scenarios**:

1. **Given** a user is listening to a song and requests to queue a track (e.g., "cho bài Đi về nhà vào hàng đợi"), **When** the assistance engine executes the action, **Then** the target song is appended to the current queue and a confirmation message is delivered.
2. **Given** a user requests immediate next-play priority (e.g., "phát bài này tiếp theo"), **When** executed, **Then** the target song is inserted at the top of the upcoming queue (`play_next`) ahead of previously queued songs.
3. **Given** a user requests music discovery based on mood or activity (e.g., "tìm nhạc chill để tập trung"), **When** executed, **Then** the assistant invokes the music recommendation/search service, loads matching tracks into the queue, and informs the user of the curated playlist stream.

---

### User Story 3 - Real-time Library Interaction via Conversation (Priority: P2)

As an authenticated listener, I want to perform library operations (such as liking the currently playing song, saving it to a playlist, or following an artist) through conversation so that I can curate my personal music collection without navigating away from the chat dialogue.

**Why this priority**: Seamless library management enhances listener engagement and builds long-term personalization data, enabling the AI to learn user taste.

**Independent Test**: Can be tested by issuing a library management command (e.g., "thích bài này", "lưu vào playlist Yêu thích", "theo dõi ca sĩ này") while a song is active, and verifying that the corresponding backend API (`PUT /songs/:id/like`, `POST /playlists/:id/songs`, `PUT /artists/:id/follow`) is triggered within the user's authenticated scope.

**Acceptance Scenarios**:

1. **Given** a song is currently playing, **When** the user commands "thích bài hát này" or "thêm vào bài hát yêu thích", **Then** the system records the like status for that song under the user's account and responds with confirmation.
2. **Given** the user commands to add the current track to a specific custom playlist, **When** the assistance engine verifies the user owns or has permission to edit the playlist, **Then** the song is added to the playlist and a success notice is provided.
3. **Given** a user attempts a library action on a resource they do not have permission to modify (e.g., modifying another user's private playlist), **When** executed, **Then** the system rejects the operation, enforces security boundaries, and returns a polite explanation.

---

### User Story 4 - Graceful Error Handling, Missing Information, and Service Outage Recovery (Priority: P2)

As an authenticated listener, I want clear, polite feedback and safe fallback behaviors when a requested song is missing, input details are incomplete, or music services are temporarily unavailable, so that my listening experience remains stable and never abruptly breaks.

**Why this priority**: In real-world operation, catalog misses, network glitches, or downstream service outages occur. The assistant must fail gracefully, protect playback stability, and guide the user back on track.

**Independent Test**: Can be tested by simulating catalog misses (querying non-existent songs), invalid parameters, and downstream 503 service outages, verifying that the system returns friendly explanatory feedback and leaves active audio undisturbed.

**Acceptance Scenarios**:

1. **Given** a user requests a song or artist not present in the AuraTune catalog, **When** catalog lookup fails, **Then** the assistant notifies the listener that the track is not available and suggests related genres, popular alternatives, or prompt refinement without stopping current audio.
2. **Given** a user request lacks required parameters and cannot be automatically resolved via smart defaults, **When** analyzed, **Then** the assistant responds with an actionable clarification question prompting the user for missing details.
3. **Given** a downstream music or AI service experiences an outage or timeout (`AI_SERVICE_UNAVAILABLE` / `503`), **When** an assisted action is requested, **Then** the system preserves the current player state, displays an informative non-blocking message, and provides an option to retry once services recover.

---

### User Story 5 - User Session Authorization and Playback Isolation (Priority: P1)

As an authenticated listener, I want all music assistance actions to operate strictly within the boundaries of my account and current playback session so that my music player and library are protected from unauthorized manipulation.

**Why this priority**: Preventing cross-account data corruption and enforcing proper permission boundaries is non-negotiable for system security and regulatory compliance (Decree 13/2023/ND-CP).

**Independent Test**: Can be tested by executing assistance actions across distinct user sessions, verifying that User A's conversational actions cannot control User B's player, queue, or personal library.

**Acceptance Scenarios**:

1. **Given** User A sends a conversational music action command, **When** the request is processed, **Then** the action is authorized against User A's session token and applied strictly to User A's player and library state.
2. **Given** an unauthenticated visitor, **When** they attempt to trigger music assistance actions, **Then** the system blocks the request and prompts for authentication.
3. **Given** an action targeting a restricted or private resource (e.g., an unlisted/private playlist belonging to another user), **When** evaluated, **Then** the system rejects the action with a permission error.

---

### Edge Cases

- **Track unavailable in catalog**: The user asks to play a song that does not exist in the database. The system must not stop current playback, but instead inform the user and suggest similar available songs or trending tracks.
- **Playback streaming failure mid-assistance**: The audio file cannot be loaded or streamed (`GET /songs/:id/stream` failure). The system must report the playback error gracefully, attempt the next queue item if available, and provide user feedback.
- **User manual action collision**: The user manually clicks "pause" on the UI player at the exact moment the assistant executes a "play" command. The system must maintain consistent state and honor the latest timestamped user intent.
- **Concurrent rapid conversational commands**: A user rapidly sends multiple music commands (e.g., "bật bài A" followed immediately by "bật bài B"). The system should process commands sequentially or cancel the obsolete in-flight loading request in favor of the newer one.
- **Network loss or backend timeout**: The backend API or audio streaming endpoint times out (> 3,000ms). The assistant must surface an inline retryable error message without freezing the chat UI or crashing the application.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept structured intent results produced by spec `122-music-intent-understanding` (including `intent_type`, `completeness_status`, `extracted_entities`, and `confidence_score`) and validate them for real-time execution.
- **FR-002**: System MUST support real-time execution across three comprehensive music action categories: (1) core playback controls (`PLAY_TRACK`, `PAUSE`, `RESUME`, `SKIP_NEXT`, `SKIP_PREVIOUS`), (2) queue management and discovery streaming (`ADD_TO_QUEUE`, `PLAY_NEXT`, and streaming mood recommendations / semantic search results into the active player queue), and (3) personal library interactions (`LIKE_SONG` via `PUT /songs/:id/like`, `SAVE_TO_PLAYLIST` via `POST /playlists/:id/songs`, and `FOLLOW_ARTIST` via `PUT /artists/:id/follow`) within the authenticated user's permission scope.
- **FR-003**: System MUST forward and coordinate musical requests using a Client-side Action Dispatching architecture: the backend conversational orchestrator returns a structured response payload containing a standardized `client_actions` command array alongside the conversational host message; the AuraTune Web Client immediately consumes these action directives to trigger audio streaming, track playback, and queue mutations directly on the Persistent Bottom Player (`040-music-player` / `050-queue-management`), and invokes standard backend APIs for library mutations within the authenticated user session.
- **FR-004**: System MUST present execution outcomes using natural conversational AI host responses accompanied by rich interactive preview card widgets: for successful operations, the system delivers an engaging conversational message alongside an interactive song/action card (displaying artwork, track title, artist name, and quick-action controls); for failed operations (e.g., catalog miss, invalid parameters, or downstream 503 `AI_SERVICE_UNAVAILABLE`), the system MUST deliver a gentle explanatory notice with an inline retry action and alternative discovery suggestions, strictly ensuring currently active audio streaming is never interrupted.
- **FR-005**: System MUST enforce user authorization and role checks for all actions, ensuring users can only mutate resources (playlists, library, queue, follows) within their permitted account privileges.
- **FR-006**: System MUST verify catalog entities (song ID, artist ID, album ID, playlist ID) against the AuraTune catalog database before initiating audio streaming or playlist modifications.
- **FR-007**: System MUST handle incomplete or ambiguous requests by applying smart contextual defaults (e.g., playing top trending tracks or personalized recommendations) or generating targeted clarification prompts without blocking playback.
- **FR-008**: System MUST ensure that failures in action execution (such as track not found, stream error, or downstream service 503 `AI_SERVICE_UNAVAILABLE`) never stop, mute, or disrupt currently playing audio.
- **FR-009**: System MUST synchronize the conversational confirmation with the actual player/queue state so that visual feedback and audio execution reflect the same state.
- **FR-010**: System MUST record listening events to the user's history (`POST /users/me/history`) whenever assisted music playback begins, adhering to listening history conventions (`070-listening-history`).
- **FR-011**: System MUST strictly isolate all music assistance operations to the authenticated user's session, preventing cross-user player control or library modification.
- **FR-012**: System MUST NOT perform natural language understanding or render raw chat UI directly, maintaining explicit boundaries with spec `121-conversational-interface` and spec `122-music-intent-understanding`.

### Key Entities *(include if feature involves data)*

- **Assistance Request**: Represents the input instruction payload received by the real-time assistance engine, comprising user identity, session context, current player state snapshot (e.g., active track ID, volume, queue position), and structured intent object from spec `122`.
- **Music Action Command**: Represents an executable domain operation dispatched to player or backend modules. Attributes include `action_type` (e.g., `PLAY_TRACK`, `PAUSE`, `RESUME`, `SKIP_NEXT`, `ADD_QUEUE`, `LIKE_SONG`, `FOLLOW_ARTIST`), `target_entity_type` (`song`, `artist`, `album`, `playlist`), `target_entity_id`, and `parameters`.
- **Assistance Execution Result**: Represents the outcome of the action execution, including `status` (`success`, `failed`, `partial`, `needs_clarification`), `action_executed`, `target_details` (metadata for display), `error_code` (if failed), and `response_message` (natural language text tailored for the conversational host).
- **Playback Context Snapshot**: Represents the real-time state of the user's music player at the time of the request (e.g., `is_playing`, `current_song_id`, `current_progress_seconds`, `queue_length`, `volume`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Validated playback commands (e.g., play track, pause, resume, skip) are received and dispatched to the player within 1,000 milliseconds of intent parsing completion.
- **SC-002**: 100% of music assistance actions are validated against user authorization rules; 0 unauthorized library or queue mutations occur across accounts.
- **SC-003**: In 100% of failed assistance scenarios (e.g., catalog miss, invalid parameters, downstream service outage), the currently playing audio continues uninterrupted.
- **SC-004**: At least 95% of ambiguous requests with smart defaults (e.g., "bật nhạc đi") initiate a valid music stream without halting or throwing unhandled errors.
- **SC-005**: 100% of assisted playback sessions accurately record playback events in the user's listening history.

## Assumptions

- Users accessing real-time music assistance are authenticated listeners on the AuraTune web application.
- User messages are received and displayed by the Conversational Interface (`121-conversational-interface`).
- Natural language intent recognition and slot extraction are provided by Music Intent Understanding (`122-music-intent-understanding`).
- Audio playback, streaming, and persistent player controls are managed by the Core Music Player module (`040-music-player`) and Queue Management (`050-queue-management`).
- Catalog retrieval and modifications adhere to the established API contract and database schemas for Songs, Albums, Artists, and Playlists.
- When an AI recommendation or search stream is triggered, the assistant delegates query execution to `030-search` and `100-ai-recommendations`.
- Network communication between the backend assistance orchestrator and the client music player operates over standard HTTP/JSON and application state management.
