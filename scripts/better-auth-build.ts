#!/usr/bin/env bun
/**
 * Build the Better Auth fork into `vendor/better-auth-build/`.
 *
 * Output is committed and consumed via bun workspaces, so production
 * deploys don't need to re-clone or re-build the fork.
 *
 * Run: `bun run scripts/better-auth-build.ts` (or `make better-auth-build`)
 *
 * Steps:
 *   1. `pnpm install` in the fork submodule (pnpm is the fork's native PM —
 *      bun would mutate package.json by ingesting pnpm-workspace.yaml, which
 *      pollutes upstream PRs)
 *   2. Build all 9 packages with tsdown
 *   3. Copy `dist/`, `package.json`, `LICENSE.md` into `vendor/better-auth-build/<name>/`
 *   4. Rewrite each vendored `package.json`:
 *      - drop `devDependencies` and `scripts`
 *      - keep `workspace:*` / `workspace:^` (resolved by Cubiing's bun workspace)
 *      - resolve `catalog:` to concrete versions
 *   5. Write `BUILD_INFO.json` with fork commit + timestamp
 *
 * Cubiing declares `vendor/better-auth-build/*` as a bun workspace, so the
 * internal `workspace:*` refs resolve natively without file: paths or symlinks.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const REPO_ROOT = resolve(import.meta.dirname, "..");
const FORK_DIR = join(REPO_ROOT, "vendor", "better-auth");
const BUILD_DIR = join(REPO_ROOT, "vendor", "better-auth-build");

// Packages to vendor (order matters for build: dependencies first)
// `better-auth` depends on all 6 adapters + core + telemetry, so all are needed
// even if Cubiing only imports a subset (otherwise `bun install` rejects deps).
const PACKAGES = [
    "core",
    "telemetry",
    "kysely-adapter",
    "prisma-adapter",
    "memory-adapter",
    "drizzle-adapter",
    "mongo-adapter",
    "better-auth",
    "passkey",
] as const;

// Maps package directory name → npm package name
const PACKAGE_NAMES: Record<(typeof PACKAGES)[number], string> = {
    core: "@better-auth/core",
    telemetry: "@better-auth/telemetry",
    "kysely-adapter": "@better-auth/kysely-adapter",
    "prisma-adapter": "@better-auth/prisma-adapter",
    "memory-adapter": "@better-auth/memory-adapter",
    "drizzle-adapter": "@better-auth/drizzle-adapter",
    "mongo-adapter": "@better-auth/mongo-adapter",
    "better-auth": "better-auth",
    passkey: "@better-auth/passkey",
};

function step(msg: string): void {
    console.log(`\n→ ${msg}`);
}

function run(cmd: string, cwd: string): void {
    execSync(cmd, { cwd, stdio: "inherit" });
}

function readJson<T = unknown>(path: string): T {
    return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function writeJson(path: string, value: unknown): void {
    writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
}

// Parse the catalog from pnpm-workspace.yaml manually (no yaml dep needed).
// Format:
//   catalog:
//     '@better-auth/utils': 0.4.0
//     'better-call': 1.3.5
function readCatalog(): Record<string, string> {
    const wsPath = join(FORK_DIR, "pnpm-workspace.yaml");
    const content = readFileSync(wsPath, "utf-8");
    const lines = content.split("\n");
    const catalog: Record<string, string> = {};
    let inCatalog = false;
    for (const line of lines) {
        if (line.startsWith("catalog:")) {
            inCatalog = true;
            continue;
        }
        if (inCatalog) {
            // Stop at next top-level key (no leading whitespace)
            if (line.length > 0 && !line.startsWith(" ") && !line.startsWith("\t")) break;
            // Handles both quoted (`'@scope/name': version`) and unquoted (`name: version`) keys
            const match = line.match(/^\s+(?:'([^']+)'|([\w@/-]+)):\s*(.+)$/);
            if (match) catalog[match[1] ?? match[2]] = match[3].trim();
        }
    }
    return catalog;
}

type PackageJson = {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    peerDependenciesMeta?: Record<string, unknown>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
    [key: string]: unknown;
};

function rewriteDeps(
    deps: Record<string, string> | undefined,
    catalog: Record<string, string>,
    sourcePkg: string,
): Record<string, string> | undefined {
    if (!deps) return undefined;
    const out: Record<string, string> = {};
    for (const [name, range] of Object.entries(deps)) {
        if (range === "catalog:") {
            const resolved = catalog[name];
            if (!resolved) throw new Error(`Catalog miss: ${name} (in ${sourcePkg})`);
            out[name] = resolved;
        } else {
            // Keep workspace:* / workspace:^ as-is — resolved by bun workspaces
            out[name] = range;
        }
    }
    return out;
}

function rewritePackageJson(srcPath: string, destPath: string, catalog: Record<string, string>): void {
    const pkg = readJson<PackageJson>(srcPath);

    // Strip noise that's not needed at consume-time
    delete pkg.devDependencies;
    delete pkg.scripts;
    delete pkg.publishConfig;

    pkg.dependencies = rewriteDeps(pkg.dependencies, catalog, pkg.name);
    pkg.peerDependencies = rewriteDeps(pkg.peerDependencies, catalog, pkg.name);

    writeJson(destPath, pkg);
}

function main(): void {
    if (!existsSync(FORK_DIR)) {
        console.error(`✗ Fork submodule missing: ${FORK_DIR}`);
        console.error(`  Run: git submodule update --init vendor/better-auth`);
        process.exit(1);
    }

    step("Installing fork dependencies (pnpm — fork's native PM)");
    run("pnpm install --ignore-scripts", FORK_DIR);

    step("Building fork packages with tsdown");
    const buildCmds = PACKAGES.map((p) => `pnpm --filter ${PACKAGE_NAMES[p]} build`).join(" && ");
    run(buildCmds, FORK_DIR);

    step("Reading catalog from pnpm-workspace.yaml");
    const catalog = readCatalog();
    console.log(`  Found ${Object.keys(catalog).length} catalog entries`);

    step(`Resetting ${BUILD_DIR}`);
    rmSync(BUILD_DIR, { recursive: true, force: true });
    mkdirSync(BUILD_DIR, { recursive: true });

    step("Copying packages");
    for (const pkgDir of PACKAGES) {
        const npmName = PACKAGE_NAMES[pkgDir];
        const srcDir = join(FORK_DIR, "packages", pkgDir);
        const destDir = join(BUILD_DIR, npmName);

        mkdirSync(dirname(destDir), { recursive: true });
        mkdirSync(destDir, { recursive: true });

        // Copy dist (required) + LICENSE (legal)
        const distSrc = join(srcDir, "dist");
        if (!existsSync(distSrc)) throw new Error(`Build missing: ${distSrc}`);
        cpSync(distSrc, join(destDir, "dist"), { recursive: true });

        const licenseSrc = join(srcDir, "LICENSE.md");
        if (existsSync(licenseSrc)) cpSync(licenseSrc, join(destDir, "LICENSE.md"));

        // Rewrite package.json
        rewritePackageJson(join(srcDir, "package.json"), join(destDir, "package.json"), catalog);

        console.log(`  ✓ ${npmName}`);
    }

    step("Writing BUILD_INFO.json");
    const forkCommit = execSync("git rev-parse HEAD", { cwd: FORK_DIR }).toString().trim();
    const forkBranch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: FORK_DIR }).toString().trim();
    writeJson(join(BUILD_DIR, "BUILD_INFO.json"), {
        forkCommit,
        forkBranch,
        builtAt: new Date().toISOString(),
        packages: PACKAGES.map((p) => PACKAGE_NAMES[p]),
    });

    console.log(`\n✓ Done. Vendored ${PACKAGES.length} packages → vendor/better-auth-build/`);
    console.log(`  Fork commit: ${forkCommit.slice(0, 8)} (${forkBranch})`);
    console.log(`\n  Next: \`bun install\` to refresh node_modules from the new build.`);
}

main();
