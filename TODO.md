# TODO

## Inplement

- Gestion variables d'environnements
    - Infisical

- Analytics & Performance tracking
    - Umami
    - Plausible

- Logs & Error tracking
    - Glitchtip
    - SigNoz

- Cloudflare R2 (stockage images + backup VPS + backup DATABASES)

- Redis cache

## Environment variables generator

- Refactor
- Add {generation-date} in header

## Authentification béton

- Captcha
- Vérification faux emails
- Provider OAuth (Google, Apple, Microsoft, GitHub, etc)
- Confirmation Email obligatoire
- Double auth (OTP, WebAuthn, passwordless, etc)

## Security

- OWASP
- CNIL
- RGPD
- ANSSI
- Cookies banner

- Mentions légales
- RGPD
- Conditions générales d'utilisation
- Politique de confidentialité
- Politique de cookies

## Clean code

- Lien de confirmation adresse email en localhost ?

- Design et Layouts
- Atoms, Molecules, Organisms
- Skeletons

- Supprimer les résidus de Shadcn -> ex: "-muted", "-border", etc

- Centraliser les styles

- useOtimistic et mutations
- useQuery et filtres

- useForm et formulaires

- Organisation des fichiers
- Tester toutes les pages, faire un plan

## Feature

- Si redirection pour loging -> redirection après login vers la page initiale

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
