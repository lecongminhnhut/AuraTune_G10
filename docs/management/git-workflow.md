# Git Workflow

_Performed by: [], Reviewed by: [], Edited by: []_

This document outlines the standard Git workflow and branching strategy for the AuraTune project. All team members must strictly follow these rules to ensure code quality, prevent conflicts, and maintain a clean repository.

## 1. Branching Strategy

Our repository uses a feature-branch workflow based on the Scrum process.

- **`main`**: The production-ready branch. Code here must be stable, tested, and approved.
- **`develop`**: The main integration branch for the current Sprint. All feature branches merge into here.
- **Feature Branches (`feature/*`)**: Used for developing new features.
- **Bugfix Branches (`fix/*`)**: Used for fixing bugs.

**Branch Naming Convention:**
Branches must be named using the Jira task ID and a short description[cite: 14].

- Format: `<type>/<jira-id>-<short-description>`
- Example: `feature/AT-12-google-login`, `fix/AT-45-player-crash`

## 2. Commit Message Convention

We strictly follow the **Conventional Commits** format. Each commit must clearly state what was changed.

**Format:**
`<type>(<scope>): <subject>`

**Allowed Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes (e.g., updating markdown files in `/docs`)
- `style`: Changes that do not affect the meaning of the code (formatting, missing semi-colons, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `chore`: Changes to the build process or auxiliary tools

**Examples:**

- `feat(auth): implement Google OAuth2 login`
- `fix(player): resolve audio overlap issue on seek`
- `docs(management): update team contract for Sprint 2`

## 3. Standard Workflow Steps

Every time you pick up a task from Jira[cite: 14], follow these exact steps:

**Step 1: Sync with the remote repository**
Always start from the latest `develop` branch.

```bash
git checkout develop
git pull origin develop
```

**Step 2: Create a new branch**

```bash
git checkout -b feature/AT-XX-your-feature-name
```

**Step 3: Write code and commit**
Make atomic commits. Ensure you **NEVER commit API keys, secrets, or credentials** (like `.env` files) to avoid security risks and potential financial loss[cite: 15].

```bash
git add .
git commit -m "feat(scope): add new feature functionality"
```

**Step 4: Keep your branch updated**
If `develop` has advanced while you were working, rebase or merge `develop` into your branch to resolve conflicts locally.

```bash
git fetch origin
git rebase origin/develop
```

**Step 5: Push and create a Pull Request (PR)**

```bash
git push -u origin feature/AT-XX-your-feature-name
```

Go to GitHub and open a PR from your `feature` branch into `develop`.

## 4. Code Review and Merging

- **No Self-Merging:** You cannot merge your own Pull Request.
- **Review Requirement:** Every PR must be reviewed and approved by at least one other team member before merging.
- **Pre-meeting PRs:** To ensure productive Scrum meetings, push your code and open PRs before the team meetings.
- **Conflict Resolution:** If there is a merge conflict, the PR author is responsible for resolving it by communicating with the relevant team members via Discord. Do not force push (`git push -f`) over someone else's work.
