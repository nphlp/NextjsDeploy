# Pulse Work

Time attendance and team management software.

<h2>Summary</h2>

- [Quick links](#quick-links)
- [Prerequisites](#prerequisites)
- [Start a **DEVELOPMENT** server (local)](#start-a-development-server-local)
- [Start a **BUILD** server (local)](#start-a-build-server-local)
- [Start a **PRODUCTION** like server (local)](#start-a-production-like-server-local)
- [Fixtures](#fixtures)

## Quick links

- [Git guide](./docs/git-guide.md)
- [Dokploy deployment](./docs/dokploy-deployment.md)
- [Database Breaking Migrations](./docs/database-breaking-migrations.md)

## Prerequisites

The following software are required to lauch the development environment.

- [Node.js](https://nodejs.org/fr/download)
- [PNPM](https://pnpm.io/installation)
- [Postgres](https://www.postgresql.org/download/)

> [!NOTE]
> Docker works on Windows, MacOS and Linux. \
> For Windows, ensure that you have [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) installed and configured.

- [Docker](https://docs.docker.com/get-started/get-docker/)

> [!NOTE]
> Makefile work on Unix systems (Linux, MacOS) by default. \
> For Windows, you can use [Chocolatey](https://chocolatey.org/install) to install it.

- [Make](https://www.gnu.org/software/make/)

## Start a **DEVELOPMENT** server (local)

Run the following command to start the development server environment (nextjs in terminal + postgres in docker):

```
make dev
```

It will:

- create an `.env` file from the `env/.env.example` file (if not already existing)
- start a `postgres` container
- start a `nextjs` server

Then access the app at [http://localhost:3000](http://localhost:3000).

To stop both `nextjs` terminal server and `postgres` container, simply stop `nextjs` process with:

```
CTRL + C
```

It should stop `postgres` container in the process. If `postgres` container is still running, you can stop it with `make postgres-stop`.

## Start a **BUILD** server (local)

Run the following command to build and start a local server environment (nextjs in terminal + postgres in docker):

```
make start
```

It will:

- create an `.env` file from the `env/.env.example` file (if not already existing)
- start a `postgres` container
- start a `nextjs` server

Then access the app at [http://localhost:3000](http://localhost:3000).

To stop both `nextjs` terminal server and `postgres` container, simply stop `nextjs` process with:

```
CTRL + C
```

It should stop `postgres` container in the process. If `postgres` container is still running, you can stop it with `make postgres-stop`.

## Start a **PRODUCTION** like server (local)

Run the following command to build and start a local server environment (nextjs in docker + postgres in docker):

```
make basic
```

It will:

- create an `.env` file from the `env/.env.example` file (if not already existing)
- create an `env/.env.override.basic` file from the `env/.env.override.basic.example` file (if not already existing)
- generate an `.env.basic` file from the `.env` and `env/.env.override.basic` file (if not already existing)
- start a `postgres` and `nextjs` containers

Then access the app at [http://localhost:3000](http://localhost:3000).

To stop both `postgres` and `nextjs` container run:

```
# Keep volumes and data
make basic-stop

# Remove volumes and data
make basic-clean
```

<h2>Deploy a <b>TEST</b>, <b>STAGING</b> and <b>PRODUCTION</b> server (vps)</h2>

Follow [Dokploy deployment instructions](./docs/dokploy-deployment.md).

## Fixtures

Here are some sample credentials to test the application.

| Email                | Password      | User type |
| -------------------- | ------------- | --------- |
| employee@example.com | Password1234! | Employee  |
| manager@example.com  | Password1234! | Manager   |
| admin@example.com    | Password1234! | Admin     |
