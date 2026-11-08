# Implementation Plan: Save and Share Albums

**Branch**: `083-save-and-share-album` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/080-album-interaction/083-save-and-share-album/spec.md`

## Summary

Implement the Feature 083 album actions using the specified `PUT /albums/:id/save` and `DELETE /albums/:id/save` contracts for account-scoped saved state, while providing Copy Link, Facebook, Instagram, X, and Zalo sharing for any visitor. Keep saved state tied to the active account and update it only after server confirmation. Pending actions retain the last confirmed state; failures show action-specific inline feedback. Shared album URLs continue to use the existing album route and its current access rules. Do not introduce an API response shape, persistence schema, quota, or share-provider mechanism that the project has not approved.

## Technical Context

**Language/Version**: JavaScript ES modules; React 18.3.1 and Vite 5.4.11 frontend; Node.js/Express backend.

**Primary Dependencies**: Existing `AlbumPage`, `LibraryPage`, `AppStore`, `PlayerContext` sharing callback, `share.js`, route/navigation helpers, and `sessionApiClient.js` authenticated fetch infrastructure. No additional package is currently required or selected.

**Storage**: Existing account-scoped library state in `AppStore` is currently held in browser local storage for the demo. The feature spec requires server-confirmed account state through the specified save/remove endpoints; the backend service and its persistent storage implementation are not present in the inspected backend routes. No schema is proposed here.

**Testing**: Component and integration coverage for save/remove transitions, per-account isolation, authorization, error/retry feedback, current Saved Albums removal, and all share destinations and URL routing. Frontend and backend package scripts do not declare a test runner; confirm the repository's actual test harness before selecting runnable commands.

**Target Platform**: Responsive web application in desktop and mobile browsers.

**Project Type**: Web application with `src/frontend` and `src/backend` projects.

**Performance Goals**: Keep action feedback immediate and clear while waiting for network confirmation; do not present optimistic saved state as confirmed. The spec sets no numeric latency objective.

**Constraints**: Use only the specified save/remove methods and paths; require sign-in for personal library changes but allow sharing while signed out; preserve last confirmed state while pending or after errors; do not add a feature-specific quota; honor existing album route access rules; share must identify the same album; avoid cross-account saved-state leakage.

**Scale/Scope**: Album action toolbar, account-specific saved-state access and mutation, currently open Saved Albums list update, and album sharing controls/feedback. Group 010 authentication and the Album Details destination remain dependencies, not redesign targets.

## Constitution Check

`.specify/memory/constitution.md` is an unfilled template with placeholder principles and governance. There are no ratified constitution gates to evaluate. This plan uses the feature spec and current repository behavior as evidence and records missing project decisions below; re-evaluate if approved constitution guidance is supplied.

## Project Structure

### Documentation (this feature)

```text
specs/080-album-interaction/083-save-and-share-album/
├── spec.md
└── plan.md
```

### Source Code (repository root)

```text
src/frontend/src/
├── App.jsx                                      # Shared share callback and toast wiring
├── pages/Album/AlbumPage.jsx                    # Save/share album toolbar actions
├── pages/Library/LibraryPage.jsx                # Saved Albums collection and list rendering
├── context/AppStore.jsx                         # Current user library state and album lookups
├── services/sessionApiClient.js                 # Existing authenticated API fetch infrastructure
├── utils/share.js                               # Existing Web Share API / clipboard fallback
├── utils/navigation.jsx                         # Existing client route handling
└── routes/AppRouter.jsx                         # Existing /album/:id destination route
src/backend/
├── server.js                                    # Currently mounts health and auth endpoints only
└── routes/                                      # Currently contains auth routes only
```

**Structure Decision**: Keep action controls and their local UI state in the existing album/library surfaces, use the shared session API client for authenticated mutations, and keep album URL routing on the existing `/album/:id` route. Implement API server behavior only after the specified contract's owner and current server/persistence boundary are confirmed. Do not place share logic inside the player merely because the current AlbumPage calls `player.share`; that existing callback can be refactored or reused without expanding the Music Player feature.

## Technical Approach

1. **Saved state read and account scope**: Derive the saved/unsaved state for the active account from the confirmed server-backed library state. `AppStore` currently exposes `library.savedAlbumIds` and `isAlbumSaved`, but that state is a local demo store. The requester selected reusing an already approved server-backed library read contract; none was located in the inspected client or backend, so the API owner must identify that contract before implementation. Hydrate the existing store from that source without changing its public meaning for other consumers. On account switch, render only the new account's confirmed saved state; do not add a new read endpoint in this feature plan.
2. **Save/remove mutation**: Use the authenticated `sessionApiClient` with its existing API base (`VITE_API_BASE_URL`, defaulting to `http://localhost:5000/api/v1`) and call the specified relative paths `PUT /albums/:id/save` and `DELETE /albums/:id/save`. This resolves the client-side base-path choice; the backend must expose the corresponding routes under that base. Do not assume request body, response fields, status codes beyond success/failure, or idempotency guarantees. Keep the last confirmed UI state while pending, disable the relevant control and show progress, then update the store and view only after confirmed success. Prevent duplicate in-flight clicks. If authorization expires, use the existing session refresh/revocation and sign-in flow.
3. **Library synchronization**: Make confirmed saves visible in the current user's Saved Albums collection. For removal from the Library page, keep the item rendered while pending; remove it from the active list after confirmed success and leave it visible if the mutation fails. Reconcile account/store cache with the server result so later album-page visits reflect the confirmed state.
4. **Inline failure feedback**: Present a concise action-specific inline message adjacent to the save/remove/share control. Provide a retry hint where appropriate and never show a success toast/state for a failed or cancelled operation. Existing app-level `Toaster` is not by itself sufficient for this requirement; reuse shared styling where possible while keeping the feedback near its control.
5. **Share destinations and URL**: Generate the canonical current-origin album path using the existing `/album/:id` route. Preserve separate Copy Link, Facebook, Instagram, X, and Zalo controls as required by FR-011; the requester confirmed on 2026-11-07 that Web Share API plus clipboard is not a replacement for those four destinations, and that Web Share API may be used only for generic sharing where it fits. Reuse `share.js` for Copy Link or a generic share action. The technical opening/URL mechanism for each named destination remains unspecified and must be confirmed before implementation; do not invent provider-specific URL formats or integrations in this plan.
6. **Shared-link resolution**: Keep route parsing and album lookup in `AppRouter`/Feature 081. A valid URL must open the same album; invalid or unavailable album IDs must follow the existing not-found/unavailable state and must not fall back to another album. Preserve existing access requirements; Feature 083 does not make the album public or change authentication policy.

## Components and Dependencies

| Component / dependency | Existing behavior observed | Planned responsibility / status |
| --- | --- | --- |
| `AlbumPage.jsx` | Save button calls synchronous `store.toggleSaveAlbum`; signed-out action calls `requireLogin`. Share button calls `player.share` with `/album/:id`. | Main toolbar integration; replace synchronous confirmation with pending/confirmed/error mutation behavior and expose destination controls. |
| `AppStore.jsx` | `toggleSaveAlbum` changes `savedAlbumIds` synchronously in local state; library records are account-keyed; `isAlbumSaved` checks current library. | Adapt account-specific state to confirmed API results while preserving store consumers; no optimistic success. |
| `LibraryPage.jsx` | Saved albums are derived from `store.library.savedAlbumIds` and `store.getAlbum`; component currently has no remove action in the album grid. | Add/use an unsave action in the current Saved Albums view only if needed for the specified removal scenario; preserve an item while pending and remove on success. Any cross-view action placement should remain within this feature's requirements. |
| `sessionApiClient.js` | Provides `apiFetch`, bearer token attachment, credentials, refresh and session-revocation handling; current `authApi` methods cover auth; base is configurable and defaults to `/api/v1`. | Reuse for authorized save/remove requests at the confirmed client base; add only the two specified calls after the backend owner confirms route availability and contract details. |
| `src/backend/server.js` / `routes/` | Server currently mounts `/api/v1/auth` and auth exchange routes; no album save routes were found. | Blocking integration dependency: identify the approved API owner/provider and persistence source. Do not create endpoint response/schema assumptions. |
| `share.js` / `App.jsx` | Uses Web Share API where available; otherwise copies link to clipboard; app callback shows a global toast. | Reuse URL/result handling where it fits, add destination-specific controls and required inline status. Provider mechanism remains undecided by the spec. |
| `AppRouter.jsx` / `navigation.jsx` | `/album/:id` route is handled by `AlbumPage`; navigation uses browser history and `popstate`. | Existing link destination; verify shared links identify the correct album and preserve existing access behavior. |
| Group 010 session/auth | Shared auth context and token refresh/revocation are already wired into API client. | Required for save/remove; signed-out visitor must remain able to share. Reuse current session handling. |
| Feature 081 Album Details | Existing album destination and not-found behavior. | Required link destination; avoid redefining page content or access rules. |

## Data Flow and Integration

**Save/remove**: Album or Saved Albums control → inspect active session and confirmed saved state → authenticated `apiFetch` call to the exact specified method/path → server confirms success → update account-scoped `AppStore` state and visible Library list; while pending keep previous confirmed state visible → on failure preserve state and show adjacent action-specific feedback. A session failure follows existing Group 010 refresh/revocation/sign-in handling.

**Share**: Any visitor activates a destination control → construct the canonical URL for the current album ID → Copy Link or selected destination receives that same URL → report success/failure/cancelled outcome near the share control without changing saved state. Recipient opens `/album/:id` → existing router resolves that ID through Album Details and retains its current access requirements.

The only approved save/remove interface details present in the feature artifacts are `PUT /albums/:id/save` and `DELETE /albums/:id/save`. The backend route, request/response shape, persistence owner, and provider-specific sharing mechanism were not located in the current implementation; these remain dependencies rather than proposed contracts.

## Testing Strategy

- **Saved-state UI**: unsaved/saved icons and labels; state is based on the active account; account switching never carries one user's saved IDs into another user's view.
- **Mutation lifecycle**: signed-in save and remove use the specified methods/paths; pending control is disabled and shows progress while the confirmed state stays visible; success updates album toolbar and Library; failure preserves prior state and shows action-specific inline message/retry hint; repeated clicks do not create duplicate in-flight mutations.
- **Authentication**: signed-out save/remove prompts for sign-in without changing library state; any session refresh/revocation follows the current auth client behavior; sharing remains available signed out.
- **Library removal**: item stays visible while remove is pending; disappears immediately after confirmed removal without page reload; remains after failure.
- **Share controls**: Copy Link, Facebook, Instagram, X, and Zalo are present; each receives the same canonical album URL; success, cancellation, and failure do not falsely report completion; share action does not mutate saved state.
- **Shared destination**: open a valid album URL and verify the matching album route; invalid/unavailable IDs follow the existing not-found flow without unrelated album content; current album access rules remain unchanged.
- **Integration/contract**: verify API interaction against the authoritative implementation/contract once located; do not fabricate fixtures from an undocumented response. Confirm the current test runner and supported browser mocks before tasks specify commands.
- **Acceptance traceability**: cover User Stories 1–2 and SC-001–SC-008, including cross-account isolation and server-confirmed outcomes.

## Risks and Clarifications

| Item | Status / impact | Required follow-up |
| --- | --- | --- |
| Save/remove API implementation and response contract | **Needs confirmation.** The requester selected using the existing `sessionApiClient` base (`VITE_API_BASE_URL`, default `/api/v1`) with the spec's relative save/remove paths, and an already approved server-backed library read contract for saved-state hydration. No matching album route or library-read method exists in the inspected Express server/client (the backend currently mounts auth only), and no API schema/response shape is documented in the feature artifacts. | Implement the approved relative save/remove paths through the shared API client and reuse the existing read contract once the backend owner/provider identifies it. Confirm auth requirements, result/error semantics, and persistence boundary. Do not add a read endpoint or invent new fields/schema in this feature plan. |
| Social destination mechanism | **Needs confirmation.** Spec requires separate Facebook, Instagram, X, and Zalo controls, while the use case explicitly says technical sharing mechanism is unspecified. Current helper only uses Web Share API or clipboard. The requester chose to retain the four named controls and selected Web Share API only for generic sharing; it cannot target the selected named destination itself. | Agree how each named destination opens using an approved mechanism and ensure all receive the canonical album URL. Do not add SDKs/integrations or provider URL formats without an approved decision. |
| Current spec provenance | `spec.md` begins with a contextual note that it was reconstructed from implemented UI because the original artifact was absent; its detailed requirements also require server-backed mutations, pending/error states, and four destination controls not present in the current UI. | Treat the current FRs and clarification answers as requirements, and make the implementation gap visible in task breakdown. Confirm the feature owner accepts the reconstructed spec as authoritative if there is any doubt; do not edit it in this planning task. |
| Account-specific saved state cache | Current demo state is locally stored, while the spec requires server-confirmed state and cross-account isolation. The requester selected reusing an existing server-backed library read contract, but none was located in the inspected client/backend. | Have the API owner identify the approved read contract and its refresh behavior; ensure cache invalidation on account switch/logout. Do not introduce a new read endpoint or persistence model in this feature plan. |
| Error and cancel distinctions | Spec requires inline failure feedback; Web Share cancellation currently returns a distinct `cancelled` result and is not toasted. Provider-specific behavior may produce other cancellation/error types. | Map each destination's outcomes to success, cancellation, or failure without false success; align retry wording with existing design guidance. |
| Test tooling | Frontend package exposes Vite lifecycle scripts only; backend scripts expose start/dev only. | Locate any workspace test harness before task commands are set; do not add a framework as an unapproved dependency. |
| Constitution | `.specify/memory/constitution.md` is a placeholder template. | Re-evaluate gates when ratified principles exist; this plan makes no claim of constitution approval. |

## Complexity Tracking

No constitution violation is asserted because the constitution has not been completed. No API response schema, new database schema, quota, or provider SDK is proposed. API ownership and destination mechanisms remain explicit dependencies for task planning.
