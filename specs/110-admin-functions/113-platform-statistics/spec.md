# Feature Specification: Platform Statistics

**Feature Branch**: `113-platform-statistics-spec`

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "Admin valid can view platform overview statistics to understand overall user, content, and listening activity scale. Scope is limited to summary metrics already supported by the project documentation; do not invent new KPIs or operational analytics. Distinguish zero values from unavailable data, handle loading/empty/error/partial-data states, and keep the read-only admin summary minimal and protected. This is not user-management, content-moderation, or personal-listening analytics. It must only expose aggregate platform data required for administration and must not reveal personal history, credentials, or secrets. The project docs explicitly mention a platform admin statistics page and an overview of users and plays in the current source set, but they do not fully define the exact KPI list or the counting rules. Do not decide schema, SQL, cache, background jobs, charts, or implementation technology."

## Clarifications

### Session 2026-10-30

- Q: What source documents define the scope for platform statistics in group 113? → A: The current project evidence is the proposal, team contract, API contract, architecture feature modules, role navigation, database overview, and security docs. The API contract explicitly contains `GET /admin/stats`, which is the current evidence for an admin-only overview endpoint. The relevant group boundary is Group 110 Admin Functions; the feature remains separate from user ban/unban (111), content moderation (112), and personal listening-analysis (070/101).
- Q: Are there already 111 or 112 specs on the current branch? → A: No. The current branch does not contain a 111 or 112 spec in this workspace. This specification therefore relies on the active project docs and the API contract, and it does not infer additional behavior from missing feature files.
- Q: What exact metrics are supported by the current source set? → A: The current, approved scope for 113 is exactly two aggregate metrics: total user count and total play count. No other KPI is in scope for this feature under the current project evidence. Other metrics such as active users, artist counts, song counts, banned users, deleted songs, retention, revenue, online users, AI metrics, charts, or alerts are explicitly out of scope for 113 and are not carried forward as pending requirements for this feature.
- Q: Does total users include artists, administrators, and banned accounts? → A: Confirmed decision: total users is the number of distinct user accounts currently existing in AuraTune. It includes all roles: user, artist, and admin. It includes accounts that are locked/banned/disabled if the system already records that status, without introducing a new account-state model. Each account is counted once by user ID, regardless of login method or artist profile existence. Guests who are not registered are excluded. Accounts already removed by the current lifecycle are excluded. Test/demo accounts are included if they still exist. If there are no accounts, the value is 0.
- Q: How are hidden, restricted, or deleted songs counted in platform totals? → A: Confirmed decision: historical valid plays remain counted even if the song or user is later hidden, restricted, deleted, or locked. The current state of the song or user is not used as a filter for previously valid listening-history events. If the required identifiers are lost because the current source lifecycle removes them, the impacted metric is reported as `unavailable` instead of being guessed or reconstructed.
- Q: What counts as a valid play, and what data source is authoritative? → A: Confirmed decision: total plays is the count of valid listening-history records. Each distinct recorded listening event is counted as one play when the event was recorded with a valid user and song reference at that time and the system did not mark it invalid. The feature does not add new session IDs, completion thresholds, or listening heuristics. Duplicate records are only collapsed when the source system already provides a single event identifier; otherwise each distinct valid event remains counted. This feature reads the listening-history data only and does not add, replace, or synchronize with `songs.total_plays`. When no valid events exist, the value is 0.
- Q: Is the summary date-bounded or lifetime-based? → A: Confirmed decision: there is no date filter, month filter, or time-range selector for 113. Total users is the count of currently existing accounts at the time of the statistics calculation, not lifetime registrations. Total plays is the total count of valid listening-history events retained in the system up to the time of the statistics calculation.
- Q: When is the statistic updated, and does the UI show a timestamp? → A: Confirmed decision: the stats are recalculated when the admin opens the page or triggers a manual refresh. The system displays the time at which the data was successfully calculated, using Asia/Ho_Chi_Minh (UTC+7), and this timestamp must reflect the statistics calculation time, not the browser render time. No automatic refresh interval is required.
- Q: What should happen when one or more metrics fail to load? → A: Confirmed decision: each metric is handled independently. A reliable metric is displayed with its own successful calculation timestamp. A metric that is missing required data, fails validation, or has a source-data conflict is shown as `unavailable` and is never replaced by `0` or a partial total. If a shared source problem affects both metrics, both metrics are unavailable. Old and new data are not merged into one snapshot.
- Q: What happens if a refresh fails or if the admin session expires? → A: Confirmed decision: a failed refresh must not show stale values as the current result; the page remains usable so the admin can retry. If the session expires or the user loses admin authorization, the system must hide all statistics and never display stale values.

## Source review summary

The reviewed source set supports an admin overview for platform statistics, but it does not define the complete KPI catalog or counting rules.

- The project proposal identifies platform administration and platform statistics as part of the admin responsibility set, but it does not define a full metrics list.
- The team contract assigns Group 110 to the admin functions owner and confirms the role boundary for admin work, including platform administration and moderation.
- The API contract includes `GET /admin/stats` as an admin-only endpoint, which confirms the existence of a platform-statistics feature in principle.
- The architecture feature-modules document confirms that Group 110 is separate from user management, content moderation, and personal listening history.
- The role-navigation document confirms that admin-only areas must be protected by backend authorization and not exposed through UI-only hiding.
- The database README and ER diagram define `users`, `songs`, `listening_history`, and `user_listening_stats`, but they do not define the exact business rules for what counts as a platform metric or how aggregate totals are refreshed.
- The data-consistency doc explicitly warns that `listening_history` deduplication, `songs.total_plays` updates, and aggregate refresh semantics require business clarification; it does not define a final production rule.
- The security doc requires backend authorization, least privilege, no secret leakage, and no logging of sensitive data.

This specification follows the current project evidence and explicitly marks unsupported KPI logic or counting semantics as clarification items rather than inventing new business rules.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review the platform overview as an authorized administrator (Priority: P1)

As an authenticated admin, I want to open the platform statistics view so that I can confirm the current scale of users and audio activity on AuraTune.

**Why this priority**: The feature exists to support admin oversight of platform scale, and the current API contract confirms an admin overview endpoint.

**Independent Test**: Authenticate as a valid admin, request the admin stats view, and verify that only the supported summary metrics are shown and that they are associated with the current platform state and not with a personal account.

**Acceptance Scenarios**:

1. **Given** a valid authenticated admin account, **When** they request the admin overview, **Then** the system returns only the project-supported aggregate metrics for the platform, limited to the current evidence-backed metric list.
2. **Given** the platform has active user accounts and valid listening records, **When** the overview loads, **Then** the supported aggregate values are displayed as current totals without exposing personal account history or credentials.
3. **Given** the feature is requested for a user or artist role without admin authority, **When** the request is evaluated, **Then** access is denied and no aggregate stats are disclosed.

---

### User Story 2 - Understand zero, empty, or unavailable results (Priority: P1)

As an authenticated admin, I want clear status handling for metrics with zero, no data, or temporary failures so that I do not confuse empty or failed results with valid totals.

**Why this priority**: The project explicitly requires the system to distinguish zero from unavailable and to handle partial-data states responsibly.

**Independent Test**: Request the overview in scenarios with zero users, zero plays, empty data sets, partial metric availability, and service failures. Verify that each case returns a clearly distinguishable state.

**Acceptance Scenarios**:

1. **Given** a supported metric with a true value of zero, **When** the admin loads the overview, **Then** the UI shows `0` as a valid value and does not label it as missing or failed.
2. **Given** a metric has no available data records, **When** the admin loads the overview, **Then** the system shows a meaningful no-data state rather than a fabricated number.
3. **Given** one metric fails while another succeeds, **When** the admin loads the overview, **Then** the system shows the available metrics and clearly marks the failed metric as unavailable without hiding the valid result.
4. **Given** the backend cannot load the stats payload at all, **When** the request is evaluated, **Then** the system returns a failure or unavailable state for the entire overview and does not report false success.

---

### User Story 3 - Prevent unauthorized access and data leakage (Priority: P1)

As an authenticated admin, I want the statistics view to be protected at the backend and to expose only aggregate platform data so that no personal history, credentials, or secret data is disclosed.

**Why this priority**: The security documents and the role-navigation model require server-side authorization and minimal disclosure.

**Independent Test**: Attempt to access the admin stats endpoint as an anonymous user, a listener, an artist, and an administrator. Verify that only the valid admin receives the aggregate summary and that all unauthorized requests fail without data disclosure.

**Acceptance Scenarios**:

1. **Given** an unauthenticated request, **When** the admin stats endpoint is called, **Then** the request is denied with an authentication failure and no stats are returned.
2. **Given** a valid user or artist account, **When** they request the admin stats endpoint, **Then** the request is denied with a forbidden response and no platform metrics are disclosed.
3. **Given** a valid authenticated admin, **When** they request the overview, **Then** the response contains only aggregate, non-personal, platform-level metrics and does not expose listening history, user credentials, tokens, or system secrets.
4. **Given** the stats view includes a metric that is not confirmed by the project docs, **When** the data is assembled, **Then** it is excluded rather than guessed or inferred.

---

### User Story 4 - Keep the feature read-only and within the admin boundary (Priority: P1)

As an admin, I want the platform statistics feature to be a read-only view of aggregate platform data so that it does not expand into user management, moderation, or personal analytics.

**Why this priority**: The feature boundary is explicit in the admin function module and the related source docs.

**Independent Test**: Attempt to edit, ban, unban, hide, remove, or restore data through the stats endpoint or related admin stats UI. Verify that no mutation happens.

**Acceptance Scenarios**:

1. **Given** the admin stats view is opened, **When** the admin inspects the detail, **Then** the system does not offer write actions or mutation flows for the source data.
2. **Given** a user attempts to use the stats endpoint to change permissions, content, or playback history, **When** the request is evaluated, **Then** the action is denied because the feature is read-only.
3. **Given** the admin stats data is unavailable or partial, **When** the UI presents the result, **Then** it remains a read-only view and does not imply a change to platform state.

### Edge Cases

- The platform has zero users or zero valid plays; the system must distinguish valid zero values from missing data, not treat a zero result as an error.
- The `users` table may include multiple roles (`user`, `artist`, `admin`), and the confirmed rule is that all current distinct accounts count once by user ID, including locked/banned/disabled states if recorded, while guests and deleted accounts are excluded.
- Each metric is evaluated independently; a valid metric remains visible even if the other metric is unavailable, unless both metrics are affected by the same source failure.
- The project data model includes `listening_history`, `songs.total_plays`, and `user_listening_stats`, but the confirmed rule is that 113 reads valid listening-history events only and does not add, replace, or synchronize with `songs.total_plays`.
- Historical valid plays remain counted even if the song or user is later hidden, restricted, deleted, or locked, unless the required event identifiers are lost by a source-data conflict; in that case the quality problem is reported as `unavailable` rather than estimated.
- There is no date filter or month filter in 113; the totals are calculated at the time of the current successful load and are not treated as lifetime registrations or a time-bounded sum.
- A failed refresh must not reuse stale results as if they were current; the admin must see the fresh load result or an unavailable state, not a mixed snapshot.
- A stats response can be partially successful, fully unavailable, or empty; the system must report a truthful state and not mask failures as success.
- The feature must not expose an individual user's personal history, token, credentials, or secrets under the admin stats view.
- The feature must not add online-user, revenue, retention, forecast, AI analytics, ranking, or reporting features without separate source approval.
- If the admin session expires or the user loses admin authorization, all metrics must be withheld and no stale values may remain visible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide valid authenticated admins access to the platform-statistics overview defined by the current project scope and the admin endpoint in the API contract.
- **FR-002**: The system MUST limit the statistics view to exactly two aggregate metrics in the current scope: total user count and total play count. No other KPI is in scope for 113 under the current source set, and no additional metrics are to be added by this specification.
- **FR-003**: The system MUST treat total user count as the number of distinct user accounts currently existing in AuraTune. It includes all roles (`user`, `artist`, and `admin`), includes locked/banned/disabled accounts if the system already records that status, counts each account once by user ID regardless of login method or artist-profile linkage, excludes guests and accounts removed by the current lifecycle, and returns `0` when no accounts exist.
- **FR-004**: The system MUST treat total play count as the count of valid listening-history records: each distinct recorded listening event counts as one play when it was recorded with a valid user and song reference at the time of the event, the record is not marked invalid by the system, and the source event identity is not duplicated by a known source-level duplicate rule. The feature does not add new session IDs, completion thresholds, or listening heuristics. It reads `listening_history` only and does not add, replace, or synchronize with `songs.total_plays`.
- **FR-005**: The system MUST distinguish valid zero values from missing or unavailable values. A zero result is valid when the underlying metric is legitimately zero; an unavailable or missing result must be shown as such and not as a fabricated number.
- **FR-006**: The system MUST support partial-data, empty-data, and unavailable-data states without collapsing them into a single generic success state. If some metrics load and others fail, valid metrics remain visible and failed metrics are labeled as unavailable.
- **FR-007**: The system MUST reject requests by unauthenticated users, normal users, or artists and MUST NOT disclose admin stats to non-admin roles.
- **FR-008**: The system MUST ensure that the admin statistics view is read-only and MUST NOT offer or perform any user-management, moderation, content-editing, or account-mutation actions.
- **FR-009**: The system MUST not expose personal listening history, credentials, secrets, tokens, or private user data through the admin stats view.
- **FR-010**: The system MUST not add metrics not supported by the source set, including revenue, retention, live online counts, AI predictions, ranking tables, reports, or alerts unless a separate approved source document adds them.
- **FR-011**: The system MUST respect the current Group 110 boundary and must not fold in user-ban/unban behavior from 111 or content moderation from 112.
- **FR-012**: The system MUST keep personal listening analytics and platform overview statistics separate. The admin stats feature must not expose the personal listening-history or user-level insights of Group 070/101 under the admin overview.
- **FR-013**: The system MUST keep the admin stats view limited to aggregate platform data required for operational understanding and MUST not show historical/behavioral detail that belongs to a separate personal analytics feature.
- **FR-014**: The system MUST allow the admin to view the current platform overview without requiring a new data mutation or background job to be created in 113, as long as the source documents and the backend are already capable of serving the data.
- **FR-015**: The system MUST use no date filter, no month filter, and no time-range selector for 113. Total users is the count of distinct currently existing accounts at the time of the statistics calculation, not lifetime registrations. Total plays is the total count of valid listening-history events retained in the source system up to the time of the statistics calculation.
- **FR-016**: The system MUST recalculate the stats when the admin opens the page or explicitly triggers a refresh. The system MUST NOT implement automatic periodic refresh or real-time background refresh as part of this feature. Each refresh is a new calculation event and old and new data must not be merged into a single snapshot.
- **FR-017**: The system MUST display the successful calculation timestamp for each metric using Asia/Ho_Chi_Minh (UTC+7). The displayed timestamp MUST reflect the successful statistics calculation time, not the browser render time or client-side display time.
- **FR-018**: The system MUST handle each metric independently. If a metric is successfully retrieved and trusted, it is displayed with its own timestamp. If a metric is missing required data, has a source conflict, or cannot be trusted, it is displayed as `unavailable` and is never replaced by `0` or a partial total. If a shared data problem affects both metrics, both metrics are unavailable.
- **FR-019**: The system MUST never display stale values after a failed refresh attempt. A failed refresh leaves the page available for another refresh attempt and does not silently reuse older statistics as the current state.
- **FR-020**: The system MUST withhold all statistics when the session is expired or the current user no longer has admin authorization. The feature follows the existing authentication and authorization rules and does not show metrics to unauthorized users.

### Key Entities

- **Admin Account**: An authenticated user with an `admin` role and a valid session authorized to access the platform overview.
- **Platform Overview**: The current admin-visible summary of aggregate platform values available through the admin stats endpoint.
- **Total User Count**: The count of distinct user accounts currently existing in AuraTune, including all roles (`user`, `artist`, and `admin`), including locked/banned/disabled accounts if those states already exist in the system, excluding guests and accounts already removed by the current lifecycle, and counting each account once by user ID.
- **Total Play Count**: The total count of valid listening-history events retained in the source system up to the time of the statistics calculation, where each distinct recorded listening event counts as one play if it was valid when recorded and not marked invalid by the source system, without introducing new session or completion logic. Historical valid play records remain part of the count even if the song or user is later hidden, restricted, deleted, or locked. The `songs.total_plays` field is not used to add or replace the count.
- **Metric Availability State**: A value state for each metric: valid zero, valid non-zero, empty/no-data, partial, or unavailable/error.
- **Aggregate Data Payload**: A read-only response structure containing only supported platform metrics, without personal user data or sensitive credentials.
- **Data Source**: The application data already defined by the project docs, including `users`, `songs`, `listening_history`, and aggregate play-related fields where those are explicitly present.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Valid authenticated admins can access the admin stats overview and see only the supported aggregate metrics permitted by the project source set.
- **SC-002**: The overview differentiates zero values from empty/unavailable states and keeps partial-data or failed metrics explicitly marked as unavailable.
- **SC-003**: Non-admin users cannot access the platform overview, and unauthenticated requests are denied without data disclosure.
- **SC-004**: The feature remains read-only and does not mutate source data, user records, moderation state, or content metadata.
- **SC-005**: No personal listening history, credentials, tokens, or secrets are exposed through the stats endpoint or UI.
- **SC-006**: The feature does not invent unsupported metrics, KPI logic, time windows, or counting rules beyond the explicit source set.
- **SC-007**: Each supported metric is explicitly defined and associated with the source-backed data model or a documented product clarification boundary.

## Assumptions

- The project docs confirm the existence of an admin stats endpoint but do not define a complete KPI catalog; the feature scope remains limited to the current evidence-backed overview metrics.
- `GET /admin/stats` is the source-backed entry point for the feature.
- The project schema includes `users`, `songs`, `listening_history`, and related aggregate fields, but the exact business rules for platform aggregation are not fully defined.
- The project does not define a user online count, retention metric, AI forecast, revenue metric, content leaderboard, or report export flow for Group 113.
- Group 111 and Group 112 are separate admin functions and are not included in this feature.
- Group 070/101 remains the owner of personal listening history and personal listening analytics; Group 113 is aggregate-only admin statistics.
- No new database schema, SQL migration, cache layer, chart library, or background worker contract is assumed in this spec unless an approved source document defines it.
- This feature is intentionally read-only and does not include data mutations or platform-wide operational actions.

## Open clarifications before implementation

No open business clarifications remain for the current, source-backed scope of 113 after the five confirmed decisions above. The feature remains intentionally limited to the approved metric set and the documented admin-only, read-only behavior.

## Out of Scope

- User account banning or unbanning.
- Content moderation, content restrictions, deletion, or restoration workflows.
- Personal listening history, personal listening analytics, or top-item/user stats for one user account.
- Artist upload, artist content management, or preview/approval workflow.
- Revenue, subscriptions, ads, retention, forecast, or business KPIs.
- Online users, concurrent sessions, live monitoring, or presence indicators.
- AI recommendation metrics or AI-driven analytics.
- Ranking, reports, export, charting, dashboards, or notifications beyond the aggregate admin overview.
- Any schema, SQL, migration, cache, cron job, charting library, or deployment technology decision.
