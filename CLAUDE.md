# NextjsDeploy

Next.js 16 boilerplate with Docker, Dokploy deployment, and VPS infrastructure.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Cache Components, React Compiler)
- **Language**: TypeScript 5.9
- **Database**: PostgreSQL 16 + Prisma 7
- **Auth**: Better Auth
- **API**: oRPC (with Zod validation + OpenAPI via Scalar)
- **UI**: Tailwind CSS 4 + Base-UI + Motion
- **State**: Zustand, Nuqs (query params)
- **Forms**: React Hook Form
- **Email**: Nodemailer + React Email
- **DevOps**: Docker, Dokploy, Traefik, Tailscale VPN
- **Analytics**: Umami (self-hosted)
- **Quality**: ESLint 9, Prettier, Vitest, Husky, Commitlint

## Repository Architecture

```
actions/          # Server Actions
api/              # oRPC API routes (router, cache, permissions)
app/              # Next.js App Router pages and layouts
components/       # Atomic Design (atoms/, molecules/, organisms/)
core/             # App shell (Header, Footer, Theme) and config
docker/           # Dockerfiles and compose files
docs/             # Project documentation
env/              # Environment config and generation (env.config.ts)
fixtures/         # Seed data (users, fruits, baskets)
lib/              # Core libraries (auth, prisma, orpc, env, email)
prisma/           # Schema, migrations, generated client
scripts/          # Utility scripts (fixtures, db)
utils/            # Utility functions and hooks
```

## Commands

### Servers & Environment

```bash
# Setup/check environment variables
# -> Generate .env files declinaisons in `env/`
# -> Like `env.config.ts` or `.env.prod`
make setup-env

# Start Postgres server only
# -> Used by developper in combination with `pnpm dev` or `pnpm auto`
make postgres

# Automated environments
# -> Install deps, generate envs, setup db, insert fixtures and run server
make dev          # Dev server (Next.js local + Postgres Docker)
make start        # Test production build locally
make basic        # Full containerized environment
```

### Code Quality & Tests

```bash
pnpm checks       # All checks (type + lint:fix + format:fix)
pnpm type         # TypeScript checking
pnpm lint:fix     # ESLint check/fix
pnpm format:fix   # Prettier check/fix
pnpm test:run     # Unit tests
```

### Node, Database & Fixtures

Do not run these commands without developer authorization.

```bash
# Auto install, setup and run server
pnpm auto
pnpm auto:start

# Database setup
pnpm db:setup          # Setup database
pnpm db:reset          # Reset database
pnpm db:execute        # Execute SQL query

# Prisma client and migrations
pnpm prisma:generate   # Generate Prisma client
pnpm prisma:migrate    # Run migrations
pnpm prisma:deploy     # Deploy migrations

# Fixtures management
pnpm fixtures:setup    # Load fixtures
pnpm fixtures:reset    # Reset fixtures

# Nextjs Server
pnpm dev
pnpm build && pnpm start
```

## MCP Servers (`.mcp.json`)

- **context7** - Up-to-date documentation for any library
- **next-devtools** - Next.js dev server MCP (errors, routes, diagnostics)
- **chrome-devtools** - Browser automation and debugging
- **ide** (built-in) - VS Code LSP diagnostics via extension

## Documentation

- `docs/nextjs-deploy/` - Project setup, environment, containerization, deployment
    - To be defined...
- `docs/vps-infra/` - VPS setup, DNS, firewall, Dokploy, Tailscale, analytics
    - To be defined...

## Rules

### Language

- Code, documentation, comments, JSDoc: English
- Claude Code responses: adapt to the language of the prompt

### Commands

- Always use pre-authorized commands to avoid prompting the user. Use `git status` not `git -C /path status`, use `pnpm type` not `tsc --noEmit`, use `pnpm lint:fix` not `eslint . --fix`, etc.
- Do not run servers to avoid port conflicts. Developer handles these manually.

### Git

- Do not run `git` commands without authorization or explicit demand. These are sensitive operations.
- Never sign commits with `Co-Authored-By`.
- Always show the commit message to the developer for approval before committing.

### Documentation & CLAUDE.md

- IMPORTANT: If you identify that CLAUDE.md or any documentation file (in docs/) should be updated (outdated info, missing context, new patterns, etc.), always suggest it to the developer. Never update these files silently.

### MCP Usage

- **context7**: Use autonomously to look up documentation for recent/unfamiliar topics (e.g. "use cache", Claude Code skills, Dokploy, Base-UI, oRPC, etc.).
- **next-devtools**: Use to debug server-side logs and errors when the dev server is running.
- **chrome-devtools**: Only use with explicit developer approval. Opens a new Chrome window which may be disruptive.
- **ide** (`getDiagnostics`): Use autonomously after code changes alongside `pnpm checks`. Catches things other tools miss (e.g. Tailwind v4 class migrations like `w-[300px]` → `w-75`).
