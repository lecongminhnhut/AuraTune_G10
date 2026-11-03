# UC-120-002 – Interpret Music Intent via Chat

---

## 1. Metadata

| Field | Value |
|---|---|
| **Use Case ID** | UC-120-002 |
| **Use Case Name** | Interpret Music Intent via Chat |
| **Functional Group** | 120 – AI Conversational Agent |
| **Primary Actor** | Listener (`ACT-02`) |
| **Supporting Actors** | External AI Service Provider (`ACT-EXT-04`) |
| **Related FR IDs** | `122-FR-001`, `122-FR-002`, `122-FR-003`, `122-FR-004`, `122-FR-005`, `122-FR-006`, `122-FR-007`, `122-FR-008`, `122-FR-009`, `122-FR-010`, `122-FR-011`, `122-FR-012` |
| **Related Feature/Spec** | Feature 122: Music Intent Understanding (`specs/120-ai-conversational-agent/122-music-intent-understanding/spec.md`) |
| **Status** | Draft |
| **Author** | Lê Công Minh Nhựt |
| **Reviewer** | TBD |

---

## 2. Description

The system processes natural language chat messages submitted by an authenticated listener to determine their underlying musical intent and extract actionable entity slots. The intent engine strips sensitive personal identifiers (PII), resolves contextual references against the active playback state, decomposes chained or compound instructions, and outputs a structured intent payload for real-time music execution or dialogue response.

---

## 3. Preconditions

- The listener is authenticated as a valid `Listener` (`ACT-02`) with an active session (`122-FR-009`).
- A non-empty text prompt has been dispatched through the Conversational Interface (`UC-120-001`).

---

## 4. Trigger

The Conversational Interface (`UC-120-001`) receives a user message and transmits it to the intent understanding pipeline.

---

## 5. Basic Flow

| Step | Actor / System | Action |
|:---:|:---:|---|
| 1 | **Actor** | Submits a natural language music request via the chat bar (e.g., *"tìm cho mình mấy bài chill để học bài"* or *"phát nhạc chill rồi giảm âm lượng"*). |
| 2 | **System** | Intercepts the raw message and strips sensitive personal data (email addresses, phone numbers, passwords) prior to external processing (`122-FR-008`). |
| 3 | **System** | Captures the active playback context snapshot (`currentTrack`, `isPlaying`, `volume`, `user`) to resolve situational references (`122-FR-004`). |
| 4 | **System** | Evaluates the input for compound clauses separated by commas, "rồi", or "sau đó" and decomposes chained requests into ordered clause plans (`122-FR-005`). |
| 5 | **System** | Classifies the intent of each clause into one of five supported categories: `play_music`, `search_music`, `query_music_info`, `manage_library`, or `general_chitchat` (`122-FR-002`). |
| 6 | **System** | Extracts domain entity slot parameters (song title, artist name, album, genre, mood, activity context, volume numeric percentage) (`122-FR-003`). |
| 7 | **System** | Generates a standardized structured intent payload containing `intent_type`, `confidence_score`, `completeness_status`, `extracted_entities`, and `suggested_action` (`122-FR-007`). |
| 8 | **System** | Dispatches actionable music operations to Real-Time Music Assistance (`UC-120-003`) and conversational responses to the terminal stream (`122-FR-012`). |
| 9 | **Actor** | Observes the assistant's structured execution and receives confirmation in the conversation thread. |

---

## 6. Alternative Flows

### AF-01 – Contextual Track Inquiry ("bài đang phát là gì?")
- **Starting Step:** Step 3 of the Basic Flow.
- **Condition:** The listener asks a question regarding the currently active track without naming a title (e.g., *"bài đang phát là bài gì?"*, *"ai hát bài này?"*).
1. **System:** Matches inquiry intent (`query_music_info`) and anchors the target to `context.currentTrack`.
2. **System:** Extracts the title and artist of the playing track and formats the response: *"Đang phát ‘[Title]’ của [Artist]."*
- **Outcome:** Resumes at Step 8 of the Basic Flow.

### AF-02 – Vague or Incomplete Playback Command ("bật nhạc đi")
- **Starting Step:** Step 5 of the Basic Flow.
- **Condition:** The listener submits an actionable intent lacking explicit target slots (e.g., *"bật nhạc lên"*, *"muốn nghe nhạc"*).
1. **System:** Activates smart heuristic defaults (`122-FR-005`), inferring top trending songs or user personalized recommendations.
2. **System:** Generates a `play_playlist` directive with the default playlist identifier without blocking on clarification questions.
- **Outcome:** Resumes at Step 7 of the Basic Flow.

### AF-03 – General Out-of-Scope Conversation (Chit-Chat)
- **Starting Step:** Step 5 of the Basic Flow.
- **Condition:** The listener enters a general greeting or non-music conversation (e.g., *"chào bạn"*, *"hôm nay thời tiết thế nào?"*).
1. **System:** Classifies the intent as `general_chitchat` (`122-FR-002`).
2. **System:** Generates a friendly conversational response and suggests music exploration commands without triggering any music player mutations (`SC-004`).
- **Outcome:** Resumes at Step 8 of the Basic Flow.

---

## 7. Exception Flows

### EF-01 – External AI Service Timeout / Fallback to Rule Matcher
- **Starting Step:** Step 5 of the Basic Flow.
- **Condition:** External NLP parsing times out ($> 1,200$ms) or is unreachable (`122-FR-010`).
1. **System:** Activates the local rule-based regex fallback parser (`planClause` in `agentService.js`).
2. **System:** Evaluates local patterns for supported commands (playback toggle, volume adjustment, queue addition, navigation).
3. **System:** If matched, proceeds with tool execution; if unmatched, returns an unrecognized message without crashing or interrupting playback (`122-FR-011`).
- **Outcome:** Resumes at Step 8 of the Basic Flow in fallback mode.

---

## 8. Postconditions

### Success Postconditions
- The message is correctly categorized into a valid intent category.
- Musical entities are extracted into structured slot key-values.
- Personal data (PII) is completely excluded from external AI service requests.

### Failure Postconditions
- The system returns an unrecognized message or falls back to rule matching; active audio streaming remains undisturbed.

---

## 9. Special Requirements

- **Performance**: Intent analysis must produce a structured result within 1,200ms under standard conditions (`SC-002`).
- **Privacy & Legal Compliance**: 100% of sensitive PII (emails, phone numbers, passwords) must be scrubbed before external AI submission, adhering strictly to Vietnamese Decree 13/2023/ND-CP (`122-FR-008`).
- **Bilingual Support**: Recognizes mixed Vietnamese and English song and artist requests (`122-FR-003`).

---

## 10. UI References

- **Implementation File**: `src/frontend/src/utils/agentService.js` (intent planner & SSE generator)
- **Related Screenshots**:
  - `prototypes/UC-120-002-basic-flow-quick-prompts.png` (Quick suggestion prompt bar)
  - `prototypes/UC-120-002-basic-flow-natural-language.png` (Natural language prompt entry)
  - `prototypes/UC-120-002-basic-flow-intent-response.png` (Intent understanding response)
  - `prototypes/UC-120-002-track-inquiry.png` (Active track question and answer)
  - `prototypes/UC-120-002-playlist-recommendation.png` (Thematic playlist recommendation result)

---

## 11. Traceability

- **Functional Requirements**: `122-FR-001` through `122-FR-012`
- **Spec Kit Specification**: `specs/120-ai-conversational-agent/122-music-intent-understanding/spec.md` (User Stories 1, 2, 3, 4, 5)
- **Downstream Inclusion**: `UC-120-003` (Execute Music Actions via Conversational Agent)
