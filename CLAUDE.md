# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 boilerplate configured for deployment with Dokploy, featuring authentication (Better Auth), database management (Prisma + PostgreSQL), and automated code generation. The project uses a service-oriented architecture with generated CRUD operations.

## Development Commands

### Quick Start

- `make dev` - Start development server (Next.js + PostgreSQL in Docker)
- `make start` - Build and start local production server
- `make basic` - Start fully containerized environment (Next.js + PostgreSQL)
- `pnpm auto` - Install deps, setup DB, generate Prisma client, run migrations, load fixtures, start dev server

### Database Management

- `pnpm db:setup` - Create database if not exists
- `pnpm db:reset` - Drop database
- `pnpm db:reload` - Drop and recreate database
- `pnpm prisma:generate` - Generate Prisma client (output: `prisma/client/`)
- `pnpm prisma:migrate` - Create new migration
- `pnpm prisma:deploy` - Apply migrations without prompts

### Fixtures (Test Data)

- `pnpm fixtures:setup` - Load test data into database
- `pnpm fixtures:reset` - Clear all data
- `pnpm fixtures:reload` - Reset and reload fixtures
- Fixture data defined in `fixtures/*.ts`

### Code Generation

The project uses automated code generation based on Prisma schema:

- `pnpm generate:list` - List all models in Prisma schema
- `pnpm generate:all` - Generate CRUD services for all models
- `pnpm generate:clear` - Remove all generated files

Generated files are created in `services/` directory with this structure:

- `services/actions/` - Server actions for data mutations
- `services/api/` - API endpoints
- `services/cached/` - Cached data fetchers
- `services/class/` - Service classes
- `services/server/` - Server-only utilities

Templates located in `templates/services/` and `templates/app/`

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm format` - Check Prettier formatting
- `pnpm format:fix` - Auto-format with Prettier
- `pnpm type` - TypeScript type checking
- `pnpm checks` - Run all checks (lint + format + type)
- `pnpm build:analyze` - Analyze bundle size

## Architecture

### Directory Structure

- `app/` - Next.js App Router pages and layouts
    - `(auth)/` - Auth-related pages (login, register, profile, reset-password)
    - `task/[id]/` - Task detail pages
    - `examples/` - Component examples and demos
- `actions/` - Server actions exposed to client components
- `services/` - Generated backend services (5 layers: actions, api, cached, class, server)
- `lib/` - Shared utilities and configurations
    - `auth.ts` - Better Auth configuration with Prisma adapter
    - `prisma.ts` - Prisma client singleton
    - `zustandCookieStorage.ts` / `zustandServer.ts` - Zustand state management helpers
- `components/` - React components organized by category
    - `CORE/` - Core layout components (Header, Footer, theme)
    - `SHARED/` - Shared reusable components
    - `UI/` - UI utilities (Breakpoints, ArrowToTop)
- `utils/` - Generic utilities (Fetch wrappers, string helpers)
- `scripts/` - Development and build scripts
- `prisma/` - Database schema and migrations
- `fixtures/` - Test data definitions
- `templates/` - Code generation templates using Handlebars

### Database Layer

- Uses Prisma ORM with PostgreSQL
- Custom client output directory: `prisma/client/`
- Models include: User, Session, Account, Verification, Task
- Uses `nanoid()` for IDs instead of auto-increment

### Authentication

- Powered by Better Auth library
- Email/password authentication with email verification
- Custom session extension with user role and lastname
- Session expires in 24 hours, updates every 20 minutes
- Verification emails sent via `SendEmailAction`

### State Management

- Zustand for client state
- Custom cookie-based persistence via `zustandCookieStorage.ts`
- Server-side state hydration via `zustandServer.ts`

### Styling

- Tailwind CSS 4.x with PostCSS
- Custom theme system with dark mode support (via `components/CORE/theme/`)
- Geist fonts (Sans & Mono)
- Motion library for animations
- Utility functions: `combo()` (className merger), `mergeStyles()` (Tailwind merge)

## Deployment

### Environment Configuration

The project uses a layered environment system:

- `.env` - Base configuration (created from `env/.env.example`)
- `env/.env.override.basic` - Local containerized overrides
- `env/.env.override.preview` - Preview/staging overrides
- `env/.env.override.production` - Production overrides

Merge commands:

- `make merge-env-basic` - Generates `.env.basic`
- `make merge-env-preview` - Generates `.env.preview`
- `make merge-env-production` - Generates `.env.production`

### Dokploy Deployment

- Uses GitHub Actions for CI/CD (`.github/workflows/deploy.yml`)
- Automatic deployment on push to `main` (production) or `test` (preview)
- Pipeline: commit lint → code quality checks (lint, format, type) → deploy
- Dokploy compose files: different configs per environment
- Requires GitHub secrets: `DOKPLOY_VPS_URL`, `DOKPLOY_API_TOKEN`, `DOKPLOY_COMPOSE_ID_*`

See `docs/dokploy-deployment.md` for detailed deployment instructions.

### Docker

- `docker/compose.postgres.yml` - Standalone PostgreSQL
- `docker/compose.basic.yml` - Full stack (Next.js + PostgreSQL)
- Supports SSL certificates (stored in `certs/`)

## Important Patterns

### Generated Code Convention

When Prisma schema changes, regenerate services:

1. Update `prisma/schema.prisma`
2. Run `pnpm prisma:migrate` to create migration
3. Run `pnpm generate:all` to regenerate CRUD services
4. Generated files follow naming: `{ModelName}Action.ts`, `{ModelName}Api.ts`, etc.

### Import Aliases

- `@/` - Root directory
- `@lib/` - `lib/` directory
- `@actions/` - `actions/` directory (exposed server actions)
- `@comps/` - `components/` directory

### Server-Only Code

- Use `server-only` package for server-exclusive code
- Auth session helpers in `lib/authServer.ts` are server-only

### Ngrok Support

- `make ngrok` - Tunnel local server for mobile/external testing
- Requires `NGROK_URL` in `.env`
- Start dev server first with `NEXT_PUBLIC_BASE_URL=$(NGROK_URL) make dev`

## Git Workflow

- Husky pre-commit hooks enforce linting and formatting
- Commitlint enforces conventional commits
- Semantic Release can be enabled for automatic versioning (currently commented out)
- Protected environments require manual approval for production deploys

Refer to `docs/git-guide.md` for detailed Git workflow.
