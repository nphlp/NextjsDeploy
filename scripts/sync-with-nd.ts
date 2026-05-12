#!/usr/bin/env tsx
/**
 * Diff Cubiing files against the NextjsDeploy submodule, entry by entry.
 *
 * Reads the list from `scripts/sync-config.ts` and runs `git diff --no-index`
 * for each entry, printing a colored, file-by-file diff to stdout.
 *
 * Usage:
 *   bun scripts/sync-with-nd.ts            # diff all entries
 *   bun scripts/sync-with-nd.ts auth       # only entries whose path contains "auth"
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { SYNC_ENTRIES, type SyncEntry } from "./sync-config";

const ROOT = resolve(__dirname, "..");
const ND_ROOT = join(ROOT, "NextjsDeploy");

const SEPARATOR = "━".repeat(67);

const colors = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    gray: "\x1b[90m",
};

type Status = "identical" | "diff" | "missing-cubiing" | "missing-nd" | "missing-both";

type Result = {
    entry: SyncEntry;
    status: Status;
};

function header(entry: SyncEntry) {
    console.log(`\n${colors.cyan}${SEPARATOR}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}▶ ${entry.path}${colors.reset}`);
    if (entry.note) console.log(`${colors.gray}  note: ${entry.note}${colors.reset}`);
    console.log(`${colors.cyan}${SEPARATOR}${colors.reset}`);
}

function gitDiff(left: string, right: string): { code: number; output: string } {
    const result = spawnSync("git", ["diff", "--no-index", "--color=always", "--", left, right], { encoding: "utf8" });
    if (result.error) {
        throw new Error(`Failed to run git: ${result.error.message}`);
    }
    return { code: result.status ?? 0, output: (result.stdout ?? "") + (result.stderr ?? "") };
}

function listFilesRecursive(dir: string): string[] {
    const out: string[] = [];
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) {
            out.push(...listFilesRecursive(full));
        } else {
            out.push(full);
        }
    }
    return out;
}

function isExcluded(relPath: string, exclude: string[]): boolean {
    return exclude.some((ex) => relPath === ex || relPath.startsWith(`${ex}/`));
}

function diffEntry(entry: SyncEntry): Status {
    const cubiing = join(ROOT, entry.path);
    const nd = join(ND_ROOT, entry.path);

    const cubiingExists = existsSync(cubiing);
    const ndExists = existsSync(nd);

    if (!cubiingExists && !ndExists) {
        header(entry);
        console.log(`${colors.red}MISSING on both sides${colors.reset}`);
        return "missing-both";
    }
    if (!cubiingExists) {
        header(entry);
        console.log(`${colors.red}MISSING (Cubiing)${colors.reset} — exists in NextjsDeploy`);
        return "missing-cubiing";
    }
    if (!ndExists) {
        header(entry);
        console.log(`${colors.red}MISSING (NextjsDeploy)${colors.reset} — exists in Cubiing`);
        return "missing-nd";
    }

    // Directory with exclusions: diff each non-excluded file individually.
    const isDir = statSync(cubiing).isDirectory();
    if (isDir && entry.exclude?.length) {
        const cubiingFiles = listFilesRecursive(cubiing).map((f) => relative(cubiing, f));
        const ndFiles = existsSync(nd) ? listFilesRecursive(nd).map((f) => relative(nd, f)) : [];
        const allRel = Array.from(new Set([...cubiingFiles, ...ndFiles]))
            .filter((f) => !isExcluded(f, entry.exclude!))
            .sort();

        let printedHeader = false;
        let hasDiff = false;
        for (const rel of allRel) {
            const left = join(cubiing, rel);
            const right = join(nd, rel);
            const { code, output } = gitDiff(left, right);
            if (code === 0) continue;
            if (code >= 2) {
                if (!printedHeader) {
                    header(entry);
                    printedHeader = true;
                }
                console.log(`${colors.red}git error on ${rel}:${colors.reset}\n${output}`);
                hasDiff = true;
                continue;
            }
            if (!printedHeader) {
                header(entry);
                printedHeader = true;
            }
            process.stdout.write(output);
            hasDiff = true;
        }

        if (!hasDiff) return "identical";
        return "diff";
    }

    // Plain file or directory without exclusions — single git diff call.
    const { code, output } = gitDiff(cubiing, nd);
    if (code === 0) return "identical";
    if (code >= 2) {
        header(entry);
        console.log(`${colors.red}git error:${colors.reset}\n${output}`);
        return "diff";
    }
    header(entry);
    process.stdout.write(output);
    return "diff";
}

function main() {
    if (!existsSync(ND_ROOT)) {
        console.error(
            `${colors.red}NextjsDeploy submodule not found at ${ND_ROOT}.${colors.reset}\n` +
                `Run: git submodule update --init --recursive`,
        );
        process.exit(1);
    }

    const filter = process.argv[2];
    const entries = filter ? SYNC_ENTRIES.filter((e) => e.path.includes(filter)) : SYNC_ENTRIES;

    if (filter && entries.length === 0) {
        console.log(`${colors.yellow}0 entries match filter "${filter}".${colors.reset}`);
        return;
    }

    console.log(
        `${colors.bold}Comparing ${entries.length} entr${entries.length === 1 ? "y" : "ies"} ` +
            `(Cubiing ↔ NextjsDeploy)${filter ? ` — filter: "${filter}"` : ""}${colors.reset}`,
    );

    const results: Result[] = entries.map((entry) => ({ entry, status: diffEntry(entry) }));

    const counts = {
        identical: results.filter((r) => r.status === "identical").length,
        diff: results.filter((r) => r.status === "diff").length,
        missing: results.filter((r) => r.status.startsWith("missing")).length,
    };

    console.log(`\n${colors.cyan}${SEPARATOR}${colors.reset}`);
    console.log(
        `${colors.bold}Summary:${colors.reset} ` +
            `${colors.green}${counts.identical} identical${colors.reset} · ` +
            `${colors.yellow}${counts.diff} with diffs${colors.reset} · ` +
            `${colors.red}${counts.missing} missing${colors.reset}`,
    );

    const identicalPaths = results.filter((r) => r.status === "identical").map((r) => r.entry.path);
    if (identicalPaths.length > 0) {
        console.log(`\n${colors.gray}Identical entries:${colors.reset}`);
        for (const p of identicalPaths) console.log(`${colors.gray}  ✓ ${p}${colors.reset}`);
    }
}

main();
