# US2 unfollow — passed local acceptance

Uses the shared evidence in [US1](./us1-follow.md), [processing histories](./processing-and-recovery.md), [explicit DELETE control test](../../../../src/frontend/src/components/artist/FollowButton.unfollow.test.jsx) and browser runner.

Verified: current owner's public removal and repeated public no-op return 200; only the own pair is removed. Existing hidden retained-owner removal succeeds without a public-parent guard, returns generic data null and reveals no hidden name/image/state. Hidden without own relation, nonexistent and deleted/unknown IDs return the same generic 404. A hidden relation/time survives hide/restore; removing it while hidden prevents restoration. Subsequent real refollow obtains a new timestamp and new list position; B's separate relation is unaffected. Supplied FK NO ACTION is retained, not replaced by a deletion workflow.

Pending DELETE keeps the last confirmed context and disables repeat clicks. Success is displayed only after authoritative reconciliation. Unknown outcomes do not issue an inverse toggle or blind mutation replay. Browser primary journey and direct authenticated hidden removal passed. Native tests and SQL prove repeated operations, original/refollow time and rollback. No hidden-profile UI was introduced.
