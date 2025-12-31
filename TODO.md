# TODO

## Clean code

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

## Redis cache handler

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
