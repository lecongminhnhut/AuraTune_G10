# API Contract Boundary: Album Details

Feature 081 consumes the already approved public `GET /albums/:id` contract named in [`spec.md`](../spec.md). This feature plan does not define or change that external contract.

The authoritative contract artifact and service owner could not be located in the checked-in API contract documentation or current backend routes during planning. Before implementation, the API owner must identify the source of truth and confirm the exact route/base path and response mapping, including the complete ordered track list and each track's play count. The frontend's configured API base path must be reconciled with the approved route by that owner.

Do not treat this note as an API schema. Do not add response fields, parameters, endpoints, or persistence behavior on its basis. Once the authoritative contract is identified, link or reference it here rather than copying or redefining it.
