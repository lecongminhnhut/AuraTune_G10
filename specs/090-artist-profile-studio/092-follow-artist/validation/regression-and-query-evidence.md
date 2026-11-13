# Regression and query evidence — partial final task

2026-11-13 host commands:

| Command | Observed |
| --- | --- |
| `npm --prefix src/backend run test:follow` | SQL/Express/migration suite PASS; latest added storage-outage assertion recorded in handoff |
| `npm --prefix src/frontend test` | 105/105 PASS, zero skips |
| `npm --prefix src/backend test` | 197 PASS, zero failures, 5 opt-in PostgreSQL tests skipped in this invocation; their separate real run was 5/5 PASS |
| `FOLLOW_PG_CONTAINER=auratune-follow-092-validation node --test tests/follow-concurrency.test.js` (backend) | 5/5 PASS, zero skips, independent PostgreSQL connections |
| `npm --prefix src/frontend run build` | PASS, 2140 modules; existing >500kB chunk warning (main JS ~813kB) |
| Browser `runFollowArtistChecks(page)` | Eight scenario groups PASS, including dropped response after actual SQL commit and cold-run pageerror assertion |
| `git diff --check` | PASS before final documentation pass; final result in handoff |

No unrelated npm audit remediation or dependency upgrade was attempted. Native JSX loader continues to report module.register deprecation. No new dependency was required for concurrency: tests use separate psql connections through Docker CLI.

Real PostgreSQL EXPLAIN ANALYZE, disposable synthetic dataset: 1,007 eligible own rows, one other-owner row, public view join, `WHERE f.user_id='account-a' ORDER BY f.created_at DESC,f.artist_id ASC`. Planner used seq scan + merge join + quicksort, 19 shared-buffer hits, sort memory 80kB. Planning 0.456ms; execution 2.403ms; 1,007 returned rows. No speculative index added: the supplied composite primary key already exists. This single warm synthetic sample does not establish a production p95, realistic catalog scale or write SLA. Production query plan/transport size requires rollout measurements.

The root auth smoke has a previously recorded misleading exit-0/four-failed-check result and can hit configured live credentials. It was not rerun against live Supabase or replaced with fake fixture success. This session's fixture deliberately implements only auth transport needed for follow integration, not the full registration/OAuth/auth smoke API. T046 therefore remains unchecked for that broader smoke validation and production-mapping evidence despite passing native regressions/build.

Final targeted backend run after malformed-JSON transport hardening: 13/13 PASS, no skips; test first reproduced text/html stack output, then passed with safe shared 400 JSON and private/no-store. Full frontend targeted script: 14/14 PASS. Final frontend build PASS; git diff --check PASS.
