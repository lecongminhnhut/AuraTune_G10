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

Superseded on 2026-11-22 (PA4 Section E): the ten-track keyword fixture returned demo ids (`t1`…`t10`) that a backend playlist rejects, and it never called Gemini.

## Live Gemini Integration (2026-11-22, PA4 Section E)

- **Generator**: `src/ai-service/playlist_generator.py`. The AI service loads the playable songs from Supabase (`songs` with `albums(title, artists(name))`; rows that are deleted, inactive or without `audio_url` are skipped) and sends them with the listener's description to Gemini, asking for structured JSON (`title`, `reason`, `song_ids`). Only ids from that catalog are kept, in Gemini's order, without duplicates, at most 20. Fewer than 10 is a no-match with Gemini's reason. The backend still hydrates and filters the ids (`aiPlaylistService.normalizeAiPlaylistResponse`) before the proposal reaches the UI.
- **Model**: `gemini-2.5-flash` (the service default for the chat agent) answers 404 for new API keys. Playlist generation uses `GEMINI_PLAYLIST_MODEL`, default `gemini-3.1-flash-lite,gemini-flash-lite-latest` (tried in order). Measured on 2026-11-22: about 1-3 s per request over the 17-song catalog; `gemini-flash-latest` and `gemini-3.8-flash` answered 503 "high demand" or did not answer within 40 s at that time.
- **Timeouts**: the AI service gives up on Gemini after 15 s and answers 503; the backend waits up to 20 s for this call (`AI_PLAYLIST_TIMEOUT_MS`) instead of the 2.5 s used for recommendations.
- **No match**: when the catalog has nothing close (for example heavy metal), Gemini usually proposes the closest songs and says in the reason that the requested genre is missing (4 of 5 runs); once it returned an empty list, which the UI shows as a no-match with the reason. Both follow the spec edge case of suggesting an alternative rather than an empty page.
- **FR-008**: matching is done by Gemini over the whole playable catalog, not by a vector index. This is adequate for the current catalog size; a large catalog would need a retrieval step (030/100 semantic search) before the Gemini call.
- **Still to confirm with the AI/recommendation owner (T004)**: the restriction fields beyond `deleted_at`, `is_active`/`status` and `audio_url`, and the model choice.
