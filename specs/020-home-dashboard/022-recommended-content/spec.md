# Feature Specification: Recommended Content

**Feature Branch**: `020-home-player-queue-spec`

**Created**: 2026-10-31

**Status**: Draft — Ready for Planning

**Input**: User description: "Feature 022 defines how recommended songs and playlists appear on Home. Group 020 owns presentation, playback entry points, and fallback display. Recommendation generation belongs to feature 102, and mood-based recommendations belong to feature 103."

## Clarifications

### Session 2026-10-31

- Q: What content does the recommended section show? → A: Recommended songs for signed-in listeners when available, and recommended playlists for all visitors, as stated in the proposal.
- Q: What do guests see? → A: Public suggested playlists, with no personalization.
- Q: What happens when AI recommendations are unavailable? → A: The section title changes to popular content, a short notice explains the interruption, and official popular playlists are shown.
- Q: What happens when a recommended item is no longer available? → A: It is left out of the list and is never shown as a broken item.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover Recommended Music (Priority: P1)

As a signed-in listener, I want recommended music on Home so that I can start listening without searching.

**Why this priority**: AI-recommended content is a core value of the Home page.

**Independent Test**: Sign in as a listener with history and confirm recommended items appear and can be played.

**Acceptance Scenarios**:

1. **Given** recommendations exist for me, **When** I open Home, **Then** I see up to 5 recommended items.
2. **Given** a recommended playlist, **When** I select its play action, **Then** playback starts and the queue is set from that playlist.
3. **Given** a recommended playlist, **When** I select its card, **Then** the playlist page opens.

---

### User Story 2 - Keep Discovery Working Without AI (Priority: P1)

As a listener, I want useful content even when AI is unavailable so that Home never feels broken.

**Why this priority**: AI service failure must not affect the rest of the platform.

**Independent Test**: Simulate an AI outage and confirm the fallback title, notice, and popular playlists appear.

**Acceptance Scenarios**:

1. **Given** the AI service is unavailable, **When** I open Home, **Then** I see popular content and a short notice.
2. **Given** the AI service recovers, **When** I reload Home, **Then** recommended content returns.

---

### User Story 3 - Guest Suggestions (Priority: P2)

As a guest, I want suggested playlists so that I can try AuraTune before signing in.

**Why this priority**: Guests need a useful first experience, which depends on the public catalog.

**Independent Test**: Open Home as a guest and confirm public suggestions appear with no personal data.

**Acceptance Scenarios**:

1. **Given** I am a guest, **When** I open Home, **Then** I see public playlists and no personalized wording.

---

### Edge Cases

- **New listener with no history**: The section shows the same fallback as AI unavailability.
- **Empty recommendation result**: Popular content replaces the empty list.
- **Slow AI response**: A loading state is shown, and the rest of Home stays usable.
- **Unavailable playlist tracks**: Unavailable tracks are skipped when playback starts.
- **Playlist with nothing playable**: A message explains that there is nothing to play.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show recommended content in a dedicated Home section.
- **FR-002**: The system MUST show recommended songs to signed-in listeners when recommendations are available.
- **FR-003**: The system MUST show public suggested playlists to guests.
- **FR-004**: The system MUST show at most 5 items in this section.
- **FR-005**: The system MUST allow a listener to start playback of a recommended playlist in 1 interaction.
- **FR-006**: The system MUST open the destination page when a listener selects a recommended item.
- **FR-007**: The system MUST replace the section with popular content and a short notice when AI recommendations are unavailable.
- **FR-008**: The system MUST leave unavailable items out of the section.
- **FR-009**: The system MUST keep the rest of Home usable while this section loads or fails.
- **FR-010**: The system MUST provide an action that opens the Explore page.
- **FR-011**: The system MUST NOT generate, rank, or explain recommendations within this feature.

### Key Entities *(include if feature involves data)*

- **Recommended Item**: A song or playlist reference with title, creator, artwork, and destination.
- **Fallback Content**: Popular official playlists shown when recommendations are unavailable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of displayed recommended items open or play successfully in test runs.
- **SC-002**: During a simulated AI outage, 100% of Home visits show fallback content with no error screen.
- **SC-003**: Starting playback from a recommended playlist takes 1 interaction.
- **SC-004**: Guests never see personalized wording or personal data.

## Assumptions

- Authentication and user roles are provided by group `010-authentication`.
- Recommendation logic and ranking are provided by feature `102-personalized-recommendations`.
- API alignment: `GET /recommendations/songs` (User) and `GET /playlists` (Public). `503` with `AI_SERVICE_UNAVAILABLE` triggers the fallback.
- Project documentation is maintained in English Markdown, in accordance with `docs/management/team-contract.md`.

### Known Gaps in the Current Prototype

These gaps do not change the requirements. They record where the current UI differs from this specification.

- The prototype shows recommended playlists only; recommended songs are not displayed yet.
- Recommendations are mock data and are not personalized.

## UI Screenshots

### 1. Recommended Content Overview

This screenshot showcases the primary recommendation sections on the Home Dashboard. At the top, the interactive "AURATUNE MIX" hero banner presents a personalized daily curation ("Giai điệu hợp với khoảnh khắc của bạn"), followed immediately by the "Có thể bạn sẽ thích" recommendation grid with algorithmically suggested playlists.

![Recommended Content Overview](ui/01-recommended-content-overview.png)

### 2. Recommended Playlist Card Focus and Hover

This screenshot illustrates user interaction when hovering over an AI-recommended playlist card ("Giai điệu Chữa Lành"). The card highlights with subtle background elevation, displaying the playlist title, personalized description, and an elevated violet play button ready for instant playback.

![Recommended Playlist Card Focus and Hover](ui/02-recommended-playlist-card-hover.png)

### 3. Recommended Playlist Direct Playback

This screenshot documents the playback workflow triggered directly from recommended content ("Phát Aura Mix"). Playback begins immediately, updating the persistent BottomPlayer with the current track title, artist, audio controls, and duration indicator.

![Recommended Playlist Direct Playback](ui/03-recommended-playlist-playback.png)

### 4. Recommended Playlist Detail Navigation

This screenshot demonstrates navigation from a recommended playlist card to its full Playlist Detail view (`/playlist/auratune-mix-1`). The full view displays curated artwork, total song count, estimated duration, complete track listing, and collaborative action controls.

![Recommended Playlist Detail Navigation](ui/04-recommended-playlist-detail-navigation.png)

### 5. Curated Mood Collections Category

This screenshot captures the mood and contextual recommendation category titled "Tuyển tập dành cho bạn" ("Mood nào cũng có một playlist vừa vặn"). It presents a diverse grid of situational playlists (Coffee & Chill, Night Ride, Gym & Energy) tailored to listener activities.

![Curated Mood Collections Category](ui/05-recommended-categories-curated-moods.png)

### 6. Recommendation Offline Fallback State

This screenshot documents the frontend's graceful degradation behavior when the AI recommendation service is offline or unreachable (`aiAvailable = false`). The section automatically adjusts its title to "Phổ biến trên AuraTune" with the descriptive notice: "AI gợi ý đang tạm gián đoạn, đây là các tuyển tập được nghe nhiều", ensuring continuous music discovery without breaking the layout.

![Recommendation Offline Fallback State](ui/06-recommended-content-fallback-state.png)
