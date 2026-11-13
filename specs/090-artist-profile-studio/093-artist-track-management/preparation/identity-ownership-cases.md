# Identity and ownership cases (093 T003)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

Reuse [canonical audit](../../091-artist-profile/preparation/catalog-source-audit.md) and [auth audit](../../092-follow-artist/preparation/session-replay-audit.md). Auth users.id/user_id and optional reference artists.user_id do not establish actual managed-track ownership. StudioPage gates via mock user.artistId; media route allows Artist/Admin but resolves no artist link/track owner.

| Principal / resource | Required expectation |
| --- | --- |
| Guest | LoginRequired at /studio; direct protected API denies with no catalog leak/write. |
| User or Admin | Studio Forbidden; Admin's separate shared song/moderation capability preserved, never Artist impersonation. |
| Banned/revoked/expired Artist | Current auth denies; no success or private data. Mid-transfer final authorization must be rechecked. |
| Linked valid Artist A | Own complete manageable catalog only; read/write B denied even with crafted owner/artist/track/album input. |
| Unlinked Artist | Safe deny, no automatic provision/link repair; exact canonical mapping and message/status await C02/C05. |
| Public profile hidden | Public 091 remains neutral not-found; management permission is distinct from public visibility. Ban/profile-disable relationship awaits reviewed policy. |
| Standalone/imported/co-credited song | Display artist credit does not grant management; owner source must be explicit. Never fabricate album to establish ownership. |
| A proposes B's album or forged artist ID | Check actual album permission/ownership; no reassignment from browser. Name equality not album identity. |

Hoàng/Đăng/Khoa must supply linked/unlinked/legacy/co-credit cases and canonical current key/link/public policy. C02/C03/C05 remain open. Exact protected-target not-found/forbidden mapping is reviewed before handlers; no new messages, schema fields or provisioning endpoint selected. SC-001 must be proven against direct APIs, not only route hiding.
