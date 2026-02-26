# TODO

## Retour d'Alexis

- Changement de mdp (depuis Chrome)
  Le gestionnaire de mpd Google enregistre uniquement le mdp sans proposer de nom d'utilisateur, ce qui implique qu'on doit réécrime manuellement notre email.
  Peut-être faire en sorte que l'email soit aussi inscrit ? Ca se fait peut-être avec un champ email caché ?

## Bugs

- Si 2FA commencée, pouvoir "annuler" -> supprimer le cookie

- Il se passe quoi si je me connecte sans avoir confirmé email ?
  Erreur ? Redirection pas de succes ?

- First admin en prod ?

- Provider OAuth (Google, Apple, Microsoft, GitHub, etc)`

- Page des fruits : sur mobile, l'auto scroll n'arrive pas à remonter tout en haut

## Inplement

- Migration de PNPM à BUN
- Migration de Makefile à Just

- Passer de Compose à Swarm (objectif: zero-downtime deploy)
    - Build Docker image
    - Push image to registry
    - Semantic Release (create version tag + changelog + GitHub Release)
    - Deploy to Dokploy

- Redis cache

- Cloudflare R2 (stockage images + backup VPS + backup DATABASES)

- Gestion variables d'environnements
    - Infisical

- Analytics & Performance tracking
    - Umami
    - Plausible

- Logs & Error tracking
    - Glitchtip
    - SigNoz

- useOtimistic et mutations

- Mettre en place un système de logging (Sentry, Glitchtip, etc)

## Tests automatissé

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
  -> Tester une fonctionnalité dans un envrionnement navigateur
  -> Pas de mockings, clics réels, etc.

- Coverage
  -> Suivi des fonctionnalités testées
  -> Pourcentage par type de tests
  -> Pourcentage global
