# Functional Group 080: Album Interaction – Use-Case Documentation

---

## 1. Group Information

| Attribute | Details |
|---|---|
| **Group ID** | 080 |
| **Group Name** | Album Interaction (G08: Album Details) |
| **Group Owner** | Nguyễn Khánh Đăng |
| **Module Purpose** | Manages the album discovery and playback experience, including viewing album metadata, exploring tracklists, initiating album playback, and saving/sharing album links. |
| **Documentation Status** | Draft — Baseline for Sprint 3 (PA3) Review |
| **Applicable Standards** | AuraTune Use-Case Documentation Guide, Spec Kit Architecture, PA3 Use-Case Specification Standard |

---

## 2. Scope

### 2.1 Purpose and Objectives
Functional Group 080 provides the core catalog browsing experience for releases. Listeners and guests can explore album metadata (cover art, artist, release year, total duration) and tracklists with individual play counts. Listeners can start album or track playback; listeners and guests can share album URLs, while saving an album requires sign-in.

### 2.2 In-Scope Capabilities
The capabilities specified for Group 080 comprise three distinct features. Their source specifications are currently Draft:

1. **Album Details (Feature 081)**:
   - Retrieving and rendering album metadata (cover art, artist, year, total duration).
   - Displaying release type badges ("Đĩa đơn" for 1 track, "Album" for 2+ tracks).
   - Rendering a flat tracklist in artist-intended order with individual play counts.
   - Calculating total album duration by summing valid track lengths.
   - Graceful handling of missing artwork, zero/unavailable play counts, and non-existent album states.

2. **Album Tracklist Playback (Feature 082)**:
   - Initiating playback for an entire album starting from the first playable track.
   - Forcing Shuffle mode off when playing the full album to respect artist-intended order.
   - Starting playback from a specific selected track within the album.
   - Integrating playback seamlessly with the persistent Music Player and its upcoming queue.
   - Skipping unavailable tracks without interrupting the playback sequence.

3. **Save and Share Album (Feature 083)**:
   - Authenticated bookmarking of albums into a personal library (`Saved Albums`).
   - Toggling the saved state with dynamic UI feedback (Bookmark vs. BookmarkCheck icons).
   - Sharing album URLs through Copy Link, Facebook, Instagram, X, and Zalo.
   - Enforcing authentication checks before allowing save actions.

### 2.3 Out-of-Scope Exclusions
To maintain strict architectural boundaries, the following capabilities are explicitly excluded from Group 080:
- **Audio Streaming Internals**: Actual fetching and decoding of audio chunks are owned by **Group 040 – Music Player**.
- **Playlist Management**: Custom user-created playlists and their logic belong to **Group 060 – Playlist**.
- **Catalog Management**: Uploading, editing, or deleting albums from the system database by admins.

### 2.4 Dependencies
- **Group 010 (Authentication)**: Provides authentication checks for the "Save Album" action and scopes saved states to the `user_id`.
- **Group 040 (Music Player)**: Receives track data and queue arrays to execute actual audio playback.

---

## 3. Related Requirements and Features

| Feature ID | Feature Name | Related FR IDs | Spec Path |
|---|---|---|---|
| **081** | Album Details (Draft) | `081-FR-001` to `081-FR-016` (including lettered FRs) | `specs/080-album-interaction/081-album-details/spec.md` |
| **082** | Album Tracklist Playback (Draft) | `082-FR-001` to `082-FR-016` | `specs/080-album-interaction/082-album-tracklist/spec.md` |
| **083** | Save and Share Album (Draft) | `083-FR-001` to `083-FR-014` | `specs/080-album-interaction/083-save-and-share-album/spec.md` |

---

## 4. Actors

| Actor | Actor Type | Description | Related Use Cases |
|---|---|---|---|
| **Listener** (`ACT-02`) | Primary Human Actor | Platform user who views details, plays tracks, and saves or shares albums. | `UC-080-001`, `UC-080-002`, `UC-080-003` |
| **Guest / Visitor** (`ACT-01`) | Primary Human Actor | Unauthenticated visitor who views public details and shares albums. | `UC-080-001`, `UC-080-003` |
| **Music Player** (`Group 040`) | External System (Supporting Actor) | Internal subsystem responsible for receiving track data and executing audio playback. | `UC-080-002` |

---

## 5. Use-Case Diagram

The following Mermaid flowchart visualizes the boundary, actors, draft use cases, and cross-group dependencies for **Group 080 – Album Interaction**.

```mermaid
flowchart LR
    %% Actors
    Listener["fa:fa-user Listener<br>(ACT-02)"]
    Guest["fa:fa-user-secret Guest<br>(ACT-01)"]
    Player["fa:fa-music Music Player Subsystem<br>(Group 040)"]
    Auth["fa:fa-shield-alt Auth Subsystem<br>(Group 010)"]

    %% System Boundary
    subgraph G080["AuraTune - 080 Album Subsystem"]
        UC080_1(["UC-080-001<br>View Album Details"])
        UC080_2(["UC-080-002<br>Play Album Tracklist"])
        UC080_3(["UC-080-003<br>Save and Share Album"])
    end

    %% Human Actor Associations
    Listener -->|Views & saves| UC080_1
    Listener -->|Plays tracks| UC080_2
    Listener -->|Saves & shares| UC080_3
    
    Guest -->|Views| UC080_1
    Guest -->|Shares| UC080_3

    %% Optional cross-group dependencies
    UC080_2 -.->|delegates selected playback| Player
    UC080_3 -.->|uses authentication for save actions| Auth

    %% Styling
    classDef actor fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#01579b;
    classDef external fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#e65100;
    classDef usecase fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#4a148c;
    classDef system fill:#fafafa,stroke:#9e9e9e,stroke-width:1px,stroke-dasharray: 5 5;

    class Listener,Guest actor;
    class Player,Auth external;
    class UC080_1,UC080_2,UC080_3 usecase;
    class G080 system;
```

### Diagram Legend
- **Ovals (`([ ... ])`)**: Draft Use Cases.
- **Solid Arrow (`-->`)**: Direct primary actor invocation.
- **Dashed Arrow (`-.->`)**: Optional cross-group dependency or delegation; it does not mean UML `include` or `extend`.
- **Subsystem Boundary (`subgraph`)**: Scope boundary of Group 080.

---

## 6. Use-Case List

| UC ID | Use-Case Name | Primary Actor | Related FRs | Specification File |
|---|---|---|---|---|
| **UC-080-001** | View Album Details | Listener, Guest | `081-FR-001` to `081-FR-016` | [`UC-080-001-album-details.md`](./UC-080-001-album-details.md) |
| **UC-080-002** | Play Album Tracklist | Listener | `082-FR-001` to `082-FR-016` | [`UC-080-002-album-tracklist.md`](./UC-080-002-album-tracklist.md) |
| **UC-080-003** | Save and Share Album | Listener, Guest | `083-FR-001` to `083-FR-014` | [`UC-080-003-save-and-share-album.md`](./UC-080-003-save-and-share-album.md) |

---

## 7. Dependencies and Integration

```
                 +---------------------------+
                 |    Group 010: Auth        |
                 |  (JWT Token / User Scope) |
                 +-------------+-------------+
                               |
                               v
+------------------+     +-------------------+
| Group 040:       | <-- |   Group 080:      |
| Music Player     |     |   Album           |
| (Playback Stream)|     +-------------------+
+------------------+               
```

1. **Authentication Token Flow**: Saving an album requires the user to be authenticated via Group 010. Guest users attempting to save are redirected to login.
2. **Playback Delegation**: Selecting "Play Album" or an individual track dispatches an array of tracks to Group 040 for playback execution and queue management.

---

## 8. Open Issues and Architecture Clarifications

| ID | Issue / Decision Needed | Impacted UC/FR | Owner | Status |
|---|---|---|---|---|
| `ISSUE-080-01` | Should large albums paginate tracks server-side? | `UC-080-001` | Nguyễn Khánh Đăng | **Resolved**: No. API returns full tracklist, UI renders progressively. |

---

## 9. References

- `docs/proposal/proposal.md`
- `docs/management/team-contract.md`
- `docs/requirements/use-case-model.md`
- `specs/080-album-interaction/081-album-details/spec.md`
- `specs/080-album-interaction/082-album-tracklist/spec.md`
- `specs/080-album-interaction/083-save-and-share-album/spec.md`
