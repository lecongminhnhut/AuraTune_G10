---
description: "Dependency-ordered implementation tasks for Save and Share Albums"
---

# Tasks: Save and Share Albums

**Input**: Design documents from `specs/080-album-interaction/083-save-and-share-album/`

**Prerequisites**: `plan.md` and `spec.md`; supporting artifacts are `research.md`, `data-model.md`, `contracts/album-save-share.md`, and `quickstart.md`.

**Tests**: The specification marks user scenarios and testing as mandatory. Confirm the repository-approved frontend test runner and API/browser fixtures before adding automated tests; do not add a test dependency without approval.

**Organization**: Tasks are grouped by the two P1 user stories. Account-backed save/remove work depends on the approved API owner and response mapping; social destination work depends on an approved invocation mechanism.

## Phase 1: Setup (Shared Prerequisites)

**Purpose**: Resolve requirements and integration dependencies without inventing payloads or provider behavior.

- [x] T001 Confirm with the feature owner whether the reconstructed `specs/080-album-interaction/083-save-and-share-album/spec.md` is the authoritative baseline alongside UC-080-003 and the clarification history; keep the provenance discrepancy as a blocker until confirmed.
- [x] T002 Identify the approved API owner and response/error mapping for `GET /users/me/saved-albums`, `PUT /albums/:id/save`, and `DELETE /albums/:id/save`, including persistence boundary and authentication requirements; do not define undocumented request or response fields.
- [x] T003 Confirm the approved invocation mechanism for Facebook, Instagram, X, and Zalo controls; ensure each uses the canonical album URL and do not invent provider URL formats or add SDKs.
- [x] T004 Confirm the repository-approved frontend test runner and API/browser fixtures from repository configuration, then record supported commands in `specs/080-album-interaction/083-save-and-share-album/quickstart.md` without adding dependencies.

---

## Phase 2: Foundational (Account-Scoped Saved State)

**Purpose**: Establish confirmed server-backed saved state and authenticated API access before save/remove UI changes.

- [x] T005 Verify that the configured backend owns the saved-albums routes; implement the approved read and mutation routes in `src/backend/routes/albumRoutes.js` and mount them in `src/backend/server.js` using the approved response envelope.
- [x] T006 Add client methods in `src/frontend/src/services/sessionApiClient.js` for the confirmed saved-albums read and specified save/remove paths, using existing bearer-token, refresh, and revocation handling without assuming undocumented payload fields.
- [x] T007 Update `src/frontend/src/context/AppStore.jsx` to hydrate the active account's saved-album state from the confirmed saved-albums read contract instead of treating local demo storage as authoritative.
- [x] T008 Update `src/frontend/src/context/AppStore.jsx` to invalidate or replace displayed saved state on account switch and logout so one account's saved album IDs are never shown for another account.

**Checkpoint**: The API owner, route mappings, and account-scoped read source are confirmed; authenticated client and store boundaries are ready for story implementation.

---

## Phase 3: User Story 1 - Save an Album to a Personal Library (Priority: P1) - MVP

**Goal**: Let signed-in listeners save/remove albums with server-confirmed account state, pending feedback, inline errors, and synchronized Saved Albums UI.

**Independent Test**: With two accounts, save and remove an album; verify only the active account changes, state updates only after server confirmation, and the current Saved Albums list reflects confirmed removal without reload.

### Tests for User Story 1

- [x] T009 [P] [US1] Validate account-specific saved-state hydration, account switching, and cross-account isolation through the approved manual walkthrough; no automated test framework is permitted.
- [x] T010 [P] [US1] Validate save/remove API methods, confirmed-state updates, pending state, duplicate-click prevention, authorization failure, and failed-request rollback through the approved manual walkthrough.

### Implementation for User Story 1

- [x] T011 [US1] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to render the unsaved Bookmark / "Save album" state and saved BookmarkCheck / "Saved" state from the active account's confirmed `AppStore` state.
- [x] T012 [US1] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to require the existing sign-in flow before a signed-out visitor can save or remove an album, without changing any library state.
- [x] T013 [US1] Update `src/frontend/src/pages/Album/AlbumPage.jsx` and `src/frontend/src/context/AppStore.jsx` to issue the specified `PUT /albums/:id/save` request and update saved state only after confirmed success.
- [x] T014 [US1] Add pending save/remove state in `src/frontend/src/pages/Album/AlbumPage.jsx` that disables the relevant action, shows progress, preserves the last confirmed state, and prevents duplicate in-flight clicks.
- [x] T015 [US1] Add the specified `DELETE /albums/:id/save` flow for album details and the current Saved Albums view in `src/frontend/src/pages/Library/LibraryPage.jsx`, keeping the item visible until removal is confirmed.
- [x] T016 [US1] Update `src/frontend/src/context/AppStore.jsx` and `src/frontend/src/pages/Library/LibraryPage.jsx` to remove a Saved Albums item from the current view after confirmed removal without reload and retain it when removal fails.
- [x] T017 [US1] Add action-specific inline save/remove failure feedback with retry guidance near the relevant control in `src/frontend/src/pages/Album/AlbumPage.jsx` and `src/frontend/src/pages/Library/LibraryPage.jsx`; preserve confirmed state and use existing session refresh/revocation/sign-in handling when authorization expires.
- [x] T018 [US1] Verify that saving another album is not blocked by a feature-specific quota in `src/frontend/src/pages/Album/AlbumPage.jsx`; leave any general platform limit to the approved service behavior.
- [x] T019 [US1] Validate FR-001 through FR-007, FR-012, FR-014, SC-001 through SC-004, SC-006 through SC-008, and the User Story 1 acceptance scenarios using `specs/080-album-interaction/083-save-and-share-album/quickstart.md`.

**Checkpoint**: Save/remove controls, album details, and Saved Albums use confirmed active-account state, with sign-in gating and correct pending/failure behavior.

---

## Phase 4: User Story 2 - Share an Album (Priority: P1)

**Goal**: Let any visitor share or copy the canonical current-origin album URL through all required controls with accurate inline outcome feedback.

**Independent Test**: As signed-in and signed-out visitors, use Copy Link and every approved social destination; verify each targets the same album and failure/cancellation does not report success or change saved state.

### Tests for User Story 2

- [x] T020 [P] [US2] Validate canonical same-origin URL generation, Copy Link, destination URL identity, signed-out sharing, and success/cancel/failure outcomes through the approved manual walkthrough.
- [x] T021 [P] [US2] Validate that a valid shared `/album/:id` URL resolves to the matching album and an invalid/unavailable ID does not show another album through the approved manual route walkthrough.

### Implementation for User Story 2

- [x] T022 [US2] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to generate the canonical current-origin `/album/:id` URL for the album being viewed without changing route access requirements.
- [x] T023 [US2] Reuse `src/frontend/src/utils/share.js` from `src/frontend/src/pages/Album/AlbumPage.jsx` for Copy Link and generic sharing, preserving success, cancellation, and failure distinctions.
- [x] T024 [US2] Add separate Facebook, Instagram, X, and Zalo controls in `src/frontend/src/pages/Album/AlbumPage.jsx` using the approved sharer links and Copy Link behavior with the same canonical album URL.
- [x] T025 [US2] Add action-specific inline share feedback near the relevant controls in `src/frontend/src/pages/Album/AlbumPage.jsx`, including retry guidance where appropriate, without reporting cancellation or failure as success or changing saved state.
- [x] T026 [US2] Verify in `src/frontend/src/routes/AppRouter.jsx` and the existing album lookup flow that a shared valid URL opens its matching album, while invalid or unavailable IDs use the existing unavailable/not-found behavior without falling back to another album.
- [x] T027 [US2] Validate FR-008 through FR-013, SC-005, SC-006, and the User Story 2 acceptance scenarios using `specs/080-album-interaction/083-save-and-share-album/quickstart.md`.

**Checkpoint**: Every visitor can share the same album URL through Copy Link and the approved named destinations without changing account state.

---

## Phase 5: Polish & Cross-Cutting Validation

**Purpose**: Validate the end-to-end experience, integration boundaries, and documented setup.

- [x] T028 Verify the responsive save/share controls and adjacent inline feedback in `src/frontend/src/pages/Album/AlbumPage.jsx` and `src/frontend/src/pages/Library/LibraryPage.jsx` against the feature screenshots and supported viewport walkthrough.
- [x] T029 Run the frontend build and confirmed Feature 083 acceptance checks listed in `specs/080-album-interaction/083-save-and-share-album/quickstart.md`; record the environment build blocker without claiming unavailable test tooling.
- [x] T030 Confirm that `src/frontend/src/context/AppStore.jsx` introduces no new persistent schema, local cache authority, response fields, or saved-album quota beyond the approved API mapping.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No source-code dependency. T001-T004 resolve the provenance, API ownership/mapping, provider mechanism, and test-harness gates.
- **Foundational (Phase 2)**: Depends on T002; the client and store must use the approved server-backed read/mutation contracts before save/remove UI work. T008 is conditional on confirmation that this backend owns the routes.
- **User Stories**: US1 depends on the confirmed API and account-scoped store. US2 depends on T003 for named destination invocation and uses the existing album route; share initiation remains independent of authentication.
- **Polish (Phase 5)**: Depends on both stories and the relevant API/provider confirmations.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2. It is the MVP for account-scoped saving and removal.
- **US2 (P1)**: Starts after Phase 1. It can proceed independently of US1 once the destination mechanism is approved; sharing must not depend on a signed-in account.

### Parallel Opportunities

- T001, T002, T003, and T004 investigate separate owners/configuration and can proceed in parallel.
- After T004, US1 state/API tests (T009-T010) can proceed in parallel. Album-toolbar work (T011-T014) and Saved Albums view work (T015-T016) can proceed in parallel after the shared store/service behavior is defined; inline feedback T017 integrates both surfaces afterward.
- US2 URL/route tests (T020-T021) can proceed in parallel. T022-T023 establish the canonical URL and Copy Link behavior before destination-specific controls T024.
- US1 and US2 can proceed in parallel after their respective prerequisites because their main UI surfaces and state concerns are distinct; integrate shared AlbumPage edits carefully.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Resolve the spec provenance and API ownership/mapping prerequisites in Phase 1.
2. Complete Phase 2 account-scoped saved-state access.
3. Complete Phase 3 and validate save, remove, authentication, account isolation, pending, and failure behavior independently.
4. Add the independent share story after its provider mechanism is approved.

### Incremental Delivery

1. Deliver confirmed account-backed save/remove behavior with the existing authenticated client.
2. Deliver canonical Copy Link and shared route resolution.
3. Add Facebook, Instagram, X, and Zalo after their approved invocation mechanisms are confirmed.
4. Validate failure/cancellation feedback and responsive behavior across both stories.

## Notes

- All tasks are scoped to Feature 083. No database schema, response shape, new read endpoint, quota, provider SDK, or provider URL format is invented.
- The API owner must supply saved-state read mapping and mutation result/error semantics before response mapping is implemented.
- The named social controls and their invocation mechanism are separate decisions; do not treat generic Web Share or clipboard as a substitute for the required destinations.
- `[P]` marks tasks that can proceed independently without conflicting file edits or unmet prerequisites.
