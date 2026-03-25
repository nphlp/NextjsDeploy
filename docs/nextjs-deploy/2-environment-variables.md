[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Environment Variables**

[← Setup Local](./1-setup-local.md) | [Containerization →](./3-containerization.md)

---

# Environment Variables

This project runs across multiple environments: `dev` (local), `docker` (containerized), `experiment` (vps), `preview` (vps) and `production` (vps). **Each environment has its own set of environment variables.**

To simplify management and avoid errors, an **`.env` generation system** has been created.

- All variables are **centralized** in `env/env.config.mjs` (plain JS, zero dependencies).
- One command `make setup-env` generates all `.env` variants.
- VPS environment files are ready to be copy-pasted to Dokploy secrets.

Generated `.env` files:

- `.env` — at root, used for local development and build testing (`make dev`, `make start`)
- `env/.env.docker` — used for local containerized environment (`make docker`)
- `env/.env.experiment` — used for VPS experiment environment (Dokploy)
- `env/.env.preview` — used for VPS preview environment (Dokploy)
- `env/.env.production` — used for VPS production environment (Dokploy)

> All generated files are **not versioned** (gitignored).

## Usage

> [!WARNING]
> This guide explains how to manage environment variables
>
> - MAKE SURE to set your secrets in `env/env.config.mjs` (gitignored)
> - DO NOT edit generated `.env` files, they will be overwritten
> - DO NOT set your secrets in `env/env.config.example.mjs` (versioned) or you will leak them in git history

### First install

First time cloning the project: `env/env.config.mjs` doesn't exist yet. You need to generate it from the example, then fill in your values.

1. Generate the default `env/env.config.mjs`:

```bash
make setup-env
```

2. Search for `TO UPDATE` comments and replace placeholder values with your own (API keys, passwords, etc).
3. Run `make setup-env` again to generate all `.env` files from your configuration.
4. You're ready to develop!

> [!NOTE]
> `make dev`, `make start` and `make docker` all run `make setup-env` automatically before starting.

### Update an existing variable

1. Edit the value in `env/env.config.mjs`
2. Run `make setup-env` to regenerate all `.env` files

### Add a new variable

`env/env.config.mjs` exports a default object with three sections: `settings`, `globalEnvConfig` and `envConfig`.

**1. Register in `settings.groups`**

Add the variable to a group (or create a new one). Groups define the order and comments in generated files.

```js
settings: {
    groups: {
        myGroup: {
            comment: "My group description",
            variables: ["MY_VAR"],
        },
    },
}
```

**2. Set a default in `globalEnvConfig`** (optional)

Values here apply to all environments.

```js
globalEnvConfig: {
    myGroup: {
        MY_VAR: "default-value",
    },
}
```

**3. Override per environment in `envConfig`**

Each env can override `globalEnvConfig` values. Available conventions:

- **Direct value** — plain override: `MY_VAR: "value"`
- **`{{VAR}}` template** — reference other variables: `DATABASE_URL: "postgres://{{POSTGRES_HOST}}:{{POSTGRES_PORT}}"`
- **`"#KEY"` commented** — generates a commented-out line: `"#NGROK_URL": "my-domain.ngrok-free.app"`
- **`"#KEY"` array** — multiple commented alternatives: `"#MY_KEY": ["value-a", "value-b"]`
- **`EXCLUDE: [...]`** — omit variables not needed in this env: `EXCLUDE: ["UMAMI_URL"]`

```js
envConfig: {
    dev: {
        myGroup: {
            MY_VAR: "dev-override",
        },
        EXCLUDE: ["PROD_ONLY_VAR"],
    },
    production: {
        myGroup: {
            MY_VAR: "https://{{VPS_NEXTJS_DOMAIN}}/api",
        },
    },
}
```

## Variables Reference

### Node.js

- **`NODE_ENV`** — Node environment
    - `development` in dev
    - `production` in all others envs

### Next.js

- **`NEXTJS_STANDALONE`** — Enable standalone mode for Docker builds
    - `false` in dev
    - `true` in containerized envs
- **`NEXT_PUBLIC_BASE_URL`** — Public base URL of the app
    - `http://localhost:3000` in dev and docker
    - template `https://{{VPS_NEXTJS_DOMAIN}}` in VPS envs
- **`REACT_EDITOR`** — IDE used by Next.js error overlay links
    - `code` in dev only
    - excluded in all others envs

### Environment Label

- **`ENV_LABEL`** — Identifies the environment, used in templates
    - `dev-nextjs-deploy` in dev
    - `docker-nextjs-deploy` in docker
    - `experiment-nextjs-deploy` in experiment
    - `preview-nextjs-deploy` in preview
    - `nextjs-deploy` in prod

### VPS Domains

- **`VPS_NEXTJS_DOMAIN`** — Next.js app domain on VPS
    - `experiment.your-domain.com` in experiment
    - `preview.your-domain.com` in preview
    - `your-domain.com` in production
    - excluded in dev and docker envs
- **`VPS_PRISMA_STUDIO_DOMAIN`** — Prisma Studio subdomain
    - template `prisma-studio.{{VPS_NEXTJS_DOMAIN}}` in all VPS envs
    - excluded in dev and docker envs

### PostgreSQL

- **`POSTGRES_HOST`** — Database host
    - `localhost` in dev
    - `postgres-{ENV_LABEL}` in docker
    - from Dokploy standalone database "Internal Host" in VPS envs
- **`POSTGRES_PORT`** — Database port
    - `5433` in dev
    - `5432` in all others envs
- **`POSTGRES_DB`** — Database name
    - `nextjs-deploy-db` in all envs
- **`POSTGRES_PASSWORD`** — Database password
    - `nextjs-deploy-password` in dev and docker
    - generate for VPS with `openssl rand -base64 32`
- **`DATABASE_URL`** — Prisma connection string
    - template `postgres://{{POSTGRES_USER}}:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}` in all envs

### Authentication

- **`BETTER_AUTH_SECRET`** — Session encryption key for Better Auth
    - `better-auth-session-encryption-key` in dev and docker
    - generate for VPS with `openssl rand -base64 32`
- **`PRISMA_STUDIO_AUTH`** — Basic auth for Prisma Studio (Traefik middleware)
    - generate with `htpasswd -nbB admin your-password`, then double the `$` signs
    - safety net if Prisma Studio is accidentally exposed publicly. Should only be accessible via [Tailscale VPN](../vps-infra/9-tailscale-vpn.md)
    - excluded in dev env

### Captcha (Cloudflare Turnstile)

- **`TURNSTILE_SECRET_KEY`** — Server-side secret key for Turnstile verification
    - Cloudflare test key `1x0000000000000000000000000000000AA` in dev and docker (always passes)
    - Real key from Cloudflare Dashboard for VPS envs (see setup below)
- **`NEXT_PUBLIC_TURNSTILE_SITE_KEY`** — Client-side site key for Turnstile widget
    - Cloudflare test key `1x00000000000000000000AA` in dev and docker (always passes)
    - Real key from Cloudflare Dashboard for VPS envs (see setup below)

> Test keys reference: [Cloudflare Turnstile Testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
>
> To force a specific behavior in dev, swap the site key:
>
> | Site Key                   | Behavior                     |
> | -------------------------- | ---------------------------- |
> | `1x00000000000000000000AA` | Always passes (default)      |
> | `2x00000000000000000000AB` | Always blocks                |
> | `3x00000000000000000000FF` | Forces interactive challenge |

**How to get production keys:**

1. Go to [Cloudflare Dashboard > Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Click **Add Widget**
3. Name: project name (e.g. `Nextjs Deploy`)
4. Hostnames: add **all** domains that use the captcha (one widget can handle multiple domains)
    - `your-domain.com` (production)
    - `preview.your-domain.com` (preview)
    - `experiment.your-domain.com` (experiment)
5. Widget Mode: **Managed** (Cloudflare decides if user interaction is needed)
6. Pre-authorization: **No**
7. Click **Create**, then copy **Site Key** and **Secret Key**
8. Paste them in `env/env.config.mjs` for each VPS environment

### SMTP

- **`SMTP_HOST`** — SMTP server host
    - `localhost` in dev (Mailpit)
    - `smtp.hostinger.com` in all others envs
- **`SMTP_PORT`** — SMTP server port
    - `1025` in dev (Mailpit)
    - `465` in all others envs
- **`SMTP_USER`** — SMTP username
    - `mailpit` in dev (any value accepted)
    - real credentials in all others envs
- **`SMTP_PASSWORD`** — SMTP password
    - `mailpit` in dev (any value accepted)
    - real credentials in all others envs
- **`SMTP_FROM`** — Sender email address
    - `hello@domain.com` in all envs
- **`SMTP_FROM_NAME`** — Sender display name
    - `Nextjs Deploy` in production
    - template `Nextjs Deploy ({{ENV}})` in all others envs
- **`SUPPORT_EMAIL`** — Email address for support/contact form
    - `support@domain.com` in all envs
    - Create an alias in your email provider (e.g. Hostinger: hPanel > Emails > Alias)
    - The main mailbox (e.g. `hello@domain.com`) sends emails, the alias (e.g. `support@domain.com`) receives contact form messages

> In dev, emails are caught by [Mailpit](https://mailpit.axllent.org/) instead of being sent to real inboxes.
> Web UI: `http://localhost:8025` — SMTP: `localhost:1025`.
> To switch to real email sending (Hostinger), swap the commented overrides in `env/env.config.mjs` dev section.

### Ngrok (optional)

- **`NGROK_URL`** — Static ngrok domain
    - commented in dev only (e.g. `your-domain.ngrok-free.app`)
    - excluded in all others envs
- **`NEXT_PUBLIC_BASE_URL`** — Overrides base URL
    - commented template `https://{{NGROK_URL}}` in dev only

> See [Setup Local — Ngrok](./1-setup-local.md#ngrok-tunnel) for setup instructions.

### Umami Analytics

- **`UMAMI_URL`** — Umami internal Docker URL
    - `http://umami:3000` in production only
- **`UMAMI_WEBSITE_ID`** — Umami website tracking ID
    - production only

> See [Umami Analytics](../vps-infra/10-umami.md) for setup.

---

[← Setup Local](./1-setup-local.md) | [Containerization →](./3-containerization.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Environment Variables**
