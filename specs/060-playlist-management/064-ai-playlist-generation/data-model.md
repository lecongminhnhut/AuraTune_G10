# Data Model: AI Playlist Generation

**Feature**: [064 AI Playlist Generation](./spec.md)

## PlaylistProposal (transient)

| Field | Meaning / constraints |
|---|---|
| prompt | Listener description, max 200 characters. |
| proposed name | Editable playlist title; final playlist name follows 061's 80-character constraint. |
| rationale | Explanation of why tracks were selected, returned by the approved AI contract. |
| tracks | Ordered candidate songs, 10–20 on successful generation; exclude unavailable/restricted items. |
| edited order/membership | Listener may remove and reorder proposal tracks before saving. |

Proposal exists only during generation/review and is not persisted as a separate domain entity.

## Saved Playlist

Persist using 061 Playlist and 062 PlaylistSong entities. Saved playlist is private by default, retains final name/description attribution and edited song order. Exact attribution format must use approved playlist fields; no new schema is implied here.

## State Flow

Prompt → generation pending → proposal ready → listener edits → save pending → standard private playlist; AI error → manual creation fallback. A failed or partial save must not be reported as success.
