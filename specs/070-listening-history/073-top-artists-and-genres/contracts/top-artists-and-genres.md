# Top Artists and Genres Contract (Draft)

**Feature**: [073 Top Artists and Genres](../spec.md)  
**Status**: Aggregate requirements captured; route and fields need approval.  
**Shared conventions**: [AuraTune API Contract](../../../../docs/analysis-and-design/api-contract.md)

## Required Behavior

- Return authenticated-user-only, backend-aggregated statistics for 7-day, 30-day, and 365-day windows.
- Rank up to ten artists by total listened duration descending, then qualifying play count descending.
- Rank genres by qualifying play count. Count each genre tag on a multi-tag song. Return top 5–10 plus an `Other` aggregate for the remaining tags.
- Rank up to ten tracks by qualifying play count and include approved identity/playback data.
- Exclude hidden/cleared history and sessions below the 30-second threshold.
- Support the "Not enough data yet" state; UC-070-006 sets the threshold to fewer than five qualifying events.
- Keep the output responsive and integrated with the History statistics experience.

## Conflict Resolution

Use the explicit FRs and resolved G07 decisions: artist order is duration-first (073-FR-001); genre metric is play count (073-FR-002); ranges are 7 days, 30 days, all time within 365 days (073-FR-003). Reconstructed narrative and screenshot descriptions that conflict with these are not authoritative requirements.

## Unspecified by Shared API

No route, payload, timezone, tie-breakers, genre denominator, or cache policy is defined. Approve those values before implementation. Use `{success,message,data,error}` and shared auth/error conventions when an endpoint is approved.

## Security

Derive user scope from the authenticated principal. Never allow a requester to select another user's statistics through a supplied user ID.
