# Feature Specification: User Management

**Feature Branch**: `111-user-management-spec`

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "Admin is allowed to view, search, filter, and manage user account status within the project-defined scope. The feature must include listing users, searching and filtering by the currently defined criteria (including q, role and is_banned where the active contract still uses them), showing only the account information needed to identify the correct account and its status, banning and unbanning accounts, recording the ban reason, and handling empty results, missing accounts, invalid requests, expired sessions, insufficient permissions, and failed operations. Only valid admins can perform user-management operations. Passwords, password hashes, tokens and secrets must never be exposed. Clarify unresolved points: whether an administrator may ban themselves or other admins, whether a ban reason is mandatory, whether a ban is temporary or indefinite, effects on current sessions and authenticated operations, which user fields are visible to admins, and the expected search/filter/sort/pagination behavior when not already defined. Do not mix in content moderation or platform statistics. Do not add account deletion, password reset, impersonation, export, or admin-role grant/revoke. User-to-artist linking is not part of this feature."

## Clarifications

### Session 2026-10-30

- Q: Does an admin have permission to ban themselves or another admin? → A: No. Admins are not allowed to ban themselves or other admins. The management scope is limited to non-admin accounts only. Any self-ban or admin-target ban request is rejected as invalid, and no state change occurs.
- Q: Is a ban reason mandatory when an account is banned? → A: Yes. The ban reason is required, must be non-blank after trimming whitespace, and must be recorded for the ban action. A blank or whitespace-only reason is treated as invalid input.
- Q: Is a ban temporary or permanent until an admin unbans the account? → A: A ban is persistent until an explicit unban action by an authorized admin. There is no automatic expiry, temporary suspension window, or scheduled release in the current source baseline.
- Q: What happens to active login sessions and tokens when a user is banned? → A: After a successful admin ban, the account MUST reject new login attempts. Any already-authenticated session for that account MUST be treated as blocked from subsequent authenticated requests, even if the access token has not yet expired; the next protected request is denied with the ban state and the user must sign in again after the account is unbanned. Public content access remains unaffected. This is a separate enforcement rule from a temporary password lock and is not a new token-management mechanism.
- Q: Which account details may an admin view in the list and details pages? → A: An admin may view only the minimum fields needed to identify the account, determine its role, and confirm its ban state: `user_id`, `display_name`, `email`, `role`, `created_at`, `is_banned`, and `ban_reason` when present. Password, password hash, auth tokens, session identifiers, OAuth secrets, and any secret material are never exposed.
- Q: What are the expected search, filter, sort, and pagination behaviors if they are not already defined? → A: The default behavior for the admin user list is: `q` matches a case-insensitive substring in `email` or `display_name` after trimming leading/trailing whitespace; `role` matches the exact allowed values `user`, `artist`, or `admin`; `is_banned` matches `true` or `false`; all filters are combined with AND semantics; results are sorted by `created_at` descending, then `user_id` ascending; page size is 20 records per page; a filter change resets pagination to the first page; empty matches return an explicit empty result. If no sort or pagination values are provided, the default order above applies.
- Q: What is the expected behavior when a user is already banned or already unbanned? → A: Duplicate state-change requests are idempotent: an already-banned user remains banned and the response reports no-op/duplicate state; an already-unbanned user remains unbanned and the response reports no-op/duplicate state. No contradictory state is created.

## Source review summary

The current reviewed source set confirms the feature scope and the required admin-only boundary, but does not fully define all of the operational decisions above.

- The vision document describes administrators as responsible for account management and moderation; it does not define self-ban behavior or the ban lifecycle.
- The project proposal states that administrators manage user permissions and ban violating users, but it does not define temporary vs. permanent bans or whether admin self-management is allowed.
- The team contract assigns Group 110 to Hoàng and identifies admin role responsibilities, with no additional rule for self-bans or unban durations.
- The API contract includes `GET /admin/users`, `PUT /admin/users/:id/ban`, and `PUT /admin/users/:id/unban`, with query parameters `q`, `role`, and `is_banned`. It also defines `FORBIDDEN`, `USER_BANNED`, and `UNAUTHORIZED` error codes. This is the current source of truth for endpoint names and the admin-only access boundary.
- The architecture and role-navigation documents confirm that Admin actions must be protected by backend authorization and that admin-only management is separate from content moderation and platform analytics.
- The database documents describe `users` and a boolean ban state concept at a high level, but they do not define the lifecycle, audit trail, or session invalidation rules.
- The security documentation requires a backend authorization check, minimal exposure of sensitive data, and no password/token/secret leakage.

This spec follows the current source evidence and clearly marks unresolved decisions as assumptions or open questions rather than inventing product behavior.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and review the user directory (Priority: P1)

As an authenticated admin, I want to view the account directory and confirm each user's role and current ban status so that I can identify the right account before making a management decision.

**Why this priority**: The feature is fundamentally an admin account-management capability: the list and review step is required before any ban or unban action.

**Independent Test**: Authenticate as a valid admin and request the user list with and without filters, then verify only the approved admin-visible fields are shown and the correct status values are returned.

**Acceptance Scenarios**:

1. **Given** an authenticated admin account with valid access, **When** they request the user list, **Then** the system returns the current set of user records permitted by the active project scope and shows only the approved admin-visible fields needed to identify the account, role, creation time, and ban state.
2. **Given** the user directory contains a mixture of roles and ban states, **When** the admin loads the list, **Then** the system presents each account's identity and admin-relevant status without exposing password, hash, tokens, or secrets.
3. **Given** the user directory is empty, **When** the admin requests the list, **Then** the system returns an empty state or a successful empty result rather than a misleading error.
4. **Given** an admin applies a filter or a search query, **When** the result set is loaded, **Then** the system applies the default `q`/`role`/`is_banned` filter semantics and returns a consistent first-page result set sorted by `created_at` descending and `user_id` ascending.

---

### User Story 2 - Search and filter users by the documented criteria (Priority: P1)

As an authenticated admin, I want to search and filter accounts by the currently defined fields so that I can find relevant users quickly and apply the correct action.

**Why this priority**: Listing alone is not enough; the current API contract includes `q`, `role`, and `is_banned` and must be honored for operational usefulness.

**Independent Test**: Call the user list endpoint with `q`, `role`, and `is_banned` values and confirm that matching is limited to the correct accounts, that invalid filter values are rejected cleanly, and that results honor the default ordering and pagination behavior.

**Acceptance Scenarios**:

1. **Given** the admin provides a valid `q` filter, **When** they request the list, **Then** only users whose `email` or `display_name` contains the trimmed, case-insensitive query are returned and no unrelated accounts are shown.
2. **Given** the admin provides a valid `role` filter value, **When** they request the list, **Then** only users with that exact role are returned.
3. **Given** the admin provides a valid `is_banned` filter value, **When** they request the list, **Then** only users matching the banned or unbanned state are returned.
4. **Given** the admin provides an invalid filter value or malformed request, **When** the query is evaluated, **Then** the system rejects the request with a validation error and does not disclose hidden user data.
5. **Given** the admin does not provide a sort or pagination value, **When** the filtered list is returned, **Then** results are sorted by `created_at` descending, then `user_id` ascending, and the first page contains at most 20 rows.

---

### User Story 3 - Ban and unban non-admin accounts with an explicit reason and correct state transition (Priority: P1)

As an authenticated admin, I want to ban or unban a non-admin account with a clear reason so that I can enforce platform rules without affecting unrelated users or creating a self-admin management gap.

**Why this priority**: The administrative action is the central operational behavior of the feature and is explicitly called out in the current API contract.

**Independent Test**: Ban a valid non-admin account, verify its status changes to banned, then unban it and confirm the ban flag is cleared. Reject any attempt to ban the current admin or another admin, and confirm duplicate or invalid ban requests do not change state.

**Acceptance Scenarios**:

1. **Given** a valid admin account and a valid non-admin target user who is not banned, **When** the admin bans the user with a non-blank reason, **Then** the target account transitions to the banned state and the system records the reason in a way the product supports.
2. **Given** the current admin or another admin account is targeted for a ban action, **When** the request is evaluated, **Then** the system rejects the request as forbidden and no state change occurs.
3. **Given** a valid admin account and a valid target user who is currently banned, **When** the admin requests a second ban, **Then** the system does not create a duplicate or contradictory state change and responds with a clear idempotent or no-op result.
4. **Given** a valid admin account and a valid target user who is currently banned, **When** the admin unbans the user, **Then** the target account transitions back to the unbanned state and is visible in the normal list results again.
5. **Given** a user is already unbanned, **When** the admin requests an unban, **Then** the system returns a clear no-op or already-unbanned result without mutating state.
6. **Given** the target user does not exist, **When** the admin attempts to ban or unban the account, **Then** the system returns a not-found error and no state change occurs.

---

### User Story 4 - Guard against unauthorized, expired, or banned admin access (Priority: P1)

As a system, I want every user-management action to be enforced at the backend so that only valid admins can list, search, filter, ban, or unban accounts and no unauthorized or expired session can alter account state.

**Why this priority**: Admin actions are privileged, and the contract explicitly requires unauthorized and forbidden handling for protected resources.

**Independent Test**: Attempt to access admin endpoints without authentication, with an expired token, with a non-admin account, and with a banned user account, then verify that access is denied and no state change occurs.

**Acceptance Scenarios**:

1. **Given** an unauthenticated request to an admin endpoint, **When** the request is evaluated, **Then** the system denies access with an authentication error and does not reveal any user-management data.
2. **Given** an expired or invalid token, **When** the admin attempts to list or manage users, **Then** the system denies the request and does not perform the action.
3. **Given** a valid authenticated non-admin account, **When** it attempts to access admin-only endpoints, **Then** the system denies access with a forbidden error and does not disclose any account list or change state.
4. **Given** a valid admin account whose session is expired or invalid, **When** it tries to ban or unban a user, **Then** the system does not apply the state change and requires re-authentication.
5. **Given** a target user has been banned by an admin, **When** that user sends any subsequent authenticated protected request, **Then** the system rejects the request with a ban state and does not execute the protected operation.
6. **Given** a user is banned and attempts to log in again, **When** authentication is evaluated, **Then** the system rejects the attempt and does not create a new authenticated session until the account is explicitly unbanned.

---

### User Story 5 - Handle empty, invalid, or failed outcomes safely (Priority: P2)

As an admin, I want clear and safe responses when the list is empty, the user cannot be found, or the request fails so that I can decide the correct next step without assuming a negative or hidden state.

**Why this priority**: Safe error handling is required by the API contract and the overall security model, especially for highly privileged operations.

**Independent Test**: Request list and action endpoints with empty data, nonexistent IDs, invalid payloads, and transient server failures. Verify that the system returns a correct error or empty state without leaking data or exposing protected information.

**Acceptance Scenarios**:

1. **Given** no matching user records exist for the current filter, **When** the admin requests the filtered list, **Then** the result is a valid empty response and not a system error.
2. **Given** a request references a user ID that does not exist, **When** the admin attempts to view, ban, or unban that account, **Then** the system returns a not-found error and no state change.
3. **Given** the admin provides a malformed request payload or missing required fields, **When** the request is processed, **Then** the system returns a validation error and no mutation occurs.
4. **Given** the backend or data layer fails during a ban or unban operation, **When** the request is executed, **Then** the system responds with a failure result and does not report a false success.

### Edge Cases

- A user list with no results must be handled as a valid empty state, not as a failed request.
- A requested user ID does not exist or has already been removed; the system must not reveal hidden internal data or claim that the account ever existed.
- A request can be valid but still fail because of database or service errors; the system must not claim success when the operation was not persisted.
- A target account can be already banned or already unbanned; duplicate state transitions are idempotent and must be handled consistently as no-op/duplicate-state results.
- `q`, `role`, and `is_banned` may be present together; the system must apply them as combined AND conditions, with default sort order and page size as defined by the product decision.
- Admin-visible fields must exclude password, password hash, tokens, or secrets even if they are present in the users table.
- A request to ban a user with a blank or whitespace-only reason is rejected as invalid input; an unban action does not require a reason unless the product explicitly decides otherwise.
- Admin self-ban and admin-target ban attempts are rejected as forbidden and are not treated as valid ban decisions.
- A ban persists until an explicit unban by an authorized admin; the feature does not add an automatic expiration or a temporary suspension state.
- A ban is separate from a temporary password lock. Password lock and user ban are different enforcement mechanisms and must not be conflated.
- Once a user is banned, subsequent authenticated protected requests are rejected until the account is explicitly unbanned; public browsing remains allowed so long as it does not require authenticated access.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a valid authenticated admin to access the user-management capability.
- **FR-002**: The system MUST allow a valid authenticated admin to view the user list within the currently approved project scope and must not expose password, password hash, token, or secret material.
- **FR-003**: The system MUST allow a valid authenticated admin to search or filter the user list by the currently defined criteria from the active contract, including `q`, `role`, and `is_banned` where they are active in the project contract.
- **FR-004**: The system MUST show enough user information to identify the correct account and its current status without exposing sensitive authentication data. The permitted admin-visible user fields are: `user_id`, `display_name`, `email`, `role`, `created_at`, `is_banned`, and `ban_reason` when a reason is recorded.
- **FR-005**: The system MUST allow a valid authenticated admin to ban only a non-admin account and MUST require a non-blank reason for the ban action.
- **FR-006**: The system MUST allow a valid authenticated admin to unban a user account and clear the active ban state, and MUST NOT add automatic expiry or temporary suspension behavior unless a separate project decision explicitly approves it.
- **FR-007**: The system MUST reject any request that does not originate from a valid authenticated admin.
- **FR-008**: The system MUST reject requests with expired, invalid, or missing authentication and MUST not perform any user-management action without a valid session.
- **FR-009**: The system MUST deny access to non-admin accounts and must not disclose any user-management data or perform state changes for unauthorized roles.
- **FR-010**: The system MUST reject any attempt to ban the acting admin or another admin account, and MUST treat that action as forbidden without changing state.
- **FR-011**: After a successful admin ban, the system MUST reject new login attempts for that account and MUST deny subsequent authenticated protected requests from the banned account until the account is explicitly unbanned. Public content access that does not require authenticated access remains outside this restriction.
- **FR-012**: The system MUST return a not-found result when the target user does not exist and MUST make no state change.
- **FR-013**: The system MUST return a validation error for malformed requests, invalid filter values, blank ban reasons, or missing required fields and MUST not mutate state.
- **FR-014**: The system MUST handle empty results as a valid empty state rather than as a failure.
- **FR-015**: The system MUST not expose password, password hash, tokens, session IDs, secrets, or similar sensitive fields in list results, error responses, or status messages.
- **FR-016**: The system MUST handle duplicate or repeated ban or unban requests consistently, either as a no-op or an idempotent success/failure result, without creating contradictory state.
- **FR-017**: The system MUST clearly distinguish between a valid empty result, a validation failure, an authorization failure, a not-found result, and an operation failure; a failed operation MUST never be reported as successful.
- **FR-018**: The system MUST keep the feature focused on account management. It MUST NOT add account deletion, password reset, impersonation, export, or admin-role grant/revoke behavior, and MUST NOT include content moderation or platform statistics in this feature.
- **FR-019**: The system MUST keep user-to-artist linking and artist administrative actions outside this feature scope and must not merge them into account management.
- **FR-020**: A user ban is a separate administrative state from temporary login failure locking; the system MUST treat ban enforcement and password-lock enforcement as distinct behaviors unless a separate product decision explicitly merges them.
- **FR-021**: The admin list MUST support the documented default query semantics: `q` is a trimmed case-insensitive substring match on `email` or `display_name`, `role` is an exact match, `is_banned` is a boolean filter, all filters apply by AND, results sort by `created_at` descending then `user_id` ascending, and each page contains at most 20 records.

### Key Entities

- **Admin Account**: An authenticated user with the `admin` role whose session is valid and whose permissions are sufficient to access the user-management capability.
- **Target User Account**: A user record in the system identified by a unique account ID and optionally by search or filter fields such as role and ban state.
- **User Account Status**: The current admin-visible account state, including account identity, role, creation timestamp, and current ban status. The exact admin-visible fields are limited to the approved list defined in this specification.
- **Ban Record / Ban Decision**: The administrative action that changes a user's ban state and stores a required non-blank reason. The ban remains active until an authorized unban action clears it.
- **User Directory Result Set**: The filtered list returned to the admin after applying query and role/ban criteria. This is the read model for account management and must not reveal sensitive secret material.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Valid authenticated admins can view the user directory and apply the active filters without exposing sensitive account data.
- **SC-002**: Valid authenticated admins can change a target account from unbanned to banned and from banned to unbanned without affecting unrelated users.
- **SC-003**: Invalid auth, insufficient role, expired session, missing target account, empty result sets, and malformed requests all produce the correct error or empty result without exposing sensitive data.
- **SC-004**: No user-management endpoint exposes passwords, password hashes, tokens, or secrets in the response or error payload.
- **SC-005**: Repeated ban or unban attempts do not create contradictory state and the system maintains a consistent final account status.
- **SC-006**: Empty result sets and invalid or missing target users are handled safely and clearly, without reporting a false success.
- **SC-007**: The feature remains scoped to user management and does not combine content moderation, platform statistics, deletion, password reset, impersonation, or artist-link management.

## Assumptions

- This feature depends on the existing authentication system and admin-role enforcement already described in the project documents.
- The active API contract defines the admin endpoints and query names; the clarified default behavior for the admin list in this specification resolves the missing filter/search/sort/pagination semantics for the draft acceptance criteria.
- The current source evidence supports a persistent ban state with explicit unban action. This specification does not include a temporary suspension or automatic expiry mechanism.
- The system is expected to treat ban actions as top-level admin management only; no temporary ban or self-service unban mechanism is included in this feature.
- The feature does not define account deletion or password reset; those remain outside scope even if a user is banned.
- This feature assumes the existing `users` table has a `role` and a ban flag or equivalent state, but it does not require or specify a new schema.
- Any future change to the ban policy (for example, a temporary ban or a different session invalidation rule) would need a separate product decision and a corresponding update to this specification.
- Source documents reviewed in this branch do not show a direct contradiction with the clarified decisions; the specification distinguishes between source-based decisions and the explicitly clarified operational behavior.
