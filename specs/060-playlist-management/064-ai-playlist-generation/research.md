# Research: AI Playlist Generation

**Feature**: [064 AI Playlist Generation](./spec.md)
**Date**: 2026-11-09

## Specification Source Selection

`spec.md` contains a primary Spec Kit requirements section followed by a reconstructed UI/context section with different story grouping. Plan and tasks follow the primary four stories and FRs at the top: generation (P1), review (P2), save (P1), and service fallback (P3). The later section is used for component locations only.

## Findings and Decisions

### AI boundary
- **Finding**: Shared API docs list internal `POST /ai/playlist/generate`; frontend must not call `/ai/*`. Architecture states Python service request/response and deployment details need confirmation.
- **Decision**: Frontend calls `POST /api/v1/playlists/ai-generate`; backend alone calls the internal service using `X-Internal-Secret`, a 2.5 second default timeout, and the shared unavailable mapping.

### Proposal and persistence
- **Finding**: Proposal is transient; 064 requires 10–20 returned tracks, reasons, edit/remove/reorder, and save as standard private playlist. 061 creates playlists and 062 manages memberships.
- **Decision**: Do not add an AI-specific persistent playlist model. Save through 061/062 and preserve edited order. Establish partial-failure handling before implementation.

### Availability and recovery
- **Finding**: Spec requires filtering unavailable/restricted tracks and manual fallback when AI is unavailable; UI/mock baseline exists in AIPlaylistPage and aiMockData.
- **Decision**: Validate returned tracks against an approved playable catalog source; keep mock data as demo only. Use standard 503/AI_SERVICE_UNAVAILABLE handling.

## Approval Gates

- Approve public endpoint and internal request/response schema, timeout, authentication, and AI owner/runtime.
- Confirm source and meaning of playable/restricted status and how to ensure 10–20 results.
- Define atomicity/compensation if playlist creation succeeds but track insertion fails.
- Confirm integration and service ownership with 030/100 and 061/062.

## Implementation Note

The current AI service catalog is a ten-track development fixture. It returns curated keyword-based suggestions with a rationale; it does not connect to a production vector index. The API boundary, 10-track minimum, hydration and restricted-track filtering are implemented, but FR-064-008's production semantic/vector retrieval remains dependent on the catalog/vector service integration.
