# UC-110-013 — Reset Demo Data

## 1. Document Information

- **Use Case ID**: UC-110-013
- **Use Case Name**: Reset Demo Data
- **Functional Group**: 110 — Admin Functions / Feature 113
- **Primary Actor**: Administrator (ACT-05)
- **Supporting Actors**: None evidenced; internal modules are not actors.
- **Author**: Not assigned
- **Reviewer**: Not assigned
- **Status**: Draft
- **Last Updated**: 2026-11-04
- **Decision provenance**: Owner-confirmed session choices dated 2026-11-04 — [Q09](./use-case-inventory.md#q09), [Q11](./use-case-inventory.md#q11). These are session decisions by the owner, not pre-existing source requirements, collective team approval or review sign-off.
- **Behavior completeness**: Deferred / not available in this release; no reset execution scenario.

## 2. Description

Owner-confirmed Q11=C defers demo reset until a precise seed/reset catalog and behavior exist. The specification remains Draft to preserve allocation and source conflicts, but reset is not available in this release; it has no executable reset flow.

## 3. Preconditions

No reset execution preconditions are supplied because the function is deferred/not available. Administrator status does not make reset executable in this release. Future scope, seed inventory, confirmation, session effect and recovery semantics are not selected.

## 4. Trigger

No executable reset trigger exists in this release. The source’s System-area reset goal is retained as deferred documentation only; this does not assert that any button, endpoint or disabled-state prototype has been delivered.

## 5. Basic Flow (Main Success Scenario)

**Not applicable — deferred by owner Q11=C.** There is no reset main success scenario in this release. No data-reset request, processing sequence, confirmation dialog or successful restoration is fabricated.

## 6. Alternative Flows

**Not applicable for execution.** No reset is dispatched, so confirmation, direct reset, duplicate/reset ordering and cancel branches are not modeled as available behavior. These are future specification work if reset is brought back into scope.

## 7. Exception Flows

**Not applicable for execution.** No reset request is available, so no fictional authorization/validation/reset-failure/retry sequence is supplied. The general source requirement for privileged authorization remains a future constraint, not proof of a reset endpoint.

## 8. Postconditions

### 8.1 Success Postconditions

No successful reset outcome is available in this release. Draft documentation does not restore demo state.

### 8.2 Failure Postconditions

No reset execution/failure path is specified. This release performs no reset mutation and makes no atomicity or rollback claim for a future reset.

### 8.3 Cancellation Postconditions

No reset submission or confirmation flow exists to cancel. Leaving the System area is not modeled as a completed or canceled reset.

### 8.4 Unknown-Outcome Postconditions

No reset dispatch is available in this release, so no reset completion can be reported as known or unknown. If a future reset is introduced, its unknown/partial-result contract requires specification then; no recovery mechanics are invented here.

## 9. Special Requirements

- **Performance**: No numeric response-time target is established for this goal in the reviewed feature source; none is invented.
- **Security & Privacy**: Apply backend Administrator authorization for privileged reads/actions at every request; do not disclose credentials, secrets or unrelated private data. Actor roles are not UI-only safeguards.
- **Accessibility**: No source-specific conformance target is established here. Feedback must identify the actual outcome rather than imply success from a control’s appearance; detailed interaction/accessibility design is a technical follow-up.
- **Result integrity**: Distinguish confirmed success, no-op, cancellation before dispatch, known rejection/failure and unknown completion. Apply the confirmed owner session choices only within their documented scope; no collective approval is inferred.

## 10. Related Functional Requirements

Source-local IDs are qualified with the feature number. “Specified in Draft” means a concrete behavior/rule is written, not implemented/tested/approved. “Needs Clarification” may concern only part of an FR; retain the settled clauses and the open branch. The [inventory](./use-case-inventory.md#complete-fr-traceability) remains the distinct 74-FR accounting ledger.

| Source FR | Source requirement | Actual flow / rule | Behavior status |
|---|---|---|---|
| <a id="113-fr-021"></a>113-FR-021 | The Admin area MUST provide system availability controls, including a master AI service toggle (`aiAvailable`) to activate platform-wide graceful degradation and a demo data reset action (`resetDemo`) to restore initial application state. | [R-01](#r-01), [R-02](#r-02), [R-03](#r-03), [R-04](#r-04) — deferred/not available; no executable reset flow | Partially specified / Deferred — local browser scope differs from platform-wide source; reset deferred ([Q09](./use-case-inventory.md#q09), [Q10](./use-case-inventory.md#q10), [Q11](./use-case-inventory.md#q11)); [G02](./use-case-inventory.md#g02) |

## 11. Related Use Cases

- **Includes**: None asserted.
- **Extended by**: None asserted.
- **Preceding / related goals**: [UC-110-007](./UC-110-007-view-platform-statistics.md), [UC-110-008](./UC-110-008-control-ai-availability.md). These are navigation/state dependencies, not unproved UML include/extend claims.

## 12. Source References

- [Feature 113 specification](../../../../specs/110-admin-functions/113-platform-statistics/spec.md) — embedded Clarifications (2026-10-30, 2026-11-01), User Scenarios & Testing, Functional Requirements, Edge Cases and scope sections.
- [Feature checklist](../../../../specs/110-admin-functions/113-platform-statistics/checklists/requirements.md) — quality/source review, not approval evidence.
- [API contract](../../../analysis-and-design/api-contract.md#210-admin) — §2.10 Admin endpoint and permission evidence; missing payloads/routes are not invented in the flows.
- [Use-case guide/template](../README.md#6-standard-use-case-specification-template), [shared actor/UC model](../../use-case-model.md), [security guidance](../../../design/security/README.md), [database security](../../../design/database/security-rules.md).
- [Vision G11](../../../proposal/Auratune_Vision_Document.md) — broad administration context, not a grant to expand these flows.

## 13. Prototype and Screenshot References

**Deferred / Missing — not available in this release.** Owner Q11=C is unchanged. There is no reset execution, confirmation, result or reset mockup. A System-area label is not evidence of a reset capability.

The six new Group 110 storyboards cover the eleven currently available documented goals only. See the [prototype register](./prototypes/README.md). Source 113-FR-021 remains partially specified/deferred; neither the AI browser-demo mockup nor this Draft closes its platform-wide/reset clauses.

## 14. Business Rules and Scope Constraints

- <a id="r-01"></a>**R-01**: Owner Q11=C: reset is deferred/not available in this release. Do not expose an executable reset action as part of this documented release, dispatch a reset operation or imply any records/settings/session have been reset. No new UI-disabled-message design is asserted.
- <a id="r-02"></a>**R-02**: Source FR-021 still includes a reset action and platform-wide AI control; this Draft retains that exact requirement and allocation but marks it partially specified/deferred. Neither the browser-demo AI toggle nor a Draft reset document completes FR-021.
- <a id="r-03"></a>**R-03**: Q09=A retains a separate System-area grouping within 113 while overview remains read-only. It does not undo Q11=C or authorize a reset via the stats endpoint.
- <a id="r-04"></a>**R-04**: The seed/reset inventory, affected datasets/settings/session, pre-execution confirmation, cancellation, repeated/concurrent actions and failure/partial-result recovery remain future missing specifications. Q11 is answered as deferral, not an unanswered permission request. Do not invent defaults, file/database cleanup, rollback, logout or an executable success flow.

## 15. Source Conflicts and Behavioral Impact

### C6

**Passage A** — [specs/110-admin-functions/113-platform-statistics/spec.md, line 183](../../../../specs/110-admin-functions/113-platform-statistics/spec.md#L183):

> - This feature is intentionally read-only and does not include data mutations or platform-wide operational actions.

**Passage B** — [specs/110-admin-functions/113-platform-statistics/spec.md, line 150](../../../../specs/110-admin-functions/113-platform-statistics/spec.md#L150):

> - **FR-021**: The Admin area MUST provide system availability controls, including a master AI service toggle (`aiAvailable`) to activate platform-wide graceful degradation and a demo data reset action (`resetDemo`) to restore initial application state.

**Historical impact before this owner decision:** System writes conflict with the feature-wide no-operations boundary. The read-only statistics goal never performs these writes; separate conditional goals record the proposed controls.

**Resolution reference — owner confirmed in this session:** [Q09](./use-case-inventory.md#q09)



**Current treatment:** Apply [Q09](./use-case-inventory.md#q09), [Q11](./use-case-inventory.md#q11). All original source passages above remain verbatim. The owner resolved the documentation behavior locally; source specs/shared artifacts are unchanged. These decisions are not pre-existing or collectively approved requirements.

## 16. Open Questions and Follow-ups

Applied owner-confirmed session choices: [Q09](./use-case-inventory.md#q09), [Q11](./use-case-inventory.md#q11).

Q11=C is answered: reset is deferred. Precise seed/reset scope and future reset behavior are not specified. No reset success/cancel/failure/unknown execution flow is supplied this release.

See the [owner decision register](./use-case-inventory.md#decision-register). These are owner session confirmations, not whole-team approval or review sign-off. [Technical follow-ups](./use-case-inventory.md#technical-follow-ups) and [prototype evidence](./prototypes/README.md) remain separate.

## 17. Draft Verification and Limitations

Sections 1–13 preserve every section actually present in the shared embedded template. Sections 14–17 supplement it with rules, source conflicts, questions and verification because the guide calls it a 17-section template but only prints 13 sections; no missing canonical headings are claimed. The template discrepancy is an authoring follow-up, not a behavior question.

This file is a Draft with Reviewer: Not assigned. Numbered Actor/System flows and FR-to-rule mappings describe documentation, not executed tests or a completed prototype. Missing source evidence, deferred behavior and unknown execution outcomes must not be reported as fully Covered. Owner-confirmed choices govern this documentation scope only. No reviewer, product approval, implementation readiness or policy choice is inferred.
