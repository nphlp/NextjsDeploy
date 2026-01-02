# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Application de gestion du temps de travail et d'équipes. Next.js 16 (canary) avec App Router, Cache Components, TypeScript strict, Prisma/PostgreSQL, et ORPC.

## Quick Commands

```bash
# Développement
make dev                    # Dev server (Next.js terminal + Postgres Docker)
make start                  # Build + start (terminal + Postgres Docker)
make basic                  # Production-like (tout en Docker)

# Vérifications
pnpm checks                 # Type check + lint fix + format fix
pnpm test:run               # Tests unitaires
pnpm test:watch             # Tests en watch mode
pnpm test:coverage          # Coverage report

# Base de données
pnpm prisma:migrate         # Créer une migration
pnpm prisma:deploy          # Appliquer les migrations
pnpm prisma:studio          # Interface web (localhost:5555)
pnpm fixtures:setup         # Données de test

# Génération
pnpm solid:all              # Générer tous les services
```

## Architecture

### Structure des dossiers

```
app/                    # Routes Next.js (App Router)
├── (auth)/            # Routes protégées (groupe)
├── api/               # Endpoints API
api/                    # Couche API (ORPC)
├── {module}/          # basket/, fruit/, task/, user/
│   ├── *-query.ts     # Lectures
│   ├── *-mutation.ts  # Écritures
│   ├── *-action.ts    # Server actions
│   ├── *-schema.ts    # Schémas Zod
│   └── *-cached.ts    # Queries avec cache
├── router.ts          # Router principal
├── cache.ts           # Configuration cache
└── permission.ts      # Vérification permissions
services/               # Code généré depuis ORPC
├── actions/           # Server actions wrapper
├── cached/            # Fonctions de cache
└── types/             # Types TypeScript
components/             # Composants React (Atomic Design)
├── atoms/             # Composants de base
├── molecules/         # Compositions simples
└── organisms/         # Compositions complexes
core/                   # Layout et theme
lib/                    # Utilitaires (auth, prisma, zustand, orpc)
prisma/                 # Schema et migrations
```

### Path Aliases

- `@atoms/*`, `@molecules/*`, `@organisms/*` - Composants
- `@orpc/*` - Couche API (dossier `api/`)
- `@services/*` - Services générés
- `@lib/*` - Utilitaires
- `@core/*` - Layout/theme
- `@/*` - Racine du projet

### Stack Technique

- **Framework**: Next.js 16 (canary) avec Turbopack, Cache Components (`"use cache"`)
- **API**: ORPC (type-safe RPC)
- **DB**: Prisma 7 + PostgreSQL
- **State**: Zustand (avec persistence cookies)
- **Auth**: Better Auth
- **UI**: Base UI + Tailwind CSS 4
- **Forms**: React Hook Form + Zod 4
- **Tests**: Vitest

### Patterns Importants

**Cache Components (Next.js 16)**

```tsx
"use cache";
import { cacheLife, cacheTag } from "next/cache";
```

**ORPC API**

- Queries: `api/{module}/{module}-query.ts`
- Mutations: `api/{module}/{module}-mutation.ts`
- Schémas: `api/{module}/{module}-schema.ts`

## Git Workflow

- **main**: Production (lead dev uniquement)
- **test**: Intégration
- **{dev}/{issue}**: Features (ex: `johndoe/eco-25`)
- Commits: `feat: description` ou `fix: description`
- Toujours rebase, jamais merge

## Fixtures de Test

| Email                | Password      | Role     |
| -------------------- | ------------- | -------- |
| employee@example.com | Password1234! | Employee |
| manager@example.com  | Password1234! | Manager  |
| admin@example.com    | Password1234! | Admin    |
