[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Better Auth Fork**

[← Scheduled Tasks](./11-scheduled-tasks.md)

---

# Better Auth Fork

The project consumes a fork of Better Auth as **prebuilt artefacts** committed to the repo at `vendor/better-auth-build/`. The fork source itself lives at `vendor/better-auth/` (git submodule), but it is **only required when modifying the fork** — normal install/dev/CI/deploy go through the prebuilt artefacts via bun workspaces.

See `BETTER-AUTH.md` at the project root for the list of upstream contributions in flight.

## How It Works

`package.json` declares `vendor/better-auth-build/*` as bun workspaces. The deps `better-auth` + `@better-auth/passkey` use `workspace:*`, so `bun install` resolves them locally — no npm download, no symlinks, no build step.

```
vendor/
├── better-auth/                    # Git submodule (fork source — optional)
│   └── packages/...
└── better-auth-build/              # Committed prebuilt artefacts (consumed by bun workspaces)
    ├── better-auth/
    │   ├── dist/
    │   └── package.json            # workspace:* refs preserved, catalog: → versions
    ├── @better-auth/{core,passkey,prisma-adapter,...}/
    │   ├── dist/
    │   └── package.json
    └── BUILD_INFO.json             # fork commit + branch + timestamp
```

## Local Development

### Default Workflow (you don't modify the fork)

```bash
bun install   # Resolves better-auth + @better-auth/* via bun workspaces
```

That's it. The submodule isn't required, no Makefile target needed.

### Modifying the Fork

```bash
git submodule update --init vendor/better-auth   # Pull the fork source
# Edit code in vendor/better-auth/packages/...
make better-auth-build                            # Regenerate vendor/better-auth-build/ + bun install
```

Commit **both**:

- `vendor/better-auth` (submodule pointer bump)
- `vendor/better-auth-build/` (artefacts)

### Working on the Fork (upstream PRs)

The submodule is a full git repo. From inside it, branch + commit + push to the fork remote:

```bash
cd vendor/better-auth
git checkout -b feat/my-feature
# ... edits ...
git add . && git commit -m "feat: my changes"
git push origin feat/my-feature
```

Then open a PR upstream from your fork.

## Build Script

`scripts/better-auth-build.ts` orchestrates the rebuild:

1. `pnpm install` in the fork submodule (pnpm is the fork's native PM — bun would mutate `package.json` by ingesting `pnpm-workspace.yaml`, polluting upstream PRs)
2. Build all 9 packages with tsdown (`@better-auth/core`, `@better-auth/telemetry`, `@better-auth/{kysely,prisma,memory,mongo,drizzle}-adapter`, `better-auth`, `@better-auth/passkey`)
3. Copy `dist/` + rewritten `package.json` + `LICENSE.md` into `vendor/better-auth-build/<name>/`
4. Rewrite each vendored `package.json`: drop `devDependencies` + `scripts`, keep `workspace:*`/`workspace:^`, resolve `catalog:` to concrete versions
5. Write `BUILD_INFO.json` (fork commit + timestamp)

## Dokploy Deployment

No special config needed — deploys consume the committed `vendor/better-auth-build/` like any other repo file. Dokploy must have **Enable Submodules** disabled (the submodule is optional and only used by maintainers).

In Dokploy > your compose service > **General** tab (Provider section):

- Compose file path: `./compose.dokploy.yml`
- Toggle **Enable Submodules**: `Off`

## Reverting to npm (when fork is merged upstream)

When Better Auth merges your changes and publishes new versions:

**1. Update dependencies:**

```bash
bun add better-auth@latest @better-auth/passkey@latest
```

This replaces `workspace:*` with `^x.y.z` ranges.

**2. Drop the workspaces array** in `package.json`:

```diff
- "workspaces": [
-     "vendor/better-auth-build/better-auth",
-     "vendor/better-auth-build/@better-auth/*"
- ],
```

**3. Drop the prebuilt artefacts + submodule:**

```bash
rm -rf vendor/better-auth-build
git rm vendor/better-auth
rm -rf .git/modules/vendor
rm .gitmodules
```

**4. Drop the build script + Makefile section:**

```bash
rm scripts/better-auth-build.ts
```

Remove the `Better Auth (fork)` section in `Makefile`.

**5. Drop Dockerfile prebuilt COPY lines:**

In `docker/Dockerfile.nextjs` + `docker/Dockerfile.prisma-studio`, remove:

```dockerfile
COPY vendor/better-auth-build ./vendor/better-auth-build
```

**6. Files that can stay as-is** (no impact without `vendor/`):

- `tsconfig.json` — `"vendor"` in exclude
- `eslint.config.mjs` — `"vendor/**"` in globalIgnores
- `.prettierignore` — `vendor/`
- `vitest.config.mjs` — `"vendor/**"` in exclude

**7. Update `BETTER-AUTH.md`** — move items from "Done" to archived, remove file if all PRs are merged.

## Makefile Commands

| Command                  | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| `make better-auth-build` | Run `scripts/better-auth-build.ts` then `bun install` (fork → repo) |
| `make better-auth-dev`   | Watch mode — rebuild fork packages on changes (active fork dev)     |

---

[← Scheduled Tasks](./11-scheduled-tasks.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Better Auth Fork**
