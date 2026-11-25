# AuraTune PA4 change log
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

## Baseline and scope
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

The PA3 baseline is the original document set before the current revision, confirmed by the owner in PA4-D07. The recorded pre-edit snapshot is `35d8027`; its requirements tree last changed at `8ec2d25c11a7a2d2ac663c9ab751c53f0dbbdb7b`. The original per-document SHA-256 values below identify the comparison inputs.

TA supplied no feedback for PA3. Changes are owner/team-requested corrections and elaborations. PA4-D09 restores Performed by to the original PA3 responsible author. Edited by remains Lê Công Minh Nhựt and Reviewed by remains the Group 10 team. Assignment does not mark pending approval complete. The detailed decisions, source conflicts and implementation boundaries are now part of [the existing use-case model](requirements/use-case-model.md#11-pa4-decisions-and-source-review).

This existing Changes.md is updated for PA4. The previous PA3 change log is retained in [docs/proposal/Changes.md](proposal/Changes.md). Use-case documents are edited at their original paths. Supporting source review and verification are consolidated into the model, and PDFs sit beside their Markdown sources. The separate docs/pa4 directory is removed from the repository.

## How to read the changes
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Each section identifies a revised source document, its earlier state and the changes made. The Performed by correction follows PA3 group ownership; where the original field was absent, the responsible human author is taken from the original group inventory/README and Team Contract. The original model retains its Primary Authors credit. New documents without a PA3 counterpart use their existing group responsibility. Existing UC IDs and filenames are preserved; new drafts fill model/Vision goals that previously lacked a specification. Earlier human draft credits remain labeled as original metadata. No application code, Spec Kit specification, plan or task is changed.

## docs/design/architecture/system-architecture.md (D-26, 2026-11-22)
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](design/architecture/system-architecture.md), section 11 and matching PDF.

Before: the architecture contained the section 7 Container diagram and component views, but no deployment section. The readiness checklist still reflected an earlier snapshot.

After / affected locations:

- Added an English Mermaid deployment diagram and node descriptions mapping the Web Application, Backend API, AI Service and Supabase Data Platform to local logical nodes and managed cloud infrastructure. Included Firebase, Cloudinary and Gemini connections from section 7.
- Checked launch commands, bind hosts, port overrides, direct browser API calls, Vite proxy routing and HTTP/HTTPS boundaries against current source. Recorded configuration separately from successful runtime connections.
- Preserved all existing Performed by values. The new architecture section inherits Nguyễn Khánh Đăng from its containing document; its editor is Lê Công Minh Nhựt and designated reviewer is Group 10 team.

Review status: independent team review and live demo verification remain pending. `node --check src/backend/server.js` still fails on the duplicate `mediaRoutes` declaration at line 20. No application code was changed.

## docs/management/pa4-readiness-checklist.md (D-26, 2026-11-22)
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](management/pa4-readiness-checklist.md), Part D and the D row in Overall status, with matching PDF.

Before: Part D reported no infrastructure mapping and listed unverified development port examples.

After / affected locations:

- Recorded the completed source mapping, per-node descriptions and configuration comparison with section 7. Kept actual listener/integration verification and independent team review open.
- Updated the Overall status D assessment without marking D ready for submission. Other assignment sections retain their earlier audit state.

Validation: Mermaid rendering and PDF export use the existing temporary Markdown-it, Mermaid and headless Chrome toolchain from the earlier PA4 exports. The architecture, checklist and this change log have matching PDF exports. The deployment image is checked in the exported architecture PDF; live provider connections remain unverified.

Review status: pending independent team review. Reviewed by records the assigned team only.

## docs/requirements/use-cases/010-authentication/prototypes/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/010-authentication/prototypes/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `e5afdf3beceb13ee18345f8ac1a43c3747e0016e959ce890ffc81f27cf7bf139`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/010-authentication/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/010-authentication/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `c3eadc9c2daf38f6b2884d0e4e9277dd2e55fa9df91f72bae0045050b46af643`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/010-authentication/UC-010-001-register-with-email.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/010-authentication/UC-010-001-register-with-email.md).

Before: existing UC draft with its original goal and flows; SHA-256 `f388d0e2c3d3b7d3904557a4d91bf08a39606020546445c3c20dc5fbe813981d`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/010-authentication/UC-010-002-login-with-email.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/010-authentication/UC-010-002-login-with-email.md).

Before: existing UC draft with its original goal and flows; SHA-256 `e6c6ffd8b4b01ff35716b09ed65142c34a59ec20f389845c63483ea2b2c66c17`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/010-authentication/UC-010-003-recover-password.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/010-authentication/UC-010-003-recover-password.md).

Before: existing UC draft with its original goal and flows; SHA-256 `84e15e70c1570ed5cb0f78789427954238642bb4ec5f1c567f01c1209890849a`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/010-authentication/UC-010-004-login-with-google.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/010-authentication/UC-010-004-login-with-google.md).

Before: existing UC draft with its original goal and flows; SHA-256 `5c1e7fac32dce5dc6cb829f42986cfcbbc35414fb7f7875c7b29a9d20891a9c1`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/010-authentication/UC-010-005-login-with-facebook.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/010-authentication/UC-010-005-login-with-facebook.md).

Before: existing UC draft with its original goal and flows; SHA-256 `e33bf4dd1170e20c41cccae1be9ff17a3b8525dc8fd4107067c8eb3b5c184310`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/010-authentication/UC-010-006-logout.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/010-authentication/UC-010-006-logout.md).

Before: existing UC draft with its original goal and flows; SHA-256 `76092ddbb359d1ee0744452a2f22a535652f1423c5a345939f828edf631263d8`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/010-authentication/UC-010-007-view-active-sessions.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/010-authentication/UC-010-007-view-active-sessions.md).

Before: existing UC draft with its original goal and flows; SHA-256 `8d8ec1822a2b9c3784bb520a0d759cb623381ddb63c6e2ff0416f0300a12d38e`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/010-authentication/UC-010-008-logout-all-devices.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/010-authentication/UC-010-008-logout-all-devices.md).

Before: existing UC draft with its original goal and flows; SHA-256 `ff3e16d27adb33d19d9a89e53d2c78fba42b41b381de108d3eee624dd43076d3`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/010-authentication/UC-010-009-unlink-oauth-provider.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/010-authentication/UC-010-009-unlink-oauth-provider.md).

Before: existing UC draft with its original goal and flows; SHA-256 `6c3f0f176174f86b845b36163d4967d44a61c63ebbe50a19e41bf584896d973f`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/010-authentication/use-case-inventory.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/010-authentication/use-case-inventory.md).

Before: existing document in the PA3 comparison set; SHA-256 `eff3317bfad3f81765be0f1fb87f13e0c0dbd1b16d906391ea737e2e5db17aa8`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/020-home-dashboard/prototypes/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/020-home-dashboard/prototypes/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `95c93c3a245d37a8820ace1f750170c934c31627d03ad81987f4e2f5f6aaf1ba`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Fixed image example paths that incorrectly repeated the prototypes directory.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/020-home-dashboard/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/020-home-dashboard/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `a8dd1b344f35c031cd69553811ba089415179e63020e4d4da1122b47fd8d2276`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/020-home-dashboard/UC-020-001-browse-home-dashboard.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/020-home-dashboard/UC-020-001-browse-home-dashboard.md).

Before: existing UC draft with its original goal and flows; SHA-256 `381bced70784bcaba05075d28529f77f86d8bfaebf2d984617eb9f56ada69e8a`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/020-home-dashboard/UC-020-002-stream-recommended-music-from-home.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/020-home-dashboard/UC-020-002-stream-recommended-music-from-home.md).

Before: existing UC draft with its original goal and flows; SHA-256 `ec8adfeebc6fe04ee556d2871ac3fe15749f3e7efd6c248f0bf5c049ed0298ba`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Aligned playlist-detail references with existing UC-060-003; no UC file was renamed.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/020-home-dashboard/UC-020-003-replay-recently-played-music.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/020-home-dashboard/UC-020-003-replay-recently-played-music.md).

Before: existing UC draft with its original goal and flows; SHA-256 `0467fa53080534a02e1d1bd5b9ee1995d4967324df3c32c31cb8be60025fe6a0`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Aligned playlist-detail references with existing UC-060-003; no UC file was renamed.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/020-home-dashboard/UC-020-004-browse-trending-charts.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/020-home-dashboard/UC-020-004-browse-trending-charts.md).

Before: existing UC draft with its original goal and flows; SHA-256 `0e1e2454af08b92b79e2d85a6d40d46a2a4227cf551e278a688060ecd6f7ecb8`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/020-home-dashboard/UC-020-005-explore-new-album-releases.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/020-home-dashboard/UC-020-005-explore-new-album-releases.md).

Before: existing UC draft with its original goal and flows; SHA-256 `2d4bd5f9c9c3425890cd169411e6cfcea8b6f725211da00defec722b8f94bbb7`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/020-home-dashboard/use-case-inventory.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/020-home-dashboard/use-case-inventory.md).

Before: existing document in the PA3 comparison set; SHA-256 `6ce02f2f3299e0473c0afe73597aa7cd59573dae58443efd1ccc7ecbde83f58c`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/030-search/prototypes/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/030-search/prototypes/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `b8b853763f33e524f4dc6d95516616bf3dac76fee3b1c406298e85c74b81e799`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Fixed image example paths that incorrectly repeated the prototypes directory.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/030-search/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/030-search/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `e245acb22214f8d753ae1b04bd5a862bd53ecd2c87cce0edd228c9dfee81e646`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/030-search/UC-030-001-metadata-search.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/030-search/UC-030-001-metadata-search.md).

Before: existing UC draft with its original goal and flows; SHA-256 `0ec989e73777fb3e6a4a18524f10b73d9e41d853bf9b3fd17138531f66a5555d`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Aligned playlist-detail references with existing UC-060-003; no UC file was renamed.
- Kept the approved Load More interaction; removed the unsupported infinite-scroll alternative.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/030-search/UC-030-002-ai-lyrics-search.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/030-search/UC-030-002-ai-lyrics-search.md).

Before: existing UC draft with its original goal and flows; SHA-256 `8edb0c73b47d3e458d89cf7a0a8e61ea234175d9da5b3e8339fa06cdc1fb1188`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/030-search/UC-030-003-semantic-vector-search.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/030-search/UC-030-003-semantic-vector-search.md).

Before: existing UC draft with its original goal and flows; SHA-256 `fca18a48e7d4ae050be45a91764832c478594de8687e98cfbe107fae248b5ffc`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Recorded PA4-D05 explicitly in the semantic-search precondition without changing the source spec.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/030-search/use-case-inventory.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/030-search/use-case-inventory.md).

Before: existing document in the PA3 comparison set; SHA-256 `f986dacafbd0c5f804b655d61a106c06f1ee3141e1cb9b3928326e87383ae6ab`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added the previously missing model/Vision goal without renumbering the existing inventory.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/prototypes/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/prototypes/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `440862abc2d0eb7ad36cf7bc1f2d10275d2952831560804b3b2cec6a3eda9e6c`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `73efe686169ac15f374f3b3a7442ce60c58dbf6cfa3f65d01a20ac95a39914d4`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/UC-040-001-control-audio-playback.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/UC-040-001-control-audio-playback.md).

Before: existing UC draft with its original goal and flows; SHA-256 `10eee8723066f49252ff23526729a275e332772dc73383d64f883890772390fd`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Corrected conditional workflow relationships/internal component actor labeling or the primary Vision source reference.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/UC-040-002-adjust-volume-and-mute.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/UC-040-002-adjust-volume-and-mute.md).

Before: existing UC draft with its original goal and flows; SHA-256 `503ae5f142edc5b216bb7771a81a0b8dac6cd1562032f02ce66a5eba4bd039e8`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/UC-040-003-seek-audio-playback-position.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/UC-040-003-seek-audio-playback-position.md).

Before: existing UC draft with its original goal and flows; SHA-256 `282c355efec210cbb7265625bc4bda7aaa899aeecd37cac498144a928eaaf79a`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/UC-040-004-toggle-shuffle-and-repeat-modes.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/UC-040-004-toggle-shuffle-and-repeat-modes.md).

Before: existing UC draft with its original goal and flows; SHA-256 `cb7c64e32c3757474b27761ea41883d7a26ecf1fb3eff03a5d039177d45dd3d9`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/UC-040-005-view-synchronized-lyrics.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/UC-040-005-view-synchronized-lyrics.md).

Before: existing UC draft with its original goal and flows; SHA-256 `f087c04242869c7b45b26cb1a7afc7299765bc2b976fbacdd8af2161023a6cfb`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Corrected conditional workflow relationships/internal component actor labeling or the primary Vision source reference.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/UC-040-006-toggle-persistent-mini-and-full-player.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/UC-040-006-toggle-persistent-mini-and-full-player.md).

Before: existing UC draft with its original goal and flows; SHA-256 `20f37268e24583d1464bdd6858ea01f38ca0b7a41c4f646ce343820c70891892`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/UC-040-007-share-song.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/UC-040-007-share-song.md).

Before: existing UC draft with its original goal and flows; SHA-256 `81cc8e83f0861899a6c772f329783641eb9b0933c92c7f92409da312dc9a8984`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/UC-040-008-read-track-comments.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/UC-040-008-read-track-comments.md).

Before: existing UC draft with its original goal and flows; SHA-256 `d88be4c0cd95cf1423f7156c3f3150eb0ef92db421a05af54567bd6338c58cc4`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/UC-040-009-post-track-comment.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/UC-040-009-post-track-comment.md).

Before: existing UC draft with its original goal and flows; SHA-256 `877f2dc8b3c11f17a0f7a9bc1eb7c3c4acd361eab39d30ccd96ecaaa275a7ca4`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/UC-040-010-delete-track-comment.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/UC-040-010-delete-track-comment.md).

Before: existing UC draft with its original goal and flows; SHA-256 `bfcc6c301b06e965749278d82adb13fed6f473436409b22c7edc7ded23a287fe`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Corrected conditional workflow relationships/internal component actor labeling or the primary Vision source reference.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/040-music-player/use-case-inventory.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/040-music-player/use-case-inventory.md).

Before: existing document in the PA3 comparison set; SHA-256 `9af70286656269ad4ff9d0cefccc354e695922c3a825253bef6cc53241abc5a4`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/050-queue-management/prototypes/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/050-queue-management/prototypes/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `5ccb1fed674dd352af5737cfa930a41b1df9072072d210a572af60db202d508a`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/050-queue-management/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/050-queue-management/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `1d919dac173c19dd55f82be91e354edab704bd2a09358b993135384e33b1e30e`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/050-queue-management/UC-050-001-view-playback-queue.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/050-queue-management/UC-050-001-view-playback-queue.md).

Before: existing UC draft with its original goal and flows; SHA-256 `526a2107ae2e962d81702212b91850df39972dc34f26b394c0645c7c458e7799`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/050-queue-management/UC-050-002-add-track-to-queue.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/050-queue-management/UC-050-002-add-track-to-queue.md).

Before: existing UC draft with its original goal and flows; SHA-256 `c322e48f7f5d7ccba6dd1657e24dfc9636ae602e7bf25ef4b192f35c8fa88748`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/050-queue-management/UC-050-003-play-track-next.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/050-queue-management/UC-050-003-play-track-next.md).

Before: existing UC draft with its original goal and flows; SHA-256 `e1a620c2d39eacd4671158ec5b396b0c0f97fbf9b332caf0241294d05306c536`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/050-queue-management/UC-050-004-reorder-upcoming-queue.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/050-queue-management/UC-050-004-reorder-upcoming-queue.md).

Before: existing UC draft with its original goal and flows; SHA-256 `36b0881494d7a6f02a02b170a5fb47d74a102f317daad252b2d675a8fb20ab91`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/050-queue-management/UC-050-005-remove-track-from-queue.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/050-queue-management/UC-050-005-remove-track-from-queue.md).

Before: existing UC draft with its original goal and flows; SHA-256 `b0fd5d58ce8d2cb3cce3b8a683fa0f64b63b05d4b15ab651e730b2f123f8aeae`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/050-queue-management/UC-050-006-clear-upcoming-queue.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/050-queue-management/UC-050-006-clear-upcoming-queue.md).

Before: existing UC draft with its original goal and flows; SHA-256 `c1a44eebff0d973e71fa55148543add74b38587bf8f577544f5a2a976dfc948d`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/050-queue-management/UC-050-007-save-queue-as-playlist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/050-queue-management/UC-050-007-save-queue-as-playlist.md).

Before: existing UC draft with its original goal and flows; SHA-256 `761aaaaae13bf8bf10003d7214b159e110eab700e36a065b5281831db249c72c`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Aligned playlist-detail references with existing UC-060-003; no UC file was renamed.
- Corrected create/details handoffs and removed the unsupported UML extend claim.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/050-queue-management/use-case-inventory.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/050-queue-management/use-case-inventory.md).

Before: existing document in the PA3 comparison set; SHA-256 `357743e969360ee5b68c1d0f39542ab4268f57dec0695fe0f35e4ee75169670f`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/prototypes/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/prototypes/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `e995911e6bdfc32d48bad528e962bde0010ff09f6042ba2b4a6361059664aa78`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `b6fa2460816af5981dab68188b291d44a58bf685c805ca93276c5d9e2724c713`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-001-view-playlists-in-library.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-001-view-playlists-in-library.md).

Before: existing UC draft with its original goal and flows; SHA-256 `3ece5d28a52a59df516fd64b4532a1ccd166094d052a753da28ca3888da2b134`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-002-create-playlist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-002-create-playlist.md).

Before: existing UC draft with its original goal and flows; SHA-256 `d2e32d0214050f7b4cc1a5e82bf08e7bce465e3f302ebb80098de48b0a13af1b`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-003-view-playlist-details.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-003-view-playlist-details.md).

Before: existing UC draft with its original goal and flows; SHA-256 `1b47163b17b912a990f1a4c523b6b3e09b4d475e60d3d2a7526073a051331db8`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-004-edit-playlist-metadata.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-004-edit-playlist-metadata.md).

Before: existing UC draft with its original goal and flows; SHA-256 `833f3a81acc46de42fd2d51dd1fea8d7879fde75df55e0137deb9203eb3ffef8`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-005-delete-playlist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-005-delete-playlist.md).

Before: existing UC draft with its original goal and flows; SHA-256 `b976bf9c65aa15b9a45e7c95125f1424f7ad1847c1207f6afaaff23ecd2a5bf1`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-006-bookmark-public-playlist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-006-bookmark-public-playlist.md).

Before: existing UC draft with its original goal and flows; SHA-256 `d2b8ae8dd0a68b16d77b16fcc5a5ca2f52fd45a4fe0762a0767cd343b39188e4`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-007-add-songs-to-playlist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-007-add-songs-to-playlist.md).

Before: existing UC draft with its original goal and flows; SHA-256 `4797ad4d4901c6549022667b737c40d30e2d4633faf96d1d96fc121d4c95818f`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-008-remove-song-from-playlist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-008-remove-song-from-playlist.md).

Before: existing UC draft with its original goal and flows; SHA-256 `a30ff22bc1bd8514ae8e779752501ccf12282056c9d4a109266e9385ed270397`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-009-reorder-songs-in-playlist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-009-reorder-songs-in-playlist.md).

Before: existing UC draft with its original goal and flows; SHA-256 `dd36681ac2f694bff450bbfe78e5f5f78e2182396f274e11d37cf6496d5ba37a`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-010-toggle-like-song.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-010-toggle-like-song.md).

Before: existing UC draft with its original goal and flows; SHA-256 `1c70f5ccbd52e8634f500132720fef6116dbac8c43828eeec00db01a86be1191`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-011-enable-collaboration-on-playlist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-011-enable-collaboration-on-playlist.md).

Before: existing UC draft with its original goal and flows; SHA-256 `56adcbae4bfed1cb0bfa61d60f4bb98d163bd4be58153f0cdabb3d6832d5c242`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-012-invite-collaborators.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-012-invite-collaborators.md).

Before: existing UC draft with its original goal and flows; SHA-256 `48cd226350904e2058d3f6cee439f7aedb5e6fd2a2c36b9f6e0839945bb7ec3a`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-013-manage-collaborators.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-013-manage-collaborators.md).

Before: existing UC draft with its original goal and flows; SHA-256 `a8b08c868da96db69a71006fdfda7cbfa877d210eb7ce31d21f2a51d23897926`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-014-view-collaborative-playlist-details.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-014-view-collaborative-playlist-details.md).

Before: existing UC draft with its original goal and flows; SHA-256 `044679241148e30b9fbf7853177a79d0db85d40761d58f153873941d691c07d9`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-015-play-playlist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-015-play-playlist.md).

Before: existing UC draft with its original goal and flows; SHA-256 `3bbacbed1e7fdde45f01cb1346cf9c95cd3035e6493ffcfc1b393f8bcda2c2d0`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Corrected conditional workflow relationships/internal component actor labeling or the primary Vision source reference.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/UC-060-016-generate-ai-playlist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/UC-060-016-generate-ai-playlist.md).

Before: existing UC draft with its original goal and flows; SHA-256 `a7a907cc96943b0bd0cfc16d54af91cfb48e918063c467838ef5e792125585e4`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/060-playlist-management/use-case-inventory.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/060-playlist-management/use-case-inventory.md).

Before: existing document in the PA3 comparison set; SHA-256 `ed4afc591e3b654cb425f7c31e05b02d590b97326b63f93f66a9e8f27c44c71c`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/070-listening-history/prototypes/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/070-listening-history/prototypes/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `d443e6ed2a776253e6a744c32af05442b7e48953c7824cc42a5fbbfb218e330c`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/070-listening-history/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/070-listening-history/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `06213f894aca43b7de2662ccd63196d7bbc2397b41647455519c6c422f59b8ed`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/070-listening-history/UC-070-001-record-track-play-event.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/070-listening-history/UC-070-001-record-track-play-event.md).

Before: existing UC draft with its original goal and flows; SHA-256 `2ca0dc8ed1b3f770390d2eaf4a73b5c113dbf12fcdb06985f9bd738470bdb857`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/070-listening-history/UC-070-002-view-listening-history.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/070-listening-history/UC-070-002-view-listening-history.md).

Before: existing UC draft with its original goal and flows; SHA-256 `294ab84103ce1eafd1973dde4b3227a9272f701d13c40b6ae2326f13157b9ca4`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/070-listening-history/UC-070-004-purge-entire-history.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/070-listening-history/UC-070-004-purge-entire-history.md).

Before: existing UC draft with its original goal and flows; SHA-256 `a25a1c2d9d6afa1b317cae2db8c313ab157af90b30456dc5a671545b3469193e`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/070-listening-history/UC-070-005-view-duration-analytics.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/070-listening-history/UC-070-005-view-duration-analytics.md).

Before: existing UC draft with its original goal and flows; SHA-256 `c4f515e1a22ded4db0f3c3d71a5a90f54c795f8ad218aa1fe8e0b8ac6dc4432a`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/070-listening-history/UC-070-006-view-top-artists-and-genres.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/070-listening-history/UC-070-006-view-top-artists-and-genres.md).

Before: existing UC draft with its original goal and flows; SHA-256 `5e7da517459d875ddcc465526f0edbe186054607f37408f7e7438de00e4df1a6`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/070-listening-history/UC-070-007-purge-expired-history.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/070-listening-history/UC-070-007-purge-expired-history.md).

Before: existing UC draft with its original goal and flows; SHA-256 `184282c3ffcaf38a001478c38312c873d5e52a34e3f427f96810484b438c641d`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/070-listening-history/use-case-inventory.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/070-listening-history/use-case-inventory.md).

Before: existing document in the PA3 comparison set; SHA-256 `a34c3c71edddbb1381f0d0d94f71f1cf24e00f8cb5f6e5e90ae88ca0edb052bd`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added the previously missing model/Vision goal without renumbering the existing inventory.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/080-album-interaction/prototypes/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/080-album-interaction/prototypes/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `e40f34e2733f8a201293f3eaf9521734add7cd7ebcf798f9c42705545a1da97f`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Fixed image example paths that incorrectly repeated the prototypes directory.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/080-album-interaction/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/080-album-interaction/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `9e30ac34069e24d9cd6bc98e1c9d9eb42d220c13d4de4d71ff72a1810097dddb`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/080-album-interaction/UC-080-001-album-details.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/080-album-interaction/UC-080-001-album-details.md).

Before: existing UC draft with its original goal and flows; SHA-256 `45c0a4ae007b7bf556d4bbe83f465619efdae35c33a7ef20498d4df8c4c6cd6f`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/080-album-interaction/UC-080-002-album-tracklist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/080-album-interaction/UC-080-002-album-tracklist.md).

Before: existing UC draft with its original goal and flows; SHA-256 `5bde074eface79db98749c568bb518eda51988ae2d5bfa75ca109fa02344b3df`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Applied owner-confirmed preservation of unrelated queued tracks, clarified selected-track ordering and scoped failure postconditions. Spec and application code remain unchanged.
- Corrected conditional workflow relationships/internal component actor labeling or the primary Vision source reference.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/080-album-interaction/UC-080-003-save-and-share-album.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/080-album-interaction/UC-080-003-save-and-share-album.md).

Before: existing UC draft with its original goal and flows; SHA-256 `45c4b53feb076fe259ba8e7d137460b04d3e9269385b8af281ff427f4e18abee`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/080-album-interaction/use-case-inventory.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/080-album-interaction/use-case-inventory.md).

Before: existing document in the PA3 comparison set; SHA-256 `3ea4c31aafef99282e2ef217182d9a8c2649c020e6263e6c29c23d9a7afcf2bd`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/090-artist-profile-studio/prototypes/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/090-artist-profile-studio/prototypes/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `6221f2f12fb75f99ce348bc3b9b02930aa9d01fe1a9e20ffc168588896ad8a8d`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/090-artist-profile-studio/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/090-artist-profile-studio/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `742354047058492e08c2998f412e0466e2c029c6532a721b0ecaad0c1b249fb5`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Changed GitHub-only line fragments to stable local section anchors for the same moderation source.
- Changed GitHub-only line fragments to stable local section anchors for the same moderation source.
- Changed GitHub-only line fragments to stable local section anchors for the same moderation source.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/090-artist-profile-studio/SUBMISSION.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/090-artist-profile-studio/SUBMISSION.md).

Before: existing document in the PA3 comparison set; SHA-256 `8ccc7c3a73f658ff2f73f694ea59db18aac9786d05845954d7f11043dc2d12ef`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/090-artist-profile-studio/UC-090-001-view-public-artist-profile.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/090-artist-profile-studio/UC-090-001-view-public-artist-profile.md).

Before: existing UC draft with its original goal and flows; SHA-256 `051c85b66bedadbb7218e2317ef02e0caa24cf9b58cc140bb036c8f4bd7c2e1a`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Aligned playlist-detail references with existing UC-060-003; no UC file was renamed.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/090-artist-profile-studio/UC-090-002-follow-or-unfollow-artist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/090-artist-profile-studio/UC-090-002-follow-or-unfollow-artist.md).

Before: existing UC draft with its original goal and flows; SHA-256 `32bd7b0006f182d31df8c83453a737713fa57e44e8966923e5436fbfc73b5ddb`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/090-artist-profile-studio/UC-090-003-view-followed-artists.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/090-artist-profile-studio/UC-090-003-view-followed-artists.md).

Before: existing UC draft with its original goal and flows; SHA-256 `d51f8524b4c2e167289b9c86e3aefb562c0cb0ae2b6c3fc3a0476e03154af018`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/090-artist-profile-studio/UC-090-004-access-artist-studio-dashboard.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/090-artist-profile-studio/UC-090-004-access-artist-studio-dashboard.md).

Before: existing UC draft with its original goal and flows; SHA-256 `1c56e84819e266a9d4d3702b0ceb52ed1b21f2d9bbdc79961ec3e482dd882be5`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/090-artist-profile-studio/UC-090-005-upload-audio-track.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/090-artist-profile-studio/UC-090-005-upload-audio-track.md).

Before: existing UC draft with its original goal and flows; SHA-256 `f089cecc77d1afa2fbfc74e7cdb71028555c32442d29ebd1bf02a7cc4fc575d3`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/090-artist-profile-studio/UC-090-006-edit-track-metadata.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/090-artist-profile-studio/UC-090-006-edit-track-metadata.md).

Before: existing UC draft with its original goal and flows; SHA-256 `c6b15e6c5a7a2ea1766462f85d1f47b2ae24ddf3dd7d857c8ad0ffdf90b3b9e1`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/090-artist-profile-studio/UC-090-007-hide-or-unhide-track.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/090-artist-profile-studio/UC-090-007-hide-or-unhide-track.md).

Before: existing UC draft with its original goal and flows; SHA-256 `bb6b74be9379636c004b5cffd9ce0bc76675d1c7590de06ecef02342b7704522`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/090-artist-profile-studio/UC-090-008-delete-track-from-studio.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/090-artist-profile-studio/UC-090-008-delete-track-from-studio.md).

Before: existing UC draft with its original goal and flows; SHA-256 `62b73d2bff749feb42702c19461f5f74d80bebf8129d763a0fe160241f2116b6`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/090-artist-profile-studio/use-case-inventory.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/090-artist-profile-studio/use-case-inventory.md).

Before: existing document in the PA3 comparison set; SHA-256 `1d7b902465bb3ff51253a0e9666feb6481e12d82fae2d7e05d2e9eac911f0506`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/100-ai-recommendations/prototypes/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/100-ai-recommendations/prototypes/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `df7d0db51c0a8b4f4aa570160d268ff92a6176b4ce0171a404d0445ac524d3bb`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Fixed image example paths that incorrectly repeated the prototypes directory.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/100-ai-recommendations/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/100-ai-recommendations/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `5f3b1f496b7aec0594577c94cb770a27b1863f53a369802cc8bbecb35a1316b6`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/100-ai-recommendations/UC-100-001-view-listening-history-analysis.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/100-ai-recommendations/UC-100-001-view-listening-history-analysis.md).

Before: existing UC draft with its original goal and flows; SHA-256 `ab737677cdb8163a5eefd2ff50b4de9e562b896a90431c1433c3efe1907e10c0`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Removed the external AI actor from deterministic Feature 101 analysis and made the empty-history alternative reachable.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/100-ai-recommendations/UC-100-002-receive-personalized-recommendations.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/100-ai-recommendations/UC-100-002-receive-personalized-recommendations.md).

Before: existing UC draft with its original goal and flows; SHA-256 `eee4a686dfda8285d8ef90ab7630a504adb931b8a5a26816b9a2a0ce17d9f83f`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Aligned playlist-detail references with existing UC-060-003; no UC file was renamed.
- Corrected conditional workflow relationships/internal component actor labeling or the primary Vision source reference.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/100-ai-recommendations/UC-100-003-discover-music-by-mood-and-context.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/100-ai-recommendations/UC-100-003-discover-music-by-mood-and-context.md).

Before: existing UC draft with its original goal and flows; SHA-256 `6043f3576563fd5a3536de9ec04e406b30cf53c449dc0d5834a75062e552c227`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Aligned playlist-detail references with existing UC-060-003; no UC file was renamed.
- Corrected conditional workflow relationships/internal component actor labeling or the primary Vision source reference.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/100-ai-recommendations/use-case-inventory.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/100-ai-recommendations/use-case-inventory.md).

Before: existing document in the PA3 comparison set; SHA-256 `59416b778b014c7470ebcd43ce48441d32ecc85b0bd9bb939851fcde025eb057`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Aligned the Feature 101 supporting actor with its history-only aggregation requirement.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/120-ai-conversational-agent/prototypes/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/120-ai-conversational-agent/prototypes/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `657c17b1446ca6c1ca93d8749a021f899d4d9fb700c6b228e850ec64f8a5e7e8`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Fixed image example paths that incorrectly repeated the prototypes directory.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/120-ai-conversational-agent/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/120-ai-conversational-agent/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `5e1967f2f805a89b2fe697ac768b7895c24d80ce6359af50e2eb0eaf5533f5fe`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/120-ai-conversational-agent/UC-120-001-converse-with-ai-music-host.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/120-ai-conversational-agent/UC-120-001-converse-with-ai-music-host.md).

Before: existing UC draft with its original goal and flows; SHA-256 `5a16b78c639139b60c539a1520602f3dcf26a51e14410c8b22a9932416477cc7`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/120-ai-conversational-agent/UC-120-002-interpret-music-intent-via-chat.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/120-ai-conversational-agent/UC-120-002-interpret-music-intent-via-chat.md).

Before: existing UC draft with its original goal and flows; SHA-256 `a199389c3d995396a06edbcea5df30e79c6df11852b3c5eeeced4816a71e7cc4`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/120-ai-conversational-agent/UC-120-003-execute-music-actions-via-conversational-agent.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/120-ai-conversational-agent/UC-120-003-execute-music-actions-via-conversational-agent.md).

Before: existing UC draft with its original goal and flows; SHA-256 `cc70425c62afc27ac04a26d14d33afaf8b5ed1fbd8e5b65658807d70233c1539`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/120-ai-conversational-agent/UC-120-004-clear-conversation-history.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/120-ai-conversational-agent/UC-120-004-clear-conversation-history.md).

Before: existing UC draft with its original goal and flows; SHA-256 `ab4d4526327d48f6bf7be5ff1d499e5c1b4090640538d49df2468f07660ddbc3`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Added a source-backed implementation boundary and an explicit pending acceptance record, preserving the existing required flows.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/120-ai-conversational-agent/use-case-inventory.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/120-ai-conversational-agent/use-case-inventory.md).

Before: existing document in the PA3 comparison set; SHA-256 `ae4d6d829ce4806c31b9bd3df5ebd1c8b91d8f422463a6f955d763414f685204`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/README.md).

Before: existing document in the PA3 comparison set; SHA-256 `b17f68e657bed34067e1d80f4b21e95e66cadd6f134c4f840bdc3dbd2eb64b1c`.

After / affected locations:

- Restored Performed by to the PA3 responsible author under PA4-D09; retained Lê Công Minh Nhựt as editor and the Group 10 team as reviewer. Original draft credits remain available.
- Marked placeholder image examples as literal template text.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/030-search/UC-030-004-manage-local-search-history.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/030-search/UC-030-004-manage-local-search-history.md).

Before: no specification at this path in the PA3 baseline.

After / affected locations:

- Added a missing model/Vision goal as a source-linked Draft, with preconditions, trigger, basic/alternative/exception flows, postconditions, prototype provenance and pending acceptance.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/070-listening-history/UC-070-003-delete-history-record.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/070-listening-history/UC-070-003-delete-history-record.md).

Before: no specification at this path in the PA3 baseline.

After / affected locations:

- Added a missing model/Vision goal as a source-linked Draft, with preconditions, trigger, basic/alternative/exception flows, postconditions, prototype provenance and pending acceptance.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/110-admin-functions/UC-110-001-view-and-search-users.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/110-admin-functions/UC-110-001-view-and-search-users.md).

Before: no specification at this path in the PA3 baseline.

After / affected locations:

- Added a missing model/Vision goal as a source-linked Draft, with preconditions, trigger, basic/alternative/exception flows, postconditions, prototype provenance and pending acceptance.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/110-admin-functions/UC-110-002-ban-user-account.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/110-admin-functions/UC-110-002-ban-user-account.md).

Before: no specification at this path in the PA3 baseline.

After / affected locations:

- Added a missing model/Vision goal as a source-linked Draft, with preconditions, trigger, basic/alternative/exception flows, postconditions, prototype provenance and pending acceptance.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/110-admin-functions/UC-110-003-unban-user-account.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/110-admin-functions/UC-110-003-unban-user-account.md).

Before: no specification at this path in the PA3 baseline.

After / affected locations:

- Added a missing model/Vision goal as a source-linked Draft, with preconditions, trigger, basic/alternative/exception flows, postconditions, prototype provenance and pending acceptance.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/110-admin-functions/UC-110-004-manage-user-roles.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/110-admin-functions/UC-110-004-manage-user-roles.md).

Before: no specification at this path in the PA3 baseline.

After / affected locations:

- Added a missing model/Vision goal as a source-linked Draft, with preconditions, trigger, basic/alternative/exception flows, postconditions, prototype provenance and pending acceptance.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/110-admin-functions/UC-110-005-moderate-platform-tracks.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/110-admin-functions/UC-110-005-moderate-platform-tracks.md).

Before: no specification at this path in the PA3 baseline.

After / affected locations:

- Added a missing model/Vision goal as a source-linked Draft, with preconditions, trigger, basic/alternative/exception flows, postconditions, prototype provenance and pending acceptance.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/110-admin-functions/UC-110-006-moderate-platform-comments.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/110-admin-functions/UC-110-006-moderate-platform-comments.md).

Before: no specification at this path in the PA3 baseline.

After / affected locations:

- Added a missing model/Vision goal as a source-linked Draft, with preconditions, trigger, basic/alternative/exception flows, postconditions, prototype provenance and pending acceptance.
- Corrected conditional workflow relationships/internal component actor labeling or the primary Vision source reference.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/110-admin-functions/UC-110-007-view-platform-statistics.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/110-admin-functions/UC-110-007-view-platform-statistics.md).

Before: no specification at this path in the PA3 baseline.

After / affected locations:

- Added a missing model/Vision goal as a source-linked Draft, with preconditions, trigger, basic/alternative/exception flows, postconditions, prototype provenance and pending acceptance.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/110-admin-functions/UC-110-008-manage-system-and-demo-reset.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/110-admin-functions/UC-110-008-manage-system-and-demo-reset.md).

Before: no specification at this path in the PA3 baseline.

After / affected locations:

- Added a missing model/Vision goal as a source-linked Draft, with preconditions, trigger, basic/alternative/exception flows, postconditions, prototype provenance and pending acceptance.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/110-admin-functions/use-case-inventory.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/110-admin-functions/use-case-inventory.md).

Before: no specification at this path in the PA3 baseline.

After / affected locations:

- Added the missing Group 110 inventory with stable IDs, sources, review status and prototype gaps.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-cases/110-admin-functions/README.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-cases/110-admin-functions/README.md).

Before: no specification at this path in the PA3 baseline.

After / affected locations:

- Added Group 110 documentation entry point and source/implementation boundaries.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/requirements/use-case-model.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](requirements/use-case-model.md).

Before: existing document in the PA3 comparison set; SHA-256 `3e9a7b03d99809733b138235077f48ac7d7f3ec55dcebd49e89c890fced15ffd`.

After / affected locations:

- Rebuilt actor boundaries, twelve group diagrams and the catalog from actual specification files, retaining all existing IDs.
- Added missing-goal drafts, scoped include/extend semantics and source-linked implementation limits.
- Added a goal-based crosswalk for every Vision FR, including historical authentication/playlist/album IDs; removed unsupported complete-coverage and implementation/legal-certification claims.
- Split larger group diagrams into panels of at most six goals for readable PDF output; documented the Feature 065 FR alias notation.
- Consolidated source decisions, cross-feature issues and document verification into Sections 11 and 12 of this existing model.
- Updated the source-review reference to the corresponding section of the existing model.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/design/architecture/system-architecture.md
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Nguyễn Khánh Đăng

Document: [Markdown](design/architecture/system-architecture.md).

Before: existing conceptual architecture document in Vietnamese at the PA3 baseline (`35d8027`); SHA-256 `542D502530A9A67DAB9CAA2DA17AA605CA2DD2981B2C2449A7D5599276CE3A6E`.

After / affected locations:

- Replaced the outdated conceptual ASCII architecture with an English implementation-based PA4 architecture document.
- Added verified technology versions and responsibilities for the React/Vite/Tailwind frontend, Express backend, Supabase PostgreSQL persistence, Python/FastAPI AI service, Firebase Authentication, and Cloudinary media storage.
- Added the actual Python AI routes, including the SSE agent stream, recommendation, mood recommendation, lyrics search, playlist generation, and health endpoints.
- Documented integration boundaries: the frontend does not call the Python AI service directly; the AI service reads Supabase PostgREST `/rest/v1/songs`; Cloudinary supports audio delivery with byte-range requests; Spotify is offline data preparation only.
- Documented current persistence limits and fallbacks, including the saved-album RAM map, client-side Admin/History behavior, and local/mock catalog paths.
- Added a Mermaid C4 Level 1 System Context diagram with Guest/Visitor, Listener, Artist, Administrator, Supabase PostgreSQL, Firebase Authentication, Cloudinary, and Google Gemini API.
- Added English explanations for each actor and external system, plus the current backend entrypoint caveat.

Review status: source verification completed; team review remains required.

## docs/management/pa4-readiness-checklist.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Document: [Markdown](management/pa4-readiness-checklist.md).

Before: existing document in the PA3 comparison set; SHA-256 `6e8c07bee00871a371008ffc9a4045031b1b3a16aeeae4fb94f3a139fa33770d`.

After / affected locations:

- Updated only Part A and its overview assessment; kept A uncompleted and preserved all B-F content.

Review status: source/business questions, missing prototypes and final approval remain as recorded in the model and checklist.

## docs/Changes.md
Performed by: Lê Công Minh Nhựt | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Before: the existing PA3 change log at this path.

After: this file records the PA4 comparison and per-document changes; the earlier PA3 record is retained in docs/proposal/Changes.md. There is one current PA4 change log. The separate PA4 directory and its manifests/diff copies are kept only as temporary audit backups outside the repository.

The existing change log and its matching PDF were moved from `docs/PA/` to `docs/Changes.md` and `docs/Changes.pdf` so they are outside the ignored `PA/` directory and can be included on GitHub. Active model/checklist references and relative links in this log were updated; historical PA3 records remain unchanged.
