# PA4 Section E — Two Additional Functional Groups (D-27)

Prepared by: Nguyễn Thanh Huy | Reviewed by: Pending team review | Branch: `pa4_E`

This document records which groups AuraTune submits for PA4 Section E, how each one goes from the UI through the API to the Supabase database, which tests cover it, and which acceptance runs are still open. Rows marked **Pending** have not been run and are not claimed as done.

## 1. Selected groups and owners

| Group | Owner | Scope delivered for PA4 |
| --- | --- | --- |
| 040 Music Player (041–045) | Nguyễn Thanh Huy | Streaming with HTTP Range, playback controls, progress and volume, shuffle/repeat, synchronized lyrics, persistent bottom player, and play events stored in Supabase |
| 060 Playlist Management (061–065) | Mai Đăng Khoa | Playlist CRUD and bookmarks, song management and likes, playlist playback, AI playlist generation, collaborative playlists — all stored in Supabase |

Group 120 (Conversational Agent) was the PA3 group and is not counted here.

## 2. UI → API → database

### 040 Music Player

| Step | UI | API | Database |
| --- | --- | --- | --- |
| Play a catalog song | Search → song row → Play (`SearchPage`, `useAudioPlayer`) | `GET /api/v1/songs/:id/stream` → 302 to the Cloudinary `audio_url` (Range supported by Cloudinary) | `songs` joined to `albums` and `artists` (`songRepository.findSongById`) |
| Count a play | Player reaches 30 s or half the track (`playCounted`) → `AppStore.recordPlay` | `POST /api/v1/users/me/history` | Insert into `listening_history` |
| Update listened time | Track change, pause or page hide → `AppStore.updateListened` | `PATCH /api/v1/users/me/history/:id` | Update `duration_listened` (only increases) |
| Read back | History page, Home "recently played", Recommendations | `GET /api/v1/users/me/history` | Select from `listening_history` + song metadata |
| Clear | History → Xóa lịch sử | `DELETE /api/v1/users/me/history` | Delete the user's rows |

Code: `src/backend/routes/historyRoutes.js`, `controllers/historyController.js`, `repositories/listeningHistoryRepository.js`, `repositories/songRepository.js`, `src/frontend/src/services/historyApi.js`, `context/AppStore.jsx`, `App.jsx`. Contract: `specs/040-music-player/contracts/history-api.md`. Migration: `src/database/migrations/007_listening_history.sql`.

### 060 Playlist Management

| Step | UI | API | Database |
| --- | --- | --- | --- |
| Create / edit / delete | Library → Tạo playlist (`PlaylistFormDialog`, shows "Đang lưu…" while saving), playlist detail → edit / delete | `POST/PUT/DELETE /api/v1/playlists[/:id]` | `playlists`; delete first clears `playlist_bookmarks`, `playlist_shared_users`, `playlist_songs` |
| Library read | Library page (loading, error with retry, empty CTA) | `GET /api/v1/users/me/playlists` | `playlists`, `playlist_shared_users`, `playlist_bookmarks` |
| Add songs | Playlist detail → Thêm bài hát; in a backend session the picker searches the Supabase catalog | `GET /api/v1/search?type=tracks`, then `POST /api/v1/playlists/:id/songs` | `songs` (search); `playlist_songs` with `sort_order`, `added_by_user_id`, `added_at` |
| Remove / reorder | Song table: drag handle, arrow keys on the handle, row menu | `DELETE /api/v1/playlists/:id/songs/:songId`, `PUT …/songs/order` | `playlist_songs`, `reorder_playlist_songs()` |
| Like | Heart on a song | `PUT/DELETE /api/v1/songs/:songId/like` | `user_liked_songs` |
| Play a playlist | Playlist detail → Play / Shuffle | `GET /api/v1/songs/:id/stream` per track | Order from `playlist_songs.sort_order` |
| AI playlist | AI Playlist page → prompt → proposal (rename, remove, reorder, preview, "Đề xuất khác") → Lưu playlist | `POST /api/v1/playlists/ai-generate` → AI service `POST /ai/playlist/generate` → Gemini (`gemini-3.1-flash-lite`) | Catalog read from `songs`; proposal ids hydrated from `songs`; saving uses `playlists` + `playlist_songs` |
| Collaborate | Playlist detail → collaboration, invite by email | `PUT …/collaboration`, `POST/DELETE …/collaborators` | `playlists.is_collaborative`, `playlist_shared_users`, `set_playlist_collaboration()` |

Code: `src/backend/routes/playlistRoutes.js`, `controllers/playlistController.js`, `services/playlistService.js`, `services/aiPlaylistService.js`, `repositories/playlistRepository.js`, `src/frontend/src/services/playlistApi.js`, `context/AppStore.jsx`, `pages/PlaylistDetail/PlaylistDetailPage.jsx`, `pages/Library/LibraryPage.jsx`. Migration: `src/database/migrations/008_playlist_schema_alignment.sql` (applied to the shared project on 2026-11-22). Migration 003 assumed a different schema and is superseded for the shared project.

## 3. Integration fixes made for PA4

| Defect | Fix |
| --- | --- |
| `server.js` imported `mediaRoutes` twice, so the backend did not start | Removed the duplicate import |
| Artist, user and studio routers were mounted after the 404 handler and after `listen` | Mounted them with the other API routes, before the 404 and error handlers |
| `config/cloudinary.js` threw at import when Cloudinary variables were missing, blocking startup | The SDK is configured on first use; only uploads fail, with 503 |
| Play events were stored only in browser `localStorage` | Stored in Supabase through the history API (above) |
| AI playlist results returned raw rows and failed on non-numeric ids | `aiPlaylistService.normalizeAiPlaylistResponse` hydrates ids from the catalog, filters unavailable songs and returns 10–20 tracks |
| The shared Supabase project follows the team ER design (`playlist_id`, `name`, `history_id`, `duration_listened`, bigint `song_id`), but the playlist code and migration 003 assumed text `id`/`title` columns, so every playlist API returned 500 | `playlistRepository` and `listeningHistoryRepository` now use the real columns; migration 008 only adds the missing playlist columns, `playlist_bookmarks` and the reorder/collaboration functions; migration 007 was rewritten to the ER design |
| The team schema declares the foreign keys to `playlists` without `ON DELETE`, so deleting a playlist that had songs returned 500 (Postgres 23503) and kept the playlist | `playlistRepository.delete` removes bookmarks, members and songs first, then the playlist (`tests/playlistRepository.test.js`) |
| Backend CORS allowed `GET, POST, PUT, DELETE` only, so the browser blocked `PATCH /users/me/history/:id` | Added `PATCH` to the allowed methods in `server.js` |
| Metadata search embedded `artists` directly on `songs`, a relation that does not exist, so Search returned 500 on the shared database | `searchRepository` reads the artist through `albums`, as `mapTrack` already expected |
| `HistoryPage` returned the login screen before calling all hooks; after a reload the restored session changed the hook order and crashed the page | The login guard now runs after every hook |
| The Library page crashed (blank screen) because `AppStore` did not export `followingList`, which the page reads (also on `main`) | `followingList` is part of the store value |
| The playlist "Thêm bài hát" picker listed only the demo tracks (`t1`…), which a backend playlist rejects with 422 | In a backend session the picker searches the Supabase catalog (`GET /api/v1/search?type=tracks`) and lists catalog songs the user has already seen |
| The "Ngày thêm" column and "Thêm bởi" line were empty for database songs | Filled from `playlist_songs.added_at` and the contributor returned by the API |
| After a drag or arrow-key reorder the table kept the old order until the server answered | The optimistic update now reorders the rendered songs too; the server order then replaces it |
| The AI service's `POST /ai/playlist/generate` never called Gemini: it matched prompt keywords and returned the demo ids `t1`…`t10`, which a backend playlist rejects (422) | New `src/ai-service/playlist_generator.py`: Gemini (structured JSON output) picks 10–20 songs from the playable Supabase catalog; only catalog ids are kept, in Gemini's order; fewer than 10 is a no-match with a reason; no key, a Gemini error, a 15 s Gemini timeout or a catalog error answers 503 so the app shows its fallback. `gemini-2.5-flash` answers 404 for new API keys, so playlist generation uses `GEMINI_PLAYLIST_MODEL` (default `gemini-3.1-flash-lite`, then `gemini-flash-lite-latest`). The backend gives this call its own timeout (`AI_PLAYLIST_TIMEOUT_MS`, default 20 s); the AI service also reads `src/.env`. The AI Playlist page shows Gemini's no-match reason and remembers the proposed songs |
| `GET /api/v1/playlists/:id` ran without reading the token, so the owner of a private playlist got 404 whenever the page fetched it directly (for example right after saving an AI playlist) | The route reads the token when one is sent (owner and collaborators see private playlists; no token → public only; invalid token → 401) |

## 4. Automated tests

| Command | Result on `pa4_E` |
| --- | --- |
| `cd src/backend && npm test` | 256 tests: 251 pass, 0 fail, 5 skipped (2026-11-22, AI service not running). With the AI service running on port 8000, two Group 100 quickstart tests that expect it to be down (`moodQuickstartScenarios` and `recommendationQuickstartScenarios`, Scenario 3) fail; they pass again with `AI_SERVICE_URL` pointing at an unused port |
| `cd src/ai-service && python -m pytest tests` | 24 / 24 pass (Python 3.14 venv with `requirements.txt` minus the optional sentence-transformers/chromadb, plus pytest) |
| `node --test tests/listeningHistory.test.js tests/aiPlaylistService.test.js tests/songStream.test.js tests/playlistRepository.test.js` | 37 / 37 pass |
| `cd src/frontend && npm test` | 101 tests: 89 pass, 12 fail. All 12 failures are existing component tests whose imports reach `src/config/firebase.js`, which reads `import.meta.env.VITE_FIREBASE_API_KEY` (undefined under Node). This branch does not change that file or its importers' Firebase usage |
| `cd src/frontend && npx vite build` | Builds successfully |

New generated tests for this section:
- `src/backend/tests/listeningHistory.test.js`: authentication, validation, ownership, increase-only listened time, newest-first read-back, 503 on storage failure, real-schema mapping.
- `src/backend/tests/aiPlaylistService.test.js`: AI order, de-duplication, availability filter, 10–20 bound, no-match.
- `src/backend/tests/playlistRepository.test.js`: delete order on a schema without `ON DELETE`, stop on a failed dependent delete, missing storage, row mapping, catalog id check.
- `src/ai-service/tests/test_playlist_generator.py`: playable-catalog filter, prompt content, catalog-only ids in Gemini order, 20-track cap, no-match below 10, invalid model output, Gemini/catalog failures as 503, 15 s model timeout, next model tried after a failure, internal-secret check, missing key, prompt length, structured-output request, playlist model setting.

## 5. Live verification against Supabase

Setup: `src/.env` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; migrations 007 and 008 applied in the Supabase SQL editor; catalog seeded with `node src/backend/scripts/seedMusicCatalog.js --apply` (17 CC0 songs: HoliznaCC0 "Lo-fi And Chill", John Bartmann soundtrack, Soft and Furious soul/R&B; a re-run on 2026-11-22 found all 17 already present). All runs on 2026-11-22 with the test account `pa4e.test.481876@example.com`.

| # | Scenario | Expected | Result |
| --- | --- | --- | --- |
| L1 | Register/log in with a backend account | Session from `/api/v1/auth/login` | **Pass**: test account registered (201) and logged in through the UI |
| L2 | Play a seeded catalog song for 30 s | `POST /users/me/history → 201`; new `listening_history` row | **Pass**: Search "Morning" → play "Morning Coffee" (song 3, Cloudinary audio). At 30 s the UI sent `POST → 201`; pausing sent `PATCH /users/me/history/2 → 200`. Supabase row `history_id 2, song_id 3, duration_listened 64`. API check: `PATCH` never lowers the value, demo id `t8` → 422, no token → 401 |
| L3 | Restart the backend, reload the browser, log in | History shows the entry from `GET /users/me/history` | **Pass**: History lists "Morning Coffee" (1 min) and "Glad To Be Stuck Inside" (2 min) from Supabase; the bottom player restores "Morning Coffee" paused at 1:04. Screenshot: `docs/test/pa4-e-evidence/040-history-readback.jpg` |
| L4 | Create a playlist, add catalog songs, reorder | Rows in `playlists` and `playlist_songs` in the new order | **Pass**. API: create → 201 (playlist 1); add `[3,1,2]` → 200 with catalog metadata; duplicate add is ignored; demo id `t1` → 422 `SONG_NOT_IN_CATALOG`; reorder `[2,3,1]` → 200; an order missing a song → 400; title empty or 81 characters → 400. UI: Library → Tạo playlist → "PA4 E — Tạo từ giao diện" (button shows "Đang lưu…", `POST → 201`, opens `/playlist/2`); Thêm bài hát → search "Vintage" → Thêm (`POST /playlists/1/songs → 200`); arrow keys on the drag handle → `PUT /playlists/1/songs/order → 200`. Supabase `playlist_songs` for playlist 1: `0:2, 1:3, 2:1, 3:8`, each `added_by_user_id` = test user |
| L5 | Restart the backend, reload | Library and playlist detail show the same playlists and order | **Pass**: Library lists both playlists; playlist 1 shows Glad To Be Stuck Inside, Morning Coffee, Everything You Ever Dreamed., Vintage (the Supabase order), each "Hôm nay" and "Thêm bởi PA4 E Test". Play starts "Glad To Be Stuck Inside"; Next plays "Morning Coffee". Screenshots: `060-library-readback.jpg`, `060-playlist-detail-readback.jpg` |
| L6 | Delete a playlist that has songs | `DELETE → 200`; playlist and its `playlist_songs` rows removed | **Pass after fix**: first run → 500 (23503), playlist kept. After the repository fix, `DELETE /playlists/3 → 200`; Supabase has no `playlists` or `playlist_songs` rows for id 3 |
| L7 | Likes, bookmark, collaboration | Rows in `user_liked_songs`, `playlist_bookmarks`; status follows collaboration | **Pass (one account)**: like 3 and 5, unlike 5 → `["3"]`; like `t1` → 404. Collaboration on → playlist becomes Public and `GET` without a token → 200; invite of an unknown email → 404; bookmark → saved; collaboration off → Private. Private playlist `GET` without a token → 404; `PUT` without a token → 401. Not run: a second account accepting an invite and editing |
| L8 | Generate an AI playlist with the AI service running | 10–20 catalog tracks with a reason; save creates a private playlist | **Pass** (Gemini `gemini-3.1-flash-lite`). AI Playlist → "Lofi chill khi trời mưa" → `POST /playlists/ai-generate → 200`: "Giai điệu Lofi cho ngày mưa", 13 catalog tracks (the 8 lo-fi songs first) with a Vietnamese reason (`064-ai-proposal.jpg`). Nghe thử played the first track; "Đề xuất khác" → 200, a new 10-track proposal; removed "So What", moved "Home At Last" up, renamed to "Mưa và Lofi — AI"; Lưu playlist → `POST /playlists → 201` (playlist 4), `POST /playlists/4/songs → 200`. Supabase: playlist 4 Private, description "Tạo bởi AI từ mô tả: “Lofi chill khi trời mưa”", songs `1,2,3,4,5,6,7,12,8` (edited order). After a backend restart the playlist page shows the same 9 songs (`064-ai-playlist-readback.jpg`); `GET /playlists/4` → 200 with the owner's token, 404 without, 401 with an invalid token. Signed out, the page asks to log in. Fallback: without a key → 503 → "AI Playlist tạm thời không khả dụng…" with "Tạo thủ công" (`064-ai-unavailable-fallback.jpg`). Heavy metal (not in the catalog): Gemini usually proposes the closest energetic songs and says the genre is missing; once it returned no match |

Also verified live without signing in: `GET /api/v1/songs/2` returns "Glad To Be Stuck Inside" by HoliznaCC0 (album "Lo-fi And Chill") from Supabase, `GET /api/v1/songs/2/stream` redirects (302) to Cloudinary, and Cloudinary answers a `Range` request with 206.

Observations for other groups:
- Group 010: after some reloads (including one right after a backend restart) both parallel `POST /auth/refresh` calls returned 401 "Phiên đăng nhập không hợp lệ hoặc đã bị thu hồi" and the user had to log in again; on other reloads both returned 200. Sessions are stored in `user_sessions`, so a restart alone should not cause this; the refresh-token rotation with two parallel calls needs a look.
- Group 100 (Feature 101): `historyRepository.findListeningAnalysis` selects `id` and `listened_duration`, which do not exist on the shared `listening_history` table, so the Stats tab falls back to in-memory demo data.
- Group 100 tests: `moodQuickstartScenarios` and `recommendationQuickstartScenarios` (Scenario 3) expect nothing to answer on port 8000, so they fail whenever the AI service is running locally.
- Group 120 (AI Host chat): the AI service default `GEMINI_MODEL` is `gemini-2.5-flash`, which answers 404 for new API keys, so the chat falls back to its local rules until the model is updated.

## 6. Task reconciliation

| Feature | Closed in this section | Still open (needs execution evidence) |
| --- | --- | --- |
| 040 | T036, T037, T038; quickstart rows 13–14 executed live (L1–L3) | T031 (lyrics API, blocked on lyric columns); T039 (row 15, clearing history, not yet run) |
| 061 | T010 | T004: columns, default cover and aggregates checked on the live database (see `061-playlist-crud/research.md`); the `ON DELETE` rule of the original foreign keys still needs reading in the SQL editor. T023: create, validation, visibility, owner authorization, bookmark and deletion ran (L4–L7); the network-failure scenario did not |
| 062 | — | T023: duplicate, like/unlike, add, reorder and aggregates ran (L4, L5, L7); remove, permission, concurrency and failure scenarios did not |
| 063 | — | T020: ordered play and next ran (L5); shuffle, selected track, append, empty, unavailable and transition scenarios did not |
| 064 | T010 | T004: findings recorded in `064-ai-playlist-generation/research.md`; restriction fields and model choice still need the AI/recommendation owner. T029: authentication, 10–20 results, availability filtering (catalog filter + backend hydration), edit/preview/regenerate, private save, no-match and service fallback ran (L8); the session-expiry scenario did not |
| 065 | — | T026: owner enable/disable, public visitor and unknown-email invite ran (L7); collaborator, revoke, contribution and concurrent-edit scenarios need a second account |

## 7. Narrated demo

YouTube URL (Public or Unlisted): **to be added after recording**.

Suggested script (about 7 minutes):

1. Start the backend and frontend; show `GET /api/health` and the Supabase project (tables `listening_history`, `playlists`, `playlist_songs`).
2. Log in with a backend account.
3. **040**: search "Morning", play "Morning Coffee", seek, open lyrics, toggle shuffle/repeat, next/previous. Keep playing past 30 s and show `POST /users/me/history → 201` in DevTools and the new row in the Supabase table editor; pause and show `duration_listened` updated.
4. Restart the backend, reload, log in, open History: the entries are read back from the database; the bottom player restores the paused track.
5. **060**: Library → Tạo playlist; on the playlist page, Thêm bài hát → search catalog songs → add three; reorder with the drag handle; like a song. Show the `playlists` and `playlist_songs` rows (`sort_order`, `added_by_user_id`).
6. Restart the backend and reload: the playlist, its order and "Ngày thêm" are unchanged. Play the playlist and press Next.
7. Enable collaboration (playlist becomes public) and, if a second account is ready, invite it and show the shared playlist from that account. Delete a playlist that has songs and show its rows are gone.
8. Start the AI service (`GEMINI_API_KEY` in `src/.env`): AI Playlist → "Lofi chill khi trời mưa" → read the reason, preview, remove/reorder, rename, save; show the new private playlist and its `playlist_songs` rows. Stop the AI service and generate again to show the fallback with "Tạo thủ công".
