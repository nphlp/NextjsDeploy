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
- **Forms**: Custom useForm hook (Zod validation, progressive schemas)
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
env/              # Environment config and generation (env.config.mjs)
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
# -> Generate .env files from env/env.config.mjs
make setup-env

# Start Postgres server only
make postgres

# Automated environments
# -> Install deps, generate envs, setup db, insert fixtures and run server
make dev          # Dev server (Next.js local + Postgres Docker)
make start        # Test production build locally
make docker       # Build and run Next.js Docker image
```

### Code Quality & Tests

```bash
bun run checks       # All checks (type + lint:fix + format:fix)
bun run type         # TypeScript checking
bun run lint:fix     # ESLint check/fix
bun run format:fix   # Prettier check/fix
bun run test:run     # Unit tests
```

### Node, Database & Fixtures

Do not run these commands without developer authorization.

```bash
# Auto install, setup and run server
bun run auto
bun run auto:start

# Database setup
bun run db:setup          # Setup database
bun run db:reset          # Reset database
bun run db:execute        # Execute SQL query

# Prisma client and migrations
bun run prisma:generate   # Generate Prisma client
bun run prisma:migrate    # Run migrations
bun run prisma:deploy     # Deploy migrations

# Fixtures management
bun run fixtures:setup    # Load fixtures
bun run fixtures:reset    # Reset fixtures

# Nextjs Server
bun run dev
bun run build && bun run start
```

## MCP Servers (`.mcp.json`)

- **context7** - Up-to-date documentation for any library
- **next-devtools** - Next.js dev server MCP (errors, routes, diagnostics)
- **chrome-devtools** - Browser automation and debugging
- **ide** (built-in) - VS Code LSP diagnostics via extension

## Project Files

- `README.md` — Project overview, quick start, documentation index
- `TODO.md` — Feature backlog and technical debt
- `PLAN.md` — Security & legal audit plan (OWASP, RGPD, CNIL, ANSSI)
- `SECURITY.md` — OWASP, RGPD/CNIL, ANSSI reference for developers

## Documentation

- `docs/nextjs-deploy/` — Project setup, environment, containerization, deployment
    - `1-setup-local.md` — Prerequisites, make dev/start/docker/postgres, ngrok
    - `2-environment-variables.md` — Env generation system, variables reference
    - `3-containerization.md` — Compose files, Dockerfiles, volumes
    - `4-fixtures.md` — Commands, test credentials, seed data
    - `5-mcp-servers.md` — MCP servers configuration
    - `6-git-usage.md` — Branching, commits, conventions
    - `7-github-pipelines.md` — CI/CD workflows
    - `8-github-env-setup.md` — GitHub environment variables
    - `9-dokploy-env-setup.md` — Dokploy environment setup
    - `10-database-breaking-migrations.md` — Safe migration strategies
- `docs/good-practices/` — Code conventions and patterns
    - `1-nextjs.md` — Page architecture, file structure per page
    - `2-components.md` — Component structure, props, JSX conventions
    - `3-typescript.md` — TypeScript conventions
    - `4-context.md` — Context structure (3-file pattern)
    - `5-form.md` — Form adapters, useForm hook, validation patterns
    - `6-query-state.md` — Query parameters with nuqs
    - `7-cookie-state.md` — Cookie state with useCookieState
    - `8-cross-state.md` — Reactive cross-component state
    - `9-orpc.md` — oRPC API patterns (server-side + client useFetch)
    - `10-base-ui.md` — Base UI component system (patterns, typing, inventory)
    - `11-theme.md` — Theme system (blocking script, CSS icons, zero flash)
- `docs/testing/` — Test suites documentation
    - `e2e.md` — Playwright E2E tests (57 tests / 10 specs)
    - `unit.md` — Vitest unit tests (13 tests)
    - `functional.md` — Functional tests (placeholder)
    - `integration.md` — Integration tests (placeholder)
- `docs/vps-infra/` — VPS setup, DNS, firewall, Dokploy, Tailscale, analytics
    - `1-setup-vps.md` — VPS initial setup
    - `2-firewall-config.md` — UFW firewall rules
    - `3-dns-config.md` — DNS configuration
    - `4-swap-file.md` — Swap file setup
    - `5-common-packages.md` — Essential packages
    - `6-docker-install.md` — Docker installation
    - `7-dokploy-install.md` — Dokploy installation
    - `8-claude-code.md` — Claude Code on the VPS
    - `9-traefik-dns-challenge.md` — Traefik SSL with DNS challenge
    - `10-tailscale-vpn.md` — Tailscale VPN setup
    - `11-umami.md` — Umami analytics

## Rules

### Language

- Code, documentation, comments, JSDoc: English
- Claude Code responses: adapt to the language of the prompt
- Never leak real domains, secrets, or credentials in documentation or versioned files. Use generic placeholders (`your-domain.com`, `your-password`, etc.).

### Naming

- For boolean variables: use `every` prefix instead of `all` (e.g. `everyValid`, `everyPassed`, not `allValid`, `allPassed`).

### Atoms (Base-UI components)

- **Import pattern**: Always import atoms via `index.ts` — default export for the composable component, named exports for sub-components: `import Popover, { Arrow, Popup, Portal, Trigger } from "@atoms/popover"`.
- **Guide**: Follow `docs/good-practices/10-base-ui.md` (patterns, typing, step-by-step, component inventory) when creating or modifying atoms. Use the `context7` MCP server for up-to-date Base UI documentation.

### Forms

- **Always reset forms after submission** — Next.js is a SPA. Even with `window.location.href`, the user can navigate back. Forms must always call `reset()` (form fields), `resetCaptcha()` (if applicable), and stop loaders (`setIsSubmitting(false)`) via a delayed `setTimeout` after submission. Never remove these cleanup calls.

### Environment Variables

**Architecture:**

- `lib/env.ts` — Server-only variables (has `import "server-only"` guard)
- `lib/env-client.ts` — Client-safe variables (`NEXT_PUBLIC_*` only, importable in `"use client"` components)
- Exceptions (direct `process.env` allowed):
    - Config files (`next.config.mts`, `prisma.config.mts`, `vitest.config.mjs`) — run outside app scope, can't import `env.ts`
    - `lib/prisma.ts` — requires `dotenv` for standalone Prisma CLI usage (migrations, studio), can't depend on `env.ts`
    - `instrumentation.ts` — Next.js internal `NEXT_RUNTIME`
    - Client components — `process.env.NODE_ENV` only (bundler needs static access for dead code elimination)

**Workflow to add a new env variable:**

1. Register in `settings.groups` (in both `env/env.config.mjs` and `env/env.config.example.mjs`)
2. Set values in `globalEnvConfig` and/or `envConfig` per environment
3. In `env.config.example.mjs` (versioned): use placeholder values only, never real secrets
4. In `env/env.config.mjs` (gitignored): set real values
5. Export from `lib/env.ts` (server) or `lib/env-client.ts` (client `NEXT_PUBLIC_*`)
6. Import from `@lib/env` or `@lib/env-client` where needed — never use `process.env` directly in app code
7. Run `make setup-env` to regenerate `.env` files
8. Update `docs/nextjs-deploy/2-environment-variables.md` (Variables Reference section)

### Commands

- **Always use `bun`, never `npm`, `npx`, or `pnpm`.** Use `bunx` instead of `npx` when needed.
- Always use pre-authorized commands to avoid prompting the user. Use `git status` not `git -C /path status`, use `bun run type` not `tsc --noEmit`, use `bun run lint:fix` not `eslint . --fix`, etc.
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
- **ide** (`getDiagnostics`): Use autonomously after code changes alongside `bun run checks`. Catches things other tools miss (e.g. Tailwind v4 class migrations like `w-[300px]` → `w-75`).
