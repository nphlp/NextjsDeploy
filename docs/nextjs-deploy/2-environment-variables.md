[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Environment Variables**

[← Setup Local](./1-setup-local.md) | [Containerization →](./3-containerization.md)

---

# Environment Variables

This project runs across multiple environments: `dev` (local), `build` (local), `basic` (containerized), `experiment` (vps), `preview` (vps) and `production` (vps). **Each environment has its own set of environment variables.**

To simplify management and avoid errors, an **`.env files` variant generation system** has been created.

- All variables are **centralized** in `env/env.config.ts`.
- One command `make setup-env` generates all `.env` variants.
- VPS environements files are ready to be copy-pasted to Dokploy secrets

Generated `.env` files are located:

- `.env` : at root, used for local development and build testing (`make dev`, `make start`, `pnpm dev`, etc)
- `env/.env.basic` : used for local containerized environment (`make basic`)
- `env/.env.experiment` : used for VPS experiment environment (Dokploy)
- `env/.env.preview` : used for VPS preview environment (Dokploy)
- `env/.env.production` : used for VPS production environment (Dokploy)

> All these genrated files are **not versioned** (gitignored).

## Usage

> [!WARNING]
> This guide explains how to manage environments variables
>
> - MAKE SURE to set your secrets in `env/env.config.ts` (non versionned)
> - DO NOT edit generated `.env` files, they will be overwritten
> - DO NOT set your secrets in `scripts/generate-env/env.config.example.ts` (versionned) or you will leak them in git history

### First install

First time cloning the project: `env/env.config.ts` doesn't exist yet. You need to generate it from the example, then fill in your values.

1. Generate the default `env/env.config.ts`:

```bash
make setup-env
```

2. Replace example values with your own (API keys, passwords, etc).
3. Run `make setup-env` again to generate all `.env` files from your configuration.
4. You're ready to develop!

> [!NOTE]
> `make dev`, `make start` and `make basic` all run `make setup-env` automatically before starting.

### Update an existing variable

1. Edit the value in `env/env.config.ts`
2. Run `make setup-env` to regenerate all `.env` files

### Add a new variable

`env/env.config.ts` has three sections: `settings`, `globalConfig` and `envConfig`.

**1. Register in `settings.groups`**

Add the variable to a group (or create a new one). Groups define the order and comments in generated files.

```ts
const settings = {
    ...,
    groups: {
        myGroup: { // Existing or new group
            comment: "My group description",
            variables: ["MY_VAR"], // Add your variable name here
        },
    },
};
```

**2. Set a default in `globalConfig`** (optional)

Values here apply to all environments.

```ts
const globalConfig = {
    myGroup: {
        MY_VAR: "default-value", // The real value
    },
};
```

**3. Override per environment in `envConfig`**

Each env can override `globalConfig` values. Available helpers:

- **Direct value** — plain override: `MY_VAR: "value"`
- **`template("...")`** — reference other variables: `DATABASE_URL: template("postgres://{{POSTGRES_HOST}}:{{POSTGRES_PORT}}")`
- **`commented("...")`** — generates a commented-out line in `.env`: `NGROK_URL: commented("my-domain.ngrok-free.app")`
- **`EXCLUDE: [...]`** — omit variables not needed in this env: `EXCLUDE: ["UMAMI_URL", "UMAMI_WEBSITE_ID"]`

```ts
const envConfig = {
    dev: {
        myGroup: {
            MY_VAR: "dev-override", // overrides globalConfig
        },
        EXCLUDE: ["PROD_ONLY_VAR"], // not needed in dev
    },
    production: {
        myGroup: {
            MY_VAR: template("https://{{VPS_NEXTJS_DOMAIN}}/api"), // derived from another variable in production
        },
    },
};
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
    - `http://localhost:3000` in dev and basic
    - template `https://{{VPS_NEXTJS_DOMAIN}}` in VPS envs
- **`REACT_EDITOR`** — IDE used by Next.js error overlay links
    - `code` in dev only
    - excluded in all others envs

### Environment Label

- **`ENV_LABEL`** — Identifies the environment, used in templates
    - `dev-nextjs-deploy` in dev
    - `basic-nextjs-deploy` in basic
    - `experiment-nextjs-deploy` in experiment
    - `preview-nextjs-deploy` in preview
    - `nextjs-deploy` in prod

### VPS Domains

- **`VPS_NEXTJS_DOMAIN`** — Next.js app domain on VPS
    - `experiment.your-domain.com` in experiment
    - `preview.your-domain.com` in preview
    - `your-domain.com` in production
    - excluded in dev and basic envs
- **`VPS_PRISMA_STUDIO_DOMAIN`** — Prisma Studio subdomain
    - template `prisma-studio.{{VPS_NEXTJS_DOMAIN}}` in all VPS envs
    - excluded in dev and basic envs

### PostgreSQL

- **`POSTGRES_HOST`** — Database host
    - `localhost` in dev
    - `postgres` in basic
    - template from `ENV_LABEL` in VPS envs
- **`POSTGRES_PORT`** — Database port
    - `5433` in dev
    - `5432` in all others envs
- **`POSTGRES_DB`** — Database name
    - `nextjs-deploy-db` in all envs
- **`POSTGRES_PASSWORD`** — Database password
    - `nextjs-deploy-password` in dev and basic
    - generate for VPS with `openssl rand -base64 32`
- **`DATABASE_URL`** — Prisma connection string
    - template `postgres://postgres:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}` in all envs

### Authentication

- **`BETTER_AUTH_SECRET`** — Session encryption key for Better Auth
    - `better-auth-session-encryption-key` in dev and basic
    - generate for VPS with `openssl rand -base64 32`
- **`PRISMA_STUDIO_AUTH`** — Basic auth for Prisma Studio (Traefik middleware)
    - generate with `htpasswd -nbB admin your-password`, then double the `$` signs
    - safety net if Prisma Studio is accidentally exposed publicly. Should only be accessible via [Tailscale VPN](../vps-infra/9-tailscale-vpn.md)
    - excluded in dev env

### SMTP

- **`SMTP_HOST`** — SMTP server host
    - `smtp.hostinger.com` in all envs
- **`SMTP_PORT`** — SMTP server port
    - `465` in all envs
- **`SMTP_USER`** — SMTP username
    - `hello@domain.com` in all envs
- **`SMTP_PASSWORD`** — SMTP password
- **`SMTP_FROM`** — Sender email address
    - `hello@domain.com` in all envs
- **`SMTP_FROM_NAME`** — Sender display name
    - `Nextjs Deploy` in production
    - template `Nextjs Deploy ({{ENV}})` in all others envs

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
