# Feature Specification: Recently Played

**Feature Branch**: `020-home-player-queue-spec`

**Created**: 2026-10-31

**Status**: Draft — Ready for Planning

**Input**: User description: "Feature 023 defines the recent plays shown on Home so that signed-in listeners can return to familiar music quickly. Group 020 owns the presentation and playback entry point. Recording and managing listening history belong to group 070."

## Clarifications

### Session 2026-10-31

- Q: Who can see recent plays? → A: Signed-in listeners only. Guests see suggested playlist shortcuts instead.
- Q: How many recent tracks are shown, and can a track repeat? → A: Up to 4 quick-access tracks on Home, each track appears once, and the most recent play comes first.
- Q: What does playing a recent track use as its queue? → A: The recent tracks list, starting from the selected track.
- Q: What happens if a recent track is no longer available? → A: It is left out of the Home list.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Resume Recent Music (Priority: P1)

As a signed-in listener, I want my recently played tracks on Home so that I can return to them in one step.

**Why this priority**: Quick return to familiar music is stated in the proposal as a key Home benefit.

**Independent Test**: Play several tracks, return to Home, and confirm they appear most recent first with no duplicates.

**Acceptance Scenarios**:

1. **Given** I have listening history, **When** I open Home, **Then** I see up to 4 distinct tracks, most recent first.
2. **Given** a recent track, **When** I select it, **Then** it starts playing and the recent list becomes the queue.

---

### User Story 2 - See Full History (Priority: P2)

As a signed-in listener, I want a link to my full history so that I can see everything I played.

**Why this priority**: Home shows only a preview of history.

**Independent Test**: Select the history link on Home and confirm the listening history page opens.

**Acceptance Scenarios**:

1. **Given** recent tracks are shown, **When** I select the history link, **Then** the listening history page opens.

---

### User Story 3 - Guest and Empty States (Priority: P2)

As a guest or a new listener, I want a useful area instead of an empty one so that Home still helps me start.

**Why this priority**: New visitors have no history, so this area must stay useful.

**Independent Test**: Open Home as a guest and as a new account, and confirm shortcuts replace the recent list.

**Acceptance Scenarios**:

1. **Given** I am a guest, **When** I open Home, **Then** I see suggested playlist shortcuts.
2. **Given** I am signed in with no history, **When** I open Home, **Then** I see suggested playlist shortcuts.

---

### Edge Cases

- **Repeated plays of one track**: The track appears once, at its most recent position.
- **Unavailable track in history**: It is left out, and the next distinct track takes its place.
- **History cannot load**: The area shows suggested shortcuts, and the rest of Home stays usable.
- **History cleared**: Home returns to the empty state on its next load.
- **Session expires**: Personal data is removed and the guest state is shown.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show recent tracks on Home to signed-in listeners who have listening history.
- **FR-002**: The system MUST show at most 4 tracks, ordered from most recent to oldest.
- **FR-003**: The system MUST show each track only once.
- **FR-004**: The system MUST leave out tracks that are unavailable.
- **FR-005**: The system MUST start playback in 1 interaction when a listener selects a recent track.
- **FR-006**: The system MUST use the recent tracks list as the playback queue for that action.
- **FR-007**: The system MUST provide a link to the listening history page when recent tracks are shown.
- **FR-008**: The system MUST show suggested playlist shortcuts to guests and to listeners with no history.
- **FR-009**: The system MUST NOT show one listener's history to any other user.
- **FR-010**: The system MUST keep the rest of Home usable when history cannot be loaded.
- **FR-011**: The system MUST NOT record, edit, or delete listening history within this feature.

### Key Entities *(include if feature involves data)*

- **Recent Track**: A distinct playable track taken from the listener's history, with its most recent play time.
- **Suggested Shortcut**: A playlist link shown when no recent track is available.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of recent lists contain no duplicate tracks and no unavailable tracks.
- **SC-002**: A listener can resume a recent track in 1 interaction.
- **SC-003**: Zero cross-account history exposure in all test scenarios.
- **SC-004**: A track played by the listener appears on Home on the next Home load.

## Assumptions

- Authentication and user roles are provided by group `010-authentication`.
- History recording and the history page are provided by group `070-listening-history`.
- API alignment: `GET /users/me/history` (User) supplies recent plays.
- Project documentation is maintained in English Markdown, in accordance with `docs/management/team-contract.md`.

### Known Gaps in the Current Prototype

These gaps do not change the requirements. They record where the current UI differs from this specification.

- History is stored only in the browser in the prototype.

## UI Screenshots

### 1. Recently Played Section (Authenticated User)

This screenshot captures the Recently Played quick-access grid on the Home Dashboard when an authenticated user is logged in (`demo@auratune.vn`). The top grid populates with recently listened tracks, displaying cover artwork, track title, artist name, and a dedicated status prompt: "Bài hát bạn nghe gần đây · Xem lịch sử".

![Recently Played Section (Authenticated User)](ui/01-recently-played-section-authenticated.png)

### 2. Recently Played Direct Playback Interaction

This screenshot documents the direct playback workflow from the Recently Played grid. Clicking a recent track card immediately initiates playback, updating the persistent BottomPlayer with the song's details, real-time playback progress, and audio controls.

![Recently Played Direct Playback Interaction](ui/02-recently-played-track-playback.png)

### 3. Recently Played Guest State (Unauthenticated Visitor)

This screenshot illustrates the Home Dashboard quick-access area when visited by an unauthenticated guest. In the absence of an authenticated user session and personal history, the system displays starter playlists and a prompt to explore saved music upon login.

![Recently Played Guest State](ui/03-recently-played-guest-state.png)

### 4. Recently Played Empty History State

This screenshot captures the interface state for a newly registered or authenticated user without any recorded listening history (`minhanh@example.com`). The section displays curated starter options without claiming non-existent playback history.

![Recently Played Empty History State](ui/04-recently-played-empty-state.png)

### 5. Navigation to Full Listening History

This screenshot documents the navigation path from the Home Dashboard "Xem lịch sử" action to the full History Page (`/history`). The dedicated history interface displays detailed playback timestamps ("Hôm nay", "Hôm qua"), total listening duration, and listening statistics.

![Navigation to Full Listening History](ui/05-recently-played-full-history-navigation.png)
