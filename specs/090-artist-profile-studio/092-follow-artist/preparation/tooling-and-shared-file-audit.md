# Tooling and shared-file audit (092 T008)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

Reuse [shared environment audit](../../091-artist-profile/preparation/tooling-audit.md): Node/npm absent; Git/Python CLT broken; no runtime pin or Group 090 runner/config. Existing npm --prefix src/frontend run build and npm run test:backend are future baseline commands, the latter auth smoke only. Feature 131 test choices are proposals; proposed .test.js/.test.jsx/E2E destinations in [tasks](../tasks.md) require C15 acceptance first. No package installation or build/follow-test pass claimed.

| Shared writer | Coordination before edits |
| --- | --- |
| artist router/repository/server | Reuse 091 canonical resolver/public checks; DELETE own hidden follow needs distinct operation policy, not universal public guard. No competing schema/resolver. |
| sessionApiClient/authMiddleware | 092 C04 design reused by 093; single serialized writer with Khoa/Hoàng acceptance. Public 091 fetch stays independent. |
| ArtistPage | 091 identity/sections; 092 personal component and independent errors. Avoid simultaneous edits. |
| AppStore | Replace only approved personal mock authority; preserve unrelated domains, invalidate account/session generations. 093 track adapter separate. |
| manifests / harness | Reuse accepted 091 T009 or 093 T012 capability; 092 T010 adds only approved missing scripts. One shared selection, no separate test stacks. |
| migrations / fixtures | Exact path/version/model still pending C02/C06/C08/C10; synthetic owner/time/visibility and multi-worker fixtures required. No speculative migration. |

Readiness is evidence-only; actual test layout/scripts, supported runtime, installed runner and database transaction fixture transport must be recorded and demonstrated before dependent executable tasks.
