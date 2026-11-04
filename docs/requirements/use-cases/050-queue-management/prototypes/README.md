# Prototype and UI Asset Guide – Group 050: Queue Management

---

## 1. Purpose

This document defines the organization, conventions, and status of user interface prototypes and screenshots for **Group 050 – Queue Management**.

---

## 2. Prototype Directory Organization

All graphical assets for Group 050 reside directly in this directory:
`docs/requirements/use-cases/050-queue-management/prototypes/`

### Asset Naming Convention

$$\text{UC-050-[SEQUENCE]-[flow-indicator]-[description].png}$$

- **Basic Flow Assets**: `UC-050-[SEQUENCE]-basic-flow[-step].png`
- **Alternative Flow Assets**: `UC-050-[SEQUENCE]-AF-[NN]-[description].png`
- **Exception Flow Assets**: `UC-050-[SEQUENCE]-EF-[NN]-[description].png`

---

## 3. Prototype vs. Implementation Distinction

1. **Implementation Screenshots**: Images for `UC-050-001` to `UC-050-006` are screenshots of the current frontend prototype, copied from `specs/050-queue-management/*/ui/`. The prototype runs on demo data.
2. **Conceptual Wireframes**: Images for `UC-050-007` are grayscale wireframes created for this use case. They carry a "WIREFRAME · NOT IMPLEMENTED" label because Save as Playlist does not exist in the frontend yet.
3. **Replacement Rule**: Replace each wireframe with an implementation screenshot once the matching UI is built.

---

## 4. Prototype Inventory and Mapping

| Use Case ID | Flow / Step | Image File | Source Spec Asset | Status | Description |
|---|---|---|---|---|---|
| **UC-050-001** | Basic Flow (Entry) | `UC-050-001-basic-flow-entry.png` | `051/ui/01-queue-button-entry.png` | **Available** | Queue control in the mini player. |
| **UC-050-001** | Basic Flow (Panel) | `UC-050-001-basic-flow-panel.png` | `051/ui/02-queue-panel-overview.png` | **Available** | Queue panel with current and upcoming tracks. |
| **UC-050-001** | Basic Flow (Upcoming) | `UC-050-001-basic-flow-upcoming.png` | `051/ui/03-queue-current-and-upcoming.png` | **Available** | Upcoming track actions. |
| **UC-050-001** | AF-02 (Empty) | `UC-050-001-AF-02-empty-queue.png` | `051/ui/04-queue-empty-state.png` | **Available** | Guidance when nothing is upcoming. |
| **UC-050-001** | AF-03 (Restore) | `Pending` | `N/A` | **Pending** | Queue restored after reload. |
| **UC-050-001** | AF-05 (Over 50 Tracks) | `Pending` | `N/A` | **Pending** | Queue holding the first 50 tracks of a long collection. |
| **UC-050-002** | Basic Flow (Menu) | `UC-050-002-basic-flow-menu.png` | `052/ui/01-track-menu-add-to-queue.png` | **Available** | Track menu with add to queue. |
| **UC-050-002** | Basic Flow (Confirmation) | `UC-050-002-basic-flow-confirmation.png` | `052/ui/02-add-to-queue-toast-feedback.png` | **Available** | Confirmation after adding. |
| **UC-050-002** | Basic Flow (Result) | `UC-050-002-basic-flow-result.png` | `052/ui/03-queue-after-adding-song.png` | **Available** | Added track at the end of the queue. |
| **UC-050-002** | AF-01 (Already Queued) | `UC-050-002-AF-01-already-queued.png` | `052/ui/06-already-in-queue-notice.png` | **Available** | Notice for a duplicate add. |
| **UC-050-002** | EF-01 / EF-02 | `Pending` | `N/A` | **Pending** | Unavailable track and full queue notices. |
| **UC-050-003** | Basic Flow (Menu) | `UC-050-003-basic-flow-menu.png` | `054/ui/01-track-menu-play-next.png` | **Available** | Play Next in the track menu. |
| **UC-050-003** | Basic Flow (Confirmation) | `UC-050-003-basic-flow-confirmation.png` | `054/ui/02-play-next-toast-feedback.png` | **Available** | Confirmation after Play Next. |
| **UC-050-003** | Basic Flow (Position) | `UC-050-003-basic-flow-position.png` | `054/ui/03-queue-position-after-play-next.png` | **Available** | Chosen track first in the upcoming list. |
| **UC-050-003** | Basic Flow (Transition) | `UC-050-003-basic-flow-transition.png` | `054/ui/04-play-next-playback-transition.png` | **Available** | Chosen track playing next. |
| **UC-050-003** | AF-02 (Already Playing) | `UC-050-003-AF-02-already-playing.png` | `054/ui/05-already-playing-notice.png` | **Available** | Notice for the current track. |
| **UC-050-003** | EF-01 / EF-02 | `Pending` | `N/A` | **Pending** | Unavailable track and full queue notices. |
| **UC-050-004** | Basic Flow (Before) | `UC-050-004-basic-flow-before.png` | `053/ui/01-queue-before-reordering.png` | **Available** | Order before reordering. |
| **UC-050-004** | Basic Flow (Drag) | `UC-050-004-basic-flow-drag.png` | `053/ui/04-queue-drag-reorder-active.png` | **Available** | Drag in progress with drop target. |
| **UC-050-004** | AF-01 (Move Down) | `UC-050-004-AF-01-move-down.png` | `053/ui/02-queue-reorder-move-down.png` | **Available** | Order after moving down. |
| **UC-050-004** | AF-01 (Move Up) | `UC-050-004-AF-01-move-up.png` | `053/ui/03-queue-reorder-move-up.png` | **Available** | Up control. |
| **UC-050-005** | Basic Flow | `UC-050-005-basic-flow.png` | `052/ui/04-queue-remove-item-action.png` | **Available** | Remove control on an upcoming track. |
| **UC-050-005** | AF-01 (Last Removed) | `UC-050-005-AF-01-last-track-removed.png` | `052/ui/05-queue-after-removing-song.png` | **Available** | Empty guidance after removal. |
| **UC-050-006** | Basic Flow (Action) | `UC-050-006-basic-flow.png` | `051/ui/05-queue-clear-all-action.png` | **Available** | Clear all action. |
| **UC-050-006** | Basic Flow (Result) | `UC-050-006-basic-flow-result.png` | `051/ui/04-queue-empty-state.png` | **Available** | Queue after clearing. |
| **UC-050-007** | Basic Flow (Entry) | `UC-050-007-basic-flow-entry.png` | `N/A` | **Wireframe** | Save as Playlist action in the queue panel. |
| **UC-050-007** | Basic Flow (Dialog) | `UC-050-007-basic-flow-name-dialog.png` | `N/A` | **Wireframe** | Playlist name dialog. |
| **UC-050-007** | EF-01 (Guest) | `UC-050-007-EF-01-guest-sign-in.png` | `N/A` | **Wireframe** | Sign-in prompt for a guest. |
| **UC-050-007** | EF-02 / EF-03 | `Pending` | `N/A` | **Pending** | Name validation and creation error. |

---

## 5. Guidelines for Linking Prototypes in Use-Case Specifications

1. **Relative Markdown Image Path**: Reference images using `prototypes/[filename].png`.
2. **Pending Assets**: For flows without a visual asset, annotate the section as `[Prototype Pending - To be generated during UI implementation]` instead of adding a fake image.
3. **Wireframes**: Label wireframes clearly in the image and in the caption, and never present them as implemented screens.
4. **Accessibility**: Always provide descriptive alternative text.
