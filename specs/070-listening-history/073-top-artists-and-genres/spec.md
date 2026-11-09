# Feature Specification: Top Artists and Genres

**Feature Branch**: `073-top-artists-and-genres`
**Created**: 2026-10-31
**Status**: Draft
**Input**: G07 requirement description and resolved decisions in `docs/requirements/use-cases/070-listening-history/README.md` and `UC-070-006`.

## Source Precedence

This feature's initial narrative and reconstructed UI description conflict with its functional requirements. Follow the explicit requirements and resolved G07 decisions: artists are ranked by listening duration then play count; genres by qualifying play count; ranges are 7 days, 30 days, and all time within the 365-day retention window. The screenshot description that shows genre duration is a prototype coverage gap, not a requirement.

## User Scenarios & Testing

### User Story 1 - View Top Artists (Priority: P1)

As a listener, I want to see my most-listened-to artists for a selected time range so that I can understand which artists dominate my listening.

**Why this priority**: Artist ranking is a core personal listening insight and is explicitly required by 073-FR-001.

**Independent Test**: Provide qualifying events for multiple artists with varied listened duration and play counts; verify the first ten artists follow the specified ordering.

**Acceptance Scenarios**:

1. **Given** qualifying history exists in the selected range, **When** the listener opens the Top Artists section, **Then** up to ten artists are ordered by total listened duration descending and then qualifying play count descending.
2. **Given** two artists tie on both measures, **When** results are displayed, **Then** their order is stable and follows the approved deterministic tie-breaker.
3. **Given** an event is shorter than 30 seconds or hidden/cleared, **When** statistics are calculated, **Then** it does not affect artist counts or duration.

---

### User Story 2 - Understand Genre Distribution (Priority: P1)

As a listener, I want to see my most-played genres so that I can understand the styles I listen to most often.

**Why this priority**: Genre distribution complements artist metrics and is a primary requirement of UC-070-006.

**Independent Test**: Provide qualifying events whose songs have one or more genre tags; verify tag counts, ordering, and the Other aggregate.

**Acceptance Scenarios**:

1. **Given** qualifying songs have genre tags, **When** the listener views Genre Analysis, **Then** each tag's count equals the number of qualifying plays of songs associated with that tag.
2. **Given** a song has multiple genre tags, **When** that song is played, **Then** every associated tag receives one count for that event.
3. **Given** more genres exist than can be clearly displayed, **When** the chart is rendered, **Then** it shows the top five to ten genres and groups the remainder into Other.
4. **Given** the listener changes the time range, **When** new results arrive, **Then** the genre counts and visualization reflect only that range.

---

### User Story 3 - Replay Top Tracks (Priority: P2)

As a listener, I want to see and replay my most-played tracks so that I can quickly return to songs I listen to often.

**Why this priority**: Track ranking is a related convenience requirement and reuses existing playback behavior.

**Independent Test**: Provide events for multiple songs; verify the top ten are ordered by qualifying play count and selecting a song starts playback.

**Acceptance Scenarios**:

1. **Given** qualifying events exist, **When** the listener views Top Tracks, **Then** up to ten tracks are ordered by play count descending.
2. **Given** the listener selects a ranked track, **When** playback begins, **Then** the existing player starts that track.

---

### User Story 4 - Understand Sparse Data (Priority: P3)

As a new listener, I want a clear explanation when my history is too small for useful statistics so that the page does not look broken.

**Why this priority**: Clear empty states help new users understand how statistics become available.

**Independent Test**: Use accounts with zero to four qualifying events and one with at least five; verify the state follows the resolved threshold.

**Acceptance Scenarios**:

1. **Given** fewer than five qualifying events are available, **When** the listener opens these statistics, **Then** the page shows “Not enough data yet”.
2. **Given** at least five qualifying events are available, **When** the listener opens the page, **Then** available rankings are shown, including appropriate empty states for missing artist or genre metadata.

### Edge Cases

- A song with multiple genre tags increments each tag once per qualifying event; genre assignment counts may therefore exceed play counts.
- If artist or genre metadata is absent, omit that entity from its ranking and preserve the qualifying event for other applicable aggregates.
- A tie in artist duration and play count, or in genre/track play count, uses a stable deterministic order defined by the approved contract.
- Hidden/cleared events are excluded after re-aggregation; no stale cached value may continue to include them beyond the approved freshness target.
- Time windows use the approved listener timezone and boundary convention. All Time remains limited to 365 days.
- The Other category contains the sum of every genre outside the displayed top five to ten.

## Requirements

### Functional Requirements

- **FR-001**: System MUST rank up to ten artists by total listened duration descending, then by qualifying play count descending. A qualifying play is at least 30 seconds.
- **FR-002**: System MUST rank genres by the number of qualifying plays associated with each genre tag. A multi-tag song MUST increment every associated tag once per qualifying event.
- **FR-003**: System MUST provide 7-day, 30-day, and All Time ranges; All Time MUST be limited to the 365-day history retention window.
- **FR-004**: System MUST exclude hidden or cleared listening history from every statistic and MUST reflect a visibility change upon re-aggregation.
- **FR-005**: System MUST aggregate statistics on the backend.
- **FR-006**: System MUST integrate the statistics into the existing History experience.
- **FR-007**: System MUST show a “Not enough data yet” state when fewer than five qualifying play events are available, as defined by UC-070-006.
- **FR-008**: System MUST support responsive mobile and desktop layouts.
- **FR-009**: The genre visualization MUST show the top five to ten genres and group all remaining genres into Other.
- **FR-010**: System MUST rank up to ten tracks by qualifying play count within the selected range and allow the listener to start playback from a ranked track.

### Key Entities

- **ArtistFrequencyStat**: Artist identity and name, qualifying play count, and total listened duration used for ordering.
- **GenreDistributionStat**: Genre name, qualifying play count, and optional percentage based on the approved denominator.
- **TrackFrequencyStat**: Song identity and approved playback metadata with qualifying play count.
- **OtherGenreStat**: Combined count (and optional percentage) for genre tags outside the displayed top five to ten.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Statistics render in under 1.5 seconds under the agreed normal network conditions.
- **SC-002**: Artist and genre results match an independent calculation over qualifying visible history for the selected period.
- **SC-003**: Lists and charts remain legible and operable at viewport widths from 320px to 1920px or wider.
- **SC-004**: After a range change, updated results render within 500ms after the required data fetch completes.

## Assumptions

- 071 is the source of truth for qualifying events, hidden/cleared state, and 365-day retention.
- The canonical catalog provides stable artist/song identities and genre tags; a song may have more than one tag.
- The five-event empty-state threshold is applied to this statistics view per UC-070-006.
- Aggregation uses the listener's local timezone after the timezone source and window boundaries are approved.
- Statistics are private to the authenticated listener.
