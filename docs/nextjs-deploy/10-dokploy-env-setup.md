[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Dokploy Env Setup**

[← GitHub Env Setup](./9-github-env-setup.md) | [Database Breaking Migrations →](./11-database-breaking-migrations.md)

---

# Dokploy Env Setup

How to set up your application environments on Dokploy. See [Containerization](./3-containerization.md) for compose file details and [Environment Variables](./2-environment-variables.md) for generating env files.

## Prerequisites

- VPS with Dokploy installed — see [Dokploy Install](../vps-infra/7-dokploy-install.md)
- Domain name pointing to VPS (e.g., `your-domain.com`) — see [DNS Config](../vps-infra/3-dns-config.md)
- Traefik configured — see [Traefik DNS Challenge](../vps-infra/8-traefik-dns-challenge.md)

## Create Project

Access your Dokploy instance (e.g., `https://dokploy.your-domain.com`).

1. Projects > Create Project
2. Choose a name for your project (e.g., `NextJS Deploy`), the description is optional
3. Click **Create**

## Create Environments

Create as many environments as you need (e.g., `preview`, `production`) in the project.

1. On top left corner > click `production` dropdown > Create Environment
2. Create a `preview` environment
3. Now you have two environments: `preview` and `production`

## Create Compose Services

In each environment, create a compose service.

1. On top right corner > click `Create Service` button > `Compose` button
2. Choose a name to easily identify each service (e.g., `nextjs-deploy-production`, `nextjs-deploy-preview`)

## Configure Provider

Select a provider for your service.

1. Select the `Git` (public repo or with SSH key) or `Github` (SSO connection required) tab
2. Select or provide your repository URL
3. Choose the branch to deploy: `main` for production, `test` for preview
4. Set the compose file path: `./compose.dokploy.yml`
5. Click **Save**

> [!NOTE]
> Dokploy looks for `compose.dokploy.yml` and `.env` at the project root. That's why the Dokploy compose file is not in `docker/` — see [Containerization](./3-containerization.md).

## Environment Variables

1. Generate env files with `make setup-env` — see [Environment Variables](./2-environment-variables.md)
2. Copy the content of:
    - `env/.env.preview` for the preview environment
    - `env/.env.production` for the production environment
3. Adjust the environment variables:
    - Set VPS domains (`VPS_NEXTJS_DOMAIN`, `VPS_PRISMA_STUDIO_DOMAIN`)
    - Generate strong passwords (`POSTGRES_PASSWORD`, `BETTER_AUTH_SECRET`) with `openssl rand -base64 32`
    - Generate Prisma Studio auth (`PRISMA_STUDIO_AUTH`) with `htpasswd -nbB admin your-password` (double the `$` signs)
4. Paste the content in Dokploy > your service > Environment Settings tab

## Deploy

Deploy manually from Dokploy dashboard, or automatically via [GitHub Pipelines](./8-github-pipelines.md).

---

[← GitHub Env Setup](./9-github-env-setup.md) | [Database Breaking Migrations →](./11-database-breaking-migrations.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Dokploy Env Setup**
