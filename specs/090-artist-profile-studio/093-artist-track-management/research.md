# Research — Feature 093 Artist Track Management

**Date**: 2026-11-09 | **Branch**: `090-artist-profile-studio-plan-tasks`

**Status**: Review-ready, not implementation-ready. S-prefixed decisions are local to 093; 091-D, 092-F and G090-D IDs retain their original provenance and are not interchangeable.

## Source authority and review

Primary feature authority: [specification](./spec.md), [requirements checklist](./checklists/requirements.md) and visually inspected [UI images](./ui/). Project sources constrain integration. Later Group 090 documents explicitly record owner-confirmed supplemental decisions; they are evidence, not invented policy or proof of ratified shared technical design. Differences must be reconciled in S04 before implementation without editing specifications in this pass. Latest means current checkout; no remote synchronization was performed.

| Source reviewed | Findings and planning consequence |
| --- | --- |
| [093 spec/checklist](./spec.md) / [checklist](./checklists/requirements.md) | Artist-only own-track management, immediate active publication, no prior Admin approval, exact duration regex, persistent binary audio URL, no deleted restore; ten FRs/three SCs. Checklist is requirements review, not schema/storage approval. |
| [Vision](../../../docs/proposal/Auratune_Vision_Document.md), N-09, §5.3.9, §6 | Broader G09 goals include MP3/FLAC, cover upload, rights confirmation, lyrics/release-date editing and queue cleanup. Not all are 093 controls. Shared HTTPS/browser/accessibility/query/OpenAPI goals apply; preserve gaps instead of expanding scope. |
| [Proposal](../../../docs/proposal/proposal.md), §2–6 | Responsive web, artist content ownership, academic/permitted-content scope; no selected storage or final technical schema. Legal statements are source context, not new legal guarantees by this plan. |
| [Project Plan](../../../docs/proposal/project_plan.md), PC-03/04, ED-04/05/06, §3.2/4.3/4.5 | Free/student tiers; permitted catalog with source/license/attribution records. Media provider and range/quota validation need evidence. BLD-02 claims a completed storage range spike, but no provider adapter/config/code is in this checkout; do not infer a selected service from that milestone. |
| [Constitution](../../../.specify/memory/constitution.md) | Template placeholders, no ratified principles. S01 maps 091-D01/092-F01. |
| [Architecture](../../../docs/design/architecture/system-architecture.md), [modules](../../../docs/design/architecture/feature-modules.md), [roles](../../../docs/design/architecture/role-navigation.md) | Backend validation/ownership and module separation; code supplies current technology where conceptual docs still list uncertainty. Studio authorization differs from personal following roles. |
| [API Contract](../../../docs/analysis-and-design/api-contract.md), §1/2.4/2.10, [conventions](../../../docs/design/api/api-conventions.md) | POST `/songs` multipart; PUT/DELETE `/songs/:id` Artist/Admin; public GET catalog/stream. No protected all-own-track/stat DTO, visibility payload or replacement contract. Shared envelope/error codes; audio stream exception 200/206. Stale links elsewhere to `docs/design/api/api-contract.md` do not move actual authority. |
| [Database](../../../docs/design/database/README.md), [ER](../../../docs/design/database/er-diagram.md), [consistency](../../../docs/design/database/data-consistency.md) | Reference artist→album→song; optional FKs, documented `songs.total_plays`, no deployed catalog migration, direct standalone ownership/status/rights mapping or delete cascade. Historical aggregate after deletion needs an approved source; do not equate it with current-row sum. |
| [Security](../../../docs/design/security/README.md), [database security](../../../docs/design/database/security-rules.md), [Firestore status](../../../docs/design/database/firestore-collections.md) | Server role/ownership, least privilege, no private/secret exposure. Firestore not confirmed. Supabase service-role needs explicit backend policy checks. |
| [Team Contract](../../../docs/management/team-contract.md), [Spec Kit workflow](../../../docs/management/speckit-workflow-guide.md), [spec index](../../README.md) | Hoàng owns 090/110/media, Đăng database/albums/search, Khoa auth/history/playlists, Huy player/queue, Nhựt architecture. English Markdown/Mermaid and cross-review. User no-code/no-Tasks/no-Git/exclusive-output instructions control this pass. |
| [091 spec](../091-artist-profile/spec.md), [plan](../091-artist-profile/plan.md), [research](../091-artist-profile/research.md), [model](../091-artist-profile/data-model.md), [contract](../091-artist-profile/contracts/artist-profile.md), [validation](../091-artist-profile/quickstart.md) | Public parent/child non-disclosure, eligibility before ranking/limits, standalone attribution/release/count gaps. Studio writes must produce consistent catalog truth; do not add fields to 091 or require management auth for public reading. |
| [092 spec](../092-follow-artist/spec.md), [plan](../092-follow-artist/plan.md), [research](../092-follow-artist/research.md), [model](../092-follow-artist/data-model.md), [contract](../092-follow-artist/contracts/follow-artist.md), [validation](../092-follow-artist/quickstart.md) | Shared identity and account-bound refresh/replay; all personal roles allowed there, unlike artist-only Studio. Track hide/delete does not delete follows, hide artist profile or reset follow times. Counts there are a separate question. |
| [Group 090 current decisions](../../../docs/requirements/use-cases/090-artist-profile-studio/README.md), UC-004–008 linked there | 2026-11-04 owner-confirmed D01–D16 refine upload, metadata, restrictions, statistics, playback/recovery. UCs remain Draft/reviewer unassigned. Records explicitly distinguish owner decisions from original FRs/team approval and technical schemas. Audio replacement/full album management remain deferred. |
| [Frontend foundation plan](../../130-frontend/131-frontend-foundation/plan.md) | Incremental service migration and proposed shared tests; do not require whole-store rewrite or invent installed tooling. |

## Mockup inspection

All five PNGs were opened visually.

| Image | Observation / interpretation |
| --- | --- |
| [01 — Studio catalog](./ui/01-artist-track-management.png) | Own-artist header, public-profile link, total/active/plays, own rows and hide/delete actions. Demo footnote admits files are not uploaded. No evidence of actual storage/backend or selected provider. |
| [02 — Upload](./ui/02-upload-track.png) | File input labelled MP3/WAV, title, optional album, genre, duration, rights notice. Notice alone does not implement later D02/D03 declarations. MP3/WAV label differs from recorded MP3-only decision. |
| [03 — Edit](./ui/03-edit-track.png) | Title/album/genre/duration only; no file selector. Existing upload toast in background does not authorize replacement. |
| [04 — Hidden](./ui/04-hide-track.png) | Amber hidden badge and restore icon, total tracks retained, active reduced, historical plays unchanged. This is Artist preference presentation, not an Admin review state. |
| [05 — Delete](./ui/05-delete-track.png) | Title/irreversible warning and Cancel/Delete. No restore, reason entry, approval queue or physical-erasure evidence. |

Screenshots do not establish file limits, metadata wire keys, storage providers or passed acceptance outcomes. Existing recorded decisions below supply evidence where images are older.

## Current code and implementation gaps

- [StudioPage](../../../src/frontend/src/pages/Studio/StudioPage.jsx) gates by current role and mock `artistId`, reads all local tracks, sums current rows, creates/edits local data, toggles local status and confirms local deletion. It stores only `fileName`, not File bytes; `accept='audio/*'` does not validate media. Title/album maxLength 100 and random cover are demo behavior, not final requirements.
- [AppStore](../../../src/frontend/src/context/AppStore.jsx) writes localStorage, produces direct mock `artistId`, `uploadedBy`, default active status and upload-date release values, no durable audio URL. Update/status helpers lack server ownership; local delete differs for seeds/uploaded rows. Do not promote these fields/defaults as approved schema.
- [Backend server](../../../src/backend/server.js) registers auth/health/Firebase exchange only, uses JSON parsing and a nonstandard fallback. No song routes, multipart parser or media adapter were found. [Backend manifest](../../../src/backend/package.json) confirms no media SDK/parser dependency. [Frontend manifest](../../../src/frontend/package.json) has build/dev/preview but no test runner.
- [Auth middleware](../../../src/backend/middleware/authMiddleware.js), [auth repository](../../../src/backend/repositories/authRepository.js) and [auth migration](../../../src/database/migrations/001_auth_tables.sql) supply JWT/session/current-user checks and auth persistence; no catalog schema. Banned accounts get 401/ad hoc bodies, unlike shared 403/USER_BANNED; reconcile via S05 with 092-F06.
- [Session API client](../../../src/frontend/src/services/sessionApiClient.js) already avoids forcing JSON Content-Type for FormData, attaches access JWT/cookies and refreshes/replays on 401. Origin-account replay, uncertain POST retry and long-transfer authorization need review, not a new auth mechanism.
- [Supabase configuration](../../../src/database/supabaseClient.js) creates a backend-only service-role database client. It is not proof of Supabase Storage selection or a cross-call transaction. Firebase identity exchange is not proof of Firestore catalog/media storage.

## Recorded supplemental owner decisions

These are existing evidence from [Group README](../../../docs/requirements/use-cases/090-artist-profile-studio/README.md), not newly allocated 093 FRs. Their technical representation is still unresolved. S04 addresses scope/source lineage; do not falsely label already-recorded business choices as unanswered.

| Recorded decision | Substance and planning treatment |
| --- | --- |
| G090-D01 | MP3 only; ≤52,428,800 bytes inclusive. Source-backed owner limit, not guessed policy. Align stale mock MP3/WAV and Vision MP3/FLAC references before implementation. |
| G090-D02/03 | Initially unchecked rights checkbox; Self-owned/Licensed/Open license; source + distribution-permission text for Licensed/Open; explicit attribution-required choice, required text if yes. No proof upload/legal verification. Validate before upload/save; wire/schema not selected. |
| G090-D04 | Entered duration, exact regex; no measurement/mismatch tolerance required. Do not add audio-duration matching. |
| G090-D05 | Owned Admin-restricted track still permits existing metadata/preference changes and confirmed deletion; Artist cannot clear restriction, publish or start playback by doing so. No restore of deleted content. |
| G090-D06 | Active excludes hidden/restricted/deleted. Studio historical plays retains valid recorded plays even after deletion; missing is not zero. Source/store/cleanup not selected. |
| G090-D07 | Hide/delete denies new starts through player/playlist/queue/direct URL; queue skips unavailable; already-started playback may finish, no repeat/replay. No chosen storage/revocation mechanism. |
| G090-D08 | Manual recovery; uncertain submitted results reconciled before definitive claim/resubmit; same-upload retry cannot duplicate; last successfully processed applicable change prevails without resurrection. No idempotency key/table/transaction selected. |
| G090-D09/10/11/12 | Pre-submit upload/edit close discards unsaved input; post-submit departure does not cancel. Open-form validation/operation failures retain input/accessibly selected file; reconcile on return. No durable file retention or rollback implied. |
| G090-D13/14 | Same-account recovery retains accessible temporary draft only; other account gets no prior data/action/result. Preserve successful catalog/stat portions; stale data clearly not updated, failure not empty/zero; manual retry. |
| G090-D15/16 | Edit title edge-trim/nonempty, optional-clearable album, catalog genre; each edit title/album ≤200 Unicode code points. Does not extend that limit to upload or choose storage/API. |

Broader cover/lyrics/release-date/full-album workflows and audio replacement are not added. S04 is a reconciliation/sign-off item, not a license to rewrite source decisions or invent new product policy.

## Decisions, rationale and alternatives

| Technical direction | Rationale | Alternatives rejected / pending |
| --- | --- | --- |
| Current React/custom router/Express/backend Supabase seam | Checked-in implementation baseline | New stack/router/auth provider unnecessary |
| Backend-derived artist/ownership | Role and visible attribution alone insufficient | Owner/artist IDs from browser or filtering public responses leak/permit cross-owner access |
| Metadata-only edits | Explicit 093 fields and edit mockup, replacement deferred | Binary replacement/version workflow unsupported |
| Immediate active publication after valid complete commit | Spec US2 and checklist explicitly no Admin approval | Draft/review/approved release queue conflicts with scope |
| Separate Artist preference and Admin restriction logically | Existing Group 110 boundary + recorded D05 | One user-editable status that clears moderation is unsafe; physical representation remains pending |
| Backend media adapter with commit/compensation boundary | Actual binary persistence required | Filename-only data/localStorage fails FR-010; distributed transaction/provider cannot be assumed |
| Account-bound operations and outcome reconciliation | Shared 092 isolation + recorded D08–D14 | Blind POST retry/toast-on-network-failure/new-account replay unsafe |
| Historical metric source independent of current row sum | D06 preserves deleted-track plays | Summing current catalog rows loses deleted history; no invented ledger chosen |

## Shared dependency mapping

| Earlier register | 093 implication |
| --- | --- |
| 091-D01 / 092-F01 | Shared governance → S01. |
| 091-D02 / 092-F02/F03 identity portion | Canonical user/artist identity, profile visibility versus account ban and ownership mapping → S02/S03. |
| 091-D03 | Standalone/co-artist song attribution versus album-only ER is critical for own uploads and public profile association → S02/S03. |
| 091-D04 | Related-playlist eligibility consumes changed song viewability; official designation remains 091/060-owned, not a Studio field → S08 integration only. |
| 091-D05 | Canonical plays/release date/typed IDs must survive edit/hide; no client play count writes or upload-date release assumption → S03/S09. |
| 091-D06 / 092-F05 | Do not add management fields to public responses or invent private reads. Own Studio contract/completeness → S05, independent of featured partial-failure design. |
| 091-D07 | Public album completeness remains 091-owned. Optional/clearable album metadata must not silently create albums; S03 resolves association. |
| 091-D08 / 092-F09 | Runtime/harness → S12. |
| 091-D09 | Selected-song destination remains player-owned, not a Studio prerequisite; streaming visibility integration S08 is relevant. |
| 092-F04 | Share transaction capability discovery, not pair-lock/follow processing rules as track schema → S07. |
| 092-F06 | Origin-account auth refresh/replay/error drift → S05/S07. Studio permits only Artist, unlike all personal follow roles. |
| 092-F07 | Follower counts are unrelated to track/play metrics; do not implement them here. |
| 092-F08 | Shared artist/account deletion lifecycle remains relevant; track deletion cannot invent follow cascades → S09. |

## Decision register

All remain **OPEN** for technical closure/review. Owners reflect established responsibilities, not new messages/assignments. Recorded supplemental business decisions above are not reopened as blank policy choices.

| ID | Dependency / remaining decision | Responsible roles | Closure evidence / blocked implementation |
| --- | --- | --- | --- |
| S01 | Unratified Constitution | Nhựt/team | Ratification or explicit governance disposition shared with 091/092; no constitutional pass claim. |
| S02 | Account→artist link and manageable-track ownership; standalone/co-credit/imported ownership; non-public/disabled artist versus Studio eligibility | Hoàng + Đăng + Khoa | Reviewed identity/policy and actual catalog references; linked-account ban mapping shared with 091/092. Blocks every protected read/write; no artist creation/link repair flow invented. |
| S03 | Catalog schema, album-name/ID/clear mapping, genres, duration representation, rights/media fields, release/count/stat sources | Đăng + Hoàng; Khoa history | Approved schema/migration/source mapping, including albumless track and historical plays after deletion. No automatic album creation, source-date/count fallback or guessed columns. Blocks repositories, consistent 091 output and metrics. |
| S04 | Reconcile authoritative 093/old mockups/Vision with later recorded owner decisions and deferred scope | Hoàng + Nhựt/team | Acknowledge exact G090-D01–D16 provenance and scope, align MP3/WAV vs MP3/FLAC vs recorded MP3-only, edit limits and rights declarations. No automatic extension of edit length to upload; no new approval/replacement workflow. Business choices are already recorded, but shared source alignment/independent review is not completed. |
| S05 | Protected own-catalog/stat/read capability absent; multipart/PUT/visibility/delete DTOs, errors and auth drift undefined | Hoàng + Khoa + Đăng | Reviewed existing-path integration or explicit approved extension, complete safe projection/order/transport, exact fields/statuses/OpenAPI; current public GET cannot return hidden Studio data. Standard errors and origin-bound refresh. Blocks backend/frontend integration. |
| S06 | Media provider/parser/validation adapter not implemented | Hoàng + Nhựt; Huy streaming | Record selected provider/config from real evidence, MP3-content checks/parser, permanent-reference semantics, provider quota/security and 206 tests. No selected provider inferred from examples or BLD-02 claim. Blocks actual upload. |
| S07 | Cross-service consistency, operation identity/dedup, database atomicity/processing order and final authorization | Đăng + Hoàng + Khoa | Approved execution/reconciliation mechanism for media-save/DB-commit/response-loss/cleanup failure, same-submission retry, concurrent metadata/preference/delete without resurrection. No invented request header, operation table, RPC or automatic replay. Blocks safe writes/retries. |
| S08 | Public-media eligibility enforcement incl. known permanent URLs, range requests and already-started streams; cache/index propagation | Hoàng + Huy + Đăng/search | Demonstrate D07 new-start/skip/in-progress outcomes and newly loaded catalog exclusion with selected storage/API; raw public-object URL bypass unresolved. No new global hard-stop or refresh requirement. Blocks hide/delete/public-distribution acceptance. |
| S09 | Logical deletion versus physical object cleanup and FK/history/playlist relationships; historical statistics continuity | Đăng + Hoàng + Khoa + Huy | Reviewed lifecycle/storage cleanup that preserves required historical plays and public removal, without selecting cascades/retention periods prematurely. No deleted restore or follow cleanup introduced. Blocks reliable delete and post-delete metrics. |
| S10 | Shared Admin restriction representation and conflict handling on Artist restore/edit/delete | Hoàng (090/110) + Đăng | Confirm independent policy/state protection and shared endpoint role branches; Artist preference cannot override restriction or resurrect deleted content. Group 110 retains moderation workflows. Blocks safe shared updates. |
| S11 | SC-002 500ms binary-upload/edit measurement feasibility | Hoàng + Huy + Nhựt | Exact submission start/end, payload/network/store conditions and measured evidence; retain literal target, record failure if unmet. Any target change requires separately authorized requirements review, not silent stopwatch shift. |
| S12 | Runtime and automated harness/commands unavailable | Nhựt/foundation owner + Hoàng | Supported Node version, approved unit/component/API/media/E2E tests and executable commands. Blocks automated readiness claims, not review of scenario design. |

## Workflow record

Read [Spec Kit plan skill](../../../.agents/skills/speckit-plan/SKILL.md) and [plan template](../../../.specify/templates/plan-template.md). Pre-plan extension configuration absent. Setup used explicit 093 directory, `SPECIFY_FEATURE_NO_PERSIST=1`, branch context `090-artist-profile-studio-plan-tasks`; correct paths resolved without writing persistent feature state. No branch operation or task generation. Skill unresolved-clarification gate stays held under user's explicit review-readiness instruction.

## Planning validation results

- All five planning artifacts exist inside Feature 093. Relative file links resolve; decision-register anchors match their headings. No Tasks or application files were created.
- All five original PNGs were visually inspected. Validation coverage includes FR-001–010, SC-001–003, six user stories and separately labelled supplemental G090-D decisions; planned scenarios are not passed runtime tests.
- Before/after CRC and byte-length comparison of 1,009 existing files under specs, source, project docs, Spec Kit, agent/Gemini configuration and root manifests/readme/ignore/branch reference found no changed or missing existing files. Exactly five additions appeared, all in Feature 093. Features 091/092 and original 093 spec/checklist/UI remain unchanged.
- Branch reference remains `090-artist-profile-studio-plan-tasks`; no create/switch/merge/commit/push or other Git mutation was invoked. Setup created no persistent feature-state output.
- Post-plan extension check found no extension configuration, so no pre/post hooks apply.
- No build/application tests were run: this is documentation-only planning, no Node executable is available in this shell, and catalog/media routes and the feature harness remain unimplemented. Critical S01–S12 remain explicitly open; implementation readiness is not claimed.
