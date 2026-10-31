# Feature Specification: 053 - Reorder Queue (Sắp xếp lại hàng chờ)

> [!NOTE]
> **Contextual Note**: This specification was reconstructed and formalized based on AuraTune project requirements (Proposal, Vision Document, System Architecture, API Contract) and the existing frontend implementation in `src/frontend/src/components/player/QueuePanel.jsx` and `useMockPlayer.js`.

---

## 1. Overview & Objective

The **Reorder Queue** feature empowers listeners to customize their upcoming listening order dynamically without interrupting ongoing playback.
The queue drawer provides two complementary mechanisms for reordering:
1. **Directional Arrow Controls**: Precise, single-step `ArrowUp` and `ArrowDown` buttons on every upcoming item with accessibility labels and automated boundary disabling (top item cannot move up, bottom item cannot move down).
2. **Drag-and-Drop Handle**: A `GripVertical` handle allowing smooth dragging with active visual feedback (`ring-1 ring-violet-300/50` on hover target, reduced opacity on dragged element).

---

## 2. User Stories & Acceptance Criteria

### User Story 1: Reorder Songs Using Arrow Controls
- **As a** listener,
- **I want to** click up or down buttons on a queued song,
- **So that** I can adjust its priority step-by-step with precision.

**Acceptance Criteria:**
- Each item has an `ArrowUp` button (`aria-label="Đưa <Tên bài hát> lên"`) and `ArrowDown` button (`aria-label="Đưa <Tên bài hát> xuống"`).
- Clicking `ArrowDown` on item at index `i` swaps positions with item at index `i + 1`.
- Clicking `ArrowUp` on item at index `i` swaps positions with item at index `i - 1`.
- The top upcoming item has `ArrowUp` disabled (`disabled:opacity-30`).
- The bottom upcoming item has `ArrowDown` disabled.

### User Story 2: Drag and Drop Reordering
- **As a** listener,
- **I want to** drag a song by its grip handle and drop it into a new position,
- **So that** I can intuitively reorder my queue in a single gesture.

**Acceptance Criteria:**
- Each item displays a `GripVertical` icon with `title="Kéo để sắp xếp"`.
- Dragging an item sets its styling to `opacity-40`.
- Hovering over a drop destination renders an active ring boundary (`ring-1 ring-violet-300/50`).
- Dropping invokes `player.moveInQueue(fromIndex, toIndex)`, updating the queue state seamlessly while current playback continues without stutter.

---

## 3. Frontend Component Mapping

- **Queue Panel Component**: [`QueuePanel.jsx`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/components/player/QueuePanel.jsx)
- **Queue Reordering Logic**: [`useMockPlayer.js`](file:///F:/CSC_HCMUS/Chuyên%20ngành/NM%20SE/AuraTune/src/frontend/src/hooks/useMockPlayer.js) (`moveInQueue(from, to)`)

---

## 4. UI Screenshots

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
