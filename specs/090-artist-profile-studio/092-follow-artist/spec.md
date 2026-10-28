# Feature Specification: Follow Artist

**Feature Branch**: `092-follow-artist-spec`

**Created**: 2026-10-28

**Status**: Draft — Ready for Planning

**Input**: User description: "Feature 092 — authenticated users can follow and unfollow artists, recognize their own following state, and view the artists they follow."

## Clarifications

### Session 2026-10-28

- Q: What happens when a followed artist is no longer public? → A: Omit the artist without a placeholder, retain the relationship and original follow time, and show it again when public unless unfollowed. Allow valid owner unfollow requests while hidden without revealing names, images, or internal profile status; add no hidden-artist interface.
- Q: How is the list ordered? → A: Follow time descending, then artist ID ascending. Duplicate follow preserves the original follow time.

- Q: When follow and unfollow for the same account and artist overlap across devices, which operation determines the final state? → A: The operation successfully processed last by the system determines the saved state, regardless of device click time. The next successful state load on each device reflects the saved result; real-time synchronization is not required. Failed operations do not change saved state, and duplicate follow preserves the original follow time.

- Q: Which signed-in roles may follow/unfollow artists and view their own following list? → A: User, Artist, and Admin may use these personal capabilities when authenticated and not banned. Within feature 092, no role may read another account's private following list or change another account's following relationships. Unauthenticated guests cannot use these capabilities. This is an explicit decision confirmed in this session.

- Q: What happens when an account unfollows an artist that has been permanently deleted? → A: Return the same artist-not-found outcome as for a nonexistent ID, without disclosing old information or that the artist ever existed. Deleted artists do not appear in the following list. Feature 092 does not decide relationship storage or cleanup after deletion. Owner unfollow of an existing hidden profile remains allowed under Q1.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Follow an Artist and Recognize My State (Priority: P1)

As a signed-in listener, I want to follow an artist from their publicly accessible profile and recognize whether I already follow them, so I can keep a personal collection of artists.

**Why this priority**: Establishing and recognizing the personal relationship is the core value of this feature.

**Independent Test**: Use a publicly accessible artist and an authenticated account with no existing relationship; follow the artist and revisit the profile to verify the saved state.

**Acceptance Scenarios**:

1. **Given** an authenticated account that does not follow a publicly accessible artist, **When** the profile's personal following state is loaded, **Then** it indicates that this account is not following the artist.
2. **Given** the same account and artist, **When** the user follows the artist successfully, **Then** the account has exactly one following relationship with that artist and the profile indicates Following.
3. **Given** an account already following a publicly accessible artist, **When** the user revisits the profile in a later authenticated session, **Then** the profile indicates Following for that account.
4. **Given** an account already following a publicly accessible artist, **When** follow is repeated, **Then** the account remains following with exactly one relationship and the original follow time is unchanged; any duplicate outcome is reconciled without presenting a new relationship as created.
5. **Given** an artist that does not exist or is no longer publicly accessible, **When** follow is attempted, **Then** no new relationship is created, the user receives the same artist-not-found outcome in both cases, without disclosure of record existence, name, image, biography, related content, visibility state, or unavailability reason.

---

### User Story 2 - Stop Following an Artist (Priority: P1)

As a signed-in listener, I want to unfollow an artist so my collection reflects my current interests.

**Why this priority**: Users must retain control over relationships they create.

**Independent Test**: Start with an existing relationship to a publicly accessible artist, unfollow it, and revisit the profile and personal following list.

**Acceptance Scenarios**:

1. **Given** an account following a publicly accessible artist, **When** unfollow succeeds, **Then** the relationship is absent, the profile indicates Not following, and the artist is absent from the account's following list on its next successful load.
2. **Given** an account not following an existing publicly accessible artist, **When** unfollow is repeated, **Then** the account remains not following and no other relationship changes.
3. **Given** a successful unfollow, **When** the account follows that artist again successfully, **Then** exactly one new relationship exists, its follow time is the time of this new successful follow, and the personal state indicates Following.

4. **Given** the authenticated account owns a relationship to an artist whose profile is hidden, **When** it sends a valid unfollow request, **Then** the relationship is removed without disclosing the artist name, image, or internal profile status; no hidden-artist interface is added.
5. **Given** that hidden artist was successfully unfollowed, **When** the profile becomes public again, **Then** the artist does not reappear in the account's following list unless followed again.
6. **Given** an authenticated, non-banned account sends an unfollow request using an unknown ID or the ID of a permanently deleted artist, **When** the request is evaluated, **Then** both cases return the same artist-not-found outcome without old artist information or any indication that the artist ever existed; no other relationship is changed.

---

### User Story 3 - View My Followed Artists (Priority: P2)

As a signed-in listener, I want to see the artists I follow so I can return to their public profiles.

**Why this priority**: The collection makes the saved relationships useful beyond an individual profile.

**Independent Test**: Prepare distinct relationships for two accounts and verify each account's collection, including an account with none.

**Acceptance Scenarios**:

1. **Given** an authenticated account with followed publicly accessible artists, **When** it opens its following list successfully, **Then** each eligible followed artist appears once with a public display name and a way to open their public profile; artists followed only by another account do not appear.
2. **Given** an account with no relationships, **When** its list loads successfully, **Then** it sees an explicit empty state rather than a failure or loading indicator.
3. **Given** a successful follow or unfollow, **When** the personal list is next loaded successfully, **Then** membership reflects the confirmed change.
4. **Given** a previously followed artist whose profile is no longer public, **When** the list is viewed or a previously known profile link is opened, **Then** restricted content is never disclosed; the artist is omitted from the list without a placeholder, the relationship and original follow time are retained, and no restricted information is displayed; opening the old link produces the same artist-not-found outcome as a nonexistent artist.

5. **Given** a hidden followed artist becomes public again and the relationship still exists, **When** the list next loads successfully, **Then** the artist reappears in the position determined by its original follow time.
6. **Given** followed artists with different follow times, **When** the list loads, **Then** the most recently followed artist appears first; equal times are ordered by ascending artist ID.
7. **Given** the account only follows artists whose profiles are hidden, **When** the list loads successfully, **Then** the normal empty state appears without hidden-artist entries, names, images, or internal profile status.
8. **Given** a mixture of public and hidden followed artists, **When** the list is shown, **Then** only public entries are represented and no count, label, placeholder, or error detail reveals hidden entries.
9. **Given** an artist previously followed by the account has been permanently deleted, **When** the following list loads successfully, **Then** the artist is absent and no name, image, placeholder, count, or message reveals the deleted artist or its prior existence, regardless of how the underlying relationship is stored or cleaned up.

---

### User Story 4 - Keep Personal Actions Safe During Failures (Priority: P1)

As a listener, I want clear failure feedback and account-specific state so I can trust that an unsuccessful action or account change does not affect another person's collection.

**Why this priority**: Personal ownership and truthful feedback are required for every journey.

**Independent Test**: Exercise unauthenticated access, expired authentication, two accounts with different relationships, rejected changes, and interrupted responses.

**Acceptance Scenarios**:

1. **Given** no valid authenticated session, **When** follow, unfollow, or personal-list access is attempted, **Then** access requires authentication and no relationship changes or personal list is disclosed.
2. **Given** authentication expires during an action, **When** authentication cannot be restored by the existing authentication flow, **Then** the user is asked to sign in again and no unconfirmed result is presented as successful.
3. **Given** account A is authenticated, **When** an attempt identifies account B as the owner of a change or list, **Then** B's relationships cannot be changed or disclosed through this feature.
4. **Given** a rejected change or interrupted response, **When** the result is displayed, **Then** the user receives failure or uncertainty feedback and a retry opportunity; confirmed state is preserved for a definite rejection, while an uncertain result is checked before a definitive following state is shown.
5. **Given** a personal-list load fails, **When** feedback is displayed, **Then** failure is distinguishable from an empty collection and retry is available.
6. **Given** account A has signed out and account B signs in, **When** personal state or a delayed result from A would be displayed, **Then** A's personal data is not shown as B's data and no pending action is reassigned to B.

7. **Given** the same account sends follow and unfollow for one public artist from two devices, **When** follow is successfully processed first and unfollow is successfully processed last, **Then** the saved state is Not following and each device's next successful state or list load reflects it, regardless of click times.
8. **Given** the same overlapping operations, **When** unfollow is successfully processed first and follow is successfully processed last, **Then** the saved state is Following and each device's next successful state or list load reflects it, without requiring real-time updates.
9. **Given** one operation succeeds and an opposing operation fails, **When** the saved state is loaded successfully, **Then** it reflects the successful operation; the failed operation has made no change.
10. **Given** an account already follows a public artist, **When** follow requests from two devices are successfully processed without an intervening successful unfollow, **Then** exactly one relationship remains and its original follow time is unchanged.

11. **Given** an authenticated, non-banned account with each of the User, Artist, and Admin roles in turn, **When** it follows or unfollows a public artist and loads its own following list, **Then** the actions are allowed and only that account's relationships are returned or changed.
12. **Given** each authenticated role in turn, including Admin, **When** it attempts to read another account's private following list or change that account's relationships, **Then** access is denied, no private list is disclosed, and no relationship changes.
13. **Given** an unauthenticated guest or a banned account, **When** follow, unfollow, or personal-list access is requested, **Then** access is denied without changing saved relationships or disclosing the private list; public profile viewing remains governed separately by feature 091.

### Edge Cases

- Repeated follow or unfollow actions must converge to one or zero relationships respectively, without duplicates or changes to other artists.
- An artist becomes unavailable between opening their profile and confirming follow: recheck eligibility and do not establish a new relationship to an unavailable artist.
- An artist becomes unavailable after being followed: omit the artist without a placeholder, retain the relationship and original follow time, and permit a valid owner unfollow request without revealing hidden profile information.
- An unfollow target that is nonexistent or permanently deleted produces the same artist-not-found outcome without disclosing prior existence; other relationships are unchanged. A deleted artist never appears in the list. Storage and cleanup after deletion remain outside feature 092.
- A missing artist image must not prevent recognizing an otherwise publicly accessible artist by their public name.
- Failure to load following state must be distinguishable from a confirmed Not following state.
- A lost response may hide a completed action: reconcile actual state before claiming success or failure, and allow retry without duplicate relationships.
- Overlapping changes across sessions or devices follow system successful-processing order, not device click times. The next successful state or list load reflects the saved relationship; continuous live updates are not required. Failed operations do not change the saved state.
- A list containing only hidden artists shows the normal empty state; restoring public visibility restores only relationships that were not unfollowed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow an authenticated user to follow an existing artist whose profile is publicly accessible.
- **FR-002**: The system MUST allow an authenticated user to unfollow an artist they follow, including a hidden artist through a valid request, without changing relationships with other artists or adding a hidden-artist interface.
- **FR-003**: Following state, changes, and personal lists MUST be scoped to the authenticated account. No role, including Admin, MAY read another account's private following list or change another account's following relationships within feature 092. The owner MUST be the authenticated account.
- **FR-004**: Each account–artist pair MUST have at most one following relationship. Repeating follow for an existing publicly accessible artist MUST leave one relationship and MUST NOT change its original follow time; repeating unfollow for an existing publicly accessible artist MUST leave none. These are required final states, not new transport response rules.
- **FR-005**: On a public artist profile, authenticated users MUST be able to distinguish confirmed Following, confirmed Not following, and an unresolved or failed state for their own account. Unresolved state MUST NOT be presented as Not following.
- **FR-006**: A confirmed change MUST be reflected in the displayed personal state and the next successful personal-list load, and MUST persist across later authenticated sessions until unfollowed while the account and artist continue to exist; hidden-profile behavior MUST follow FR-013. This feature does not define permanent account or artist deletion.
- **FR-007**: The system MUST provide an authenticated user with their own followed-artists list, without duplicates, using only publicly permitted artist information. Hidden or unauthorized information MUST NOT be inferable through counts, labels, placeholders, or error details. Each publicly accessible entry MUST identify the artist by public display name and allow opening their public profile.
- **FR-008**: A successfully loaded collection with no publicly visible followed artists MUST have an explicit empty state, including when retained relationships refer only to hidden profiles. A failed or unfinished load MUST NOT be presented as an empty collection.
- **FR-009**: Authenticated, non-banned accounts with the User, Artist, or Admin role MUST be allowed to follow/unfollow artists and view their own following list. Unauthenticated guests, banned accounts, and unauthorized requests MUST NOT change relationships or disclose personal following data. When existing authentication recovery cannot restore access, the user MUST be directed to sign in again.
- **FR-010**: A failed change MUST NOT modify the saved relationship state and MUST provide understandable feedback and retry. The last confirmed display MUST NOT override a newer saved result from another successful operation. An uncertain outcome MUST be reconciled before a definitive state is displayed. Retrying MUST satisfy FR-004.
- **FR-011**: Following a nonexistent or non-public artist MUST be rejected without creating a relationship or exposing restricted artist information. A nonexistent and a non-public artist MUST produce the same artist-not-found outcome for follow attempts and public-profile access, without revealing record existence, name, image, biography, related content, visibility state, or reason. Owner unfollow of a retained hidden relationship remains allowed under FR-013.
- **FR-012**: Account changes MUST clear or replace personal following state with that of the newly authenticated account; delayed results from a previous account MUST NOT be displayed as, or applied to, the new account's data.
- **FR-013**: When a followed profile becomes non-public, the system MUST omit the artist from the personal list without a placeholder while retaining the relationship and original follow time. If the profile becomes public again, it MUST reappear in the required order unless unfollowed. A valid unfollow request by the relationship owner MUST remain allowed while the profile is hidden and MUST NOT disclose the artist name, image, or internal profile status. No interface displaying hidden artists MUST be added.
- **FR-014**: The personal list MUST be ordered by follow time descending, with ascending artist ID as the tie-break rule. Repeated follow MUST preserve the original follow time and list position relative to unchanged entries. A new follow after successful unfollow MUST use the time of the new relationship.

- **FR-015**: For overlapping follow/unfollow operations on the same account–artist pair, the operation successfully processed last by the system MUST determine the saved state, regardless of device click times. Failed operations MUST NOT change that state. Each device MUST reflect the saved result on its next successful state or list load; real-time synchronization is not required. Duplicate follow MUST still preserve the original follow time under FR-004.

- **FR-016**: Unfollow requests for a permanently deleted artist or a nonexistent artist ID MUST return the same artist-not-found outcome, without disclosing old information or prior existence. Permanently deleted artists MUST NOT appear in the following list or be inferable through placeholders, counts, labels, or error details. Feature 092 MUST NOT prescribe relationship storage or cleanup after deletion. This does not alter FR-013: an existing hidden profile can still be unfollowed by the relationship owner.

### Key Entities

- **Authenticated Account**: The current owner of following relationships and personal list access. User, Artist, and Admin accounts are eligible for their own personal capabilities when authenticated and not banned, as explicitly confirmed in this session; no role receives cross-account access within this feature.
- **Artist**: An existing artist identity with publicly permitted profile information and current public accessibility. Following grants no additional content access.
- **Artist Following Relationship**: The presence or absence of a personal association between one account and one artist, including its original follow time for ordering. This is a conceptual entity, not a schema decision.
- **Personal Followed-Artists Collection**: The current account's view of its following relationships, subject to public visibility and the user-confirmed ordering and hidden-profile decisions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every successful follow/unfollow acceptance test results in exactly one/zero relationships for the tested account–artist pair, including repeated operations and revisiting in a later session. Duplicate follow preserves the original follow time.
- **SC-002**: In all two-account isolation tests, no action changes the other account's relationships and no personal list or following state is attributed to the wrong account.
- **SC-003**: All empty-list, failed-load, unresolved-state, and expired-session acceptance cases produce distinguishable outcomes; nonexistent and non-public artists produce the same artist-not-found outcome with zero false success confirmations and zero restricted-content disclosures.
- **SC-004**: In every primary-journey acceptance check, an authenticated user can follow a public artist, find it in their own following list, open its public profile, and unfollow it; the next successful load shows the confirmed membership without affecting another account.

- **SC-005**: In every ordering and visibility acceptance test, visible entries follow descending follow time and ascending artist ID for ties; hidden entries are absent, restoration preserves original ordering, and successful owner unfollow prevents later restoration of that relationship.

- **SC-006**: In every cross-device overlapping-operation acceptance check, the next successful load on each device shows the result of the operation successfully processed last; failed operations cause zero saved-state changes and duplicate follows cause zero original-follow-time changes.

## Assumptions

### Scope and Dependencies

- This feature depends on existing authentication and public artist access. It grants no access to private profiles, artist studio information, unpublished music, or otherwise restricted content. Public-profile eligibility and content boundaries follow [feature 091](../091-artist-profile/spec.md), especially FR-006–FR-008 and FR-018–FR-018A. This feature does not define or change public-visibility status.
- Following users, profile editing, song management, release notifications, automatic playback, music recommendations, and administration are outside scope.
- User, Artist, and Admin eligibility and the absence of cross-account access in this feature are explicit session-confirmed decisions; they do not introduce administrative capabilities or change public profile viewing.
- No new sorting controls, search, filters, pagination policy, follower counts, or follow limits are assumed. Default ordering and hidden-profile behavior are explicit user decisions recorded below.
- Repeated-operation final states in FR-004 are behavioral requirements of this draft; the available contract does not specify endpoint-specific duplicate/no-op responses.
- Success criteria verify the specified behavioral journeys; no follow-specific response-time or participant-percentage target is asserted by the sources.

### User-Confirmed Decisions

The user explicitly selected the recorded behaviors during Specify and Clarify on 2026-10-28. They are feature instructions, not assumptions or evidence of wider team approval.

- Hide non-public followed artists without a placeholder, retain relationships and original follow times, and restore entries when profiles become public again.
- Allow valid owner unfollow requests while hidden without revealing names, images, or internal profile status. Add no interface displaying hidden artists.
- Order by follow time descending, then artist ID ascending. Duplicate follow preserves the original follow time. A follow after successful unfollow establishes a new follow time.

### Existing Contract Alignment

The existing [API Contract](../../../docs/analysis-and-design/api-contract.md), section 2.8, already defines authenticated follow, unfollow, and personal following-list capabilities. This feature uses only those capabilities; the references below document existing coverage rather than define new interfaces.

| Existing capability | Existing contract reference | Behavioral coverage |
| --- | --- | --- |
| Follow artist | `PUT /artists/:id/follow` — User | FR-001, FR-003, FR-004, FR-006, FR-009–FR-012 |
| Unfollow artist | `DELETE /artists/:id/follow` — User | FR-002–FR-004, FR-006, FR-009, FR-010, FR-012, FR-013 |
| Own followed artists | `GET /users/me/following-artists` — User | FR-003, FR-005, FR-007–FR-010, FR-012–FR-014 |
| Public artist profile | `GET /artists/:id` — Public | Entry point and public-content boundary only; profile specification is outside this feature |

No dedicated following-status interface is specified in the contract. Recognition of personal state must use existing contracted capabilities; this specification adds no endpoint, payload field, schema, response code, or authentication mechanism. The contract's shared authentication, forbidden-access, not-found, duplicate, and failure conventions remain applicable. The contract does not settle hidden-profile behavior or list order; the user-confirmed decisions define feature behavior without adding interfaces. The session-confirmed FR-016 defines only user-visible behavior after permanent deletion; storage and cleanup policies are not inferred from the hidden-profile decision.

### Source Review and Alignment

All sources requested in the original Specify prompt, plus feature 091 and sample 101, were read on the current `092-follow-artist-spec` branch after its update. The previous missing-source notes no longer apply. No source document or other feature specification was changed.

| Reviewed source | Findings and effect on this specification |
| --- | --- |
| [Vision Document](../../../docs/proposal/Auratune_Vision_Document.md), N-08 and G09 | Supports following artists and returning to their profiles. Responsive web use and existing account identity apply; following does not initiate AI or playback. |
| [Project Proposal](../../../docs/proposal/proposal.md), sections 1, 3, and 5.9 | Supports listener following and separates artist content management. No follow-specific timing, list order, or notification rule is supplied. |
| [Team Contract](../../../docs/management/team-contract.md), sections 1 and 4 | Group 09 belongs to Hoàng; English Markdown is required. This spec does not claim that session decisions constitute wider team approval. |
| [API Contract](../../../docs/analysis-and-design/api-contract.md), sections 1 and 2.8 | Existing authenticated follow, unfollow, and own-list capabilities cover this scope. Shared access/failure conventions remain applicable; no new API is defined. |
| [Database README](../../../docs/design/database/README.md), sections 3–6 | Documents separate user-to-artist and user-to-user relationships. The reference schema is not a final deployment design; deletion rules remain undecided. |
| [ER Diagram](../../../docs/design/database/er-diagram.md), sections 2–4 | Documents account–artist references and the composite identity of `user_follows_artist`, consistent with FR-003/FR-004. It does not establish follow-time storage or hidden-profile retention; these behavioral decisions do not prescribe a schema. |
| [Security README](../../../docs/design/security/README.md), shared principles 1, 2, 6, and 7 | Supports enforced ownership, least privilege, and non-disclosing errors. Merely hiding controls does not authorize a request; FR-003/FR-009/FR-012 apply to every access and change. |
| [Specs README](../../README.md), sections 2–7 | Confirms feature 092 under Group 090, stable identifiers, feature scope boundaries, and the current branch naming format. Directory presence is not evidence of team-approved behavior. |
| [Feature 091](../091-artist-profile/spec.md), FR-006–FR-008, FR-018–FR-018A, and FR-024–FR-026 | Public-profile access hides private/internal content and uses identical not-found outcomes for nonexistent/non-public artists. Follow controls belong to 092; artist-track management belongs to 093. FR-007/FR-011 and acceptance scenarios now explicitly preserve these boundaries. |
| [Sample 101](../../100-ai-recommendations/101-listening-history-analysis/spec.md) | Presentation and detail reviewed: prioritized journeys, Given/When/Then scenarios, account isolation, edge cases, behavioral requirements, conceptual entities, measurable outcomes, and recorded decisions. Its analytics rules and input sources are not copied into this feature. |

### Source Limits and Decision Consistency

- No conflict was found between Q1/Q2 and the reviewed sources. Feature 091's not-found rule governs public-profile viewing, not an authenticated owner's removal of their own retained relationship. Q1 does not add hidden-profile browsing or disclose hidden artist metadata.
- The API Contract and reference database documents do not define default list order, follow-time storage, hidden-profile retention, restoration, or endpoint-specific duplicate/no-op responses. Q1/Q2 provide the feature's behavioral decisions; their absence from those documents is not treated as a conflicting source rule or proof of a completed technical design.
- Permanent artist/account deletion and related cleanup remain a shared lifecycle concern: the database sources explicitly leave deletion behavior undecided. The Q1 retention/restoration rule applies to an existing profile becoming non-public, not to permanent deletion. FR-016 defines the identical artist-not-found outcome for unfollow of unknown/deleted IDs and omission of deleted artists from the list; no deletion cascade, retention period, or schema change is selected here.
- Existing authentication, public artist eligibility, permitted public fields, relationship identity, and successful state retrieval are dependencies. Their technical implementation is deferred; no new API, database column, framework, or authentication mechanism is chosen.
- The core Spec Kit template remains active, with no override/preset/extension template layer. The constitution still contains placeholders rather than ratified principles. No extension hook configuration exists. Specify source review and Clarify are complete. Plan, Tasks, and Implement have not been run.

