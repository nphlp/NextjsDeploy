# TODO

## Bugs

- Bug en navigation vers la page /profile

```
## Error Type
Console Error

## Error Message
Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client. Consider using template tag instead (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).


    at script (<anonymous>:null:null)
    at Indicator (components/atoms/tabs/atoms.tsx:117:9)
    at ProfileTabs (app/(auth)/profile/_components/profile-tabs.tsx:32:17)
    at Page (app/(auth)/profile/page.tsx:25:13)

## Code Frame
  115 |
  116 |     return (
> 117 |         <TabsBaseUI.Indicator
      |         ^
  118 |             renderBeforeHydration
  119 |             className={cn(
  120 |                 // Layout

Next.js version: 16.2.1-canary.5 (Turbopack)
```

- @better-auth/passkey en dev deps ?
- Retirer le handler email enumeration, puisque ma PR de fix a été mergé dans Better Auth
    - Voir app/api/auth/[...all]/route.ts
    - Voir lib/auth.ts

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
