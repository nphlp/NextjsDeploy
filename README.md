# NextJS Deploy

Full-stack Next.js 16 template with complete local development setup and Dokploy VPS deployment.

- **Framework**: Next.js 16 (App Router, Cache Components, React Compiler)
- **API**: oRPC with Zod validation and OpenAPI documentation (Scalar)
- **Database**: PostgreSQL 16 + Prisma 7
- **Auth**: Better Auth
- **UI**: Tailwind CSS 4 + Base-UI
- **DevOps**: Docker, Dokploy, Traefik, Tailscale VPN
- **Analytics**: Umami (self-hosted)

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/fr/download)
- [PNPM](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Make](https://www.gnu.org/software/make/)

### Development

```bash
make dev
```

Next.js in terminal + Postgres in Docker. Installs dependencies, generates env files, sets up the database, loads fixtures and starts the server.

### Build (test production locally)

```bash
make start
```

### Full containerized environment

```bash
make basic
```

See [Setup local](./docs/nextjs-deploy/1-setup-local.md) for all options and details.

## Documentation

### Project — `docs/nextjs-deploy/`

- [Setup local](./docs/nextjs-deploy/1-setup-local.md)
- [Environment variables](./docs/nextjs-deploy/2-environment-variables.md)
- [Containerization](./docs/nextjs-deploy/3-containerization.md)
- [Fixtures](./docs/nextjs-deploy/4-fixtures.md)
- [Git usage](./docs/nextjs-deploy/5-git-usage.md)
- [Good practices](./docs/nextjs-deploy/6-good-practices.md)
- [MCP Servers](./docs/nextjs-deploy/7-mcp-servers.md)
- [Deployment](./docs/nextjs-deploy/8-deployment.md)

### Infrastructure — `docs/vps-infra/`

- [Setup VPS](./docs/vps-infra/1-setup-vps.md)
- [Firewall config](./docs/vps-infra/2-firewall-config.md)
- [DNS config](./docs/vps-infra/3-dns-config.md)
- [Swap file](./docs/vps-infra/4-swap-file.md)
- [Common packages](./docs/vps-infra/5-common-packages.md)
- [Docker install](./docs/vps-infra/6-docker-install.md)
- [Dokploy install](./docs/vps-infra/7-dokploy-install.md)
- [Traefik DNS challenge](./docs/vps-infra/8-traefik-dns-challenge.md)
- [Tailscale VPN](./docs/vps-infra/9-tailscale-vpn.md)
- [Umami analytics](./docs/vps-infra/10-umami.md)

## Fixtures

Test credentials:

| Email                | Password      | Role     |
| -------------------- | ------------- | -------- |
| employee@example.com | Password1234! | Employee |
| manager@example.com  | Password1234! | Manager  |
| admin@example.com    | Password1234! | Admin    |

See [Fixtures](./docs/nextjs-deploy/4-fixtures.md) for details.
