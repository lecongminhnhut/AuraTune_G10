# Feature Specification: View Queue

**Feature Branch**: `020-home-player-queue-spec`

**Created**: 2026-10-31

**Status**: Draft — Ready for Planning

**Input**: User description: "Feature 051 lets listeners see the current track and the tracks that will play next, without interrupting playback. Editing the queue belongs to features 052 to 054."

## Clarifications

### Session 2026-10-31

- Q: Where is the queue stored? → A: On the client, for the current session. The API Contract has no queue endpoints, so the queue does not survive a page reload and does not sync across devices.
- Q: What does the queue panel show? → A: A now-playing area and an ordered list of upcoming tracks with their count.
- Q: Where does a queue come from? → A: Starting a collection such as a playlist, album, chart, or result list sets that collection as the queue.
- Q: Can a listener jump to an upcoming track? → A: Yes. Selecting a track's play action plays it immediately.
- Q: Can all upcoming tracks be cleared at once? → A: Yes, and the current track keeps playing.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open the Queue (Priority: P1)

As a listener, I want to open the queue from the player so that I can see what is coming next.

**Why this priority**: Viewing the queue is the base for every other queue action.

**Independent Test**: Open and close the panel during playback and confirm playback continues.

**Acceptance Scenarios**:

1. **Given** the player is visible, **When** I select the queue control, **Then** the queue panel opens.
2. **Given** the panel is open, **When** I use close, the backdrop, or Escape, **Then** it closes and playback continues.

---

### User Story 2 - Inspect Current and Upcoming Tracks (Priority: P1)

As a listener, I want to see the current and upcoming tracks so that I know the order.

**Why this priority**: A visible queue is required by the Vision Document.

**Independent Test**: Start a playlist and compare the panel with its order.

**Acceptance Scenarios**:

1. **Given** a track is playing, **When** I open the panel, **Then** it shows that track's cover art, title, and artist.
2. **Given** tracks are queued, **When** I open the panel, **Then** I see the upcoming count and the ordered list.
3. **Given** an upcoming track, **When** I select its play action, **Then** it plays immediately.

---

### User Story 3 - Empty Queue and Clear All (Priority: P2)

As a listener, I want a clear empty state and a way to clear the queue so that I can start over.

**Why this priority**: Clearing is a convenience after the main view works.

**Independent Test**: Clear the queue and confirm the empty state appears.

**Acceptance Scenarios**:

1. **Given** tracks are queued, **When** I select clear all, **Then** the list empties and the current track continues.
2. **Given** nothing is queued, **When** I open the panel, **Then** I see guidance on adding tracks and no clear action.

---

### Edge Cases

- **Track changes while open**: The panel updates immediately.
- **Last track playing**: The upcoming list is empty.
- **Long titles**: Text is truncated without breaking the layout.
- **Many tracks**: The list scrolls inside the panel.
- **Page reload**: The queue resets to the default state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow opening the queue panel from the player.
- **FR-002**: The system MUST show the current track with cover art, title, and artist.
- **FR-003**: The system MUST show upcoming tracks in playback order with their count.
- **FR-004**: The system MUST set a collection as the queue when a listener starts it.
- **FR-005**: The system MUST allow playing an upcoming track immediately.
- **FR-006**: The system MUST allow clearing all upcoming tracks without stopping the current track.
- **FR-007**: The system MUST show guidance when no tracks are upcoming and hide the clear action.
- **FR-008**: The system MUST allow closing the panel by a control, the backdrop, and the Escape key.
- **FR-009**: The system MUST NOT interrupt playback when the panel opens or closes.
- **FR-010**: The system MUST update the panel immediately when the current track changes.
- **FR-011**: The system MUST keep the queue for the current session on the client.

### Key Entities *(include if feature involves data)*

- **Queue**: The ordered tracks for the current session.
- **Upcoming Tracks**: Queue tracks positioned after the current track.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The panel opens in 1 interaction from the player.
- **SC-002**: The displayed order matches playback order in 100% of test runs.
- **SC-003**: Zero playback interruptions when opening or closing the panel.
- **SC-004**: The upcoming count matches the list in all test runs.

## Assumptions

- Authentication and user roles are provided by group `010-authentication`.
- API alignment: No queue endpoints exist in the API Contract, as noted in `docs/design/architecture/feature-modules.md`.
- Project documentation is maintained in English Markdown, in accordance with `docs/management/team-contract.md`.

### Known Gaps in the Current Prototype

These gaps do not change the requirements. They record where the current UI differs from this specification.

- The queue panel opens as a modal, so the page behind it cannot be used while it is open.

## UI Screenshots

| # | Screenshot Filename | Workflow Step / State | UI Elements & Components |
|---|---------------------|------------------------|---------------------------|
| 1 | [`01-queue-button-entry.png`](ui/01-queue-button-entry.png) | Bottom Player Queue Entry Point | BottomPlayer control dock, queue toggle button (`aria-label="Danh sách chờ"`), active track info |
| 2 | [`02-queue-panel-overview.png`](ui/02-queue-panel-overview.png) | Queue Panel Overview | Queue drawer dialog (`aria-labelledby="queue-title"`), header "Danh sách chờ", close button, "Đang phát" card, "Tiếp theo · 9" list |
| 3 | [`03-queue-current-and-upcoming.png`](ui/03-queue-current-and-upcoming.png) | Current Track & Upcoming Items Detail | Violet now-playing card, upcoming list items with drag handle (`GripVertical`), cover art, title, artist, reorder & remove actions |
| 4 | [`04-queue-empty-state.png`](ui/04-queue-empty-state.png) | Empty Queue State | Empty queue dashed container with informational guidance text, "Đang phát" card preserved |

### Detailed Screenshot Descriptions

#### 1. Bottom Player Queue Entry Point
- **Path**: `ui/01-queue-button-entry.png`
- **State**: Persistent bottom player rendered at the bottom edge of the viewport (1440x900).
- **Description**: Displays the persistent player controls with the Queue toggle button (`aria-label="Danh sách chờ"`) highlighted on hover. Current track "Nàng thơ" by Hoàng Dũng is actively playing.

#### 2. Queue Panel Overview
- **Path**: `ui/02-queue-panel-overview.png`
- **State**: Queue panel open with darkened backdrop overlay (`bg-black/45 backdrop-blur-[2px]`).
- **Description**: The right-aligned drawer presents the header "Danh sách chờ", close icon `X`, the "Đang phát" section containing the active track, and the "Tiếp theo · 9" header with "Xóa tất cả" action and upcoming list items.

#### 3. Current Track & Upcoming Items Detail
- **Path**: `ui/03-queue-current-and-upcoming.png`
- **State**: Focus and hover on upcoming track item in QueuePanel.
- **Description**: Demonstrates the item hierarchy in the upcoming list: reorder grip handle, cover art with quick play button overlay, track title, artist name, and action buttons (`ArrowUp`, `ArrowDown`, `X`).

#### 4. Empty Queue State
- **Path**: `ui/04-queue-empty-state.png`
- **State**: Upcoming queue cleared.
- **Description**: Displays the empty state dashed container informing the user that the queue is empty and guiding them to add songs using the track options menu `...`.
