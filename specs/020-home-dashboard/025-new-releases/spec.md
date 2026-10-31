# Feature Specification: New Releases

**Feature Branch**: `020-home-player-queue-spec`

**Created**: 2026-10-31

**Status**: Draft — Ready for Planning

**Input**: User description: "Feature 025 defines how new albums appear on Home. Group 020 owns presentation, ordering, and the playback entry point. Album details, tracklists, and saving belong to group 080."

## Clarifications

### Session 2026-10-31

- Q: How are new albums ordered? → A: By release date, newest first.
- Q: How many albums appear on Home? → A: Up to 5, with an action to explore more.
- Q: What does the play action on an album card do? → A: It plays the album's available tracks in album order and sets them as the queue.
- Q: What happens when an album has no playable tracks? → A: A message explains that there is nothing to play, and the album page stays reachable.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover New Albums (Priority: P1)

As a listener, I want new albums on Home so that I can find fresh music quickly.

**Why this priority**: New albums are named in the Home scope in the proposal.

**Independent Test**: Open Home and confirm up to 5 albums appear, newest first, with cover, title, and artist.

**Acceptance Scenarios**:

1. **Given** albums exist, **When** I open Home, **Then** I see up to 5 albums, newest first.
2. **Given** an album card, **When** I select it, **Then** the album page opens.

---

### User Story 2 - Play an Album Directly (Priority: P1)

As a listener, I want to play a new album from its card so that I can start without opening another page.

**Why this priority**: Direct playback reduces the steps from discovery to listening.

**Independent Test**: Select play on an album card and confirm its tracks play in order.

**Acceptance Scenarios**:

1. **Given** an album with playable tracks, **When** I select play, **Then** playback starts from its first available track.
2. **Given** an album plays, **When** I open the queue, **Then** I see the album's remaining tracks in order.

---

### User Story 3 - Explore More Releases (Priority: P2)

As a listener, I want to see more releases so that I am not limited to the preview.

**Why this priority**: Home shows only a preview of new music.

**Independent Test**: Select the explore action and confirm the Explore page opens.

**Acceptance Scenarios**:

1. **Given** the section is shown, **When** I select the explore action, **Then** the Explore page opens.

---

### Edge Cases

- **Same release date**: Albums keep a stable order.
- **No albums**: The section is hidden or shows an empty state.
- **Partly unavailable album**: Only available tracks are played.
- **Album with nothing playable**: A message is shown and playback does not change.
- **Section cannot load**: A fallback is shown and the rest of Home stays usable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show new albums in a dedicated Home section.
- **FR-002**: The system MUST order albums by release date, newest first.
- **FR-003**: The system MUST show at most 5 albums on Home.
- **FR-004**: The system MUST show cover art, title, and artist for each album.
- **FR-005**: The system MUST open the album page when a listener selects an album card.
- **FR-006**: The system MUST allow starting album playback from its card in 1 interaction.
- **FR-007**: The system MUST play only available tracks, in album order.
- **FR-008**: The system MUST set the album's available tracks as the queue when playback starts from the card.
- **FR-009**: The system MUST inform the listener when an album has no playable tracks.
- **FR-010**: The system MUST provide an action that opens the Explore page.
- **FR-011**: The system MUST NOT implement album details, saving, or sharing within this feature.

### Key Entities *(include if feature involves data)*

- **New Album Card**: An album reference with cover art, title, artist, release date, and destination.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of Home album lists are ordered by release date, newest first.
- **SC-002**: A listener can start an album from Home in 1 interaction.
- **SC-003**: 100% of album cards open the correct album page.
- **SC-004**: Unavailable tracks never start playing from an album card.

## Assumptions

- Authentication and user roles are provided by group `010-authentication`.
- Album details and tracklists are provided by group `080-album-interaction`.
- API alignment: `GET /albums/new` (Public) and `GET /albums/:id` (Public).
- Project documentation is maintained in English Markdown, in accordance with `docs/management/team-contract.md`.

### Known Gaps in the Current Prototype

These gaps do not change the requirements. They record where the current UI differs from this specification.

- Album data is mock data in the prototype.

## UI Screenshots

### 1. New Releases Section Overview

This screenshot captures the "Album mới phát hành" section on the Home Dashboard. It presents a 5-column grid of newly released albums sorted in descending chronological order, showing cover artwork, album title, release year, and artist credit (e.g., "Deep Focus", "Lofi bên cửa sổ", "Loi Choi", "Có em", "Một vạn năm").

![New Releases Section Overview](ui/01-new-releases-section.png)

### 2. New Album Card Focus and Hover State

This screenshot illustrates the desktop hover state over an album card ("Deep Focus"). The card elevates with subtle ambient lighting, the title is highlighted, and a floating circular violet Play button appears in the bottom right corner of the album artwork.

![New Album Card Focus and Hover State](ui/02-new-album-card-hover.png)

### 3. New Album Direct Playback Interaction

This screenshot documents direct album playback initiated from the album card's Play button. Playback starts immediately with the album's first track, and the persistent BottomPlayer updates with the track cover, title, artist, audio controls, and duration.

![New Album Direct Playback Interaction](ui/03-new-album-direct-playback.png)

### 4. Navigation to Full Album Details Page

This screenshot captures the full Album Details view (`/album/al-deep-focus`) accessed by clicking the album cover or title. The destination page displays high-resolution cover art, artist credit, release year ("2026"), track count, formatted total duration, and complete tracklist with play counts.

![Navigation to Full Album Details Page](ui/04-new-album-detail-navigation.png)

### 5. Navigation to Explore Catalog via Section Action

This screenshot documents navigation to the catalog Explore page (`/explore`) triggered by clicking the "Khám phá thêm" action link in the section header, allowing users to browse full release catalogs.

![Navigation to Explore Catalog](ui/05-new-releases-explore-navigation.png)
