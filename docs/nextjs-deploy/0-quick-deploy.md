[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Quick Deploy**

---

# Quick Deploy

Deploy a new NextjsDeploy stack on an existing Dokploy infrastructure. Assumes VPS, Docker, Dokploy, Traefik and Tailscale are already set up — see [Quick Install](../vps-infra/0-quick-install.md) if not.

## Prerequisites

- Dokploy instance running on VPS
- Domain name with wildcard DNS configured
- Traefik with DNS challenge enabled
- Repository on GitHub (public or with SSH key)

---

## 1. Create Project & Environment

1. **Dokploy** > Projects > **Create Project** (e.g., `NextjsDeploy`)
2. Inside the project, click the environment dropdown (next to the project name) > **Create Environment** (e.g., `production`, `preview`)

## 2. Create Standalone Database

In the environment:

1. Click **Create Service** (top right) > **Database** > select **PostgreSQL**
2. Fill in the modal:

| Field                 | Value                                        |
| --------------------- | -------------------------------------------- |
| **Name**              | `production-db` (or `preview-db`)            |
| **Database Name**     | your database name (e.g., `nextjsdeploy-db`) |
| **Database User**     | `postgres` (default)                         |
| **Database Password** | generate a strong password                   |
| **Docker image**      | `postgres:16`                                |

3. Click **Create**
4. In the service **General** tab, note the **Internal Host** (e.g., `production-db-xxxxx`) — needed for env vars

> [!NOTE]
> The database is standalone (not in the compose file). This allows independent backups via Dokploy/Cloudflare R2.

## 3. Create Compose Service

In the same environment:

1. **Create Service** > **Compose**
2. Name: `production` (or `preview`)
3. **Provider** tab:
    - Select `Git` or `Github`
    - Repository URL: your repo
    - Branch: `main` (production) or `test` (preview)
    - Compose file path: `./compose.dokploy.yml`
    - Click **Save**

## 4. Environment Variables

1. Locally, generate env files:

```bash
make setup-env
```

2. Copy the content of `env/.env.production` (or `env/.env.preview`)

3. Paste in **Dokploy** > your compose service > **Environment** tab

4. Adjust these values:

| Variable                   | Action                                                             |
| -------------------------- | ------------------------------------------------------------------ |
| `POSTGRES_HOST`            | Set to database **Internal Host** from step 2                      |
| `POSTGRES_PASSWORD`        | Set to database password from step 2                               |
| `POSTGRES_DB`              | Set to database name from step 2                                   |
| `VPS_NEXTJS_DOMAIN`        | Your production domain (e.g., `your-domain.com`)                   |
| `VPS_PRISMA_STUDIO_DOMAIN` | Prisma Studio domain (e.g., `prisma-studio.your-domain.com`)       |
| `BETTER_AUTH_SECRET`       | Generate with `openssl rand -base64 32`                            |
| `PRISMA_STUDIO_AUTH`       | Generate with `htpasswd -nbB admin your-password` (double the `$`) |
| `TURNSTILE_SECRET_KEY`     | From Cloudflare Turnstile dashboard                                |

5. Click **Save**

> See [Environment Variables](../nextjs-deploy/2-environment-variables.md) and [Dokploy Env Setup](../nextjs-deploy/9-dokploy-env-setup.md) for details.

## 5. DNS Records

Add domain records pointing to your VPS IP:

| Type | Name                            | Value         |
| ---- | ------------------------------- | ------------- |
| A    | `your-domain.com`               | VPS public IP |
| A    | `prisma-studio.your-domain.com` | Tailscale IP  |

## 6. Deploy

- Click **Deploy** in Dokploy, or push to the configured branch
- The compose starts: Prisma migrations run automatically, then fixtures, then the server

## 7. Configure Backups — [detailed guide](./12-cloudflare-r2.md)

1. Go to your **database service** > **Backups** tab > **Create Backup**
2. Fill in:

| Field           | Value                             |
| --------------- | --------------------------------- |
| **Destination** | Your S3/R2 destination            |
| **Database**    | Database name from step 2         |
| **Schedule**    | `0 0 * * 0` (Sundays at midnight) |
| **Keep latest** | `3`                               |
| **Enabled**     | Yes                               |

## 8. Scheduled Tasks — [detailed guide](../nextjs-deploy/11-scheduled-tasks.md)

1. Go to your **compose service** > **Schedules** tab > **Add Schedule**
2. Fill in:

| Field            | Value                             |
| ---------------- | --------------------------------- |
| **Service Name** | `nextjs`                          |
| **Task Name**    | `Cleanup Activity History`        |
| **Schedule**     | `0 3 * * 0` (Sundays at 3:00 AM)  |
| **Shell Type**   | `Bash`                            |
| **Command**      | `bun run cron:cleanup-activities` |
| **Enabled**      | On                                |

## 9. Verify

- [ ] App accessible at `https://your-domain.com`
- [ ] Prisma Studio accessible at `https://prisma-studio.your-domain.com` (via VPN)
- [ ] Database backup runs successfully (manual test)
- [ ] Scheduled task appears in Schedules tab

---

## Checklist Summary

```
Create Project → Create DB → Create Compose → Env Vars → DNS → Deploy → Backups → CRON
```

---

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Quick Deploy**
