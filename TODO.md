# TODO

## Portainer

- [ ] Error build

```
#15 [builder 3/3] RUN pnpm build
#15 0.258
#15 0.258 > nextjs-deploy@0.1.0 build /app
#15 0.258 > next build --turbopack
#15 0.258
#15 0.555 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#15 0.555 This information is used to shape Next.js' roadmap and prioritize features.
#15 0.555 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#15 0.555 https://nextjs.org/telemetry
#15 0.555
#15 0.567    ▲ Next.js 15.6.0-canary.16 (Turbopack)
#15 0.567    - Environments: .env
#15 0.567    - Experiments (use with caution):
#15 0.567      ✓ authInterrupts
#15 0.567      ✓ turbopackPersistentCaching
#15 0.567      ✓ useCache
#15 0.567      ✓ viewTransition
#15 0.567
#15 0.583    Creating an optimized production build ...
#15 29.53  ✓ Finished writing to disk in 12ms
#15 29.57  ✓ Compiled successfully in 28.8s
#15 29.57    Linting and checking validity of types ...
#15 32.86  ✓ Finished writing to persistent cache in 3.3s
#15 33.29    Collecting page data ...
#15 33.52    Generating static pages (0/6) ...
#15 33.70    Generating static pages (1/6)
#15 33.73    Generating static pages (2/6)
#15 33.76    Generating static pages (4/6)
#15 33.78 Promise {
#15 33.78   <rejected> Error: Something went wrong...
#15 33.78       at s.error (.next/server/chunks/ssr/_f093202a._.js:155:11266)
#15 33.78       at s.findMany (.next/server/chunks/ssr/_f093202a._.js:155:11146)
#15 33.78       at async (.next/server/chunks/ssr/_f093202a._.js:155:12354)
#15 33.78 }
#15 33.78 Error: Something went wrong...
#15 33.78     at s.error (.next/server/chunks/ssr/_f093202a._.js:155:11266)
#15 33.78     at s.findMany (.next/server/chunks/ssr/_f093202a._.js:155:11146)
#15 33.78     at async (.next/server/chunks/ssr/_f093202a._.js:155:12354)
#15 33.78  ✓ Generating static pages (6/6)
#15 33.79    Finalizing page optimization ...
#15 33.89
#15 33.89 Route (app)                         Size  First Load JS
#15 33.89 ┌ ƒ /                            4.86 kB         208 kB
#15 33.89 ├ ƒ /_not-found                      0 B         203 kB
#15 33.89 ├ ƒ /api/health                      0 B            0 B
#15 33.89 ├ ƒ /api/internal/[...routes]        0 B            0 B
#15 33.89 └ ○ /robots.txt                      0 B            0 B
#15 33.89 + First Load JS shared by all     128 kB
#15 33.89   ├ chunks/0628b813a103ac26.js   72.4 kB
#15 33.89   ├ chunks/23c6429438f385ae.js   17.3 kB
#15 33.89   ├ chunks/a4ab059c2f824ca5.js   12.9 kB
#15 33.89   ├ chunks/ccbb94ba9198e47e.js     13 kB
#15 33.89   └ other shared chunks (total)  12.7 kB
#15 33.89
#15 33.89
#15 33.89 ○  (Static)   prerendered as static content
#15 33.89 ƒ  (Dynamic)  server-rendered on demand
#15 33.89
#15 DONE 34.4s
```

- [ ] Script SSL
    - Argument certs directory : `/certs`
    - Argument certs CN domain : `mysql-preview`
    - Ajouter le type de permission

- [ ] Re-tester le Dockerfile en local

- [ ] Certificats HTTPS non fonctionnels/intermittents pour `nansp.dev` mais toujours valide pour les sous-domaines

- [ ] Documenter le setup
    - Attention le webhook de déploiement github ne refraichis pas le cache des images docker -> lors d'une mise à jour du Dockerfile ou Compose -> il faut "Pull and redeploy" sur Portainer pour être sûr de re-builder l'image

- [ ] Nextjs Build Cache
    - Redis enfin fonctionnel avec useCache ?
    - Un service build (runtime) et un service production (runtime) ?

- [ ] Revoir les scripts

- [ ] Webhook de déploiement git "without cache" ? Forcer le rebuild de l'image ?

## Caching

- [ ] Build Cache
- [ ] ISR Cache -> Redis

## Baser le Select sur un vrai select !

## Frontend

- [ ] Components
    - Select -> Baser sur le <select> natif -> "onSelectChange" et le fallback dropdown natif
    - Combobox -> Dégager Headless UI
    - Adapter les composants au dark mode
    - Fournir les props natives en "nativeProps"
    - Pilotage des radius, shadows, borders dans le thème

- [ ] Skeleton
    - Créer des composants Skeletons

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
