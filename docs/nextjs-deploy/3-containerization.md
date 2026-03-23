[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Containerization**

[← Environment Variables](./2-environment-variables.md) | [Fixtures →](./4-fixtures.md)

---

# Containerization

Docker is used for the database in development, for building and testing the production image locally, and for VPS deployment via [Dokploy](./9-dokploy-env-setup.md). See [Environment Variables](./2-environment-variables.md) for all variables used in compose files.

Compose files and Dockerfiles are located:

- `compose.dokploy.yml` at the project root (for Dokploy deployment)
- `docker/compose.postgres.yml` for local development (`make postgres`, `make dev`, `make start`)
- `docker/compose.docker.yml` for building and testing the Docker image locally (`make docker`)
- `docker/Dockerfile.nextjs` for the Next.js service
- `docker/Dockerfile.prisma-studio` for the Prisma Studio service

> [!NOTE]
> All services, volumes and networks use `ENV_LABEL` in their names to avoid conflicts when multiple projects based on this stack run simultaneously.

## Compose Files

### `compose.postgres.yml` — Postgres Only

Used by `make dev`, `make start` and `make docker`. Next.js runs in the terminal (or in Docker for `make docker`), only the database is containerized.

Services:

- **postgres** — PostgreSQL 16 Alpine, port `5433:5432`
- **prisma-studio** — Prisma Studio UI, port `5555:5555`
- **mailpit** — SMTP mock for email testing, ports `8025` (UI) and `1025` (SMTP)

Network:

- `app-network-{ENV_LABEL}` — internal communication between services

### `compose.docker.yml` — Docker Build

Used by `make docker`. Builds the Next.js Docker image with `build.network: host`, allowing `next build` to access the running Postgres during build time. This enables `generateStaticParams` to query the database and pre-render static pages.

Services:

- **nextjs** — Next.js standalone build, port `3000:3000`

Network:

- `app-network-{ENV_LABEL}` — connects to the Postgres network (external, created by `compose.postgres.yml`)

### `compose.dokploy.yml` — VPS Deployment

Used by Dokploy on the VPS. PostgreSQL is created as a **standalone database** in Dokploy (not in this compose). Services connect to it via `dokploy-network`.

Services:

- **prisma-studio** — Prisma Studio, exposed via Traefik with basic auth (`PRISMA_STUDIO_AUTH`)
- **nextjs** — Next.js standalone build, exposed via Traefik with TLS

Network:

- `dokploy-network` — external network managed by Dokploy, connects services to Traefik and the standalone database

Traefik labels handle:

- Domain routing (`VPS_NEXTJS_DOMAIN`, `VPS_PRISMA_STUDIO_DOMAIN`)
- TLS certificates via Let's Encrypt
- Basic auth middleware on Prisma Studio

## Dockerfiles

### `Dockerfile.nextjs` — Next.js

Multi-stage build for optimized production images:

1. **base** — Bun (Debian), installs postgresql-client, curl
2. **dev-deps** — Installs all dependencies (`bun install --frozen-lockfile`)
3. **prod-deps** — Installs production dependencies only (`bun install --production --frozen-lockfile`)
4. **builder** — Copies source, generates Prisma client, builds Next.js (`next build`)
5. **runner** — Production stage with non-root user, copies only standalone output, runs migrations + fixtures on startup

The `runner` stage CMD runs: `prisma migrate deploy` → `fixtures:setup` → `node server.js`

### `Dockerfile.prisma-studio` — Prisma Studio

Single-stage build: installs dependencies, generates Prisma client, exposes port `5555`.

## Volumes & Data

Postgres data is persisted in named volumes:

- Local (postgres): `postgres-volume-{ENV_LABEL}` (Docker managed)
- VPS (dokploy): standalone database managed by Dokploy

Reset data:

- `make postgres-clear` — stops container and deletes the volume
- `make docker-clear` — stops all containers and deletes volumes

---

[← Environment Variables](./2-environment-variables.md) | [Fixtures →](./4-fixtures.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Containerization**
