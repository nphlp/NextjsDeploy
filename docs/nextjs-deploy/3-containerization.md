[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Containerization**

[← Environment Variables](./2-environment-variables.md) | [Fixtures →](./4-fixtures.md)

---

# Containerization

Docker is used for the database in development, for full local testing, and for VPS deployment via [Dokploy](./8-deployment.md). See [Environment Variables](./2-environment-variables.md) for all variables used in compose files.

Compose files and Dockerfiles are located:

- `compose.dokploy.yml` at the project root (for Dokploy deployment)
- `docker/compose.postgres.yml` for local development (for `make postgres`, `make dev`, `make start`, etc)
- `docker/compose.basic.yml` for full local containerization (for `make basic`)
- `docker/Dockerfile` for Next.js service
- `docker/Dockerfile.prisma-studio` for Prisma Studio service

> [!NOTE]
> All services, volumes and networks use `ENV_LABEL` in their names to avoid conflicts when multiple projects based on this stack run simultaneously.

## Compose Files

### `compose.postgres.yml` — Postgres Only

Used by `make dev` and `make start`. Next.js runs in the terminal, only the database is containerized.

Services:

- **postgres** — PostgreSQL 16 Alpine, port `5433:5432`
- **prisma-studio** — Prisma Studio UI, port `5555:5555`

Network:

- `app-network-{ENV_LABEL}` — internal communication between services

### `compose.basic.yml` — Full Local

Used by `make basic`. Everything containerized locally.

Services:

- **postgres** — PostgreSQL 16 Alpine (no exposed port)
- **prisma-studio** — Prisma Studio UI, port `5555:5555`
- **nextjs** — Next.js standalone build, port `3000:3000`

Network:

- `app-network-{ENV_LABEL}` — internal communication between services

### `compose.dokploy.yml` — VPS Deployment

Used by Dokploy on the VPS. Same services as basic but with Traefik routing and TLS.

Services:

- **postgres** — PostgreSQL 16 Alpine, volume mapped to `../files/postgres`
- **prisma-studio** — Prisma Studio, exposed via Traefik with basic auth (`PRISMA_STUDIO_AUTH`)
- **nextjs** — Next.js standalone build, exposed via Traefik with TLS

Networks:

- `app-network-{ENV_LABEL}` — internal communication between services
- `dokploy-network` — external network managed by Dokploy, connects services to Traefik

Traefik labels handle:

- Domain routing (`VPS_NEXTJS_DOMAIN`, `VPS_PRISMA_STUDIO_DOMAIN`)
- TLS certificates via Let's Encrypt
- Basic auth middleware on Prisma Studio

## Dockerfiles

### `Dockerfile` — Next.js

Multi-stage build for optimized production images:

1. **base** — Bun Alpine, installs Node.js, postgresql-client, libc6-compat
2. **dev-deps** — Installs all dependencies (`bun install --frozen-lockfile`)
3. **builder** — Copies source, generates Prisma client, builds Next.js
4. **runner** — Production stage with non-root user, copies only standalone output, runs migrations + fixtures on startup

The `runner` stage CMD runs: `prisma:deploy` → `fixtures:setup` → `node server.js`

### `Dockerfile.prisma-studio` — Prisma Studio

Single-stage build: installs dependencies, generates Prisma client, exposes port `5555`.

## Volumes & Data

Postgres data is persisted in named volumes:

- Local (postgres/basic): `postgres-volume-{ENV_LABEL}` (Docker managed)
- VPS (dokploy): `../files/postgres` (host bind mount)

Reset data:

- `make postgres-clear` — stops container and deletes the volume
- `make basic-clear` — stops all containers and deletes volumes

---

[← Environment Variables](./2-environment-variables.md) | [Fixtures →](./4-fixtures.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Containerization**
