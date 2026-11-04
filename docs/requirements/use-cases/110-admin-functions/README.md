# Group 110 — Admin Functions

Updated: 2026-11-04. **12 Draft UC specifications**, Reviewer: Not assigned. Owner decisions are confirmed in this session only; no collective review/approval is claimed.

## Purpose and scope

This documentation covers 111 User Management, 112 Content Moderation and 113 Platform Statistics with a separate System area. The [inventory](./use-case-inventory.md) retains **74 source FRs**: **72 have specified Draft behavior**, **2 remain partial** (113-FR-002 demo-attribution source and 113-FR-021 platform-wide/reset clauses). Allocation, behavior clarity, literal-source conformity, implementation, evidence and approval are distinct.

| Feature | Distinct FRs | Specified Draft behavior | Partial |
|---|---:|---:|---:|
| 111 | 23 | 23 | 0 |
| 112 | 30 | 30 | 0 |
| 113 | 21 | 19 | 2 |

## Owner-confirmed session decisions

On 2026-11-04 the owner selected Q01=A, Q02=A, Q03=A, Q04=B, Q05=A, Q06=A, Q07=A, Q08=A, Q09=A, Q10=A, Q11=C. Full selected behavior is in the single [decision register](./use-case-inventory.md#decision-register). These choices are **new owner confirmations in this session**, not retroactive original requirements, whole-team approval, reviewer assignment or implementation sign-off.

Restriction/delisting is reversible; final deletion is a non-restorable business result that chooses no hard delete, file removal or physical cleanup. A lift preserves Artist self-hide/private, never restores deleted content and requires existing display/playback eligibility. The [090 visibility rules](../090-artist-profile-studio/UC-090-007-hide-or-unhide-track.md) were cross-checked read-only; eligible does not mean guaranteed featured/ranked placement.

Four overview cards have explicit distinct-identity count sets and separate hints. Public Artist entities are not artist-role accounts. Demo plays must be a proven subset of valid recorded events; no source marker is invented when absent, so the hint remains unavailable and FR-002 partial. [UC-110-007 R-08](./UC-110-007-view-platform-statistics.md#r-08) defines every set.

AI availability is **current browser demo only**, persists across reload, affects new demo requests, lets already-running requests finish, and uses same-state no-op/system-order processing without a separate confirmation. This differs from the literal platform-wide source wording and is not a claim of controlling shared services. Reset remains **Draft / Deferred / not available** under Q11=C; no reset execution flow exists and FR-021 is not complete.

## Actors and permissions

- **Administrator (ACT-05):** current valid admin access for privileged management; backend authorization remains required for actual protected endpoints. Self-role change and self/other-admin ban are rejected. Banned-target role changes do not clear bans or restore access.
- **Artist-owner (ACT-04):** valid active access and ownership for the limited restricted-song Studio read; no Admin endpoint rights, private Admin data, play/self-unrestrict/republish bypass or deleted-song recovery. Existing preference edits stay in Group 090.
- Guest, Listener, non-owner and expired/invalid/banned sessions are denied where applicable. Internal database/UI/auth modules are not actors. No external supporting actor is invented.
- Minimum permitted account fields and song/rights context are source-constrained; secrets/passwords/tokens/session IDs are never disclosed. Overview is aggregate-only/read-only; System goals are distinct.

## Sources and authoring conventions

- [Use-Case Documentation Guide and embedded template](../README.md): goal-based decomposition, actor–system dialogue, naming, traceability, prototype classification, and review conventions. Its text calls the template “17-section” while the embedded example ends at section 13; every Draft preserves the 13 printed sections and explicitly adds four local supplementary sections, without claiming those are missing canonical headings.
- [Shared use-case model](../../use-case-model.md) and [feature index](../../../../specs/README.md): actor IDs, existing UC IDs, and group boundaries. Their summary mappings are not current FR counts.
- [111 specification](../../../../specs/110-admin-functions/111-user-management/spec.md), [112 specification](../../../../specs/110-admin-functions/112-content-moderation/spec.md), [113 specification](../../../../specs/110-admin-functions/113-platform-statistics/spec.md): full stories, acceptance criteria, edge cases, FRs, and embedded Clarifications sessions dated 2026-10-30 and 2026-11-01.
- Requirements checklists: [111](../../../../specs/110-admin-functions/111-user-management/checklists/requirements.md), [112](../../../../specs/110-admin-functions/112-content-moderation/checklists/requirements.md), [113](../../../../specs/110-admin-functions/113-platform-statistics/checklists/requirements.md). Checked boxes are not evidence of approval and do not resolve conflicts with the current FRs.
- [API contract §2.10](../../../analysis-and-design/api-contract.md), [API directory guidance](../../../design/api/README.md), [role navigation](../../../design/architecture/role-navigation.md), [feature modules](../../../design/architecture/feature-modules.md), [security guidance](../../../design/security/README.md), [database security](../../../design/database/security-rules.md), and [data consistency](../../../design/database/data-consistency.md): cross-check access boundaries and technical follow-ups.
- [Vision G11](../../../proposal/Auratune_Vision_Document.md) and [proposal](../../../proposal/proposal.md): broad context, not authority to add album/artist/editorial/comment workflows to these three feature inventories.

No `AGENTS.md` was found in the repository (including hidden directories), or at the checked ancestor locations from the workspace up to the drive root. No separate clarification file exists within the three feature folders; clarification content is embedded in each spec. The guide path cited by the shared model, `docs/PA/AuraTune_Use_Case_Documentation_Guide.md`, is absent; the existing guide above was used. Security/API docs cite `docs/design/api/api-contract.md`, which is absent; the actual contract is linked above. Missing paths are not recreated.

All 14 existing feature UI images were visually inspected; the inventory lists each image and its evidentiary limits. They are treated as UI prototype/demo evidence, not verified production/backend screenshots. Those fourteen images remain referenced in place; the six new conceptual mockups are separately labeled and registered.

## Document state and boundaries

All 12 actual UC files are **Draft**, Reviewer: Not assigned; 0 entries are merely Planned. UC-013 is intentionally **Deferred / not available**. Source conflicts remain quoted verbatim with local owner-resolution references. No source/shared/code/090 change or Git operation is part of this delivery.

The template’s 13 printed sections are retained, supplemented with 14 Rules, 15 Conflicts, 16 Follow-ups and 17 Verification. No nonexistent canonical headings are claimed. Search/filter/page/validation/error/no-op behavior remains within actor goals; no UI-button fragmentation or unproved include/extend relations are added. Shared ID 006 remains reserved/excluded; IDs 009–013 are local decompositions of the existing goals.

## Draft specification files

| Actual file | Primary actor | Behavior / availability |
|---|---|---|
| [UC-110-001 — View and Find Platform Users](./UC-110-001-view-and-find-platform-users.md) | Administrator | Specified mapped behavior; Draft, not approved |
| [UC-110-002 — Ban User Account](./UC-110-002-ban-user-account.md) | Administrator | Specified mapped behavior; Draft, not approved |
| [UC-110-003 — Unban User Account](./UC-110-003-unban-user-account.md) | Administrator | Specified mapped behavior; Draft, not approved |
| [UC-110-004 — Change User Role](./UC-110-004-change-user-role.md) | Administrator | Specified mapped behavior; Draft, not approved |
| [UC-110-005 — Review Platform Tracks](./UC-110-005-review-platform-tracks.md) | Administrator | Specified mapped behavior; Draft, not approved |
| [UC-110-007 — View Platform Statistics](./UC-110-007-view-platform-statistics.md) | Administrator | Partial source evidence (G01) |
| [UC-110-008 — Control AI Availability](./UC-110-008-control-ai-availability.md) | Administrator | Browser-demo only; source FR-021 partial |
| [UC-110-009 — Restrict Track](./UC-110-009-restrict-track.md) | Administrator | Specified mapped behavior; Draft, not approved |
| [UC-110-010 — Lift Track Restriction](./UC-110-010-lift-track-restriction.md) | Administrator | Specified mapped behavior; Draft, not approved |
| [UC-110-011 — Remove Track](./UC-110-011-remove-track.md) | Administrator | Specified mapped behavior; Draft, not approved |
| [UC-110-012 — View Owned Track Restriction](./UC-110-012-view-owned-track-restriction.md) | Artist-owner | Specified mapped behavior; Draft, not approved |
| [UC-110-013 — Reset Demo Data](./UC-110-013-reset-demo-data.md) | Administrator | Deferred / not available |

## Group diagram

[Group 110 actor-goal Mermaid diagram](./use-case-diagram.md) distinguishes Administrator and Artist-owner, labels local AI scope and marks reset deferred. The diagram does not imply implementation or complete source conformity.

## Prototype evidence

The [prototype register](./prototypes/README.md) now records **6 new PNG storyboards / 24 panels**, alongside **14 source images referenced in place**. Basic key states for all **11 available goals** are illustrated; overall coverage remains **Partial**, with dedicated authorization/failure/no-op/concurrency and other unillustrated states marked **Missing**. Reset has no execution/mockup and remains **Deferred / not available**. All new images are visibly marked conceptual mockups with fictional fixtures, not deployed-system screenshots.

Each UC section 13 embeds its actual storyboard and identifies panel-to-step coverage and remaining gaps. All six final PNGs were rendered and directly visually inspected; no HTML/ZIP export, runtime test or implementation claim is made. Drawing an unavailable demo hint does not close 113-FR-002; drawing a local demo switch does not fulfill platform-wide control or deferred reset in 113-FR-021.

## Review handoff and remaining guide items

This is a Draft documentation package prepared for PR review, not a declaration that the guide’s PA3 Definition of Done is complete.

| Guide item | Current evidence / limitation |
|---|---|
| UC structure and source traceability | All 12 actual Drafts retain printed template sections plus declared supplements; all 74 source FRs are allocated and mapped. 72 have specified behavior for this owner-session baseline, while 2 remain partial. Source and owner-session provenance are separate. |
| Basic and key branch mockups | 11 available goals now have embedded basic-state mockups; selected key branches are illustrated. Full AF/EF and runtime evidence remain Partial/Missing in the register. No false reset flow is supplied. |
| Group inventory / system-level model | Local inventory and actor-goal diagram are synchronized. Shared-model decompositions/FR mappings remain a follow-up under the explicit no-shared-edit scope; shared files are unchanged. |
| Peer cross-review / approval | Not performed or claimed here. Reviewer remains Not assigned; owner session choices are not collective approval or peer review. |
| Source completeness | Demo-event attribution is missing (113-FR-002). AI scope remains browser demo rather than platform-wide, and reset remains deferred (113-FR-021). No closure is claimed. |
| Technical design / implementation | Not executed; no Plan/Tasks/Analyze/Implement, code changes or “implementation passed” claim. |

## Files for a review commit

The exact intended Group 110 set is **22 files: 16 Markdown + 6 PNG**. Stage only this listed group content when you perform Git work. The existing Group 090 ZIP and fourteen unchanged source images are not additions to this commit; no renderer scratch script/config, ZIP or HTML export is part of the package.

| File | Purpose |
|---|---|
| [README.md](./README.md) | Group overview / review handoff / file list |
| [use-case-inventory.md](./use-case-inventory.md) | 74-FR ledger and owner-session decisions |
| [use-case-diagram.md](./use-case-diagram.md) | Admin/Artist-owner diagram with deferred reset |
| [UC-110-001-view-and-find-platform-users.md](./UC-110-001-view-and-find-platform-users.md) | UC-110-001: Draft; Reviewer: Not assigned |
| [UC-110-002-ban-user-account.md](./UC-110-002-ban-user-account.md) | UC-110-002: Draft; Reviewer: Not assigned |
| [UC-110-003-unban-user-account.md](./UC-110-003-unban-user-account.md) | UC-110-003: Draft; Reviewer: Not assigned |
| [UC-110-004-change-user-role.md](./UC-110-004-change-user-role.md) | UC-110-004: Draft; Reviewer: Not assigned |
| [UC-110-005-review-platform-tracks.md](./UC-110-005-review-platform-tracks.md) | UC-110-005: Draft; Reviewer: Not assigned |
| [UC-110-007-view-platform-statistics.md](./UC-110-007-view-platform-statistics.md) | UC-110-007: Draft; Reviewer: Not assigned |
| [UC-110-008-control-ai-availability.md](./UC-110-008-control-ai-availability.md) | UC-110-008: Draft; Reviewer: Not assigned |
| [UC-110-009-restrict-track.md](./UC-110-009-restrict-track.md) | UC-110-009: Draft; Reviewer: Not assigned |
| [UC-110-010-lift-track-restriction.md](./UC-110-010-lift-track-restriction.md) | UC-110-010: Draft; Reviewer: Not assigned |
| [UC-110-011-remove-track.md](./UC-110-011-remove-track.md) | UC-110-011: Draft; Reviewer: Not assigned |
| [UC-110-012-view-owned-track-restriction.md](./UC-110-012-view-owned-track-restriction.md) | UC-110-012: Draft; Reviewer: Not assigned |
| [UC-110-013-reset-demo-data.md](./UC-110-013-reset-demo-data.md) | UC-110-013: Draft; Reviewer: Not assigned; deferred / not available |
| [prototypes/README.md](./prototypes/README.md) | Source/new mockup evidence register and visual QA |
| [prototypes/Group110-accounts-basic-and-key-states.png](./prototypes/Group110-accounts-basic-and-key-states.png) | New conceptual UI mockup; fictional fixtures; not a deployed screenshot |
| [prototypes/Group110-moderation-basic-and-key-states.png](./prototypes/Group110-moderation-basic-and-key-states.png) | New conceptual UI mockup; fictional fixtures; not a deployed screenshot |
| [prototypes/UC-110-011-basic-flow.png](./prototypes/UC-110-011-basic-flow.png) | New conceptual UI mockup; fictional fixtures; not a deployed screenshot |
| [prototypes/UC-110-012-basic-flow.png](./prototypes/UC-110-012-basic-flow.png) | New conceptual UI mockup; fictional fixtures; not a deployed screenshot |
| [prototypes/UC-110-007-basic-flow.png](./prototypes/UC-110-007-basic-flow.png) | New conceptual UI mockup; fictional fixtures; not a deployed screenshot |
| [prototypes/UC-110-008-basic-flow.png](./prototypes/UC-110-008-basic-flow.png) | New conceptual UI mockup; fictional fixtures; not a deployed screenshot |
