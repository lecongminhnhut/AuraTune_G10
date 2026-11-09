# Data Model: Album Details

Feature 081 is read-only. It introduces no database schema, durable entity, or API payload shape. The source of truth remains the existing approved catalog and `GET /albums/:id` contract; the exact schema mapping is pending confirmation of that contract.

## Read projection

| Projection | Source / identity | Fields used by this feature | Rules |
| --- | --- | --- | --- |
| Album details | Approved album catalog response, selected by requested album ID | Available album title, cover art, artist identity/name, release year, ordered complete track list | Public read; a response must be associated with the requested ID before display. Missing metadata is represented without substituting another album's data. |
| Track row | Each track in the complete album response, in response order | Track identity/title, available duration, that track's own play count | One flat list; no disc metadata required. Unknown duration/count is distinct from zero and displays an em dash. |
| Related album card | Existing approved catalog source; source needs confirmation | Other available album metadata needed by the existing related-release presentation | Filter to the same artist and exclude the current album. Do not extend the album detail API based on this plan. |
| Album Details View | Derived client-side projection | Release type, total duration, loading/success/not-found/error states | “Single” for one track, “Album” for two or more. Total uses all known durations in the complete response; show unavailable if none are known. |

## Derived values

- **Total duration**: Sum the durations that are available for all tracks in the complete response. Unknown durations are excluded. Format below one hour as `m:ss`; at or above one hour as `h:mm:ss`. If there are no known duration values, display unavailable as specified by the feature assumptions.
- **Release type**: One track maps to “Single”; two or more tracks map to “Album”. The empty-list presentation follows the empty state and does not invent a release type.
- **Play count**: Format the track's own non-negative whole-number count with locale-appropriate grouping. Preserve `0`; display unavailable as an em dash.
- **Cache identity**: Previously loaded response may be held in the existing shared in-memory application store keyed by album ID for immediate same-session return display. Refresh on return; do not define a TTL or persistent cache.

## Relationships

An album has an ordered collection of tracks. Each track's displayed play count belongs to that track. Album and artist associations are used only for the required metadata and same-artist related release section. No new relationships or writes are introduced.

## Unresolved mapping

The approved API contract's exact field names, response envelope, error representation, complete-list guarantee, and related-album catalog source must be confirmed before implementation. This document intentionally does not define those schemas.
