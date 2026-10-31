# Feature Specification: Home Content Layout

**Feature Branch**: `020-home-player-queue-spec`

**Created**: 2026-10-31

**Status**: Draft — Ready for Planning

**Input**: User description: "Feature 021 defines how the AuraTune Home page organizes its content for guests and signed-in listeners. Home aggregates recommended content, recent plays, popular tracks, new albums, featured artists, suggested playlists, and genres in one scrollable page, and gives quick paths into playback and exploration. Each section's data rules stay in features 022 to 025 and in the owning groups."

## Clarifications

### Session 2026-10-31

- Q: Who can open the Home page? → A: Guests and signed-in listeners. Personal sections appear only for signed-in listeners, and guests see public content.
- Q: What happens when one section cannot load? → A: Only that section shows a fallback or error state. The other sections stay usable.
- Q: How much content does each preview section show? → A: Up to 5 items per preview section, with a link to the full destination. Genres show all available genres.
- Q: What is the order of the sections? → A: Hero and quick access, recommended content, new albums, popular tracks, featured artists, curated playlists, then genres.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See Organized Content on Arrival (Priority: P1)

As a listener or guest, I want Home to show organized music sections so that I can find something to play without searching.

**Why this priority**: Home is the first screen and the main discovery surface described in the proposal.

**Independent Test**: Open Home as a guest and confirm every public section appears in the defined order.

**Acceptance Scenarios**:

1. **Given** I open Home, **When** content finishes loading, **Then** I see the hero, quick access area, and content sections in the defined order.
2. **Given** I scroll Home, **When** sections come into view, **Then** each section has a clear title and consistent item layout.

---

### User Story 2 - Personalized Greeting for Signed-In Listeners (Priority: P2)

As a signed-in listener, I want Home to recognize me so that the page feels personal and shows my shortcuts.

**Why this priority**: Personalization adds value after the public layout works.

**Independent Test**: Sign in, open Home, and confirm the greeting and personal shortcuts replace the guest versions.

**Acceptance Scenarios**:

1. **Given** I am signed in, **When** I open Home, **Then** the greeting uses my display name.
2. **Given** I am a guest, **When** I select a personal shortcut, **Then** I am sent to sign-in and returned to that destination afterwards.

---

### User Story 3 - Move From Home to Deeper Pages (Priority: P2)

As a listener, I want section actions that lead to full pages so that I can continue exploring.

**Why this priority**: Home is a preview, so each section needs a path to its full content.

**Independent Test**: Select each section action and confirm it opens the matching destination.

**Acceptance Scenarios**:

1. **Given** a section has a view-all action, **When** I select it, **Then** the matching destination opens.
2. **Given** music is playing, **When** I leave Home, **Then** playback continues without restarting.

---

### Edge Cases

- **Slow connection**: Each section shows a loading state instead of an empty area.
- **One section fails**: The failed section shows its own fallback and does not block the page.
- **All sections fail**: The page shows an error state with a retry action.
- **Empty catalog section**: A section with no content is hidden or shows an empty state, never a blank block.
- **Narrow screens**: Sections reflow so the page has no horizontal scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow guests and signed-in listeners to open the Home page.
- **FR-002**: The system MUST present sections in this order: hero and quick access, recommended content, new albums, popular tracks, featured artists, curated playlists, and genres.
- **FR-003**: The system MUST show a personalized greeting to signed-in listeners and a general greeting to guests.
- **FR-004**: The system MUST show at most 5 items in each preview section, except genres, which show all available genres.
- **FR-005**: The system MUST give each preview section with more content an action that opens its full destination.
- **FR-006**: The system MUST load and handle failure for each section independently.
- **FR-007**: The system MUST show a loading state for each section until its content is available.
- **FR-008**: The system MUST provide a retry action when the page cannot load any section.
- **FR-009**: The system MUST send guests who select a personal shortcut to sign-in and return them to that destination afterwards.
- **FR-010**: The system MUST adapt the layout to phone, tablet, and desktop widths without horizontal page scrolling.
- **FR-011**: The system MUST keep current playback running while the listener uses or leaves Home.
- **FR-012**: The system MUST NOT implement recommendation generation, chart calculation, or history recording within this feature.

### Key Entities *(include if feature involves data)*

- **Home Section**: A titled block of content with an order, an item limit, a state (loading, ready, empty, failed), and an optional full-page destination.
- **Quick Access Item**: A shortcut shown near the top of Home that opens or plays content.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Home page is usable within 2 seconds under standard network conditions.
- **SC-002**: 100% of preview sections with more content lead to their full destination in 1 interaction.
- **SC-003**: When any single section fails, all other sections remain usable in 100% of test runs.
- **SC-004**: Home has no horizontal page scrolling from 375 px to 1920 px wide.

## Assumptions

- Authentication and user roles are provided by group `010-authentication`.
- API alignment: `GET /home` (Public) returns the sections in one request. `GET /genres` and `GET /artists/featured` supply genres and featured artists.
- Project documentation is maintained in English Markdown, in accordance with `docs/management/team-contract.md`.

### Known Gaps in the Current Prototype

These gaps do not change the requirements. They record where the current UI differs from this specification.

- The prototype has no per-section loading, failure, or retry state because it reads local data.

## UI Screenshots

### 1. Home Dashboard Initial View (Guest State)

This screenshot captures the initial Home Dashboard view for a guest / unauthenticated visitor at standard desktop viewport (1440 × 900). It showcases the primary layout structure comprising the left sidebar navigation, top search and authentication bar, central content area with hero banner and quick access cards, and persistent bottom music player.

![Home Dashboard Initial View](ui/01-home-dashboard-initial.png)

### 2. Home Dashboard Authenticated View

This screenshot displays the Home Dashboard view when a listener is authenticated (logged in as `demo@auratune.vn`). The hero greeting adapts dynamically to "Chào Người nghe Demo", the user profile avatar appears in the top navigation bar, and personal listening history quick cards populate the top access grid.

![Home Dashboard Authenticated View](ui/02-home-dashboard-authenticated.png)

### 3. Home Content Organization - Top and Recommended Sections

This screenshot captures the upper section layout of the Home Dashboard, demonstrating clear visual hierarchy and consistent spacing. Elements include the AURATUNE MIX interactive hero card, the "Có thể bạn sẽ thích" recommended playlist card grid, and the "Album mới phát hành" newly released album grid.

![Home Content Organization - Top and Recommended Sections](ui/03-home-content-organization-top.png)

### 4. Home Content Organization - Mid Sections (Trending and Featured Artists)

This screenshot displays the middle section of the Home Dashboard content flow. It features the "Đang được yêu thích" trending charts widget with numbered ranking rows (01–05), song metadata, play counts, and duration, followed by the "Nghệ sĩ nổi bật" circular avatar grid.

![Home Content Organization - Mid Sections](ui/04-home-content-organization-mid.png)

### 5. Home Content Organization - Bottom Sections (Curated Playlists and Genres)

This screenshot captures the lower section of the Home Dashboard layout, showing the "Tuyển tập dành cho bạn" mood playlist cards and the colorful 6-column "Thể loại" (Genres) tile grid, providing rich music exploration avenues.

![Home Content Organization - Bottom Sections](ui/05-home-content-organization-bottom.png)

### 6. Home Navigation and Section Exploration

This screenshot documents user interaction and navigation between Home Dashboard and platform sections. It shows sidebar menu interaction ("Khám phá", "Bảng xếp hạng", "Thư viện") and section action controls ("Xem tất cả", "Khám phá thêm") enabling rapid navigation across the application.

![Home Navigation and Section Exploration](ui/06-home-navigation-explore-and-back.png)
