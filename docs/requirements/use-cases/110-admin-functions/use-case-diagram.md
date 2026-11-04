# Group 110 — Use-Case Diagram

Updated: 2026-11-04. Draft; Reviewer: Not assigned. Owner session decisions Q01–Q11 are applied as documented in the [inventory](./use-case-inventory.md#decision-register); no pre-existing source/collective approval claim is made.

```mermaid
flowchart LR
    Admin["Administrator — valid current admin access"]
    Owner["Artist-owner — active access and ownership"]
    subgraph G110["AuraTune Group 110 — Draft documentation baseline"]
      subgraph Accounts["111 User Management"]
        U001(["UC-110-001 View and find users"])
        U002(["UC-110-002 Ban non-admin account"])
        U003(["UC-110-003 Unban account"])
        U004(["UC-110-004 Change another account role"])
      end
      subgraph Moderation["112 Content Moderation"]
        U005(["UC-110-005 Review songs and rights context"])
        U009(["UC-110-009 Restrict or delist"])
        U010(["UC-110-010 Lift admin restriction"])
        U011(["UC-110-011 Final delete — no business restore"])
        U012(["UC-110-012 View own restricted song in Studio"])
      end
      subgraph Overview["113 Overview and separate System area"]
        U007(["UC-110-007 Four-card read-only overview — Partial source"])
        U008(["UC-110-008 AI setting — current browser demo only"])
        U013(["UC-110-013 Reset demo — Deferred / not available"])
      end
    end
    Admin --> U001
    Admin --> U002
    Admin --> U003
    Admin --> U004
    Admin --> U005
    Admin --> U009
    Admin --> U010
    Admin --> U011
    Admin --> U007
    Admin --> U008
    Admin -. "Deferred association only — no reset execution" .-> U013
    Owner --> U012
    classDef actor fill:#e0f2fe,stroke:#0369a1,color:#0c4a6e
    classDef usecase fill:#f8fafc,stroke:#475569,color:#0f172a
    classDef partial fill:#fff7ed,stroke:#c2410c,color:#7c2d12
    classDef localdemo fill:#f0fdf4,stroke:#15803d,color:#14532d
    classDef deferred fill:#f3f4f6,stroke:#6b7280,color:#4b5563,stroke-dasharray:6 4
    class Admin,Owner actor
    class U001,U002,U003,U004,U005,U009,U010,U011,U012 usecase
    class U007 partial
    class U008 localdemo
    class U013 deferred
```

## Reading the diagram

- Solid lines associate available documented actor goals; they do not assert implementation, approval or complete prototypes.
- Administrator and Artist-owner are distinct. Artist-owner has only the ownership-limited Studio goal here, not Admin moderation access. General Listener/Guest/non-owner requests are denial cases, not extra administrative goals.
- UC-110-007 has source gaps in count hints; its four-card overview is read-only.
- UC-110-008 applies only to the current browser demo and persists through reload. It does not control remote/shared AI services or satisfy the source’s platform-wide clause.
- UC-110-013’s dashed association is a deferred source allocation, **not an available reset action or execution flow**.
- Restrict/delist and final delete are distinct goals. Only reversible admin restriction can be lifted; final deletion has no business restore and specifies no physical cleanup.
- Lifting a restriction preserves Artist self-hide/private preference and existing eligibility rules. Cross-check [090 visibility](../090-artist-profile-studio/UC-090-007-hide-or-unhide-track.md); no forced public placement is implied.
- No include/extend relation is asserted. Internal database/auth/UI modules are not external actors. Reserved shared ID 006 is outside these feature specs, so no comment moderation is added.

## Rendering verification

Verified with Mermaid 11 in the browser: syntax parse and SVG rendering succeeded, with **14 nodes (2 actors + 12 UC goals), 12 association edges and 0 overlapping node bounding boxes** in the rendered layout. Reset is dashed/deferred; Admin and Artist-owner remain separate. This is a browser render/geometry check, not a runtime UI test or a claim that every text layout was manually reviewed. No PNG/SVG export of this diagram is saved. The six conceptual UI storyboards are separately listed in the prototype register and do not demonstrate runtime behavior.

## Links

See the [twelve actual Drafts](./README.md#draft-specification-files), [74-FR ledger](./use-case-inventory.md#complete-fr-traceability) and [source and new-mockup evidence register](./prototypes/README.md). Read behavioral status separately from visual completeness.
