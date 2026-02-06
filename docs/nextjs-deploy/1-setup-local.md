[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Setup Local**

[Environment Variables →](./2-environment-variables.md)

---

# Setup Local

## Prerequisites

- [Node.js](https://nodejs.org/fr/download)
- [PNPM](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Make](https://www.gnu.org/software/make/)

## `make dev` — Development

Best option for daily work. Next.js runs locally (fast hot-reload), Postgres in Docker.

```bash
make dev
```

**First run:** if `env/env.config.ts` doesn't exist, the command creates it and **stops**. Configure your variables in the generated file, then re-run `make dev`. See [Environment Variables](./2-environment-variables.md) for details.

**Further runs:** installs deps, generates `.env` files, starts Postgres, sets up DB, loads fixtures and starts Next.js.

Stop with `Ctrl+C` — shuts down both Next.js and Postgres.

## `make start` — Production Test

Same as `make dev` but builds and serves the production bundle. Use to verify everything works before deploying.

```bash
make start
```

Stop with `Ctrl+C` — shuts down both Next.js and Postgres.

## `make basic` — Full Containerized

Everything in Docker (Next.js + Postgres). Mirrors the production environment.

```bash
make basic
```

```bash
make basic-stop    # Stop containers
make basic-clear   # Stop + delete volumes
```

## `make postgres` — Postgres Only

Keep Postgres running independently and restart Next.js freely without the overhead of `make dev` / `make start` (no reinstall, no DB reset, no fixtures reload). Ideal when you need to run `pnpm dev` or `pnpm build` frequently.

```bash
make postgres        # Start Postgres only (port 5433)
```

Then start Next.js in another terminal, with one of the following commands:

```bash
# Dev mode
pnpm dev             # Start Next.js dev server
pnpm auto            # Install deps, setup DB, load fixtures and start Next.js

# Build mode
pnpm build && pnpm start  # Test production build
pnpm auto:start           # Install deps, setup DB, load fixtures and start production build
```

`Ctrl+C` only stops Next.js — Postgres keeps running. Stop it when done:

```bash
make postgres-stop   # Stop container
make postgres-clear  # Stop + delete volume
```

## Ngrok Tunnel

Expose `localhost:3000` through a public URL. Useful for mobile testing or sharing.

1. Create an account at [ngrok.com](https://ngrok.com/)
2. Setup your authtoken from the [dashboard](https://dashboard.ngrok.com/get-started/setup)
3. Get a free static domain at [Domains](https://dashboard.ngrok.com/domains)
4. Set your static domain in `env/env.config.ts` in the `tunnelling` section. See [Environment Variables](./2-environment-variables.md) for details.
    ```ts
    tunnelling: {
        NGROK_URL: commented("your-static-domain.ngrok-free.app"), // Change here
        NEXT_PUBLIC_BASE_URL: commented(template("https://{{NGROK_URL}}")), // Do not change this one
    },
    ```
5. Run `make setup-env` to regenerate env files
6. In the generated `.env` at root, comment `NEXT_PUBLIC_BASE_URL=http://localhost:3000` and uncomment the ngrok block:

    ```env
    # Next.js configuration
    NEXTJS_STANDALONE=false
    # NEXT_PUBLIC_BASE_URL=http://localhost:3000 // Comment this line
    ...
    # Ngrok tunnelling (optional)
    NGROK_URL=your-static-domain.ngrok-free.app                    // Uncomment this line
    NEXT_PUBLIC_BASE_URL=https://your-static-domain.ngrok-free.app // Uncomment this line
    ```

7. Start in two terminals:

    ```bash
    # Terminal 1
    make dev

    # Terminal 2
    make ngrok
    ```

## Database Dump

Export the database schema to `prisma/dump.sql`. Requires an active Postgres container (`make dev` or `make postgres`).

```bash
make dump
```

## Cleanup

Remove all generated files and folders:

```bash
make clear
```

Deletes: `.husky/_`, `.next`, `node_modules`, `prisma/client`, `next-env.d.ts`, `tsconfig.tsbuildinfo`, `.env`, `env/.env.basic`, `env/.env.experiment`, `env/.env.preview`, `env/.env.production`.

---

[Environment Variables →](./2-environment-variables.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Setup Local**
