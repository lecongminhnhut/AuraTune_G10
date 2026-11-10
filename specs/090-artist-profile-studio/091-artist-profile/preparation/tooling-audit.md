# Shared runtime and tooling audit (091 T007)

> **Host verification supersedes the sandbox-only runtime conclusion below:** Node **26.13.0**, npm **11.20.0**, Homebrew binaries on arm64. The locked Firebase dependencies require Node >=24.12.0. After npm ci, current frontend build passes; current auth smoke has four FAILED checks despite process exit 0. Git also works outside sandbox. Main has a reusable native Node/JSX loader harness; Group 090 runtime pin, exact harness integration and browser evidence remain pending. See the [command-by-command follow-up](../../group-090-integration-follow-up.md#1-runtime-and-package-manager-actual-commands-and-results) for actual runs, package-manager lock discrepancy and branch SHA evidence. The earlier results below remain the initial sandbox execution record, not the latest host state.

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

## Observed environment and commands

- command -v node/nodejs/npm: absent in current PATH. No feature runtime is runnable here. /usr/bin/python3 and /usr/bin/git invoke xcrun and fail: invalid active developer path /Library/Developer/CommandLineTools, missing xcrun. No Git status/diff claim is possible; branch was read from .git/HEAD.
- Perl is also unusable inside the sandbox (libperl.dylib blocked); preparation checks use shell, rg and tool-host JavaScript. These checks do not require installing a runtime or choosing a feature test runner.
- [root manifest](../../../../package.json): start/dev:backend/dev use node; dev:frontend starts existing frontend; test:backend runs src/backend/test-server.js (auth smoke, server required).
- [frontend manifest](../../../../src/frontend/package.json): dev/build/preview with Vite; React 18.3.1, Vite 5.4.11 ranges, no test/lint/typecheck scripts or test dependencies. [backend manifest](../../../../src/backend/package.json): start/dev only; Express, Supabase, JWT plus Cloudinary/Multer/file-type dependencies. No engines runtime pin or Group 090 harness/config found.
- [Feature 131 plan](../../../130-frontend/131-frontend-foundation/plan.md) proposes Vitest, React Testing Library, Playwright and ESLint/CI; proposals are not installed/accepted harness evidence. Existing testCloudinary/testUploadAudio/testUploadImage scripts upload directly through SDK with local fixture paths; no rights/ownership/catalog/hidden-stream acceptance assertions.

## C15 closure required (Nhựt / foundation responsibility to be assigned, Hoàng)

Record supported Node/npm and dependency compatibility (including file-type), installed shared runner versions, approved unit/component/API/browser/media/concurrency destinations, exact scripts/configs and disposable fixture setup. Demonstrate harness smoke/red/green runs and browser availability. No new runner/library or file destination is selected here. Backend catalog/concurrency tests must exercise real handlers and database boundaries, not only doubles.

After closure, existing commands to run are npm --prefix src/frontend run build and npm run test:backend with a local backend, plus the approved new feature checks. Neither existing command alone proves Group 090. Commands were not executed successfully here: npm is unavailable. Do not claim a build/test pass, query p95, usability denominator, 2s identity or 500ms upload from source checks.

## Setup verification

[.gitignore](../../../../.gitignore) already covers node_modules, dist/build, env files, keys/service accounts, OS/editor outputs and npm debug logs. Existing private manifests do not publish packages. No Dockerfile, ESLint/Prettier/Terraform/Helm setup requiring new ignore files was found; no unrelated configuration was added. No extension hooks configuration exists. Prerequisite script succeeds separately for all three explicit SPECIFY_FEATURE_DIRECTORY values with SPECIFY_FEATURE_NO_PERSIST=1; no feature-state mutation. Requirements checklists: 091 16/16, 092 22/22, 093 35/35 checked, zero unchecked. Markers were read only.

## Execution validation record — 2026-11-11

Document checks ran using tool-host JavaScript plus shell/rg/cksum; no installed application test runner is inferred.

| Check | Actual result |
| --- | --- |
| Exact required preparation outputs | 28/28 present: 091=8, 092=9, 093=11; content compared with written work products |
| Requirement allocation | 57 FR + 17 SC individually present in ledgers (091 31+8, 092 16+6, 093 10+3) |
| Original acceptance scenarios | 62 individually retained (091 14, 092 33, 093 15); future oracles only |
| Original decision trace | D01–D09, F01–F09, S01–S12 all 30 retained; none self-approved |
| Gate task assessment | 129/129 assessed in per-feature indexes (34/39/56); zero unlocked or ticked |
| READY completion | 28 ticks only (8/9/11); task body normalized against pre-edit text unchanged except READY markers and appended execution records |
| Relative document links | 230 file/folder destinations checked, zero missing targets; this is file resolution, not rendered/browser validation |
| Existing-file scope | Checksum baseline covered 1,059 existing nonsecret files before edits; comparison found only three tasks.md changed and 28 required preparation files added; no pre-existing file deleted |
| Checklists / prerequisite discovery | 16/16, 22/22, 35/35 checked, no edits; explicit nonpersistent prerequisite discovery succeeded for all features |
| Branch / hooks | HEAD still 090-artist-profile-studio-implement; extensions.yml absent at pre/post checks, no hooks to execute |
| Application build/tests/media/DB/browser/timing | NOT RUN: Node/npm absent; no approved Group 090 harness. Git/Python also fail due missing Command Line Tools. No runtime acceptance claimed |

Checksum comparison verifies this session's file scope, not a clean Git working tree before the session (git status was unavailable). No fetch/commit/push/branch mutation, external message, dependency installation or live database/provider mutation occurred.
