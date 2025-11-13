# TODO

## Redis cache handler

## Exemples à créer

Créer des exemples avec du sens.

### Layout examples

- Auto center or start content
- Suspense, skeletons, loaders, empty states
- Dashboard and sidebar

### Caching

- "use cache"
- "use cache: remote"
- "use cache: private

### SSR Example

- SSR (take 10) + useState + Toggle (show 3 or 10 items)
  -> Fecth 10 server
  -> Hydrate useState
  -> ⨯ Perd le state au refresh

- SSR (take 3) + useFetch + Toggle (take 3 or 10 items)
  -> Fetch 3 server, puis foetch 10 client
  -> Hydrate useFetch initialData
  -> ⨯ Perd le state au refresh

- SearchParams SSR + useFetch + useQuery (take 3 or 10 items)
  -> Parse SearchParams côté server
  -> Fetch 3 ou 10 server, puis fetch 3 ou 10 client
  -> Hydrate useFetch initialData
  -> ✔︎ Garde le state au refresh

### UseQuery Examples

- useQuery seul
- useQuery server
- useQuery centralisé

### Optimistic Mutations

- Single
  -> Add
  -> Update
  -> Delete

- Array
  -> Add
  -> Update
  -> Delete

- Hybrid
  -> Add
  -> Update
  -> Delete

### Context

- Basic context
    1. Une page server
    2. Un provider context
    3. Plusieurs composants server

- Advanced context
    1.  - features ci-dessus

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
