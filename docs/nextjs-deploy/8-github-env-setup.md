[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **GitHub Env Setup**

[← GitHub Pipelines](./7-github-pipelines.md) | [Dokploy Env Setup →](./9-dokploy-env-setup.md)

---

# GitHub Env Setup

GitHub repository configuration: environments, secrets, and branch protection rules.

## Setup GitHub Environments

GitHub Environments allow per-environment secrets and deployment protection rules.

1. GitHub > Your Repository > Settings > Environments > New environment
2. (Optional) Check "Required reviewers" if you want manual approval (recommended for production)
3. Click on "Save protection rules"

Repeat for each environment you want to create (e.g., `preview` and `production`).

## Setup GitHub Secrets

GitHub > Your Repository > Settings > Secrets and Variables > Actions > New repository secret

Add the following secrets:

- `DOKPLOY_VPS_URL` (e.g., `dokploy.your-domain.com`)
- `DOKPLOY_API_TOKEN` (e.g., `jslkdjFSLlDflkKLDfjlksdjfdFLKlKJSdlkfjSDLfSKDjfllslsdkfflkSFKLls`)
- `DOKPLOY_COMPOSE_ID_PRODUCTION` (e.g., `4kbpULUAlKsd7L55ru54i`)
- `DOKPLOY_COMPOSE_ID_PREVIEW` (e.g., `s7kpRssAlKsd7fj8suSiJ`)

The `composeId` can be found at the end of the Dokploy service URL:

```
https://<dokploy-url>/dashboard/project/<project-id>/environment/<env-id>/services/compose/<compose-id>
```

## Branch Protection

GitHub > Your Repository > Settings > Rules > Rulesets

Ruleset **"Enforce PR on main and test"** applies to `main` and `test`:

- **Restrict deletions** — prevent branch deletion
- **Require a pull request before merging** — no direct push
    - Require review from Code Owners
    - 0 required approvals (can be increased for teams)
- **Allowed merge methods: Squash only** — keeps history clean
- **Block force pushes** — prevent history rewriting on protected branches

> [!NOTE]
> Maintainer role can bypass the ruleset when needed.

---

[← GitHub Pipelines](./7-github-pipelines.md) | [Dokploy Env Setup →](./9-dokploy-env-setup.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **GitHub Env Setup**
