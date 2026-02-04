# Environment Variables

## Generation

Environment files are generated from `env/env.config.ts`.

On first run of `make dev`, `make start` or `make basic`:

```
✅ Created env/env.config.ts from example
📝 Please edit env/env.config.ts with your values, then run the command again.
```

Edit `env/env.config.ts` with your values, then run the command again.

Generated files:

| File                  | Environment         |
| --------------------- | ------------------- |
| `.env`                | Local development   |
| `env/.env.basic`      | Local containerized |
| `env/.env.experiment` | VPS experiment      |
| `env/.env.preview`    | VPS preview         |
| `env/.env.production` | VPS production      |

## Environnement local

1. Local

Envrionnement de développement local optimisé pour le hot-reload.
Pour le développement et les tests en local.

Lancement avec `make dev` ou `make start` en utilisant le `.env`.
Le server `nextjs` tourne dans le terminal et les autres services à partir du `compose.postgres.yml`.

2. Basic

Environnement entièrement conteneurisé au plus proche de la production.
Pour les tests de fonctionnement en local.

Lancement avec `make basic` en utilisant le `.env.basic`.
Le server `nextjs` et les autres services tournent à partir du `compose.basic.yml`.

## Envrionnement serveur

Environnement d'expérimentation, preview et production en ligne.
Le déploiement ce fait sur le VPS via `Dokploy`.

1. Experiment (testing)
2. Preview (staging)
3. Production

Services conteneurisés par `compose.dokploy.yml`.
Ils utilisent respectivement `.env.experiment`, `.env.preview` et `.env.production`.

## Variables d'environnement

1. `REACT_EDITOR`

Used by Nextjs for debug redirection links.
Utile que en développement local.

```env
REACT_EDITOR=code
```

2. `NODE_ENV`

Used by Nextjs to know the environment.

```env
NODE_ENV=development
NODE_ENV=production
```

3. `NEXTJS_STANDALONE`

Enable Nextjs standalone mode for production builds.
Used in `next.config.js` and `Dockerfile`.
Utilise que dans les environnements où Nextjs est conteneurisé.

```env
NEXTJS_STANDALONE=true
```

4. `NEXT_PUBLIC_BASE_URL`

Base URL of the application.

```env
# Domaine de développement local
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Domaine de expérimentation, preveiw et production
NEXT_PUBLIC_BASE_URL=https://experiment.nextjs-deploy.domain.com
NEXT_PUBLIC_BASE_URL=https://preview.nextjs-deploy.domain.com
NEXT_PUBLIC_BASE_URL=https://nextjs-deploy.domain.com

# Domaine de production
NEXT_PUBLIC_BASE_URL=https://nextjs-deploy.com
```

5. `ENV_LABEL`

Label to identify the environment between `dev`, `basic`, `experiment`, `preview` and `production`.

```env
ENV_LABEL=dev-nextjs-deploy
ENV_LABEL=basic-nextjs-deploy
ENV_LABEL=experiment-nextjs-deploy
ENV_LABEL=preview-nextjs-deploy
ENV_LABEL=nextjs-deploy
```

6. `VPS_NEXTJS_DOMAIN`

Deployement url domain for Nextjs application.

```env
VPS_NEXTJS_DOMAIN=nextjs-deploy.com
VPS_NEXTJS_DOMAIN=nextjs-deploy.domain.com
VPS_NEXTJS_DOMAIN=preview.nextjs-deploy.domain.com
```

7. `VPS_PRISMA_STUDIO_DOMAIN`

Subdomain used for the VPS deployment.

```env
VPS_PRISMA_STUDIO_DOMAIN=prisma-studio.experiment.nextjs-deploy
VPS_PRISMA_STUDIO_DOMAIN=prisma-studio.preview.nextjs-deploy
VPS_PRISMA_STUDIO_DOMAIN=prisma-studio.production.nextjs-deploy
```

8. `PRISMA_STUDIO_AUTH`

Authentification de protection de Prisma Studio si exposé publiquement par erreur.
Prisma Studio est censé n'être accessible que via Tailscale VPN.

Generate a hashed password with the following command:

```bash
htpasswd -nbB admin your-password-here
# Output: admin:$2y$05$GrpLf8CHuA9xwZPy.TgxteeAY.sFg9rIoQRw0jCuOdojLBvHLC18C
```

Then double the dollar signs (`$`) to prevent issues un `compose.yml`:

```env
# Login: `admin`
# Password: `your-password-here`
PRISMA_STUDIO_AUTH=admin:$$2y$$05$$GrpLf8CHuA9xwZPy.TgxteeAY.sFg9rIoQRw0jCuOdojLBvHLC18C
```

9. `POSTGRES_HOST`

PostgreSQL database host.

```env
POSTGRES_HOST=localhost
POSTGRES_HOST=postgres-dev-nextjs-deploy
POSTGRES_HOST=postgres-preview-nextjs-deploy
```

10. `POSTGRES_PORT`

PostgreSQL database port.

```env
POSTGRES_PORT=5432
POSTGRES_PORT=5433
```

11. `POSTGRES_DB`

PostgreSQL database name.

```env
POSTGRES_DB=nextjs-deploy-db
```

12. `POSTGRES_PASSWORD`

PostgreSQL database password.

```env
# Development
POSTGRES_PASSWORD=nextjs-deploy-password

# Production (generate with: openssl rand -base64 32)
POSTGRES_PASSWORD=EA60aaSwYrLZ5AHsh0BdNxxbeQi6NWVefHTtWbMe3I8=
```

13. `DATABASE_URL`

Prisma database connection string. Built from PostgreSQL variables using template.

```env
DATABASE_URL=postgres://postgres:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}
```

14. `BETTER_AUTH_SECRET`

Session encryption key for Better Auth.

```env
# Development
BETTER_AUTH_SECRET=better-auth-session-encryption-key

# Production (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=7wcUrMv3wVx4SbtKtUMTzcl28w7fjVnsE9sGWkTffuM=
```

15. `NGROK_URL`

Static ngrok domain for tunnelling local development server.

```env
NGROK_URL=my-static-url.ngrok-free.app
```

16. `SMTP_HOST`

SMTP server host.

```env
SMTP_HOST=smtp.provider.com
SMTP_HOST=smtp.hostinger.com
```

17. `SMTP_PORT`

SMTP server port.

```env
SMTP_PORT=465
SMTP_PORT=587
```

18. `SMTP_USER`

SMTP username for authentication.

```env
SMTP_USER=hello@domain.com
```

19. `SMTP_PASSWORD`

SMTP password for authentication.

```env
SMTP_PASSWORD=my-smtp-password
```

20. `SMTP_FROM`

Sender email address.

```env
SMTP_FROM=hello@domain.com
```

21. `SMTP_FROM_NAME`

Sender display name.

```env
SMTP_FROM_NAME="My App"
SMTP_FROM_NAME="My App (dev)"
SMTP_FROM_NAME="My App (preview)"
```
