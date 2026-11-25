# Evidence: Group 040 Music Player, iteration 2 (lyrics API and Feature 046)

Owner: Nguyễn Thanh Huy. Branch: `feature/040-music-player-implement`. Date: 2026-11-25.

Scope: T031 (lyrics from the backend) and Feature 046 (sharing and comments). Plan, contracts and tasks: [`specs/040-music-player/`](../../specs/040-music-player/plan.md#iteration-2-lyrics-api-and-feature-046).

## Setup

- Backend `src/backend/server.js` on port 5000 and frontend on port 5173, with the team Supabase project in `src/.env`.
- Migration `src/database/migrations/009_song_comments.sql` applied in the Supabase SQL Editor on 2026-11-25.
- Test account `pa4e.test.481876@example.com` (display name "PA4 E Test"). Catalog song 2, "Glad To Be Stuck Inside" (HoliznaCC0).

## Automated tests

| Command | Result |
| --- | --- |
| `cd src/backend && npm test` | 285 tests: 280 pass, 0 fail, 5 skipped. New: `songComments.test.js` (19), `songLyrics.test.js` (10) |
| `cd src/frontend && npm test` | 128 tests: 116 pass, 12 fail. The 12 failures are files that import `src/config/firebase.js`, which reads `import.meta.env` and fails under Node; the same 12 fail on `main` without this change. New and passing: `share.test.js` (11), `relativeTime.test.js` (1), `commentApi.test.js` (8), `PlayerPanels.test.jsx` (7) |
| `npx vite build` (frontend) | Builds |

Before `npm install` in `src/backend`, 29 backend tests failed on `main` and on this branch alike because `@electric-sql/pglite` (a dev dependency added on `main`) was not installed locally.

## Live runs

| # | Quickstart row | Steps | Result |
| --- | --- | --- | --- |
| E1 | 16 | Guest: search "Glad", play, open the full player on Lời bài hát | **Pass**. `GET /api/v1/songs/2/lyrics → 200` (`has_lyrics: false`); "Bài hát này chưa có lời." and music keeps playing (`044-catalog-song-no-lyrics.jpg`). None of the 17 catalog songs has lyrics, so synced and plain catalog lyrics were checked by the automated tests only |
| E2 | 22 | Before migration 009: open Bình luận | **Pass**. `GET /songs/2/comments → 503 comments_unavailable`; "Bình luận tạm thời không khả dụng." with Thử lại and the sign-in prompt (`046-comments-unavailable-before-migration.jpg`) |
| E3 | 17 | Share from the full player | The desktop app's browser refuses the Clipboard API ("Write permission denied"), so the first run showed the failure message. Fixed by adding the text-field copy fallback |
| E4 | 17 | Share from the track menu "Chia sẻ" | **Pass**. "Đã sao chép liên kết vào bộ nhớ tạm." (`046-share-link-copied.jpg`). The first link, `/album/1?track=2`, opened "Album details unavailable" because the backend has no `GET /api/v1/albums/:id` (Group 080). After the change the copied link is `/search?q=Glad%20To%20Be%20Stuck%20Inside`, which lists the song (`046-share-link-opens-search.jpg`) |
| E5 | 18 | After migration 009, guest opens Bình luận | **Pass**. `GET → 200` with `[]`; empty state and "Đăng nhập để bình luận." instead of the input (`046-comments-guest-empty.jpg`) |
| E6 | 19 | Sign in, post "Test 046: giai điệu lofi rất hợp để học bài 🎧" | **Pass**. `POST /api/v1/songs/2/comments → 201`; shown first as "PA4 E Test · Vừa xong" (`046-comment-posted.jpg`). Supabase `song_comments`: `comment_id 1`, `song_id 2`, author "PA4 E Test", same content |
| E7 | 19 | Restart the backend, reload the page, open Bình luận | **Pass**. The comment is still listed, with the delete action for its author (`046-comment-readback-after-restart.jpg`) |
| E8 | 20 | Other viewers | **Partly run**. As a guest, `GET` returns the comment with `can_delete: false`; `DELETE /api/v1/comments/1` without a token → 401; `GET` with an invalid token → 401. A second account to see 403 was not used; 403 for another user and admin deletion are covered by `songComments.test.js` |
| E9 | 21 | Author deletes the comment | **Pass**. `DELETE /api/v1/comments/1 → 200`; the empty state returns (`046-comment-deleted.jpg`); Supabase `song_comments` has 0 rows |

Not run: quickstart row 15 (T039, clearing the test account's listening history), which needs the owner's agreement because it deletes that account's history rows on the shared project.

## Observations for other groups

- Group 080: the album page requests `GET /api/v1/albums/:id`, which the backend does not serve, so every album page shows "Album details unavailable". Group 040 share links use a search until it exists (`ALBUM_SHARE_LINKS` in `src/frontend/src/utils/share.js`).
- Frontend tests: 12 test files fail under Node because `src/config/firebase.js` reads `import.meta.env` at import time.
