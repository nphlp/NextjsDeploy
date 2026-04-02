# TODO

## Bugs

## Enhancements

- [ ] Variable env "FIRST_ADMIN_PASSWORD=Password1234!"
    - Pour toujours créer le `Password1234!` en développement local, même avec NODE_ENV=production
    - Pour générer un mot de passe aléatoire en vériable production quand la variable est absente (et l'afficher dans les logs au démarrage)

- [ ] Les pages de success avec bouton pour ouvrir le emails pourrait ouvrir l'application sur mobile ? Comme le fait Google, avec un deep link vers Gmail, Outlook, etc. (ex: `googlegmail://`, `ms-outlook://`, etc.)

- [ ] Finir le plan d'audit de sécurité (Phase 3) — voir `docs/security/audit-plan.md`

- [ ] Ouvrir les PR Better Auth upstream (feat/lifecycle-hooks + feat/change-email-native + docs/lifecycle-callbacks)

- [ ] Tester TOUS les emails (16 types) — vérifier que chaque email arrive avec le bon sujet/contenu
    - verification, reset, magic-link, magic-link-no-account
    - existing-account
    - password-changed (reset + profile)
    - change-requested, change-completed, change-success, change-canceled
    - totp-enabled, totp-disabled
    - passkey-added, passkey-deleted
    - contact-confirmation

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
