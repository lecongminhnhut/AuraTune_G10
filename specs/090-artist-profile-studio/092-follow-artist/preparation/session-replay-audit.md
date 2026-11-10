# Shared session and replay audit (092 T006; reused by 093)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

## Actual control flow

[authenticateToken](../../../../src/backend/middleware/authMiddleware.js) verifies HS256 JWT user_id/session_id, current session/user, same owner, revocation, device user-agent, expiry/inactivity and current ban; role comes from current user. Missing/bad/session/banned failures use ad hoc status bodies and banned 401; storage failure 503. [Shared contract](../../../../docs/analysis-and-design/api-contract.md) requires standard envelope and banned 403/USER_BANNED. Public reads must not inherit personal auth failure.

[sessionApiClient](../../../../src/frontend/src/services/sessionApiClient.js) captures getAccessToken/refreshSession callbacks, attaches bearer and credentials:include, shares refreshInFlight, and replays once after noncredential 401 with returned accessToken. No explicit originating-account/session-generation equality guard exists before replay. AppStore configures those callbacks. FormData avoids forced JSON Content-Type. No generic network-failure retry is present; ambiguous mutation retry must not be added.

[AppStore setFollow](../../../../src/frontend/src/context/AppStore.jsx) reads stateRef.current.session.userId **inside** its 450ms timer. Reproduction by source trace: A clicks → B replaces session before timer → timer selects B library → A desired action writes B. This is a static counterexample, not an executed regression test. FollowButton also emits toast after await without origin validation.

| Scenario | Future assertions, storage and UI both required |
| --- | --- |
| A request 401 → refresh pending → B login | No replay with B token; no B write/list/toast/cache attribution. |
| A request → logout → delayed result | No private A presentation, no replay; if A commit already occurred it remains A's. |
| A replaced by new session for A | Session generation invalidates stale work; recovery only through reviewed same-origin/current authorization semantics. |
| Revoked/banned/expired mid-operation | Deny personal access; final write authorization policy must be enforced, not merely remove late UI. |
| Proven pre-write 401, same origin unchanged | Bounded existing recovery may replay under accepted C04 agreement; assert one authorized operation. |
| Committed response lost / unknown network result | Uncertain/reconcile; no automatic mutation retry, no false saved/unchanged claim. Failed reconciliation remains unresolved. |

Khoa/Hoàng must accept shared error/replay/final-authorization design with current session lifecycle. [093 draft cases](../../093-artist-track-management/preparation/session-and-draft-cases.md) add long transfer/form behavior. This audit does not repair shared client or select new auth mechanisms while C04/C01 are open.
