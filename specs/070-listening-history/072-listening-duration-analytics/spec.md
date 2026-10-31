# Feature Specification: Listening Duration Analytics

**Feature Branch**: `072-listening-duration-analytics`

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "Specify the feature 072-listening-duration-analytics for AuraTune. This feature belongs to the G07 — Listening History and Statistics functional group and builds upon the tracking infrastructure established in 071-listening-history. Core Purpose: To provide listeners with a personal dashboard that visualizes their music consumption habits over time, helping them understand their 'listening identity' through duration-based metrics and trends."

## Clarifications

### Session 2026-10-31

- Q: How should partial playback (skips) be accounted for in the cumulative listening duration? → A: Count actual time listened, but only if the play exceeds 30 seconds.
- Q: Should the "Today" duration and usage chart update in real-time as the user listens, or only upon page refresh/re-navigation? → A: Stats refresh only when the History page is opened or manually refreshed.
- Q: Should the Daily Usage Trends chart allow users to navigate back to previous weeks, or is it strictly limited to the "Last 7 Days"? → A: Strictly Last 7 Days: Fixed window, no navigation to previous weeks.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Cumulative Listening Time (Priority: P1)

As a listener, I want to see how much time I've spent listening to music today, this week, and overall, so I can track my consumption habits.

**Why this priority**: Core value of the feature; provides immediate feedback on listening activity.

**Independent Test**: Can be tested by playing music for a known duration and verifying the "Today" total increases accordingly (within 1-min margin).

**Acceptance Scenarios**:

1. **Given** I am on the History page, **When** the page loads, **Then** I see "Today", "Last 7 Days", and "All Time" duration summaries.
2. **Given** I have 365+ days of history, **When** I view "All Time" stats, **Then** the duration only includes the last 365 days.

---

### User Story 2 - Identify Top Artists by Duration (Priority: P1)

As a listener, I want to see which artists I spend the most time listening to, rather than just which ones I play most often, to better understand my musical preferences.

**Why this priority**: Differentiates this feature from simple play-count stats; provides deeper insight into "listening identity".

**Independent Test**: Can be tested by playing a long track by Artist A and multiple short tracks by Artist B, then verifying Artist A ranks higher if their total duration is greater.

**Acceptance Scenarios**:

1. **Given** I have listening history, **When** I view my stats, **Then** I see a ranked list of the top 5 artists by total minutes listened.
2. **Given** an artist has tracks with varying lengths, **When** stats are calculated, **Then** the rank is determined by the sum of duration played, not the count of plays.

---

### User Story 3 - Visualize Weekly Trends (Priority: P2)

As a listener, I want to see a chart of my daily listening time over the last 7 days so I can identify patterns in my usage.

**Why this priority**: Provides visual engagement and trend analysis beyond static numbers.

**Independent Test**: Can be tested by checking if the chart displays 7 data points corresponding to the last 7 days of history.

**Acceptance Scenarios**:

1. **Given** the last 7 days of activity, **When** I view the "Insights" section, **Then** I see a bar or line graph showing minutes per day.
2. **Given** a day with no listening activity, **When** I view the chart, **Then** that day is represented as 0 minutes.

---

### User Story 4 - Privacy & Respecting Hidden Items (Priority: P2)

As a listener, I want my stats to accurately reflect only the history I haven't hidden or deleted, ensuring my analytics match my privacy choices.

**Why this priority**: Critical for user trust and privacy compliance.

**Independent Test**: Can be tested by deleting a history item and verifying the total listening time decreases accordingly.

**Acceptance Scenarios**:

1. **Given** I have "soft-deleted" or hidden history items, **When** stats are generated, **Then** these items are excluded from all duration calculations.
2. **Given** I am viewing my dashboard, **When** I hide a recent play, **Then** the "Today" total updates to exclude that track's duration.

---

### Edge Cases

- **Empty History**: How does the UI display when a user has zero listening records? (Expected: Show empty states or "Start listening" prompts).
- **Extremely Long Tracks**: How are tracks longer than a day handled? (Expected: Cap or report as-is, assuming data integrity from 071).
- **Timezone Shifts**: Does "Today" reflect the user's local timezone? (Expected: Aggregation should respect user's local day boundaries).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST calculate cumulative listening duration for "Today", "Last 7 Days", and "All Time" (max 365 days), only including playback sessions that exceed 30 seconds.
- **FR-002**: System MUST generate a ranking of top 5 artists based on total duration listened, filtering out sessions shorter than 30 seconds.
- **FR-003**: System MUST provide daily listening totals for the previous 7 days (sum of 30s+ sessions) for trend visualization.
- **FR-004**: System MUST exclude hidden or "soft-deleted" history items from all statistical calculations.
- **FR-005**: Analytics MUST be private and only accessible to the authenticated owner of the history.
- **FR-006**: The UI MUST integrate a "Stats Summary" or "Insights" view into the History page (`src/frontend/src/pages/History/HistoryPage.jsx`), refreshing data only on page load or manual refresh.
- **FR-007**: System MUST perform heavy data aggregation on the backend to minimize frontend computation, targeting a fixed window for the Daily Usage Trends (Last 7 Days) without historical pagination.
- **FR-008**: System MUST exclude playback sessions shorter than 30 seconds from all aggregate calculations.

### Key Entities *(include if feature involves data)*

- **ListeningDurationStat**: Aggregate result containing total minutes/hours for a specified time range.
- **ArtistDurationRanking**: Pair of Artist metadata and their total cumulative duration in the user's history.
- **DailyUsageTrend**: Time-series data point representing total minutes listened on a specific calendar date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Stats dashboard loads and renders in under 1.5 seconds for users with up to 10,000 history records.
- **SC-002**: Total listening time is accurate within a 1-minute margin of error compared to the sum of raw `listening_history` durations.
- **SC-003**: Visualizations (charts/lists) are fully responsive and functional on viewport widths from 320px (mobile) to 1920px+ (desktop).
- **SC-004**: 100% of hidden history items are successfully excluded from aggregate calculations.

## Assumptions

- The `listening_history` table contains track duration at the time of play or can be reliably joined with the `songs` table for duration.
- The backend can handle complex JOIN and SUM queries efficiently or uses a materialized view/cache for stats.
- "All Time" retention is strictly enforced at 365 days by the underlying data infrastructure.
- User local timezone is available to the backend for accurate "Today" and "Daily" grouping.
