# Listening Analytics Contract (Draft)

**Feature**: [072 Listening Duration Analytics](../spec.md)  
**Status**: Aggregate behavior captured; endpoint/schema require approval.  
**Shared conventions**: [AuraTune API Contract](../../../../docs/analysis-and-design/api-contract.md)

## Required Behavior

- Return private, backend-aggregated analytics for the authenticated listener only.
- Supported summary windows: 7 days, 30 days, and all time within 365 days.
- Include total listened duration, qualifying session count, unique song count, top five artists by listened duration, and daily totals for the previous seven days.
- Exclude hidden/cleared events and sessions below 30 seconds.
- Range changes recalculate period-based metrics; the daily trend remains a fixed seven-day window.
- Use the shared `{success,message,data,error}` envelope and shared error conventions.

## Not Defined by Existing API Contract

No analytics route, query parameter, response schema, timezone field, tie-breaker, cache policy, or refresh endpoint is defined. Approve these before implementation. Do not use the current demo page's client-side calculations as the production API contract.

## Security

Derive owner identity from the authenticated principal and deny cross-user analytics access. Do not accept an arbitrary user ID as authorization input.
