# Feature Specification: Semantic Vector Music Search

**Feature Branch**: `033-semantic-vector-search`

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "Enable music discovery from emotional, contextual, or mood-based descriptions using LLM-assisted vector search over music metadata, lyrics, and audio features; protect personal data from third-party AI services; and fall back to keyword search when AI services are unavailable."

## Clarifications

### Session 2026-10-29

- Q: When metadata, lyrics, and audio characteristics produce different similarity signals, how should the system combine them into the final ranking score? → A: Use a weighted ensemble with metadata at 30%, lyrics at 40%, and audio characteristics at 30%; re-normalize the weights when a dimension is unavailable.
- Q: Which audio-characteristic fields should be included in the searchable music representation? → A: Include tempo/BPM, key, mode, energy, valence, danceability, acousticness, instrumentalness, speechiness, loudness, liveness, time signature, and duration.
- Q: How should the system protect personal names in a user query while preserving artist names that the listener intentionally wants to search for? → A: Use local profile matching, email detection, and context-aware name detection; preserve recognized catalog artist names; use keyword fallback when ambiguity remains.
- Q: What input-validation and timeout thresholds should define the first-version search experience? → A: Accept any query containing at least one meaningful alphanumeric token up to 150 characters; reject only empty or whitespace-only input; trigger keyword fallback after 1,500 milliseconds if semantic processing has not produced a usable result.
- Q: How should human reviewers determine whether a returned song is relevant to a natural-language music query? → A: Use a 1–5 relevance scale; scores 4–5 count as relevant; multiple reasonable interpretations may pass when each satisfies the query's stated intent.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Describe a Mood and Discover Music (Priority: P1)

As a listener, I want to describe an emotion, context, or mood in natural language so that I can discover suitable music without knowing an exact title, artist, or keyword.

**Why this priority**: Natural-language discovery is the core value of the feature and enables users to find music from intent rather than catalog terminology.

**Independent Test**: Submit a supported natural-language description such as “sad music for a rainy night” and verify that a usable, ranked set of relevant songs is returned.

**Acceptance Scenarios**:

1. **Given** the listener is on the music search interface, **When** they submit a natural-language mood or context description, **Then** the system returns a ranked list of matching songs with the standard song information needed to identify and play each result.
2. **Given** the listener submits a description containing emotional or contextual meaning rather than an exact song term, **When** matching completes, **Then** the results reflect the described intent and are not limited to literal word matches.
3. **Given** the listener submits an empty or whitespace-only description, **When** they attempt to search, **Then** the system asks for a meaningful search description and does not issue a search.

---

### User Story 2 - Search Across Music Meaning and Characteristics (Priority: P1)

As a listener, I want search results to reflect a song's metadata, lyrics, and audio characteristics so that the results capture both lyrical meaning and musical feel.

**Why this priority**: Combining these content dimensions is necessary for queries where the intended mood may be expressed by lyrics, genre, or sound rather than by a single catalog field.

**Independent Test**: Prepare songs whose metadata, lyrics, and audio characteristics represent distinct moods, submit representative natural-language queries, and verify that relevant songs from each content dimension can be retrieved and ranked.

**Acceptance Scenarios**:

1. **Given** searchable songs have available metadata, lyrics, and audio characteristics, **When** a listener submits a mood-based query, **Then** the matching process considers the available content dimensions when ranking results.
2. **Given** one content dimension is unavailable for a song, **When** the song is searched, **Then** the system continues using the other available dimensions and does not fail the entire search.
3. **Given** the catalog contains multiple matching songs, **When** results are returned, **Then** they are presented in relevance order and do not contain duplicate song entries.

---

### User Story 3 - Continue Searching During AI Service Unavailability (Priority: P1)

As a listener, I want search to remain usable when the AI service is unavailable so that a temporary dependency outage does not prevent basic music discovery.

**Why this priority**: Search remains a core user function even when semantic enrichment cannot be performed; graceful degradation preserves access and trust.

**Independent Test**: Make the AI-dependent search operation unavailable, submit a query containing recognizable catalog terms, and verify that keyword results are returned with a clear indication that fallback search was used.

**Acceptance Scenarios**:

1. **Given** the AI-dependent search operation is unavailable or times out, **When** the listener submits a search, **Then** the system automatically performs keyword search using the submitted text.
2. **Given** fallback keyword search is active, **When** results are displayed, **Then** the listener receives usable results or a clear no-results message without an unhandled error.
3. **Given** the AI-dependent search operation becomes available again, **When** the listener performs a later search, **Then** the system may resume semantic search without requiring a user configuration change.

---

### User Story 4 - Keep Personal Data out of Third-Party AI Processing (Priority: P1)

As a listener, I want my personal information to remain private while using semantic search so that my name and email address are never disclosed to third-party AI services.

**Why this priority**: Preventing personal-data disclosure is a non-negotiable trust and privacy requirement for an AI-assisted feature.

**Independent Test**: Perform semantic searches with an authenticated user whose profile contains a name and email address, inspect all data sent to third-party AI services, and verify that neither field is present.

**Acceptance Scenarios**:

1. **Given** the listener is authenticated and has a name and email address in their profile, **When** semantic search processes the query and searchable content, **Then** no name or email address is sent to a third-party AI service.
2. **Given** user-provided text contains personal information, **When** it is prepared for third-party AI processing, **Then** the system removes or masks personal information before transmission, or uses the fallback search path if safe preparation cannot be confirmed.
3. **Given** a search is completed, **When** search diagnostics or audit records are created, **Then** they do not expose the listener's name or email address to third-party AI services.

### Edge Cases

- The query contains unsupported language, slang, emojis, or a combination of mood and context; the system returns the best available matches or a clear no-results message.
- The query is extremely long or contains repeated text; the system applies a user-friendly input limit or normalization rule and remains responsive.
- A song has missing lyrics, missing metadata, or incomplete audio characteristics; the song remains eligible using the information that is available.
- The AI service returns an invalid response, an unsafe response, a rate-limit response, or a timeout; the system treats this as AI unavailability and uses keyword fallback where possible.
- The vector search operation returns no relevant matches; the system presents a clear no-results state and may offer keyword fallback without claiming semantic relevance.
- The catalog is empty or temporarily unavailable; the system communicates that no music is currently available rather than showing an unhandled error.
- A query contains a user's name or email address intentionally; the privacy rule still applies and the personal data is not transmitted to a third-party AI service.
- A user submits repeated searches; the system does not expose personal data through search history, result labels, error messages, or service diagnostics.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a listener to submit a natural-language description of an emotion, context, or mood as a music search query.
- **FR-002**: The system MUST return a ranked result set of songs that is relevant to the meaning of the submitted query, not only to exact keyword matches, when semantic search is available.
- **FR-003**: The semantic matching process MUST be able to use available song metadata, lyrics, and audio characteristics as searchable content.
- **FR-003a**: The audio-characteristics content MUST include, when available, tempo/BPM, key, mode, energy, valence, danceability, acousticness, instrumentalness, speechiness, loudness, liveness, time signature, and duration.
- **FR-004**: The system MUST represent the query and searchable music content in a comparable semantic form and use similarity of that representation to determine result relevance.
- **FR-004a**: The system MUST calculate the semantic relevance score as a weighted ensemble of metadata similarity (30%), lyrics similarity (40%), and audio-characteristics similarity (30%), with the weights re-normalized across dimensions available for both the query and the song.
- **FR-005**: The system MUST display enough standard song information for a listener to understand each result and initiate the existing playback flow.
- **FR-006**: The system MUST avoid duplicate songs in a single result set and MUST provide results in descending order of the weighted semantic relevance score or the applicable keyword ranking score.
- **FR-007**: The system MUST automatically use keyword search when the AI-dependent semantic search operation is unavailable, times out, returns an invalid response, or cannot safely process the request.
- **FR-008**: The system MUST provide a clear user-facing indication when keyword fallback is used, without exposing internal service credentials or sensitive diagnostic details.
- **FR-009**: The system MUST continue to return a user-friendly no-results or unavailable-catalog state when neither semantic search nor keyword fallback can produce results.
- **FR-010**: The system MUST NOT send a listener's name or email address to any third-party AI service.
- **FR-011**: The system MUST inspect and sanitize user-provided query content before any third-party AI processing and MUST use a safe alternative, including keyword fallback, when personal-data removal cannot be verified.
- **FR-011a**: The system MUST perform personal-data detection locally using authenticated-profile matching, email detection, and context-aware name detection; it MUST preserve names recognized as catalog artists and MUST use keyword fallback when the distinction between personal data and an intended artist search cannot be established safely.
- **FR-012**: The system MUST prevent names and email addresses from being included in third-party AI requests, search diagnostics, or AI-related error payloads.
- **FR-013**: The system MUST support songs with incomplete searchable content by using the content dimensions that are available.
- **FR-014**: The system MUST preserve the meaning of the listener's query during normalization while handling supported language, punctuation, emojis, and common variations consistently.
- **FR-015**: The system MUST accept queries containing at least one alphanumeric token up to 150 characters, MUST reject only empty or whitespace-only input at validation time, and MUST provide a clear validation message when the character limit is exceeded.
- **FR-016**: The system MUST stop waiting for a usable semantic-search response after 1,500 milliseconds and automatically start keyword fallback.
- **FR-017**: Human evaluation of semantic-search relevance MUST use a 1–5 scale, where scores of 4 or 5 count as relevant; reviewers MUST allow multiple reasonable genre or style interpretations when each satisfies the query's stated intent.

### Key Entities

- **Search Query**: A listener's natural-language description, including its normalized form, processing status, and whether semantic or keyword search was used.
- **Music Search Document**: The searchable representation of a song's available metadata, lyrics, and audio characteristics, without personal listener information.
- **Semantic Representation**: A privacy-safe representation of a search query or music search document used to compare meaning and relevance.
- **Audio Characteristics**: The searchable musical attributes of a song: tempo/BPM, key, mode, energy, valence, danceability, acousticness, instrumentalness, speechiness, loudness, liveness, time signature, and duration.
- **Search Result**: A ranked song returned for a query, including relevance ordering and the information needed for the existing playback experience.
- **Search Mode**: The processing state identifying semantic search or keyword fallback for a completed search.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a representative evaluation set of at least 100 mood- or context-based queries, at least 80% of queries return at least one result rated 4 or 5 on the defined 1–5 human relevance scale when semantic search is available.
- **SC-002**: At least 90% of listeners in usability testing can submit a natural-language mood search and identify a playable relevant result on their first attempt.
- **SC-003**: For at least 95% of semantic searches under normal service conditions, listeners see an initial result state within 3 seconds.
- **SC-003a**: When semantic processing does not produce a usable response within 1,500 milliseconds, keyword fallback begins without waiting for a longer AI-service timeout.
- **SC-004**: When the AI-dependent search operation is unavailable, at least 99% of eligible searches complete through keyword fallback or a clear no-results/unavailable state without an unhandled error.
- **SC-005**: In privacy verification tests, 100% of inspected requests to third-party AI services contain neither listener names nor email addresses, including queries, content sent for processing, diagnostics, and error payloads.
- **SC-006**: In a catalog quality evaluation, fewer than 1% of result sets contain duplicate song entries.
- **SC-007**: At least 90% of usability-test participants understand whether semantic search or keyword fallback produced their results when the fallback indicator is shown.

## Assumptions

- The existing AuraTune search interface and playback flow can display ranked song results.
- The catalog can provide some combination of song metadata, lyrics, and audio characteristics for indexing or search preparation.
- LLM and vector-based processing may be performed by approved internal or third-party services, subject to the privacy requirements in this specification; the specific providers and technologies are intentionally left for architecture and planning.
- Third-party AI services are not trusted with listener identity data, and the system can determine whether data is safe to transmit before making a request.
- Keyword search is already available or will be available as the baseline search capability used for fallback.
- Semantic search is initially intended for authenticated or unauthenticated listeners under the same catalog access rules as the existing search experience; this feature does not introduce new permissions.
- Search history, personalization, and automatic playlist generation are out of scope for this feature unless separately specified.
- Performance targets apply to normal operating conditions and exclude periods when the catalog or required search dependencies are unavailable.
- Human evaluation may count more than one musical interpretation as relevant when each interpretation reasonably satisfies the query's explicit mood, context, or activity intent.
