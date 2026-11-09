# Implementation Plan: Album Tracklist Playback

**Branch**: `082-album-tracklist` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/080-album-interaction/082-album-tracklist/spec.md`

## Summary

Extend the existing album page so listeners can browse the complete album tracklist in catalog order, start the album or a selected track, and use AuraTune's shared player and queue. Keep unavailable tracks visible with their reason, omit them from playback sequences, preserve the complete list for long albums, and retain player state across navigation. The playback and queue semantics must follow the feature's clarified behavior once the conflicting statements in the spec are reconciled; this plan does not define a new player, queue, API, or data schema.

## Technical Context

**Language/Version**: JavaScript ES modules; React 18.3.1 and Vite 5.4.11 in the frontend; Node.js/Express backend.

**Primary Dependencies**: Existing album page, application store/playability checks, `useMockPlayer`, `PlayerContext`, `SongTable`/`SongRow`, persistent `BottomPlayer`, and `QueuePanel`. No new package is established by current frontend dependencies.

**Storage**: Existing in-memory application/player state. The Group 050 queue use case describes browser-local persistence for manual queue updates; implementation must confirm the active queue feature's approved persistence behavior and apply it through shared player/queue functions. No new database schema is proposed.

**Testing**: Acceptance and integration tests for ordered track rendering, player/queue state transitions, unavailable tracks, shuffle, repeated album play, and navigation persistence. The frontend `package.json` provides only Vite build/dev/preview scripts; test runner and test commands need confirmation from the repository's existing test setup.

**Target Platform**: Responsive AuraTune web application (desktop, tablet, and mobile browser layouts).

**Project Type**: Web application with `src/frontend` and `src/backend` projects.

**Performance Goals**: Keep the complete ordered album data available to playback for long albums (including 100+ tracks) while allowing progressive row rendering. Playback must not depend on whether a row has rendered.

**Constraints**: Reuse the shared Music Player and Queue Management interfaces; do not implement a second player or change Group 040/050 specifications. Use catalog ordering and playability state; do not create ordering fields, API shapes, database schema, or behavior for other groups. Respect the resolved queue semantics, preserve current playback for append-to-queue, disable Shuffle for Play Album, and avoid duplicate album entries on repeated play.

**Scale/Scope**: Feature 082's album tracklist UI and its integration calls into the existing player and upcoming queue. No work on Album Details (081), Save/Share Album (083), or other feature groups.

## Constitution Check

`.specify/memory/constitution.md` contains unfilled template placeholders rather than ratified principles. As a result, there are no approved constitution gates to evaluate. This plan records the concrete repository and feature constraints; re-evaluate if ratified constitution guidance becomes available.

## Project Structure

### Documentation (this feature)

```text
specs/080-album-interaction/082-album-tracklist/
├── spec.md
└── plan.md
```

### Source Code (repository root)

```text
src/frontend/src/
├── App.jsx                              # Shared PlayerContext wiring and player actions
├── pages/Album/AlbumPage.jsx            # Existing album tracklist and playback controls
├── components/song/SongTable.jsx        # Existing ordered track rows
├── components/song/SongRow.jsx          # Per-track display and play affordance
├── components/player/BottomPlayer.jsx   # Persistent player presentation
├── components/player/QueuePanel.jsx     # Existing upcoming queue controls
├── context/AppStore.jsx                 # Album catalog and playability/track status
├── context/PlayerContext.jsx            # Shared player context contract
├── hooks/useMockPlayer.js               # Current playback, collection, and queue state operations
└── utils/playback.js                    # Existing playback selection/advance helpers
```

**Structure Decision**: Work within the current Album page and invoke shared player operations through `PlayerContext`; adjust the existing player hook only where necessary to support the clarified, approved interaction. `QueuePanel` and persistent player remain Group 050/040-owned surfaces; reuse and validate their existing behavior rather than redesigning them.

## Technical Approach

1. **Tracklist presentation and ordering**: Use the complete ordered album tracks supplied by the current catalog/store as the source list. Render all tracks in that order using the existing `SongTable`/`SongRow` presentation. Long lists may progressively render, but the full collection must remain available to playback actions. Preserve the empty state and suppress Play Album when the list has no playable tracks.
2. **Availability**: Use the existing store's playability/status source to mark unavailable rows visibly disabled with the existing generic unavailable message. Filter unavailable tracks only when constructing playback sequences; do not remove them from the visible tracklist. If no track can play, show the no-available-tracks state and leave the player and queue unchanged. For a track that becomes unavailable at activation, use the approved Group 040 failure/recovery contract to continue only with remaining playable album tracks; never substitute an unrelated track. The current prototype's generic refusal toast alone does not satisfy this recovery requirement.
3. **Play Album**: Resolve the complete ordered list and current availability, turn Shuffle off, then start the first playable track and make the remaining playable album tracks the next sequence according to the queue policy confirmed in the spec. On repeated activation, restart at the first playable album track and rebuild the album segment without duplicates while preserving tracks outside the album as required by the clarified policy.
4. **Selected track**: Start the selected playable track as current and make only later playable tracks from the same album follow it in the upcoming sequence, before pre-existing upcoming tracks. Tracks preceding the selected item are not added by this action. A failed/unavailable selected item uses existing player error handling and does not start a substitute.
5. **Add all to queue**: Invoke the existing bulk queue operation with playable album tracks in album order; current playback continues. Reconcile its existing duplicate handling and queue capacity behavior with Group 050's approved rules before implementation. Do not silently truncate if that would violate Feature 082's complete sequence requirements; raise the conflict for resolution.
6. **Persistent playback and controls**: Preserve the current global player state in `App.jsx` across route changes. The `BottomPlayer` remains available, and the `QueuePanel` remains the surface for viewing/editing upcoming tracks. Do not implement parallel player state inside `AlbumPage`.

## Components and Dependencies

| Component / dependency | Existing behavior observed | Planned role / dependency |
| --- | --- | --- |
| `AlbumPage.jsx` | Currently selects album tracks from `AppStore.publicTracks`, which excludes non-active tracks, then invokes play/collection and add-many actions | Select the complete album set from `AppStore.allTracks` in catalog order and consult track status/playability separately so unavailable rows remain visible; pass the complete ordered set to playback actions. |
| `SongTable.jsx` / `SongRow.jsx` | Renders rows in supplied array order and exposes row play callbacks; current rows have no disabled/reason presentation props | Reuse for tracklist and add feature-scoped disabled-state and unavailable-reason presentation while keeping existing consumers' default behavior unchanged. |
| `App.jsx` / `PlayerContext.jsx` | Wraps routes in shared player context and provides `playTrack`, `playCollection`, `addManyToQueue` wrappers with playability filtering | Existing integration boundary; reuse and extend only as required for album-specific semantics. |
| `useMockPlayer.js` | `playCollection` starts first collection track and installs a collection queue; `addManyToQueue` appends non-current/non-upcoming tracks; shuffle is player state; queue advancement does not consult `AppStore` playability | Current behavior does not fully encode the album queue policies and has no availability-aware playback recovery contract; likely core change surface, contingent on spec resolution and Group 040 confirmation. |
| `QueuePanel.jsx` | Displays current track and upcoming tracks; supports play-now, remove, reorder, clear | Validate that resulting album sequence is editable through existing queue controls. |
| `BottomPlayer.jsx` | Persistent global playback bar | Validate playback remains visible and controllable after navigating away. |
| `AppStore.jsx` | Provides `allTracks`, `publicTracks`, `isPlayable`, and `trackStatus`; `publicTracks` filters status to `active`, while `allTracks` retains catalog tracks | Use `allTracks` for the visible album list and `isPlayable`/`trackStatus` for playback eligibility; do not infer a new availability taxonomy. |
| Group 050 queue rules | Bulk add, duplicates, queue capacity and ordering are defined in separate queue specifications/use cases | Dependency for append behavior and limits; preserve their ownership and identify conflicts rather than changing that group here. |

## Data Flow and Integration

Album route → `AlbumPage` reads the album and complete ordered track list from `AppStore` → rows render in source order, with availability state retained → listener selects Play Album, an individual playable row, or Add all to queue → the page sends the appropriate complete/remaining playable sequence to the shared player operations through `PlayerContext` → `App.jsx` applies store playability checks and the player hook updates current track/upcoming queue → `BottomPlayer` and `QueuePanel` reflect shared state across routes.

There is no new external API or data model in this plan. Current album data is mock/store-backed; if an authoritative catalog API becomes available, its ordering and availability contract must be used as already specified by the project, without designing an unsupported shape here.

## Testing Strategy

- **Tracklist rendering**: exact order and completeness; empty album; very long album including 100+ tracks; progressively rendered rows while the play action still receives the complete list.
- **Availability**: unavailable tracks remain visible and disabled with the existing generic reason; mixed availability skips unavailable tracks but plays subsequent available items; no playable tracks means no player or queue mutation; availability loss at activation invokes the approved Group 040 recovery behavior and never substitutes another album track. Keep recovery integration tests blocked until that contract is identified.
- **Play Album**: starts first playable track; loads all remaining playable tracks in order; Shuffle turns off and can later be enabled; repeated action restarts from first playable, avoids duplicates, and handles non-album queued tracks per resolved policy.
- **Selected track**: selected item becomes current; only later playable album tracks are inserted before pre-existing upcoming tracks; earlier album tracks are excluded; unavailable selection does not start another track.
- **Queue integration**: Add all appends playable items after existing upcoming items without interrupting current playback; existing queue viewing/editing works; verify capacity, duplicate policy, and any maximum against Group 050 specifications.
- **Navigation/player integration**: navigate away during album playback and verify persistent player and queue sequence remain intact.
- **Acceptance coverage**: map automated or documented acceptance scenarios to FR-001–FR-016 and SC-001–SC-009. Confirm which existing test runner can execute them before task generation.

## Risks and Clarifications

| Item | Status / impact | Required follow-up |
| --- | --- | --- |
| Play Album queue conflict | **Blocking clarification.** Spec clarification says insert remaining album tracks immediately after current and keep the existing upcoming queue after them. FR-004 says replace the playback queue with album tracks. Story 2 acceptance scenario 5 also says replace, while the same scenario's Add all branch says append. `UC-080-002` records this source conflict and says not to treat both as confirmed. The requester confirmed on 2026-11-07 that this remains blocked until the requirements owner reconciles the spec; no precedence is selected in this plan. | Resolve `spec.md`'s conflict through the requirements owner before tasks freeze queue replacement vs insertion/preservation. Do not change `spec.md` in this planning task. |
| Selected-track behavior vs repeated album sequence | Clarification defines Insert Next while FR-006 says insert later tracks before existing upcoming tracks. Repeated Play Album says preserve tracks outside the album after the rebuilt album segment. | Confirm these policies can coexist as written and define album-segment identity/duplicate handling only within existing player state; do not add a persistent schema by assumption. |
| Queue capacity / bulk append | Group 050's queue specification sets a maximum of 50 tracks; Feature 082 requires all playable tracks (including albums of 100+ tracks) to remain in the album playback sequence and Add all to queue to append all playable tracks. The requester selected retaining the 50-track limit on 2026-11-07. This leaves the complete-sequence requirement unresolved for albums exceeding the queue capacity. | Preserve the Group 050 limit. Treat the conflict with FR-004/FR-016 and SC-002/SC-009 as a requirements-level blocker; the requirements owner and Group 050 owner must reconcile the acceptance criteria before implementation. Do not silently truncate or introduce chunked queue behavior in this plan. |
| Unavailable rows and reason source | Current `AlbumPage` reads `publicTracks`, which removes non-active tracks, and `SongRow` has no disabled or reason props. `AppStore` exposes `allTracks`, `isPlayable`, and `trackStatus`; `App.jsx` currently uses a generic unavailable message when playback is refused. The requester confirmed on 2026-11-07 to use that generic message. | Use the full `allTracks` set for visibility, disable row playback based on `isPlayable`, and reuse the existing generic unavailable message. Do not invent a status taxonomy. |
| Playback failure recovery | `App.jsx` checks playability when play actions are invoked and displays a generic refusal toast. `useMockPlayer.js` queue advancement does not re-check availability and exposes no track-failure recovery callback. FR-014 requires continuing with the next playable album track when a selected track becomes unavailable at playback time. The requester confirmed on 2026-11-07 that this integration remains blocked pending the Group 040 recovery contract. | Identify the existing Group 040 player error/recovery contract and owner before defining integration tasks. Do not invent or add a shared callback contract in Feature 082. |
| Test tooling | Current frontend package has no test script and backend package lists start/dev only. | Locate existing repository test harness and fixtures before creating runnable task commands; no dependencies are added by this plan. |
| Constitution | Constitution file is an unfilled template. | No ratified gate can be evaluated; revisit when project guidance is completed. |

## Complexity Tracking

No constitution violation is asserted because the constitution contains placeholders. No new service, API contract, project, or persistence schema is proposed. Queue-policy implementation remains gated by the conflicting requirements documented above.

## Plan Execution Notes (2026-11-09)

This plan was reviewed against the Feature 082 specification and existing plan, the Spec Kit workflow and plan template, project architecture/API/database documentation, Group 040/050 specifications, and current album/player/queue source. The Spec Kit slash command is not exposed in this environment. The provided `setup-plan.sh --json` was attempted with Feature 082 explicitly selected and feature metadata persistence disabled, but Git Bash failed while creating its resolved directory (`Permission denied`). The workflow was therefore followed using the repository's plan template and the planning artifacts below are scoped to this feature directory.

The current implementation confirms that `AlbumPage` currently supplies `publicTracks` to `playCollection` and `addManyToQueue`; `App.jsx` filters playability and delegates to the shared `useMockPlayer`; `QueuePanel` and the persistent `BottomPlayer` consume that global state. The current hook has collection start and bulk-add operations but does not implement all Feature 082 policies, notably the explicit shuffle reset, album-segment replacement/insertion policy, queue-capacity enforcement, or playback-time availability recovery. These are implementation gaps and cross-feature dependencies, not authority to change Group 040/050 contracts.

The plan's queue-policy and capacity conflicts remain unresolved as already recorded in the Risks and Clarifications table. No precedence, chunking behavior, or substitute player recovery contract is introduced by these planning artifacts. Test tooling remains to be confirmed because the frontend manifest declares only Vite lifecycle scripts.
