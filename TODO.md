# TODO

## Retour d'Alexis

- Gestionnaire mot de passe

Lors d'un changement de mdp (depuis Chrome), le gestionnaire de mpd Google enregistre uniquement le mdp sans proposer de nom d'utilisateur, ce qui implique qu'on doit réécrime manuellement notre email. Peut-être faire en sorte que l'email soit aussi inscrit ? Ca se fait peut-être avec un champ email caché ?

## Bugs

- Création 2FA mobile : pouvoir coller le TOTP + pouvoir copier les codes de récupération en un clic.

- Il se passe quoi si je me connecte sans avoir confirmé email ?
  Erreur ? Redirection pas de succes ?

- Insertion Proton Pass qui ne déclenche pas les useEffect -> insertion invisible avant un onFocus ou autre

- Mettre à jour .env Dokploy (SMTP, etc)
- First admin en prod ?
- Callback de redirection après login

## Authentification béton

- Captcha
- Vérification faux emails
- Provider OAuth (Google, Apple, Microsoft, GitHub, etc)
- Confirmation Email obligatoire
- Double auth (OTP, WebAuthn, passwordless, etc)
- Meilleurs emails envoyés au clients

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
-

## Inplement

- useForm : auto reset when usePathname changes

- Just pour remplacer Makefile
- Mailpit local

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

## Améliorations

- Documenter useForm
- Améliorer les emails, meilleurs UI
- Passer à BUN

## Environment variables generator

- Refactor
- Add {generation-date} in header

## Pipeline

- Build Docker image
- Push image to registry
- Semantic Release (create version tag + changelog + GitHub Release)
- Deploy to Dokploy

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

- Mettre en place un système de logging (Sentry, Glitchtip, etc)

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
