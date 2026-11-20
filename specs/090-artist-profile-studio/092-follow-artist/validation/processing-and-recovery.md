# Processing and recovery — executed

[Real PostgreSQL tests](../../../../src/backend/tests/follow-concurrency.test.js): **5/5 PASS**, independent docker-exec/psql connections, PostgreSQL 17 fixture. Each forced order holds A's transaction open after SQL execution; B starts separately; pg_stat_activity must show B waiting on a real database lock before A commits. No in-process mutex or timer-only inference. Fresh connections read committed results.

| Forced history | Observed |
| --- | --- |
| Absent follow → unfollow | No relation |
| Absent no-op unfollow → follow | One relation |
| Concurrent duplicate follows | One relation, original exact timestamp |
| Present duplicate → DELETE then deliberate SQL error | DELETE transaction rolls back; membership/time unchanged |
| Unfollow → refollow | New timestamp; both fresh connection reads show membership |
| Follow → hide writer | Retained pair; next complete list omits Artist |
| Hide writer → follow | Generic Artist not found, no new pair |
| Separate followers of same Artist | Two distinct own pairs, no lost membership |
| Follow → permanent-delete attempt with references | Supplied FK rejects delete; no invented cleanup/cascade |

[HTTP test](../../../../src/backend/tests/follow-auth.test.js) deliberately holds an already committed PUT acknowledgement, completes DELETE and receives its response first, then releases the old PUT response. A fresh authoritative list remains absent: response arrival cannot resurrect membership.

[State tests](../../../../src/frontend/src/hooks/useArtistFollowing.test.js) and [origin/client tests](../../../../src/frontend/src/hooks/useArtistFollowing.session.test.js) cover failed reconciliation, lost commit response, late older read versus newer opposite-device state, account/logout/same-account-session replacement during refresh, single safe pre-write-401 recovery and zero automatic 5xx replay. StrictMode cleanup/setup is tested.

Browser runner forwards one real PUT to SQL but deliberately drops its response. The UI reconciles persisted Following, shows an uncertainty notice instead of a definitive mutation-success claim, and does not resend PUT. Subsequent explicit unfollow works. The general list refresh does not erase that notice on the initiating control. All seven browser scenario groups PASS.

SQL deadlock/serialization errors are rollback errors, mapped to safe 500. Client conservatively treats a mutation 5xx/network result as uncertain; it reconciles before later user action. No exactly-once guarantee, push synchronization or click-time precedence is claimed. Live Supabase/PostgREST and production workload contention remain rollout verification, not this fixture result.
