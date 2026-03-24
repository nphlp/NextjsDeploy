# TODO

## Bugs

## Features

- Changement d'email (API native Better Auth `changeEmail`)
- OAuth providers (Google, Apple, Microsoft, GitHub, etc.)
- useOptimistic et mutations
- Last login method (plugin Better Auth `lastLoginMethod`)

## Implement

- Migration de Makefile à Just

- Passer de Compose à Swarm (objectif: zero-downtime deploy)
    - Build Docker image
    - Push image to registry
    - Semantic Release (create version tag + changelog + GitHub Release)
    - Deploy to Dokploy

- Redis cache

- Gestion variables d'environnements
    - Infisical

- Logs & Error tracking
    - Glitchtip
    - SigNoz

## Tests automatisés

- Unitaires
  -> Tester une fonction isolée
  -> Mockings des fonctions appelées

- Intégration
  -> Tester une fonction avec ses dépendances
  -> Mockings des appels API interne, database, etc.

- Fonctionnels
  -> Tester de fonctionnalité complète
  -> Mockings des **API externes** uniquement

- E2E
  -> Tester une fonctionnalité dans un environnement navigateur
  -> Pas de mockings, clics réels, etc.

- Coverage
  -> Suivi des fonctionnalités testées
  -> Pourcentage par type de tests
  -> Pourcentage global
