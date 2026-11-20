# US3 own list — passed local acceptance

Backend SQL/Express, [FollowingPage component](../../../../src/frontend/src/pages/Artist/FollowingPage.test.jsx) and [browser runner](../../../../src/frontend/tests/e2e/follow-artist.spec.js) jointly verify the list, router, auth and loading/error boundaries.

- Complete JSON aggregate returns every eligible own entry; PGlite test returns 1,008 rows, exceeding a 1,000-row transport cap. No client pagination prefix is taken as complete.
- Order is database created_at DESC, bigint artist_id ASC, tested at equal microsecond time with id 2 versus 9007199254740993. Browser preserves server order without locale/Date re-sorting; duplicate does not reorder, refollow gains new placement.
- Hidden-only and truly empty collections have the same ordinary empty state. Mixed lists omit unavailable profiles without placeholders, totals or old labels. Shared view joins existing Artists only; supplied FK prevents unsupported orphan/delete behavior.
- Optional targeted list read checks target visibility within the same SQL snapshot as membership. Hidden-filtered absence cannot confirm Not following.
- Initial loading, failure and incomplete protocol responses remain distinct from successful empty. Browser 500 → retry → successful empty passes. Current principal replacement supplies a new empty controller before old data can display.
- Public names/HTTP(S) images and neutral fallback link to the existing Artist route. Keyboard follow and real profile/list navigation pass; no player API is called by follow components. Mobile 390×844 has no horizontal overflow. Full supported-browser/accessibility acceptance remains separate.

Production follow consumers in ArtistPage, FollowingPage, LibraryPage and Sidebar now use server-authoritative state; delayed mock setFollow/isFollowing exports were removed after usage audit. Unrelated demo playlists/albums/history remain intact. Old demo follow rows are not imported into the database. Shared library surfaces show retry/loading instead of false empty when the personal list fails.
