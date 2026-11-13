# 092 scoped security/privacy validation

Executed SQL/Express/session/component/browser tests described in [tooling](./tooling.md), [US4](./us4-safety.md) and [processing](./processing-and-recovery.md). Scope is disposable mapped fixtures, not a live permission audit.

Verified: canonical signed int64 validation; no request-selected owner; all User/Artist/Admin roles limited to current own scope; guest/banned/expired/revoked/forged/mismatched-owner sessions denied; SQL rechecks current database account/session, never memory fallback. Every list is owner-constrained and allowlisted. Hidden-without-pair/unknown error bodies are identical; existing hidden-owner DELETE returns no Artist DTO. API errors contain no storage diagnostic, hidden name/reason, relationship timestamp, credentials or other account's state. Responses use private/no-store; public 091 DTOs stay unchanged.

Supabase browser roles cannot execute the new functions; migration also revokes follow-table browser grants and enables RLS. Security-definer function search_path is empty, SQL sources qualified and parameters bound. Existing user/Artist base-table grants are not silently rewritten. Live DDL/ACL/RLS/PostgREST behavior must still be inspected on rollout.

Browser hidden-only list contains neither retained Artist name nor placeholder; public identity is independently available to guest. Long/untrusted names are escaped by React. Images use HTTP(S), no-referrer and neutral broken-image fallback. Follow toasts are generic and bound to the initiating current session; uncertain acknowledgement yields a notice, not false success. Saved browser demo follows are neither read as authority nor imported. No follower aggregate/raw hidden total exists.

Source scan found no production use of Artist setFollow/isFollowing/library.follows after migration; similarly named local Playlist save state is unrelated and retained. Test fixture auth/control routes appear only in fixture modules and are never mounted by production server. No new credentials were written to tracked files. Existing upload work, auth credentials, branch and Git staging were preserved.
