# Cross-feature status — partial

091 identity and 092 follow/list use the same artist_profile_public SQL view, canonical bigint ID strings and users.is_banned policy. Direct public GET remains anonymous. Existing hidden retained-owner DELETE intentionally bypasses the public GET guard. Express and browser tests verify these boundaries and no personal fields were added to the public DTO.

093 production catalog ownership/hide/delete lifecycle remains unimplemented/unaccepted. Follow modules have no track/media calls and no track-triggered writes; existing Cloudinary upload returns URLs but does not write Artist follows/catalog. This source audit establishes separation, not an executed real 093 track-hide/delete integration. T044 remains unchecked until that seam can be exercised with approved real catalog fixtures. The supplied Artist/follow NO ACTION FK behavior is tested; no permanent deletion cleanup policy was selected.
