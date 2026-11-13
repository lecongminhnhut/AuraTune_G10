# Tooling and shared seams audit (093 T010)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

Reuse [runtime/manifest audit](../../091-artist-profile/preparation/tooling-audit.md), [canonical source audit](../../091-artist-profile/preparation/catalog-source-audit.md), [auth trace](../../092-follow-artist/preparation/session-replay-audit.md) and [actual media inventory](./media-and-recovery-options.md). Unlike the 09 Nov plan, Multer/file-type/Cloudinary modules and dependencies now exist. They lack accepted track orchestration/access/lifecycle and executable acceptance evidence; do not repeat the obsolete “parser absent” claim as current fact.

| Shared seam | Writer ordering / fixtures needed |
| --- | --- |
| manifests and harness | Reuse accepted 091 T009/092 T010 capability before 093 T012; choose runtime/runner once under C15. Actual tests/scripts not installed; SDK spikes not feature suites. |
| auth middleware / session client | 092 C04 shared design before 093 T014/T015; serialize edits, preserve public 091 independence. |
| artist identity/catalog source | 091 T011 canonical resolver; accepted 093 T016/T017 mappings consume same source; no guessed catalog migration. |
| song repository/service/controller/routes/server | No current song modules or stream handler. Read/role foundation → upload → preference → metadata → delete as tasks require; mount only accepted routes before fallback. |
| media adapter | Existing Cloudinary seam is candidate evidence; T035 → delivery T045 → cleanup T057 must satisfy accepted C09/C10; parser/content behavior reviewed jointly. |
| StudioPage/AppStore/private service/hook | Account/session-keyed state then authorized read/mutations; one writer, no store rewrite or mock success as production. |
| player/queue/history/search/Group 110 | Huy/Hoàng/Đăng/Khoa own current availability, ranges/cache, atomic restriction, history/delete consistency. No peer code inferred implemented. |

C15 fixture approval needs disposable synthetic linked/unlinked A/B accounts, owned/foreign/standalone/co-credit/hidden/restricted/deleted tracks, original history, catalog > cap and deterministic commit/fault barriers. Media fixtures must have permitted provenance and real valid/corrupt MP3 boundaries; no external credentials or live provider test called. Proposed task destinations remain proposals until harness and exact scripts/layout accepted.
