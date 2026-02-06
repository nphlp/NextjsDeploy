[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **GitHub Pipelines**

[← Git Usage](./7-git-usage.md) | [GitHub Env Setup →](./9-github-env-setup.md)

---

# GitHub Pipelines

CI/CD workflows in `.github/workflows/`. Pipelines validate code quality on every push and PR, and handle deployment to preview and production environments.

> [!NOTE]
> Not yet fully implemented. This section explains the planned pipeline structure and the role of Semantic Release

## Pipelines Overview

Here's the planned pipeline structure:

| Trigger  | Branches                    |
| -------- | --------------------------- |
| **Push** | `feat/*`, `fix/*`, `docs/*` |
| **PR**   | `test`                      |
| **Push** | `test`                      |
| **PR**   | `main`                      |
| **Push** | `main`                      |

### On Push — development branches

- **Triggers**: on **PUSH** to `feat/*`, `fix/*`, `docs/*`, etc.
- **Purpose**: validate code quality early in development.
- **Steps**:
    - Commit lint check

### On PR — to `test` branch

- **Triggers**: on **PR** targeting `test`.
- **Purpose**: validate code quality before merging to `test`.
- **Steps**:
    - Commit lint check
    - Lint, format, type check (parallel)
    - Unit tests

### On Push — `test` branch

- **Triggers**: on **PUSH** to `test`.
- **Purpose**: deploy preview environment for testing.
- **Steps**:
    - Build Docker image
    - Push image to registry
    - Deploy to preview environment (Dokploy)

### On PR — to `main` branch

- **Triggers**: on **PR** targeting `main`.
- **Purpose**: validate code quality before merging to `main`.
- **Steps**:
    - Commit lint check
    - Lint, format, type check (parallel)
    - Unit tests

### On Push — `main` branch

- **Triggers**: on **PUSH** to `main`.
- **Purpose**: deploy to production environment after all quality checks have passed via PR.
- **Steps**:
    - Semantic Release (changelog → tag → release)
    - Build Docker image
    - Push image to registry
    - Deploy to production environment (Dokploy)

## Semantic Release (Planned)

> [!NOTE]
> Not yet configured. This section explains how it will work once set up.

[Semantic Release](https://github.com/semantic-release/semantic-release) automates versioning based on [Conventional Commits](./7-git-usage.md#conventional-commits).

### Definitions

- **CHANGELOG.md** — file in the repo listing all notable changes per version, generated from conventional commits
- **Git Tag** — an immutable label on a specific commit (e.g., `v1.2.0`), following [Semantic Versioning](https://semver.org/) (`vMAJOR.MINOR.PATCH`)
- **GitHub Release** — a GitHub page built on top of a git tag with formatted release notes, visible to users and contributors

### How It Works

On each merge to `main`, semantic-release:

1. **Analyzes** all commits since the last release tag
2. **Determines** the version bump based on commit types:
    - `fix:` → **patch** (1.0.0 → 1.0.1)
    - `feat:` → **minor** (1.0.0 → 1.1.0)
    - `feat!:` / `BREAKING CHANGE` → **major** (1.0.0 → 2.0.0)
    - `docs:`, `style:`, `refactor:`, `test:`, `chore:` → **no release**
3. **Updates CHANGELOG.md** and commits it to `main`
4. **Creates the git tag** (e.g., `v1.1.0`) on the changelog commit
5. **Creates a GitHub Release** with release notes pointing to the tag

### Pipeline Integration

```
merge to main → semantic-release → changelog → tag → release → build → deploy
```

### Configuration

Already installed: `semantic-release`, `@semantic-release/changelog`, `@semantic-release/git`, `@semantic-release/github`.

Remaining setup:

- Create `.releaserc` configuration file
- Add `GITHUB_TOKEN` to GitHub secrets
- Add semantic-release step to the `main` push workflow
- Configure release branches (`main`)

---

[← Git Usage](./7-git-usage.md) | [GitHub Env Setup →](./9-github-env-setup.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **GitHub Pipelines**
