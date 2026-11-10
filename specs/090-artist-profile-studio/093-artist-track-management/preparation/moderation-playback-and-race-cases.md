# Moderation, playback and race cases (093 T007)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

Sources FR-006–010/SC-003, G090-D05–D08; [shared model](../data-model.md). Use current authorized owned X with metadata M, preference P, independent restriction R and valid historical total H. Fields are conceptual.

| Successful processing history / fault | Expected invariant |
| --- | --- |
| Metadata M1 → metadata M2 (responses reversed) | Last applicable success M2; protected owner/media/history/preference/restriction unchanged. |
| Hide → stale metadata save | Remains hidden; no object-spread overwrite of preference. |
| Admin restrict → Artist restore | Preference may active but restriction stays; no false public-again toast or playable result. |
| Delete → late edit/restore/finalize/Admin unrestrict | No resurrection; exact missing/no-op response per accepted contract. |
| Opposing valid preferences or restrict/unrestrict | Database successful processing order governs; failure no saved changes. |
| Valid play records → hide/delete racing more valid records | Approved history acceptance boundary preserves valid plays, no subtraction/lost count; fresh catalog excludes ineligible. |

Playback matrix after hide/delete: new direct player, playlist, queue selection, repeat/replay and known raw URL requests (full 200, Range 206, cache/reused reference) denied; unavailable queued item skipped; already-started playback may finish. No global hard stop, extra subscription or browser refresh rule. New starts must recheck current eligibility beyond filtered catalog rows.

[App](../../../../src/frontend/src/App.jsx) checks local isPlayable on explicit play/collection, [playback helper](../../../../src/frontend/src/utils/playback.js) owns next/repeat, [QueuePanel](../../../../src/frontend/src/components/player/QueuePanel.jsx) presents queue; [AppStore](../../../../src/frontend/src/context/AppStore.jsx) status is shared local mock state. Backend has no song stream/repository/current lifecycle enforcement. C08/C09/C10/C12 need atomic branch/write design and byte-range/cache tests. Hoàng/Đăng coordinate 090/110 schema and search; Huy player/queue/stream; Khoa history/playlists. Do not implement peer modules or select locks/stream protocol here. After real DELETE implementation rerun these cases; deletion fixture alone is not DELETE acceptance.
