# 091 — Artist visibility migration validation

**Date:** 2026-11-13. **Status:** Prepared and SQL-tested locally; **not applied to Supabase**.

## Authorized scope

The owner approved adding artist_visibility to the existing artists table: public/hidden values, hidden by default for new records and separate review of existing records. The supplied users DDL confirms PRIMARY KEY (user_id), a separate unique id index and is_banned boolean NOT NULL DEFAULT false. Active maps to is_banned=false, banned to is_banned=true. No account_status column is added. The artists.user_id FK target itself is not present in the supplied users DDL and is not assumed/changed by this migration.

[003_artist_visibility.sql](../../../../src/database/migrations/003_artist_visibility.sql) adds the column **without a default first**, then sets hidden as the default for subsequent INSERTs omitting the field. Existing records retain NULL; no visibility backfill, publication, account/key change or Artist table recreation occurs. The check permits public/hidden and legacy NULL. NULL is not an extra user-facing publication state and must not qualify for public reads. Existing rows need review before a new resolver goes live, or legacy NULL profiles will not appear publicly.

Apply once through the authorized deployment process after checking the existing table/column. The transaction rolls back on error; if the SQL client leaves an aborted transaction open, use ROLLBACK before further work. A repeated application intentionally fails on the existing column instead of silently replacing reviewed values. Do not drop/recreate the column to rerun it. This is an incremental extension, not a fresh catalog bootstrap; 002 assumes listening_history already exists.

This change does **not yet implement** ban→profile hidden, Admin-only republication, account mutation handlers, approval workflow, RLS/grants or public API. Those remain owner requirements for the next integration work, with actual FK/current-writer mapping and API tests. No existing GATED task is marked complete by adding the column alone.

## Actual validation

Docker exists but `docker info --format '{{.ServerVersion}}'` could not connect to its daemon. No daemon was started. SQL tests used temporary PGlite **0.5.16**, which provides in-memory PostgreSQL and raw migration execution ([official docs](https://pglite.dev/docs/)). It was installed only into a mktemp directory; no repo dependency, manifest, lockfile or shared test configuration was changed.

Executed install:

```sh
npm install --prefix /private/var/folders/14/pkw99mfj22l98qn1gp97n3fc0000gn/T/vscode-agent-codex-sandbox-Y3WDVd/auratune-091-sql.ZDXvJj --ignore-scripts --no-audit --no-fund @electric-sql/pglite
```

Executed test command outside the restricted sandbox:

```sh
PGLITE_MODULE_URL=file:///private/var/folders/14/pkw99mfj22l98qn1gp97n3fc0000gn/T/vscode-agent-codex-sandbox-Y3WDVd/auratune-091-sql.ZDXvJj/node_modules/@electric-sql/pglite/dist/index.js node --test src/database/tests/artistVisibilityMigration.test.mjs
```

To repeat after that directory is gone, create a new temporary directory, install @electric-sql/pglite@0.5.16 there and point PGLITE_MODULE_URL to its absolute dist/index.js file URL. The [native Node test file](../../../../src/database/tests/artistVisibilityMigration.test.mjs) creates a fresh in-memory database per test and never imports Supabase, reads credentials or connects to production. This ad hoc SQL validation does not select a new application database or shared feature test framework.

**Result: 8 passed, 0 failed, 0 skipped; exit 0, approximately 5.0 seconds.**

| Executed SQL assertion | Result |
| --- | --- |
| Old rows/fields/exact bigint 9007199254740993 preserved; old visibility NULL | PASS |
| New default hidden; explicit public/hidden accepted | PASS |
| Invalid active/banned/PUBLIC/empty/private rejected without row changes | PASS |
| Public predicate excludes hidden and legacy NULL | PASS |
| Account keys/flags unchanged; no account_status column | PASS |
| Repeated migration fails safely, preserving reviewed public state | PASS |
| Later constraint failure rolls back column/default, retaining rows | PASS |
| Missing artists table errors without creating guessed schema | PASS |

These execute PostgreSQL, not string matching. They do not prove live Supabase constraints/RLS/grants, concurrency, account-ban synchronization, real-data API or browser acceptance. Fixtures contain synthetic Artist fields and only the relevant supplied users key/status shape, not invented production FK constraints. No SQL was applied to Supabase; no live user/media edit, commit or push occurred.
