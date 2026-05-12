/**
 * Files and folders to compare between Cubiing and the NextjsDeploy submodule.
 *
 * Each entry is a path relative to the Cubiing root. The same path is looked up
 * inside `NextjsDeploy/<path>` on the other side.
 *
 * Use `note` to document an expected divergence, and `exclude` to skip
 * sub-paths inside a directory entry (relative to `path`).
 *
 * The `note` field is the source of truth for what is "acceptable" divergence:
 * if a diff is flagged as legitimate (branding, business logic, intentional
 * inversion, Cubiing ahead of ND, etc.), document the reason here so future
 * AI/human reviews don't re-litigate the same call.
 */

export type SyncEntry = {
    path: string;
    note?: string;
    exclude?: string[];
};

export const SYNC_ENTRIES: SyncEntry[] = [
    // ─── Auth ──────────────────────────────────────────────────
    {
        path: "app/(auth)/",
        note: "Post-login redirect targets `/home` (Cubiing) vs `/` (ND) — domain-specific landing.",
    },
    { path: "lib/auth.ts", note: "appName / 2FA issuer set to `Cubiing` vs `Nextjs Deploy` — branding only." },
    {
        path: "lib/auth-server.ts",
        note: "Cubiing wraps `getSession` in React `cache()` to dedupe across layout + page + nested RSC within one request. → backport to ND.",
    },
    { path: "lib/auth-client.ts" },
    { path: "lib/auth-errors.ts" },
    { path: "lib/auth-middleware.ts" },

    // ─── oRPC core (sub-routers diverge by domain) ─────────────
    { path: "lib/orpc.ts" },
    { path: "lib/orpc-server.ts" },
    { path: "lib/orpc-handler.ts" },
    { path: "lib/orpc-hook.ts" },
    { path: "api/router.ts", note: "Common shape; domain sub-routers differ." },
    { path: "api/cache.ts" },
    { path: "api/csrf.ts" },
    { path: "api/permission.ts" },
    { path: "api/user/" },

    // ─── Cookies / env / email / activity ──────────────────────
    { path: "lib/cookie-client.ts" },
    { path: "lib/cookie-state-client.ts" },
    { path: "lib/cookie-state-server.ts" },
    { path: "lib/env.ts" },
    { path: "lib/env-client.ts" },
    { path: "lib/nodemailer.ts" },
    { path: "lib/activity.ts" },
    { path: "lib/cn.ts" },
    { path: "lib/prisma.ts" },

    // ─── Server actions ────────────────────────────────────────
    { path: "actions/" },

    // ─── App shell (root pages, layout, error boundaries) ──────
    { path: "app/page.tsx", note: "Home content differs by domain." },
    {
        path: "app/layout.tsx",
        note: "Title, description, `lang` (en vs fr), and Cubiing-only `<ScrollCompensation />` — all intentional.",
    },
    { path: "app/error.tsx" },
    { path: "app/loading.tsx" },
    { path: "app/robots.ts" },
    { path: "app/unauthorized.tsx" },
    { path: "app/not-found.tsx" },
    { path: "app/contact/" },

    // ─── Next.js API route handlers ────────────────────────────
    { path: "app/api/auth/" },
    { path: "app/api/health/" },
    { path: "app/api/orpc/" },
    { path: "app/api/umami/" },

    // ─── Components shared at root ─────────────────────────────
    {
        path: "components/atoms/",
        note: "`menu/atoms.tsx` exposes a Cubiing-specific `SwitchItem` used by 3D settings menus — keep. `_core/button-variants.ts` adds `data-popup-open:*` styles so buttons that act as popover/menu triggers keep the active look while the popup is open.",
    },
    { path: "components/breakpoints.tsx" },
    { path: "components/email-contact.tsx" },
    { path: "components/email-template.tsx" },
    { path: "components/image.tsx" },
    { path: "components/logout.tsx", note: "Unused in both projects — diff only flagged for awareness, no action." },
    {
        path: "components/use-optimistic/useInstant.ts",
        note: "Cubiing uses these hooks actively; ND has them commented out (not yet adopted). Accepted divergence.",
    },
    {
        path: "components/use-optimistic/useInstantArray.ts",
        note: "Same as useInstant — ND keeps them commented for later, Cubiing uses them today.",
    },
    {
        path: "components/use-query/",
        note: "ND-only commented scaffolding. Not adopted in Cubiing — may be valued in ND later.",
    },

    // ─── Core layout (header, footer, theme) ───────────────────
    {
        path: "core/header.tsx",
        note: "Cubiing keeps `<Logo />` + max-width container; ND adds DevSidebarTrigger for `/dev` zone (not adopted on Cubiing).",
    },
    {
        path: "core/footer.tsx",
        note: "Display condition is intentionally inverted: Cubiing shows footer everywhere except `/`, ND shows it only on `/`. Business decision.",
    },
    {
        path: "core/main.tsx",
        note: "max-w-384 (Cubiing) vs max-w-225 (ND) — page width is a per-project layout decision.",
    },
    { path: "core/config.ts" },
    { path: "core/header-links.ts", note: "Nav links differ by domain." },
    {
        path: "core/header/",
        note: "Two intentional divergences: (a) ND adds `dev-sidebar-trigger.tsx` + `use-dev-sidebar.ts` for the `/dev` admin zone — Cubiing has no `/dev` route. (b) Cubiing has refactored to a single `mobile-navigation.tsx` (the new app-nav system lives in `core/app-nav/`); ND keeps the older `desktop-navigation.tsx` + `nav-components.tsx` + `mobile-navigation.tsx` split. The new Cubiing nav is intentionally NOT backported.",
    },
    {
        path: "core/theme/",
        note: "Cubiing passes `themeSchema` as third arg to `useCookieState` for Zod validation of the theme cookie. Not yet in ND.",
    },

    // ─── Utils (shared helpers) ────────────────────────────────
    { path: "utils/" },

    // ─── Docker ────────────────────────────────────────────────
    { path: "docker/" },

    // ─── Scripts core (excluding Cubiing-specific generators) ──
    { path: "scripts/cron.ts" },
    { path: "scripts/fixtures.ts" },
    {
        path: "scripts/fixtures/",
        note: "Domain-specific seeders (puzzles/methods/... vs fruits/baskets) — common scaffolding only.",
    },
    { path: "scripts/db.sh" },
    {
        path: "scripts/better-auth-build.ts",
        note: "Builds the BA fork into vendor/better-auth-build/. Should be identical on both sides.",
    },
    {
        path: "scripts/setup-env.mjs",
        note: "Cubiing imports and runs `checkSync()` at startup; ND does not yet. → backport to ND.",
    },
    { path: "scripts/generate-env.mjs" },

    // Cubiing-only sync tooling — listed so the script reports MISSING (NextjsDeploy)
    // and reminds us to backport these files to ND.
    {
        path: "scripts/check-env-sync.mjs",
        note: "Cubiing-only — backport to ND (used by setup-env.mjs to validate env.config.mjs ↔ env.config.example.mjs).",
    },
    {
        path: "scripts/sync-config.ts",
        note: "Cubiing-only — backport to ND so its dependent stacks can compare against it.",
    },
    {
        path: "scripts/sync-with-nd.ts",
        note: "Cubiing-only — backport the runner to ND, but rename/repurpose: inside ND itself there is no submodule to compare against. Useful only when ND is consumed as a submodule by a downstream stack (like Cubiing). Keep the file in ND as a template, not as an active script.",
    },
    {
        path: "lint-staged.config.mjs",
        note: "Cubiing-only — extracted from package.json. Backport candidate to ND (currently inlined in ND's package.json).",
    },

    // ─── Better Auth fork (prebuilt artefacts) ─────────────────
    {
        path: "vendor/better-auth-build/BUILD_INFO.json",
        note: "Tracks the fork commit + branch + build timestamp. Should match between Cubiing and ND so both consume the same fork build (`vendor/better-auth-build/*` itself is too large to diff — only this manifest is tracked).",
    },

    // ─── Fixtures (only userData is shared) ────────────────────
    { path: "fixtures/userData.ts", note: "Cubiing adds `Playlists: { create }` to seeded users — domain model." },

    // ─── Env config (versioned placeholders) ───────────────────
    {
        path: "env/env.config.example.mjs",
        note: "Project name, db name, password, SMTP_FROM_NAME — branding placeholders.",
    },

    // ─── Public assets (shared globals only) ───────────────────
    {
        path: "public/globals.css",
        note: "Cubiing adds `@keyframes blink` and `--animate-blink` for cube UI.",
    },
    { path: "public/theme-script.js" },

    // ─── Tests (auth-related, shared scaffolding) ─────────────
    { path: "test/mocks/" },
    {
        path: "test/e2e/",
        note: "Auth-related e2e specs are kept in sync. Expected divergences: `helpers/auth.ts` redirects to `/home` (Cubiing) vs `/` (ND); some specs use `/home` literal. Cubiing-only cube/algo specs are not in this folder yet.",
    },
    {
        path: "test/integration/auth/",
        note: "14 BA integration tests — should stay aligned (covers register, login, magic-link, password reset, change-email, totp, sessions, etc.).",
    },
    { path: "test/integration/helpers/", note: "Shared integration test helpers." },
    {
        path: "test/functional/",
        note: "Functional auth tests + MSW server. Should stay aligned.",
    },

    // ─── Root configs ──────────────────────────────────────────
    { path: "prettier.config.mjs" },
    {
        path: ".prettierignore",
        note: "Cubiing excludes `NextjsDeploy/`; ND excludes `solid/templates/`. Per-stack normal.",
    },
    { path: "eslint.config.mjs", note: "Cubiing adds `NextjsDeploy/**` to global ignores." },
    { path: "commitlint.config.ts" },
    {
        path: "next.config.mts",
        note: 'transpilePackages: `["three"]` (Cubiing) vs Scalar packages (ND). Domain stack.',
    },
    { path: "prisma.config.mts" },
    { path: "vitest.config.mjs", note: "Cubiing excludes `NextjsDeploy/**` from test runs." },
    { path: "vitest.config.functional.mjs" },
    { path: "vitest.config.integration.mjs" },
    { path: "playwright.config.ts" },
    { path: "postcss.config.mjs" },
    { path: "instrumentation.ts" },
    {
        path: "proxy.ts",
        note: "Protected routes differ by domain. ND adds an admin guard for `/dev/*` (rewrites to /_not-found in prod for non-admins) — Cubiing has no `/dev` route, intentionally not adopted.",
    },
    {
        path: "tsconfig.json",
        note: "Path aliases differ: Cubiing adds `@svg/*` and `@cube-lib/*`; ND adds `@cache/*`, `@class/*`, `@services/*`, `@shadcn/*`, `@ui/*`. Cubiing also excludes `NextjsDeploy` from the TS project.",
    },
    {
        path: "Makefile",
        note: "Container/db names differ by project (postgres-dev-cubiing vs postgres-dev-nextjs-deploy).",
    },
    { path: ".dockerignore", note: "Cubiing excludes the submodule, `test/`, and `coverage/` — ND does not." },
    {
        path: "compose.dokploy.yml",
        note: "Root-level Dokploy compose. Per-project service names + env labels (cubiing vs nextjs-deploy) — branding only.",
    },
    {
        path: "package.json",
        note: "Versions and deps evolve independently per project. Useful to spot script-name drift, missing scripts, or dep alignment for the shared stack pieces (auth/orpc/email/etc.). Branding fields (name, description) are expected divergences.",
    },
    {
        path: "CLAUDE.md",
        note: "Per-project instructions. Useful to spot pattern drift (new conventions adopted in one but not the other) — divergences in 'Tech Stack' / 'Architecture' sections are expected.",
    },
    { path: "README.md", note: "Project-specific content (ND has a much larger documentation index)." },
    { path: ".husky/", exclude: ["_"] },
];
