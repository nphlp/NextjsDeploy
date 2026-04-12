[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Better Auth Fork**

[← Scheduled Tasks](./11-scheduled-tasks.md)

---

# Better Auth Fork

The project uses a fork of Better Auth as a git submodule to contribute upstream improvements. The fork lives in `vendor/better-auth/`.

See `BETTER-AUTH.md` at the project root for the list of planned upstream contributions.

## Local Development

### First Setup

After cloning the project, initialize the submodule:

```bash
git submodule update --init --recursive
```

Then install, build, and link the fork:

```bash
make better-auth-install   # pnpm install in the monorepo
make better-auth-build     # build all packages (core, telemetry, better-auth, passkey, adapters)
make better-auth-link      # symlink fork packages into node_modules/
```

### Development Workflow

1. Start the fork in watch mode (rebuilds on changes):

```bash
make better-auth-dev
```

2. Edit files in `vendor/better-auth/packages/` — changes rebuild automatically

3. If the symlinks are lost (after `bun install`), re-link:

```bash
make better-auth-link
```

### Working on the Fork

The submodule is a full git repo. You can commit, branch, and push from inside it:

```bash
cd vendor/better-auth
git checkout -b feat/my-feature
# make changes...
git add . && git commit -m "feat: my changes"
git push origin feat/my-feature
```

Then open a PR on the upstream repo from your fork.

## Dokploy Deployment

### 1. Enable Submodules

In Dokploy > your compose service > **General** tab (Provider section):

- Toggle **Enable Submodules** to `On`

This makes Dokploy run `git submodule update --init --recursive` when cloning.

### 2. Switch Compose File

In Dokploy > your compose service > **General** tab (Provider section):

- Change compose file path to: `./compose.dokploy.submodules.yml`

This uses `Dockerfile.nextjs.submodules` which:

1. Installs pnpm and builds the fork packages
2. Creates symlinks in `node_modules/` pointing to the built fork
3. Builds and runs Next.js as usual

### 3. Revert to npm (when fork is merged upstream)

When Better Auth merges your changes and publishes a new version:

**1. Update dependencies:**

```bash
# Update to the npm version that includes the merged PRs
bun add better-auth@latest @better-auth/passkey@latest
```

**2. Revert Docker config:**

- `docker/compose.docker.yml` → change `Dockerfile.nextjs.submodules` back to `Dockerfile.nextjs`
- Dokploy → change compose path back to `./compose.dokploy.yml`
- Dokploy → disable **Enable Submodules**

**3. Remove submodule:**

```bash
git rm vendor/better-auth
rm -rf .git/modules/vendor
```

**4. Clean up submodule files:**

```bash
rm docker/Dockerfile.nextjs.submodules
rm compose.dokploy.submodules.yml
rm .gitmodules
```

**5. Revert Makefile:**

- Remove the `Better Auth (fork)` section (better-auth-install, better-auth-build, better-auth-dev, better-auth-link)
- Remove the `better-auth-link` call in `app-setup`

**6. Files that can stay as-is** (no impact without `vendor/`):

- `tsconfig.json` — `"vendor"` in exclude
- `eslint.config.mjs` — `"vendor/**"` in globalIgnores
- `.prettierignore` — `vendor/`
- `vitest.config.mjs` — `"vendor/**"` in exclude

**7. Update BETTER-AUTH.md** — move items from "Done" to archived, remove file if all PRs are merged

## Architecture

```
vendor/better-auth/              # Git submodule (fork)
├── packages/
│   ├── core/                    # @better-auth/core
│   ├── telemetry/               # @better-auth/telemetry
│   ├── better-auth/             # better-auth (main package)
│   ├── passkey/                 # @better-auth/passkey
│   ├── prisma-adapter/          # @better-auth/prisma-adapter
│   └── ...                      # other adapters
│
node_modules/
├── better-auth → symlink to vendor/better-auth/packages/better-auth
├── @better-auth/passkey → symlink to vendor/better-auth/packages/passkey
└── ...
```

## Makefile Commands

| Command                    | Description                                 |
| -------------------------- | ------------------------------------------- |
| `make better-auth-install` | `pnpm install` in the fork monorepo         |
| `make better-auth-build`   | Build all fork packages (generates `dist/`) |
| `make better-auth-dev`     | Watch mode — rebuild on file changes        |
| `make better-auth-link`    | Symlink fork packages into `node_modules/`  |

---

[← Scheduled Tasks](./11-scheduled-tasks.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Better Auth Fork**
