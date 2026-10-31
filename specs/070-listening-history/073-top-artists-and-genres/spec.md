# Feature Specification: Top Artists and Genres

**Feature Branch**: `073-top-artists-and-genres`

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "Specify the feature 073-top-artists-and-genres for AuraTune. This feature belongs to the G07 — Listening History and Statistics functional group and complements the duration-based metrics in 072-listening-duration-analytics by focusing on frequency and genre-based taste profiles. Core Purpose: To provide listeners with a visual summary of their most-played artists and preferred genres across different time horizons, enabling them to discover patterns in their musical taste. Key Requirements to Include: Top Artists by Frequency: Rank top 10 artists based on the number of play events (>= 30s) in listening_history, distinct from the duration-based ranking in 072. Top Genres Analysis: Aggregate and rank the user's top genres by counting plays of songs associated with specific genre tags. Configurable Time Ranges: Users must be able to switch stats between three views: Last 4 Weeks (Recent trends), Last 6 Months (Medium-term habits), All Time (Full history retention window of 365 days). UI Components: A ranked list for Top Artists with artist names and play counts. A visual chart (e.g., horizontal bar chart or pie chart) for Top Genres. Integration into the existing History page (src/frontend/src/pages/History/HistoryPage.jsx). Data Integrity: Exclude \"soft-deleted\" or hidden items from calculations (consistent with FR-013 in 071). Data should be aggregated on the backend to ensure frontend performance. Empty States: Provide a clear \"Not enough data yet\" state for new users. Key Entities: ArtistFrequencyStat: Object containing Artist ID, Name, and Play Count. GenreDistributionStat: Object containing Genre Name and percentage/count of total plays. Success Criteria: Stats load and render in under 1.5 seconds. Rankings accurately reflect the listening_history data within the selected time range. Visualizations are responsive (mobile/desktop)."

## Clarifications

### Session 2026-10-31

- Q: How should the system handle songs associated with multiple genres when calculating the top genres chart? → A: Increment count for every genre tag associated with the song (Double-counting allowed)
- Q: What is the specific data retention policy for "soft-deleted" or "hidden" history items regarding their impact on statistics? → A: Immediate: Stats are re-aggregated on every request, excluding hidden items in real-time
- Q: How should the "Top Genres" chart handle a large number of long-tail genres (e.g., 50+ unique genres with 1 play each)? → A: Show top 5-10 genres and group all remaining into an "Other" category

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Recent Top Artists (Priority: P1)

As a listener, I want to see which artists I've been listening to the most over the last 4 weeks so that I can track my current musical phase.

**Why this priority**: Core value proposition of the feature. Recent trends are usually what users care about most for "current" taste.

**Independent Test**: Can be tested by playing 10 different artists multiple times (>=30s each) over a simulated 4-week period and verifying the ranked list displays them correctly with accurate play counts.

**Acceptance Scenarios**:

1. **Given** a user has play events for multiple artists in the last 4 weeks, **When** they view the "Last 4 Weeks" tab on the History page, **Then** they see a ranked list of the top 10 artists by play frequency.
2. **Given** a play event lasted less than 30 seconds, **When** statistics are calculated, **Then** that play event is excluded from the artist frequency count.

---

### User Story 2 - Analyze Genre Distribution (Priority: P1)

As a listener, I want to see a visual breakdown of my preferred genres so that I can understand the diversity of my musical taste.

**Why this priority**: Provides the "visual summary" mentioned in the core purpose. Complementary to artist rankings.

**Independent Test**: Can be tested by playing songs from various genres and verifying the chart accurately reflects the proportions/counts of each genre.

**Acceptance Scenarios**:

1. **Given** a user has listening history, **When** they view the Genre Analysis section, **Then** they see a visual chart (bar or pie) representing their top genres.
2. **Given** a user switches time ranges, **Then** the genre chart updates to reflect the data from the selected period.

---

### User Story 3 - Compare Habits Over Different Time Horizons (Priority: P2)

As a listener, I want to switch between different time ranges (4 weeks, 6 months, All Time) so that I can compare my short-term trends with my long-term habits.

**Why this priority**: Required for a comprehensive "taste profile" over time.

**Independent Test**: Can be tested by populating history with different patterns in different months and verifying stats change correctly when toggling range filters.

**Acceptance Scenarios**:

1. **Given** the stats view is open, **When** the user selects "Last 6 Months", **Then** the rankings and charts refresh to show data from the last 180 days.
2. **Given** the stats view is open, **When** the user selects "All Time", **Then** the stats reflect the full 365-day retention window.

---

### User Story 4 - Handle New User Experience (Priority: P3)

As a new user with no listening history, I want to see a helpful message instead of empty charts so that I understand why no stats are visible.

**Why this priority**: Essential for UX quality and preventing "broken" looking UI.

**Independent Test**: Can be tested with a fresh account and verifying the "Not enough data yet" state is shown.

**Acceptance Scenarios**:

1. **Given** a user has fewer than the minimum required play events, **When** they visit the stats section, **Then** they see a clear "Not enough data yet" message.

### Edge Cases

- **Tied Play Counts**: If two artists have the exact same number of plays, how are they ranked? (Assumption: Alphabetical or random within the tie).
- **Deleted History**: If a user "soft-deletes" history items (via FR-013), they must immediately disappear from the stat calculations.
- **Artists with No Genres**: How is the genre chart affected if many played songs have missing genre metadata? (Assumption: Grouped under "Unknown" or excluded).
- **Time Window Boundaries**: Ensuring events exactly at the 4-week or 6-month boundary are correctly included/excluded based on timezone.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST rank the top 10 artists based on frequency of play events (plays >= 30 seconds).
- **FR-002**: System MUST aggregate and rank top genres based on the count of plays of songs associated with those genres. Songs with multiple genre tags MUST contribute to the count of each tag.
- **FR-003**: System MUST provide three configurable time ranges: Last 4 Weeks, Last 6 Months, and All Time (365 days).
- **FR-004**: System MUST exclude "soft-deleted" or hidden listening history items from all calculations. Changes to hidden items MUST be reflected in statistics immediately upon re-aggregation.
- **FR-005**: Statistics calculations MUST be performed on the backend to ensure performance.
- **FR-006**: The frontend MUST integrate these stats into the existing `HistoryPage.jsx`.
- **FR-007**: System MUST provide a "Not enough data yet" empty state.
- **FR-008**: System MUST support responsive layouts for both mobile and desktop views.
- **FR-009**: The Genre Analysis chart MUST display the top 5-10 genres and group all remaining genres into an "Other" category for visual clarity.

### Key Entities *(include if feature involves data)*

- **ArtistFrequencyStat**: Represents an artist's popularity for a user.
  - `artistId`: Unique identifier for the artist.
  - `name`: Display name of the artist.
  - `playCount`: Total number of valid play events (>= 30s).
- **GenreDistributionStat**: Represents the breakdown of musical genres.
  - `genreName`: Name of the genre tag.
  - `count`: Number of plays associated with this genre.
  - `percentage`: Relative share of total plays (optional, for visualization).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Statistics data loads and renders in the UI in under 1.5 seconds under normal network conditions.
- **SC-002**: Artist rankings match exactly with the underlying `listening_history` data for the selected period.
- **SC-003**: Charts and lists are fully legible and functional on screen widths from 320px (mobile) to 1920px+ (desktop).
- **SC-004**: Users can switch between time ranges and see updated data within 500ms of the data fetch completing.

## Assumptions

- **Retention Window**: "All Time" is defined as the last 365 days based on system-wide history retention policies.
- **Artist Metadata**: Every song in `listening_history` is associated with at least one artist.
- **Genre Source**: Genre data is derived from song metadata; songs with multiple genres contribute to the count of each genre.
- **Minimal Data Threshold**: A minimum of 5 play events is required before any stats are displayed (to avoid "top artist" with 1 play).
- **Timezone**: Aggregation windows (weeks/months) are calculated based on the user's local timezone for a personalized experience.
- **Soft-Deletion Consistency**: The mechanism for excluding hidden items follows the implementation defined in 071-listening-history.
