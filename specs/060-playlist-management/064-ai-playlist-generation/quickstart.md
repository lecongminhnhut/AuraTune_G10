# Quickstart: AI Playlist Generation

**Feature**: [064 AI Playlist Generation](./spec.md)

## Prerequisites

- Start the frontend and backend; configure the internal AI service locally as specified by its approved setup.
- Resolve service and catalog gates in [research.md](./research.md).
- Review [generation contract](./contracts/ai-playlist-generation.md) and [data model](./data-model.md).
- Ensure authenticated listener session and approved 061/062 persistence are available.

## Validation Scenarios

1. Submit a valid prompt and verify proposal response within the specified 5-second target.
2. Reject empty prompt and prompt longer than 200 characters; accept 200 characters without truncation.
3. Verify successful proposal contains 10–20 playable tracks and rationale.
4. Preview, remove, reorder tracks, and rename proposal; ensure track metadata itself is not editable.
5. Save proposal; verify a private standard playlist with final order appears in library and detail view.
6. Simulate AI unavailability; verify manual playlist creation shortcut and no false success.
7. Simulate invalid/restricted returned tracks and partial persistence failure; verify filtering/error recovery.

Use only approved AI contract and service setup; mock recommendations do not demonstrate live generation.
