# Prototype and UI Asset Guide – Group 040: Music Player

---

## 1. Purpose

This document defines the organization, conventions, and status of user interface prototypes and screenshots for **Group 040 – Music Player**.

---

## 2. Prototype Directory Organization

All graphical assets for Group 040 reside directly in this directory:
`docs/requirements/use-cases/040-music-player/prototypes/`

### Asset Naming Convention

$$\text{UC-040-[SEQUENCE]-[flow-indicator]-[description].png}$$

- **Basic Flow Assets**: `UC-040-[SEQUENCE]-basic-flow[-step].png`
- **Alternative Flow Assets**: `UC-040-[SEQUENCE]-AF-[NN]-[description].png`
- **Exception Flow Assets**: `UC-040-[SEQUENCE]-EF-[NN]-[description].png`

---

## 3. Prototype vs. Implementation Distinction

1. **Implementation Screenshots**: All images in this directory are screenshots of the current frontend prototype, copied from `specs/040-music-player/*/ui/`.
2. **Current Status**: The prototype simulates audio playback with a timer and runs on demo data. States that depend on real streaming (stream errors, buffering, blocked autoplay, restore after reload) cannot be captured yet and are marked **Pending**.

---

## 4. Prototype Inventory and Mapping

| Use Case ID | Flow / Step | Image File | Source Spec Asset | Status | Description |
|---|---|---|---|---|---|
| **UC-040-001** | Basic Flow (Player ready) | `UC-040-001-basic-flow-ready.png` | `041/ui/01-player-initial-bottom-bar.png` | **Available** | Mini player with a track loaded and paused. |
| **UC-040-001** | Basic Flow (Playing state) | `UC-040-001-basic-flow-playing.png` | `041/ui/02-player-playing-state.png` | **Available** | Playback started; the control shows pause. |
| **UC-040-001** | Basic Flow (Paused state) | `UC-040-001-basic-flow-paused.png` | `041/ui/03-player-paused-state.png` | **Available** | Playback paused at the current position. |
| **UC-040-001** | AF-01 (Next track) | `UC-040-001-AF-01-next-track.png` | `041/ui/04-player-next-track.png` | **Available** | The next track loaded after selecting next. |
| **UC-040-001** | AF-02 (Previous track) | `UC-040-001-AF-02-previous-track.png` | `041/ui/05-player-previous-track.png` | **Available** | The previous track loaded after selecting previous. |
| **UC-040-001** | AF-04 (Full player controls) | `UC-040-001-AF-04-full-player-controls.png` | `041/ui/06-player-fullscreen-controls.png` | **Available** | Full player with playback controls and quick library actions. |
| **UC-040-001** | EF-01 to EF-04 | `Pending` | `N/A` | **Pending** | Unavailable track message, stream error with retry and skip, paused state after a blocked autoplay, and a buffering indicator. |
| **UC-040-002** | Basic Flow (Volume adjustment) | `UC-040-002-basic-flow.png` | `042/ui/04-volume-control-adjustment.png` | **Available** | Volume control in the full player set to a high level. |
| **UC-040-002** | AF-01 (Muted state) | `UC-040-002-AF-01-muted.png` | `042/ui/05-volume-muted-state.png` | **Available** | Muted state with the crossed speaker icon and the slider at zero. |
| **UC-040-003** | Basic Flow (Progress at the start) | `UC-040-003-basic-flow-start.png` | `042/ui/01-playback-progress-start.png` | **Available** | Progress bar at the start of a track, showing elapsed time and duration. |
| **UC-040-003** | Basic Flow (Progress while playing) | `UC-040-003-basic-flow-progress.png` | `042/ui/02-playback-progress-playing.png` | **Available** | Progress bar filling while the track plays. |
| **UC-040-003** | Basic Flow (Seeking to a position) | `UC-040-003-basic-flow-seek.png` | `042/ui/03-playback-seeking-position.png` | **Available** | Seeking to a new position in the full player. |
| **UC-040-003** | EF-01 and EF-02 | `Pending` | `N/A` | **Pending** | Buffering indicator and a seek error with retry. |
| **UC-040-004** | Basic Flow (Shuffle off) | `UC-040-004-basic-flow-shuffle-off.png` | `043/ui/01-shuffle-disabled.png` | **Available** | Shuffle control in the off state. |
| **UC-040-004** | Basic Flow (Shuffle on) | `UC-040-004-basic-flow-shuffle-on.png` | `043/ui/02-shuffle-enabled.png` | **Available** | Shuffle control in the active state. |
| **UC-040-004** | AF-01 (Repeat off) | `UC-040-004-AF-01-repeat-off.png` | `043/ui/03-repeat-off.png` | **Available** | Repeat off. |
| **UC-040-004** | AF-01 (Repeat all) | `UC-040-004-AF-01-repeat-all.png` | `043/ui/04-repeat-all.png` | **Available** | Repeat all. |
| **UC-040-004** | AF-01 (Repeat one) | `UC-040-004-AF-01-repeat-one.png` | `043/ui/05-repeat-one.png` | **Available** | Repeat one with its dedicated icon. |
| **UC-040-005** | Basic Flow (Lyrics panel entry) | `UC-040-005-basic-flow-entry.png` | `044/ui/01-lyrics-panel-entry.png` | **Available** | Lyrics tab in the full player. |
| **UC-040-005** | Basic Flow (Active lyric line) | `UC-040-005-basic-flow-active-line.png` | `044/ui/02-synchronized-lyrics-active-line.png` | **Available** | The current line emphasized. |
| **UC-040-005** | Basic Flow (Lyric progression) | `UC-040-005-basic-flow-progression.png` | `044/ui/03-synchronized-lyrics-progression.png` | **Available** | Emphasis moved to the next line as playback continues. |
| **UC-040-005** | EF-01 (No lyrics notice) | `UC-040-005-EF-01-no-lyrics.png` | `044/ui/04-lyrics-unavailable-state.png` | **Available** | Notice for a track without lyrics. |
| **UC-040-005** | AF-01 (Select a Line) and AF-03 (Plain Lyrics) | `Pending` | `N/A` | **Pending** | Selectable timed lines and a scrollable plain-lyrics view. |
| **UC-040-006** | Basic Flow (Mini player on Home) | `UC-040-006-basic-flow-home.png` | `045/ui/01-bottom-player-home-page.png` | **Available** | Mini player docked on Home. |
| **UC-040-006** | Basic Flow (Mini player on Search) | `UC-040-006-basic-flow-search.png` | `045/ui/02-bottom-player-search-page.png` | **Available** | The same track still playing after navigating to Search. |
| **UC-040-006** | Basic Flow (Mini player on Charts) | `UC-040-006-basic-flow-charts.png` | `045/ui/03-bottom-player-charts-page.png` | **Available** | Uninterrupted playback on the Charts page. |
| **UC-040-006** | AF-01 (Expanding to the full player) | `UC-040-006-AF-01-expand.png` | `045/ui/04-player-expansion-to-fullscreen.png` | **Available** | The full player opened from the mini player. |
| **UC-040-006** | AF-01 (Collapsing to the mini player) | `UC-040-006-AF-01-collapse.png` | `045/ui/05-player-collapse-to-bottom.png` | **Available** | The full player closed, returning to the same page. |
| **UC-040-006** | AF-02 (Mini player on a phone) | `UC-040-006-AF-02-phone.png` | `045/ui/06-bottom-player-mobile.png` | **Available** | Compact mini player above the mobile navigation at 375 px wide. |
| **UC-040-006** | AF-01 (Restore After Reload) | `Pending` | `N/A` | **Pending** | The last track and queue restored in a paused state after a reload. |
| **UC-040-007** | Basic Flow (Share confirmation) | `UC-040-007-basic-flow.png` | `046/ui/01-song-share-action-feedback.png` | **Available** | Share control in the full player and the "link copied" confirmation. |
| **UC-040-007** | AF-01 and Exception Flow – EF-01 | `Pending` | `N/A` | **Pending** | Device share sheet on a phone and the failure message. |
| **UC-040-008** | Basic Flow (Comments panel) | `UC-040-008-basic-flow.png` | `046/ui/02-song-comments-panel-view.png` | **Available** | Comments panel with author, relative time, and text. |
| **UC-040-008** | AF-01 (Empty comments) | `UC-040-008-AF-01-no-comments.png` | `046/ui/06-song-comments-empty-state.png` | **Available** | Empty state for a track with no comments. |
| **UC-040-008** | AF-02 (Guest sign-in prompt) | `UC-040-008-AF-02-guest-prompt.png` | `046/ui/03-song-comments-unauthenticated-prompt.png` | **Available** | Comments shown to a guest with a sign-in prompt instead of the input. |
| **UC-040-008** | EF-01 | `Pending` | `N/A` | **Pending** | Comment loading error with retry. |
| **UC-040-009** | Basic Flow (Typing a comment) | `UC-040-009-basic-flow-typing.png` | `046/ui/04-song-comment-input-typing.png` | **Available** | A signed-in listener typing a comment. |
| **UC-040-009** | Basic Flow (Comment posted) | `UC-040-009-basic-flow-posted.png` | `046/ui/05-song-comment-submitted-success.png` | **Available** | The new comment shown in the thread. |
| **UC-040-009** | EF-01 (Guest sign-in prompt) | `UC-040-009-EF-01-guest-prompt.png` | `046/ui/03-song-comments-unauthenticated-prompt.png` | **Available** | Sign-in prompt shown to a guest instead of the comment input. |
| **UC-040-009** | EF-03 (Posting Fails) | `Pending` | `N/A` | **Pending** | Error message with the unsent text kept in the input. |
| **UC-040-010** | Basic Flow (Delete own comment) | `UC-040-010-basic-flow.png` | `046/ui/07-song-comment-delete-action.png` | **Available** | The author of a comment sees the delete control on it. |
| **UC-040-010** | AF-01 and Exception Flows | `Pending` | `N/A` | **Pending** | Administrator view with delete controls on all comments, and the not-authorized and error messages. |

---

## 5. Guidelines for Linking Prototypes in Use-Case Specifications

1. **Relative Markdown Image Path**: Reference images using `prototypes/[filename].png`.
2. **Pending Assets**: For flows without a visual asset, annotate the section as `[Prototype Pending - To be generated during UI implementation]` instead of adding a fake image.
3. **Accessibility**: Always provide descriptive alternative text.
