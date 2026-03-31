# TODO

## Bugs

## Enhancements

- [ ] Les pages de success avec bouton pour ouvrir le emails pourrait ouvrir l'application sur mobile ? Comme le fait Google, avec un deep link vers Gmail, Outlook, etc. (ex: `googlegmail://`, `ms-outlook://`, etc.)

- [ ] Finir le plan d'audit de sécurité (Phase 3) — voir `docs/security/audit-plan.md`

## Features

- Page Profil :
    - Télécharger mes données (RGPD)
    - Supprimer mon compte et mes données (RGPD)

- Sécurité :
    - Email de récupération ? Comme Google
    - OAuth providers (Google, Apple, Microsoft, GitHub, etc.)

- Last login method (plugin Better Auth `lastLoginMethod`)

- Pages légales et obligatoires — voir `docs/security/audit-plan.md` (Phase 3)
    - Mentions légales
    - Politique de confidentialité (RGPD)
    - Politique de cookies
    - Cookie banner

- useOptimistic et mutations

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
