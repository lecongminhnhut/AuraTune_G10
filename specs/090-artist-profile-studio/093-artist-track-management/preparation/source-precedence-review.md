# Source precedence review (093 T002)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

[093 spec](../spec.md) and [owner record](../../../../docs/requirements/use-cases/090-artist-profile-studio/README.md) remain unchanged. The latter records Thái Hoàng's 2026-11-04 choices, explicitly not group approval. C12/S04 needs written delivery precedence and independent shared review; no answered behavior is reopened as an unknown product rule.

| Topic | Original / older evidence | Recorded owner decision / required disposition |
| --- | --- | --- |
| Audio | Studio mock MP3/WAV, accept audio/*; Vision FR-090-005 MP3/FLAC and cover image | D01 MP3 only, ≤52,428,800 bytes inclusive. Align source delivery; no FLAC/WAV expansion or inferred provider. |
| Rights | Original upload fields + notice; Vision mandatory rights, Project Plan PC-04/ED-06 | D02/03 initially unchecked declaration, Self-owned/Licensed/Open, source/permission for latter two, explicit attribution choice/text. No license proof/review/legal guarantee. |
| Duration | FR-005 exact minutes:seconds | D04 entered duration, no measurement/mismatch rule. |
| Moderation | Artist active/hidden plus Group 110 controls | D05 independent restriction; own edit/preference/delete allowed, no clearing restriction/deleted restore. Admin UI conflicts do not change Artist confirmation. |
| Plays | FR-002 stats; mock sums remaining rows | D06 active excludes hidden/restricted/deleted; historical valid plays retained after deletion. Need actual source, not invented ledger. |
| Delivery | Public search/catalog exclusion | D07 block all new/repeat/direct-link starts, skip unavailable queue, started playback may finish. No chosen protocol or hard stop. |
| Recovery | Toasts/modal flows | D08 successful processing order, uncertain reconcile/manual retry, same-submission no duplicate, separate same-bytes intents. D09–D14 discard pre-submit, submitted departure not cancel, retain accessible open input/File, same-account recovery only, partial/stale states truthful. |
| Edit lengths | Mock title/album maxLength 100; four fields | D15/16 nonempty trimmed title, clearable album, catalog genre, ≤200 Unicode code points each on edit only. Upload max unspecified. |
| Later 091 supplements | 091 plan explicitly excludes additions | D17 neutral unavailable destination + return and D18 public-link copy exist; group-wide alignment still required, not automatically added to 093/091 tasks. |
| Wider Vision | Covers, lyrics/release date, listener trends/full album organization | Record deferred submission scope; no replacement, full album CRUD, moderation queue, royalty UI or broader coverage claim. |

Hoàng/Nhựt/team need accepted provenance/delivery treatment using established team process; Đăng/Khoa/Huy join affected schema/history/player contracts. Existing Cloudinary code changes evidence of integration, not source precedence, accepted contracts or provider closure. Keep S04/S10 open until dispositions are linked; exact G090-D01–D16 facts are individually retained in [source ledger](./source-and-scope-ledger.md) and relevant cases.
