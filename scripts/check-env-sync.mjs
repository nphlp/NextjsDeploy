/**
 * Structural sync check between env/env.config.mjs and env/env.config.example.mjs
 *
 * Normalizes both files line-by-line, replacing `KEY: value` pairs with `KEY: <VALUE>`
 * so expected value differences disappear, then runs `diff -u` on the normalized
 * outputs. Any remaining diff is a real structural drift (missing key, moved
 * comment, extra line). Purely informative — never fails, never exits non-zero.
 *
 * Usage: called from setup-env.mjs, or standalone: node scripts/check-env-sync.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONFIG_PATH = resolve(ROOT, "env/env.config.mjs");
const EXAMPLE_PATH = resolve(ROOT, "env/env.config.example.mjs");

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

const KEY_PLACEHOLDER = "<VALUE>";

function isKeyBoundary(prefix) {
    const last = prefix[prefix.length - 1];
    return !last || /[\s{,[(]/.test(last);
}

function findStringEnd(line, start) {
    const quote = line[start];
    let i = start + 1;
    while (i < line.length) {
        const ch = line[i];
        if (ch === "\\" && i + 1 < line.length) {
            i += 2;
            continue;
        }
        if (ch === quote) return i + 1;
        i++;
    }
    return i;
}

function findValueEnd(line, start) {
    let i = start;
    let depth = 0;
    while (i < line.length) {
        const ch = line[i];
        if (ch === '"' || ch === "'") {
            i = findStringEnd(line, i);
            continue;
        }
        if (ch === "/" && line[i + 1] === "/") break;
        if (ch === "{" || ch === "[" || ch === "(") {
            depth++;
            i++;
            continue;
        }
        if (ch === "}" || ch === "]" || ch === ")") {
            if (depth === 0) break;
            depth--;
            i++;
            continue;
        }
        if (ch === "," && depth === 0) break;
        i++;
    }
    return i;
}

function normalizeLine(line) {
    // Pure blank line
    if (/^\s*$/.test(line)) return line;
    // Pure comment line — kept verbatim (comments must match exactly)
    if (/^\s*\/\//.test(line)) return line;

    let result = "";
    let i = 0;
    while (i < line.length) {
        const rest = line.slice(i);

        // Inline comment from here to EOL — copy verbatim
        if (rest.startsWith("//")) {
            result += rest;
            break;
        }

        // Quoted env key: "KEY": or "#KEY":
        const quoted = rest.match(/^("#?[A-Z][A-Z0-9_]*"\s*:\s*)/);
        if (quoted && isKeyBoundary(result)) {
            result += quoted[1];
            i += quoted[1].length;
            const end = findValueEnd(line, i);
            result += KEY_PLACEHOLDER;
            i = end;
            continue;
        }

        // Bare env key: KEY:
        const bare = rest.match(/^([A-Z][A-Z0-9_]*\s*:\s*)/);
        if (bare && isKeyBoundary(result)) {
            result += bare[1];
            i += bare[1].length;
            const end = findValueEnd(line, i);
            result += KEY_PLACEHOLDER;
            i = end;
            continue;
        }

        // String literal — copy as-is (not a key context)
        const ch = line[i];
        if (ch === '"' || ch === "'") {
            const end = findStringEnd(line, i);
            result += line.slice(i, end);
            i = end;
            continue;
        }

        result += ch;
        i++;
    }

    return result;
}

function normalize(content) {
    return content.split("\n").map(normalizeLine).join("\n");
}

function colorizeDiff(diffOutput) {
    return diffOutput
        .split("\n")
        .map((line) => {
            if (line.startsWith("+++") || line.startsWith("---")) return dim(line);
            if (line.startsWith("@@")) return cyan(line);
            if (line.startsWith("+")) return green(line);
            if (line.startsWith("-")) return red(line);
            return line;
        })
        .join("\n");
}

export async function checkSync() {
    if (!existsSync(CONFIG_PATH) || !existsSync(EXAMPLE_PATH)) return;

    const realRaw = readFileSync(CONFIG_PATH, "utf-8");
    const exampleRaw = readFileSync(EXAMPLE_PATH, "utf-8");

    const realLines = realRaw.split("\n").length;
    const exampleLines = exampleRaw.split("\n").length;

    const realNorm = normalize(realRaw);
    const exampleNorm = normalize(exampleRaw);

    if (realNorm === exampleNorm) {
        console.log(green("✅ env.config.mjs is in sync with env.config.example.mjs"));
        return;
    }

    const tmpExample = join(tmpdir(), "cubiing-env-example.normalized.mjs");
    const tmpReal = join(tmpdir(), "cubiing-env-real.normalized.mjs");
    writeFileSync(tmpExample, exampleNorm);
    writeFileSync(tmpReal, realNorm);

    const result = spawnSync(
        "diff",
        ["-u", "--label", "env.config.example.mjs", "--label", "env.config.mjs", tmpExample, tmpReal],
        { encoding: "utf-8" },
    );

    try {
        unlinkSync(tmpExample);
        unlinkSync(tmpReal);
    } catch {
        // ignore cleanup errors
    }

    console.log(yellow("\n⚠️  env.config.mjs is out of sync with env.config.example.mjs"));
    if (realLines !== exampleLines) {
        console.log(dim(`   (example: ${exampleLines} lines, real: ${realLines} lines)`));
    }
    console.log(dim("   Only key values should differ. Keys, comments and structure must match.\n"));

    const diffOutput = result.stdout || "";
    if (diffOutput.trim()) {
        console.log(colorizeDiff(diffOutput));
    } else if (result.stderr) {
        console.log(red(result.stderr));
    }
}

// Allow running standalone
if (import.meta.url === `file://${process.argv[1]}`) {
    await checkSync();
}
