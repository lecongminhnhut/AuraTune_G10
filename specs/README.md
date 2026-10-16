# AuraTune Feature Specifications

## 1. Purpose

The `specs/` directory organizes AuraTune's feature specifications by functional group. Each group contains smaller feature directories so the team can define requirements, plan implementation, create tasks, and validate features independently.

The feature groups are based on the functional scope described in the project proposal and the responsibilities documented in the team contract. The directory structure is an organizational aid; it does not replace the approved project documents or mean that every proposed sub-feature has already been fully specified.

## 2. Directory Structure

```text
specs/
├── 010-authentication/
│   ├── 011-local-authentication/
│   ├── 012-oauth-authentication/
│   └── 013-session-management/
├── 020-home-dashboard/
│   ├── 021-home-content-layout/
│   ├── 022-recommended-content/
│   ├── 023-recently-played/
│   ├── 024-trending-charts/
│   └── 025-new-releases/
├── 030-search/
│   ├── 031-metadata-search/
│   ├── 032-ai-lyrics-search/
│   └── 033-semantic-vector-search/
├── 040-music-player/
│   ├── 041-playback-controls/
│   ├── 042-playback-progress-and-volume/
│   ├── 043-shuffle-and-repeat/
│   ├── 044-synchronized-lyrics/
│   ├── 045-persistent-bottom-player/
│   └── 046-song-sharing-and-comments/
├── 050-queue-management/
│   ├── 051-view-queue/
│   ├── 052-add-and-remove-queue-items/
│   ├── 053-reorder-queue/
│   └── 054-play-next/
├── 060-playlist-management/
│   ├── 061-playlist-crud/
│   ├── 062-playlist-song-management/
│   ├── 063-playlist-playback/
│   ├── 064-ai-playlist-generation/
│   └── 065-collaborative-playlists/
├── 070-listening-history/
│   ├── 071-listening-history/
│   ├── 072-listening-duration-analytics/
│   └── 073-top-artists-and-genres/
├── 080-album-interaction/
│   ├── 081-album-details/
│   ├── 082-album-tracklist/
│   └── 083-save-and-share-album/
├── 090-artist-profile-studio/
│   ├── 091-artist-profile/
│   ├── 092-follow-artist/
│   └── 093-artist-track-management/
├── 100-ai-recommendations/
│   ├── 101-listening-history-analysis/
│   ├── 102-personalized-recommendations/
│   └── 103-mood-and-context-recommendations/
├── 110-admin-functions/
│   ├── 111-user-management/
│   ├── 112-content-moderation/
│   └── 113-platform-statistics/
└── 120-ai-conversational-agent/
    ├── 121-conversational-interface/
    ├── 122-music-intent-understanding/
    └── 123-real-time-music-assistance/
```

## 3. Functional Groups and Ownership

The following ownership follows the team contract.

| Group | Functional area | Owner |
|---|---|---|
| `010` | Authentication | Khoa (B) |
| `020` | Home Dashboard | Huy (E) |
| `030` | Search (Text and AI Semantic) | Đăng (C) |
| `040` | Music Player | Huy (E) |
| `050` | Queue Management | Huy (E) |
| `060` | Playlist Management | Khoa (B) |
| `070` | Listening History | Khoa (B) |
| `080` | Album Details | Đăng (C) |
| `090` | Artist Profile | Hoàng (D) |
| `100` | AI Recommendations | Nhựt (A) |
| `110` | Admin Functions | Hoàng (D) |
| `120` | AI Conversational Agent (Real-time Host) | Nhựt (A) |

Each assigned member is responsible for their feature's specification, UI/UX, logic, testing, documentation, and demonstration, as described in the team contract. Shared architecture and integration decisions must still be coordinated with the team.

## 4. Naming Convention

- Group directories use three-digit identifiers in increments of ten: `010`, `020`, ..., `120`.
- Feature directories use identifiers associated with their parent group: for example, `031-metadata-search` belongs to `030-search`.
- Use lowercase kebab-case for directory names.
- Keep identifiers unique and stable after they have been referenced by specifications, tasks, pull requests, or team discussions.
- Directory identifiers organize specifications; they do not replace Jira issue IDs or Git branch naming conventions.
- Git branches must follow the team's Git workflow, including the Jira ID, such as `feature/AT-12-google-login`.

## 5. Recommended Contents of a Feature Directory

A feature directory is initially created as a place to develop that feature's specification. Depending on the configured Spec Kit workflow, it may contain some of the following artifacts:

| Artifact | Purpose |
|---|---|
| `spec.md` | User scenarios, requirements, acceptance criteria, and edge cases |
| `plan.md` | Technical implementation plan |
| `research.md` | Findings and decisions from technical research |
| `data-model.md` | Feature-specific data model, when needed |
| `quickstart.md` | Steps to run or verify the feature, when needed |
| `contracts/` | API or integration contracts, when needed |
| `tasks.md` | Actionable implementation tasks |

Not every feature needs every artifact. Follow the templates and commands configured in the repository's Spec Kit setup rather than creating files solely because they appear in this guide.

## 6. Suggested Specification Workflow

For each feature:

1. Confirm the feature's scope against the approved project proposal and relevant team decisions.
2. Create or select the appropriate feature branch according to the team's Git workflow.
3. Use the configured Spec Kit `specify` workflow to draft the feature requirements.
4. Review and clarify ambiguous requirements with the feature owner and relevant teammates.
5. Use the configured planning workflow to document the technical approach.
6. Generate and review implementation tasks.
7. Implement, test, document, and demonstrate the feature.
8. Open a pull request into `develop` and obtain review and approval from another team member.

The exact slash-command syntax and generated paths depend on the Spec Kit and AI-agent configuration installed in the repository.

## 7. Scope and Source of Truth

- The project proposal defines the product scope and described features.
- The team contract defines group ownership, team responsibilities, and working agreements.
- This README documents how the team organizes feature specifications; it does not independently approve new product requirements.
- A sub-feature directory is a planning boundary, not proof that its behavior or acceptance criteria have been finalized.
- If a proposed sub-feature is not clearly supported by the approved documents, confirm its scope with the team before treating it as committed work.
- Shared concerns such as database design, API conventions, authorization, storage, security, testing, and deployment should be coordinated across relevant feature groups rather than duplicated inconsistently.

## 8. Keeping This Structure Maintainable

- Keep each feature specification focused on a coherent user-facing capability or technical behavior.
- Avoid duplicating the same requirements across multiple feature specifications; reference the related feature when necessary.
- Split a feature further only when it has a meaningful, independently reviewable scope.
- Update this README when group names, ownership, identifiers, or the directory structure change.
- Keep all project documentation in English and Markdown, in accordance with the team contract.
