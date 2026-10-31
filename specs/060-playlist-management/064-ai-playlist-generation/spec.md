# Feature Specification: 064 - AI Playlist Generation (Tạo Playlist bằng Trí tuệ Nhân tạo)

> [!NOTE]
> **Contextual Note**: This specification was reconstructed and formalized based on AuraTune project requirements (Proposal, Vision Document, System Architecture, API Contract) and the existing frontend implementation in `src/frontend/src/pages/AIPlaylist/AIPlaylistPage.jsx` and `src/frontend/src/utils/aiMockData.js`.

---

## 1. Overview & Objective

The **AI Playlist Generation** feature leverages natural language understanding to generate tailored music playlists from a single sentence describing a mood, activity, or occasion:
1. **Natural Language Prompt Input**: A conversational interface allowing users to type freeform descriptions or choose from curated mood prompts (e.g., *"Nhạc nhẹ nhàng để học bài buổi tối"*).
2. **AI Recommendation Engine**: Analyzes prompt semantics and recommends relevant songs matching the intended mood.
3. **Interactive Review**: Displays editable playlist title, generation rationale, and proposed tracklist where users can preview, remove, or reorder tracks.
4. **Save to Library**: Saves the refined playlist directly into the user's personal collection.

---

## 2. User Stories & Acceptance Criteria

### User Story 1: Access AI Playlist Interface
- **As a** logged-in listener,
- **I want to** access the AI Playlist creation page,
- **So that** I can describe the music vibe I want using plain text.

**Acceptance Criteria:**
- Navigating to `/ai-playlist` (or clicking the "AI Playlist" button in Library) opens the dedicated AI generation screen.
- The interface features prompt input textarea and quick example chips for instant selection.

### User Story 2: Generate and Review Playlist Proposal
- **As a** listener,
- **I want to** submit a mood description and review the AI-curated playlist,
- **So that** I can customize the selection before saving.

**Acceptance Criteria:**
- Clicking "Đề xuất playlist" triggers the generation process with an animated loading spinner.
- The results section renders an editable title, reason explanation, and song table of proposed tracks.
- Listeners can preview playback with "Nghe thử" or request alternative suggestions with "Đề xuất khác".

### User Story 3: Save AI Playlist to Library
- **As a** listener,
- **I want to** save the approved AI playlist,
- **So that** I can access and play it anytime from my library.

**Acceptance Criteria:**
- Clicking "Lưu playlist" persists the playlist in the user's library with the AI description attribution.
- Toast confirms `"Đã lưu playlist AI vào thư viện."` and redirects the user to the newly created playlist detail page.

---

## 3. Frontend Component Mapping

- **AI Playlist Page**: [`AIPlaylistPage.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/pages/AIPlaylist/AIPlaylistPage.jsx)
- **AI Recommendation Utilities**: [`aiMockData.js`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/utils/aiMockData.js) (`getMockRecommendations`)
- **State Store**: [`AppStore.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/context/AppStore.jsx) (`createPlaylist`, `aiAvailable`)

---

## 4. UI Screenshots

### 1. AI Playlist Entry Point

**Related workflow:** Workflow A - Access AI playlist generation.

![AI Playlist Entry](./ui/01-ai-playlist-entry.png)

Shows the dedicated AI Playlist generation page with header, textarea prompt input, quick mood example chips, and submit button.

---

### 2. Enter Generation Input

**Related workflow:** Workflow B - Enter generation input.

![AI Playlist Input](./ui/02-ai-playlist-input.png)

Shows the interface populated with the selected mood prompt (*"Nhạc nhẹ nhàng để học bài buổi tối"*), ready for submission with the active "Đề xuất playlist" button.

---

### 3. View Generated Results

**Related workflow:** Workflow C - View AI-generated playlist results.

![AI Playlist Results](./ui/03-ai-playlist-results.png)

Shows the AI recommendation result: editable playlist title, explanation rationale, proposed tracklist with preview controls, and "Lưu playlist" button.

---

### 4. Saved AI Playlist Details

**Related workflow:** Workflow D - Save generated playlist to library.

![AI Playlist Details](./ui/04-ai-playlist-details.png)

Shows the newly created playlist detail page after saving, displaying the AI attribution in the description (*"Tạo bởi AI từ mô tả: “Nhạc nhẹ nhàng để học bài buổi tối”"*), hero cover, and saved tracklist.
