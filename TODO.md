# TODO

## Refactor

- [ ] Faire un `new ActionError()` qui gère les messages d'erreurs
- [ ] API Routes -> tRPC ou oRPC
- [ ] Ajouter des tests pour les erreurs

## Testing

- [ ] Vitest
- [ ] Playwright

## Caching

- [ ] Build Cache
- [ ] ISR Cache -> Redis
- [ ] https://github.com/vercel/next.js/issues/82993

## Baser le Select sur un vrai select !

## Frontend

- [ ] Components
    - Select -> Baser sur le <select> natif -> "onSelectChange" et le fallback dropdown natif
    - Combobox -> Dégager Headless UI
    - Adapter les composants au dark mode
    - Fournir les props natives en "nativeProps"
    - Pilotage des radius, shadows, borders dans le thème

- [ ] View Transition
    - Ajouter les View Transitions pour les changements de pages

## Accessibility

- [ ] Tester un lecteur d'écran
- [ ] Ajouter des attributs ARIA et semantiques HTML
- [ ] Vérifier la navigation au clavier
- [ ] Vérifier le contraste des couleurs
- [ ] Désactiver les animations
- [ ] Scrolling fonctionnel avec doigt, pavé tactile, molette, barre de défilement

## Rendering

- [ ] SSR
- [ ] SSG
- [ ] ISR

## Auth

- [ ] Better Auth
- [ ] Auth page
- [ ] Email service
- [ ] Password reset
- [ ] 2FA & OTP

## Permissions

- [ ] Permission system
- [ ] Middleware
- [ ] Template Action to restore

## Tests

- [] Unitaire
- [] Intégration
- [] Fonctionnel
- [] E2E (Playwright)

- [] Test Coverage et Static Analysis
- [] Sentry (reporting et logging)

- [] SonarQube -> Analyse de la qualité et sécurité du code
- [] Dependabot -> Mettre à jour les dépendances en toute sécurité
- [] Dependency Track -> Tracker les vulnérabilités de sécurité dans les dépendances

## Référencement

- [] Lighthouse
- [] Google Search Console
- [] PageSpeed Insights
- [] GTmetrix
- [] WebPageTest
- [] Etc.

- Redis Cache
