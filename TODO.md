# TODO

## Bugs

## Enhancements

- [x] Changement d'email, gérer les emails :
    - [x] Envoyer un mail à l'ancien email "Notif de process en cours" + "Lien contact support"
    - [x] Envoyer un mail au nouvel email "Lien de confirmation"
    - [x] Après confirmation, envoyer un mail à l'ancien "Notif email modifié" + "Lien contact support"
    - [x] Après confirmation, envoyer un mail au nouvel email "Notif email modifié avec succès"
    - [x] Envoyer un mail de notification si l'utilisateur annule le changement d'email dans son profil

- Nouvelle table "Activity History" :
    - Champs :
        - Type d'activité (connexion, email, mot de passe, 2FA, etc.)
        - Date de l'activité
        - Date de suppression programmée" (90 jours)
    - Garder un historique des changements :
        - Email "ancien -> nouveau email"
        - Mot de passe
        - 2 facteurs (T-OTP, Passkey, etc.)

- Système de CRON / JOBS
    - Nettoyage hebdomadaire des entrées "périmées" de la table "User Security History"
    - Gérer avec Dokploy directement ? Ou service self-hosted comme Inngest ou Trigger.dev ?

- [x] "Email de notification" + "Lien contact support" pour les changements sensibles :
    - [x] Changement d'email demandé
        - [x] Ancien email : "Notif de process en cours" + "Lien contact support"
        - [x] Nouvel email : "Lien de confirmation"
    - [x] Changement d'email confirmé
        - [x] Ancien email : "Notif email modifié" + "Lien contact support"
        - [x] Nouvel email : "Notif email modifié avec succès"
    - [x] Changement d'email annulé
        - [x] Ancien email : "Notif email annulé" + "Lien contact support"
    - [x] Changement de mot de passe
    - [x] Activer/Désactiver T-OTP
    - [x] Ajouter/Supprimer Passkey

- [ ] Déconnexion des sessions de tous les autres appareils (sauf session courante) après un :
    - [ ] Changement d'email - `revokeOtherSessions` n'existe pas dans `changeEmail`
    - [x] Changement de mot de passe — `revokeOtherSessions: true` dans `changePassword`

- [x] Page support (dispo dans le footer)
    - [x] Formulaire de contact
    - [x] Select avec sujet (query params pour pré-sélectionner le sujet) :
        - [x] Proposer une amélioration
        - [x] Signaler un bug
        - [x] Problème de sécurité (email, mdp, etc.)
        - [x] Autre
    - [x] Text area pour expliquer
    - [x] Bouton "Envoyer"
    - [x] Envoi d'un email au email de support du site
    - [x] Envoi d'un email de confirmation à l'expéditeur

## Features

- Page Profil :
    - Afficher l'historique des activités (ex: "Connexion le ...", "Changement de mot de passe le ...", etc.)
    - Afficher un Popover qui explique (ex: "Ces informations sont conservées pour des raisons légales et de sécurité. Elles seront automatiquement supprimées après 90 jours.")
    - Télécharger mes données (RGPD)
    - Supprimer mon compte et mes données (RGPD)

- Sécurité :
    - Email de récupération ? Comme Google
    - OAuth providers (Google, Apple, Microsoft, GitHub, etc.)

- Last login method (plugin Better Auth `lastLoginMethod`)

- Page légales et obligatoires
    - Mentions légales (Editeur, hébergeur, contact, etc. Je dois donner mes info personnelles ? J'aime pas ça...)
    - Page politique de confidentialité (RGPD, cookies, type de données collectées, durée de conservation, etc.)
    - Autre ?

- useOptimistic et mutations

## PR Better Auth

- [ ] Ajouter une option `revokeOtherSessions` dans `changeEmail`
- [ ] Le hook `before` ne se déclenche pas pour les endpoints GET (`/verify-email`) — les hooks devraient couvrir tous les endpoints

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
