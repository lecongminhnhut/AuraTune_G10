# US1 follow — passed local acceptance

Owner decisions are in [accepted design](../preparation/accepted-design.md); wire behavior is [OpenAPI](../contracts/follow-artist-api.json). The three existing endpoints are implemented. No follower total or new public personal field.

Evidence: [SQL invariant tests](../../../../src/backend/tests/follow-persistence.test.js), [Express/auth tests](../../../../src/backend/tests/follow-auth.test.js), [service tests](../../../../src/frontend/src/services/followArtistService.test.js), [control tests](../../../../src/frontend/src/components/artist/FollowButton.follow.test.jsx), [browser journey](../../../../src/frontend/tests/e2e/follow-artist.spec.js).

Verified: anonymous 091 remains usable; personal state starts unresolved; complete same-snapshot target/list recognition supplies truthful positive/negative state; malformed/partial/error responses do not become Not following. Public own PUT yields one persisted pair, duplicate leaves its time/order unchanged, later login/reload retains membership. User/Artist/Admin use only their own account; guest/banned/bad-session/forged-owner requests are denied. Hidden/unreviewed/banned-linked/dangling/unknown targets cannot be followed through the shared view. Browser keyboard follow → own list → profile → reload passes. Duplicate never produces a new-relation/count claim. Failed/uncertain acknowledgement is reconciled, not assumed rolled back.

The original mock follow control was replaced by 092's extracted component. Public name/image/biography request remains independent of personal auth and retains the exact 091 four-field DTO. No catalog or player selection behavior was added.
