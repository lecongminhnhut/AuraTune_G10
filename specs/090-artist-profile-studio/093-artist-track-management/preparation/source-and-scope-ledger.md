# 093 source and scope ledger

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

## Authority and baseline

Read [spec](../spec.md), [plan](../plan.md), [tasks](../tasks.md), [research](../research.md), [logical model](../data-model.md), [quickstart](../quickstart.md), the feature's Markdown contract and requirements checklist, and [joint review](../../group-090-cross-feature-review.md). The old planning branch is historical context; the current user instruction authorizes execution on the current branch. Preparation changes documentation and task completion markers only; existing application behavior is observed, not accepted. No other feature requirements are changed.

[Constitution](../../../../.specify/memory/constitution.md) still has PRINCIPLE and RATIFICATION_DATE placeholders (C01). [Owner record](../../../../docs/requirements/use-cases/090-artist-profile-studio/README.md) preserves G090-D01–D18 and explicitly reports Draft/unassigned peer review. C12 requires source/delivery disposition: 093 incorporates D01–D16 while 091 excludes D17 return navigation and D18 share from its plan. Their existence is established; shared acceptance is absent. No specification is rewritten here.

[Shared API](../../../../docs/analysis-and-design/api-contract.md) is the actual source; older links under design/api are stale. Reference ER is not deployed DDL. Runtime and media changes since the joint review are documented in the linked audits, not silently promoted to approval.

## Individual requirement trace

Each row preserves the literal source wording. “Observed” denotes mock/current integration, never requirement completion. The linked preparation package supplies cases and gaps; the [gate index](./gate-evidence-index.md) gives exact affected tasks.

| ID | Authoritative requirement | Current implementation and verification boundary |
| --- | --- | --- |
| [FR-001](../spec.md#functional-requirements) | AuraTune MUST restrict access to `/studio` to authenticated users with `role: 'artist'`. | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; written cases only |
| [FR-002](../spec.md#functional-requirements) | The Studio dashboard MUST display summary statistics for the artist: total tracks, active tracks, and total play count. | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; written cases only |
| [FR-003](../spec.md#functional-requirements) | The Studio catalog MUST render all artist-associated tracks with cover art, title, album, duration, genre, play count, status, and management action buttons. | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; written cases only |
| [FR-004](../spec.md#functional-requirements) | AuraTune MUST allow artists to upload new tracks by providing an audio file, title, optional album name, genre, and duration. | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; written cases only |
| [FR-005](../spec.md#functional-requirements) | Duration input MUST validate against the pattern `^\d{1,2}:[0-5]\d$`. | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; written cases only |
| [FR-006](../spec.md#functional-requirements) | AuraTune MUST allow artists to edit metadata (title, album, genre, duration) of uploaded tracks. | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; written cases only |
| [FR-007](../spec.md#functional-requirements) | AuraTune MUST allow artists to toggle track visibility between active ("Công khai") and hidden ("Đang ẩn"). | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; written cases only |
| [FR-008](../spec.md#functional-requirements) | AuraTune MUST require modal confirmation before permanently deleting a track. | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; written cases only |
| [FR-009](../spec.md#functional-requirements) | The system MUST provide toast notifications upon upload, update, status toggle, and deletion. | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; written cases only |
| [FR-010](../spec.md#functional-requirements) | AuraTune MUST persist uploaded audio files to backend cloud media/blob storage (e.g., Cloudinary or S3) and associate the permanent audio URL with the track record for public streaming. | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; written cases only |
| [SC-001](../spec.md#measurable-outcomes) | 100% of non-artist accounts and unauthenticated visitors are prevented from managing or accessing artist track controls. | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; no executed acceptance or measurement |
| [SC-002](../spec.md#measurable-outcomes) | Track upload and metadata edit actions reflect in the studio catalog and store within 500ms of user submission. | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; no executed acceptance or measurement |
| [SC-003](../spec.md#measurable-outcomes) | Hidden tracks are excluded from 100% of public listener searches and catalog queries while retaining historical play counts in Studio. | StudioPage + local AppStore; standalone media upload exists, no catalog commit/read/stat API; ownership/media gates open; no executed acceptance or measurement |

## Every original story acceptance scenario

| Story / scenario | Expected behavior from spec (not executed) |
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

## Validation guide allocation

The following retains every named validation scenario and its source FR/SC links. Test implementation/execution is gated, not passed by this ledger.

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

## Scope disposition

All six stories and G090-D01–D16 retain their distinct provenance. Original FRs do not automatically incorporate later owner supplements as reviewed technical contracts. Exclude audio replacement, full album CRUD, cover/lyrics/release-date editing, approval queue, royalty/payment and Group 110 UI.

## Individual supplemental decision trace

[Owner record](../../../../docs/requirements/use-cases/090-artist-profile-studio/README.md) is provenance; these are not new FRs or architecture approvals.

| Recorded owner decision | Substance / current verification gap |
| --- | --- |
| G090-D01 | MP3 only ≤50 MiB; parser limit/signature integration exists, full content/source/provider acceptance pending. |
| G090-D02 | Initially unchecked distribution declaration; current controller string flag is partial only. |
| G090-D03 | Rights type, conditional source/permission, explicit attribution choice/text; exact persisted contract absent. |
| G090-D04 | Entered exact regex duration, no measurement/mismatch check; current local form regex only. |
| G090-D05 | Owned restricted track edit/preference/delete allowed, cannot clear Admin restriction; no server shared branch. |
| G090-D06 | Effective active excludes hidden/restricted/deleted; historical valid plays retained after deletion; current sum loses deleted rows. |
| G090-D07 | Deny all new/repeated/direct-link starts, queue skip, started playback may finish; no protected byte delivery evidence. |
| G090-D08 | Successful processing order/manual uncertain reconciliation/same-submission dedup/no resurrection; no atomic operation mechanism. |
| G090-D09 | Pre-submit upload close discards/no request; submitted departure does not cancel; actual result reconciliation absent. |
| G090-D10 | Pre-save edit close discards, reopen saved data; local modal seam only. |
| G090-D11 | Open error retains data/accessibly selected File; current form stores filename only. |
| G090-D12 | Submitted edit departure allowed, no cancellation; reconcile before another edit/retry; no protected operation lifecycle. |
| G090-D13 | Temporary same-account recovery/current authorization, no cross-account draft/action/result; origin binding absent. |
| G090-D14 | Catalog/stats independent failures preserve successful peers, stale labelled not updated; no real independent reads. |
| G090-D15 | Trimmed nonempty edit title, clearable album, catalog genre, regex; current Single fallback differs. |
| G090-D16 | Edit title/album ≤200 Unicode code points; current maxLength100 differs, upload limit not inferred. |
