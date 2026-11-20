# Validation and literal timing cases (093 T009)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

[Source ledger](./source-and-scope-ledger.md) maps FR-001–010, SC-001–003, all six stories and every original acceptance scenario. The following preserves every original case for future execution:

| Original story/scenario | Expected oracle |
| --- | --- |
| User Story 1 / 1 | **Given** an authenticated artist account, **When** they navigate to `/studio`, **Then** the page displays the artist studio header, artist name, public profile link, and statistics cards (Bài hát, Đang công khai, Tổng lượt nghe). |
| User Story 1 / 2 | **Given** an artist with released tracks, **When** the studio table renders, **Then** each row displays cover art, track title, album name, audio filename (if uploaded), genre name, play count, status badge ("Công khai" or "Đang ẩn"), and action controls. |
| User Story 1 / 3 | **Given** an artist with no released tracks, **When** the catalog renders, **Then** a clean empty state is displayed prompting the artist to upload their first track. |
| User Story 2 / 1 | **Given** the Studio page, **When** the artist clicks "Tải bài hát lên", **Then** a modal opens with audio file picker, track title input, album input, genre dropdown, and duration input. |
| User Story 2 / 2 | **Given** valid inputs (title, duration in `m:ss` format, and selected audio file), **When** submitted, **Then** the track is added with "active" status, a success toast notification appears, and the track appears in the table. |
| User Story 2 / 3 | **Given** missing required fields or invalid duration format, **When** submitted, **Then** the modal highlights the validation error without closing. |
| User Story 3 / 1 | **Given** an uploaded track in the table, **When** the artist clicks the edit (Pencil) button, **Then** the edit dialog opens pre-populated with current title, album, genre, and duration. |
| User Story 3 / 2 | **Given** valid updated fields, **When** the artist clicks "Lưu", **Then** the track record is updated, a toast notification confirms the change, and the table reflects the new values. |
| User Story 4 / 1 | **Given** an active track ("Công khai"), **When** the artist clicks the hide button (EyeOff icon), **Then** the status transitions to "hidden" ("Đang ẩn"), status badge updates to amber, and a toast confirms `Đã ẩn “<Tiêu đề>”.`. |
| User Story 4 / 2 | **Given** a hidden track ("Đang ẩn"), **When** the artist clicks the unhide button (Eye icon), **Then** the status transitions to "active" ("Công khai"), status badge updates to green, and a toast confirms `“<Tiêu đề>” đã công khai trở lại.`. |
| User Story 5 / 1 | **Given** a track in the studio table, **When** the artist clicks the delete button (Trash icon), **Then** a confirmation modal displays the track title and warning that the track cannot be restored. |
| User Story 5 / 2 | **Given** the confirmation modal, **When** the artist clicks "Hủy", **Then** the modal closes without modifying the catalog. |
| User Story 5 / 3 | **Given** the confirmation modal, **When** the artist clicks "Xóa", **Then** the track is removed from Studio, a confirmation toast displays, and the statistics cards update. |
| User Story 6 / 1 | **Given** an unauthenticated visitor navigating to `/studio`, **Then** the system presents the `LoginRequired` component prompting login with an artist account. |
| User Story 6 / 2 | **Given** an authenticated user with role `user` (e.g. `demo@auratune.vn`) navigating to `/studio`, **Then** the system presents a `Forbidden` notice explaining that only artist accounts may access Studio. |

## V01–V16 case matrix

| ID | Procedure / required outcome | Traceability |
| --- | --- | --- |
| V01 — Studio access/ownership | Guest login prompt; User/Admin forbidden in Studio; linked non-banned Artist reads own catalog/metrics only. Direct API role/ID tampering cannot expose/edit B data or assign ownership. Unlinked Artist does not auto-provision. Existing Admin mutation capability stays separate. | FR-001/003; US1/6; SC-001 |
| V02 — Complete catalog/statistics | Own name/profile link, every manageable track and required display metadata, active/hidden states, total/active/plays; no silent backend row cap. Empty has upload prompt. Missing stats distinguish unavailable from zero; partial catalog/stat failure preserves successful portions and labels stale data not updated. | FR-002/003; US1; G090-D06/D14 |
| V03 — Real upload/publication | Submit actual permitted MP3 + required metadata/declarations; verify bytes persist and stable playable association exists in backend store, own row committed, active publication without Admin approval, confirmed toast. Reload/relogin still has track/media. No filename-only success. | FR-004/009/010; US2; checklist immediate-publication decision |
| V04 — Metadata/duration | Missing/invalid input shows correction without closing open form. Exact duration regex accepts/rejects accordingly; entered duration not claimed measured. Edit prepopulates and saves only title/album/genre/duration; blank album clears approved mapping; canonical genre only; 200 vs 201 code-point edit cases. Owner/media/plays/restriction remain unchanged. | FR-004/005/006; US2/3; G090-D04/D15/D16 |
| V05 — Binary policy | With S04 source alignment recorded, MP3 type/content checks and ≤50MiB inclusive boundary; extension/MIME spoof/truncated/invalid file has no upload-success/partial public row. Old MP3/WAV/`audio/*` UI cannot broaden accepted format. | FR-010; recorded G090-D01; S06 |
| V06 — Rights | Declaration starts unchecked each new upload; missing declaration blocks before audio/save. Self-owned versus Licensed/Open conditional source/permission and attribution rules enforced on server. No proof-upload/legal-verification claim or unsupported blanket license. | Project Plan PC-04/ED-06, Vision rights confirmation; recorded G090-D02/03 |
| V07 — No replacement/escalation | Edit has no audio replacement; unexpected audio/owner/play/Admin fields do not mutate them. Do not create albums/genres, lyrics/release-date editor, approval workflow or profile/follow controls. | FR-006 scope; edit mockup; Group README deferred scope |
| V08 — Hide/restore | Hide retains Studio membership, media and historical plays, reduces effective active count; new public search/browse/091 featured rows omit track without hidden count. Restore only Artist preference; no public-again claim if Admin restriction applies; no deleted restoration. | FR-007/009; US4; SC-003; G090-D05/D06 |
| V09 — Delete confirmation/lifecycle | Cancel sends no request; confirmed delete rechecks own authority, removes Studio/public distribution and updates counts, truthful toast. No restore through stale edit/restore. Historical plays retained under recorded D06; physical cleanup/FK behavior matches reviewed S09 rather than guessed cascade. | FR-002/008/009; US5; G090-D06 |
| V10 — Streaming/access | After successful hide/delete, new player/playlist/queue/direct-URL starts/repeat denied, queue skips unavailable; already-started playback may finish. Test known media URL, range 206 and CDN/cache cases under S08. A hidden catalog row alone is insufficient. | FR-007/010, public-distribution outcome; G090-D07 |
| V11 — Upload consistency/retry | Exercise fault matrix below; no partial public row, false success, duplicate same-submission track or unsafe cleanup of committed/other-owned media. Lost response reconciles before retry; separate intentional upload not collapsed merely by title/hash. | FR-004/009/010; G090-D08; S07 |
| V12 — Auth/account/departure | Session expiry/revocation mid-upload/edit, close before/after submission, same-account sign-in and A→B account switch; no B draft/action/result or A→B replay. Retain only accessible temporary input as allowed; departure after submit is not cancellation. | FR-001 ownership; G090-D09–D13; shared 092-F06 |
| V13 — Concurrency/moderation | Force edit/hide/restore/delete and Admin restriction histories; last successful applicable change persists, fields not in patch unaffected, Admin constraint preserved, deleted track not resurrected. No stale false publication toast. | FR-006/007/008; G090-D05/D08; Group 110 boundary |
| V14 — Cross-feature consistency | Upload standalone/album-associated track then reload 091; visibility/plays/release/association feeds eligible deterministic top-five and related-playlist rules. Hide/delete removes eligibility; album text not auto-created release. Profile visibility/follows/original follow time unchanged. 092 still permits personal roles; Studio does not. | 091 FR-007–014A, 092 identity/lifecycle; 093 FR-001/003/007 |
| V15 — Security/error contract | Inspect raw JSON/DOM/accessibility labels/logs; no private B data/keys/provider traces or hidden public inference. Server validates multipart/owner/album/genre and content; standard errors, no guessed upload codes. Fault/read errors not empty/zero. | FR-001/003/005/010; shared security; G090-D14 |
| V16 — Timing/accessibility | Measure SC-002 literally and record conditions; keyboard/focus/modal/retry/touch and responsive/browser tests below. No optimistic-only success or changed timing baseline. | SC-002; Vision §6 |
| --- | --- |

## Boundary designs

- Exact duration pattern `^\d{1,2}:[0-5]\d$`: accept 0:00, 00:00, 1:05, 01:05, 99:59; reject empty, 1:5, 100:00, 3:60, -1:00, spaces and extra characters. No positivity, normalization or measured-audio-duration rule.
- Actual permitted MP3: byte counts 52,428,799 and 52,428,800 are inside inclusive limit, 52,428,801 outside. Empty/truncated/corrupt MP3 and renamed WAV/FLAC/MIME spoof need reviewed server content/parser handling; extension/MIME/signature alone insufficient validity evidence. Zero-byte validity is not inferred from a maximum-size rule.
- Rights initially unchecked each upload. Reject unchecked; Self-owned still explicitly chooses attribution needed/not; Licensed/Open require source and permission basis; required attribution needs text; no proof upload or blanket CC0/NCS permission guarantee.
- Edit title trims edges then nonempty; album optional/clearable, genre catalog membership. 200 code points accepted, 201 rejected for title and album; repeat with supplementary emoji (one code point/two UTF-16 units) and combining sequences counted by code point. Upload length maximum is not selected from edit rule. Preserve original owner/media/plays/preference/restriction and reject binary replacement/protected changes.
- Delete Cancel sends no request. Confirm removes only authorized target. Hidden/restricted track edits/deletion do not clear moderation or resurrect deleted rows. Form errors retain accessible values.

## C14 / S11 measurement disposition

SC-002 remains **500 ms from user submission** for both upload and metadata edit through confirmed store/catalog/UI reflection. For permitted maximum at Vision 5 Mbps: 52,428,800 × 8 / 5,000,000 = 83.88608 seconds ideal transfer alone (about 83.9s); 0.5s transfer would require 838,860,800 bits/s before overhead. This is an arithmetic feasibility bound, not measured production latency or blanket proof every upload fails.

Record submission event, selected bytes, bandwidth/RTT, client/server/store clocks and milestones through confirmed persistence/UI. Include validation, transfer, media and DB time for upload; measure edit independently without bytes. Hoàng/Huy/Nhựt must agree measurable envelope/feasibility disposition or separately authorize requirement change. No post-transfer stopwatch, optimistic-row success or weaker SLA selected. No timing pass or usability/browser/media acceptance was executed.
