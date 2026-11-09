# Implementation Plan: AI Playlist Generation (Feature 064)

**Branch**: `064-ai-playlist-generation` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

## Summary

Generate a transient playlist proposal from an authenticated listener's prompt, allow review and editing of the proposed title and track order/membership, then persist the finalized proposal as a standard private playlist through feature 061 and populate its tracks through 062. The frontend calls the AuraTune backend only; the backend calls the internal AI endpoint `POST /ai/playlist/generate`. Enforce the 200-character prompt limit, playable/restricted-track filtering, useful failure handling, and a manual creation fallback.

## Technical Context

**Language/Version**: JavaScript ES modules; React 18.3.1, Vite 5.4.11, Express 4.21.2; AI service runtime remains unconfirmed
**Primary Dependencies**: React, React DOM, Vite, Tailwind CSS 3, `lucide-react`, Express, Supabase JS, existing auth, approved internal AI contract, features 061/062
**Storage**: Proposal is transient client/backend response; saved playlist and tracks use 061/062 persistence
**Testing**: Repository verification setup is not yet established; verify using approved tooling when available
**Target Platform**: AuraTune web client, backend API, internal Python AI service
**Project Type**: Web application with internal AI service integration
**Performance Goals**: Proposal within 5 seconds; saved playlist visible in Library within 1 second
**Constraints**: `/ai/*` is backend-to-AI only; API common envelope; authentication required; no unavailable/restricted tracks in result; save as private standard playlist
**Scale/Scope**: Prompt-to-proposal, proposal editing/preview, save, and failure fallback; semantic retrieval implementation belongs to AI/search services

## Constitution Check

Constitution is unfilled. Follow Team Contract and API architecture. Gate: verify the actual AI service request/response contract and availability semantics; do not invent embeddings/vector infrastructure or expose internal AI endpoint to the frontend. Coordinate persistence with 061/062 and recommendation/search owners.

## Current Implementation Baseline

`src/frontend/src/pages/AIPlaylist/AIPlaylistPage.jsx` and `utils/aiMockData.js` provide the UI/mock baseline. `docs/analysis-and-design/api-contract.md` lists internal `POST /ai/playlist/generate`, while architecture says frontend must call backend and AI service details remain to be confirmed. Existing mock UI is not an implemented backend integration.

## Project Structure

### Planning artifacts

```text
specs/060-playlist-management/064-ai-playlist-generation/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ai-playlist-generation.md
└── tasks.md
```

```text
src/backend/{routes,controllers,services}/       # authenticated generation API and AI adapter
src/frontend/src/
├── pages/AIPlaylist/AIPlaylistPage.jsx          # prompt, proposal review and save UI
├── utils/aiMockData.js                          # mock-only fallback/development data
└── context/AppStore.jsx                         # standard playlist create/state refresh
```

**Structure Decision**: Add the public client endpoint in the existing backend and call the internal AI service from backend only. Reuse the 061/062 playlist operations for save; no separate AI playlist persistence model.

## Design and Delivery Phases

1. **AI contract and ownership**: Confirm internal request/response, timeout, authentication forwarding policy, and playable-track fields with AI/recommendation owners; document the public backend endpoint.
2. **Generation service**: Validate authenticated prompt length, invoke internal AI service, normalize and filter candidate tracks, and return title, rationale, and track metadata in standard envelope.
3. **Proposal review UI**: Connect prompt, loading, generated proposal, preview, title edit, track removal/reorder, and alternate generation affordance.
4. **Save and fallback**: Persist as private playlist through 061 and add ordered songs through 062; handle partial failure safely and offer manual playlist creation when AI is unavailable.
5. **Review**: Trace UC-060-016 and FR-001..010; verify frontend never calls `/ai/*` directly.

## Risks

| Risk | Mitigation |
|---|---|
| AI endpoint schema/timeout is unspecified | Resolve contract with AI owner before adapter implementation |
| Playlist save and track insertion span multiple operations | Coordinate atomicity/cleanup behavior with 061/062; avoid reporting success until persistence is complete |
| Filtering lacks reliable playability field | Agree authoritative availability check with catalog/player owners |

## Complexity Tracking

No constitution violations.
