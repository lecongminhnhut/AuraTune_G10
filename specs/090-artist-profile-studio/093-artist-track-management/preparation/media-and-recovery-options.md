# Media and recovery options (093 T006)

> **Integration follow-up:** [Upload/catalog/URL analysis with commit evidence](../../group-090-integration-follow-up.md#4-cloudinary-upload-catalog-and-url-behavior-actually-supported) confirms binary upload at media APIs, **no catalog commit**, and **no Cloudinary URL revocation on local hide/delete**. Available main/Player stream code rejects inactive content only at its own endpoint and redirects external audio URLs; previously copied destinations are not protected by that later check. Provider/live URL tests were not run. Runtime availability is corrected in the shared follow-up; upload/lifecycle acceptance stays open.

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

## Current code, correcting the 09 Nov review baseline

[media routes](../../../../src/backend/routes/mediaRoutes.js) authenticate once and allow Artist/Admin; [Multer parser](../../../../src/backend/middleware/mediaUploadMiddleware.js) memory-buffers single file, ≤50*1024*1024 bytes, 1 file/10 fields/11 parts. [Cloudinary adapter](../../../../src/backend/services/cloudinaryStorageService.js) uses file-type signature detection (audio/mpeg for audio), streams buffer to Cloudinary resource_type video, unique_filename true/overwrite false and returns public_id/secure_url/resource_type/bytes. [Controller](../../../../src/backend/controllers/mediaController.js) requires rightsConfirmed string true plus nonempty license and source, then returns 201 status/media/rights; errors 400 or 502. [Config](../../../../src/backend/config/cloudinary.js) names CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET (values never inspected). [SDK scripts](../../../../src/backend/scripts/testUploadAudio.js) are manual provider uploads, not Group 090 acceptance.

This proves checked-in provider/parser integration exists. It does **not** prove installed runtime, selected/accepted production architecture, configured deployment, full MP3 decode/corruption validation, quota/range behavior, current Artist linkage, catalog association or successful integration tests. Signature detection alone cannot establish a complete valid MP3. Current rights fields lack Self-owned/Licensed/Open conditional structure and attribution choice; source unconditionally required differs from D02/03. No catalog write, compensation, dedup, final auth recheck or lifecycle/access adapter found. secure_url plus absence of protected access configuration leaves direct-object bypass unresolved; no live assertion that a specific object is publicly reachable is made.

## Fault table and review oracle

| Forced point | Required outcome / missing proof |
| --- | --- |
| Invalid role/link/metadata/rights/file | Reject before provider/save, no completed side effects; exact bounded parser/MP3 policy and safe error contract. |
| Definite provider failure | No successful track; retain accessible open form, safe feedback. |
| Media success then known catalog rollback | No public partial row/object distribution; reviewed compensation/reconciliation. |
| Cleanup failure | Recoverable discrepancy with safe access denied; no false completed upload/cleanup guarantee. |
| Catalog committed, response dropped | Uncertain UI then reconcile stored result; manual retry of same submission yields one track. |
| Commit unknown, reconciliation unavailable | Remain unresolved; no blind POST repeat or false failed/saved claim. |
| Expiry/ban/revoked link during transfer | Current final authorization before publication; no reassignment to B. |
| Same bytes, two intentional submissions | Separate intents remain distinct; no hash/title-based unwanted dedup. |

## Alternatives for Hoàng/Nhựt/Đăng/Khoa/Huy review

Extend existing Cloudinary integration if actual access/revocation/range/quota and staging/cleanup capabilities satisfy constraints, versus another explicitly approved storage adapter after capability comparison. Keep stable playable association while enforcing current eligibility at all new starts; compare protected provider access with backend-controlled distribution using existing stream contract. Neither option is selected. Permanent raw reference alone does not meet hide/delete enforcement.

C09/C08/C10 closure requires accepted provider/config provenance, content validation, rights representation, protected delivery, transaction/final-auth and operation identity/reconciliation evidence with real disposable media/DB faults. No request key, operation table, TTL, parser replacement, cleanup guarantee, new route or provider is chosen by this audit. Recorded byte/type rules are evidence; full technical closure is absent.
