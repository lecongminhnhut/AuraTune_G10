# Feature Specification: Add and Remove Queue Items

**Feature Branch**: `020-home-player-queue-spec`

**Created**: 2026-10-31

**Status**: Draft — Ready for Planning

**Input**: User description: "Feature 052 lets listeners add tracks to the end of the queue and remove upcoming tracks during a listening session."

## Clarifications

### Session 2026-10-31

- Q: Where is the queue stored? → A: On the client, for the current session. The API Contract has no queue endpoints, so the queue does not survive a page reload and does not sync across devices.
- Q: Can a track be in the upcoming list twice? → A: No. Adding a track already upcoming changes nothing, and the listener is told.
- Q: Can the current track be removed? → A: No. Only upcoming tracks can be removed.
- Q: Can several tracks be added at once? → A: Yes. Tracks already upcoming and unavailable tracks are skipped, and the listener sees how many were added.
- Q: Can an already played track be added again? → A: Yes. It moves to the end of the queue.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a Track to the Queue (Priority: P1)

As a listener, I want to add a track to my queue so that it plays later without interrupting the current track.

**Why this priority**: Adding tracks is the main way listeners shape a session.

**Independent Test**: Add a track from a list and confirm it appears last in the queue.

**Acceptance Scenarios**:

1. **Given** a track in any list, **When** I select add to queue, **Then** it appears at the end and I see a confirmation.
2. **Given** the track is already upcoming, **When** I add it, **Then** the queue does not change and I am told.
3. **Given** a track is playing, **When** I add another, **Then** playback is not interrupted.

---

### User Story 2 - Remove a Track (Priority: P1)

As a listener, I want to remove an upcoming track so that I do not hear it in this session.

**Why this priority**: Removal gives listeners control of the session.

**Independent Test**: Remove a track and confirm the list and count update.

**Acceptance Scenarios**:

1. **Given** an upcoming track, **When** I select remove, **Then** it leaves the list and the count decreases.
2. **Given** the last upcoming track, **When** I remove it, **Then** the empty state appears.

---

### Edge Cases

- **Unavailable track**: It cannot be added, and the listener is told.
- **Adding the current track**: The queue does not change, and the listener is told.
- **Batch with existing tracks**: Only new tracks are added.
- **Batch with nothing new**: The listener is told nothing was added.
- **Removing during a transition**: The next track follows the updated list.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow adding a track to the end of the queue from track menus and the full player.
- **FR-002**: The system MUST confirm each add action.
- **FR-003**: The system MUST NOT create duplicate upcoming tracks.
- **FR-004**: The system MUST inform the listener when a track is already upcoming or playing.
- **FR-005**: The system MUST move an already played track to the end when it is added again.
- **FR-006**: The system MUST refuse to add unavailable tracks and inform the listener.
- **FR-007**: The system MUST allow adding several tracks at once and report the number added.
- **FR-008**: The system MUST allow removing any upcoming track.
- **FR-009**: The system MUST NOT allow removing the current track.
- **FR-010**: The system MUST update the list and count immediately after each change.
- **FR-011**: The system MUST NOT interrupt playback when the queue changes.

### Key Entities *(include if feature involves data)*

- **Queue Item**: A track reference in the queue.
- **Queue Feedback**: The confirmation or notice shown after an action.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An added track appears at the end of the queue in 100% of test runs.
- **SC-002**: Zero duplicate upcoming tracks in all test runs.
- **SC-003**: 100% of queue changes leave playback uninterrupted.
- **SC-004**: Adding a track takes 2 interactions from a track list.

## Assumptions

- Authentication and user roles are provided by group `010-authentication`.
- API alignment: Queue edits are client-side and need no API.
- Project documentation is maintained in English Markdown, in accordance with `docs/management/team-contract.md`.

### Known Gaps in the Current Prototype

These gaps do not change the requirements. They record where the current UI differs from this specification.

- Adding a single unavailable track is not blocked in the prototype; only batch adds filter them.

## UI Screenshots

| # | Screenshot Filename | Workflow Step / State | UI Elements & Components |
|---|---------------------|------------------------|---------------------------|
| 1 | [`01-track-menu-add-to-queue.png`](ui/01-track-menu-add-to-queue.png) | Track Context Menu with Add to Queue Option | Song row ("Bước qua mùa cô đơn"), TrackMenu portal popover, highlighted "Thêm vào danh sách chờ" action |
| 2 | [`02-add-to-queue-toast-feedback.png`](ui/02-add-to-queue-toast-feedback.png) | Toast Notification on Add to Queue | Bottom-left toast message: `"Đã thêm “Bước qua mùa cô đơn” vào danh sách chờ."`, active charts table |
| 3 | [`03-queue-after-adding-song.png`](ui/03-queue-after-adding-song.png) | Queue Panel Reflecting New Song | QueuePanel drawer open, upcoming counter ("Tiếp theo · 1"), newly added song card displayed |
| 4 | [`04-queue-remove-item-action.png`](ui/04-queue-remove-item-action.png) | Queue Item Removal Button Hover | Queue item row, focused remove button (`aria-label="Xóa Bước qua mùa cô đơn khỏi danh sách chờ"`), hover styling |
| 5 | [`05-queue-after-removing-song.png`](ui/05-queue-after-removing-song.png) | Queue After Song Removal | QueuePanel updated with song removed, upcoming counter ("Tiếp theo · 0"), empty state placeholder |

### Detailed Screenshot Descriptions

#### 1. Track Context Menu with Add to Queue Option
- **Path**: `ui/01-track-menu-add-to-queue.png`
- **State**: Track options menu `...` open on the Charts table.
- **Description**: Displays the dropdown menu triggered by the options button on "Bước qua mùa cô đơn" by Vũ. The menu item "Thêm vào danh sách chờ" (`ListEnd` icon) is highlighted on hover.

#### 2. Toast Notification on Add to Queue
- **Path**: `ui/02-add-to-queue-toast-feedback.png`
- **State**: Immediately after selecting "Thêm vào danh sách chờ".
- **Description**: Shows the prominent toast notification at the bottom of the screen displaying `"Đã thêm “Bước qua mùa cô đơn” vào danh sách chờ."`, verifying immediate user feedback.

#### 3. Queue Panel Reflecting New Song
- **Path**: `ui/03-queue-after-adding-song.png`
- **State**: Queue panel opened following track addition.
- **Description**: Demonstrates the QueuePanel state showing "Tiếp theo · 1" and the queued song "Bước qua mùa cô đơn" listed in the upcoming queue.

#### 4. Queue Item Removal Button Hover
- **Path**: `ui/04-queue-remove-item-action.png`
- **State**: User hovering over the removal icon (`X`) on the upcoming track item.
- **Description**: Highlights the delete/remove button (`button[aria-label="Xóa Bước qua mùa cô đơn khỏi danh sách chờ"]`) with transition styling (`hover:text-rose-300`).

#### 5. Queue After Song Removal
- **Path**: `ui/05-queue-after-removing-song.png`
- **State**: Instant UI update upon clicking the remove button.
- **Description**: Shows the QueuePanel refreshed with the item removed, the count decremented to 0, and the empty state placeholder rendered.
