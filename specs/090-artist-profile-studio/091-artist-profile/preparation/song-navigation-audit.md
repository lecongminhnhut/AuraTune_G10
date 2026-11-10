# Existing song navigation audit (091 T006)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

- [AppRouter](../../../../src/frontend/src/routes/AppRouter.jsx) supports /artist/:id, /album/:id, /playlist/:id, /following and /studio; no song route. Matched IDs call decodeURIComponent without local error boundary.
- [SongRow](../../../../src/frontend/src/components/song/SongRow.jsx): title, cover and play button call onPlay(track); album/artist names link existing routes. This is a callback, not proof of navigation to a reviewed song destination.
- [ArtistPage](../../../../src/frontend/src/pages/Artist/ArtistPage.jsx) passes player.playTrack(item, featured). [App](../../../../src/frontend/src/App.jsx) checks store.isPlayable and delegates to existing player; collection queue filtered locally. Inspecting this seam shows local unavailable toast, not a server authorization proof.
- [share helper](../../../../src/frontend/src/utils/share.js) trackSharePath returns album?track=ID or search?q=title. These are share destinations, not evidence that FR-015 selected-song handoff is accepted. shareLink uses Web Share API first, clipboard fallback; it does not prove D18's link-copy delivery alignment.
- [AlbumCard](../../../../src/frontend/src/components/playlist/MediaCards.jsx) and [PlaylistCard](../../../../src/frontend/src/components/playlist/PlaylistCard.jsx) link their existing album/playlist destinations; playback remains destination/player-owned.

C13: Hoàng/Huy need to confirm exact current selected-song destination/full-player handoff satisfies FR-015/016 and demonstrate a song becoming unavailable after render: neutral destination result, no private metadata/new play. C12 must reconcile G090-D17 return-to-profile and G090-D18 copy-link supplement with 091's exclusion before any extra UI/route work. No new song route or player behavior chosen. Album/playlist navigation tests and song callback observations remain written evidence, not browser acceptance.
