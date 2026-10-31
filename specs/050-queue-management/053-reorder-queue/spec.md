# Feature Specification: Reorder Queue

**Feature Branch**: `020-home-player-queue-spec`

**Created**: 2026-10-31

**Status**: Draft — Ready for Planning

**Input**: User description: "Feature 053 lets listeners change the order of upcoming tracks by dragging or by step controls, without interrupting playback."

## Clarifications

### Session 2026-10-31

- Q: Where is the queue stored? → A: On the client, for the current session. The API Contract has no queue endpoints, so the queue does not survive a page reload and does not sync across devices.
- Q: Which methods are supported? → A: Drag and drop as stated in the proposal, plus up and down controls for keyboard and touch use.
- Q: Can the current track be moved? → A: No. Reordering applies only to upcoming tracks.
- Q: What happens if a track is dropped in its own position? → A: Nothing changes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Drag to Reorder (Priority: P1)

As a listener, I want to drag tracks so that I can change the order in one gesture.

**Why this priority**: Drag and drop is named in the proposal.

**Independent Test**: Drag the first upcoming track to third and confirm the order.

**Acceptance Scenarios**:

1. **Given** upcoming tracks, **When** I drag one, **Then** the dragged item and the drop target are visibly marked.
2. **Given** I drop a track, **When** the drop ends, **Then** it takes the new position and the others shift.
3. **Given** a track is playing, **When** I reorder, **Then** playback is not interrupted.

---

### User Story 2 - Reorder With Step Controls (Priority: P1)

As a listener using a keyboard or touch screen, I want up and down controls so that I can reorder without dragging.

**Why this priority**: The Vision Document requires mouse, keyboard, and touch support.

**Independent Test**: Move a track with up and down controls using only a keyboard.

**Acceptance Scenarios**:

1. **Given** an upcoming track, **When** I select down, **Then** it swaps with the track below.
2. **Given** an upcoming track, **When** I select up, **Then** it swaps with the track above.
3. **Given** the first track, **When** I view its controls, **Then** up is disabled.
4. **Given** the last track, **When** I view its controls, **Then** down is disabled.

---

### Edge Cases

- **Drop in the same position**: Nothing changes.
- **Drag cancelled**: The order stays the same.
- **Only one upcoming track**: Both step controls are disabled.
- **Current track ends during a drag**: The list updates, and the drag does not corrupt the order.
- **Touch screens**: Step controls remain available when dragging is not supported.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow reordering upcoming tracks by drag and drop.
- **FR-002**: The system MUST provide up and down controls for each upcoming track.
- **FR-003**: The system MUST mark the dragged item and the drop target during a drag.
- **FR-004**: The system MUST disable up on the first item and down on the last item.
- **FR-005**: The system MUST NOT allow moving the current track.
- **FR-006**: The system MUST NOT change the order when a track is dropped in its own position.
- **FR-007**: The system MUST use the new order for all later playback.
- **FR-008**: The system MUST NOT interrupt playback during reordering.
- **FR-009**: The system MUST give each step control an accessible name that includes the track.

### Key Entities *(include if feature involves data)*

- **Queue Position**: A track's place in the upcoming list.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Playback follows the new order in 100% of test runs.
- **SC-002**: Zero playback interruptions during reordering.
- **SC-003**: All reordering can be done with keyboard alone.
- **SC-004**: A track can be moved one step in 1 interaction.

## Assumptions

- Authentication and user roles are provided by group `010-authentication`.
- API alignment: Reordering is client-side and needs no API.
- Project documentation is maintained in English Markdown, in accordance with `docs/management/team-contract.md`.

### Known Gaps in the Current Prototype

These gaps do not change the requirements. They record where the current UI differs from this specification.

- With shuffle on, the prototype ignores the reordered sequence when choosing the next track, as defined in feature 043.

## UI Screenshots

| # | Screenshot Filename | Workflow Step / State | UI Elements & Components |
|---|---------------------|------------------------|---------------------------|
| 1 | [`01-queue-before-reordering.png`](ui/01-queue-before-reordering.png) | Queue List Initial Order | Upcoming tracks list with initial order (#1: "Bước qua mùa cô đơn", #2: "Có em"), hover on first item |
| 2 | [`02-queue-reorder-move-down.png`](ui/02-queue-reorder-move-down.png) | Move Item Down Action | Swapped queue order (#1: "Có em", #2: "Bước qua mùa cô đơn"), `ArrowDown` action executed |
| 3 | [`03-queue-reorder-move-up.png`](ui/03-queue-reorder-move-up.png) | Move Item Up Action | Hover on `ArrowUp` button (`aria-label="Đưa Bước qua mùa cô đơn lên"`), restoring position |
| 4 | [`04-queue-drag-reorder-active.png`](ui/04-queue-drag-reorder-active.png) | Drag-and-Drop Active State | Dragging interaction showing target drop highlight (`ring-1 ring-violet-300/50`), drag handle grip |

### Detailed Screenshot Descriptions

#### 1. Queue List Initial Order
- **Path**: `ui/01-queue-before-reordering.png`
- **State**: Default queue order before user reordering.
- **Description**: Demonstrates the upcoming queue sequence starting with "Bước qua mùa cô đơn" at index 0 and "Có em" at index 1. First item hovered showing controls.

#### 2. Move Item Down Action
- **Path**: `ui/02-queue-reorder-move-down.png`
- **State**: After clicking `ArrowDown` on the first item.
- **Description**: Displays the updated queue with "Có em" promoted to position #1 and "Bước qua mùa cô đơn" moved down to position #2, confirming immediate UI reordering.

#### 3. Move Item Up Action
- **Path**: `ui/03-queue-reorder-move-up.png`
- **State**: Hovering on the `ArrowUp` button for "Bước qua mùa cô đơn".
- **Description**: Highlights the `ArrowUp` button on the item at position #2, illustrating the user action to move the track back up toward the top of the queue.

#### 4. Drag-and-Drop Active State
- **Path**: `ui/04-queue-drag-reorder-active.png`
- **State**: Active drag-and-drop interaction in progress.
- **Description**: Displays the visual feedback of drag-and-drop: the target position highlights with a violet focus ring (`ring-1 ring-violet-300/50`) while the dragged element shows reduced opacity, indicating readiness to drop.
